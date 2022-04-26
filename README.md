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
loctool v2.12.0 Copyright (c) 2016-2017, 2019-2021, HealthTap, Inc. and JEDLSoft
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
  types in your project. Make sure you have put these plugins as dependencies
  in your package.json. See the plugins section below for more information
  about them.

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

Pseudotranslation
-----------------

The loctool has the ability to do pseudo-translation, which means
automatically generating a set of translations as a transformation of
the source strings. Currently, there are two types of pseudo-translations:

1. Pseudo-translation for debugging. This transformation takes a source
string and applies an algorithmic transformation to it for the purpose
of debugging your app.
1. Automatic translation. This applies an algorithmic translation to
the source strings for actual use in your app.
1. Transliterations. This applies an algorithm to transform one
[manual] translation into another in a different script.

### Debug Pseudo-translation

The reasons you might use debug pseudo-translation are:

1. To test whether all your strings have been extracted properly. If
you rely on your engineers to either wrap their translatable strings
in function calls, or for them to copy their strings into a source
resource file, they may miss some of them. Using a pseudo locale
in your UI will make that obvious. If you see a regular source
string in your UI instead of a pseudo-localized one, then either:
    1. The engineer missed it
    1. It is a user-generated string
    1. It comes from outside your app (ie. a 3rd party app,
       library, file, or service.)
If is it the first type, then you can submit a bug for the engineer
to fix it.
1. To test if long strings will fit in your UI. The source string
is artificially lengthened to simulate "long" languages like
German or French that tend to cause expansion from English source
strings. Ideally, your UI is dynamically sized and can stretch
appropriately to accommodate translations that are longer or
shorter than the source string.
1. To test fonts. Some pseudo translations can transform the
source strings into strings of characters that require a different
font. This allows you to test out whether or not the font works
in your UI without having a real translation.

### Automatic Translations

Strings for some locales can be generated based on the source
locale strings or based on previous translations. Here are
the transformations that the loctool currently supports:

1. US English -> British English. This is essentially a spell
correction from US English to British English. For example,
it will correct (color -> colour) and (localize -> localise).
It will not take care of transforming vocabulary such as
(truck -> lorry) or (sweater -> jumper).
1. US English -> Canadian English. Similar to the British
English, this is simply a spell correction without transforming
vocabulary.
1. US English -> Australian English. Similar to the British
English, this is simply a spell correction without transforming
vocabulary. This transformation is almost the same as
British English except for a few slight differences.
1. US English -> New Zealand English. Similar to the British
English, this is simply a spell correction without transforming
vocabulary. This transformation is almost the same as
British English except for a few slight differences.
1. US English -> another form of English not listed above.
This applies the British English rules to generate the other
locales. For example, en-JM (English for Jamaica) can be
generated from US English using the British English spell
corrections.

Future versions of the loctool may contain automatic translations
based on machine translation. For example, if your company
has a license to use the Google Translate API, we could use
that to generate translations automatically. The quality of
machine translation is not sufficient to look "professional"
in a regular UIs but could be of use to support locales that
are not your core business or perhaps even for pre-testing
locales before you spend money on real translation.

One big problem with Google Translate and the reason that the
Google Translate automatic pseudo-translation does not yet exist
in the loctool is that Google Translate is not designed
for UI strings. This causes a number of problems:

1. Markup or HTML gets messed and the syntax is wrong.
Sometimes even, the HTML tag names of attribute names
get translated!
1. Substitution parameter names get translated for those
programming languages that name their parameters.
1. The syntax of substitution parameters can get screwed
up for those programming languages where the parameters
are not named. Example: "%@1s" -> "%  @1 s" in some
instances and the programming language no longer recognizes
them as substitution parameters.
1. The position of substitution parameters is not updated.
Human translators realize that "%s" in a source string
is substituted with a particular type of value, especially
if this is explained in your extracted translator's
comments. For example, "%s" may represent a person's
name or a formatted date, and "%d" may represent a number
of items. Google Translate will not move these around
in the translation appropriately according to the grammar
of the language, but a human translator will.

### Transliterations

Currently, only one type of transliteration is supported, but
more are planned for future versions of the loctool.

This type of pseudo-translation is
is a little special in that it is not the source string that is
transformed, but a previous translation of that source string.
In order to use this
pseudo-translation, you have to localize to both the
locales in the same run of the
localization tool. That is, both must be listed in the
`locales` setting at the same time. If they are not done
together, then the translation to the first locale is not
available to be mapped into the translation for the second
locale.

Supported transliterations are:

1. Simplified Chinese -> Traditional Chinese. This applies
the open-source OpenCC transformation that is used in Wikimedia
to automatically generate the traditional Chinese based on
a previous simplified Chinese translation. Both the Taiwan and
Hong Kong style of traditional Chinese are supported,
based on the target locale.

Other types of automatic translations are planned in
future versions of the loctool:

1. Serbian. Cyrillic <-> Latin
1. Uzbek. Cyrillic <-> Latin <-> Arabic
1. Kurdish. Cyrillic <-> Latin <-> Arabic
1. Japanese Katakana <-> Romaji

If you have a request for any other type of transliteration,
please let us know!

## Specifying Pseudo-translations

Pseudo-translations can be specified in your project.json file.
Currently, there are two properties of the project.json that
are involved with pseudo-translation:

1. pseudoLocale: This is either a string, an array of locale specs,
or an object that maps locale specs to a pseudo-translation style.
1. settings.locales: If you wish to perform a pseudo-translation,
the target locale for that pseudo-translation must be listed in
the settings.locales array. If you are doing a transliteration,
for example, from simplified Chinese for China (zh-Hans-CN) to
traditional Chinese for Taiwan (zh-Hant-TW), both of those locales
should be listed in the settings.locales array.

If pseudoLocales is specified as:

* string: this specifies a single locale to use as the "debug"
pseudo-translation
* array: all of the locales listed in the array will be
considered pseudo-locales and the default pseudo-translation style
will be applied to generate them.
Any locale not specified in the array will not be considered a
pseudo-locale.
* object: map locale specs to the style of pseudo-translation.
* empty array or object: all pseudo-translations will be turned off.
* not specfied at all: all available pseudo-translations listed above will
be applied with their default style.

Example project.json with a string pseudo locale:

```
{
  "pseudoLocale": "mn-MN",
  "settings": {
    "locales": [ "de-DE", "en-CA", "en-GB", "mn-MN", "zh-Hans-CN", "zh-Hant-TW"]
  }
}
```

This uses "mn-MN" for the "debug" pseudo-translation. Note that "mn-MN" must be listed in
the `settings.locales` for this to work.

Example project.json with an array of pseudo locales:

```
{
  "pseudoLocale": [
    "en-CA",
    "en-GB",
    "zh-Hant-TW"
  ],
  "settings": {
    "locales": [ "de-DE", "en-CA", "en-GB", "zh-Hans-CN", "zh-Hant-TW"]
  }
}
```

Note that both "zh-Hans-CN" and "zh-Hant-TW" are listed in the locales so that
the Taiwan resources can be generated from the China resources.

Example project with an object of pseudo locales:

```
{
  "pseudoLocale": {
    "pl-PL": "debug",
    "en-CA": "english-canadian",
    "en-GB": "english-british",
    "zh-Hant-TW": "chinese-traditional-tw"
  },
  "settings": {
    "locales": [ "de-DE", "en-CA", "en-GB", "pl-PL", "zh-Hans-CN", "zh-Hant-TW"]
  }
}
```

In the above example, we are co-opting the Polish locale
as the "debug" pseudo-translation. Make sure Polish is also
listed in the locales list!

### Pseudo-translations Styles and Defaults

The following is the list of styles supported:

- debug: map Latin characters to accented versions of those
  characters. This is readable in English still, albeit with some
  difficulty, so that you can use the UI.
- debug-rtl: map the Latin characters to right-to-left language
  characters to test your app's readiness for right-to-left languages
  like Arabic or Hebrew
- debug-asian: map the Latin characters to Asian characters
  to test your app's font support for Asian characters
- english-british: map US spellings to British English spellings
- english-canadian: map US spellings to Canadian English spellings
- english-australian: map US spellings to Australian English spellings
- english-new-zealand: map US spellings to New Zealand English spellings
- chinese-traditional-tw: map simplified Chinese translations
  to Taiwan-style traditional Chinese
- chinese-traditional-hk: map simplified Chinese translations
  to Hong Kong-style traditional Chinese

The following is the default mapping between locales (pseudo-locales!)
and the styles:

- zxx-XX, und-XX: debug
- zxx-Arab-XX: debug-rtl
- zxx-Hans-XX, zxx-Hant-XX: debug-asian
- en-CA: english-canadian
- en-AU, en-CX, en-CC, en-NF, en-HM: english-australian
- en-NZ, en-CK, en-NU, en-TK: english-new-zealand
- en-*: english-british  (that is, any form of English other than
  the ones listed above)
- zh-Hant: chinese-traditional-tw
- zh-Hant-TW: chinese-traditional-tw
- zh-Hant-HK: chinese-traditional-hk

Note that "zxx" means "unspecified language", and "und" means
"undefined language", which are valid ISO codes that are never
used in real locales so they
make good candidates for debug pseudo-translations. However, there are
many UI frameworks that do not allow you to set the locale
to these locales. In that case, you might want to choose a locale
that you are not currently officially supporting like "be-BE" or
"fi-FI" but which are more common and which your UI framework
will allow. Be very careful to not ship this locale!

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

* `ilib-loctool-strings` - extract strings from iOS
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

* `ilib-loctool-salesforce-metaxml` - extract strings from -meta.xml files and produced translated
  meta.xml files for Salesforce

* `ilib-loctool-json` - extract strings from json files and produce translated json files. This
specifies which strings to extract using a json schema file. Different json files can use different
json schemas.

* `ilib-loctool-po` - extract strings from po files and produce translated po files

* `ilib-loctool-xml` - extract strings from XML files and produce translated XML files. This
specifies which strings to extract using a schema file. Different XML files can use different schemas.

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

Other Actions the Loctool Can Do
-------

All of the above documentation is focussed on localization, which is the
main function of the loctool and it is the default action. There are a
few other things that the loctool can do as well, and these are specified
on the command line as the 2nd parameter, similar to the way that
actions are specified to git or npm.

These are the actions which are available:

- localize - localize any projects found in the current directory tree.
  This is the default action.
- init - create a new project.json file based on the answers to a few
  questions. This makes it easy to set up a new project for localization.
- merge - merge multiple xliff files together into one. There may be some
  restrictions to this, as xliff v2.0 format files cannot contain translations
  to multiple languages.
- split - split a set of xliff files into multiple xliff files where each
  output file contains one language or project.
- generate - like the localize action, this generates a set of localized
  files for the project. However, unlike the localize action, it does not
  read the source files first to determine which strings are used nor does
  it generate a new strings file.
- convert - Converts one resource file format to another. Resource files
  are files that contain a collection of translations for a product in a
  particular programming language. Examples include xliff, po, json,
  strings, or
  properties files. Additionally, the convert action can transform the
  input files into translation memory tmx files. Tmx files cannot be
  input files, only output. Note that conversion of files is not guaranteed
  to preserve all data. For example, strings files for iOS can contain
  comments whereas json files cannot. If you convert a strings file into a
  json file, any comments will be lost.

Copyright and License
-------

Copyright &copy; 2016-2022, HealthTap, Inc. and JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this tool except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
