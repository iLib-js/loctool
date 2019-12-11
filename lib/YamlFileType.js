/*
 * YamlFileType.js - manages a collection of yaml files
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
var YamlFile = require("./YamlFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ContextResourceString = require("./ContextResourceString.js");

var logger = log4js.getLogger("loctool.lib.YamlFileType");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var YamlFileType = function(project) {
    this.type = "ruby";
    this.datatype = "x-yaml";
    this.parent.call(this, project);

    this.resourceFiles = {};
    this.extensions = [ ".yml", ".yaml" ];
};

YamlFileType.prototype = new FileType();
YamlFileType.prototype.parent = FileType;
YamlFileType.prototype.constructor = YamlFileType;

var alreadyLoc = new RegExp(/(^|\/)(([a-z][a-z])(-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.yml$/);

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlFileType.prototype.handles = function(pathName) {
    logger.debug("YamlFileType handles " + pathName + "?");

    var ret = pathName.length > 4 && pathName.substring(pathName.length - 4) === ".yml";

    if (ret) ret = !this.project.isResourcePath("yml", pathName);

    if (ret) {
        var match = alreadyLoc.exec(pathName);
        if (match !== null) {
            var spec = "";
            if (match[2]) {
                // filter out the variant if there is one
                locale = new Locale(match[2]);
                locale = new Locale(locale.language, locale.region, undefined, locale.script);
                spec = locale.getSpec();
            }
            ret = !utils.iso639[match[3]] && spec !== this.project.sourceLocale;
        }
    }

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
YamlFileType.prototype.write = function() {
    // yaml files are localized individually, so we don't have to
    // write out the resources
};

YamlFileType.prototype.name = function() {
    return "Yaml File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlFileType.prototype.newFile = function(pathName) {
    return new YamlFile({
        project: this.project,
        pathName: pathName,
        type: this
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
YamlFileType.prototype.findNew = function(set) {
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
YamlFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType("x-yaml", "string", ContextResourceString);
};

module.exports = YamlFileType;
