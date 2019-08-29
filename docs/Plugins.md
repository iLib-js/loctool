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
languages and platforms such as Java or C++. With the right libraries,
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
order listed above. For specifics, see below.

## Operation of a File Class

A file class is responsible for the following things:

* Extract and return the localizable strings from the file
* Write out a modified copy of the source file if changes were
made automatically. For example, some source files can be automatically
internationalized, and then written back out again. The engineer
is responsible for checking these modified source files back in
to the source control system.
* For static files or files that do not load strings from resource
files, the file class can localize the source file in memory and
then write out one copy of the file for each target locale.
* Return the path to the localized file for a particular locale

A method should exist for each of these, which are called in the
order listed above. If any of the operations are not applicable,
a stub function still needs to exist and may do nothing.

## The Service Provider Interface

### File Class

Each implementation of a file class must adhere to the following
interface:

```javascript
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
     * @param {String} locale the locale spec for the target locale
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

Each implementation of a filetype class must adhere to the following interface:

```
interface FileType {
    /**
     * Construct a new instance of this filetype subclass to represent
     * a collection of files of this type. Instances of this class
     * should store the API for use later to access things inside of
     * the loctool.
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
     * Return the file name extensions that correspond to this file
     * type. The extensions should be returned as an array of strings
     * that include the dot or other separator. The extensions array
     * is used to do a rough filter of all the files, and the
     * handles() method is called for each file to verify whether
     * or not that particular file is handled.
     *
     * @example Extensions for Java files:
     *
     * <pre>
     *     getExtensions() {
     *         return [".java", ".jav"];
     *     }
     * </pre>
     *
     * @returns {Array.<string>} an array of strings that give the
     * file name extensions of the files that this file type handles
     */
    getExtensions() {}

    /**
     * Return a unique name for this type of plugin that can be
     * displayed to a user.
     *
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
     * goes along with this filetype class.
     * @param {string} path path to the file to represent
     * @returns {File} a File class instance for the given path
    newFile(path) {}

    /**
     * Return a unique string that can be used to identify strings
     * that come from this type of file. This is used in XLIFF files
     * and a few other places to identify the file type. The value
     * must be one of the strings from the XLIFF specification
     * at [http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html#datatype]
     * or a custom string that starts with "x-".
     *
     * @returns {string} a unique string to identify strings from
     * this type of file
     */
    getDataType() {}

    /**
     * Return a hash that maps the class of a resource to a specific
     * resource type. The properties of the hash are the classes "string",
     * "array", and "plural". The values are one of the resource types
     * given below in the discussion about resources. If any of the
     * properties are left out, the default is assumed. The default for
     * "string" is "string", for "array" is "array", and for "plural" it
     * is "plural". If the return value is undefined, all of the classes
     * will use the default types.
     *
     * @example Return value for an Android string which defines strings as
     * being of the context string type, and arrays and plurals are
     * of the default type:
     * <pre>
     * {
     *     "string": "contextString"
     * }
     * </pre>
     * @returns {Object|undefined} a object which maps the resource class
     * name to the resource type
     */
    getDataTypes() {}

    /**
     * Return the translation set containing all of the extracted
     * resources for all instances of this type of file. This includes
     * all new strings and all existing strings. If it was extracted
     * from a source file, it should be returned here.
     *
     * @returns {TranslationSet} the set containing all of the
     * extracted resources
     */
    getExtracted() {}

    /**
     * Add the contents of the given translation set to the extracted resources
     * for this file type.
     *
     * @param {TranslationSet} set set of resources to add to the current set
     */
    addSet(set) {}

    /**
     * Return the translation set containing all of the new
     * resources for all instances of this type of file.
     *
     * @returns {TranslationSet} the set containing all of the
     * new resources
     */
    getNew() {}

    /**
    * Return the translation set containing all of the pseudo
    * localized resources for all instances of this type of file.
    *
    * @returns {TranslationSet} the set containing all of the
    * pseudo localized resources
    */
    getPseudo() {}
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
     * The options are passed to the resource subclass
     * constructor. The primary option is the "resType".
     * The possible resType values are:
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
     * Other properties that can be passed in the options are:
     *
     * <ul>
     * <li>project - name of the project containing this resource
     * <li>key - the unique key of this resource
     * <li>sourceLocale - the source locale of this resource
     * <li>source - the source string for the "string", "iosString"
     *   and "contextString" resTypes
     * <li>sourceArray - the source array for the "array" resType
     * <li>sourcePlurals - an object mapping CLDR plural categories
     *   to source strings for the "plural" resType
     * <li>autoKey - boolean value which is true when the key is
     *   generated automatically from the source rather than given
     *   explicitly.
     * <li>pathName - path to the file where this resource was extracted
     * <li>state - state of the current resource. Almost always,
     *   plugins should report that the state is "new".
     * <li>comment - translator's comment
     * <li>datatype - data type used in xliff files to identify
     *   strings as having been extracted from this type of file
     * <li>index - numerical index that gives the order of the strings
     *   in the source file.
     * </ul>
     *
     * @param {Object} options the options as given above
     * @returns {Resource} an instance of a resource subclass
     */
    newResource(options) {}

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
    newTranslationSet(sourceLocale) {}

    /**
     * Object containing some utility functions and data that the
     * plugin may need.
     */
    utils: utils,

    /**
     * Return true if the given locale spec is for a pseudo-locale.
     * A pseudo-locale is one where an algorithm is applied
     * to the source text to create a pseudo-localization. This is
     * useful for localization enablement testing or font testing.
     *
     * @param {string} locale the locale spec for the locale to test
     * @returns {boolean} true if the given locale is a pseudo-locale
     * and false otherwise.
     */
    isPseudoLocale(locale) {}

    /**
     * Return a pseudo-translation resource bundle. This kind of
     * resource bundle applies a function over a source string to
     * produce a translated string. The resulting translated string
     * may be used for i18n testing or as an actual translation.
     *
     * @param {string} locale the target locale of the pseudo bundle
     * @param {FileType} filetype the file type of the file where
     *   the source strings are extracted from
     * @param {Project} project the project where the source
     *   strings are extracted from
     * @returns {ResBundle} a resource bundle that automatically
     *   translates source strings
     */
    getPseudoBundle(locale, filetype, project) {}

    /**
     * Return a FileType instance that represents the type of file
     * that is used as a resource file for the given source file
     * type. For example, Java source files use the properties files
     * as resource file types.
     * @param {string} type the type of source file
     * @returns {FileType} a file type instance that represents the
     *   resource file type for the given source file type
     */
    getResourceFileType(type) {}
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

#### Resource

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
     * Return the a hash key that uniquely identifies this resource. The hash
     * key is used to look up a resource in a translation set.
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
     * Return the cleaned hash key that uniquely identifies this resource.
     * A cleaned hash key is meant to increase matches between source
     * strings that only differ in ways that do not affect the translation.
     * For example, if string #1 has 4 spaces at the beginning, and string
     * #2 has 12 spaces at the beginning, but they both have the exact
     * same text after that, there is no good reason that they should not
     * share the same translation. The spaces do not really affect the
     * traslation of that text. A cleaned hash key can be cleaned in
     * a variety of ways, and the exact methods used are unique to the
     * type of resource.
     *
     *  @return {String} a unique hash key for this resource, but cleaned
     */
    cleanHashKey() {}

    /**
     * Return a cleaned hash key that uniquely identifies the translation of
     * this resource to the given locale. See above for a definition of a
     * cleaned hash key.
     *
     * @param {String} locale a locale spec of the desired translation
     * @return {String} a unique hash key for this resource's string
     */
    cleanHashKeyForTranslation(locale) {}

    /**
     */
    isInstance(resource) {}

    addInstance(resource) {}

    getInstances() {}
}
```

#### ResourceString

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

#### ResourceArray

Additionally, an array resource has these methods:

```
class ResourceArray extends Resource {
    /**
     * Return the array of source strings for this resource.
     *
     * @returns {Array.<String>} the array of strings that are
     * the source of this resource
     */
    getSourceArray() {}

    /**
     * Set the array of source strings for this resource.
     *
     * @param {Array.<String>} arr the array of strings to set
     * as the source array
     */
    setSourceArray(arr) {}

    /**
     * Return the array of target strings for this resource. The
     * target string at array position N corresponds to the source
     * string at position N.
     *
     * @returns {Array.<String>} the array of strings that are
     * the target value of this resource
     */
    getTargetArray() {}

    /**
     * Set the array of target strings for this resource.
     *
     * @param {Array.<String>} arr the array of strings to set
     * as the target array
     */
    setTargetArray(arr) {}

    /**
     * Return the source string with the given index into the array.
     *
     * @param {number} i The index of the string being sought
     * @returns {String|undefined} the value of the string at index i or
     * undefined if i is outside the bounds of the array
     */
    getSource(i) {}

    /**
     * Return the target string with the given index into the array.
     *
     * @param {number} i The index of the string being sought
     * @returns {String|undefined} the value of the string at index i or
     * undefined if i is outside the bounds of the array
     */
    getTarget(i) {}

    /**
     * Add a string to the source array at index i.
     *
     * @param {number} i the index at which to add the string
     * @param {String} str the string to add
     */
    addSource(i, str) {}

    /**
     * Add a string to the target array at index i.
     *
     * @param {number} i the index at which to add the string
     * @param {String} str the string to add
     */
    addTarget(i, str) {}

    /**
     * Return the length of the array of strings in this resource.
     *
     * @returns {number} the length of the array of strings in this
     * resource
     */
    size() {}
}
```

#### ResourcePlural

Additionally, a plural resource has these methods:

```
class ResourcePlural extends Resource {
    /**
     * Return the source plurals hash of this plurals resource.
     * The hash maps the plural category to the source string
     * for that category. The plural categories are defined by the
     * Unicode CLDR specification: http://cldr.unicode.org/index/cldr-spec/plural-rules
     *
     * The properties of the strings hash can be any of these classes
     * supported by CLDR:
     *
     * <ul>
     * <li>zero
     * <li>one
     * <li>two
     * <li>few
     * <li>many
     * <li>other
     * </ul>
     *
     * @returns {Object} the source hash
     */
    getSourcePlurals() {}

    /**
     * Return the target plurals hash of this plurals resource.
     * The hash maps the plural category to the translation of
     * the source string for that category. Note that the source
     * and target hashes may contain different categories due
     * to the differences in plural rules between the source and
     * target languages.
     *
     * @returns {Object} the target hash
     */
    getTargetPlurals() {}

    /**
     * Set the source plurals hash of this plurals resource.
     *
     * @param {Object} plurals the source hash
     */
    setSourcePlurals(plurals) {}

    /**
     * Set the target plurals hash of this plurals resource.
     *
     * @param {Object} plurals the target hash
     */
    setTargetPlurals(plurals) {}

    /**
     * Return the source string of the given plural category.
     *
     * @param {string} pluralCategory the category of the
     * source string being sought
     * @returns {String} the source string for the given
     * plural category
     */
    getSource(pluralCategory) {}

    /**
     * Return the target string of the given plural category.
     *
     * @param {string} pluralCategory the category of the
     * target string being sought
     * @returns {String} the target string for the given
     * plural class
     */
    getTarget(pluralCategory) {}

    /**
     * Return the number of plural categories in
     * the source of this resource.
     *
     * @returns {number} the number of source categories
     */
    getClasses() {}

    /**
     * Add a string with the given plural category to the source of
     * this plural resource.
     *
     * @param {String} pluralCategory the CLDR category of this string
     * @param {String} str the source string to add for the category
     */
    addSource(pluralCategory, str) {}

    /**
     * Add a string with the given plural category to the target of
     * this plural resource.
     *
     * @param {String} pluralCategory the CLDR category of this string
     * @param {String} str the target string to add for the category
     */
    addTarget(pluralCategory, str) {}

    /**
     * Return the number of categories in this resource. If
     * there are translations in this resource, the number of target categories
     * is returned. If there are only source strings in this resource,
     * the number of source categories is returned.
     *
     * @returns {number} the number of categories in this
     * resource
     */
    size() {}
}
```

#### TranslationSet

A translation set is
a set of resources which contain meta-data about their
strings and the source and translated strings themselves.
A translation set may contain the same source phrase
multiple times if the meta-data is different because the
same phrase may be used in different ways in different
ontexts of the application and thus may need a different
translation.<p>

This is differentiated from a translation memory where
there are translations of source strings or phrases
without meta-data and possibly broken into shorter units.
A translation memory may also have multiple translations
for a particular source phrase, but which one should be
used for a particular source string in the application
is unclear because there is no meta-data associating
each translation with the source string.<p>

The purpose of a translation memory is to aid a translator
in reusing translations that they have previous done
for consistency and speed of translation. The purpose
of a translation set is to denote which translations
are used for each source string in the application in
its idiosyncratic context.<p>

The loctool uses translation sets to collect source strings
in the application and to represent translations of them.

```
class TranslationSet {
    /**
     * Get a resource by its hashkey.
     *
     * @param {String} hashkey The unique hashkey of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the hashkey, or
     * undefined if there is no resource with that key
     */
    get(hashkey) {}

    /**
     * Get a resource by its clean string hashkey.
     *
     * @param {String} hashkey The unique hashkey of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the hashkey, or undefined if there is no
     * resource with that key
     */
    getClean(hashkey) {}

    /**
     * Get a resource by its source string and context. The source string must be written
     * in the language and script of the source locale. For array types, the
     * source string
     * must be one of the values in the string array. For plural types, it
     * must be one of the values of the quantities.<p>
     *
     * If the context is undefined,
     * this method will find the base generic resource with no context.
     *
     * @param {String} source The source string to look up
     * @param {String|undefined} context The optional context of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the source string, or
     * undefined if there is no resource with that source
     */
    getBySource(source, context) {}

    /**
     * Return all resources in this set.
     *
     * @returns {Array.<Resource>} an array of resources in this set,
     * possibly empty
     */
    getAll() {}

    /**
     * Add a resource to this set. If this resource has the same key
     * as an existing resource, but a different locale, then this
     * resource is added a translation instead.
     *
     * @param {Resource} resource a resource to add to this set
     */
    add(resource) {}

    /**
     * Add every resource in the given array to this set.
     * @param {Array.<Resource>} resources an array of resources to add
     * to this set
     */
    addAll(resources) {}

    /**
     * Add every resource in the given translation set to this set,
     * merging the results together.
     *
     * @param {TranslationSet} set an set of resources to add
     * to this set
     */
    addSet(set) {}

    /**
     * Return the number of unique resources in this set.
     * @param {String|undefined} context The optional context of the resource being counted.
     * @param {String|undefined} locale the locale of the resources being counted
     * @returns {number} the number of unique resources in this set
     */
    size(context, locale) {}

    /**
     * Reset the dirty flag to false, meaning the set is clean. This will
     * allow callers to tell if any more resources were added after
     * this call was made because adding those resources will set
     * the dirty flag to true again.
     */
    setClean() {}

    /**
     * Return whether or not this set is dirty. The dirty flag is set
     * whenever a new resource was added to or removed from the set
     * after it was created or since the last time the setClean method
     * was called.
     * @return {boolean} true if the set is dirty, false otherwise
     */
    isDirty() {}

    /**
     * Remove a resource from the set. The resource must have at
     * least enough fields specified to uniquely identify the
     * resource to remove. These are: project, context, locale,
     * resType, and reskey.
     *
     * @param {Resource} resource The resource to remove
     * @returns {boolean} true if the resource was removed successfully
     * and false otherwise
     */
    remove(resource) {}

    /**
     * Get a resource by the given criteria.
     * @param {Object} criteria the filter criteria to select the resources to return
     * @returns {Array.<Resource>|undefined} the array of Resources, or undefined if the
     * retrieval did not find any resources that match or there was some error
     */
    getBy(options) {}

    /**
     * Return an array of all the project names in the database.
     *
     * @returns {Array.<String>|undefined} the array of project names
     * or undefined if there are no projects in the set
     */
    getProjects() {}

    /**
     * Return an array of all the contexts within the given project
     * in the set. The root context is just the empty string.
     * The root context is where all strings will go if they are
     * not given an explicit context in the resource file or code.
     *
     * @param {String|undefined} project the project that contains
     * the contexts or undefined to mean all projects
     * @returns {Array.<String>|undefined} the array of context names
     * or undefined if there are no contexts in the set
     */
    getContexts(project) {}

    /**
     * Return an array of all the locales available within the given
     * project and context in the set. The root context is just
     * the empty string. The locales are returned as BCP-47 locale
     * specs.
     *
     * @param {String|undefined} project the project that contains
     * the contexts or undefined to mean all projects
     * @param {String|undefined} context the context that contains
     * the locales or undefined to mean all locales.
     * Use the empty string "" for the default/root context.
     * @returns {Array.<String>|undefined} the array of context names
     * or undefined if there are no contexts in the set
     */
    getLocales(project, context) {}

    /**
     * Clear all resources from this set.
     */
    clear() {}

    /**
     * Return a new translation set that contains the differences
     * between the current set and the other set. Resources are
     * added to the difference set if they exist in the other
     * set but not the current one, or if they exist in both
     * sets, but contain different fields.
     *
     * @param {TranslationSet} other the other set to diff against
     * @returns {TranslationSet} the differences between the other
     * set and this one
     */
    diff(other) {}
}
```

### The Project Class

Projects are a container for a particular project on disk. They
are configured by putting a project.json file in the root of
project on disk. Projects contain various translation sets, as
well as settings and options.

Projects give the settings and options that are needed by many
plugins. Options come from the "options" property in the
project.json file, which contain some standard options and some
custom ones. If you write a plugin, you can configure that
plugin using options in the project.json file. Settings come
from the command-line or the environment variables
of the loctool. The settings do not change for a run of the
loctool, but options can change with every project, as every
project has its own project.json file.

The project is provided to the file type constructor of your
plugin, and should be passed to file instances as well if they
need it.

The Project class has the following methods and properties
that a plugin might need:

```
class Project {
    /**
     * Return the translation set for this project.
     *
     * @returns {TranslationSet} the translation set
     */
    getTranslationSet() {}

    /**
     * Return the unique id of this project. Often this is the
     * name of the repository in source control.
     *
     * @returns {String} the unique id of this project
     */
    getProjectId() {}

    /**
     * Return the root directory of this project.
     *
     * @returns {String} the path to the root dir of this project
     */
    getRoot() {}

    /**
     * Add the given path name the list of files in this project.
     *
     * @returns {String} pathName the path to add to the project
     */
    addPath(pathName) {}

    /**
     * Return an array of resource directories for the file type.
     * If there are no resource directories for the file type,
     * then this returns an empty array.
     *
     * @returns {Array.<String>} an array of resource directories
     * for the file type.
     */
    getResourceDirs(type) {}

    /**
     * Return true if the given path is included in the list of
     * resource directories for the given type. This method returns
     * true for any path to a directory or file within any resource
     * directory or any of its subdirectories.
     *
     * @param {String} type the type of resources being tested
     * @param {String} pathName the directory name to test
     * @returns {Boolean} true if the path is within one of
     * the resource directories, and false otherwise
     */
    isResourcePath(type, pathName) {}

    /**
     * Return true if the given locale is the source locale of this
     * project, or any of the flavors thereof.
     * @param {String} locale the locale spec to test
     * @returns {boolean} true if the given locale is the source
     * locale of this project or any of its flavors, and false
     * otherwise.
     */
    isSourceLocale(locale) {}

    /**
     * Get the source locale for this project.
     *
     * @returns {string} the locale spec for the source locale of
     * this project
     */
    getSourceLocale() {}

    /**
     * Get the pseudo-localization locale for this project.
     *
     * @returns {string} the locale spec for the pseudo locale of
     * this project
     */
    getPseudoLocale() {}

    /**
     * Return the resource file type for this project.
     * The resource file type will be able to read in and
     * write out resource files and other file types put
     * their resources here. The type parameter tells
     * which type of resources are being sought. A project
     * for example may contain separate resource files for
     * javascript and ruby.
     *
     * @param {String} type the type of resource being sought
     * @returns {FileType} the resource file type for this
     * project, which may be an instance of another file
     * type plugin
     */
    getResourceFileType(type) {}
}
```
