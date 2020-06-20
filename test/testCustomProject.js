/*
 * testCustomProject.js - test the Custom Project class.
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

var nodeunit = require("nodeunit");
require("./assertExtras.js");

if (!CustomProject) {
    var CustomProject = require("../lib/CustomProject.js");
    var MockFileType = require("ilib-loctool-mock");
    var MockResourceFileType = require("ilib-loctool-mock-resource");
}

module.exports.customproject = {
    testCustomProjectConstructor: function(test) {
        test.expect(1);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.done();
    },

    testCustomProjectLoadPlugin: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"]
        }, "./testfiles", {
            locales:["en-GB"]
        });
        test.ok(p);
        p.init(function() {
            var jt = p.getFileType("mock");

            test.ok(jt instanceof MockFileType);

            test.done();
        });
    },

    testCustomProjectLoadPluginShortName: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["mock"]
        }, "./testfiles", {
            locales:["en-GB"]
        });
        test.ok(p);

        p.init(function(){
            var jt = p.getFileType("mock");

            test.ok(jt instanceof MockFileType);

            test.done();
        });
    },

    testCustomProjectNoInit: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(!p.getFileType("mock"));

        test.done();
    },

    testCustomProjectNoPlugin: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });
        test.ok(p);
        p.init(function(){
            test.ok(!p.getFileType("mock"));

            test.done();
        });
    },

    testCustomProjectRightResourceTypeJavascript: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"],
            settings: {
                resourceFileTypes: {
                    "mock": "mock-resource"
                }
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);
        p.init(function() {
            var jt = p.getResourceFileType("mock");

            test.ok(jt instanceof MockResourceFileType);

            test.done();
        });
    },

    testCustomProjectRightResourceTypeJS: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["mock"]
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);
        p.init(function() {
            var rt = p.getResourceFileType("mock");

            test.ok(rt instanceof MockResourceFileType);

            test.done();
        });
    },

    testCustomProjectGotFlavors: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        test.ok(p);

        test.ok(p.flavorList);

        test.done();
    },

    testCustomProjectGotRightFlavors: function(test) {
        test.expect(3);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        test.ok(p);
        test.ok(p.flavorList);
        test.deepEqual(p.flavorList, ["VANILLA", "CHOCOLATE"]);

        test.done();
    },

    testCustomProjectGetResourceDirsString: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("yml"), ["a/b/c"]);

        test.done();
    },

    testCustomProjectGetResourceDirsNotThere: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("java"), []);

        test.done();
    },

    testCustomProjectGetResourceDirsNoneSpecified: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("java"), []);

        test.done();
    },

    testCustomProjectGetResourceDirsArray: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("yml"), ["a/b/c", "d/e/f"]);

        test.done();
    },

    testCustomProjectIsResourcePathPositive: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "a/b/c/x.yml"));

        test.done();
    },

    testCustomProjectIsResourcePathNegative: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(!p.isResourcePath("yml", "a/c/x.yml"));

        test.done();
    },

    testCustomProjectIsResourcePathPositive2: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "d/e/f/x.yml"));

        test.done();
    },

    testCustomProjectIsResourcePathSubdirectory: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "d/e/f/m/n/o/x.yml"));

        test.done();
    },

    testCustomProjectIsResourcePathDirOnly: function(test) {
        test.expect(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "d/e/f"));

        test.done();
    },

    testCustomProjectLoadAndroidFlavors: function(test) {
        test.expect(3);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"]
        }, "./testfiles", {
            locales:["en-GB"],
            "build.gradle": "build1.gradle"
        });
        test.ok(p);
        p.init(function() {
            test.ok(p.flavors);
            test.ok(p.flavors.getFlavorForPath("flavors/bproj/res"), "chocolate");
            test.done();
        });
    }
};
