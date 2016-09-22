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
			plural.addString(row.pluralClass, row.text);
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
	if (!this.connection) {
		cb("This set is closed.");
	}
	this.connection.execute("SELECT * FROM Resources WHERE id = ?", [id], cb);
};

/**
 * Get a resource by the given criteria.
 * @param {Object} criteria the filter criteria to select the resources to return
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the 
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
DBTranslationSet.prototype.getBy = function(options, cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	logger.trace("Getting a resource by criteria");
	
	var where = [];
	sortClause = "";
	
	["project", "text", "context", "locale", "resType", "state"].forEach(function(field) {
		if (options[field]) {
			where.push(field + " = :" + field);
		}
	});
	
	if (options.key) {
		where.push("reskey = :key");
	}
	if (options.sort) {
		sortClause = " ORDER BY " + options.sort;
	}
	
	var whereClause = where.join(" AND ");
	logger.trace("Where clause is: " + whereClause);
	
	this.connection.execute("SELECT * FROM Resources WHERE " + whereClause + sortClause, options, function(err, rows) {
		logger.trace("getBy: db query returned " + err + " " + JSON.stringify(rows));
		var resources;
		
		if (err === null && rows) {
			logger.trace("no error");
			resources = this._convertToResources(rows);
		} else {
			logger.trace("error");
		}
		
		cb(resources);
	}.bind(this));
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
DBTranslationSet.prototype.contains = function(resource, cb) {
	this.getBy({
		project: resource.project,
		context: resource.context,
		reskey: resource.reskey,
		locale: resource.locale
	}, function(resources) {
		cb(resources && resources.length ? resources : undefined);
	});
};

/**
 * Add a resource to this set. If this resource has the same key
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 * 
 * @param {Resource} resource a resource to add to this set
 * @param {Function} cb function to call when the resource is added
 */
DBTranslationSet.prototype.add = function(resource, cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	//var existing, key = resource.getKey();
	logger.trace("Adding resource " + JSON.stringify(resource));
	resource.serialize(this.connection, cb);
};

/**
 * Iterate through the array recursively
 * @private
 */
DBTranslationSet.prototype._addOne = function(resources, index, cb) {
	if (index >= resources.length) {
		cb(null, {affectedRows: resources.length});
	} else {
		this.add(resources[index], function(err, info) {
			this._addOne(resources, index+1, cb);
		}.bind(this));
	}
};

/**
 * Add every resource in the given array to this set. 
 * @param {Array.<Resource>} resources an array of resources to add
 * to this set
 */
DBTranslationSet.prototype.addAll = function(resources, cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	if (resources && resources.length) {
		this._addOne(resources, 0, cb);
	}
};

/**
 * Return the number of strings in this set. This counts one for each plural string
 * and for each array member, so this does not correspond to the number of resources.
 *
 * @param {Function(number)} cb callback to call when the size of the table is determined
 */
DBTranslationSet.prototype.size = function(cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	logger.trace("getting size of table");
	this.connection.execute("SELECT count(*) as size FROM Resources", undefined, function(err, result) {
		if (err == null && result) {
			logger.trace("getting size successful err=" + err + " " + JSON.stringify(result));
		} else {
			logger.trace("getting size failed. err=" + err + " " + JSON.stringify(result));
		}
		cb((err == null && result) ? result[0].size : 0);
	});
};

/**
 * Remove a resource from the database. If the resource has an id, then the row with that id
 * will be removed.
 * @param {Resource} resource the resource to remove
 * @param {Function} cb the callback function to call when the removal is done
 */
DBTranslationSet.prototype.remove = function(resource, cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	logger.trace("Removing a resource");
	var where = [];
	
	["project", "context", "locale", "state"].forEach(function(field) {
		if (resource[field]) {
			where.push(field + " = :" + field);
		}
	});

	if (resource.key) {
		where.push("reskey = :key");
	}
	
	if (where.length === 0) {
		cb("Insufficient parameters called to remove a resource. Need to identify the resource being removed.");
	} else {
		var whereClause = where.join(" AND ");
		logger.trace("Where clause is: " + whereClause);
	
		this.connection.execute("DELETE FROM Resources WHERE " + whereClause, resource, cb);
	}
};

/**
 * Remove all Resources from the table. WARNING: THIS IS PERMANENT. You can't get the records back
 * again. This method was intended to
 * be used in the unit tests only. Regular code should never call this method.
 * @param {Function} cb callback to call when the clear is done
 */
DBTranslationSet.prototype.clear = function(cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	logger.trace("Clearing all resources");
	this.connection.execute("DELETE FROM Resources", undefined, function(err, info) {
		if (err == null) {
			logger.trace("Clear successful");
			this.resources = [];
		} else {
			logger.trace("Clear failed. err=" + err + " " + JSON.stringify(info));
		}
		cb(err, info);
	});
};

/**
 * Close the connection to the database and clean up. After this method is called,
 * no more database calls can be made.
 */
DBTranslationSet.prototype.close = function(cb) {
	if (!this.connection) {
		cb("This set is closed.");
	}
	logger.trace("Closing this set");
	this.connection.end(function(err) {
		this.connection = undefined;
	}.bind(this));
};

module.exports = DBTranslationSet;