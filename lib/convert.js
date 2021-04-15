/*
 * convert.js - convert between file types
 *
 * Copyright © 2021 Box, Inc.
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

var path = require("path");
var log4js = require("log4js");

var CustomProject = require("./CustomProject.js");
var TMX = require("./TMX.js");

var logger = log4js.getLogger("loctool.lib.convert");

function convert(settings) {
    var project = new CustomProject({
        name: settings.id,
        id: settings.id,
        sourceLocale: settings.sourceLocale,
        fileTypes: [
            "Xliff",
            "JavaScriptResource",
            "YamlResource",
            "AndroidResource",
            "IosStrings",
        ]
    }, ".", settings);

    settings.infiles.forEach(function(file) {
        project.addPath(file);
    });

    project.init(function() {
        logger.info("Reading from input files " + settings.infiles);
        project.read();
        var set = project.getExtracted();
        var file, extension = path.extname(settings.outfile);
        if (extension === ".tmx") {
            // special case for tmx files, as there is not FileType for it
            file = new TMX({
                path: settings.outfile,
                sourceLocale: project.sourceLocale,
                segmentation: settings.segmentation
            });
        } else {
            var ft = project.getFileTypes(settings.outfile);
            if (ft && ft.length) {
                // try the first one with a write method
                var type = ft.find(function(type) {
                    return typeof(type.write) === 'function';
                });
                file = type.newFile(settings.outfile, {
                    locale: settings.targetLocale
                });
            }
        }

        if (!file) {
            logger.error("No File Type available to handle output file " + settings.outfile);
            return;
        }

        set.getAll().forEach(function(resource) {
            resource.setProject(project);
            resource.setSourceLocale(settings.localeMap[resource.getSourceLocale()] || resource.getSourceLocale());
            resource.setTargetLocale(settings.localeMap[resource.getTargetLocale()] || resource.getTargetLocale());
            file.addResource(resource);
        });

        logger.info("Writing to output file " + settings.outfile);
        file.write();
    });
}

module.exports = convert;