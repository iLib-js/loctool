/*
 * AndroidResourceFile.js - represents an Android strings.xml resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var xml2json = require('xml2json');
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidResourceFile");

/**
 * Read the given xml file and convert it to json.
 * 
 * @private
 * @param pathName path to load
 * @returns a javascript object containing the same information as the xml file
 */
function readResFile(pathName) {
	var xml = fs.readFileSync(pathName, "utf8");
	return xml2json.toJson(xml, {object: true});
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
var AndroidResourceFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.type = props.type;
		this.locale = props.locale;
		this.context = props.context;
	}
	
	this.resources = [];
	this.dirty = false;
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
AndroidResourceFile.prototype.extract = function() {
	if (this.pathName) {
		this.contents = readResFile(this.pathName);
		if (!this.contents.resources) {
			logger.debug(this.pathName + " is not a resource file, skipping.");
			return;
		}
		
		this._parsePath(); // get the locale and context to use while making the resource instances below
		
		var resources = this.contents.resources,
			locale = this.getLocale().getSpec();
		
		if (resources.string) {
			var strArr = ilib.isArray(resources.string) ? resources.string : [resources.string];
			
			for (var i = 0; i < strArr.length; i++) {
				logger.trace("Adding string resource " + JSON.stringify(strArr[i]) + " locale " + locale);
				var res = new ResourceString({
					key: strArr[i].name,
					source: strArr[i].$t,
					pathName: this.pathName,
					locale: locale,
					context: this.context,
					project: this.project.getProjectId()
				});
				if (typeof(strArr[i].formatted) !== "undefined") {
					res.formatted = strArr[i].formatted;
				}
				
				this.resources.push(res);
			};
		}
		
		if (resources["string-array"]) {
			var arrays = ilib.isArray(resources["string-array"]) ? resources["string-array"] : [resources["string-array"]];
			logger.debug("Processing " + arrays.length + " string arrays.");
			logger.trace("Arrays is " + JSON.stringify(arrays));
			for (var i = 0; i < arrays.length; i++) {
				strArr = arrays[i];
				var res = new ResourceArray({
					key: strArr.name,
					array: strArr.item,
					pathName: this.pathName,
					locale: locale,
					context: this.context,
					project: this.project.getProjectId()
				});
				logger.trace("new array resource: " + JSON.stringify(strArr, undefined, 4));
				
				this.resources.push(res);
			};
		}

		if (resources.plurals) {
			logger.debug("Processing " + resources.plurals.length + " plural strings.");
			var plurals = ilib.isArray(resources.plurals) ? resources.plurals : [resources.plurals];
			for (var i = 0; i < plurals.length; i++) {
				strArr = plurals[i];
				var items = {};
				strArr.item.forEach(function(item) {
					items[item.quantity] = item.$t;
				});
				var res = new ResourcePlural({
					key: strArr.name,
					strings: items,
					pathName: this.pathName,
					locale: locale,
					context: this.context,
					project: this.project.getProjectId()
				});
				
				this.resources.push(res);
			};
			
			resources.plurals = undefined;
		}
		
		logger.trace("Resources are: " + JSON.stringify(this.resources, undefined, 4));
		logger.trace("AndroidResourceFile: loaded strings in " + this.pathName);
	}
};

var lang = new RegExp("-[a-z][a-z]$");
var reg = new RegExp("-[a-z][a-z]-r[A-Z][A-Z]$");
var script = new RegExp("-[a-z][a-z]-s[A-Z][a-z][a-z][a-z]-r[A-Z][A-Z]$");
var context = new RegExp("values-(.*)$");

/**
 * Parse the suffixes of the resource file for the context and the locale. The 
 * context and locale for Android resource files
 * are given in the suffix of the directory name that the resource file 
 * lives in.<p>
 * 
 * The general syntax of the directory name is:<p>
 * 
 * <pre>
 * "values" [ "-" context ] [ "-" language [ "-r" region]]
 * </pre>
 * 
 * That is, the string values is followed optionally by the context and the
 * language code and the region code for the locale.
 * 
 * @private
 */
AndroidResourceFile.prototype._parsePath = function() {
	if (!this._pathParsed)  {
		var dir = path.dirname(this.pathName || "");
		
		if (!this.locale) {
			// don't have it? Then guess based on the path name
			if (lang.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-2));
				dir = dir.substring(0, dir.length-2);
			}
			if (reg.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-"));
				dir = dir.substring(0, dir.length-6);
			}
			if (script.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-"));
				dir = dir.substring(0, dir.length-6);
			}
			
			if (!this.locale) {
				this.locale = new Locale(this.project.sourceLocale);
			}
		}
		
		if (!this.context) {
			var results = context.exec(dir);
			if (results && results.length) {
				this.context = results[1];
				// dir = dir.substring(0, dir.length-2);
			}
		}
	}
	
	this._pathParsed = true;
};


/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
AndroidResourceFile.prototype.getLocale = function() {
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
AndroidResourceFile.prototype.getContext = function() {
	this._parsePath();
	
	return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 * 
 * @returns {Resource} all of the resources available in this resource file.
 */
AndroidResourceFile.prototype.getAll = function() {
	return this.resources;
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the 
 * context of the resource should match the context of
 * the file.
 * 
 * @param {Resource} res a resource to add to this file
 */
AndroidResourceFile.prototype.addResource = function(res) {
	logger.trace("AndroidResourceFile.addResource: ");
	logger.trace(JSON.stringify(res));
	if (res && res.getProject() === this.project &&
			res.getLocale() === this.locale && 
			res.getContext() === this.context) {
		this.resources.push(res);
		this.dirty = true;
	}
};

/**
 * Write the resource file out to disk again.
 */
AndroidResourceFile.prototype.write = function() {
	if (this.dirty) {
		var dir;
		
		if (!this.pathName) {
			logger.debug("Calculating path name ");
			//console.dir(this);
			
			var valueDir = "values";
			if (this.context) {
				valueDir += "-" + this.context;
			}
			if (this.locale && this.locale.getSpec() !== this.project.sourceLocale) {
				valueDir += "-" + this.locale.replace(/-/, "-r");	
			}
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, "res", valueDir);
			this.pathName = path.join(dir, "strings.xml");
		} else {
			dir = path.dirname(this.pathName);
		}
		
		logger.trace("Writing Android resources for locale " + this.locale);
		
		var json = {resources: {}};

		for (var j = 0; j < this.resources.length; j++) {
			var resource = this.resources[j];
			if (resource instanceof ResourceString) {
				if (!json.resources.string) json.resources.string = [];

				logger.trace("writing translation for " + resource.getId() + " as " + resource.getSource());
				var entry = {
					name: resource.getId()
				};
				if (typeof(resource.formatted) !== "undefined") {
					entry.formatted = resource.formatted;
				}
				entry["$t"] = utils.escapeXml(resource.getTranslation(this.locale));

				json.resources.string.push(entry);
			} else if (resource instanceof ResourceArray) {
				if (!json.resources["string-array"]) json.resources["string-array"] = [];

				var arr = {
					name: resource.getId()
				};

				arr.item = resource.getArray().map(function(item) {
					logger.trace("Mapping " + JSON.stringify(item));
					return {
						"$t": utils.escapeXml(item.getSource() || "")
					};
				});

				json.resources["string-array"].push(arr);
			} else {
				if (!json.resources.plurals) json.resources.plurals = [];

				var arr = {
					name: plurals.getId(),
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
	} else {
		logger.trace("File is not dirty. Skipping.");
	}
};

module.exports = AndroidResourceFile;