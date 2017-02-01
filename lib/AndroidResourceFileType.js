/*
 * AndroidResourceFileType.js - manages a collection of android resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var AndroidResourceFile = require("./AndroidResourceFile.js");
var TranslationSet = require("./TranslationSet.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");

var ContextResourceString = require("./ContextResourceString.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceArray = require("./ResourceArray.js");
var PseudoBritish = require("./PseudoBritish.js");

var logger = log4js.getLogger("loctool.lib.AndroidResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var AndroidResourceFileType = function(project) {
	this.parent.call(this, project);
	
	this.resourceFiles = {};
	
	this.pb = new PseudoBritish({
		type: "java"
	});
};

AndroidResourceFileType.prototype = new FileType();
AndroidResourceFileType.prototype.parent = FileType;
AndroidResourceFileType.prototype.constructor = AndroidResourceFileType;

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^value");
var lang = new RegExp("[a-z][a-z]");
var reg = new RegExp("r[A-Z][A-Z]");

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

	var parts = dir.split("-");
	
	for (var i = parts.length-1; i > 0; i--) {
		if (reg.test(parts[i]) && utils.iso3166[parts[i]]) {
			// already localized dir
			logger.debug("No");
			return false;
		}

		if (lang.test(parts[i]) && utils.iso639[parts[i]]) {
			// already localized dir
			logger.debug("No");
			return false;
		}
	}

	logger.debug("Yes");
	return true;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the 
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
AndroidResourceFileType.prototype.write = function(translations, locales) {
	// distribute all the new resources to their resource files ...
	logger.trace("distributing all new resources to their resource files");
	var res, file, 
		resources = this.extracted.getAll(),
		db = this.project.db,
		translationLocales = locales.filter(function(locale) {
			return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
		}.bind(this));;
	
	logger.trace("There are " + resources.length + " resources to add.");
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);

		// for each extracted string, write out the translations of it
		translationLocales.forEach(function(locale) {
			logger.trace("Localizing Java strings to " + locale);
			
			db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
				var r = translated; // default to the source language if the translation is not there
				if (res.dnt) {
					logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
				} else if (!translated) {
					r = res.clone();
					r.locale = locale;
					r.state = "new";
					r.origin = "target";
					
					this.newres.add(res);
					this.newres.add(r);
					
					logger.trace("No translation for " + res.reskey + " to " + locale + ". Leaving blank.");
				} else {
					var fullyTranslated = true;
					var newItems = [];
					
					if (r.resType === "array") {
						// check each element of the array to see if it is translated
						var items = res.getArray();
						
						var translatedItems = r.getArray();
						for (var i = 0; i < items.length; i++) {
							if (!translatedItems[i]) {
								translatedItems[i] = res.get(i); // use the English as backup
								fullyTranslated = false;
								newItems.push(res.get(i));
							} else {
								newItems.push(null); // already translated
							}
						}
						if (!fullyTranslated) {
							var sourceRes = res.clone();
							sourceRes.array = newItems;
							sourceRes.origin = "source";
							this.newres.add(sourceRes);
							
							var newres = r.clone();
							newres.array = newItems;
							newres.locale = locale;
							newres.origin = "target";
							newres.state = "new";
							this.newres.add(newres);
						}
					}
					
					file = this.getResourceFile(r.context, locale, r.resType + "s");
					file.addResource(r);
					logger.trace("Added " + r.reskey + " to " + file.pathName);
				}
			}.bind(this));
		}.bind(this));
	}
	
	if (!this.project.settings.nopseudo) {
		resources = this.pseudo.getAll();
		
		for (var i = 0; i < resources.length; i++) {
			res = resources[i];
			file = this.getResourceFile(res.context, res.locale, res.resType + "s");
			file.addResource(res);
			logger.trace("Added " + res.reskey + " to " + file.pathName);
		}
	}
	
	logger.trace("Now writing out the resource files");
	// ... and then let them write themselves out
	for (var hash in this.resourceFiles) {
		file = this.resourceFiles[hash];
		file.write();
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
	
	var base = path.basename(pathName, ".xml");
	var locale = file.getLocale() || "default"; 
	var context = file.getContext() || "default";
	
	var key = [context, locale, base].join("_");
	
	this.resourceFiles[key] = file;
	return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 * 
 * @param {String} context the name of the context in which the resource
 * file will reside
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} type of the resource file being sought. Should be one
 * of "strings", "arrays", or "plurals"
 * @return {AndroidResourceFile} the Android resource file that serves the
 * given project, context, and locale.
 */
AndroidResourceFileType.prototype.getResourceFile = function(context, locale, type) {
	var key = [(context || "default"), (locale || "default"), type].join("_");
	
	var resfile = this.resourceFiles && this.resourceFiles[key];
	
	if (!resfile) {
		resfile = this.resourceFiles[key] = new AndroidResourceFile({
			project: this.project,
			context: context,
			locale: locale || this.project.sourceLocale
		});
		
		logger.trace("Defining new resource file");
	}
	
	return resfile;
};

/**
 * Return all resource files known to this file type instance.
 * 
 * @returns {Array.<AndroidResourceFile>} an array of resource files
 * known to this file type instance
 */
AndroidResourceFileType.prototype.getAll = function() {
	return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
AndroidResourceFileType.prototype.generatePseudo = function() {
	if (!this.project.settings.nopseudo) {
		var resources = this.extracted.getBy({
			locale: this.sourceLocale
		});
		logger.trace("Found " + resources.length + " source resources for " + this.sourceLocale);
		var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
		var resource;
		
		resources.forEach(function(resource) {
			if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
				logger.trace("Generating pseudo for " + resource.getKey());
				resource = resource.generatePseudo(locale, this.pseudoBundle);
				resource && this.pseudo.add(resource);
			}
		}.bind(this));
	}
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
AndroidResourceFileType.prototype.generate = function(locale) {
	var resources = this.extracted.getBy({
		locale: this.sourceLocale
	});
	logger.trace("Found " + resources.length + " source resources for " + this.sourceLocale);
	var resource;
	
	resources.forEach(function(resource) {
		if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
			logger.trace("Generating British English for " + resource.getKey());
			var res = resource.clone();
			res.locale = locale;
			res.text = PseudoBritish(res.text);
			res.origin = "target";
			
			this.pseudo.add(res);
		}
	}.bind(this));
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
AndroidResourceFileType.prototype.registerDataTypes = function() {
	ResourceFactory.registerDataType("x-android-resource", "string", ContextResourceString);
	ResourceFactory.registerDataType("x-android-resource", "plural", ResourcePlural);
	ResourceFactory.registerDataType("x-android-resource", "array", ResourceArray);
};

module.exports = AndroidResourceFileType;
