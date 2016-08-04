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
	this.changed = new TranslationSet(project);
	this.newres = new TranslationSet(project);
	
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
	//console.log("AndroidResourceFileType handles " + pathName + "?");
	
	if (!extensionRE.test(pathName)) {
		//console.log("No");
		return false;
	}

	var pathElements = pathName.split('/');
	if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
		//console.log("No");
		return false;
	}
	
	var dir = pathElements[pathElements.length-2];
	
	if (!dirRE.test(dir)) {
		//console.log("No");
		return false;
	}
	
	//console.log("Yes");
	return true;
};

AndroidResourceFileType.prototype.getResources = function() {
	return this.project.resources;
};

AndroidResourceFileType.prototype.generatePseudo = function() {
	var resources = this.translationSet.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX");
	
	resources.forEach(function(resource) {
		if (resource.getId() !== "app_id" && resource.getId() !== "live_sdk_client_id") {
			resource.generatePseudo(locale.getSpec(), this.pseudoBundle);
		} else {
			resource.addTranslation(locale.getSpec(), resource.getSource());
		}
	}.bind(this));
};

AndroidResourceFileType.prototype.write = function() {
	var translations = {};

	// distribute all of the translations to their own resource file
	var all = this.translationSet.getAll();
	all.forEach(function(resource) {
		var locales = resource.getTranslationLocales();
		// console.log("Translating to " + JSON.stringify(locales));
		locales.forEach(function(locale) {
			var t = resource.getTranslatedResource(locale);
			if (!translations[locale]) {
				translations[locale] = new AndroidResourceFile({
					project: this.project, 
					locale: locale,
					type: this
				});
				//console.log("New translated resource file: ");
				//console.dir(translations[locale]);
			}
			translations[locale].addResource(t);
		}.bind(this));
	}.bind(this));
	
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
	this.translationSet = new TranslationSet(this.project);
	
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
