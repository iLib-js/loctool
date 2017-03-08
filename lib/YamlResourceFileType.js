/*
 * YamlResourceFileType.js - manages a collection of yaml resource files
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
var TranslationSet = require("./TranslationSet.js");
var YamlResourceFile = require("./YamlResourceFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ContextResourceString = require("./ContextResourceString.js");

var logger = log4js.getLogger("loctool.lib.YamlResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var YamlResourceFileType = function(project) {
	this.type = "ruby";
	this.parent.call(this, project);
	
	this.resourceFiles = {};
};

YamlResourceFileType.prototype = new FileType();
YamlResourceFileType.prototype.parent = FileType;
YamlResourceFileType.prototype.constructor = YamlResourceFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlResourceFileType.prototype.handles = function(pathName) {
	logger.debug("YamlResourceFileType handles " + pathName + "?");
	
	var ret = pathName.length > 4 && pathName.substring(pathName.length - 4) === ".yml";
		
	if (ret && this.project.options.resourceDirs && this.project.options.resourceDirs.yml) {
		var resDir = this.project.options.resourceDirs.yml;
		ret = (pathName.substring(0, resDir.length) === resDir);
		
		if (ret) {
			var base = path.basename(pathName, ".yml");
			ret = (base === "en" || base === this.project.sourceLocale);
		}
	}
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
YamlResourceFileType.prototype.write = function() {
	// distribute all the new resources to their resource files ...

	logger.trace("Now writing out the resource files");
	// ... and then let them write themselves out
	for (var hash in this.resourceFiles) {
		file = this.resourceFiles[hash];
		file.write();
	}
};

YamlResourceFileType.prototype.name = function() {
    return "Yaml Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 * 
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlResourceFileType.prototype.newFile = function(pathName) {
	var file = new YamlResourceFile({
		project: this.project, 
		pathName: pathName,
		type: this
	});
	
	var locale = file.getLocale() || "default"; 
	
	this.resourceFiles[locale] = file;
	return file;
};

/**
 * Find or create the resource file object for the given project
 * and locale.
 * 
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {YamlResourceFile} the yaml resource file that serves the
 * given project and locale.
 */
YamlResourceFileType.prototype.getResourceFile = function(locale) {
	var key = locale || this.project.sourceLocale;
	
	var resfile = this.resourceFiles && this.resourceFiles[key];
	
	if (!resfile) {
		resfile = this.resourceFiles[key] = new YamlResourceFile({
			project: this.project,
			locale: key
		});
	}
	
	return resfile;
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
YamlResourceFileType.prototype.registerDataTypes = function() {
	ResourceFactory.registerDataType("x-yaml", "string", ContextResourceString);
};

module.exports = YamlResourceFileType;
