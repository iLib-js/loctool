Localization Tool
=================

This tool reads source files in various formats, extracts strings
for translation, and writes out the translated strings the various
resource file formats needed by each project.

See the [release notes](./docs/ReleaseNotes.md) for details on what is
new and what has changed.

Installation
------------

To install the loctool, you will need to make sure you have nodejs installed
on your machine and in your path, as this is used to run the code. (Use 7.0 or later)

Once nodejs is installed, you can install the loctool itself. You can either
get it from npm or from github.com:

1. By npm is simple: `npm install loctool` or to install it globally: `npm install -g loctool`

1. By github is a little more complicated in that you still need npm to install
the necessary JS libraries that the loctool depends upon:

```
git clone git@github.com:iLib-js/loctool.git
cd loctool
npm install
```

If you did these steps, you can run it in situ as if it were installed by npm.
The difference is that now you can make a branch and recontribute your fixes as
PRs back to the open-source community. Better would be if you made a fork first
and submitted PRs from your fork instead.

Running the Tool
----------------

### Basic Operation

1. Create a project.json configuration file for your project
1. Run the loctool to produce a set of xliff files with new translations in them
1. Send the xliff files to your translators for translation and, some time
later, receive the translations back from them
1. Merge the various translations into a single xliff file
1. Run the loctool again to produce a set of translated files and a set
of new xliff files. The new xliff files contain all the new or changed strings
since the last time that the loctool was run.

### Configuration

To run the tool, you will need to create a project.json configuration file for
each project and place it in the root of that project.
The loctool will recursively search the given directory
(current dir by default) for project.json files to find the roots of the
projects. The root of each project will be recursively searched for localizable files.

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

* name - the human-readable name of the project
* id - the unique id of the project, which also determines the
    name of the xliff file the tool looks for. (ie. if your
    project is "X", then it will look for "X.xliff")
* projectType - the type of the project, which affects how source files
    are read and resource files are written. Must be one of
    "android", "iosobjc", "iosswift", or "web", or "custom".
    * android - an android project
    * iosobjc - an iOS project using Objective-C
    * iosswift - an iOS project using Swift
    * web - a web application
    * custom - a project using a custom set of plugins to process
    all of the files (see below)
* resourceDirs - an object that maps a file type to a dir that serves
    as the out for resource files
* excludes - an array of dirs or files to exclude from searching. When
    a dir is excluded, all subfiles and subdirs in that dir
    are also excluded.
* includes - an array of dirs or files to localize. These override the
    excludes. This allows you to exclude an entire directory
    but localize particular files in that directory.
* settings - other settings which configure this project. The most
    important of these is "locales", which is an arrary of
    target locales.

Both the "includes" and "excludes" arrays may contain enhanced glob
wildcard expressions using the [minimatch syntax](https://github.com/isaacs/minimatch):

* `*` - any sequence of characters in the current dir
* `?` - any particular character
* `**` - any sequence of directories

Example: `**/*.js` finds all javascript files, in whatever subdirectory.

See the minimatch documentation for more details.

### Running the Loctool

Running the tool is pretty straight-forward. Check out all the source code you
would like to localize to a particular directory and make sure that the current
branch is the one you would like to localize.

Then, you will
need to get the xliff file containing the translations for your
project and copy or symbolically link it to the root of your project
next to the project.json file. This file should have the same base
name as your project id in the project.json file. For example, if
your project is called "foo" in the project.json file, you should have
a foo.xliff file in your root that contains all the translations.

To run the tool:

```
node <path-to-the-loctool-dir>/loctool.js
```

or if you have node_modules/.bin in your path already,
you can simply run the "loctool" script which will launch node for
you.

Note that using the defaults for almost all parameters will usually
get you what you want. See below for a description of the command-line
parameters.

The result is that it will find all localizable strings for your
project, and write them to an "new strings" xliff file for each
target locale. If your project id is "foo", then it will produce files:

```
foo-new-es-ES.xliff
foo-new-de-DE.xliff
foo-new-fr-FR.xliff
etc...
```

One for each target locale.

### Translating the Strings

You can hand these extracted xliff files to
your translation vendor. XLIFF is a localization industry standard
and pretty much any reputable translation house will know
what to do with xliff files.

### Creating a Single Merged XLIFF

When you have the translations back from your translators, you can
merge them all into one long xliff file named for the project, which
is placed or symbolically linked into the root of the project. In
our example above, it would be "foo.xliff".

To merge a set of xliff files into one:

```
loctool merge <output-file> <input-file> ...
```

That is, the arguments are the name the output file (eg. "foo.xml")
and the list all the input files.

### Run the Loctool Again

Now when you run the loctool, it will do two things. First,
it will write out the newly translated strings into resource files
and translated files that are
appropriate to your app's programming language. Second, it will
search for new strings that are not yet translated, and place those
in the foo-new-*.xliff files, which you can then send to the translators
as your next batch.

You can run this tool every time you receive translations to do
a continuous translation cycle.

### When to Run the Loctool

The loctool can be used in one of a number of ways:

1. In the build. The loctool can be run as a step in the build
between the "get all the source code from your SCM" step, and
the "compiled all the source code" step. In this case, you will
probably want to check in the translated XLIFF files to your
SCM so that the loctool has the translations available as it
runs. This has the advantage that you can get a reproducible,
stable build.

1. Manually. The localization manager can run the loctool
on-demand and then check in the results to the SCM. They can do this
on a regular basis to produce the new strings files each time.
This method is good when the project is small and there is
not a lot of reason to translate frequently and regularly.

1. In a background job. If you use a CI systems like Jenkins
or Travis, you can create a background task that runs the loctool
on your source code repository, and creates a
pull request/check-in/review for any newly localized files. This
will make sure that the latest resource files are checked in
to your SCM soon after the translated XLIFF are checked in.

Plugins
-------

The loctool is driven by plugins that know how to parse various types
of files, and write out the appropriate localized output.

Plugins can be loaded dynamically using the "custom" type of project
and listing out the required plugins in the "plugins" section of
the project.json config file. Plugins are written as separate node
modules similar to the way Babel or Webpack plugins are written.

If you encounter a file type that the loctool doesn't currently
handle, or which it is handling in a way that you don't like, you can
write your own plugin. A plugin is simply two classes
that conform to a simple SPI. If you would like to write one,
read the [How to Write a Loctool Plugin](docs/Plugins.md)
documentation for all the details.

List of Current Plugins
-----------------------

* `ilib-loctool-android-layout` - extract strings from
Android layout.xml files and produce translated
strings.xml files

* `ilib-loctool-android-resource` - extract strings from
Android strings.xml files and produce translated
strings.xml files

* `ilib-loctool-csv` - extract strings from comma-separated
values (CSV) format files and produce translated CSV files

* `ilib-loctool-ghfm` - extract strings from Github-Flavored
Markdown (MD) format files and produce translated MD files

* `ilib-loctool-ghfm-readmeio` - extract strings from Github-Flavored
Markdown (MD) format files with Readme.io extensions and
produce translated MD files

* `ilib-loctool-haml` - extract strings from HAML format
files and produce translated HAML files

* `ilib-loctool-html` - extract strings from static HTML
files and produce translated HTML files

* `ilib-loctool-jst` - extract strings from Javascript Template
(JST) code files and produce translated JST files

* `ilib-loctool-strings-resource` - extract strings from iOS
.strings format resource files and produce other .strings files

* `ilib-loctool-java` - extract strings from Java
code that uses the ilib ResBundle class to do its translations
and produce properties resource files

* `ilib-loctool-javascript` - extract strings from Javascript
code that uses ilib to do its translations and produce JS
resource files

* `ilib-loctool-javascript-resource` - extract strings from ilib
Javascript resource files and produce JS resource files

* `ilib-loctool-jsx` - extract strings from JSX format
code that uses ilib and react-ilib to do its translations

* `ilib-loctool-markdown` - extract strings from Markdown format
files and produce translated Markdown files

* `ilib-loctool-objectivec` - extract strings from Objective-C
code for iOS and produce .strings files

* `ilib-loctool-swift` - extract strings from Swift
code for iOS and produce .strings files

* `ilib-loctool-yaml` - extract strings from YAML format
files and produce translated YAML files

* `ilib-loctool-xliff` - extract strings from XLIFF
format files and produce translated XLIFF files

Configuring a Custom Project Type
-----------------------------------------------

Let's say you have a web project that uses Javascript,
JST, and HTML on the front end, and you would like to
localize it using loctool.

In this case, you need to make sure to add `loctool`,
`ilib-loctool-jst`, `ilib-loctool-html`, and
`ilib-loctool-javascript` to the dependencies property
of your package.json file:

```
  ...
  "devDependencies": {
    "loctool": "^2.3.0",
    "ilib-loctool-jst": "^1.0.0",
    "ilib-loctool-html", "^1.0.0",
    "ilib-loctool-javascript": "^1.0.0"
  },
  ...
```

Then, you need to add a "plugins" property to the project.json
file which is an array of plugin names. The plugins may be
referred to with their whole name from npm, like
"ilib-loctool-jst", or it can be referred to by the part
after the "ilib-loctool-", so just "jst" in this example.

Here is what your custom project.json might look like:


```
{
    "name": "My Web App",
    "id": "mywebapp",
    "projectType": "custom",
    "sourceLocale": "en-US",
    "pseudoLocale": "sw",
    "resourceDirs": {
        "jst": "./i18n",
        "javascript": "./i18n"
    },
    "plugins": [
        "jst",
        "html",
        "javascript"
    ],
    "excludes": [
        "./.git",
        "./assets",
        "./bin",
        "./libs",
        "./script/**/*.sh",
        "./classes"
    ],
    "includes: [
        "**/*.html",
        "**/*.jst",
        "**/*.js"
    ],
    settings: {
        locales: ["es-ES", "de-DE", "fr-FR"],
    }
}
```

Running the Loctool
-------------------

If you have "node_modules/.bin" in your path, then you can run
the loctool with just a simple `loctool` command. Otherwise,
you will have to give the path to it explicitly.

If you are writing a script in npm, the "node_modules/.bin"
directory is automatically added to the path, so you can create
a script like this in your package.json without the explicit
path:

```
"scripts": {
    "loc": "loctool"
},
```

Copyright and License
-------

Copyright &copy; 2016-2019, HealthTap, Inc. and JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this tool except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
