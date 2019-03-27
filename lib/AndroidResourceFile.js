/*
 * AndroidResourceFile.js - represents an Android strings.xml resource file
 *
 * Copyright © 2016-2017,2019 HealthTap, Inc.
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

var ContextResourceString = require("../lib/ContextResourceString.js");
var ResourceString = require("../lib/ResourceString.js");
var ResourceArray = require("../lib/ResourceArray.js");
var ResourcePlural = require("../lib/ResourcePlural.js");
var Set = require("../lib/Set.js");
var utils = require("../lib/utils.js");
var TranslationSet = require("../lib/TranslationSet.js")

var logger = log4js.getLogger("loctool.lib.AndroidResourceFile");

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
var AndroidResourceFile = function(props) {
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.type = props.type;
        this.locale = props.locale;
        this.context = props.context || undefined;
    }

    this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * Parse an Android Resource XML string and extract the resources.
 *
 * @param {String} data the string to parse
 */
AndroidResourceFile.prototype.parse = function(data) {
    if (!data) return;

    this.xml = data;

    this.contents = xml2json.toJson(data, {object: true});

    if (!this.contents.resources) {
        logger.debug(this.pathName + " is not a resource file, skipping.");
        return;
    }

    var resources = this.contents.resources,
        locale = this.getLocale();

    if (resources.string) {
        var strArr = ilib.isArray(resources.string) ? resources.string : [resources.string];

        for (var i = 0; i < strArr.length; i++) {
            logger.trace("Adding string resource " + " locale " + locale + " " + JSON.stringify(strArr[i]) );
            if (utils.isAndroidResource(strArr[i])) {
                // note that this is a used resource?
                logger.trace("Already resourcified");
            } else {
                var params = {
                    key: strArr[i].name,
                    pathName: this.pathName,
                    context: this.context || undefined,
                    project: this.project.getProjectId(),
                    comment: strArr[i].i18n,
                    dnt: utils.isDNT(strArr[i].i18n),
                    datatype: this.type.datatype,
                    flavor: this.flavor,
                    state: "new",
                    index: this.resourceIndex++
                };
                if (locale === this.project.sourceLocale) {
                    params.source = strArr[i].$t;
                    params.sourceLocale = locale;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.target = strArr[i].$t;
                    params.targetLocale = locale;
                }
                var res = new ContextResourceString(params);
                if (typeof(strArr[i].formatted) !== "undefined") {
                    res.formatted = strArr[i].formatted;
                }

                logger.trace("new string resource: " + JSON.stringify(strArr[i], undefined, 4));
                this.set.add(res);
            }
        };
    }

    if (resources["string-array"]) {
        var arrays = ilib.isArray(resources["string-array"]) ? resources["string-array"] : [resources["string-array"]];
        logger.debug("Processing " + arrays.length + " string arrays.");
        logger.trace("Arrays is " + JSON.stringify(arrays));
        for (var i = 0; i < arrays.length; i++) {
            strArr = arrays[i];
            if (!strArr.item || strArr.item.every(function(item) { return utils.isAndroidResource(item);})) {
                // note that this is a used resource?
                logger.trace("Already resourcified");
            } else {
                var params = {
                    key: strArr.name,
                    pathName: this.pathName,
                    context: this.context || undefined,
                    project: this.project.getProjectId(),
                    subtype: "string-array",
                    comment: strArr.i18n,
                    dnt: utils.isDNT(strArr.i18n),
                    datatype: this.type.datatype,
                    flavor: this.flavor,
                    state: "new",
                    index: this.resourceIndex++
                };
                if (locale === this.project.sourceLocale) {
                    params.sourceArray = strArr.item;
                    params.sourceLocale = locale;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.targetArray = strArr.item;
                    params.targetLocale = locale;
                }
                var res = new ResourceArray(params);
                logger.trace("new string-array resource: " + JSON.stringify(strArr, undefined, 4));

                this.set.add(res);
            }
        };
    }

    if (resources.array) {
        var arrays = ilib.isArray(resources.array) ? resources.array : [resources.array];
        logger.debug("Processing " + arrays.length + " string arrays.");
        logger.trace("Arrays is " + JSON.stringify(arrays));
        for (var i = 0; i < arrays.length; i++) {
            strArr = arrays[i];
            if (!strArr.item || strArr.item.every(function(item) { return utils.isAndroidResource(item);})) {
                // note that this is a used resource?
                logger.trace("Already resourcified");
            } else {
                var params = {
                    key: strArr.name,
                    pathName: this.pathName,
                    context: this.context || undefined,
                    project: this.project.getProjectId(),
                    subtype: "array",
                    comment: strArr.i18n,
                    dnt: utils.isDNT(strArr.i18n),
                    datatype: this.type.datatype,
                    flavor: this.flavor,
                    state: "new",
                    index: this.resourceIndex++
                };
                if (locale === this.project.sourceLocale) {
                    params.sourceArray = strArr.item;
                    params.sourceLocale = locale;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.targetArray = strArr.item;
                    params.targetLocale = locale;
                }
                var res = new ResourceArray(params);
                logger.trace("new array resource: " + JSON.stringify(strArr, undefined, 4));
            }

            this.set.add(res);
        };
    }

    if (resources.plurals) {
        logger.debug("Processing " + resources.plurals.length + " plural strings.");
        var plurals = ilib.isArray(resources.plurals) ? resources.plurals : [resources.plurals];
        logger.trace("Plurals are " + JSON.stringify(resources.plurals));

        for (var i = 0; i < plurals.length; i++) {
            strArr = plurals[i];
            logger.trace("Plural " + i + " is " + JSON.stringify(strArr));
            var items = {};
            if (strArr && strArr.item && ilib.isArray(strArr.item)) {
                strArr.item.forEach(function(item) {
                    if (typeof(item.$t) === "undefined") {
                        logger.error("Syntax error in file " + this.pathName + ", item " + strArr.name + " quantity " + item.quantity + ". Probably have unescaped XML elements in this string.");
                    } else {
                        items[item.quantity] = item.$t;
                    }
                }.bind(this));
                var params = {
                    key: strArr.name,
                    pathName: this.pathName,
                    context: this.context || undefined,
                    project: this.project.getProjectId(),
                    comment: strArr.i18n,
                    dnt: utils.isDNT(strArr.i18n),
                    datatype: this.type.datatype,
                    flavor: this.flavor,
                    state: "new",
                    index: this.resourceIndex++
                };
                if (locale === this.project.sourceLocale) {
                    params.sourceStrings = items;
                    params.sourceLocale = locale;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.targetStrings = items;
                    params.targetLocale = locale;
                }
                var res = new ResourcePlural(params);

                logger.trace("new plural resource: " + JSON.stringify(strArr, undefined, 4));

                this.set.add(res);
            } else {
                logger.trace("Error reading plurals. strArr is " + JSON.stringify(strArr));
            }
        };

        resources.plurals = undefined;
    }

    logger.trace("After loading, resources are: " + JSON.stringify(this.set.getAll(), undefined, 4));
    logger.trace("AndroidResourceFile: loaded strings in " + this.pathName);

    //    mark this set as not dirty after we read it from disk
    //    so we can tell when other code has added resources to it
    this.set.setClean();
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
AndroidResourceFile.prototype.extract = function() {
    if (this.pathName) {
        this._parsePath(); // get the locale and context to use while making the resource instances below

        var p = path.join(this.project.root, this.pathName);
        logger.trace("Attempting to read and parse file " + p);
        try {
            var xml = fs.readFileSync(this.pathName, "utf8");

            if (xml) {
                this.parse(xml);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.debug(e);
        }
    }
};

//See https://developer.android.com/guide/topics/resources/providing-resources.html table 2 for order of suffices
var lang = new RegExp("\/values-([a-z][a-z])(-.*)?$");
var reg = new RegExp("\/values-([a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var script = new RegExp("\/values-([a-z][a-z])-s([A-Z][a-z][a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var context = new RegExp("\/values-(.*)$");

/**
 * Parse the suffixes of the resource file for the context and the locale. The
 * context and locale for Android resource files
 * are given in the suffix of the directory name that the resource file
 * lives in.<p>
 *
 * The general syntax of the directory name is:<p>
 *
 * <pre>
 * "values" [ "-" context ] [ "-" language [ "-r" region]]
 * </pre>
 *
 * That is, the string values is followed optionally by the context and the
 * language code and the region code for the locale.
 *
 * @private
 */
AndroidResourceFile.prototype._parsePath = function() {
    if (!this._pathParsed)  {
        var dir = path.dirname(this.pathName || "");

        if (!this.locale) {
            // don't have it? Then guess based on the path name
            var match;
            if ((match = script.exec(dir)) && match && match.length > 0) {
                // this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-")).getSpec();
                this.locale = new Locale(match[1], match[3], undefined, match[2]).getSpec();
                this.context = match[4] ? match[4].substring(1) : undefined;
                logger.trace("script");
            } else if ((match = reg.exec(dir)) && match && match.length > 0) {
                //this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-")).getSpec();
                this.locale = new Locale(match[1], match[2]).getSpec();
                this.context = match[3] ? match[3].substring(1) : undefined;
                logger.trace("region");
            } else if ((match = lang.exec(dir)) && match && match.length > 0) {
                // this.locale = new Locale(dir.substring(dir.length-2)).getSpec();
                this.locale = new Locale(match[1]).getSpec();
                this.context = match[2] ? match[2].substring(1) : undefined;
                logger.trace("language");
            } else if ((match = context.exec(dir)) && match && match.length > 0) {
                this.context = match.length > 1 && match[1].length ? match[1] : undefined;
                logger.trace("context");
            }

            if (!this.locale) {
                this.locale = this.project.sourceLocale;
            }
        } else if (!this.context) {
            var results = context.exec(dir);
            if (results && results.length) {
                this.context = results[1] || undefined;
                logger.trace("context only");
                // dir = dir.substring(0, dir.length-2);
            }
        }

        this.flavor = this.project.flavors.getFlavorForPath(dir);
        if (this.flavor === "main") {
            this.flavor = undefined;
        }

        logger.trace("_parsePath: locale is " + this.locale + " and context is " + this.context + " and flavor is " + this.flavor);
    }

    this._pathParsed = true;
};


/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
AndroidResourceFile.prototype.getLocale = function() {
    this._parsePath();

    return this.locale;
};

/**
 * Get the context of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
AndroidResourceFile.prototype.getContext = function() {
    this._parsePath();

    return this.context;
};

/**
 * Get the path to this resource file.
 *
 * @returns {String} the path to this file
 */
AndroidResourceFile.prototype.getPath = function() {
    return this.pathName;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
AndroidResourceFile.prototype.getAll = function() {
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
AndroidResourceFile.prototype.addResource = function(res) {
    logger.trace("AndroidResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    // source-only resources have an undefined target locale but a defined source locale... it is okay to add these to this resource file
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() &&
            resLocale === this.locale &&
            res.getContext() === this.context) {
        logger.trace("correct project, context, and locale. Adding.");

        // merge the same string from various files, contexts, and data types into one
        var another = res.clone();
        another.pathName = this.pathName;

        this.set.add(another);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else if (resLocale !== this.locale) {
                logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale);
            } else {
                logger.warn("Attempt to add a resource to a resource file with the incorrect context. " + res.getContext() + " vs. " + this.context);
            }
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
AndroidResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

function escapeString(str) {
    return utils.escapeXml(str).replace(/([^\\])'/g, "$1\\'");
}

function escapeDouble(str) {
    if (!str) return undefined;
    return utils.escapeXml(str).replace(/([^\\])"/g, "$1'");
}

// we don't localize resource files
AndroidResourceFile.prototype.localize = function() {};

/**
 * @private
 */
AndroidResourceFile.prototype._getXML = function() {
    // return the original if the contents have not been modified
    var xml = this.xml;

    if (this.set.isDirty()) {
        var json = {resources: {
             "xmlns:tools": "http://schemas.android.com/tools"
        }};

        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            if (resource instanceof ContextResourceString || resource instanceof ResourceString) {
                if (resource.getTarget() || resource.getSource()) {
                    if (!json.resources.string) json.resources.string = [];
                    var target = (resource.getTargetLocale() && resource.getTarget()) || resource.getSource();
                    logger.trace("writing translation for " + resource.getKey() + " as " + target);
                    var entry = {
                        name: resource.getKey(),
                        i18n: escapeDouble(resource.comment)
                    };
                    if (typeof(resource.formatted) !== "undefined") {
                        entry.formatted = resource.formatted;
                    }
                    entry["$t"] = escapeString(target);

                    json.resources.string.push(entry);
                } else {
                    logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
                }
            } else if (resource instanceof ResourceArray) {
                var array;

                if (resource.subtype === "string-array") {
                    if (!json.resources["string-array"]) json.resources["string-array"] = [];
                    array = json.resources["string-array"];
                } else {
                    if (!json.resources.array) json.resources.array = [];
                    array = json.resources.array;
                }

                var items = (resource.getTargetLocale() && resource.getTargetArray()) || resource.getSourceArray();
                logger.trace("Writing array " + resource.getKey() + " of size " + items.length);
                var arr = {
                    name: resource.getKey(),
                    i18n: escapeDouble(resource.comment),
                    item: []
                };

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    logger.trace("Mapping " + JSON.stringify(item || ""));

                    arr.item.push({
                        "$t": escapeString(item || "")
                    });
                }

                array.push(arr);
            } else {
                if (!json.resources.plurals) json.resources.plurals = [];

                var plurals = resources[j];

                logger.trace("Writing plurals " + plurals.getKey());
                var arr = {
                    name: plurals.getKey(),
                    i18n: escapeDouble(resource.comment),
                    item: []
                };

                var items = (resource.getTargetLocale() && plurals.getTargetPlurals()) || plurals.getSourcePlurals();
                for (var quantity in items) {
                    if (items[quantity]) {
                        arr.item.push({
                            quantity: quantity,
                            "$t": escapeString(items[quantity])
                        });
                    }
                }

                json.resources.plurals.push(arr);
            }
        }

        xml = PrettyData.xml('<?xml version="1.0" encoding="utf-8"?>' + xml2json.toXml(json));
    }

    return xml;
};

/**
 * Write the resource file out to disk again.
 */
AndroidResourceFile.prototype.write = function() {
    logger.trace("writing resource file. [" + [this.project.getProjectId(), this.context || "root", this.locale].join(", ") + "]");
    if (this.set.isDirty()) {
        // var dir, valueDir, alternateDir, settings, defaultLocales;
        var dir, settings;

        settings = (this.project &&
            this.project.settings &&
            this.project.settings &&
            this.project.settings.AndroidResourceFile) || {};

        logger.debug("Writing Android resources for locale " + this.locale + " to file " + this.pathName);

        var filename = path.join(this.project.target, this.pathName);
        dir = path.dirname(filename);

        utils.makeDirs(dir);

        var xml = this._getXML();
        fs.writeFileSync(filename, xml, "utf8");

        var alternateDirs = settings.alternateDirs;

        if (alternateDirs && alternateDirs[this.locale]) {
            var baseDir = path.dirname(dir);

            // For some locales, we have to write out a copy of the resources
            // to support older and newer versions of Android that do locale
            // support differently from each other
            var dirs = alternateDirs[this.locale];
            for (var altDir in dirs) {
                alternateDir = "values" + dirs[altDir];

                if (this.context) {
                    alternateDir += "-" + this.context;
                }

                alternateDir = path.join(baseDir, alternateDir);
                utils.makeDirs(alternateDir);

                var pathName = path.join(alternateDir, this.type + ".xml");

                logger.debug("Also writing a copy of the Android resources for locale " + this.locale + " to file " + pathName);

                fs.writeFileSync(pathName, xml, "utf8");
            }
        }
        logger.trace("Wrote string translations to file " + this.pathName);
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
AndroidResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = AndroidResourceFile;
