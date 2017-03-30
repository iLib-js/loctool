/*
 * testIosStringsFileType.js - test the ios strings resource file type handler object
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!IosStringsFileType) {
    var IosStringsFileType = require("../lib/IosStringsFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

module.exports = {
    testIosStringsFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);

        test.ok(htf);

        test.done();
    },

    testIosStringsFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foostrings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testIosStringsFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/en-US.lproj/foo.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDir: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/en-US.lproj/FGSignUpViewController.strings"));
        test.ok(htf.handles("feelgood/en-US.lproj/FGGetHelpConciergeView.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalseWithNonEnglishLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/zh-Hans.lproj/FGSignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirLocStrings: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("feelgood/en-US.lproj/asdf.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirInResourceDir: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("feelgood/en-US.lproj/Localizable.strings"));
        test.ok(!htf.handles("feelgood/Base.lproj/Localizable.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/Base.lproj/FGSignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/de.lproj/FGSignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo/en-US.lproj/FGSignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo/Base.lproj/FGSignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo/de.lproj/FGSignUpViewController.strings"));

        test.done();
    }
};