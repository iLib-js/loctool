/*
 * AndroidFlavors.js - find and report on Android flavors
 *
 * Copyright © 2017, HealthTap, Inc.
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

var utils = require("./utils.js");
var BuildGradle = require("./BuildGradle.js");

var logger = log4js.getLogger("loctool.lib.AndroidFlavors");

/**
 * @class Represents a set of Android flavors.
 * The flavors will be automatically extracted from the given
 * build.gradle file. If there is no build.gradle file or if there
 * are no flavors in it, this class should still work, but will
 * only report and use the default flavor "main".
 *
 * @param {String} pathName path to the build.gradle file
 * @param {String} root root of the project containing this build.gradle
 */
var AndroidFlavors = function(pathName, root) {
    this.flavors = {};
    this.root = path.join(root || ".");

    if (pathName) {
        var bg = new BuildGradle({
            root: this.root,
            path: pathName
        });

        var flavors = bg.getFlavors();
        if (flavors) {
            flavors.forEach(function(flavor) {
                this.flavors[flavor] = {
                    res: bg.getFlavorRes(flavor),
                    src: bg.getFlavorSrc(flavor)
                };
            }.bind(this));
        }
    }
};

/**
 * Return true if this object contains any flavors.
 *
 * @return {boolean} true if this object contains any flavors,
 * and false otherwise
 */
AndroidFlavors.prototype.hasFlavors = function() {
    return Object.keys(this.flavors).length > 0;
};

/**
 * Return the set of flavors.
 */
AndroidFlavors.prototype.getAllFlavors = function() {
    return Object.keys(this.flavors);
};

/**
 * Return the array of paths to the source directories of the given flavor.
 *
 * @return {Array.<String>} the paths to the source directory of the given flavor
 */
AndroidFlavors.prototype.getSourceDirs = function(flavor) {
    var f = this.flavors[flavor];
    if (f) {
        return f.src;
    } else {
        return ["android/java"];
    }
};

/**
 * Return the array of paths to the res directories of the given flavor.
 *
 * @return {Array.<String>} the paths to the res directory of the given flavor
 */
AndroidFlavors.prototype.getResourceDirs = function(flavor) {
    var f = this.flavors[flavor];
    if (f) {
        return f.res;
    } else {
        return ["android/res"];
    }
};

/**
 * Return the name of the flavor containing the given path.
 * If there are no flavors or if the path does not match
 * any flavor, it will return the default flavor "main".
 *
 * @param {String} pathName the path to the file being
 * tested for a flavor
 * @return {String} the name of the flavor containing the
 * given path.
 */
AndroidFlavors.prototype.getFlavorForPath = function(pathName) {
    if (pathName && this.flavors && Object.keys(this.flavors).length > 0) {
        // strip off the root and look only at the relative dir from the root
        var stripped = pathName.startsWith(this.root) ? pathName.substring(this.root.length+1) : pathName;
        for (var f in this.flavors) {
            var srcDirs = this.flavors[f].src;
            for (var i = 0; i < srcDirs.length; i++) {
                if (stripped.startsWith(srcDirs[i])) {
                    return f;
                }
            }
            var resDirs = this.flavors[f].res;
            for (var i = 0; i < resDirs.length; i++) {
                if (stripped.startsWith(resDirs[i])) {
                    return f;
                }
            }
        }
    }

    return "main";
};

module.exports = AndroidFlavors;
