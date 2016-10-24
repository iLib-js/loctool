/*
 * TranslationUnit.js - model an xliff file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

/**
 * @class A class that represents an translation unit in an
 * xliff 1.2 file. The options may be undefined, which represents 
 * a new, clean TranslationUnit instance. The options object may also 
 * be an object with the following properties:
 * 
 * <ul>
 * <li><i>source</i> - source text for this unit (required)
 * <li><i>sourceLocale</i> - the source locale spec for this unit (required)
 * <li><i>targetLocale</i> - the target locale spec for this unit (required)
 * <li><i>key</i> - the unique resource key for this translation unit (required)
 * <li><i>file</i> - path to the original source code file that contains the 
 * source text of this translation unit (required)
 * <li><i>project</i> - the project that this string/unit is part of
 * <li><i>target</i> - the target text for this unit (optional)
 * <li><i>resType</i> - type of this resource (string, array, plural) (optional)
 * <li><i>state</i> - the state of the current unit (optional)
 * <li><i>comment</i> - the translator's comment for this unit (optional)
 * </ul>
 * 
 * If the required properties are not given, the constructor throws an exception.<p>
 * 
 * For newly extracted strings, there is no target text yet. There must be a target 
 * locale for the translators to use when creating new target text, however. This
 * means that there may be multiple translation units in a file with the same
 * source locale and no target text, but different target locales.
 * 
 * @constructor
 * @param {Object|undefined} options options to 
 * initialize the unit, or undefined for a new empty unit
 */
var TranslationUnit = function TranslationUnit(options) {
	if (options) {
		var everything = ["source", "sourceLocale", "targetLocale", "key", "file", "project"].every(function(p) {
			return typeof(options[p]) !== "undefined";
		});
		
		if (!everything) {
			throw "Missing required parameters in the TranslationUnit constructor";
		}
		
		for (var p in options) {
			this[p] = options[p];
		}
	}
};

module.exports = TranslationUnit;