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
var PrettyData = require("pretty-data").pd;
var log4js = require("log4js");

var AndroidResourceString = require("./AndroidResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")

var logger = log4js.getLogger("loctool.lib.AndroidResourceFile");

/**
 * Read the given xml file and convert it to json.
 * 
 * @private
 * @param pathName path to load
 * @returns a javascript object containing the same information as the xml file
 */
function readResFile(pathName) {
	
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
		this.context = props.context || undefined;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * Parse an Android Resource XML string and extract the resources.
 * 
 * @param {String} data the string to parse
 */
AndroidResourceFile.prototype.parse = function(data) {
	if (!data) return;
	
	this.contents = xml2json.toJson(data, {object: true});

	if (!this.contents.resources) {
		logger.debug(this.pathName + " is not a resource file, skipping.");
		return;
	}

	var resources = this.contents.resources,
		locale = this.getLocale();

	if (resources.string) {
		var strArr = ilib.isArray(resources.string) ? resources.string : [resources.string];

		for (var i = 0; i < strArr.length; i++) {
			logger.trace("Adding string resource " + " locale " + locale + " " + JSON.stringify(strArr[i]) );
			if (utils.isAndroidResource(strArr[i])) {
				// note that this is a used resource?
				logger.trace("Already resourcified");
			} else {
				var res = new AndroidResourceString({
					key: strArr[i].name,
					source: strArr[i].$t,
					pathName: this.pathName,
					locale: locale,
					context: this.context || undefined,
					project: this.project.getProjectId(),
					comment: strArr[i].i18n,
					dnt: utils.isDNT(strArr[i].i18n),
					datatype: "x-android-layout"
				});
				if (typeof(strArr[i].formatted) !== "undefined") {
					res.formatted = strArr[i].formatted;
				}

				this.set.add(res);
			}
		};
	}

	if (resources["string-array"]) {
		var arrays = ilib.isArray(resources["string-array"]) ? resources["string-array"] : [resources["string-array"]];
		logger.debug("Processing " + arrays.length + " string arrays.");
		logger.trace("Arrays is " + JSON.stringify(arrays));
		for (var i = 0; i < arrays.length; i++) {
			strArr = arrays[i];
			if (!strArr.item || strArr.item.every(function(item) { return utils.isAndroidResource(item);})) {
				// note that this is a used resource?
				logger.trace("Already resourcified");
			} else {
				var res = new ResourceArray({
					key: strArr.name,
					array: strArr.item,
					pathName: this.pathName,
					locale: locale,
					context: this.context || undefined,
					project: this.project.getProjectId(),
					subtype: "string-array",
					comment: strArr.i18n,
					dnt: utils.isDNT(strArr.i18n),
					datatype: "x-android-layout"
				});
				logger.trace("new string-array resource: " + JSON.stringify(strArr, undefined, 4));

				this.set.add(res);
			}
		};
	}

	if (resources.array) {
		var arrays = ilib.isArray(resources.array) ? resources.array : [resources.array];
		logger.debug("Processing " + arrays.length + " string arrays.");
		logger.trace("Arrays is " + JSON.stringify(arrays));
		for (var i = 0; i < arrays.length; i++) {
			strArr = arrays[i];
			if (!strArr.item || strArr.item.every(function(item) { return utils.isAndroidResource(item);})) {
				// note that this is a used resource?
				logger.trace("Already resourcified");
			} else {
				var res = new ResourceArray({
					key: strArr.name,
					array: strArr.item,
					pathName: this.pathName,
					locale: locale,
					context: this.context || undefined,
					project: this.project.getProjectId(),
					subtype: "array",
					comment: strArr.i18n,
					dnt: utils.isDNT(strArr.i18n),
					datatype: "x-android-layout"
				});
				logger.trace("new array resource: " + JSON.stringify(strArr, undefined, 4));
			}

			this.set.add(res);
		};
	}

	if (resources.plurals) {
		logger.debug("Processing " + resources.plurals.length + " plural strings.");
		var plurals = ilib.isArray(resources.plurals) ? resources.plurals : [resources.plurals];
		logger.trace("Plurals are " + JSON.stringify(resources.plurals));

		for (var i = 0; i < plurals.length; i++) {
			strArr = plurals[i];
			logger.trace("Plural " + i + " is " + JSON.stringify(strArr));
			var items = {};
			if (strArr && strArr.item && ilib.isArray(strArr.item)) {
				strArr.item.forEach(function(item) {
					if (typeof(item.$t) === "undefined") {
						logger.error("Syntax error in file " + this.pathName + ", item " + strArr.name + " quantity " + item.quantity + ". Probably have unescaped XML elements in this string.");
					} else {
						items[item.quantity] = item.$t;
					}
				}.bind(this));
				var res = new ResourcePlural({
					key: strArr.name,
					strings: items,
					pathName: this.pathName,
					locale: locale,
					context: this.context || undefined,
					project: this.project.getProjectId(),
					comment: strArr.i18n,
					dnt: utils.isDNT(strArr.i18n),
					datatype: "x-android-layout"
				});

				this.set.add(res);					
			} else {
				logger.trace("Error reading plurals. strArr is " + JSON.stringify(strArr));
			}
		};

		resources.plurals = undefined;
	}

	logger.trace("After loading, resources are: " + JSON.stringify(this.set.getAll(), undefined, 4));
	logger.trace("AndroidResourceFile: loaded strings in " + this.pathName);

	//	mark this set as not dirty after we read it from disk
	//	so we can tell when other code has added resources to it
	this.set.setClean();
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
AndroidResourceFile.prototype.extract = function() {
	if (this.pathName) {
		logger.trace("Attempting to read and parse file " + this.pathName);
		var xml = fs.readFileSync(this.pathName, "utf8");
		
		this._parsePath(); // get the locale and context to use while making the resource instances below
		
		this.parse(xml);
	}
};

//See https://developer.android.com/guide/topics/resources/providing-resources.html table 2 for order of suffices
var lang = new RegExp("\/values-([a-z][a-z])(-.*)?$");
var reg = new RegExp("\/values-([a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var script = new RegExp("\/values-([a-z][a-z])-s([A-Z][a-z][a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var context = new RegExp("\/values-(.*)$");

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
			var match;
			if ((match = script.exec(dir)) && match && match.length > 0) {
				// this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-")).getSpec();
				this.locale = new Locale(match[1], match[3], undefined, match[2]).getSpec();
				this.context = match[4] ? match[4].substring(1) : undefined;
				logger.trace("script");
			} else if ((match = reg.exec(dir)) && match && match.length > 0) {
				//this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-")).getSpec();
				this.locale = new Locale(match[1], match[2]).getSpec();
				this.context = match[3] ? match[3].substring(1) : undefined;
				logger.trace("region");
			} else if ((match = lang.exec(dir)) && match && match.length > 0) {
				// this.locale = new Locale(dir.substring(dir.length-2)).getSpec();
				this.locale = new Locale(match[1]).getSpec();
				this.context = match[2] ? match[2].substring(1) : undefined;
				logger.trace("language");
			} else if ((match = context.exec(dir)) && match && match.length > 0) {
				this.context = match.length > 1 && match[1].length ? match[1] : undefined;
				logger.trace("context");
			}
			
			if (!this.locale) {
				this.locale = this.project.sourceLocale;
			}
		} else if (!this.context) {
			var results = context.exec(dir);
			if (results && results.length) {
				this.context = results[1] || undefined;
				logger.trace("context only");
				// dir = dir.substring(0, dir.length-2);
			}
		}
		logger.trace("_parsePath: locale is " + this.locale + " and context is " + this.context);
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
 * Get the context of this resource file. For Android resource files, this
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
AndroidResourceFile.prototype.addResource = function(res) {
	logger.trace("AndroidResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
	if (res && res.getProject() === this.project.getProjectId() &&
			res.getLocale() === this.locale && 
			res.getContext() === this.context) {
		logger.trace("correct project, context, and locale. Adding.");
		
		// merge the same string from various files into one
		var another = res.clone();
		another.pathName = this.pathName;
		
		this.set.add(another);
	} else {
		if (res) {
			if (res.getProject() !== this.project.getProjectId()) {
				logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
			} else if (res.getLocale() !== this.locale) {
				logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + res.getLocale() + " vs. " + this.locale);
			} else {
				logger.warn("Attempt to add a resource to a resource file with the incorrect context. " + res.getContext() + " vs. " + this.context);
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
AndroidResourceFile.prototype.isDirty = function() {
	return this.set.isDirty();
};

function escapeString(str) {
	return utils.escapeXml(str).replace(/([^\\])'/g, "$1\\'");
}

function escapeDouble(str) {
	if (!str) return undefined;
	return utils.escapeXml(str).replace(/([^\\])"/g, "$1'");
}

// we don't localize resource files
AndroidResourceFile.prototype.localize = function() {};

/**
 * Write the resource file out to disk again.
 */
AndroidResourceFile.prototype.write = function() {
	logger.trace("writing resource file. [" + [this.project.getProjectId(), this.context || "root", this.locale].join(", ") + "]");
	if (this.pathName === "res/values/strings.xml") {
		logger.trace("found it!");
	}
	if (this.set.isDirty()) {
		var dir;
		
		if (!this.pathName) {
			logger.trace("Calculating path name ");
			//console.dir(this);
			
			var valueDir = "values";
			
			if (this.locale !== this.project.sourceLocale) {
				var locale = new Locale(this.locale);
				/*
				if (locale.getScript()) {
					valueDir += "-" + locale.getLanguage() + "-s" + locale.getScript() + "-r" + locale.getRegion();	
				} else {
					if (locale.getRegion()) {
						valueDir += "-" + locale.getLanguage() + "-r" + locale.getRegion();
					} else {
						valueDir += "-" + locale.getLanguage();
					}
				}
				*/
				valueDir += "-" + locale.getLanguage(); // for now
				if (this.locale === this.project.pseudoLocale) {
					valueDir += "-r" + locale.getRegion();
				}
			}
			
			if (this.context) {
				valueDir += "-" + this.context;
			}
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, this.project.options.resourceDirs["java"], valueDir);
		} else {
			dir = path.dirname(this.pathName);
		}
		
		var json = {resources: {
			 "xmlns:tools": "http://schemas.android.com/tools"
		}};

		var resources = this.set.getAll();

		var fileResType = resources[0].resType;
		this.pathName = path.join(dir, fileResType + "s.xml");
		
		logger.info("Writing Android resources for locale " + this.locale + " to file " + this.pathName);
		
		for (var j = 0; j < resources.length; j++) {
			var resource = resources[j];
			if (resource instanceof AndroidResourceString) {
				if (resource.getSource()) {
					if (!json.resources.string) json.resources.string = [];
	
					logger.trace("writing translation for " + resource.getKey() + " as " + resource.getSource());
					var entry = {
						name: resource.getKey(),
						i18n: escapeDouble(resource.comment)
					};
					if (typeof(resource.formatted) !== "undefined") {
						entry.formatted = resource.formatted;
					}
					entry["$t"] = escapeString(resource.getSource());
	
					json.resources.string.push(entry);
				} else {
					logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
				}
			} else if (resource instanceof ResourceArray) {
				var array;
				
				if (resource.subtype === "string-array") {
					if (!json.resources["string-array"]) json.resources["string-array"] = [];
					array = json.resources["string-array"];
				} else {
					if (!json.resources.array) json.resources.array = [];
					array = json.resources.array;
				}

				var items = resource.getArray();
				logger.trace("Writing array " + resource.getKey() + " of size " + items.length);
				var arr = {
					name: resource.getKey(),
					i18n: escapeDouble(resource.comment),
					item: []
				};

				for (var i = 0; i < items.length; i++) {
					var item = items[i];

					logger.trace("Mapping " + JSON.stringify(item || ""));
					
					arr.item.push({
						"$t": escapeString(item || "")
					});
				}

				array.push(arr);
			} else {
				if (!json.resources.plurals) json.resources.plurals = [];

				var plurals = resources[j];
				
				logger.trace("Writing plurals " + plurals.getKey());
				var arr = {
					name: plurals.getKey(),
					i18n: escapeDouble(resource.comment),
					item: []
				};

				for (var quantity in plurals.getPlurals()) {
					arr.item.push({
						quantity: quantity,
						"$t": escapeString(plurals.get(quantity))
					});
				}

				json.resources.plurals.push(arr);
			}
		}
	
		utils.makeDirs(dir);
	
		var xml = '<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(json);
		fs.writeFileSync(this.pathName, PrettyData.xml(xml), "utf8");
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
AndroidResourceFile.prototype.getTranslationSet = function() {
	return this.set;
}

module.exports = AndroidResourceFile;