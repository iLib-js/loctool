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

var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceString = require("./ResourceString.js");

var logger = log4js.getLogger("loctool.lib.ResourceFactory");

var classHash = {
	plaintext: {}
};

classHash.plaintext[ResourceArray.resClass] = ResourceArray;
classHash.plaintext[ResourcePlural.resClass] = ResourcePlural;
classHash.plaintext[ResourceString.resClass] = ResourceString;

/**
 * @class Create the right type of resource subclass
 * for the given arguments.
 * 
 * @param {Object} props properties of the resource to be passed to the
 * actual resource subclass' constructor
 */
var ResourceFactory = function(props) {
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

module.exports = ResourceFactory;