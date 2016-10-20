/*
 * testXliff.js - test the Xliff object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!Xliff) {
    var TranslationUnit = require("../lib/TranslationUnit.js");
    var Xliff = require("../lib/Xliff.js");
}

module.exports = {
    testXliffConstructor: function(test) {
        test.expect(1);

        var x = new Xliff();
        test.ok(x);
        
        test.done();
    },
    
    testXliffConstructorIsEmpty: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        test.equal(x.size(), 0);
        
        test.done();
    },
    
    testXliffGetPath: function(test) {
        test.expect(2);

        var x = new Xliff({
        	path: "foo/bar/x.xliff"
        });
        test.ok(x);
        
        test.equal(x.getPath(), "foo/bar/x.xliff");
        
        test.done();
    },
    
    
    testXliffSetPath: function(test) {
        test.expect(2);

        var x = new Xliff({
        	path: "foo/bar/x.xliff"
        });
        test.ok(x);
        
        test.equal(x.getPath(), "foo/bar/x.xliff");
        
        x.setPath("asdf/asdf/y.xliff");
        
        test.equal(x.getPath(), "asdf/asdf/y.xliff");
        
        test.done();
    },
    
    testXliffSetPathInitiallyEmpty: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        test.ok(!x.getPath());
        
        x.setPath("asdf/asdf/y.xliff");
        
        test.equal(x.getPath(), "asdf/asdf/y.xliff");
        
        test.done();
    },
    
    testXliffAddTranslationUnit: function(test) {
        test.expect(6);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
        	source: "Asdf asdf",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java"         	
        });
        
        x.addTranslationUnit(tu);
        
        var tu2 = x.getTranslationUnits({
        	key: "foobar"
        });
        
        test.equal(tu2.source, "Asdf asdf");
        test.equal(tu2.sourceLocale, "en-US");
        test.equal(tu2.targetLocale, "de-DE");
        test.equal(tu2.key, "foobar");
        test.equal(tu2.file, "foo/bar/asdf.java");
       
        test.done();
    },

    testXliffAddMultipleTranslationUnits: function(test) {
        test.expect(6);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
        	source: "Asdf asdf",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java"         	
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
        	source: "baby baby",
        	sourceLocale: "en-US",
        	targetLocale: "fr-FR",
        	key: "huzzah",
        	file: "foo/bar/j.java"         	
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
        	key: "foobar"
        });
        
        test.equal(tu2.source, "Asdf asdf");
        test.equal(tu2.sourceLocale, "en-US");
        test.equal(tu2.targetLocale, "de-DE");
        test.equal(tu2.key, "foobar");
        test.equal(tu2.file, "foo/bar/asdf.java");
       
        test.done();
    },

};