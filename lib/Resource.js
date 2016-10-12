/*
 * Resource.js - super class that represents an a resource
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");

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
 * Return the unique key of this resource string.
 * 
 * @returns {String} the unique key of this string
 */
Resource.prototype.getKey = function() {
	return this.reskey;
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
	if (this.locale) return this.locale;
	var project = ProjectFactory.getProject(this.project);
    return (project && project.sourceLocale) || "en-US";
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

module.exports = Resource;