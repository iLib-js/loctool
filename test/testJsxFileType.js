/*
 * testJsxFileType.js - test the HTML template file type handler object.
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

if (!JsxFileType) {
    var JsxFileType = require("../lib/JsxFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJsxFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);

        test.ok(htf);

        test.done();
    },

    testJsxFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.js"));

        test.done();
    },

    testJsxFileTypeHandlesJSXTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.jsx"));

        test.done();
    },

    testJsxFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.html.haml"));

        test.done();
    },

    testJsxFileTypeHandlesTemplatesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foojs"));

        test.done();
    },

    testJsxFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foohtml.haml"));

        test.done();
    },

    testJsxFileTypeHandlesTemplateFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("footmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testJsxFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.js"));

        test.done();
    },

    testJsxFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.html.haml"));

        test.done();
    },

    testJsxFileTypeHandlesHamlTrueSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.en-US.html.haml"));

        test.done();
    },

    testJsxFileTypeHandlesTemplateSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/strings.en-US.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesJSAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-GB.js"));

        test.done();
    },

    testJsxFileTypeHandlesHamlAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-GB.html.haml"));

        test.done();
    },

    testJsxFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-GB.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesJSAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.js"));

        test.done();
    },

    testJsxFileTypeHandleHamlAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.html.haml"));

        test.done();
    },

    testJsxFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.es-US.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.es-US.tmpl.html"));

        test.done();
    },

    testJsxFileTypeHandlesJSAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-ZA-DISCOVERY.js"));

        test.done();
    },

    testJsxFileTypeHandlesHamlAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-ZA-DISCOVERY.html.haml"));

        test.done();
    },

    testJsxFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });

        var htf = new JsxFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/strings.en-ZA-DISCOVERY.tmpl.html"));

        test.done();
    }
};
