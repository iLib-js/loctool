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
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	this.existing = new DBTranslationSet(project.sourceLocale);
	
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
	return this.project.resources;
};

/**
 * Add a resource to the file type. This method notes whether
 * or not the resource is new, changed from an existing 
 * resource, or is the same as an existing resource.
 * @param {Resource} resource the resource to add
 */
JavaFileType.prototype.addResource = function(resource, cb) {
	this.existing.contains(resource, function(existingResource) {
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

JavaFileType.prototype.generatePseudo = function() {
	var resources = this.project.getTranslationSet().getAll();
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX");
	
	resources.forEach(function(resource) {
		if (resource.getId() !== "app_id" && resource.getId() !== "live_sdk_client_id") {
			resource.generatePseudo(locale.getSpec(), this.pseudoBundle);
		} else {
			resource.addTranslation(locale.getSpec(), resource.getSource());
		}
	}.bind(this));
};

JavaFileType.prototype.write = function() {
};

JavaFileType.prototype.newFile = function(path) {
	return new JavaFile(this.project, path, this);
};

JavaFileType.prototype.collect = function() {
};


module.exports = JavaFileType;
