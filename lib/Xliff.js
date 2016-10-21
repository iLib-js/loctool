/*
 * Xliff.js - model an xliff file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var log4js = require("log4js");
var path = require("path");
var xml2json = require("xml2json");
var PrettyData = require("pretty-data").pd;

var logger = log4js.getLogger("loctool.lib.Xliff");

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
 * </ul>
 * 
 * @constructor
 * @param {Array.<Object>|undefined} options options to 
 * initialize the file, or undefined for a new empty file
 */
var Xliff = function Xliff(options) {
	this.units = [];
	this.unithash = {};
	if (options) {
		this["tool-id"] = options["tool-id"];
		this["tool-name"] = options["tool-name"];
		this["tool-version"] = options["tool-version"];
		this["tool-company"] = options["tool-company"];
		this.copyright = options.copyright;
		this.path = options.path;
	}
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
 * Add a translation unit to this xliff file. If a translation
 * unit with the same file, source locale, target locale,
 * and key already exists in this xliff file, it will be 
 * replaced instead of adding this unit to the file.
 * 
 * @param {TranslationUnit} tu a translation unit to add
 */
Xliff.prototype.addTranslationUnit = function(tu) {
	if (!tu) return;
	
	var hashkey = [tu.file, tu.sourceLocale, tu.targetLocale, tu.reskey].join("_");
	
	if (this.unithash[hashkey]) {
		var oldtu = this.unithash[hashkey];
		for (var p in tu) {
			oldtu[p] = tu[p];
		}
	} else {
		this.units.push(tu);
		this.unithash[hashkey] = tu;
	}
};

/**
 * Get translation units from this xliff file with the
 * given criteria. If the criteria object is undefined,
 * then all units are returned. If the criteria unit
 * is an object, then only translations units with properties
 * that match the properties and values in the criteria
 * object are returned.
 * 
 * @param {Object|undefined} criteria an object with criteria for
 * selecting which translation units to retrieve
 * @return {Array.<TranslationUnit>} an array of translation
 * units that match the given criteria.
 */
Xliff.prototype.getTranslationUnits = function(criteria) {
	if (!criteria) return this.units;
	return this.units.filter(function(unit) {
		for (var p in criteria) {
			if (unit[p] !== criteria[p]) {
				return false;
			}
		}
		return true;
	});
};

/**
 * Return the number of translation units in this xliff
 * file.
 * 
 * @return {number} the number of translation units in this xliff file
 */
Xliff.prototype.size = function() {
	return this.units.length;
};

/**
 * Serialize this xliff instance to a string that contains
 * the xliff format xml text.
 * 
 * @return {String} the current instance encoded as an xliff format
 * xml text
 */
Xliff.prototype.serialize = function() {
	var json = {
		xliff: {
			version: "1.2"
		}
	};
	
	var files = {};
	var index = 1;
	
	for (var i = 0; i < this.units.length; i++) {
		var tu = this.units[i];
		var file = files[tu.file];
		if (!file) {
			files[tu.file] = file = {
				"original": tu.file,
				"source-language": tu.sourceLocale,
				"target-language": tu.targetLocale,
				"product-name": tu.project,
				"body": []
			};
			if (!json.xliff.file) {
				json.xliff.file = [];
			}
			json.xliff.file.push(file);
		}
		
		var tujson = {
			"trans-unit": {
				"id": index++,
				"resname": tu.key,
				"restype": tu.resType,
				"source": {
					"$t": tu.source
				}
			}
		};
		if (tu.target) {
			tujson["trans-unit"].target = {
				"$t": tu.target
			};
		}
		if (tu.comment) {
			tujson["trans-unit"].note = {
				"annotates": "source",
				"$t": tu.comment
			};
		}
		
		file.body.push(tujson);
	}
	
	logger.trace("json is " + JSON.stringify(json, undefined, 4));
	
	var xml = '<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(json);

	return PrettyData.xml(xml);
};

/**
 * Write the current object to the instance's path name
 * in XLIFF 1.2 format. 
 */
Xliff.prototype.write = function() {
	
};

/**
 * Deserialize the given string as an xml file in xliff format
 * into this xliff instance. If there are any existing translation
 * units already in this instance, they will be removed first.
 * 
 * @param {String} xml the xliff format text to parse
 */
Xliff.prototype.deserialize = function(xml) {
	
};

/**
 * Read the file from the instance's path name into this 
 * Xliff instance. This throws an exception if there
 * is a syntax error in the xliff file.
 */
Xliff.prototype.read = function(pathName) {
	
};

module.exports = Xliff;
