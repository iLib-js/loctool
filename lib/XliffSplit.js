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
var path = require("path");
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
_parse1 = function(superset, settings) {
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
_parse2 = function(superset, settings) {
    var file, cache = {};
    var output = settings.targetDir || ".";
    var prjXliffPath;

    if(!fs.existsSync(output)){
        fs.mkdirSync(output);
    }

    if (settings.splittype === "language") {
        logger.error("When xliff is2.x case, It is only valid a split by project with a merged xliff form.\n");
        return;
    }

    for(var i=0; i < superset.length;i++) {
        unit = superset[i];
        logger.trace("unit(xliff 2.0) to distribute is " + JSON.stringify(unit, undefined, 4));
        key = unit.project;
        file = cache[key];
        prjXliffPath = path.join(output,key);

        if (!file) {
            file = cache[key] = new Xliff({
                path: path.join(prjXliffPath, unit.targetLocale + ".xliff"),
                version: settings.xliffVersion
            });
            logger.trace("new xliff is " + JSON.stringify(file, undefined, 4));
        }
        file.addTranslationUnit(unit);
    }
    return cache;
}

XliffSplit.distribute = function(superset, settings) {
    if(!superset) return;
    
    logger.info("Distributing resources ...");
    
    if (settings.xliffVersion < 2) {
        file = _parse1(superset, settings);
    } else {
        file = _parse2(superset, settings);;
    }

    return file;    
}

XliffSplit.write = function(cache) {
    var xliffDir;
    for(key in cache) {
        file = cache[key];
        xliffDir = path.dirname(file.getPath());
        if(!fs.existsSync(xliffDir)){
            fs.mkdirSync(xliffDir);
        }
        logger.info("Writing " + file.getPath() + " ...");
        fs.writeFileSync(file.getPath(), file.serialize(), "utf-8");
    }
}

module.exports = XliffSplit;