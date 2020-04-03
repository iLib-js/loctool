/*
 * RegularPseudo.js - pseudo localize a US English string using
 * ilib's pseudolocalization routines
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

var ilib = require("ilib");
var ResBundle = require("ilib/lib/ResBundle");
var Pseudo = require("./Pseudo.js");

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
    this.parent(options);

    // zxx is the language "unspecified" and XX is the region "unknown", which
    // ilib uses for pseudo localization
    this.pseudoBundle = new ResBundle({
        type: (options && options.type) || "text",
        locale: (options && options.targetLocale) || "zxx-XX",
        lengthen: true
    });
};

RegularPseudo.prototype = new Pseudo({});
RegularPseudo.prototype.parent = Pseudo;
RegularPseudo.prototype.constructor = RegularPseudo;

/**
 * Return a string converted to pseudo-English.
 *
 * @param {String} source the source string in English
 * @returns {String} the same string mapped to traditional
 * pseudo-English
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
    var str = resource.getSource(selector);
    return this.pseudoBundle.getStringJS(str);
};

module.exports = RegularPseudo;
