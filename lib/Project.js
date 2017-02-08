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
var LocalRepository = require("./LocalRepository.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var PseudoBritish = require("./PseudoBritish.js");
var Xliff = require("./Xliff.js");
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
		if (options.noInstance) {
			// used for inheritance not for localization...
			return;
		}
		this.sourceLocale = options.sourceLocale;
		this.pseudoLocale = options.pseudoLocale;
		if (options.excludes && ilib.isArray(options.excludes)) {
			logger.trace("normalizing excludes");
			// match sure the paths are matchable
			this.options.excludes = options.excludes.map(function(pathName) {
				return path.normalize(pathName);
			});
		}
	}
	this.root = root;
	this.sourceLocale = this.sourceLocale || "en-US";
	this.pseudoLocale = this.pseudoLocale || "zxx-XX";
	this.settings = options.settings;
	
	// all translations in the db
	this.translations = new TranslationSet(this.sourceLocale);
	
	// new translations that are not in the db
	this.newres = new TranslationSet(this.sourceLocale);
	
	// the pseudo-localized translations
	this.pseudo = new TranslationSet(this.sourceLocale);
	
	// all extracted translations
	this.extracted = new TranslationSet(this.sourceLocale);
	
	this.paths = new Queue();
	this.files = new Queue();
	
	this.db = new LocalRepository({
		sourceLocale: this.sourceLocale,
		pseudoLocale: this.pseudoLocale,
		pathName: path.join(this.root, this.options.id + ".xliff"),
		project: this
	});
	
	logger.debug("New Project: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

/**
 * Initialize the project. This will open any database connections
 * and load files and any other things that are necessary to begin
 * processing the files in this project.
 * 
 * @params {Function} cb a callback function to call when the 
 * project initialization is done
 */
Project.prototype.init = function(cb) {
	this.initFileTypes(); // abstract method implemented in the subclasses
	logger.trace("this.fileTypes.length is " + this.fileTypes.length);

	// make sure they register their data types so their resources can be instantiated again later
	this.fileTypes.forEach(function(type) {
		type.registerDataTypes();
	});

	this.db.init(function() {
		// use the specified locales if they exist, or else use whatever locales
		// already exist in the translations. Make sure to also add in the
		// pseudo-locale.
		this.db.getLocales(this.options.id, undefined, function(dbLocales) {
			var locales = this.defaultLocales || dbLocales || [];
			if (!this.defaultLocales && !this.settings.nopseudo) {
				locales.push(this.options.pseudoLocale);
			}
			
			// weed out the source locales -> don't have to translate to those!
			locales = locales.filter(function(locale) {
				return locale !== "en" && locale !== this.sourceLocale;
			}.bind(this));
			
			logger.info("Localize project " + this.options.id + " to locales " + JSON.stringify(locales));
			
			this.locales = locales;
			
			cb();
		}.bind(this));
	}.bind(this));
};

/**
 * Return the translation set for this project.
 * 
 * @returns {TranslationSet} the translation set
 */
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
	
	this.db.getBy({
		project: this.options.id,
		locale: this.sourceLocale
	}, function(err, resources) {
		logger.trace("Getting all resources. Length: " + resources.length);
		logger.trace("Getting all resources. tu length: " + this.db.ts.resources.length);
		this.translations.addAll(resources);
		var pathName;
		
		while (!this.paths.isEmpty()) {
			pathName = this.paths.dequeue();
			
			try {
			    for (var i = 0; i < this.fileTypes.length; i++) {
			    	logger.trace("Checking if " + this.fileTypes[i].name() + " handles " + pathName);
		            if (this.fileTypes[i].handles(pathName)) {
		            	logger.info("    " + pathName);
						var file = this.fileTypes[i].newFile(pathName);
						this.files.enqueue(file);
						file.extract();
						
						this.fileTypes[i].addSet(file.getTranslationSet());
					}
				}
			} catch (e) {
				logger.error("Error while extracting from file " + pathName + ". Skipping...");
				logger.error(e);
			}
		}
		
		this.paths = undefined; // signal to the GC that we are done with this
		
		cb();
	}.bind(this));
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
			this.newres.addSet(set);
		}
	}
	
	// this.db.addAll(this.newres, cb);
	cb();
};

/**
 * Generate pseudo localized resources based on the English.
 */
Project.prototype.generatePseudo = function() {
	logger.trace("Project generate pseudo");
	var pb;

	if (!this.settings.nopseudo && (typeof(this.options.generatePseudo) === "undefined" || this.options.generatePseudo)) {
		for (var i = 0; i < this.fileTypes.length; i++) {
			this.fileTypes[i].generatePseudo(this.pseudoLocale);
		}
	}

	if (this.locales.indexOf("en-GB") > -1) {
		pb = new PseudoBritish();
	
		for (var i = 0; i < this.fileTypes.length; i++) {
			this.fileTypes[i].generatePseudo("en-GB", this.fileTypes[i].pb);
		}
	}

	for (var i = 0; i < this.fileTypes.length; i++) {
		this.pseudo.addSet(this.fileTypes[i].getPseudo());
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
	
	var file;
	
	logger.info("Write project " + this.options.id + " to locales " + JSON.stringify(this.locales));
		
	var superset = new TranslationSet(this.sourceLocale);
	
	this.db.getBy({
		locale: this.locales
	}, function(err, resources) {
		superset.addAll(resources);
		
		file = !this.files.isEmpty() && this.files.dequeue();
		while (file) {
			// this generates localized versions of each source file instead of writing
			// an aggregated resource file later. Only some file types implement this.
			file.localize(superset, this.locales);
	
			file = !this.files.isEmpty() && this.files.dequeue();
		}
	
		// now write out the aggregate resource files
		for (var i = 0; i < this.fileTypes.length; i++) {
			this.fileTypes[i].write(superset, this.locales);
		}
		
		logger.trace("Finished writing out the aggregated resource files.");

		cb();
	}.bind(this));
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

	var extracted = new TranslationSet(this.sourceLocale);
	
	for (var i = 0; i < this.fileTypes.length; i++) {
    	logger.trace("Collecting extracted strings from " + this.fileTypes[i].name());
    	extracted.addAll(this.fileTypes[i].getExtracted().getBy({
    		locale: this.sourceLocale
    	}));
	}

	// calculate only the new strings and save them to the db
	var newres = this.newres;
	
	logger.trace("translations is size " + this.translations.size());
	logger.trace("extracted is size " + extracted.size());
	logger.trace("newres is size " + newres.size());
	/*
	this.db.addAll(newres, function() {
		this.db.close(function() {
			cb();
		});
	}.bind(this));
	*/
	
	var repoPath = this.db.pathName;
	var dir = path.dirname(repoPath);
	var base = path.basename(repoPath, ".xliff");
	var extractedPath = path.join(dir, base + "-extracted.xliff");
	
	logger.info("Writing out the extracted strings to " + extractedPath);
	var extractedXliff = new Xliff({
		pathName: extractedPath
	});
	extractedXliff.addSet(extracted);
	fs.writeFileSync(extractedPath, extractedXliff.serialize(), "utf-8");

	var newLocales = newres.getLocales();
	
	if (newLocales && newLocales.length) {
		for (var i = 0; i < newLocales.length; i++) {
			var locale = newLocales[i];
			if (locale !== this.sourceLocale) {
				var newPath = path.join(dir, base + "-new-" + locale + ".xliff");
				var resources = newres.getAll().filter(function(res) {
					return (res.origin === "source" || (res.origin === "target" && res.locale === locale)) && !res.dnt;
				});
				
				if (resources && resources.length) {
					logger.info("Writing out the new strings to " + newPath);
					var newXliff = new Xliff({
						project: this.name,
						pathName: newPath,
						sourceLocale: this.sourceLocale
					});
					
					resources.forEach(function(res) {
						newXliff.addResource(res);
					});
					
					fs.writeFileSync(newPath, newXliff.serialize(), "utf-8");
				} else {
					if (fs.existsSync(newPath)) {
						fs.unlinkSync(newPath);
					}
				}
			}
		}
	} else {
		logger.info("No new strings in this run.");
	}
	
	this.db.close(function() {
		cb();
	});
};
		
module.exports = Project;