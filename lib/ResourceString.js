/*
 * ResourceString.js - represents an string in a resource file
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

var log4js = require("log4js");

var Resource = require("./Resource.js");
var utils = require("./utils.js");

var logger = log4js.getLogger("loctool.lib.ResourceString");

/**
 * @class Represents a string resource from a resource file or
 * extracted from the code. The props may contain any
 * of properties from the Resource constructor and additionally,
 * these properties:
 *
 * <ul>
 * <li>source {String} - the source string associated with this key
 * </ul>
 *
 * @constructor
 * @extends Resource
 * @param {Object} props properties of the string, as defined above
 */
var ResourceString = function(props) {
    Resource.prototype.constructor.call(this, props);

    if (props) {
        this.source = props.source || props.text;
        this.target = props.target;
    }

    this.origin = this.origin || "source";
    this.datatype = this.datatype || "plaintext";
    this.resType = ResourceString.resClass;
    this.sourceLocale = this.sourceLocale || this.project && this.project.sourceLocale || "en-US";
};

ResourceString.prototype = new Resource();
ResourceString.prototype.parent = Resource;
ResourceString.prototype.constructor = ResourceString;

/**
 * The class of this kind of string resource.
 *
 * @static
 * @const
 */
ResourceString.resClass = "string";

/**
 * Return the source string written in the source
 * locale of this resource string.
 *
 * @returns {String} the source string
 */
ResourceString.prototype.getSource = function() {
    return this.source;
};

/**
 * Set the source string written in the source
 * locale of this resource string.
 *
 * @param {String} str the source string
 */
ResourceString.prototype.setSource = function(str) {
    this.source = str;
};

/**
 * Return the string written in the target locale.
 *
 * @returns {String} the source string
 */
ResourceString.prototype.getTarget = function() {
    return this.target;
};

/**
 * Set the target string of this resource.
 *
 * @param {String} str the target string
 */
ResourceString.prototype.setTarget = function(str) {
    this.target = str;
};

/**
 * Return the number of strings in this resource.
 *
 * @returns {number} the number of strings in this resource
 */
ResourceString.prototype.size = function() {
    return 1;
};

/**
 * Generate the pseudo translation for this string and stick it into
 * the translations for the pseudo locale.
 *
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} pseudoBundle the ilib resource bundle that can translate
 * strings to the pseudo locale
 */
ResourceString.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (!locale || !pseudoBundle) return;

    var r = this.clone();
    if (this.dnt) {
        r.targetLocale = locale;
        r.target = r.source;
    } else {
        r.targetLocale = locale;
        r.target = utils.isAndroidResource(this.source) ? this.source : pseudoBundle.getStringForResource(this);
    }
    return r;
};

ResourceString.prototype.serialize = function(connection, cb) {
    logger.trace("Resource is serializing itself");
    if (this.id) {
        // already exists, so just update the existing record
        connection.execute("UPDATE Resources SET text=:text WHERE id=:id", this, cb);
    } else {
        connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType) " +
                "VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType) " +
                "ON DUPLICATE KEY UPDATE text = :text", this, cb);
    }
};

ResourceString.prototype.getInsertValues = function() {
    return [[
        this.reskey,
        this.source,
        this.pathName,
        this.locale,
        this.context,
        this.autoKey,
        this.project,
        this.resType,
        this.comment,
        null,
        null,
        "new"
    ].map(function(item) {
        return this.escapeText(item);
    }.bind(this))];
};

/**
 * Clone this resource and override the properties with the given ones.
 *
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourceString.prototype.clone = function(overrides) {
    var r = new ResourceString(this);
    if (overrides) {
        for (var p in overrides) {
            r[p] = overrides[p];
        }
    }
    return r;
};

/**
 * Return true if the other resource contains the exact same resource as
 * the current one. All fields must match.
 *
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceString.prototype.equals = function(other) {
    if (!other || !this.same(other)) return false;

    return this.source === other.source;
};

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @param {String} project the project of the string
 * @param {String} locale the locale of the string
 * @param {String} reskey the key of the string
 * @param {String} datatype the datatype of the string
 * @param {String} flavor the flavor of the string
 * @static
 * @return {String} a hash key
 */
ResourceString.hashKey = function(project, locale, reskey, datatype, flavor) {
    var key = ["rs", project, locale, reskey, datatype, flavor].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @param {String} project the project of the string
 * @param {String} locale the locale of the string
 * @param {String} reskey the key of the string
 * @param {String} datatype the datatype of the string
 * @param {String} flavor the flavor of the string
 * @static
 * @return {String} a hash key
 */
ResourceString.cleanHashKey = function(project, locale, reskey, datatype, flavor) {
    var cleaned = reskey && reskey.replace(/\s+/g, " ").trim() || "";
    var key = ["rs", project, locale, cleaned, datatype, flavor].join("_");
    logger.trace("CleanHashkey is " + key);
    return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
ResourceString.prototype.hashKey = function() {
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourceString.hashKey(this.project, locale, this.reskey, this.datatype, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourceString.prototype.hashKeyForTranslation = function(locale) {
    return ResourceString.hashKey(this.project, locale, this.reskey, this.datatype, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies this resource, but cleaned
 *
 *  @return {String} a unique hash key for this resource, but cleaned
 */
ResourceString.prototype.cleanHashKey = function() {
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourceString.cleanHashKey(this.project, locale, this.reskey, this.datatype, this.flavor);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale, but cleaned
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource's string
 */
ResourceString.prototype.cleanHashKeyForTranslation = function(locale) {
    return ResourceString.cleanHashKey(this.project, locale, this.reskey, this.datatype, this.flavor);
};

/**
 * Check if the given resource is an instance of the current
 * resource.
 *
 * @override
 * @param {Resource} a resource to check
 * @returns {boolean} true if this is an instance of
 * the current resource, false otherwise.
 */
ResourceString.prototype.isInstance = function(resource) {
    if (!Resource.prototype.isInstance.call(this, resource)) {
        return false;
    }

    // now check the properties specific to this resource subclass
    return utils.cleanString(this.source) === utils.cleanString(resource.source);
};

module.exports = ResourceString;
