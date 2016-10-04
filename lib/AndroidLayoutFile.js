/*
 * AndroidLayoutFile.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

/**
 * Read the given xml file and convert it to json.
 * 
 * @private
 * @param pathName path to load
 * @returns a javascript object containing the same information as the xml file
 */
function readLayoutFile(pathName) {
	var xml = fs.readFileSync(pathName, "utf8");
	return xml2json.toJson(xml, {object: true});
}


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
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.type = props.type;
		this.locale = props.locale;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

AndroidLayoutFile.prototype.makeKey = function(source) {
	return source.toLowerCase().replace(/ /g, "_");
};

var attributes = [
	new RegExp(/android:title="([^"]*)"/g),
	new RegExp(/android:text="([^"]*)"/g),
	new RegExp(/android:queryHint="([^"]*)"/g),
	new RegExp(/android:contentDescription="([^"]*)"/g),
	new RegExp(/android:hint="([^"]*)"/g),
];

AndroidLayoutFile.prototype.extract = function(filetype) {
	if (this.pathName) {
		this.contents = readLayoutFile(this.pathName);
		if (!this.contents.FrameLayout && 
			!this.contents.RelativeLayout &&
			!this.contents.LinearLayout &&
			!this.contents.Scrollview &&
			!this.contents.WebView &&
			!this.contents.Scrollview ) {
			logger.debug(this.pathName + " is not a layout file, skipping.");
			return;
		}
		
		if (this.contents) {
			for (var i = 0; i < attributes.length; i++) {
				var result = attributes[i].exec(data);
				while (result && result.length) {
					logger.trace("Found resource " + result[0] + " with string " + result[1]);
					var str = result[1];
					var id;
					
					if (str.substring(0,8) === "@string/") {
						id = str.substring(8);
						logger.trace("Existing resource should me marked as used. Id: " + id);
					} else {
						id = this.makeKey(str);
						logger.trace("New string needs to be resourcified. New id: " + id);
					}
					result = attributes[i].exec(data);
				}
			}
		}
	}
};

AndroidLayoutFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current layout file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current layout file.
 */
AndroidLayoutFile.prototype.getTranslationSet = function() {
	return undefined;
};

module.exports = AndroidLayoutFile;
