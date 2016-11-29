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
	
	var ret = true;
	var parent = path.dirname(pathName);
	if (parent && parent.substring(parent.length - 6) === ".lproj") {
		var dir = path.normalize(path.dirname(parent));
		var resdir = path.normalize((this.project.options.resourceDirs && this.project.options.resourceDirs["objc"]) || ".");
		ret = dir && dir !== resdir;
	}
	var dir = path.normalize(path.dirname(path.dirname(pathName)));
	
	// logger.trace("resdir: " + resdir + " dir: " + dir);
	var ret = ret && (pathName.length > 8) && (pathName.substring(pathName.length - 8) === ".strings");
	
	if (ret) {
		var dir = path.basename(parent, ".lproj");
		// logger.trace("testing " + dir);
		ret = (dir === "." || dir === "en-US" || dir === "Base");
	}
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

/**
 * Write out all resources for this file type. For iOS resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the 
 * repository
 */
IosStringsFileType.prototype.write = function(translations) {
	// distribute all the new resources to their resource files ...
	logger.trace("distributing all new resources to their resource files");
	var res, file, resources = this.extracted.getAll();
	
	logger.trace("There are " + resources.length + " resources to add.");
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.locale, res.pathName);
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
		
		// TODO add in the localized resources here
	}
	
	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.locale, res.pathName);
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
	
	this.resourceFiles[pathName] = file;
	return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 * 
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path name of the resource being added.
 * @return {IosStringsFile} the Android resource file that serves the
 * given project, context, and locale.
 */
IosStringsFileType.prototype.getResourceFile = function(locale, pathName) {
	var l = new Locale(locale);
	var localeDir, dir;
	
	if (locale !== this.project.sourceLocale) {
		if (locale === this.project.pseudoLocale) {
			localeDir = locale;
		} else {
			localeDir = l.getLanguage();
			
			if (l.getScript()) {
				localeDir += "-" + l.getScript();
			}
		}
		
		localeDir += ".lproj";
	} else {
		localeDir = "Base.lproj";
	}
	
	if (pathName.length > 4 && pathName.substring(pathName.length-4) === ".xib") {
		// strings from xib files go into the xib's localized strings file instead of the main project strings file
		var base = path.basename(pathName, ".xib");
		
		// this is the parent dir
		var dir = path.dirname(path.dirname(pathName));
		pathName = path.join(dir, localeDir, base + ".strings");
	} else {
		dir = this.project.options.resourceDirs["objc"];
		pathName = path.join(dir, localeDir, "Localizable.strings");
	}
	
	logger.trace("getResourceFile converted path " + pathName + " for locale " + locale + " to path " + pathName);
	
	var resfile = this.resourceFiles && this.resourceFiles[pathName];
	
	if (!resfile) {
		resfile = this.resourceFiles[pathName] = new IosStringsFile({
			project: this.project,
			locale: locale || this.project.sourceLocale,
			pathName: pathName,
			type: this
		});
		
		logger.trace("Defining new resource file");
	} else {
		logger.trace("Returning existing resource file");
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

module.exports = IosStringsFileType;
