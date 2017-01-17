/*
 * FileType.js - manages a collection of android resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");
var PseudoBritish = require("./PseudoBritish.js");

var logger = log4js.getLogger("loctool.lib.FileType");

/**
 * @class Manage a collection source files of a particular type.
 * 
 * @param {Project} project that this type is in
 */
var FileType = function(project) {
	if (!project) return; // if there's no project, this was called for inheritance
	
	this.project = project;
	this.extracted = new TranslationSet(project.sourceLocale);
	this.newres = new TranslationSet(project.sourceLocale);
	this.pseudo = new TranslationSet(project.sourceLocale);
	this.sourceLocale = project.sourceLocale;
	this.pseudoLocale = project.pseudoLocale;
	
	// zxx is the language "unspecified" and XX is the region "unknown"
	this.pseudoBundle = new ResBundle({
    	type: "c",
		locale: "zxx-XX",
		lengthen: "true"
	});
	
	this.pb = new PseudoBritish({
		type: "text"
	});
	
	this.resourceFiles = {};
};

/**
 * Get all resources extracted so far.
 * 
 * @returns {Array.<Resource>} an array of resources extracted so far
 */
FileType.prototype.getResources = function() {
	return this.extracted.getAll();
};

/**
 * Return the set of strings extracted from all instances of this type 
 * of source file.
 * 
 * @returns {TranslationSet} the set of extracted strings
 */
FileType.prototype.getExtracted = function() {
	return this.extracted;
};

/**
 * Return the set of pseudo-localized strings for all instances of this type 
 * of source file.
 * 
 * @returns {TranslationSet} the set of pseudo-localized strings
 */
FileType.prototype.getPseudo = function() {
	return this.pseudo;
};

/**
 * Return the set of strings extracted from all instances of this type 
 * of source file which which do not exist already in the database.
 * 
 * @returns {TranslationSet} the set of new strings
 */
FileType.prototype.getNew = function() {
	return this.newres;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 * 
 * @param {TranslationSet} set set of resources to add to the current set
 */
FileType.prototype.addSet = function(set) {
	this.extracted.addSet(set);
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
FileType.prototype.generatePseudo = function() {
	logger.trace("generate pseudo for file type " + this.name() + " source locale " + this.project.sourceLocale + " pseudo locale " + this.project.pseudoLocale);
	
	var resources = this.extracted.getBy({
		locale: this.project.sourceLocale
	});
	var locale = new Locale(this.project.pseudoLocale || "zxx-XX").getSpec();
	var resource;
	
	logger.trace("extracted length is " + this.extracted.size());
	resources.forEach(function(resource) {
		if (resource) {
			logger.trace("Generate pseudo for resource " + resource.getKey());
			var res = resource.generatePseudo(locale, this.pseudoBundle);
			res && this.pseudo.add(res);

			logger.trace("Generate pseudo British for resource " + resource.getKey());
			res = resource.generatePseudo("en-GB", this.pb);
			res && this.pseudo.add(res);
		}
	}.bind(this));

	return this.pseudo;
};

FileType.prototype.close = function() {
	// this.db.close();
};

module.exports = FileType;
