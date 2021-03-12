/*
 * TMX.js - model an tmx file
 *
 * Copyright © 2021 Box, Inc.
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

var log4js = require("log4js");
var xmljs = require("xml-js");
var ilib = require("ilib");
var JSUtils = require("ilib/lib/JSUtils");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceArray = require("./ResourceArray.js");
var ResourceFactory = require("./ResourceFactory.js");
var TranslationUnit = require("./Xliff.js").TranslationUnit;

var logger = log4js.getLogger("loctool.lib.Tmx");

/**
 * @class A class that represents a tmx translation unit variant.
 */
var TUV = function Tuv(options) {
    this.locale = options.locale;
    this.string = options.string;
};

var TU = function TU(options) {
};

/**
 * @class A class that represents an tmx 1.4b file.
 * See https://www.gala-global.org/tmx-14b for details on the file format.
 * The options may be undefined, which represents a new,
 * clean Tmx instance. The options object may also
 * be an object with the following properties:
 *
 * <ul>
 * <li><i>path</i> - the path to the tmx file on disk
 * <li><i>tool-id</i> - the id of the tool that saved this tmx file
 * <li><i>tool-name</i> - the full name of the tool that saved this tmx file
 * <li><i>tool-version</i> - the version of the tool that save this tmx file
 * <li><i>tool-company</i> - the name of the company that made this tool
 * <li><i>copyright</i> - a copyright notice that you would like included into the tmx file
 * <li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
 * <li><i>allowDups</i> - allow duplicate resources in the tmx. By default, dups are
 * filtered out. This option allows you to have trans-units that represent instances of the
 * same resource in the file with different metadata. For example, two instances of a
 * resource may have different comments which may both be useful to translators or
 * two instances of the same resource may have been extracted from different source files.
 * <li><i>version</i> - The version of tmx that will be produced by this instance.
 * </ul>
 *
 * @constructor
 * @param {Array.<Object>|undefined} options options to
 * initialize the file, or undefined for a new empty file
 */
var Tmx = function Tmx(options) {
    this.version = 1.2;

    if (options) {
        this["tool-id"] = options["tool-id"];
        this["tool-name"] = options["tool-name"];
        this["tool-version"] = options["tool-version"];
        this["tool-company"] = options["tool-company"];
        this.copyright = options.copyright;
        this.path = options.path;
        this.sourceLocale = options.sourceLocale;
        this.project = options.project;
        this.allowDups = options.allowDups;
        if (typeof(options.version) !== 'undefined') {
            this.version = Number.parseFloat(options.version);
        }
    }

    this.sourceLocale = this.sourceLocale || "en-US";

    // place to store the translation units
    this.tu = [];
    this.tuhash = {};

    this.ts = new TranslationSet(this.sourceLocale);
};

/**
 * Get the path to this tmx file.
 * @returns {String|undefined} the path to this tmx file
 */
Tmx.prototype.getPath = function() {
    return this.path;
};

/**
 * Set the path to this tmx file.
 * @param {String} the path to the tmx file
 */
Tmx.prototype.setPath = function(pathName) {
    this.path = pathName;
};

/**
 * Get the translation units in this tmx.
 *
 * @returns {Array.<Object>} the translation units in this tmx
 */
Tmx.prototype.getTranslationUnits = function() {
    return this.tu;
};

/**
 * @private
 * @param project
 * @param context
 * @param sourceLocale
 * @param targetLocale
 * @param key
 * @param type
 * @param path
 * @returns
 */
Tmx.prototype._hashKey = function(project, context, sourceLocale, targetLocale, key, type, path, ordinal, quantity, flavor) {
    var key = [key, type || "string", sourceLocale || this.sourceLocale, targetLocale || "", context || "", project, path || "", ordinal || "", quantity || "", flavor || ""].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Add this translation unit to this tmx.
 *
 * @param {TranslationUnit} unit the translation unit to add to this tmx
 */
Tmx.prototype.addTranslationUnit = function(unit) {
    logger.trace("Tmx " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));

    var hashKeySource = this._hashKey(unit.project, unit.context, unit.sourceLocale, "", unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor),
        hashKeyTarget = this._hashKey(unit.project, unit.context, unit.sourceLocale, unit.targetLocale, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor);

    if (unit.targetLocale) {
        var oldUnit = this.tuhash[hashKeySource];
        if (oldUnit) {
            logger.trace("Replacing old source-only unit in favour of this joint source/target unit");
            this.tuhash[hashKeySource] = undefined;
            JSUtils.shallowCopy(unit, oldUnit);
            this.tuhash[hashKeyTarget] = oldUnit;
            return;
        }
    }

    var oldUnit = this.tuhash[hashKeyTarget];
    if (oldUnit && !this.allowDups) {
        logger.trace("Merging unit");
        // update the old unit with this new info
        JSUtils.shallowCopy(unit, oldUnit);
    } else {
        if (this.version >= 2 && this.tu.length) {
            if (this.tu[0].targetLocale !== unit.targetLocale) {
                throw "Mismatched target locale";
            }
        }

        logger.trace("Adding new unit");
        this.tu.push(unit);
        this.tuhash[hashKeyTarget] = unit;
    }
};


/**
 * Add translation units to this tmx.
 *
 * @param {Array.<Object>} files the translation units to add to this tmx
 */
Tmx.prototype.addTranslationUnits = function(units) {
    for (var i = 0; i < units.length; i++) {
        this.addTranslationUnit(units[i]);
    }
};

/**
 * Add a resource to this tmx file. If a resource
 * with the same file, locale, context, and key already
 * exists in this tmx file, what happens to it is
 * determined by the allowDups option. If this is false,
 * the existing resource will be replaced, and if it
 * is true, this new resource will be added as an
 * instance of the existing resource.
 *
 * @param {Resource} res a resource to add
 */
Tmx.prototype.addResource = function(res) {
    if (!res) return;

    if (res.getTargetLocale() === this.sourceLocale || res.getTargetLocale() === "en") {
        // don't add this one... cannot translate TO the source locale!
        return;
    }

    this.ts.add(res);
};

/**
 * Add a set of resources to this tmx file. If a resource
 * with the same file, locale, context, and key already
 * exists in this tmx file, it will be
 * replaced instead of adding this unit to the file.
 *
 * @param {TranslationSet} set a set of resources to add
 */
Tmx.prototype.addSet = function(set) {
    if (!set) return;

    this.ts.addSet(set);
};

/**
 * Get the resources from this tmx file with the
 * given criteria. If the criteria object is undefined or empty,
 * then all resources are returned. If the criteria parameter
 * is an object, then only resources with properties
 * that match the properties and values in the criteria
 * object are returned.
 *
 * @param {Object|undefined} criteria an object with criteria for
 * selecting which resources to retrieve
 * @return {Array.<Resource>} an array of resources that match
 * the given criteria.
 */
Tmx.prototype.getResources = function(criteria) {
    var set = this.getTranslationSet();
    if (!criteria) return set.getAll();
    return set.getBy(criteria);
};

/**
 * Convert a translation unit to a new loctool resource.
 *
 * @param {TranslationUnit} tu the translation to convert
 * @return {Resource} the corresponding resource
 */
Tmx.prototype.convertTransUnit = function(tu) {
    var res;

    switch (tu.resType) {
    default:
        res = ResourceFactory({
            pathName: tu.file,
            project: tu.project,
            id: tu.id,
            key: tu.key,
            sourceLocale: tu.sourceLocale,
            source: tu.source,
            targetLocale: tu.targetLocale,
            context: tu.context,
            comment: tu.comment,
            resType: tu.resType,
            datatype: tu.datatype,
            state: tu.state,
            flavor: tu.flavor
        });

        if (tu.target) {
            res.setTarget(tu.target);
        }
        break;

    case "array":
        var arr = [];
        arr[tu.ordinal] = tu.source;
        res = ResourceFactory({
            pathName: tu.file,
            project: tu.project,
            id: tu.id,
            key: tu.key,
            sourceLocale: tu.sourceLocale,
            sourceArray: arr,
            targetLocale: tu.targetLocale,
            targetArray: [],
            context: tu.context,
            comment: tu.comment,
            resType: tu.resType,
            datatype: tu.datatype,
            state: tu.state,
            flavor: tu.flavor
        });

        if (tu.target) {
            res.addTarget(tu.ordinal, tu.target);
        }
        break;

    case "plural":
        var strings = {};
        strings[tu.quantity] = tu.source;
        res = ResourceFactory({
            pathName: tu.file,
            project: tu.project,
            id: tu.id,
            key: tu.key,
            sourceLocale: tu.sourceLocale,
            sourceStrings: strings,
            targetLocale: tu.targetLocale,
            targetStrings: {},
            context: tu.context,
            comment: tu.comment,
            resType: tu.resType,
            datatype: tu.datatype,
            state: tu.state,
            flavor: tu.flavor
        });

        if (tu.target) {
            res.addTarget(tu.quantity, tu.target);
        }
        break;
    }

    return res;
};

/**
 * Return the translation set containing all of the resources in
 * this tmx file.
 *
 * @returns {TranslationSet} the set of all resources in this file
 */
Tmx.prototype.getTranslationSet = function() {
    // if there are translation units, convert them to
    // resources in a translation set before returning the set.
    var res;

    if (this.tu) {
        for (var j = 0; j < this.tu.length; j++) {
            var comment, tu = this.tu[j];
            switch (tu.resType) {
            default:
                res = this.convertTransUnit(tu);
                this.ts.add(res);
                break;

            case "array":
                var res = this.ts.get(ResourceArray.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
                if (res) {
                    // if it already exists, amend the existing resource instead of creating a new one
                    res.addSource(tu.ordinal, tu.source);
                    if (tu.target) {
                        res.addTarget(tu.ordinal, tu.target);
                    }
                } else {
                    res = this.convertTransUnit(tu);
                    this.ts.add(res);
                }
                break;

            case "plural":
                var res = this.ts.get(ResourcePlural.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
                if (res) {
                    // if it already exists, amend the existing resource instead of creating a new one
                    res.addSource(tu.quantity, tu.source);
                    if (tu.target) {
                        res.addTarget(tu.quantity, tu.target);
                    }
                } else {
                    res = this.convertTransUnit(tu);
                    this.ts.add(res);
                }
                break;
            }
        }

        this.tu = undefined;
    }

    return this.ts;
};

/**
 * Return the number of translation units in this tmx
 * file.
 *
 * @return {number} the number of translation units in this tmx file
 */
Tmx.prototype.size = function() {
    return this.ts.size();
};

/**
 * Return a string that can be used as an HTML attribute value.
 * @param {string} str the string to escape
 * @returns {string} the escaped string
 */
function escapeAttr(str) {
    if (!str) return;
    return str.
        replace(/\n/g, "\\n").
        replace(/&/g, "&amp;").
        replace(/"/g, "&quot;").
        replace(/'/g, "&apos;");
}

/**
 * Return the original string based on the one that was used as an attribute value.
 * @param {string} str the string to unescape
 * @returns {string} the unescaped string
 */
function unescapeAttr(str) {
    if (!str) return;
    return str.
        replace(/\\n/g, "\n").
        replace(/&quot;/g, '"').
        replace(/&apos;/g, "'").
        replace(/&amp;/g, "&");
}

/**
 * Convert a resource into one or more translation units.
 *
 * @private
 * @param {Resource} res the resource to convert
 * @returns {Array.<TranslationUnit>} an array of translation units
 * that represent the resource
 */
Tmx.prototype._convertResource = function(res) {
    var units = [], tu;

    try {
        switch (res.resType) {
        case "string":
            tu = new TranslationUnit({
                project: res.project,
                key: res.getKey(),
                file: res.getPath(),
                sourceLocale: res.getSourceLocale(),
                source: res.getSource(),
                targetLocale: res.getTargetLocale(),
                target: res.getTarget(),
                state: res.getState(),
                id: res.getId(),
                translated: true,
                context: res.context,
                comment: res.comment,
                resType: res.resType,
                datatype: res.datatype,
                flavor: res.getFlavor ? res.getFlavor() : undefined
            });
            units.push(tu);
            break;

        case "array":
            var sarr = res.getSourceArray();
            var tarr = res.getTargetArray();

            tu = new TranslationUnit({
                project: res.project,
                key: res.getKey(),
                file: res.getPath(),
                source: " ",
                sourceLocale: res.getSourceLocale(),
                targetLocale: res.getTargetLocale(),
                state: res.getState(),
                id: res.getId(),
                translated: true,
                context: res.context,
                comment: res.comment,
                resType: res.resType,
                datatype: res.datatype,
                flavor: res.getFlavor ? res.getFlavor() : undefined
            });

            for (var j = 0; j < sarr.length; j++) {
                // only output array items that have a translation
                if (sarr[j]) {
                    var newtu = tu.clone();
                    newtu.source = sarr[j];
                    newtu.ordinal = j;

                    if (tarr && j < tarr.length && tarr[j]) {
                        newtu.target = tarr[j];
                    }

                    newtu.ordinal = j;
                    units.push(newtu);
                } else if (tarr[j]) {
                    logger.warn("Translated array  " + res.getKey() + " has no source string at index " + j + ". Cannot translate. Resource is: " + JSON.stringify(res, undefined, 4));
                }
            }
            break;

        case "plural":
            tu = new TranslationUnit({
                project: res.project,
                key: res.getKey(),
                file: res.getPath(),
                source: " ",
                sourceLocale: res.getSourceLocale(),
                targetLocale: res.getTargetLocale(),
                state: res.getState(),
                id: res.getId(),
                translated: true,
                context: res.context,
                comment: res.comment,
                resType: res.resType,
                datatype: res.datatype,
                flavor: res.getFlavor ? res.getFlavor() : undefined
            });

            var sp = res.getSourcePlurals();
            var tp = res.getTargetPlurals();

            for (var p in sp) {
                if (sp[p]) {
                    var newtu = tu.clone();
                    newtu.source = sp[p];

                    if (tp && tp[p]) {
                        newtu.target = tp[p];
                        newtu.quantity = p;
                    }
                    newtu.quantity = p;
                    units.push(newtu);
                } else {
                    logger.warn("Translated plural  " + res.getKey() + " has no source plural, quantity " + p + ": " + JSON.stringify(res, undefined, 4));
                }
            }
            break;
        }
    } catch (e) {
        logger.warn(e);
        logger.warn(JSON.stringify(res));
        logger.warn("Skipping that resource.");
    }

    return units;
};

/**
 * Convert a resource into translation units.
 *
 * @param {Resource} res the resource to convert
 * @returns {Array.<TranslationUnit>} an array of translation units
 * that represent the resource
 */
Tmx.prototype.convertResource = function(res) {
    return this._convertResource(res);
};

function makeHashKey(res, ordinal, quantity) {
    return [res.getPath(), res.getKey(), res.getContext(), res.getProject(), ordinal, quantity].join("_");
}

function makeTUHashKey(tu) {
    return [tu.file, tu.sourceLocale, tu.targetLocale || "", tu.project].join("_");
}

function versionString(num) {
    parts = ("" + num).split(".");
    integral = parts[0].toString();
    fraction = parts[1] || "0";
    return integral + '.' + fraction;
}

/**
 * Serialize this tmx instance as an tmx 1.2 string.
 * @param {Array.<TranslationUnit>} units an array of units to convert to a string
 * @return {String} the current instance encoded as an tmx 1.2
 * format string
 */
Tmx.prototype.toString1 = function(units) {
    var json = {
        tmx: {
            _attributes: {
                version: versionString(this.version)
            }
        }
    };

    logger.trace("Units to write out is " + JSON.stringify(units, undefined, 4));

    // now finally add each of the units to the json

    var files = {};
    var index = 1;

    for (var i = 0; i < units.length; i++) {
        var tu = units[i];
        if (!tu) {
            console.log("undefined?");
        }
        var hashKey = makeTUHashKey(tu);
        var file = files[hashKey];
        if (!file) {
            files[hashKey] = file = {
                _attributes: {
                    "original": tu.file,
                    "source-language": tu.sourceLocale,
                    "target-language": tu.targetLocale,
                    "product-name": tu.project,
                    "x-flavor": tu.flavor
                }
            };
            if (this["tool-id"] || this["tool-name"] || this["tool-version"] || this["tool-company"] ||  this["company"]) {
                file.header = {
                    "tool": {
                        _attributes: {
                            "creationtool": this["tool-name"],
                            "creationtoolversion": this["tool-version"],
                            "tool-company": this["tool-company"],
                            "copyright": this["copyright"]
                        }
                    }
                };
            }
            file.body = {};
        }

        var tujson = {
            _attributes: {
                "id": (tu.id || index++),
                "resname": escapeAttr(tu.key),
                "restype": tu.resType || "string",
                "datatype": tu.datatype
            },
            "source": {
                "_text": tu.source
            }
        };

        if (tu.id && tu.id > index) {
            index = tu.id + 1;
        }

        if (tu.resType === "plural") {
            tujson._attributes.extype = tu.quantity || "other";
        }
        if (tu.resType === "array") {
            tujson._attributes.extype = tu.ordinal;
        }

        if (tu.target) {
            tujson.target = {
                _attributes: {
                    state: tu.state
                },
                "_text": tu.target
            };
        }
        if (tu.comment) {
            tujson.note = {
                "_text": tu.comment
            };
        }
        if (tu.context) {
            tujson._attributes["x-context"] = tu.context;
        }
        if (!file.body["trans-unit"]) {
            file.body["trans-unit"] = [];
        }

        file.body["trans-unit"].push(tujson);
    }

    // sort the file tags so that they come out in the same order each time
    if (!json.tmx.file) {
        json.tmx.file = [];
    }
    Object.keys(files).sort().forEach(function(fileHashKey) {
        json.tmx.file.push(files[fileHashKey]);
    });

    // logger.trace("json is " + JSON.stringify(json, undefined, 4));

    var xml = '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
        compact: true,
        spaces: 2
    });

    return xml;
};

/**
 * Serialize this tmx instance to a string that contains
 * the tmx format xml text.
 *
 * @param {boolean} untranslated if true, add the untranslated resources
 * to the tmx file without target tags. Otherwiwe, untranslated
 * resources are skipped.
 * @return {String} the current instance encoded as an tmx format
 * xml text
 */
Tmx.prototype.serialize = function(untranslated) {
    var units = [];

    if (this.ts.size() > 0) {
        // first convert the resources into translation units
        var resources = this.ts.getAll();
        var tu;

        if (this.allowDups) {
            // only look at the initial set of resources
            var initialLength = resources.length;
            for (var i = 0; i < initialLength; i++) {
                var res = resources[i];
                var instances = res.getInstances();
                if (instances && instances.length) {
                    resources = resources.concat(instances);
                    resources[i].instances = undefined;
                }
            }
        }
        resources.sort(function(left, right) {
            if (typeof(left.index) === 'number' && typeof(right.index) === 'number') {
                return left.index - right.index;
            }
            if (typeof(left.id) === 'number' && typeof(right.id) === 'number') {
                return left.id - right.id;
            }
            // no ids and no indexes? Well, then don't rearrange
            return 0;
        });

        // now add the translations
        for (var i = 0; i < resources.length; i++) {
            var res = resources[i];
            if (res.getTargetLocale() !== this.sourceLocale) {
                units = units.concat(this.convertResource(res));
            }
        }
    }

    if (this.tu && this.tu.length > 0) {
        units = units.concat(this.tu);
    }

    return this.toString1(units);
};

/**
 * Parse tmx 1.* files
 * @private
 */
Tmx.prototype.parse = function(tmx) {
    if (tmx.file) {
        var files = ilib.isArray(tmx.file) ? tmx.file : [ tmx.file ];
        var comment;

        for (var i = 0; i < files.length; i++) {
            var fileSettings = {};
            var file = files[i];

            fileSettings = {
                pathName: file._attributes.original,
                locale: file._attributes["source-language"],
                project: file._attributes["product-name"] || file._attributes["original"],
                targetLocale: file._attributes["target-language"],
                flavor: file._attributes["x-flavor"]
            };

            fileSettings.isAsianLocale = utils.isAsianLocale(fileSettings.targetLocale);

            if (file.body && file.body["trans-unit"]) {
                var units = ilib.isArray(file.body["trans-unit"]) ? file.body["trans-unit"] : [ file.body["trans-unit"] ];

                units.forEach(function(tu) {
                    if (tu.source && tu.source["_text"] && tu.source["_text"].trim().length > 0) {
                        var targetString;
                        if (tu.target) {
                            if (tu.target["_text"]) {
                                targetString = tu.target["_text"];
                            } else if (tu.target.mrk) {
                                if (ilib.isArray(tu.target.mrk)) {
                                    var targetSegments = tu.target.mrk.map(function(mrk) {
                                        return mrk["_text"];
                                    })
                                    targetString = targetSegments.join(fileSettings.isAsianLocale ? '' : ' ');
                                } else {
                                    targetString = tu.target.mrk["_text"];
                                }
                            }
                        }

                        if (!tu._attributes.resname) {
                            if (tu.source._attributes && tu.source._attributes["x-key"]) {
                                tu.source["_text"] = tu.source._attributes["x-key"];
                                tu._attributes.resname = tu.source._attributes["x-key"];
                            } else {
                                tu._attributes.resname = tu.source["_text"];
                            }
                        }

                        try {
                            var unit = new TranslationUnit({
                                file: fileSettings.pathName,
                                sourceLocale: fileSettings.locale,
                                project: fileSettings.project,
                                id: tu._attributes.id,
                                key: unescapeAttr(tu._attributes.resname),
                                source: tu.source["_text"],
                                context: tu._attributes["x-context"],
                                comment: comment,
                                targetLocale: fileSettings.targetLocale,
                                comment: tu.note && tu.note["_text"],
                                target: targetString,
                                resType: tu._attributes.restype,
                                state: tu.target && tu.target._attributes && tu.target._attributes.state,
                                datatype: tu._attributes.datatype,
                                flavor: fileSettings.flavor
                            });
                            switch (unit.resType) {
                            case "array":
                                unit.ordinal = tu._attributes.extype && Number(tu._attributes.extype).valueOf();
                                break;
                            case "plural":
                                unit.quantity = tu._attributes.extype;
                                break;
                            }
                            this.tu.push(unit);
                        } catch (e) {
                            logger.warn("Skipping invalid translation unit found in tmx file.\n" + e);
                        }
                    } else {
                        logger.warn("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu._attributes.resname);
                    }
                }.bind(this));
            }
        }
    }
};

function makeArray(arrayOrObject) {
    return ilib.isArray(arrayOrObject) ? arrayOrObject : [ arrayOrObject ];
}

/**
 * Deserialize the given string as an xml file in tmx format
 * into this tmx instance. If there are any existing translation
 * units already in this instance, they will be removed first.
 *
 * @param {String} xml the tmx format text to parse
 */
Tmx.prototype.deserialize = function(xml) {
    var json = xmljs.xml2js(xml, {
        trim: false,
        nativeTypeAttribute: true,
        compact: true
    });

    // logger.trace("json is " + JSON.stringify(json, undefined, 4));
    this.ts = new TranslationSet(this.sourceLocale);

    if (json.tmx) {
        if (!json.tmx._attributes ||
                !json.tmx._attributes.version ||
                json.tmx._attributes.version !== "1.4b") {
            logger.error("Unknown tmx version " + json.tmx._attributes.version + ". Cannot continue parsing. Can only parse v1.4b files.");
            return;
        }

        this.parse(json.tmx);
    }

    // logger.trace("this.tu is " + JSON.stringify(this.tu, undefined, 4));

    return this.ts;
};

/**
 * Return the version of this tmx file. If you deserialize a string into this
 * instance of Tmx, the version will be reset to whatever is found inside of
 * the tmx file.
 *
 * @returns {String} the version of this tmx
 */
Tmx.prototype.getVersion = function() {
    return this.version || "1.4b";
};

module.exports = Tmx;
