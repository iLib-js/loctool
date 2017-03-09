/*
 * PseudoHant.js - map a Simplified Chinese string into a Traditional one
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

var OpenCC = require("opencc");

/**
 * @class A resource bundle-like class to hold the simplified
 * to tranditional conversion.
 * 
 * 
 * @constructor
 * @param {Object} options options controlling this constructor
 * behaviour of the translation
 */
var PseudoHant = function(options) {
	this.occ = new OpenCC("s2t.json");
	this.set = options.set; // where to get the simplified translations
};

/**
 * Return the name of the locale from which the current pseudo
 * derives its source strings.
 * 
 * @returns {String} the name of the source locale
 */
PseudoHant.prototype.getSourceLocale = function() {
	return "zh-Hans-CN";
};

/**
 * Return true if this type of pseudo should be used to
 * generate a set of resources for the haml localizer.
 * 
 * @return {Boolean} true if the set should be generated,
 * and false if not
 */
PseudoHant.prototype.useWithHamls = function() {
	return true;
};

/**
 * Return a string converted to traditional Chinese.
 * 
 * @param {String} source the source string in simplified Chinese
 * @returns {String} the same string mapped to traditional Chinese
 */
PseudoHant.prototype.getString = function(source) {
	return this.occ.convertSync(source);
};

/**
 * Retrieve the simplified Chinese translation from the repo, and
 * then convert it to traditional.
 * 
 * @param {Resource} resource the resource to get the translation of
 * @param {String|Number} selector selects the plural form or array item 
 * to pseudolocalize
 * @returns {String} the same string translated to traditional Chinese
 */
PseudoHant.prototype.getStringForResource = function(resource, selector) {
	if (!resource) return undefined;
	var simplified = this.set.get(resource.hashKeyForTranslation("zh-Hans-CN")) || resource;
	var source = (resource.resType === "plural" || resource.resType === "array") ? simplified.get(selector) : simplified.text;
	return simplified ? this.occ.convertSync(source) : source;
};

module.exports = PseudoHant;