Release Notes for Version 2
============================

Build 038
-------
Published as version 2.21.1

New Features:

Bug Fixes:
* Fixed bug where resources with no source would sometimes appear in the
  extracted and new xliff files.
    * in the ResourceArray constructor: an undefined element
      in the array would get stored as the string "undefined" in the resource array
      instead of the actual value undefined. This messed a lot of things up
    * in projects, filter out any resources, from any plugin, where the
      source is not defined. This goes for strings, arrays, or plurals.

Build 038
-------
Published as version 2.21.0

New Features:
* added new `resourceDir` parameter support to util's `formatPath()` which is for modifying the resource root path.

Bug Fixes:


Build 037
-------
Published as version 2.20.3

New Features:

Bug Fixes:
* added more explicit logging output in order to be able to debug problems
* fixed a problem where tmx file output was not adding the srclang attribute
  to the header of the tmx file

Build 036
-------
Published as version 2.20.2

New Features:

Bug Fixes:
* convert would not read the local ./project.json which contains settings that could not
  be specified on the command-line. Now, it does!

Build 035
-------
Published as version 2.20.1

New Features:

Bug Fixes:
* Updated to remove duplicate plugins from the list which can reduce duplication of work.
* Fixed ternary operator bug in `getTranslations()` method on the Project class.
* Fixed a bug where attempting to glean the locale from a path using an undefined template
  would cause an error. Instead, it should just return the empty string to indicate that
  no locale was found.

Build 034
-------
Published as version 2.20.0

New Features:
* Added a new `getRepository()` method on the Project class to get the local repository.
* Added a new `getTranslationSet()` method on the LocalRepository class to get all of the translations.

Build 033
-------
Published as version 2.19.0

New Features:
* Added the --localeInherit flag which could define custom locale inheritance.

Bug Fixes:
* Fixed a bug where not correctly filtering pseudo locale.

Build 032
-------
Published as version 2.18.0

New Features:
* Added the utility function to override language default locale.
* Added new `getTranslations()` method on the Project calss to get all of the translations.

Bug Fixes:

Build 031
-------
Published as version 2.17.0

New Features:
* Added xliff comments on translation units for [mojito](https://mojito.global) to
  read so that it can recognize plural resources
* Added the ability to specify multiple xliff directories containing translations
  to use. Translation units in the later xliff directories override those found in
  the earlier ones. Xliff dirs found on the command-line override ones found in
  the project.json file.
* Added the utility function to check whether the current locale matches the language default locale.

Bug Fixes:

Build 030
-------
Published as version 2.16.3

New Features:
* Minimum node version is now v10.0.0+. Older versions of node cannot support
  the packages that loctool depends on.

Bug Fixes:
* upgraded more dependencies
* added more things to the default exclude list that do not include localizable
  strings such as the project.json or package.json files

Build 030
-------
Published as version 2.16.2

New Features:

Bug Fixes:
* upgraded dependencies
    * plural categories are now based on CLDR 40
* fixed a bug where a resource with an zero-length source string caused the
  xliff writer to throw exceptions

Build 029
-------
Published as version 2.16.1

New Features:

Bug Fixes:
* Fixed a bug in the utility functions for detecting locales in file names.
  If you had a mapping with a template of "[dir]/[basename]_[locale].[extension]",
  then the locale was not detected properly.

Build 029
-------
Published as version 2.16.0

New Features:
* added the ability for the plugins to get their own logger instance from
  the loctool so that the plugin output comes with the regular output
  from the loctool itself. This way, plugins do not need a separate
  logging system of their own.

Bug Fixes:
* Fixed a bug in the utility functions for cleaning strings where a bad
  input would cause an exception. Now it checks for bad input and returns
  undefined.

Build 028
-------
Published as version 2.15.1

New Features:

Bug Fixes:
* fixed an exception in utils.formatPath. When a locale does not contain
  a component, and the path template calls for that particular component,
  (for example, "de" has no region, and this template asks for a region:
  "dir/[region]/[filename]"), it should act as if that component is not
  there.
* Updated package dependencies

Build 027
-------
Published as version 2.15.0

New Features:
* Added the --onlyTranslated flag which causes the convert action
  to only convert translated resources into the target file.
  Source-only resources will be skipped. By default, all resources
  are converted.
* Added [localeLower] as a new template variable that uses lowercased 
  BCP-47 locale, e.g. `zh-Hans-CN` => `zh-hans-cn`.

Bug Fixes:
* Fixed a bug where xliff files were not being read in properly when
  the resource name attribute of translation units contained a
  "slash n" sequence. Previously, it would convert "slash n"
  into a newline. Now, it converts it into a "slash" character
  followed by an "n" character.

Build 026
-------
Published as version 2.14.2

New Features:
* Added the --noxliffDups flag which does not allow duplicated strings in extracted xliff file

Bug Fixes:
* Fixed a bug where the default excluded directory is not exclude

Build 025
-------
Published as version 2.14.1

New Features:

Bug Fixes:
* Fixed a bug where it was not loading plugins correctly on Windows.
  Switched from using process.env.PWD which does not work on Windows to
  process.cwd() which should work everywhere.
* Fixed exception when you put an unknown substitution parameter into
  an output path template. Now gives a warning instead.
* Fixed a bug where the [basename] in a output file name template was
  not calculated properly if the extension was not ".json". Now you can
  use any extension.

Build 024
-------
Published as version 2.14.0

New Features:
* Changed the new strings xliff files to contain the correct plural categories
  for the target language. If the target locale has more or less strings than
  the source locale, that will come out in that xliff file.
    * This way, translators just need to translate each string and
      not worry about adding/subtracting categories for the language
* Add the ability to redefine which style of pseudolocalization that each locale uses
  by specifying an object in the pseudolocale setting in project.json.
    * Defined a number of pseudo translation styles such as
      "english-british" or "chinese-traditional-tw"
    * When pseudolocale is an object, it maps a locale to a pseudo style
    * When pseudolocale is set to a string or array, it works as before to
      define which locales are pseudo locales, but locales not explicitly
      listed are no longer considered pseudolocales
    * When pseudolocale is set to an empty string, array, or object, all
      pseudolocalization is turned off, similar to specifying the "nopseudo"
      flag on the command-line


Bug Fixes:
* Fixed some bugs in pseudo locale translation when called from a plugin
* Fixed a bug where Hans pseudo translation crashed when called from a
  plugin because the conversion data had not been loaded yet
    * Upgraded to opencc-js 1.0.3 to get the latest mappings and so that
      the data can be loaded synchronously

Build 023
-------
Published as version 2.13.1

Bug Fixes:
* Fixed the part where the argument number was increased incorrectly
* Make sure the xliffsOut dir exists before attempting to write files there
* Make sure to pass in the target locale as specified on the command line when converting files
* Corrected misspelled function name in ResourcePlural
* Loctool crashed if some plugins don't implement the generatePseudo method
  in the FileType class. Now it tests for the existence of the method before
  attempting to call it.

Build 022
-------
Published as version 2.13.0

New Features:
* Added the ability for the plugins to see the output locale map so that they can fix the
  locales used to make the output files names.

Bug Fixes:
* Added guard code not to work if the object is empty when setting target locale for conversions


Build 021
-------
Published as version 2.12.0

New Features:
* Added the --xliffStyle flag which specifies customized xliff format
* Added support for writing TMX files
    * The TMX files are segmented by paragraph (whole strings) or sentence.
* Added a "convert" action to the command-line. This converts files from one format to another:
    * `loctool convert output.tmx input1.xliff input2.xliff ...`
    * files types are recognized by extension
    * you may need plugins to read/write some file types

Bug Fixes:
- the locales to localize to were not set correctly if there are no translation files already.
  This made it harder to start new projects.
- Xliff output didn't work if the source locale was something other than "en-US"

Build 020
-------
Published as version 2.11.0

New Features:
* Added the --exclude flag which excludes a comma-separated list of directories while searching for project.json config files
* Added support for file path template formatting which plugins can use to generate
  output file paths for localized files

Bug Fixes:
- Updated the code that the key value would be written in xliff only if it's different from the source
- Fixed a bug where plural resources for a locale that has a different number of plural categories than
  the source language would never show those plurals in the xliff output. Now the plurals output of
  xliff files follows the plural categories available in the target language instead of the source language.

Build 019
-------

Published as version 2.10.3

New Features:

Bug Fixes:
- Added guard code to check if a file really exists in the given path before reading

Build 018
-------

Published as version 2.10.2

New Features:

Bug Fixes:
- Added guard code to prevent an error when read directory list returns empty

Build 017
-------

Published as version 2.10.1

New Features:

Bug Fixes:
- Fixed a problem to split xliff 2.0 files
- Updated the documentation to be more clear and to add a description of the xliffsDir setting
- Added guard code not to stop the process even though an xliff path is not valid.


Build 016
-------

Published as version 2.10.0

New Features:
- Added `group` element under the file element in Xliff format version 2. Each group contains one datatype.
- Added a generate mode for generating resource without scanning source files.
- If the "fullyTranslated" flag is turned on for markdown files, and the 
  file is fully translated, then the "fullyTranslated"  setting will be
  added to the front matter. If there is no front matter, it will create
  one.

Bug Fixes:
- Updated to remove duplicate locales in a list
- Fixed a problem to parse xliff 2.0 files
- Fixed a problem to merge xliff 2.0 files


Build 015
-------

Published as version 2.9.0

New Features:
- Add "loctool init" command to generate an initial project.json file that the user can
  use as a starting framework.

Bug Fixes:
- Fixed a problem where the xliff path is incorrectly converted when the path is absolute.
- Added a condition not to see a warning message when xliff file is loading.
- Loctool could not install or run on certain platforms with certain versions of C++
  compilers installed because the node-gyp compiler did not work right
    - moved from `opencc` to `opencc-js` which is pure JS code, but a little
      bit slower
    - moved from `xml2json` to `xml-js` which is also pure JS code, and also
      a little slower
    - no longer depends on the `PrettyData` module

Build 014
-------

Published as version 2.8.1

Bug Fixes:
- Fix a problem where the MarkdownFileType was producing the translation-status.json file
  even when the fullyTranslated option is not turned on. If it is not turned on, it is not
  useful anyways so don't produce it.

Build 013
-------

Published as version 2.8.0

New Features:
- added a "fullyTranslated" setting for the markdown code. This makes sure that if a
  file does not have all of its translations, then that file is produced in the source
  language.
    - Also produces a file in the project root called `translation-status.json`
      that details which files were fully translated and which were not

Bug Fixes:
- Fix a problem with custom projects not loading Android flavors properly
- Loctool was not properly processing subprojects found while walking the tree.
    - didn't put all the output to target dir, which meant it didn't go
      into the subproject's directories, but into dirs that were relative
      to the root project instead

Build 012
-------

Published as version 2.7.2

Bug Fixes:
* Backtracked to opencc 1.0.6 because the current version (1.1.1) does
not compile properly on ubuntu with node 12+
* Fixed the parsing and localization of text in table cells
* Fixed the parsing and localization of inline code that is the only part of a localizable
segment. Inline code is only translatable when it is part of a larger localizable piece of
text, not when it is by itself.

Build 011
-------

Published as version 2.7.1

Bug Fixes:
* Fixed a bug where xliff files are trying to be created when there was no extracted string.
* Fixed a bug where the xliff files (extracted + new files) were never generated, even when
localizeOnly is turned off
* Fixed a bug where self-closed tags like <br/> in markdown files were not handled properly,
causing exceptions that complained about syntax errors

Build 010
-------

Published as version 2.7.0

New Features:
* Added the -q or --quiet flag which only prints out banners, errors, and warnings
* Added the -s or --silent flag which never prints anything. Instead, it only sets the exit code.
  This is intended to be used in scripts where all the verbose output is not needed.
* Added the --localizeOnly flag which Generate a localization resource only. Do not create any other files at all after running loctool.
* Added support to handle multiple pseudo locales. If you want to use more than one pseudo locale, you have to put the locales in an array. Example:
  ```
  pseudoLocale: ["zxx-XX", "zxx-Hans-XX", "zxx-Hebr-XX"]
  ```
* Added `SourceContextResourceString` that is for strings in qml files. The hash key made with this, that it includes additionally the hash value of the source. That is a difference from ContextResourceString.

Bug Fixes:
* Fixed to include locale when creating cleanHashKey in ContextResourceString
* Updated dependencies to the latest packages and fixed the resulting unit test failures due to the opencc update

Build 009
-------

Published as version 2.6.0

New Features:
* Added support for localizing links and link references in github-flavored markdown files

By default, URLs are not localizable, as the majority are the same
in all languages. Sometimes, however you want to be able to give a
different URL for each locale. With this new features, you can turn
on link localization.

To localize a link in the text, put a localize-links directive around
it, which is an lint-style HTML comment. Example:

```markdown
There are
<!-- i18n-enable localize-links -->
[fifty](http://www.example.com/)
<!-- i18n-disable localize-links -->
of them for sale.
```

The text "fifty" is localized along with the rest of the sentence in the
string:

```
There are <c0>fifty</c0> of them for sale.
```

Note the c0 tags denote where the link goes. The directives, being HTML
comments, are not included in the string to translate.

The URL itself appears as a separate string to translate.

Localizing a link reference is very similar. Surround the reference
definition with a localize-links directive:

```markdown
There are [fifty][url] of them for sale.

<!-- i18n-enable localize-links -->
[url]: http://www.example.com/ "link title"
<!-- i18n-disable localize-links -->
```

The link title for link reference definitions is included as a separate string
to translate.

Build 008
-------

Published as version 2.5.0

New Features:
* Added support to handle multiple group tags in an xliff file
    * loctool considersed only one group tag in an xliff file. but now we can support a case to have multiple groups in a xliff file

Build 007
-------

Published as version 2.4.0

New Features:
* Added -v (--version) command-line parameter. Prints out the version from the package.json
  and then exits.
    * Updated the usage to print that as well
* The markdown code now adds a translator comment/note for inline code segments so that the
  translator can know what the text of the self-closing components are.

Bug Fixes:
* Fixed the link reference support in markdown to support both full and shortcut references
    * Shortcut references are converted to full so that the title can be translated without
      changing the label.
* Now when an exception happens, the loctool process will exit with an error code
  so that scripts that call the loctool can fail appropriately instead of just
  quietly and obliviously carrying on.

Bug Fixes:
* Now when an exception happens, the loctool process will exit with an error code
  so that scripts that call the loctool can fail appropriately instead of just
  quietly and obliviously carrying on.

Build 006
-------

Published as version 2.3.2

Bug Fixes:
* Fixed a problem parsing/localizing valueless HTML attributes in markdown files
* now ignores whitespace before html comments
* now uses remark-frontmatter to parse the headers
* now parses linkreferences properly when the text is not the default

Build 005
-------

Published as version 2.3.1

Bug Fixes:
* Fixed incorrect npm packaging in v2.3.0. Testing packages were included in
  the dependencies instead of the dev dependencies.

Build 004
-------

Published as version 2.3.0

New Features:
* Added support for XLIFF 2.0 files
    * Previously, loctool only supported XLIFF 1.2 format files
    * Optionally used for xliff output as well
    * Use the new `-2` option to specify xliff 2.0
    * When xliff 2.0 files are in use, "loctool split" can only split
    xliff files by language because xliff 2.0 does not support translation
    units with differing target locales.
    * Both xliff 1.2 and 2.0 files can be read in regardless of the
    version of the output file. The parser reads the version number from
    the "xliff" tag and parses its contents appropriately.
* Loctool will now read in all xliff files it finds in xliffsDir
    * With xliff 2.0, the loctool cannot load in only one project.xliff
    file because multiple target locales are not allowed to be in the
    same file.
    * As many files are you like may appear in the xliffsDir directory
    and they will be read in to memory as long as the file names end
    with a BCP-47 locale specifier and a ".xliff" extension.
    eg. (project1-de-DE.xliff, project2-de-DE.xliff, ko-KR.xliff, etc.)
* Added support for a new method projectClose() to the FileType plugins SPI
    * Called right before each project is closed
    * Allows the file type class to do any last-minute clean-up or
      generate any final files

Bug Fixes:

* Fix a few bugs related to figuring out which file types are resource file types in custom projects
* Many file types were not producing any translated output for the generated pseudo locales.
  Now they do!
* If you had loctool install in the global node modules, and your loctool plugin installed in your
  project's node modules, it was not finding and loading that plugin. Now loctool will check the
  loctool directory, the current project, and the ../plugins directory for plugins.

Build 003
-------

Published as version 2.2.0

New Features:

* Added support for link references in markdown
    * link references do not create a break in the translatable
      string any more, and are hidden from the translators using
      xml-like tags

Bug Fixes:

* Markdown fixes
    * filter out strings that only contain URLs
    * filter out strings that do not contain localizable text (only whitespace and/or punctuation)
    * make sure that the text on the lines after the last bullet in a list does not get added to that last list item
    * Fixed a crash that happens when there are more components in the translation than the source string. Now it
      just gives a warning and proceeds as if that extra component were not there.
* Fix dependency on ilib-tree-node
* Added test/testResourceFactory.js to verify the ResourceFactory code
* Added the ability to keep reference links and inline code snippets with the string, even when
  they are at the beginning or end of the string. They are not optimized out. Other components that
  appear at the beginning or end of the string are still optimized out as normal.


Build 002
-------

Published as version 2.1.0

New Features:

* Added support for plugins
    * Allows loctool to load arbitary npm modules as plugins which handle
      particular types of files
    * Plugins are loaded though the "CustomProject" class which is specified
      in the project.json file with the type "custom"
    * Loctool does not need changes to handle new file types
    * Anyone can now write a plugin for their own unique custom file type
      by creating two classes that adhere to a particular interface
    * Many of the existing built-in file types have been externalized to
      their own github repos and published as separate npm modules with
      the prefix "ilib-loctool-"
        * Custom projects can use these directly
        * Eventually, the built-in file type modules will go away, and
          all projects will use plugins exclusively


Build 001
-------
Published as version 2.0.0

New Features:

* Added support for github-flavored markdown files
    * Text and some types of controls are extracted as translation units
    * Recomposes translations and markdwon together into translated markdown files
* HTML and Markdown now use coded text
    * Codes are in the form of XML-like tags in the source string.
      Example: "The files are <c0>not removed</c0> when you delete the index."
    * The codes represent html tags or other controls that do not affect the meaning
      of the source string or the translation.
    * The tags or controls may change in
      the source file without causing a new translatable string to appear, allowing
      the engineer to change non-text things without worrying about triggering a new
      translation.
    * The codes in the source file are used to recreate the target file
      at localization time by substituting them in to the translated string.
    * Coded text is a breaking change! Your translation xliffs from 1.X of loctool
      are not compatible because they include the HTML tags directly in the source
      and target. You will need to create new translation xliffs.

Bug Fixes:

* Strings inside of HTML &lt;code&gt; tags are now ignored.
* Most resources now appear in the xliff files in the order that they appear in
  the source files, allowing for easier debugging and for alignment of strings
  in files written in different languages.
* The "*-extracted.xliff" file includes all duplicates of a resource now to help
  with alignment.
* Fixed some duplicate entries in the British and NZ spellings files

Release Notes for Version 1
============================

Build 006
-------
Published as version 1.1.2

Bug Fixes:
* HTML and HTML template files were not localized properly when there is a &lt;!DOCTYPE&gt; tag in the text.
The output included the attributes of the tag, but not the tag itself. This is corrected now.

Build 003
-------
Published as version 1.1.1

Bug Fixes:
* the package.json was screwed up so it didn't publish the code. This is fixed now. No code
  differences from 1.1.0

Build 002
-------
Published as version 1.1.0

New Features:

* Added support for plain HTML files
    * Text and certain tags are extracted as translation units
    * Recomposes translations and HTML together into translated HTML
* Added support for specifying the xliffsDir in the project.json
    * Directory where xliff files are read from
    * Can now be specified in the project.json under settings.xliffsDir
    * Can still be specified on the command-line with `-x dir` as before
    * Default is root dir of the project, as it was before
* Added support for the xliffsOut setting
    * Directory where xliff files are written
    * Can be specified in the project json under settings.xliffsOut
    * Can be specified on the command-line with `-z dir`
    * Default is root dir of the project, as it was before

Bug Fixes:

* Xliff merging was not working correctly due to mishandling of command-line parameters. Fixed now.
* Fixed a broken unit test

Build 001
-------
Published as version 1.0.0 on npm

New Features:
* Open-sourced from HealthTap private repo

