/*
 * JavaScriptFileType.test.js - test the HTML template file type handler object.
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

if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../lib/JavaScriptFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

describe("scriptfiletype", function() {
    test("JavaScriptFileTypeConstructor", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);

        expect(htf).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSTrue", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.js")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSXTrue", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.jsx")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlTrue", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesTemplatesTrue", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSFalseClose", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foojs")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlFalseClose", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foohtml.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesTemplateFalseClose", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("footmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSTrueWithDir", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/foo.js")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlTrueWithDir", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/foo.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlTrueSourceLocale", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/foo.en-US.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesTemplateSourceLocale", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/strings.en-US.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlTrueWithDir", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/foo.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-GB.js")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-GB.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-GB.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.zh-Hans-CN.js")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandleHamlAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.zh-Hans-CN.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedES", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.es-US.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedES", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.es-US.tmpl.html")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-ZA-ASDF.js")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesHamlAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-ZA-ASDF.html.haml")).toBeTruthy();
    });

    test("JavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new JavaScriptFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/strings.en-ZA-ASDF.tmpl.html")).toBeTruthy();
    });
});
