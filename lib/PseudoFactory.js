/*
 * PseudoFactory.js - class that creates the right type of pseudo localization
 * resource bundle for the given locale
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

var log4js = require("log4js");

var WordBasedPseudo = require("./WordBasedPseudo.js");
var PseudoHant = require("./PseudoHant.js");
var RegularPseudo = require("./RegularPseudo.js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale");

var logger = log4js.getLogger("loctool.lib.PseudoFactory");

// everything that inherits from British English
var britishLike = [
    "AG",
    "AI",
    "AS",
    "AU",
    "BB",
    "BE",
    "BM",
    "BS",
    "BW",
    "BZ",
    "CC",
    "CK",
    "CM",
    "CX",
    "DG",
    "DM",
    "ER",
    "ET",
    "FJ",
    "FK",
    "FM",
    "GB",
    "GD",
    "GG",
    "GH",
    "GI",
    "GM",
    "GS",
    "GU",
    "GY",
    "HK",
    "HM",
    "IE",
    "IM",
    "IN",
    "IO",
    "JE",
    "JM",
    "KE",
    "KI",
    "KN",
    "KY",
    "LC",
    "LK",
    "LS",
    "MG",
    "MH",
    "MO",
    "MP",
    "MS",
    "MT",
    "MU",
    "MW",
    "MY",
    "NA",
    "NF",
    "NG",
    "NR",
    "NU",
    "PG",
    "PK",
    "PN",
    "PW",
    "RW",
    "SB",
    "SC",
    "SD",
    "SG",
    "SH",
    "SL",
    "SS",
    "SX",
    "SZ",
    "TC",
    "TK",
    "TO",
    "TT",
    "TV",
    "TZ",
    "UG",
    "UM",
    "VC",
    "VI",
    "VU",
    "WS",
    "ZA",
    "ZM",
    "ZW"
];

/**
 * @class Create the right type of pseudo localization
 * resource bundle for the given locale.
 *
 * @param {Project} project the project that is used for this request
 * @param {String} targetLocale the locale for the requested resource
 * bundle
 * @returns {ResBundle|undefined} a resource bundle that pseudo-localizes
 * for the given locale, or undefined if there is no pseudo-localization
 * for that locale
 */
var PseudoFactory = function(options) {
    if (!options || !options.project || !options.targetLocale) return undefined;

    logger.trace("looking for pseudo for type " + options.type);

    var targetLocale = new Locale(options.targetLocale);
    var sourceLocale = new Locale(options.project.sourceLocale);
    if (targetLocale.getVariant()) {
        // source for the target locale with a variant is the source locale with
        // a variant
        sourceLocale = new Locale(sourceLocale.getLanguage(), sourceLocale.getRegion(), targetLocale.getVariant(), sourceLocale.getScript());
    }
    if (targetLocale.getLanguage() === "en") {
        if (britishLike.indexOf(targetLocale.getRegion()) > -1) {
            logger.trace("Found British-like pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: options.type || "text",
                pathName: "../db/britishSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
        }

        if (targetLocale.getRegion() === "CA") {
            logger.trace("Found Canadian pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: options.type || "text",
                pathName: "../db/canadianSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
        }

        if (targetLocale.getRegion() === "NZ") {
            logger.trace("Found New Zealand pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: options.type || "text",
                pathName: "../db/newzealandSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
        }
    }

    // mappings for simplified -> traditional Chinese
    if (targetLocale.getScript() === "Hant") {
        logger.trace('Hant pseudo for locale ' + options.targetLocale);
        return new PseudoHant({
            set: options.set,
            sourceLocale: sourceLocale.getSpec(),
            targetLocale: options.targetLocale
        });
    }

    // regular pseudo-localization
    pseudoLocales = (typeof options.project.pseudoLocale === "string") ? [options.project.pseudoLocale] : options.project.pseudoLocale
    if (targetLocale.getSpec() !== "" &&
       (pseudoLocales.indexOf(targetLocale.getSpec()) !== -1 || options.targetLocale.indexOf(pseudoLocales[0]) !== -1)
        && !options.project.settings.nopseudo) {
        logger.trace('Regular pseudo for locale ' + options.targetLocale);
        return new RegularPseudo({
            set: options.set,
            type: options.type,
            sourceLocale: sourceLocale.getSpec(),
            targetLocale: options.targetLocale
        });
    }

    logger.trace('No pseudo for locale ' + options.targetLocale);

    return undefined;
};

/**
 * Return true if the given locale is a pseudo locale, and false
 * otherwise.
 *
 * @static
 * @param {String} locale the locale to check
 * @returns {boolean} true if the given locale is pseudo, false
 * otherwise
 */
PseudoFactory.isPseudoLocale = function (locale) {
    var l = new Locale(locale);
    var ispseudo = (l.getLanguage() === "en" &&
            (britishLike.indexOf(l.getRegion()) > -1 ||
            ["CA", "NZ"].indexOf(l.getRegion()) > -1));

    // mappings for simplified -> traditional Chinese
    if (!ispseudo && l.getLanguage() === "zh") {
        ispseudo = (l.getScript() === "Hant");
    }

    return ispseudo;
};

module.exports = PseudoFactory;
