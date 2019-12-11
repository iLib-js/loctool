/*
 * ObjectiveCProject.js - represents an iOS project using Objective C
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
// const spawnSync = require('child_process').spawnSync;

var Project = require("./Project.js");
var ObjectiveCFileType = require("./ObjectiveCFileType.js");
var IosStringsFileType = require("./IosStringsFileType.js");
// var XliffFileType = require("./XliffFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ObjectiveCProject");

/**
 * @class Represent an iOS project.
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li>sourceLocale {String} - the source locale of this project (defaults to en-US)
 * <li>pseudoLocale {String} - the locale to use as the pseudo locale
 * <li>name {String} - human readable name of this project
 * <li>id {String} - unique id of this project (usually the git repo name)
 * <li>projectType {String} - The type of this project. This may be any one of "android", "iosobjc", "iosswift", or "web"
 * <li>resourceDirs {Array.<String>} - an array of directories containing resource files in this project
 * <li>excludes {Array.<String>} - an array of paths to exclude from scanning for strings
 * </ul>
 *
 * @param {Object} options settings for the current project
 * @param {String} root
 * @param {Object} settings settings from the command-line
 */
var ObjectiveCProject = function(options, root, settings) {
    this.parent.prototype.constructor.call(this, options, root, settings);

    this.useFileTypes = this.settings.filetypes;
    this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales) || [];

    this.resourceFileType = new IosStringsFileType(this);

    logger.debug("New ObjectiveCProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);

    this.flavors = this.settings.flavors;
};

ObjectiveCProject.prototype = new Project({noInstance: true});
ObjectiveCProject.prototype.parent = Project;
ObjectiveCProject.prototype.constructor = ObjectiveCProject;

ObjectiveCProject.prototype.initFileTypes = function() {
    if (this.useFileTypes) {
        this.fileTypes = [];
        if (this.useFileTypes.ObjectiveCFileType) {
            this.fileTypes.push(new ObjectiveCFileType(this));
        }
        this.fileTypes.push(this.resourceFileType);
    } else {
        this.fileTypes = [
           new ObjectiveCFileType(this),
           this.resourceFileType
        ];
    }
};

/**
 * Initialize the project. This will open any database connections
 * and load files and any other things that are necessary to begin
 * processing the files in this project.
 *
 * @params {Function} cb a callback function to call when the
 * project initialization is done
 *
ObjectiveCProject.prototype.init = function(cb) {
    logger.trace("Initializing project " + this.options.id);

    this.initFileTypes(); // abstract method implemented in the subclasses
    logger.trace("this.fileTypes.length is " + this.fileTypes.length);

    this.db.init(cb);

    / *
    this.db.init(function() {
        logger.info("Running xcodebuild to extract the strings. This may take a while...");

        // now spawn xcodebuild to extract all the text from the whole project
        var args = ["-exportLocalizations", "-localizationPath", ".", "-project", "feelgood.xcodeproj", "-exportLanguage", "en-US"];
        var procStatus = spawnSync('xcodebuild', args);
        procStatus.stdout && logger.info(procStatus.stdout.toString("utf-8"));
        if (procStatus.status !== 0) {
            logger.warn("Execution failed: ");
        }
        procStatus.stderr && logger.info(procStatus.stderr.toString("utf-8"));

        file = this.resourceFileType.newFile("./en-US.xliff");
        this.files.enqueue(file);
        file.extract();
        this.resourceFileType.addSet(file.getTranslationSet());

        logger.info("xcodebuild done");

        cb();
    }.bind(this));
    * /
};
*/

/**
 * Return the resource file type for this project type.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here
 *
 * @returns {IosStringsFileType} the resource file
 * type for this project
 */
ObjectiveCProject.prototype.getResourceFileType = function() {
    return this.resourceFileType;
};

/**
 * Clear the cache and then call the parent to write the project.
 *
 * @override
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
ObjectiveCProject.prototype.write = function(cb) {
    this.resourceFileType.clear();
    this.parent.prototype.write.call(this, cb);
};

module.exports = ObjectiveCProject;
