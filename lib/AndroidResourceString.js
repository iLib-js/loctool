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
AndroidResourceString.resClass = "android-resource-string";

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

module.exports = AndroidResourceString;
    