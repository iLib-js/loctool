/*
 * JavaScriptResourceFileType.js - manages a collection of android resource files
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
var JavaScriptResourceFile = require("./JavaScriptResourceFile.js");
var TranslationSet = require("./TranslationSet.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.JavaScriptResourceFileType");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var JavaScriptResourceFileType = function(project) {
    this.type = "javascript";
    this.parent.call(this, project);
    this.extensions = [ ".js" ];
};

JavaScriptResourceFileType.prototype = new FileType();
JavaScriptResourceFileType.prototype.parent = FileType;
JavaScriptResourceFileType.prototype.constructor = JavaScriptResourceFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
JavaScriptResourceFileType.prototype.handles = function(pathName) {
    // js resource files are only generated. Existing ones are never read in.
    logger.debug("JavaScriptResourceFileType handles " + pathName + "?");

    logger.debug("No");
    return false;
};

/**
 * Write out all resources for this file type. For JavaScript resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
JavaScriptResourceFileType.prototype.write = function() {
    logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

JavaScriptResourceFileType.prototype.name = function() {
    return "JavaScript Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {JavaScriptResourceFile} a resource file instance for the
 * given path
 */
JavaScriptResourceFileType.prototype.newFile = function(pathName) {
    var file = new JavaScriptResourceFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    var locale = file.getLocale() || this.project.sourceLocale;

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {JavaScriptResourceFile} the Android resource file that serves the
 * given project, context, and locale.
 */
JavaScriptResourceFileType.prototype.getResourceFile = function(locale) {
    var key = locale || this.project.sourceLocale;

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new JavaScriptResourceFile({
            project: this.project,
            locale: key
        });

        logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<JavaScriptResourceFile>} an array of resource files
 * known to this file type instance
 */
JavaScriptResourceFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
JavaScriptResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
            logger.trace("Generating pseudo for " + resource.getKey());
            var res = resource.generatePseudo(locale, pb);
            if (res && res.getSource() !== res.getTarget()) {
                this.pseudo.add(res);
            }
        }
    }.bind(this));
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
JavaScriptResourceFileType.prototype.registerDataTypes = function() {};

module.exports = JavaScriptResourceFileType;
