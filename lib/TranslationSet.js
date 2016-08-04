/*
 * TranslationSet.js - a collection of resource strings
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");

var TranslationSet = function(project) {
	this.project = project;
	
	this.resources = [];
	this.byId = {};

	this.stringsBySource = {};
};

TranslationSet.prototype.get = function(id) {
	return this.byId(id);
};

TranslationSet.prototype.getBySource = function(source) {
	return this.stringsBySource[source];
};

TranslationSet.prototype.getAll = function() {
	return this.resources;
};

TranslationSet.prototype.add = function(resource) {
	var existing, id = resource.getId();

	existing = this.byId[id];
	if (existing) {
		if (resource.locale === this.project.sourceLocale && resource instanceof ResourceString) {
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

TranslationSet.prototype.addAll = function(resources) {
	if (resources && resources.length) {
		// console.log("Resources to add: " + JSON.stringify(resources));
		resources.forEach(function (resource) {
			this.add(resource);
		}.bind(this));
	}
};

module.exports = TranslationSet;