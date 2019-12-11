/*
 * ObjectiveCFileType.js - Represents a collection of objective C files
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

var fs = require("fs");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ObjectiveCFile = require("./ObjectiveCFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.ObjectiveCFileType");

var ObjectiveCFileType = function(project) {
    this.type = "objc";
    this.datatype = "x-objective-c";

    this.parent.call(this, project);
    this.extensions = [ ".m", ".h" ];
};

ObjectiveCFileType.prototype = new FileType();
ObjectiveCFileType.prototype.parent = FileType;
ObjectiveCFileType.prototype.constructor = ObjectiveCFileType;

/**
 * Return true if the given path is an objective C file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is an objective C file, or false
 * otherwise
 */
ObjectiveCFileType.prototype.handles = function(pathName) {
    logger.debug("ObjectiveCFileType handles " + pathName + "?");
    ret = (pathName.length > 2) && (pathName.substring(pathName.length - 2) === ".m" || pathName.substring(pathName.length - 2) === ".h");

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

ObjectiveCFileType.prototype.name = function() {
    return "Objective C File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
ObjectiveCFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType("objc");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing Objective C strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated; // default to the source language if the translation is not there
                if (!translated || res.dnt) {
                    r = res.clone();
                    r.setTargetLocale(locale);
                    r.setTarget(r.getSource());
                    r.setState("new");

                    this.newres.add(r);

                    logger.trace("No translation for " + res.reskey + " to " + locale + ". Adding to new resources file.");
                }
                if (res.reskey != r.reskey) {
                    // if reskeys don't match, we matched on cleaned string.
                    // so we need to overwrite reskey of the translated resource to match
                    r = r.clone();
                    r.reskey = res.reskey;
                }
                file = resFileType.getResourceFile(r);
                file.addResource(r);
                logger.trace("Added " + r.hashKey() + " to " + file.pathName);
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resources.datatype === this.datatype;
    });

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = resFileType.getResourceFile(res);
        file.addResource(res);
        logger.trace("Added " + res.reskey + " to " + file.pathName);
    }
};

ObjectiveCFileType.prototype.newFile = function(path) {
    return new ObjectiveCFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the
 * resources in the DB.
 *
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 *
ObjectiveCFileType.prototype.findNew = function(set) {
    var extracted = this.extracted.getAll();

    for (var i = 0; i < extracted.length; i++) {
        var resource = extracted[i];
        logger.trace("Examining resource " + resource.getKey() + " to see if it's new.");

        var existing = set.get(resource.hashKey());
        if (!existing || !resource.equals(existing)) {
            logger.trace("yes");
            this.newres.add(resource);
        } else {
            logger.trace("no");
        }
    }

    logger.trace("findNew Done. Returning a set with " + this.newres.size() + " resources.");
    return this.newres;
};
*/

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
ObjectiveCFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
};

module.exports = ObjectiveCFileType;
