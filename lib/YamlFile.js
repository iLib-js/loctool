/*
 * YamlFile.js - represents a yaml source file that needs to be localized.
 * This is different than a yaml resource file which is the destination
 * yaml for ruby and haml strings. This file represents a yaml file which
 * is the source for new strings to localize and which is localized by
 * writing out a parallel yml file with the same structure, but translated
 * content.
 *
 * Copyright © 2016-2018, HealthTap, Inc.
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
var jsyaml = require("js-yaml");

var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ContextResourceString = require("./ContextResourceString.js");
var Set = require("./Set.js");
var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js")
var log4js = require("log4js");

var logger = log4js.getLogger("loctool.lib.YamlFile");

/**
 * @class Represents a yaml source file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * <li>flavor - the flavor of this file (for customized strings)
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var YamlFile = function(props) {
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = props.locale;
        this.type = props.type;
        this.flavor = props.flavor;
    }

    this.locale = this.locale || (this.project && this.project.sourceLocale) || "en-US";

    this.set = new TranslationSet(this.locale);

    if (this.pathName && this.project && this.project.flavors) {
        var filename = path.basename(this.pathName, ".yml");
        var l = new Locale(filename);
        if (l.getVariant() && this.project.flavors.indexOf(l.getVariant()) > -1) {
            this.flavor = l.getVariant();
        }
    }
};

//characters that are bad in the start of the word
var badStartPunct = {
    '~': true,
    '!': true,
    '@': true,
    '#': true,
    '$': true,
    '^': true,
    '*': true,
    '_': true,
    '=': true,
    '+': true,
    '|': true,
    ':': true,
    ';': true,
    '.': true,
    '?': true,
    '/': true,
    '<': true,
    '>': true,
    ',': true
};

//characters that are bad in the middle of the word
var badMiddlePunct = {
    '~': true,
    '!': true,
    '@': true,
    '#': true,
    '$': true,
    '%': true,
    '^': true,
    '*': true,
    '_': true,
    '=': true,
    '+': true,
    '|': true,
    ':': true,
    ';': true,
    '.': true,
    '?': true,
    '/': true,
    '<': true,
    '>': true,
    ',': true,
    '"': true
};

// characters that are bad at the end of the word
var badEndPunct = {
    '~': true,
    '@': true,
    '#': true,
    '$': true,
    '^': true,
    '*': true,
    '_': true,
    '=': true,
    '+': true,
    '|': true,
    '/': true,
    '<': true,
    '>': true,
    ',': true
};

/**
 * @private
 */
YamlFile.prototype._isTranslatable = function(resource) {
    var locale = new Locale(this.getLocale());

    if (!resource || typeof(resource) !== "string") {
        return false;
    }
    if (locale.language === "zh" ||
            locale.language === "ja" ||
            locale.language === "ko" ||
            locale.language === "th" ||
            resource.indexOf(' ') > -1) {
        return true;
    }

    // only one word?

    // 99.3% of English words are longer than 3 characters
    // 99.8% of English words are shorter than 20 letters so anything
    // outside that range is most probably not an English word
    if (resource.length < 4 || resource.length > 20) {
        return false;
    }

    // any bad punctuation? Not a single English word
    if (badStartPunct[resource[0]] || badEndPunct[resource[resource.length-1]]) {
        return false;
    }

    for (var i = 1; i < resource.length-1; i++) {
        if (badMiddlePunct[resource[i]]) {
            return false;
        }
    }

    // all non-letters or embedded digits? Not English
    if (!resource.match(/[a-zA-Z]/) || resource.match(/[0-9]/)) {
        return false;
    }

    // ALL CAPS? all lower? Initial cap? Okay
    // CamelCase? Not English
    return !resource.match(/[A-Z].*[a-z].*[A-Z]/);
};

/**
 * @private
 */
YamlFile.prototype._parseResources = function(prefix, obj, set, localize) {
    var locale = this.getLocale();
    for (var key in obj) {
        if (typeof(obj[key]) === "object") {
            var localizeChildren = localize && (this.getExcludedKeysFromSchema().indexOf(key) === -1);
            var pre = prefix ? prefix + "@" : "";
            this._parseResources(pre + key.replace(/@/g, "\\@"), obj[key], set, localizeChildren);
        } else if (localize && this.getExcludedKeysFromSchema().indexOf(key) === -1) {
            var resource = obj[key];
            if (this._isTranslatable(resource)) {
                logger.trace("Adding string resource " + JSON.stringify(resource) + " locale " + this.getLocale());
                var params = {
                    project: this.project.getProjectId(),
                    key: key,
                    autoKey: true,
                    pathName: this.pathName,
                    datatype: this.type.datatype,
                    context: prefix,
                    localize: localize,
                    index: this.resourceIndex++
                };
                if (locale === this.project.sourceLocale || this.flavor) {
                    params.sourceLocale = locale;
                    params.source = resource;
                    params.flavor = this.flavor;
                } else {
                    params.sourceLocale = this.project.sourceLocale;
                    params.target = resource;
                    params.targetLocale = locale;
                }
                var res = new ContextResourceString(params);

                set.add(res);
            }
        }
    }
}

/**
 * @private
 */
YamlFile.prototype._mergeOutput = function(prefix, obj, set) {
    for (var key in obj) {
        if (typeof(obj[key]) === "object") {
            var pre = prefix ? prefix + "@" : "";
            this._mergeOutput(pre + key.replace(/@/g, "\\@"), obj[key], set);
        } else {
            var resource = obj[key];
            if (this._isTranslatable(resource)) {
                logger.trace("Found string resource " + JSON.stringify(resource) + " with key " + key + " locale " + this.getLocale());
                var resources = (this.getLocale() === this.project.sourceLocale) ?
                    set.getBy({reskey: key, pathName: this.pathName, sourceLocale: this.getLocale(), project: this.project.getProjectId()}) :
                    set.getBy({reskey: key, pathName: this.pathName, targetLocale: this.getLocale(), project: this.project.getProjectId()});

                var existing = resources && resources[0];
                if (existing && !existing.getLocalize()) {
                    // modify in place
                    if (this.getLocale() === this.project.sourceLocale) {
                        existing.setSource(resource);
                    } else {
                        existing.setTarget(resource);
                    }
                    set.dirty = true;
                } else if (existing){
                    logger.debug("Overwriting value for string resource " + JSON.stringify(existing));
                }
            }
        }
    }
}

/**
 * Parse a yml file and store the resources found in it into the
 * file's translation set.
 *
 * @param {String} str the string to parse
 */
YamlFile.prototype.parse = function(str) {
    this.resourceIndex = 0;
    this.json = jsyaml.safeLoad(str);
    this._parseResources(undefined, this.json, this.set, true);
};

/**
 * Parse a target yml file, compare to source's entries
 * Where a non-localizable resource from the target matches
 * one from the source, keep the value from the target file
 *
 * @param {String} str the string to parse
 */
YamlFile.prototype.parseOutputFile = function(str) {
    var json = jsyaml.safeLoad(str);
    this._mergeOutput(undefined, json, this.set, true);
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
YamlFile.prototype.extract = function() {
    if (this.getSchemaPath()){
        var p = path.join(this.project.root, this.getSchemaPath());
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data){
                this.schema = JSON.parse(data);
            }
        } catch(e){
            logger.warn("No schema file found at " + p);
        }
    }
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

    // mark this set as not dirty after we read it from disk
    // so we can tell when other code has added resources to it
    this.set.setClean();
};

/**
 * Get the path name of this resource file.
 *
 * @returns {String} the path name to this file
 */
YamlFile.prototype.getPath = function() {
    return this.pathName;
};

/**
 * Get the path name of schema file for the given resource file.
 *
 * @returns {String} the path name to this file
 */
YamlFile.prototype.getSchemaPath = function() {
    if (this.pathName) {
        return this.pathName.replace(".yml", "-schema.json");
    }
};

/**
 * Get the schema object
 *
 * @returns {Object} the options loaded from the schema file
 */
YamlFile.prototype.getSchema = function() {
    return this.schema;
};

/**
 * Get the locale of this resource file.
 *
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file.
 *
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getContext = function() {
    return "";
};

/**
 * Get the flavor of this resource file. The flavor determines
 * the customization of the strings, which allows for different English
 * source strings for the same resource key based on the flavor. For
 * example, if your app has the string "Log-in" when there is no flavor,
 * it might have the strings "Enter your partner ID:" for one partner,
 * and "Enter your member number:" for a different partner. Each of the
 * strings with a different flavor is a source string that needs to be
 * translated separately, even though they have the same key.
 *
 * @returns {String|undefined} the flavor of this file, or undefined
 * for no flavor
 */
YamlFile.prototype.getFlavor = function() {
    return this.flavor;
};


/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
YamlFile.prototype.getAll = function() {
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
YamlFile.prototype.addResource = function(res) {
    logger.trace("YamlFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    if (res && res.getProject() === this.project.getProjectId()) {
        logger.trace("correct project. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
        } else {
            logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};


/**
 * Add every resource in the given array to this file.
 * @param {Array.<Resource>} resources an array of resources to add
 * to this file
 */
YamlFile.prototype.addAll = function(resources) {
    if (resources && resources.length) {
        resources.forEach(function(resource) {
            this.addResource(resource);
        }.bind(this));
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
YamlFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
YamlFile.prototype.getContent = function() {
    var json = {};

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        for (var j = 0; j < resources.length; j++) {
            var target, resource = resources[j];
            if (resource.resType === "plural" || resource.getTarget() || resource.getSource()) {
                var key = resource.getKey();
                var parent = json;
                var context = resource.getContext();
                if (context && context.length) {
                    var parts = context.split(/@/g);
                    for (var i = 0; i < parts.length; i++) {
                        if (!parent[parts[i]]) {
                            parent[parts[i]] = {};
                        }
                        parent = parent[parts[i]];
                    }
                }
                if (resource.resType === "plural") {
                    logger.trace("writing plural translation for " + resource.getKey() + " as " + JSON.stringify(resource.getTargetPlurals() || resource.getSourcePlurals()));
                    parent[key] = resource.getTargetPlurals() || resource.getSourcePlurals();
                } else {
                    logger.trace("writing translation for " + resource.getKey() + " as " + (resource.getTarget() || resource.getSource()));
                    parent[key] = resource.getTarget() || resource.getSource();
                }
            } else {
                logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

    logger.trace("json is " + JSON.stringify(json));

    // now convert the json back to yaml
    // return yamljs.stringify(json, 4, 2, {});
    return jsyaml.safeDump(json, {
        schema: jsyaml.FAILSAFE_SCHEMA,
        noCompatMode: true,
        sortKeys: true,
        linewidth: -1
    });
};

//we don't write to yaml source files
YamlFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
YamlFile.prototype.getTranslationSet = function() {
    return this.set;
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written. This should be relative to
 * the root of the project.
 *
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
YamlFile.prototype.getLocalizedPath = function(locale) {
    var fullPath = this.getOutputFilenameForLocale(locale);
    var dirName = path.dirname(fullPath);
    var fileName = path.basename(fullPath);
    if (this.getUseLocalizedDirectoriesFromSchema()) {
        var fullDir = path.join(dirName, locale);
        return path.join(fullDir, fileName);
    }
    return fullPath;
};

/**
 * @private
 */
YamlFile.prototype._localizeContent = function(prefix, obj, translations, locale, localize) {
    var ret = {};
    this.resourceIndex = 0;

    for (var key in obj) {
        if (typeof(obj[key]) === "object") {
            if (obj[key]) {
                var localizeChildren = localize && (this.getExcludedKeysFromSchema().indexOf(key) === -1);
                var pre = prefix ? prefix + "@" : "";
                ret[key] = this._localizeContent(pre + key.replace(/@/g, "\\@"), obj[key], translations, locale, localizeChildren);
            } else {
                ret[key] = "";
            }
        } else if (localize && this.getExcludedKeysFromSchema().indexOf(key) === -1) {
            var resource = obj[key];
            if (this._isTranslatable(resource)) {
                logger.trace("Localizing string resource " + JSON.stringify(resource) + " locale " + locale);
                var hashkey = ContextResourceString.hashKey(this.project.getProjectId(), prefix, locale, key, this.type.datatype);
                var res = translations.get(hashkey);
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    ret[key] = obj[key].toString();
                } else if (!res && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.get(ContextResourceString.hashKey(this.project.getProjectId(), prefix, sourceLocale, key, this.type.datatype));
                        source = sourceRes ? sourceRes.getTarget() : obj[key].toString();
                        ret[key] = this.type.pseudos[locale].getString(source);
                        this.dirty |= (sourceRes && ret[key] !== source);
                    } else {
                        source = obj[key].toString();
                        ret[key] = this.type.pseudos[locale].getString(source);
                        this.dirty |= (ret[key] !== source);
                    }
                } else {
                    if (res && utils.cleanString(res.getSource()) === utils.cleanString(obj[key].toString())) {
                        logger.trace("Translation: " + res.getTarget());
                        ret[key] = res.getTarget();
                        this.dirty |= (ret[key] !== res.getSource());
                    } else {
                        var note = res ? 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + res.getSource() + '"' : undefined;
                        if (this.type) {
                            this.type.newres.add(new ContextResourceString({
                                project: this.project.getProjectId(),
                                key: key,
                                source: obj[key],
                                sourceLocale: this.project.sourceLocale,
                                target: (res && res.getTarget()) || obj[key],
                                targetLocale: locale,
                                pathName: this.pathName,
                                datatype: this.type.datatype,
                                context: prefix,
                                state: "new",
                                flavor: this.flavor,
                                comment: note,
                                index: this.resourceIndex++
                            }));
                        }
                        logger.trace("Missing translation");
                        ret[key] = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                            this.type.missingPseudo.getString(resource) : resource;
                        this.dirty |= (ret[key] !== resource);
                    }
                }
            } else {
                ret[key] = obj[key].toString();
            }
        } else {
            ret[key] = obj[key].toString();
        }
    }

    return ret;
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
YamlFile.prototype.localizeText = function(translations, locale) {
    var output = "";
    if (this.json) {
        this.dirty = false;
        var localizedJson = this._localizeContent(undefined, this.json, translations, locale, true);
        if (localizedJson) {
            logger.trace("Localized json is: " + JSON.stringify(localizedJson, undefined, 4));

            try {
                output = jsyaml.safeDump(localizedJson, {
                    schema: jsyaml.FAILSAFE_SCHEMA,
                    noCompatMode: true,
                    sortKeys: true,
                    linewidth: -1
                });
            } catch (e) {
                console.log("Error while localizing file " + this.pathName + " for locale " + this.locale);
                console.log(JSON.stringify(localizedJson, undefined, 4));
                throw e;
            }
        }
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
YamlFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    if (this.json) {
        for (var i = 0; i < locales.length; i++) {
            var p, pathName = this.getLocalizedPath(locales[i]);
            logger.debug("Checking for existing output file " + pathName);

            try {
                p = path.join(this.project.root, pathName);
                if (fs.existsSync(p)) {
                    var data = fs.readFileSync(p, "utf8");
                    if (data) {
                        this.parseOutputFile(data);
                    }
                }
            } catch (e) {
                logger.warn("Could not read file: " + p);
                logger.warn(e);
            }

            logger.debug("Writing file " + pathName);
            p = path.join(this.project.target, pathName);
            var dir = path.dirname(p);
            utils.makeDirs(dir);
            fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
        }
    } else {
        logger.debug(this.pathName + ": No json, no localize");
    }
};

/**
 * Extract values of key 'excluded_keys' from the loaded schema
 *
 * @return {Array.<String>} keys that should not be localized at output time
 */
YamlFile.prototype.getExcludedKeysFromSchema = function(){
    if (this.schema && this.schema['excluded_keys']) {
        return this.schema['excluded_keys'];
    }
    return [];
}

/**
 * Extract values of key 'useLocalizedDirectories' from the loaded schema
 * Defaults to TRUE
 *
 * @return {Boolean} whether output should be written to directory for locale,
 * or kept in same directory as source.
 */
YamlFile.prototype.getUseLocalizedDirectoriesFromSchema = function(){
    if (this.schema && typeof(this.schema['useLocalizedDirectories']) === "boolean") {
        return this.schema['useLocalizedDirectories'];
    }
    return true;
}

/**
 * Extract matching value for string locale from object 'outputFilenameMapping' in the loaded schema
 *
 * @param {String} locale locale for which to look for a custom filename
 * @return {String} string filename specified for the given locale in the schema object
 *  defaults to file's own pathname
 */
YamlFile.prototype.getOutputFilenameForLocale = function(locale){
    if (this.schema && this.schema['outputFilenameMapping'] && typeof(locale) === "string" && this.schema['outputFilenameMapping'][locale]) {
        return this.schema['outputFilenameMapping'][locale];
    }
    return path.normalize(this.pathName);
}

module.exports = YamlFile;
