/*
 * testResourceArray.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceArray) {
    var ResourceArray = require("../lib/ResourceArray.js");
    var ilib = require("ilib");
    var ResBundle = require("ilib/lib/ResBundle");
}

module.exports = {
    testResourceArrayConstructorEmpty: function(test) {
        test.expect(1);

        var ra = new ResourceArray();
        test.ok(ra);
        
        test.done();
    },
    
	testResourceArrayConstructorNoProps: function(test) {
	    test.expect(1);
	
	    var ra = new ResourceArray({});
	    test.ok(ra);
	    
	    test.done();
	},
	
    testResourceArrayConstructorEmptyNoSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.equal(ra.size(), 0);
        
        test.done();
    },

    testResourceArrayConstructor: function(test) {
        test.expect(1);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        test.done();
    },
    
    testResourceArrayConstructorRightContents: function(test) {
        test.expect(5);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.getId(), "asdf");
        test.deepEqual(ra.getArray(), ["This is a test", "This is also a test", "This is not"]);
        test.equal(ra.locale, "de-DE");
        test.equal(ra.pathName, "a/b/c.java");
        
        test.done();
    },

    testResourceArrayConstructorRightSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            locale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.size(), 3);
        
        test.done();
    },

    testResourceArrayGetId: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getId(), "foo");
        
        test.done();
    },

    testResourceArrayGetIdEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.ok(!ra.getId());
        
        test.done();
    },

    testResourceStringGetContext: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE",
            context: "landscape"
        });
        test.ok(ra);
        test.equal(ra.getContext(), "landscape");
        
        test.done();
    },

    testResourceStringGetContextEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getContext());
        
        test.done();
    },

    testResourceArrayGetArray: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.deepEqual(ra.getArray(), ["This is a test", "This is also a test", "This is not"]);
        
        test.done();
    },

    testResourceArrayGetArrayEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.deepEqual(ra.getArray(), []);
        
        test.done();
    },

    testResourceArrayGet: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.get(0), "This is a test");
        test.equal(ra.get(1), "This is also a test");
        test.equal(ra.get(2), "This is not");
        
        test.done();
    },

    testResourceArrayGetNegativeIndex: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(-1));
        
        test.done();
    },

    testResourceArrayGetIndexTooBig: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(6));
        
        test.done();
    },

    testResourceArrayGetIndexNotWhole: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            id: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(2.6));
        
        test.done();
    },

    testResourceArrayAddTranslation: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", "Dies ist einem Test.");
        
        test.equal(ra.getTranslation(0, "de-DE"), "Dies ist einem Test.");
        
        test.done();
    },

    testResourceArrayAddTranslationEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", undefined);
        
        test.ok(!ra.getTranslation(0, "de-DE"));
        
        test.done();
    },

    testResourceArrayAddTranslationNoLocale: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, undefined, "foo");
        
        test.ok(ra);
        
        test.done();
    },

    testResourceArrayGetTranslationEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.ok(!ra.getTranslation(0, "de-DE"));
        
        test.done();
    },

    testResourceArrayAddTranslationMultiple: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", "Dies ist einem Test.");
        ra.addTranslation(0, "fr-FR", "Ceci est une teste.");
        
        test.equal(ra.getTranslation(0, "de-DE"), "Dies ist einem Test.");
        test.equal(ra.getTranslation(0, "fr-FR"), "Ceci est une teste.");
        
        test.done();
    },

    testResourceArrayAddTranslationClear: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", "Dies ist einem Test.");
        
        test.equal(ra.getTranslation(0, "de-DE"), "Dies ist einem Test.");

        ra.addTranslation(0, "de-DE", undefined);
        
        test.ok(!ra.getTranslation("de-DE"));

        test.done();
    },

    testResourceArrayGetTranslatedResource: function(test) {
        test.expect(6);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", "Dies ist einem Test.");
        
        var ra2 = ra.getTranslatedResource("de-DE");
        
        test.ok(ra2);
        test.equal(ra2.getId(), "asdf");
        test.deepEqual(ra2.getArray(), ["Dies ist einem Test.", null, null]);
        test.equal(ra2.locale, "de-DE");
        test.equal(ra2.pathName, "a/b/c.java");
                
        test.done();
    },

    testResourceArrayGetTranslatedResourceNoTranslation: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        var ra2 = ra.getTranslatedResource("de-DE");
        
        test.ok(ra2);
        test.deepEqual(ra2.getArray(), [null, null, null]);
                
        test.done();
    },

    testResourceArrayGetTranslationLocales: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        ra.addTranslation(0, "de-DE", "Dies ist einem Test.");
        ra.addTranslation(0, "fr-FR", "Ceci est une teste.");
        
        test.deepEqual(ra.getTranslationLocales(), ["de-DE", "fr-FR"]);
                
        test.done();
    },

    testResourceArrayGetTranslationLocalesNoTranslations: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.deepEqual(ra.getTranslationLocales(), []);
                
        test.done();
    },
    
    testResourceArrayMerge: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = new ResourceArray({
        	id: "asdf",
        	array: ["Dies ist einem Test.", "Dies ist auch einem Test.", "Dieser ist nicht."],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra2);
        
        ra.merge(ra2);
        
        test.equal(ra.getTranslation(0, "de-DE"), "Dies ist einem Test.");
        
        test.done();
    },

    testResourceArrayMergeEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
                
        ra.merge();
        
        test.ok(ra);
        
        test.done();
    },

    testResourceArrayMergeSame: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra2);
        
        ra.merge(ra2);
        
        test.ok(ra);
        test.ok(ra2);
        
        test.done();
    },

    testResourceArrayMergeDup: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test"],
        	locale: "en-US",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = new ResourceArray({
        	id: "asdf",
        	array: ["Dies ist einem Test."],
        	locale: "en-US",
        	pathName: "a/b/c.java"
        });
        test.ok(ra2);
        
        test.throws(function() {
        	ra.merge(ra2);
        });
        
        test.done();
    },

    testResourceArrayMergeDupNoLocales: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	id: "asdf",
        	array: ["This is a test"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = new ResourceArray({
        	id: "asdf",
        	array: ["Dies ist einem Test."],
        	pathName: "a/b/c.java"
        });
        test.ok(ra2);
        
        test.throws(function() {
        	ra.merge(ra2);
        });
        
        test.done();
    },

    testResourceArrayGeneratePseudo: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.ok(!ra.getTranslation(0, "de-DE"));
        
        ra.generatePseudo("de-DE", rb);

        test.ok(ra.getTranslation(0, "de-DE"));
        
        test.done();
    },

    testResourceArrayGeneratePseudoRightString: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.ok(!ra.getTranslation(0, "de-DE"));
        
        ra.generatePseudo("de-DE", rb);

        var t = ra.getTranslation(0, "de-DE");
        test.ok(t);
        test.equal(t, "Ťĥíš íš à ţëšţ");
        
        test.done();
    },

    testResourceArrayGeneratePseudoAddToLocales: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.deepEqual(ra.getTranslationLocales(), []);
        
        ra.generatePseudo("de-DE", rb);

        test.deepEqual(ra.getTranslationLocales(), ["de-DE"]);
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadLocale: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.deepEqual(ra.getTranslationLocales(), []);
        
        ra.generatePseudo(undefined, rb);

        test.deepEqual(ra.getTranslationLocales(), []);
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadBundle: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            id: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        test.deepEqual(ra.getTranslationLocales(), []);
        
        ra.generatePseudo("de-DE", undefined);

        test.ok(!ra.getTranslation("de-DE"));
        test.deepEqual(ra.getTranslationLocales(), []);
        
        test.done();
    }
};
