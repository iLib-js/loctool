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
var ResourcePlural = require("./ResourcePlural.js");
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

var reEscapeChar = /\\[ux]([a-fA-F0-9]+)/g;

/**
 * Make a new key for the given string. This is used for
 * double-quoted strings, which are interpretted by the
 * ruby parser before they are used. This function interprets
 * the string in the same way before the hash is taken.
 * It does the following:
 * 
 * <ul>
 * <li>remove new lines
 * <li>interpret tabs
 * <li>unescape quote chars
 * </ul>
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RubyFile.prototype.makeKey = function(source) {
	var unescaped = source.replace(/\n/g, '').
		replace(/([^\\])\\n/g, "$1\n").
		replace(/^\\t/, "$1\t").
		replace(/([^\\])\\t/g, "$1\t").
		replace(/^\\'/, "'").
		replace(/([^\\])\\'/g, "$1'").
		replace(/^\\"/, '"').
		replace(/([^\\])\\"/g, '$1"').
		replace(/^\\\\/, "$1\\").
		replace(/([^\\])\\\\/g, "$1\\").
		replace(/^\\([dghijklmopqwyz])/, '$1').
		replace(/([^\\])\\([dghijklmopqwyz])/g, '$1$2');
	
	while ((match = reEscapeChar.exec(unescaped))) {
		if (match && match.length > 1) {
			var value = parseInt(match[1], 16);
			unescaped = unescaped.replace(match[0], String.fromCharCode(value));
			reEscapeChar.lastIndex = 0;
		}
	}

	return utils.hashKey(unescaped);
};

/**
 * Make a new key for the given string. This is used for
 * single-quoted strings, which are not interpretted by the
 * ruby parser before they are used. New lines are removed
 * so that the xliff is nicer to read.
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RubyFile.prototype.makeKeyUnescaped = function(source) {
	var unescaped = source.replace(/\n/g, '').
		replace(/^\\'/, "'").
		replace(/([^\\])\\'/g, "$1'");
	
	return utils.hashKey(unescaped);
};

var reGetStringBogusConcatenation1 = new RegExp(/(^R|\WR)b\.t\s*\(\s*"[^"]*"\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/(^R|\WR)b\.t\s*\([^\)]*\+\s*"[^"]*"\s*\)/g);
var reGetStringBogusParam = new RegExp(/(^R|\WR)B\.getString\s*\([^"\)]*\)/g);

var reGetStringSingle = /(^R|\WR)b\.t\s*\(\s*'((\\'|[^'])*)'\s*(\)|,)([^#\n]*#\s*i18n:?\s*(.*))?/g;
var reGetStringDouble = /(^R|\WR)b\.t\s*\(\s*"((\\"|[^"])*)"\s*(\)|,)([^#\n]*#\s*i18n:?\s*(.*))?/g;

var reGetStringPlural = /(^R|\WR)b\.p\s*\(\s*([^\n]*)\)/g;
var reGetStringPluralDouble = /:(\w+)\s*(=>|:)\s*"((\\"|[^"])*)"(\s|,)*/g
var reGetStringPluralSingle = /:(\w+)\s*(=>|:)\s*'((\\'|[^'])*)'(\s|,)*/g

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RubyFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	reGetStringDouble.lastIndex = 0; // for safety
	var result = reGetStringDouble.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 5 ? result[5] : undefined));
		if (result[2] && result[2].length > 2) {
			var str = result[2];
			var r = new ResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: this.makeKey(str),
				autoKey: true,
				source: str,
				pathName: this.pathName,
				state: "new",
				comment: result.length > 6 ? result[6] : undefined,
				datatype: "ruby"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetStringDouble.lastIndex) + " ...");
		}
		result = reGetStringDouble.exec(data);
	}

	reGetStringSingle.lastIndex = 0; // for safety
	var result = reGetStringSingle.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 5 ? result[5] : undefined));
		if (result[2] && result[2].length > 2) {
			var str = result[2];
			var r = new ResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: this.makeKeyUnescaped(str),
				autoKey: true,
				source: str,
				pathName: this.pathName,
				state: "new",
				comment: result.length > 6 ? result[6] : undefined,
				datatype: "ruby"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetStringSingle.lastIndex) + " ...");
		}
		result = reGetStringSingle.exec(data); // for safety
	}
	reGetStringPlural.lastIndex = 0;
	var result = reGetStringPlural.exec(data);
	while (result && result.length > 1 && result[2]) {
		var preResource = {};
		reGetStringPluralDouble.lastIndex = 0;
		var extraction = reGetStringPluralDouble.exec(result[2]);
		while (extraction && extraction.length > 1 && extraction[1] && extraction[3]){
			preResource[extraction[1]] = extraction[3];
			extraction = reGetStringPluralDouble.exec(result[2]);
		}
		reGetStringPluralSingle.lastIndex = 0;
		var extraction = reGetStringPluralSingle.exec(result[2]);
		while (extraction && extraction.length > 1 && extraction[1] && extraction[3]){
			preResource[extraction[1]] = extraction[3];
			extraction = reGetStringPluralSingle.exec(result[2]);
		}
		if (preResource['one']){
			var r = new ResourcePlural({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				autoKey: true,
				pathName: this.pathName,
				state: "new",
				datatype: "ruby",
				source: preResource['one'],
				key: this.makeKeyUnescaped(preResource['one'])
			});
			for (var i = 0; i < Object.keys(preResource).length; i++){
				var k = Object.keys(preResource)[i];
				r.addString(k, preResource[k]);
			}
			this.set.add(r);
		} else {
			logger.warn("Warning: ruby plural resources must have key :one");
			logger.warn(result[0]);
		}
		result = reGetStringPlural.exec(data); // for safety
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
