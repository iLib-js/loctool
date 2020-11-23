/*
 * ProjectFactory.js - factory object that creates project instances
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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

var AndroidProject = require("./AndroidProject.js");
var WebProject = require("./WebProject.js");
var ObjectiveCProject = require("./ObjectiveCProject.js");
var SwiftProject = require("./SwiftProject.js");

var CustomProject = require("./CustomProject.js");
var JSUtils = require("ilib/lib/JSUtils.js");
var logger = log4js.getLogger("loctool.lib.ProjectFactory");

var projectTypes = {
    "android": AndroidProject,
    "iosobjc": ObjectiveCProject,
    "swift": SwiftProject,
    "web": WebProject
};

var projectCache = {};

/**
 * Create a new project of the correct type based on
 * the given dir. If the dir contains a project.json
 * file, this factory will return a project of the
 * correct type. If not, it will return undefined.
 *
 * @param {String} path to the directory containing the root of the project
 * @param {Object} settings an object containing the current
 * settings
 * @returns {Project|undefined} a project object for this
 * directory, or undefined if the dir is not the root
 * of a project.
 */
var ProjectFactory = function ProjectFactory(dir, settings) {
    var configData;
    if (settings.configFile) {
        if (fs.existsSync(settings.configFile)) {
            var config = fs.readFileSync(settings.configFile, 'utf8');
            configData = JSON.parse(config);
        }
    }
    var pathName = path.join(dir, "project.json");
    logger.debug("checking for the existence of " + pathName);
    if (fs.existsSync(pathName)) {
        var data = fs.readFileSync(pathName, 'utf8');
        if (data.length > 0) {
            var projectProps = JSON.parse(data);
            if (configData) {
                projectProps = JSUtils.merge(configData, projectProps);
            }
            //projectProps.settings = JSUtils.merge(projectProps.settings, settings);
            projectProps.settings = _mergeSettings(projectProps.settings, settings);
            settings = settings || {locales:[""]};
            var project, projectType = projectTypes[projectProps.projectType];
            if (!projectProps.projectType || !projectType) {
                project = new CustomProject(projectProps, dir, settings);
            } else {
                project = new projectType(projectProps, dir, settings);
            }
            projectCache[project.getProjectId()] = project;
            return project;
        }
    } else {
        logger.debug("not there");
    }
    return undefined;
};

/**
 * Return the project with the given name, or undefined if
 * the project is not known.
 *
 * @static
 * @param {String} name the name of the project to look up
 * @returns {Project} the project object
 */
ProjectFactory.getProject = function(name) {
    return projectCache[name];
};

/**
 * Create a new project of the correct type based on
 * the given dir. This will ignore any project.json that
 * may already exist in that dir.
 *
 * @param {Object} options an object containing the current
 * options
 * @param {Object} settings an object containing the current
 * settings
 * @returns {Project|undefined} a project object for this
 * directory, or undefined if the dir is not the root
 * of a project.
 */
ProjectFactory.newProject = function(options, settings) {
    var type = options.projectType || "custom";
    var project, projectType = projectTypes[type];
    if (!projectType) {
        project = new CustomProject(options, options.rootDir, settings);
    } else {
        project = new projectType(options, options.rootDir, {});
    }
    projectCache[project.getProjectId()] = project;
    return project;
};

/**
 *
 * @private
 * could/should refactor to utils
 */
_mergeSettings = function(to, from){
    if (to){
        // Settings in the 'to' object take priority over 'from'
        keysInTo = Object.keys(to);
        additionalKeys = Object.keys(from).filter(function(k){ return keysInTo.indexOf(k) === -1 });
        for (var i = 0; i < additionalKeys.length; i++){
            to[additionalKeys[i]] = from[additionalKeys[i]];
        }
        return to;
    } else{
        return from;
    }
}

module.exports = ProjectFactory;
