/*
 * JavaFile.js - plugin to extract resources from a Java source code file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var ResourceString = require("./ResourceString.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.JavaFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 * 
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 */
var JavaFile = function(project, pathName) {
	this.project = project;
	this.pathName = pathName;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in 
 * this project under the java directory for the corresponding
 * code.
 * 
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique id (key) for this string
 */
JavaFile.prototype.makeKey = function(source) {
	if (!source) return undefined;
	var hash = 0;
	// these two numbers together = 63 bits so it won't blow out a long
	var modulus = 140737488355213;  // largest prime number that fits in 47 bits
	var multiple = 65521;           // largest prime that fits in 16 bits, co-prime with the modulus
	
	for (var i = 0; i < source.length; i++) {
		hash += source.charAt(i);
		hash *= multiple;
		hash %= modulus;
	}
	var value = "r" + hash;
	
	// System.out.println("String '" + source + "' hashes to " + value);
	
	return value;
};

var reGetString = new RegExp(/RB\.getString\("([^"]*)"/g);
var reGetStringWithId = new RegExp(/RB\.getString\("([^"]*)", ?"([^"]*)"/g);

/**
 * Extract all the localizable strings from the java file and add them to the
 * project's translation set.
 */
JavaFile.prototype.extract = function() {
	logger.debug("JavaFile.extract: Extracting strings from " + this.pathName);
	var data = fs.readFileSync(this.pathName, "utf8");
	if (data) {
		var set = this.project.getTranslationSet();
		
		var result = reGetString.exec(data);
		while (result && result.length > 1 && result[1]) {
			logger.trace("JavaFile.extract: Found string " + result[1]);
			if (set.getBySource(result[1])) {
				
			} else {
				var r = new ResourceString({
					id: this.makeKey(result[1]),
					source: result[1],
					pathName: this.pathName
				});
				set.add(r);
			}
			result = reGetString.exec(data);
		}

		var result = reGetStringWithId.exec(data);
		while (result && result.length > 2 && result[1] && result[2]) {
			logger.trace("JavaFile.extract: Found string " + result[1] + " with unique id " + result[2]);
			var r = new ResourceString({
				id: result[2],
				source: result[1],
				pathName: this.pathName
			});
			set.add(r);
			result = reGetStringWithId.exec(data);
		}
	}
};

JavaFile.prototype.write = function() {};

module.exports = JavaFile;
