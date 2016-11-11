/*
 * XliffFileType.js - Represents a collection of iOS Xliff files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var HamlFile = require("./HamlFile.js");
var XliffFile = require("./XliffFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.XliffFileType");

var XliffFileType = function(project) {
	this.parent.call(this, project);
	
	this.files = [];
};

XliffFileType.prototype = new FileType();
XliffFileType.prototype.parent = FileType;
XliffFileType.prototype.constructor = XliffFileType;

/**
 * Return true if the given path is a Haml file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Haml file, or false
 * otherwise
 */
XliffFileType.prototype.handles = function(pathName) {
	logger.debug("XliffFileType handles " + pathName + "?");
	// var ret = extensionRE.test(pathName);
	ret = (pathName === "./en.xliff");
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

XliffFileType.prototype.name = function() {
    return "Xliff File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
XliffFileType.prototype.write = function() {
	logger.trace("executing xcodebuild on the " + this.project.id + " project.");
	
	if (this.file) {
		// first write out the xliff file to disk, then import it to xcode
		this.file.write();
		
		var args = ["-importLocalizations", "-localizationPath", "./en.xliff", "-project", "feelgood.xcodeproj"];
		var procStatus = spawnSync('xcodebuild', args);
		procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
		if (procStatus.status !== 0) {
			logger.warn("Execution failed: ");
		}
		procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));
	}
};

XliffFileType.prototype.newFile = function(pathName) {
	if (!this.file) {
		this.file = new XliffFile({
			project: this.project, 
			path: pathName,
			sourceLocale: this.project.sourceLocale
		});
	}
	
	return this.file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 * 
 * @return {XliffFile} the Xliff file that serves the current project
 */
XliffFileType.prototype.getResourceFile = function() {
	return this.file;
};

module.exports = XliffFileType;
