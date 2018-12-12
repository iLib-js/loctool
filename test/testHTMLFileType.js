/*
 * testHTMLFileType.js - test the HTML file type handler object.
 *
 * Copyright © 2018, Box, Inc.
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

if (!HTMLFileType) {
    var HTMLFileType = require("../lib/HTMLFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports.htmlfiletype = {
    testHTMLFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);

        test.ok(htf);

        test.done();
    },

    testHTMLFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.html"));

        test.done();
    },

    testHTMLFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tml"));

        test.done();
    },

    testHTMLFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.html"));

        test.done();
    },

    testHTMLFileTypeHandlesAlternateExtensionTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.htm"));

        test.done();
    },

    testHTMLFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.html"));

        test.done();
    },

    testHTMLFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-GB.html"));

        test.done();
    },

    testHTMLFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.html"));

        test.done();
    },

    testHTMLFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-ZA-ASDF.html"));

        test.done();
    },

    testHTMLFileTypeHandleszhHKAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new HTMLFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.html"));

        test.done();
    }
};
