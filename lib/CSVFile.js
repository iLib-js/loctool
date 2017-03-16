/*
 * CSVFile.js - plugin to extract resources from a CSV source code file
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var utils = require("./utils.js");
var ContextResourceString = require("./ContextResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.CSVFile");

/**
 * Create a new CSV file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var CSVFile = function(options) {
	if (!options) return;
	
	this.project = options.project;
	this.pathName = options.pathName;
	
	this.rowSeparator = options.rowSeparator || '\n';
	this.columnSeparator = options.columnSeparator || ',';
	
	this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

function splitIt(line, separator) {
	// take care of the escaped separators first
	var escaped = line.replace("\\" + separator, "%comma%");

	var re = new RegExp('\\s*("(([^"]|\\\\")*)"|([^' + separator + ']|\\\\' + separator + ')*)\\s*(' + separator + '|$)', "g");
	var result, results = [];
	
	while (re.lastIndex < line.length && (result = re.exec(escaped)) !== null) {
		if (result[1]) {
			results.push(result[2] || result[1]);
		} else {
			results.push("");
		}
	}

	// put the escaped separators back again and unescape them
	return results.map(function(entry) { 
		return entry.replace("%comma%", separator); 
	});
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
CSVFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	
	var lines = data.split(this.rowSeparator);
	
	// assume the first record has the names of the columns in it
	var names = splitIt(lines[0], this.columnSeparator);
	this.names = names;
	lines = lines.slice(1);
	
	this.records = lines.map(function(line) {
		var fields = splitIt(line, this.columnSeparator);
		var json = {};
		fields.forEach(function(field, i) {
			json[names[i]] = field;
		});
		
		return json;
	}.bind(this));
	
	
	/*
		var r = new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: result[4],
			source: CSVFile.cleanString(result[2]),
			pathName: this.pathName,
			state: "new",
			comment: comment,
			datatype: "CSV"
		});
		this.set.add(r);
	*/
};

/**
 * Extract all the localizable strings from the CSV file and add them to the
 * project's translation set.
 */
CSVFile.prototype.extract = function() {
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
 * Return the set of resources found in the current CSV file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current CSV file.
 */
CSVFile.prototype.getTranslationSet = function() {
	return this.set;
}

CSVFile.prototype.localize = function() {};

CSVFile.prototype.write = function() {
	var data = this.names.join(this.columnSeparator) + this.rowSeparator + this.records.map(function(record) {
		return this.names.map(function(name) {
			return record[name];
		}).join(this.columnSeparator);
	}.bind(this)).join(this.rowSeparator);
	
	if (data) {
		fs.writeFileSync(this.pathName, data, "utf-8");
	}
};

module.exports = CSVFile;
