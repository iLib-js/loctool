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
var PseudoFactory = require("./PseudoFactory.js");

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
	this.pseudos = {};
	
	// generate all the pseudo bundles we'll need
	project.defaultLocales.forEach(function(locale) {
		var pseudo = PseudoFactory({
			project: project, 
			locale: locale,
			set: this.project.translations,
			type: this.type || "c"		// this.type should be set up in the subclass
		});
		// there may be no pseudo for this locale ...
		if (pseudo) {
			this.pseudos[locale] = pseudo;
			var sourceLocale = pseudo.getSourceLocale();
			if (project.defaultLocales.indexOf(sourceLocale) === -1) {
				// need to load the translations for the source locale for this pseudo to work
				project.defaultLocales.push(sourceLocale);
			}
		}
	}.bind(this));
	
	// for use with missing strings
	if (!project.settings.nopseudo) {
		this.missingPseudo = PseudoFactory({
			project: project, 
			locale: this.pseudoLocale,
			type: this.type || "c"		// this.type should be set up in the subclass
		});
	}

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
 * Ensure that all derived/pseudo resources are generated.
 * 
 * @param {String} locale the target locale that the generated resources will have
 * @param {ResBundle} pb the pseudo translation bundle used to derived the resources
 * @param {TranslationSet|undefined} set the set to use, or undefined to use the default
 * @returns {TranslationSet} the set of generated resources
 */
FileType.prototype.generatePseudo = function(locale, pb, set) {
	logger.trace("generate pseudo and derived resources for file type " + this.name() + " source locale " + this.project.sourceLocale + " target locale " + locale);
	
	var ts = set || this.extracted;
	var resources = ts.getBy({
		locale: this.sourceLocale
	});
	
	resources.forEach(function(resource) {
		if (resource) {
			logger.trace("Generate pseudo/derived translation for resource " + resource.getKey());
			var res = resource.generatePseudo(locale, pb);
			if (res) {
				this.pseudo.add(res);
				res.srcRes = resource;
			}
		}
	}.bind(this));
	
	return this.pseudo;
};

FileType.prototype.close = function() {
	// this.db.close();
};

module.exports = FileType;
