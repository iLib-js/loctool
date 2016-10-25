/*
 * Project.js - represents an project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var Queue = require("js-stl").Queue;
var ilib = require("ilib");

// var DBTranslationSet = require("./DBTranslationSet.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.Project");

/**
 * @class Represent a loctool project.
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
var Project = function(options, root) {
	this.options = options;
	if (options) {
		this.sourceLocale = options.sourceLocale;
		this.pseudoLocale = options.pseudoLocale;
		if (this.options.excludes && ilib.isArray(this.options.excludes)) {
			logger.trace("normalizing excludes");
			// match sure the paths are matchable
			this.options.excludes = this.options.excludes.map(function(pathName) {
				return path.normalize(pathName);
			});
		}
	}
	this.root = root;
	this.sourceLocale = this.sourceLocale || "en-US";
	this.pseudoLocale = this.pseudoLocale || "zxx-XX";
	
	this.translations = new TranslationSet(this.sourceLocale);
	this.newres = new TranslationSet(this.sourceLocale);
	
	this.paths = new Queue();
	this.files = new Queue();
	
	// this.db = new DBTranslationSet(this.sourceLocale);
	
	logger.debug("New Project: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

Project.prototype.getTranslationSet = function() {
	return this.translations;
};

/**
 * Return the unique id of this project. Often this is the 
 * name of the repository in source control.
 * 
 * @returns {String} the unique id of this project
 */
Project.prototype.getProjectId = function() {
	return this.options.id;
};

/**
 * Return the root directory of this project.
 * 
 * @returns {String} the path to the root dir of this project
 */
Project.prototype.getRoot = function() {
	return this.root;
};

/**
 * Add the given path name the list of files in this project.
 * 
 * @returns {String} pathName the path to add to the project
 */
Project.prototype.addPath = function(pathName) {
	return this.paths.enqueue(pathName);
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.extract = function(cb) {
	logger.trace("Extracting strings from project " + this.options.id);
	
	this.initFileTypes();
	logger.trace("this.fileTypes.length is " + this.fileTypes.length);

	/*
	this.db.getBy({
		project: this.id,
		locale: this.sourceLocale
	}, function(resources) {
		this.translations.addAll(resources);
		
		cb();
	}.bind(this));
	*/

	var pathName;
	
	while (!this.paths.isEmpty()) {
		pathName = this.paths.dequeue();
		
	    for (var i = 0; i < this.fileTypes.length; i++) {
	    	logger.trace("Checking if " + this.fileTypes[i].name() + " handles " + pathName);
            if (this.fileTypes[i].handles(pathName)) {
            	logger.info("    " + pathName);
				var file = this.fileTypes[i].newFile(pathName);
				this.files.enqueue(file);

				file.extract();
				this.fileTypes[i].addSet(file.getTranslationSet());
				
				// this generates localized versions of the source file instead of writing
				// an aggregated resource file later
				file.localize(this.translations);
			}
		}
	}
	
	this.paths = undefined; // signal to the GC that we are done with this
	
	cb();
};

/**
 * Load all existing strings from the database, and compare with the
 * newly extracted ones to find which ones to save to the database as
 * new strings. When that is done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * save is done
 */
Project.prototype.save = function(cb) {
	logger.trace("Project save called to save new resources to the DB");
	
	for (var i = 0; i < this.fileTypes.length; i++) {
		var set = this.fileTypes[i].getNew(this.translations);
		if (set && set.size()) {
			this.newres.addAll(set.getAll());
		}
	}
	
	this.db.addAll(this.newres, cb);
};

/**
 * Generate pseudo localized resources based on the English.
 */
Project.prototype.generatePseudo = function() {
	logger.trace("Project generate pseudo");
	
	for (var i = 0; i < this.fileTypes.length; i++) {
		this.fileTypes[i].generatePseudo();
	}
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.write = function(cb) {
	logger.trace("Project write");
	
	for (var i = 0; i < this.fileTypes.length; i++) {
		this.fileTypes[i].write();
	}
	
	cb();
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.close = function(cb) {
	logger.trace("Project close");
	
	// signal to the GC that we don't need these any more
	// before we recurse and allocate a lot more memory.
	this.files = undefined;

	//this.db.close(function() {
	//	cb();
	//});
};
		
module.exports = Project;