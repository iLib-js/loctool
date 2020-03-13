/*
 * MarkdownFile.js - plugin to extract resources from an Markdown file
 *
 * Copyright © 2019, Box, Inc.
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
var MessageAccumulator = require("message-accumulator").default;
var Node = require("ilib-tree-node").default;
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var IString = require("ilib/lib/IString.js");
var unified = require("unified");
var markdown = require("remark-parse");
var html = require("remark-html");
var remark2rehype = require('remark-rehype');
var highlight = require('remark-highlight.js');
var raw = require('rehype-raw');
var stringify = require('remark-stringify');
var frontmatter = require('remark-frontmatter');
var he = require("he");
var unistFilter = require('unist-util-filter');
var unistMap = require('unist-util-map');
var unistVisit = require('unist-util-visit');
var u = require('unist-builder');

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.MarkdownFile");

// load the data for these
isAlnum._init();
isIdeo._init();

var mdparser = unified().
    use(markdown, {
        commonmark: true,
        gfm: true
    }).
    use(frontmatter, ['yaml']).
    use(highlight).
    use(remark2rehype).
    use(raw);

var mdstringify = unified().
    use(stringify, {
        commonmark: true,
        gfm: true,
        rule: '-',
        ruleSpaces: false,
        bullet: '*',
        listItemIndent: 1
    }).
    use(frontmatter, ['yaml'])();

function escapeQuotes(str) {
    var ret = "";
    if (str.length < 1) {
        return '';
    }
    var inQuote = false;

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
        case '"':
            if (inQuote) {
                if (i+1 < str.length-1 && str[i+1] !== '\n') {
                    ret += '\\';
                }
            } else {
                inQuote = true;
            }
            ret += '"';
            break;
        case '\n':
            inQuote = false;
            ret += '\n';
            break;
        case '\\':
            if (i+1 < str.length-1) {
                i++;
                if (str[i] === '[') {
                    ret += str[i];
                } else {
                    ret += '\\';
                    if (str[i] !== '\\') {
                        ret += str[i];
                    }
                }
            } else {
                ret += '\\';
            }
            break;
        default:
            ret += str[i];
            break;
        }
    }

    return ret;
};

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
    this.localizeLinks = false;
    // this.componentIndex = 0;
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
    return utils.hashKey(MarkdownFile.cleanString(source));
};

var reWholeTag = /<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g;

MarkdownFile.prototype._addTransUnit = function(text, comment) {
    if (text) {
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
            datatype: "markdown",
            index: this.resourceIndex++
        }));
    }
};

/**
 * @private
 * @param {string} text
 * @returns {Object} an object containing the leading whitespace, the text,
 * and the trailing whitespace
 */
function trim(text) {
    var i, pre = "", post = "", ret = {};
    if (!text) {
        return {
            pre: ""
        };
    }

    for (i = 0; i < text.length && utils.isWhite(text.charAt(i)); i++);

    if (i >= text.length) {
        // all white? just return it
        return {
            pre: text
        };
    }

    if (i > 0) {
        ret.pre = text.substring(0, i);
        text = text.substring(i);
    }

    for (i = text.length-1; i > -1 && utils.isWhite(text.charAt(i)); i--);

    if (i < text.length-1) {
        ret.post = text.substring(i+1);
        text = text.substring(0, i+1);
    }

    ret.text = text;

    logger.trace('text: pre is "' + ret.pre + '" value is "' + ret.text + '" and post is "' + ret.post + '"');

    return ret;
}

// schemes are registered in the IANA list
var reUrl = /^(https?|github|ftps?|mailto|file|data|irc):\/\/[\S]+$/;

/**
 * Return true if the given string contains translatable text,
 * and false otherwise. For example, a string extracted with only
 * punctuation or only an URL in it is not translatable.
 *
 * @param {string} str the string to test
 * @returns {boolean} true if the given string contains translatable text,
 * and false otherwise.
 */
MarkdownFile.prototype.isTranslatable = function(str) {
    if (!str || !str.length || !str.trim().length) return false;

    if (!this.localizeLinks) {
        reUrl.startIndex = 0;
        var match = reUrl.exec(str);
        if (match && match.length) return false;
    }

    return utils.containsActualText(str);
}

/**
 * @param {boolean} escape true if you want the translated
 * text to be escaped for attribute values
 * @private
 */
MarkdownFile.prototype._emitText = function(escape) {
    if (!this.message.getTextLength()) return;

    var text = this.message.getMinimalString();

    logger.trace('text using message accumulator is: ' + text);

    if (this.message.isTranslatable || this.isTranslatable(text)) {
        this._addTransUnit(text, this.comment);
        var prefixes = this.message.getPrefix();
        var suffixes = this.message.getSuffix();

        prefixes.concat(suffixes).forEach(function(end) {
            if (typeof(end) === "object") {
                end.localizable = false;
            }
        });
    }

    this.comment = undefined;
    this.message = new MessageAccumulator();
};

var reAttrNameAndValue = /\s(\w+)(\s*=\s*('((\\'|[^'])*)'|"((\\"|[^"])*)"))?/g;

/**
 * @private
 */
MarkdownFile.prototype._findAttributes = function(tagName, tag) {
    var match, name;
    var ret = [];

    // If this is a multiline HTML tag, the parser does not split it for us.
    // It comes as one big ole HTML tag with the open, body, and close all as
    // one. As such, we should only search the initial open tag for translatable
    // attributes.
    if (tag.indexOf('\n') > -1) {
        reWholeTag.lastIndex = 0;
        var match = reWholeTag.exec(tag);
        if (match) {
            tag = match[0];
        }
    }

    reAttrNameAndValue.lastIndex = 0;
    while ((match = reAttrNameAndValue.exec(tag)) !== null) {
        var name = match[1],
            value = (match[4] && match[4].trim()) || (match[6] && match[6].trim()) || "";
        if (value && name === "title" || (utils.localizableAttributes[tagName] && utils.localizableAttributes[tagName][name])) {
            this._addTransUnit(value);
        }
    }

    return ret;
}

/**
 * @private
 */
MarkdownFile.prototype._localizeAttributes = function(tagName, tag, locale, translations) {
    var match, name;
    var ret = "<" + tagName;
    var rest = "";
    var attributes = {};

    // If this is a multiline HTML tag, the parser does not split it for us.
    // It comes as one big ole HTML tag with the open, body, and close all as
    // one. As such, we should only search the initial open tag for translatable
    // attributes.
    if (tag.indexOf('\n') > -1) {
        reWholeTag.lastIndex = 0;
        var match = reWholeTag.exec(tag);
        if (match) {
            rest = tag.substring(match.index + match[0].length);
            tag = match[0];
        }
    }

    reAttrNameAndValue.lastIndex = 0;
    while ((match = reAttrNameAndValue.exec(tag)) !== null) {
        var name = match[1],
            value = (match[4] && match[4].trim()) || (match[6] && match[6].trim()) || "";
        if (value) {
            if (name === "title" || (utils.localizableAttributes[tagName] && utils.localizableAttributes[tagName][name])) {
                var translation = this._localizeString(value, locale, translations);
                attributes[name] = translation || value;
            } else {
                attributes[name] = value;
            }
        } else {
            attributes[name] = "true";
        }
    }

    for (var attr in attributes) {
        ret += " " + attr + ((attributes[attr] !== "true") ? '="' + attributes[attr] + '"' : "");
    }
    ret += '>' + rest;

    return ret;
}

var reTagName = /<(\/?)\s*(\w+)(\s|>)/;
var reL10NComment = /<!--\s*[iI]18[Nn]\s*(.*)\s*-->/;

var reDirectiveComment = /<!--\s*i18n-(en|dis)able\s+(\S*)\s*-->/;

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
            var parts = trim(node.value);
            // only localizable if there already is some localizable text
            // or if this text contains anything that is not whitespace
            if (this.message.getTextLength() > 0 || parts.text) {
                this.message.addText(node.value);
                this.message.isTranslatable = this.localizeLinks;
                node.localizable = true;
            }
            break;

        case 'delete':
        case 'link':
        case 'emphasis':
        case 'strong':
            node.title && this._addTransUnit(node.title);
            if (node.children && node.children.length) {
                this.message.push({
                    name: node.type,
                    node: node
                });
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
                this.message.pop();

                node.localizable = node.children.every(function(child) {
                    return child.localizable;
                });
            }
            break;

        case 'image':
        case 'imageReference':
            node.title && this._addTransUnit(node.title);
            node.alt && this._addTransUnit(node.alt);
            // images are non-breaking, self-closing nodes
            // this.text += '<c' + this.componentIndex++ + '/>';
            if (this.message.getTextLength()) {
                node.localizable = true;
                this.message.push(node);
                this.message.pop();
            }
            break;

        case 'definition':
            // definitions are breaking nodes
            this._emitText();
            if (node.url && this.localizeLinks) {
                var value = node.url;
                var parts = trim(value);
                // only localizable if there already is some localizable text
                // or if this text contains anything that is not whitespace
                if (parts.text) {
                    this._addTransUnit(node.url);
                    node.localizable = true;
                }
                node.title && this._addTransUnit(node.title);
            }
            break;

        case 'footnoteDefinition':
            // definitions are breaking nodes
            this._emitText();
            break;

        case 'linkReference':
            // inline code nodes and link references are non-breaking
            // Also, pass true to the push so that this node is never optimized out of a string,
            // even at the beginning or end.
            node.localizable = true;
            if (node.referenceType === "shortcut") {
                // convert to a full reference with a text child
                // so that we can have a separate label and translated title
                if (!node.children || !node.children.length) {
                    var child = new Node({
                        type: "text",
                        value: node.label,
                        children: []
                    });
                    node.children.push(child);
                }
                node.referenceType = "full";
            }
            this.message.push(node, true);
            if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    this._walk(child);
                }.bind(this));
            }
            this.message.pop();
            break;

        case 'inlineCode':
            node.localizable = true;
            this._addComment("c" + this.message.componentIndex + " will be replaced with the inline code `" + node.value + "`.");
            this.message.push(node, true);
            this.message.pop();
            break;

        case 'html':
            reTagName.lastIndex = 0;
            if (node.value.trim().substring(0, 4) === '<!--') {
                reDirectiveComment.lastIndex = 0;
                match = reDirectiveComment.exec(node.value);
                if (match) {
                    if (match[2] === "localize-links") {
                        this.localizeLinks = (match[1] === "en");
                    }
                } else {
                    reL10NComment.lastIndex = 0;
                    match = reL10NComment.exec(node.value);
                    if (match) {
                        this._addComment(match[1].trim());
                    }
                }
                // ignore HTML comments
                break;
            }
            match = reTagName.exec(node.value);

            if (match) {
                var tagName = match[2];
                if (match[1] !== '/') {
                    // opening tag
                    if (this.message.getTextLength()) {
                        if (utils.nonBreakingTags[tagName]) {
                            this.message.push({
                                name: tagName,
                                node: node
                            });
                            node.localizable = true;
                        } else {
                            // it's a breaking tag, so emit any text
                            // we have accumulated so far
                            this._emitText();
                        }
                    }
                    this._findAttributes(tagName, node.value);
                } else {
                    // closing tag
                    if (this.message.getTextLength()) {
                        if (utils.nonBreakingTags[tagName] && this.message.getCurrentLevel() > 0) {
                            var tag = this.message.pop();
                            while (tag.name !== tagName && this.message.getCurrentLevel() > 0) {
                                tag = this.message.pop();
                            }
                            if (tag.name !== tagName) {
                                throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                                    node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                            }
                            node.localizable = true;
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
                node.children.forEach(function(child, index, array) {
                    if (child.type === 'linkReference') {
                        if (child.identifier.substring(0, 6) === "block:") {
                            this._emitText();
                            valid = false;
                        } else if (child.identifier.substring(0, 6) === "/block") {
                            valid = true;
                            return;
                        }
                    } else if (child.type === 'thematicBreak') {
                        if (index+1 < array.length && array[index+1]) {
                            var p = array[index+1];
                            if (p.type === 'paragraph' &&
                                p.children &&
                                p.children.length > 0 &&
                                p.children[0].type === "text" &&
                                p.children[0].value.substring(0, 6) === "title:") {
                                valid = false;
                            } else {
                                valid = true;
                            }
                        } else {
                            valid = true;
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

    // massage the broken headers and code blocks a bit first so that the parser
    // works as expected
    data = data.
        replace(/\[block:/g, "```\n[block:").
        replace(/\[\/block\]/g, "[/block]\n```").
        replace(/(^|\n)(#+)([^#\s])/g, "\n$2 $3");

    this.ast = mdparser.parse(data);

    // accumulates characters in text segments
    // this.text = "";
    this.message = new MessageAccumulator();
    this.resourceIndex = 0;

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
};

//we don't write Markdown source files
MarkdownFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
MarkdownFile.prototype.getLocalizedPath = function(locale) {
    var pathName = this.pathName.
        replace("\/" + this.project.sourceLocale + "\/", "/" + locale + "/").
        replace(new RegExp("^" + this.project.sourceLocale + "\/"), locale + "/");
    if (pathName !== this.pathName) return pathName;

    // if we haven't replaced a source locale path component with the current locale
    // then add it to the beginning of the path.
    return path.join(locale, this.pathName);
};

/**
 * @private
 */
MarkdownFile.prototype._localizeString = function(source, locale, translations) {
    if (!source) return source;

    var key = this.makeKey(utils.escapeInvalidChars(source));
    var hashkey = ResourceString.hashKey(this.project.getProjectId(), locale, key, "markdown");
    var translatedResource = translations.get(hashkey);
    var translation;

    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
        translation = source;
    } else if (translatedResource) {
        translation = translatedResource.getTarget();
    } else if (this.type) {
        if (source && this.type.pseudos && this.type.pseudos[locale]) {
            var sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
            if (sourceLocale !== this.project.sourceLocale) {
                // translation is derived from a different locale's translation instead of from the source string
                var sourceRes = translations.get(ResourceString.hashKey(
                        this.project.getProjectId(), sourceLocale, this.makeKey(escapeInvalidChars(source)), "markdown"));
                source = sourceRes ? sourceRes.getTarget() : source;
            }
            translation = this.type.pseudos[locale].getString(source);
        } else {
            logger.trace("New string found: " + source);
            this.type.newres.add(new ResourceString({
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: utils.escapeInvalidChars(source),
                targetLocale: locale,
                target: utils.escapeInvalidChars(source),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                datatype: "markdown",
                index: this.resourceIndex++
            }));

            translation = source;

            if (this.type.missingPseudo && !this.project.settings.nopseudo) {
                translation = this.type.missingPseudo.getString(source);
            }
        }
    } else {
        translation = source;
    }

    return translation;
};

/**
 * @private
 */
MarkdownFile.prototype._addComment = function(comment) {
    if (!this.comment) {
        this.comment = comment;
    } else {
        this.comment += " " + comment;
    }
};

/**
 * @private
 */
MarkdownFile.prototype._localizeNode = function(node, message, locale, translations) {
    var match, valid, translation;

    switch (node.type) {
        case 'text':
            var parts = trim(node.value);
            // only localizable if there already is some localizable text
            // or if this text contains anything that is not whitespace
            if (node.localizable || parts.text) {
                message.addText(node.value);
            }
            break;

        case 'delete':
        case 'link':
        case 'emphasis':
        case 'strong':
            if (node.title) {
               node.title = this._localizeString(node.title, locale, translations);
            }
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else {
                    message.pop();
                }
            }
            break;

        case 'image':
        case 'imageReference':
            if (node.title) {
                node.title = this._localizeString(node.title, locale, translations);
            }
            if (node.alt) {
                node.alt = this._localizeString(node.alt, locale, translations);
            }
            // images are non-breaking, self-closing nodes
            if (node.localizable) {
                message.push(node);
                message.pop();
            }
            break;

        case 'linkReference':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node, true);
                } else if (node.use === "startend") {
                    message.push(node, true);
                    message.pop();
                } else {
                    message.pop();
                }
            }
            break;

        case 'inlineCode':
            // inline code is a non-breaking, self-closing node
            if (node.localizable) {
                message.push(node, true);
                message.pop();
            }
            break;

        case 'definition':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else {
                    message.pop();
                }

                if (node.url) {
                    node.url = this._localizeString(node.url, locale, translations);
                }
                if (node.title) {
                    node.title = this._localizeString(node.title, locale, translations);
                }
            }
            break;

        case 'footnoteDefinition':
            if (node.localizable) {
                if (node.use === "start") {
                    message.push(node);
                } else {
                    message.pop();
                }
            }
            break;

        case 'html':
            reTagName.lastIndex = 0;
            if (node.value.trim().substring(0, 4) === '<!--') {
                reL10NComment.lastIndex = 0;
                match = reL10NComment.exec(node.value);
                if (match) {
                    this._addComment(match[1].trim());
                }
                // ignore HTML comments
                break;
            }
            match = reTagName.exec(node.value);

            if (match) {
                var tagName = match[2];
                if (match[1] !== '/') {
                    // opening tag
                    node.value = this._localizeAttributes(tagName, node.value, locale, translations);
                    if (node.localizable && utils.nonBreakingTags[tagName]) {
                        node.name = tagName;
                        message.push(node);
                    }
                } else {
                    // closing tag
                    if (node.localizable && utils.nonBreakingTags[tagName] && message.getCurrentLevel() > 0) {
                        var tag = message.pop();
                        while (tag.name !== tagName && message.getCurrentLevel() > 0) {
                            tag = message.pop();
                        }
                        if (tag.name !== tagName) {
                            throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                                node.position.start.line + " column " + node.position.start.column + ". Unbalanced HTML tags.");
                        }
                    }
                }
            } else {
                throw new Error("Syntax error in markdown file " + this.pathName + " line " +
                    node.position.start.line + " column " + node.position.start.column + ". Bad HTML tag.");
            }
            break;

        default:
            break;
    }
};

function flattenHtml(node) {
    var ret = [];

    if (node.type === "html") {
        var children = node.children;
        node.children = undefined;
        ret.push(node);
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                ret = ret.concat(flattenHtml(children[i]));
            }
            ret.push({
                type: "html",
                value: '</' + node.name + '>'
            });
        }
    } else {
        ret.push(node);
    }
    return ret;
}

function mapToAst(node) {
    var children = [];

    for (var i = 0; i < node.children.length; i++) {
        var child = mapToAst(node.children[i]);
        if (child.type === "html") {
            // flatten any HTML
            children = children.concat(flattenHtml(child));
        } else {
            children.push(child);
        }
    }
    if (node.type === "code" && node.value.startsWith("[block:")) {
        node.type = "html";
    }
    if (node.extra) {
        if (children.length) {
            node.extra.children = node.extra.children ? node.extra.children.concat(children) : children;
        }
        return node.extra;
    }
    return u(node.type, node, children);
}

MarkdownFile.prototype._getTranslationNodes = function(locale, translations, ma) {
    if (ma.getTextLength() === 0) {
        // nothing to localize
        return undefined;
    }

    var text = ma.getMinimalString();

    var key = this.makeKey(utils.escapeInvalidChars(text));
    var translation = this._localizeString(text, locale, translations);

    if (translation) {
        var transMa = MessageAccumulator.create(translation, ma);
        var nodes = transMa.root.toArray();
        // don't return the "root" start and end nodes
        nodes = nodes.slice(1, -1);

        // warn about components in the target that don't exist in the source,
        // and remove them from the node array as if they didn't exist
        var maxIndex = Object.keys(ma.getMapping()).length;
        var mismatch = false;

        for (i = 0; i < nodes.length; i++) {
           if (nodes[i].type == 'component' && (!nodes[i].extra || nodes[i].index > maxIndex)) {
               nodes.splice(i, 1);
               mismatch = true;
           }
        }
        if (mismatch) {
            logger.warn("Warning! Translation of\n'" + text + "' (key: " + key + ")\nto locale " + locale + " is\n'" + translation + "'\nwhich has a more components in it than the source.");
        }

        if (this.project.settings.identify) {
            var tmp = [];
            tmp.push(new Node({
                type: "html",
                use: "start",
                name: "span",
                extra: u("html", {
                    value: '<span x-locid="' + key + '">',
                    name: "span"
                })
            }));
            tmp = tmp.concat(nodes);
            tmp.push(new Node({
                type: "html",
                use: "end",
                name: "span",
                extra: u("html", {
                    value: '</span>',
                    name: "span"
                })
            }));
            nodes = tmp;
        }

        return nodes;
    }

    return undefined;
};

function mapToNodes(astNode) {
    var node = new Node(astNode);
    if (astNode.children) {
        for (var i = 0; i < astNode.children.length; i++) {
            node.add(mapToNodes(astNode.children[i]));
        }
    }
    return node;
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
MarkdownFile.prototype.localizeText = function(translations, locale) {
    var output = "";
    this.resourceIndex = 0;

    logger.debug("Localizing strings for locale " + locale);

    // copy the ast for this locale so that we don't modify the original
    var ast = unistFilter(this.ast, function(node) {
        return true;
    });

    // flatten the tree into an array and then walk the array finding
    // localizable segments that will get replaced with the translation
    var nodeArray = mapToNodes(ast).toArray();

    var valid = true, start = -1, end, ma = new MessageAccumulator();

    for (var i = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].type === 'linkReference') {
            if (nodeArray[i].identifier.substring(0, 6) === "block:") {
                valid = false;
            } else if (nodeArray[i].identifier.substring(0, 6) === "/block" && nodeArray[i].use === "end") {
                valid = true;
            }
        }

        if (valid) this._localizeNode(nodeArray[i], ma, locale, translations);

        if (valid && nodeArray[i].localizable) {
            if (start < 0) {
                start = i;
            }
            end = i;
        } else if (start > -1) {
            if (this.isTranslatable(ma.getMinimalString())) {
                var nodes = this._getTranslationNodes(locale, translations, ma);
                if (nodes) {
                    // replace the source nodes with the translation nodes
                    var prefix = ma.getPrefix();
                    var suffix = ma.getSuffix();
                    nodeArray = nodeArray.slice(0, start).concat(prefix).concat(nodes).concat(suffix).concat(nodeArray.slice(end+1));

                    // adjust for the difference in node length of the source and translation
                    i += nodes.length - (end - start) - 1;
                } // else leave the source nodes alone and register this string as new
            }
            start = -1;
            ma = new MessageAccumulator();
        }
        if (!valid && nodeArray[i] && nodeArray[i].value) nodeArray[i].value = escapeQuotes(nodeArray[i].value);
    }

    // in case any is left over at the end
    if (start > -1 && ma.getTextLength()) {
        var nodes = this._getTranslationNodes(locale, translations, ma);
        if (nodes) {
            // replace the last few source nodes with the translation nodes
            var prefix = ma.getPrefix();
            var suffix = ma.getSuffix();
            nodeArray = nodeArray.slice(0, start).concat(prefix).concat(nodes).concat(suffix).concat(nodeArray.slice(end+1));
        } // else leave the source nodes alone
    }

    // convert to a tree again
    ast = mapToAst(Node.fromArray(nodeArray));

    var str = mdstringify.stringify(ast);

    // make sure the thematic breaks don't have blank lines after them and they
    // don't erroneously escape the backslash chars
    str = str.
        replace(/---\n\n/g, "---\n").
        replace(/\n\n---/g, "\n---");

    return str;
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
};

module.exports = MarkdownFile;
