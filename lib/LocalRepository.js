/*
 * LocalRepository.js - a collection of resource strings backed by a local set of files
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Xliff = require("./Xliff.js");

var logger = log4js.getLogger("loctool.lib.LocalRepository");

/**
 * @class A class that represents the local story of a set of 
 * translations used in a project.
 * 
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var LocalRepository = function (options) {
	logger.trace("LocalRepository constructor called");
	this.sourceLocale = "en-US";
	if (options) {
		this.sourceLocale = options.sourceLocale || "en-US";
		this.pathName = options.pathName;
		this.project = options.project;
	}
	this.ts = new TranslationSet(this.sourceLocale);
};

/**
 * Initialize this repository and read in all of the strings.
 * 
 * @param {Project} project the current project
 * @param {Function(Object, Object)} cb callback to call when the
 * initialization is done
 */
LocalRepository.prototype.init = function(cb) {
	if (this.pathName) {
		var xliff = new Xliff({
			sourceLocale: this.sourceLocale
		});
		try {
			if (fs.existsSync(this.pathName)) {
				var data = fs.readFileSync(this.pathName, "utf-8");
				xliff.deserialize(data);
				this.ts = xliff.getTranslationSet();
			}
		} catch (e) {
			logger.error("Error reading xliff file '" + this.pathName + "'. Skipping...");
			logger.error(e);
		}
	}
	cb();
};

/**
 * Get a resource by its database id.
 * 
 * @param {number} id the id of the record in the DB
 * @param {Function(Object, Object)} cb callback to call with the error code and the 
 * resulting DB row or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.get = function(id, cb) {
	cb(null, this.ts.getBy({id: id}));
};

/**
 * Get a resource by the given criteria.
 * @param {Object} criteria the filter criteria to select the resources to return
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the 
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getBy = function(options, cb) {
	logger.trace("Getting a resource by criteria");
	var resources = this.ts.getBy(options);
	cb(null, resources ? resources : []);
};

/**
 * Get a single resource with the given criteria. This method returns undefined if there is no
 * resource with the exact criteria given.
 * 
 * @param {String} key The key of the resource being sought.
 * @param {String|undefined} type the type of this resource (string, array, or plural). Default is "string"
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources
 * @param {String|undefined} project the project of the resources
 * @param {String|undefined} pathName path to the file containing the resource
 * @param {String|undefined} datatype data type of the resource being sought
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the 
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getResource = function(key, type, context, locale, project, pathName, datatype, cb) {
	logger.trace("Getting a resource by criteria");
	cb(null, this.ts.get(key, type, context, locale, project, pathName));
};

/**
 * Get a single resource with the given hashkey. This method returns undefined if there is no
 * resource with the exact criteria given.
 * 
 * @param {String} hashkey The hashkey of the resource being sought.
 * @param {Function(Object, Resource|undefined)} cb callback to call with the error code and the 
 * resulting Resource, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getResourceByHashKey = function(hashkey, cb) {
	logger.trace("Getting a resource by criteria");
	cb(null, this.ts.get(hashkey));
};

/**
 * Return an array of all the project names in the database.
 * 
 * @param {Function(Array.<string>|undefined)} cb callback to call when 
 * the names are retrieved. If there are no projects yet, then this
 * will return undefined.
 */
LocalRepository.prototype.getProjects = function(cb) {
	cb(this.ts.getProjects());
};

/**
 * Return an array of all the contexts within the given project 
 * in the database. The root context is just the empty string.
 * The root context is where all strings will go if they are
 * not given an explicit context in the resource file or code.
 * 
 * @param {String} project the project that contains the contexts
 * @param {Function(Array.<string>)} cb callback to call when 
 * the contexts are retrieved. If there are no contexts in the
 * project, this method will return undefined.
 */
LocalRepository.prototype.getContexts = function(project, cb) {
	cb(this.ts.getContexts(project));
};

/**
 * Return an array of all the locales available within the given 
 * project and context in the database. The root context is just 
 * the empty string. The locales are returned as BCP-47 locale
 * specs.
 * 
 * @param {String} project the project that contains the contexts
 * @param {String} context the context that contains the locales.
 * Use the empty string "" for the default/root context.
 * @param {Function(Array.<string>)} cb callback to call when 
 * the locales are retrieved. If there are no locales in the
 * project/contexts, this method will return undefined.
 */
LocalRepository.prototype.getLocales = function(project, context, cb) {
	cb(this.ts.getLocales(project, context));
};

/**
 * Call the callback with true if the DB already contains the
 * given resource.
 * 
 * @param {Resource} resource the resource to check
 * @param {Function(Array.<Resource>|undefined)} cb the callback 
 * to call once it has been determined whether the DB contains 
 * the resource already. If not, it returns undefined.
 */
LocalRepository.prototype.contains = function(resource, cb) {
	cb(this.ts.getBy(resource).length > 0);
};

/**
 * Add a resource to this set. If this resource has the same key
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 * @param {Function} cb function to call when the resource is added
 */
LocalRepository.prototype.add = function(resource, cb) {
	this.ts.add(resource);
	cb(null, {
		affectedRows: resource.size()
	});
};

/**
 * Add every resource in the given translation set to this
 * repository. The resources will be updated if the resource 
 * is already in the repository but contain different fields,
 * and will be added as new if not.
 * 
 * @param {TranslationSet} set an set of resources to add
 * to the DB
 * @param {Function} cb callback function to call once 
 * the resources are added to the DB
 */
LocalRepository.prototype.addAll = function(set, cb) {
	this.ts.addSet(set);
	cb(null, {
		affectedRows: set.size()
	});
};

/**
 * Return the number of strings in this set. This counts one for each plural string
 * and for each array member, so this does not correspond to the number of resources.
 *
 * @param {Function(number)} cb callback to call when the size of the table is determined
 */
LocalRepository.prototype.size = function(cb) {
	cb(this.ts.size());
};

/**
 * Remove a resource from the database. If the resource has an id, then the row with that id
 * will be removed.
 * @param {Resource} resource the resource to remove
 * @param {Function(Object,boolean)} cb the callback function to call when the removal is done.
 * The second parameter is a boolean that tells whether or not the removal was successful.
 */
LocalRepository.prototype.remove = function(resource, cb) {
	cb(null, this.ts.remove(resource));
};

/**
 * Remove all Resources from the table. WARNING: THIS IS PERMANENT. You can't get the records back
 * again. This method was intended to
 * be used in the unit tests only. Regular code should never call this method.
 * @param {Function} cb callback to call when the clear is done
 */
LocalRepository.prototype.clear = function(cb) {
	logger.trace("Clearing all resources");
	this.ts.clear();
	cb();
};

/**
 * Close the connection to the database and clean up. After this method is called,
 * no more calls can be made.
 * @param {Function} cb callback to call when the repository is closed
 */
LocalRepository.prototype.close = function(cb) {
	logger.trace("Closing local repository. Set is dirty? " + this.ts.isDirty());
	
	if (this.pathName && this.ts.isDirty()) {
		logger.debug("Writing resources to " + this.pathName);
		var xliff = new Xliff({
			sourceLocale: this.sourceLocale,
			project: this.project
		});
		xliff.addSet(this.ts);
		// fs.writeFileSync(this.pathName, xliff.serialize(), "utf-8");
	}
	cb();
};

module.exports = LocalRepository;