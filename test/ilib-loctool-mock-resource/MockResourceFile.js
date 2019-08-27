/*
 * MockResourceFile.js - represents a mock resource file
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
var path = require("path");
var Locale = require("ilib/lib/Locale.js");

/**
 * @class Represents an Android resource file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var MockResourceFile = function(props) {
    this.locale = new Locale();

    this.API = props.project.getAPI();
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
    }
};

/**
 * We don't read mock resource files. We only write them.
 */
MockResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
MockResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
MockResourceFile.prototype.getContext = function() {};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
MockResourceFile.prototype.getAll = function() {};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
MockResourceFile.prototype.addResource = function(res) {};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
MockResourceFile.prototype.isDirty = function() {};

// we don't localize resource files
MockResourceFile.prototype.localize = function() {};

/**
 * @private
 */
MockResourceFile.prototype.getDefaultSpec = function() {};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
MockResourceFile.prototype.getContent = function() {};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
MockResourceFile.prototype.getResourceFilePath = function(locale, flavor) {
    if (this.pathName) return this.pathName;

    var localeDir, dir, newPath, spec;
    locale = locale || this.locale;

    var defaultSpec = this.getDefaultSpec();

    var filename = defaultSpec + ".mock";

    dir = this.project.getResourceDirs("mock")[0] || ".";
    newPath = path.join(dir, filename);

    logger.trace("Getting resource file path for locale " + locale + ": " + newPath);

    return newPath;
};

/**
 * Write the resource file out to disk again.
 */
MockResourceFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
MockResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = MockResourceFile;
