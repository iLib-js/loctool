Release Notes for Version 2
============================

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

