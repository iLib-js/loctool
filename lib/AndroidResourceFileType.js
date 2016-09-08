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
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var AndroidResourceFileType = function(project) {
	this.project = project;
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
		locale: "zxx-XX",
		type: "xml"
	});
	
	this.resourceFiles = {};
};

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^value");

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
AndroidResourceFileType.prototype.handles = function(pathName) {
	logger.debug("AndroidResourceFileType handles " + pathName + "?");
	
	if (!extensionRE.test(pathName)) {
		logger.debug("No");
		return false;
	}

	var pathElements = pathName.split('/');
	if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
		logger.debug("No");
		return false;
	}
	
	var dir = pathElements[pathElements.length-2];
	
	if (!dirRE.test(dir)) {
		logger.debug("No");
		return false;
	}
	
	logger.debug("Yes");
	return true;
};

/**
 * Get all resources collected so far.
 * 
 * @returns {Array.<Resource>} an array of resources collected so far
 */
AndroidResourceFileType.prototype.getResources = function() {
	return this.project.resources;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
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

/**
 * Write out all resources for this file type. This collates the resources
 * by type and locale into separate resource files, and then writes them
 * out to disk.
 */
AndroidResourceFileType.prototype.write = function() {
	var translations = {};

	// distribute all of the translations to their own resource file
	var all = this.translationSet.getAll();
	all.forEach(function(resource) {
		var locales = resource.getTranslationLocales();
		logger.debug("Translating to " + JSON.stringify(locales));
		locales.forEach(function(locale) {
			var t = resource.getTranslatedResource(locale);
			if (t) {
				var context = t.getContext() || "default";
				if (!translations[locale]) translations[locale] = {}
				if (!translations[locale][context]) {
					translations[locale][context] = new AndroidResourceFile({
						project: this.project, 
						locale: locale,
						type: this,
						context: t.getContext()
					});
					logger.trace("New translated resource file: ");
					logger.trace(translations[locale]);
				}
				translations[locale][context].addResource(t);
			}
		}.bind(this));
	}.bind(this));
	
	// then write out each file	
	for (var locale in translations) {
		var contexts = translations[locale];
		for (var context in contexts) {
			var file = translations[locale][context];
			file.write();
		}		
	}
};

AndroidResourceFileType.prototype.name = function() {
    return "Android Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 * 
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
AndroidResourceFileType.prototype.newFile = function(pathName) {
	var file = new AndroidResourceFile({
		project: this.project, 
		pathName: pathName,
		type: this
	});
	
	var locale = file.getLocale().getSpec() || "default"; 
	var context = file.getContext() || "default";
	
	if (!this.resourceFiles[locale]) {
		this.resourceFiles[locale] = {};
	}
	
	this.resourceFiles[locale][context] = file;
	return file;
};

/**
 * Collect all the resources from each of the resource files into one
 * translation set.
 */
AndroidResourceFileType.prototype.collect = function() {
	this.translationSet = new TranslationSet(this.project.sourceLocale);
	
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
