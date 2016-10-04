/*
 * WebProject.js - represents a Ruby on Rails web project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");

var YamlFileType = require("./YamlFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.WebProject");

// The resource file type for this project
var resourceFileType;

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
var WebProject = function(options, root) {
	this.options = options;
	this.sourceLocale = options.sourceLocale || "en-US";
	this.pseudoLocale = options.pseudoLocale || "zxx-XX";
	this.root = root;
	
	this.translations = new TranslationSet(this.sourceLocale);
	
	resourceFileType = new YamlFileType(this);
	
	logger.debug("New WebProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

WebProject.prototype.getFileTypes = function() {
	return [
    	resourceFileType
    ];
};

WebProject.prototype.getTranslationSet = function() {
	return this.translations;
};

WebProject.prototype.getMainResourceFile = function() {
	return ;
};

WebProject.prototype.getProjectId = function() {
	return this.options.id;
};

/**
 * Return the resource file type for this project type.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here
 *  
 * @returns {AndroidResourceFileType} the resource file
 * type for this project
 */
WebProject.prototype.getResourceFileType = function() {
	return resourceFileType;
};

module.exports = WebProject;