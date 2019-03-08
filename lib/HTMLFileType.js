/*
 * HTMLFileType.js - Represents a collection of HTML files
 *
 * Copyright © 2018, Box, Inc.
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
var HTMLFile = require("./HTMLFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.HTMLFileType");

var HTMLFileType = function(project) {
    this.type = "html";
    this.datatype = "html";
    this.parent.call(this, project);
    this.extensions = [ ".html", ".htm" ];
};

HTMLFileType.prototype = new FileType();
HTMLFileType.prototype.parent = FileType;
HTMLFileType.prototype.constructor = HTMLFileType;

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.html?$/);

/**
 * Return true if the given path is an HTML template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
HTMLFileType.prototype.handles = function(pathName) {
    logger.debug("HTMLFileType handles " + pathName + "?");
    var ret = ((pathName.length > 4) && (pathName.substring(pathName.length - 4) === ".htm")) ||
        ((pathName.length > 5) && (pathName.substring(pathName.length - 5) === ".html"));
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

HTMLFileType.prototype.name = function() {
    return "HTML File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
HTMLFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

HTMLFileType.prototype.newFile = function(path) {
    return new HTMLFile(this.project, path, this);
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
HTMLFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
};

module.exports = HTMLFileType;
