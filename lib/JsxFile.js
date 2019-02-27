/*
 * JsxFile.js - plugin to extract resources from a React jsx files
 *
 * Copyright © 2018, HealthTap, Inc.
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
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JsxFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var JsxFile = function(project, pathName, type) {
    this.project = project;
    this.pathName = pathName;
    this.type = type;
    this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
JsxFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
        replace(/\\\\n/g, "").                // line continuation
        replace(/\\\n/g, "").                // line continuation
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\'/, "'").               // unescape quotes
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"').
        replace(/&quot;/g, '"').
        replace(/&apos;/g, "'");

    return unescaped;
};

/**
 * Clean the string to make a resource name string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code but increases matching.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
JsxFile.cleanString = function(string) {
    var unescaped = JsxFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        replace(/\[\[/g, "{").
        replace(/\]\]/g, "}").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the java directory for the corresponding
 * code.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
JsxFile.prototype.makeKey = function(source) {
    return JsxFile.cleanString(source);
};

var reTranslate = new RegExp(/<Translate([^]*?)>([^]*?)<\/Translate>/g);

var reAttributes = new RegExp(/\s+(\w+)\s*=\s*("(\\"|[^"])*"|'(\\'|[^'])*'|\{[^}]*\})/g);

var reGetString = new RegExp(/(^R|\WR)B\.getString(JS)?\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reGetStringWithId = new RegExp(/(^R|\WR)B\.getString(JS)?\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*,\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);

var reI18nCommentSlashSlash = new RegExp(/\/\/\s*i18n\s*:\s*(.*)$/);
var reI18nCommentSlashStar = new RegExp(/\/\*\s*i18n\s*:\s*(.*?)\*\//);

var reBadContents = new RegExp(/\{[^}]+\}/g);

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
JsxFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    var comment, match, key, autoKey;

    reTranslate.lastIndex = 0; // just to be safe
    var result = reTranslate.exec(data);
    while (result && result.length > 1 && result[2]) {
        match = JsxFile.cleanString(result[2]);
        key = comment = undefined;
        autoKey = true;

        if (match && match.length && match.replace(/\{.*?\}/g, "").trim()) {
            if (match.indexOf("<Translate") > -1) {
                throw new Error("Cannot nest Translate components inside of other Translate components\n" +
                            this.pathName + ": " + match);
            }
            reBadContents.lastIndex = 0;
            if ((result2 = reBadContents.exec(result[2])) != null) {
                throw new Error("Cannot use embedded JavaScript inside of a Translate component because it is untranslatable\n" +
                            this.pathName + ": " + result[2]);
            }

            if (result[1]) {
                // parse the attributes looking for the "key" and "comment" ones
                reAttributes.lastIndex = 0;
                while ((result2 = reAttributes.exec(result[1])) != null) {
                    if (result2.length > 2) {
                        var value = utils.stripQuotes(result2[2]);
                        if (result2[1] === "key") {
                            key = value;
                            autoKey = false;
                        } else if (result2[1] === "comment") {
                            comment = value.trim();
                        } // TODO validate that the string contains the named attributes
                    }
                }
            }

            if (!key) {
                logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");
                key = this.makeKey(match);
            }

            if (!comment) {
                var last = data.indexOf('\n', reTranslate.lastIndex);
                last = (last === -1) ? data.length : last;
                var line = data.substring(reTranslate.lastIndex, last);
                reI18nCommentSlashStar.lastIndex = 0;
                reI18nCommentSlashSlash.lastIndex = 0;
                var commentResult = reI18nCommentSlashStar.exec(line) || reI18nCommentSlashSlash.exec(line);
                comment = (commentResult && commentResult.length > 1) ? commentResult[1].trim() : undefined;
            }

            var r = new ResourceString({
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: JsxFile.cleanString(match),
                autoKey: autoKey,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        } else {
            throw new Error("Error: Bogus empty string in get string call:\n" +
                            this.pathName + ": ... " + data.substring(result.index, reTranslate.lastIndex) + " ...");
        }
        result = reTranslate.exec(data);
    }
};

/**
 * Extract all the localizable strings from the java file and add them to the
 * project's translation set.
 */
JsxFile.prototype.extract = function() {
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
        }
    }
};

/**
 * Return the set of resources found in the current JavaScript file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current JavaScript file.
 */
JsxFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write javascript source files
JsxFile.prototype.localize = function() {};
JsxFile.prototype.write = function() {};

module.exports = JsxFile;
