/*
 * HamlFileType.js - Represents a collection of Haml files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");

var utils = require("./utils.js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var TranslationSet = require("./TranslationSet.js");
var HamlFile = require("./HamlFile.js");
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;

var logger = log4js.getLogger("loctool.lib.HamlFileType");

var HamlFileType = function(project) {
	this.project = project;
	this.newres = new TranslationSet(project.sourceLocale);
	
	this.files = [];
};

var extensionRE = new RegExp(/\.haml$/);
var alreadyLoc = new RegExp(/\.[a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?\.html\.haml$/);

/**
 * Return true if the given path is a Haml file and is handled
 * by the current file type.
 * 
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Haml file, or false
 * otherwise
 */
HamlFileType.prototype.handles = function(pathName) {
	logger.debug("HamlFileType handles " + pathName + "?");
	// var ret = extensionRE.test(pathName);
	var ret = (pathName.length > 5) && (pathName.substring(pathName.length - 5) === ".haml") && !alreadyLoc.test(pathName);
	
	logger.debug(ret ? "Yes" : "No");
	return ret;
};

HamlFileType.prototype.name = function() {
    return "Haml File Type";
};

HamlFileType.prototype.getResources = function() {
	return this.extracted;
};

/**
 * Add a resource to the file type. This method notes whether
 * or not the resource is new, changed from an existing 
 * resource, or is the same as an existing resource.
 * @param {Resource} resource the resource to add
 */
HamlFileType.prototype.addResource = function(resource, cb) {
};

HamlFileType.prototype.addSet = function(set) {
	// this.extracted.addSet(set);
};

HamlFileType.prototype.generatePseudo = function() {
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource 
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there 
 * are no aggregated strings.
 */
HamlFileType.prototype.write = function() {
	logger.trace("executing the haml_localizer on " + this.files.length + " files.");
	console.log("module is ");
	console.dir(module);
	var haml_localizer = path.join(path.dirname(module.id), "..", "ruby", "haml_localizer.rb");
	
	for (var i = 0; i < this.files.length; i += 10) {
		var args = [haml_localizer, "en-GB", "/tmp/translations.yml"];
		args = args.concat(this.files.slice(i,i+10));
		logger.trace("Executing ruby " + args.join(" "));
		var procStatus = spawnSync('ruby', args);
		procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
		if (procStatus.status !== 0) {
			logger.warn("Execution failed: ");
		}
		procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));
	}

	/*
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType();
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
	}
	*/
};


HamlFileType.prototype.newFile = function(pathName) {
	logger.trace("Creating new haml file for " + pathName + " len " + this.files.length);
	if (alreadyLoc.test(pathName)) {
		
	}
	this.files.push(pathName);
	return new HamlFile(this.project, pathName, this);
};

HamlFileType.prototype._checkResource = function(i, cb) {
	if (i < this.extracted.length) {
		this.db.contains(this.extracted[i], function(r) {
			if (!r) {
				this.newres.add(this.extracted[i]);
			} else {
				logger.trace("Exists: [" + resource.getProject() + ", " + 
						resource.getContext() + ", " + resource.getLocale() + ", " + 
						resource.getKey() + "]");
			}
			this._checkResource(i+1, cb);
		}.bind(this));
	} else {
		
	}
};

HamlFileType.prototype.collect = function() {
	this._checkResource(0, function() {
		
	});
};

HamlFileType.prototype.close = function() {
	// this.db.close();
};

module.exports = HamlFileType;
