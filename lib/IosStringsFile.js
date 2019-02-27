/*
 * IosStringsFile.js - represents an iOS strings resource file
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
 * <li>project - the name of the project for this file
 * <ul>
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
        this.flavor = props.flavor;
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
    this.resourceIndex = 0;

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
            if (match && match.length > 3 && match[3] && match[3].trim().length > 0) {
                logger.trace("Found resource string: " + match[1] + " = " + match[3]);
                var params = {
                    project: this.project.getProjectId(),
                    key: match[1],
                    pathName: this.sourcePath,
                    comment: comment,
                    datatype: this.type.datatype,
                    flavor: this.flavor,
                    index: this.resourceIndex++
                };
                if (this.locale === this.project.sourceLocale) {
                    params.source = match[3];
                    params.sourceLocale = this.locale;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.target = match[3];
                    params.targetLocale = this.locale;
                }
                var res = new IosLayoutResourceString(params);
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
            if (this.flavor && dir === "en-US") {
                this.origin = "source";
                this.sourcePath = this.pathName;
            } else if (this.project.getResourceDirs("objc") !== path.dirname(this.pathName) && dir === "en-US") {
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
                fs.closeSync(fd);

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
    if (!this._pathParsed && this.pathName) {
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

        if (this.project.flavors) {
            var filename = path.basename(this.pathName, ".strings");
            var i = this.project.flavors.indexOf(filename);
            if (i > -1) {
                this.flavor = this.project.flavors[i];
            }
        }
    }

    this._pathParsed = true;
};

/**
 * Get the path to this file.
 *
 * @returns {String} the path to this file
 */
IosStringsFile.prototype.getPath = function() {
    return this.pathName;
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
    logger.trace("IosStringsFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + res.getTargetLocale());
    if (res &&
            res.getProject() === this.project.getProjectId() &&
            localeContains(this.locale, res.getTargetLocale())) {
        logger.trace("correct project and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + res.getTargetLocale() + " vs. " + this.locale);
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
    // if (!str) return undefined;
    str = str.replace(/(^|[^\\])"/g, '$1\\"');
    str = str.replace(/\n/g, "\\n");
    str = str.replace(/\t/g, "\\t");
    return str;
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

    // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
    resources.sort(function(left, right) {
        return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
    });

    for (var j = 0; j < resources.length; j++) {
        var resource = resources[j];
        var comment = resource.getComment();
        if (j > 0) content += "\n";
        if (comment) {
            content += "/* " + comment + " */\n";
        }
        var thiskey = resource.datatype === "x-xib" ? resource.getKey() : resource.getSource();
        var target = resource.getTarget() || resource.getSource();
        content += '"' + escapeString(thiskey) + '" = "' + escapeString(target) + '";\n';
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
            this.pathName = this.type.getResourceFilePath(this.locale || this.project.sourceLocale, undefined, "objc", this.flavor);
        }

        var p = path.join(this.project.target, this.pathName);
        dir = path.dirname(p);

        var resources = this.set.getAll();

        logger.info("Writing iOS resources for locale " + this.locale + " to file " + this.pathName);

        var content = this.getContent();

        utils.makeDirs(dir);

        fs.writeFileSync(p, content, "utf8");
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
