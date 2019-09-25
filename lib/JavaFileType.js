/*
 * JavaFileType.js - Represents a collection of java files
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
var JavaFile = require("./JavaFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ContextResourceString = require("./ContextResourceString.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.JavaFileType");

var JavaFileType = function(project) {
    this.type = "java";
    this.datatype = "java";

    this.parent.call(this, project);
    this.extensions = [ ".java" ];
};

JavaFileType.prototype = new FileType();
JavaFileType.prototype.parent = FileType;
JavaFileType.prototype.constructor = JavaFileType;

var extensionRE = new RegExp(/\.java$/);

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JavaFileType.prototype.handles = function(pathName) {
    logger.debug("JavaFileType handles " + pathName + "?");
    var ret = extensionRE.test(pathName);
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

JavaFileType.prototype.name = function() {
    return "Java File Type";
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
JavaFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType();
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // have to store the base English string or else there will be nothing to override in the translations
        file = resFileType.getResourceFile(res.context, res.getSourceLocale(), res.resType + "s", res.pathName);
        file.addResource(res);

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing Java strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (res.dnt) {
                    logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
                } else if (!r || utils.cleanString(res.getSource()) !== utils.cleanString(r.getSource())) {
                    if (r) {
                        logger.trace("extracted   source: " + utils.cleanString(res.getSource()));
                        logger.trace("translation source: " + utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    // skip because the fallbacks will go to the English resources anyways
                    logger.trace("No translation for " + res.reskey + " to " + locale);
                } else if (r.getTarget() !== res.getSource()) {
                    file = resFileType.getResourceFile(r.context, locale, r.resType + "s", r.pathName);
                    file.addResource(r);
                    logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // only need to add the resource if it is different from the source text
        if (res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.context, res.getTargetLocale(), res.resType + "s", res.pathName);
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

JavaFileType.prototype.newFile = function(path) {
    return new JavaFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the
 * resources in the DB.
 *
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 *
JavaFileType.prototype.findNew = function(set) {
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
JavaFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ContextResourceString);
};

module.exports = JavaFileType;
