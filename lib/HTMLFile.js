/*
 * HTMLFile.js - plugin to extract resources from an HTML file
 *
 * Copyright © 2018-2019, Box, Inc.
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
var htmlParser = require("html-parser");
var jsstl = require("js-stl");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var he = require("he");
var MessageAccumulator = require("message-accumulator").default;

var Queue = jsstl.Queue;
var Stack = jsstl.Stack;

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.HTMLFile");

/**
 * Create a new HTML file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var HTMLFile = function(project, pathName, type) {
    this.project = project;
    this.pathName = pathName;
    this.type = type;
    this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
HTMLFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = he.decode(unescaped);

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\(.)/g, "$1");

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code, but it increases the matching between strings
 * that only differ in ways that don't matter.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
HTMLFile.cleanString = function(string) {
    var unescaped = HTMLFile.unescapeString(string);

    unescaped = unescaped.
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
HTMLFile.prototype.makeKey = function(source) {
    return utils.hashKey(HTMLFile.cleanString(source));
};

function nodeToString(node) {
    if (node.type === "root") {
        return "";
    } else if (node.type === "text") {
        return node.value;
    } else if (node.use === "start") {
        return node.extra.text;
    } else if (node.use === "startend") {
        return node.extra.text + "</" + node.extra.name + ">";
    } else {
        return "</" + node.extra.name + ">";
    }
}

/**
 * @param {boolean} escape true if you want the translated
 * text to be escaped for attribute values
 * @private
 */
HTMLFile.prototype._emitText = function(escape) {
    this.text = this.message.getMinimalString();
    logger.debug("_emitText: message accumulator minimal string is: " + this.text);

    var pre = this.message.getPrefix().map(nodeToString).join('');
    var post = this.message.getSuffix().map(nodeToString).join('');

    this.accumulator += pre;
    this.segments.enqueue({
        localizable: false,
        text: this.accumulator
    });

    logger.debug('text: pre is "' + pre + '" value is "' + this.text + '" and post is "' + post + '"');

    if (this.text.length) {
        this.segments.enqueue({
            localizable: true,
            text: utils.escapeInvalidChars(this.text),
            escape: escape,
            message: this.message
        });

        this.set.add(new ResourceString({
            project: this.project.getProjectId(),
            key: this.makeKey(utils.escapeInvalidChars(this.text)),
            sourceLocale: this.project.sourceLocale,
            source: utils.escapeInvalidChars(this.text),
            autoKey: true,
            pathName: this.pathName,
            lineNumber: this.lineNumber,
            state: "new",
            comment: this.comment,
            datatype: "html",
            index: this.resourceIndex++
        }));
    }

    this.accumulator = post;

    this.tagtext = "";
    this.comment = undefined;

    this.message = new MessageAccumulator();
};

var reNewLine = /\n/g;

/**
 * Return the number of new lines in this text.
 * @private
 * @param {string} text text to search
 * @returns {number} the
 */
function countNewLines(text) {
    var count = 0;

    reNewLine.lastIndex = 0;
    while (reNewLine.exec(text) !== null) {
        count++;
    }

    return count;
}

function originalText(node) {
    var ret = "";
    if (node.type !== "root") {
        if (node.type === "text") {
            ret += node.value;
        } else {
            ret += node.extra.text;
        }
    }

    if (node.children) {
        node.children.forEach(function(child) {
            ret += originalText(child);
        });
    }

    if (node.type !== "text" && node.closed) {
        ret += "</" + node.extra.name + ">";
    }

    return ret;
}

function getOriginalText(message) {
    return originalText(message.root);
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
HTMLFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    // accumulates characters in non-text segments
    this.accumulator = "";

    // accumulates characters in text segments
    this.message = new MessageAccumulator();

    // Each resource is given a serial number to indicate its position within
    // the source file. This can be used later to make sure trans-units appear
    // in the xliff files in the same order as the source strings appear in the
    // source file.
    this.resourceIndex = 0;

    // Whether or not to ignore this text for localization.
    // This is turned on by HTML tags where the content of
    // those tags should not be localized.
    this.ignore = false;

    // accumulates characters of non-breaking tags that may
    // eventually be part of a text segment if it is surrounded
    // on both sides by non-whitespace text
    this.tagtext = "";

    this.segments = new Queue();

    var lastTagName;

    // keep track of the line where this resource came from
    this.lineNumber = 0;

    // stack of non-breaking opened tags that have to be closed eventually
    // This does not include self-closing tags like <p> or <br>
    var tagStack = new Stack();

    var x = htmlParser.parse(data, {
        openElement: function(name) {
            logger.trace('open tag: ' + name);
            lastTagName = name;
            if (utils.ignoreTags[name]) {
                // ignore the content inside of this tag
                this.ignore = true;
            }
            if (!this.ignore && utils.nonBreakingTags[name] && !utils.ignoreTags[name]) {
                this.tagtext += '<' + name;
            } else {
                if (this.message.getTextLength()) {
                    this._emitText();
                } else {
                    // The HTML developer put a breaking tag inside of a non-breaking tag
                    // which is not allowed in HTML5, but hey, they did it anyways and we
                    // have to deal with it. In order to make sure the tags are balanced,
                    // just add the already collected non-breaking tags to the non-message
                    // accumulator and start with a fresh message accumulator.
                    this.accumulator += getOriginalText(this.message);
                    this.message = new MessageAccumulator();
                }
                this.accumulator += '<' + name;
            }
        }.bind(this),
        closeOpenedElement: function(name, token, unary) {
            logger.trace('close opened tag: ' + name + ", token: " + token + ', unary: ' + unary);
            if (this.tagtext) {
                this.tagtext += token;
            } else {
                this.accumulator += token;
            }
            lastTagName = undefined;
            if (utils.nonBreakingTags[name] && !utils.ignoreTags[name]) {
                this.message.push({
                    name: name,
                    text: new String(this.tagtext)
                });
                this.tagtext = "";
            }
            this.lineNumber += countNewLines(token);
        }.bind(this),
        closeElement: function(name) {
            logger.trace('close: %s', name);
            if (utils.ignoreTags[name]) {
                // stop ignoring when we reach the closing tag
                this.ignore = false;
            }
            if (utils.nonBreakingTags[name] && this.message.getCurrentLevel() > 0) {
                var tag = this.message.pop();
                while (tag.name !== name && this.message.getCurrentLevel() > 0) {
                    tag = this.message.pop();
                }
                if (tag.name !== name) {
                    throw new Error("Syntax error in HTML file " + this.pathName + " line " +
                        this.lineNumber + ". Unbalanced HTML tags.");
                }
                return;
            } else {
                this._emitText();
            }

            this.accumulator += '</' + name + '>';
        }.bind(this),
        comment: function(value) {
            logger.trace('comment: %s', value);
            // strip comments from the output, but keep i18n comments
            // for the resources
            value = value.trim();
            if (value.substring(0, 5) === "i18n:") {
                this.comment = value.substring(5).trim();
            }
            this.lineNumber += countNewLines(value);
        }.bind(this),
        cdata: function(value) {
            logger.trace('cdata: %s', value);
            if (this.tagtext) {
                this._emitText();
            }
            this.accumulator += value;
            this.lineNumber += countNewLines(value);
        }.bind(this),
        attribute: function(name, value, quote) {
            logger.trace('attribute: %s=%s%s%s', name, quote, value, quote);
            if (!value && !quote) {
                // make sure there are at least empty quotes
                quote = '"';
            }
            value = value || "";
            if ((name === "title" || (utils.localizableAttributes[lastTagName] && utils.localizableAttributes[lastTagName][name])) &&
                    value.trim().length > 0 && value.substring(0,2) !== "<%") {
                this.set.add(new ResourceString({
                    project: this.project.getProjectId(),
                    key: this.makeKey(value),
                    sourceLocale: this.project.sourceLocale,
                    source: value,
                    autoKey: true,
                    pathName: this.pathName,
                    state: "new",
                    comment: this.comment,
                    datatype: "html",
                    index: this.resourceIndex++
                }));

                if (this.tagtext) {
                    this.segments.enqueue({
                        localizable: true,
                        attributeSubstitution: true,
                        text: utils.escapeQuotes(value),
                        replacement: '{' + name + '}',
                        escape: true
                    });

                    this.tagtext += " " + name + '=' + quote + '{' + name + '}' + quote;
                } else {
                    this.accumulator += " " + name + '=' + quote;

                    this._emitText(true);

                    this.segments.enqueue({
                        localizable: true,
                        text: value,
                        escape: true
                    });

                    this.accumulator += quote; // trailing quote same as opening quote
                }
            } else {
                // non-localizable and values containing template tags just get added without localization
                if (this.tagtext) {
                    this.tagtext += " " + name + '=' + quote + utils.escapeQuotes(value) + quote;
                } else {
                    this.accumulator += " " + name + '=' + quote + utils.escapeQuotes(value) + quote;
                }
            }
            this.lineNumber += countNewLines(value);
        }.bind(this),
        docType: function(value) {
            logger.trace('doctype: %s', value);
            this.accumulator += "<!DOCTYPE " + value + ">";
            this.lineNumber += countNewLines(value);
        }.bind(this),
        text: function(value) {
            logger.trace('text: value is "' + value + '"');
            if (this.ignore) {
                this.accumulator += value;
            } else if (utils.isAllWhite(value)) {
                if (this.tagtext) {
                    this.tagtext += value;
                } else {
                    this.message.addText(utils.unescapeSpaceEntities(value));
                }
            } else {
                if (this.accumulator) {
                    this.segments.enqueue({
                        localizable: false,
                        text: this.accumulator
                    });
                    this.accumulator = "";
                }

                this.message.addText(utils.unescapeSpaceEntities(value));
            }
            this.lineNumber += countNewLines(value);
        }.bind(this)
    });

    if (this.tagtext || this.message.getString()) {
        this._emitText();
    }

    if (this.accumulator.length) {
        this.segments.enqueue({
            localizable: false,
            text: this.accumulator
        });
        this.accumulator = "";
    }
};

/**
 * Extract all the localizable strings from the HTML file and add them to the
 * project's translation set.
 */
HTMLFile.prototype.extract = function() {
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
 * Return the set of resources found in the current HTML file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current HTML file.
 */
HTMLFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't write HTML source files
HTMLFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
HTMLFile.prototype.getLocalizedPath = function(locale) {
    var fullPath = this.pathName;
    var dirName = path.dirname(fullPath);
    var fileName = path.basename(fullPath);

    var parts = fileName.split(".");

    if (parts.length > 2) {
        if (parts[parts.length-2] === this.project.sourceLocale) {
            parts.splice(parts.length-2, 1, locale);
        }
    } else if (parts.length > 1) {
        parts.splice(parts.length-1, 0, locale);
    } else {
        parts.splice(parts.length, 0, locale);
    }
    return path.join(dirName, parts.join("."));
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
HTMLFile.prototype.localizeText = function(translations, locale) {
    this.segments.rewind();
    var segment = this.segments.current();
    var output = "";
    var substitution, replacement;

    this.resourceIndex = 0;

    while (segment) {
        if (segment.localizable) {
            var text = (segment.message && segment.message.getMinimalString()) || segment.text;
            var hashkey = ResourceString.cleanHashKey(this.project.getProjectId(), locale, this.makeKey(utils.escapeInvalidChars(text)), "html");
            var translated = translations.getClean(hashkey);

            if (segment.attributeSubstitution) {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    substitution = text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                                this.project.getProjectId(), sourceLocale, this.makeKey(utils.escapeInvalidChars(text)), "html"));
                        source = sourceRes ? sourceRes.getTarget() : text;
                    } else {
                        source = text;
                    }
                    substitution = this.type.pseudos[locale].getString(source);
                } else {
                    substitution = translated ? translated.getTarget() : text;
                }

                replacement = segment.replacement;

                substitution = utils.escapeQuotes(substitution);
            } else {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    additional = text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                                this.project.getProjectId(), sourceLocale, this.makeKey(utils.escapeInvalidChars(text)), "html"));
                        source = sourceRes ? sourceRes.getTarget() : text;
                    } else {
                        source = text;
                    }
                    additional = this.type.pseudos[locale].getString(source);
                } else {
                    var additional;
                    if (translated) {
                        additional = translated.getTarget();
                    } else {
                        if (this.type && utils.containsActualText(text)) {
                            logger.trace("New string found: " + text);
                            this.type.newres.add(new ResourceString({
                                project: this.project.getProjectId(),
                                key: this.makeKey(utils.escapeInvalidChars(text)),
                                sourceLocale: this.project.sourceLocale,
                                source: utils.escapeInvalidChars(text),
                                targetLocale: locale,
                                target: utils.escapeInvalidChars(text),
                                autoKey: true,
                                pathName: this.pathName,
                                state: "new",
                                datatype: "html",
                                index: this.resourceIndex++
                            }));
                            additional = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                                    this.type.missingPseudo.getString(text) : text;
                        } else {
                            additional = text;
                        }
                    }
                }

                var ma = MessageAccumulator.create(additional, segment.message);
                additional = ma.root.toArray().map(nodeToString).join('');

                if (substitution) {
                    additional = additional.replace(replacement, substitution);
                    substitution = undefined;
                    replacement = undefined;
                }

                if (this.project.settings.identify) {
                    // make it clear what is the resource is for this string
                    additional = '<span loclang="html" x-locid="' + utils.escapeQuotes(this.makeKey(utils.escapeInvalidChars(text))) + '">' + additional + '</span>';
                }

                if (segment.escape) {
                    additional = utils.escapeQuotes(additional);
                }

                output += additional;
            }
        } else {
            output += segment.text;
        }

        this.segments.next();
        segment = this.segments.current();
    }

    return output;
};

/**
 * Localize the contents of this HTML file and write out the
 * localized HTML file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
HTMLFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    if (this.segments) {
        for (var i = 0; i < locales.length; i++) {
            if (!this.project.isSourceLocale(locales[i])) {
                // skip variants for now until we can handle them properly
                var l = new Locale(locales[i]);
                if (!l.getVariant()) {
                    var pathName = this.getLocalizedPath(locales[i]);
                    logger.debug("Writing file " + pathName);
                    var p = path.join(this.project.target, pathName);
                    var d = path.dirname(p);
                    utils.makeDirs(d);

                    fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
                }
            }
        }
    } else {
        logger.debug(this.pathName + ": No segments/no strings, no localize");
    }
};

module.exports = HTMLFile;
