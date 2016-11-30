/*
 * ObjectiveCFile.js - plugin to extract resources from a Java source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ObjectiveCFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var ObjectiveCFile = function(project, pathName) {
	this.project = project;
	this.pathName = pathName;
	this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in 
 * this project under the java directory for the corresponding
 * code.
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
ObjectiveCFile.prototype.makeKey = function(source) {
	if (!source) return undefined;
	// the source is the key
	return source;
};

var reNSLocalizedStringBogusConcatenation1 = /(^N|\WN)SLocalizedString\s*\(\s*@"[^"]*"\s*\+/g;
var reNSLocalizedStringBogusConcatenation2 = /(^N|\WN)SLocalizedString\s*\([^\)]*\+\s*@"[^"]*"\s*\)/g;
var reNSLocalizedStringBogusParam = /(^N|\WN)SLocalizedString\s*\([^"\)]*\)/g;

var reNSLocalizedString = /(^N|\WN)SLocalizedString\s*\(\s*@"([^"]*)"\s*,\s*(nil|@"([^"]*)")\s*\)/g;
var reNSLocalizedStringWithParams = /(^N|\WN)SLocalizedString\("([^"]*)",\s*"([^"]*)"\)[^/\n]*(\/\/\s*i18n:\s*(.*))?/g;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
ObjectiveCFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	reNSLocalizedString.lastIndex = 0; // for safety
	var result = reNSLocalizedString.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 3 ? result[4] : undefined));
		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: this.makeKey(result[2]),
			autoKey: true,
			source: result[2],
			pathName: this.pathName,
			state: "new",
			comment: result.length > 3 ? result[4] : undefined
		});
		this.set.add(r);
		result = reNSLocalizedString.exec(data);
	}

	/*
	result = reNSLocalizedStringWithId.exec(data);
	while (result && result.length > 2 && result[2] && result[2]) {
		logger.trace("Found string '" + result[2] + "' with unique key " + result[2] + ", comment: " + (result.length > 3 ? result[4] : undefined));
		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: result[2],
			source: result[2],
			pathName: this.pathName,
			state: "new",
			comment: result.length > 4 ? result[4] : undefined
		});
		this.set.add(r);
		result = reNSLocalizedStringWithId.exec(data);
	}
	*/
	
	// now check for and report on errors in the source
	result = reNSLocalizedStringBogusConcatenation1.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the NSLocalizedString() parameters:");
		logger.warn(result[0]);
		result = reNSLocalizedStringBogusConcatenation1.exec(data);
	}
	result = reNSLocalizedStringBogusConcatenation2.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the NSLocalizedString() parameters:");
		logger.warn(result[0]);
		result = reNSLocalizedStringBogusConcatenation2.exec(data);
	}
	result = reNSLocalizedStringBogusParam.exec(data);
	while (result) {
		logger.warn("Warning: non-string arguments are not allowed in the NSLocalizedString() parameters:");
		logger.warn(result[0]);
		result = reNSLocalizedStringBogusParam.exec(data);
	}
};

/**
 * Extract all the localizable strings from the file and add them to the
 * project's translation set.
 */
ObjectiveCFile.prototype.extract = function() {
	logger.debug("Extracting strings from " + this.pathName);
	if (this.pathName) {
		var p = path.join(this.project.root, this.pathName);
		try {
			var data = fs.readFileSync(p, "utf8");
			if (data) {
				this.parse(data);
			}
		} catch (e) {
			logger.warn("Could not read file: " + p);
			logger.warn(e);
		}
	}
};

/**
 * Return the set of resources found in the current Objective C file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current file.
 */
ObjectiveCFile.prototype.getTranslationSet = function() {
	return this.set;
}

//we don't localize or write Objective C source files
ObjectiveCFile.prototype.localize = function() {};
ObjectiveCFile.prototype.write = function() {};

module.exports = ObjectiveCFile;