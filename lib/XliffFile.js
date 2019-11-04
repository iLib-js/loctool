/*
 * XliffFile.js - represents xliff translations resource file
 *
 * Copyright © 2016-2017, 2019 HealthTap, Inc.
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
var xml2json = require('xml2json');
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var PrettyData = require("pretty-data").pd;
var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var Xliff = require("./Xliff.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")

var logger = log4js.getLogger("loctool.lib.XliffFile");

/**
 * @class Represents an Xliff file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var XliffFile = function(props) {
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.type = props.type;
        this.locale = props.locale;
        this.context = props.context || undefined;
    }
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
XliffFile.prototype.extract = function() {
    if (this.pathName && fs.existsSync(this.pathName)) {
        logger.trace("XliffFile: loading strings in " + this.pathName);
        this.xliff = new Xliff({
            path: this.pathName,
            sourceLocale: this.project.sourceLocale,
            project: this.project
        });

        this.xliff.deserialize(fs.readFileSync(this.pathName, "utf-8"));

        this.set = this.xliff.getTranslationSet();
        logger.trace("After loading, there are " + this.set.size() + " resources.");

        // mark this set as not dirty after we read it from disk
        // so we can tell when other code has added resources to it
        this.set.setClean();
    }
};

/**
 * Get the locale of this resource file. For Xliff files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
XliffFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Xliff files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
XliffFile.prototype.getContext = function() {
    return "";
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
XliffFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
XliffFile.prototype.addResource = function(res) {
    logger.trace("XliffFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    if (res && res.getProject() === this.project.getProjectId()) {
        logger.trace("correct project. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
        } else {
            logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
XliffFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

function escapeString(str) {
    return utils.escapeXml(str).replace(/([^\\])'/g, "$1\\'");
}

// we don't localize resource files
XliffFile.prototype.localize = function() {};

/**
 * Write the resource file out to disk again.
 */
XliffFile.prototype.write = function() {
    logger.trace("writing xliff resource file for project " + this.project.getProjectId());
    if (this.set && this.set.isDirty()) {
        var dir;

        var p = path.join(this.project.root, this.pathName);
        var d = path.dirname(p);
        utils.makeDirs(d);

        fs.writeFileSync(p, this.xliff.serialize(), "utf-8");

        logger.debug("Wrote string translations to file " + this.pathName);
    } else {
        logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
XliffFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = XliffFile;
