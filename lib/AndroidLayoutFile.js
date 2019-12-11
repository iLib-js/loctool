/*
 * AndroidLayoutFile.js - tool to extract resources from source code
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
var log4js = require("log4js");
var path = require("path");
var xml2json = require("xml2json");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var ContextResourceString = require("./ContextResourceString.js");

var logger = log4js.getLogger("loctool.lib.AndroidLayoutFile");

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
    this.dirty = false;

    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.type = props.type;
        this.locale = props.locale;
    }

    this.sourceLocale = this.project && this.project.sourceLocale || "en-US";

    this.set = new TranslationSet(this.sourceLocale);

    this.replacements = {};
};

// See https://developer.android.com/guide/topics/resources/providing-resources.html table 2 for order of suffices
var lang = new RegExp("\/layout-([a-z][a-z])(-.*)?$");
var reg = new RegExp("\/layout-([a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var script = new RegExp("\/layout-([a-z][a-z])-s([A-Z][a-z][a-z][a-z])-r([A-Z][A-Z])(-.*)?$");
var context = new RegExp("\/layout-(.*)$");

/**
 * Parse the suffixes of the layout file for the context and the locale. The
 * context and locale for Android layout files
 * are given in the suffix of the directory name that the layout file
 * lives in.<p>
 *
 * The general syntax of the directory name is:<p>
 *
 * <pre>
 * "layout" [ "-" language [ "-r" region]] [ "-" context ]
 * </pre>
 *
 * That is, the string values is followed optionally by the context and the
 * language code and the region code for the locale.
 *
 * @private
 */
AndroidLayoutFile.prototype._parsePath = function() {
    if (!this._pathParsed)  {
        var dir = path.dirname(this.pathName || "");

        if (!this.locale) {
            // don't have it? Then guess based on the path name
            var match;
            if ((match = script.exec(dir)) && match && match.length > 0) {
                // this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-").replace("-s", "-")).getSpec();
                this.locale = new Locale(match[1], match[3], undefined, match[2]).getSpec();
                this.context = match[4] ? match[4].substring(1) : undefined;
                logger.trace("script");
            } else if ((match = reg.exec(dir)) && match && match.length > 0) {
                //this.locale = new Locale(dir.substring(dir.length-6).replace("-r", "-")).getSpec();
                this.locale = new Locale(match[1], match[2]).getSpec();
                this.context = match[3] ? match[3].substring(1) : undefined;
                logger.trace("region");
            } else if ((match = lang.exec(dir)) && match && match.length > 0) {
                // this.locale = new Locale(dir.substring(dir.length-2)).getSpec();
                this.locale = new Locale(match[1]).getSpec();
                this.context = match[2] ? match[2].substring(1) : undefined;
                logger.trace("language");
            } else if ((match = context.exec(dir)) && match && match.length > 0) {
                this.context = match.length > 1 && match[1].length ? match[1] : undefined;
                logger.trace("context");
            }

            if (!this.locale) {
                this.locale = this.project.sourceLocale;
            }
        } else if (!this.context) {
            var results = context.exec(dir);
            if (results && results.length) {
                this.context = results[1] || undefined;
                logger.trace("context only");
                // dir = dir.substring(0, dir.length-2);
            }
        }

        this.flavor = this.project.flavors.getFlavorForPath(dir);
        if (this.flavor === "main") {
            this.flavor = undefined;
        }

        logger.trace("_parsePath: locale is " + this.locale + " and context is " + this.context + " and flavor is " + this.flavor);
    }

    this._pathParsed = true;
};

/**
 * Get the locale of this layout file. For Android layout files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
AndroidLayoutFile.prototype.getLocale = function() {
    this._parsePath();

    return this.locale;
};

/**
 * Get the locale of this layout file. For Android layout files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
AndroidLayoutFile.prototype.getContext = function() {
    this._parsePath();

    return this.context;
};

AndroidLayoutFile.prototype.makeKey = function(type, source) {
    if (type.substring(0, 8) === "android:") {
        type = type.substring(8);
    }
    return (type + '_' + source).replace(/[^a-zA-Z0-9\_]/g, "_");
};

var localizableAttributes = {
    "android:title": true,
    "android:text": true,
    "android:queryHint": true,
    "android:contentDescription": true,
    "android:hint": true,
    "android:summary": true
};

/**
 * Return the string escaped for xml syntax.
 * @param {string} str the string to escape
 * @returns the escaped string
 */
function xmlEscape(str) {
    return str.
        replace(/&/g, "&amp;").
        replace(/</g, "&lt;").
        replace(/>/g, "&gt;").
        replace(/'/g, "&apos;").
        replace(/"/g, "&quot;");
}

/**
 * Return the string escaped for regular expression syntax.
 * @param {string} str the string to escape
 * @returns the escaped string
 */
function reEscape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Walk the node tree looking for properties that have localizable values, then extract
 * them and resourcify them.
 * @private
 */
AndroidLayoutFile.prototype.walkLayout = function(node) {
    var comment;
    for (var p in node) {
        var subnode = node[p];
        if (typeof(subnode) === "object") {
            this.walkLayout(subnode);
        } else if (typeof(subnode) === "string") {
            if (subnode.length && localizableAttributes[p]) {
                comment = node.i18n;
                logger.trace("Found resource " + p + " with string " + subnode + " and comment " + comment);
                if (utils.isAndroidResource(subnode)) {
                    // note that this is a used resource?
                    logger.trace("Already resourcified");
                } else if (!utils.isDNT(comment)) {
                    logger.trace("Resourcifying");
                    var key = this.makeKey(p, subnode);
                    node[p] = "@string/" + key;
                    var res = new ContextResourceString({
                        key: key,
                        source: subnode,
                        pathName: this.pathName,
                        sourceLocale: this.locale || this.sourceLocale,
                        context: this.context || undefined,
                        project: this.project.getProjectId(),
                        autoKey: true,
                        comment: comment,
                        dnt: utils.isDNT(comment),
                        datatype: this.type.datatype,
                        flavor: this.flavor,
                        index: this.resourceIndex++
                    });
                    this.set.add(res);
                    this.dirty = true;
                    this.replacements[reEscape(p + '="' + subnode + '"')] = p + '="' + node[p] + '"';
                    logger.trace("Recording replacement " + p + '="' + subnode + '" to ' + p + '="' + node[p] + '"');
                }
            }
        } else if (ilib.isArray(subnode)) {
            for (var i = 0; i < subnode.length; i++) {
                this.walkLayout(subnode[i]);
            }
        }
    }
};

/**
 * Parse an Android Layout XML string and extract the resources.
 *
 * @param {String} data the string to parse
 */
AndroidLayoutFile.prototype.parse = function(data) {
    this.xml = data;
    this.contents = xml2json.toJson(data, {object: true});
    this.resourceIndex = 0;

    /*
    if (!this.contents ||
            (!this.contents.FrameLayout &&
            !this.contents.RelativeLayout &&
            !this.contents.LinearLayout &&
            !this.contents.Scrollview &&
            !this.contents.WebView &&
            !this.contents.Scrollview) ) {
        logger.debug(this.pathName + " is not a layout file, skipping.");
        logger.trace("Parsed file is " + JSON.stringify(this.content, undefined, 4));
        return;
    }
    */

    this.walkLayout(this.contents);
};

/**
 * Extract all the localizable strings from the layout file and add them to the
 * project's translation set.
 */
AndroidLayoutFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        this._parsePath(); // get the locale and context to use while making the resource instances

        var p = path.join(this.project.root, this.pathName);
        try {
            var xml = fs.readFileSync(this.pathName, "utf8");
            if (xml) {
                logger.trace("file contents: " + xml);
                this.parse(xml);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.debug(e);
        }
    }
};

/**
 * @private
 */
AndroidLayoutFile.prototype._getXML = function() {
    // return the original if the contents have not been modified
    var xml = this.xml;

    if (this.dirty) {
        for (var p in this.replacements) {
            var re = new RegExp(p, "g");
            xml = xml.replace(re, this.replacements[p]);
        }
    }

    return xml;
};

//we don't localize individual android layout files
AndroidLayoutFile.prototype.localize = function() {};

/**
 * Write out the contents to the appropriate file.
 */
AndroidLayoutFile.prototype.write = function() {
    logger.info("Writing Android layout file for locale " + this.locale + " to file " + this.pathName);
    if (this.contents && this.dirty && this.pathName) {
        logger.trace("Writing contents now");
        var filename = path.join(this.project.target, this.pathName);
        utils.makeDirs(path.dirname(filename));
        fs.writeFileSync(filename, this._getXML(), "utf-8");
    } else {
        logger.debug("Android layout file for locale " + this.locale + " file " + this.pathName + " is not dirty. Not writing.");
    }
};

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
