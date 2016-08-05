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
	this.byId = {};

	this.stringsBySource = {};
};

/**
 * Get a resource by its id.
 * 
 * @param {String} id The id of the resource being sought.
 * @returns {Resource|undefined} a resource corresponding to the id, or undefined if there is no 
 * resource with that id
 */
TranslationSet.prototype.get = function(id) {
	return this.byId[id];
};

/**
 * Get a resource by its source string. The source string must be written
 * in the language and script of the source locale. For array types, the 
 * source string
 * must be one of the values in the string array. For plural types, it 
 * must be one of the values of the quantities.
 * 
 * @param {String} source The source string to look up
 * @returns {Resource|undefined} a resource corresponding to the source string, or 
 * undefined if there is no resource with that source
 */
TranslationSet.prototype.getBySource = function(source) {
	return this.stringsBySource[source];
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
 * Add a resource to this set. If this resource has the same id
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 */
TranslationSet.prototype.add = function(resource) {
	var existing, id = resource.getId();

	existing = this.byId[id];
	if (existing) {
		if (resource.locale === this.sourceLocale && resource instanceof ResourceString) {
			if (resource.getSource() !== existing.getSource()) {
				console.log("Error: found two resources with mismatched source strings:");
				console.log("Id: " + id);
				console.log("Source 1: " + existing.getSource() + "(" + existing.pathName + ")");
				console.log("Source 2: " + resource.getSource() + "(" + resource.pathName + ")");
			}
		} else {
			existing.merge(resource);
		}
	} else {
		this.resources.push(resource);
		this.byId[id] = resource;
		
		if (resource instanceof ResourceString) {
			this.stringsBySource[resource.getSource()] = resource;
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

module.exports = TranslationSet;