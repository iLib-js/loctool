/*
 * MarkdownFileType.test.js - test the Markdown file type handler object.
 *
 * Copyright © 2019-2020, 2023 Box, Inc.
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

var fs = require("fs");

if (!MarkdownFileType) {
    var MarkdownFileType = require("../lib/MarkdownFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

describe("markdownfiletype", function() {
    test("MarkdownFileTypeConstructor", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);

        expect(mdft).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesMD", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesMarkdown", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.markdown")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesMdown", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.mdown")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesMkd", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.mkd")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesRst", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.rst")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesRmd", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("foo.rmd")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(!mdft.handles("foo.tml")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(!mdft.handles("en-GB/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(!mdft.handles("zh-Hans-CN/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(!mdft.handles("en-ZA-ASDF/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(!mdft.handles("zh-Hant-HK-ASDF/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        expect(mdft.handles("en-US/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesSourceDirNotLocalizedWithMD", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        // md has the form of an iso language name, but it is not a real language
        expect(mdft.handles("md/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeHandlesSourceDirNotLocalizedWithLocaleLookingDir", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        // en-AA looks like a real locale, but it is not because XX is not a country code
        expect(mdft.handles("en-XX/a/b/c/foo.md")).toBeTruthy();
    });

    test("MarkdownFileTypeProjectCloseFullyTranslatedOn", function() {
        expect.assertions(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"],
            markdown: {
                fullyTranslated: true
            }
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        var statii = [
            {path: "fr-FR/a/b/c.md", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.md", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.md", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.md", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.md", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.md", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdft.addTranslationStatus(status);
        });

        mdft.projectClose();

        expect(fs.existsSync("./testfiles/translation-status.json")).toBeTruthy();

        var contents = fs.readFileSync("./testfiles/translation-status.json", "utf-8");
        var actual = JSON.parse(contents);

        var expected = {
            translated: [
                "de-DE/a/b/c.md",
                "fr-FR/x/y.md",
                "ja-JP/x/y.md"
            ],
            untranslated: [
                "fr-FR/a/b/c.md",
                "ja-JP/a/b/c.md",
                "de-DE/x/y.md"
            ]
        };

        expect(actual).toStrictEqual(expected);
    });

    test("MarkdownFileTypeProjectCloseFullyTranslatedOff", function() {
        expect.assertions(3);

        // clean up first
        fs.unlinkSync("./testfiles/translation-status.json");
        expect(!fs.existsSync("./testfiles/translation-status.json")).toBeTruthy();

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();

        var statii = [
            {path: "fr-FR/a/b/c.md", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.md", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.md", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.md", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.md", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.md", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdft.addTranslationStatus(status);
        });

        mdft.projectClose();

        expect(!fs.existsSync("./testfiles/translation-status.json")).toBeTruthy();
    });

});
