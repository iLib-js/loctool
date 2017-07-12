/*
 * SwiftFile.js - plugin to extract resources from a Swift source code file
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");
var IString = require("ilib/lib/IString.js");

var logger = log4js.getLogger("loctool.lib.SwiftFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var SwiftFile = function(project, pathName, type) {
	this.project = project;
	this.pathName = pathName;
	this.type = type;
	
	this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

var reUnicodeChar = /\\u\{([a-fA-F0-9]{1,5})\}/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
SwiftFile.unescapeString = function(string) {
	if (!string) return string;
	var unescaped = string;

	while ((match = reUnicodeChar.exec(unescaped))) {
		if (match && match.length > 1) {
			var value = parseInt(match[1], 16);
			unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
			reUnicodeChar.lastIndex = 0;
		}
	}

	unescaped = unescaped.
		replace(/^\\\\/, "\\").
		replace(/([^\\])\\\\/g, "$1\\").
		replace(/^\\'/, "'").
		replace(/([^\\])\\'/g, "$1'").
		replace(/^\\"/, '"').
		replace(/([^\\])\\"/g, '$1"');

	return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code.
 * 
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
SwiftFile.cleanString = function(string) {
	var unescaped = SwiftFile.unescapeString(string);

	unescaped = unescaped.
		replace(/\\[btnfr]/g, " ").	
		replace(/[ \n\t\r\f]+/g, " ").
		trim();
	
	return unescaped;
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
SwiftFile.prototype.makeKey = function(source) {
	if (!source) return undefined;
	
	// the cleaned source is the key
	return SwiftFile.cleanString(source);
};

var reNSLocalizedStringBogusConcatenation1 = /(^N|\WN)SLocalizedString\s*\(\s*"(\\"|[^"])*"\s*\+/g;
var reNSLocalizedStringBogusConcatenation2 = /(^N|\WN)SLocalizedString\s*\([^\)]*\+\s*"(\\"|[^"])*"\s*\)/g;
var reNSLocalizedStringBogusParam = /(^N|\WN)SLocalizedString\s*\([^"\)]*\)/g;

var reNSLocalizedString = /(^N|\WN)SLocalizedString\s*\(\s*"((\\"|[^"])*)"\s*,/g;

var reNSLocalizedStringComment = /\s*comment:\s*("((\\"|[^"])*)")\s*\)/;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
SwiftFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);

	reNSLocalizedString.lastIndex = 0; // for safety
	var comment, result = reNSLocalizedString.exec(data);
	while (result && result.length > 1 && result[2] && result[2].trim().length > 0) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 4 ? result[5] : undefined));

		var last = data.indexOf('\n', reNSLocalizedString.lastIndex);
		last = (last === -1) ? data.length : last;
		var line = data.substring(reNSLocalizedString.lastIndex, last);
		var commentResult = reNSLocalizedStringComment.exec(line);
		comment = (commentResult && commentResult.length > 2) ? commentResult[2] : undefined;

		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: this.makeKey(result[2]),
			autoKey: true,
			source: SwiftFile.unescapeString(result[2]),
			pathName: this.pathName,
			state: "new",
			comment: comment ? SwiftFile.unescapeString(comment) : undefined,
			datatype: this.type.datatype
		});
		this.set.add(r);
		result = reNSLocalizedString.exec(data);
	}

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
SwiftFile.prototype.extract = function() {
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
SwiftFile.prototype.getTranslationSet = function() {
	return this.set;
}

//we don't localize or write Objective C source files
SwiftFile.prototype.localize = function() {};
SwiftFile.prototype.write = function() {};

module.exports = SwiftFile;