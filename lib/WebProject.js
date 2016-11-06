/*
 * WebProject.js - represents a Ruby on Rails web project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");

var Project = require("./Project.js");
var HTMLTemplateFileType = require("./HTMLTemplateFileType.js");
var HamlFileType = require("./HamlFileType.js");
var YamlFileType = require("./YamlFileType.js");
var JavaScriptFileType = require("./JavaScriptFileType.js");
var JavaScriptResourceFileType = require("./JavaScriptResourceFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.WebProject");

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
	this.parent.prototype.constructor.call(this, options, root);
	
	this.resourceFileType = {
		"ruby": new YamlFileType(this),
		"js": new JavaScriptResourceFileType(this)
	};
	this.hamlType = new HamlFileType(this);
	
	logger.debug("New WebProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

WebProject.prototype = new Project({noInstance: true});
WebProject.prototype.parent = Project;
WebProject.prototype.constructor = WebProject;

WebProject.prototype.initFileTypes = function() {
	this.fileTypes = [
	    this.hamlType,
	    new HTMLTemplateFileType(this),
	    new JavaScriptFileType(this),
	    this.resourceFileType.js,
    	this.resourceFileType.ruby
    ];
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
WebProject.prototype.extract = function(cb) {
	this.parent.prototype.extract.call(this, function() {
		logger.trace("Extracting haml strings from project " + this.options.id);
		this.hamlType.processHamls(this.translations);
		cb();
	}.bind(this));
};


WebProject.prototype.getMainResourceFile = function() {
	return ;
};

/**
 * Return the resource file type for this project.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here. The type parameter tells
 * which type of resources are being sought. A project
 * for example may contain separate resource files for
 * javascript and ruby.
 * 
 * @param {String} type the type of resource being sought
 * @returns {FileType} the resource file
 * type for this project
 */
WebProject.prototype.getResourceFileType = function(type) {
	return this.resourceFileType[type];
};

module.exports = WebProject;