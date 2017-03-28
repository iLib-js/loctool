/*
 * SwiftProject.js - represents an iOS project using Swift
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
// const spawnSync = require('child_process').spawnSync;
var log4js = require("log4js");

var Project = require("./Project.js");
var ObjectiveCFileType = require("./ObjectiveCFileType.js");
var SwiftFileType = require("./SwiftFileType.js");
var IosStringsFileType = require("./IosStringsFileType.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.SwiftProject");

/**
 * @class Represent an swift iOS project.
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
 * @param {Object} settings settings from the command-line
 */
var SwiftProject = function(options, root, settings) {
	this.parent.prototype.constructor.call(this, options, root);

	this.settings = settings || {};
	this.useFileTypes = this.settings.filetypes;
	this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales);
	
	this.resourceFileType = new IosStringsFileType(this);
	
	logger.debug("New SwiftProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

SwiftProject.prototype = new Project({noInstance: true});
SwiftProject.prototype.parent = Project;
SwiftProject.prototype.constructor = SwiftProject;

SwiftProject.prototype.initFileTypes = function() {
	if (this.useFileTypes) {
		this.fileTypes = [];
		// swift should go first, as it should get first choice for the .h files
		if (this.useFileTypes.SwiftFileType) {
			this.fileTypes.push(new SwiftFileType(this));
		}
		if (this.useFileTypes.ObjectiveCFileType) {
			this.fileTypes.push(new ObjectiveCFileType(this));
		}
		this.fileTypes.push(this.resourceFileType);
	} else {
		this.fileTypes = [
		   new SwiftFileType(this),
		   this.resourceFileType
	    ];
	}
};

SwiftProject.prototype.getMainResourceFile = function() {
	return ;
};

/**
 * Return the resource file type for this project type.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here
 *  
 * @returns {IosStringsFileType} the resource file
 * type for this project
 */
SwiftProject.prototype.getResourceFileType = function() {
	return this.resourceFileType;
};

/**
 * Clear the cache and then call the parent to write the project.
 * 
 * @override
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
SwiftProject.prototype.write = function(cb) {
	this.resourceFileType.clear();
	this.parent.prototype.write.call(this, cb);
};

module.exports = SwiftProject;
