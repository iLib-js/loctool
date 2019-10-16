/*
 * XliffFileType.js - Represents a collection of Xliff files
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var HamlFile = require("./HamlFile.js");
var XliffFile = require("./XliffFile.js");
var FileType = require("./FileType.js");

var logger = log4js.getLogger("loctool.lib.XliffFileType");

var XliffFileType = function(project) {
    this.type = "xml";
    this.parent.call(this, project);

    this.files = [];
    this.extensions = [ ".xliff" ];
};

XliffFileType.prototype = new FileType();
XliffFileType.prototype.parent = FileType;
XliffFileType.prototype.constructor = XliffFileType;

/**
 * Return true if the given path is a Haml file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Haml file, or false
 * otherwise
 */
XliffFileType.prototype.handles = function(pathName) {
    logger.debug("XliffFileType handles " + pathName + "?");
    // var ret = extensionRE.test(pathName);
    ret = (path.normalize(pathName) === "en-US.xliff");

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

XliffFileType.prototype.name = function() {
    return "Xliff File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
XliffFileType.prototype.write = function() {
    logger.trace("Writing xliff files");
    if (this.file) {
        var res, file, resources = this.newres.getAll();

        logger.trace("There are " + resources.length + " resources to add.");

        for (var i = 0; i < resources.length; i++) {
            res = resources[i];
            this.file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + this.file.pathName);
        }

        resources = this.pseudo.getAll();

        for (var i = 0; i < resources.length; i++) {
            res = resources[i];
            this.file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + this.file.pathName);
        }

        logger.info("Now writing out the ios xliff files");

        // first write out the xliff file to disk, then import it to xcode
        this.file.write();

        if (this.file.getTranslationSet().isDirty()) {
            logger.info("executing xcodebuild on the " + this.project.options.id + " project to import those translations. This may take a while...");

            var args = ["-importLocalizations", "-localizationPath", "./en.xliff", "-project", "feelgood.xcodeproj"];
            var procStatus = spawnSync('xcodebuild', args);
            procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
            if (procStatus.status !== 0) {
                logger.warn("Execution failed: ");
            }
            procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));

            logger.info("xcodebuild done");
        }
    }
};

XliffFileType.prototype.newFile = function(pathName) {
    if (!this.file) {
        this.file = new XliffFile({
            project: this.project,
            pathName: pathName,
            sourceLocale: this.project.sourceLocale
        });
    }

    return this.file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @return {XliffFile} the Xliff file that serves the current project
 */
XliffFileType.prototype.getResourceFile = function() {
    return this.file;
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
XliffFileType.prototype.registerDataTypes = function() {};

module.exports = XliffFileType;
