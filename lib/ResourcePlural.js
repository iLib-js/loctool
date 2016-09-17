/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var Resource = require("./Resource.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ResourcePlural");

/**
 * @class A class that models a resource that handles translations of
 * plurals.
 * 
 * Hashes of strings are used in Android apps to specify translations
 * of the various classes of plurals.<p>
 * 
 * The props may contain any
 * of properties from the Resource constructor and additionally,
 * these properties:
 * 
 * <ul>
 * <li><i>strings</i> {Object} A hash of strings that map the classes
 * to translations.
 * </ul>
 * 
 * The properties of the strings hash can be any of the classes supported
 * by the Unicode CLDR data:
 * 
 * <ul>
 * <li>zero
 * <li>one
 * <li>two
 * <li>few
 * <li>many
 * </ul>
 * 
 * @constructor
 * @extends Resource
 * @param {Object} props Any of the properties given above
 */
var ResourcePlural = function(props) {
	this.parent(props);
	
	if (props) {
		this.strings = props.strings;
	}
	
	this.resType = "plural";
	this.translations = {};
	this.locales = new Set();
};

ResourcePlural.prototype = new Resource();
ResourcePlural.prototype.parent = Resource;
ResourcePlural.prototype.constructor = ResourcePlural;

/**
 * Return the source plurals hash of this plurals resource.
 * 
 * @returns {Object} the source hash
 */
ResourcePlural.prototype.getPlurals = function() {
	return this.strings;
};

/**
 * Return the source string of the given plural class.
 * 
 * @returns {String} the source string for the given
 * plural class
 */
ResourcePlural.prototype.get = function(pluralClass) {
	return this.strings && this.strings[pluralClass];
};

/**
 * Return the number of source classes of plurals in
 * this resource.
 * 
 * @returns {number} the number of source classes
 */
ResourcePlural.prototype.getClasses = function() {
	return this.strings && Object.keys(this.strings);
};

/**
 * Add a string with the given plural class to this plural 
 * resource.
 * 
 * @param {String} pluralClass the CLDR class of this string
 * @param {String} str the string to add for the class
 */
ResourcePlural.prototype.addString = function(pluralClass, str) {
	if (!pluralClass || !str) return;
	if (!this.strings) {
		this.strings = {};
	}
	this.strings[pluralClass] = str;
};

/**
 * Return the length of the array of strings in this resource.
 * 
 * @returns {number} the length of the array of strings in this
 * resource
 */
ResourcePlural.prototype.size = function() {
	if (!this.strings) return 0;
	return Object.keys(this.strings).length;
};

/**
 * Generate the pseudo translations for the given locale and add
 * them to the current resource.
 * 
 * @param {String} locale the locale to generate the pseudotranslations in to
 * @param {ResBundle} the ilib resource bundle that can generate pseudotranslations
 */
ResourcePlural.prototype.generatePseudo = function(locale, pseudoBundle) {
	if (!locale || !pseudoBundle) return;

	var pseudoStrings = {};
	
	logger.trace("generatePseudo: generating pseudo to locale " + locale);
	for (var pluralClass in this.strings) {
		pseudoStrings[pluralClass] = pseudoBundle.getStringJS(this.strings[pluralClass]);
	}
	
	logger.trace("generatePseudo: mapped plurals is " + JSON.stringify(pseudoStrings));
	return new ResourcePlural({
		project: this.project,
		context: this.context,
		locale: locale,
		key: this.reskey,
		strings: pseudoStrings,
		pathName: this.pathName,
		autoKey: this.autoKey,
		state: "accepted",
		comment: this.comment
	});
};

ResourcePlural.prototype._writeClass = function(connection, classes, cb) {
	if (classes.length === 0) {
		cb();
	} else {
		var pluralClass = classes[0];
		
		connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, pluralClass) " +
				"VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType, :pluralClass) " +
				"ON DUPLICATE KEY UPDATE text = :text", {
			reskey: this.reskey,
			text: this.strings[pluralClass],
			pathName: this.pathName,
			locale: this.locale,
			context: this.context,
			autoKey: this.autoKey,
			project: this.project, 
			resType: "plural",
			pluralClass: pluralClass
		}, function(err, id) {
			this._writeClass(connection, classes.slice(1), cb);
		}.bind(this));
	}
};

ResourcePlural.prototype.serialize = function(connection, cb) {
	this._writeClass(connection, Object.keys(this.strings), cb);
};

/**
 * Clone this resource and override the properties with the given ones.
 * 
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourcePlural.prototype.clone = function(overrides) {
	var r = new ResourcePlural(this);
	if (overrides) {
		for (var p in overrides) {
			r[p] = overrides[p];
		}
	}
	return r;
};

module.exports = ResourcePlural;