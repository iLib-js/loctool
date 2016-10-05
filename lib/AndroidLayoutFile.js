/*
 * AndroidLayoutFile.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var utils = require("./utils.js");
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

/**
 * Read the given xml file and convert it to json.
 * 
 * @private
 * @param pathName path to load
 * @returns a javascript object containing the same information as the xml file
 */
function readLayoutFile(pathName) {
	var xml = fs.readFileSync(pathName, "utf8");
	return xml2json.toJson(xml, {object: true});
}


/**
 * @class Represents an Android layout file.
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
var AndroidLayoutFile = function(props) {
	if (props) {
		this.project = props.project;
		this.pathName = props.pathName;
		this.type = props.type;
		this.locale = props.locale;
	}
	
	this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

AndroidLayoutFile.prototype.makeKey = function(source) {
	return source.toLowerCase().replace(/ /g, "_");
};

var localizableAttributes = {
	"android:title": 1,
	"android:text": 1,
	"android:queryHint": 1,
	"android:contentDescription": 1,
	"android:hint": 1
};


AndroidLayoutFile.prototype.walkLayout = function(node) {
	for (var p in node) {
		var subnode = node[p];
		if (typeof(node[p]) === "object") {
			this.walkLayout(subnode);
		} else if (typeof(subnode) === "string") {
			if (localizableAttributes[p]) {
				logger.trace("Found resource " + p + " with string " + subnode);
				if (subnode.length > 8 && subnode.substring(0,8) === "@string/") {
					// note that this is a used resource?
					logger.trace("Already resourcified");
				} else {
					logger.trace("Resourcifying");
					var key = this.makeKey(p, subnode);
					node[p] = "@string/" + key;
				}
				var res = new ResourceString({
					key: key,
					source: subnode,
					pathName: this.pathName,
					locale: locale,
					context: this.context || undefined,
					project: this.project.getProjectId()
				});
				this.set.add(res);
			}
		} else if (utils.isArray(subnode)) {
			for (var i = 0; i < subnode.length; i++) {
				this.walkLayout(subnode[i]);
			}
		}
	}
};

AndroidLayoutFile.prototype.extract = function(filetype) {
	if (this.pathName) {
		this.contents = readLayoutFile(this.pathName);
		if (this.contents) {
			if (!this.contents.FrameLayout && 
				!this.contents.RelativeLayout &&
				!this.contents.LinearLayout &&
				!this.contents.Scrollview &&
				!this.contents.WebView &&
				!this.contents.Scrollview ) {
				logger.debug(this.pathName + " is not a layout file, skipping.");
				return;
			}
		
			this.walkLayout(this.contents);
		}
	}
};

AndroidLayoutFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current layout file.
 * 
 * @returns {TranslationSet} The set of resources found in the
 * current layout file.
 */
AndroidLayoutFile.prototype.getTranslationSet = function() {
	return this.set;
};

module.exports = AndroidLayoutFile;
