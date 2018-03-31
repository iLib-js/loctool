/*
 * testObjectiveCFileTypeType.js - test the Objective C file type handler object.
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

if (!ObjectiveCFileType) {
    var ObjectiveCFileType = require("../lib/ObjectiveCFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

module.exports = {
    testObjectiveCFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);

        test.ok(htf);

        test.done();
    },

    testObjectiveCFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.m"));

        test.done();
    },

    testObjectiveCFileTypeHandlesHeaderFileTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.h"));

        test.done();
    },

    testObjectiveCFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.cm"));

        test.done();
    },

    testObjectiveCFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testObjectiveCFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new ObjectiveCFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.m"));

        test.done();
    }
};
