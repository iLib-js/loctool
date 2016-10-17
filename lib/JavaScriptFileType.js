/*
 * JavaScriptFileType.js - Represents a collection of java files
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
var JavaScriptFile = require("./JavaScriptFile.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JavaScriptFileType");

var JavaScriptFileType = function(project) {
	this.project = project;
	this.extracted = new TranslationSet(project.sourceLocale);
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	// this.db = new DBTranslationSet(project.sourceLocale);
	
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
JavaScriptFileType.prototype.handles = function(pathName) {
	logger.debug("JavaScriptFileType handles " + pathName + "?");
	var ret = extensionRE.test(pathName);
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

JavaScriptFileType.prototype.name = function() {
    return "JavaScript File Type";
};

JavaScriptFileType.prototype.getResources = function() {
	return this.extracted;
};

/**
 * Add a resource to the file type. This method notes whether
 * or not the resource is new, changed from an existing 
 * resource, or is the same as an existing resource.
 * @param {Resource} resource the resource to add
 */
JavaScriptFileType.prototype.addResource = function(resource, cb) {
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

JavaScriptFileType.prototype.addSet = function(set) {
	this.extracted.addSet(set);
};

JavaScriptFileType.prototype.generatePseudo = function() {
	var resources = this.extracted.getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
	var resource;
	
	resources.forEach(function(resource) {
		if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id" && resource.getLocale() !== locale) {
			resource = resource.generatePseudo(locale, this.pseudoBundle);
			this.extracted.add(resource);
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
JavaScriptFileType.prototype.write = function() {
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
	}
};

JavaScriptFileType.prototype.newFile = function(path) {
	return new JavaScriptFile(this.project, path, this);
};

JavaScriptFileType.prototype._checkResource = function(i, cb) {
	/*
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
	*/
};

JavaScriptFileType.prototype.collect = function() {
	this._checkResource(0, function() {
		
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
JavaScriptFileType.prototype.getNew = function(set) {
	var extracted = this.extracted.getAll();
	
	for (var i = 0; i < extracted.length; i++) {
		var resource = extracted[i];
		var existing = set.get(resource.getKey(), resource.getType(), resource.getContext(), resource.getLocale());
		if (!existing || !resource.equals(existing)) {
			this.newres.add(resource);
		}
	}
	
	return this.newres;
};

JavaScriptFileType.prototype.close = function() {
	// this.db.close();
};

module.exports = JavaScriptFileType;
