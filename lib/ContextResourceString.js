/*
 * ContextResourceString.js - represents an string in a Android file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var utils = require("./utils.js");

var logger = log4js.getLogger("loctool.lib.ContextResourceString");

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
var ContextResourceString = function(props) {
	ResourceString.prototype.constructor.call(this, props);
};

ContextResourceString.prototype = new ResourceString();
ContextResourceString.prototype.parent = ResourceString;
ContextResourceString.prototype.constructor = ResourceString;

/**
 * The class of this kind of string resource.
 * 
 * @static
 * @const
 */
ContextResourceString.resClass = "string";

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 * 
 * @param {String} project the project of the string
 * @param {String} context the context of the string
 * @param {String} locale the locale of the string
 * @param {String} reskey the key of the string
 * @param {String} datatype the datatype of the string
 * @static
 * @return {String} a hash key
 */
ContextResourceString.hashKey = function(project, context, locale, reskey, datatype) {
	var key = ["crs", project, context, locale, reskey, datatype].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 * 
 *  @return {String} a unique hash key for this resource
 */
ContextResourceString.prototype.hashKey = function() {
	return ContextResourceString.hashKey(this.project, this.context, this.locale, this.reskey, this.datatype);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 * 
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
ContextResourceString.prototype.hashKeyForTranslation = function(locale) {
	return ContextResourceString.hashKey(this.project, this.context, locale, this.reskey, this.datatype);
};

/**
 * Clone this resource and override the properties with the given ones.
 * 
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ContextResourceString} a clone of this resource
 */
ContextResourceString.prototype.clone = function(overrides) {
	var r = new ContextResourceString(this);
	if (overrides) {
		for (var p in overrides) {
			r[p] = overrides[p];
		}
	}
	return r;
};

module.exports = ContextResourceString;
    