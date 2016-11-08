/*
 * HamlFileType.js - Represents a collection of Haml files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var HamlFile = require("./HamlFile.js");
var YamlFile = require("./YamlFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.HamlFileType");

var HamlFileType = function(project) {
	this.parent.call(this, project);
	
	this.files = [];
};

HamlFileType.prototype = new FileType();
HamlFileType.prototype.parent = FileType;
HamlFileType.prototype.constructor = HamlFileType;

var extensionRE = new RegExp(/\.haml$/);
var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?)\.html\.haml$/);

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
	var ret = pathName.length > 5 && pathName.substring(pathName.length - 5) === ".haml";
	if (ret) {
		var match = alreadyLoc.exec(pathName);
		ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
	}
	
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

/**
 * Process batches of hamls together to extract strings and localize them.
 * 
 * @param {TranslationSet} translations the translations to use with the
 * hamls
 */
HamlFileType.prototype.processHamls = function(translations) {
	logger.trace("executing the haml_localizer on " + this.files.length + " files.");
	var haml_localizer = path.join(path.dirname(module.id), "..", "ruby", "haml_localizer.rb");
	
	for (var i = 0; i < this.files.length; i += 50) {
		var args = [haml_localizer, "en-GB", "/tmp/translations.yml"];
		args = args.concat(this.files.slice(i,i+50));
		logger.trace("Executing ruby " + args.join(" "));
		var procStatus = spawnSync('ruby', args);
		procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
		if (procStatus.status === 0) {
			logger.trace("Execution succeeded. Reading yml file.");
			if (fs.existsSync("unmapped.yml")) {
				var yml = new YamlFile({
					project: this.project,
					pathName: "unmapped.yml",
					locale: this.project.sourceLocale
				});
				yml.extract();
				this.extracted.addSet(yml.getTranslationSet());
			}
		} else {
			logger.warn("Execution failed: ");
		}
		procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));
	}
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
	// distribute all the resources to their resource files
	// and then let them write themselves out
	var resFileType = this.project.getResourceFileType("haml");
	var res, file, resources = this.extracted.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}

	resources = this.pseudo.getAll();
	
	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = resFileType.getResourceFile(res.context, res.locale, res.resType + "s");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}
};


HamlFileType.prototype.newFile = function(pathName) {
	logger.trace("Creating new haml file for " + pathName + " len " + this.files.length);
	if (alreadyLoc.test(pathName)) {
		
	}
	this.files.push(pathName);
	return new HamlFile(this.project, pathName, this);
};

module.exports = HamlFileType;

