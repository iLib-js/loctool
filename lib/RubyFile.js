/*
 * RubyFile.js - plugin to extract resources from a Ruby source code file
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
var log4js = require("log4js");
var IString = require("ilib/lib/IString.js");

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var ResourcePlural = require("./ResourcePlural.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.RubyFile");

/**
 * Create a new Ruby file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var RubyFile = function(options) {
    if (options) {
        this.project = options.project;
        this.pathName = options.pathName;
        this.type = options.type;
    }
    this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

var reEscapeChar = /\\[ux]([a-fA-F0-9]+)/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
RubyFile.unescapeString = function(string) {
    var unescaped = string;

    while ((match = reEscapeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reEscapeChar.lastIndex = 0;
        }
    }

    unescaped = unescaped.
        replace(/^\\\\/, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\'/, "'").
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"').
        replace(/^\\([dghijklmopqwyz])/, '$1').
        replace(/([^\\])\\([dghijklmopqwyz])/g, '$1$2');

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
RubyFile.cleanString = function(string) {
    var unescaped = RubyFile.unescapeString(string);

    // can't use \s here because javascript regexp supports all sorts of
    // unicode space chars that ruby does not. So this regexp is just
    // the characters that ruby does support.
    unescaped = unescaped.
        // replace(/<(['"][^'"]*['"]|[^>])*>/g, "").
        replace(/\\n/g, " ").
        replace(/\\t/g, " ").
        replace(/[\t\r\n ]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string. This is used for
 * double-quoted strings, which are interpretted by the
 * ruby parser before they are used. This function interprets
 * the string in the same way before the hash is taken.
 * It does the following:
 *
 * <ul>
 * <li>remove new lines
 * <li>interpret tabs
 * <li>unescape quote chars
 * </ul>
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RubyFile.prototype.makeKey = function(source) {
    return utils.hashKey(RubyFile.cleanString(source));
};

/**
 * Make a new key for the given string. This is used for
 * single-quoted strings, which are not interpretted by the
 * ruby parser before they are used. New lines are removed
 * so that the xliff is nicer to read.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RubyFile.prototype.makeKeyUnescaped = function(source) {
    var unescaped = source.replace(/\n/g, '').
        replace(/^\\\\/, "").
        replace(/([^\\])\\\\/g, "$1").
        replace(/\\n/g, " ").
        replace(/\\t/g, " ").
        replace(/^\\'/, "'").
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"').
        replace(/^\\([dghijklmopqwyz])/, '$1').
        replace(/([^\\])\\([dghijklmopqwyz])/g, '$1$2').
        replace(/\s+/g, " ").trim();

    return utils.hashKey(unescaped);
};

var reGetStringBogusConcatenation1 = new RegExp(/(^R|\WR)b\.t\s*\(\s*("[^"]*"|'[^']')\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/(^R|\WR)b\.t\s*\([^\)]*\+\s*("[^"]*"|'[^']')\s*\)/g);
var reGetStringBogusParam = new RegExp(/(^R|\WR)b\.t\s*\([^'"\)]*\)/g);
var reWrongReplacementType = new RegExp(/#\{/);

var reGetStringWithId = /(^R|\WR)b\.t\s*\(\s*('((\\'|[^'])*)'|"((\\"|[^"])*)")\s*,\s*(\{\s*resource_id:\s*('((\\'|[^'])*)'|"((\\"|[^"])*)"))?/g;
var reGetStringNoId = /(^R|\WR)b\.t\s*\(\s*('((\\'|[^'])*)'|"((\\"|[^"])*)")\s*\)/g;

var reI18nComment = new RegExp(/#\s*i18n\s*:?\s*(.*)$/);

var reGetStringPlural = /(^R|\WR)b\.p\s*\(([^\n]*),\s*\{/g;
var reGetStringPluralDouble = /:?(\w+)\s*(=>|:)\s*"((\\"|[^"])*)"(\s|,)*/g;
var reGetStringPluralSingle = /:?(\w+)\s*(=>|:)\s*'((\\'|[^'])*)'(\s|,)*/g;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RubyFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    reGetStringWithId.lastIndex = 0; // for safety
    var result = reGetStringWithId.exec(data);
    while (result && result.length > 1 && result[2]) {
        logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2]);
        //if (result[2] && result[2].length > 2) {
        if (result[2]) {
            var last = data.indexOf('\n', reGetStringWithId.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reGetStringWithId.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var str = result[3] || result[5];  // single || double quote string

            var tmp = reWrongReplacementType.exec(str);
            if (tmp) {
                logger.warn(this.pathName + ":" + tmp.index + ": Warning: Ruby #{} parameters are not allowed in the RB.t() parameters:");
                logger.warn(str);
            }

            var key = result[9] || result[11] || this.makeKey(str);

            var r = new ResourceString({
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: utils.trimEscaped(RubyFile.unescapeString(str)),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        } else {
            logger.warn(this.pathName + ": Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reGetStringDouble.lastIndex) + " ...");
        }
        result = reGetStringWithId.exec(data);
    }

    reGetStringNoId.lastIndex = 0; // for safety
    var result = reGetStringNoId.exec(data);
    while (result && result.length > 1 && result[2]) {
        logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '");
        if (result[2] && result[2].length > 2) {
            var last = data.indexOf('\n', reGetStringNoId.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reGetStringNoId.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var str = result[3] || result[5];

            var tmp = reWrongReplacementType.exec(str);
            if (tmp) {
                logger.warn(this.pathName + ":" + tmp.index + ": Warning: Ruby #{} parameters are not allowed in the RB.t() parameters:");
                logger.warn(str);
            }

            var r = new ResourceString({
                project: this.project.getProjectId(),
                key: this.makeKeyUnescaped(str),
                sourceLocale: this.project.sourceLocale,
                source: utils.trimEscaped(RubyFile.unescapeString(str)),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        } else {
            logger.warn(this.pathName + ": Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reGetStringNoId.lastIndex) + " ...");
        }
        result = reGetStringNoId.exec(data); // for safety
    }

    reGetStringPlural.lastIndex = 0;
    var result = reGetStringPlural.exec(data);
    while (result && result.length > 1 && result[2]) {
        var preResource = {};
        reGetStringPluralDouble.lastIndex = 0;
        var extraction = reGetStringPluralDouble.exec(result[2]);
        while (extraction && extraction.length > 3 && extraction[1] && extraction[3]){
            preResource[extraction[1]] = extraction[3];
            extraction = reGetStringPluralDouble.exec(result[2]);
        }
        reGetStringPluralSingle.lastIndex = 0;
        var extraction = reGetStringPluralSingle.exec(result[2]);
        while (extraction && extraction.length > 3 && extraction[1] && extraction[3]){
            preResource[extraction[1]] = extraction[3];
            extraction = reGetStringPluralSingle.exec(result[2]);
        }
        if (preResource['one']){
            var r = new ResourcePlural({
                project: this.project.getProjectId(),
                key: this.makeKey(preResource['one']),
                sourceLocale: this.project.sourceLocale,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            for (var quantity in preResource) {
                if (r.getAllValidCategories().indexOf(quantity) > -1) {
                    var tmp = reWrongReplacementType.exec(preResource[quantity]);
                    if (tmp) {
                        logger.warn(this.pathName + ":" + tmp.index + ": Warning: Ruby #{} parameters are not allowed in the RB.t() parameters:");
                        logger.warn(str);
                    }

                    r.addSource(quantity, RubyFile.unescapeString(preResource[quantity]));
                } else{
                    logger.warn(this.pathName + ": Warning: ruby plural resource with invalid quantity:" + quantity);
                    logger.warn(result[0]);
                }
            }
            this.set.add(r);
        } else {
            logger.warn(this.pathName + ": Warning: ruby plural resources must have key :one");
            logger.warn(result[0]);
        }
        result = reGetStringPlural.exec(data); // for safety
    }

    // now check for and report on errors in the source
    utils.generateWarnings(data, reGetStringBogusConcatenation1,
        "Warning: string concatenation is not allowed in the RB.t() parameters:",
        logger,
        this.pathName);

    utils.generateWarnings(data, reGetStringBogusConcatenation2,
        "Warning: string concatenation is not allowed in the RB.t() parameters:",
        logger,
        this.pathName);

    utils.generateWarnings(data, reGetStringBogusParam,
        "Warning: non-string arguments are not allowed in the RB.t() parameters:",
        logger,
        this.pathName);
};

/**
 * Extract all the localizable strings from the Ruby file and add them to the
 * project's translation set.
 */
RubyFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current Ruby file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Ruby file.
 */
RubyFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't localize or write Ruby source files
RubyFile.prototype.localize = function() {};
RubyFile.prototype.write = function() {};

module.exports = RubyFile;
