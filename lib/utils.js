/*
 * utils.js - various utilities
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale");

// var log4js = require("log4js");
// var logger = log4js.getLogger("loctool.lib.utils");

module.exports = {
    iso3166: {
        "AF": 1,
        "AX": 1,
        "AL": 1,
        "DZ": 1,
        "AS": 1,
        "AD": 1,
        "AO": 1,
        "AI": 1,
        "AQ": 1,
        "AG": 1,
        "AR": 1,
        "AM": 1,
        "AW": 1,
        "AU": 1,
        "AT": 1,
        "AZ": 1,
        "BS": 1,
        "BH": 1,
        "BD": 1,
        "BB": 1,
        "BY": 1,
        "BE": 1,
        "BZ": 1,
        "BJ": 1,
        "BM": 1,
        "BT": 1,
        "BO": 1,
        "BQ": 1,
        "BA": 1,
        "BW": 1,
        "BV": 1,
        "BR": 1,
        "IO": 1,
        "BN": 1,
        "BG": 1,
        "BF": 1,
        "BI": 1,
        "KH": 1,
        "CM": 1,
        "CA": 1,
        "CV": 1,
        "KY": 1,
        "CF": 1,
        "TD": 1,
        "CL": 1,
        "CN": 1,
        "CX": 1,
        "CC": 1,
        "CO": 1,
        "KM": 1,
        "CG": 1,
        "CD": 1,
        "CK": 1,
        "CR": 1,
        "CI": 1,
        "HR": 1,
        "CU": 1,
        "CW": 1,
        "CY": 1,
        "CZ": 1,
        "DK": 1,
        "DJ": 1,
        "DM": 1,
        "DO": 1,
        "EC": 1,
        "EG": 1,
        "SV": 1,
        "GQ": 1,
        "ER": 1,
        "EE": 1,
        "ET": 1,
        "FK": 1,
        "FO": 1,
        "FJ": 1,
        "FI": 1,
        "FR": 1,
        "GF": 1,
        "PF": 1,
        "TF": 1,
        "GA": 1,
        "GM": 1,
        "GE": 1,
        "DE": 1,
        "GH": 1,
        "GI": 1,
        "GR": 1,
        "GL": 1,
        "GD": 1,
        "GP": 1,
        "GU": 1,
        "GT": 1,
        "GG": 1,
        "GN": 1,
        "GW": 1,
        "GY": 1,
        "HT": 1,
        "HM": 1,
        "VA": 1,
        "HN": 1,
        "HK": 1,
        "HU": 1,
        "IS": 1,
        "IN": 1,
        "ID": 1,
        "IR": 1,
        "IQ": 1,
        "IE": 1,
        "IM": 1,
        "IL": 1,
        "IT": 1,
        "JM": 1,
        "JP": 1,
        "JE": 1,
        "JO": 1,
        "KZ": 1,
        "KE": 1,
        "KI": 1,
        "KP": 1,
        "KR": 1,
        "KW": 1,
        "KG": 1,
        "LA": 1,
        "LV": 1,
        "LB": 1,
        "LS": 1,
        "LR": 1,
        "LY": 1,
        "LI": 1,
        "LT": 1,
        "LU": 1,
        "MO": 1,
        "MK": 1,
        "MG": 1,
        "MW": 1,
        "MY": 1,
        "MV": 1,
        "ML": 1,
        "MT": 1,
        "MH": 1,
        "MQ": 1,
        "MR": 1,
        "MU": 1,
        "YT": 1,
        "MX": 1,
        "FM": 1,
        "MD": 1,
        "MC": 1,
        "MN": 1,
        "ME": 1,
        "MS": 1,
        "MA": 1,
        "MZ": 1,
        "MM": 1,
        "NA": 1,
        "NR": 1,
        "NP": 1,
        "NL": 1,
        "NC": 1,
        "NZ": 1,
        "NI": 1,
        "NE": 1,
        "NG": 1,
        "NU": 1,
        "NF": 1,
        "MP": 1,
        "NO": 1,
        "OM": 1,
        "PK": 1,
        "PW": 1,
        "PS": 1,
        "PA": 1,
        "PG": 1,
        "PY": 1,
        "PE": 1,
        "PH": 1,
        "PN": 1,
        "PL": 1,
        "PT": 1,
        "PR": 1,
        "QA": 1,
        "RE": 1,
        "RO": 1,
        "RU": 1,
        "RW": 1,
        "BL": 1,
        "SH": 1,
        "KN": 1,
        "LC": 1,
        "MF": 1,
        "PM": 1,
        "VC": 1,
        "WS": 1,
        "SM": 1,
        "ST": 1,
        "SA": 1,
        "SN": 1,
        "RS": 1,
        "SC": 1,
        "SL": 1,
        "SG": 1,
        "SX": 1,
        "SK": 1,
        "SI": 1,
        "SB": 1,
        "SO": 1,
        "ZA": 1,
        "GS": 1,
        "SS": 1,
        "ES": 1,
        "LK": 1,
        "SD": 1,
        "SR": 1,
        "SJ": 1,
        "SZ": 1,
        "SE": 1,
        "CH": 1,
        "SY": 1,
        "TW": 1,
        "TJ": 1,
        "TZ": 1,
        "TH": 1,
        "TL": 1,
        "TG": 1,
        "TK": 1,
        "TO": 1,
        "TT": 1,
        "TN": 1,
        "TR": 1,
        "TM": 1,
        "TC": 1,
        "TV": 1,
        "UG": 1,
        "UA": 1,
        "AE": 1,
        "GB": 1,
        "US": 1,
        "UM": 1,
        "UY": 1,
        "UZ": 1,
        "VU": 1,
        "VE": 1,
        "VN": 1,
        "VG": 1,
        "VI": 1,
        "WF": 1,
        "EH": 1,
        "YE": 1,
        "ZM": 1,
        "ZW": 1
    },

    iso639: {
        "ab": 1,
        "aa": 1,
        "af": 1,
        "ak": 1,
        "sq": 1,
        "am": 1,
        "ar": 1,
        "an": 1,
        "hy": 1,
        "as": 1,
        "av": 1,
        "ae": 1,
        "ay": 1,
        "az": 1,
        "bm": 1,
        "ba": 1,
        "eu": 1,
        "be": 1,
        "bn": 1,
        "bh": 1,
        "bi": 1,
        "bs": 1,
        "br": 1,
        "bg": 1,
        "my": 1,
        "ca": 1,
        "ch": 1,
        "ce": 1,
        "ny": 1,
        "zh": 1,
        "cv": 1,
        "kw": 1,
        "co": 1,
        "cr": 1,
        "hr": 1,
        "cs": 1,
        "da": 1,
        "dv": 1,
        "nl": 1,
        "dz": 1,
        "en": 1,
        "eo": 1,
        "et": 1,
        "ee": 1,
        "fo": 1,
        "fj": 1,
        "fi": 1,
        "fr": 1,
        "ff": 1,
        "gl": 1,
        "ka": 1,
        "de": 1,
        "el": 1,
        "gn": 1,
        "gu": 1,
        "ht": 1,
        "ha": 1,
        "he": 1,
        "hz": 1,
        "hi": 1,
        "ho": 1,
        "hu": 1,
        "ia": 1,
        "id": 1,
        "ie": 1,
        "ga": 1,
        "ig": 1,
        "ik": 1,
        "io": 1,
        "is": 1,
        "it": 1,
        "iu": 1,
        "ja": 1,
        "jv": 1,
        "kl": 1,
        "kn": 1,
        "kr": 1,
        "ks": 1,
        "kk": 1,
        "km": 1,
        "ki": 1,
        "rw": 1,
        "ky": 1,
        "kv": 1,
        "kg": 1,
        "ko": 1,
        "ku": 1,
        "kj": 1,
        "la": 1,
        "lb": 1,
        "lg": 1,
        "li": 1,
        "ln": 1,
        "lo": 1,
        "lt": 1,
        "lu": 1,
        "lv": 1,
        "gv": 1,
        "mk": 1,
        "mg": 1,
        "ms": 1,
        "ml": 1,
        "mt": 1,
        "mi": 1,
        "mr": 1,
        "mh": 1,
        "mn": 1,
        "na": 1,
        "nv": 1,
        "nb": 1,
        "nd": 1,
        "ne": 1,
        "ng": 1,
        "nn": 1,
        "no": 1,
        "ii": 1,
        "nr": 1,
        "oc": 1,
        "oj": 1,
        "cu": 1,
        "om": 1,
        "or": 1,
        "os": 1,
        "pa": 1,
        "pi": 1,
        "fa": 1,
        "pl": 1,
        "ps": 1,
        "pt": 1,
        "qu": 1,
        "rm": 1,
        "rn": 1,
        "ro": 1,
        "ru": 1,
        "sa": 1,
        "sc": 1,
        "sd": 1,
        "se": 1,
        "sm": 1,
        "sg": 1,
        "sr": 1,
        "gd": 1,
        "sn": 1,
        "si": 1,
        "sk": 1,
        "sl": 1,
        "so": 1,
        "st": 1,
        "es": 1,
        "su": 1,
        "sw": 1,
        "ss": 1,
        "sv": 1,
        "ta": 1,
        "te": 1,
        "tg": 1,
        "th": 1,
        "ti": 1,
        "bo": 1,
        "tk": 1,
        "tl": 1,
        "tn": 1,
        "to": 1,
        "tr": 1,
        "ts": 1,
        "tt": 1,
        "tw": 1,
        "ty": 1,
        "ug": 1,
        "uk": 1,
        "ur": 1,
        "uz": 1,
        "ve": 1,
        "vi": 1,
        "vo": 1,
        "wa": 1,
        "cy": 1,
        "wo": 1,
        "fy": 1,
        "xh": 1,
        "yi": 1,
        "yo": 1,
        "za": 1,
        "zu": 1
    }
};

module.exports.makeDirs = function makeDirs(path) {
    var parts = path.split(/[\\\/]/);

    for (var i = 1; i <= parts.length; i++) {
        var p = parts.slice(0, i).join("/");
        if (p && p.length > 0 && !fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

module.exports.isEmpty = function (obj) {
    var prop = undefined;

    if (!obj) {
        return true;
    }

    for (prop in obj) {
        if (prop && obj[prop]) {
            return false;
        }
    }
    return true;
};

module.exports.escapeXml = function (str) {
    if (str) {
        str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return str;
};


var alreadyResRE = /^@\+?([\w:][\w:]*)\//;
var alreadyResourcified = {
    "anim": true,
    "array": true,
    "color": true,
    "dimen": true,
    "drawable": true,
    "id": true,
    "integer": true,
    "layout": true,
    "string": true,
    "style": true,
    "android:id": true,
    "android:anim": true,
    "android:color": true,
    "android:style": true,
};
var alreadyRes2RE = /^@=?\{.*\}$/;

/**
 * Return true if the given value already represents an android resource
 * value.
 *
 * @returns {boolean} true if the value represents an android resource
 * value, or false otherwise
 */
module.exports.isAndroidResource = function(value) {
    var match = alreadyResRE.exec(value);
    var match2 = alreadyRes2RE.exec(value);
    return (match && match.length > 1 && alreadyResourcified[match[1]]) || (match2 !== null && match2.length);
};

/**
 * Return true if the first character in c is a white space character.
 * This checks for all Unicode white space characters.
 *
 * @param {String} c the character to check
 * @returns {boolean} true if the character contains whitespace, false
 * otherwise
 */
module.exports.isWhite = function (c) {
    if (c === " " || c === "\n" || c === "\t" || c === '\r' || c === '\f') return true;
    var code = c.charCodeAt(0);
    return code === 0x00A0 ||
        (code >= 0x2000 && code <= 0x200F) ||
        (code >= 0x2028 && code <= 0x202F) ||
        (code >= 0x205F && code <= 0x206F);
};

/**
 * Return true if the given locale spec is for an Asian locale that does
 * not have spaces between words, or false for any other type of language.
 *
 * @param {String} spec the locale specification of the locale to test
 * @returns {boolean} true if the given spec is for an Asian locale, or
 * false otherwise
 */
module.exports.isAsianLocale = function(spec) {
    var locale = new Locale(spec);
    switch (locale.getLanguage()) {
    case 'zh':
    case 'ja':
    case 'th':
        return true;
    default:
        return false;
    }
};

/**
 * Return true if the string represents a 'do not translate'
 * string.
 *
 * @returns {boolean} true if the string represents a do not translate
 * string, of false if the string does not or if it is undefined
 */
module.exports.isDNT = function(str) {
    if (!str) return false;
    str = str.trim().toLowerCase();
    return str === "dnt" || str === "do not translate";
};

/**
 * Return a standard hash of the given source string. This should
 * correspond exactly to the hash in the haml localizer, the ruby
 * RB.t function, and the Java hash function.
 *
 * @param {String} source the source string as extracted from the
 * source code, unmodified
 * @returns {String} the hash key
 */
module.exports.hashKey = function(source) {
    if (!source) return undefined;
    var hash = 0;
    // these two numbers together = 46 bits so it won't blow out the precision of an integer in javascript
    var modulus = 1073741789;  // largest prime number that fits in 30 bits
    var multiple = 65521;      // largest prime that fits in 16 bits, co-prime with the modulus

    // logger.trace("hash starts off at " + hash);

    for (var i = 0; i < source.length; i++) {
        // logger.trace("hash " + hash + " char " + source.charCodeAt(i) + "=" + source.charAt(i));
        hash += source.charCodeAt(i);
        hash *= multiple;
        hash %= modulus;
    }
    var value = "r" + hash;

    // System.out.println("String '" + source + "' hashes to " + value);

    return value;
};

/**
 * Trim actual whitespace AND escaped white space characters
 * from the beginning and end of the string.
 *
 * @param {string} str string to trim
 * @returns {string} trimmed string
 */
module.exports.trimEscaped = function (str) {
    return str && str.replace(/^(\s|\\t|\\r|\\n)*/, "").replace(/(\s|\\t|\\r|\\n)*$/, "");
};

/**
 * A hash containing a list of HTML tags that do not
 * cause a break in a resource string. These tags should
 * be included in the middle of the string.
 */
module.exports.nonBreakingTags = {
    "a": true,
    "abbr": true,
    "b": true,
    "bdi": true,
    "bdo": true,
    "br": true,
    "dfn": true,
    "del": true,
    "em": true,
    "i": true,
    "ins": true,
    "mark": true,
    "ruby": true,
    "rt": true,
    "span": true,
    "strong": true,
    "sub": true,
    "sup": true,
    "time": true,
    "u": true,
    "var": true,
    "wbr": true
};

/**
 * A hash containing a list of HTML tags that are
 * self-closing. That is, in HTML4 and earlier,
 * the close tag was not needed for these.
 */
module.exports.selfClosingTags = {
    "bdi": true,
    "bdo": true,
    "br": true
};

/**
 * Return an HTML-escaped version of the given string.
 * This escaped version is appropriate for use in
 * HTML attribute values.
 *
 * @param {String} str the string to escape
 * @returns {String} the escaped string
 */
module.exports.escapeQuotes = function (str) {
    var ret = "";
    if (str.length < 1) {
        return '';
    }
    var suffix = "";

    if (str[0] === '"' || str[0] === "'") {
        ret += str[0];
        str = str.substring(1);
        if (str[str.length-1] === '"' || str[str.length-1] === "'") {
            suffix = str[str.length-1];
            str = str.substring(0, str.length-1);
        }
    }

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
        case '"':
            ret += '&quot;';
            break;
        case "'":
            ret += '&apos;';
            break;
        case '<':
            if (i+1 < str.length && str[i+1] === '%') {
                i += 2;
                ret += '<%';
                while (i+1 < str.length && (str[i] !== '%' || str[i+1] !== '>')) {
                    ret += str[i++];
                }
                if (i < str.length) {
                    ret += str[i];
                }
            } else {
                ret += "&lt;";
            }
            break;
        case '>':
            ret += (i > 0 && str[i-1] === '%') ? '>' : "&gt;";
            break;
        case '\\':
            ret += '\\';
            if (i+1 < str.length-1) {
                ret += str[++i];
            }
            break;
        default:
            ret += str[i];
            break;
        }
    }

    // trailing quote if necessary
    ret += suffix;

    return ret;
};

/**
 * Find the line number of the given character index into the data. The lastIndex
 * is the index of the last search, and indicates where to start searching this
 * time. The lastLine is the line number for the last search, and indicates where
 * to start when counting lines from the lastIndex to the given index.
 *
 * @param {String} data the data to search
 * @param {number} index the point in the data for which the line number is being sought
 * @param {number} lastIndex the point in the data where the last search left off
 * @param {number} lastLine the line number found in the last search
 * @return {number} the line number for the given index
 */
module.exports.findLineNumber = function findLineNumber(data, index, lastIndex, lastLine) {
    var num = lastLine;

    for (var i = lastIndex; i < data.length && i < index; i++) {
        if (data[i] === "\n") num++;
    }

    return num;
};

/**
 * Truncate the start of the line, leaving the given length of string
 * at the end. For example,<p>
 *
 * "abcdefghijklmnopqrstuvwxyz"<p>
 *
 * would be truncated at 10 to:<p>
 *
 * "…rstuvwxyz" <p>
 *
 * Note that the ellipsis character takes up one spot, so there are only
 * 9 characters left from the original string.
 *
 * @param {String} line the line to truncate
 * @param {number} length the length of the string to leave intact
 * @returns {String} the truncated line
 */
module.exports.truncateStart = function(line, length) {
    return (!line || line.length <= length - 1) ? line : "…" + line.substr(-length+1);
};

/**
 * Search the given data for errors using the given regular expression and
 * print the results to the log.
 * @param {String} data the contents of the file to search
 * @param {RegExp} re the regular expression to use to search that data
 * @param {String} message message to print when a problem is found
 * @param {Logger} logger the log4js logger to use for output
 * @param {String} pathName the path naeme of the file that is being read
 */
module.exports.generateWarnings = function(data, re, message, logger, pathName) {
    var line = 0, lastIndex = 0;
    var truncated = module.exports.truncateStart(pathName, 40);
    re.lastIndex = 0; // for safety
    result = re.exec(data);
    while (result) {
        line = module.exports.findLineNumber(data, result.index, lastIndex, line);
        lastIndex = result.index;
        logger.warn(message);
        logger.warn(truncated + ":" + line + ":" + result[0]);
        result = re.exec(data);
    }
};

/**
 * Clean a string for matching against other strings by removing
 * differences that are inconsequential for translation.
 *
 * @param {String} str string to clean
 * @returns {String} the cleaned string
 */
module.exports.cleanString = function(str) {
    return str.toLowerCase().
        replace(/\\n/g, " ").
        replace(/\\t/g, " ").
        replace(/\\/g, "").
        replace(/\s+/g, " ").
        trim().
        replace(/&apos;/g, "'").
        replace(/&quot;/g, '"').
        replace(/&lt;/g, "<").
        replace(/&gt;/g, ">").
        replace(/&amp;/g, "&").
        replace(/’/g, "'");
};

/**
 * Strip the quotes off of a string and return the resulting string.
 * The quotes may be either single or double. If there are no quotes
 * on the string, the entire string is returned.
 * 
 * @param {String} str the string to strip the quotes from
 * @returns {String} the stripped string
 */
module.exports.stripQuotes = function(str) {
    var ret = str;
    if (ret[0] === '"' || ret[0] === "'") {
        ret = ret.substring(1);
    }

    if (ret[ret.length-1] === '"' || ret[ret.length-1] === "'") {
        ret = ret.substring(0, ret.length-1);
    }

    return ret;
}

/**
 * Compare two objects for equivalence. If they contain a
 * different number of properties, or if the value of any
 * of the properties differs between the two, then this
 * will return false.
 *
 * @param {Object} left the first object to compare
 * @param {Object} right the second object to compare
 * @return {boolean} true if both objects contain the same
 * properties and those properties have the same values
 */
module.exports.objectEquals = function(left, right) {
    var lkeys = Object.keys(left);
    var rkeys = Object.keys(right);
    if (lkeys.length !== rkeys.length) {
        return false;
    }

    var ret = lkeys.every(function(key) {
        return right.hasOwnProperty(key) && left[key] === right[key];
    });
    if (!ret) return false;
    return rkeys.every(function(key) {
        return left.hasOwnProperty(key) && left[key] === right[key];
    });
}

/**
 * @private
 * These locales represent the generic world-wide version of the
 * language/script. That is, "es" means "Spanish for the US". If you
 * want something other than that, you have to use the full locale.
 * eg. "es-ES" for Spanish for Spain
 */
var localeDefaults = {
    "en": {
        def: "en-US",
        spec: "en"
    },
    "es": {
        def: "es-US",
        spec: "es"
    },
    "zh-Hans": {
        def: "zh-Hans-CN",
        spec: "zh"
    },
    "zh-Hant": {
        def: "zh-Hant-HK",
        spec: "zh-Hant"
    }
};

/**
 * @private
 */
module.exports.getLocaleDefault = function(locale, flavor) {
    var l = new Locale(locale);
    flavor = flavor || l.variant;

    var langscript = l.language + (l.script ? "-" + l.script : ""),
        def = localeDefaults[langscript],
        spec = l.language;

    if (flavor) {
        l = new Locale(l.language, l.region, flavor, l.script);
        spec = l.getSpec();
    } else if (def) {
        // overwrite the locale dir for the default of this language
        spec = (def.def === l.getSpec()) ? def.spec : l.getSpec();
    }

    return spec;
};
