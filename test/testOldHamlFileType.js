/*
 * testOldHamlFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc. All Rights Reserved.
 */

if (!OldHamlFileType) {
    var OldHamlFileType = require("../lib/OldHamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testOldHamlFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testOldHamlFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.html.haml"));
        
        test.done();
    },

    testOldHamlFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.tml.haml"));
        
        test.done();
    },
    
    testOldHamlFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.haml"));
        
        test.done();
    },
    
    testOldHamlFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    },

    testOldHamlFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.en-GB.html.haml"));
        
        test.done();
    },

    testOldHamlFileTypeHandlesAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.es-US.html.haml"));
        
        test.done();
    },

    testOldHamlFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.html.haml"));
        
        test.done();
    },
    
    testOldHamlFileTypeHandlesAlreadyLocalizedCN2: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new OldHamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml"));
        
        test.done();
    }
};