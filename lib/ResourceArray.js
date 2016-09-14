/*
 * ResourceArray.js - represents an array of strings in a resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var JSUtils = require("ilib/lib/JSUtils.js");
var Set = require("./Set.js");
var ResourceString = require("./ResourceString.js");

/**
 * @class A class that models a resource that is an array of strings.
 * 
 * Arrays of strings are used in Android apps, as well as some other
 * places, to specify things like the values for a drop-down box in 
 * a UI.<p>
 * 
 * The properties in the props parameter may be any of the following:
 * 
 * <ul>
 * <li><i>key</i> {String} - The unique key of the array resource
 * <li><i>locale</i> {String} - The locale specifier that gives the 
 * languages that the array's strings are written in
 * <li><i>pathName</i> {String} - The path to the file that contains
 * this array resource
 * <li><i>context</i> {String} - The context for this resource,
 * such as "landscape mode", or "7200dp", which differentiates it
 * from the base resource that has no special context. The default
 * if this property is not specified is undefined, meaning no
 * context.
 * <li><i>array</i> {Array.&lt;String&gt;} An array of strings
 * that are the value of this resource
 * </ul>
 * 
 * @constructor
 * @param {Object} props Any of the properties given above
 */
var ResourceArray = function(props) {
    this.array = [];
    
    if (props) {
    	this.key = props.key;
    	this.locale = props.locale;
    	this.pathName = props.pathName;
    	this.context = props.context;
    	this.project = props.project;
    	
    	if (props.array && props.array.length) {
    		this.array = props.array.map(function(item) {
    			 return new ResourceString({
    				key: item,
    				source: item,
    				locale: props.locale,
    				pathName: props.pathName
    			});
    		});
    	}
    }
    
	this.locales = new Set();
};

/**
 * Return the unique key of this resource array.
 * 
 * @returns {String} the unique key of this array
 */
ResourceArray.prototype.getKey = function() {
	return this.key;
};

/**
 * Return the context of this resource, or undefined if there
 * is no context.
 * @returns {String|undefined} the context of this resource, or undefined if there
 * is no context.
 */
ResourceArray.prototype.getContext = function() {
    return this.context;
};

/**
 * Return the array of source strings for this resource.
 * 
 * @returns {Array.<String>} the array of strings that are
 * the value of this resource
 */
ResourceArray.prototype.getArray = function() {
	return this.array.map(function(rs) {
	    return rs.getSource();
	});
};

/**
 * Return the source string with the given index into the array.
 * 
 * @param {number} i The index of the string being sought
 * @returns {String} the value of the string at index i
 */
ResourceArray.prototype.get = function(i) {
	return this.array[i] && this.array[i].getSource();
};

ResourceArray.prototype.addString = function(i, str) {
	if (this.array) {
		this.array = [];
	}
	this.array[i] = str;
};

/**
 * Add a translation for the source string at index i. 
 * 
 * @param {number} i The index of the source string being translated
 * @param {String} locale The locale of the translation
 * @param {string} translation The translation of the source string
 * at index i
 */
ResourceArray.prototype.addTranslation = function(i, locale, translation) {
    if (i >= 0 && i < this.array.length && locale) {
        this.array[i].addTranslation(locale, translation);
        this.locales.add(locale);
    }
};

/**
 * Get the translation of the source string at index i to the given 
 * target locale.
 * 
 * @param {number} i The index of the source string for which the 
 * translation is being sought
 * @param {String} locale The locale specifier for the translation
 * being sought
 * @returns {String} The translation of the source string at index i
 * to the given target locale.
 */
ResourceArray.prototype.getTranslation = function(i, locale) {
	return (i >= 0 && i < this.array.length && locale) ? this.array[i].getTranslation(locale) : undefined;
};

/**
 * Return a new resource array where the key is the same as the current
 * resource, and the source is an array of strings populated from
 * the given array.
 * 
 * @param {String} locale The locale of the translation
 * @returns {ResourceArray} A new resource array instance containing
 * the same unique key as the current object, and the translations
 * to the given locale
 */
ResourceArray.prototype.getTranslatedResource = function(locale) {
	//console.log("getTranslatedResource: requesting translation to locale " + locale);
	var array = this.array.map(function(res) {
		return res.getTranslation(locale) || null;
	});
	
	//console.log("getTranslatedResource: premapped array is " + JSON.stringify(this.array));
	//console.log("getTranslatedResource: mapped array is " + JSON.stringify(array));
	return new ResourceArray({
		key: this.key,
		array: array,
		locale: locale,
		pathName: this.pathName,
		context: this.context
	});
};

/**
 * Return an array of locale specifiers for all of the translations
 * of the current source array.
 * 
 * @returns {Array.<string>|undefined} an array of locale specifiers
 * that this source string is translated to
 * or the empty array if there are no translations for this string
 */
ResourceArray.prototype.getTranslationLocales = function(locale) {
	return this.locales.asArray();
};

/**
 * Return the length of the array of strings in this resource.
 * 
 * @returns {number} the length of the array of strings in this
 * resource
 */
ResourceArray.prototype.size = function() {
	return this.array.length;
};

/**
 * Merge the other resource array into the current one. If the other
 * resource array has the same key and the same locale, the source 
 * arrays should be compared. If
 * the sources do not match, then an exception will be thrown to 
 * indicate that there was an error when the arrays were resourcified
 * manually. If the resource arrays have a different locale, then
 * the source array for the other resource will be added as a translation
 * of the current array. It is up to the caller to ensure that
 * the current array represents the source locale.
 * 
 * @param {ResourceString} other the other array resource to merge with the
 * current one
 * @throws exception if the keys do not match, or the keys and locales
 * match, but the source arrays do not
 */
ResourceArray.prototype.merge = function(other) {
    if (!other) return;
    
    if (other.key !== this.key) {
        throw "Mismatched key. Cannot merge";
    } else if (other.context !== this.context) {
        throw "Mismatched context. Cannot merge";
    } else if (other.locale === this.locale) {
        var notsame = false;
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].getSource() !== other.array[i].getSource()) {
                notsame = true;
                break;
            }
        }
        if (notsame) {
            throw "Duplicate resources.";
        } else {
            return;
        }
    }
	if (!(other instanceof ResourceArray)) {
		console.log("Error: attempt to merge something else into an array.");
        throw "Attempt to merge something else into an array.";
	}
	//console.dir(this);
	//console.dir(other);
	for (var i = 0; i < other.array.length; i++) {
		this.array[i].addTranslation(other.locale, other.array[i].getSource());
	}
	this.locales.add(other.locale);
};

/**
 * Generate the pseudo translation of each string in this array and insert
 * them as translations to the given pseudo locale.
 * 
 * @param {String} locale the specifier for the locale to use as the
 * pseudo locale.
 * @param {ResBundle} the ilib resource bundle that can translate 
 * strings to the pseudo locale
 */
ResourceArray.prototype.generatePseudo = function(locale, pseudoBundle) {
    if (!locale || !pseudoBundle) return;
    
	for (var i = 0; i < this.array.length; i++) {
		var source = this.array[i].getSource();
		var pseudo = pseudoBundle.getStringJS(source);
		this.array[i].addTranslation(locale, pseudo);
		// console.log("Array pseudo translation produced: " + source + "=" + pseudo);
	}
	this.locales.add(locale);
};

module.exports = ResourceArray;