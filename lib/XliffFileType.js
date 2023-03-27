/*
 * XliffFileType.js - Represents a collection of Xliff files
 *
 * Copyright © 2016-2017, 2020-2021 HealthTap, Inc.
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

var path = require("path");
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;

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

var alreadyLoc = new RegExp(/([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.xliff?$/);

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

    logger.debug(ret ? "Yes" : "No");
    var ret = ((pathName.length > 4) && (pathName.substring(pathName.length - 4) === ".xlf")) ||
        ((pathName.length > 6) && (pathName.substring(pathName.length - 6) === ".xliff"));
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }
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
    // xliffs are localized individually, so we don't have to
    // write out the resources
};

XliffFileType.prototype.newFile = function(pathName) {
    return new XliffFile({
        project: this.project,
        pathName: pathName,
        sourceLocale: this.project.sourceLocale
    });
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
