/*
 * ResourceArray.js - represents an array of strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");

var Resource = require("./Resource.js");
var utils = require("./utils.js");

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
    Resource.call(this, props);
    
	this.array = [];
	this.subtype = "string-array";
    
    if (props) {
    	if (props.array && props.array.length) {
    		this.array = props.array.map(function(item) {
    			 return new String(item).toString();
    		});
    	}
    	if (props.subtype) {
    		this.subtype = props.subtype;
    	}
    }
    
    this.locale = this.locale || "en-US";
    this.datatype = this.datatype || "x-android-resource";
    this.resType = ResourceArray.resClass;
};

ResourceArray.prototype = new Resource();
ResourceArray.prototype.parent = Resource;
ResourceArray.prototype.constructor = ResourceArray;

/**
 * The class of this kind of array resource.
 * 
 * @static
 * @const
 */
ResourceArray.resClass = "array";

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
	if (typeof(i) === "undefined" || i < 0 || typeof(str) === "undefined") {
		return;
	}
	
	if (!this.array) {
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
    if (!locale || !pseudoBundle || this.dnt) return;
    
    if (this.subtype === "array") {
    	// cannot pseudo-translate arrays, only string arrays
    	return;
    }
    
	logger.trace("generatePseudo: generating pseudo to locale " + locale);
	var array = this.array.map(function(str) {
		return utils.isAndroidResource(str) ? str : pseudoBundle.getStringJS(str);
	});
	
	logger.trace("generatePseudo: mapped array is " + JSON.stringify(array));
	var r = this.clone();
	r.locale = locale;
	r.array = array;
	r.origin = "target";
	
	return r;
};

/**
 * @private
 * @param connection
 * @param index
 * @param cb
 */
ResourceArray.prototype._writeStrings = function(connection, index, cb) {
	if (!this.array || index >= this.array.length) {
		logger.trace("_writeStrings: done writing array");		
		cb(null, {affectedRows: this.array.length});
	} else {
		var string = this.array[index];
		
		logger.trace("_writeStrings: writing array[" + index + "] = " + string);
		try {
			connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, ordinal, comment) " +
					"VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType, :ordinal, :comment)", {
				reskey: this.reskey,
				text: string,
				pathName: this.pathName || null,
				locale: this.locale || null,
				context: this.context || null,
				autoKey: typeof(this.autoKey) === "boolean" ? this.autoKey : false,
				project: this.project || null,
				resType: "array",
				ordinal: index,
				comment: this.comment || null
			}, function(err, id) {
				logger.trace("_writeStrings: err is " + err);
				
				this._writeStrings(connection, index+1, cb);
			}.bind(this));
		} catch (e) {
			logger.warn("Caught exception");
			logger.warn(e);
			cb("Error writing resource " + this.key);
		}
	}
};

ResourceArray.prototype.getInsertValues = function() {
	var lines = [];
	for (var i = 0; i < this.array.length; i++) {
		lines.push([
			this.reskey,
			this.array[i],
			this.pathName, 
			this.locale,
			this.context,
			this.autoKey,
			this.project,
			this.resType,
			this.comment,
			i,
			null,
			"new"
		].map(function(item) {
			return this.escapeText(item);
		}.bind(this)));
	}
	
	return lines;
};

/**
 * Save the current array resource to the database using the given connection.
 * 
 * @param {Connection} connection connection to the database
 * @param {Function} cb Callback function to call when serialization is done
 */
ResourceArray.prototype.serialize = function(connection, cb) {
	logger.trace("serialize: serializing this resource");		
	
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

/**
 * Return true if the other resources contains the same resources as
 * the current one. The pathName, state, and comment fields are 
 * ignored as minor variations.
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceArray.prototype.equals = function(other) {
	if (!Resource.prototype.equals.call(this, other)) {
		logger.trace("parent returned false");
		return false;
	}
	
	if (this.array || other.array) {
		if (this.array && other.array) {
			if (this.array.length !== other.array.length) {
				logger.trace("different length arrays");
				return false;
			}
			
			for (var i = 0; i < this.array.length; i++) {
				if (this.array[i] !== other.array[i]) {
					logger.trace("differed in content '" + this.array[i] + "' !== '" + other.array[i] + "'");
					return false;
				}
			}
		} else {
			logger.trace("one has array, the other doesn't");
			return false;
		}
	}
	
	logger.trace("Both the same");
	return true;
};

/**
 * Return true if the other resource contains the exact same resource as
 * the current one. All fields must match.
 * 
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceArray.prototype.equals = function(other) {
	if (!other || !this.same(other) || other.array.length !== this.array.length) return false;
	
	for (var i = 0; i < this.array.length; i++) {
		if (this.array[i] !== other.array[i]) return false;
	}
	
	return true;
};

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 * 
 * @static
 * @return {String} a hash key
 */
ResourceArray.hashKey = function(project, context, locale, reskey) {
	var key = ["ra", project, context, locale, reskey].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 * 
 *  @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.hashKey = function() {
	return ResourceArray.hashKey(this.project, this.context, this.locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 * 
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.hashKeyForTranslation = function(locale) {
	return ResourceArray.hashKey(this.project, this.context, locale, this.reskey);
};

module.exports = ResourceArray;