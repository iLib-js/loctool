/*
 * HamlFile.js - plugin to extract resources from a Haml source code file
 *
 * Copyright © 2016-2017, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var utils = require("./utils.js");
var ilib = require("ilib");
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
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var HamlFile = function(project, pathName) {
	this.project = project;
	this.pathName = pathName;
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
HamlFile.unescapeString = function(string) {
	var unescaped = string;
	
	unescaped = unescaped.
		replace(/^\\\\/g, "\\").
		replace(/([^\\])\\\\/g, "$1\\").
		replace(/\\'/g, "'").
		replace(/\\"/g, '"');
	
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

var brackets = {
	'[': ']',
	'{': '}',
	'(': ')'
};

/**
 * Find the first bracket and then match it, consuming all
 * text to the end of the line until the brackets are balanced.
 * 
 * @private
 * @param {String} data the search
 * @param {Number} start the index to start the search
 * @returns {Number} the index of the closing
 * bracket that matches the next opening one.
 */
HamlFile.prototype.findMatching = function(data, start) {
	var opener, closer;
	var stack = 0, i = start || 0, lastclose = -1;

	while (i < data.length) {
		if (data[i] === '\n' && stack === 0) {
			// found an end-of-line with balanced bracket
			break;
		} else if (data[i] === '"' || data[i] === "'") {
			// skip quoted strings -- they do not contribute to the stack of brackets
			var quote = data[i];
			while (i < data.length && data[i] !== quote) {
				if (data[i] === '\\') {
					// skipped escaped chars
					i++;
				}
				i++;
			}
		} else if (brackets[data[i]]) {
			if (stack === 0) {
				opener = data[i];
				closer = brackets[data[i]];
				stack = 1;
			} else if (data[i] === opener) {
				stack++;
			}
		} else if (stack && data[i] === closer) {
			stack--;
			if (stack === 0) {
				opener = closer = undefined;
				lastclose = i;
			}
		}

		i++;
	}

	return lastclose > -1 ? lastclose : i;
}

/** 
 * Return the index of the first character on the line
 * that could form localizable text.
 * 
 * @param {String} line the line to search
 * @param {Number} start the index into the string to start searching
 * @returns {Number} the index of hte first character
 * on the line that may contain localizable text
 */
HamlFile.prototype.firstLocalizable = function(line, start) {
	
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
 * Add a chunk of localizable text to the buffers. If there is
 * existing localizable text, it will be appended to that text.
 * If there is not, it will form a new localizable segment. If
 * there is existing non-localizable text in the buffer, that
 * will be added as a non-localizable segment first before the
 * current text is added to the localizable buffer.
 * 
 * @param {String} data the text to add
 */
HamlFile.prototype.emitLocalized = function(data) {
	if (this.nonLocalizedBuffer.length > 0) {
		this.segments.enqueue({
			localizable: false,
			text: this.nonLocalizedBuffer
		});
		
		this.nonLocalizedBuffer = "";
	}

	if (data) this.localizedBuffer += data;
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
			datatype: "x-haml"
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

	var lines = data.split('\n');
	
	while (i < lines.length) {
		line = lines[i];
		lineIndent = this.indentation(line, 0);
		
		switch (line[lineIndent]) {
		case '-':
		case '=':
			this.emitNonLocalized(line + '\n');
			break;
			
		case '.':
		case '%':
			var end = this.firstLocalizable(line, lineIndent);
			this.segments.enqueue({
				localizable: false,
				text: data.substring(start, end)
			});
			i = end;
			
			break;
			
		default:
			break;
		}
		
	}
	
	
	
	
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
						datatype: "x-haml"
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
	
	
	for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		var line = lines[lineNumber];
		
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
	return undefined;
}

// we don't localize haml files at the normal time. We wait to the end and
// localize them using ruby code
HamlFile.prototype.localize = function() {};
HamlFile.prototype.write = function() {};

module.exports = HamlFile;