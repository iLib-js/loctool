/*
 * AndroidResourceFileType.js - manages a collection of android resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
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
	this.existing = new TranslationSet(project.sourceLocale);
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
	return this.existing.getAll();
};

/**
 * Add the contents of the given translation set to the existing resources
 * for this file type.
 * 
 * @param {TranslationSet} set set of resources to add to the current set
 */
AndroidResourceFileType.prototype.addSet = function(set) {
	this.existing.addSet(set);
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
AndroidResourceFileType.prototype.generatePseudo = function() {
	var resources = this.existing.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
	var resource;
	
	resources.forEach(function(resource) {
		if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id" && resource.getLocale() !== locale) {
			resource = resource.generatePseudo(locale, this.pseudoBundle);
			resource && this.newres.add(resource);
		}
	}.bind(this));
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
AndroidResourceFileType.prototype.write = function() {
	// distribute all the new resources to their resource files ...
	logger.trace("distributing all new resources to their resource files");
	var res, file, resources = this.newres.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
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
 * Collect all the resources from each of the resource files into one
 * translation set.
 */
AndroidResourceFileType.prototype.collect = function() {
	/*
	this.existing = new TranslationSet(this.project.sourceLocale);
	
	// add the source locale first
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() === this.project.sourceLocale) {
			this.existing.addAll(this.resourceFiles[i].getAll());
		}
	}
	
	// before the other locales
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() !== this.project.sourceLocale) {
			this.existing.addAll(this.resourceFiles[i].getAll());
		}
	}
	*/
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
			locale: locale
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

AndroidResourceFileType.prototype.close = function() {
	// this.db.close();
};

module.exports = AndroidResourceFileType;
