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

module.exports.scriptresourcefile = {
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
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-DE.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-AT"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-AT.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-DE-ASDF.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-AT-ASDF"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-AT-ASDF.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hans-CN.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hant-HK"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hant.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-SG"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hans-SG.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hant-TW"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hant-TW.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathDefaultLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        // should default to English/US
        var jsrf = new JavaScriptResourceFile({
            project: p
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/en.js");
        test.done();
    },

    testJavaScriptResourceFileGetResourceFilePathAlreadyHasPath: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-AT",
            pathName: "localized_js/foo.js"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/foo.js");
        test.done();
    },

    testJavaScriptResourceFileGetContentDefaultLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
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

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentDefaultLocaleNoDefaultsAvailable: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
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

        // should use the full locale spec in the first line
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
    },

    testJavaScriptResourceFileGetContentNonDefaultLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-AT"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-AT",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-AT",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-AT",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            'ilib.data.strings_de_AT = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentDefaultLocaleZH: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentDefaultLocaleZH2: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hant-HK"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hant = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentNonDefaultLocaleZH: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-SG"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hans_SG = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentNonDefaultLocaleZH2: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hant-TW"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hant_TW = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJavaScriptResourceFileGetContentNonDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            localeDefaults: {
                "en": {
                    def: "en-US",
                    spec: "en"
                },
                "es": {
                    def: "es-US",
                    spec: "es"
                },
                "de": {
                    def: "de-DE",
                    spec: "de"
                },
                "zh-Hans": {
                    def: "zh-Hans-CN",
                    spec: "zh"
                },
                "zh-Hant": {
                    def: "zh-Hant-HK",
                    spec: "zh-Hant"
                }
            },
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        [
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            new ResourceString({
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

};
