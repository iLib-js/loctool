/*
 * HTMLTemplateFileType.js - Represents a collection of java files
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
var HTMLTemplateFile = require("./HTMLTemplateFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.HTMLTemplateFileType");

var HTMLTemplateFileType = function(project) {
	this.parent.call(this, project);

	// override the pseudo bundle so we can treat the text as HTML instead
	this.pseudoBundle = new ResBundle({
    	type: "html",
		locale: "zxx-XX",
		lengthen: "true"
	});
};

HTMLTemplateFileType.prototype = new FileType();
HTMLTemplateFileType.prototype.parent = FileType;
HTMLTemplateFileType.prototype.constructor = HTMLTemplateFileType;

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?)\.tmpl\.html$/);

/**
 * Return true if the given path is an HTML template file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
HTMLTemplateFileType.prototype.handles = function(pathName) {
	logger.debug("HTMLTemplateFileType handles " + pathName + "?");
	ret = (pathName.length > 10) && (pathName.substring(pathName.length - 10) === ".tmpl.html");
	if (ret) {
		var match = alreadyLoc.exec(pathName);
		ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
	}	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

HTMLTemplateFileType.prototype.name = function() {
    return "HTML Template File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
HTMLTemplateFileType.prototype.write = function() {
	// templates are localized individually, so we don't have to 
	// write out the resources
};

HTMLTemplateFileType.prototype.newFile = function(path) {
	return new HTMLTemplateFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the 
 * resources in the DB.
 * 
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 */
HTMLTemplateFileType.prototype.findNew = function(set) {
	var extracted = this.extracted.getAll();
	
	for (var i = 0; i < extracted.length; i++) {
		var resource = extracted[i];
		logger.trace("Examining resource " + resource.getKey() + " to see if it's new.");
		
		var existing = set.get(resource.hashKey());
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

module.exports = HTMLTemplateFileType;
