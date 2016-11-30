/*
 * RubyFileType.js - Represents a collection of Ruby files
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
var RubyFile = require("./RubyFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.RubyFileType");

var RubyFileType = function(project) {
	this.parent.call(this, project);
};

RubyFileType.prototype = new FileType();
RubyFileType.prototype.parent = FileType;
RubyFileType.prototype.constructor = RubyFileType;

/**
 * Return true if the given path is a Ruby file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Ruby file, or false
 * otherwise
 */
RubyFileType.prototype.handles = function(pathName) {
	logger.debug("RubyFileType handles " + pathName + "?");
	var ret = (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".rb") ||
			  (pathName.length > 10 && pathName.substring(pathName.length - 10) === ".html.haml");

	logger.debug(ret ? "Yes" : "No");
	return ret;
};

RubyFileType.prototype.name = function() {
    return "Ruby File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
RubyFileType.prototype.write = function() {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType("ruby");
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale);
		file.addResource(res);
	}

	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale);
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
};

RubyFileType.prototype.newFile = function(path) {
	return new RubyFile({
		project: this.project, 
		pathName: path,
		sourceLocale: this.project.sourceLocale
	});
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
RubyFileType.prototype.findNew = function(set) {
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

module.exports = RubyFileType;