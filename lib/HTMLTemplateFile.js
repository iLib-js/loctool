/*
 * HTMLTemplateFile.js - plugin to extract resources from an HTML template source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var htmlParser = require("html-parser");
var Queue = require("js-stl").Queue;

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

// list of html tags and their attributes that contain localizable strings
var localizableAttributes = {
	"area": ["alt"],
	"img": ["alt"],
	"input": ["alt", "placeholder"],
	"optgroup": ["label"],
	"option": ["label"],
	"textarea": ["placeholder"],
	"track": ["label"]
};

function isWhite(c) {
	return (c === " " || c === "\n" || c === "\t");
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
HTMLTemplateFile.prototype.parse = function(data) {
	logger.debug("Extracting strings from " + this.pathName);

	var accumulator = "";
	
	this.fragments = new Queue();
	
	var x = htmlParser.parse(data, {
		openElement: function(name) { 
			logger.trace('open tag: ' + name);
			accumulator += '<' + name;
		},
	    closeOpenedElement: function(name, token, unary) {
	    	logger.trace('close opened tag: ' + name + ", token: " + token + ', unary: ' + unary);
	    	accumulator += '>';
	    },
	    closeElement: function(name) { 
	    	logger.trace('close: %s', name);
	    	accumulator += '</' + name + '>';
	    },
	    comment: function(value) { 
	    	logger.trace('comment: %s', value);
	    	// strip comments
	    },
	    cdata: function(value) { 
	    	logger.trace('cdata: %s', value); 
	    	accumulator += value;
	    },
	    attribute: function(name, value) {
	    	logger.trace('attribute: %s=%s', name, value);
	    	if (name === "lang") {
	    		
	    	} else if (name === "translate") {
	    		
	    	} else if (name === "title") {
	    		
	    	}
	    	accumulator += " " + name + '="' + value + '"';
	    },
	    docType: function(value) { 
	    	logger.trace('doctype: %s', value);
	    	accumulator += value;
	    },
	    text: function(value) { 
	    	var i, pre = "", post = "";
	    	for (i = 0; i < value.length && isWhite(value.charAt(i)); i++);
	    	
	    	if (i >= value.length) {
	    		// all white space, so skip it
	    		accumulator += value;
	    		return;
	    	}
	    	
	    	if (i > 0) {
	    		pre = value.substring(0, i);
	    		value = value.substring(i);
	    	}
	    	
	    	for (i = value.length-1; i > -1 && isWhite(value.charAt(i)); i--);
	    	
	    	if (i < value.length-1) {
	    		post = value.substring(i+1);
	    		value = value.substring(0, i+1);
	    	}
	    	
			accumulator += pre;
			
    		this.fragments.enqueue({
    			localizable: false,
    			text: accumulator
    		});
    		this.fragments.enqueue({
    			localizable: true,
    			text: value
    		});
    		accumulator = post;
    		logger.trace('text: pre is "' + pre + '" value is "' + value + '" and post is "' + post + '"');
	    			
    		this.set.add(new ResourceString({
    			project: this.project.getProjectId(),
    			locale: this.project.sourceLocale,
    			key: this.makeKey(value),
    			autoKey: true,
    			source: value,
    			pathName: this.pathName,
    			state: "new"	    			
    		}));
	    }.bind(this),
	    tmplEcho: function(value) { 
	    	logger.trace('template echo: %s', value);
	    	accumulator += '<%= ' + value + ' %>';
	    },
	    tmplTag: function(value) { 
	    	logger.trace('template tag: %s', value); 
	    	accumulator += '<% ' + value + ' %>';
	    }
	}, {
	    dataElements: {
	    	tmplEcho: {
	            start: '<%=',
	            data: function (string) {
	                var index = string.indexOf('%>'),
	                    code = string.slice(0, index);
	 
	                return code;
	            },
	            end: '%>'
	        },
	        tmplTag: {
	            start: '<%',
	            data: function (string) {
	            	var index = string.indexOf('%>'),
	                    code = string.slice(0, index);
	 
	                return code;
	            },
	            end: '%>'
	        }
	    }
	});
	if (accumulator.length) {
		this.fragments.enqueue({
			localizable: false,
			text: accumulator
		});
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