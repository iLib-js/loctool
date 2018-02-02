/*
 * testJavaFileType.js - test the Java file type handler object.
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

if (!JavaFileType) {
    var JavaFileType = require("../lib/JavaFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testJavaFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaFileType(p);

        test.ok(htf);

        test.done();
    },

    testJavaFileTypeHandlesJavaTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.java"));

        test.done();
    },

    testJavaFileTypeHandlesJavaFalseClose: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foojava"));

        test.done();
    },

    testJavaFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testJavaFileTypeHandlesJavaTrueWithDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.java"));

        test.done();
    }
};
