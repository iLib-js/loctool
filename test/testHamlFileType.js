/*
 * testHamlFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!HamlFileType) {
    var HamlFileType = require("../lib/HamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testHamlFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testHamlFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.html.haml"));
        
        test.done();
    },

    testHamlFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.tml.haml"));
        
        test.done();
    },
    
    testHamlFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.haml"));
        
        test.done();
    },
    
    testHamlFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.en-GB.html.haml"));
        
        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.es-US.html.haml"));
        
        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HamlFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.html.haml"));
        
        test.done();
    }
};