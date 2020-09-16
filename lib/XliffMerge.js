/*
 * XliffMerge.js - Merge multiple xliff files into one
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

var fs = require('fs');
var log4js = require("log4js");
const Xliff = require("./Xliff");
var logger = log4js.getLogger("loctool.lib.XliffMerge");

/**
 * Define the process of generate mode
 *
 * @param {Object} settings an object containing the current settings
 * @returns {boolean} true if the process is done
 * 
 */
var XliffMerge = function XliffMerge(settings) {
    if (!settings) return;

    var target = new Xliff({
        path: settings.outfile,
        version: settings.xliffVersion
    });

    settings.infiles.forEach(function (file) {
        if (fs.existsSync(file)) {
            logger.info("Merging " + file + " ...");
            var data = fs.readFileSync(file, "utf-8");
            var xliff = new Xliff({
                version: settings.xliffVersion
            });
            xliff.deserialize(data);
            target.addTranslationUnits(xliff.getTranslationUnits());
        } else {
            logger.warn("Could not open input file " + file);
        }
    });

    return target;
}

XliffMerge.write = function (xliff) {
    if (!xliff) return;
    fs.writeFileSync(target.getPath(), target.serialize(), "utf-8");
    return true;
}


module.exports = XliffMerge;