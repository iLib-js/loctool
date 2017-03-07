/*
 * WordBasedPseudo.js - fix the spelling of a US English string for another locale
 * based on mapping whole words in a table.
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");

function isWordChar(c) {
	return (c >= 'a' && c <= 'z') || 
		(c >= 'A' && c <= 'Z') ||
		c === "-" ||
		c === "'";
}

/**
 * @class A resource bundle-like class to hold the word-based
 * pseudo translation code. This pseudo translates by looking
 * up entire words in a table and mapping them to other words.
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
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
var WordBasedPseudo = function(options) {
	if (options) {
		this.type = options.type;
		
		if (options.pathName) {
			var data = fs.readFileSync(options.pathName, "utf-8");
			this.spellings = JSON.parse(data);
		}
	}
	
	this.spellings = this.spellings || {};
};

/**
 * Return the input US English string spell-corrected to
 * British English. This only replaces whole words that
 * are spelled differently between the two but which have
 * the same meaning. It does not do changes like "sweater"
 * to "jumper" which are different words.
 * 
 * @param {String} str the input string in US English
 * @returns the same string spell-corrected to British English
 */
WordBasedPseudo.prototype.getStringJS = function(str) {
	var ret = "";
	var i = 0;
	
	while (i < str.length) {
		if (this.type !== "text") {
			// for things that are not plain text, skip the replacement parameters
			if (this.type === "html" || this.type === "xml" || this.type === "template") {
				if (str.charAt(i) === '&') {
					ret += str.charAt(i++);
					while (i < str.length && str.charAt(i) !== ';' && str.charAt(i) !== ' ') {
						ret += str.charAt(i++);
					}
				} else if (str.charAt(i) === '\\' && str.charAt(i+1) === "u") {
					ret += str.substring(i, i+6);
					i += 6;
				} else if (str.charAt(i) === '<') {
					ret += str.charAt(i++);
					if (this.type === "template" && str.charAt(i) === "%") {
						ret += str.charAt(i++);
						while (i < str.length && (str.charAt(i) !== '%' || str.charAt(i+1) !== '>')) {
							ret += str.charAt(i++);
						}
					} else {
						while (i < str.length && str.charAt(i) !== '>') {
							ret += str.charAt(i++);
						}
					}
				} 
			} else if (this.type === "ruby" || this.type === "java" || this.type === "javascript") {
				if (str.charAt(i) === "{") {
					ret += str.charAt(i++);
					while (i < str.length && str.charAt(i) !== '}') {
						ret += str.charAt(i++);
					}
				}
			}
		}
		if (i < str.length) { 
			start = i;
			while (isWordChar(str[i]) && i < str.length) {
				i++;
			}
			if (i > start) {
				var word = str.substring(start, i);
				if (this.spellings[word.toLowerCase()]) {
					var translation = this.spellings[word.toLowerCase()];
					// now match the case of the source word
					if (word[0] >= 'A' && word[0] <= 'Z') {
						if ((i - start) > 1 && word[1] >= 'A' && word[1] <= 'Z') {
							// all caps!
							translation = translation.toUpperCase();
						} else {
							translation = translation[0].toUpperCase() + translation.substring(1);
						}
					}
					ret += translation;
				} else {
					ret += word;
				}
			} else {
				ret += str[i++];
			}
		}
	}
	return ret;
};

module.exports = WordBasedPseudo;