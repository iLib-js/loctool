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
 * behaviour of the translation
 */
var PseudoHant = function() {
	this.occ = new OpenCC("s2t.json");
};

/**
 * Return the string parameter mapped to traditional Chinese.
 * Any non-Chinese character is not touched. 
 * 
 * @param {String} str the input string in Simplified Chinese
 * @returns the same string encoded as Traditional Chinese
 */
PseudoHant.prototype.getStringJS = function(str) {
	return this.occ.convertSync(str);
};

module.exports = PseudoHant;