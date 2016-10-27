/*
 * TranslationSet.js - a collection of resource strings
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");
var JSUtils = require("ilib/lib/JSUtils");

var utils = require("./utils.js");
var Set = require("./Set.js");

var logger = log4js.getLogger("loctool.lib.TranslationSet");

/**
 * @class A class that represents a set of translations used in 
 * a project.
 * 
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var TranslationSet = function(sourceLocale) {
	this.sourceLocale = sourceLocale || "zxx-XX";
	
	this.resources = [];
	this.byKey = {};
	this.dirty = false;
	this.stringsBySource = {};
};

/**
 * @private
 * @param project
 * @param context
 * @param locale
 * @param key
 * @param type
 * @returns
 */
TranslationSet.prototype._hashKey = function(project, context, locale, key, type) {
	var key = [key, type || "string", locale || this.sourceLocale, context, project].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Get a resource by its key and context. If the context is undefined,
 * this method will find the base generic resource with no context.
 * 
 * @param {String} key The key of the resource being sought.
 * @param {String|undefined} type the type of this resource (string, array, or plural). Default is "string"
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources
 * @param {String|undefined} project the project of the resources
 * @returns {Resource|undefined} a resource corresponding to the key, or undefined if there is no 
 * resource with that key
 */
TranslationSet.prototype.get = function(key, type, context, locale, project) {
	logger.trace("Get a resource");
	return this.byKey[this._hashKey(project, context, locale, key, type)];
};

/**
 * Get a resource by its source string and context. The source string must be written
 * in the language and script of the source locale. For array types, the 
 * source string
 * must be one of the values in the string array. For plural types, it 
 * must be one of the values of the quantities.<p>
 * 
 * If the context is undefined,
 * this method will find the base generic resource with no context.
 * 
 * @param {String} source The source string to look up
 * @param {String|undefined} context The optional context of the resource being sought.
 * @returns {Resource|undefined} a resource corresponding to the source string, or 
 * undefined if there is no resource with that source
 */
TranslationSet.prototype.getBySource = function(source, context) {
	logger.trace("Get a resource by source");
	return this.stringsBySource[source + '@' + context];
};

/**
 * Return all resources in this set.
 * 
 * @returns {Array.<Resource>} an array of resources in this set,
 * possibly empty
 */
TranslationSet.prototype.getAll = function() {
	return this.resources;
};

/**
 * Add a resource to this set. If this resource has the same key
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 */
TranslationSet.prototype.add = function(resource) {
	var existing, key = resource.getKey(), hashKey;
	logger.trace("Add a resource: " + JSON.stringify(resource));
	
	hashKey = this._hashKey(resource.project, resource.context, resource.locale, key, resource.resType);
	
	existing = this.byKey[hashKey];
	
	if (existing) {
		logger.trace("Same key as existing resource: " + JSON.stringify(existing));
		if (resource.resType === "string") {
			if (resource.getSource() !== existing.getSource()) {
				logger.debug("Updating source");
				logger.debug("Key: " + key);
				logger.debug("Existing Source: " + existing.getSource() + "(" + existing.pathName + ")");
				logger.debug("New Source: " + resource.getSource() + "(" + resource.pathName + ")");
				
				JSUtils.shallowCopy(resource, existing);
				this.dirty = true;
			}			
		}
	} else {
		logger.trace("New resource");
		this.resources.push(resource);
		this.byKey[hashKey] = resource;
		this.dirty = true;
		
		if (resource.resType === "string" && resource.autoKey) {
			this.stringsBySource[resource.getSource() + '@' + resource.context] = resource;
		}
	}
};

/**
 * Add every resource in the given array to this set. 
 * @param {Array.<Resource>} resources an array of resources to add
 * to this set
 */
TranslationSet.prototype.addAll = function(resources) {
	if (resources && resources.length) {
		resources.forEach(function(resource) {
			this.add(resource);
		}.bind(this));
	}
};

/**
 * Add every resource in the given translation set to this set,
 * merging the results together.
 *  
 * @param {TranslationSet} set an set of resources to add
 * to this set
 */
TranslationSet.prototype.addSet = function(set) {
	if (set && set.resources && set.resources.length) {
		this.addAll(set.resources);
	} else {
		logger.trace("addSet: nothing to add");
	}
};

/**
 * Return the number of unique resources in this set. 
 * @param {String|undefined} context The optional context of the resource being counted.
 * @param {String|undefined} locale the locale of the resources being counted
 * @returns {number} the number of unique resources in this set
 */
TranslationSet.prototype.size = function(context, locale) {
	return this.resources.length;
};

/**
 * Reset the dirty flag to false, meaning the set is clean. This will
 * allow callers to tell if any more resources were added after
 * this call was made because adding those resources will set
 * the dirty flag to true again.
 */
TranslationSet.prototype.setClean = function() {
	this.dirty = false;
};

/**
 * Return whether or not this set is dirty. The dirty flag is set
 * whenever a new resource was added to or removed from the set 
 * after it was created or since the last time the setClean method 
 * was called.
 * @return {boolean} true if the set is dirty, false otherwise
 */
TranslationSet.prototype.isDirty = function() {
	return this.dirty;
};

/**
 * Remove a resource from the set. The resource must have at
 * least enough fields specified to uniquely identify the 
 * resource to remove. These are: project, context, locale,
 * resType, and reskey.
 * 
 * @param {Resource} resource The resource to remove
 * @returns {boolean} true if the resource was removed successfully
 * and false otherwise
 */
TranslationSet.prototype.remove = function(resource) {
	var ret = false;
	
	if (resource && resource.project && resource.context && resource.locale && resource.reskey && resource.resType) {
		for (var i = 0; i < this.resources.length; i++) {
			var res = this.resources[i];
			if (resource.project === res.project &&
					resource.context == res.context &&
					resource.locale === res.locale &&
					resource.reskey === res.reskey) {
				var hashKey = this._hashKey(resource.project, resource.context, resource.locale, resource.reskey, resource.resType);
				this.byKey[hashKey] = undefined;
				if (resource.resType === "string") {
					this.stringsBySource[res.getSource() + '@' + res.context] = undefined;
				}
				this.resources.splice(i, 1);
				this.dirty = true;
				ret = true;
				break;
			}
		}
	}
	
	return ret;
};

/**
 * @private
 */
TranslationSet.prototype._select = function(criteria) {
	var fields = Object.keys(criteria);
	
	return this.resources.filter(function(res) {
		return fields.every(function(field) {
			return res[field] === criteria[field];
		});
	});
};

/**
 * Get a resource by the given criteria.
 * @param {Object} criteria the filter criteria to select the resources to return
 * @returns {Array.<Resource>|undefined} the array of Resources, or undefined if the 
 * retrieval did not find any resources that match or there was some error
 */
TranslationSet.prototype.getBy = function(options) {
	logger.trace("Getting resources by criteria");
	
	return this._select(options);
};

/**
 * Return an array of all the project names in the database.
 * 
 * @returns {Array.<String>|undefined} the array of project names
 * or undefined if there are no projects in the set
 */
TranslationSet.prototype.getProjects = function() {
	var set = new Set();
	
	this.resources.map(function(res) {
		set.add(res.getProject());
	});
	
	var projects = set.asArray();
	return projects.length ? projects : undefined;
};

/**
 * Return an array of all the contexts within the given project 
 * in the set. The root context is just the empty string.
 * The root context is where all strings will go if they are
 * not given an explicit context in the resource file or code.
 * 
 * @param {String} project the project that contains the contexts
 * @returns {Array.<String>|undefined} the array of context names
 * or undefined if there are no contexts in the set
 */
TranslationSet.prototype.getContexts = function(project) {
	var set = new Set();
	
	this.resources.map(function(res) {
		if (res.getProject() === project) {
			var context = res.getContext();
			set.add(context ? context : "");
		}
	});
	
	var contexts = set.asArray();
	return contexts.length ? contexts : undefined;
};

/**
 * Return an array of all the locales available within the given 
 * project and context in the set. The root context is just 
 * the empty string. The locales are returned as BCP-47 locale
 * specs.
 * 
 * @param {String} project the project that contains the contexts
 * @param {String} context the context that contains the locales
 * Use the empty string "" for the default/root context.
 * @returns {Array.<String>|undefined} the array of context names
 * or undefined if there are no contexts in the set
 */
TranslationSet.prototype.getLocales = function(project, context) {
	var set = new Set();
	
	this.resources.map(function(res) {
		if (res.getProject() === project && res.getContext() === context) {
			set.add(res.getLocale());
		}
	});
	
	var locales = set.asArray().sort();
	return locales.length ? locales : undefined;
};

/**
 * Clear all resources from this set.
 */
TranslationSet.prototype.clear = function() {
	this.resources = [];
	this.byKey = {};
	this.dirty = false;
	this.stringsBySource = {};
};

/**
 * Return a new translation set that contains the differences
 * between the current set and the other set. Resources are
 * added to the difference set if they exist in the other
 * set but not the current one, or if they exist in both
 * sets, but contain different fields.
 * 
 * @param {TranslationSet} other the other set to diff against
 * @returns {TranslationSet} the differences between the other
 * set and this one
 */
TranslationSet.prototype.diff = function(other) {
	var otherres = other.getAll();
	var diff = new TranslationSet(this.sourceLocale);
	var res, existing;
	
	for (var i = 0; i < otherres.length; i++) {
		res = otherres[i];
		existing = this.byKey[this._hashKey(res.project, res.context, res.locale, res.reskey, res.resType)];
		
		if (!existing || !existing.equals(res)) {
			diff.add(res);
		}
	}
	
	return diff;
};

module.exports = TranslationSet;