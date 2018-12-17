/*
 * MarkdownFile.js - plugin to extract resources from an Markdown file
 *
 * Copyright © 2018, Box, Inc.
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
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var IString = require("ilib/lib/IString.js");
var unified = require("unified");
var markdown = require("remark-parse");
var html = require("remark-html");
var remark2rehype = require('remark-rehype');
var raw = require('rehype-raw');
var he = require("he");

var Queue = jsstl.Queue;
var Stack = jsstl.Stack;

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.MarkdownFile");

// load the data for these
isAlnum._init();
isIdeo._init();

/**
 * Create a new Markdown file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MarkdownFile = function(project, pathName, type) {
    this.project = project;
    this.pathName = pathName;
    this.type = type;
    this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    
    this.componentIndex = 0;
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
MarkdownFile.unescapeString = function(string) {
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
MarkdownFile.cleanString = function(string) {
    var unescaped = MarkdownFile.unescapeString(string);

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
MarkdownFile.prototype.makeKey = function(source) {
    // the English source is the key as well
    return utils.hashKey(MarkdownFile.cleanString(source));
};

// list of html5 tags and their attributes that contain localizable strings
var localizableAttributes = {
    "area": {"alt":true},
    "img": {"alt":true},
    "input": {
        "alt": true,
        "placeholder": true
    },
    "optgroup": {"label":true},
    "option": {"label":true},
    "textarea": {"placeholder":true},
    "track": {"label":true}
};

var entityRE = new RegExp(/^&(\w*);/);
var spaceEntities = {
    "nbsp": true,
    "nnbsp": true,
    "mmsp": true
};

function isNotSpaceEntity(s, i) {
    entityRE.lastIndex = i;
    var match = entityRE.exec(s);
    if (!match) return true;
    return !spaceEntities[match[1]];
}

function isAllWhite(str) {
    for (i = 0; i < str.length; i++) {
        if (!utils.isWhite(str.charAt(i)) && isNotSpaceEntity(str, i)) return false;
    }
    return true;
}

function containsActualText(str) {
    // remove the html and entities first
    var cleaned = str.replace(/<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g, "").replace(/&[a-zA-Z]+;/g, "");

    for (i = 0; i < cleaned.length; i++) {
        var c = cleaned.charAt(i);
        if (isAlnum(c) || isIdeo(c)) return true;
    }
    return false;
}

MarkdownFile.prototype._addTransUnit = function(text, comment) {
    var source = utils.escapeInvalidChars(text);
    this.set.add(new ResourceString({
        project: this.project.getProjectId(),
        key: this.makeKey(source),
        sourceLocale: this.project.sourceLocale,
        source: source,
        autoKey: true,
        pathName: this.pathName,
        state: "new",
        comment: comment,
        datatype: "markdown"
    }));
};

/**
 * @param {boolean} escape true if you want the translated
 * text to be escaped for attribute values
 * @private
 */
MarkdownFile.prototype._emitText = function(escape) {
    if (!this.text.length) return;

    var i, pre = "", post = "";

    for (i = 0; i < this.text.length && utils.isWhite(this.text.charAt(i)); i++);

    if (i >= this.text.length) {
        this.text = "";
        return;
    }

    if (i > 0) {
        pre = this.text.substring(0, i);
        this.text = this.text.substring(i);
    }

    for (i = this.text.length-1; i > -1 && utils.isWhite(this.text.charAt(i)); i--);

    if (i < this.text.length-1) {
        post = this.text.substring(i+1);
        this.text = this.text.substring(0, i+1);
    }

    logger.trace('text: pre is "' + pre + '" value is "' + this.text + '" and post is "' + post + '"');

    if (this.text.length) {
        this._addTransUnit(this.text, this.comment);
    }

    this.text = "";
    this.comment = undefined;
    this.componentIndex = 0;
};

var reAttrNameAndValue = /(\w+)\s*=\s*('((\'|[^'])*)'|"((\"|[^"])*)")/;

/**
 * @private
 */
MarkdownFile.prototype._findAttributes = function(tagName, tag) {
    var match, name;
    var ret = [];
    reAttrNameAndValue.lastIndex = 0;
    while ((match = reAttrNameAndValue.exec(tag)) !== null) {
        var name = match[1],
            value = match[5];
        if (name === "title" || (utils.localizableAttributes[tagName] && utils.localizableAttributes[tagName][name])) {
            this._addTransUnit(this.value);
        }
    }
    
    return ret;
}

var reTagName = /<(\/?)\s*(\w+)(\s|>)/;
var reL10NComment = /<!--\s*[iI]18[Nn]\s*(.*)\s*-->/;

/**
 * @private
 * Walk the tree looking for localizable text.
 * @param {AST} node the current node of an abstract syntax tree to
 * walk.
 */
MarkdownFile.prototype._walk = function(node) {
    var match, valid;

    switch (node.type) {
        case 'text':
            this.text += node.value;
            break;

        case 'link':
        case 'emphasis':
        case 'strong':
            var thisComponent = this.componentIndex++;
            this.text += '<c' + thisComponent + '>';
            if (node.children && node.children.length) {
                valid = true;
                node.children.forEach(function(child) {
                    if (child.type === 'linkReference') {
                        if (child.identifier.substring(0, 6) === "block:") {
                            this._emitText();
                            valid = false;
                        } else if (child.identifier.substring(0, 6) === "/block") {
                            valid = true;
                            return;
                        }
                    }
                    if (valid) {
                        this._walk(child);
                    }
                }.bind(this));
            }
            this.text += '</c' + thisComponent + '>';
            break;

        case 'image':
            node.title && this._addTransUnit(node.title);
            node.alt && this._addTransUnit(node.alt);
            // images are non-breaking
            this.text += '<c' + this.componentIndex++ + '/>';
            break;

        case 'html':
            reTagName.lastIndex = 0;
            if (node.value.substring(0, 4) === '<!--') {
                reL10NComment.lastIndex = 0;
                match = reL10NComment.exec(node.value);
                if (match) {
                    this.comment = match[1];
                }
                // ignore HTML comments
                break;
            }
            match = reTagName.exec(node.value);

            if (match) {
                var tagName = match[2];
                if (match[1] !== '/') {
                    // opening tag
                    if (this.text) {
                        if (utils.nonBreakingTags[tagName]) {
                            var tag = {
                                name: tagName,
                                index: this.componentIndex++
                            };

                            this.tagStack.push(tag);
                            this.text += '<c' + tag.index + '>';
                        } else {
                            // it's a breaking tag, so emit any text
                            // we have accumulated so far
                            this._emitText();
                        }
                        
                        this._findAttributes(tagName, node.value);
                    }
                } else {
                    // closing tag
                    if (this.text) {
                        if (utils.nonBreakingTags[tagName] && !this.tagStack.isEmpty()) {
                            var tag = this.tagStack.pop();
                            while (tag.name !== tagName && !this.tagStack.isEmpty()) {
                                this.text += '</c' + tag.index + '>';
                                tag = this.tagStack.pop();
                            }
                            if (tag.name === tagName) {
                                this.text += '</c' + tag.index + '>';
                            } else {
                                throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                                    node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                            }
                        } else {
                            this._emitText();
                        }
                    }
                }
            } else {
                throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                    node.position.start.line + " column " + node.position.start.column + ". Bad HTML tag.");
            }
            break;

        default:
            this._emitText();
            if (node.children && node.children.length) {
                valid = true;
                node.children.forEach(function(child) {
                    if (child.type === 'linkReference') {
                        if (child.identifier.substring(0, 6) === "block:") {
                            this._emitText();
                            valid = false;
                        } else if (child.identifier.substring(0, 6) === "/block") {
                            valid = true;
                            return;
                        }
                    }
                    if (valid) {
                        this._walk(child);
                    }
                }.bind(this));
            }
            break;
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MarkdownFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    var parser = unified().
        use(markdown, {commonmark: true}).
        use(remark2rehype).
        use(raw);

    this.ast = parser.parse(data);

    // accumulates characters in text segments
    this.text = "";

    // stack of non-breaking opened tags that have to be closed eventually
    // This does not include self-closing tags like <p> or <br>
    this.tagStack = new Stack();

    this._walk(this.ast);

    // in case any is left over at the end
    this._emitText();
};

/**
 * Extract all the localizable strings from the md file and add them to the
 * project's translation set.
 */
MarkdownFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Java file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
MarkdownFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't write Markdown source files
MarkdownFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
MarkdownFile.prototype.getLocalizedPath = function(locale) {
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
MarkdownFile.prototype.localizeText = function(translations, locale) {
    this.segments.rewind();
    var segment = this.segments.current();
    var output = "";
    var substitution, replacement;

    while (segment) {
        if (segment.localizable) {
            var hashkey = ResourceString.cleanHashKey(this.project.getProjectId(), locale, this.makeKey(escapeInvalidChars(segment.text)), "html");
            var translated = translations.getClean(hashkey);

            if (segment.attributeSubstitution) {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    substitution = segment.text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                                this.project.getProjectId(), sourceLocale, this.makeKey(escapeInvalidChars(segment.text)), "html"));
                        source = sourceRes ? sourceRes.getTarget() : segment.text;
                    } else {
                        source = segment.text;
                    }
                    substitution = this.type.pseudos[locale].getString(source);
                } else {
                    substitution = translated ? translated.getTarget() : segment.text;
                }

                replacement = segment.replacement;

                if (this.project.settings.identify) {
                    // make it clear what is the resource is for this string
                    substitution = '<span loclang="html" locid="' + this.makeKey(escapeInvalidChars(segment.text)) + '">' + substitution + '</span>';
                }

                substitution = utils.escapeQuotes(substitution);
            } else {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    additional = segment.text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                                this.project.getProjectId(), sourceLocale, this.makeKey(escapeInvalidChars(segment.text)), "html"));
                        source = sourceRes ? sourceRes.getTarget() : segment.text;
                    } else {
                        source = segment.text;
                    }
                    additional = this.type.pseudos[locale].getString(source);
                } else {
                    var additional;
                    if (translated) {
                        additional = translated.getTarget();
                    } else {
                        if (this.type && containsActualText(segment.text)) {
                            logger.trace("New string found: " + segment.text);
                            this.type.newres.add(new ResourceString({
                                project: this.project.getProjectId(),
                                key: this.makeKey(escapeInvalidChars(segment.text)),
                                sourceLocale: this.project.sourceLocale,
                                source: escapeInvalidChars(segment.text),
                                targetLocale: locale,
                                target: escapeInvalidChars(segment.text),
                                autoKey: true,
                                pathName: this.pathName,
                                state: "new",
                                datatype: "html",
                                origin: "target"
                            }));
                            additional = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                                    this.type.missingPseudo.getString(segment.text) : segment.text;
                        } else {
                            additional = segment.text;
                        }
                    }
                }
                if (substitution) {
                    additional = additional.replace(replacement, substitution);
                    substitution = undefined;
                    replacement = undefined;
                }

                if (this.project.settings.identify) {
                    // make it clear what is the resource is for this string
                    additional = '<span loclang="html" locid="' + utils.escapeQuotes(this.makeKey(escapeInvalidChars(segment.text))) + '">' + additional + '</span>';
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
 * Localize the contents of this Markdown file and write out the
 * localized Markdown file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MarkdownFile.prototype.localize = function(translations, locales) {
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

module.exports = MarkdownFile;
