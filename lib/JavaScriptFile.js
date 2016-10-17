/*
 * JavaScriptFile.js - plugin to extract resources from a JavaScript source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JavaScriptFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var JavaScriptFile = function(project, pathName) {
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
JavaScriptFile.prototype.makeKey = function(source) {
	if (!source) return undefined;
	var hash = 0;
	// these two numbers together = 63 bits so it won't blow out a long
	var modulus = 140737488355213;  // largest prime number that fits in 47 bits
	var multiple = 65521;           // largest prime that fits in 16 bits, co-prime with the modulus
	
	//logger.trace("hash starts off at " + hash);
	
	for (var i = 0; i < source.length; i++) {
		hash += source.charCodeAt(i);
		hash *= multiple;
		hash %= modulus;
		
		//logger.trace("at char " + i + " hash is " + hash);
	}
	var value = "r" + hash;
	
	// System.out.println("String '" + source + "' hashes to " + value);
	
	return value;
};

var reGetStringBogusConcatenation1 = new RegExp(/\bRB\.getString\s*\(\s*"[^"]*"\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/\bRB\.getString\s*\([^\)]*\+\s*"[^"]*"\s*\)/g);
var reGetStringBogusParam = new RegExp(/\bRB\.getString\s*\([^"\)]*\)/g);

var reGetString = new RegExp(/\bRB\.getString\s*\(\s*"([^"]*)"\s*\)/g);
var reGetStringWithId = new RegExp(/\bRB\.getString\("([^"]*)", ?"([^"]*)"/g);

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
JavaScriptFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	var result = reGetString.exec(data);
	while (result && result.length > 1 && result[1]) {
		logger.trace("Found string key: " + this.makeKey(result[1]) + ", string: '" + result[1] + "'");
		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: this.makeKey(result[1]),
			autoKey: true,
			source: result[1],
			pathName: this.pathName,
			state: "new"
		});
		this.set.add(r);
		result = reGetString.exec(data);
	}

	result = reGetStringWithId.exec(data);
	while (result && result.length > 2 && result[1] && result[2]) {
		logger.trace("Found string '" + result[1] + "' with unique key " + result[2]);
		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: result[2],
			source: result[1],
			pathName: this.pathName,
			state: "new"
		});
		this.set.add(r);
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
JavaScriptFile.prototype.extract = function() {
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
		}
	}
};

/**
 * Return the set of resources found in the current JavaScript file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current JavaScript file.
 */
JavaScriptFile.prototype.getTranslationSet = function() {
	return this.set;
}

// we don't localize or write javascript source files
JavaScriptFile.prototype.localize = function() {};
JavaScriptFile.prototype.write = function() {};

module.exports = JavaScriptFile;
