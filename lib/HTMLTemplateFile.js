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

function isWhite(c) {
	return (c === " " || c === "\n" || c === "\t");
}

function isAllWhite(str) {
	for (i = 0; i < str.length; i++) {
		if (!isWhite(str.charAt(i))) return false;
	}
	return true;
}

/**
 * @private
 */
HTMLTemplateFile.prototype._emitText = function() {
	if (!this.text.length) return;
	
	var i, pre = "", post = "";
	
	for (i = 0; i < this.text.length && isWhite(this.text.charAt(i)); i++);
	
	if (i >= this.text.length) {
		// all white space, so skip it
		this.accumulator += this.text;
		return;
	}
	
	if (i > 0) {
		pre = this.text.substring(0, i);
		this.text = this.text.substring(i);
	}
	
	for (i = this.text.length-1; i > -1 && isWhite(this.text.charAt(i)); i--);
	
	if (i < this.text.length-1) {
		post = this.text.substring(i+1);
		this.text = this.text.substring(0, i+1);
	}
	
	this.accumulator += pre;
	this.fragments.enqueue({
		localizable: false,
		text: this.accumulator
	});
	this.fragments.enqueue({
		localizable: true,
		text: this.text
	});
	
	logger.trace('text: pre is "' + pre + '" value is "' + this.text + '" and post is "' + post + '"');
			
	this.set.add(new ResourceString({
		project: this.project.getProjectId(),
		locale: this.project.sourceLocale,
		key: this.makeKey(this.text),
		autoKey: true,
		source: this.text,
		pathName: this.pathName,
		state: "new",
		comment: this.comment
	}));
	
	this.accumulator = post;
	this.text = "";
	this.comment = undefined;
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
HTMLTemplateFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);

	this.accumulator = "";
	this.text = "";
	this.fragments = new Queue();
	
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
	    	if ((name === "title" || (localizableAttributes[lastTagName] && localizableAttributes[lastTagName][name])) && value.substring(0,2) !== "<%") {
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
		    		this.fragments.enqueue({
		    			localizable: true,
		    			attributeSubstitution: true,
		    			text: value
		    		});
		    		
		    		this.text += " " + name + '="{' + name + '}"';
	    		} else {
	    	    	this.accumulator += " " + name + '="';
	    	    	
	    	    	this.text = value;
	    	    	this._emitText();
	    	    	
	    	    	this.accumulator += '"';	    			
	    		}
    		} else {
    			// non-localizable and values containing template tags just get added without localization
    			if (this.text) {
		    		this.text += " " + name + '="' + value + '"';
	    		} else {
	    			this.accumulator += " " + name + '="' + value + '"';
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
		    		this.fragments.enqueue({
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
	    		this.accumulator = '<%' + value + '%>';
			} else {
				this.accumulator += '<%' + value + '%>';
			}
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
		this.fragments.enqueue({
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
 * Localize the text of the current file to the given locale and return 
 * the results.
 * 
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
HTMLTemplateFile.prototype.localizeText = function(translations, locale) {
	this.fragments.rewind();
	var fragment = this.fragments.current();
	var output = "";
	
	while (fragment) {
		if (fragment.localizable) {
			var translated = translations.getBy({
				project: this.project.getProjectId(),
				locale: locale,
				reskey: fragment.text
			});
			output += translated && translated.length ? translated[0].getSource() : fragment.text;
		} else {
			output += fragment.text;
		}
		
		this.fragments.next();
		fragment = this.fragments.current();
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
	if (this.fragments) {
		logger.trace("Reconstituted file " + this.pathName);
		while (!this.fragments.isEmpty()) {
			var fragment = this.fragments.dequeue();
			logger.trace(fragment.text);
		}
		for (var i = 0; i < locales.length; i++) {
			
		}
	}
};

module.exports = HTMLTemplateFile;