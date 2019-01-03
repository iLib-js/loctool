/*
 * IosLayoutResourceString.js - represents an string in a resource file
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

var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var utils = require("./utils.js");

var logger = log4js.getLogger("loctool.lib.IosLayoutResourceString");

/**
 * @class Represents a string resource extracted from an iOS layout
 * file. The props may contain any
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
var IosLayoutResourceString = function(props) {
    ResourceString.prototype.constructor.call(this, props);
};

IosLayoutResourceString.prototype = new ResourceString();
IosLayoutResourceString.prototype.parent = ResourceString;
IosLayoutResourceString.prototype.constructor = ResourceString;

/**
 * The class of this kind of string resource.
 *
 * @static
 * @const
 */
IosLayoutResourceString.resClass = "string";

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @static
 * @return {String} a hash key
 */
IosLayoutResourceString.hashKey = function(project, locale, pathName, reskey, flavor) {
    var key = ["irs", project, locale, pathName, reskey, flavor].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.hashKey = function() {
    var locale = this.targetLocale && this.target ? this.targetLocale : this.sourceLocale
    return IosLayoutResourceString.hashKey(this.project, locale, this.pathName, this.reskey, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.hashKeyForTranslation = function(locale) {
    return IosLayoutResourceString.hashKey(this.project, locale, this.pathName, this.reskey, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.cleanHashKey = function() {
    var locale = this.targetLocale && this.target ? this.targetLocale : this.sourceLocale;
    return IosLayoutResourceString.hashKey(this.project, locale, this.pathName, this.reskey, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.cleanHashKeyForTranslation = function(locale) {
    return IosLayoutResourceString.hashKey(this.project, locale, this.pathName, this.reskey, this.flavor);
};

/**
 * Clone this resource and override the properties with the given ones.
 *
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {IosLayoutResourceString} a clone of this resource
 */
IosLayoutResourceString.prototype.clone = function(overrides) {
    var r = new IosLayoutResourceString(this);
    if (overrides) {
        for (var p in overrides) {
            r[p] = overrides[p];
        }
    }
    return r;
};

module.exports = IosLayoutResourceString;
