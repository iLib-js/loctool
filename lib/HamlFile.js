/*
 * HamlFile.js - plugin to extract resources from a Haml source code file
 *
 * Copyright © 2016-2017, Healthtap, Inc. All Rights Reserved.
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

var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var Queue = jsstl.Queue;

var logger = log4js.getLogger("loctool.lib.HamlFile");

// load the locale data
isSpace._init();

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
HamlFile.cleanString = function(string) {
	var unescaped = HamlFile.unescapeString(string);

	unescaped = unescaped.
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

function containsActualText(str) {
	// remove the html and entities first
	var cleaned = str.replace(/<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g, "").replace(/&[a-zA-Z]+;/g, "");

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

/**
 * Find the first bracket and then match it, consuming all
 * text until the brackets are balanced or the end of file
 * is reached.
 * 
 * @private
 * @param {Number} start the index into the line to start searching
 * @returns {Number} the index of the closing bracket that matches the next opening one.
 */
HamlFile.prototype.findMatching = function(start) {
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
		var match = this.findMatching(first);
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
			(this.indentation(this.lines[nextLine], 0) > firstIndent || this.lines[nextLine].substr(-1) === '|')) {
		nextLine++;
	}
	
	this.currentLine = nextLine - 1;
	return this.currentLine;
};

var reTagName = /\s*%([a-zA-Z.\-_]*)/g;
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
	var parts = match[1].split(".");
	
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
	
	if (match === null) {
		return "";  // no tag found!
	}
	
	var parts = match[1].split(".");
	var tag = parts[0];
	
	var ret = "<" + tag;
	
	if (parts.length > 1) {
		ret += ' class="' + parts.slice(1).join(" ") + '"';
	}
	
	reAttrs.lastIndex = 0;
	match = reAttrs.exec(line);
	if (match !== null) {
		var attrs = match[0];
		var re = (attrs.indexOf("=>") > -1) ? reAttrArrow : reAttrColon;
		re.lastIndex = 0;
		match = re.exec(attrs);
		while (match !== null) {
			ret += ' ' + match[1] + '=' + match[2];
			match = re.exec(attrs);
		}
	}
	
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
 * @param {boolean=} nonspace true if the text should be added
 * without prepending a space first
 */
HamlFile.prototype.emitLocalized = function(data, nonspace) {
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
		this.segments.enqueue({
			localizable: true,
			text: this.localizedBuffer
		});
		
		this.set.add(new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: this.makeKey(escapeInvalidChars(this.localizedBuffer)),
			autoKey: true,
			source: escapeInvalidChars(this.localizedBuffer),
			pathName: this.pathName,
			state: "new",
			datatype: this.type.datatype
		}));
		
		this.localizedBuffer = "";
	}
	
	if (data) this.nonLocalizedBuffer += data;
};

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
		state = "default";
	
	this.segments = new Queue();
	this.localizedBuffer = "";
	this.nonLocalizedBuffer = "";

	this.lines = data.split('\n');
	this.currentLine = 0;
	
	while (this.currentLine < this.lines.length) {
		line = this.lines[this.currentLine];
		lineIndent = this.indentation(line, 0);
		
		switch (line[lineIndent]) {
		case '!': // doctype
		case '=': // ruby code
		case '&': // html-escaped ruby code
			var startLine = this.currentLine;
			this.findMatchingIndent();
			var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
			this.emitNonLocalized(nonLocalizable);
			break;
		
		case '-': // instructions
			var startLine = this.currentLine;
			this.findMatchingIndent();
			if (line[lineIndent+1] === "#") {
				// haml comment -- ignore!
				break;
			} 
			var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
			this.emitNonLocalized(nonLocalizable);
			break;
			
		case '/': // comment -- just skip it and anything indented inside it
			this.findMatchingIndent();
			break;
			
		case ':': // stretch of ruby, javascript, sass, etc.
			// skip the whole thing
			var startLine = this.currentLine;
			var end = this.findMatchingIndent();
			var nonLocalizable = this.lines.slice(startLine, this.currentLine+1).join("\n");
			this.emitNonLocalized(nonLocalizable);
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
				if (utils.nonBreakingTags[tag]) {
					this.emitLocalized(this.convertTag());
					this.emitLocalized(line.substring(end).trim(), true);
					this.emitLocalized("</" + tag + ">", true);
					break;
				}
			}

			var nonLocalizable = (this.currentLine > startLine) ? lines.slice(startLine, this.currentLine-1).join("\n") : "";
			var line = this.lines[this.currentLine];
			lineIndent = this.indentation(line, 0);
			nonLocalizable += line.substring(0, end);
			var localizable = end < line.length ? line.substring(end).trim() : "";
			tagSuffixes.lastIndex = 0;
			var match = tagSuffixes.exec(nonLocalizable)
			if (match !== null && match[1].substr(-1) === "=") {
				// the rest of the line is ruby code
				nonLocalizable += localizable;
				localizable = "";
			}
			this.emitNonLocalized(nonLocalizable);
			this.emitLocalized(localizable);
			if (localizable) {
				// if there is something on the same line, then it is wrapped in the div and the next line
				// should form a new, separate stretch of possibly localizable text
				this.emitNonLocalized();
			} else {
				this.emitNonLocalized('\n');
			}
			break;
			
		default:
			if (lineIndent < currentIndent || !this.localizedBuffer) {
				// new string, so end the current one
				this.emitNonLocalized(line.substring(0, lineIndent));
			}
			this.emitLocalized(line.substring(lineIndent));
			break;
		}
		
		currentIndent = lineIndent;
		
		this.currentLine++;
	}
	
	// now clear the buffers -- only one of the two should be doing anything
	this.emitLocalized();
	this.emitNonLocalized();
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
	var fullPath = path.join(this.project.root, this.pathName);
	var dirName = path.dirname(fullPath);
	var fileName = path.basename(fullPath);

	var parts = fileName.split(".");

	if (parts.length > 2) {
		if (parts.length > 3 && parts[parts.length-3] === this.project.sourceLocale) {
			parts.splice(parts.length-3, 1, locale);
		} else {
			parts.splice(parts.length-2, 0, locale);
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
HamlFile.prototype.localizeText = function(translations, locale) {
	this.segments.rewind();
	var segment = this.segments.current();
	var output = "";
	var substitution, replacement;

	while (segment) {
		if (segment.localizable) {
			if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
				ret[key] = segment.text;
			} else if (this.type && this.type.pseudos[locale]) {
				var source, sourceLocale = this.type.pseudos[locale].getSourceLocale();
				if (sourceLocale !== this.project.sourceLocale) {
					// translation is derived from a different locale's translation instead of from the source string
					var sourceRes = translations.getClean(ResourceString.cleanHashKey(
							this.project.getProjectId(), sourceLocale, this.makeKey(escapeInvalidChars(segment.text)), this.type.datatype));
					source = sourceRes ? sourceRes.getSource() : segment.text;
				} else {
					source = segment.text;
				}
				additional = this.type.pseudos[locale].getString(source);
			} else {
				var translated = translations.getClean(
					ResourceString.cleanHashKey(
							this.project.getProjectId(), locale, this.makeKey(escapeInvalidChars(segment.text)), this.type.datatype));
				var additional;
				if (translated) {
					additional = translated.getSource();
				} else {
					if (this.type && containsActualText(segment.text)) {
						logger.trace("New string found: " + segment.text);
						this.type.newres.add(new ResourceString({
							project: this.project.getProjectId(),
							locale: this.project.sourceLocale,
							key: this.makeKey(escapeInvalidChars(segment.text)),
							autoKey: true,
							source: escapeInvalidChars(segment.text),
							pathName: this.pathName,
							state: "new",
							datatype: this.type.datatype,
							origin: "source"
						}));
						this.type.newres.add(new ResourceString({
							project: this.project.getProjectId(),
							locale: locale,
							key: this.makeKey(escapeInvalidChars(segment.text)),
							autoKey: true,
							source: escapeInvalidChars(segment.text),
							pathName: this.pathName,
							state: "new",
							datatype: this.type.datatype,
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

			output += additional + '\n';
		} else {
			output += segment.text;
		}

		this.segments.next();
		segment = this.segments.current();
	}

	return output;
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
			var pathName = this.getLocalizedPath(locales[i]);
			logger.info("Writing file " + pathName);
			fs.writeFileSync(pathName, this.localizeText(translations, locales[i]), "utf-8");
		}
	} else {
		logger.debug(this.pathName + ": No segments/no strings, no localize");
	}
};

module.exports = HamlFile;