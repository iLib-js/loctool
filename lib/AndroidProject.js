/*
 * AndroidProject.js - represents an Android project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var Project = require("./Project.js");
var AndroidLayoutFileType = require("./AndroidLayoutFileType.js");
var AndroidResourceFileType = require("./AndroidResourceFileType.js");
var JavaFileType = require("./JavaFileType.js");

var logger = log4js.getLogger("loctool.lib.AndroidProject");

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
 * @param {Object} settings settings from the command-line
 */
var AndroidProject = function AndroidProject(options, root, settings) {
	this.parent.prototype.constructor.call(this, options, root);
	
	this.useFileTypes = settings && settings.filetypes;
	
	resourceFileType = new AndroidResourceFileType(this);
	
	logger.debug("New AndroidProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

AndroidProject.prototype = new Project({noInstance: true});
AndroidProject.prototype.parent = Project;
AndroidProject.prototype.constructor = AndroidProject;

/**
 * Initialize the file types for this type of project.
 */
AndroidProject.prototype.initFileTypes = function() {
	if (this.useFileTypes) {
		this.fileTypes = [];
		if (this.useFileTypes.AndroidLayoutFileType) {
			this.fileTypes.push(new AndroidLayoutFileType(this));
		}
		if (this.useFileTypes.JavaFileType) {
			this.fileTypes.push(new JavaFileType(this));
		}
		if (this.useFileTypes.AndroidResourceFileType || this.useFileTypes.AndroidLayoutFileType) {
			this.fileTypes.push(resourceFileType);
		}
	} else {
		this.fileTypes = [
	    	new AndroidLayoutFileType(this),
	    	new JavaFileType(this),
	    	resourceFileType
	    ];
	}
};

AndroidProject.prototype.getMainResourceFile = function() {
	return ;
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
AndroidProject.prototype.getResourceFileType = function() {
	return resourceFileType;
};

module.exports = AndroidProject;