/*
 * DBTranslationSet.js - a collection of resource strings backed by a database
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var mysql = require("mysql2");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.DBTranslationSet");


/**
 * @class A class that represents a set of translations used in 
 * a project.
 * 
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var DBTranslationSet = function(sourceLocale) {
	this.sourceLocale = sourceLocale || "en-US";
	this.connection = mysql.createConnection({
		host: "localhost",
		user: "ht",
		password: "dYw@j45XKk#$",
		database: "translations",
		namedPlaceholders: true
	});
	this.connection.connect();
	
	this.resources = [];
	this.byKey = {};

	this.stringsBySource = {};
};

/**
 * @private
 */
DBTranslationSet.prototype._convertToResources = function(rows) {
	var resources = [];
	var reshash = {};
	
	logger.trace("_convertToResources: called");
	
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		row.key = row.reskey;
		
		logger.trace("_convertToResources: converting row " + JSON.stringify(row));
		
		var hashKey = [row.reskey, row.locale, row.context, row.project].join("_");
		logger.trace("_convertToResources: hash key is " + hashKey);
		
		switch (row.resType) {
		case "plural":
			var plural = reshash[hashKey]; 
			if (!plural) {
				plural = reshash[hashKey] = new ResourcePlural(row);
				resources.push(plural);
			}
			plural.addString(row["pluralClass"], row.text);
			break;
		case "array":
			var arr = reshash[hashKey]; 
			if (!arr) {
				arr = reshash[hashKey] = new ResourceArray(row);
				resources.push(arr);
			}
			arr.addString(row.ordinal, row.text);
			break;
		case "string":
			resources.push(new ResourceString(row));
			break;
		}
	}
	
	return resources;
};

/**
 * Get a resource by its database id.
 * 
 * @param {number} id the id of the record in the DB
 * @param {Function(Object, Object)} cb callback to call with the error code and the 
 * resulting DB row or undefined if the retrieval did not succeed
 */
DBTranslationSet.prototype.get = function(id, cb) {
	this.connection.execute("SELECT * FROM Resources WHERE id = ?", [id], cb);
};

/**
 * Get a resource by the given criteria.
 * @param {Object} criteria the filter criteria to select the resources to return
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the 
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
DBTranslationSet.prototype.getBy = function(options, cb) {
	var where = [];
	
	["project", "text", "context", "locale", "resType", "state"].forEach(function(field) {
		if (options[field]) {
			where.push(field + " = :" + field);
		}
	});
	
	if (options.key) {
		where.push("reskey = :key");
	}
	
	var whereClause = where.join(" AND ");
	logger.trace("Where clause is: " + whereClause);
	
	this.connection.execute("SELECT * FROM Resources WHERE " + whereClause, options, function(err, rows) {
		logger.trace("returned " + err + " " + JSON.stringify(rows));
		var resources;
		
		if (err === null && rows && rows.length) {
			logger.trace("no error");
			resources = this._convertToResources(rows);
		} else {
			logger.trace("error");
		}
		
		cb(resources);
	}.bind(this));
};

/**
 * Add a resource to this set. If this resource has the same key
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 */
DBTranslationSet.prototype.add = function(resource, cb) {
	//var existing, key = resource.getKey();
	logger.trace("Adding resource " + JSON.stringify(resource));
	resource.serialize(this.connection, cb);
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

DBTranslationSet.prototype.remove = function(resource, cb) {
	var where = [];
		
	["project", "text", "context", "locale", "resType", "state"].forEach(function(field) {
		if (resource[field]) {
			where.push(field + " = :" + field);
		}
	});

	if (resource.key) {
		where.push("reskey = :key");
	}
	
	var whereClause = where.join(" AND ");
	logger.trace("Where clause is: " + whereClause);

	this.connection.execute("REMOVE FROM Resources WHERE " + whereClause, options, function(err, rows) {
		var resources;
		
		if (!err && rows && rows.length) {
			resources = this._convertToResources(rows);
		}
		
		cb(resources);
	});
};

module.exports = DBTranslationSet;