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

var logger = log4js.getLogger("loctool.lib.AndroidResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var AndroidResourceFileType = function(project) {
	this.parent.call(this, project);
	
	this.resourceFiles = {};
};

AndroidResourceFileType.prototype = new FileType();
AndroidResourceFileType.prototype.parent = FileType;
AndroidResourceFileType.prototype.constructor = AndroidResourceFileType;

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
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
AndroidResourceFileType.prototype.write = function() {
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

module.exports = AndroidResourceFileType;
