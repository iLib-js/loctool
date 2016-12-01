/*
 * JavaFileType.js - Represents a collection of java files
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
var JavaFile = require("./JavaFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.JavaFileType");

var JavaFileType = function(project) {
	this.parent.call(this, project);
};

JavaFileType.prototype = new FileType();
JavaFileType.prototype.parent = FileType;
JavaFileType.prototype.constructor = JavaFileType;

var extensionRE = new RegExp(/\.java$/);

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JavaFileType.prototype.handles = function(pathName) {
	logger.debug("JavaFileType handles " + pathName + "?");
	var ret = extensionRE.test(pathName);
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

JavaFileType.prototype.name = function() {
    return "Java File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the 
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
JavaFileType.prototype.write = function(translations, locales) {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, 
		resources = this.extracted.getAll(),
		db = this.project.db;
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);

		// for each extracted string, write out the translations of it
		locales.forEach(function(locale) {
			logger.trace("Localizing Java strings to " + locale);
			
			db.getResource(res.getKey(), res.getType(), res.getContext(), locale, res.getProject(), res.getPath(), function(err, translated) {
				var r = translated || res; // default to the source language if the translation is not there
				if (!translated) {
					logger.trace("No translation for " + res.reskey + " to " + locale);
				}
				
				file = resFileType.getResourceFile(r.context, locale, r.resType + "s");
				file.addResource(r);
				logger.trace("Added " + r.reskey + " to " + file.pathName);
			}.bind(this));
		}.bind(this));
	}

	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
};

JavaFileType.prototype.newFile = function(path) {
	return new JavaFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
JavaFileType.prototype.findNew = function(set) {
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

module.exports = JavaFileType;
