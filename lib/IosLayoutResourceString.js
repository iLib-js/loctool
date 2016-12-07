/*
 * IosLayoutResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
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
IosLayoutResourceString.resClass = "ios-string";

/**
 * Calculate a resource key string for this class of resource given the
 * parameters.
 * 
 * @static
 * @return {String} a hash key
 */
IosLayoutResourceString.hashKey = function(project, locale, pathName, reskey) {
	var key = ["irs", project, locale, pathName, reskey].join("_");
	logger.trace("Hashkey is " + key);
	return key;
};

/**
 * Return the a hash key that uniquely identifies this resource.
 * 
 *  @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.hashKey = function() {
	return IosLayoutResourceString.hashKey(this.project, this.locale, this.pathName, this.reskey);
};

/**
 * Return the a hash key that uniquely identifies the translation of
 * this resource to the given locale.
 * 
 * @param {String} locale a locale spec of the desired translation
 * @return {String} a unique hash key for this resource
 */
IosLayoutResourceString.prototype.hashKeyForTranslation = function(locale) {
	return IosLayoutResourceString.hashKey(this.project, locale, this.pathName, this.reskey);
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
    