/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");

/**
 * @class Represents a string resource from a resource file or
 * extracted from the code. The props may contain any
 * of the following properties:
 * 
 * <ul>
 * <li>id {String} - the unique id of this string, which should include the context
 * of the string
 * <li>source {String} - the source string associated with this id
 * <li>pathName {String} - pathName to the file where the string was extracted from
 * <li>locale {String} - the locale of the source string.
 * </ul>
 * 
 * @constructor
 * @param {Object} props properties of the string, as defined above
 */
var ResourceString = function(props) {
	if (props) {
		this.id = props.id;
		this.source = props.source;
		this.pathName = props.pathName;
		this.locale = props.locale;
	}
	
	this.translations = {};
	this.locales = new Set();
};

/**
 * Return the unique id of this resource string.
 * 
 * @returns {String} the unique id of this string
 */
ResourceString.prototype.getId = function() {
	return this.id;
};

/**
 * Return the source string written in the source 
 * locale of this resource string.
 * 
 * @returns {String} the source string
 */
ResourceString.prototype.getSource = function() {
	return this.source;
};

/**
 * Add a translation of the source string to the
 * given target locale.
 * 
 * @param {String} locale the locale specifier for the
 * target locale of this translation
 * @param {String} translation the translation of the source
 * string to the target locale.
 */
ResourceString.prototype.addTranslation = function(locale, translation) {
	if (locale) {
		this.translations[locale] = translation;
		this.locales.add(locale);
	}
};

/**
 * Get the translation of the source string to the given
 * target locale. If the translation does not exist, 
 * this method returns undefined.
 * 
 * @param {String} locale The locale specifier for the translation being sought
 * @returns {String|undefined} the translation of the source
 * string to the target locale, or undefined if there is no
 * translation yet
 */
ResourceString.prototype.getTranslation = function(locale) {
	return this.translations[locale];
};

/**
 * Return the translation of the source string to the given
 * locale as an independent resource string. The source for
 * the returned resource string is the translation.
 * 
 * @param {string} locale The locale specifier for the locale
 * of the translation being sought
 * @returns {ResourceString} A resource string object containing
 * the translation of the current string's source
 */
ResourceString.prototype.getTranslatedResource = function(locale) {
	if (!this.translations[locale]) return undefined;
	
	return new ResourceString({
		id: this.id,
		source: this.translations[locale],
		locale: locale,
		pathName: this.pathName
	});
};

/**
 * Return an array of locale specifiers for all of the translations
 * of the current source string.
 * 
 * @returns {Array.<string>|undefined} an array of locale specifiers
 * that given all the locales that this source string is translated to
 * or the empty array if there are no translations for this string
 */
ResourceString.prototype.getTranslationLocales = function() {
	return this.locales.asArray();
};

/**
 * Merge the other resource string into the current one. If the other
 * resource string has the same id and the same locale, the source 
 * strings should be compared. If
 * the sources do not match, then an exception will be thrown to 
 * indicate that there was an error when the strings were resourcified
 * manually. If the resource string has a different locale, then
 * the source for the other string will be added as a translation
 * of the current string. It is up to the caller to ensure that
 * the current string represents the source locale.
 * 
 * @param {ResourceString} other the other string to merge with the
 * current one
 * @throws exception if the ids do not match, or the ids and locales
 * match, but the source string does not
 */
ResourceString.prototype.merge = function(other) {
	if (!other) return;
	if (other.id !== this.id) {
		throw "Mismatched id. Cannot merge";
	} else {
		if (other.locale === this.locale && other.source !== this.source) {
			throw "Duplicate resources.";
		}
	}
	if (other) {
		this.addTranslation(other.locale, other.source)
		if (other.locale) this.locales.add(other.locale);
	}
};

/***
 * Generate the pseudo translation for this string and stick it into
 * the translations for the pseudo locale.
 * 
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} the ilib resource bundle that can translate 
 * strings to the pseudo locale
 */
ResourceString.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (locale && pseudoBundle) {
    	var pseudo = pseudoBundle.getStringJS(this.source);
    	this.addTranslation(locale, pseudo);
    	// console.log("Pseudo translation produced: " + this.id + "=" + pseudo);
    }
};

module.exports = ResourceString;
    