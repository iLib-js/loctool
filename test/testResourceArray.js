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
        	key: "asdf",
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
        	key: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.getKey(), "asdf");
        test.deepEqual(ra.getArray(), ["This is a test", "This is also a test", "This is not"]);
        test.equal(ra.locale, "de-DE");
        test.equal(ra.pathName, "a/b/c.java");
        
        test.done();
    },

    testResourceArrayConstructorRightSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            locale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.size(), 3);
        
        test.done();
    },

    testResourceArrayGetKey: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getKey(), "foo");
        
        test.done();
    },

    testResourceArrayGetKeyEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.ok(!ra.getKey());
        
        test.done();
    },

    testResourceStringGetContext: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
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
            key: "foo",
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
            key: "foo",
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
            key: "foo",
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
            key: "foo",
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
            key: "foo",
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
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(2.6));
        
        test.done();
    },
    
    testResourceArrayGeneratePseudo: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        test.done();
    },

    testResourceArrayGeneratePseudoRightString: function(test) {
        test.expect(6);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à ţëšţ");
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo(undefined, rb);
        test.ok(!ra2);
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = ra.generatePseudo("de-DE", undefined);

        test.ok(!ra2);
        
        test.done();
    },
    
    testResourceArrayClone: function(test) {
        test.expect(10);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        var ra2 = ra.clone();
        
        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.locale, ra.locale);
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.array, ra.array);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, ra.state);
        
        test.done();
    },
    
    testResourceArrayCloneWithOverrides: function(test) {
        test.expect(10);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        var ra2 = ra.clone({
        	locale: "fr-FR",
        	state: "asdfasdf"
        });
        
        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.locale, "fr-FR");
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.array, ra.array);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, "asdfasdf");
        
        test.done();
    },
    
    testResourceArrayAddString: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        ra.addString(3, "This is the third one")
        
        test.equal(ra.get(3), "This is the third one");
        
        test.done();
    },
    
    testResourceArrayAddString: function(test) {
        test.expect(10);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        ra.addString(3, "This is the third one")
        
        test.equal(ra.get(3), "This is the third one");
        
        test.done();
    }
};
