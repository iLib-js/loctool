/*
 * JsxFileType.js - Represents a collection of jsxjava files
 *
 * Copyright © 2018, HealthTap, Inc.
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var JsxFile = require("./JsxFile.js");
var FileType = require("./FileType.js");
var ResourceFactory = require("./ResourceFactory.js");
var ResourceString = require("./ResourceString.js");
var PseudoFactory = require("./PseudoFactory.js");

var logger = log4js.getLogger("loctool.lib.JsxFileType");

var JsxFileType = function(project) {
    this.type = "javascript";
    this.datatype = "javascript";

    this.parent.call(this, project);
    this.extensions = [ ".jsx", ".js" ];
};

JsxFileType.prototype = new FileType();
JsxFileType.prototype.parent = FileType;
JsxFileType.prototype.constructor = JsxFileType;

var alreadyLocJS = new RegExp(/^([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z])(-[A-Z]+)?)?\.jsx?$/);

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JsxFileType.prototype.handles = function(pathName) {
    logger.debug("JsxFileType handles " + pathName + "?");
    var ret = false;

    // resource files should be handled by the JavaScriptResourceType instead
    if (this.project.isResourcePath("js", pathName)) return false;

    if ((pathName.length > 3  && pathName.substring(pathName.length - 3) === ".js") ||
        (pathName.length > 4  && pathName.substring(pathName.length - 4) === ".jsx")) {
        alreadyLocJS.lastIndex = 0;
        var fileName = path.basename(pathName);
        var match = alreadyLocJS.exec(fileName);
        ret = (match && match.length &&
                match[1] && utils.iso639[match[1]] &&
                (!match[5] || utils.iso3166[match[5]]) &&
                (!match[3] || utils.iso15924[match[3]])) ?
            match[1] === this.project.sourceLocale : true;
    }

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

JsxFileType.prototype.name = function() {
    return "JavaScript File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
JsxFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType("jsx");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));;

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing JavaScript strings to " + locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated || utils.cleanString(res.getSource()) !== utils.cleanString(r.getSource())) {
                    if (r) {
                        logger.trace("extracted   source: " + utils.cleanString(res.getSource()));
                        logger.trace("translation source: " + utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    logger.trace("No translation for " + res.reskey + " to " + locale);
                } else {
                    if (res.reskey != r.reskey) {
                        // if reskeys don't match, we matched on cleaned string.
                        //so we need to overwrite reskey of the translated resource to match
                        r = r.clone();
                        r.reskey = res.reskey;
                    }

                    file = resFileType.getResourceFile(locale);
                    file.addResource(r);
                    logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

JsxFileType.prototype.newFile = function(path) {
    return new JsxFile(this.project, path, this);
};

/**
 * Return all resource that do not currently exist in the given translation set.
 * This is all resources extracted from the source files minus all the
 * resources in the DB.
 *
 * @param {TranslationSet} set the set of existing resources in the DB
 * @returns {TranslationSet} the set of new or changed resources
 *
JsxFileType.prototype.findNew = function(set) {
    var extracted = this.extracted.getAll();

    for (var i = 0; i < extracted.length; i++) {
        var resource = extracted[i];
        logger.trace("Examining resource " + resource.getKey() + " to see if it's new.");

        var existing = set.get(resource.hashKey());
        if (!existing || !resource.equals(existing)) {
            logger.trace("yes");
            this.newres.add(resource);
        } else {
            logger.trace("no");
        }
    }

    logger.trace("findNew Done. Returning a set with " + this.newres.size() + " resources.");
    return this.newres;
};
*/

/**
 * Register the data types and resource class with the resource factory so that it knows which class
 * to use when deserializing instances of resource entities.
 */
JsxFileType.prototype.registerDataTypes = function() {
    ResourceFactory.registerDataType(this.datatype, "string", ResourceString);
};

module.exports = JsxFileType;
