/*
 * testAndroidResourceFileType.js - test the HTML template file type handler object.
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

if (!AndroidResourceFileType) {
    var AndroidResourceFileType = require("../lib/AndroidResourceFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testAndroidResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);

        test.ok(alf);

        test.done();
    },

    testAndroidResourceFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("foo.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/values/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesMenuFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/menu/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesXmlDirFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/xml/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesOtherTypeFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values/strings.html"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-es/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-zh/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedENGB: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-en-rGB/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocale: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-b+zh+Hans+CN/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocaleWithContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-b+zh+Hans+CN-hdmi/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/values-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizedES: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-es-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizeCN: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-zh-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizedENGB: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidResourceFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/values-en-rGB-foo/strings.xml"));

        test.done();
    }
};