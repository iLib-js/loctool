/*
 * ResourceArray.js - represents an array of strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");
var Resource = require("./Resource.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ResourceArray");

/**
 * @class A class that models a resource that is an array of strings.
 * 
 * Arrays of strings are used in Android apps, as well as some other
 * places, to specify things like the values for a drop-down box in 
 * a UI.<p>
 * 
 * The properties in the props parameter may be any of the following:
 * 
 * <ul>
 * <li><i>key</i> {String} - The unique key of the array resource
 * <li><i>locale</i> {String} - The locale specifier that gives the 
 * languages that the array's strings are written in
 * <li><i>pathName</i> {String} - The path to the file that contains
 * this array resource
 * <li><i>context</i> {String} - The context for this resource,
 * such as "landscape mode", or "7200dp", which differentiates it
 * from the base resource that has no special context. The default
 * if this property is not specified is undefined, meaning no
 * context.
 * <li><i>array</i> {Array.&lt;String&gt;} An array of strings
 * that are the value of this resource
 * </ul>
 * 
 * @constructor
 * @extends Resource
 * @param {Object} props Any of the properties given above
 */
var ResourceArray = function(props) {
    this.array = [];
    
    if (props) {
    	this.reskey = props.key || props.reskey;
    	this.locale = props.locale;
    	this.pathName = props.pathName;
    	this.context = props.context;
    	this.project = props.project;
    	this.state = props.state;
    	
    	if (props.array && props.array.length) {
    		this.array = props.array.map(function(item) {
    			 return new String(item);
    		});
    	}
    }
    
    this.resType = "array";
};

ResourceArray.prototype = new Resource();
ResourceArray.prototype.parent = Resource;
ResourceArray.prototype.constructor = ResourceArray;

/**
 * Return the array of source strings for this resource.
 * 
 * @returns {Array.<String>} the array of strings that are
 * the value of this resource
 */
ResourceArray.prototype.getArray = function() {
	return this.array;
};

/**
 * Return the source string with the given index into the array.
 * 
 * @param {number} i The index of the string being sought
 * @returns {String|undefined} the value of the string at index i or
 * undefined if i is outside the bounds of the array
 */
ResourceArray.prototype.get = function(i) {
	return (i >= 0 && i < this.array.length) ? this.array[i] : undefined;
};

/**
 * Add a string to the array at index i.
 * 
 * @param {number} i the index at which to add the string
 * @param {String} str the string to add
 */
ResourceArray.prototype.addString = function(i, str) {
	if (this.array) {
		this.array = [];
	}
	this.array[i] = str;
};

/**
 * Return the length of the array of strings in this resource.
 * 
 * @returns {number} the length of the array of strings in this
 * resource
 */
ResourceArray.prototype.size = function() {
	return this.array.length;
};

/**
 * Generate the pseudo translation of each string in this array and return
 * a new resource array instance with the pseudo translations in it.
 * 
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} the ilib resource bundle that can translate 
 * strings to the pseudo locale
 */
ResourceArray.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (!locale || !pseudoBundle) return;
    
	logger.trace("generatePseudo: generating pseudo to locale " + locale);
	var array = this.array.map(function(str) {
		return pseudoBundle.getStringJS(str);
	});
	
	logger.trace("generatePseudo: mapped array is " + JSON.stringify(array));
	return new ResourceArray({
		project: this.project,
		context: this.context,
		locale: locale,
		key: this.key,
		array: array,
		pathName: this.pathName,
		autoKey: this.autoKey,
		state: "accepted",
		comment: this.comment
	});
};

/**
 * @private
 * @param connection
 * @param index
 * @param cb
 */
ResourceArray.prototype._writeStrings = function(connection, index, cb) {
	if (index >= this.strings.length) {
		cb();
	} else {
		var string = this.strings[index];
		
		connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, pluralClass) " +
				"VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType, :pluralClass) " +
				"ON DUPLICATE KEY UPDATE text = :text", {
			reskey: this.key,
			text: string,
			pathName: this.pathName,
			locale: this.locale,
			context: this.context || "",
			autoKey: this.autoKey,
			project: this.project,
			resType: 2,
			ordinal: index,
			comment: this.comment || ""
		}, function(err, id) {
			this._writeStrings(connection, i+1, cb);
		}.bind(this));
	}
};

/**
 * Save the current array resource to the database using the given connection.
 * 
 * @param {Connection} connection connection to the database
 * @param {Function} cb Callback function to call when serialization is done
 */
ResourceArray.prototype.serialize = function(connection, cb) {
	this._writeStrings(connection, 0, cb);
};

/**
 * Clone this resource and override the properties with the given ones.
 * 
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourceArray.prototype.clone = function(overrides) {
	var r = new ResourceArray(this);
	if (overrides) {
		for (var p in overrides) {
			r[p] = overrides[p];
		}
	}
	return r;
};

module.exports = ResourceArray;