/*
 * Pseudo.js - super class for all pseudo localization classes
 *
 * Copyright © 2016-2018, HealthTap, Inc.
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

/**
 * @class A resource bundle-like class that all other
 * pseudo-localization classes inherit from
 *
 * <li><i>type</i> - The type of the file being processed
 * which controls what things are skipped when
 * pseudo-localizing. Valid values are: "html", "template",
 * "xml", "ruby", "java", "javascript", "text"
 * <li><i>sourceLocale</i> - the source locale of this
 * pseudo, which is (possibly) used to generate the strings
 * in the target locale. Default: "en-US"
 * <li><i>locale</i> - the target locale of this pseudo.
 * </ul>
 *
 * @constructor
 * @param {Object} options options that control the
 * behaviour of the translation
 */
var Pseudo = function(options) {
    this.type = "text";
    this.sourceLocale = "en-US";

    if (options) {
        this.type = options.type || "text";
        this.sourceLocale = options.sourceLocale || "en-US"
        this.targetLocale = options.targetLocale;
        this.set = options.set;
    }
};

/**
 * Return the name of the locale from which the current pseudo
 * derives its source strings. "Source" in this case refers to
 * the source code strings in the source language.
 *
 * @returns {String} the name of the source locale
 */
Pseudo.prototype.getSourceLocale = function() {
    return this.sourceLocale;
};

/**
 * Return the name of the locale from which the current pseudo
 * pseudo-localizes. This can be different than the source
 * locale because the pseudo may pseudo-localize the target
 * strings of another translation instead of the source strings.
 * For example, the Chinese Traditional pseudo will use
 * en-US as its source (the source code is written in English US),
 * but it pseudo-localizes the Simplified Chinese translation into
 * Traditional Chinese. In order to do that, strings are first
 * looked up in English, and then the translations of those strings
 * to Simplified Chinese are looked up, and finally, the simplified
 * Chinese is converted to traditional.
 *
 * @returns {String} the name of the source locale
 */
Pseudo.prototype.getPseudoSourceLocale = function() {
    return this.getSourceLocale();
};

/**
 * Return the name of the locale to which the current pseudo
 * localizes its source strings.
 *
 * @returns {String} the name of the target locale
 */
Pseudo.prototype.getTargetLocale = function() {
    return this.targetLocale;
};

/**
 * Return true if this type of pseudo should be used to
 * generate a set of resources for the haml localizer.
 *
 * @return {Boolean} true if the set should be generated,
 * and false if not
 */
Pseudo.prototype.useWithHamls = function() {
    return false;
};

/**
 * Return the input US English string
 *
 * @param {Resource} resource the source resource in US English
 * @param {String|Number} selector selects the plural form or array item
 * to pseudolocalize
 * @returns the same string pseudolocalized
 */
Pseudo.prototype.findTranslationForResource = function(resource, selector) {
    if (!resource || !this.set) return undefined;
    var res = this.set.get(resource.hashKeyForTranslation(this.targetLocale));
    if (res) {
        return (resource.resType === "plural" || resource.resType === "array") ? res.getTarget(selector) : res.getTarget();
    }
    return undefined;
};

module.exports = Pseudo;
