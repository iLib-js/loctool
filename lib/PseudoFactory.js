/*
 * PseudoFactory.js - class that creates the right type of pseudo localization
 * resource bundle for the given locale
 *
 * Copyright © 2016-2017, 2020 HealthTap, Inc.
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
var Locale = require("ilib/lib/Locale");

var logger = log4js.getLogger("loctool.lib.PseudoFactory");

// Maps the datatype from known plugins to iLib escape types.
// new plugins will have to implement getEscapeType() to return
// the type that iLib expects
var dataTypeToEscapeType = {
    "java": "c",
    "javascript": "text",
    "markdown": "xml",
    "objc": "c",
    "plaintext": "text",
    "x-android-resource": "xml",
    "x-haml": "xml",
    "x-objective-c": "c",
    "x-swift": "c",
    "x-xib": "xml",
    "x-yaml": "ruby"
};

/**
 * Create the right type of pseudo localization
 * resource bundle for the given locale.<p>
 *
 * The options object can include:
 * <ul>
 * <li><i>project</i> - the project that is used for this request
 * <li><i>targetLocale</i> - the target locale for the requested resource bundle
 * <li><i>type</i> - the escape type of data being pseudo localized. This tells the
 * pseudo localizer to skip things like HTML tags and only pseudolocalize the
 * text. Valid values are: "html", "xml", "text", "c", "raw", and "ruby"
 * <li><i>set</i> - a TranslationSet instance containing the transltions to
 * another locale that are the basis for this target locale. For example,
 * if we are localizing to traditional Chinese, then the set would be the
 * human translations for simplified Chinese which will be automatically
 * transliterated to traditional script.
 * </ul>
 *
 * @returns {ResBundle|undefined} a resource bundle that pseudo-localizes
 * for the given locale, or undefined if there is no pseudo-localization
 * for that locale
 */
var PseudoFactory = function(options) {
    if (!options || !options.project || !options.targetLocale) return undefined;

    var type = "text";
    if (options.type) {
        type = dataTypeToEscapeType[options.type] || options.type;
    }
    logger.trace("looking for pseudo for type " + type);

    var targetLocale = new Locale(options.targetLocale);
    var targetNoVariant = targetLocale;
    var sourceLocale = new Locale(options.project.sourceLocale);
    if (targetLocale.getVariant()) {
        // source for the target locale with a variant is the source locale with
        // a variant
        sourceLocale = new Locale(sourceLocale.getLanguage(), sourceLocale.getRegion(), targetLocale.getVariant(), sourceLocale.getScript());
        // strip the variant
        targetNoVariant = new Locale(targetLocale.getLanguage(), targetLocale.getRegion(), undefined, targetLocale.getScript());
    }

    var pseudoLocales = (options.project.pseudoLocales) || PseudoFactory.defaultPseudoLocales;

    if ((options.project && options.project.settings && options.project.settings.nopseudo) ||
        (!pseudoLocales[targetLocale.getSpec()] && !pseudoLocales[targetNoVariant.getSpec()])) {
        // not a pseudo-locale
        return undefined;
    }

    var style = pseudoLocales[targetLocale.getSpec()] || pseudoLocales[targetNoVariant.getSpec()];
    switch (style) {
        case 'english-british':
            logger.trace("Found British-like pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: type,
                pathName: "../db/britishSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
            break;

        case 'english-canadian':
            logger.trace("Found Canadian pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: type,
                pathName: "../db/canadianSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
            break;

        case 'english-australian':
            logger.trace("Found Australian pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: type,
                pathName: "../db/australianSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
            break;

        case 'english-new-zealand':
            logger.trace("Found New Zealand pseudo for locale " + options.locale);
            return new WordBasedPseudo({
                set: options.set,
                project: options.project,
                type: type,
                pathName: "../db/newzealandSpellings.json",
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: options.targetLocale
            });
            break;

        case 'debug':
            logger.trace('Debug pseudo for locale ' + options.targetLocale);
            return new RegularPseudo({
                set: options.set,
                type: type,
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: "zxx-XX"
            });
            break;

        case 'debug-rtl':
            logger.trace('Debug rtl pseudo for locale ' + options.targetLocale);
            return new RegularPseudo({
                set: options.set,
                type: type,
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: "zxx-Arab-XX"
            });
            break;

        case 'debug-asian':
            logger.trace('Debug rtl pseudo for locale ' + options.targetLocale);
            return new RegularPseudo({
                set: options.set,
                type: type,
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: "zxx-Hans-XX"
            });
            break;

        case 'chinese-traditional-tw':
            logger.trace('Hant pseudo for locale ' + options.targetLocale);
            return new PseudoHant({
               set: options.set,
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: targetLocale.getSpec(),
                type: type
            });
            break;

        case 'chinese-traditional-hk':
            logger.trace('Hant pseudo for locale ' + options.targetLocale);
            return new PseudoHant({
                set: options.set,
                sourceLocale: sourceLocale.getSpec(),
                targetLocale: targetLocale.getSpec(),
                type: type
            });
            break;
    }

    logger.trace('No pseudo for locale ' + options.targetLocale);

    return undefined;
};

/**
 * Return true if the given locale is a default pseudo locale, and false
 * otherwise.
 *
 * @static
 * @param {String} locale the locale to check
 * @returns {boolean} true if the given locale is pseudo, false
 * otherwise
 */
PseudoFactory.isPseudoLocale = function (locale, project) {
    var l = new Locale(locale);
    var novariant = new Locale(l.getLanguage(), l.getRegion(), undefined, l.getScript()).getSpec();
    var ps = (project && project.settings && project.settings.pseudoLocales) || PseudoFactory.defaultPseudoLocales;
    return (l.getSpec() in ps) || (novariant in ps);
};

PseudoFactory.defaultPseudoLocales = {
    "en-AU": "english-australian",
    "en-CX": "english-australian",
    "en-CC": "english-australian",
    "en-NF": "english-australian",
    "en-HM": "english-australian",
    "en-AG": "english-british",
    "en-AI": "english-british",
    "en-AS": "english-british",
    "en-AU": "english-british",
    "en-BB": "english-british",
    "en-BE": "english-british",
    "en-BM": "english-british",
    "en-BS": "english-british",
    "en-BW": "english-british",
    "en-BZ": "english-british",
    "en-CM": "english-british",
    "en-DG": "english-british",
    "en-DM": "english-british",
    "en-ER": "english-british",
    "en-ET": "english-british",
    "en-FJ": "english-british",
    "en-FK": "english-british",
    "en-FM": "english-british",
    "en-GB": "english-british",
    "en-GD": "english-british",
    "en-GG": "english-british",
    "en-GH": "english-british",
    "en-GI": "english-british",
    "en-GM": "english-british",
    "en-GS": "english-british",
    "en-GU": "english-british",
    "en-GY": "english-british",
    "en-HK": "english-british",
    "en-IE": "english-british",
    "en-IM": "english-british",
    "en-IN": "english-british",
    "en-IO": "english-british",
    "en-JE": "english-british",
    "en-JM": "english-british",
    "en-KE": "english-british",
    "en-KI": "english-british",
    "en-KN": "english-british",
    "en-KY": "english-british",
    "en-LC": "english-british",
    "en-LK": "english-british",
    "en-LS": "english-british",
    "en-MG": "english-british",
    "en-MH": "english-british",
    "en-MO": "english-british",
    "en-MP": "english-british",
    "en-MS": "english-british",
    "en-MT": "english-british",
    "en-MU": "english-british",
    "en-MW": "english-british",
    "en-MY": "english-british",
    "en-NA": "english-british",
    "en-NG": "english-british",
    "en-NR": "english-british",
    "en-PG": "english-british",
    "en-PK": "english-british",
    "en-PN": "english-british",
    "en-PW": "english-british",
    "en-RW": "english-british",
    "en-SB": "english-british",
    "en-SC": "english-british",
    "en-SD": "english-british",
    "en-SG": "english-british",
    "en-SH": "english-british",
    "en-SL": "english-british",
    "en-SS": "english-british",
    "en-SX": "english-british",
    "en-SZ": "english-british",
    "en-TC": "english-british",
    "en-TO": "english-british",
    "en-TT": "english-british",
    "en-TV": "english-british",
    "en-TZ": "english-british",
    "en-UG": "english-british",
    "en-UM": "english-british",
    "en-VC": "english-british",
    "en-VI": "english-british",
    "en-VU": "english-british",
    "en-WS": "english-british",
    "en-ZA": "english-british",
    "en-ZM": "english-british",
    "en-ZW": "english-british",
    "en-CA": "english-canadian",
    "en-NZ": "english-new-zealand",
    "en-CK": "english-new-zealand",
    "en-NU": "english-new-zealand",
    "en-TK": "english-new-zealand",
    "zh-Hant": "chinese-traditional-tw",
    "zh-TW": "chinese-traditional-tw",
    "zh-Hant-TW": "chinese-traditional-tw",
    "zh-Hant-US": "chinese-traditional-tw",
    "zh-HK": "chinese-traditional-hk",
    "zh-Hant-HK": "chinese-traditional-hk",
    "zh-Hant-MO": "chinese-traditional-hk",
    "zxx-XX": "debug",
    "zxx-Arab-XX": "debug-rtl",
    "zxx-Hans-XX": "debug-asian"
};

module.exports = PseudoFactory;
