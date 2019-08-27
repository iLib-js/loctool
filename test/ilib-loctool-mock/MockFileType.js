/*
 * MockFileType.js - Represents a collection of javasript files
 *
 * Copyright © 2019, JEDLSoft
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
var Locale = require("ilib/lib/Locale.js");

var MockResourceFileType = require("ilib-loctool-mock-resource");

var MockFileType = function(project) {
    this.type = "mock";
    this.datatype = "mock";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".mock", ".moc" ];
};


/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MockFileType.prototype.handles = function(pathName) {
    logger.debug("MockFileType handles " + pathName + "?");
    var ret = false;

    return ret;
};

MockFileType.prototype.name = function() {
    return "Mock File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
MockFileType.prototype.write = function(translations, locales) {};

MockFileType.prototype.newFile = function(path) {
    return undefined;
};

MockFileType.prototype.getDataType = function() {
    return this.datatype;
};

MockFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
MockFileType.prototype.getResourceFileType = function() {
    return MockResourceFileType;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
MockFileType.prototype.getExtracted = function() {};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MockFileType.prototype.addSet = function(set) {};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MockFileType.prototype.getNew = function() {};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MockFileType.prototype.getPseudo = function() {};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
MockFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = MockFileType;
