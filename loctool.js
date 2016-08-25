/*
 * loctool.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */
/*
 * This code is intended to be run under node.js
 */
var fs = require('fs');
var util = require('util');

var AndroidProject = require("./lib/AndroidProject.js");
var ProjectFactory = require("./lib/ProjectFactory.js");

function usage() {
	console.log("Usage: loctool [-h] [root dir]\n" +
		"Extract localizable strings from the source code.\n\n" +
		"-h or --help\n" +
		"  this help\n" +
		"root dir\n" +
		"  directory containing the git projects with the source code. Default: current dir.\n");
	process.exit(1);
}

process.argv.forEach(function (val, index, array) {
	if (val === "-h" || val === "--help") {
		usage();
	}
});

var rootDir = process.argv.length > 2 ? process.argv[2] : ".";

console.log("loctool - extract strings from source code.\n");

console.log("Searching root: " + rootDir + "\n");

if (!fs.existsSync(rootDir)) {
	util.error("Could not access root dir " + rootDir);
	usage();
}

var resources;
var project;
var fileTypes;

function walk(dir, project) {
	console.log(dir);
	
	var results = [], projectRoot = false;
	
	if (!project) {
		project = ProjectFactory(dir);
		if (project) {
			fileTypes = project.getFileTypes();
			projectRoot = true;
			console.log("-------------------------------------------------------------------------------------------");
			console.log('Project "' + project.options.name + '", type: ' + project.options.projectType);
		}
	}
	
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		var path = dir + '/' + file;
		var stat = fs.statSync(path);
		if (stat && stat.isDirectory()) {
			if (project) {
				//console.log("There is a project. Checking " + path);
				//console.log("Project: ");
				//console.dir(project);
				if (project.options.excludes) {
					//console.log("There are excludes ");
					if (project.options.excludes.indexOf(path) === -1) {
						//console.log("Not excluded.");
						walk(path, project);
					//} else {
						//console.log("Excluded");
					}
				} else {
					//console.log("Neither includes or excludes.");
					walk(path, project);
				}
			} else {
				walk(path, project);
			}
		} else {
			if (fileTypes) {
				for (var i = 0; i < fileTypes.length; i++) {
					if (fileTypes[i].handles(path)) {
						console.log("  " + path);
						var file = fileTypes[i].newFile(path);
						file.extract();
					}
				}
			} else {
				// no file types to check?
			}
		}
	});

	if (projectRoot) {
		for (var i = 0; i < fileTypes.length; i++) {
			fileTypes[i].collect();
			fileTypes[i].generatePseudo();
			fileTypes[i].write();
		}
		
		project = undefined;
		fileTypes = undefined;
	}
	return results;
}

try {
	walk(rootDir, undefined);
} catch (e) {
	console.dir(e);
}
/*
var obj = {};
if (path.match(/[a-z]+\.jf/)) {
	try {
		var data = fs.readFileSync(path, 'utf8');
		if (data.length > 0) {
			obj = JSON.parse(data);
			merged = common.merge(merged, obj);
		}
	} catch (err) {
		console.log("File " + path + " is not readable or does not contain valid JSON.\n");
		console.log(err + "\n");
	}
}
*/