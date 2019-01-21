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
