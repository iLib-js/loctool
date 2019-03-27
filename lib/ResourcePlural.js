/*
 * ResourcePlural.js - represents an array of plural strings in a resource file
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

var logger = log4js.getLogger("loctool.lib.ResourcePlural");

/**
 * @class A class that models a resource that handles translations of
 * plurals.
 *
 * Hashes of strings are used in Android apps to specify translations
 * of the various categories of plurals.<p>
 *
 * The props may contain any
 * of properties from the Resource constructor and additionally,
 * these properties:
 *
 * <ul>
 * <li><i>strings</i> {Object} A hash of strings that map the categories
 * to translations.
 * </ul>
 *
 * The properties of the strings hash can be any of the categories supported
 * by the Unicode CLDR data:
 *
 * <ul>
 * <li>zero
 * <li>one
 * <li>two
 * <li>few
 * <li>many
 * </ul>
 *
 * @constructor
 * @extends Resource
 * @param {Object} props Any of the properties given above
 */
var ResourcePlural = function(props) {
    this.parent(props);

    this.sourceStrings = {};

    // deep copy this so that the props can have a different set of
    // plural forms than this instance
    if (props) {
        var strings = props.sourceStrings || props.strings;
        if (strings) {
            for (var p in strings) {
                this.sourceStrings[p] = strings[p];
            }
        }

        if (props.targetStrings) {
            this.targetStrings = {};
            for (var p in props.targetStrings) {
                this.targetStrings[p] = props.targetStrings[p];
            }
        }
    }

    this.datatype = this.datatype || "x-android-resource";
    this.resType = ResourcePlural.resClass;
};

ResourcePlural.prototype = new Resource();
ResourcePlural.prototype.parent = Resource;
ResourcePlural.prototype.constructor = ResourcePlural;

/**
 * The class of this kind of string plural.
 *
 * @static
 * @const
 */
ResourcePlural.resClass = "plural";

/**
 * Acceptable values for plural categories
 *
 * @static
 * @const
 */
 ResourcePlural.validPluralCategories = ['zero', 'one', 'two', 'few', 'many', 'other'];

/**
 * Return the source plurals hash of this plurals resource.
 *
 * @returns {Object} the source hash
 */
ResourcePlural.prototype.getSourcePlurals = function() {
    return this.sourceStrings;
};

/**
 * Return the target plurals hash of this plurals resource.
 *
 * @returns {Object} the target hash
 */
ResourcePlural.prototype.getTargetPlurals = function() {
    return this.targetStrings;
};

/**
 * Set the source plurals hash of this plurals resource.
 *
 * @param {Object} plurals the source hash
 */
ResourcePlural.prototype.setSourcePlurals = function(plurals) {
    this.sourceStrings = plurals;
};

/**
 * Set the target plurals hash of this plurals resource.
 *
 * @param {Object} plurals the target hash
 */
ResourcePlural.prototype.setTargetPlurals = function(plurals) {
    this.targetStrings = plurals;
};

/**
 * Return the source string of the given plural category.
 *
 * @returns {String} the source string for the given
 * plural category
 */
ResourcePlural.prototype.getSource = function(pluralClass) {
    return this.sourceStrings && this.sourceStrings[pluralClass];
};

/**
 * Return the target string of the given plural category.
 *
 * @returns {String} the target string for the given
 * plural category
 */
ResourcePlural.prototype.getTarget = function(pluralClass) {
    return this.targetStrings && this.targetStrings[pluralClass];
};

/**
 * Return an array of names of source categories of plurals
 * that are used in this resource.
 *
 * @deprecated Use getCategories instead
 *
 * @returns {Array.<string>} an array of source categories
 */
ResourcePlural.prototype.getClasses = function() {
    return this.getCategories();
};

/**
 * Return an array of names of source categories of plurals
 * that are used in this resource.
 *
 * @returns {Array.<string>} an array of source categories
 */
ResourcePlural.prototype.getCategories = function() {
    return this.sourceStrings && Object.keys(this.sourceStrings);
};

/**
 * Return an array of names of all possible categories
 * of plurals, even if they are not currently used in this
 * plural instance.
 *
 * @returns {Array.<string>} an array of category names
 */
ResourcePlural.prototype.getAllValidCategories = function() {
    return ResourcePlural.validPluralCategories;
};

/**
 * Add a string with the given plural category to the source of
 * this plural resource.
 *
 * @param {String} pluralCategory the CLDR category of this string
 * @param {String} str the source string to add for the category
 */
ResourcePlural.prototype.addSource = function(pluralCategory, str) {
    logger.trace("Adding string '" + str + "' with category " + pluralCategory);
    if (!pluralCategory || !str) return;
    if (!this.sourceStrings) {
        this.sourceStrings = {};
    }
    this.sourceStrings[pluralCategory] = str;
};

/**
 * Add a string with the given plural category to the target of
 * this plural resource.
 *
 * @param {String} pluralCategory the CLDR category of this string
 * @param {String} str the target string to add for the category
 */
ResourcePlural.prototype.addTarget = function(pluralCategory, str) {
    logger.trace("Adding string '" + str + "' with category " + pluralCategory);
    // have to have a source plural string in order to add the target
    if (!pluralCategory || !str || !this.sourceStrings) return;
    if (!this.targetStrings) {
        this.targetStrings = {};
    }
    this.targetStrings[pluralCategory] = str;
};

/**
 * Return the length of the array of strings in this resource.
 *
 * @returns {number} the length of the array of strings in this
 * resource
 */
ResourcePlural.prototype.size = function() {
    var len = this.sourceStrings ? Object.keys(this.sourceStrings).length : 0;
    if (this.targetStrings) {
        len = Math.max(len, Object.keys(this.targetStrings).length);
    }
    return len;
};

/**
 * Generate the pseudo translations for the given locale and add
 * them to the current resource.
 *
 * @param {String} locale the locale to generate the pseudotranslations in to
 * @param {ResBundle} the ilib resource bundle that can generate pseudotranslations
 */
ResourcePlural.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (!locale || !pseudoBundle || this.dnt) return;

    var pseudoStrings = {};

    logger.trace("generatePseudo: generating pseudo to locale " + locale);
    for (var pluralCategory in this.sourceStrings) {
        pseudoStrings[pluralCategory] = utils.isAndroidResource(this.sourceStrings[pluralCategory]) ? this.sourceStrings[pluralCategory] : pseudoBundle.getStringForResource(this, pluralCategory);
    }

    logger.trace("generatePseudo: mapped plurals is " + JSON.stringify(pseudoStrings));
    var r = this.clone();
    r.targetLocale = locale;
    r.targetStrings = pseudoStrings;
    r.origin = "target";

    return r;
};

ResourcePlural.prototype._writeClass = function(connection, categories, cb) {
    if (categories.length === 0) {
        cb(null, {affectedRows: Object.keys(this.sourceStrings).length});
    } else {
        var pluralCategory = categories[0];

        connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType, pluralCategory) " +
                "VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType, :pluralCategory) " +
                "ON DUPLICATE KEY UPDATE text = :text", {
            reskey: this.reskey,
            text: this.sourceStrings[pluralCategory],
            pathName: this.pathName,
            locale: this.locale,
            context: this.context,
            autoKey: this.autoKey,
            project: this.project,
            resType: "plural",
            pluralClass: pluralCategory
        }, function(err, id) {
            this._writeClass(connection, categories.slice(1), cb);
        }.bind(this));
    }
};

ResourcePlural.prototype.getInsertValues = function() {
    var lines = [];
    for (var quantity in this.sourceStrings) {
        lines.push([
            this.reskey,
            this.sourceStrings[quantity],
            this.pathName,
            this.locale,
            this.context,
            this.autoKey,
            this.project,
            this.resType,
            this.comment,
            null,
            quantity,
            "new"
        ].map(function(item) {
            return this.escapeText(item);
        }.bind(this)));
    }

    return lines;
};

ResourcePlural.prototype.serialize = function(connection, cb) {
    if (this.sourceStrings) {
        this._writeClass(connection, Object.keys(this.sourceStrings), cb);
    } else {
        cb(null, {affectedRows: 0});
    }
};

/**
 * Clone this resource and override the properties with the given ones.
 *
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourcePlural.prototype.clone = function(overrides) {
    var r = new ResourcePlural(this);
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
ResourcePlural.prototype.equals = function(other) {
    if (!other || !this.same(other)) return false;

    if (this.sourceStrings || other.sourceStrings) {
        if (this.sourceStrings && other.sourceStrings) {
            for (var p in this.sourceStrings) {
                if (this.sourceStrings[p] !== other.sourceStrings[p]) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    if (this.targetStrings || other.targetStrings) {
        if (this.targetStrings && other.targetStrings) {
            for (var p in this.targetStrings) {
                if (this.targetStrings[p] !== other.targetStrings[p]) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    return true;
};

/**
 * Calculate a resource key string for this category of resource given the
 * parameters.
 *
 * @static
 * @return {String} a hash key
 */
ResourcePlural.hashKey = function(project, context, locale, reskey) {
    var key = ["rp", project, context, locale, reskey].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.hashKey = function() {
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourcePlural.hashKey(this.project, this.context, locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.hashKeyForTranslation = function(locale) {
    return ResourcePlural.hashKey(this.project, this.context, locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies this resource.
 *
 *  @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.cleanHashKey = function() {
    var cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
    var locale = this.targetLocale || this.getSourceLocale();
    return ResourcePlural.hashKey(this.project, this.context, locale, cleaned);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 *
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ResourcePlural.prototype.cleanhashKeyForTranslation = function(locale) {
    var cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
    return ResourcePlural.hashKey(this.project, this.context, locale, cleaned);
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
ResourcePlural.prototype.isInstance = function(resource) {
    if (!Resource.prototype.isInstance.call(this, resource)) {
        return false;
    }

    // now check the properties specific to this resource subclass
    return Object.keys(this.sourceStrings).every(function(prop) {
        return utils.cleanString(this.sourceStrings[prop]) === utils.cleanString(resource.sourceStrings[prop]);
    }.bind(this));
};

module.exports = ResourcePlural;
