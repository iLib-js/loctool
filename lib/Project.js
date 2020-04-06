/*
 * Project.js - represents an project
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
var Queue = require("js-stl").Queue;
var ilib = require("ilib");
var JSUtils = require("ilib/lib/JSUtils.js");
var Locale = require("ilib/lib/Locale.js");

// var DBTranslationSet = require("./DBTranslationSet.js");
var LocalRepository = require("./LocalRepository.js");
var TranslationSet = require("./TranslationSet.js");
var ResourceFactory = require("./ResourceFactory.js");
var PseudoFactory = require("./PseudoFactory.js");
var Xliff = require("./Xliff.js");
var log4js = require("log4js");
var mm = require("micromatch");

var logger = log4js.getLogger("loctool.lib.Project");

/**
 * @class Represent a loctool project.
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
 * @param {Object} settings from the command-line
 */
var Project = function(options, root, settings) {
    this.options = options;
    if (options) {
        if (options.noInstance) {
            // used for inheritance not for localization...
            return;
        }
        this.sourceLocale = options.sourceLocale;
        this.pseudoLocale = options.pseudoLocale;
        if (options.excludes && ilib.isArray(options.excludes)) {
            logger.trace("normalizing excludes");
            // match sure the paths are matchable
            this.options.excludes = options.excludes.map(function(pathName) {
                return path.normalize(pathName);
            });
        }
    }

    this.sourceLocale = this.sourceLocale || "en-US";
    this.pseudoLocale = this.pseudoLocale || "zxx-XX";
    this.settings = JSUtils.merge((settings || {}), options.settings);

    this.root = root;  // where localizable files live
    this.target = this.settings.targetDir || this.root; // where localized stuff is written

    if (typeof options.schema !== "undefined") {
        this.schema = options.schema;
    }

    // where the translation xliff files are read from
    this.xliffsDir = (options.settings && options.settings.xliffsDir) || this.settings.xliffsDir || this.root;

    // where the xliff files are written to
    this.xliffsOut = (options.settings && options.settings.xliffsOut) || this.settings.xliffsOut || this.root;

    // generate a localization resource only. not create any other files after running loctool
    this.localizeOnly = (options.settings && options.settings.localizeOnly) || this.settings.localizeOnly;

    // all translations in the db
    this.translations = new TranslationSet(this.sourceLocale);

    // new translations that are not in the db
    this.newres = new TranslationSet(this.sourceLocale);

    // the pseudo-localized translations
    this.pseudo = new TranslationSet(this.sourceLocale);

    // all extracted translations
    this.extracted = new TranslationSet(this.sourceLocale);

    this.paths = new Queue();
    this.files = new Queue();

    this.db = new LocalRepository({
        sourceLocale: this.sourceLocale,
        pseudoLocale: this.pseudoLocale,
        pathName: path.join(this.xliffsDir, this.options.id + ".xliff"),
        project: this,
        xliffsDir: this.xliffsDir
    });

    logger.debug("New Project: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
};

var genericResTypes = {
    "string": "ResourceString",
    "array": "ResourceArray",
    "plural": "ResourcePlural"
};

/**
 * Initialize the project. This will open any database connections
 * and load files and any other things that are necessary to begin
 * processing the files in this project.
 *
 * @params {Function} cb a callback function to call when the
 * project initialization is done
 */
Project.prototype.init = function(cb) {
    this.initFileTypes(); // abstract method implemented in the subclasses
    logger.trace("this.fileTypes.length is " + this.fileTypes.length);

    // Make sure they register their data types so their resources can be instantiated again later.
    // Also keep track of which file types handle which file name extensions.
    var extensionMap = {};
    this.fileTypes.forEach(function(type) {
        if (typeof(type.registerDataTypes) === "function") {
            type.registerDataTypes();
        } else {
            var resTypes = JSUtils.merge(genericResTypes, type.getResourceTypes());
            var datatype = type.getDataType();

            Object.keys(resTypes).forEach(function(resType) {
                ResourceFactory.assignResourceClass(datatype, resType, resTypes[resType]);
            });
        }
        type.getExtensions().forEach(function(extension) {
            if (!extensionMap[extension]) {
                extensionMap[extension] = [];
            }
            extensionMap[extension].push(type);
        })
    });
    this.extensionMap = extensionMap;

    this.db.init(function() {
        // use the specified locales if they exist, or else use whatever locales
        // already exist in the translations. Make sure to also add in the
        // pseudo-locale.
        this.db.getLocales(this.options.id, undefined, function(dbLocales) {
            var locales = this.defaultLocales || dbLocales || [];
            if (!this.defaultLocales && !this.settings.nopseudo) {
                locales.push(this.options.pseudoLocale);
            }

            // weed out the source locales -> don't have to translate to those!
            locales = locales.filter(function(locale) {
                return locale !== "en" && locale !== this.sourceLocale;
            }.bind(this));

            logger.info("Localize project " + this.options.id + " to locales " + JSON.stringify(locales));

            this.locales = locales;

            cb();
        }.bind(this));
    }.bind(this));
};

/**
 * Return the file type with the given name or undefined
 * if none is found.
 * @param {string} name the name of the file type
 * @returns {FileType} the file type corresponding to the
 * given name
 */
Project.prototype.getFileType = function(name) {
    if (!this.fileTypes) return undefined;
    return this.fileTypes.find(function(filetype) {
        return filetype.type === name;
    });
};

/**
 * Return the translation set for this project.
 *
 * @returns {TranslationSet} the translation set
 */
Project.prototype.getTranslationSet = function() {
    return this.translations;
};

/**
 * Return the unique id of this project. Often this is the
 * name of the repository in source control.
 *
 * @returns {String} the unique id of this project
 */
Project.prototype.getProjectId = function() {
    return this.options.id;
};

/**
 * Return the root directory of this project.
 *
 * @returns {String} the path to the root dir of this project
 */
Project.prototype.getRoot = function() {
    return this.root;
};

/**
 * Add the given path name the list of files in this project.
 *
 * @returns {String} pathName the path to add to the project
 */
Project.prototype.addPath = function(pathName) {
    return this.paths.enqueue(pathName);
};

/**
 * Return an array of resource directories for the file type.
 * If there are no resource directories for the file type,
 * then this returns an empty array.
 *
 * @returns {Array.<String>} an array of resource directories
 * for the file type.
 */
Project.prototype.getResourceDirs = function(type) {
    if (this.options && this.options.resourceDirs && this.options.resourceDirs[type]) {
        return typeof(this.options.resourceDirs[type]) === "string" ?
                [this.options.resourceDirs[type]] :
                this.options.resourceDirs[type];
    }

    return [];
};

/**
 * Return true if the given path is included in the list of
 * resource directories for the given type. This method returns
 * true for any path to a directory or file within any resource
 * directory or any of its subdirectories.
 *
 * @param {String} type the type of resources being tested
 * @param {String} pathName the directory name to test
 * @returns {Boolean} true if the path is within one of
 * the resource directories, and false otherwise
 */
Project.prototype.isResourcePath = function(type, pathName) {
    return this.getResourceDirs(type).some(function(dir) {
        return (pathName.substring(0, dir.length) === dir);
    });
};

/**
 * Return true if the given locale is the source locale of this
 * project, or any of the flavors thereof.
 * @param {String} locale the locale spec to test
 * @returns {boolean} true if the given locale is the source
 * locale of this project or any of its flavors, and false
 * otherwise.
 */
Project.prototype.isSourceLocale = function(locale) {
    var l = new Locale(locale);
    var s = new Locale(this.sourceLocale);
    return (l.getLanguage() === s.getLanguage() && l.getRegion() === s.getRegion() && l.getScript() === s.getScript());
};

/**
 * Get the source locale for this project.
 *
 * @returns {string} the locale spec for the source locale of
 * this project
 */
Project.prototype.getSourceLocale = function() {
    return this.sourceLocale;
};

/**
 * Get the pseudo-localization locale for this project.
 *
 * @returns {string} the locale spec for the pseudo locale of
 * this project
 */
Project.prototype.getPseudoLocale = function() {
    return this.pseudoLocale;
};


/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.extract = function(cb) {
    logger.trace("Extracting strings from project " + this.options.id);

    this.db.getBy({
        project: this.options.id
    }, function(err, resources) {
        logger.trace("Getting all resources. Length: " + resources.length);
        logger.trace("Getting all resources. tu length: " + this.db.ts.resources.length);
        this.translations.addAll(resources);
        var pathName;

        while (!this.paths.isEmpty()) {
            pathName = this.paths.dequeue();

            try {
                var types = this.extensionMap[path.extname(pathName)];

                if (types) {
                    for (var i = 0; i < types.length; i++) {
                        // If the path name is explicitly given in the includes list, then we handle it regardless of whether
                        // or not the type thinks it should be handled.
                        logger.trace("Checking if " + types[i].name() + " handles " + pathName);
                        if (types[i].handles(pathName)) {
                            logger.debug("    " + pathName);
                            var file = types[i].newFile(pathName);
                            this.files.enqueue(file);
                            file.extract();

                            types[i].addSet(file.getTranslationSet());
                        }
                    }
                }
            } catch (e) {
                logger.error("Error while extracting from file " + pathName + ". Skipping...");
                logger.error(e);
            }
        }

        this.paths = undefined; // signal to the GC that we are done with this

        cb();
    }.bind(this));
};

/**
 * Load all existing strings from the database, and compare with the
 * newly extracted ones to find which ones to save to the database as
 * new strings. When that is done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * save is done
 */
Project.prototype.save = function(cb) {
    logger.trace("Project save called to save new resources to the DB");

    for (var i = 0; i < this.fileTypes.length; i++) {
        var set = this.fileTypes[i].getNew(this.translations);
        if (set && set.size()) {
            this.newres.addSet(set);
        }
    }

    // this.db.addAll(this.newres, cb);
    cb();
};

/**
 * Generate pseudo localized resources based on the English.
 */
Project.prototype.generatePseudo = function() {
    logger.trace("Project generate pseudo");
    var pb;

    /*
    if (!this.settings.nopseudo && (typeof(this.options.generatePseudo) === "undefined" || this.options.generatePseudo)) {
        for (var i = 0; i < this.fileTypes.length; i++) {
            this.fileTypes[i].generatePseudo(this.pseudoLocale);
        }
    }
    */

    for (var i = 0; i < this.fileTypes.length; i++) {
        var pseudos = this.fileTypes[i].pseudos;
        for (var locale in pseudos) {
            this.fileTypes[i].generatePseudo(locale, pseudos[locale]);
        }
    }

    for (var i = 0; i < this.fileTypes.length; i++) {
        this.pseudo.addSet(this.fileTypes[i].getPseudo());
    }
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.write = function(cb) {
    logger.trace("Project write");

    var file;

    logger.info("Write project " + this.options.id + " to locales " + JSON.stringify(this.locales));

    var superset = new TranslationSet(this.sourceLocale);

    this.db.getBy({
        targetLocale: this.locales
    }, function(err, resources) {
        superset.addAll(resources);

        file = !this.files.isEmpty() && this.files.dequeue();
        while (file) {
            // this generates localized versions of each source file instead of writing
            // an aggregated resource file later. Only some file types implement this.
            file.localize(superset, this.locales);

            file = !this.files.isEmpty() && this.files.dequeue();
        }

        // now write out the aggregate resource files
        for (var i = 0; i < this.fileTypes.length; i++) {
            this.fileTypes[i].write(superset, this.locales);
        }

        logger.trace("Finished writing out the aggregated resource files.");

        cb();
    }.bind(this));
};

/**
 * Extract all strings for all file types and when that is
 * done, call the callback function.
 *
 * @param {Function} cb callback function to call when the
 * extraction is done
 */
Project.prototype.close = function(cb) {
    logger.trace("Project close");

    // signal to the GC that we don't need these any more
    // before we recurse and allocate a lot more memory.
    this.files = undefined;

    if(!this.localizeOnly) {
        var dir = this.xliffsOut;
        var base = this.options.id;
        var extractedPath = path.join(dir, base + "-extracted.xliff");
        var extracted = new TranslationSet(this.sourceLocale);

        for (var i = 0; i < this.fileTypes.length; i++) {
            logger.trace("Collecting extracted strings from " + this.fileTypes[i].name());
            extracted.addAll(this.fileTypes[i].getExtracted().getBy({
                sourceLocale: this.sourceLocale
            }));

            if (this.fileTypes[i].modern && this.fileTypes[i].modern.size() > 0) {
                var modernPath = path.join(dir, base + "-modern.xliff");
                logger.info("Writing out the modern translation strings to " + modernPath);
                var modernXliff = new Xliff({
                    pathName: modernPath,
                    version: this.settings.xliffVersion
                });
                modernXliff.addSet(this.fileTypes[i].modern);
                fs.writeFileSync(modernPath, modernXliff.serialize(true), "utf-8");
            }
        }

        // calculate only the new strings and save them to the db
        var newres = this.newres;

        logger.trace("translations is size " + this.translations.size());
        logger.trace("extracted is size " + extracted.size());
        logger.trace("newres is size " + newres.size());
        /*
        this.db.addAll(newres, function() {
            this.db.close(function() {
                cb();
            });
        }.bind(this));
        */

        logger.info("Writing out the extracted strings to " + extractedPath);
        var extractedXliff = new Xliff({
            pathName: extractedPath,
            allowDups: true,
            version: this.settings.xliffVersion
        });
        extractedXliff.addSet(extracted);
        fs.writeFileSync(extractedPath, extractedXliff.serialize(true), "utf-8");

        var newLocales = newres.getLocales();

        if (newLocales && newLocales.length) {
            for (var i = 0; i < newLocales.length; i++) {
                var locale = newLocales[i];
                if (!this.isSourceLocale(locale) && !PseudoFactory.isPseudoLocale(locale)) {
                    var newPath = path.join(dir, base + "-new-" + locale + ".xliff");
                    var resources = newres.getAll().filter(function(res) {
                        return res.getTargetLocale() === locale && !res.dnt;
                    });

                    if (resources && resources.length) {
                        logger.info("Writing out the new strings to " + newPath);
                        var newXliff = new Xliff({
                            project: this.name,
                            pathName: newPath,
                            sourceLocale: this.sourceLocale,
                            version: this.settings.xliffVersion
                        });

                        resources.forEach(function(res) {
                            newXliff.addResource(res);
                        });

                        fs.writeFileSync(newPath, newXliff.serialize(true), "utf-8");
                    } else {
                        if (fs.existsSync(newPath)) {
                            fs.unlinkSync(newPath);
                        }
                    }
                }
            }
        } else {
            logger.info("No new strings in this run.");
        }
    }
    // now call the plugins in case they need to do anything else
    for (var i = 0; i < this.fileTypes.length; i++) {
        if (typeof(this.fileTypes[i].projectClose) === "function") {
            this.fileTypes[i].projectClose();
        }
    }

    this.db.close(function() {
        cb();
    });
};

module.exports = Project;
