/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");

/**
 * @class A class that models a resource that handles translations of
 * plurals.
 * 
 * Hashes of strings are used in Android apps to specify translations
 * of the various classes of plurals.<p>
 * 
 * The properties in the props parameter may be any of the following:
 * 
 * <ul>
 * <li><i>id</i> {String} - The unique id of the array resource
 * <li><i>locale</i> {String} - The locale specifier that gives the 
 * languages that the array's strings are written in
 * <li><i>pathName</i> {String} - The path to the file that contains
 * this array resource
 * <li><i>context</i> {String} - The context for this resource,
 * such as "landscape mode", or "7200dp", which differentiates it
 * from the base resource that has no special context. The default
 * if this property is not specified is undefined, meaning no
 * context.
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
 * @param {Object} props Any of the properties given above
 */
var ResourcePlural = function(props) {
	if (props) {
		this.id = props.id;
		this.strings = props.strings;
		this.locale = props.locale;
		this.pathName = props.pathName;
        this.context = props.context;
	}
	
	this.translations = {};
	this.locales = new Set();
};

/**
 * Return the unique id of this plurals resource.
 * 
 * @returns {String} the unique id of this array
 */
ResourcePlural.prototype.getId = function() {
	return this.id;
};

/**
 * Return the context of this resource, or undefined if there
 * is no context.
 * @returns {String|undefined} the context of this resource, or undefined if there
 * is no context.
 */
ResourcePlural.prototype.getContext = function() {
    return this.context;
};

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
 * Add a hash of translations for the source plurals
 * to the given locale. The hash should have the same
 * properties as the source hash.
 * 
 * @param {String} locale the locale of these translations
 * @param {Object} the hash of translations
 */
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
 */
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
 */
ResourcePlural.prototype.getTranslatedResource = function(locale) {
	return this.translations[locale] && new ResourcePlural({
		id: this.id,
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
 */
ResourcePlural.prototype.getTranslationLocales = function() {
	return this.locales.asArray();
};

/**
 * Merge the other plural resource with the current one by
 * adding its translations to the current on.
 * 
 * @param {ResourcePlural} the other resource to merge into 
 * the current one
 */
ResourcePlural.prototype.merge = function(other) {
	if (!other) return;
	
	if (other.id !== this.id) {
        throw "Mismatched id. Cannot merge";
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

/**
 * Generate the pseudo translations for the given locale and add
 * them to the current resource.
 * 
 * @param {String} locale the locale to generate the pseudotranslations in to
 * @param {ResBundle} the ilib resource bundle that can generate pseudotranslations
 */
ResourcePlural.prototype.generatePseudo = function(locale, pseudoBundle) {
	if (locale && pseudoBundle) {
		var translations = {};
		
		for (var quantity in this.strings) {
			var source = this.strings[quantity];
			var pseudo = pseudoBundle.getStringJS(source);
			translations[quantity] = pseudo;
			// console.log("Plural pseudo translation produced: " + quantity + ": " + source + "=" + pseudo);
		}
		
		this.addTranslation(locale, translations);
	}
};

module.exports = ResourcePlural;