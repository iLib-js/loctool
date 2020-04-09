#!/usr/bin/env node
/*
 * loctool.js - tool to extract resources from source code
 *
 * Copyright © 2016-2017, 2019-2020, HealthTap, Inc.
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
/*
 * This code is intended to be run under node.js
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
var log4js = require("log4js");
var Queue = require("js-stl").Queue;
var mm = require("micromatch");

var ProjectFactory = require("./lib/ProjectFactory.js");
var TranslationSet = require("./lib/TranslationSet.js");
var Xliff = require("./lib/Xliff.js");


// var Git = require("simple-git");

log4js.configure(path.dirname(module.filename) + '/log4js.json');

var logger = log4js.getLogger("loctool.loctool");
var pull = false;
var exitValue = 0;

function getVersion() {
    var pkg = require("./package.json");
    return "loctool v" + pkg.version + " Copyright (c) 2016-2017, 2019, HealthTap, Inc. and JEDLSoft";
}

function usage() {
    console.log(getVersion());
    console.log(
        "Usage: loctool [-l locales] [-f filetype] [-t dir]\n" +
        "               [-x dir] [-2hinopqsv] [command [command-specific-arguments]]\n" +
        "Extract localizable strings from the source code.\n\n" +
        "-2\n" +
        "  Use xliff 2.0 format files instead of the default xliff 1.2\n" +
        "-f or --filetype\n" +
        "  Restrict operation to only the given list of file types. This allows you to\n" +
        "  run only the parts of the loctool that are needed at the moment.\n" +
        "-h or --help\n" +
        "  this help\n" +
        "-i or --identify\n" +
        "  Identify resources where possible by marking up the translated files with \n" +
        "  the resource key.\n" +
        "-l or --locales\n" +
        "  Restrict operation to only the given locales. Locales should be given as\n" +
        "  a comma-separated list of BCP-47 locale specs. By default, this tool\n" +
        "  will operate with all locales that are available in the translations.\n" +
        "-n or --pseudo\n" +
        "  Do pseudo-localize missing strings and generate the pseudo-locale. (Default is\n" +
        "  not to do pseudo-localization.\n" +
        "-o or --oldhaml\n" +
        "  Use the old ruby-based haml localizer instead of the new javascript one.\n" +
        "-p or --pull\n" +
        "  Do a git pull first to update to the latest. (Assumes clean dirs.)\n" +
        "-q or --quiet\n" +
        "  Quiet mode. Only print banners and any errors/warnings.\n" +
        "-s or --silent\n" +
        "  Silent mode. Don't ever print anything on the stdout. Instead, just exit with\n" +
        "  the appropriate exit code.\n" +
        "-t or --target\n" +
        "  Write all output to the given target dir instead of in the source dir.\n" +
        "-v or --version\n" +
        "  Print the current loctool version and exit\n" +
        "-x or --xliffs\n" +
        "  Specify the dir where the xliffs files live. Default: \".\"\n" +
        "--localizeOnly\n" +
        "  Generate a localization resource only. Do not create any other files at all after running loctool. \n" +
        "command\n" +
        "  a command to execute. This is one of:\n" +
        "    localize [root-dir-name] - extract strings and generate localized resource\n" +
        "             files. This is the default command. Default root dir name is '.'\n" +
        "    report - generate a loc report, but don't generate localized resource files.\n" +
        "    export [filename] - export all the new strings to an xliff or a set of xliff\n" +
        "             files. Default: a set of files named new-<locale>.xliff\n" +
        "    import filename ... - import all the translated strings in the given\n" +
        "             xliff files.\n" +
        "    split (language|project) filename ... - split the given xliff files by\n" +
        "             language or project.\n" +
        "    merge outfile filename ... - merge the given xliff files to the named\n" +
        "             outfile.\n" +
        "root dir\n" +
        "  directory containing the git projects with the source code. \n" +
        "  Default: current dir.\n");
    process.exit(0);
}

function printVersion() {
    console.log(getVersion());
    process.exit(0);
}

// the global settings object that configures how the tool will operate
var settings = {
    rootDir: ".",            // source directory where all localizable files reside
    locales: [],
    pull: false,
    identify: false,
    oldHamlLoc: false,
    nopseudo: true,
    targetDir: ".",            // target directory for all output files
    xliffsDir: ".",
    xliffVersion: 1.2,
    localizeOnly: false
};

var options = [];
var argv = process.argv;
for (var i = 0; i < argv.length; i++) {
    var val = argv[i];
    if (val === "-h" || val === "--help") {
        usage();
    } else if (val === "-2") {
        settings.xliffVersion = 2;
    } else if (val === "-p" || val === "--pull") {
        settings.pull = true;
    } else if (val === "-l" || val === "--locales") {
        if (i < argv.length && argv[i+1]) {
            settings.locales = argv[++i].split(",");
        }
    } else if (val === "-n" || val === "--pseudo") {
        settings.nopseudo = false;
    } else if (val === "-o" || val === "--oldhaml") {
        settings.oldHamlLoc = true;
    } else if (val === "-i" || val === "--identify") {
        settings.identify = true;
    } else if (val === "-q" || val === "--quiet") {
        logger.level = 'error';
    } else if (val === "-s" || val === "--silent") {
        logger.level = 'OFF';
    } else if (val === "-f" || val === "--filetype") {
        if (i+1 < argv.length && argv[i+1]) {
            var types = argv[++i].split(",");
            settings.fileTypes = {};
            types.forEach(function(type) {
                settings.fileTypes[type] = true;
            });
        }
    } else if (val === "-t" || val === "--target") {
        if (i+1 < argv.length && argv[i+1] && argv[i+1][0] !== "-") {
            settings.targetDir = argv[++i];
        } else {
            console.error("Error: -t (--target) option requires a directory name argument to follow it.");
            usage();
        }
    } else if (val === "-v" || val === "--version") {
        printVersion();
    } else if (val === "-x" || val === "--xliffs") {
        if (i+1 < argv.length && argv[i+1] && argv[i+1][0] !== "-") {
            settings.xliffsDir = argv[++i];
        } else {
            console.error("Error: -x (--xliffs) option requires a directory name argument to follow it.");
            usage();
        }
    } else if (val === "-z" || val === "--xliffsOut") {
        if (i+1 < argv.length && argv[i+1] && argv[i+1][0] !== "-") {
            settings.xliffsOut = argv[++i];
        } else {
            console.error("Error: -z (--xliffsOut) option requires a directory name argument to follow it.");
            usage();
        }
    } else if (val === "--localizeOnly") {
        settings.localizeOnly = true;
    }
    else {
        options.push(val);
    }
}

var command = options.length > 2 ? options[2] : "localize";

switch (command) {
case "localize":
    if (options.length > 3) {
        settings.rootDir = options[3];
    }
    break;

case "export":
    settings.outfile = (options.length > 3) && options[3];
    break;

case "import":
    if (options.length > 3) {
        settings.infiles = options.slice(3);
    } else {
        console.log("Error: must specify at least one input file to import.");
        usage();
    }
    break;

case "split":
    if (options.length < 5) {
        console.log("Error: must specify a split type and at least one input file.");
        usage();
    }
    settings.splittype = options[3];
    if (settings.splittype !== "language" && settings.xliffVersion >= 2) {
        console.log("Error: you cannot split xliff 2.x files by project. They can only be split\nby language.\n\n");
        usage();
    }
    settings.infiles = options.slice(4);
    settings.infiles.forEach(function (file) {
        if (!fs.existsSync(file)) {
            console.log("Error: could not access file " + file);
            usage();
        }
    });
    break;

case "merge":
    if (options.length < 5) {
        console.log("Error: must specify an output file name and at least one input file.");
        usage();
    }
    settings.outfile = options[3]
    settings.infiles = options.slice(4);
    break;
}

logger.info("loctool - extract strings from source code.\n");
logger.info("Command: " + command);

if (command === "localize") {
    logger.info("Searching root: " + settings.rootDir + "\n");

    if (!fs.existsSync(settings.rootDir)) {
        logger.error("Could not access root dir " + settings.rootDir);
        usage();
    }
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
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            processNextProject();
                        });
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
        project = ProjectFactory(dir, settings);
        if (project) {
            projectRoot = true;
            logger.info("-------------------------------------------------------------------------------------------");
            logger.info('Project "' + project.options.name + '", type: ' + project.options.projectType);
            logger.trace("Project: ");
            logger.trace(project);
            if (settings.pull) {
                /*
                logger.info("Doing git pull to get the latest before scanning this dir.");
                var git = new Git(dir);
                git.pull();
                */
            }

            projectQueue.enqueue(project);

            if (project.options && project.options.includes) {
                project.options.includes.forEach(function(p) {
                    if (fs.existsSync(p)) {
                        var stat = fs.statSync(p);
                        if (stat && stat.isDirectory()) {
                            logger.info(p);
                            walk(p, project);
                        } else {
                            project.addPath(p);
                        }
                    } else {
                        logger.warn("File " + p + " which is listed in the includes in the project.json does not exist any more.");
                    }
                });
            }
        }
    }

    var list = fs.readdirSync(dir);
    var pathName, relPath, included, stat;

    list.sort().forEach(function (file) {
        var root = project ? project.getRoot() : settings.rootDir;
        pathName = path.join(dir, file);
        relPath = path.relative(root, pathName);
        included = true;

        if (project) {
            if (project.options.excludes) {
                logger.trace("There are excludes. Relpath is " + relPath);
                if (mm.any(relPath, project.options.excludes)) {
                    included = false;
                }
            }

            // override the excludes
            if (project.options.includes) {
                logger.trace("There are includes. Relpath is " + relPath);
                if (mm.any(relPath, project.options.includes)) {
                    included = true;
                }
            }
        }

        if (included) {
            logger.trace("Included.");
            stat = fs.statSync(pathName);
            if (stat && stat.isDirectory()) {
                logger.info(pathName);
                walk(pathName, project);
            } else {
                if (project) {
                    logger.info(relPath);
                    project.addPath(relPath);
                } else {
                    logger.trace("Ignoring non-project file: " + relPath);
                }
            }
        } else {
            logger.trace("Excluded.");
        }
    });

    return results;
}

try {
    switch (command) {
    case "localize":
        walk(settings.rootDir, undefined);
        processNextProject();
        break;

    case "export":
        break;

    case "import":
        break;

    case "split":
        settings.splittype = options[3];
        settings.infiles = options.slice(4);
        var superset = [];

        settings.infiles.forEach(function (file) {
            logger.info("Reading " + file + " ...");
            if (fs.existsSync(file)) {
                var data = fs.readFileSync(file, "utf-8");
                var xliff = new Xliff();
                xliff.deserialize(data);
                superset = superset.concat(xliff.getTranslationUnits());
            } else {
                logger.warn("Could not open input file " + file);
            }
        });

        var cache = {};

        var res, key, unit;
        // var file, resources = superset.getAll();

        logger.info("Distributing resources ...");
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

        for (key in cache) {
            logger.info("Writing " + file.getPath() + " ...");
            file = cache[key];

            fs.writeFileSync(file.getPath(), file.serialize(), "utf-8");
        }
        break;

    case "merge":
        var target = new Xliff({
            path: settings.outfile,
            version: settings.xliffVersion
        });

        settings.infiles.forEach(function (file) {
            if (fs.existsSync(file)) {
                logger.info("Merging " + file + " ...");
                var data = fs.readFileSync(file, "utf-8");
                var xliff = new Xliff();
                xliff.deserialize(data);
                target.addTranslationUnits(xliff.getTranslationUnits());
            } else {
                logger.warn("Could not open input file " + file);
            }
        });

        fs.writeFileSync(target.getPath(), target.serialize(), "utf-8");
        break;
    }

} catch (e) {
    logger.error("caught exception: " + e);
    logger.error(e.stack);
    if (fileTypes) {
        for (var i = 0; i < fileTypes.length; i++) {
            fileTypes[i].close();
        }
    }
    exitValue = 2;
}
logger.info("Done");
log4js.shutdown(function() {
    process.exit(exitValue);
});
