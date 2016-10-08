/*
 * AndroidLayoutFile.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var log4js = require("log4js");
var path = require("path");
var xml2json = require("xml2json");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

/**
 * @class Represents an Android layout file.
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
var AndroidLayoutFile = function(props) {
	this.dirty = false;
	
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.type = props.type;
		this.locale = props.locale;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

var lang = new RegExp("-[a-z][a-z]$");
var reg = new RegExp("-[a-z][a-z]-r[A-Z][A-Z]$");
var script = new RegExp("-[a-z][a-z]-s[A-Z][a-z][a-z][a-z]-r[A-Z][A-Z]$");
var context = new RegExp("layout-(.*)$");

/**
 * Parse the suffixes of the layout file for the context and the locale. The 
 * context and locale for Android layout files
 * are given in the suffix of the directory name that the layout file 
 * lives in.<p>
 * 
 * The general syntax of the directory name is:<p>
 * 
 * <pre>
 * "layout" [ "-" context ] [ "-" language [ "-r" region]]
 * </pre>
 * 
 * That is, the string values is followed optionally by the context and the
 * language code and the region code for the locale.
 * 
 * @private
 */
AndroidLayoutFile.prototype._parsePath = function() {
	if (!this._pathParsed)  {
		var dir = path.dirname(this.pathName || "");
		
		if (!this.locale) {
			// don't have it? Then guess based on the path name
			if (lang.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-2)).getSpec();
				dir = dir.substring(0, dir.length-2);
			}
			if (reg.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-")).getSpec();
				dir = dir.substring(0, dir.length-6);
			}
			if (script.test(dir)) {
				this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-")).getSpec();
				dir = dir.substring(0, dir.length-6);
			}
			
			if (!this.locale) {
				this.locale = this.project.sourceLocale;
			}
		}
		
		if (!this.context) {
			var results = context.exec(dir);
			if (results && results.length) {
				this.context = results[1] || undefined;
				// dir = dir.substring(0, dir.length-2);
			}
		}
	}
	
	this._pathParsed = true;
};

/**
 * Get the locale of this layout file. For Android layout files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
AndroidLayoutFile.prototype.getLocale = function() {
	this._parsePath();
	
	return this.locale;
};

/**
 * Get the locale of this layout file. For Android layout files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
AndroidLayoutFile.prototype.getContext = function() {
	this._parsePath();
	
	return this.context;
};

AndroidLayoutFile.prototype.makeKey = function(type, source) {
	return (type + '_' + source).replace(/[ \t!@#$%^&:*|\-\\=+().,\/"']/g, "_");
};

var localizableAttributes = {
	"android:title": 1,
	"android:text": 1,
	"android:queryHint": 1,
	"android:contentDescription": 1,
	"android:hint": 1
};

/**
 * Walk the node tree looking for properties that have localizable values, then extract
 * them and resourcify them.
 * @private
 */
AndroidLayoutFile.prototype.walkLayout = function(node) {
	for (var p in node) {
		var subnode = node[p];
		if (typeof(node[p]) === "object") {
			this.walkLayout(subnode);
		} else if (typeof(subnode) === "string") {
			if (localizableAttributes[p]) {
				logger.trace("Found resource " + p + " with string " + subnode);
				if (subnode.length > 8 && subnode.substring(0,8) === "@string/") {
					// note that this is a used resource?
					logger.trace("Already resourcified");
				} else {
					logger.trace("Resourcifying");
					var key = this.makeKey(p, subnode);
					node[p] = "@string/" + key;
					var res = new ResourceString({
						key: key,
						source: subnode,
						pathName: this.pathName,
						locale: this.locale,
						context: this.context || undefined,
						project: this.project.getProjectId(),
						autoKey: true
					});
					this.set.add(res);
					this.dirty = true;
				}
			}
		} else if (utils.isArray(subnode)) {
			for (var i = 0; i < subnode.length; i++) {
				this.walkLayout(subnode[i]);
			}
		}
	}
};

/**
 * Parse an Android Layout XML string and extract the resources.
 * 
 * @param {String} data the string to parse
 */
AndroidLayoutFile.prototype.parse = function(data) {
	this.xml = data;
	this.contents = xml2json.toJson(data, {object: true});
	/*
	if (!this.contents ||
			(!this.contents.FrameLayout && 
			!this.contents.RelativeLayout &&
			!this.contents.LinearLayout &&
			!this.contents.Scrollview &&
			!this.contents.WebView &&
			!this.contents.Scrollview) ) {
		logger.debug(this.pathName + " is not a layout file, skipping.");
		logger.trace("Parsed file is " + JSON.stringify(this.content, undefined, 4));
		return;
	}
	*/

	this.walkLayout(this.contents);
};

/**
 * Extract all the localizable strings from the layout file and add them to the
 * project's translation set.
 */
AndroidLayoutFile.prototype.extract = function() {
	logger.debug("Extracting strings from " + this.pathName);
	if (this.pathName) {
		this._parsePath(); // get the locale and context to use while making the resource instances
		
		var p = path.join(this.project.root, this.pathName);
		try {
			var xml = fs.readFileSync(this.pathName, "utf8");
			if (xml) {
				logger.trace("file contents: " + xml);
				this.parse(xml);
			}
		} catch (e) {
			logger.warn("Could not read file: " + p);
		}
	}
};

/**
 * @private
 */
AndroidLayoutFile.prototype._getXML = function() {
	// return the original if the contents have not been modified
	return this.dirty ? '<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(this.contents) : this.xml;
};

/**
 * Write out the contents to the appropriate file.
 */
AndroidLayoutFile.prototype.write = function() {
	logger.debug("Writing Android layout file for locale " + this.locale + " to file " + this.pathName);
	if (this.contents && this.dirty && this.pathName) {
		logger.trace("Writing contents now");
		fs.writeFileSync(this.pathName, this._getXML(), "utf-8");
	} else {
		logger.trace("File is not dirty. Not writing.");
	}
};

/** 
 * Return the set of resources found in the current layout file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current layout file.
 */
AndroidLayoutFile.prototype.getTranslationSet = function() {
	return this.set;
};

module.exports = AndroidLayoutFile;
