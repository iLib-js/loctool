/*
 * CSVFile.js - plugin to extract resources from a CSV source code file
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
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
	
	this.records = options.records || [];
	this.names = options.names || [];
	this.localizable = new Set(options.localizable);
	
	this.type = options.type;
	
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
 * Make a new key for the given string.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
CSVFile.prototype.makeKey = function(source) {
	// the English source is the key as well with compressed and trimmed whitespace
	return source.
		replace(/\s+/g, " ").
		trim();
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
CSVFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);
	if (!data) {
		this.records = [];
		return;
	}
	
	var lines = data.split(this.rowSeparator);
	
	// assume the first record has the names of the columns in it
	var names = splitIt(lines[0], this.columnSeparator);
	this.names = names;
	lines = lines.slice(1);
	
	this.records = lines.map(function(line) {
		var fields = splitIt(line, this.columnSeparator);
		var json = {};
		names.forEach(function(name, i) {
			json[name] = i < fields.length ? fields[i] : "";
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

	if (!this.records) this.records = []; // no file to load, so no records!
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

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
CSVFile.prototype.getLocalizedPath = function(locale) {
	var fullPath = path.join(this.project.root, this.pathName);
	var dirName = path.dirname(fullPath);
	var fileName = path.basename(fullPath);

	var parts = fileName.split(".");

	if (parts.length > 2) {
		if (parts.length > 3 && parts[parts.length-3] === this.project.sourceLocale) {
			parts.splice(parts.length-3, 1, locale);
		} else {
			parts.splice(parts.length-2, 0, locale);
		}
	} else if (parts.length > 1) {
		parts.splice(parts.length-1, 0, locale);
	} else {
		parts.splice(parts.length, 0, locale);
	}
	return path.join(dirName, parts.join("."));
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
CSVFile.prototype.localizeText = function(translations, locale) {
	return this.names.join(this.columnSeparator) + this.rowSeparator + this.records.map(function(record) {
		return this.names.map(function(name) {
			var text = record[name] || "",
				translated = text;
			
			if (text) {
				if (this.localizable.has(name)) {
					if (this.type && locale === this.pseudoLocale && !this.project.settings.nopseudo) {
						translated = this.type.pseudoBundle.getStringJS(text);
					} else {
						var res = translations.getClean(
							ResourceString.cleanHashKey(
									this.project.getProjectId(), locale, this.makeKey(text), "x-csv"));
						if (res) {
							translated = res.getSource();
						} else {
							if (this.type) {
								logger.trace("New string found: " + text);
								this.type.newres.add(new ResourceString({
									project: this.project.getProjectId(),
									locale: this.project.sourceLocale,
									key: this.makeKey(text),
									autoKey: true,
									source: text,
									pathName: this.pathName,
									state: "new",
									datatype: "x-csv",
									origin: "source"
								}));
								this.type.newres.add(new ResourceString({
									project: this.project.getProjectId(),
									locale: locale,
									key: this.makeKey(text),
									autoKey: true,
									source: text,
									pathName: this.pathName,
									state: "new",
									datatype: "x-csv",
									origin: "target"
								}));
								translated = this.project.settings.nopseudo && locale === this.project.pseudoLocale ? text : this.type.pseudoBundle.getStringJS(text);
							} else {
								translated = text;
							}
						}
					}
				}
			}
			
			return translated.indexOf(this.columnSeparator) > -1 ? '"' + translated + '"' : translated;
		}.bind(this)).join(this.columnSeparator);
	}.bind(this)).join(this.rowSeparator);
};

/**
 * Localize the contents of this csv file and write out the
 * localized csv file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
CSVFile.prototype.localize = function(translations, locales) {
	// don't localize if there are no records
	if (this.records) {
		for (var i = 0; i < locales.length; i++) {
			var pathName = this.getLocalizedPath(locales[i]);
			logger.info("Writing file " + pathName);
			fs.writeFileSync(pathName, this.localizeText(translations, locales[i]), "utf-8");
		}
	} else {
		logger.debug(this.pathName + ": No records, no localize");
	}
};

CSVFile.prototype.write = function() {
	var data = this.localizeText(undefined, this.project.sourceLocale);
	
	if (data) {
		fs.writeFileSync(this.pathName, data, "utf-8");
	}
};

module.exports = CSVFile;
