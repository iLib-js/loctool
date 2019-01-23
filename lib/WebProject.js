/*
 * WebProject.js - represents a Ruby on Rails web project
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

var Project = require("./Project.js");
var HTMLFileType = require("./HTMLFileType.js");
var HTMLTemplateFileType = require("./HTMLTemplateFileType.js");
var HamlFileType = require("./HamlFileType.js");
var OldHamlFileType = require("./OldHamlFileType.js");
var RubyFileType = require("./RubyFileType.js");
var YamlFileType = require("./YamlFileType.js");
var JsxFileType = require("./JsxFileType.js");
var YamlResourceFileType = require("./YamlResourceFileType.js");
var JavaScriptFileType = require("./JavaScriptFileType.js");
var JsxFileType = require("./JsxFileType.js");
var JavaScriptResourceFileType = require("./JavaScriptResourceFileType.js");
var MarkdownFileType = require("./MarkdownFileType.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.WebProject");

/**
 * @class Represent an android project.
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
var WebProject = function(options, root, settings) {
    this.parent.prototype.constructor.call(this, options, root, settings);

    this.useFileTypes = this.settings && this.settings.fileTypes;
    this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales) || [];

    var jsrft = new JavaScriptResourceFileType(this);

    this.resourceFileType = {
        "ruby": new YamlResourceFileType(this),
        "js": jsrft,
        "jsx": jsrft
    };

    this.hamlType = settings && settings.oldHamlLoc ? new OldHamlFileType(this) : new HamlFileType(this);

    this.flavors = this.settings.flavors;

    logger.debug("New WebProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

WebProject.prototype = new Project({noInstance: true});
WebProject.prototype.parent = Project;
WebProject.prototype.constructor = WebProject;

WebProject.prototype.initFileTypes = function() {

    if (this.useFileTypes) {
        this.fileTypes = [];
        if (this.useFileTypes.RubyFileType) {
            this.fileTypes.push(new RubyFileType(this));
        }
        if (this.useFileTypes.HTMLTemplateFileType) {
            this.fileTypes.push(new HTMLTemplateFileType(this));
        }
        if (this.useFileTypes.JavaScriptFileType) {
            this.fileTypes.push(new JavaScriptFileType(this));
        }
        if (this.useFileTypes.YamlFileType) {
            this.fileTypes.push(new YamlFileType(this));
        }
        if (this.useFileTypes.JavaScriptFileType) {
            this.fileTypes.push(this.resourceFileType.js);
        }
        if (this.useFileTypes.JsxFileType) {
            this.fileTypes.push(this.resourceFileType.jsx);
        }
        if (this.useFileTypes.HamlFileType) {
            this.fileTypes.push(this.hamlType);
        }
        if (this.useFileTypes.RubyFileType) {
            this.fileTypes.push(this.resourceFileType.ruby);
        }
        if (this.useFileTypes.YamlResourceFileType) {
            this.fileTypes.push(new YamlResourceFileType(this));
        }
        if (this.useFileTypes.HTMLFileType) {
            this.fileTypes.push(new HTMLFileType(this));
        }
        if (this.useFileTypes.MarkdownFileType) {
            this.fileTypes.push(new MarkdownFileType(this));
        }
    } else {
        this.fileTypes = [
            new RubyFileType(this),
            new HTMLTemplateFileType(this),
            new JavaScriptFileType(this),
            new JsxFileType(this),
            new YamlFileType(this),
            this.resourceFileType.js,
            this.hamlType,
            this.resourceFileType.ruby,
            new HTMLFileType(this),
            new MarkdownFileType(this)
        ];
    }
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
WebProject.prototype.extract = function(cb) {
    this.parent.prototype.extract.call(this, function() {
        this.db.getBy({
            project: this.options.id,
        }, function(err, resources) {
            logger.trace("Getting all resources. Length: " + resources.length);
            // logger.trace("Getting all resources. tu length: " + this.db.ts.resources.length);
            this.translations.addAll(resources);

            if (this.settings.oldHamlLoc) {
                logger.trace("Extracting haml strings from project " + this.options.id + " with the old haml localizer.");
                this.hamlType.processHamls(this.translations, this.locales);
            }

            cb();
        }.bind(this));
    }.bind(this));
};


/**
 * Return the resource file type for this project.
 * The resource file type will be able to read in and
 * write out resource files and other file types put
 * their resources here. The type parameter tells
 * which type of resources are being sought. A project
 * for example may contain separate resource files for
 * javascript and ruby.
 *
 * @param {String} type the type of resource being sought
 * @returns {FileType} the resource file
 * type for this project
 */
WebProject.prototype.getResourceFileType = function(type) {
    return this.resourceFileType[type];
};

module.exports = WebProject;
