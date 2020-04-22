/*
 * SourceContextResourceString.js - represents an string in a qml file
 *
 * Copyright © 2020, JEDLSoft
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

var ResourceString = require("./ResourceString.js");
var utils = require("./utils.js");
var logger = log4js.getLogger("loctool.lib.SourceSourceContextResourceString");

/**
 * @class Represents a string resource extracted from an Android resource
 * or layout file. The props may contain any
 * of properties from the Resource constructor and additionally,
 * these properties:
 *
 * <ul>
 * <li>source {String} - the source string associated with this key
 * </ul>
 *
 * @constructor
 * @extends ResourceString
 * @param {Object} props properties of the string, as defined above
 */
var SourceContextResourceString = function(props) {
    ResourceString.prototype.constructor.call(this, props);
};

SourceContextResourceString.prototype = new ResourceString();
SourceContextResourceString.prototype.parent = ResourceString;
SourceContextResourceString.prototype.constructor = ResourceString;

/**
 * The class of this kind of string resource.
 *
 * @static
 * @const
 */
SourceContextResourceString.resClass = "string";

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @param {String} project the project of the string
 * @param {String} context the context of the string
 * @param {String} locale the locale of the string
 * @param {String} reskey the key of the string
 * @param {String} datatype the datatype of the string
 * @param {String} flavor the flavor of the app that contains this string
 * @param {String} sourcehash the hash value of the source string
 * @static
 * @return {String} a hash key
 */
SourceContextResourceString.hashKey = function(project, context, locale, reskey, datatype, flavor, sourcehash) {
    var key = ["scrs", project, context, locale, reskey, datatype, flavor, sourcehash].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
SourceContextResourceString.prototype.hashKey = function() {
    var locale = this.targetLocale || this.sourceLocale;
    this.sourcehash = utils.hashKey(this.source);
    return SourceContextResourceString.hashKey(this.project, this.context, locale, this.reskey, this.datatype, this.flavor, this.sourcehash);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
SourceContextResourceString.prototype.hashKeyForTranslation = function(locale) {
    return SourceContextResourceString.hashKey(this.project, this.context, locale, this.reskey, this.datatype, this.flavor, this.sourcehash);
};

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @param {String} project the project of the string
 * @param {String} locale the locale of the string
 * @param {String} reskey the key of the string
 * @param {String} datatype the datatype of the string
 * @static
 * @return {String} a hash key
 */
SourceContextResourceString.cleanHashKey = function(project, context, locale, reskey, datatype, flavor, sourcehash) {
    // reskey does not need cleaning for context strings
    return SourceContextResourceString.hashKey(project, context, locale, reskey, datatype, flavor, sourcehash);
};

/**
 * Return the a hash key that uniquely identifies this resource, but cleaned
 *
 *  @return {String} a unique hash key for this resource, but cleaned
 */
SourceContextResourceString.prototype.cleanHashKey = function() {
    var locale = this.targetLocale || this.sourceLocale;
    this.sourcehash = utils.hashKey(this.source);
    return SourceContextResourceString.cleanHashKey(this.project, this.context, locale, this.reskey, this.datatype, this.flavor, this.sourcehash);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale, but cleaned
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource's string
 */
SourceContextResourceString.prototype.cleanHashKeyForTranslation = function(locale) {
    return SourceContextResourceString.cleanHashKey(this.project, this.context, locale, this.reskey, this.datatype, this.flavor, this.sourcehash);
};

/**
 * Clone this resource and override the properties with the given ones.
 *
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {SourceContextResourceString} a clone of this resource
 */
SourceContextResourceString.prototype.clone = function(overrides) {
    var r = new SourceContextResourceString(this);
    if (overrides) {
        for (var p in overrides) {
            r[p] = overrides[p];
        }
    }
    return r;
};

module.exports = SourceContextResourceString;