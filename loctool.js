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
var Queue = require("js-stl").Queue;

var ProjectFactory = require("./lib/ProjectFactory.js");
// var Git = require("simple-git");

log4js.configure(path.dirname(module.filename) + '/log4js.json')

var logger = log4js.getLogger("loctool.loctool");
var pull = false;

function usage() {
	console.log("Usage: loctool [-h] [-p] [command [root dir]]\n" +
		"Extract localizable strings from the source code.\n\n" +
		"-h or --help\n" +
		"  this help\n" +
		"-p or --pull\n" +
		"  Do a git pull first to update to the latest. (Assumes clean dirs.)\n" +
		"command\n" +
		"  a command to execute. This is one of:\n" +
		"    localize - extract strings and generate localized resource files. This is\n" +
		"             the default command.\n" +
		"    report - generate a loc report, but don't generate localized resource files.\n" +
		"    export - export all the new strings to a set of xliff files.\n" +
		"             Default: new-<locale>.xliff\n" +
		"    import filename ... - import all the translated strings in the given\n" +
		"             xliff files.\n" +
		"    split (language|project) filename ... - split the given xliff files by\n" +
		"             language or project.\n" +
		"    merge outfile filename ... - merge the given xliff files to the named\n" +
		"             outfile.\n" +
		"root dir\n" +
		"  directory containing the git projects with the source code. \n" +
		"  Default: current dir.\n");
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

var projectQueue = new Queue();

/**
 * Process the next project in the project queue. This entails
 * reading all the source files in the project, extracting their
 * resources from the various file types, saving the new resources
 * to the database, generating pseudo-localized resources, and
 * writing out the various translated files for that project.
 */
function processNextProject() {
	var project = !projectQueue.isEmpty() && projectQueue.dequeue();
	
	logger.debug("Processing project " + (project && project.id));
	if (project) {
		project.extract(function() {
			project.save(function() {
				project.generatePseudo();
				project.write(function() {
					project.close(function() {
						processNextProject();
					});
				});
			});
		});
	}
}

function walk(dir, project) {
	logger.trace("Searching " + dir);
	
	var results = [], projectRoot = false;
	
	if (!project) {
		project = ProjectFactory(dir);
		if (project) {
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
			
			projectQueue.enqueue(project);
		}
	}
	
	var list = fs.readdirSync(dir);
	list.forEach(function (file) {
		var pathName = path.join(dir, file);
		var relPath = path.relative(project.getRoot(), pathName);
		var stat = fs.statSync(pathName);
		if (stat && stat.isDirectory()) {
			if (project) {
				logger.info(pathName);
				if (project.options.excludes) {
					logger.trace("There are excludes. Relpath is " + relPath);
					if (project.options.excludes.indexOf(relPath) === -1) {
						logger.trace("Not excluded.");
						walk(pathName, project);
					} else {
						logger.trace("Excluded");
					}
				} else {
					logger.trace("Neither includes or excludes.");
					walk(pathName, project);
				}
			} else {
			    logger.trace("found a dir");
				walk(pathName, project);
			}
		} else {
			if (project) {
				logger.info(pathName);
				project.addPath(pathName);
			} else {
				logger.trace("Ignoring non-project file: " + pathName);
			}
		}
	});
	
	return results;
}

try {
	walk(rootDir, undefined);
	
	processNextProject();
} catch (e) {
	logger.error("caught exception: " + e);
	logger.error(e.stack);
	if (fileTypes) {
		for (var i = 0; i < fileTypes.length; i++) {
			fileTypes[i].close();
		}
	}
	log4js.shutdown();
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