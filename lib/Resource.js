/*
 * Resource.js - super class that represents an a resource
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
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
 * <li>locale {String} - the locale of the source string.
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
		this.locale = props.locale;
		this.reskey = props.key || props.reskey;
		this.pathName = props.pathName;
        this.autoKey = typeof(props.autoKey) === "boolean" ? props.autoKey : false;
        this.state = props.state || undefined;
        this.id = props.id; // the database id
        this.formatted = props.formatted; // for Android layout resources
        this.comment = props.comment;
	}
	
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
 * Return the type of this resource. This is one of
 * string, array, or plural.
 * 
 * @returns {String} the type of this string
 */
Resource.prototype.getType = function() {
	return this.resType || "string";
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
 * Return the locale of this resource, or undefined if there
 * is no context or the locale is the same as the project's source locale.
 * @returns {String|undefined} the locale of this resource, or undefined if there
 * is no locale.
 */
Resource.prototype.getLocale = function() {
	return this.locale || "en-US";
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
 * one, or undefine if not. 
 * 
 * @returns {String|undefined} the translator's comment for this resource
 * if the engineer put one in the code
 */
Resource.prototype.getComment = function() {
	return this.comment;
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
 * Return true if the other resource contains the same resource as
 * the current one. The pathName, state, and comment fields are 
 * ignored as minor variations.
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
Resource.prototype.equals = function(other) {
	if (!other) return false;
	
	var props = ["project", "context", "locale", "reskey", "autoKey", "resType"];
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

module.exports = Resource;