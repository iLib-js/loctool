/*
 * IosStringsFileType.js - manages a collection of iOS strings resource files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var IosStringsFile = require("./IosStringsFile.js");
var TranslationSet = require("./TranslationSet.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var IosLayoutResourceString = require("./IosLayoutResourceString.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.IosStringsFileType");

/**
 * @class Manage a collection of iOS strings resource files.
 *
 * @param {Project} project that this type is in
 */
var IosStringsFileType = function(project) {
	this.type = "objc";
	this.parent.call(this, project);

	this.resourceFiles = {};
};

IosStringsFileType.prototype = new FileType();
IosStringsFileType.prototype.parent = FileType;
IosStringsFileType.prototype.constructor = IosStringsFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
IosStringsFileType.prototype.handles = function(pathName) {
	logger.debug("IosStringsFileType handles " + pathName + "?");

	var ret = true;
	var parent = path.dirname(pathName);
	var dir = path.normalize(path.dirname(parent));

	if (parent && parent.substring(parent.length - 6) === ".lproj") {
		var resdir = path.normalize((this.project.options.resourceDirs && this.project.options.resourceDirs["objc"]) || ".");
		ret = path.basename(parent) !== "Base.lproj" && path.basename(pathName) !== "Localizable.strings";
	}

	logger.trace("dir being tested is is " + dir);

	// logger.trace("resdir: " + resdir + " dir: " + dir);
	var ret = ret && (pathName.length > 8) && (pathName.substring(pathName.length - 8) === ".strings");

	if (ret) {
		var base = path.basename(parent, ".lproj");
		// logger.trace("testing " + dir);
		ret = (base === "." || base === "en-US") && base !== "Base";
	}

	logger.debug(ret ? "Yes" : "No");
	return ret;
};

/**
 * Write out all resources for this file type. For iOS resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
IosStringsFileType.prototype.write = function(translations, locales) {
	// distribute all the new resources to their resource files ...
	logger.trace("distributing all new resources to their resource files");
	var res, file,
		resources = this.extracted.getAll(),
		db = this.project.db,
		translationLocales = locales.filter(function(locale) {
			return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale && !PseudoFactory.isPseudoLocale(locale);
		}.bind(this));

	logger.trace("There are " + resources.length + " resources to add.");

	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.locale, res.pathName, "xib");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);

		// for each extracted string, write out the translations of it
		translationLocales.forEach(function(locale) {
			logger.trace("Adding translations for " + res.reskey + " to locale " + locale);

			db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
				var r = translated; // default to the source language if the translation is not there
				if (!translated || res.dnt) {
					r = res.clone();
					r.locale = locale;
					r.state = "new";
					r.origin = "target";

					this.newres.add(res);
					this.newres.add(r);

					logger.trace("No translation for " + res.reskey + " to " + locale + ". Adding to new resources file.");
				}

				file = this.getResourceFile(locale, res.pathName, "xib");
				file.addResource(r);
				logger.trace("Added " + r.reskey + " to " + file.pathName);
			}.bind(this));
		}.bind(this));
	}

	resources = this.pseudo.getAll();

	for (var i = 0; i < resources.length; i++) {
		res = resources[i];
		file = this.getResourceFile(res.locale, res.pathName, "xib");
		file.addResource(res);
		logger.trace("Added " + res.reskey + " to " + file.pathName);
	}

	logger.trace("Now writing out the resource files");
	// ... and then let them write themselves out
	for (var hash in this.resourceFiles) {
		file = this.resourceFiles[hash];
		file.write();
	}
};

IosStringsFileType.prototype.name = function() {
    return "iOS Strings Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {IosStringsFile} a resource file instance for the
 * given path
 */
IosStringsFileType.prototype.newFile = function(pathName) {
	var file = new IosStringsFile({
		project: this.project,
		pathName: pathName,
		type: this
	});

	this.resourceFiles[pathName] = file;
	return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path name of the resource being added.
 * @param {String} type one of "objc" or "xib" strings from each source
 * file type go into different types of resource files
 * @return {IosStringsFile} the Android resource file that serves the
 * given project, context, and locale.
 */
IosStringsFileType.prototype.getResourceFile = function(locale, pathName, type) {
	var l = new Locale(locale);
	var localeDir, dir, newPath;

	var localeMapping = {
		"en-GB": "en-001.lproj",
		"de-DE": "de.lproj",
		"es-US": "es.lproj",
		"es-ES": "es.lproj",
		"ps-DO": "ps.lproj",
		"zh-Hans-CN": "zh-Hans.lproj",
		"zh-Hant-HK": "zh-Hant.lproj"
	};

	localeDir = localeMapping[locale] || locale + ".lproj";

	if (type === "xib") {
		// strings from xib files go into the xib's localized strings file instead of the main project strings file
		var base = path.basename(pathName, ".xib");

		// this is the parent dir
		var dir = path.dirname(path.dirname(pathName));
		newPath = path.join(dir, localeDir, base + ".strings");
	} else {
		dir = this.project.options.resourceDirs["objc"];
		newPath = path.join(dir, localeDir, "Localizable.strings");
	}

	utils.makeDirs(path.join(dir, localeDir));

	logger.trace("getResourceFile converted path " + pathName + " for locale " + locale + " to path " + newPath);

	var resfile = this.resourceFiles && this.resourceFiles[newPath];

	if (!resfile) {
		resfile = this.resourceFiles[newPath] = new IosStringsFile({
			project: this.project,
			locale: locale || this.project.sourceLocale,
			pathName: newPath,
			type: this
		});

		logger.trace("Defining new resource file");
	} else {
		logger.trace("Returning existing resource file");
	}

	return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<IosStringsFile>} an array of resource files
 * known to this file type instance
 */
IosStringsFileType.prototype.getAll = function() {
	return this.resourceFiles;
};

/**
 * Clear the cache of resource files so that new ones can be created.
 */
IosStringsFileType.prototype.clear = function() {
	this.resourceFiles = {};
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
IosStringsFileType.prototype.registerDataTypes = function() {
	ResourceFactory.registerDataType("x-xib", "string", IosLayoutResourceString);
};

module.exports = IosStringsFileType;
