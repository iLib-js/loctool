/*
 * testAndroidLayoutFileType.js - test the HTML template file type handler object.
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

if (!AndroidLayoutFileType) {
    var AndroidLayoutFileType = require("../lib/AndroidLayoutFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports.androidlayoutfiletype = {
    testAndroidLayoutFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);

        test.ok(alf);

        test.done();
    },

    testAndroidLayoutFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("foo.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/layout/foo.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesMenuTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/menu/foo.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesXmlDirTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/xml/foo.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesOtherTypeFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout/foo.html"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesWrongDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/color/strings.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-es/foo.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-zh/foobar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedENGB: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-en-rGB/foobar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedModernFullLocale: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-b+zh+Hans+CN/foobar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandlesLayoutAlreadyLocalizedModernFullLocaleWithContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-b+zh+Hans+CN-hdmi/foobar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandleContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(alf.handles("android/res/layout-foo/bar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandleContextLocalizedES: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-es-foo/bar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandleContextLocalizeCN: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-zh-foo/bar.xml"));

        test.done();
    },

    testAndroidLayoutFileTypeHandleContextLocalizedENGB: function(test) {
        test.expect(2);

        var p = new AndroidProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "java": "android/res"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var alf = new AndroidLayoutFileType(p);
        test.ok(alf);

        test.ok(!alf.handles("android/res/layout-en-rGB-foo/bar.xml"));

        test.done();
    }
};
