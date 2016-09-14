/*
 * AndroidProject.js - represents an Android project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var ResourceString = require("./ResourceString.js");
var AndroidLayoutFileType = require("./AndroidLayoutFileType.js");
var AndroidResourceFileType = require("./AndroidResourceFileType.js");
var JavaFileType = require("./JavaFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidProject");

/**
 * @class Represent an android project.
 *
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li>sourceLocale {String} - the source locale of this project (defaults to en-US)
 * <li>pseudoLocale {String} - the locale to use as the pseudo locale
 * <li>name {String} - human readable name of this project
 * <li>id {String} - unique id of this project (usually the git repo name)
 * <li>projectType {String} - The type of this project. This may be any one of "android", "iosobjc", "iosswift", or "web"
 * <li>resourceDirs {Array.<String>} - an array of directories containing resource files in this project
 * <li>excludes {Array.<String>} - an array of paths to exclude from scanning for strings
 * </ul>
 * 
 * @param {Object} options settings for the current project
 * @param {String} root
 */
var AndroidProject = function(options, root) {
	this.options = options;
	this.sourceLocale = options.sourceLocale || "en-US";
	this.pseudoLocale = options.pseudoLocale || "zxx-XX";
	this.root = root;
	
	this.translations = new TranslationSet(this.sourceLocale);
	
	logger.debug("New AndroidProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

AndroidProject.prototype.getFileTypes = function() {
	return [
    	new AndroidLayoutFileType(this),
    	new AndroidResourceFileType(this),
    	new JavaFileType(this)
    ];
};

AndroidProject.prototype.getTranslationSet = function() {
	return this.translations;
};

AndroidProject.prototype.getMainResourceFile = function() {
	return ;
};

module.exports = AndroidProject;