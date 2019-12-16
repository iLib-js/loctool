# How to Write a Loctool 3 Plugin

The plugin framework for loctool was completely rewritten from
version 2 to version 3. Version 2 plugins can still be used
with version 3, but they are deprecated. In future versions of
the loctool, they will no longer be supported. 

The loctool version 3 plugin framework is rewritten in the
style of webpack plugins, though with differences, in that
the loctool generates a sequence of events, and the plugins
are called when they register to listen for those events.
Contrast this to version 2 plugins, which are implementations
of particular classes. Underneath, version 3 plugins do
the same thing, but the opportunities for version 3 plugins
to modify the behaviour of the loctool are far greater.

## Events

Loctool plugins now must register to be called back when
particular events occur. If no callback is registered, the
loctool will not call any code, and will move on to the
next event.

The main plugin code must return a function that is called
immediately after the plugin is loaded. This function should
call the loctool API to register callbacks for the events it is
interested in.

Events get called at particular times in the life cycle of
the project, files, and file types. The callbacks are provided
an API to perform various actions within loctool, such as
creating new resources. Callbacks need to return a value
dependent on the type of the event. 

## Event Types

The following is the list of event types that a plugin may
register for.

### Project

- open
- config
- close

### File

- open
- extract
- localize
- getpath
- write
- close

### FileType

- open
- write
- newfile
- getdatatype
- getresourcetypes
- getextensions
- close