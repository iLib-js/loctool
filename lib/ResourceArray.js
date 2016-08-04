/*
 * ResourceArray.js - represents an array of strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");

var ResourceArray = function(props) {
	this.id = props.id;
	this.locale = props.locale;
	this.array = [];
	
	if (props.array.length) {
		this.array = props.array.forEach(function(item) {
			this.array.push(new ResourceString({
				id: item,
				source: item
			}));
		}.bind(this));
	}
	
	this.locales = new Set();
};

ResourceArray.prototype.getId = function() {
	return this.id;
};

ResourceArray.prototype.getArray = function() {
	return this.array;
};

ResourceArray.prototype.get = function(i) {
	return this.array[i];
};

ResourceArray.prototype.addTranslation = function(i, locale, translation) {
	this.array[i].addTranslation(locale, translation);
	this.locales.add(locale);
};

ResourceArray.prototype.getTranslation = function(i, locale) {
	return this.array[i].getTranslation(locale);
};

ResourceArray.prototype.getTranslatedResource = function(locale) {
	var array = [];
	this.array.forEach(function(res) {
		array.push(res.getTranslation(locale));
	});
	
	return new ResourceArray({
		id: this.id,
		array: array,
		locale: locale
	});
};

ResourceArray.prototype.getTranslationLocales = function(locale) {
	return this.locales.asArray();
};

ResourceArray.prototype.size = function() {
	return this.array.length;
};

ResourceArray.prototype.merge = function(other) {
	for (var i = 0; i < other.array.length; i++) {
		this.array[i].addTranslation(other.locale, other.array[i]);
	}
	this.locales.add(other.locale);
};

ResourceArray.prototype.generatePseudo = function(locale, pseudoBundle) {
	for (var i = 0; i < this.array.length; i++) {
		var source = this.array[i].getSource();
		var pseudo = pseudoBundle.getStringJS(source);
		this.array[i].addTranslation(locale, pseudo);
		console.log("Array pseudo translation produced: " + source + "=" + pseudo);
	}
	this.locales.add(locale);
};

module.exports = ResourceArray;