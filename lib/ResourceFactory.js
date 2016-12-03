/*
 * ResourceFactory.js - class that creates the right type of resource subclass
 * for the given arguments
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var ResourceArray = require("./ResourceArray.js");
var ResourcePlural = require("./ResourcePlural.js");
var ResourceString = require("./ResourceString.js");
var AndroidResourceString = require("./AndroidResourceString.js");
var IosLayoutResourceString = require("./IosLayoutResourceString.js");

var classHash = {};

classHash[ResourceArray.resClass] = ResourceArray;
classHash[ResourcePlural.resClass] = ResourcePlural;
classHash[ResourceString.resClass] = ResourceString;

classHash[AndroidResourceString.resClass] = AndroidResourceString;
classHash[IosLayoutResourceString.resClass] = IosLayoutResourceString;

/**
 * @class Create the right type of resource subclass
 * for the given arguments.
 * 
 * @param {Object} props properties of the resource to be passed to the
 * actual resource subclass' constructor
 */
var ResourceFactory = function(props) {
	var resClass = props.resClass || "resource-string";
	
	return new classHash[resClass](props);
};

module.exports = Resource;