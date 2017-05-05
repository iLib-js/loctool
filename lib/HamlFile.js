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
	}

	if (first < line.length) {
		if (line[first-1] === '=') {
			first = line.length-1;
		} else {
			while (first < line.length-1 && line[first] === ' ' || line[first] === '\t') {
				first++;
			}
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
	
	while (nextLine < this.lines.length && this.indentation(this.lines[nextLine], 0) > firstIndent) {
		nextLine++;
	}
	
	this.currentLine = nextLine - 1;
	return this.currentLine;
};

var reTagName = /\s*%([a-zA-Z.\-_]*)/g;
var reClassName = /\.([a-zA-Z.\-_]*)/g;
var reAttrs = /\{([^}'"]|'[^']*'|"[^"]*")*\}/g;
var reAttr = /:(\w+)\s*=>\s*('[^']*'|"[^"]*")/g;

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
		reAttr.lastIndex = 0;
		match = reAttr.exec(attrs);
		while (match !== null) {
			ret += ' ' + match[1] + '=' + match[2];
			match = reAttr.exec(attrs);
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
			this.emitNonLocalized(line + '\n');
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
			
		case '%':
			var startLine = this.currentLine;
			var end = this.firstLocalizable(lineIndent);

			// If there is text before this one, then check if the tag is a non-breaking one.
			// If the tag is a non-breaking tag, convert it to HTML and add it and its text
			// to the localizable buffer. If not, then treat it like non-localizable text.
			if (this.localizedBuffer.length > 0) {
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
			nonLocalizable += line.substring(0, end);
			this.emitNonLocalized(nonLocalizable);
			this.emitLocalized(line.substring(end).trim());
			break;

		// divs
		case '.':
		case '#':
			var startLine = this.currentLine;
			var end = this.firstLocalizable(lineIndent);
			var nonLocalizable = (this.currentLine > startLine) ? lines.slice(startLine, this.currentLine-1).join("\n") : "";
			var line = this.lines[this.currentLine];
			nonLocalizable += line.substring(0, end);
			this.emitNonLocalized(nonLocalizable);
			this.emitLocalized(line.substring(end));
			break;
			
		default:
			if (lineIndent < currentIndent) {
				// new string, so end the current one
				this.emitNonLocalized();
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
	
	/*
	
	while (i < data.length) {
		start = i;
		
		while (i < data.length && isSpace(data[i])) {
			i++;
		}

		var eol = data.indexOf('\n', i);
		
		if (i < data.length) {
			switch (data[i]) {
			case '-':
			case '=':
			case '#':
				var end = findMatching(data, i);
				this.segments.enqueue({
					localizable: false,
					text: data.substring(start, end)
				});
				i = end;
				break;
				
			case '.':
			case '%':
				var end = findMatching(data, i);
				this.segments.enqueue({
					localizable: false,
					text: data.substring(start, end)
				});
				i = end;
				
				break;
				
			default:
				if (i > start) {
					// indentation whitespace
					this.segments.enqueue({
						localizable: false,
						text: data.substring(start, i)
					});
				}
				if (i < eol) {
					// text
					var text = data.substring(i, eol);
					
					this.segments.enqueue({
						localizable: true,
						text: text 
					});
					
					this.set.add(new ResourceString({
						project: this.project.getProjectId(),
						locale: this.project.sourceLocale,
						key: this.makeKey(escapeInvalidChars(text)),
						autoKey: true,
						source: escapeInvalidChars(this.text),
						pathName: this.pathName,
						state: "new",
						datatype: this.type.datatype
					}));
				}
				break;
			}
		} else {
			// blank line
			this.segments.enqueue({
				localizable: false,
				text: data.substring(start, eol)
			});
		}
	}
	
	
	for (var lineNumber = 0; lineNumber < this.lines.length; lineNumber++) {
		var line = this.lines[lineNumber];
		
		i = 0;
		while (i < line.length && isSpace(line[i])) {
			i++;
		}
		
	}
	
	
	
	reGetString.lastIndex = 0; // for safety
	var result = reGetString.exec(data);
	while (result && result.length > 1 && result[2]) {
		logger.trace("Found string key: " + this.makeKey(result[2]) + ", string: '" + result[2] + "', comment: " + (result.length > 4 ? result[4] : undefined));
		if (result[2] && result[2].length) {
			
			var last = data.indexOf('\n', reGetString.lastIndex);
			last = (last === -1) ? data.length : last;
			var line = data.substring(reGetString.lastIndex, last);
			var commentResult = reI18nComment.exec(line);
			comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;
			
			var r = new ContextResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: this.makeKey(result[2]),
				autoKey: true,
				source: utils.trimEscaped(JavaFile.unescapeString(result[2])),
				pathName: this.pathName,
				state: "new",
				comment: comment,
				datatype: "java"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
		}
		result = reGetString.exec(data);
	}

	reGetStringWithId.lastIndex = 0; // for safety
	result = reGetStringWithId.exec(data);
	while (result && result.length > 2 && result[2] && result[4]) {
		logger.trace("Found string '" + result[2] + "' with unique key " + result[4] + ", comment: " + (result.length > 4 ? result[4] : undefined));
		if (result[2] && result[4] && result[2].length && result[4].length) {

			var last = data.indexOf('\n', reGetStringWithId.lastIndex);
			last = (last === -1) ? data.length : last;
			var line = data.substring(reGetStringWithId.lastIndex, last);
			var commentResult = reI18nComment.exec(line);
			comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;
			
			var r = new ContextResourceString({
				project: this.project.getProjectId(),
				locale: this.project.sourceLocale,
				key: result[4],
				source: JavaFile.cleanString(result[2]),
				pathName: this.pathName,
				state: "new",
				comment: comment,
				datatype: "java"
			});
			this.set.add(r);
		} else {
			logger.warn("Warning: Bogus empty string in get string call: ");
			logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
		}
		result = reGetStringWithId.exec(data);
	}
	
	// now check for and report on errors in the source
	result = reGetStringBogusConcatenation1.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusConcatenation1.exec(data);
	}
	result = reGetStringBogusConcatenation2.exec(data);
	while (result) {
		logger.warn("Warning: string concatenation is not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusConcatenation2.exec(data);
	}
	result = reGetStringBogusParam.exec(data);
	while (result) {
		logger.warn("Warning: non-string arguments are not allowed in the RB.getString() parameters:");
		logger.warn(result[0]);
		result = reGetStringBogusParam.exec(data);
	}
	
	*/
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

// we don't localize haml files at the normal time. We wait to the end and
// localize them using ruby code
HamlFile.prototype.localize = function() {};
HamlFile.prototype.write = function() {};

module.exports = HamlFile;