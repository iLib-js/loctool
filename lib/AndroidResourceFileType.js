/*
 * AndroidResourceFileType.js - manages a collection of android resource files
 *
 * Copyright © 2016-2017,2019 HealthTap, Inc.
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
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("../lib/utils.js");
var TranslationSet = require("../lib/TranslationSet.js");
var FileType = require("../lib/FileType.js");
var ResourceFactory = require("../lib/ResourceFactory.js");
var PseudoFactory = require("../lib/PseudoFactory.js");

var AndroidResourceFile = require("./AndroidResourceFile.js");

var ContextResourceString = require("../lib/ContextResourceString.js");
var ResourcePlural = require("../lib/ResourcePlural.js");
var ResourceArray = require("../lib/ResourceArray.js");

var logger = log4js.getLogger("loctool.lib.AndroidResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var AndroidResourceFileType = function(project) {
    this.type = "java";
    this.datatype = "x-android-resource";

    this.parent.call(this, project);

    this.resourceFiles = {};
    this.inputFiles = {};
    this.extensions = [ ".xml" ];
};

AndroidResourceFileType.prototype = new FileType();
AndroidResourceFileType.prototype.parent = FileType;
AndroidResourceFileType.prototype.constructor = AndroidResourceFileType;

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^value");
var lang = new RegExp("[a-z][a-z]");
var reg = new RegExp("r[A-Z][A-Z]");
var fullLocale = /-b\+[a-z][a-z]\+[A-Z][a-z][a-z][a-z]\+[A-Z][A-Z]/;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
AndroidResourceFileType.prototype.handles = function(pathName) {
    logger.debug("AndroidResourceFileType handles " + pathName + "?");

    if (!extensionRE.test(pathName)) {
        logger.debug("No");
        return false;
    }

    var pathElements = pathName.split('/');
    if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
        logger.debug("No");
        return false;
    }

    var dir = pathElements[pathElements.length-2];

    if (!dirRE.test(dir)) {
        logger.debug("No");
        return false;
    }

    if (fullLocale.test(dir)) {
        logger.debug("No");
        return false;
    }

    var parts = dir.split("-");

    for (var i = parts.length-1; i > 0; i--) {
        if (reg.test(parts[i]) && utils.iso3166[parts[i]]) {
            // already localized dir
            logger.debug("No");
            return false;
        }

        if (lang.test(parts[i]) && utils.iso639[parts[i]]) {
            // already localized dir
            logger.debug("No");
            return false;
        }
    }

    logger.debug("Yes");
    return true;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
AndroidResourceFileType.prototype.write = function(translations, locales) {
    // distribute all the new resources to their resource files ...
    logger.trace("distributing all new resources to their resource files");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));;

    logger.trace("There are " + resources.length + " resources to add.");

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing Java strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated; // default to the source language if the translation is not there
                if (res.dnt) {
                    logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
                } else if (!translated) {
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

                    logger.trace("No translation for " + res.reskey + " to " + locale + ". Leaving blank.");
                } else {
                    var fullyTranslated = true;
                    var anyTranslated = false;

                    if (r.resType === "array") {
                        // check each element of the array to see if it is translated
                        var items = res.getSourceArray();
                        var newItems = [];

                        var translatedItems = r.getTargetArray();
                        for (var i = 0; i < items.length; i++) {
                            if (!translatedItems[i]) {
                                translatedItems[i] = items[i]; // use the English as backup
                                fullyTranslated = false;
                                newItems.push(items[i]);
                            } else {
                                newItems.push(null); // already translated
                                anyTranslated = true;
                            }
                        }
                        if (!fullyTranslated) {
                            var newres = r.clone();
                            newres.setSourceArray(newItems);
                            newres.setTargetLocale(locale);
                            newres.setTargetArray(newItems);
                            newres.setState("new");

                            this.newres.add(newres);
                        }
                    } else if (r.resType === "plural") {
                        // check each element of the hash to see if it is translated
                        var items = res.getSourcePlurals();
                        var newItems = {};

                        var translatedItems = r.getTargetPlurals();
                        for (var p in items) {
                            var item = items[p];
                            if (!translatedItems[p]) {
                                translatedItems[p] = item; // use the English as backup
                                fullyTranslated = false;
                                newItems[p] = item;
                            } else {
                                anyTranslated = true;
                            }
                        }
                        if (!fullyTranslated) {
                            var newres = r.clone();
                            newres.setSourcePlurals(newItems);
                            newres.setTargetLocale(locale);
                            newres.setTargetPlurals(newItems);
                            newres.setState("new");

                            this.newres.add(newres);
                        }
                    } else {
                        // string
                        if (utils.cleanString(res.getSource()) !== utils.cleanString(r.getSource())) {
                            logger.trace("extracted   source: " + utils.cleanString(res.getSource()));
                            logger.trace("translation source: " + utils.cleanString(r.getSource()));
                            var newres = res.clone();
                            newres.setTargetLocale(locale);
                            newres.setTarget(r.getTarget());
                            newres.setState("new");
                            newres.setComment('The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"');
                            this.newres.add(newres);
                            anyTranslated = false;
                        } else {
                            anyTranslated = (res.getSource() !== r.getTarget());
                        }
                    }

                    // only write out this resource if any part of it is translated. If none of it is
                    // translated, just skip it and Android will default back to the base English
                    // strings instead.
                    if (anyTranslated) {
                        file = this.getResourceFile(r.context, locale, r.resType + "s", r.pathName);
                        file.addResource(r);
                        logger.trace("Added " + r.getKey() + " to " + file.pathName);
                    }
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = this.getResourceFile(res.context, res.getTargetLocale(), res.resType + "s", res.pathName);
        file.addResource(res);
        logger.trace("Added " + res.reskey + " to " + file.pathName);
    }

    logger.trace("Now writing out the resource files");
    // ... and then let them write themselves out
    for (var hash in this.resourceFiles) {
        file = this.resourceFiles[hash];
        file.write();
    }
};

AndroidResourceFileType.prototype.name = function() {
    return "Android Resource File";
};

function makeHashKey(context, locale, type, flavor) {
    return [(context || "default"), (locale || "default"), type, flavor].join("_");
}

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
AndroidResourceFileType.prototype.newFile = function(pathName) {
    var file = new AndroidResourceFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    this.inputFiles[pathName] = file;

    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * locale, and flavor. If the original file that this resource came from
 * exists within a flavor, then the resource file for this resource should
 * also be in that same flavor. If the original file is not within a
 * flavor, this resource should go into the main resources.
 *
 * @param {String} context the name of the context in which the resource
 * file will reside
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} type type of the resource file being sought. Should be one
 * of "strings", "arrays", or "plurals"
 * @param {String} original the path to the original file that this resource
 * came from
 * @return {AndroidResourceFile} the Android resource file that serves the
 * given project, context, and locale.
 */
AndroidResourceFileType.prototype.getResourceFile = function(context, locale, type, original) {
    // first find the flavor
    var flavor = this.project.flavors.getFlavorForPath(original);
    var key = makeHashKey(context, locale, type, flavor);

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        var pathName, settings, defaultLocales;

        settings = (this.project &&
            this.project.settings &&
            this.project.settings &&
            this.project.settings.AndroidResourceFile) || {};

        defaultLocales = settings.defaultLocales;

        var valueDir = "values";

        if (locale !== this.project.sourceLocale) {
            var l = new Locale(locale);
            valueDir += "-" + l.getLanguage();

            // If we have a version of Spanish, for example es-ES, that is not
            // the default, then the language dir should contain the region. That is, "values-es" is the default "es-US", and
            // "values-es-rES" is the non-default version of Spanish, so it needs its region.
            if (locale === this.project.pseudoLocale || (defaultLocales && defaultLocales[l.getLanguage()] && locale !== defaultLocales[l.getLanguage()])) {
                valueDir += "-r" + l.getRegion();
            }
        }

        if (context) {
            valueDir += "-" + context;
        }

        var resdir = (flavor !== "main") ? this.project.flavors.getResourceDirs(flavor)[0] : this.project.getResourceDirs("java")[0];
        pathName = path.join(resdir, valueDir, type + ".xml");

        if (this.inputFiles[pathName]) {
            // if the resource file already exists as an input file, don't overwrite it. Just
            // write a new file beside it instead.
            pathName = path.join(resdir, valueDir, type + "-auto.xml");
        }

        resfile = this.resourceFiles[key] = new AndroidResourceFile({
            project: this.project,
            context: context,
            locale: locale || this.project.sourceLocale,
            type: type,
            pathName: pathName
        });

        logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<AndroidResourceFile>} an array of resource files
 * known to this file type instance
 */
AndroidResourceFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
AndroidResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
            logger.trace("Generating pseudo for " + resource.getKey());
            var pseudoized = resource.generatePseudo(locale, pb);
            if (pseudoized) {
                if ((resource.resType === 'string' && resource.getSource() !== pseudoized.getTarget()) ||
                    (resource.resType === 'array' && resource.getSourceArray() !== pseudoized.getTargetArray()) ||
                    (resource.resType === 'plural' && resource.getSourcePlurals() !== pseudoized.getTargetPlurals())){
                    this.pseudo.add(pseudoized);
                }
            } else {
                logger.trace("No pseudo match for " + resource.getKey());
            }
        }
    }.bind(this));
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
AndroidResourceFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ContextResourceString);
    ResourceFactory.registerDataType(this.datatype, "plural", ResourcePlural);
    ResourceFactory.registerDataType(this.datatype, "array", ResourceArray);
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
AndroidResourceFileType.prototype.getResourceFileType = function() {};


module.exports = AndroidResourceFileType;
