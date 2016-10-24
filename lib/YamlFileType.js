/*
 * YamlFileType.js - manages a collection of android resource files
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
var YamlFile = require("./YamlFile.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.YamlFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var YamlFileType = function(project) {
	this.project = project;
	this.extracted = new TranslationSet(project.sourceLocale);
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
    	type: "c",
		locale: "zxx-XX",
		type: "xml"
	});
	
	this.resourceFiles = {};
};

var extensionRE = /\.yml$/;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlFileType.prototype.handles = function(pathName) {
	logger.debug("YamlFileType handles " + pathName + "?");
	
	var len = pathName.length;
	
	if (len <= 4 || pathName.substring(len-4).toLowerCase() !== ".yml") {
		logger.debug("No");
		return false;
	}
	/*
	if (!extensionRE.test(pathName)) {
		logger.debug("No");
		return false;
	}
	*/

	logger.trace("it is a yml file");
	var pathElements = pathName.split('/');
	if (pathElements.length < 3 || 
			pathElements[pathElements.length-3] !== "config" || 
			pathElements[pathElements.length-2] !== "locales") {
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
YamlFileType.prototype.getResources = function() {
	return this.extracted.getAll();
};

/**
 * Add the contents of the given translation set to the existing resources
 * for this file type.
 * 
 * @param {TranslationSet} set set of resources to add to the current set
 */
YamlFileType.prototype.addSet = function(set) {
	this.extracted.addSet(set);
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
YamlFileType.prototype.generatePseudo = function() {
	var resources = this.extracted.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
	var resource;
	
	resources.forEach(function(resource) {
		if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id" && resource.getLocale() !== locale) {
			resource = resource.generatePseudo(locale, this.pseudoBundle);
			this.newres.add(resource);
		}
	}.bind(this));
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
YamlFileType.prototype.write = function() {
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

YamlFileType.prototype.name = function() {
    return "Yaml File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 * 
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlFileType.prototype.newFile = function(pathName) {
	var file = new YamlFile({
		project: this.project, 
		pathName: pathName,
		type: this
	});
	
	var base = path.basename(pathName, ".yml");
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
YamlFileType.prototype.collect = function() {
	/*
	this.extracted = new TranslationSet(this.project.sourceLocale);
	
	// add the source locale first
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() === this.project.sourceLocale) {
			this.extracted.addAll(this.resourceFiles[i].getAll());
		}
	}
	
	// before the other locales
	for (var i = 0; i < this.resourceFiles.length; i++) {
		if (this.resourceFiles[i].getLocale() !== this.project.sourceLocale) {
			this.extracted.addAll(this.resourceFiles[i].getAll());
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
YamlFileType.prototype.getResourceFile = function(context, locale, type) {
	var key = [(context || "default"), (locale || "default"), type].join("_");
	
	var resfile = this.resourceFiles && this.resourceFiles[key];
	
	if (!resfile) {
		resfile = this.resourceFiles[key] = new YamlFile({
			project: this.project,
			context: context,
			locale: locale
		});
	}
	
	return resfile;
};

/**
 * Return all resource files known to this file type instance.
 * 
 * @returns {Array.<AndroidResourceFile>} an array of resource files
 * known to this file type instance
 */
YamlFileType.prototype.getAll = function() {
	return this.resourceFiles;
};

/**
 * Return all strings that do not currently exist in the translation set.
 * This is all resources extracted from the resource files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
YamlFileType.prototype.getNew = function(set) {
	// only save the new resources for the source locale -- resource file
	// types might have resources for other locales as well
	if (this.locale === this.project.sourceLocale) {
		var extracted = this.extracted.getAll();
		
		for (var i = 0; i < extracted.length; i++) {
			var resource = extracted[i];
			var existing = set.get(resource.getKey(), resource.getType(), resource.getContext(), resource.getLocale());
			if (!existing || !resource.equals(existing)) {
				this.newres.add(resource);
			}
		}
	}
	
	return this.newres;
};


YamlFileType.prototype.close = function() {
	// this.db.close();
};

module.exports = YamlFileType;
