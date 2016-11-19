/*
 * YamlFile.js - represents an Android strings.xml resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var YAML = require("yaml-js");

var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.YamlFile");

/**
 * Read the given xml file and convert it to json.
 * 
 * @private
 * @param pathName path to load
 * @returns a javascript object containing the same information as the xml file
 */
function readResFile(pathName) {
	var yml = fs.readFileSync(pathName, "utf8");
	return YAML.load(yml);
}

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
var YamlFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.locale = props.locale;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * Parse a yml file and store the resources found in it into the 
 * file's translation set.
 * 
 * @param {String} str the string to parse
 */
YamlFile.prototype.parse = function(str) {
	var locale = this.getLocale(),
		resource,
		yml = YAML.load(str);
	
	for (var key in yml) {
		resource = yml[key];
		logger.trace("Adding string resource " + JSON.stringify(resource) + " locale " + locale);
		var res = new ResourceString({
			key: key,
			source: yml[key],
			pathName: this.pathName,
			locale: locale,
			project: this.project.getProjectId()
		});
		
		this.set.add(res);
	}
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
YamlFile.prototype._parsePath = function() {
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
	if (res && res.getProject() === this.project.getProjectId() &&
			res.getLocale() === this.locale) {
		logger.trace("correct project, context, and locale. Adding.");
		this.set.add(res);
	} else {
		if (res) {
			if (res.getProject() !== this.project.getProjectId()) {
				logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
			} else {
				logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + res.getLocale() + " vs. " + this.locale);
			}
		} else {
			logger.warn("Attempt to add an undefined resource to a resource file.");
		}
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

//we don't localize or write yml resource files
YamlFile.prototype.localize = function() {};

/**
 * Write the resource file out to disk again.
 */
YamlFile.prototype.write = function() {
	logger.trace("writing resource file. [" + [this.project.getProjectId(), this.locale].join(", ") + "]");
	if (this.set.isDirty()) {
		/*
		var dir;
		
		if (!this.pathName) {
			logger.trace("Calculating path name ");
			//console.dir(this);
			
			var valueDir = "values";
			if (this.context) {
				valueDir += "-" + this.context;
			}
			if (this.locale !== this.project.sourceLocale) {
				valueDir += "-" + this.locale.replace(/-/, "-r");	
			}
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, "res", valueDir);
		} else {
			dir = path.dirname(this.pathName);
		}
		
		logger.debug("Writing Android resources for locale " + this.locale + " to file " + this.pathName);
		
		var json = {resources: {}};

		var resources = this.set.getAll();

		var fileResType = resources[0].resType;
		this.pathName = path.join(dir, fileResType + "s.xml");
		
		for (var j = 0; j < resources.length; j++) {
			var resource = resources[j];
			if (resource instanceof ResourceString) {
				if (!json.resources.string) json.resources.string = [];

				logger.trace("writing translation for " + resource.getKey() + " as " + resource.getSource());
				var entry = {
					name: resource.getKey()
				};
				if (typeof(resource.formatted) !== "undefined") {
					entry.formatted = resource.formatted;
				}
				entry["$t"] = utils.escapeXml(resource.getSource());

				json.resources.string.push(entry);
			} else if (resource instanceof ResourceArray) {
				if (!json.resources["string-array"]) json.resources["string-array"] = [];

				var arr = {
					name: resource.getKey()
				};

				arr.item = resource.getArray().map(function(item) {
					logger.trace("Mapping " + JSON.stringify(item));
					return {
						"$t": utils.escapeXml(item || "")
					};
				});

				json.resources["string-array"].push(arr);
			} else {
				if (!json.resources.plurals) json.resources.plurals = [];

				var arr = {
					name: plurals.getKey(),
					item: []
				};

				for (var quantity in plurals.getQuantities()) {
					arr.item.push({
						quantity: quantity,
						"$t": utils.escapeXml(plurals.get(quantity))
					});
				}

				json.resources.plurals.push(arr);
			}
		}
	
		utils.makeDirs(dir);
	
		var xml = '<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(json);
		fs.writeFileSync(this.pathName, xml, "utf8");
		logger.debug("Wrote string translations to file " + this.pathName);
		*/
	} else {
		logger.debug("File is not dirty. Skipping.");
	}
};

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

module.exports = YamlFile;
