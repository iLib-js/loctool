/*
 * IosStringsFileType.js - manages a collection of iOS strings resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var IosStringsFile = require("./IosStringsFile.js");
var TranslationSet = require("./TranslationSet.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.IosStringsFileType");

/**
 * @class Manage a collection of iOS strings resource files.
 * 
 * @param {Project} project that this type is in
 */
var IosStringsFileType = function(project) {
	this.parent.call(this, project);
	
	this.resourceFiles = {};
};

IosStringsFileType.prototype = new FileType();
IosStringsFileType.prototype.parent = FileType;
IosStringsFileType.prototype.constructor = IosStringsFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
IosStringsFileType.prototype.handles = function(pathName) {
	logger.debug("IosStringsFileType handles " + pathName + "?");
	
	var ret = (pathName.length > 8) && (pathName.substring(pathName.length - 8) === ".strings");
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
IosStringsFileType.prototype.write = function() {
	// distribute all the new resources to their resource files ...
	logger.trace("distributing all new resources to their resource files");
	var res, file, resources = this.newres.getAll();
	
	logger.trace("There are " + resources.length + " resources to add.");
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
	
	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
	
	logger.trace("Now writing out the resource files");
	// ... and then let them write themselves out
	for (var hash in this.resourceFiles) {
		file = this.resourceFiles[hash];
		file.write();
	}
};

IosStringsFileType.prototype.name = function() {
    return "iOS Strings Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 * 
 * @param {String} pathName the path of the resource file
 * @return {IosStringsFile} a resource file instance for the
 * given path
 */
IosStringsFileType.prototype.newFile = function(pathName) {
	var file = new IosStringsFile({
		project: this.project, 
		pathName: pathName,
		type: this
	});
	
	var base = path.basename(pathName, ".strings");
	var locale = file.getLocale() || "default"; 
	
	var key = [locale, base].join("_");
	
	this.resourceFiles[key] = file;
	return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 * 
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} type of the resource file being sought. Should be one
 * of "strings", "arrays", or "plurals"
 * @return {IosStringsFile} the Android resource file that serves the
 * given project, context, and locale.
 */
IosStringsFileType.prototype.getResourceFile = function(context, locale, type) {
	var key = [(context || "default"), (locale || "default"), type].join("_");
	
	var resfile = this.resourceFiles && this.resourceFiles[key];
	
	if (!resfile) {
		resfile = this.resourceFiles[key] = new IosStringsFile({
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
 * @returns {Array.<IosStringsFile>} an array of resource files
 * known to this file type instance
 */
IosStringsFileType.prototype.getAll = function() {
	return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
IosStringsFileType.prototype.generatePseudo = function() {
	var resources = this.extracted.getBy({
		locale: this.sourceLocale
	});
	logger.trace("Found " + resources.length + " source resources for " + this.sourceLocale);
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
	var resource;
	
	resources.forEach(function(resource) {
		if (resource) {
			logger.trace("Generating pseudo for " + resource.getKey());
			resource = resource.generatePseudo(locale, this.pseudoBundle);
			resource && this.pseudo.add(resource);
		}
	}.bind(this));
};

module.exports = IosStringsFileType;
