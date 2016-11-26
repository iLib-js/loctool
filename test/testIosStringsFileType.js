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
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testIosStringsFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foostrings"));
        
        test.done();
    },
    
    testIosStringsFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testIosStringsFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/Base.lproj/Localizable.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/en.lproj/FGSignUpViewController.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/Base.lproj/FGSignUpViewController.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
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
        		"objc": "."
        	}
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("./en.lproj/FGSignUpViewController.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "."
        	}
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("./Base.lproj/FGSignUpViewController.strings"));
        
        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "."
        	}
        }, "./testfiles");
        
        var htf = new IosStringsFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("./de.lproj/FGSignUpViewController.strings"));
        
        test.done();
    }
};