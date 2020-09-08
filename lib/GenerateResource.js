/*
 * GenerateResource.js - Read xliff files.
 *
 * Copyright © 2020, JEDLSoft
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
var utils = require("./utils.js");
var LocaleMatcher = require("ilib/lib/LocaleMatcher");
var TranslationSet = require("./TranslationSet.js");
var Xliff = require("./Xliff.js");
var logger = log4js.getLogger("loctool.lib.GenerateResource");

/**
 * @class A class that represents the local story of a set of
 * translations used in a project.
 *
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var GenerateResource = function (options) {
    logger.trace("GenerateResource constructor called");
    this.targetDir = ".";
    this.xliffsDir = ".";
    this.resRoot = "resources";
    this.resName = "strings.json";

    if (options && options.xliffsDir) {
        this.xliffsDir = options.xliffsDir;
    }
    if (options &&  options.resRoot) {
        this.resRoot = options.resRoot;
    }
    if (options && options.resName) {
        this.resName = options.resName;
    }
    this.ts = new TranslationSet(this.sourceLocale);
};

var xliffFileFilter = /([.*][\-])?([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]))?\.xliff$/;

/**
 * Initialize this repository and read in all of the strings.
 *
 * @param {Project} project the current project
 * @param {Function(Object, Object)} cb callback to call when the
 * initialization is done
 */
GenerateResource.prototype.init = function() {
    var dir = this.xliffsDir;
    var list;
    try {
        list = fs.readdirSync(dir);
    } catch (err) {
        logger.warn(dir + "is invalid directory");
    }
    
    if (list) {
        list.filter(function(file) {
            var match = xliffFileFilter.exec(file);
            if (!match ||
               match.length < 2 ||
               (match.length >= 3 && match[2] && !utils.iso639[match[2]]) ||
               (match.length >= 5 && match[4] && !utils.iso15924[match[4]]) ||
               (match.length >= 7 && match[6] && !utils.iso3166[match[6]])) {
                return false;
            }
            return true;
        }).forEach(function (file) {
            pathName = path.join(dir, file);
            var xliff = new Xliff({
                sourceLocale: this.sourceLocale
            });
            if (fs.existsSync(pathName)) {
                var data = fs.readFileSync(pathName, "utf-8");
                xliff.deserialize(data);
                var ts = xliff.getTranslationSet();
                this.ts.addSet(ts);
            } else {
                logger.warn("Could not open xliff file: " + pathName);
            }
        }.bind(this));
    }
};

GenerateResource.prototype.getXliffsDir = function() {
    return this.xliffsDir;
};
GenerateResource.prototype.getResRoot = function() {
    return this.resRoot;
};
GenerateResource.prototype.getResName = function() {
    return this.resName
};
GenerateResource.prototype.getResSize = function() {
    return this.ts.resources.length;
};

GenerateResource.prototype.setXliffsDir = function(dir) {
    this.xliffsDir = dir;
};
GenerateResource.prototype.setResRoot = function(path) {
    this.resRoot = path;
};
GenerateResource.prototype.setResName = function(name) {
    this.resName = name;
};
module.exports = GenerateResource;