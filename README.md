Localization Tool
=================

This tool reads source files in various formats, extracts strings
for translation, and writes out the translated strings the various 
resource file formats needed by each project.

Installation
------------

To install this, you will need to make sure you have nodejs installed
on your machine and in your path.

Once it is installed, you need to use the package manager to install
the following things:

npm install log4js ilib mysql2 pretty-data xml2json yamljs js-stl

You will also need to make sure ruby is installed on your machine
and is in your path.

Once it is installed, you need to install the following gems:

gem install haml sanitize


Running the Tool
----------------

To run the tool, you will need to create a project.json file for 
each project. The tool will recursively search the given directory
(current dir by default) for project.json files. Once they are
found, it is assumed to be the root of a project. That project will
be recursively searched for localizable files.

Running the tool is pretty simple. Check out all the source code you
would like to localize to a particular directory and make sure each
is located on the branch you would like to localize. Then, run the tool:

node loctool.js

The Project.json File
---------------------

The project.json file minimally contains the name, id, and projectType
properties. Here is an example project.json file:

```
{
	"name": "Android App",
	"id": "myandroidapp",
	"projectType": "android",
	"pseudoLocale": "de",
	"resourceDirs": [
		"./res"
	],
	"excludes": [
		"./.git",
		"./assets",
		"./bin",
		"./libs",
		"./script",
		"./classes"
	]
}
```

All paths are relative to the root of the project.

name         - the human-readable name of the project
id           - the unique id of the project
projectType  - the type of the project, which affects how source files
               are read and resource files are written. Must be one of
			   "android", "iosobjc", "iosswift", or "web"
resourceDirs - an array of dirs that have resource files in them
excludes     - an array of dirs or files to exclude from searching. When
               a dir is excluded, all subfiles and subdirs in that dir 
			   are also excluded.
