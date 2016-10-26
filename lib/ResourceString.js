/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var Resource = require("./Resource.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.ResourceString");

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
ResourceString.prototype.getSource = function() {
	return this.text;
};

/**
 * Return the number of strings in this resource.
 * 
 * @returns {number} the number of strings in this resource
 */
ResourceString.prototype.size = function() {
	return 1;
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
		source: this.text.substring(0, 8) === "@string/" ? this.text : pseudoBundle.getStringJS(this.text, undefined, "xml"),
		pathName: this.pathName,
		autoKey: this.autoKey,
		state: "accepted",
		comment: this.comment,
		formatted: this.formatted
	});
};

ResourceString.prototype.serialize = function(connection, cb) {
	logger.trace("Resource is serializing itself");
	if (this.id) {
		// already exists, so just update the existing record
		connection.execute("UPDATE Resources SET text=:text WHERE id=:id", this, cb);
	} else {
		connection.execute("INSERT INTO Resources (reskey, text, pathName, locale, context, autoKey, project, resType) " +
				"VALUES (:reskey, :text, :pathName, :locale, :context, :autoKey, :project, :resType) " +
				"ON DUPLICATE KEY UPDATE text = :text", this, cb);
	}
};

ResourceString.prototype.getInsertValues = function() {
	return [[
		this.reskey,
		this.text,
		this.pathName, 
		this.locale,
		this.context,
		this.autoKey,
		this.project,
		this.resType,
		this.comment,
		null,
		null,
		"new"
	].map(function(item) {
		return this.escapeText(item);
	}.bind(this))];
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

/**
 * Return true if the other resource contains the exact same resource as
 * the current one. All fields must match.
 * 
 * @param {Resource} other another resource to test against the current one
 * @returns {boolean} true if these represent the same resource, false otherwise
 */
ResourceString.prototype.equals = function(other) {
	if (!other || !this.same(other)) return false;

	return this.text === other.text;
};

module.exports = ResourceString;
    