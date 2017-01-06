/*
 * testAndroidResourceFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
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
        }, "./testfiles");
        
        var alf = new AndroidResourceFileType(p);
        
        test.ok(alf);
        
        test.done();
    },

    testAndroidResourceFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
        var alf = new AndroidResourceFileType(p);
        test.ok(alf);
        
        test.ok(!alf.handles("android/res/values-en-rGB/strings.xml"));
        
        test.done();
    },

    testAndroidResourceFileTypeHandleContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"java": "android/res"
        	}
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
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
        }, "./testfiles");
        
        var alf = new AndroidResourceFileType(p);
        test.ok(alf);
        
        test.ok(!alf.handles("android/res/values-en-rGB-foo/strings.xml"));
        
        test.done();
    }
};