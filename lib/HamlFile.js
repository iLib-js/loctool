/*
 * HamlFile.js - plugin to extract resources from a Haml source code file
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
var utils = require("./utils.js");
var ilib = require("ilib");
var IString = require("ilib/lib/IString.js");
var isSpace = require("ilib/lib/isSpace.js");
var log4js = require("log4js");
var jsstl = require("js-stl");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");
var Locale = require("ilib/lib/Locale.js");

var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var Queue = jsstl.Queue;

var logger = log4js.getLogger("loctool.lib.HamlFile");

// load the locale data
isSpace._init();

var entjson = fs.readFileSync(path.join(path.dirname(module.filename), "../db/entities.json"), "utf-8");
var entities = JSON.parse(entjson);

/**
 * Create a new Haml file with the given path name and within
 * the given project.
 *
 * @param {Object} options object that controlls the creation
 * of this instance. Should contain at least a project and
 * a file type.
 */
var HamlFile = function(options) {
    if (options) {
        this.project = options.project;
        this.pathName = options.pathName;
        this.type = options.type;
    }
    this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

var reEscapeChar = /\\[ux]([a-fA-F0-9]+)/g;
var reEntities = /&([a-zA-Z0-9]+);/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
HamlFile.unescapeString = function(string) {
    var unescaped = string;

    // Unicode escaped chars
    while ((match = reEscapeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reEscapeChar.lastIndex = 0;
        }
    }

    // convert HTML entities to their actual Unicode characters
    while ((match = reEntities.exec(unescaped))) {
        if (match && match.length > 1 && entities[match[1]]) {
            unescaped = unescaped.replace(match[0], entities[match[1]]);
            reEntities.lastIndex = 0;
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
HamlFile.cleanString = function(string) {
    var unescaped = HamlFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\u2028/,' ').
        replace(/\\[btnfr]/g, " ").
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
HamlFile.prototype.makeKey = function(source) {
    return utils.hashKey(HamlFile.cleanString(source));
};

var reRubySubstitution = /#{("(\\"|[^"])*"|'(\\'|[^'])*'|[^}])*}/g;

/**
 * Escape the text.
 *
 * @static
 * @param {String} str the string to escape
 * @return {String} the escaped string
 */
HamlFile.escape = function(str) {
    if (!str) return str;

    // only escape things outside of the ruby substitution code
    var match, ret = "";

    reRubySubstitution.lastIndex = 0;
    while ((match = reRubySubstitution.exec(str)) !== null) {
        ret += str.substring(0, match.index).replace(/&/g, "&amp;");
        ret += match[0];
        str = str.substring(match.index + match[0].length);
        reRubySubstitution.lastIndex = 0;
    }

    if (str) {
        ret += str.replace(/&/g, "&amp;");
    }

    return ret;
};

var reHtml = /<\/?("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g;

function containsActualText(str) {
    // remove the html and entities first
    var unescaped = HamlFile.unescapeString(str);
    reHtml.lastIndex = 0;
    reRubySubstitution.lastIndex = 0;
    var cleaned = unescaped.replace(reHtml, "").
        replace(reRubySubstitution, "");

    for (i = 0; i < cleaned.length; i++) {
        var c = cleaned.charAt(i);
        if (isAlnum(c) || isIdeo(c)) return true;
    }
    return false;
}

function escapeInvalidChars(str) {
    /*
    var ret = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 0x09 || (c > 0x0D && c < 0x20)) {
            ret += "&#" + c + ";";
        } else {
            ret += str.charAt(i);
        }
    }
    */
    return str;
};

var brackets = {
    '[': ']',
    '{': '}',
    '(': ')'
};

var reBrackets = /[\{\(\[]/;

/**
 * Find the first bracket and then match it, consuming all
 * text until the brackets are balanced or the end of file
 * is reached.
 *
 * @private
 * @param {Number} start the index into the line to start searching
 * @returns {Number} the index of the closing bracket that matches the next opening one.
 */
HamlFile.prototype.findMatchingBrackets = function(start) {
    var opener, closer;
    var stack = 0, i, lastclose = -1;
    var line, currentline = this.currentLine - 1;

    if (this.currentLine >= this.lines.length || start >= this.lines[this.currentLine].length) {
        // don't go beyond the end of the array or the line
        return start;
    }

    do {
        line = this.lines[++currentline];
        i = start;
        // first eat up all the initial whitespace
        while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
            i++;
        }
        // now find the first bracket and match it
        while (i < line.length) {
            if (line[i] === '"' || line[i] === "'") {
                // skip quoted strings -- they do not contribute to the stack of brackets
                var quote = line[i];
                while (i < line.length && line[i] !== quote) {
                    if (line[i] === '\\') {
                        // skipped escaped chars
                        i++;
                    }
                    i++;
                }
            } else if (brackets[line[i]]) {
                if (stack === 0) {
                    opener = line[i];
                    closer = brackets[line[i]];
                    stack = 1;
                } else if (line[i] === opener) {
                    stack++;
                }
            } else if (stack && line[i] === closer) {
                stack--;
                if (stack === 0) {
                    opener = closer = undefined;
                    lastclose = i;
                }
            } else if (stack === 0 && (line[i] === ' ' || line[i] === '\t')) {
                // found the end of the tag part
                if (lastclose === -1) {
                    lastclose = i-1;
                }
                break;
            }

            i++;
        }
        start = 0;
    } while (stack > 0 && currentline < this.lines.length-1);

    this.currentLine = currentline;

    return lastclose > -1 ? lastclose : i;
}

/**
 * Return the index of the first character on the line
 * that could form localizable text.
 *
 * @param {Number} start the index into the line to start searching
 * @returns {Number} the index of the first character in the current
 * line that may contain localizable text after the current control sequence
 */
HamlFile.prototype.firstLocalizable = function(start) {
    var line = this.lines[this.currentLine];
    var first = start;

    while (first < line.length && line[first] !== ' ' && line[first] !== '\t' && !(line[first] in brackets)) {
        first++;
    }

    if (line[first] in brackets) {
        var match = this.findMatchingBrackets(first);
        first = match + 1; // last points to the matching bracket, so go to the next char
        line = this.lines[this.currentLine];

        // skip any possible suffixes
        while (first < line.length && line[first] !== ' ' && line[first] !== '\t') {
            first++;
        }
    }

    if (first < line.length) {
        // skip any whitespace
        while (first < line.length-1 && line[first] === ' ' || line[first] === '\t') {
            first++;
        }
    }

    return first;
};

/**
 * Find the end of the current ruby code.
 *
 * @param {Number} start the index into the line to start searching
 * @returns {Number} the index of the first character that may contain localizable text after the current ruby code
 */
HamlFile.prototype.findEndOfRuby = function(start) {
    var line, indent, nextLine, index;

    line = this.lines[this.currentLine];
    var index = this.indentation(line, 0);

    if (line[line.length-1] === '|') {
        while (line[line.length-1] === '|' && this.currentLine < this.lines.length) {
            this.currentLine++;
            line = this.lines[this.currentLine];
        }
        this.currentLine--;
        index = this.indentation(line, 0);
    } else {
        while (index < line.length) {
            // if there are brackets in this line, match it and perhaps even advance to other lines
            if (line[index] in brackets) {
                var match = this.findMatchingBrackets(index);
                line = this.lines[this.currentLine];
                index = match + 1; // last points to the matching bracket, so go to the next char
            } else {
                index++;
            }
        }
    }
    return index;
};

/**
 * Calculate the indentation level of a line.
 *
 * @param {String} data the data to search
 * @param {Number} start The start parameter gives the index into
 * the data string to start searching
 * @return {Number} the number of characters of indentation for
 * this line
 */
HamlFile.prototype.indentation = function(data, start) {
    var i = 0;

    // first search backwards to the previous return, then forwards to first non-space
    while (start+i > 0 && data[start+i] !== '\n') {
        i--;
    }

    start += i;
    if (data[start] === '\n') start++;
    i = 0;

    while (start+i < data.length && data[start+i] !== '\n' && isSpace(data[start+i])) {
        i++;
    }

    return i;
};

/**
 * Advance the current line index to the last line that has more
 * indent than the starting line.
 * @private
 */
HamlFile.prototype.findMatchingIndent = function() {
    var firstIndent = this.indentation(this.lines[this.currentLine], 0);
    var nextLine = this.currentLine + 1;

    // '|' at the end is the line continuation character
    while (nextLine < this.lines.length &&
            (this.indentation(this.lines[nextLine], 0) > firstIndent || this.lines[nextLine].substr(-1) === '|' || this.lines[nextLine].trim() === "")) {
        nextLine++;
    }

    this.currentLine = nextLine - 1;
    return this.currentLine;
};

var reTagName = /\s*%([a-zA-Z.\-_#]*)/g;
var reId = /#([a-zA-Z\-_]*)/g;
var reClassName = /\.([a-zA-Z.\-_]*)/g;
var reAttrs = /\{([^}'"]|'[^']*'|"[^"]*")*\}/g;
var reAttrArrow = /:(\w+)\s*=>\s*('[^']*'|"[^"]*")/g;
var reAttrColon = /(\w+)\s*:\s*('[^']*'|"[^"]*")/g;

/**
 * Find the HTML tag name in the current line starting at the given index.
 * @private
 */
HamlFile.prototype.tagName = function() {
    var line = this.lines[this.currentLine];
    reTagName.lastIndex = 0;
    var match = reTagName.exec(line);

    if (match === null) {
        return "";  // no tag found!
    }

    reId.lastIndex = 0;
    var parts = match[1].replace(reId, "").split(".");

    return parts[0];
};

/**
 * Convert the haml tag name in the current line starting at the given index to
 * real HTML and return it.
 * @param {number} start the starting index in the current line
 * @private
 */
HamlFile.prototype.convertTag = function(start) {
    var line = this.lines[this.currentLine];
    reTagName.lastIndex = 0;
    var match = reTagName.exec(line);
    var id;

    if (match === null) {
        return "";  // no tag found!
    }

    var slashSuffix = line[match[0].length] === '/';
    var tagplus = match[1];
    reId.lastIndex = 0;
    match = reId.exec(tagplus);
    if (match !== null) {
        id = match[1];
        reId.lastIndex = 0;
        tagplus = tagplus.replace(reId, "");
    }

    var parts = tagplus.split(".");
    var tag = parts[0];

    var ret = "<" + tag;

    if (id) {
        ret += ' id="' + id + '"';
    }

    if (parts.length > 1) {
        ret += ' class="' + parts.slice(1).join(" ") + '"';
    }

    reAttrs.lastIndex = 0;
    match = reAttrs.exec(line);
    if (match !== null) {
        var len = 0;
        var attrs = match[0];
        var re = (attrs.indexOf("=>") > -1) ? reAttrArrow : reAttrColon;
        re.lastIndex = 0;
        match = re.exec(attrs);
        while (match !== null) {
            len = re.lastIndex;
            ret += ' ' + match[1] + '=' + match[2];
            match = re.exec(attrs);
        }

        if (len < attrs.length-1 && attrs.substring(len).replace(/\s/g, '').replace(/\}/g, '').length) {
            // if we didn't use up the whole attrs string, then there was code or something
            // else in there that cannot be encoded as attributes. This prevents converting
            // this to a tag.
            return "";
        }
    }

    if (slashSuffix) ret += '/';
    ret += '>';

    return ret;
};

/**
 * Add a chunk of localizable text to the buffers. If there is
 * existing localizable text, it will be appended to that text.
 * If there is not, it will form a new localizable segment. If
 * there is existing non-localizable text in the buffer, that
 * will be added as a non-localizable segment first before the
 * current text is added to the localizable buffer.
 *
 * @param {String} data the text to add
 * @param {String} original original version of the text to add
 * @param {boolean=} nonspace true if the text should be added
 * without prepending a space first
 */
HamlFile.prototype.emitLocalized = function(data, original, nonspace) {
    if (this.nonLocalizedBuffer.length > 0) {
        this.segments.enqueue({
            localizable: false,
            text: this.nonLocalizedBuffer
        });

        this.nonLocalizedBuffer = "";
    }

    if (data) {
        if (this.localizedBuffer && !nonspace) {
            this.localizedBuffer += ' ';
        }
        this.localizedBuffer += data;
        if (original) this.originalBuffer += original;
    }
};

/**
 * Add a chunk of non-localizable text to the buffers. If there
 * is existing non-localizable text, it will be appended to
 * that text. If there is not, it will form a new non-localizable
 * segment. If there is existing localizable text in the buffer,
 * that will be added as a localizable segment first before
 * the current text is added to the non-localizable buffer.
 *
 * @param {String} data the text to add
 */
HamlFile.prototype.emitNonLocalized = function(data) {
    if (this.localizedBuffer.length > 0) {
        if (containsActualText(this.localizedBuffer)) {
            var unescaped = escapeInvalidChars(HamlFile.unescapeString(this.localizedBuffer));

            this.segments.enqueue({
                localizable: true,
                text: unescaped,
                original: this.originalBuffer
            });

            this.set.add(new ResourceString({
                project: this.project.getProjectId(),
                key: this.makeKey(unescaped),
                sourceLocale: this.project.sourceLocale,
                source: unescaped,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }));
            this.nonLocalizedBuffer += '\n';
        } else {
            // nothing to localize, so just add it to the non localized buffer instead
            this.nonLocalizedBuffer += this.localizedBuffer + '\n';
        }
        this.localizedBuffer = "";
        this.originalBuffer = "";
    }

    if (data) this.nonLocalizedBuffer += data;
};

/**
 * Add localizable text to the buffers based on whether or
 * not the line is blank, there is previous localizable text
 * or there is an outdent.
 *
 * @param {number} currentIndent current indent of previous
 * lines to compare to the indent of the current line
 */
HamlFile.prototype.addLocalizable = function(currentIndent) {
    var line = this.lines[this.currentLine];
    lineIndent = this.indentation(line, 0);

    if (!containsActualText(line)) {
        this.emitNonLocalized(line + '\n');
    } else if (lineIndent < currentIndent || !this.localizedBuffer) {
        // new string, so end the current one
        this.emitNonLocalized(line.substring(0, lineIndent));
        var rest = line.substring(lineIndent);
        this.emitLocalized(rest, rest + '\n');
    } else {
        // glue this to the previous localizable text, dropping the new line and indent
        var rest = line.substring(lineIndent);
        this.emitLocalized(rest, rest + '\n');
    }
}

// suffixes that can appear after a div tag in haml.
// eg. %p= Rb.t("ruby code")
var tagSuffixes = /([<>\/=]+)\s*$/;

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
HamlFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    var i = 0,
        currentIndent = 0,
        lineIndent = 0,
        start,
        line,
        state = "default",
        blank;

    this.segments = new Queue();
    this.localizedBuffer = ""; // localizable text buffer
    this.originalBuffer = "";  // original lines containing that same localizable text
    this.nonLocalizedBuffer = ""; // non localized text buffer
    this.resourceIndex = 0;

    this.lines = data.split('\n');

    if (data.substr(-1) === '\n') {
        // the return at the end of the file doesn't mean a blank line, so remove it
        this.lines.splice(this.lines.length-1);
    }
    this.currentLine = 0;

    while (this.currentLine < this.lines.length) {
        line = this.lines[this.currentLine];
        lineIndent = this.indentation(line, 0);
        blank = !containsActualText(line);

        if ((line[lineIndent] === '!' || line[lineIndent] === '&') && lineIndent < line.length && line[lineIndent+1] === '=') {
            // HTML-safe and unsafe ruby code
            var startLine = this.currentLine;
            this.findMatchingIndent();
            var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
            this.emitNonLocalized(nonLocalizable + '\n');
        } else if (lineIndent < line.length-3 && line[lineIndent] === '!' && line[lineIndent+1] === '!' && line[lineIndent+2] === '!') {
            // DOCTYPE tag
            this.emitNonLocalized(line + '\n');
        } else if (line[lineIndent] === '#' && lineIndent < line.length && line[lineIndent+1] === '{') {
            // hash substitution instead of a div with a hash id
            this.addLocalizable(currentIndent);
        } else {
            switch (line[lineIndent]) {
            case '/': // comment -- just skip it and anything indented inside it
                var startLine = this.currentLine;
                this.findMatchingIndent();
                var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
                this.emitNonLocalized(nonLocalizable + '\n');
                break;

            case '=': // ruby code
                var startLine = this.currentLine;
                this.findEndOfRuby(lineIndent);
                var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
                this.emitNonLocalized(nonLocalizable + '\n');
                break;

            case '-': // instructions
                var startLine = this.currentLine;
                if (line[lineIndent+1] !== "#") {
                    var match;
                    if ((match = reBrackets.exec(line)) !== null) {
                        // if there are brackets, find the matching ones, which may be a few lines later...
                        this.findMatchingBrackets(match.index);
                    }
                } else {
                    // haml comment -- ignore!
                    this.findMatchingIndent();
                }
                var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
                this.emitNonLocalized(nonLocalizable + '\n');
                break;

            case ':': // stretch of ruby, javascript, sass, etc.
                // skip the whole thing
                var startLine = this.currentLine;
                var end = this.findMatchingIndent();
                var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
                this.emitNonLocalized(nonLocalizable + '\n');
                break;

            // divs
            case '%':
            case '.':
            case '#':
                var startLine = this.currentLine;
                var end = this.firstLocalizable(lineIndent);

                // If there is text before this one, then check if the tag is a non-breaking one.
                // If the tag is a non-breaking tag, convert it to HTML and add it and its text
                // to the localizable buffer. If not, then treat it like non-localizable text.
                if (line[lineIndent] === "%" && this.localizedBuffer.length > 0) {
                    var tag = this.tagName(lineIndent+1);
                    var rest = line.substring(end);
                    if (utils.nonBreakingTags[tag] &&
                            startLine === this.currentLine &&
                            lineIndent >= currentIndent &&
                            (rest.trim() !== "" || utils.selfClosingTags[tag])) {
                        var tagWithAttrs = this.convertTag();
                        // if convertTag returns nothing then we could not convert the text
                        // into an inline tag, so we just have to treat it like a breaking tag
                        if (tagWithAttrs) {
                            this.emitLocalized(tagWithAttrs, tagWithAttrs + '\n');
                            this.emitLocalized(rest.trim(), rest + '\n', true);
                            // don't add the closing tag for a self-closed tag
                            if (!utils.selfClosingTags[tag] && tagWithAttrs.substr(-2) !== "/>") {
                                tagWithAttrs = "</" + tag + ">";
                                this.emitLocalized(tagWithAttrs, tagWithAttrs + '\n', true);
                            }
                            break;
                        }
                    }
                }

                var nonLocalizable = (this.currentLine > startLine) ? this.lines.slice(startLine, this.currentLine-1).join("\n") : "";
                var line = this.lines[this.currentLine];
                lineIndent = this.indentation(line, 0);
                nonLocalizable += line.substring(0, end);
                var localizable = end < line.length ? line.substring(end).trim() : "";
                tagSuffixes.lastIndex = 0;
                var match = tagSuffixes.exec(nonLocalizable)
                if (match !== null && match[1].substr(-1) === "=") {
                    // the rest of the line is ruby code
                    nonLocalizable = line;
                    localizable = "";
                }
                this.emitNonLocalized(nonLocalizable);
                if (localizable) {
                    this.emitLocalized(localizable, line.substring(end));
                    this.emitNonLocalized();
                } else {
                    this.emitNonLocalized('\n');
                }
                break;

            default:
                // not a special line -- treat this as plain old localizable text
                this.addLocalizable(currentIndent);
                break;
            }
        }

        if (!blank) {
            currentIndent = lineIndent;
        }

        this.currentLine++;
    }

    // now clear the buffers -- only one of the two should be doing anything
    this.emitNonLocalized();
    this.emitLocalized();
};

/**
 * Extract all the localizable strings from the Haml file and add them to the
 * project's translation set.
 */
HamlFile.prototype.extract = function() {
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
 * Return the set of resources found in the current Haml file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Haml file.
 */
HamlFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't write HTML template source files
HamlFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
HamlFile.prototype.getLocalizedPath = function(locale) {
    var fullPath = this.pathName;
    var dirName = path.dirname(fullPath);
    var fileName = path.basename(fullPath);
    var localeName = locale; // should be utils.getLocaleDefault(locale);
    var parts = fileName.split(".");

    if (parts.length > 2) {
        if (parts.length > 3 && parts[parts.length-3] === this.project.sourceLocale) {
            parts.splice(parts.length-3, 1, localeName);
        } else {
            parts.splice(parts.length-2, 0, localeName);
        }
    } else if (parts.length > 1) {
        parts.splice(parts.length-1, 0, localeName);
    } else {
        parts.splice(parts.length, 0, localeName);
    }
    return path.join(dirName, parts.join("."));
};

/**
 * Find the translation for the given segment. The segment may have a
 * new, modern translation, or a number of old translations that have
 * to be assembled together.<p>
 *
 * If the modern translation is found, it is returned. If not, this
 * method attempts to recreate the translation from the bits and pieces
 * of old translations. The old haml localizer code would break on
 * any HTML or ruby #{hash} code, and on every single line. As such,
 * the translations are fragmented. The full translation can be
 * re-assembled again by breaking the source string up in the same
 * way as the old code, and looking up the translations of each bit.
 * If the translation could be completely re-assembled, then that
 * re-assembled translation is emitted again to the re-assembled
 * translation set so that it can be added to the modern translations later.
 * If it could not be completely reassembled, then it is not returned
 * and the modern string will appear in the new strings file as normal
 * for a new translation.
 *
 * @param {Object} segment the localizable segment to assemble the translation of
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String|undefined} the re-assembled translation or undefined if not all
 * of the segments of the string could be translated and assembled together
 */
HamlFile.prototype.assembleTranslation = function(segment, translations, locale) {

    var translated = translations.getClean(
            ResourceString.cleanHashKey(
                    this.project.getProjectId(), locale, this.makeKey(segment.text), this.type.datatype));

    if (translated) {
        // modern translation
        return translated.getTarget();
    }

    if (this.type && this.type.pseudos[locale]) {
        // for a pseudo locale, don't cobble together pieces that don't exist. Instead,
        // return nothing here and allow the pseudo locale to generate the whole translation
        return undefined;
    }

    // need to cobble together old translations
    var text = segment.original;
    var match, lines = [], all = true, any = false;

    reHtml.lastIndex = 0;

    // split on newlines and html tags
    text.split('\n').map(function(line) {
        return line.trim();
    }).forEach(function(line) {
        reHtml.lastIndex = 0;
        while ((match = reHtml.exec(line)) !== null) {
            if (match.index) {
                lines.push(line.substring(0, match.index));
            }
            lines.push(match[0]);
            line = line.substring(match.index + match[0].length);
            reHtml.lastIndex = 0;
        }
        if (line.length) {
            lines.push(line);
        }
    });

    // split on html entities as well
    var lines2 = [];
    lines.forEach(function(line) {
        reEntities.lastIndex = 0;
        while ((match = reEntities.exec(line)) !== null) {
            if (match.index) {
                lines2.push(line.substring(0, match.index));
            }
            lines2.push(match[0]);
            line = line.substring(match.index + match[0].length);
            reEntities.lastIndex = 0;
        }
        if (line.length) {
            lines2.push(line);
        }
    });

    var translationList = lines2.map(function(line) {
        if (line[0] === "<" || line[0] === '&') {
            // html tag or entity, just return it unaltered
            return line;
        }
        var translated = translations.getClean(
            ResourceString.cleanHashKey(
                this.project.getProjectId(), locale, this.makeKey(line), this.type.datatype));
        all = all && !!translated;
        any = any || (translated && translated.getTarget() !== line);
        return translated && translated.getTarget();
    }.bind(this));

    // if we don't have translations for everything, just return that fact by returning undefined
    // if (!all) return undefined;

    var l = new Locale(locale).getLanguage();
    var joinchar = (l === "zh" || l === "ja" || l === "th" || l === "km") ? "" : " ";

    translated = translationList[0] || lines2[0];
    for (var i = 1; i < translationList.length; i++) {
        var last = translationList[i-1] || lines2[i-1];
        var current = translationList[i] || lines2[i];

        if ((last[0] !== '<' || last[1] === '/' || current.substr(-2) === "/>") &&
                current.substring(0, 2) !== '</') {
            translated += joinchar;
        }
        translated += current;
    }

    if (translated) {
        translated = HamlFile.unescapeString(translated);

        // save this as the modern translation so that it can be fixed and
        // to speed up localization later
        var target = new ResourceString({
            project: this.project.getProjectId(),
            key: this.makeKey(escapeInvalidChars(segment.text)),
            sourceLocale: this.project.sourceLocale,
            source: escapeInvalidChars(segment.text),
            targetLocale: locale,
            target: translated,
            autoKey: true,
            pathName: this.pathName,
            state: "new",
            datatype: this.type.datatype,
            origin: "target",
            index: this.resourceIndex++
        });
        if (all) {
            this.type.modern.add(target);
        } else {
            if (any) {
                target.comment = target.comment ? target.comment + " " : "";
                target.comment += "Not all segments are completely translated. Needs an review."
            }
            this.type.newres.add(target);
        }

        // also save this in the translation set so that later pseudo localizations
        // can use it as the source if necessary
        translations.add(target);
    }

    return translated;
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String|undefined} the localized text of this file or undefined
 * if there is no change from English
 */
HamlFile.prototype.localizeText = function(translations, locale) {
    this.segments.rewind();
    var segment = this.segments.current();
    var output = "";
    var dirty = false;
    this.resourceIndex = 0;

    while (segment) {
        if (segment.localizable) {
            var hashkey = ResourceString.cleanHashKey(this.project.getProjectId(), locale, this.makeKey(segment.text), this.type.datatype);
            var translated = this.assembleTranslation(segment, translations, locale);
            if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                // ret[key] = segment.text;
                additional = segment.text;
            } else if (!translated && this.type && this.type.pseudos[locale]) {
                var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                if (sourceLocale !== this.project.sourceLocale) {
                    // translation is derived from a different locale's translation instead of from the source string
                    var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                            this.project.getProjectId(), sourceLocale, this.makeKey(segment.text), this.type.datatype));
                    source = sourceRes ? sourceRes.getTarget() : segment.text;
                    additional = this.type.pseudos[locale].getString(source);
                    dirty |= (sourceRes && additional !== segment.text);
                } else {
                    additional = this.type.pseudos[locale].getString(segment.text);
                    dirty |= (additional !== segment.text);
                }
            } else {
                var additional;
                if (translated) {
                    additional = translated;
                    dirty |= (additional != segment.text);
                } else {
                    if (this.type && containsActualText(segment.text)) {
                        logger.trace("New string found: " + segment.text);
                        this.type.newres.add(new ResourceString({
                            project: this.project.getProjectId(),
                            sourceLocale: this.project.sourceLocale,
                            source: escapeInvalidChars(segment.text),
                            targetLocale: locale,
                            target: escapeInvalidChars(segment.text),
                            key: this.makeKey(escapeInvalidChars(segment.text)),
                            autoKey: true,
                            pathName: this.pathName,
                            state: "new",
                            datatype: this.type.datatype,
                            index: this.resourceIndex++
                        }));
                        additional = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                                this.type.missingPseudo.getString(segment.text) : segment.text;
                        dirty |= (additional != segment.text);
                    } else {
                        additional = segment.text;
                    }
                }
            }

            if (this.project.settings.identify) {
                additional = '<span loclang="haml" locid="' + utils.escapeQuotes(this.makeKey(escapeInvalidChars(segment.text))) + '">' + additional + '</span>';
            }
            output += HamlFile.escape(additional);
        } else {
            output += segment.text;
        }

        this.segments.next();
        segment = this.segments.current();
    }

    return dirty ? output : undefined;
};

/**
 * Localize the contents of this template file and write out the
 * localized template file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
HamlFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    if (this.segments) {
        for (var i = 0; i < locales.length; i++) {
            if (!this.project.isSourceLocale(locales[i])) {
                var pathName = this.getLocalizedPath(locales[i]);
                logger.debug("Writing file " + pathName);
                var localized = this.localizeText(translations, locales[i]);
                if (localized) {
                    var p = path.join(this.project.target, pathName);
                    var d = path.dirname(p);
                    utils.makeDirs(d);

                    // only write out the file if there was something translated in it
                    // if not, rails will fall back to the base US English file by itself
                    fs.writeFileSync(p, localized, "utf-8");
                } else {
                    logger.debug("Skipping because it is not different than US English.");
                }
            }
        }
    } else {
        logger.debug(this.pathName + ": No segments/no strings, no localize");
    }
};

module.exports = HamlFile;
