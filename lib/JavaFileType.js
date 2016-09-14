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
var JavaFile = require("./JavaFile.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JavaFileType");

var JavaFileType = function(project) {
	this.project = project;
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	
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
	return new JavaFile(this.project, path);
};

JavaFileType.prototype.collect = function() {
};


module.exports = JavaFileType;
