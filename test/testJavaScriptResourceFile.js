/*
 * testJavaScriptResourceFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
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
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/en-US.js",
            targetLocale: "en-US"
        });

        test.ok(jsrf);

        test.done();
    },

    testJavaScriptResourceFileIsDirty: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
        });

        test.ok(jsrf);
        test.ok(!jsrf.isDirty());

        [
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
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
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
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
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
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
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
        });

        test.ok(jsrf);
        [
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            new ResourceString({
                project: "ht-webapp12",
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
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
        });

        test.ok(jsrf);
        [
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            new ResourceString({
                project: "ht-webapp12",
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
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "feelGood/localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "feelGood/localized_js/de-DE.js",
            targetLocale: "de-DE"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "ht-webapp12",
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