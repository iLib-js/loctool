/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var Resource = require("./Resource.js");

/**
 * @class Represents a string resource from a resource file or
 * extracted from the code. The props may contain any
 * of properties from the Resource constructor and additionally,
 * these properties:
 * 
 * <ul>
 * <li>source {String} - the source string associated with this key
 * </ul>
 * 
 * @constructor
 * @extends Resource
 * @param {Object} props properties of the string, as defined above
 */
var ResourceString = function(props) {
	this.parent(props);
	
	if (props) {
		this.text = props.source || props.text;
	}
	
	this.resType = "string";
};

ResourceString.prototype = new Resource();
ResourceString.prototype.parent = Resource;
ResourceString.prototype.constructor = ResourceString;

/**
 * Return the source string written in the source 
 * locale of this resource string.
 * 
 * @returns {String} the source string
 */
Resource.prototype.getSource = function() {
	return this.text;
};

/**
 * Generate the pseudo translation for this string and stick it into
 * the translations for the pseudo locale.
 * 
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} the ilib resource bundle that can translate 
 * strings to the pseudo locale
 */
ResourceString.prototype.generatePseudo = function(locale, pseudoBundle) {
	if (!locale || !pseudoBundle) return;
	
	return new ResourceString({
		project: this.project,
		context: this.context,
		locale: locale,
		key: this.reskey,
		source: pseudoBundle.getStringJS(this.text),
		pathName: this.pathName,
		autoKey: this.autoKey,
		state: "accepted",
		comment: this.comment
	});
};


ResourceString.prototype.save = function(connection, cb) {
	connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType) " +
			"VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType) " +
			"ON DUPLICATE KEY UPDATE text = :text", this, cb);
};

/**
 * Clone this resource and override the properties with the given ones.
 * 
 * @params {Object|undefined} overrides optional properties to override in
 * the cloned object
 * @returns {ResourceArray} a clone of this resource
 */
ResourceString.prototype.clone = function(overrides) {
	var r = new ResourceString(this);
	if (overrides) {
		for (var p in overrides) {
			r[p] = overrides[p];
		}
	}
	return r;
};

module.exports = ResourceString;
    