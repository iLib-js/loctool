/*
 * testMarkdownFileType.js - test the Markdown file type handler object.
 *
 * Copyright © 2019, Box, Inc.
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

        var htf = new MarkdownFileType(p);

        test.ok(htf);

        test.done();
    },

    testMarkdownFileTypeHandlesMD: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesMarkdown: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.markdown"));

        test.done();
    },

    testMarkdownFileTypeHandlesMdown: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.mdown"));

        test.done();
    },

    testMarkdownFileTypeHandlesMkd: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.mkd"));

        test.done();
    },

    testMarkdownFileTypeHandlesRst: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.rst"));

        test.done();
    },

    testMarkdownFileTypeHandlesRmd: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.rmd"));

        test.done();
    },

    testMarkdownFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tml"));

        test.done();
    },

    testMarkdownFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("en-GB/a/b/c/foo.md"));

        test.done();
    },

    testMarkdownFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("zh-Hans-CN/a/b/c/foo.md"));

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

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("en-ZA-ASDF/a/b/c/foo.md"));

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

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("zh-Hant-HK-ASDF/a/b/c/foo.md"));

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

        var htf = new MarkdownFileType(p);
        test.ok(htf);

        test.ok(htf.handles("en-US/a/b/c/foo.md"));

        test.done();
    }

};
