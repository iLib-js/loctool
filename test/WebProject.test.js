/*
 * WebProject.test.js - test the Web Project class.
 *
 * Copyright © 2017, 2023 2020, 2023 HealthTap, Inc.
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

if (!WebProject) {
    var WebProject = require("../lib/WebProject.js");
    var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var JavaScriptResourceFileType = require("../lib/JavaScriptResourceFileType.js");
}

describe("webproject", function() {
    test("WebProjectConstructor", function() {
        expect.assertions(1);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
    });

    test("WebProjectRightResourceTypeRuby", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        var rt = p.getResourceFileType("ruby");

        expect(rt instanceof YamlResourceFileType).toBeTruthy();
    });

    test("WebProjectRightResourceTypeJS", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        var rt = p.getResourceFileType("js");

        expect(rt instanceof JavaScriptResourceFileType).toBeTruthy();
    });

    test("WebProjectGotFlavors", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        expect(p).toBeTruthy();

        expect(p.flavors).toBeTruthy();
    });

    test("WebProjectGotRightFlavors", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        expect(p).toBeTruthy();
        expect(p.flavors).toBeTruthy();
        expect(p.flavors).toStrictEqual(["VANILLA", "CHOCOLATE"]);
    });

    test("WebProjectGetResourceDirsString", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectGetResourceDirsNotThere", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectGetResourceDirsNoneSpecified", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        expect(p.getResourceDirs("java")).toStrictEqual([]);
    });

    test("WebProjectGetResourceDirsArray", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectIsResourcePathPositive", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectIsResourcePathNegative", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectIsResourcePathPositive2", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectIsResourcePathSubdirectory", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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

    test("WebProjectIsResourcePathDirOnly", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "web",
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
});
