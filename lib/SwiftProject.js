/*
 * SwiftProject.js - represents an iOS project using Swift
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
var log4js = require("log4js");

var Project = require("./Project.js");
var ObjectiveCFileType = require("./ObjectiveCFileType.js");
var SwiftFileType = require("./SwiftFileType.js");
var IosStringsFileType = require("./IosStringsFileType.js");
var JavaScriptFileType = require("./JavaScriptFileType.js");
var JavaScriptResourceFileType = require("./JavaScriptResourceFileType.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.SwiftProject");

/**
 * @class Represent an swift iOS project.
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
var SwiftProject = function(options, root, settings) {
    this.parent.prototype.constructor.call(this, options, root, settings);

    this.useFileTypes = this.settings.filetypes;
    this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales) || [];

    var stringsFileType = new IosStringsFileType(this);

    this.resourceFileType = {
        "swift": stringsFileType,
        "objc": stringsFileType,
        "js": new JavaScriptResourceFileType(this)
    };

    this.flavors = this.settings.flavors;

    logger.debug("New SwiftProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

SwiftProject.prototype = new Project({noInstance: true});
SwiftProject.prototype.parent = Project;
SwiftProject.prototype.constructor = SwiftProject;

SwiftProject.prototype.initFileTypes = function() {
    if (this.useFileTypes) {
        this.fileTypes = [];
        // swift should go first, as it should get first choice for the .h files
        if (this.useFileTypes.SwiftFileType) {
            this.fileTypes.push(new SwiftFileType(this));
        }
        if (this.useFileTypes.ObjectiveCFileType) {
            this.fileTypes.push(new ObjectiveCFileType(this));
        }
        if (this.useFileTypes.JavaScriptFileType) {
            this.fileTypes.push(new JavaScriptFileType(this));
        }
        this.fileTypes.push(this.resourceFileType.swift);
        this.fileTypes.push(this.resourceFileType.js);
    } else {
        this.fileTypes = [
            new SwiftFileType(this),
            new ObjectiveCFileType(this),
            new JavaScriptFileType(this),
            this.resourceFileType.swift,
            this.resourceFileType.js
        ];
    }
};

/**
 * Return the resource file type for this project type.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here
 *
 * @param {String} type the type of resource being sought
 * @returns {IosStringsFileType} the resource file
 * type for this project
 */
SwiftProject.prototype.getResourceFileType = function(type) {
    return this.resourceFileType[type];
};

module.exports = SwiftProject;
