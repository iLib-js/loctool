/*
 * RubyFileType.js - Represents a collection of Ruby files
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
var RubyFile = require("./RubyFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");
var ResourcePlural = require("./ResourcePlural.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.RubyFileType");

var RubyFileType = function(project) {
    this.type = "ruby";
    this.datatype = "ruby";

    this.parent.call(this, project);
    this.extensions = [ ".rb", ".rabl", ".haml" ];
};

RubyFileType.prototype = new FileType();
RubyFileType.prototype.parent = FileType;
RubyFileType.prototype.constructor = RubyFileType;

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.html\.haml$/);

/**
 * Return true if the given path is a Ruby file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Ruby file, or false
 * otherwise
 */
RubyFileType.prototype.handles = function(pathName) {
    logger.debug("RubyFileType handles " + pathName + "?");
    var ret = pathName.length > 10 && pathName.substring(pathName.length - 10) === ".html.haml";
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }

    ret = ret || (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".rb");
    ret = ret || (pathName.length > 5 && pathName.substring(pathName.length - 5) === ".rabl");

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

RubyFileType.prototype.name = function() {
    return "Ruby File Type";
};

RubyFileType.prototype.checkAllPluralCases = function(extracted, translated) {
    var fullyTranslated = true;
    if (extracted.resType === "plural") {
        // check each element of the hash to see if it is translated
        var items = extracted.getSourcePlurals();
        var translatedItems = translated.getTargetPlurals();
        var newItems = {};

        if (!items.one || !items.other) {
            logger.warn('Source code is missing the "one" or the "other" case in Rb.p:');
            logger.warn('path: ' + extracted.pathName);
            logger.warn('strings: ' + JSON.stringify(items));
        }

        for (var p in items) {
            var item = items[p];
            if (!translatedItems[p]) {
                // translatedItems[p] = item; // use the English as backup
                fullyTranslated = false;
                newItems[p] = item;
            }
        }

        if (!fullyTranslated) {
            logger.trace("Not fully translated to locale " + translated.getTargetLocale());
            logger.trace("Missing English plural cases: " + JSON.stringify(newItems));

            var newres = translated.clone();
            newres.sourceStrings = newItems;
            newres.targetStrings = newItems;
            newres.setTargetLocale(locale);
            newres.setState("new");
            this.newres.add(newres);

            //logger.debug("Adding target: " + JSON.stringify(newres));
        }
    }

    return fullyTranslated;
}

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
RubyFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType(this.type);
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
            logger.trace("Localizing Ruby strings to " + locale);

            if (!res.dnt) {
                db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                    var r = translated; // default to the source language if the translation is not there
                    if (!translated) {
                        // see if a haml string has the translation because haml strings sometimes become
                        // wrapped with Rb.t
                        r = res.clone();
                        r.setTargetLocale(locale);
                        r.datatype = this.datatype;
                        logger.trace("ruby hash key is " + r.hashKeyForTranslation(locale));
                        db.getResourceByHashKey(r.hashKeyForTranslation(locale), function(err, translated) {
                            if (!translated) {
                                r = res.clone();
                                r.setTargetLocale(locale);
                                switch (res.resType) {
                                case "array":
                                    r.setTargetArray(r.getSourceArray());
                                    break;
                                case "plural":
                                    r.setTargetPlurals(r.getSourcePlurals());
                                    break;
                                default:
                                    r.setTarget(r.getSource());
                                }
                                r.setState("new");

                                this.newres.add(r);

                                logger.trace("No translation for " + res.reskey + " to " + locale);
                            } else {
                                this.checkAllPluralCases(res, translated);
                                file = resFileType.getResourceFile(locale, res.getFlavor());
                                file.addResource(translated);
                                logger.trace("Added " + r.reskey + " to " + file.pathName);
                            }
                        }.bind(this));
                    } else {
                        this.checkAllPluralCases(res, translated);
                        file = resFileType.getResourceFile(locale, res.getFlavor());
                        file.addResource(translated);
                        logger.trace("Added " + r.reskey + " to " + file.pathName);
                    }
                }.bind(this));
            } else {
                logger.trace("DNT: " + r.reskey + ": " + r.getSource());
            }
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resources.datatype === this.datatype;
    });

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = resFileType.getResourceFile(res.getTargetLocale(), res.getFlavor());
        file.addResource(res);
        logger.trace("Added " + res.reskey + " to " + file.pathName);
    }
};

RubyFileType.prototype.newFile = function(path) {
    return new RubyFile({
        project: this.project,
        pathName: path,
        type: this,
        sourceLocale: this.project.sourceLocale
    });
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the
 * resources in the DB.
 *
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 *
RubyFileType.prototype.findNew = function(set) {
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
RubyFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
    ResourceFactory.registerDataType(this.datatype, "plural", ResourcePlural);
};

module.exports = RubyFileType;
