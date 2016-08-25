/*
 * Project.js - represents an localization project
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var fs = require("fs");
var path = require("path");
var AndroidProject = require("./AndroidProject.js");

var projectTypes = {
	"android": AndroidProject //,
	// "iosobjc": IOSObjCProject,
	// "iosswift": IOSSwiftProject,
	// "web": WebProject
};

/**
 * Create a new project of the correct type based on
 * the given dir. If the dir contains a project.json 
 * file, this factory will return a project of the
 * correct type. If not, it will return undefined.
 * 
 * @param {String} path to the directory to 
 * @returns {Project|undefined} a project object for this
 * directory, or undefined if the dir is not the root
 * of a project.
 */
module.exports = function ProjectFactory(dir) {
	var path = dir + "/project.json";
	if (fs.existsSync(path)) {
		var data = fs.readFileSync(path, 'utf8');
		if (data.length > 0) {
			var projectProps = JSON.parse(data);
			var projectType = projectTypes[projectProps.projectType];
			return new projectType(projectProps, dir);
		}
	}
	return undefined;
};

