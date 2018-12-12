/*
 * testHTMLTemplateFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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

if (!HTMLTemplateFileType) {
    var HTMLTemplateFileType = require("../lib/HTMLTemplateFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports.htmltemplatefiletype = {
    testHTMLTemplateFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);

        test.ok(htf);

        test.done();
    },

    testHTMLTemplateFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tml"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-GB.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-ZA-ASDF.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandleszhHKAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.tmpl.html"));

        test.done();
    }
};
