/*
 * IosStringsFile.js - represents an iOS strings resource file
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var xml2json = require('xml2json');
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var PrettyData = require("pretty-data").pd;
var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var IosLayoutResourceString = require("./IosLayoutResourceString.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")

var logger = log4js.getLogger("loctool.lib.IosStringsFile");

/**
 * @class Represents an iOS strings resource file.
 * The props may contain any of the following properties:
 * 
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var IosStringsFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.type = props.type;
		this.locale = this.iosLocale = props.locale;
		this.context = props.context || undefined;
	}
	
	if (this.pathName) {
		this._parsePath();
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

var commentRE = new RegExp(/\/\*\s*(([^*]|\*[^\/])*)\s*\*\//);
var lineRE = new RegExp(/"((\\"|[^"])*)"\s*=\s*"((\\"|[^"])*)"/);

/**
 * Parse a strings file and store the resources found in it into the 
 * file's translation set.
 * 
 * @param {String} str the string to parse
 */
IosStringsFile.prototype.parse = function(str) {
	var lines = str.split('\n');
	var comment, match;
	
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		match = commentRE.exec(line);
		if (match && match[1] && match[1].length) {
			comment = match[1].trim();
			if (comment === "No comment provided by engineer.") {
				// not a real comment, just ignore this
				comment = undefined;
			}
		} else {
			match = lineRE.exec(line);
			if (match) {
				logger.trace("Found resource string: " + match[1] + " = " + match[3]);
				var res = new IosLayoutResourceString({
					key: match[1],
					source: match[3],
					pathName: this.sourcePath,
					locale: this.locale,
					project: this.project.getProjectId(),
					comment: comment,
					origin: this.origin,
					datatype: "x-xib"
				});
				comment = "";

				this.set.add(res);
			}
		}
	}
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
IosStringsFile.prototype.extract = function() {
	this._parsePath();
	
	if (this.pathName) {
		var p = path.join(this.project.root, this.pathName);
		try {
			var dir = path.basename(path.dirname(this.pathName), ".lproj");
			if (this.project.options.resourceDirs && this.project.options.resourceDirs["objc"] !== path.dirname(this.pathName) && dir === "en-US") {
				// use the en.lproj strings as the source for the xib files
				this.origin = "source";
				this.sourcePath = path.join(path.dirname(path.dirname(this.pathName)), "Base.lproj", path.basename(this.pathName, ".strings") + ".xib");
			} else {
				this.origin = "target";
				this.sourcePath = this.pathName;
			}
			
			logger.trace("origin is " + this.origin + " and sourcePath is " + this.sourcePath);
			
			var buffer = new Buffer(2);
			buffer.fill(0);

			var fd = fs.openSync(p, 'r');
			if (fd > -1) {
				fs.readSync(fd, buffer, 0, 2, 0);
				fs.close(fd);
				
				var magic = buffer[0] << 8 | buffer[1];
				this.contents = fs.readFileSync(p, (magic === 0xFFFE || magic === 0xFEFF) ? "ucs-2" : "utf-8");
			}
		
			if (!this.contents) {
				logger.debug(this.pathName + " is not available, skipping.");
				return;
			}
		
			this._parsePath(); // get the locale and context to use while making the resource instances below

			this.parse(this.contents);

			logger.trace("After loading, resources are: " + JSON.stringify(this.set.getAll(), undefined, 4));
			logger.trace("IosStringsFile: loaded strings in " + this.pathName);
		} catch (e) {
			logger.warn("Could not read file: " + p);
			logger.warn(e);
		}
	}

	// mark this set as not dirty after we read it from disk
	// so we can tell when other code has added resources to it
	this.set.setClean();
};

var lang = new RegExp("\/([a-z][a-z])\\.lproj$");
var reg = new RegExp("\/([a-z][a-z])-([A-Z][A-Z])\\.lproj$");
var script = new RegExp("\/([a-z][a-z])-([A-Z][a-z][a-z][a-z])-([A-Z][A-Z])\\.lproj$");

/**
 * Parse the path to the strings file for the locale. The 
 * locale for iOS strings resource files
 * are given in the prefix of the directory name that the resource file 
 * lives in.<p>
 * 
 * The general syntax of the directory name is:<p>
 * 
 * <pre>
 * language ["-" script] [ "-" region]] ".lproj"
 * </pre>
 * 
 * That is, the directory is named after the locale with optional
 * script and region tags, followed by the string ".lproj".
 * 
 * @private
 */
IosStringsFile.prototype._parsePath = function() {
	if (!this._pathParsed) {
		var dir = path.dirname(this.pathName || "");
		
		if (!this.locale) {
			// don't have it? Then guess based on the path name
			var match;
			if ((match = script.exec(dir)) && match && match.length > 0) {
				// this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-")).getSpec();
				this.iosLocale = new Locale(match[1], match[3], undefined, match[2]).getSpec();
				this.context = match[4] ? match[4].substring(1) : undefined;
				logger.trace("script");
			} else if ((match = reg.exec(dir)) && match && match.length > 0) {
				//this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-")).getSpec();
				this.iosLocale = new Locale(match[1], match[2]).getSpec();
				this.context = match[3] ? match[3].substring(1) : undefined;
				logger.trace("region");
			} else if ((match = lang.exec(dir)) && match && match.length > 0) {
				// this.locale = new Locale(dir.substring(dir.length-2)).getSpec();
				this.iosLocale = new Locale(match[1]).getSpec();
				this.context = match[2] ? match[2].substring(1) : undefined;
				logger.trace("language");
			}
			
			this.locale = (this.iosLocale === "en-US" ? this.project.sourceLocale: this.iosLocale) || this.project.sourceLocale;
		}
		logger.trace("_parsePath: locale is " + this.locale);
	}
	
	this._pathParsed = true;
};


/**
 * Get the locale of this resource file. For iOS strings resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 * 
 * @returns {String} the locale spec of this file
 */
IosStringsFile.prototype.getLocale = function() {
	this._parsePath();
	
	return this.locale;
};

/**
 * Get the context of this resource file. 
 * 
 * @returns {String} the locale spec of this file
 */
IosStringsFile.prototype.getContext = function() {
	return "";
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 * 
 * @returns {Resource} all of the resources available in this resource file.
 */
IosStringsFile.prototype.getAll = function() {
	return this.set.getAll();
};

function localeContains(parent, child) {
	var p = new Locale(parent);
	var c = new Locale(child);
	
	return c.getLanguage() === p.getLanguage();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the 
 * context of the resource should match the context of
 * the file.
 * 
 * @param {Resource} res a resource to add to this file
 */
IosStringsFile.prototype.addResource = function(res) {
	logger.trace("IosStringsFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + res.locale);
	if (res && 
			res.getProject() === this.project.getProjectId() &&
			localeContains(this.locale, res.getLocale())) {
		logger.trace("correct project and locale. Adding.");
		this.set.add(res);
	} else {
		if (res) {
			if (res.getProject() !== this.project.getProjectId()) {
				logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
			} else {
				logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + res.getLocale() + " vs. " + this.locale);
			}
		} else {
			logger.warn("Attempt to add an undefined resource to a resource file.");
		}
	}
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 * 
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
IosStringsFile.prototype.isDirty = function() {
	return this.set.isDirty();
};

function escapeString(str) {
	return str.replace(/([^\\])'/g, "$1\\'").replace(/([^\\])"/g, '$1\\"')
		.replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

// we don't localize resource files
IosStringsFile.prototype.localize = function() {};

/**
 * Generate the content of the resource file.
 * 
 * @private
 * @returns {String} the content of the resource file
 */
IosStringsFile.prototype.getContent = function() {
	var resources = this.set.getAll();
	var content = "";
	
	for (var j = 0; j < resources.length; j++) {
		var resource = resources[j];
		var comment = resource.getComment();
		if (comment) {
			content += "/* " + comment + " */\n";
		}
		content += '"' + escapeString(resource.getKey()) + '" = "' + escapeString(resource.getSource()) + '";\n\n';
	}
	
	return content;
};

/**
 * Write the resource file out to disk again.
 */
IosStringsFile.prototype.write = function() {
	logger.trace("writing resource file. [" + [this.project.getProjectId(), this.locale].join(", ") + "]");
	if (this.set.isDirty()) {
		var dir;
		
		if (!this.pathName) {
			logger.trace("Calculating path name ");
			
			// must be a new file, so create the name
			dir = path.join(this.project.root, this.project.options.resourceDirs["objc"], this.locale + ".lproj");
			this.pathName = path.join(dir, "Localizable.strings");
		} else {
			dir = path.dirname(this.pathName);
		}
		
		var resources = this.set.getAll();

		logger.info("Writing iOS resources for locale " + this.locale + " to file " + this.pathName);
		
		var content = this.getContent();
		
		utils.makeDirs(dir);
	
		fs.writeFileSync(this.pathName, content, "utf8");
		logger.debug("Wrote string translations to file " + this.pathName);
	} else {
		logger.debug("File " + this.pathName + " is not dirty. Skipping.");
	}
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
IosStringsFile.prototype.getTranslationSet = function() {
	return this.set;
};

module.exports = IosStringsFile;