/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");

var Resource = require("./Resource.js");
var utils = require("./utils.js");

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
	
	this.strings = {};
	
	// deep copy this so that the props can have a differen set of 
	// plural forms than this instance
	if (props && props.strings) {
		for (var p in props.strings) {
			this.strings[p] = props.strings[p];
		}
	}

    this.locale = this.locale || "en-US";
    this.datatype = this.datatype || "x-android-resource";
	this.resType = ResourcePlural.resClass;
}; 

ResourcePlural.prototype = new Resource();
ResourcePlural.prototype.parent = Resource;
ResourcePlural.prototype.constructor = ResourcePlural;

/**
 * The class of this kind of string plural.
 *
 * @static
 * @const
 */
ResourcePlural.resClass = "plural";

/**
 * Acceptable values for pluralClass
 *
 * @static
 * @const
 */
 ResourcePlural.validPluralClasses = ['zero', 'one', 'two', 'few', 'many', 'other'];

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
	logger.trace("Adding string '" + str + "' with class " + pluralClass);
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
	if (!locale || !pseudoBundle || this.dnt) return;

	var pseudoStrings = {};

	logger.trace("generatePseudo: generating pseudo to locale " + locale);
	for (var pluralClass in this.strings) {
		pseudoStrings[pluralClass] = utils.isAndroidResource(this.strings[pluralClass]) ? this.strings[pluralClass] : pseudoBundle.getStringJS(this.strings[pluralClass]);
	}

	logger.trace("generatePseudo: mapped plurals is " + JSON.stringify(pseudoStrings));
	var r = this.clone();
	r.locale = locale;
	r.strings = pseudoStrings;
	r.origin = "target";

	return r;
};

ResourcePlural.prototype._writeClass = function(connection, classes, cb) {
	if (classes.length === 0) {
		cb(null, {affectedRows: Object.keys(this.strings).length});
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

ResourcePlural.prototype.getInsertValues = function() {
	var lines = [];
	for (var quantity in this.strings) {
		lines.push([
			this.reskey,
			this.strings[quantity],
			this.pathName,
			this.locale,
			this.context,
			this.autoKey,
			this.project,
			this.resType,
			this.comment,
			null,
			quantity,
			"new"
		].map(function(item) {
			return this.escapeText(item);
		}.bind(this)));
	}

	return lines;
};

ResourcePlural.prototype.serialize = function(connection, cb) {
	if (this.strings) {
		this._writeClass(connection, Object.keys(this.strings), cb);
	} else {
		cb(null, {affectedRows: 0});
	}
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

/**
 * Return true if the other resources contains the same resources as
 * the current one. The pathName, state, and comment fields are
 * ignored as minor variations.
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourcePlural.prototype.equals = function(other) {
	if (!Resource.prototype.equals.call(this, other)) return false;

	if (this.strings || other.strings) {
		if (this.strings && other.strings) {
			for (var p in this.strings) {
				if (this.strings[p] !== other.strings[p]) {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	return true;
};

/**
 * Return true if the other resource contains the exact same resource as
 * the current one. All fields must match.
 *
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourcePlural.prototype.equals = function(other) {
	if (!other || !this.same(other)) return false;

	for (var quantity in this.strings) {
		if (this.strings[quantity] !== other.strings[quantity]) return false;
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
ResourcePlural.hashKey = function(project, context, locale, reskey) {
	var key = ["rp", project, context, locale, reskey].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.hashKey = function() {
	return ResourcePlural.hashKey(this.project, this.context, this.locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.hashKeyForTranslation = function(locale) {
	return ResourcePlural.hashKey(this.project, this.context, locale, this.reskey);
};

module.exports = ResourcePlural;