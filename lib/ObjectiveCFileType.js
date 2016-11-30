/*
 * ObjectiveCFileType.js - Represents a collection of objective C files
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
var ObjectiveCFile = require("./ObjectiveCFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.ObjectiveCFileType");

var ObjectiveCFileType = function(project) {
	this.parent.call(this, project);
};

ObjectiveCFileType.prototype = new FileType();
ObjectiveCFileType.prototype.parent = FileType;
ObjectiveCFileType.prototype.constructor = ObjectiveCFileType;

/**
 * Return true if the given path is an objective C file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is an objective C file, or false
 * otherwise
 */
ObjectiveCFileType.prototype.handles = function(pathName) {
	logger.debug("ObjectiveCFileType handles " + pathName + "?");
	ret = (pathName.length > 2) && (pathName.substring(pathName.length - 2) === ".m");
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

ObjectiveCFileType.prototype.name = function() {
    return "Objective C File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
ObjectiveCFileType.prototype.write = function() {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale, res.resType + "s");
		file.addResource(res);
	}

	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
};

ObjectiveCFileType.prototype.newFile = function(path) {
	return new ObjectiveCFile(this.project, path);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
ObjectiveCFileType.prototype.findNew = function(set) {
	var extracted = this.extracted.getAll();
	
	for (var i = 0; i < extracted.length; i++) {
		var resource = extracted[i];
		logger.trace("Examining resource " + resource.getKey() + " to see if it's new.");
		
		var existing = set.get(resource.getKey(), resource.getType(), resource.getContext(), resource.getLocale());
		if (!existing || !resource.equals(existing)) {
			logger.trace("yes");
			this.newres.add(resource);
		} else {
			logger.trace("no");
		}
	}
	
	logger.trace("getNew Done. Returning a set with " + this.newres.size() + " resources.");
	return this.newres;
};

module.exports = ObjectiveCFileType;