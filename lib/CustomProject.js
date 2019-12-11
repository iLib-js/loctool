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
var ResourceFactory = require("./ResourceFactory.js");
var PseudoFactory = require("./PseudoFactory.js");
var TranslationSet = require("./TranslationSet.js");
var utils = require("./utils.js");

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

    this.plugins = (options && (options.plugins || options.settings && options.settings.plugins)) || [];
    this.resourceFileTypes = (options && (options.resourceFileTypes || options.settings && options.settings.resourceFileTypes)) || {};
    this.defaultLocales = this.settings.locales || (options && options.settings && options.settings.locales) || [];

    this.flavors = this.settings.flavors;

    logger.debug("New CustomProject: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

CustomProject.prototype = new Project({noInstance: true});
CustomProject.prototype.parent = Project;
CustomProject.prototype.constructor = CustomProject;

CustomProject.prototype.loadPlugin = function(plugin, API) {
    var filetype, filetypeClass;

    try {
        logger.trace("Trying module " + plugin);
        filetypeClass = require(plugin);
        filetype = new filetypeClass(this, API);
        this.fileTypes.push(filetype);
        return filetype;
    } catch (e) {
        logger.trace(e);
        try {
            // didn't work... okay, so try with the standard prefix
            logger.trace("Trying module ilib-loctool-" + plugin);
            filetypeClass = require("ilib-loctool-" + plugin);
            filetype = new filetypeClass(this, API);
            this.fileTypes.push(filetype);
            return filetype;
        } catch (e2) {
            logger.trace(e2);
            // didn't work again... okay, so it's not a node module or path to a file.
            // try names of things in the plugins directory

            var pathName = path.join("..", "plugins", plugin + ".js");
            try {
                filetypeClass = require(pathName);
                filetype = new filetypeClass(this, API);
                this.fileTypes.push(filetype);
                return filetype;
            } catch (e3) {
                throw new Error("Could not load plugin " + plugin);
            }
        }
    }
};

CustomProject.prototype.getAPI = function() {
    return {
        newResource: ResourceFactory,
        newTranslationSet: function(sourceLocale) {
            return new TranslationSet(sourceLocale);
        },
        utils: utils,
        isPseudoLocale: function(locale) {
            return PseudoFactory.isPseudoLocale(locale);
        },
        getPseudoBundle: function(locale, filetype, project) {
            var pseudo = PseudoFactory({
                project: project,
                targetLocale: locale,
                set: project.translations,
                type: filetype
            });
            // there may be no pseudo for this locale ...
            if (pseudo) {
                var sourceLocale = pseudo.getPseudoSourceLocale();
                if (project.defaultLocales.indexOf(sourceLocale) === -1) {
                    // need to load the translations for the pseudo source locale for this pseudo to work
                    project.defaultLocales.push(sourceLocale);
                }
            }
            return pseudo;
        },
        getResourceFileType: function(type) {
            return this.resourceFileMap[type];
        }.bind(this)
    };
};

CustomProject.prototype.initFileTypes = function() {
    this.fileTypes = [];
    this.resourceFileMap = {};

    this.plugins.forEach(function(pluginName) {
        var plugin = this.loadPlugin(pluginName, this.getAPI());
        if (plugin) {
            var resFileType = plugin.getResourceFileType();
            if (resFileType) {
                this.resourceFileMap[plugin.type] = new resFileType(this, this.getAPI());
            }
        }
    }.bind(this));

    Object.keys(this.resourceFileTypes).forEach(function(filetype) {
        if (this.resourceFileTypes[filetype]) {
            this.resourceFileMap[filetype] = this.loadPlugin(this.resourceFileTypes[filetype], this.getAPI());
        }
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
    return this.resourceFileMap[type];
};

module.exports = CustomProject;
