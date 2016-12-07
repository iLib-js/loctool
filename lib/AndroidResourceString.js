/*
 * AndroidResourceString.js - represents an string in a Android file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var utils = require("./utils.js");

var logger = log4js.getLogger("loctool.lib.AndroidResourceString");

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
var AndroidResourceString = function(props) {
	ResourceString.prototype.constructor.call(this, props);
};

AndroidResourceString.prototype = new ResourceString();
AndroidResourceString.prototype.parent = ResourceString;
AndroidResourceString.prototype.constructor = ResourceString;

/**
 * The class of this kind of string resource.
 * 
 * @static
 * @const
 */
AndroidResourceString.resClass = "string";

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 * 
 * @static
 * @return {String} a hash key
 */
AndroidResourceString.hashKey = function(project, context, locale, reskey) {
	var key = ["ars", project, context, locale, reskey].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 * 
 *  @return {String} a unique hash key for this resource
 */
AndroidResourceString.prototype.hashKey = function() {
	return AndroidResourceString.hashKey(this.project, this.context, this.locale, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 * 
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
AndroidResourceString.prototype.hashKeyForTranslation = function(locale) {
	return AndroidResourceString.hashKey(this.project, this.context, locale, this.reskey);
};

/**
 * Clone this resource and override the properties with the given ones.
 * 
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {AndroidResourceString} a clone of this resource
 */
AndroidResourceString.prototype.clone = function(overrides) {
	var r = new AndroidResourceString(this);
	if (overrides) {
		for (var p in overrides) {
			r[p] = overrides[p];
		}
	}
	return r;
};

module.exports = AndroidResourceString;
    