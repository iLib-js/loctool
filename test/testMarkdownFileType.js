/*
 * testMarkdownFileType.js - test the Markdown file type handler object.
 *
 * Copyright © 2019-2020, Box, Inc.
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

module.exports.markdownfiletype = {
    testMarkdownFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);

        test.ok(mdft);

        test.done();
    },

    testMarkdownFileTypeHandlesMD: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesMarkdown: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.markdown"));

        test.done();
    },

    testMarkdownFileTypeHandlesMdown: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.mdown"));

        test.done();
    },

    testMarkdownFileTypeHandlesMkd: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.mkd"));

        test.done();
    },

    testMarkdownFileTypeHandlesRst: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.rst"));

        test.done();
    },

    testMarkdownFileTypeHandlesRmd: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("foo.rmd"));

        test.done();
    },

    testMarkdownFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(!mdft.handles("foo.tml"));

        test.done();
    },

    testMarkdownFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(!mdft.handles("en-GB/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(!mdft.handles("zh-Hans-CN/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(!mdft.handles("en-ZA-ASDF/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandleszhHKAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(!mdft.handles("zh-Hant-HK-ASDF/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesSourceDirIsNotLocalized: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        test.ok(mdft.handles("en-US/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesSourceDirNotLocalizedWithMD: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        // md has the form of an iso language name, but it is not a real language
        test.ok(mdft.handles("md/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesSourceDirNotLocalizedWithLocaleLookingDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

        // en-AA looks like a real locale, but it is not because XX is not a country code
        test.ok(mdft.handles("en-XX/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeProjectClose: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var mdft = new MarkdownFileType(p);
        test.ok(mdft);

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

        test.ok(fs.existsSync("./testfiles/translation-status.json"));

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

        test.deepEqual(actual, expected);

        test.done();
    }

};
