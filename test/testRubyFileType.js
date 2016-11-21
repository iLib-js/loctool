/*
 * testRubyFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!RubyFileType) {
    var RubyFileType = require("../lib/RubyFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testRubyFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        
        test.ok(rf);
        
        test.done();
    },

    testRubyFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("foo.rb"));
        
        test.done();
    },

    testRubyFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("foo.html.haml"));
        
        test.done();
    },

    testRubyFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foorb"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foohtml.haml"));
        
        test.done();
    },
        
    testRubyFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foo.html"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("a/b/c/foo.rb"));
        
        test.done();
    },

    testRubyFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    }
};