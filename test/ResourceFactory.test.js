/*
 * ResourceFactory.test.js - test the resource array object.
 *
 * Copyright © 2019, 2023 JEDLSoft
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

describe("ResourceFactory", function() {
    test("ResourceFactoryString", function() {
        expect.assertions(2);

        var ra = ResourceFactory({
            resType: "string"
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourceString).toBeTruthy();
    });

    test("ResourceFactoryArray", function() {
        expect.assertions(2);

        var ra = ResourceFactory({
            resType: "array"
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourceArray).toBeTruthy();
    });

    test("ResourceFactoryPlural", function() {
        expect.assertions(2);

        var ra = ResourceFactory({
            resType: "plural"
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourcePlural).toBeTruthy();
    });

    test("ResourceFactoryNoResType", function() {
        expect.assertions(2);

        var ra = ResourceFactory({
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourceString).toBeTruthy();
    });

    test("ResourceFactoryNoProps", function() {
        expect.assertions(2);

        var ra = ResourceFactory();

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourceString).toBeTruthy();
    });

    test("ResourceFactoryAssignResourceClassString", function() {
        expect.assertions(2);

        ResourceFactory.assignResourceClass("java", "string", "ContextResourceString");

        var ra = ResourceFactory({
            datatype: "java",
            resType: "string"
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ContextResourceString).toBeTruthy();
    });

    test("ResourceFactoryAssignResourceClassStringOtherFileType", function() {
        expect.assertions(2);

        ResourceFactory.assignResourceClass("java", "string", "ContextResourceString");

        var ra = ResourceFactory({
            datatype: "foo",
            resType: "string"
        });

        expect(ra).toBeTruthy();

        expect(ra instanceof ResourceString).toBeTruthy();
    });

    test("ResourceFactoryAssignResourceClassUnknownClass", function() {
        expect.assertions(0);

        try {
            ResourceFactory.assignResourceClass("java", "string", "foo");
            test.fail();
        } catch (e) {
            // should throw an exception
        }
    });

    test("ResourceFactoryAssignResourceClassFunction", function() {
        expect.assertions(2);

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

        expect(ra).toBeTruthy();

        expect(ra instanceof MyResourceString).toBeTruthy();
    });

    test("ResourceFactoryAssignResourceClassNonResource", function() {
        expect.assertions(0);

        var MyResourceString = function MyResourceString(props) {
            this.props = props;
        };

        try {
            ResourceFactory.assignResourceClass("java", "string", MyResourceString);
            test.fail();
        } catch (e) {
            // should throw
        }
    });
});
