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
 *
 * Options may contain the following properties:
 * - locale: locale of the target string
 * - string: the translation for this variant
 *
 * @param {Object} options
 */
var TranslationVariant = function Tuv(options) {
    this.locale = options.locale;
    this.string = options.string;
};

/**
 * Return a json object that encodes the xml structure of this translation
 * unit variant. This is used to convert to xml below.
 *
 * @returns {Object} a json object which encodes this variant.
 */
TranslationVariant.prototype.serialize = function() {
    return {
        _attributes: {
            "xml:lang": this.locale
        },
        seg: {
            "_text": this.string
        }
    };
};

/**
 * Return a unique hash key for this translation unit variant. The
 * hash key is calculated from the source string and locale.
 *
 * @returns {string} the unique hash key
 */
TranslationVariant.prototype.hashKey = function() {
    return [utils.hashKey(this.string), this.locale].join("_");
};

/**
 * @class Represent a translation unit. A translation unit is
 * a segment in the source language, along with one or
 * more variants, which are translations to various
 * target languages. A translation unit may contain more
 * than one translation for a particular locale, as there
 * are sometimes more than one translation for a particular
 * phrase in the source language, depending on the context.
 *
 * The options may contain the following properties:
 * - locale: source locale for this unit
 * - string: source string in the source language
 * - datatype: the type of data that this string came from
 *
 * @param {Object} options options for this unit
 */ 
var TranslationUnit = function TranslationUnit(options) {
    this.locale = options.locale;
    this.string = options.string;
    this.datatype = options.datatype;

    this.variants = [];
    this.variantHash = {};
    this.properties = {};
};

/**
 * Return a unique hash key for this translation unit. The
 * hash key is calculated from the source string and locale
 * and does not depend on the properties or variants in
 * the unit.
 *
 * @returns {string} the unique hash key
 */
TranslationUnit.prototype.hashKey = function() {
    return [utils.hashKey(this.string), this.locale, this.datatype].join("_");
};

/**
 * Return the list of variants for this translation unit.
 * @returns {Array.<TranslationVariant>} the variants for
 * this translation unit
 */
TranslationUnit.prototype.getVariants = function() {
    return this.variants;
};

/**
 * Add a single variant to this translation unit. This variant
 * is only added if it is unique in this translation unit. That is,
 * No other variant exists in this unit with the same locale and
 * string.
 *
 * @param {TranslationVariant} variant the variant to add
 */
TranslationUnit.prototype.addVariant = function(variant) {
    var key = variant.hashKey();
    if (!this.variantHash[key]) {
        this.variants.push(variant);
        this.variantHash[key] = variant;
    }
}

/**
 * Add an array of variants to this translation unit. This only
 * adds a variant if it is unique. That is, the unit is not
 * added if the locale and string are the same as an existing
 * variant.
 *
 * @param {Array.<TranslationVariant>} variants the array of variants to add
 */
TranslationUnit.prototype.addVariants = function(variants) {
    variants.forEach(function(variant) {
        this.addVariant(variant);
    }.bind(this));
};

/**
 * Return the list of properties and their values for this translation unit.
 * @returns {Object} an object mapping properties to values
 */
TranslationUnit.prototype.getProperties = function() {
    return this.properties;
};

/**
 * Add a property to this translation unit.
 * @param {Object} properties an object that maps properties to values
 */
TranslationUnit.prototype.addProperties = function(properties) {
    for (var p in properties) {
        if (properties[p]) {
            this.properties[p] = properties[p];
        }
    }
};

/**
 * Return a json object that encodes the xml structure of this translation
 * unit. This is used to convert to xml below.
 *
 * @returns {Object} a json object which encodes this unit.
 */
TranslationUnit.prototype.serialize = function() {
    var retval = {
        _attributes: {
            srclang: this.locale
        }
    };
    for (var p in this.properties) {
        if (!retval.prop) retval.prop = [];
        retval.prop.push({
            _attributes: {
                type: p
            },
            _text: this.properties[p]
        });
    }
    retval.tuv = this.variants.map(function(variant) {
        return variant.serialize();
    });
    
    return retval;
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
 * <li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
 * <li><i>version</i> - The version of tmx that will be produced by this instance.
 * <li><i>properties</i> - an object containing general string properties that will appear in the header
 *   of the tmx file. Typical properties are:
 *   <ul>
 *     <li><i>tool-id</i> - the id of the tool that saved this tmx file
 *     <li><i>tool-name</i> - the full name of the tool that saved this tmx file
 *     <li><i>tool-version</i> - the version of the tool that save this tmx file
 *     <li><i>tool-company</i> - the name of the company that made this tool
 *     <li><i>copyright</i> - a copyright notice that you would like included into the tmx file
 *   </ul>
 * </ul>
 *
 * @constructor
 * @param {Array.<Object>|undefined} options options to
 * initialize the file, or undefined for a new empty file
 */
var Tmx = function Tmx(options) {
    this.version = 1.4;

    if (options) {
        this.properties = options.properties;
        this.path = options.path;
        this.sourceLocale = options.sourceLocale;
        if (typeof(options.version) !== 'undefined') {
            this.version = Number.parseFloat(options.version);
        }
    }

    this.sourceLocale = this.sourceLocale || "en-US";

    // place to store the translation units
    this.tu = [];
    this.tuhash = {};
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
 * @param {String} pathName the path to the tmx file
 */
Tmx.prototype.setPath = function(pathName) {
    this.path = pathName;
};

/**
 * Get the string properties of this tmx file from the
 * header.
 * @returns {Object} the string properties of this tmx file
 */
Tmx.prototype.getProperties = function() {
    return this.properties;
};

/**
 * Set a string property of this tmx file.
 * @param {String} property the name of the property to set
 * @param {String} value the value of the property to set
 */
Tmx.prototype.addProperty = function(property, value) {
    this.properties[property] = value;
};

/**
 * Set the string properties of this tmx file.
 * @param {Object} properties the properties to set
 */
Tmx.prototype.setProperties = function(properties) {
    this.path = properties;
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
 * Add this translation unit to this tmx.
 *
 * @param {TranslationUnit} unit the translation unit to add to this tmx
 */
Tmx.prototype.addTranslationUnit = function(unit) {
    logger.trace("Tmx " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));

    var hashKey = unit.hashKey();

    if (this.tuhash[hashKey]) {
        // existing string, so merge in this unit
        var existing = this.tuhash[hashKey];
        existing.addVariants(unit.getVariants());
    } else {
        // new string
        this.tu.push(unit);
        this.tuhash[hashKey] = unit;
    }
};


/**
 * Add translation units to this tmx.
 *
 * @param {Array.<Object>} files the translation units to add to this tmx
 */
Tmx.prototype.addTranslationUnits = function(units) {
    units.forEach(function(unit) {
        this.addTranslationUnit(unit);
    });
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
    if (!res || res.getSourceLocale() !== this.sourceLocale) return;

    var tu;
    var addTarget = res.getTargetLocale() && res.getTargetLocale() !== this.sourceLocale;

    switch (res.getType()) {
        default:
        case "string":
            tu = new TranslationUnit({
                locale: res.getSourceLocale(),
                string: res.getSource(),
                datatype: res.getDataType()
            });
            tu.addVariant(new TranslationVariant({
                locale: res.getSourceLocale(),
                string: res.getSource()
            }));
            if (addTarget) {
                tu.addVariant(new TranslationVariant({
                    locale: res.getTargetLocale(),
                    string: res.getTarget()
                }));
            }
            tu.addProperties({
                "x-context": res.getContext(),
                "x-flavor": res.getFlavor(),
                "x-project": res.getProject()
            });
            this.addTranslationUnit(tu);
            break;

        case "array":
            var srcArr = res.getSourceArray();
            var tarArr = res.getTargetArray();
            srcArr.forEach(function(string, index) {
                tu = new TranslationUnit({
                    locale: res.getSourceLocale(),
                    string: string,
                    datatype: res.getDataType()
                });
                tu.addVariant(new TranslationVariant({
                    locale: res.getSourceLocale(),
                    string: string
                }));
                if (addTarget) {
                    tu.addVariant(new TranslationVariant({
                        locale: res.getTargetLocale(),
                        string: tarArr[index]
                    }));
                }
                tu.addProperties({
                    "x-context": res.getContext(),
                    "x-flavor": res.getFlavor(),
                    "x-project": res.getProject()
                });
                this.addTranslationUnit(tu);
            }.bind(this));
            break;

        case "plural":
            var srcPlurals = res.getSourcePlurals();
            var tarPlurals = res.getTargetPlurals();
            var other;

            for (var category in srcPlurals) {
                tu = new TranslationUnit({
                    locale: res.getSourceLocale(),
                    string: srcPlurals[category],
                    datatype: res.getDataType()
                });
                tu.addVariant(new TranslationVariant({
                    locale: res.getSourceLocale(),
                    string: srcPlurals[category]
                }));
                // The target plurals may not contain a translation
                // for every category that exists in the source
                // plurals because the target language may use less
                // categories than the source language. So, we have
                // to check if the target category exists first before
                // we attempt to add a variant for it.
                if (addTarget && tarPlurals[category]) {
                    tu.addVariant(new TranslationVariant({
                        locale: res.getTargetLocale(),
                        string: tarPlurals[category]
                    }));
                }
                if (category === "other") {
                    other = tu;
                }
                tu.addProperties({
                    "x-context": res.getContext(),
                    "x-flavor": res.getFlavor(),
                    "x-project": res.getProject()
                });
                this.addTranslationUnit(tu);
            }

            // if the target plurals has more categories than
            // the source language, we have to check for those extra
            // categories and add a variant for each of them to the
            // translation unit for the "other" category
            if (addTarget) {
                for (var category in tarPlurals) {
                    if (!srcPlurals[category]) {
                        other.addVariant(new TranslationVariant({
                            locale: res.getTargetLocale(),
                            string: tarPlurals[category]
                        }));
                    }
                }
            }
            break;
    }
};

/**
 * Return the number of translation units in this tmx
 * file.
 *
 * @return {number} the number of translation units in this tmx file
 */
Tmx.prototype.size = function() {
    return this.tu.length;
};

function versionString(num) {
    parts = ("" + num).split(".");
    integral = parts[0].toString();
    fraction = parts[1] || "0";
    return integral + '.' + fraction;
}

/**
 * Serialize this tmx instance to a string that contains
 * the tmx format xml text.
 *
 * @return {String} the current instance encoded as an tmx format
 * xml text
 */
Tmx.prototype.serialize = function() {
    var json = {
        tmx: {
            _attributes: {
                version: versionString(this.version)
            },
            body: {
            }
        }
    };

    // now finally add each of the units to the json

    json.tmx.body.tu = this.tu.map(function(unit) {
        return unit.serialize();
    });

    // logger.trace("json is " + JSON.stringify(json, undefined, 4));

    var xml = '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
        compact: true,
        spaces: 2
    });

    return xml;
};

/**
 * Parse tmx 1.4 files -- not implemented yet
 * @private
 */
Tmx.prototype.parse = function(tmx) {
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

/* not implemented yet
    // logger.trace("json is " + JSON.stringify(json, undefined, 4));
    this.ts = new TranslationSet(this.sourceLocale);

    if (json.tmx) {
        if (!json.tmx._attributes ||
                !json.tmx._attributes.version ||
                json.tmx._attributes.version !== "1.4") {
            logger.error("Unknown tmx version " + json.tmx._attributes.version + ". Cannot continue parsing. Can only parse v1.4b files.");
            return;
        }

        this.parse(json.tmx);
    }

    // logger.trace("this.tu is " + JSON.stringify(this.tu, undefined, 4));

    return this.ts;
*/
};

/**
 * Return the version of this tmx file. If you deserialize a string into this
 * instance of Tmx, the version will be reset to whatever is found inside of
 * the tmx file.
 *
 * @returns {String} the version of this tmx
 */
Tmx.prototype.getVersion = function() {
    return this.version || "1.4";
};


module.exports = Tmx;
