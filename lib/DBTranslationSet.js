/*
 * DBTranslationSet.js - a collection of resource strings backed by a database
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var mysql = require("mysql2");

/**
 * @class A class that represents a set of translations used in 
 * a project.
 * 
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var DBTranslationSet = function(sourceLocale) {
	this.sourceLocale = sourceLocale || "zxx-XX";
	this.connection = mysql.createConnection({
		host: "localhost",
		user: "ht",
		password: "dYw@j45XKk#$",
		database: "translations"
	});
	this.connection.connect();
	
	this.resources = [];
	this.byId = {};

	this.stringsBySource = {};
};

/**
 * @private
 */
DBTranslationSet.prototype._resourceFactory = function(row) {
	var res;
	
	switch (row.type) {
	case 'string':
		break;
	case 'plural':
		break;
	case 'array':
		break;
	}
	
	return res;
};

/**
 * Get a resource by its database id.
 * 
 * @param {number} id the id of the record in the DB
 * @param {Function(err, Resource)} cb callback to call with the result
 */
DBTranslationSet.prototype.get = function(id) {
	this.connection.execute("SELECT * FROM Resources WHERE id = ?", [id], function(err, row) {
		if (!err) {
			return this._resourceFactory(row);
		}
		
		return undefined;
	});
};

DBTranslationSet.prototype.getBy = function(options, cb) {
	var where = [];
	
	["project", "text", "context", "locale", "resType", "state"].forEach(function(field) {
		where.push(field + " = :" + field);
	});
	
	if (options.key) {
		where.push("reskey = :key");
	}
	
	var whereClause = where.join(" AND ");
	this.connection.execute("SELECT * FROM Resources WHERE " + whereClause, options, function(err, rows) {
		if (!err && rows && rows.length) {
			var resources = [];
			var reshash = {};
			
			for (var i = 0; i < rows.length; i++) {
				switch (rows[i].type) {
				case "plural":
					break;
				case "array":
					var arr = reshash[rows[i].reskey]; 
					if (!arr) {
						arr = reshash[rows[i].reskey] = new ResourceArray({
							id: rows[i].reskey,
							locale: rows[i].locale,
							
						})
					}
					break;
				case "string":
					resources.push(new ResourceString(rows[i]));
					break;
				}
			}
			return this._resourceFactory(row);
		}
		
		return undefined;
	});
};

/**
 * Get a resource by its key and optionally by other attributes. If the 
 * context is undefined,
 * this method will find the base generic resource with no context.
 * 
 * @param {String} key The key of the resource being sought.
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources to get
 * @returns {Resource|undefined} a resource corresponding to the id, or undefined if there is no 
 * resource with that id
 */
DBTranslationSet.prototype.getByKey = function(key, context, locale, cb) {
	this.connection.execute("SELECT * FROM Resources WHERE reskey = ?")
	return this.byId[id + '@' + context];
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
DBTranslationSet.prototype.getBySource = function(source, context) {
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
DBTranslationSet.prototype.getAll = function(context, locale) {
	return this.resources;
};

/**
 * Add a resource to this set. If this resource has the same id
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 */
DBTranslationSet.prototype.add = function(resource) {
	var existing, id = resource.getId();

	existing = this.byId[id + '@' + resource.context];
	
	if (existing && resource.context === this.context) {
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
		this.byId[id + '@' + resource.context] = resource;
		
		if (resource instanceof ResourceString && resource.autoId) {
			this.stringsBySource[resource.getSource() + '@' + resource.context] = resource;
		}
	}
};

/**
 * Add every resource in the given array to this set. 
 * @param {Array.<Resource>} resources an array of resources to add
 * to this set
 */
DBTranslationSet.prototype.addAll = function(resources) {
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
DBTranslationSet.prototype.size = function(context, locale) {
	return this.resources.length;
};

DBTranslationSet.prototype.remove = function(resource) {
	// TODO implement DBTranslationSet.remove
};

module.exports = DBTranslationSet;