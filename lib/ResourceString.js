/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");

/**
 * @class A class to model a resource string. 
 * 
 * This models a string in a UI. The string has a unique id that
 * may be calculated based on the source string or it may be
 * specified explicitly by the caller.<p>
 * 
 * The props parameter may contains any of the following
 * properties:
 * 
 * <ul>
 * <li><i>id</i> {string} - a unique id that identifies this string
 * <li><i>source</i> {string} - a source string written in the source language
 * (usually English)
 * <li><i>pathName</i> {string} - the path relative to the root of the project
 * of the file that contains this resource string
 * <li><i>locale</i> {string} - the locale specifier that identifies the
 * locale of the source string. Usually, this is English for the US (en-US).
 * </ul>
 * 
 * @constructor
 * @params {Object|undefined} props Properties that control the construction
 * of this resource string instance
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
	this.translations[locale] = translation;
	this.locales.add(locale);
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
 * Merge the translations from the given other set into the current set. If 
 * a translation in the other string already exists in the current set, it 
 * will overrider the current translation.. Only when the other set contains items
 * that did not exist in the new set are items added to the current set..
 * 
 * @param {ResourceString} other another resource string to merge with
 * the current one
 */
ResourceString.prototype.merge = function(other) {
	this.addTranslation(other.locale, other.source)
	this.locales.add(other.locale);
};

/***
 * Generate the pseudo translation for this string and stick it into
 * the translations for the psuedo locale.
 * 
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} the ilib resource bundle that can translate 
 * strings to the pseudo locale
 */
ResourceString.prototype.generatePseudo = function(locale, pseudoBundle) {
	var pseudo = pseudoBundle.getStringJS(this.source);
	this.addTranslation(locale, pseudo);
	// console.log("Pseudo translation produced: " + this.id + "=" + pseudo);
};

module.exports = ResourceString;
    