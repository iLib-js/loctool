/*
 * MockJsonFile.js - represents a mock resource file
 *
 * Copyright © 2024, JEDLSoft
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
var fs = require("fs");
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
var MockJsonFile = function(props) {
    this.sourceLocale = new Locale();

    if (props) {
        this.API = props.project.getAPI();
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = props.locale;
        this.type = props.type;
    }

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

MockJsonFile.prototype.extract = function() {
    if (this.pathName) {
        // put fake resources in, a few of each type
        this.set.addAll([
            this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: "foobar1",
                sourceLocale: this.project.sourceLocale,
                source: "This is a test string",
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for foobar1",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }),
            this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: "foobar2",
                sourceLocale: this.project.sourceLocale,
                source: "This is a second test string",
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for foobar2",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }),
            this.API.newResource({
                resType: "array",
                project: this.project.getProjectId(),
                key: "arr1",
                sourceLocale: this.project.sourceLocale,
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for arr1",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }),
            this.API.newResource({
                resType: "array",
                project: this.project.getProjectId(),
                key: "arr2",
                sourceLocale: this.project.sourceLocale,
                sourceArray: [
                    "four",
                    "five",
                    "six"
                ],
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for arr2",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }),
            this.API.newResource({
                resType: "plural",
                project: this.project.getProjectId(),
                key: "plu1",
                sourceLocale: this.project.sourceLocale,
                sourceStrings: {
                    "one": "singular",
                    "other": "plural"
                },
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for plu1",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }),
            this.API.newResource({
                resType: "plural",
                project: this.project.getProjectId(),
                key: "plu2",
                sourceLocale: this.project.sourceLocale,
                sourceStrings: {
                    "one": "There is {n} item.",
                    "other": "There are {n} items."
                },
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: "Comment for plu2",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            })
        ]);
    }
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
MockJsonFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
MockJsonFile.prototype.getContext = function() {};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
MockJsonFile.prototype.getAll = function() {
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
MockJsonFile.prototype.addResource = function(res) {
    this.set.add(res);
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
MockJsonFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
MockJsonFile.prototype.localize = function() {};

/**
 * @private
 */
MockJsonFile.prototype.getDefaultSpec = function() {};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
MockJsonFile.prototype.getContent = function() {
    var resources = this.set.getAll();
    var content = {};

    // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
    resources.sort(function(left, right) {
        return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
    });

    for (var j = 0; j < resources.length; j++) {
        var resource = resources[j];
        var target;
        switch (resource.getType()) {
            case 'array':
                target = resource.getTargetArray() || resource.getSourceArray();
                break;
            case 'plural':
                target = resource.getTargetPlurals() || resource.getSourcePlurals();
                break;
            default:
                target = resource.getTarget() || resource.getSource();
                break;
        }
        content[resource.getKey()] = target;
    }

    return JSON.stringify(content, undefined, 4);
};

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
MockJsonFile.prototype.getResourceFilePath = function(locale) {
    if (this.pathName) return this.pathName;

    var dir, newPath;
    locale = locale || this.locale;

    var filename = locale + ".mock";

    dir = this.project.getResourceDirs("mock")[0] || ".";
    newPath = path.join(dir, filename);

    return newPath;
};

/**
 * Write the resource file out to disk again.
 */
MockJsonFile.prototype.write = function() {
    var dir;

    if (!this.pathName) {
        this.pathName = this.getResourceFilePath(this.locale || this.project.sourceLocale);
    }

    var p = path.join(this.project.target, this.pathName);
    dir = path.dirname(p);

    var content = this.getContent();

    this.API.utils.makeDirs(dir);

    fs.writeFileSync(p, content, "utf8");
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
MockJsonFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = MockJsonFile;
