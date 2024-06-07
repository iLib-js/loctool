/*
 * MockJsonFileType.js - manages a collection of android resource files
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
var Locale = require("ilib/lib/Locale.js");

var MockJsonFile = require("./MockJsonFile.js");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var MockJsonFileType = function(project) {
    this.type = "mockjson";
    this.datatype = "mock";

    this.project = project;
    this.resourceFiles = {};
    this.API = project.getAPI();

    this.extensions = [ ".mock", ".moc", ".mok" ];

    this.extracted = this.API.newTranslationSet(this.project.sourceLocale);
    this.newres = this.API.newTranslationSet(this.project.sourceLocale);
    this.pseudo = this.API.newTranslationSet(this.project.sourceLocale);

    this.pseudos = {};

    // generate all the pseudo bundles we'll need
    project.settings && project.settings.locales && project.settings.locales.forEach(function(locale) {
        var pseudo = this.API.getPseudoBundle(locale, this, project);
        if (pseudo) {
            this.pseudos[locale] = pseudo;
        }
    }.bind(this));

    // for use with missing strings
    if (!project.settings.nopseudo) {
        this.missingPseudo = this.API.getPseudoBundle(project.pseudoLocale, this, project);
    }
};

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
MockJsonFileType.prototype.handles = function(pathName) {
    // js resource files are only generated. Existing ones are never read in.
    return this.extensions.find(function(ext) {
        return pathName.endsWith(ext);
    });
};

/**
 * Write out all resources for this file type. For Mock resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
MockJsonFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // have to store the base English string or else there will be nothing to override in the translations
        file = this.getResourceFile(res.getSourceLocale());
        file.addResource(res);

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (res.dnt) {
                    // Resource  is set to 'do not translate'
                    return;
                }
                if (!r || this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource())) {
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    switch (res.getType()) {
                        case 'array':
                            newres.setTargetArray((r && r.getTargetArray()) || res.getSourceArray());
                            break;
                        case 'plural':
                            newres.setTargetPlurals((r && r.getTargetPlurals()) || res.getSourcePlurals());
                            break;
                        default:
                            newres.setTarget((r && r.getTarget()) || res.getSource());
                            break;
                    }
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);
                }

                file = this.getResourceFile(locale);
                file.addResource(r || res);
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = this.getResourceFile(res.getTargetLocale());
        file.addResource(res);
    }

    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

MockJsonFileType.prototype.name = function() {
    return "Mock Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {MockJsonFile} a resource file instance for the
 * given path
 */
MockJsonFileType.prototype.newFile = function(pathName, options) {
    return new MockJsonFile(Object.assign({}, options, {
        project: this.project,
        pathName: pathName,
        type: this
    }));
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {MockJsonFile} the Android resource file that serves the
 * given project, context, and locale.
 */
MockJsonFileType.prototype.getResourceFile = function(locale) {
    var key = locale || this.project.sourceLocale;

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new MockJsonFile({
            project: this.project,
            locale: key,
            type: this
        });
    }

    return resfile;
};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path name of the resource being added.
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
MockJsonFileType.prototype.getResourceFilePath = function(locale, pathName) {
    var l = new Locale(locale || this.project.sourceLocale);
    var localeSpec;

    if (l.getSpec() === this.project.sourceLocale) {
        localeSpec = "root";
    } else {
        localeSpec = this.API.utils.getLocaleDefault(locale);
    }

    // this is the parent dir
    var parent = path.dirname(pathName);
    return path.join(parent, localeSpec + ".mock");
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<MockJsonFile>} an array of resource files
 * known to this file type instance
 */
MockJsonFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
MockJsonFileType.prototype.generatePseudo = function(locale, pb) {};

MockJsonFileType.prototype.getDataType = function() {
    return this.datatype;
};

MockJsonFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
MockJsonFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a mock file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
MockJsonFileType.prototype.getResourceFileType = function() {};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
MockJsonFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MockJsonFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MockJsonFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MockJsonFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = MockJsonFileType;
