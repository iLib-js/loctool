/*
 * loctool.js - tool to extract resources from source code
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */
/*
 * This code is intended to be run under node.js
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
var log4js = require("log4js");
var ProjectFactory = require("./lib/ProjectFactory.js");
// var Git = require("simple-git");

log4js.configure(path.dirname(module.filename) + '/log4js.json')

var logger = log4js.getLogger("loctool.loctool");
var pull = false;

function usage() {
	console.log("Usage: loctool [-h] [-p] [root dir]\n" +
		"Extract localizable strings from the source code.\n\n" +
		"-h or --help\n" +
		"  this help\n" +
		"-p or --pull\n" +
		"  Do a git pull first to update to the latest. (Assumes clean dirs.)\n" +
		"root dir\n" +
		"  directory containing the git projects with the source code. Default: current dir.\n");
	process.exit(1);
}

process.argv.forEach(function (val, index, array) {
	if (val === "-h" || val === "--help") {
		usage();
	} else if (val === "-p" || val === "--pull") {
		pull = true;
	}
});

var rootDir = process.argv.length > 2 ? process.argv[2] : ".";

logger.info("loctool - extract strings from source code.\n");

logger.info("Searching root: " + rootDir + "\n");

if (!fs.existsSync(rootDir)) {
	logger.error("Could not access root dir " + rootDir);
	usage();
}

var resources;
var project;
var fileTypes;

function walk(dir, project) {
	logger.trace("Searching" + dir);
	
	var results = [], projectRoot = false;
	
	if (!project) {
		project = ProjectFactory(dir);
		if (project) {
			fileTypes = project.getFileTypes();
			projectRoot = true;
			logger.info("-------------------------------------------------------------------------------------------");
			logger.info('Project "' + project.options.name + '", type: ' + project.options.projectType);
			logger.trace("Project: ");
			logger.trace(project);
			if (pull) {
				/*
				logger.info("Doing git pull to get the latest before scanning this dir.");
				var git = new Git(dir);
				git.pull();
				*/
			}
		}
	}
	
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		var path = dir + '/' + file;
		var stat = fs.statSync(path);
		if (stat && stat.isDirectory()) {
			if (project) {
				logger.info(path + "...");
				if (project.options.excludes) {
					logger.trace("There are excludes ");
					if (project.options.excludes.indexOf(path) === -1) {
						logger.trace("Not excluded.");
						walk(path, project);
					} else {
						logger.trace("Excluded");
					}
				} else {
					logger.trace("Neither includes or excludes.");
					walk(path, project);
				}
			} else {
			    logger.trace("found a dir");
				walk(path, project);
			}
		} else {
			if (fileTypes) {
				logger.trace("fileTypes.length is " + fileTypes.length);
			    for (var i = 0; i < fileTypes.length; i++) {
			    	logger.trace("Checking if file type " + fileTypes[i].name() + " handles " + path);
	                if (fileTypes[i].handles(path)) {
	                	logger.info("  " + fileTypes[i].name() + ": " + path);
						var file = fileTypes[i].newFile(path);
						file.extract();
						fileTypes[i].addSet(file.getTranslationSet());
					} else {
						logger.trace("no");
					}
				}
			} else {
				// no file types to check?
				logger.trace("no file types");
			}
		}
	});

	if (projectRoot) {
		for (var i = 0; i < fileTypes.length; i++) {
			//fileTypes[i].collect(function() {
				fileTypes[i].generatePseudo();
				fileTypes[i].write();
			//}.bind(this));
		}
		
		for (var i = 0; i < fileTypes.length; i++) {
			fileTypes[i].close();
		}

		project = undefined;
		fileTypes = undefined;
		
	}
	return results;
}

try {
	walk(rootDir, undefined);
} catch (e) {
	logger.error("caught exception: " + JSON.stringify(e));
	logger.error(e.stack);
}
logger.info("Done");

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