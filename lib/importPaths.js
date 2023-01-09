/*
 * importPaths.js - read in directories full of resource files and
 * produce xliff files
 *
 * Copyright © 2023 Box, Inc.
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

var logger = log4js.getLogger("loctool.lib.importPaths");

function importPaths(project, settings) {
    settings.infiles.forEach(function(file) {
        project.addPath(file);
    });

    project.init(function() {
        logger.info("Reading from input files " + settings.infiles);
        project.read();
        var extracted = project.getExtracted();

        if (extracted.size()) {
            extracted.getAll().forEach(function(resource) {
                var source, target;
    
                // try to make sure every target-only resource has a source string
                switch (resource.getType()) {
                    case "string":
                        source = resource.getSource();
                        target = resource.getTarget();
                        if (target && !source) {
                            hash = resource.cleanHashKeyForTranslation(resource.getSourceLocale());
                            var sourceResource = extracted.get(hash);
                            if (sourceResource) {
                                resource.setSource(sourceResource.getTarget() || sourceResource.getSource());
                            }
                        }
                        break;
                    case "plural":
                        source = resource.getSourceStrings();
                        target = resource.getTargetStrings();
                        if (target && !source) {
                            hash = resource.cleanHashKeyForTranslation(resource.getSourceLocale());
                            var sourceResource = extracted.get(hash);
                            if (sourceResource) {
                                resource.setSourceStrings(sourceResource.getTargetStrings() || sourceResource.getSourceStrings());
                            }
                        }
                        break;
                    case "array":
                        source = resource.getSourceArray();
                        target = resource.getTargetArray();
                        if (target && !source) {
                            hash = resource.cleanHashKeyForTranslation(resource.getSourceLocale());
                            var sourceResource = extracted.get(hash);
                            if (sourceResource) {
                                resource.setSourceArray(sourceResource.getTargetArray() || sourceResource.getSourceArray());
                            }
                        }
                        break;
                }
    
                resource.setProject(project);
                resource.setSourceLocale(settings.localeMap[resource.getSourceLocale()] || resource.getSourceLocale());
                resource.setTargetLocale(settings.localeMap[resource.getTargetLocale()] || resource.getTargetLocale());
            });

            var outputPath = path.join(project.xliffsOut, project.getName() + ".xliff");
            logger.info("Writing out the xliff files to " + outputPath);

            var xliff = new Xliff({
                sourceLocale: this.sourceLocale,
                pathName: outputPath,
                allowDups: settings.allowDups,
                version: settings.xliffVersion,
                style: settings.xliffStyle
            });
            xliff.addSet(extracted);
            fs.writeFileSync(outputPath, xliff.serialize(true), "utf-8");
        } else {
            logger.error("No resources extracted from the named files and nothing written to the xliff files.");
        }
    });
}

module.exports = importPaths;