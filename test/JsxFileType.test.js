/*
 * JsxFileType.test.js - test the HTML template file type handler object.
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
if (!JsxFileType) {
    var JsxFileType = require("../lib/JsxFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}
describe("jsxfiletype", function() {
    test("JsxFileTypeConstructor", function() {
        expect.assertions(1);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSTrue", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSXTrue", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.jsx")).toBeTruthy();
    });
    test("JsxFileTypeHandlesHamlFalse", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.html.haml")).toBeTruthy();
    });
    test("JsxFileTypeHandlesTemplatesFalse", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.tmpl.html")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSXFalseClose", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foojsx")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSTrueWithDir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSXTrueWithDir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.jsx")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedGB1", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/strings.en-GB.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedGBJustLang", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/en.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedGBLangRegion", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/en-GB.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedGBLangScriptRegion", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/zh-Hant-CN.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedCN1", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/strings.zh-Hans-CN.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedCN2", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/zh-Hans-CN.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJSAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/strings.en-ZA-ASDF.js")).toBeTruthy();
    });
    test("JsxFileTypeHandlesJsxAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var htf = new JsxFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/en-ZA-ASDF.jsx")).toBeTruthy();
    });
});
