Localization Tool
=================

This tool reads source files in various formats, extracts strings
for translation, and writes out the translated strings the various 
resource file formats needed by each project.

See the (release notes)[./docs/ReleaseNotes.md] for details on what is
new and what has changed.

Installation
------------

To install the loctool, you will need to make sure you have nodejs installed
on your machine and in your path, as this is used to run the code. (Use 7.0 or later)

Once nodejs is installed, you can install the loctool itself. You can either
get it from npm or from github.com:

1. By npm is simple:

npm install loctool

or to install it globally:

npm install -g loctool

2. By github is a little more complicated in that you still need npm to install 
the necessary JS libraries that the loctool depends upon:

git clone git@github.com:iLib-js/loctool.git
cd loctool
npm install

If you did these steps, you can run it in situ as if it were installed by npm.
The difference is that now you can make a branch and recontribute your fixes as
PRs back to the open-source community. Better would be if you made a fork first
and submitted PRs from your fork instead.

Running the Tool
----------------

To run the tool, you will need to create a project.json file for 
each project. (There may be one checked in to your project already.)
The tool will recursively search the given directory
(current dir by default) for project.json files. Once they are
found, it is assumed to be the root of a project. That project will
be recursively searched for localizable files.

Running the tool is pretty simple. Check out all the source code you
would like to localize to a particular directory and make sure each
is located on the branch you would like to localize. Then, you will
need to get the xliff file containing the translations for your
project and copy it to the root of your project next to the 
project.json file. This file should have the same base name as your
project id in the project.json file.

Finally, run the tool:

```
node <path-to-the-loctool-dir>/loctool.js
```

or if you have the node_modules/.bin directory in your path already,
you can simply run the "loctool" script which will launch node for
you.

The result is that it will find all localizable strings for your 
project, and write them to an "new strings" xliff file for each
target locale. If your project id is "foo", then it will produce files:

```
foo-new-es-ES.xliff
foo-new-de-DE.xliff
foo-new-fr-FR.xliff
...
```

One for each target locale. You can then hand these xliff files to
your translation vendor. Any reputable translation house will know
what to do with xliff files, as they follow a localization-industry 
standard.

When you have the translations back from your translators, you can 
merge them all into one long xliff file named for the project. In 
our example about, it would be "foo.xliff". Place that file in the
root of your project.

This time, when you run the loctool, it will do two things. First,
it will write out translated strings into resource file that are
appropriate to your app's programming language. Second, it will 
search for new strings that are not yet translated, and place those
in the foo-new-*.xliff files, which you can then send to the translators
as your next batch.

You can run this tool every time you receive translations to do
a continuous translation cycle.

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
    "resourceDirs": {
    	"java": "./res"
    },
    "excludes": [
    	"./.git",
    	"./assets",
    	"./bin",
    	"./libs",
    	"./script/**/*.sh",
    	"public",
    	"./classes"
    ],
    "includes: [
    	"public/**/*.html"
    ],
    settings: {
        locales: ["es-ES", "de-DE", "fr-FR"]            
    }
}
```

All paths are relative to the root of the project.

name         - the human-readable name of the project
id           - the unique id of the project, which also determines the 
               name of the xliff file the tool looks for. (ie. if your
               project is "X", then it will look for "X.xliff")
projectType  - the type of the project, which affects how source files
               are read and resource files are written. Must be one of
               "android", "iosobjc", "iosswift", or "web"
resourceDirs - an array of dirs that have resource files in them
excludes     - an array of dirs or files to exclude from searching. When
               a dir is excluded, all subfiles and subdirs in that dir 
               are also excluded.
includes     - an array of dirs or files to localize. These override the 
               excludes. This allows you to exclude an entire directory
               but localize particular files in that directory.
settings     - other settings which configure this project. The most
               important of these is "locales", which is an arrary of
               target locales.

Both the includes and excludes array may contain enhanced glob 
wildcard expressions:

* - any sequence of characters in the current dir
? - any particular character
** - any sequence of directories

Example:

**/*.js   - find all javascript files, in whatever directory.
