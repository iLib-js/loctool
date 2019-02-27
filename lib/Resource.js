/*
 * Resource.js - super class that represents an a resource
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

/**
 * @class Represents a resource from a resource file or
 * extracted from the code. The props may contain any
 * of the following properties:
 *
 * <ul>
 * <li>project {String} - the project that this resource is in
 * <li><i>context</i> {String} - The context for this resource,
 * such as "landscape mode", or "7200dp", which differentiates it
 * from the base resource that has no special context. The default
 * if this property is not specified is undefined, meaning no
 * context.
 * <li>sourceLocale {String} - the locale of the source resource.
 * <li>targetLocale {String} - the locale of the target resource.
 * <li>key {String} - the unique key of this string, which should include the context
 * of the string
 * <li>pathName {String} - pathName to the file where the string was extracted from
 * <li>autoKey {boolean} - true if the key was generated based on the source text
 * <li>state {String} - current state of the resource (ie. "new", "translated", or "accepted")
 * </ul>
 *
 * @constructor
 * @param {Object} props properties of the string, as defined above
 */
var Resource = function(props) {
    this.autoKey = false;

    if (props) {
        this.project = props.project;
        this.context = props.context || undefined; // avoid the empty string
        this.sourceLocale = props.sourceLocale || props.locale;
        this.targetLocale = props.targetLocale;
        this.reskey = props.key || props.reskey;
        this.pathName = props.pathName;
        this.autoKey = typeof(props.autoKey) === "boolean" ? props.autoKey : false;
        this.state = props.state || undefined;
        this.id = props.id; // the database id
        this.formatted = props.formatted; // for Android layout resources
        this.comment = props.comment;
        this.origin = props.origin || "source";
        this.dnt = props.dnt;
        this.datatype = props.datatype;
        this.sourceHash = props.sourceHash;
        this.localize = typeof(props.localize) === "boolean" ? props.localize : true; // some files have resources we do not want to localize/translate
        this.flavor = props.flavor;
        this.index = props.index;
    }

    this.instances = [];
    this.pathName = this.pathName || "";
};

/**
 * Return the project that this resource was found in.
 *
 * @returns {String} the project of this resource
 */
Resource.prototype.getProject = function() {
    return this.project;
};

/**
 * Return the unique key of this resource.
 *
 * @returns {String} the unique key of this resource
 */
Resource.prototype.getKey = function() {
    return this.reskey;
};

/**
 * Return the resource type of this resource. This is one of
 * string, array, or plural.
 *
 * @returns {String} the resource type of this resource
 */
Resource.prototype.getType = function() {
    return this.resType || "string";
};

/**
 * Return the data type of this resource.
 *
 * @returns {String} the data type of this resource
 */
Resource.prototype.getDataType = function() {
    return this.datatype;
};

/**
 * Return true if the key of this resource was automatically generated,
 * and false if it was an explicit key.
 *
 * @returns {boolean} true if the key of this string was auto generated,
 * false otherwise
 */
Resource.prototype.getAutoKey = function() {
    return this.autoKey;
};

/**
 * Return the context of this resource, or undefined if there
 * is no context.
 * @returns {String|undefined} the context of this resource, or undefined if there
 * is no context.
 */
Resource.prototype.getContext = function() {
    return this.context;
};

/**
 * Return the source locale of this resource, or undefined if there
 * is no context or the locale is the same as the project's source locale.
 * @returns {String|undefined} the locale of this resource, or undefined if there
 * is no locale.
 */
Resource.prototype.getSourceLocale = function() {
    return this.sourceLocale || "en-US";
};

/**
 * Set the source locale of this resource.
 * @param {String} locale the source locale of this resource
 */
Resource.prototype.setSourceLocale = function(locale) {
    this.sourceLocale = locale || this.sourceLocale;
};

/**
 * Return the target locale of this resource, or undefined if the resource
 * is a source-only resource.
 * @returns {String|undefined} the locale of this resource, or undefined if there
 * is no locale.
 */
Resource.prototype.getTargetLocale = function() {
    return this.targetLocale;
};

/**
 * Set the target locale of this resource.
 * @param {String} locale the target locale of this resource
 */
Resource.prototype.setTargetLocale = function(locale) {
    this.targetLocale = locale || this.targetLocale;
};

/**
 * Return the state of this resource. This is a string that gives the
 * stage of life of this resource. Currently, it can be one of "new",
 * "translated", or "accepted".
 *
 * @returns {String} the state of this resource
 */
Resource.prototype.getState = function() {
    return this.state;
};

const validStates = {
    "new":true,
    "translated":true,
    "accepted":true
};

/**
 * Set the state of this resource. This is a string that gives the
 * stage of life of this resource. Currently, it can be one of "new",
 * "translated", or "accepted".
 *
 * @parma {String} state the state of this resource
 */
Resource.prototype.setState = function(state) {
    this.state = validStates[state] ? state : this.state;
};

/**
 * Return the original path to the file from which this resource was
 * originally extracted.
 *
 * @returns {String} the path to the file containing this resource
 */
Resource.prototype.getPath = function() {
    return this.pathName;
};

/**
 * Return the translator's comment for this resource if there is
 * one, or undefined if not.
 *
 * @returns {String|undefined} the translator's comment for this resource
 * if the engineer put one in the code
 */
Resource.prototype.getComment = function() {
    return this.comment;
};

/**
 * Set the translator's comment for this resource.
 *
 * @param {String|undefined} comment the translator's comment to set. Use
 * undefined to clear the comment
 */
Resource.prototype.setComment = function(comment) {
    this.comment = comment;
};

/**
 * Return the database id if this resource has previously been saved in the
 * database.
 *
 * @returns {number|undefined} the database id if this resource has previously
 * been saved in the database, or undefined if it is has not
 */
Resource.prototype.getId = function() {
    return this.id;
};

/**
 * Return the origin of this resource. The origin may be either the string
 * "source" or "target". Source origin resources are ones that are extracted
 * from the source code, whereas target ones are translations from the
 * translators.
 *
 * @returns {String} the origin of this resource
 */
Resource.prototype.getOrigin = function() {
    return this.origin;
};

/**
 * Return the localize flag of this resource.
 * This flag indicates whether we should look up a translation for this resource.
 * When false, we should simply substitute the source back
 *
 * @returns {Boolean} the localize flag of this resource
 */
Resource.prototype.getLocalize = function() {
  return this.localize;
};

/**
 * Return the name of the flavor for this resource, or undefined
 * for the "main" or default flavor.
 *
 *  @return {String|undefined} the name of the flavor for this
 *  resource or undefined for the main or default flavor
 */
Resource.prototype.getFlavor = function() {
    return this.flavor;
};

/**
 * Return true if the other resource represents the same resource as
 * the current one. The project, context, locale, key, flavor, and type must
 * match. Other fields such as the pathName, state, and comment fields are
 * ignored as minor variations.
 *
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
Resource.prototype.same = function(other) {
    if (!other) return false;

    var props = ["project", "context", "sourceLocale", "targetLocale", "reskey", "resType", "flavor"];
    for (var i = 0; i < props.length; i++) {
        if (this[props[i]] !== other[props[i]]) {
            return false;
        }
    }

    return true;
};

/**
 * Escape text for writing to a database in a SQL command. This puts single
 * quotes around the string, and makes sure that all single quotes within
 * the string are escaped.
 *
 * @param {Object} str the item to escape
 * @returns {String} the escaped string
 */
Resource.prototype.escapeText = function(str) {
    switch (typeof(str)) {
    case "string":
        // unescape first, then re-escape to make everything consistent
        return "'" + str.replace(/\\'/g, "'").replace(/'/g, "\\'") + "'";
    case "undefined":
        return "NULL";
    case "boolean":
        return str ? "TRUE" : "FALSE";
    default:
        if (str === null) {
            return "NULL";
        }
        return str.toString();
    }
};

var translationImportant = [
    "context",
    "datatype",
    "dnt",
    "flavor",
    "project",
    "reskey",
    "resType",
    "sourceLocale",
    "targetLocale"
];

/**
 * Add an instance of the same resource to the list of
 * instances. If the given resource matches the
 * current instance in all properties that affect the
 * possible translation, and differs from the current
 * instance by some property that does not affect
 * its translation, it will be added as an instance of
 * the same string. The following properties affect the
 * translation:
 *
 * <ul>
 * <li>context</li>
 * <li>datatype</li>
 * <li>dnt</li>
 * <li>flavor</li>
 * <li>project</li>
 * <li>reskey</li>
 * <li>resType</li>
 * <li>source</li>
 * <li>sourceHash</li>
 * <li>sourceArray</li>
 * <li>sourceLocale</li>
 * <li>targetLocale</li>
 * </ul>
 *
 * Differences in other properties, such as "comment" or
 * "origin" are considered instances of the same resource.
 *
 * If this method is given a resource that differs from
 * the current one by one of the above translation affecting
 * properties, it is not added to the list of instances. This
 * can be checked easily by calling the isInstance() method.
 *
 * @param {Resource} an instance of the current resource to
 * record
 * @returns {boolean} true if the instance was added, and
 * and false otherwise
 */
Resource.prototype.addInstance = function(resource) {
    if (!this.isInstance(resource)) {
        return false;
    }
    var unique = this !== resource && this.instances.every(function(res) {
        return res !== resource;
    }.bind(this));
    if (!unique) {
        return false;
    }
    this.instances.push(resource);
    return true;
};

/**
 * Check if the given resource is an instance of the current
 * resource. This method returns true if all properties which
 * affect the possible translation match between the given and
 * the current resource.
 *
 * @param {Resource} a resource to check
 * @returns {boolean} true if this is an instance of
 * the current resource, false otherwise.
 */
Resource.prototype.isInstance = function(resource) {
    if (typeof(resource) !== 'object' || !(resource instanceof Resource)) {
        return false;
    }

    return translationImportant.every(function(prop) {
        return this[prop] === resource[prop];
    }.bind(this));
};

/**
 * Return the list of instances of the current resource.
 *
 * @returns {Array.<Resource>} the list of instances of
 * the current resource
 */
Resource.prototype.getInstances = function() {
    return this.instances;
};

module.exports = Resource;
