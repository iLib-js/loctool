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
			console.log(this.pathName + " is not a resource file, skipping.");
			return;
		}
		
		var resources = this.contents.resources,
			locale = this.getLocale().getSpec();
		
		if (resources.string) {
			var strArr = ilib.isArray(resources.string) ? resources.string : [resources.string];
			
			for (var i = 0; i < strArr.length; i++) {
				//console.log("Adding string resource " + JSON.stringify(strArr[i]) + " locale " + locale);
				var res = new ResourceString({
					id: strArr[i].name,
					source: strArr[i].$t,
					pathName: this.pathName,
					locale: locale
				});
				if (typeof(strArr[i].formatted) !== "undefined") {
					res.formatted = strArr[i].formatted;
				}
				
				this.resources.push(res);
			};
		}
		
		if (resources["string-array"]) {
			var arrays = ilib.isArray(resources["string-array"]) ? resources["string-array"] : [resources["string-array"]];
			console.log("Processing " + arrays.length + " string arrays.");
			//console.log("Arrays is " + JSON.stringify(arrays));
			for (var i = 0; i < arrays.length; i++) {
				strArr = arrays[i];
				var res = new ResourceArray({
					id: strArr.name,
					array: strArr.item,
					pathName: this.pathName,
					locale: locale
				});
				//console.log("new array resource: " + JSON.stringify(strArr, undefined, 4));
				
				this.resources.push(res);
			};
		}

		if (resources.plurals) {
			console.log("Processing " + resources.plurals.length + " plural strings.");
			var plurals = ilib.isArray(resources.plurals) ? resources.plurals : [resources.plurals];
			for (var i = 0; i < plurals.length; i++) {
				strArr = plurals[i];
				var items = {};
				strArr.item.forEach(function(item) {
					items[item.quantity] = item.$t;
				});
				var res = new ResourcePlural({
					id: strArr.name,
					strings: items,
					pathName: this.pathName,
					locale: locale
				});
				
				this.resources.push(res);
			};
			
			resources.plurals = undefined;
		}
		
		//console.log("Resources are: " + JSON.stringify(this.resources, undefined, 4));
		//console.log("AndroidResourceFile: loaded strings in " + this.pathName);
	}
};

var lang = new RegExp("-[a-z][a-z]$");
var reg = new RegExp("-[a-z][a-z]-r[A-Z][A-Z]$");
var script = new RegExp("-[a-z][a-z]-s[A-Z][a-z][a-z][a-z]-r[A-Z][A-Z]$");

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
AndroidResourceFile.prototype.getLocale = function() {
	if (!this.locale) {
		// don't have it? Then guess based on the path name
		var dir = path.dirname(this.pathName);
	
		if (lang.test(dir)) {
			this.locale = new Locale(dir.substring(dir.length-2));
		}
		if (reg.test(dir)) {
			this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-"));
		}
		if (script.test(dir)) {
			this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-"));
		}
		
		if (!this.locale) {
			this.locale = new Locale(this.project.sourceLocale);
		}
	}
	
	return this.locale;
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
 * should correspond to the locale of the file.
 * 
 * @param {Resource} res a resource to add to this file
 */
AndroidResourceFile.prototype.addResource = function(res) {
	if (res.getLocale() == this.getLocale()) {
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
			//console.log("Calculating path name ");
			//console.dir(this);
			
			var valueDir = "values-" + this.locale.replace(/-/, "-r");
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, "res", valueDir);
			this.pathName = path.join(dir, "strings.xml");
		} else {
			dir = path.dirname(this.pathName);
		}
		
		console.log("Writing Android resources for locale " + this.locale);
		
		var json = {resources: {}};

		for (var j = 0; j < this.resources.length; j++) {
			var resource = this.resources[j];
			if (resource instanceof ResourceString) {
				if (!json.resources.string) json.resources.string = [];

				//console.log("writing translation for " + resource.getId() + " as " + resource.getSource());
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
					console.log("Mapping " + JSON.stringify(item));
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
		console.log("Wrote string translations to file " + this.pathName);
	} else {
		console.log("File is not dirty. Skipping.");
	}
};

module.exports = AndroidResourceFile;