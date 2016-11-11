/*
 * ObjectiveCProject.js - represents a Ruby on Rails web project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");

var Project = require("./Project.js");
var ObjectiveCFileType = require("./ObjectiveCFileType.js");
var IosStringsFileType = require("./IosStringsFileType.js");
var XliffFileType = require("./XliffFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ObjectiveCProject");

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
var ObjectiveCProject = function(options, root) {
	this.parent.prototype.constructor.call(this, options, root);
	
	this.objcType = new ObjectiveCFileType(this);
	this.resourceFileType = new XliffFileType(this);
	
	logger.debug("New ObjectiveCProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

ObjectiveCProject.prototype = new Project({noInstance: true});
ObjectiveCProject.prototype.parent = Project;
ObjectiveCProject.prototype.constructor = ObjectiveCProject;

ObjectiveCProject.prototype.initFileTypes = function() {
	this.fileTypes = [
	   this.resourceFileType
    ];
};


/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 * 
 * @param {Function} cb callback function to call when the
 * extraction is done
 *
ObjectiveCProject.prototype.extract = function(cb) {
	logger.trace("Extracting strings from project " + this.options.id);
	
	this.db.getBy({
		project: this.id,
		locale: this.sourceLocale
	}, function(err, resources) {
		this.translations.addAll(resources);
		var pathName, file;
		var fileNames = [];
		
		while (!this.paths.isEmpty()) {
			pathName = this.paths.dequeue();
			
	    	if (this.objcType.handles(pathName)) {
	    		fileNames.push(pathName);
	    		logger.info("    " + pathName);
	    	} else if (this.resourceFileType.handles(pathName)) {
	    		logger.info("    " + pathName);
	    		file = this.resourceFileType.newFile(pathName);
				this.files.enqueue(file);

				file.extract();
				
				this.resourceFileType.addSet(file.getTranslationSet());			
	    	}
		}
		
		this.paths = undefined; // signal to the GC that we are done with this

		// now spawn genstrings to extract all the text from the ObjectiveC files
		var args = ["-o", "."];
		logger.trace("Executing genstrings: " + args.join(" "));
		var procStatus = spawn('genstrings', args, {
			input: fileNames.join("\n")
		});
		procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
		if (procStatus.status !== 0) {
			logger.warn("Execution failed: ");
		}
		procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));

		file = this.resourceFileType.newFile("./Localizable.strings");
		this.files.enqueue(file);
		file.extract();
		this.resourceFileType.addSet(file.getTranslationSet());			

		cb();
	}.bind(this));

};
*/

ObjectiveCProject.prototype.getMainResourceFile = function() {
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
ObjectiveCProject.prototype.getResourceFileType = function() {
	return this.resourceFileType;
};

module.exports = ObjectiveCProject;