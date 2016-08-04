/*
 * AndroidProject.js - represents an Android project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var xml2json = require('xml2json');
var ResourceString = require("./ResourceString.js");
var AndroidResourceFile = require("./AndroidResourceFile.js");
var AndroidLayoutFileType = require("./AndroidLayoutFileType.js");
var AndroidResourceFileType = require("./AndroidResourceFileType.js");
var TranslationSet = require("./TranslationSet.js");

var AndroidProject = function(options, root) {
	this.options = options;
	this.sourceLocale = options.sourceLocale || "en-US";
	this.pseudoLocale = options.pseudoLocale || "zxx-XX";
	this.root = root;
	
	this.translations = new TranslationSet(this);
	
	console.log("New AndroidProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

AndroidProject.prototype.getFileTypes = function() {
	return [
	    new AndroidLayoutFileType(this),
	    new AndroidResourceFileType(this)
	];
};

AndroidProject.prototype.getTranslationSet = function() {
	return this.translations;
};

module.exports = AndroidProject;