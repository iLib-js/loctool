/*
 * GenerateModePRocess.js - Define the process of generate mode
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
var log4js = require("log4js");
var logger = log4js.getLogger("loctool.lib.GenerateModeProcess");

/**
 * Define the process of generate mode
 *
 * @param {Project} project the current project
 * @returns {boolean} true if the process is done
 * 
 */
var GenerateModeProcess = function GenerateModeProcess(project) {
    if (!project) return;

    if (project) {
        project.init(function() {
            project.generateMode(function() {
                project.write(function(){
                    project.save(function() {
                        project.close(function() {
                            logger.info("Processing generate mode is done.");
                        });
                    });
                });
            });
        });
    };
    return true;
}

module.exports = GenerateModeProcess;