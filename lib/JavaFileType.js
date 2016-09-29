/*
 * JavaFileType.js - Represents a collection of java files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var TranslationSet = require("./TranslationSet.js");
var DBTranslationSet = require("./DBTranslationSet.js");
var JavaFile = require("./JavaFile.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JavaFileType");

var JavaFileType = function(project) {
	this.project = project;
	this.extracted = new TranslationSet(project.sourceLocale);
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	this.db = new DBTranslationSet(project.sourceLocale);
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
		locale: "zxx-XX",
		type: "xml"
	});
};

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

JavaFileType.prototype.getResources = function() {
	return this.extracted;
};

/**
 * Add a resource to the file type. This method notes whether
 * or not the resource is new, changed from an existing 
 * resource, or is the same as an existing resource.
 * @param {Resource} resource the resource to add
 */
JavaFileType.prototype.addResource = function(resource, cb) {
	this.db.contains(resource, function(existingResource) {
		if (existingResource) {
			if (!resource.equals(existingResource)) {
				this.changed.addResource(resource);
			}
			// else record that the existing resource is still in use?
		} else {
			this.newres.addResource(resource);
		}
	});
};

JavaFileType.prototype.addSet = function(set) {
	this.extracted.addSet(set);
};

JavaFileType.prototype.generatePseudo = function() {
	var resources = this.extracted.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX");
	var resource;
	
	resources.forEach(function(resource) {
		if (resource.getId() !== "app_id" && resource.getId() !== "live_sdk_client_id") {
			resource = resource.generatePseudo(locale.getSpec(), this.pseudoBundle);
			this.set.addResource(resource);
		}
	}.bind(this));
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
JavaFileType.prototype.write = function() {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, resources = this.set.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile({
			context: res.context,
			locale: res.locale
		});
		file.addResource(res);
	}
};

JavaFileType.prototype.newFile = function(path) {
	return new JavaFile(this.project, path, this);
};

JavaFileType.prototype._checkResource = function(i, cb) {
	if (i < this.extracted.length) {
		this.db.contains(this.extracted[i], function(r) {
			if (!r) {
				this.newres.add(this.extracted[i]);
			} else {
				logger.trace("Exists: [" + resource.getProject() + ", " + 
						resource.getContext() + ", " + resource.getLocale() + ", " + 
						resource.getKey() + "]");
			}
			this._checkResource(i+1, cb);
		}.bind(this));
	} else {
		
	}
};

JavaFileType.prototype.collect = function() {
	this._checkResource(0, function() {
		
	});
};


module.exports = JavaFileType;
