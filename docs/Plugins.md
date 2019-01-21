# How to Write a Loctool Plugin

A loctool plugin is relatively simple: one class that handles a
particular type of file (a "file" class), and another class
that handles a collection of such files (a "file type" class).
The filetype class is the main entry point for the
plugin, as it is a factory for file instances.

The two classes must adhere to an SPI documented below, and can
take advantage of a number of loctool classes provided to the
constructor of the filetype class to perform its tasks.

## Modes of Operation of a FileType Class

Localizable strings in a file can be handled in one of a few general
ways:

1. The strings are extracted from multiple source files, localized,
and then written together into a single or multiple resource files.
This is the default method used by various programming languages
such as Javascript, Swift, or Objective-C.

1. Strings are manually extracted by engineers into a source resource
file. The strings are localized, then written out again to one
or more other resource files. In many software products, the source
resource file is written in English for the US, but it could easily
be in any language if the engineers are more comfortable with that
language. This is the default method used by programming
languages and platforms suchas Java or C++. With the right libraries,
the strings could appear in the source code as above, and be
automatically extracted. This frees the engineers from the hassle
of manually extracting the strings, which usually results in better
compliance with i18n policies.

1. The strings are extracted from a single source file, localized,
and a copy of that source file is written out with localized strings
in it. This the default method used for static or for deeply structured
files such as HTML or JST. Static files cannot dynamically load strings
from a resource file, and thus are forced to be localized this
way.

A loctool plugin may operate in any of these ways.

## Operation of a FileType Class

A filetype class is responsible for the following things:

* Providing information to the loctool as to which files are members
of the file type
* Instantiating a new instance of a file class for a particular file
* Writing out the aggregated resources for a type of file to the
appropriate resource file

A method should exist for each of these, which are called in the
order listed above.

## Operation of a File Class

A file class is responsible for the following things:

* Extract and return the localizable strings from the file
* Write out a modified copy of the source file if changes were
made automatically
* Localize a source file in memory and then write out one copy
of the source file for each target locale, this is a type of file that
writes localized copies
* Return the path to the localized file for a particular locale

A method should exist for each of these, which are called in the
order listed above.

## The Service Provider Interface

### File Class

```
interface File {
    /**
     * Construct a new instance of this file class for the file
     * at the given pathName.
     *
     * @param {string} pathName path to the file to respresent
     * @param {API} API a set of calls that that the plugin can use
     * to get things done.
     */
    constructor(pathName, API) {}

    /**
     * Extract all the localizable strings from the file and add
     * them to the project's translation set. This method should
     * open the file, read its contents, parse it, and add each
     * string it finds to the project's traslation set, which can
     * be retrieved from the API passed to the constructor.
     */
    extract() {}

    /**
     * Return the set of string resources found in the current file.
     *
     * @returns {TranslationSet} The set of resources found in the
     * current file.
     */
    getTranslationSet(){}

    /**
     * If the source file was modified in any way during the
     * extraction, this method allows the plugin to write out the
     * source file back to disk to the appropriate file.
     */
    write() {}

    /**
     * Return the location on disk where the version of this file,
     * localized for the given locale, should be written.
     *
     * @param {String] locale the locale spec for the target locale
     * @returns {String} the localized path name
     */
    getLocalizedPath(locale) {}

    /**
     * Localize the contents of this file and write out the
     * localized file to a different file path.
     *
     * @param {TranslationSet} translations the current set of
     * translations
     * @param {Array.<String>} locales array of locales to translate to
     */
    localize(translations, locales) {}
}
```

### FileType Class

```
interface FileType {
    /**
     * Construct a new instance of this filetype class to represent
     * a collection of files of this type.
     *
     * @param {Project} project an instance of a project in which this
     * filetype exists
     * @param {API} API a set of calls that that the plugin can use
     * to get things done
     */
    constructor(project, API) {}

    /**
     * Return true if the given path is handled by the current file type.
     *
     * @param {String} pathName path to the file being queried
     * @returns {boolean} true if the path is handled by this type,
     * or false otherwise
     */
    handles(pathName) {}

    /**
     * Return a unique name for this type of plugin.
     * @returns {string} a unique name for this type of plugin
     */
    name() {}

    /**
    * Write out the aggregated resources for this file type. In
    * some cases, the string are written out to a common resource
    * file, and in other cases, to a type-specific resource file.
    * In yet other cases, nothing is written out, as the each of
    * the files themselves are localized individually, so there
    * are no aggregated strings.
    */
    write() {}

    /**
     * Return a new instance of a file class for the given path.
     * This method acts as a factory for the file class that
     goes along with this filetype class.
     * @param {string} path path to the file to represent
     * @returns {File} a File class instance for the given path
    newFile(path) {}

    /**
    * Register the data types and resource class with the resource
    * factory so that it knows which class
    * to use when deserializing instances of resource entities.
    * @returns {Object} a object which gives the class name for
    * each of the categories of strings
    */
    registerDataTypes() {}
}
```

### API Class

An instance of this is sent to the constructor of the FileType
class. The FileType.newFile method should send it to instances
of the File class as well.

```
class API {
    /**
     Return a new instance of a resource of the given type.
     The possible types are:

     <ul>
     <li>string - the resource is a simple string</li>
     <li>array - the resource is an array of strings</li>
     <li>plural - the resource is a string with plural forms</li>
     <li>contextString - the resource is a simple string with a
     context. Strings in the different contexts can have the same
     content, but are differentiated by their context.</li>
     </ul>

    @param {string} type the type of resource being sought
     */
    resourceFactory(type) {}

    newTranslationSet: function(sourceLocale) {
        return new TranslationSet(sourceLocale);
    },
    utils: utils,
    newFileType: function(project) {
        return new FileType(project);
    }
}
```