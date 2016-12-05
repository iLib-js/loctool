/*
 * YamlFileType.js - manages a collection of android resource files
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
var YamlFile = require("./YamlFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.YamlFileType");

/**
 * @class Manage a collection of Android resource files.
 * 
 * @param {Project} project that this type is in
 */
var YamlFileType = function(project) {
	this.parent.call(this, project);
	
	this.resourceFiles = {};
};

YamlFileType.prototype = new FileType();
YamlFileType.prototype.parent = FileType;
YamlFileType.prototype.constructor = YamlFileType;

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
	
	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
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
 * @return {YamlFile} the yaml resource file that serves the
 * given project and locale.
 */
YamlFileType.prototype.getResourceFile = function(locale) {
	var key = locale || this.project.sourceLocale;
	
	var resfile = this.resourceFiles && this.resourceFiles[key];
	
	if (!resfile) {
		resfile = this.resourceFiles[key] = new YamlFile({
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
RubyFileType.prototype.registerDataTypes = function() {
	ResourceFactory.registerDataType("x-yaml", "resource-string", ResourceString);
};

module.exports = YamlFileType;
