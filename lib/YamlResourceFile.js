/*
 * YamlResourceFile.js - represents a yaml resource file
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

var logger = log4js.getLogger("loctool.lib.YamlResourceFile");

/**
 * @class Represents an Android resource file.
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
var YamlResourceFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.locale = props.locale;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * @private
 */
YamlResourceFile.prototype._parseResources = function(prefix, obj, set) {
	for (var key in obj) {
		if (typeof(obj[key]) === "object") {
			var pre = prefix ? prefix + "@" : "";
			this._parseResources(pre + key.replace(/@/g, "\\@"), obj[key], set);
		} else {
			var resource = obj[key];
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
			
			set.add(res);
		}
	}
}

var localeSpec = /^[a-z][a-z][a-z]?([-_][A-Z][a-z][a-z][a-z])?([-_][A-Z][A-Z])?$/;

/**
 * Parse a yml file and store the resources found in it into the 
 * file's translation set.
 * 
 * @param {String} str the string to parse
 */
YamlResourceFile.prototype.parse = function(str) {
	var parsed = jsyaml.safeLoad(str);
	var top = parsed;
	for (var key in parsed) {
		if (localeSpec.exec(key)) {
			var l = new Locale(key.replace(/_/g, "-"));
			if (Locale.a1toa3langmap[l.getLanguage()] && Locale.a2toa3regmap[l.getRegion()]) {
				this.locale = l.getSpec();
				top = parsed[key];
				break;
			}
		}
	}
	this._parseResources(undefined, top, this.set);
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
YamlResourceFile.prototype.extract = function() {
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

var lang = new RegExp("[a-z][a-z]$");
var reg = new RegExp("[a-z][a-z]-[A-Z][A-Z]$");
var script = new RegExp("[a-z][a-z]-[A-Z][a-z][a-z][a-z]-[A-Z][A-Z]$");

/**
 * Parse the file name of the yaml file for the locale. The 
 * locale for yaml files is given in the base name of the 
 * yaml file.<p>
 * 
 * The general syntax of the file name is:<p>
 * 
 * <pre>
 *    dir / [ language ["-" script] [ "-" region]] ".yml"
 * </pre>
 * 
 * That is, the directory is followed by the
 * language code and an optional script and region code and the
 * ".yml" suffix.
 * 
 * @private
 */
YamlResourceFile.prototype._parsePath = function() {
	if (!this._pathParsed && this.pathName)  {
		var base = path.basename(this.pathName);
		
		if (!this.locale) {
			// don't have it? Then guess based on the path name
			if (lang.test(base)) {
				this.locale = new Locale(base.substring(base.length-2)).getSpec();
			}
			if (reg.test(base)) {
				this.locale = new Locale(base.substring(base.length-5)).getSpec();
			}
			if (script.test(base)) {
				this.locale = new Locale(base.substring(base.length-10)).getSpec();
			}
			
			if (!this.locale) {
				this.locale = this.project.sourceLocale;
			}
		}
	}
	
	this._pathParsed = true;
};


/**
 * Get the path name of this resource file. 
 * 
 * @returns {String} the path name to this file
 */
YamlResourceFile.prototype.getPath = function() {
	return this.pathName;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
YamlResourceFile.prototype.getLocale = function() {
	this._parsePath();
	
	return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
YamlResourceFile.prototype.getContext = function() {
	return "";
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 * 
 * @returns {Resource} all of the resources available in this resource file.
 */
YamlResourceFile.prototype.getAll = function() {
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
YamlResourceFile.prototype.addResource = function(res) {
	logger.trace("YamlResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
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
YamlResourceFile.prototype.addAll = function(resources) {
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
YamlResourceFile.prototype.isDirty = function() {
	return this.set.isDirty();
};

//we don't localize yml resource files
YamlResourceFile.prototype.localize = function() {};

/**
 * Generate the content of the resource file.
 * 
 * @private
 * @returns {String} the content of the resource file
 */
YamlResourceFile.prototype.getContent = function() {
	var json = {};
	
	if (this.set.isDirty()) {
		var resources = this.set.getAll();

		for (var j = 0; j < resources.length; j++) {
			var resource = resources[j];
			if (resource.getSource()) {
				logger.trace("writing translation for " + resource.getKey() + " as " + resource.getSource());
				var locale = resource.getLocale().replace(/-/g, "_");
				if (!json[locale]) {
					json[locale] = {};
				}
				var key = resource.sourceHash || resource.getKey();
				json[locale][key] = resource.getSource();
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

/**
 * Write the resource file out to disk again.
 */
YamlResourceFile.prototype.write = function() {
	logger.trace("writing yaml resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
	if (this.set.isDirty()) {
		var dir;
		if (!this.pathName) {
			logger.trace("Calculating path name ");
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, this.project.options.resourceDirs["yml"]);
			this.pathName = path.join(dir, this.locale + ".yml");
		} else {
			dir = path.dirname(this.pathName);
		}
		
		logger.info("Writing ruby resources for locale " + this.locale + " to file " + this.pathName);
	
		utils.makeDirs(dir);
	
		var yml = this.getContent();
		fs.writeFileSync(this.pathName, yml, "utf8");
		logger.debug("Wrote string translations to file " + this.pathName);
	} else {
		logger.debug("File " + this.pathName + " is not dirty. Skipping.");
	}
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
YamlResourceFile.prototype.getTranslationSet = function() {
	return this.set;
}

module.exports = YamlResourceFile;
