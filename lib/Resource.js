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
        this.context = props.context;
		this.locale = props.locale;
		this.reskey = props.key || props.reskey;
		this.pathName = props.pathName;
        this.autoKey = props.autoKey;
        this.state = props.state;
	}
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

module.exports = Resource;