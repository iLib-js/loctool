/*
 * XliffSplit.js - test the split of Xliff object.
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
var Xliff = require("./Xliff.js");

var log4js = require("log4js");
var logger = log4js.getLogger("loctool.lib.XliffSplit");

/**
 * Define the process of generate mode
 *
 * @param {Project} project the current project
 * @returns {boolean} true if the process is done
 * 
 */
var XliffSplit = function XliffSplit(settings) {
    if (!settings) return;
    
    var superset = [];

    settings.infiles.forEach(function (file) {
        logger.info("Reading " + file + " ...");
        if (fs.existsSync(file)) {
            var data = fs.readFileSync(file, "utf-8");
            var xliff = new Xliff({
                version: settings.xliffVersion
            });
            xliff.deserialize(data);
            superset = superset.concat(xliff.getTranslationUnits());
        } else {
            logger.warn("Could not open input file " + file);
        }
    });
    return superset;
}
/* 
* @private 
*/
_parse1 = function(settings, superset) {
    var cache = {};

    for (var i = 0; i < superset.length; i++) {
        unit = superset[i];
        logger.trace("unit to distribute is " + JSON.stringify(unit, undefined, 4));
        key = (settings.splittype === "language") ? unit.targetLocale : unit.project;
        logger.trace("key is " + key);
        file = cache[key];
        if (!file) {
            file = cache[key] = new Xliff({
                path: "./" + key + ".xliff",
                version: settings.xliffVersion
            });
            logger.trace("new xliff is " + JSON.stringify(file, undefined, 4));
        }
        file.addTranslationUnit(unit);
    }
    return cache;
}

/* 
* @private 
*/
_parse2 = function(settings, superset) {
    console.log("!!!!");
    var file, cache = {};

    for(var i=0; i < superset.length;i++) {
        unit = superset[i];
        logger.trace("unit(xliff 2.0) to distribute is " + JSON.stringify(unit, undefined, 4));
        key = unit.project;
        console.log("key: ", key);
        file = cache[key];
        if (!file) {
            file = cache[key] = new Xliff({
                path: "./" + key + ".xliff",
                version: settings.xliffVersion
            });
            logger.trace("new xliff is " + JSON.stringify(file, undefined, 4));
        }
        file.addTranslationUnit(unit);
    }
    return cache;
}

XliffSplit.distribute = function(settings, superset) {
    if(!superset) return;
    
    logger.info("Distributing resources ...");
    
    if (settings.xliffVersion < 2) {
        file = _parse1(settings, superset);
    } else {
        file = _parse2(settings, superset);
    }

    return file;    
}

XliffSplit.write = function(cache) {
    for(key in cache) {
        file = cache[key];
        logger.info("Writing " + file.getPath() + " ...");
        fs.writeFileSync(file.getPath(), file.serialize(), "utf-8");
    }
}

module.exports = XliffSplit;