/*
 * TranslationSet.js - a collection of resource strings
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var utils = require("./utils.js");
var log4js = require("log4js");

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
 * @param {String|undefined} locale the locale of the resources to
 * @returns {Resource|undefined} a resource corresponding to the key, or undefined if there is no 
 * resource with that key
 */
TranslationSet.prototype.get = function(key, type, context, locale) {
	logger.trace("Get a resource");
	return this.byKey[this._hashKey(undefined, context, locale, key, type)];
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
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources to
 * return, or undefined for the resources in the source language
 * @returns {Array.<Resource>} an array of resources in this set,
 * possibly empty
 */
TranslationSet.prototype.getAll = function(context, locale) {
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
 * not implemented yet
 * @param resource
 */
TranslationSet.prototype.remove = function(resource) {
	// TODO implement TranslationSet.remove
	// this.dirty = true;
};

module.exports = TranslationSet;