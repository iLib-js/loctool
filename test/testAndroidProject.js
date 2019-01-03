/*
 * testAndroidProject.js - test the Android Project class.
 *
 * Copyright © 2017, HealthTap, Inc.
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

if (!AndroidProject) {
    var AndroidProject = require("../lib/AndroidProject.js");
    var AndroidResourceFileType = require("../lib/AndroidResourceFileType.js");
}

module.exports.androidproject = {
    testAndroidProjectConstructor: function(test) {
        test.expect(1);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.done();
    },

    testAndroidProjectRightResourceType: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        var rt = p.getResourceFileType();

        test.ok(rt instanceof AndroidResourceFileType);

        test.done();
    },

    testAndroidProjectGotFlavors: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            "build.gradle": "./build1.gradle"
        });

        test.ok(p);

        test.ok(p.flavors);

        test.done();
    },

    testAndroidProjectGotRightFlavors: function(test) {
        test.expect(8);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            "build.gradle": "./build1.gradle"
        });

        test.ok(p);
        test.ok(p.flavors);

        test.deepEqual(p.flavors.getSourceDirs("a"), ["flavors/a/src"]);
        test.deepEqual(p.flavors.getResourceDirs("a"), ["flavors/a/res"]);

        test.deepEqual(p.flavors.getSourceDirs("b"), ["flavors/bproj/src"]);
        test.deepEqual(p.flavors.getResourceDirs("b"), ["flavors/bproj/res"]);

        test.deepEqual(p.flavors.getSourceDirs("c"), ["flavors/xXx/src"]);
        test.deepEqual(p.flavors.getResourceDirs("c"), ["flavors/xXx/res"]);

        test.done();
    }
};
