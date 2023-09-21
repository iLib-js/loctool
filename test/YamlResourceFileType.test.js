/*
 * YamlResourceFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, 2023 2020, 2023 HealthTap, Inc.
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

if (!YamlResourceFileType) {
    var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

describe("yamlresourcefiletype", function() {
    test("YamlResourceFileTypeConstructor", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);

        expect(yrft).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesYml", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        // not in the resource dir
        expect(!yrft.handles("foo.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesAnythingFalse", function() {
        expect.assertions(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        // not in the resource dir
        expect(!yrft.handles("foo.tmpl.html")).toBeTruthy();
        expect(!yrft.handles("foo.html.haml")).toBeTruthy();
        expect(!yrft.handles("foo.js")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesEnglishResourceFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(yrft.handles("test/testfiles/config/locales/en-US.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesBaseResourceFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(yrft.handles("test/testfiles/config/locales/en.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesSourceResourceFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(yrft.handles("test/testfiles/config/locales/en-US.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesNonEnglishResourceFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(!yrft.handles("test/testfiles/config/locales/zh-Hans-CN.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesNonResourceFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(!yrft.handles("test/testfiles/config/qaconfig.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeHandlesIncludeFiles", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            },
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();
        expect(!yrft.handles("test/testfiles/config/nofications.yml")).toBeTruthy();
    });

    test("YamlResourceFileTypeGetResourceFile", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("fr-FR");

        expect(yrf.getLocale()).toBe("fr-FR");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathFR", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("fr-FR");

        expect(yrf.getLocale()).toBe("fr-FR");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/fr.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathZHCN", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("zh-Hans-CN");

        expect(yrf.getLocale()).toBe("zh-Hans-CN");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/zh.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathZHHK", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("zh-Hant-HK");

        expect(yrf.getLocale()).toBe("zh-Hant-HK");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/zh-Hant.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathESUS", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("es-US");

        expect(yrf.getLocale()).toBe("es-US");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/es.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathESES", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("es-ES");

        expect(yrf.getLocale()).toBe("es-ES");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/es-ES.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathENUS", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("en-US");

        expect(yrf.getLocale()).toBe("en-US");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/en-US.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathENGB", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("en-GB");

        expect(yrf.getLocale()).toBe("en-GB");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/en.yml");
    });

    test("YamlResourceFileTypeGetResourceFileRightPathUnknown", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("ja-JP");

        expect(yrf.getLocale()).toBe("ja-JP");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/ja.yml"); // should default to just the language tag
    });

    test("YamlResourceFileTypeGetResourceFileSameOneEachTime", function() {
        expect.assertions(4);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf1 = yrft.getResourceFile("fr-FR");
        expect(yrf1.getLocale()).toBe("fr-FR");

        var yrf2 = yrft.getResourceFile("fr-FR");
        expect(yrf2.getLocale()).toBe("fr-FR");

        expect(yrf1).toStrictEqual(yrf2);
    });

    test("YamlResourceFileTypeGetResourceFileWithFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("fr-FR", "CHOCOLATE");

        expect(yrf.getLocale()).toBe("fr-FR");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/fr-FR-CHOCOLATE.yml");
    });

    test("YamlResourceFileTypeGetResourceFileENUSWithFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("en-US", "CHOCOLATE");

        expect(yrf.getLocale()).toBe("en-US");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/en-US-CHOCOLATE.yml");
    });

    test("YamlResourceFileTypeGetResourceFileENHKWithFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("en-HK", "CHOCOLATE");

        expect(yrf.getLocale()).toBe("en-HK");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/en-HK-CHOCOLATE.yml");
    });

    test("YamlResourceFileTypeGetResourceFileZHHKWithFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("zh-Hant-HK", "CHOCOLATE");

        expect(yrf.getLocale()).toBe("zh-Hant-HK");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/zh-Hant-HK-CHOCOLATE.yml");
    });

    test("YamlResourceFileTypeGetResourceFileZHCNWithFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("zh-Hans-CN", "CHOCOLATE");

        expect(yrf.getLocale()).toBe("zh-Hans-CN");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/zh-Hans-CN-CHOCOLATE.yml");
    });

    test("YamlResourceFileTypeGetResourceFileWithNoFlavor", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });

        var yrft = new YamlResourceFileType(p);
        expect(yrft).toBeTruthy();

        var yrf = yrft.getResourceFile("fr-FR");

        expect(yrf.getLocale()).toBe("fr-FR");
        expect(yrf.getPath()).toBe("test/testfiles/config/locales/fr.yml");
    });
});
