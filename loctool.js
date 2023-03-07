#!/usr/bin/env node
/*
 * loctool.js - tool to extract resources from source code
 *
 * Copyright © 2016-2017, 2019-2023, HealthTap, Inc. and JEDLSoft
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
var readline = require("readline-sync");
var log4js = require("log4js");
var Queue = require("js-stl").Queue;
var mm = require("micromatch");

var ProjectFactory = require("./lib/ProjectFactory.js");
var GenerateModeProcess = require("./lib/GenerateModeProcess.js");

var XliffMerge = require("./lib/XliffMerge.js");
var XliffSplit = require("./lib/XliffSplit.js");
var fileConvert = require("./lib/convert.js");

// var Git = require("simple-git");

log4js.configure(path.dirname(module.filename) + '/log4js.json');

var logger = log4js.getLogger("loctool.loctool");
var pull = false;
var exitValue = 0;

function getVersion() {
    var pkg = require("./package.json");
    return "loctool v" + pkg.version + " Copyright (c) 2016-2017, 2019-2023, HealthTap, Inc. and JEDLSoft";
}

function usage() {
    console.log(getVersion());
    console.log(
        "Usage: loctool [-l locales] [-f filetype] [-t dir]\n" +
        "               [-x dir] [-2hinopqsv] [command [command-specific-arguments]]\n" +
        "Extract localizable strings from the source code.\n\n" +
        "-2\n" +
        "  Use xliff 2.0 format files instead of the default xliff 1.2\n" +
        "--exclude\n" +
        "  exclude a comma-separated list of directories while searching for project.json config files \n" +
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
        "--localeMap\n" +
        "  Map input locales to different ones in the output. The format of the parameter\n" +
        "  is a comma-separated list of mappings where each mapping is a BCP-47 specifier\n" +
        "  of the source locale, a colon, and the BCP-47 specifier of the target locale.\n" +
        "  eg. 'da:da-DK,no:nb-NO,en:en-GB'\n" +
        "--localeInherit\n" +
        "  Map locales to follow different locale inheritance rules than the default. By default, a locale inherits\n" +
        "  translations from the locale with the language only, and then from the root (en-US -> en -> root). With this\n" +
        "  option, you can specify that a locale inherits from a different locale first.\n" +
        "  The value of the parameter is a comma-separated list of mappings where each mapping is a BCP-47\n" +
        "  specifier of the source locale, a colon, and the BCP-47 specifier of the target locale.\n" +
        "  eg. 'en-AU:en-GB' (en-AU inherits translations from en-GB)\n" +
        "--localizeOnly\n" +
        "  Generate a localization resource only. Do not create any other files at all after running loctool. \n" +
        "-n or --pseudo\n" +
        "  Do pseudo-localize missing strings and generate the pseudo-locale. (Default is\n" +
        "  not to do pseudo-localization.\n" +
        "-o or --oldhaml\n" +
        "  Use the old ruby-based haml localizer instead of the new javascript one.\n" +
        "--onlyTranslated\n" +
        "  During the convert action, only convert fully translated resources to the target\n" +
        "  file. Source-only resources will skipped. (Default: convert all resources.)\n" +
        "-p or --pull\n" +
        "  Do a git pull first to update to the latest. (Assumes clean dirs.)\n" +
        "--projectId\n" +
        "  Specify the default name of the project if not specified otherwise.\n" +
        "--projectType\n" +
        "  The type of project, which affects how source files are read and resource files are written. Default: web \n" +
        "--plugins\n" +
        "  plugins to use that handle various file types in your project. The parameter should be a\n" +
        "  comma-separated list of plugin names.\n" +
        "-q or --quiet\n" +
        "  Quiet mode. Only print banners and any errors/warnings.\n" +
        "--resourceDirs\n" +
        "  Specify the dir where the generation output should go. \n" +
        "--resourceFileNames\n" +
        "  Specify the resource filename used during resource file generation.\n" +
        "--resourceFileTypes\n" +
        "  Specifies the file type of the resource to be created. \n" +
        "--root dir\n" +
        "  directory containing the git projects with the source code.\n" +
        "  Default: current dir.\n" +
        "-s or --silent\n" +
        "  Silent mode. Don't ever print anything on the stdout. Instead, just exit with\n" +
        "  the appropriate exit code.\n" +
        "--segmentation\n" +
        "  Style of segmentation to use when writing out TMX files. Style can be 'sentence'\n" +
        "  or 'paragraph'. (Default is 'paragraph') \n" +
        "--sourceLocale\n" +
        "   Default locale of source string. (Default is en-US) \n" +
        "-t or --target\n" +
        "  Write all output to the given target dir instead of in the source dir.\n" +
        "--targetLocale\n" +
        "  Set the target locale for a convert action for those resource file types that\n" +
        "  are single locale.\n" +
        "-v or --version\n" +
        "  Print the current loctool version and exit\n" +
        "-x or --xliffs\n" +
        "  Specify a dir or comma-separated array of dirs where the xliffs files live. Default: \".\"\n" +
        "--xliffResName\n" +
        "  Specify the resource filename used during resource file generation. (Default is strings.json) \n" +
        "--xliffResRoot\n" +
        "  Specify the dir where the generation output should go. (Default is resources/) \n" +
        "--xliffStyle\n" +
        "  Specify the Xliff format style. Style can be 'standard' or 'custom'. (Default is 'standard') \n" +
        "--noxliffDups\n" +
        "  Do not allow duplicated strings in extracted xliff file. (Default is 'true') \n" +
        "command\n" +
        "  a command to execute. This is one of:\n" +
        "    init  [project-name] - initialize the current directory as a loctool project\n" +
        "             and write out a project.json file.\n" +
        "    localize [root-dir-name] - extract strings and generate localized resource\n" +
        "             files. This is the default command. Default root dir name is '.'\n" +
//        "    report - generate a loc report, but don't generate localized resource files.\n" +
        "    export [filename] - export all the new strings to an xliff or a set of xliff\n" +
        "             files. Default: a set of files named new-<locale>.xliff [not implemented yet]\n" +
        "    import filename ... - import all the translated strings in the given\n" +
        "             xliff files. [not implemented yet]\n" +
        "    split (language|project) filename ... - split the given xliff files by\n" +
        "             language or project.\n" +
        "    merge outfile filename ... - merge the given xliff files to the named\n" +
        "             outfile.\n" +
        "    generate ... - generate resources without scanning sources.\n" +
        "    convert outfile filename ... - convert input files to the output file format.\n" +
        "             All files must be resource file types such as xliff, po, or properties.\n"
        );
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
    xliffsDir: ["."],
    xliffVersion: 1.2,
    xliffStyle: "standard",
    allowDups: true,
    localizeOnly: false,
    projectType: "web",
    exclude: [
        "**/node_modules",
        "**/bower_components",
        "**/jspm_packages",
        "**/.git",
        "**/.svn",
        "package.json",
        "package-lock.json",
        "project.json",
        "log4js.json",
        "yarn.lock",
        ".gitignore",
        ".project",
        ".circleci",
        ".travis.yml",
        ".npm",
        ".next",
        ".eslintcache"
    ],
    segmentation: "paragraph",
    sourceLocale: "en-US",
    targetLocale: null,
    localeMap: {},
    localeInherit: {},
    onlyTranslated: false
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
    } else if (val.toLowerCase() === "--localemap") {
        if (i < argv.length && argv[i+1]) {
            var mappings = argv[++i].split(",");
            mappings.forEach(function(mapping) {
                var parts = mapping.split(":");
                if (parts && parts.length > 1) {
                    settings.localeMap[parts[0]] = parts[1];
                }
            });
        }
    } else if (val.toLowerCase() === "--localeinherit") {
        if (i < argv.length && argv[i+1]) {
            var inheritList = argv[++i].split(",");
            inheritList.forEach(function(list) {
                var parts = list.split(":");
                if (parts && parts.length > 1) {
                    settings.localeInherit[parts[0]] = parts[1];
                }
            });
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
    } else if (val === "--projectId") {
        settings.id = argv[++i];
    } else if (val === "--projectType") {
        settings.projectType = argv[++i];
    } else if (val === "--plugins") {
        if (i+1 < argv.length && argv[i+1]) {
            var types = argv[++i].split(",");
            settings.plugins = types;
        }
    } else if (val === "--resourceFileTypes") {
        settings.resourceFileTypes = {};
        if (i+1 < argv.length && argv[i+1]) {
            var types = argv[++i].split(",");
            types.forEach(function(type){
                var resType = type.split("=");
                settings.resourceFileTypes[resType[0]] = resType[1];
            });
        }
    } else if (val === "--resourceFileNames") {
        settings.resourceFileNames = {};
        if (i+1 < argv.length && argv[i+1]) {
            var types = argv[++i].split(",");
            types.forEach(function(type){
                var resType = type.split("=");
                settings.resourceFileNames[resType[0]] = resType[1];
            });
        }
    } else if (val === "--resourceDirs") {
        settings.resourceDirs = {};
        if (i+1 < argv.length && argv[i+1]) {
            var types = argv[++i].split(",");
            types.forEach(function(type){
                var resType = type.split("=");
                settings.resourceDirs[resType[0]] = resType[1];
            });
        }
    } else if (val === "--sourceLocale") {
        settings.sourceLocale = argv[++i];
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
            settings.xliffsDir = argv[++i].split(/,/g);
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
    } else if (val === "--xliffStyle") {
        var candidate = ["standard", "custom"];
        if (candidate.indexOf(argv[i+1]) !== -1) {
            settings.xliffStyle = argv[++i];
        }
    } else if (val === "--noxliffDups") {
        settings.allowDups = false;
    }
    else if (val === "--segmentation") {
        var candidate = ["paragraph", "sentence"];
        if (candidate.indexOf(argv[++i]) !== -1) {
            settings.segmentation = argv[i];
        }
    } else if (val === "--targetLocale") {
        settings.targetLocale = argv[++i];
    } else if (val === "--localizeOnly") {
        settings.localizeOnly = true;
    } else if (val === "--onlyTranslated") {
        settings.onlyTranslated = true;
    } else if (val === "--exclude") {
        if (i+1 < argv.length && argv[i+1]) {
            var excludeList = argv[++i].split(",");
            var temp = settings.exclude.concat(excludeList);
            settings.exclude = temp.filter(function(item,index){
                return temp.indexOf(item) === index;
            })
        }
    } else {
        options.push(val);
    }
}

var command = options.length > 2 ? options[2] : "localize";
settings.mode = command;
switch (command) {
default:
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
        console.log("Error: must specify at least one input path to import.");
        usage();
    }
    break;

case "split":
    if (options.length < 5) {
        console.log("Error: must specify a split type and at least one input file.");
        usage();
    }
    settings.splittype = options[3];
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

case "convert":
    if (options.length < 5) {
        console.log("Error: must specify an output file name and at least one input file.");
        usage();
    }
    settings.outfile = options[3]
    settings.infiles = options.slice(4);
    break;
}

logger.info("loctool - extract strings from source code and localize them.\n");
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
        var startTime = new Date();
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
        var endTime = new Date();
        logger.info("-------------------------------------------------------------------------------------------");
        logger.info("Project [" + project.getProjectId()+ "] Running time: " + (endTime.getTime() - startTime.getTime())/1000 + " s .....");
    }
}

function walk(dir, project) {
    logger.trace("Searching " + dir);

    var results = [], projectRoot = false, newProject;

    newProject = ProjectFactory(dir, settings);
    if (newProject) {
        project = newProject;
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

    var list = fs.readdirSync(dir);
    var pathName, relPath, included, stat;

    if (list && list.length !== 0) {
        list.sort().forEach(function (file) {
            var root = project ? project.getRoot() : settings.rootDir;
            pathName = path.join(dir, file);
            relPath = path.relative(root, pathName);
            included = true;

            if (project) {
                var excludes = project.options.excludes ? project.options.excludes.concat(project.settings.exclude) : project.settings.exclude;
                if (excludes) {
                    logger.trace("There are excludes. Relpath is " + relPath);
                    if (mm.isMatch(relPath, excludes)) {
                        included = false;
                    }
                }

                // override the excludes
                if (project.options.includes) {
                    logger.trace("There are includes. Relpath is " + relPath);
                    if (mm.isMatch(relPath, project.options.includes)) {
                        included = true;
                    }
                }
            } else {
                if (mm.isMatch(relPath, settings.exclude)) {
                    included = false;
                }
            }

            if (included) {
                logger.trace("Included.");
                if (fs.existsSync(pathName)) {
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
                    logger.warn("File " + pathName + " does not exist.");
                }
            } else {
                logger.trace("Excluded.");
            }
        });
    }

    if (projectRoot) {
        logger.info('Project "' + project.options.name + '" is done.');
        logger.info("-------------------------------------------------------------------------------------------");
    }

    return results;
}

function collectInfo() {
    console.log(getVersion());
    console.log("Project Initialize");

    var settings = {
        rootDir: '.',
        pseudoLocale: "zxx-XX"
    };

    var answer = readline.question('Full name of this project: ');
    settings.name = answer;
    settings.id = answer;

    answer = readline.question('Type of this project (web, swift, iosobjc, android, custom) [custom]: ');
    switch (answer) {
        case 'web':
        case 'swift':
        case 'iosobjc':
        case 'android':
            settings.projectType = answer;
            break;
        default:
        case 'custom':
            settings.projectType = 'custom';
            settings.plugins = [
                "javascript",
                "javascript-resource",
                "ghfm"
            ];
            settings.resourceDirs = {
                "javascript": "target",
                "md": "target"
            };
            break;
    }

    answer = readline.question('Source locale [en-US]: ');
    settings.sourceLocale = answer || "en-US";

    return settings;
}

try {
    switch (command) {
    case "init":
        var info = collectInfo();
        var project = ProjectFactory.newProject(info);
        var config = project.getConfig(info);
        var outputFile = path.join(settings.rootDir, "project.json");
        fs.writeFileSync(outputFile, JSON.stringify(config, undefined, 4) + '\n', "utf-8");
        logger.info("Wrote file " + outputFile);
        break;

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
        var superset = XliffSplit(settings);
        XliffSplit.write(XliffSplit.distribute(superset, settings));
        break;

    case "merge":
        var mergedXliff = XliffMerge(settings);
        XliffMerge.write(mergedXliff);
        break;

    case "generate":
        var project = ProjectFactory.newProject(settings, settings);
        GenerateModeProcess(project);
        break;

    case "convert":
        if (!settings.id) {
            settings.id = "convert";
        }
        fileConvert(settings);
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
