/*
 * AndroidResourceFileType.js - manages a collection of android resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var AndroidResourceFile = require("./AndroidResourceFile.js");
var TranslationSet = require("./TranslationSet.js");

var AndroidResourceFileType = function(project) {
	this.project = project;
	this.changed = new AndroidResourceFile();
	this.newres = new AndroidResourceFile();
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
		locale: "zxx-XX",
		type: "xml"
	});
	
	this.resourceFiles = [];
};

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^value");

AndroidResourceFileType.prototype.handles = function(pathName) {
	if (!extensionRE.test(pathName)) {
		return false;
	}

	var pathElements = pathName.split('/');
	if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
		return false;
	}
	
	var dir = pathElements[pathElements.length-2];
	
	if (!dirRE.test(dir)) {
		return false;
	}
	
	return true;
};

AndroidResourceFileType.prototype.getResources = function() {
	return this.project.resources;
};

AndroidResourceFileType.prototype.generatePseudo = function() {
	var resources = this.translationSet.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX");
	
	resources.forEach(function(resource) {
		if (string.getId() !== "app_id" && string.getId() !== "live_sdk_client_id") {
			resource.generatePseudo(locale, this.pseudoBundle);
		} else {
			resource.addTranslation(locale, resource.getSource());
		}
	}.bind(this));
};

AndroidResourceFileType.prototype.write = function() {
	var translations = {};

	// distribute all of the translations to their own resource file
	var all = this.translationSet.getAll();
	all.forEach(function(resource) {
		var locales = resource.getTranslationLocales();
		locales.forEach(function(locale) {
			var t = resource.getTranslatedResource(locale);
			if (!translations[locale]) {
				translations[locale] = new AndroidResourceFile({
					project: this.project, 
					locale: locale,
					type: this
				});
			}
			translations[locale].addResource(t);
		});
	});
	
	// then write out each file	
	for (var locale in translations) {
		var file = translations[locale];
		file.write();
	}
};

AndroidResourceFileType.prototype.newFile = function(pathName) {
	var file = new AndroidResourceFile({
		project: this.project, 
		pathName: pathName,
		type: this
	});
	
	this.resourceFiles.push(file);
	return file;
};

AndroidResourceFileType.prototype.collect = function(file) {
	this.translationSet = new TranslationSet();
	
	// add the source locale first
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() === this.project.sourceLocale) {
			this.translationSet.addAll(this.resourceFiles[i].getAll());
		}
	}
	
	// before the other locales
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() !== this.project.sourceLocale) {
			this.translationSet.addAll(this.resourceFiles[i].getAll());
		}
	}
};

module.exports = AndroidResourceFileType;
