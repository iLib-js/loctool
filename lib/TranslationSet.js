/*
 * TranslationSet.js - a collection of resource strings
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");

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

	this.stringsBySource = {};
};

/**
 * Get a resource by its key and context. If the context is undefined,
 * this method will find the base generic resource with no context.
 * 
 * @param {String} key The key of the resource being sought.
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources to
 * @returns {Resource|undefined} a resource corresponding to the key, or undefined if there is no 
 * resource with that key
 */
TranslationSet.prototype.get = function(key, context, locale) {
	return this.byKey[key + '@' + context];
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
	var existing, key = resource.getKey();

	existing = this.byKey[key + '@' + resource.context];
	
	if (existing && resource.context === this.context) {
		if (resource.locale === this.sourceLocale && resource instanceof ResourceString) {
			if (resource.getSource() !== existing.getSource()) {
				console.log("Error: found two resources with mismatched source strings:");
				console.log("Key: " + key);
				console.log("Source 1: " + existing.getSource() + "(" + existing.pathName + ")");
				console.log("Source 2: " + resource.getSource() + "(" + resource.pathName + ")");
			}
		} else {
			existing.merge(resource);
		}
	} else {
		this.resources.push(resource);
		this.byKey[key + '@' + resource.context] = resource;
		
		if (resource instanceof ResourceString && resource.autoKey) {
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
		// console.log("Resources to add: " + JSON.stringify(resources));
		resources.forEach(function (resource) {
			this.add(resource);
		}.bind(this));
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

TranslationSet.prototype.remove = function(resource) {
	// TODO implement TranslationSet.remove
};

module.exports = TranslationSet;