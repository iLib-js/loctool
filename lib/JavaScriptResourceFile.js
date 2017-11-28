/*
 * JavaScriptResourceFile.js - represents an Android strings.xml resource file
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var PrettyData = require("pretty-data").pd;
var log4js = require("log4js");

var ResourceString = require("./ResourceString.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")

var logger = log4js.getLogger("loctool.lib.JavaScriptResourceFile");

/**
 * @class Represents an Android resource file.
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
var JavaScriptResourceFile = function(props) {
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = props.locale;
    }

    this.set = new TranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * We don't read javascript resource files. We only write them.
 */
JavaScriptResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JavaScriptResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JavaScriptResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
JavaScriptResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
JavaScriptResourceFile.prototype.addResource = function(res) {
    logger.trace("JavaScriptResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale) {
        logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale);
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
JavaScriptResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
JavaScriptResourceFile.prototype.localize = function() {};

function clean(str) {
    return str.replace(/\s+/, " ").trim();
}

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
JavaScriptResourceFile.prototype.getContent = function() {
    var json = {};

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            if (resource.getSource() && resource.getTarget()) {
                if (clean(resource.getSource()) !== clean(resource.getTarget())) {
                    logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());
                    json[resource.getKey()] = this.project.settings.identify ?
                        '<span loclang="javascript" locid="' + resource.getKey() + '">' + resource.getTarget() + '</span>' :
                        resource.getTarget();
                } else {
                    logger.trace("skipping translation with no change");
                }
            } else {
                logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

	// allow for a project-specific prefix to the file to do things like importing modules and such
	var output = "";
	var settings = this.project.settings; 
	if (settings && settings.JavaScriptResourceFile && settings.JavaScriptResourceFile.prefix) {
		output = settings.JavaScriptResourceFile.prefix;
	}
	output += 'ilib.data.strings_' + this.locale.replace(/-/g, "_") + " = ";
	output += JSON.stringify(json, undefined, 4);
	output += ";\n";
	
	// take care of double-escaped unicode chars
	output = output.replace(/\\\\u/g, "\\u");
	
	return output; 
};

/**
 * Write the resource file out to disk again.
 */
JavaScriptResourceFile.prototype.write = function() {
    logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        if (!this.pathName) {
            logger.trace("Calculating path name ");

            // must be a new file, so create the name
            dir = path.join(this.project.target, this.project.options.resourceDirs["js"]);
            this.pathName = path.join(dir, this.locale + ".js");
        } else {
            dir = path.dirname(this.pathName);
        }

        var json = {};

        logger.info("Writing JavaScript resources for locale " + this.locale + " to file " + this.pathName);

        utils.makeDirs(dir);

        var js = this.getContent();
        fs.writeFileSync(this.pathName, js, "utf8");
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
JavaScriptResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = JavaScriptResourceFile;
