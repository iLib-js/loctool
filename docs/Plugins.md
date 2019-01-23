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
     * Return a new instance of a resource of the given type.
     * The possible types are:
     *
     * <ul>
     * <li>string - the resource is a simple string</li>
     * <li>array - the resource is an array of strings</li>
     * <li>plural - the resource is a string with plural forms</li>
     * <li>contextString - the resource is a simple string with a
     * context. Strings in the different contexts may have the same
     * content, but are differentiated by their context.</li>
     * <li>iosString - the resource is a string from an iOS file.
     * These strings are handled slightly differently in that
     * loctool keeps track of the the source file where the string
     * came from originally so that it can write the translations
     * to appropriate .strings file.</li>
     * </ul>
     *
     * @param {string} type the type of resource being sought
     * @returns {Resource} an instance of a resource subclass
     */
    resourceFactory(type) {}

    /**
     * Create a new translation set. A translation set is
     * a set of resources which contain meta-data about their
     * strings and the source and translated strings themselves.
     * A translation set may contain the same source phrase
     * multiple times if the meta-data is different because the
     * same phrase may be used in different ways in different
     * contexts of the application and thus may need a different
     * translation.<p>
     *
     * This is differentiated from a translation memory where
     * there are translations of source strings or phrases
     * without meta-data and possibly broken into shorter units.
     * A translation memory may also have multiple translations
     * for a particular source phrase, but which one should be
     * used for a particular source string in the application
     * is unclear because there is no meta-data associating
     * each translation with the source string.<p>
     *
     * The purpose of a translation memory is to aid a translator
     * in reusing translations that they have previous done
     * for consistency and speed of translation. The purpose
     * of a translation set is to denote which translations
     * are used for each source string in the application in
     * its idiosyncratic context.<p>
     *
     * The loctool uses translation sets to collect source strings
     * in the application and to represent translations of them.
     *
     * @param {string|undefined} sourceLocale the locale spec of the
     * source locale. If not specified, the project's source
     * locale is used.
     * @returns {TranslationSet} a new translation set instance
     */
    newTranslationSet: function(sourceLocale) {
        return new TranslationSet(sourceLocale);
    },

    /**
     * Utility functions and data that the plugin may need.
     */
    utils: utils
}
```

### Resources

A resource is a source string (or strings) extracted from a
source file. It contains meta-data about where that string
came from and its context within the application, as well
as the source string and optionally the translation. The loctool
uses the meta-data later when constructing a resource file
or when reconstructing a translated copy of the source file.

The most important meta-data is the key. This identifies
the string and differentiates it from other strings. Two
resources may have the same source string or target
string, but only strings that are related to each other
may have the same key. For example, two strings may have
the same source string and same key but different contexts.
In this example, the strings are related to each other
but are used in different ways, so their translations
may be different.

What is unique for each resource is a combination of its
project name, key, source locale,
and target locale. For some types of resources, the context
or the path to the source file can also form part of the
unique key.

There are multiple types of resources:

* string - This is a single string extracted from the source
file
* array - This is an array of related strings extracted
from the source file. This is often used as a list. An
example might be an array of all of the names of
states or provinces in a country.
* plural - This is a single string that has multiple
forms depending on a number of items. In English, we
only have singular and plural, but in other languages,
there are multiple types of plurals. For example, in
Russian, numbers ending in 2 to 4 are the "few" plural,
and numbers ending in 5 to 9 are the "many" plural.
In English pluralizing most nouns is easy -- you just add
an "s" or "es" (with a few exceptions). In Russian, you
have to know the number in order to add the "few" suffix
or the "many" suffix as appropriate. The plural resource
stores the source string and its variations for each
plural category. The categories required are language
dependent, and the translator is typically responsible
for modifying the set of categories as appropriate
for their target language.
* contextString - This is like a single string extracted
from the source code, but with the addition of a
context. For example, in Android apps, you may have
various "flavors" of an application. An app producer
may decide to use the same app, but white-label is so
that each of their clients see the app with their
own logo and colors, and their client's customers
will think the app comes from the client. The flavors
system in Android allows the same string to
have source strings for the different flavors. For
example, if the generic app has the key "companyName"
set to "MyCompany", each of the flavors could have
their "companyName" source string set to "Client1",
"Client2", etc. as appropriate for the flavor. In this
case, the strings are related in that they are used
in the same place in the app's UI, but the source
string is different and therefore the translation
of the source string may be different as well.
* iosString - an iOS string is also a single string
extracted from the source code, and much like a
context string, it also has a context. The difference
is that the context is the path name to the source
code file where the string was extracted from. The
path name is used to determine which .strings file
the translation should go into when the translated
.strings files are being generated.

The API for the superclass of all resources is as
follows:

```
class Resource {
    /**
    * @class Represents a resource from a resource file or
    * extracted from the code. The props may contain any
    * of the following properties:
    *
    * <ul>
    * <li>project {String} - the project that this resource is in
    * <li><i>context</i> {String} - The context for this resource,
    * such as "landscape mode", or "7200dp", which differentiates it
    * from the base resource that has no special context. The default
    * if this property is not specified is undefined, meaning no
    * context.
    * <li>sourceLocale {String} - the locale of the source resource.
    * <li>targetLocale {String} - the locale of the target resource.
    * <li>key {String} - the unique key of this string, which should include the context
    * of the string
    * <li>pathName {String} - pathName to the file where the string was extracted from
    * <li>autoKey {boolean} - true if the key was generated based on the source text
    * <li>state {String} - current state of the resource (ie. "new", "translated", or "accepted")
    * </ul>
    *
    * @constructor
    * @param {Object} props properties of the string, as defined above
    */
    constructor(props) {}

    /**
    * Return the project that this resource was found in.
    *
    * @returns {String} the project of this resource
    */
    getProject() {}

    /**
    * Return the unique key of this resource.
    *
    * @returns {String} the unique key of this resource
    */
    getKey() {}

    /**
    * Return the resource type of this resource. This is one of
    * string, array, or plural.
    *
    * @returns {String} the resource type of this resource
    */
    getType() {}

    /**
    * Return the data type of this resource.
    *
    * @returns {String} the data type of this resource
    */
    getDataType() {}

    /**
    * Return true if the key of this resource was automatically generated,
    * and false if it was an explicit key.
    *
    * @returns {boolean} true if the key of this string was auto generated,
    * false otherwise
    */
    getAutoKey() {}

    /**
    * Return the context of this resource, or undefined if there
    * is no context.
    * @returns {String|undefined} the context of this resource, or undefined if there
    * is no context.
    */
    getContext() {}

    /**
    * Return the source locale of this resource, or undefined if there
    * is no context or the locale is the same as the project's source locale.
    * @returns {String|undefined} the locale of this resource, or undefined if there
    * is no locale.
    */
    getSourceLocale() {}

    /**
    * Set the source locale of this resource.
    * @param {String} locale the source locale of this resource
    */
    setSourceLocale(locale) {}

    /**
    * Return the target locale of this resource, or undefined if the resource
    * is a source-only resource.
    * @returns {String|undefined} the locale of this resource, or undefined if there
    * is no locale.
    */
    getTargetLocale() {}

    /**
    * Set the target locale of this resource.
    * @param {String} locale the target locale of this resource
    */
    setTargetLocale(locale) {}

    /**
    * Return the state of this resource. This is a string that gives the
    * stage of life of this resource. Currently, it can be one of "new",
    * "translated", or "accepted".
    *
    * @returns {String} the state of this resource
    */
    getState() {}

    /**
    * Set the state of this resource. This is a string that gives the
    * stage of life of this resource. Currently, it can be one of "new",
    * "translated", or "accepted".
    *
    * @parma {String} state the state of this resource
    */
    setState(state) {}

    /**
    * Return the original path to the file from which this resource was
    * originally extracted.
    *
    * @returns {String} the path to the file containing this resource
    */
    getPath() {}

    /**
    * Return the translator's comment for this resource if there is
    * one, or undefined if not.
    *
    * @returns {String|undefined} the translator's comment for this resource
    * if the engineer put one in the code
    */
    getComment() {}

    /**
    * Set the translator's comment for this resource.
    *
    * @param {String|undefined} comment the translator's comment to set. Use
    * undefined to clear the comment
    */
    setComment(comment) {}

    /**
    * Return the localize flag of this resource.
    * This flag indicates whether we should look up a translation for this resource.
    * When false, we should simply substitute the source back
    *
    * @returns {Boolean} the localize flag of this resource
    */
    getLocalize() {}

    /**
    * Return the name of the flavor for this resource, or undefined
    * for the "main" or default flavor.
    *
    *  @return {String|undefined} the name of the flavor for this
    *  resource or undefined for the main or default flavor
    */
    getFlavor() {}

    /**
    * Return true if the other resource represents the same resource as
    * the current one. The project, context, locale, key, flavor, and type must
    * match. Other fields such as the pathName, state, and comment fields are
    * ignored as minor variations.
    *
    * @param {Resource} other another resource to test against the current one
    * @returns {boolean} true if these represent the same resource, false otherwise
    */
    same(other) {}

    /**
    * Return the number of strings in this resource.
    *
    * @returns {number} the number of strings in this resource
    */
    size() {}

    /**
    * Clone this resource and override the properties with the given ones.
    *
    * @params {Object|undefined} overrides optional properties to override in
    * the cloned object
    * @returns {ResourceArray} a clone of this resource
    */
    clone(overrides) {}

    /**
    * Return true if the other resource contains the exact same resource as
    * the current one. All fields must match.
    *
    * @param {Resource} other another resource to test against the current one
    * @returns {boolean} true if these represent the same resource, false otherwise
    */
    equals(other) {}

    /**
     * Return the a hash key that uniquely identifies this resource.
     *
     *  @return {String} a unique hash key for this resource
     */
    hashKey() {}

    /**
    * Return the a hash key that uniquely identifies the translation of
    * this resource to the given locale.
    *
    * @param {String} locale a locale spec of the desired translation
    * @return {String} a unique hash key for this resource
    */
    hashKeyForTranslation(locale) {}

    /**
    * Return the a hash key that uniquely identifies this resource, but cleaned
    *
    *  @return {String} a unique hash key for this resource, but cleaned
    */
    cleanHashKey() {}

    /**
    * Return the a hash key that uniquely identifies the translation of
    * this resource to the given locale, but cleaned
    *
    * @param {String} locale a locale spec of the desired translation
    * @return {String} a unique hash key for this resource's string
    */
    cleanHashKeyForTranslation(locale) {}
}
```

Additionally, a string resource has these methods:

```
class ResourceString extends Resource {
    /**
    * Return the source string written in the source
    * locale of this resource string.
    *
    * @returns {String} the source string
    */
    getSource() {}

    /**
    * Set the source string written in the source
    * locale of this resource string.
    *
    * @param {String} str the source string
    */
    setSource(str) {}

    /**
    * Return the string written in the target locale.
    *
    * @returns {String} the source string
    */
    getTarget() {}

    /**
    * Set the target string of this resource.
    *
    * @param {String} str the target string
    */
    setTarget(str) {}
}
```
