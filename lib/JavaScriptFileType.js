/*
 * JavaScriptFileType.js - Represents a collection of java files
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
var JavaScriptFile = require("./JavaScriptFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.JavaScriptFileType");

var JavaScriptFileType = function(project) {
	this.parent.call(this, project);
};

JavaScriptFileType.prototype = new FileType();
JavaScriptFileType.prototype.parent = FileType;
JavaScriptFileType.prototype.constructor = JavaScriptFileType;

var alreadyLocJS = new RegExp(/\.[a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?\.js$/);
var alreadyLocHaml = new RegExp(/\.[a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?\.html\.haml$/);
var alreadyLocTmpl = new RegExp(/\.[a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?\.tmpl\.html$/);

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
	ret = (pathName.length > 3  &&   pathName.substring(pathName.length - 3)  === ".js"        && !alreadyLocJS.test(pathName)) ||
		  (pathName.length > 10 && ((pathName.substring(pathName.length - 10) === ".html.haml" && !alreadyLocHaml.test(pathName)) ||
								    (pathName.substring(pathName.length - 10) === ".tmpl.html" && !alreadyLocTmpl.test(pathName))));
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

JavaScriptFileType.prototype.name = function() {
    return "JavaScript File Type";
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
	var resFileType = this.project.getResourceFileType("js");
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale);
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}

	resources = this.pseudo.getAll();

	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.locale);
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
};

JavaScriptFileType.prototype.newFile = function(path) {
	return new JavaScriptFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
JavaScriptFileType.prototype.findNew = function(set) {
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

module.exports = JavaScriptFileType;
