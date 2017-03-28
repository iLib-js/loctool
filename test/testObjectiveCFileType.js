/*
 * testObjectiveCFileTypeType.js - test the Objective C file type handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc. All Rights Reserved.
 */

if (!ObjectiveCFileType) {
    var ObjectiveCFileType = require("../lib/ObjectiveCFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

module.exports = {
    testObjectiveCFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testObjectiveCFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.m"));
        
        test.done();
    },

    testObjectiveCFileTypeHandlesHeaderFileTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.h"));
        
        test.done();
    },

    testObjectiveCFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.cm"));
        
        test.done();
    },
    
    testObjectiveCFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testObjectiveCFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new ObjectiveCFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.m"));
        
        test.done();
    }
};