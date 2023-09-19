/*
 * AndroidLayoutFileType.test.js - test the HTML template file type handler object.
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
if (!AndroidLayoutFileType) {
    var AndroidLayoutFileType = require("../lib/AndroidLayoutFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}
describe("androidlayoutfiletype", function() {
    test("AndroidLayoutFileTypeConstructor", function() {
        expect.assertions(1);
        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesXmlFalse", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("foo.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutTrue", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(alf.handles("android/res/layout/foo.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesMenuTrue", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(alf.handles("android/res/menu/foo.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesXmlDirTrue", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(alf.handles("android/res/xml/foo.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesOtherTypeFalse", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout/foo.html")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesWrongDir", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/color/strings.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedES", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-es/foo.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-zh/foobar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedENGB", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-en-rGB/foobar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedModernFullLocale", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-b+zh+Hans+CN/foobar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedModernFullLocaleWithContext", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-b+zh+Hans+CN-hdmi/foobar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandleContext", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(alf.handles("android/res/layout-foo/bar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandleContextLocalizedES", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-es-foo/bar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandleContextLocalizeCN", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-zh-foo/bar.xml")).toBeTruthy();
    });
    test("AndroidLayoutFileTypeHandleContextLocalizedENGB", function() {
        expect.assertions(2);
        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        var alf = new AndroidLayoutFileType(p);
        expect(alf).toBeTruthy();
        expect(!alf.handles("android/res/layout-en-rGB-foo/bar.xml")).toBeTruthy();
    });
});
