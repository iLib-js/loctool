/*
 * testSwiftFileTypeType.js - test the Swift file type handler object.
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

if (!SwiftFileType) {
    var SwiftFileType = require("../lib/SwiftFileType.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

module.exports = {
    testSwiftFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        
        test.ok(stf);
        
        test.done();
    },

    testSwiftFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("foo.swift"));
        
        test.done();
    },

    testSwiftFileTypeHandlesHeaderFileTrue: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("foo.h"));
        
        test.done();
    },

    testSwiftFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(!stf.handles("fooswift"));
        
        test.done();
    },
    
    testSwiftFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(!stf.handles("foo.html"));
        
        test.done();
    },
    
    testSwiftFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("a/b/c/foo.swift"));
        
        test.done();
    }
};