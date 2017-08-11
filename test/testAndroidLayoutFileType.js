/*
 * testAndroidLayoutFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!AndroidLayoutFileType) {
    var AndroidLayoutFileType = require("../lib/AndroidLayoutFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
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