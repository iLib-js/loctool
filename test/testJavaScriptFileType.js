/*
 * testJavaScriptFileTypeType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../lib/JavaScriptFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJavaScriptFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foojs"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.js"));
        
        test.done();
    }
};