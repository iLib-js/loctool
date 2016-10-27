/*
 * AndroidLayoutFileType.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var AndroidLayoutFile = require("./AndroidLayoutFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

var AndroidLayoutFileType = function(project) {
	this.parent.call(this, project);
	
	this.files = []; // all files of this type
};

AndroidLayoutFileType.prototype = new FileType();
AndroidLayoutFileType.prototype.parent = FileType;
AndroidLayoutFileType.prototype.constructor = AndroidLayoutFileType;

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^(layout|menu)");
var lang = new RegExp("-[a-z][a-z]$");
var reg = new RegExp("-r[A-Z][A-Z]$");

AndroidLayoutFileType.prototype.handles = function(pathName) {
	logger.debug("AndroidLayoutFileType handles " + pathName + "?");
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
	
	if (lang.test(dir) && utils.iso639[dir.substring(dir.length-2,2)]) {
		// already localized dir
		logger.debug("No");
		return false;
	}
	
	if (reg.test(dir) && utils.iso3166[dir.substring(dir.length-2,2)]) {
		// already localized dir
		logger.debug("No");
		return false;
	}
	
	logger.debug("Yes");
	return true;
};

AndroidLayoutFileType.prototype.name = function() {
    return "Android Layout File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
AndroidLayoutFileType.prototype.write = function() {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, resources = this.extracted.getAll();
	logger.trace("Adding resources to resource files");
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, "strings");
		file.addResource(res);
	}
	
	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}

	logger.trace("Writing out modified layout files");
	
	// now write out all the files that were resourcified
	for (i = 0; i < this.files.length; i++) {
		// will not write anything if the file is not dirty
		this.files[i].write(); 
	}
};

AndroidLayoutFileType.prototype.newFile = function(path) {
	var ret = new AndroidLayoutFile({
		project: this.project, 
		pathName: path
	});
	this.files.push(ret);
	return ret;
};

module.exports = AndroidLayoutFileType;
