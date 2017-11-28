/*
 * Xliff.js - model an xliff file
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var log4js = require("log4js");
var xml2json = require("xml2json");
var PrettyData = require("pretty-data").pd;
var ilib = require("ilib");
var JSUtils = require("ilib/lib/JSUtils");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceArray = require("./ResourceArray.js");
var ResourceFactory = require("./ResourceFactory.js");

var logger = log4js.getLogger("loctool.lib.Xliff");

/**
 * @class A class that represents an translation unit in an
 * xliff 1.2 file. The options may be undefined, which represents
 * a new, clean TranslationUnit instance. The options object may also
 * be an object with the following properties:
 *
 * <ul>
 * <li><i>source</i> - source text for this unit (required)
 * <li><i>sourceLocale</i> - the source locale spec for this unit (required)
 * <li><i>target</i> - target text for this unit (optional)
 * <li><i>targetLocale</i> - the target locale spec for this unit (optional)
 * <li><i>key</i> - the unique resource key for this translation unit (required)
 * <li><i>file</i> - path to the original source code file that contains the
 * source text of this translation unit (required)
 * <li><i>project</i> - the project that this string/unit is part of
 * <li><i>resType</i> - type of this resource (string, array, plural) (optional)
 * <li><i>state</i> - the state of the current unit (optional)
 * <li><i>comment</i> - the translator's comment for this unit (optional)
 * <li><i>datatype</i> - the source of the data of this unit (optional)
 * <li><i>flavor</i> - the flavor that this string comes from(optional)
 * </ul>
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
			logger.trace("options is " + JSON.stringify(options));
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
		this.project = options.project;
	}

	this.sourceLocale = this.sourceLocale || "en-US";

	// place to store the translation units
	this.tu = [];
	this.tuhash = {};

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
 * @private
 * @param project
 * @param context
 * @param sourceLocale
 * @param targetLocale
 * @param key
 * @param type
 * @param path
 * @returns
 */
Xliff.prototype._hashKey = function(project, context, sourceLocale, targetLocale, key, type, path, ordinal, quantity, flavor) {
	var key = [key, type || "string", sourceLocale || this.sourceLocale, targetLocale || "", context || "", project, path || "", ordinal || "", quantity || "", flavor || ""].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Add this translation unit to this xliff.
 *
 * @param {TranslationUnit} unit the translation unit to add to this xliff
 */
Xliff.prototype.addTranslationUnit = function(unit) {
	logger.trace("Xliff " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));

	var hashKeySource = this._hashKey(unit.project, unit.context, unit.sourceLocale, "", unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor),
		hashKeyTarget = this._hashKey(unit.project, unit.context, unit.sourceLocale, unit.targetLocale, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor);

	if (unit.targetLocale) {
		var oldUnit = this.tuhash[hashKeySource];
		if (oldUnit) {
			logger.trace("Replacing old source-only unit in favour of this joint source/target unit");
			this.tuhash[hashKeySource] = undefined;
			JSUtils.shallowCopy(unit, oldUnit);
			this.tuhash[hashKeyTarget] = oldUnit;
			return;
		}
	}

	var oldUnit = this.tuhash[hashKeyTarget];
	if (oldUnit) {
		logger.trace("Merging unit");
		// update the old unit with this new info
		JSUtils.shallowCopy(unit, oldUnit);
	} else {
		logger.trace("Adding new unit");
		this.tu.push(unit);
		this.tuhash[hashKeyTarget] = unit;
	}
};


/**
 * Add translation units to this xliff.
 *
 * @param {Array.<Object>} files the translation units to add to this xliff
 */
Xliff.prototype.addTranslationUnits = function(units) {
	for (var i = 0; i < units.length; i++) {
		this.addTranslationUnit(units[i]);
	}
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

	if (res.getTargetLocale() === this.sourceLocale || res.getTargetLocale() === "en") {
		// don't add this one... cannot translate TO the source locale!
		return;
	}

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
 * Convert a translation unit to a new loctool resource.
 *
 * @param {TranslationUnit} tu the translation to convert
 * @return {Resource} the corresponding resource
 */
Xliff.prototype.convertTransUnit = function(tu) {
	var res;

	switch (tu.resType) {
	default:
		res = ResourceFactory({
			pathName: tu.file,
			project: tu.project,
			id: tu.id,
			key: tu.key,
			sourceLocale: tu.sourceLocale,
			source: tu.source,
			targetLocale: tu.targetLocale,
			context: tu.context,
			comment: tu.comment,
			resType: tu.resType,
			datatype: tu.datatype,
			state: tu.state,
			flavor: tu.flavor
		});

		if (tu.target) {
			res.setTarget(tu.target);
		}
		break;

	case "array":
		var arr = [];
		arr[tu.ordinal] = tu.source;
		res = ResourceFactory({
			pathName: tu.file,
			project: tu.project,
			id: tu.id,
			key: tu.key,
			sourceLocale: tu.sourceLocale,
			sourceArray: arr,
			targetLocale: tu.targetLocale,
			targetArray: [],
			context: tu.context,
			comment: tu.comment,
			resType: tu.resType,
			datatype: tu.datatype,
			state: tu.state,
			flavor: tu.flavor
		});

		if (tu.target) {
			res.addTarget(tu.ordinal, tu.target);
		}
		break;

	case "plural":
		var strings = {};
		strings[tu.quantity] = tu.source;
		res = ResourceFactory({
			pathName: tu.file,
			project: tu.project,
			id: tu.id,
			key: tu.key,
			sourceLocale: tu.sourceLocale,
			sourceStrings: strings,
			targetLocale: tu.targetLocale,
			targetStrings: {},
			context: tu.context,
			comment: tu.comment,
			resType: tu.resType,
			datatype: tu.datatype,
			state: tu.state,
			flavor: tu.flavor
		});

		if (tu.target) {
			res.addTarget(tu.quantity, tu.target);
		}
		break;
	}

	return res;
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
	var res;

	if (this.tu) {
		for (var j = 0; j < this.tu.length; j++) {
			var comment, tu = this.tu[j];
			switch (tu.resType) {
			default:
				res = this.convertTransUnit(tu);
				this.ts.add(res);
				break;

			case "array":
				var res = this.ts.get(ResourceArray.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
				if (res) {
					// if it already exists, amend the existing resource instead of creating a new one
					res.addSource(tu.ordinal, tu.source);
					if (tu.target) {
						res.addTarget(tu.ordinal, tu.target);
					}
				} else {
					res = this.convertTransUnit(tu);
					this.ts.add(res);
				}
				break;

			case "plural":
				var res = this.ts.get(ResourcePlural.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
				if (res) {
					// if it already exists, amend the existing resource instead of creating a new one
					res.addSource(tu.quantity, tu.source);
					if (tu.target) {
						res.addTarget(tu.quantity, tu.target);
					}
				} else {
					res = this.convertTransUnit(tu);
					this.ts.add(res);
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
 * Return a string that can be used as an HTML attribute value.
 * @param {string} str the string to escape
 * @returns the escaped string
 */
function escapeAttr(str) {
	return str.replace(/\n/g, "\\n");
}

/**
 * Return the original string based on the one that was used as an attribute value.
 * @param {string} str the string to unescape
 * @returns the unescaped string
 */
function unescapeAttr(str) {
	return str.replace("/\\n/g", "\n");
}

/**
 * Serialize this xliff instance to a string that contains
 * the xliff format xml text.
 *
 * @param {boolean} untranslated if true, add the untranslated resources
 * to the xliff file without target tags. Otherwiwe, untranslated
 * resources are skipped.
 * @return {String} the current instance encoded as an xliff format
 * xml text
 */
Xliff.prototype.serialize = function(untranslated) {
	var units = [];
	var sourceUnitHash = {};

	function makeHashKey(res, ordinal, quantity) {
		return [res.getPath(), res.getKey(), res.getContext(), res.getProject(), ordinal, quantity].join("_");
	}

	var json = {
		xliff: {
			version: "1.2"
		}
	};

	if (this.ts.size() > 0) {
		// first convert the resources into translation units
		var resources = this.ts.getAll();
		var tu;

		// now add the translations
		for (var i = 0; i < resources.length; i++) {
			var res = resources[i];
			if (res.getTargetLocale() !== this.sourceLocale) {
				try {
					switch (res.resType) {
					case "string":
						tu = new TranslationUnit({
							project: res.project,
							key: res.getKey(),
							file: res.getPath(),
							sourceLocale: res.getSourceLocale(),
							source: res.getSource(),
							targetLocale: res.getTargetLocale(),
							target: res.getTarget(),
							state: res.getState(),
							id: res.getId(),
							translated: true,
							context: res.context,
							comment: res.comment,
							resType: res.resType,
							datatype: res.datatype,
							flavor: res.getFlavor ? res.getFlavor() : undefined
						});
						units.push(tu);
						break;

					case "array":
						var sarr = res.getSourceArray();
						var tarr = res.getTargetArray();

						tu = new TranslationUnit({
							project: res.project,
							key: res.getKey(),
							file: res.getPath(),
							source: " ",
							sourceLocale: res.getSourceLocale(),
							targetLocale: res.getTargetLocale(),
							state: res.getState(),
							id: res.getId(),
							translated: true,
							context: res.context,
							comment: res.comment,
							resType: res.resType,
							datatype: res.datatype,
			                flavor: res.getFlavor ? res.getFlavor() : undefined
						});

						for (var j = 0; j < sarr.length; j++) {
							// only output array items that have a translation
							if (sarr[j]) {
								var newtu = tu.clone();
								newtu.source = sarr[j];
								newtu.ordinal = j;

								if (tarr && j < tarr.length && tarr[j]) {
									newtu.target = tarr[j];
								}

								newtu.ordinal = j;
								units.push(newtu);
							} else {
								logger.warn("Translated array  " + res.getKey() + " has no source or target item at index " + j + ": " + JSON.stringify(res, undefined, 4));
							}
						}
						break;

					case "plural":
						tu = new TranslationUnit({
							project: res.project,
							key: res.getKey(),
							file: res.getPath(),
							source: " ",
							sourceLocale: res.getSourceLocale(),
							targetLocale: res.getTargetLocale(),
							state: res.getState(),
							id: res.getId(),
							translated: true,
							context: res.context,
							comment: res.comment,
							resType: res.resType,
							datatype: res.datatype,
							flavor: res.getFlavor ? res.getFlavor() : undefined
						});

						var sp = res.getSourcePlurals();
						var tp = res.getTargetPlurals();

						for (var p in sp) {
							if (sp[p]) {
								var newtu = tu.clone();
								newtu.source = sp[p];

								if (tp && tp[p]) {
									newtu.target = tp[p];
									newtu.quantity = p;
								}
								newtu.quantity = p;
								units.push(newtu);
							} else {
								logger.warn("Translated plural  " + res.getKey() + " has no source plural, quantity " + p + ": " + JSON.stringify(res, undefined, 4));
							}
						}
						break;
					}
				} catch (e) {
					logger.warn(e);
					logger.warn(JSON.stringify(res));
					logger.warn("Skipping that resource.");
				}
			}
		}
	}

	if (this.tu && this.tu.length > 0) {
		units = units.concat(this.tu);
	}

	logger.trace("Units to write out is " + JSON.stringify(units, undefined, 4));

	// now finally add each of the units to the json

	var files = {};
	var index = 1;

	function makeTUHashKey(tu) {
		return [tu.file, tu.sourceLocale, tu.targetLocale || "", tu.project].join("_");
	}

	for (var i = 0; i < units.length; i++) {
		var tu = units[i];
		if (!tu) {
			console.log("undefined?");
		}
		var hashKey = makeTUHashKey(tu);
		var file = files[hashKey];
		if (!file) {
			files[hashKey] = file = {
				"original": tu.file,
				"source-language": tu.sourceLocale,
				"target-language": tu.targetLocale,
				"product-name": tu.project,
				"x-flavor": tu.flavor
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
			"resname": escapeAttr(tu.key),
			"restype": tu.resType || "string",
			"datatype": tu.datatype,
			"source": {
				"$t": tu.source
			}
		};

		if (tu.id && tu.id > index) {
			index = tu.id + 1;
		}

		if (tu.resType === "plural") {
			tujson.extype = tu.quantity || "other";
		}
		if (tu.resType === "array") {
			tujson.extype = tu.ordinal;
		}

		if (tu.target) {
			tujson.target = {
				state: tu.state,
				"$t": tu.target
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

	// logger.trace("json is " + JSON.stringify(json, undefined, 4));

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
		reversible: true,
		trim: false
	});
	var project = this.project && this.project.options.id;

	// logger.trace("json is " + JSON.stringify(json, undefined, 4));
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
					targetLocale: file["target-language"],
					flavor: file["x-flavor"]
				};

				fileSettings.isAsianLocale = utils.isAsianLocale(fileSettings.targetLocale);

				if (file.body && file.body["trans-unit"]) {
					var units = ilib.isArray(file.body["trans-unit"]) ? file.body["trans-unit"] : [ file.body["trans-unit"] ];

					units.forEach(function(tu) {
						if (tu.source && tu.source["$t"] && tu.source["$t"].trim().length > 0) {
							var targetString;
							if (tu.target) {
								if (tu.target["$t"]) {
									targetString = tu.target["$t"];
								} else if (tu.target.mrk) {
									if (ilib.isArray(tu.target.mrk)) {
										var targetSegments = tu.target.mrk.map(function(mrk) {
											return mrk["$t"];
										})
										targetString = targetSegments.join(fileSettings.isAsianLocale ? '' : ' ');
									} else {
										targetString = tu.target.mrk["$t"];
									}
								}
							}

							try {
								var unit = new TranslationUnit({
									file: fileSettings.pathName,
									sourceLocale: fileSettings.locale,
									project: fileSettings.project,
									id: tu.id,
									key: unescapeAttr(tu.resname),
			                        source: tu.source["$t"],
									context: tu["x-context"],
									comment: comment,
									targetLocale: fileSettings.targetLocale,
									comment: tu.note && tu.note["$t"],
									target: targetString,
									resType: tu.restype,
									state: tu.target && tu.target.state,
									datatype: tu.datatype,
									flavor: fileSettings.flavor
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
							} catch (e) {
								logger.warn("Skipping invalid translation unit found in xliff file.\n" + e);
							}
						} else {
							logger.warn("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu.resname);
						}
					}.bind(this));
				}
			}
		}
	}

	// logger.trace("this.tu is " + JSON.stringify(this.tu, undefined, 4));

	return this.ts;
};

// publish this as well
Xliff.TranslationUnit = TranslationUnit;

module.exports = Xliff;
