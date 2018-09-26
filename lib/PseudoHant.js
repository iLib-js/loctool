/*
 * PseudoHant.js - map a Simplified Chinese string into a Traditional one
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

var OpenCC = require("opencc");
var Pseudo = require("./Pseudo.js");
var Locale = require("ilib/lib/Locale.js");

/**
 * @class A resource bundle-like class to hold the simplified
 * to traditional conversion.
 *
 *
 * @constructor
 * @param {Object} options options controlling this constructor
 * behaviour of the translation
 */
var PseudoHant = function(options) {
    this.parent(options);
    this.targetLocale = this.targetLocale || "zh-Hant-HK";
    this.targetLocaleObj = new Locale(this.targetLocale);

    // Taiwan uses a slightly different style than Hong Kong, so switch dictionaries appropriately
    this.occ = new OpenCC(this.targetLocaleObj.getRegion() === "TW" ? "s2twp.json" : "s2hk.json");
};

PseudoHant.prototype = new Pseudo({});
PseudoHant.prototype.parent = Pseudo;
PseudoHant.prototype.constructor = PseudoHant;

/**
 * @override
 * This pseudo converts simplified Chinese to traditional
 * for Taiwan or Hong Kong.
 */
PseudoHant.prototype.getPseudoSourceLocale = function() {
    var l = new Locale("zh", "CN", this.targetLocaleObj.getVariant(), "Hans");
    return l.getSpec();
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

    // if there is a real translation, return it directly
    var translation = this.findTranslationForResource(resource, selector);
    if (translation) {
        return translation;
    }
    // .. else generate the translation based on the simplified translation if it exists.
    var simplified = this.set.get(resource.hashKeyForTranslation("zh-Hans-CN")) || resource;
    var target = simplified.getTarget(selector);
    return simplified && target ? this.occ.convertSync(target) : simplified.getSource(selector);
};

module.exports = PseudoHant;
