/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");

var ResourcePlural = function(props) {
	this.id = props.id;
	this.strings = props.strings;
	this.locale = props.locale;
	
	this.translations = {};
	this.locales = new Set();
};

ResourcePlural.prototype.getId = function() {
	return this.id;
};

ResourcePlural.prototype.getPlurals = function() {
	return this.strings;
};

ResourcePlural.prototype.get = function(quantity) {
	return this.strings[quantity];
};

ResourcePlural.prototype.getQuantities = function() {
	return Object.keys(this.strings);
};

ResourcePlural.prototype.addTranslation = function(locale, strings) {
	this.translations[locale] = strings;
	this.locales.add(locale);
};

ResourcePlural.prototype.getTranslations = function(locale) {
	return this.translations[locale];
};

ResourcePlural.prototype.getTranslatedResource = function(locale) {
	return new ResourcePlural({
		id: this.id,
		source: this.translations[locale],
		locale: locale
	});
};

ResourcePlural.prototype.getTranslationLocales = function(locale) {
	return this.locales.asArray();
};

ResourcePlural.prototype.merge = function(other) {
	this.addTranslation(other.locale, other.strings)
	this.locales.add(other.locale);
};

ResourcePlural.prototype.generatePseudo = function(locale, pseudoBundle) {
	var translations = {};
	
	for (var quantity in this.strings) {
		var source = this.strings[quantity];
		var pseudo = pseudoBundle.getStringJS(source);
		translations[quantity] = pseudo;
		console.log("Plural pseudo translation produced: " + quantity + ": " + source + "=" + pseudo);
	}
	
	this.addTranslations(locale, translations);
};

module.exports = ResourcePlural;