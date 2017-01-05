/*
 * testJavaFileType.js - test the Java file type handler object.
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaFileType) {
    var JavaFileType = require("../lib/JavaFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testJavaFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testJavaFileTypeHandlesJavaTrue: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.java"));
        
        test.done();
    },

    testJavaFileTypeHandlesJavaFalseClose: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foojava"));
        
        test.done();
    },
        
    testJavaFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testJavaFileTypeHandlesJavaTrueWithDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.java"));
        
        test.done();
    }
};