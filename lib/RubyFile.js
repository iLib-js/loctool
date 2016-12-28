/*
 * RubyFile.js - plugin to extract resources from a Ruby source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.RubyFile");

/**
 * Create a new Ruby file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var RubyFile = function(options) {
	if (options) {
		this.project = options.project;
		this.pathName = options.pathName;
	}
	this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in 
 * this project under the Ruby directory for the corresponding
 * code.
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RubyFile.prototype.makeKey = function(source) {
	return utils.hashKey(source.replace(/\n/g, ''));
};

var reGetStringBogusConcatenation1 = new RegExp(/(^R|\WR)b\.t\s*\(\s*"[^"]*"\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/(^R|\WR)b\.t\s*\([^\)]*\+\s*"[^"]*"\s*\)/g);
var reGetStringBogusParam = new RegExp(/(^R|\WR)B\.getString\s*\([^"\)]*\)/g);

var reGetString = /(^R|\WR)b\.t\s*\(\s*("[^"]*"|'[^']*')\s*(\)|,)([^#\n]*#\s*i18n:?\s*(.*))?/g;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RubyFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	reGetString.lastIndex = 0; // for safety
	var result = reGetString.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 5 ? result[5] : undefined));
		if (result[2] && result[2].length > 2) {
			var str = result[2].substring(1,result[2].length-1); // strip the quotes
			var r = new ResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: this.makeKey(str),
				autoKey: true,
				source: str,
				pathName: this.pathName,
				state: "new",
				comment: result.length > 5 ? result[5] : undefined,
				datatype: "ruby"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
		}
		result = reGetString.exec(data);
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
 * Extract all the localizable strings from the Ruby file and add them to the
 * project's translation set.
 */
RubyFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Ruby file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current Ruby file.
 */
RubyFile.prototype.getTranslationSet = function() {
	return this.set;
}

//we don't localize or write Ruby source files
RubyFile.prototype.localize = function() {};
RubyFile.prototype.write = function() {};

module.exports = RubyFile;
