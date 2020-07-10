/*
 * GenerateResource.js - Generate JSON resource only with xliff files.
 *
 * Copyright © 2020, JEDLSoft
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
var log4js = require("log4js");
var utils = require("./utils.js");
var LocaleMatcher = require("ilib/lib/LocaleMatcher");
var TranslationSet = require("./TranslationSet.js");
var Xliff = require("./Xliff.js");

var logger = log4js.getLogger("loctool.lib.GenerateResource");

/**
 * @class A class that represents the local story of a set of
 * translations used in a project.
 *
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var GenerateResource = function (options) {
    logger.trace("GenerateResource constructor called");
    this.xliffsDir = ".";
    this.resRoot = "resources";
    this.resName = "strings.json";

    if (options.xliffsDir) {
        this.xliffsDir = options.xliffsDir;
    }
    if (options.resPath) {
        this.resRoot = options.resPath;
    }
    if (options.resName) {
        this.resName = options.resName;
    }
    this.ts = new TranslationSet(this.sourceLocale);
};

var xliffFileFilter = /(^|[^a-z])([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]))?\.xliff$/;

/**
 * Initialize this repository and read in all of the strings.
 *
 * @param {Project} project the current project
 * @param {Function(Object, Object)} cb callback to call when the
 * initialization is done
 */
GenerateResource.prototype.init = function() {
    var dir = this.xliffsDir;
    var list = fs.readdirSync(dir);
    list.filter(function(file) {
        var match = xliffFileFilter.exec(file);
        if (!match ||
           match.length < 2 ||
           (match.length >= 3 && match[2] && !utils.iso639[match[2]]) ||
           (match.length >= 5 && match[4] && !utils.iso15924[match[4]]) ||
           (match.length >= 7 && match[6] && !utils.iso3166[match[6]])) {
            return false;
        }
        return true;
    }).forEach(function (file) {
        pathName = path.join(dir, file);
        var xliff = new Xliff({
            sourceLocale: this.sourceLocale
        });
        if (fs.existsSync(pathName)) {
            var data = fs.readFileSync(pathName, "utf-8");
            xliff.deserialize(data);
            var ts = xliff.getTranslationSet();
            this.ts.addSet(ts);
        } else {
            logger.warn("Could not open xliff file: " + pathName);
        }
    }.bind(this));
    
    if (this.pathName) {
        var xliff = new Xliff({
            sourceLocale: this.sourceLocale
        });
        if (fs.existsSync(this.pathName)) {
            var data = fs.readFileSync(this.pathName, "utf-8");
            xliff.deserialize(data);
            var ts = xliff.getTranslationSet();
            this.ts.addSet(ts);
        } else {
            logger.warn("Could not open xliff file: " + this.pathName);
        }
    }
    if (this.ts.resources) {
        this.generate();
    }
};

GenerateResource.prototype.getResourcePath = function(resLocale) {
    var resPath = "";
    var splitLocale = resLocale.split("-");
    var minimalLocale = new LocaleMatcher({locale: resLocale}).getLikelyLocaleMinimal().getSpec();
    if (resLocale === minimalLocale ) {
        resPath = splitLocale[0];
    } else {
        resPath = splitLocale.join("/");
    }
    return resPath;
}

GenerateResource.prototype.writeFiles = function() {
    var manifest = {
        files: []
    }
    var fullPath;
    for (locale in this.output){
        var resourcePath = this.getResourcePath(locale);
        var content = JSON.stringify(this.output[locale], true, 4);
        utils.makeDirs(path.join(this.resRoot, resourcePath));
        fullPath = path.join(this.resRoot, resourcePath, this.resName);
        fs.writeFileSync(fullPath, content, "utf-8");
        logger.info("Wriring out " + fullPath);
        manifest.files.push(resourcePath + "/" + this.resName);
    }
    fs.writeFileSync(path.join(this.resRoot ,"ilibmanifest.json"), JSON.stringify(manifest), "utf-8");
    logger.info("Wriring out " + path.join(this.resRoot ,"ilibmanifest.json"));
}

GenerateResource.prototype.generate = function() {
    var resources = this.ts.resources;
    this.output = {};
    for (var i=0; i < resources.length; i++) {
        var locale = resources[i].targetLocale;
        if (!this.output[locale]) {
            this.output[locale] = {};
        }
        this.output[locale][resources[i].getSource()] = resources[i].getTarget();
    }
    this.writeFiles();
};

module.exports = GenerateResource;