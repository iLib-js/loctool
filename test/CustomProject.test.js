/*
 * CustomProject.test.js - test the Custom Project class.
 *
 * Copyright © 2019-2020, 2023 JEDLSoft
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

describe("customproject", function() {
    test("CustomProjectConstructor", function() {
        expect.assertions(1);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
    });

    test("CustomProjectLoadPlugin", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"]
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        expect(p).toBeTruthy();
        p.init(function() {
            var jt = p.getFileType("mock");

            expect(jt instanceof MockFileType).toBeTruthy();
        });
    });

    test("CustomProjectLoadPluginShortName", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["mock"]
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        expect(p).toBeTruthy();

        p.init(function(){
            var jt = p.getFileType("mock");

            expect(jt instanceof MockFileType).toBeTruthy();
        });
    });

    test("CustomProjectNoInit", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        expect(!p.getFileType("mock")).toBeTruthy();
    });

    test("CustomProjectNoPlugin", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        expect(p).toBeTruthy();
        p.init(function(){
            expect(!p.getFileType("mock")).toBeTruthy();
        });
    });

    test("CustomProjectRightResourceTypeJavascript", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"],
            settings: {
                resourceFileTypes: {
                    "mock": "mock-resource"
                }
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        p.init(function() {
            var jt = p.getResourceFileType("mock");

            expect(jt instanceof MockResourceFileType).toBeTruthy();
        });
    });

    test("CustomProjectRightResourceTypeJS", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["mock"]
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        p.init(function() {
            var rt = p.getResourceFileType("mock");

            expect(rt instanceof MockResourceFileType).toBeTruthy();
        });
    });

    test("CustomProjectGotFlavors", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        expect(p).toBeTruthy();

        expect(p.flavorList).toBeTruthy();
    });

    test("CustomProjectGotRightFlavors", function() {
        expect.assertions(3);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        expect(p).toBeTruthy();
        expect(p.flavorList).toBeTruthy();
        expect(p.flavorList).toStrictEqual(["VANILLA", "CHOCOLATE"]);
    });

    test("CustomProjectGetResourceDirsString", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        expect(p.getResourceDirs("yml")).toStrictEqual(["a/b/c"]);
    });

    test("CustomProjectGetResourceDirsNotThere", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        expect(p.getResourceDirs("java")).toStrictEqual([]);
    });

    test("CustomProjectGetResourceDirsNoneSpecified", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        expect(p.getResourceDirs("java")).toStrictEqual([]);
    });

    test("CustomProjectGetResourceDirsArray", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(p.getResourceDirs("yml")).toStrictEqual(["a/b/c", "d/e/f"]);
    });

    test("CustomProjectIsResourcePathPositive", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(p.isResourcePath("yml", "test/testfiles/a/b/c/x.yml")).toBeTruthy();
    });

    test("CustomProjectIsResourcePathNegative", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(!p.isResourcePath("yml", "test/testfiles/a/c/x.yml")).toBeTruthy();
    });

    test("CustomProjectIsResourcePathPositive2", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(p.isResourcePath("yml", "test/testfiles/d/e/f/x.yml")).toBeTruthy();
    });

    test("CustomProjectIsResourcePathSubdirectory", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(p.isResourcePath("yml", "test/testfiles/d/e/f/m/n/o/x.yml")).toBeTruthy();
    });

    test("CustomProjectIsResourcePathDirOnly", function() {
        expect.assertions(2);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
        expect(p.isResourcePath("yml", "test/testfiles/d/e/f")).toBeTruthy();
    });

    test("CustomProjectLoadAndroidFlavors", function() {
        expect.assertions(3);

        var p = new CustomProject({
            id: "custom",
            sourceLocale: "en-US",
            plugins: ["ilib-loctool-mock"]
        }, "./test/testfiles", {
            locales:["en-GB"],
            "build.gradle": "build1.gradle"
        });
        expect(p).toBeTruthy();
        p.defineFileTypes();
        p.init(function() {
            expect(p.flavors).toBeTruthy();
            expect(p.flavors.getFlavorForPath("flavors/bproj/res")).toBe("b");
        });
    });
});
