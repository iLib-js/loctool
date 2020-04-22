Release Notes for Version 2
============================

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

