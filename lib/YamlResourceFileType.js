/*
 * YamlResourceFileType.js - manages a collection of yaml resource files
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
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var YamlResourceFile = require("./YamlResourceFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ContextResourceString = require("./ContextResourceString.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.YamlResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var YamlResourceFileType = function(project) {
    this.type = "ruby";
    this.datatype = "x-yaml";

    this.parent.call(this, project);

    this.resourceFiles = {};
    this.extensions = [ ".yml", ".yaml" ];
};

YamlResourceFileType.prototype = new FileType();
YamlResourceFileType.prototype.parent = FileType;
YamlResourceFileType.prototype.constructor = YamlResourceFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlResourceFileType.prototype.handles = function(pathName) {
    logger.debug("YamlResourceFileType handles " + pathName + "?");

    var ret = pathName.length > 4 && pathName.substring(pathName.length - 4) === ".yml";

    if (ret) {
        if (this.project.isResourcePath("yml", pathName)) {
            var base = path.basename(pathName, ".yml");
            var pathLoc = new Locale(base);
            var sourceLoc = new Locale(this.project.sourceLocale);
            ret = (pathLoc.language === sourceLoc.language);
            if (ret && pathLoc.script) {
                ret = (pathLoc.script === sourceLoc.script);
            }
            if (ret && pathLoc.region) {
                ret = (pathLoc.region === sourceLoc.region);
            }
        } else {
            ret = false;
        }
    }

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

/**
 * @private
 */
YamlResourceFileType.prototype.checkAllPluralCases = function (sourceRes, res, locale) {
    var fullyTranslated = true;
    if (res.resType === "plural") {
        // check each element of the hash to see if it is translated
        var items = sourceRes.getSourcePlurals();
        var newItems = {};

        var translatedItems = res.getTargetPlurals();
        for (var p in items) {
            var item = items[p];
            if (!translatedItems[p]) {
                // translatedItems[p] = item; // use the English as backup
                fullyTranslated = false;
                newItems[p] = item;
            }
        }

        if (!fullyTranslated) {
            //logger.debug("Not fully translated to locale " + locale);
            //logger.debug("Missing English plural cases: " + JSON.stringify(newItems));

            //logger.debug("Adding source: " + JSON.stringify(newSourceRes));

            var newres = res.clone();
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
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
YamlResourceFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this;
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale && !this.project.isSourceLocale(locale);
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing Yaml strings to " + locale);
            if (!res.dnt) {
                db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                    var r = translated; // default to the source language if the translation is not there
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
                        this.checkAllPluralCases(res, r, locale);
                        file = resFileType.getResourceFile(locale, res.getFlavor());
                        file.addResource(translated);
                    }
                    logger.trace("Added " + r.reskey + " to " + (file ? file.pathName : "an unknown file"));
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
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }

    logger.trace("Now writing out the resource files");
    // ... and then let them write themselves out
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

YamlResourceFileType.prototype.name = function() {
    return "Yaml Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlResourceFileType.prototype.newFile = function(pathName) {
    var file = new YamlResourceFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    var locale = file.getLocale() || "default";

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} flavor the flavor of the resource type
 * @return {YamlResourceFile} the yaml resource file that serves the
 * given project and locale.
 */
YamlResourceFileType.prototype.getResourceFile = function(locale, flavor) {
    var key = (locale || this.project.sourceLocale) + (flavor ? '-' + flavor : '');

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new YamlResourceFile({
            project: this.project,
            locale: locale,
            type: this,
            flavor: flavor
        });
    }

    return resfile;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 * @param {String} locale the target locale for this pseudo
 * @param {Pseudo} pb the pseudo bundle to use to generate the strings
 */
YamlResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var l = new Locale(locale);
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        logger.trace("Generating pseudo for " + resource.getKey());
        var res = resource.generatePseudo(locale, pb);
        if (res && res.getSource() !== res.getTarget()) {
            this.pseudo.add(res);
        }
    }.bind(this));
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
YamlResourceFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ContextResourceString);
};

module.exports = YamlResourceFileType;
