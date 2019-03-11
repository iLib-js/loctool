/*
 * MarkdownFileType.js - Represents a collection of Markdown files
 *
 * Copyright © 2019, Box, Inc.
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
var MarkdownFile = require("./MarkdownFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.MarkdownFileType");

var MarkdownFileType = function(project) {
    this.type = "md";
    this.datatype = "markdown";
    this.parent.call(this, project);
    this.extensions = [ ".md", ".markdown", ".mdown", ".mkd", ".rst", ".rmd" ];
};

MarkdownFileType.prototype = new FileType();
MarkdownFileType.prototype.parent = FileType;
MarkdownFileType.prototype.constructor = MarkdownFileType;

var alreadyLoc = new RegExp(/(^|\/)(([a-z][a-z])(-[A-Z][a-z][a-z][a-z])?(-([A-Z][A-Z])(-[A-Z]+)?)?)\//);

/**
 * Return true if the given path is an Markdown template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MarkdownFileType.prototype.handles = function(pathName) {
    logger.debug("MarkdownFileType handles " + pathName + "?");
    var extension = path.extname(pathName).toLowerCase();
    var ret = (this.extensions.indexOf(extension) > -1);

    if (ret) {
        var match = alreadyLoc.exec(pathName);
        if (match && match.length > 2) {
            if (utils.iso639[match[3]]) {
                if (match.length < 6 || !match[6] || !utils.iso3166[match[6]]) {
                    return true;
                }
                return match[2] === this.project.sourceLocale;
            } else {
                return true;
            }
        }
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

MarkdownFileType.prototype.name = function() {
    return "Markdown File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
MarkdownFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

MarkdownFileType.prototype.newFile = function(path) {
    return new MarkdownFile(this.project, path, this);
};

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
MarkdownFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
};

module.exports = MarkdownFileType;
