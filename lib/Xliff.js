/*
 * Xliff.js - model an xliff file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");
var xml2json = require("xml2json");
var PrettyData = require("pretty-data").pd;
var ilib = require("ilib");

var TranslationSet = require("./TranslationSet.js");
var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");

var logger = log4js.getLogger("loctool.lib.Xliff");

/**
 * @class A class that represents an translation unit in an
 * xliff 1.2 file. The options may be undefined, which represents 
 * a new, clean TranslationUnit instance. The options object may also 
 * be an object with the following properties:
 * 
 * <ul>
 * </ul>
 * <li><i>source</i> - source text for this unit (required)
 * <li><i>sourceLocale</i> - the source locale spec for this unit (required)
 * <li><i>targetLocale</i> - the target locale spec for this unit (required)
 * <li><i>key</i> - the unique resource key for this translation unit (required)
 * <li><i>file</i> - path to the original source code file that contains the 
 * source text of this translation unit (required)
 * <li><i>project</i> - the project that this string/unit is part of
 * <li><i>target</i> - the target text for this unit (optional)
 * <li><i>resType</i> - type of this resource (string, array, plural) (optional)
 * <li><i>state</i> - the state of the current unit (optional)
 * <li><i>comment</i> - the translator's comment for this unit (optional)
 * 
 * If the required properties are not given, the constructor throws an exception.<p>
 * 
 * For newly extracted strings, there is no target text yet. There must be a target 
 * locale for the translators to use when creating new target text, however. This
 * means that there may be multiple translation units in a file with the same
 * source locale and no target text, but different target locales.
 * 
 * @constructor
 * @param {Object|undefined} options options to 
 * initialize the unit, or undefined for a new empty unit
 */
var TranslationUnit = function TranslationUnit(options) {
	if (options) {
		var everything = ["source", "sourceLocale", "key", "file", "project"].every(function(p) {
			return typeof(options[p]) !== "undefined";
		});
		
		if (!everything) {
			var missing = ["source", "sourceLocale", "key", "file", "project"].filter(function(p) {
				return typeof(options[p]) === "undefined";
			});
			logger.info("options is " + JSON.stringify(options));
			throw new Error("Missing required parameters in the TranslationUnit constructor: " + missing.join(", "));
		}
		
		for (var p in options) {
			this[p] = options[p];
		}
	}
};

/**
 * Clone the current unit and return the clone.
 * @returns {TranslationUnit} a clone of the current unit.
 */
TranslationUnit.prototype.clone = function() {
	return new TranslationUnit(this);
};

/**
 * @class A class that represents an xliff 1.2 file.
 * The options may be undefined, which represents a new,
 * clean Xliff instance. The options object may also 
 * be an object with the following properties:
 * 
 * <ul>
 * <li><i>path</i> - the path to the xliff file on disk
 * <li><i>tool-id</i> - the id of the tool that saved this xliff file
 * <li><i>tool-name</i> - the full name of the tool that saved this xliff file
 * <li><i>tool-version</i> - the version of the tool that save this xliff file
 * <li><i>tool-company</i> - the name of the company that made this tool
 * <li><i>copyright</i> - a copyright notice that you would like included into the xliff file
 * <li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
 * </ul>
 * 
 * @constructor
 * @param {Array.<Object>|undefined} options options to 
 * initialize the file, or undefined for a new empty file
 */
var Xliff = function Xliff(options) {
	if (options) {
		this["tool-id"] = options["tool-id"];
		this["tool-name"] = options["tool-name"];
		this["tool-version"] = options["tool-version"];
		this["tool-company"] = options["tool-company"];
		this.copyright = options.copyright;
		this.path = options.path;
		this.sourceLocale = options.sourceLocale;
	}

	this.sourceLocale = this.sourceLocale || "en-US";
	
	// place to store the translation units
	this.tu = [];
	
	this.ts = new TranslationSet(this.sourceLocale);
};

/**
 * Get the path to this xliff file.
 * @returns {String|undefined} the path to this xliff file
 */
Xliff.prototype.getPath = function() {
	return this.path;
};

/**
 * Set the path to this xliff file.
 * @param {String} the path to the xliff file
 */
Xliff.prototype.setPath = function(pathName) {
	this.path = pathName;
};

/**
 * Get the translation units in this xliff.
 * 
 * @returns {Array.<Object>} the translation units in this xliff
 */
Xliff.prototype.getTranslationUnits = function() {
	return this.tu;
};

/**
 * Add this translation unit to this xliff.
 * 
 * @param {TranslationUnit} unit the translation unit to add to this xliff
 */
Xliff.prototype.addTranslationUnit = function(unit) {
	logger.trace("Xliff " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));
	this.tu.push(unit);
};


/**
 * Add translation units to this xliff.
 * 
 * @param {Array.<Object>} files the translation units to add to this xliff
 */
Xliff.prototype.addTranslationUnits = function(units) {
	this.tu = this.tu.concat(units);
};

/**
 * Add a resource to this xliff file. If a resource
 * with the same file, locale, context, and key already 
 * exists in this xliff file, it will be 
 * replaced instead of adding this unit to the file.
 * 
 * @param {Resource} res a resource to add
 */
Xliff.prototype.addResource = function(res) {
	if (!res) return;
	
	this.ts.add(res);
};

/**
 * Add a set of resources to this xliff file. If a resource
 * with the same file, locale, context, and key already 
 * exists in this xliff file, it will be 
 * replaced instead of adding this unit to the file.
 * 
 * @param {TranslationSet} set a set of resources to add
 */
Xliff.prototype.addSet = function(set) {
	if (!set) return;
	
	this.ts.addSet(set);
};

/**
 * Get the resources from this xliff file with the
 * given criteria. If the criteria object is undefined or empty,
 * then all resources are returned. If the criteria parameter
 * is an object, then only resources with properties
 * that match the properties and values in the criteria
 * object are returned.
 * 
 * @param {Object|undefined} criteria an object with criteria for
 * selecting which resources to retrieve
 * @return {Array.<Resource>} an array of resources that match 
 * the given criteria.
 */
Xliff.prototype.getResources = function(criteria) {
	var set = this.getTranslationSet();
	if (!criteria) return set.getAll();
	return set.getBy(criteria);
};

/**
 * Return the translation set containing all of the resources in
 * this xliff file.
 * 
 * @returns {TranslationSet} the set of all resources in this file
 */
Xliff.prototype.getTranslationSet = function() {
	// if there are translation units, convert them to
	// resources in a translation set before returning the set.
	if (this.tu) {
		for (var j = 0; j < this.tu.length; j++) {
			var comment, tu = this.tu[j];
			switch (tu.resType) {
			case "string":
				this.ts.add(new ResourceString({
					pathName: tu.file,
					locale: tu.sourceLocale,
					project: tu.project,
					id: tu.id,
					key: tu.key,
					source: tu.source,
					context: tu.context,
					comment: tu.comment,
					origin: "source"
				}));
				if (tu.target) {
					this.ts.add(new ResourceString({
						pathName: tu.file,
						locale: tu.targetLocale,
						project: tu.project,
						id: tu.id,
						key: tu.key,
						source: tu.target,
						context: tu.context,
						comment: tu.comment,
						origin: "target"
					}));
				}
				break;
				
			case "array":
				var arr;
				var res = this.ts.get(tu.key, "array", tu.context, tu.sourceLocale, tu.project);
				if (res) {
					res.addString(tu.ordinal, tu.source);
				} else {
					arr = [];
					arr[tu.ordinal] = tu.source;

					this.ts.add(new ResourceArray({
						pathName: tu.file,
						locale: tu.sourceLocale,
						project: tu.project,
						id: tu.id,
						key: tu.key,
						array: arr,
						context: tu.context,
						comment: tu.comment,
						origin: "source"
					}));
				}
				
				if (tu.target) {
					var res = this.ts.get(tu.key, "array", tu.context, tu.targetLocale, tu.project);
					
					if (res) {
						res.addString(tu.ordinal, tu.target);
					} else {
						arr = [];
						arr[ordinal] = tu.target;

						this.ts.add(new ResourceArray({
							pathName: tu.file,
							locale: tu.targetLocale,
							project: tu.project,
							id: tu.id,
							key: tu.key,
							array: arr,
							context: tu.context,
							comment: tu.comment,
							origin: "target"
						}));
					}
				}
				break;
				
			case "plural":
				var strings = {};
				var res = this.ts.get(tu.key, "plural", tu.context, tu.sourceLocale, tu.project);
				if (res) {
					res.addString(tu.quantity, tu.source);
				} else {
					strings[tu.quantity] = tu.source;

					this.ts.add(new ResourcePlural({
						pathName: tu.file,
						locale: tu.sourceLocale,
						project: tu.project,
						id: tu.id,
						key: tu.key,
						strings: strings,
						context: tu.context,
						comment: tu.comment,
						origin: "source"
					}));
				}
				
				if (tu.target) {
					var res = this.ts.get(tu.key, "plural", tu.context, tu.targetLocale, tu.project);
					
					if (res) {
						res.addString(tu.quantity, tu.target);
					} else {
						strings[tu.quantity] = tu.target;

						this.ts.add(new ResourcePlural({
							pathName: tu.file,
							locale: tu.targetLocale,
							project: tu.project,
							id: tu.id,
							key: tu.key,
							strings: strings,
							context: tu.context,
							comment: tu.comment,
							origin: "target"
						}));
					}
				}
				break;
			}
		}
		
		this.tu = undefined;
	}
	
	return this.ts;
};

/**
 * Return the number of translation units in this xliff
 * file.
 * 
 * @return {number} the number of translation units in this xliff file
 */
Xliff.prototype.size = function() {
	return this.ts.size();
};

/**
 * Serialize this xliff instance to a string that contains
 * the xliff format xml text.
 * 
 * @return {String} the current instance encoded as an xliff format
 * xml text
 */
Xliff.prototype.serialize = function() {
	var units = [];
	var sourceUnitHash = {};
	
	function makeHashKey(res, ordinal, quantity) {
		return 	[res.getPath(), res.getKey(), res.getContext(), res.getProject(), ordinal, quantity].join("_");
	}
	
	var json = {
		xliff: {
			version: "1.2"
		}
	};

	if (this.ts.size() > 0) {
		// first convert the resources into translation units
		var resources = this.ts.getAll();
		
		// find all the source resources first
		for (var i = 0; i < resources.length; i++) {
			var res = resources[i];
			if (res.origin === "source" || this.sourceLocale === res.getLocale()) {
				switch (res.resType) {
				case "string":
					sourceUnitHash[makeHashKey(res)] = new TranslationUnit({
						source: res.getSource(),
						sourceLocale: res.getLocale(),
						key: res.getKey(),
						file: res.getPath(),
						project: res.getProject(),
						resType: "string",
						state: res.getState(),
						comment: res.getComment(),
						context: res.getContext(),
						id: res.getId()
					});
					break;
					
				case "array":
					var arr = res.getArray();
					for (var j = 0; j < arr.length; j++) {
						sourceUnitHash[makeHashKey(res, j)] = new TranslationUnit({
							source: arr[j],
							sourceLocale: res.getLocale(),
							key: res.getKey(),
							file: res.getPath(),
							project: res.getProject(),
							resType: "array",
							state: res.getState(),
							comment: res.getComment(),
							ordinal: j,
							context: res.getContext(),
							id: res.getId()
						});
					}
					break;
	
				case "plural":
					var plurals = res.getPlurals();
					for (var p in plurals) {
						sourceUnitHash[makeHashKey(res, undefined, p)] = new TranslationUnit({
							source: plurals[p],
							sourceLocale: res.getLocale(),
							key: res.getKey(),
							file: res.getPath(),
							project: res.getProject(),
							resType: "plural",
							state: res.getState(),
							comment: res.getComment(),
							quantity: p,
							context: res.getContext(),
							id: res.getId()
						});
					}
					break;
				}
			}
		}
		
		// now add the translations
		for (var i = 0; i < resources.length; i++) {
			var res = resources[i];
			if (res.origin === "target" || res.getLocale() !== this.sourceLocale) {
				switch (res.resType) {
				case "string":
					var tu = sourceUnitHash[makeHashKey(res)];
					if (tu) {
						tu.translated = true;
						var newtu = tu.clone();
						newtu.target = res.getSource();
						if (newtu.target) {
							newtu.target.state = res.getState();
						}
						newtu.targetLocale = res.getLocale();
						newtu.id = res.getId();
						
						units.push(newtu);
					} else {
						logger.warn("Translated string has no source string: " + JSON.stringify(res, undefined, 4));
					}
					break;
					
				case "array":
					var arr = res.getArray();
					for (var j = 0; j < arr.length; j++) {
						var tu = sourceUnitHash[makeHashKey(res, j)];
						if (tu) {
							tu.translated = true;
							var newtu = tu.clone();
							newtu.target = arr[j];
							if (newtu.target) {
								newtu.target.state = res.getState();
							}
							newtu.targetLocale = res.getLocale();
							newtu.id = res.getId();
							
							units.push(newtu);
						} else {
							logger.warn("Translated array entry " + j + " has no source array entry: " + JSON.stringify(res, undefined, 4));
						}
					}
					break;
					
				case "plural":
					var plurals = res.getPlurals();
					for (var p in plurals) {
						var tu = sourceUnitHash[makeHashKey(res, undefined, p)];
						if (tu) {
							tu.translated = true;
							var newtu = tu.clone();
							newtu.target = plurals[p];
							if (newtu.target) {
								newtu.target.state = res.getState();
							}
							newtu.targetLocale = res.getLocale();
							newtu.id = res.getId();
							newtu.quantity = res.quentity();
							
							units.push(newtu);
						} else {
							logger.warn("Translated plural  " + p + " has no source plural: " + JSON.stringify(res, undefined, 4));
						}
					}
					break;
				}
			}
		}

		// then add any untranslated sources

		for (var hash in sourceUnitHash) {
			var tu = sourceUnitHash[hash];
			if (!tu.translated) {
				units.push(tu);
			}
		}
	}
	
	if (this.tu.length > 0) {
		units = units.concat(this.tu);
	}
	
	logger.trace("Units to write out is " + JSON.stringify(units, undefined, 4));
	
	// now finally add each of the units to the json

	var files = {};
	var index = 1;

	for (var i = 0; i < units.length; i++) {
		var tu = units[i];
		var file = files[tu.file];
		if (!file) {
			files[tu.file] = file = {
				"original": tu.file,
				"source-language": tu.sourceLocale,
				"target-language": tu.targetLocale,
				"product-name": tu.project,
			};
			if (!json.xliff.file) {
				json.xliff.file = [];
			}
			if (this["tool-id"] || this["tool-name"] || this["tool-version"] || this["tool-company"] ||  this["company"]) {
				file.header = {
						"tool": {
							"tool-id": this["tool-id"],
							"tool-name": this["tool-name"],
							"tool-version": this["tool-version"],
							"tool-company": this["tool-company"],
							"copyright": this["copyright"]
						}
				};

			}
			file.body = {};
			json.xliff.file.push(file);
		}

		var tujson = {
				"id": (tu.id || index++),
				"resname": tu.key,
				"restype": tu.resType || "string",
				"source": {
					"$t": tu.source
				}
		};

		if (tu.id && tu.id > index) {
			index = tu.id + 1;
		}

		if (tu.resType === "plural") {
			tujson.extype = tu.quantity;
		}
		if (tu.resType === "array") {
			tujson.extype = tu.ordinal;
		}

		if (tu.target) {
			tujson.target = {
				"$t": tu.target,
				state: tu.state
			};
		}
		if (tu.comment) {
			tujson.note = {
				"annotates": "source",
				"$t": tu.comment
			};
		}
		if (tu.context) {
			tujson["x-context"] = tu.context;
		}
		if (!file.body["trans-unit"]) {
			file.body["trans-unit"] = [];
		}

		file.body["trans-unit"].push(tujson);
	}

	logger.trace("json is " + JSON.stringify(json, undefined, 4));
	
	var xml = '<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(json, {sanitize: true});

	return PrettyData.xml(xml);
};

/**
 * Deserialize the given string as an xml file in xliff format
 * into this xliff instance. If there are any existing translation
 * units already in this instance, they will be removed first.
 * 
 * @param {String} xml the xliff format text to parse
 */
Xliff.prototype.deserialize = function(xml) {
	var json = xml2json.toJson(xml, {
		object: true,
		sanitize: true,
		reversible: true
	});
	
	logger.trace("json is " + JSON.stringify(json, undefined, 4));
	this.ts = new TranslationSet(this.sourceLocale);
	
	if (json.xliff) {
		if (!json.xliff.version || json.xliff.version !== "1.2") {
			logger.error("Unknown xliff version " + json.xliff.version + ". Cannot continue parsing.");
			return;
		}
		if (json.xliff.file) {
			var files = ilib.isArray(json.xliff.file) ? json.xliff.file : [ json.xliff.file ];
			var comment;
			
			for (var i = 0; i < files.length; i++) {
				var fileSettings = {};
				var file = files[i];
				
				fileSettings = {
					pathName: file.original,
					locale: file["source-language"],
					project: file["product-name"],
					targetLocale: file["target-language"]
				};
				
				if (file.body && file.body["trans-unit"]) {
					var units = ilib.isArray(file.body["trans-unit"]) ? file.body["trans-unit"] : [ file.body["trans-unit"] ];
					
					units.forEach(function(tu) {
						var unit = new TranslationUnit({
							file: fileSettings.pathName,
							sourceLocale: fileSettings.locale,
							project: fileSettings.project,
							id: tu.id,
							key: tu.resname,
	                        source: tu.source["$t"],
							context: tu["x-context"],
							comment: comment,
							targetLocale: fileSettings.targetLocale,
							comment: tu.note && tu.note["$t"],
							target: tu.target && tu.target["$t"],
							resType: tu.restype,
							state: tu.target && tu.target.state							
						});
						switch (unit.resType) {
						case "array":
							unit.ordinal = tu.extype && Number(tu.extype).valueOf();
							break;
						case "plural":
							unit.quantity = tu.extype;
							break;
						}
						this.tu.push(unit);
					}.bind(this));
				}
			}
		}
	}
	
	logger.trace("this.tu is " + JSON.stringify(this.tu, undefined, 4));
	
	return this.ts;
};

module.exports = Xliff;
