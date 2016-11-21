/*
 * HTMLTemplateFile.js - plugin to extract resources from an HTML template source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var htmlParser = require("html-parser");
var jsstl = require("js-stl");
var Queue = jsstl.Queue;
var Stack = jsstl.Stack;

var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var TranslationSet = require("./TranslationSet.js");

var logger = log4js.getLogger("loctool.lib.HTMLTemplateFile");

/**
 * Create a new HTML template file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var HTMLTemplateFile = function(project, pathName) {
	this.project = project;
	this.pathName = pathName;
	this.set = new TranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Make a new key for the given string.
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
HTMLTemplateFile.prototype.makeKey = function(source) {
	// the English source is the key as well
	return source;
};

var nonBreakingTags = {
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

function escapeInvalidChars(str) {
	var ret = "";
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c < 0x09 || (c > 0x0D && c < 0x20)) {
			ret += "&#" + c + ";";
		} else {
			ret += str.charAt(i);
		}
	}
	return ret;
};

/**
 * @private
 */
HTMLTemplateFile.prototype._emitText = function() {
	if (!this.text.length) return;
	
	var i, pre = "", post = "";
	
	for (i = 0; i < this.text.length && utils.isWhite(this.text.charAt(i)); i++);
	
	if (i >= this.text.length) {
		// all white space, so skip it
		this.accumulator += this.text;
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
	
	this.accumulator += pre;
	this.segments.enqueue({
		localizable: false,
		text: this.accumulator
	});
	
	logger.trace('text: pre is "' + pre + '" value is "' + this.text + '" and post is "' + post + '"');
	
	if (this.text.length) {
		this.segments.enqueue({
			localizable: true,
			text: escapeInvalidChars(this.text)
		});
		
		this.set.add(new ResourceString({
			project: this.project.getProjectId(),
			locale: this.project.sourceLocale,
			key: this.makeKey(escapeInvalidChars(this.text)),
			autoKey: true,
			source: escapeInvalidChars(this.text),
			pathName: this.pathName,
			state: "new",
			comment: this.comment
		}));
	}
	
	this.accumulator = post;
	this.text = "";
	this.comment = undefined;
};

function escapeDoubleQuotes(str) {
	ret = "";
	for (var i = 0; i < str.length; i++) {
		switch (str[i]) {
		case '"':
			ret += '\\"';
			break;
		case '<':
			if (i+1 < str.length && str[i+1] === '%') {
				i += 2;
				ret += '<%';
				while (i+1 < str.length && (str[i] !== '%' || str[i+1] !== '>')) {
					ret += str[i++];
				}
				if (str[i] === '%') {
					ret += '%>';
					i++;
				}
			}
			break;
		case '\\':
			ret += '\\';
			if (i+1 < str.length) {
				ret += str[++i];
			}
			break;
		default:
			ret += str[i];
			break;
		}
	}
	
	return ret;
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
HTMLTemplateFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);

	this.accumulator = "";
	this.text = "";
	this.segments = new Queue();
	
	var lastTagName;
	var tagStack = new Stack();
	
	var x = htmlParser.parse(data, {
		openElement: function(name) { 
			logger.trace('open tag: ' + name);
			lastTagName = name;
			if (this.text) {
				if (nonBreakingTags[name]) {
					this.text += '<' + name;
					tagStack.push(name);
				} else {
					this._emitText();
					this.accumulator += '<' + name;
				}
			} else {
				this.accumulator += '<' + name;
			}
		}.bind(this),
	    closeOpenedElement: function(name, token, unary) {
	    	logger.trace('close opened tag: ' + name + ", token: " + token + ', unary: ' + unary);
	    	if (this.text && nonBreakingTags[name]) {
				this.text += '>';
			} else {
				this.accumulator += '>';
			}
	    	lastTagName = undefined;
	    }.bind(this),
	    closeElement: function(name) { 
	    	logger.trace('close: %s', name);
	    	if (this.text) {
	    		if (nonBreakingTags[name] && !tagStack.isEmpty()) {
	    			var tag = tagStack.pop();
	    			while (tag !== name && !tagStack.isEmpty()) {
	    				tag = tagStack.pop();
	    			}
	    			if (tag === name) {
	    				this.text += '</' + name + '>';
	    				return;
	    			}
	    		}
    			this._emitText();
    		}
	    	tagStack = new Stack(); // reset
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
	    }.bind(this),
	    cdata: function(value) { 
	    	logger.trace('cdata: %s', value);
	    	if (this.text) {
	    		this._emitText();
	    		this.accumulator += value;
	    	} else {
				this.accumulator += value;
	    	}
	    }.bind(this),
	    attribute: function(name, value) {
	    	logger.trace('attribute: %s=%s', name, value);
	    	value = value || "";
	    	if ((name === "title" || (localizableAttributes[lastTagName] && localizableAttributes[lastTagName][name])) && 
	    			value.trim().length > 0 && value.substring(0,2) !== "<%") {
	    		this.set.add(new ResourceString({
	    			project: this.project.getProjectId(),
	    			locale: this.project.sourceLocale,
	    			key: this.makeKey(value),
	    			autoKey: true,
	    			source: value,
	    			pathName: this.pathName,
	    			state: "new",
	    			comment: this.comment
	    		}));
	    		
	    		if (this.text) {
		    		this.segments.enqueue({
		    			localizable: true,
		    			attributeSubstitution: true,
		    			text: escapeDoubleQuotes(value),
		    			replacement: '{' + name + '}'
		    		});
		    		
		    		this.text += " " + name + '="{' + name + '}"';
	    		} else {
	    	    	this.accumulator += " " + name + '="';
	    	    	
	    	    	this.text = escapeDoubleQuotes(value);
	    	    	this._emitText();
	    	    	
	    	    	this.accumulator += '"';	    			
	    		}
    		} else {
    			// non-localizable and values containing template tags just get added without localization
    			if (this.text) {
		    		this.text += " " + name + '="' + escapeDoubleQuotes(value) + '"';
	    		} else {
	    			this.accumulator += " " + name + '="' + escapeDoubleQuotes(value) + '"';
	    		}
    		}
	    }.bind(this),
	    docType: function(value) { 
	    	logger.trace('doctype: %s', value);
	    	this.accumulator += value;
	    }.bind(this),
	    text: function(value) {
	    	logger.trace('text: value is "' + value + '"');
	    	if (isAllWhite(value)) {
	    		if (this.text) {
	    			this.text += value;
	    		} else {
	    			this.accumulator += value;
	    		}
	    	} else {
	    		if (this.accumulator) {
		    		this.segments.enqueue({
		    			localizable: false,
		    			text: this.accumulator
		    		});
		    		this.accumulator = "";
		    	}
	    		this.text += value;
	    	}
	    }.bind(this),
	    tmplEcho: function(value) { 
	    	logger.trace('template echo: %s', value);
	    	if (this.text) {
				this.text += '<%=' + value + '%>';
			} else {
				this.accumulator += '<%=' + value + '%>';
			}
	    }.bind(this),
	    tmplTag: function(value) { 
	    	logger.trace('template tag: %s', value);
	    	if (this.text) {
	    		this._emitText();
	    	}
	    	this.accumulator += (lastTagName ? ' ' : '') + '<%' + value + '%>';
	    }.bind(this)
	}, {
	    dataElements: {
	    	tmplEcho: {
	            start: '<%=',
	            data: function (string) {
	                return string.slice(0, string.indexOf('%>'));
	            },
	            end: '%>'
	        },
	        tmplTag: {
	            start: '<%',
	            data: function (string) {
	                return string.slice(0, string.indexOf('%>'));
	            },
	            end: '%>'
	        }
	    }
	});
	if (this.accumulator.length) {
		this.segments.enqueue({
			localizable: false,
			text: this.accumulator
		});
	}
	if (this.text) {
		this._emitText();
	}
};

/**
 * Extract all the localizable strings from the template file and add them to the
 * project's translation set.
 */
HTMLTemplateFile.prototype.extract = function() {
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
HTMLTemplateFile.prototype.getTranslationSet = function() {
	return this.set;
}

//we don't write HTML template source files
HTMLTemplateFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized 
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
HTMLTemplateFile.prototype.getLocalizedPath = function(locale) {
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
HTMLTemplateFile.prototype.localizeText = function(translations, locale) {
	this.segments.rewind();
	var segment = this.segments.current();
	var output = "";
	var substitution, replacement;
	
	while (segment) {
		if (segment.localizable) {
			if (segment.attributeSubstitution) {
				var translated = translations.getBy({
					project: this.project.getProjectId(),
					locale: locale,
					reskey: segment.text
				});
				substitution = translated && translated.length ? translated[0].getSource() : segment.text;
				replacement = segment.replacement;
			} else {
				var translated = translations.getBy({
					project: this.project.getProjectId(),
					locale: locale,
					reskey: segment.text
				});
				var additional = translated && translated.length ? translated[0].getSource() : segment.text;
				if (substitution) {
					additional = additional.replace(replacement, substitution);
					substitution = undefined;
					replacement = undefined;
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
 * Localize the contents of this template file and write out the
 * localized template file to a different file path.
 * 
 * @param {TranslationSet} translations the current set of 
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
HTMLTemplateFile.prototype.localize = function(translations, locales) {
	// don't localize if there are no strings extracted
	if (this.segments && this.set.size() > 0) {
		for (var i = 0; i < locales.length; i++) {
			var pathName = this.getLocalizedPath(locales[i]);
			logger.info("Writing file " + pathName);
			fs.writeFileSync(pathName, this.localizeText(translations, locales[i]), "utf-8");
		}
	} else {
		logger.debug(this.pathName + ": No segments/no strings, no localize");
	}
};

module.exports = HTMLTemplateFile;