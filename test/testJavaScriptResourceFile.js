/*
 * testJavaScriptResourceFile.js - test the JavaScript file handler object.
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

if (!JavaScriptResourceFile) {
    var JavaScriptResourceFile = require("../lib/JavaScriptResourceFile.js");
    var WebProject = require("../lib/WebProject.js");
    var ResourceString = require("../lib/ResourceString.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

module.exports = {
    testJavaScriptResourceFileConstructor: function(test) {
        test.expect(1);

        var jsrf = new JavaScriptResourceFile();
        test.ok(jsrf);

        test.done();
    },

    testJavaScriptResourceFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/en-US.js",
            locale: "en-US"
        });

        test.ok(jsrf);

        test.done();
    },

    testJavaScriptResourceFileIsDirty: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.ok(!jsrf.isDirty());

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.ok(jsrf.isDirty());

        test.done();
    },

    testJavaScriptResourceFileRightContents: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellentext",\n' +
            '    "source text": "Quellentext",\n' +
            '    "yet more source text": "noch mehr Quellentext"\n' +
            '};\n'
        );

        test.done();
    },

    testJavaScriptResourceFileGetContentsNoContent: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        test.equal(jsrf.getContent(),
            'ilib.data.strings_de_DE = {};\n'
        );

        test.done();
    },

    testJavaScriptResourceFileEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen\"text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\\"text",\n' +
            '    "source text": "Quellen\\"text"\n' +
            '};\n'
        );

        test.done();
    },

    testJavaScriptResourceFileDontEscapeSingleQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen'text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\'text",\n' +
            '    "source text": "Quellen\'text"\n' +
            '};\n'
        );

        test.done();
    },

    testJavaScriptResourceFileIdentifyResourceIds: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        var expected =
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    }
};