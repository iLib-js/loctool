/*
 * AndroidLayoutFile.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

var AndroidLayoutFile = function(project, pathName, type) {
	this.project = project;
	this.pathName = pathName;
	this.type = type;
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
	logger.debug("Extracting strings from " + this.pathName);
	var data = fs.readFileSync(this.pathName, "utf8");
	if (data) {
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
