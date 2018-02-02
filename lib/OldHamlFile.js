/*
 * OldHamlFile.js - plugin to extract resources from a Haml source code file
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
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.OldHamlFile");

/**
 * Create a new Haml file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var OldHamlFile = function(project, pathName) {
    this.project = project;
    this.pathName = pathName;
};

/**
 * Extract all the localizable strings from the Haml file and add them to the
 * project's translation set.
 */
OldHamlFile.prototype.extract = function() {
};

/**
 * Return the set of resources found in the current Haml file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Haml file.
 */
OldHamlFile.prototype.getTranslationSet = function() {
    return undefined;
}

// we don't localize haml files at the normal time. We wait to the end and
// localize them using ruby code
OldHamlFile.prototype.localize = function() {};
OldHamlFile.prototype.write = function() {};

module.exports = OldHamlFile;
