/*
 * testResourceFactory.js - test the resource array object.
 *
 * Copyright © 2019, JEDLSoft
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

if (!ResourceFactory) {
    var ResourceFactory = require("../lib/ResourceFactory.js");
    var Resource = require("../lib/Resource.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
}

module.exports.ResourceFactory = {
    testResourceFactoryString: function(test) {
        test.expect(2);

        var ra = ResourceFactory({
            resType: "string"
        });

        test.ok(ra);

        test.ok(ra instanceof ResourceString);

        test.done();
    },

    testResourceFactoryArray: function(test) {
        test.expect(2);

        var ra = ResourceFactory({
            resType: "array"
        });

        test.ok(ra);

        test.ok(ra instanceof ResourceArray);

        test.done();
    },

    testResourceFactoryPlural: function(test) {
        test.expect(2);

        var ra = ResourceFactory({
            resType: "plural"
        });

        test.ok(ra);

        test.ok(ra instanceof ResourcePlural);

        test.done();
    },

    testResourceFactoryNoResType: function(test) {
        test.expect(2);

        var ra = ResourceFactory({
        });

        test.ok(ra);

        test.ok(ra instanceof ResourceString);

        test.done();
    },

    testResourceFactoryNoProps: function(test) {
        test.expect(2);

        var ra = ResourceFactory();

        test.ok(ra);

        test.ok(ra instanceof ResourceString);

        test.done();
    },

    testResourceFactoryAssignResourceClassString: function(test) {
        test.expect(2);

        ResourceFactory.assignResourceClass("java", "string", "ContextResourceString");

        var ra = ResourceFactory({
            datatype: "java",
            resType: "string"
        });

        test.ok(ra);

        test.ok(ra instanceof ContextResourceString);

        test.done();
    },

    testResourceFactoryAssignResourceClassStringOtherFileType: function(test) {
        test.expect(2);

        ResourceFactory.assignResourceClass("java", "string", "ContextResourceString");

        var ra = ResourceFactory({
            datatype: "foo",
            resType: "string"
        });

        test.ok(ra);

        test.ok(ra instanceof ResourceString);

        test.done();
    },

    testResourceFactoryAssignResourceClassUnknownClass: function(test) {
        test.expect(0);

        try {
            ResourceFactory.assignResourceClass("java", "string", "foo");
            test.fail();
        } catch (e) {
            // should throw an exception
        }

        test.done();
    },

    testResourceFactoryAssignResourceClassFunction: function(test) {
        test.expect(2);

        var MyResourceString = function MyResourceString(props) {
            this.props = props;
        };
        MyResourceString.prototype = new Resource();
        MyResourceString.prototype.parent = Resource;
        MyResourceString.prototype.constructor = MyResourceString;

        ResourceFactory.assignResourceClass("java", "string", MyResourceString);

        var ra = ResourceFactory({
            datatype: "java",
            resType: "string"
        });

        test.ok(ra);

        test.ok(ra instanceof MyResourceString);

        test.done();
    },

    testResourceFactoryAssignResourceClassNonResource: function(test) {
        test.expect(0);

        var MyResourceString = function MyResourceString(props) {
            this.props = props;
        };

        try {
            ResourceFactory.assignResourceClass("java", "string", MyResourceString);
            test.fail();
        } catch (e) {
            // should throw
        }

        test.done();
    }
};
