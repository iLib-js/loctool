/*
 * CustomProject.js - a customizable project
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
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.CustomProject");

/**
 * @class Represent an customizable project.
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li>plugins {Array.<String>} - an array of file localizer plugin names. These
 * may be names of node modules or paths to source files containing the code
 * <li>sourceLocale {String} - the source locale of this project (defaults to en-US)
 * <li>pseudoLocale {String} - the locale to use as the pseudo locale
 * <li>name {String} - human readable name of this project
 * <li>id {String} - unique id of this project (usually the git repo name)
 * <li>resourceDirs {Array.<String>} - an object that maps resource file types to resource directories
 * <li>excludes {Array.<String>} - an array of paths to exclude from scanning for strings. You can
 * use minimatch expressions here.
 * <li>includes {Array.<String>} - an array of paths to include for scanning which override the excludes
 * </ul>
 *
 * @param {Object} options settings for the current project
 * @param {String} root
 * @param {Object} settings settings from the command-line
 */
var CustomProject = function(options, root, settings) {
    this.parent.prototype.constructor.call(this, options, root, settings);

    this.plugins = options.plugins || [];
    this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales) || [];

    this.flavors = this.settings.flavors;

    logger.debug("New CustomProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

CustomProject.prototype = new Project({noInstance: true});
CustomProject.prototype.parent = Project;
CustomProject.prototype.constructor = CustomProject;

CustomProject.prototype.initFileTypes = function() {
    this.fileTypes = [];

    var API = {
        ResourceFactory: ResourceFactory,
        newTranslationSet: function(sourceLocale) {
            return new TranslationSet(sourceLocale);
        },
        utils: utils
    };

    this.plugins.forEach(function(plugin) {
        var filetype;

        try {
            filetype = require(plugin);
            this.fileTypes.push(new filetype(this, API));
        } catch (e) {
            // didn't work... okay, so it's not a node module or path to a file.
            // try names of things in the plugins directory

            var pathName = path.join("..", "plugins", plugin + ".js");
            try {
                filetype = require(pathName);
                this.fileTypes.push(new filetype(this, API));
            } catch (e2) {
                throw new Error("Could not load plugin " + plugin);
            }
        }
    }.bind(this));

    this.resourceFileType = {};

    this.fileTypes.forEach(function(filetype) {
        var rftName = filetype.getResourceFileType();
        if (rftName) {
            try {
                var rft = require(rftName);
                this.resourceFileType[filetype.name()] = rft; 
            } catch (e) {
                throw new Error("Cannot find resource file type plugin " + rftName + 
                    " which is required by the file type " + filetype.name());
            }
        } // else does not require a resource file
    }.bind(this));
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
CustomProject.prototype.extract = function(cb) {
    this.parent.prototype.extract.call(this, function() {
        this.db.getBy({
            project: this.options.id,
        }, function(err, resources) {
            logger.trace("Getting all resources. Length: " + resources.length);
            // logger.trace("Getting all resources. tu length: " + this.db.ts.resources.length);
            this.translations.addAll(resources);

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
CustomProject.prototype.getResourceFileType = function(type) {
    return this.resourceFileType[type];
};

module.exports = CustomProject;
