/*
 * IosStringsFileType.test.js - test the ios strings resource file type handler object
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

if (!IosStringsFileType) {
    var IosStringsFileType = require("../lib/IosStringsFileType.js");
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

describe("stringsfiletype", function() {
    test("IosStringsFileTypeConstructor", function() {
        expect.assertions(1);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);

        expect(htf).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesTrue", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foostrings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.html")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/en-US.lproj/foo.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithEnglishLocaleDir", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/en-US.lproj/SignUpViewController.strings")).toBeTruthy();
        expect(htf.handles("feelgood/en-US.lproj/GetHelpView.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesFalseWithNonEnglishLocaleDir", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/zh-Hans.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithEnglishLocaleDirLocStrings", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("feelgood/en-US.lproj/asdf.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithEnglishLocaleDirInResourceDir", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("feelgood/en-US.lproj/Localizable.strings")).toBeTruthy();
        expect(!htf.handles("feelgood/Base.lproj/Localizable.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithBaseLocaleDir", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/Base.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithOtherLocaleDir", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "objc": "feelgood"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/de.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithEnglishLocaleDirNotInResources", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo/en-US.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithBaseLocaleDirNotInResources", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo/Base.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeHandlesWithOtherLocaleDirNotInResources", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo/de.lproj/SignUpViewController.strings")).toBeTruthy();
    });

    test("IosStringsFileTypeGetResourceFilePathObjc", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath("de-DE", "asdf/bar/SourceFile.m", "x-objective-c")).toBe("foo/de.lproj/Localizable.strings");
    });

    test("IosStringsFileTypeGetResourceFilePathObjcSourceLocale", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath("en-US", "asdf/bar/SourceFile.m", "x-objective-c")).toBe("foo/en-US.lproj/Localizable.strings");
    });

    test("IosStringsFileTypeGetResourceFilePathXib", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath("de-DE", "asdf/bar/en.lproj/SourceFile.xib", "x-xib")).toBe("asdf/bar/de.lproj/SourceFile.strings");
    });

    test("IosStringsFileTypeGetResourceFilePathXibSourceLocale", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath("en-US", "asdf/bar/en.lproj/SourceFile.xib", "x-xib")).toBe("asdf/bar/en-US.lproj/SourceFile.strings");
    });

    test("IosStringsFileTypeGetResourceFilePathXibUnknownLocale", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath(undefined, "asdf/bar/en-US.lproj/SourceFile.xib", "x-xib")).toBe("asdf/bar/en-US.lproj/SourceFile.strings");
    });

    test("IosStringsFileTypeGetResourceFilePathXibSourceLocaleWithFlavor", function() {
        expect.assertions(2);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors:["QHC"]
        });

        var htf = new IosStringsFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.getResourceFilePath("en-GB", "asdf/bar/en-US.lproj/QHC.strings", "x-xib", "QHC")).toBe("foo/en-001.lproj/QHC.strings");
    });

    test("IosStringsFileTypeGetResourceFileEnglishGBXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })
        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/en-001.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileEnglishUSXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/en-US.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileChineseCNXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/zh-Hans.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileChineseHKXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hant-HK",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/zh-Hant.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileSpanishUSXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/es.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileEnglishNZXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-NZ",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/en-NZ.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileUnknownLocaleXIB", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "sv-SE",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("src/myproduct/sv.lproj/Test.strings")
    });

    test("IosStringsFileTypeGetResourceFileEnglishUSObjc", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/en-US.lproj/Localizable.strings")
    });

    test("IosStringsFileTypeGetResourceFileEnglishGBObjc", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/en-001.lproj/Localizable.strings")
    });

    test("IosStringsFileTypeGetResourceFileChineseCNObjc", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/zh-Hans.lproj/Localizable.strings")
    });

    test("IosStringsFileTypeGetResourceFileSpanishUSObjc", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/es.lproj/Localizable.strings")
    });

    test("IosStringsFileTypeGetResourceFileEnglishGBFlavor", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-GB",
            pathName: "foo/en-US.lproj/QHC.strings",
            datatype: istf.datatype,
            flavor: "chocolate"
        });

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/en-001.lproj/chocolate.strings")
    });

    test("IosStringsFileTypeGetResourceFileChineseCNFlavor", function() {
        expect.assertions(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        expect(istf).toBeTruthy();

        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "foo/en-US.lproj/QHC.strings",
            datatype: istf.datatype,
            flavor: "chocolate"
        });

        var rf = istf.getResourceFile(res);
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/zh-Hans.lproj/chocolate.strings")
    });
});
