/*
 * YamlFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
if (!YamlFileType) {
    var YamlFileType = require("../lib/YamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}
describe("yamlfiletype", function() {
    test("YamlFileTypeConstructor", function() {
        expect.assertions(1);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
    });
    test("YamlFileTypeHandlesYml", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(yft.handles("foo.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesAnythingFalse", function() {
        expect.assertions(4);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("foo.tmpl.html")).toBeTruthy();
        expect(!yft.handles("foo.html.haml")).toBeTruthy();
        expect(!yft.handles("foo.js")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoResourceFiles", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("config/locales/en-US.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoFilesNamedForALocale", function() {
        expect.assertions(4);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("en-US.yml")).toBeTruthy();
        expect(!yft.handles("de-DE.yml")).toBeTruthy();
        expect(!yft.handles("en.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoFilesNamedForALocaleWithFlavor", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("en-ZA-ASDF.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoFilesNamedForALocaleInASubdir", function() {
        expect.assertions(4);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("a/b/en-US.yml")).toBeTruthy();
        expect(!yft.handles("c/d/de-DE.yml")).toBeTruthy();
        expect(!yft.handles("e/f/en.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoFilesNamedForALocaleWithFlavorInASubdir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("a/b/en-ZA-ASDF.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesFilesAlmostNamedForALocale", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(yft.handles("config/states.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoResourceFilesInSubdirs", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("config/locales/auto/en-US.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoResourceFilesInSubdirsWithFlavors", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("config/locales/auto/en-ZA-ASDF.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesNoBaseResourceFiles", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(!yft.handles("config/locales/en.yml")).toBeTruthy();
    });
    test("YamlFileTypeHandlesIncludeFiles", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var yft = new YamlFileType(p);
        expect(yft).toBeTruthy();
        expect(yft.handles("config/nofications.yml")).toBeTruthy();
    });
});
