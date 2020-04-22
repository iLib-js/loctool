/*
 * ResourceFactory.js - class that creates the right type of resource subclass
 * for the given arguments
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var log4js = require("log4js");

var Resource = require("./Resource.js");
var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceString = require("./ResourceString.js");
var ContextResourceString = require("./ContextResourceString.js");
var SourceContextResourceString = require("./SourceContextResourceString.js");
var IosLayoutResourceString = require("./IosLayoutResourceString.js");

var logger = log4js.getLogger("loctool.lib.ResourceFactory");

var classHash = {
    plaintext: {}
};

classHash.plaintext[ResourceArray.resClass] = ResourceArray;
classHash.plaintext[ResourcePlural.resClass] = ResourcePlural;
classHash.plaintext[ResourceString.resClass] = ResourceString;

var knownResourceClasses = {
    "ResourceString": ResourceString,
    "ResourceArray": ResourceArray,
    "ResourcePlural": ResourcePlural,
    "ContextResourceString": ContextResourceString,
    "SourceContextResourceString": SourceContextResourceString,
    "IosLayoutResourceString": IosLayoutResourceString,
};

/**
 * @class Create the right type of resource subclass
 * for the given arguments.
 *
 * @param {Object} props properties of the resource to be passed to the
 * actual resource subclass' constructor
 */
var ResourceFactory = function(props) {
    if (!props) {
        return new classHash.plaintext[ResourceString.resClass];
    }

    var datatype = props.datatype && classHash[props.datatype] ? props.datatype : "plaintext";
    var classes = classHash[datatype];
    var resClass = props.resType || ResourceString.resClass;

    if (!classes[resClass]) {
        logger.error("No constructor for datatype " + props.datatype + " and restype " + resClass);
    }

    return new classes[resClass](props);
};

/**
 * Register the given data type to the given resource class. That is, any
 * serialized resource instance with a particular data type should be
 * instantiated with the given resource class. File types should register
 * their data types when they are initialized.
 *
 * @static
 * @param {String} datatype the type to register
 * @param {Function} resClass the resource class to register (string, array, plural)
 * @param {Function} the class to use when instantiating data with the given data
 * type and resource class.
 */
ResourceFactory.registerDataType = function(datatype, resClass, cls) {
    if (!classHash[datatype]) {
        classHash[datatype] = {};
    }

    logger.trace("Datatype " + datatype + " with class " + resClass + " registered to class " + cls.resClass);
    classHash[datatype][resClass] = cls;
};

/**
 * Assign the given resource type name to the resource class for a particular
 * file type. The file type is the type of the resource being extracted,
 * such as "javascript" or "php", which comes from the file type plugin
 * that handles source files of that type. The resClass parameter gives
 * the class of resource to assign. It must be one of these strings:
 *
 * <ul>
 * <li>string
 * <li>array
 * <li>plural
 * </ul>
 *
 * The name is type of resource that implements the classes above. The
 * given value can be a string of a known resource type, or it can be
 * a constructor for a resource type that the plugin implements on its
 * own. The resource factory will use this constructor to make new
 * instances of the resource class. The known resource types are:
 *
 * <ul>
 * <li>ResourceString - a regular string resource
 * <li>ResourceArray - a regular string array resource
 * <li>ResourcePlural - a regular plural resource
 * <li>IosLayoutResourceString - a string resource with extra fields to
 * handle IOS layout files
 * <li>ContextResourceString - a string resource with extra fields to
 * handle context.
 * </ul>
 *
 * A context string is a string resource with a particular key that can
 * have different source strings depending on the context field. This type
 * of resource is used to implement flavors in Android apps, and customizable
 * strings in other languages. For example, if the key is "app.name", the
 * source string in the main context might be "My Application". If the app
 * is customized so that it is white labeled for a partner, then the same
 * source string in the "partner1" context might be "Partner #1 Application".
 * Each string would of course have a different translation.
 *
 * @param {string} filetype the file type that is handles these classes of resource
 * @param {string} resClass the class of resource
 * @param {string|function} name the name of a constructor that will
 * implement that class, or the constructor itself
 */
ResourceFactory.assignResourceClass = function(filetype, resClass, name) {
    if (!classHash[filetype]) {
        classHash[filetype] = {};
    }

    if (typeof(name) === "string") {
        logger.trace("Filetype " + filetype + " with class " + resClass + " registered to class " + name);
        if (!knownResourceClasses[name]) {
            throw "Unknown resource class " + name;
        }

        classHash[filetype][resClass] = knownResourceClasses[name];
    } else {
        logger.trace("Filetype " + filetype + " with class " + resClass + " registered to a custom resource class.");

        var test = new name();
        if (!(test instanceof Resource)) {
            throw "Attempt to install a class as a resource that does not inherit from the Resource class.";
        }
        classHash[filetype][resClass] = name;
    }
};

module.exports = ResourceFactory;
