/*
 * WordBasedPseudo.js - fix the spelling of a US English string for another locale
 * based on mapping whole words in a table.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var path = require("path");
var Pseudo = require("./Pseudo.js");
var isUpper = require("ilib/lib/isUpper");

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
    this.parent(options);

    if (options) {
        this.type = options.type;

        if (options.pathName) {
            var data = fs.readFileSync((options.pathName[0] !== '/') ? path.join(path.dirname(module.filename), options.pathName) : options.pathName, "utf-8");
            this.spellings = JSON.parse(data);
        }
    }

    this.spellings = this.spellings || {};
};

WordBasedPseudo.prototype = new Pseudo({});
WordBasedPseudo.prototype.parent = Pseudo;
WordBasedPseudo.prototype.constructor = WordBasedPseudo;

/**
 * @private
 * @param {String} word word to check
 * @returns {String|undefined} translated word or undefined if there
 * is no translation
 */
WordBasedPseudo.prototype.getTranslation = function (word) {
    if (!word) return undefined;
    var i, translation = this.spellings[word.toLowerCase()];
    if (translation) {
        // now match the case of the source word
        if (word[0] >= 'A' && word[0] <= 'Z') {
            if (word.length > 1 && word[1] >= 'A' && word[1] <= 'Z') {
                // all caps!
                translation = translation.toUpperCase();
            } else {
                translation = translation[0].toUpperCase() + translation.substring(1);
            }
        }
    }

    return translation;
};

/**
 * Return the input US English string spell-corrected
 * according to the given word mapping table. This only replaces
 * whole words that are spelled differently between the two but
 * which are unambiguous and which have
 * the same meaning. For example, it does not do changes like "sweater"
 * to "jumper" which are different words, because sweater is not
 * unambiguously the same word as "jumper".
 *
 * @param {String} str the string to spell-correct
 * @returns {String} the same string spell-corrected based on the word mapping table
 */
WordBasedPseudo.prototype.getString = function(str) {
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
                } else if (this.type === "ruby" && str.charAt(i) === "%" && i < str.length - 1 && isUpper(str.charAt(i+1))) {
                    ret += str.charAt(i++);
                    while (i < str.length && str.charAt(i) !== '%') {
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
                var translation = this.getTranslation(word);
                if (!translation && i < str.length && str[i] === ".") {
                    // check for possible abbreviations
                    i++;
                    word = str.substring(start, i);
                    translation = this.getTranslation(word);
                }

                ret += (translation || word);
            } else {
                ret += str[i++];
            }
        }
    }
    return ret;
};

/**
 * Return the input US English resource spell-corrected
 * according to the given word mapping. The given selector
 * selects which plural form or which array item to return.
 *
 * @param {Resource} resource the source resource in US English
 * @param {String|Number} selector selects the plural form or array item
 * to pseudolocalize within the resource
 * @returns {String} the same string spell-corrected based on the word mapping table
 */
WordBasedPseudo.prototype.getStringForResource = function(resource, selector) {
    if (!resource) return undefined;

    // if there is a real translation, return it directly
    var translation = this.findTranslationForResource(resource, selector);
    if (translation) {
        return translation;
    }

    // .. else generate the translation based on the source.
    var str = (resource.resType === "plural" || resource.resType === "array") ? resource.getSource(selector) : resource.getSource();

    return this.getString(str);
};

module.exports = WordBasedPseudo;
