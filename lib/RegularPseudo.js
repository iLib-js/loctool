/*
 * RegularPseudo.js - pseudo localize a US English string using
 * ilib's pseudolocalization routines
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var ilib = require("ilib");
var ResBundle = require("ilib/lib/ResBundle");

/**
 * @class A resource bundle-like class to hold the regular
 * pseudolocalization.
 * 
 * <li><i>type</i> - The type of the file being processed 
 * which controls what things are skipped when 
 * pseudo-localizing. Valid values are: "html", "template",
 * "xml", "ruby", "java", "javascript", "text"
 * </ul>
 * 
 * @constructor
 * @param {Object} options options that control the
 * behaviour of the translation
 */
var RegularPseudo = function(options) {
	this.type = options && options.type;
	
	// zxx is the language "unspecified" and XX is the region "unknown", which
	// ilib uses for pseudo localization
	this.pseudoBundle = new ResBundle({
    	type: options.type || "text",
		locale: "zxx-XX",
		lengthen: true
	});
};

/**
 * Return the name of the locale from which the current pseudo
 * derives its source strings.
 * 
 * @returns {String} the name of the source locale
 */
RegularPseudo.prototype.getSourceLocale = function() {
	return "en-US";
};

/**
 * Return true if this type of pseudo should be used to
 * generate a set of resources for the haml localizer.
 * 
 * @return {Boolean} true if the set should be generated,
 * and false if not
 */
RegularPseudo.prototype.useWithHamls = function() {
	return false;
};

/**
 * Return a string converted to traditional Chinese.
 * 
 * @param {String} source the source string in simplified
 * Chinese
 * @returns {String} the same string mapped to traditional
 * Chinese
 */
RegularPseudo.prototype.getString = function(source) {
	return this.pseudoBundle.getStringJS(source);
};

/**
 * Return the input US English string 
 * 
 * @param {Resource} resource the source resource in US English
 * @param {String|Number} selector selects the plural form or array item 
 * to pseudolocalize
 * @returns the same string pseudolocalized
 */
RegularPseudo.prototype.getStringForResource = function(resource, selector) {
	var str = (resource.resType === "plural" || resource.resType === "array") ? resource.get(selector) : resource.text;
	return this.pseudoBundle.getStringJS(str);
};

module.exports = RegularPseudo;