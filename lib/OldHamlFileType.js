/*
 * OldHamlFileType.js - Represents a collection of Haml files
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
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var OldHamlFile = require("./OldHamlFile.js");
var YamlResourceFile = require("./YamlResourceFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.OldHamlFileType");

var OldHamlFileType = function(project) {
    this.type = "ruby";
    this.datatype = "x-haml";

    this.parent.call(this, project);

    this.files = [];
};

OldHamlFileType.prototype = new FileType();
OldHamlFileType.prototype.parent = FileType;
OldHamlFileType.prototype.constructor = OldHamlFileType;

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?)\.html\.haml$/);

/**
 * Return true if the given path is a Haml file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Haml file, or false
 * otherwise
 */
OldHamlFileType.prototype.handles = function(pathName) {
    logger.debug("OldHamlFileType handles " + pathName + "?");
    // var ret = extensionRE.test(pathName);
    var ret = pathName.length > 10 && pathName.substring(pathName.length - 10) === ".html.haml";
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

OldHamlFileType.prototype.name = function() {
    return "Haml File Type";
};

OldHamlFileType.prototype.getResources = function() {
    return this.extracted;
};

/**
 * Add a resource to the file type. This method notes whether
 * or not the resource is new, changed from an existing
 * resource, or is the same as an existing resource.
 * @param {Resource} resource the resource to add
 */
OldHamlFileType.prototype.addResource = function(resource, cb) {
};

OldHamlFileType.prototype.addSet = function(set) {
    // this.extracted.addSet(set);
};

/**
 * Process batches of hamls together to extract strings and localize them.
 *
 * @param {TranslationSet} translations the translations to use with the
 * hamls
 * @param {Array.<String>} locales the list of locales to localize to
 */
OldHamlFileType.prototype.processHamls = function(translations, locales) {
    logger.trace("executing the haml_localizer on " + this.files.length + " files.");
    var haml_localizer = path.join(path.dirname(module.id), "..", "ruby", "haml_localizer.rb");
    var resources;

    var filteredLocales = locales.filter(function(locale) {
        return locale !== this.pseudoLocale;
    });

    var nonAutomaticLocales = filteredLocales.filter(function(locale) {
        return !this.pseudos[locale] || this.pseudos[locale].useWithHamls();
    }.bind(this));

    if (this.files.length > 0) {
        logger.trace("Locales is " + JSON.stringify(nonAutomaticLocales));
        nonAutomaticLocales.forEach(function(locale) {
            var yaml = new YamlResourceFile({
                project: this.project,
                locale: locale,
                pathName: "./translations-" + locale + ".yml",
                type: this
            });

            var t;
            if (this.pseudos[locale]) {
                logger.trace("Running pseudo-loc to generate the strings for locale " + locale);
                t = this.generatePseudo(locale, this.pseudos[locale], this.project.translations).getAll();
                logger.trace("Generated " + t.length);
            } else {
                t = translations.getBy({
                    project: this.project.getProjectId(),
                    targetLocale: locale,
                    datatype: this.datatype
                });
            }

            yaml.addAll(t);
            yaml.write();
        }.bind(this));
    }

    for (var i = 0; i < this.files.length; i += 100) {
        var args = [haml_localizer, filteredLocales.join(","), "./translations"];
        args = args.concat(this.files.slice(i,i+100));

        logger.trace("Executing ruby command " + args.join(" "));
        var procStatus = spawnSync('ruby', args);
        procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
        if (procStatus.status === 0) {
            logger.trace("Execution succeeded. Reading yml file.");
            if (fs.existsSync("unmapped.yml")) {
                var yml = new YamlResourceFile({
                    project: this.project,
                    pathName: "unmapped.yml",
                    locale: this.project.sourceLocale,
                    type: this
                });
                yml.extract();
                resources = yml.getTranslationSet().getAll().map(function(res) {
                    // for the results of the haml_localizer.rb, the file name is
                    // encoded in the context field
                    res.pathName = res.context;
                    res.context = undefined;
                    res.datatype = this.datatype;
                    return res;
                }.bind(this));
                if (resources.length) {
                    this.extracted.addAll(resources);
                    this.newres.addAll(resources);

                    // add the targets so that the new strings files will come out correctly
                    nonAutomaticLocales.forEach(function(locale) {
                        logger.trace("locale " + locale);
                        var targets = resources.map(function(res) {
                            var r = res.clone();
                            r.setTargetLocale(locale);
                            r.setState("new");
                            return r;
                        }) || [];
                        logger.trace("Adding target unmappeds " + JSON.stringify(targets, undefined, 4));

                        this.newres.addAll(targets);
                    }.bind(this));
                }
            }
        } else {
            logger.warn("Execution failed: ");
            logger.warn(procStatus && procStatus.stderr && procStatus.stderr.toString("utf-8"));
        }
    }
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
OldHamlFileType.prototype.write = function() {};


OldHamlFileType.prototype.newFile = function(pathName) {
    logger.trace("Creating new haml file for " + pathName + " len " + this.files.length);
    if (alreadyLoc.test(pathName)) {

    }
    this.files.push(pathName);
    return new OldHamlFile(this.project, pathName, this);
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
OldHamlFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
};

module.exports = OldHamlFileType;

