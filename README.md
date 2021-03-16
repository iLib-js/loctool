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

1. By npm is simple: `npm install loctool` or to install it globally: `npm install -g loctool`.
(Alternately, `yarn add loctool`)

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
1. Run the loctool to produce a set of xliff files with new strings to translate in them
1. Send the xliff files to your translators for translation and, some time
later, receive the translations back
1. Make the translations available into your project
1. Run the loctool again to produce a set of translated files and a set
of new xliff files. The new xliff files contain all the new or changed strings
since the last time that the loctool was run.

### Configuration

To run the tool, you will need to create a project.json configuration file for
each project and place it in the root of that project. The presence of a project.json
file indicates to the loctool that it has found the root of a project.

The easiest way to create a new project.json file for a particular directory is
to use the `loctool init` command. This will ask you a few questions and generate
a new project.json file in the current directory. You can use this as a starting
point for your project, and then edit it to customize any settings.

```
> node node_modules/.bin/loctool.js init
22:52:56 INFO loctool.loctool: loctool - extract strings from source code.

22:52:56 INFO loctool.loctool: Command: init
loctool v2.8.2 Copyright (c) 2016-2017, 2019-2020, HealthTap, Inc. and JEDLSoft
Project Initialize
Full name of this project: myproject
Type of this project (web, swift, iosobjc, android, custom) [custom]:
Source locale [en-US]:
22:52:57 INFO loctool.loctool: Wrote file project.json
22:52:57 INFO loctool.loctool: Done
> cat project.json
{
    "name": "myproject",
    "id": "myproject",
    "sourceLocale": "en-US",
    "pseudoLocale": "zxx-XX",
    "resourceDirs": {
        "javascript": "target",
        "md": "target"
    },
    "includes": [],
    "excludes": [
        ".git",
        ".github",
        "test",
        "node_modules"
    ],
    "settings": {
        "locales": [
            "en-GB",
            "de-DE",
            "fr-FR",
            "it-IT",
            "es-ES",
            "pt-BR",
            "ja-JP",
            "zh-Hans-CN",
            "ko-KR"
        ]
    },
    "projectType": "custom",
    "plugins": [
        "javascript",
        "javascript-resource",
        "ghfm"
    ]
}
>
```

The project.json file minimally contains the name, id, and projectType
properties.

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
* settings - other settings which configure this project. Some important
    settings:
    * locales - an array of target locales
    * xliffsDir - directory containing input translation xliff files
    * xliffsOut - where to place the output xliff files, such as
    the "new" strings files
* plugins - an array of names of plugins to use that handle various file
  types in your project

Both the "includes" and "excludes" arrays may contain enhanced glob
wildcard expressions using the [minimatch syntax](https://github.com/isaacs/minimatch):

* `*` - any sequence of characters in the current dir
* `?` - any particular character
* `**` - any sequence of directories

Example: `**/*.js` finds all javascript files, in whatever subdirectory.

This is a similar syntax to that used in ant's build.xml files. See the
minimatch documentation for more details.

### Making your Translations Available

You will need to get the xliff files that contain the translations into
your project so the loctool can find them. There are two ways to do this:

1. If you are using xliff v1.2 format, you can have all your translations in
a single file. Put this file into the root of your project. This file should
have the same base name as your project id in the project.json file. For
example, if your project is called "foo" in the project.json file, you should have
a foo.xliff file in your root that contains all the translations.
1. If you have multiple translation files, you can put them in a single
directory, and update the settings in the project.json to point to that
directory. The loctool will read all of the xliff files in that directory.
This will allow you do things like keep each batch of translations in a separate
set of xliff files from the old ones that don't need to be merged.

Example settings for an xliffs directory:

```json
{
    "name": "myproject",
    "id": "myproject",
    ...
    "settings": {
        "xliffsDir": "translations"
    },
}
```

### Running the Loctool

Running the tool is pretty straight-forward. Check out all the source code you
would like to localize to a particular directory and make sure that the current
branch is the one you would like to localize.

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

You can hand these new xliff files to
your translation vendor. XLIFF is a localization industry standard
and pretty much any reputable translation house will know
what to do with xliff files.

Note that if your vendor requires xliff v2.0 format
files instead of v1.2, you can generate them using the "-2"
command-line parameter.

### Re-integrating the Translated Files

When you have the translations back from your translators, you can
either merge them all together along with the existing
translations into one long xliff file named for the project
(only available for xliff v1.2 format files). Alternately, you can
make sure the files names are unique, and place them into a single
directory and use the xliffsDir setting in your project.json file
to point the loctool at that dir.

To merge a set of xliff files into one:

```
loctool merge <output-file> <input-file> ...
```

That is, the arguments are the name the output file (eg. "foo.xml")
and the list all the input files. Make sure to include your existing
translations in the list of input files or else you will lose all
your old translations! You want to merge all the old and new translations
together into one file.

```
loctool merge temp.xliff foo.xliff foo-new-de-DE.xliff foo-new-fr-FR.xliff foo-new-ja-JP.xliff
mv temp.xliff foo.xliff
```

### Run the Loctool Again

Now when you run the loctool, it will do two things. First,
it will write out the newly translated strings into resource files (eg. Java
properties files) or translated files (eg. translated copies of HTML files)
that are appropriate to your app's programming languages. Second, it will
search for any new or changed strings that have been added since you sent out
your last batch of translations. It will place those
in the foo-new-*.xliff files, which you can then send to the translators
as your next batch.

Because it does both at the same time, you can use the loctool as the engine
for continuous localization. As soon as you receive a batch of translations
back from the vendor, you immediately make the next batch!

### When to Run the Loctool

The loctool can be used in one of a number of ways:

1. In the build. The loctool can be run as a step in the build
between the "get all the source code from your SCM" step, and
the "compile all the source code" step. In this case, you will
probably want to check in the translated XLIFF files to your
SCM so that the loctool has the translations available as it
runs. This has the advantage that you can get a reproducible,
stable build because the xliffs are also under source control.

1. Manually. The localization manager can run the loctool
on-demand and then check in the results to the SCM. They can do this
on a regular basis to produce the new strings files each time.
This method is good when the project is small and there is
not a lot of reason to translate frequently and regularly.

1. In a background job. If your project is large and there is a
constant stream of new strings to translate, you can use a CI
systems like Jenkins or Travis or CircleCI to automate things.
First, check in the translated xliffs from your vendor into a
separate SCM repository. Then create a CI task that runs on a regular
basis and gets the latest xliffs from the xliffs repo, and the latest
source code from your SCM repo, and then runs the loctool on it. The end
result is that the task should create a pull request/check-in/review
for any of the localized files that the loctool has generated.
If it is set up correctly, this job can be triggered automatically
any time a change is pushed into your xliffs repo. This will
make sure that the latest localized files are always checked in to
your SCM soon after you receive each batch of translations back
from your vendor.

Plugins
-------

The loctool is driven by plugins that know how to parse various types
of files, and write out the appropriate localized output.

Plugins can be loaded dynamically using the "custom" type of project
and listing out the required plugins in the "plugins" section of
the project.json config file. Plugins are implemented as separate node
modules similar to the way Babel or Webpack plugins are implemented.

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

* `ilib-loctool-jst` - extract strings from JavaScript Template
(JST) format files

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

* `ilib-loctool-webos-appinfo-json` - extract strings webOS
  appinfo.json files and produce translated appinfo.json files for webOS

* `ilib-loctool-webos-c` - extract strings from C language
  files for webOS

* `ilib-loctool-webos-cpp` - extract strings from C++ language
  files for webOS

* `ilib-loctool-webos-javascript` - extract strings from Javascript language
  files for webOS

* `ilib-loctool-webos-json-resource` - extract strings from javascript, C/C++ files
 and produce translated json files for webOS

* `ilib-loctool-webos-qml` - extract strings from QML language
  files for webOS

* `ilib-loctool-webos-ts-resource` - extract strings from webOS QML files
 and produce translated QT's TS format files for webOS

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

Loctool in your Path
-------------------

If you have "node_modules/.bin" in your path, then you can run
the loctool with just a simple `loctool` command. Otherwise,
you will have to put "node_modules/.bin" in your path, or specify
the path to the loctool explicitly on the command-line.

You can avoid adding the .bin directory to your path if you
are using scripts in the package.json. The "node_modules/.bin"
directory is automatically added to the path, so you can create
a script like this in your package.json without the explicit
path:

```
"scripts": {
    "loc": "loctool"
},
```

Then:

```
npm run loc
```

Copyright and License
-------

Copyright &copy; 2016-2020, HealthTap, Inc. and JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this tool except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
