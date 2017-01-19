/*
 * JavaFile.js - plugin to extract resources from a Java source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var utils = require("./utils.js");
var ContextResourceString = require("./ContextResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.JavaFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var JavaFile = function(project, pathName) {
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
JavaFile.prototype.makeKey = function(source) {
	var unescaped = source.
		replace(/^\\\\/g, "").
		replace(/([^\\])\\\\/g, "$1").
		replace(/\\n/g, "\n").
		replace(/\\t/g, "\t").
		replace(/\\'/g, "'").
		replace(/\\"/g, '"').
		replace(/\s+/g, " ").trim();
	return utils.hashKey(unescaped);
};

var reGetStringBogusConcatenation1 = new RegExp(/(^R|\WR)B\.getString\s*\(\s*"[^"]*"\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/(^R|\WR)B\.getString\s*\([^\)]*\+\s*"[^"]*"\s*\)/g);
var reGetStringBogusParam = new RegExp(/(^R|\WR)B\.getString\s*\([^"\)]*\)/g);

var reGetString = new RegExp('(^R|\\WR)B\\.getString\\s*\\(\\s*"([^"]*)"\\s*\\)', "g");
var reGetStringWithId = new RegExp('(^R|\\WR)B\\.getString\\("([^"]*)"\\s*,\\s*"([^"]*)"\\)', "g");

var reI18nComment = new RegExp("//\\s*i18n\\s*:\\s*(.*)$");

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
JavaFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	reGetString.lastIndex = 0; // for safety
	var result = reGetString.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 4 ? result[4] : undefined));
		if (result[2] && result[2].length) {
			
			var last = data.indexOf('\n', reGetString.lastIndex);
			last = (last === -1) ? data.length : last;
			var line = data.substring(reGetString.lastIndex, last);
			var commentResult = reI18nComment.exec(line);
			comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;
			
			var r = new ContextResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: this.makeKey(result[2]),
				autoKey: true,
				source: result[2],
				pathName: this.pathName,
				state: "new",
				comment: comment,
				datatype: "java"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
		}
		result = reGetString.exec(data);
	}

	reGetStringWithId.lastIndex = 0; // for safety
	result = reGetStringWithId.exec(data);
	while (result && result.length > 2 && result[2] && result[3]) {
		logger.trace("Found string '" + result[2] + "' with unique key " + result[3] + ", comment: " + (result.length > 4 ? result[4] : undefined));
		if (result[2] && result[3] && result[2].length && result[3].length) {

			var last = data.indexOf('\n', reGetStringWithId.lastIndex);
			last = (last === -1) ? data.length : last;
			var line = data.substring(reGetStringWithId.lastIndex, last);
			var commentResult = reI18nComment.exec(line);
			comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;
			
			var r = new ContextResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: result[3],
				source: result[2],
				pathName: this.pathName,
				state: "new",
				comment: comment,
				datatype: "java"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
		}
		result = reGetStringWithId.exec(data);
	}
	
	// now check for and report on errors in the source
	result = reGetStringBogusConcatenation1.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusConcatenation1.exec(data);
	}
	result = reGetStringBogusConcatenation2.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusConcatenation2.exec(data);
	}
	result = reGetStringBogusParam.exec(data);
	while (result) {
		logger.warn("Warning: non-string arguments are not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusParam.exec(data);
	}
};

/**
 * Extract all the localizable strings from the java file and add them to the
 * project's translation set.
 */
JavaFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Java file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
JavaFile.prototype.getTranslationSet = function() {
	return this.set;
}

//we don't localize or write java source files
JavaFile.prototype.localize = function() {};
JavaFile.prototype.write = function() {};

module.exports = JavaFile;
