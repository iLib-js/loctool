/*
 * AndroidLayoutFileType.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var TranslationSet = require("./TranslationSet.js");
var AndroidLayoutFile = require("./AndroidLayoutFile.js");

var AndroidLayoutFileType = function(project) {
	this.project = project;
	this.changed = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
		locale: "zxx-XX",
		type: "xml"
	});
};

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^(layout|menu)");
var lang = new RegExp("-[a-z][a-z]$");
var reg = new RegExp("-r[A-Z][A-Z]$");

AndroidLayoutFileType.prototype.handles = function(pathName) {
	//console.log("AndroidLayoutFileType handles " + pathName + "?");
	if (!extensionRE.test(pathName)) {
		//console.log("No");
		return false;
	}

	var pathElements = pathName.split('/');
	if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
		//console.log("No");
		return false;
	}
	
	var dir = pathElements[pathElements.length-2];
	
	if (!dirRE.test(dir)) {
		//console.log("No");
		return false;
	}
	
	if (lang.test(dir) && utils.iso639[dir.substring(dir.length-2,2)]) {
		// already localized dir
		//console.log("No");
		return false;
	}
	
	if (reg.test(dir) && utils.iso3166[dir.substring(dir.length-2,2)]) {
		// already localized dir
		//console.log("No");
		return false;
	}
	
	//console.log("Yes");
	return true;
};

AndroidLayoutFileType.prototype.name = function() {
    return "Android Layout File";
};

AndroidLayoutFileType.prototype.getResources = function() {
	return this.project.resources;
};

AndroidLayoutFileType.prototype.generatePseudo = function() {
};

AndroidLayoutFileType.prototype.write = function() {
};

AndroidLayoutFileType.prototype.newFile = function(path) {
	return new AndroidLayoutFile(this.project, path);
};

AndroidLayoutFileType.prototype.collect = function() {
	
};


module.exports = AndroidLayoutFileType;
