/*
 * ResourceArray.js - represents an array of strings in a resource file
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

var logger = log4js.getLogger("loctool.lib.ResourceArray");

/**
 * @class A class that models a resource that is an array of strings.
 *
 * Arrays of strings are used in Android apps, as well as some other
 * places, to specify things like the values for a drop-down box in
 * a UI.<p>
 *
 * The properties in the props parameter may be any of the following:
 *
 * <ul>
 * <li><i>key</i> {String} - The unique key of the array resource
 * <li><i>locale</i> {String} - The locale specifier that gives the
 * languages that the array's strings are written in
 * <li><i>pathName</i> {String} - The path to the file that contains
 * this array resource
 * <li><i>context</i> {String} - The context for this resource,
 * such as "landscape mode", or "7200dp", which differentiates it
 * from the base resource that has no special context. The default
 * if this property is not specified is undefined, meaning no
 * context.
 * <li><i>array</i> {Array.&lt;String&gt;} An array of strings
 * that are the value of this resource
 * </ul>
 *
 * @constructor
 * @extends Resource
 * @param {Object} props Any of the properties given above
 */
var ResourceArray = function(props) {
    Resource.call(this, props);

    this.sourceArray = [];
    this.subtype = "string-array";

    if (props) {
        if (props.sourceArray && props.sourceArray.length) {
            // make a deep copy of the array
            this.sourceArray = props.sourceArray.map(function(item) {
                 return new String(item).toString();
            });
        }
        if (props.targetArray && props.targetArray.length) {
            // make a deep copy of the array
            this.targetArray = props.targetArray.map(function(item) {
                 return new String(item).toString();
            });
        }
        if (props.subtype) {
            this.subtype = props.subtype;
        }
    }

    this.locale = this.locale || "en-US";
    this.datatype = this.datatype || "x-android-resource";
    this.resType = ResourceArray.resClass;
};

ResourceArray.prototype = new Resource();
ResourceArray.prototype.parent = Resource;
ResourceArray.prototype.constructor = ResourceArray;

/**
 * The class of this kind of array resource.
 *
 * @static
 * @const
 */
ResourceArray.resClass = "array";

/**
 * Return the array of source strings for this resource.
 *
 * @returns {Array.<String>} the array of strings that are
 * the source of this resource
 */
ResourceArray.prototype.getSourceArray = function() {
    return this.sourceArray;
};

/**
 * Set the array of source strings for this resource.
 *
 * @param {Array.<String>} arr the array of strings to set
 * as the source array
 */
ResourceArray.prototype.setSourceArray = function(arr) {
    if (!arr) return;
    this.sourceArray = arr;
};

/**
 * Return the array of target strings for this resource.
 *
 * @returns {Array.<String>} the array of strings that are
 * the target value of this resource
 */
ResourceArray.prototype.getTargetArray = function() {
    return this.targetArray;
};

/**
 * Set the array of target strings for this resource.
 *
 * @param {Array.<String>} arr the array of strings to set
 * as the target array
 */
ResourceArray.prototype.setTargetArray = function(arr) {
    if (!arr) return;
    this.targetArray = arr;
};

/**
 * Return the source string with the given index into the array.
 *
 * @param {number} i The index of the string being sought
 * @returns {String|undefined} the value of the string at index i or
 * undefined if i is outside the bounds of the array
 */
ResourceArray.prototype.getSource = function(i) {
    return (i >= 0 && i < this.sourceArray.length) ? this.sourceArray[i] : undefined;
};

/**
 * Return the target string with the given index into the array.
 *
 * @param {number} i The index of the string being sought
 * @returns {String|undefined} the value of the string at index i or
 * undefined if i is outside the bounds of the array
 */
ResourceArray.prototype.getTarget = function(i) {
    return (this.targetArray && i >= 0 && i < this.targetArray.length) ? this.targetArray[i] : undefined;
};

/**
 * Add a string to the source array at index i.
 *
 * @param {number} i the index at which to add the string
 * @param {String} str the string to add
 */
ResourceArray.prototype.addSource = function(i, str) {
    if (typeof(i) === "undefined" || i < 0 || typeof(str) === "undefined") {
        return;
    }

    if (!this.sourceArray) {
        this.sourceArray = [];
    }

    this.sourceArray[i] = str;
};

/**
 * Add a string to the target array at index i.
 *
 * @param {number} i the index at which to add the string
 * @param {String} str the string to add
 */
ResourceArray.prototype.addTarget = function(i, str) {
    // can only add a target string if there is already a source string
    if (typeof(i) === "undefined" || i < 0 || typeof(str) === "undefined") {
        return;
    }

    if (!this.targetArray) {
        this.targetArray = [];
    }

    this.targetArray[i] = str;
};

/**
 * Return the length of the array of strings in this resource.
 *
 * @returns {number} the length of the array of strings in this
 * resource
 */
ResourceArray.prototype.size = function() {
    var len = this.sourceArray ? this.sourceArray.length : 0;
    if (this.targetArray) {
        len = Math.max(len, this.targetArray.length);
    }
    return len;
};

/**
 * Generate the pseudo translation of each string in this array and return
 * a new resource array instance with the pseudo translations in it.
 *
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} pseudoBundle the ilib resource bundle that can translate
 * strings to the pseudo locale
 */
ResourceArray.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (!locale || !pseudoBundle || this.dnt) return;

    if (this.subtype === "array") {
        // cannot pseudo-translate arrays, only string arrays
        return;
    }

    logger.trace("generatePseudo: generating pseudo to locale " + locale);
    var array = this.sourceArray.map(function(str, i) {
        return utils.isAndroidResource(str) ? str : pseudoBundle.getStringForResource(this, i);
    }.bind(this));

    logger.trace("generatePseudo: mapped array is " + JSON.stringify(array));
    var r = this.clone();
    r.targetLocale = locale;
    r.targetArray = array;

    return r;
};

/**
 * @private
 * @param connection
 * @param index
 * @param cb
 */
ResourceArray.prototype._writeStrings = function(connection, index, cb) {
    if (!this.sourceArray || index >= this.sourceArray.length) {
        logger.trace("_writeStrings: done writing array");
        cb(null, {affectedRows: this.sourceArray.length});
    } else {
        var string = this.sourceArray[index];

        logger.trace("_writeStrings: writing array[" + index + "] = " + string);
        try {
            connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, ordinal, comment) " +
                    "VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType, :ordinal, :comment)", {
                reskey: this.reskey,
                text: string,
                pathName: this.pathName || null,
                locale: this.getSourceLocale() || null,
                context: this.context || null,
                autoKey: typeof(this.autoKey) === "boolean" ? this.autoKey : false,
                project: this.project || null,
                resType: "array",
                ordinal: index,
                comment: this.comment || null
            }, function(err, id) {
                logger.trace("_writeStrings: err is " + err);

                this._writeStrings(connection, index+1, cb);
            }.bind(this));
        } catch (e) {
            logger.warn("Caught exception");
            logger.warn(e);
            cb("Error writing resource " + this.key);
        }
    }
};

ResourceArray.prototype.getInsertValues = function() {
    var lines = [];
    for (var i = 0; i < this.sourceArray.length; i++) {
        lines.push([
            this.reskey,
            this.sourceArray[i],
            this.pathName,
            this.locale,
            this.context,
            this.autoKey,
            this.project,
            this.resType,
            this.comment,
            i,
            null,
            "new"
        ].map(function(item) {
            return this.escapeText(item);
        }.bind(this)));
    }

    return lines;
};

/**
 * Save the current array resource to the database using the given connection.
 *
 * @param {Connection} connection connection to the database
 * @param {Function} cb Callback function to call when serialization is done
 */
ResourceArray.prototype.serialize = function(connection, cb) {
    logger.trace("serialize: serializing this resource");

    this._writeStrings(connection, 0, cb);
};

/**
 * Clone this resource and override the properties with the given ones.
 *
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourceArray.prototype.clone = function(overrides) {
    var r = new ResourceArray(this);
    if (overrides) {
        for (var p in overrides) {
            r[p] = overrides[p];
        }
    }
    return r;
};

/**
 * Return true if the other resources contains the same resources as
 * the current one. The pathName, state, and comment fields are
 * ignored as minor variations.
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceArray.prototype.equals = function(other) {
    if (!Resource.prototype.equals.call(this, other)) {
        logger.trace("parent returned false");
        return false;
    }

    if (this.sourceArray || other.sourceArray) {
        if (this.sourceArray && other.sourceArray) {
            if (this.sourceArray.length !== other.sourceArray.length) {
                logger.trace("different length source arrays");
                return false;
            }

            for (var i = 0; i < this.sourceArray.length; i++) {
                if (this.sourceArray[i] !== other.array[i]) {
                    logger.trace("differed in source content '" + this.sourceArray[i] + "' !== '" + other.sourceArray[i] + "'");
                    return false;
                }
            }
        } else {
            logger.trace("one has a source array, the other doesn't");
            return false;
        }
    }

    if (this.targetArray || other.targetArray) {
        if (this.targetArray && other.targetArray) {
            if (this.targetArray.length !== other.targetArray.length) {
                logger.trace("different length target arrays");
                return false;
            }

            for (var i = 0; i < this.targetArray.length; i++) {
                if (this.targetArray[i] !== other.targetArray[i]) {
                    logger.trace("differed in target content '" + this.targetArray[i] + "' !== '" + other.targetArray[i] + "'");
                    return false;
                }
            }
        } else {
            logger.trace("one has a target array, the other doesn't");
            return false;
        }
    }

    logger.trace("Both the same");
    return true;
};

/**
 * Return true if the other resource contains the exact same resource as
 * the current one. All fields must match.
 *
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceArray.prototype.equals = function(other) {
    if (!other || !this.same(other) || other.sourceArray.length !== this.sourceArray.length) return false;

    for (var i = 0; i < this.sourceArray.length; i++) {
        if (this.sourceArray[i] !== other.sourceArray[i]) return false;
    }

    if (this.targetArray && this.targetArray.length) {
        // if this is a source-only resource, there will be no target, and that's okay. Just ignore
        // the target for the purposes of this comparison.
        for (var i = 0; i < this.targetArray.length; i++) {
            if (this.targetArray[i] !== other.targetArray[i]) return false;
        }
    }

    return true;
};

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 *
 * @static
 * @return {String} a hash key
 */
ResourceArray.hashKey = function(project, context, locale, reskey) {
    var key = ["ra", project, context, locale, reskey].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.hashKey = function() {
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourceArray.hashKey(this.project, this.context, locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.hashKeyForTranslation = function(locale) {
    return ResourceArray.hashKey(this.project, this.context, locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies this resource, but uses the cleaned version of the string
 *
 *  @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.cleanHashKey = function() {
    var cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourceArray.hashKey(this.project, this.context, locale, cleaned);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourceArray.prototype.cleanHashKeyForTranslation = function(locale) {
    var cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
    return ResourceArray.hashKey(this.project, this.context, locale, cleaned);
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
ResourceArray.prototype.isInstance = function(resource) {
    if (!Resource.prototype.isInstance.call(this, resource)) {
        return false;
    }

    // now check the properties specific to this resource subclass
    return this.sourceArray.every(function(str, i) {
        return utils.cleanString(str) === utils.cleanString(resource.sourceArray[i]);
    }.bind(this));
};

module.exports = ResourceArray;
