/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");

var ResourceString = function(props) {
	this.id = props.id;
	this.source = props.source;
	this.pathName = props.pathName;
	this.locale = props.locale;
	
	this.translations = {};
	this.locales = new Set();
};

ResourceString.prototype.getId = function() {
	return this.id;
};

ResourceString.prototype.getSource = function() {
	return this.source;
};

ResourceString.prototype.addTranslation = function(locale, translation) {
	this.translations[locale] = translation;
	this.locales.add(locale);
};

ResourceString.prototype.getTranslation = function(locale) {
	return this.translations[locale];
};

ResourceString.prototype.getTranslatedResource = function(locale) {
	return new ResourceString({
		id: this.id,
		source: this.translations[locale],
		locale: locale,
		pathName: this.pathName
	});
};

ResourceString.prototype.getTranslationLocales = function(locale) {
	return this.locales.asArray();
};

ResourceString.prototype.merge = function(other) {
	this.addTranslation(other.locale, other.source)
	this.locales.add(other.locale);
};

ResourceString.prototype.generatePseudo = function(locale, pseudoBundle) {
	var pseudo = pseudoBundle.getStringJS(this.source);
	this.addTranslation(locale, pseudo);
	// console.log("Pseudo translation produced: " + this.id + "=" + pseudo);
};

module.exports = ResourceString;
