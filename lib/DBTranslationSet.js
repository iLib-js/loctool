/*
 * DBTranslationSet.js - a collection of resource strings backed by a database
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var mysql = require("mysql2");
var log4js = require("log4js");

var utils = require("./utils.js");
var ResourceFactory = require("./ResourceFactory.js");

var logger = log4js.getLogger("loctool.lib.DBTranslationSet");


/**
 * @class A class that represents a set of translations used in
 * a project.
 *
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var DBTranslationSet = function (sourceLocale) {
    logger.trace("DBTranslationSet constructor called");
    this.sourceLocale = sourceLocale || "en-US";
    this.connection = mysql.createConnection({
        host: "localhost",
        user: "ht",
        password: "dYw@j45XKk#$",
        database: "translations",
        namedPlaceholders: true
        //debug:true
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
        var projectName = typeof(row.project) === "string" ? row.project : row.project.getProjectId();

        logger.trace("_convertToResources: converting row " + JSON.stringify(row));

        var hashKey = [row.reskey, row.locale, row.context, projectName].join("_");
        logger.trace("_convertToResources: hash key is " + hashKey);

        switch (row.resType) {
        case "plural":
            var plural = reshash[hashKey];
            if (!plural) {
                logger.trace("no existing plural -- making one");
                plural = reshash[hashKey] = ResourceFactory(row);
                resources.push(plural);
            }
            plural.addSource(row.pluralClass, row.text);
            break;
        case "array":
            var arr = reshash[hashKey];
            if (!arr) {
                logger.trace("no existing array -- making one");
                arr = reshash[hashKey] = ResourceFactory(row);
                resources.push(arr);
            }
            arr.addSource(row.ordinal, row.text);
            logger.trace("arr is " + JSON.stringify(arr));
            break;
        case "string":
            resources.push(ResourceFactory(row));
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
 * Return an array of all the project names in the database.
 *
 * @param {Function(Array.<string>|undefined)} cb callback to call when
 * the names are retrieved. If there are no projects yet, then this
 * will return undefined.
 */
DBTranslationSet.prototype.getProjects = function(cb) {
    if (!this.connection) {
        cb(undefined);
    }

    this.connection.execute("SELECT DISTINCT project FROM Resources ORDER BY project ASC", undefined, function(err, rows) {
        cb((rows && rows.length) ? rows.map(function(row) {return row.project;}) : undefined);
    });
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
DBTranslationSet.prototype.getContexts = function(project, cb) {
    if (!this.connection) {
        cb(undefined);
    }

    this.connection.execute("SELECT DISTINCT context FROM Resources WHERE project = :project ORDER BY context ASC", {project: project}, function(err, rows) {
        logger.trace("getContexts: err is " + err + " rows is " + JSON.stringify(rows));
        cb((rows && rows.length) ? rows.map(function(row) {return row.context;}) : undefined);
    });
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
DBTranslationSet.prototype.getLocales = function(project, context, cb) {
    if (!this.connection) {
        cb(undefined);
    }

    this.connection.execute("SELECT DISTINCT locale FROM Resources WHERE project = :project AND context = :context ORDER BY locale ASC", {
        project: project,
        context: context
    }, function(err, rows) {
        cb((rows && rows.length) ? rows.map(function(row) {return row.locale;}) : undefined);
    });
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
        sourceLocale: resource.sourceLocale,
        targetLocale: resource.targetLocale
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
 * Iterate through the array one batch at a time and adding the
 * resources to the DB.
 *
 * @private
 */
DBTranslationSet.prototype._addBatch = function(values, index, cb) {
    if (index >= values.length) {
        cb(null, {affectedRows: values.length});
    } else {
        var sql = "INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, comment, ordinal, pluralClass, state) VALUES ";
        // SQL limits insert batches to 1000
        var batch = values.slice(index, index+1000);

        logger.trace("SQL statement is " + sql);

        var v = batch.map(function(res) {
            return '(' + res.join(',') + ')';
        }).join(",\n");

        sql += v;
        logger.trace("v is " + v);
        this.connection.query(sql, function(err, info) {
            if (err) {
                logger.warn("Error inserting resources to the database: " + err);
                cb();
            } else {
                this._addBatch(values, index+1000, cb);
            }
        }.bind(this))
    }
};

/**
 * Add every resource in the given array to this set.
 * @param {TranslationSet} set an set of resources to add
 * to the DB
 * @param {Function} cb callback function to call once
 * the resources are added to the DB
 */
DBTranslationSet.prototype.addAll = function(set, cb) {
    if (!this.connection) {
        cb("This set is closed.");
    }
    var resources = set.getAll();

    logger.trace("Addall resources to the DB. Adding " + resources.length + " resources.");

    var allvalues = [];

    for (var i = 0; i < resources.length; i++) {
        values = resources[i].getInsertValues();
        if (values && values.length) {
            allvalues = allvalues.concat(values);
        } else {
            logger.warn("No fields to save for resource with key " + resource.getKey());
        }
    }

    if (allvalues && allvalues.length) {
        this._addBatch(allvalues, 0, cb);
    } else {
        cb();
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
        if (err === null && result) {
            logger.trace("getting size successful err=" + err + " " + JSON.stringify(result));
        } else {
            logger.trace("getting size failed. err=" + err + " " + JSON.stringify(result));
        }
        cb((err === null && result) ? result[0].size : 0);
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
        if (err === null) {
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
