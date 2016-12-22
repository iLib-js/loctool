/*
 * YamlFile.js - represents a yaml source file that needs to be localized.
 * This is different than a yaml resource file which is the destination
 * yaml for ruby and haml strings. This file represents a yaml file which 
 * is the source for new strings to localize and which is localized by
 * writing out a parallel yml file with the same structure, but translated
 * content.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
//var YAML = require("yaml-js");
//var yamljs = require("yamljs");
var jsyaml = require("js-yaml");

var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ContextResourceString = require("./ContextResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.YamlFile");

/**
 * @class Represents a yaml source file.
 * The props may contain any of the following properties:
 * 
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var YamlFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.locale = props.locale;
	}
	
	this.locale = this.locale || (this.project && this.project.sourceLocale) || "en-US";
	
	this.set = new TranslationSet(this.locale);
};

/**
 * @private
 */
YamlFile.prototype._parseResources = function(prefix, obj, set) {
	for (var key in obj) {
		if (typeof(obj[key]) === "object") {
			var pre = prefix ? prefix + "@" : "";
			this._parseResources(pre + key.replace(/@/g, "\\@"), obj[key], set);
		} else {
			var resource = obj[key];
			if (resource && typeof(resource) === "string" && (resource.indexOf(' ') > -1 || resource.indexOf('_') === -1)) {
				logger.trace("Adding string resource " + JSON.stringify(resource) + " locale " + this.getLocale());
				var res = new ContextResourceString({
					key: key,
					source: resource,
					pathName: this.pathName,
					locale: this.getLocale(),
					project: this.project.getProjectId(),
					datatype: "x-yaml",
					context: prefix
				});
			}
			
			set.add(res);
		}
	}
}

/**
 * Parse a yml file and store the resources found in it into the 
 * file's translation set.
 * 
 * @param {String} str the string to parse
 */
YamlFile.prototype.parse = function(str) {
	this.json = jsyaml.safeLoad(str);
	this._parseResources(undefined, this.json, this.set);
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
YamlFile.prototype.extract = function() {
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

	// mark this set as not dirty after we read it from disk
	// so we can tell when other code has added resources to it
	this.set.setClean();
};

/**
 * Get the path name of this resource file. 
 * 
 * @returns {String} the path name to this file
 */
YamlFile.prototype.getPath = function() {
	return this.pathName;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getLocale = function() {
	return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getContext = function() {
	return "";
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 * 
 * @returns {Resource} all of the resources available in this resource file.
 */
YamlFile.prototype.getAll = function() {
	return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the 
 * context of the resource should match the context of
 * the file.
 * 
 * @param {Resource} res a resource to add to this file
 */
YamlFile.prototype.addResource = function(res) {
	logger.trace("YamlFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
	if (res && res.getProject() === this.project.getProjectId()) {
		logger.trace("correct project. Adding.");
		this.set.add(res);
	} else {
		if (res) {
			logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
		} else {
			logger.warn("Attempt to add an undefined resource to a resource file.");
		}
	}
};


/**
 * Add every resource in the given array to this file. 
 * @param {Array.<Resource>} resources an array of resources to add
 * to this file
 */
YamlFile.prototype.addAll = function(resources) {
	if (resources && resources.length) {
		resources.forEach(function(resource) {
			this.addResource(resource);
		}.bind(this));
	}
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 * 
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
YamlFile.prototype.isDirty = function() {
	return this.set.isDirty();
};

/**
 * Generate the content of the resource file.
 * 
 * @private
 * @returns {String} the content of the resource file
 */
YamlFile.prototype.getContent = function() {
	var json = {};
	
	if (this.set.isDirty()) {
		var resources = this.set.getAll();

		for (var j = 0; j < resources.length; j++) {
			var resource = resources[j];
			if (resource.getSource()) {
				logger.trace("writing translation for " + resource.getKey() + " as " + resource.getSource());
				var key = resource.sourceHash || resource.getKey();
				var context = resource.getContext();
				var parent = json;
				if (context && context.length) {
					var parts = context.split(/@/g);
					for (var i = 0; i < parts.length; i++) {
						if (!parent[parts[i]]) {
							parent[parts[i]] = {};
						}
						parent = parent[parts[i]];
					}
				}
				parent[key] = resource.getSource();
			} else {
				logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
			}	
		}
	}
	
	logger.trace("json is " + JSON.stringify(json));
	
	// now convert the json back to yaml
	// return yamljs.stringify(json, 4, 2, {});
	return jsyaml.safeDump(json, {
		schema: jsyaml.FAILSAFE_SCHEMA,
		noCompatMode: true,
		linewidth: -1
	});
};

//we don't write to yaml source files
YamlFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current Android
 * resource file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
YamlFile.prototype.getTranslationSet = function() {
	return this.set;
}

/**
 * Return the location on disk where the version of this file localized 
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
YamlFile.prototype.getLocalizedPath = function(locale) {
	var fullPath = path.join(this.project.root, this.pathName);
	var dirName = path.dirname(fullPath);
	var fileName = path.basename(fullPath);
	var fullDir = path.join(dirName, locale);
	
	utils.makeDirs(fullDir);
	
	return path.join(fullDir, fileName);
};

/**
 * @private
 */
YamlFile.prototype._localizeContent = function(prefix, obj, translations, locale) {
	var ret = {};
	
	for (var key in obj) {
		if (typeof(obj[key]) === "object") {
			var pre = prefix ? prefix + "@" : "";
			ret[key] = this._localizeContent(pre + key.replace(/@/g, "\\@"), obj[key], translations, locale);
		} else {
			var resource = obj[key];
			if (resource && typeof(resource) === "string" && (resource.indexOf(' ') > -1 || resource.indexOf('_') === -1)) {
				logger.trace("Localizing string resource " + JSON.stringify(resource) + " locale " + locale);
				var res = translations.get(ContextResourceString(this.project.getProjectId(), prefix, locale, key));
				if (res) {
					logger.trace("Translation: " + res.getSource());
					ret[key] = res.getSource();
				} else {
					logger.trace("Missing translation");
					ret[key] = resource;
				}
			} else {
				ret[key] = obj[key].toString();
			}
		}
	}
	
	return ret;
}

/**
 * Localize the text of the current file to the given locale and return 
 * the results.
 * 
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
YamlFile.prototype.localizeText = function(translations, locale) {
	var output = "";
	if (this.json) {
		var localizedJson = this._localizeContent(undefined, this.json, translations, locale);
		if (localizedJson) {
			logger.trace("Localized json is: " + JSON.stringify(localizedJson, undefined, 4));
			
			output = jsyaml.safeDump(localizedJson, {
				schema: jsyaml.FAILSAFE_SCHEMA,
				noCompatMode: true,
				linewidth: -1
			});
		}
	}
	return output;
};

/**
 * Localize the contents of this template file and write out the
 * localized template file to a different file path.
 * 
 * @param {TranslationSet} translations the current set of 
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
YamlFile.prototype.localize = function(translations, locales) {
	// don't localize if there is no text
	if (this.json) {
		for (var i = 0; i < locales.length; i++) {
			var pathName = this.getLocalizedPath(locales[i]);
			logger.info("Writing file " + pathName);
			fs.writeFileSync(pathName, this.localizeText(translations, locales[i]), "utf-8");
		}
	} else {
		logger.debug(this.pathName + ": No json, no localize");
	}
};

module.exports = YamlFile;
