/*
 * BuildGradle.js - read a build.gradle file and return info about the Android project
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

var log4js = require("log4js");
var bgr = require("build-gradle-reader");
var path = require("path");
var fs = require("fs");

var logger = log4js.getLogger("loctool.lib.BuildGradle");

/**
 * Create a new instance that represents a build.gradle file.
 *
 * @param {String} root the project root directory
 * @param {String} path path to the build.gradle file
 */
var BuildGradle = function(props) {
    if (!props) throw "missing properties parameter";

    this.root = props.root || ".";

    this.path = props.path;
    if (!fs.existsSync(path.join(this.root, this.path))) {
        this.path = "./build.gradle";
    }
    this.base = path.dirname(this.path);
    if (!fs.existsSync(path.join(this.root, this.path))) {
        this.info = {};
        return;
    }

    var data = fs.readFileSync(path.join(this.root, this.path), "utf-8");
    this.info = bgr(data);
};

/**
 * Return an array of product flavors for this Android app.
 *
 * @return {Array.<String>} an array of flavor names
 */
BuildGradle.prototype.getFlavors = function() {
    if (!this.info.android || !this.info.android.productFlavors) {
        return [];
    }

    var ret = [];
    for (var flavor in this.info.android.productFlavors) {
        ret.push(flavor);
    }
    return ret;
};

/**
 * Return an array of res dirs in this Android app for the
 * given flavor. This gives the full relative path from
 * the root of the project down to the res dir, rather
 * than the relative path from the build.gradle file.
 *
 * @param {String} flavor name of the flavor for which the
 * res dirs should be found
 * @return {<Array.<String>} an array of paths for the res
 * dirs for this flavor
 */
BuildGradle.prototype.getFlavorRes = function(flavor) {
    if (this.info.android &&
            this.info.android.sourceSets &&
            this.info.android.sourceSets[flavor] &&
            this.info.android.sourceSets[flavor]["res.srcDirs"]) {
        return this.info.android.sourceSets[flavor]["res.srcDirs"].map(function(dir) {
            return path.join(this.base, dir);
        }.bind(this));
    }
    return [ path.join("src", flavor, "res") ];
};

/**
 * Return an array of src dirs in this Android app for the
 * given flavor. This gives the full relative path from
 * the root of the project down to the src dir, rather
 * than the relative path from the build.gradle file.
 *
 * @param {String} flavor name of the flavor for which the
 * res dirs should be found
 * @return {<Array.<String>} an array of paths for the src
 * dirs for this flavor
 */
BuildGradle.prototype.getFlavorSrc = function(flavor) {
    if (this.info.android &&
            this.info.android.sourceSets &&
            this.info.android.sourceSets[flavor] &&
            this.info.android.sourceSets[flavor]["java.srcDirs"]) {
        return this.info.android.sourceSets[flavor]["java.srcDirs"].map(function(dir) {
            return path.join(this.base, dir);
        }.bind(this));
    }
    return [ path.join("src", flavor, "java") ];
};

module.exports = BuildGradle;
