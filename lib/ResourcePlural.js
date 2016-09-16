/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");
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
	
	this.strings = {};
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
	return this.strings[pluralClass];
};

/**
 * Return the number of source classes of plurals in
 * this resource.
 * 
 * @returns {number} the number of source classes
 */
ResourcePlural.prototype.getClasses = function() {
	return Object.keys(this.strings);
};

/**
 * Add a string with the given plural class to this plural 
 * resource.
 * 
 * @param {String} pluralClass the CLDR class of this string
 * @param {String} str the string to add for the class
 */
ResourcePlural.prototype.addString = function(pluralClass, str) {
	if (this.strings) {
		this.strings = {};
	}
	this.strings[pluralClass] = str;
};

/**
 * Add a hash of translations for the source plurals
 * to the given locale. The hash should have the same
 * properties as the source hash.
 * 
 * @param {String} locale the locale of these translations
 * @param {Object} the hash of translations
 *
ResourcePlural.prototype.addTranslation = function(locale, strings) {
	if (locale) {
		this.translations[locale] = strings;
		this.locales.add(locale);
	}
};

/**
 * Return the hash of translations for the given locale.
 * 
 * @param {String} locale the locale for which translations are being sought
 * @returns {Object|undefined} the hash of translations to the given
 * locale, or undefined
 *
ResourcePlural.prototype.getTranslations = function(locale) {
	return this.translations[locale];
};

/**
 * Return the translation for the given locale as a whole resource
 * instead of as a hash. The new resource has the translation as
 * the source.
 * 
 * @param {String} locale The locale for the translation being sought
 * @returns {ResourcePlural} a new plural resource with the translation
 * to the given locale as the source
 *
ResourcePlural.prototype.getTranslatedResource = function(locale) {
	return this.translations[locale] && new ResourcePlural({
		key: this.key,
		strings: this.translations[locale],
		locale: locale,
		pathName: this.pathName,
		context: this.context
	});
};

/**
 * Get the list of locales that this resource has translations for.
 * 
 * @returns {Array.<String>} an array of locales that this resource
 * has translations for
 *
ResourcePlural.prototype.getTranslationLocales = function() {
	return this.locales.asArray();
};

/**
 * Merge the other plural resource with the current one by
 * adding its translations to the current on.
 * 
 * @param {ResourcePlural} the other resource to merge into 
 * the current one
 *
ResourcePlural.prototype.merge = function(other) {
	if (!other) return;
	
	if (other.key !== this.key) {
        throw "Mismatched key. Cannot merge";
    } else if (other.context !== this.context) {
        throw "Mismatched context. Cannot merge";
    } else if (other.locale === this.locale) {
        for (var i in this.strings) {
            if (this.strings[i] !== other.strings[i]) {
            	throw "Duplicate resources.";
            }
        }
        // same, so don't do anything
        return;
    }
	if (!(other instanceof ResourcePlural)) {
		console.log("Error: attempt to merge something else into a plural resource.");
        throw "Attempt to merge something else into a plural resource.";
	}
	
	this.addTranslation(other.locale, other.strings)
	this.locales.add(other.locale);
};
*/

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
	
	logger.trace("generatePseudo: mapped array is " + JSON.stringify(array));
	return new ResourceArray({
		project: this.project,
		context: this.context,
		key: this.key,
		strings: pseudoStrings,
		locale: locale,
		pathName: this.pathName,
		context: this.context,
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

module.exports = ResourcePlural;