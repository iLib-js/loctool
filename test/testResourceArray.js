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
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        test.done();
    },

    testResourceArrayGeneratePseudoRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à ţëšţ");
        test.equal(strings[1], "Ťĥíš íš àľšõ à ţëšţ");
        test.equal(strings[2], "Ťĥíš íš ñõţ");
        
        test.done();
    },

    testResourceArrayGeneratePseudoSkipPercents: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a %s test", "This is also a %f test", "This is not %4$-2.2d"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new ResBundle({
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à %s ţëšţ");
        test.equal(strings[1], "Ťĥíš íš àľšõ à %f ţëšţ");
        test.equal(strings[2], "Ťĥíš íš ñõţ %4$-2.2d");
        
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
        	type: "c",
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
    
    testResourceArrayAddStringReplace: function(test) {
        test.expect(3);

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

        test.equal(ra.get(2), "This is not");

        ra.addString(2, "This isn't a test")
        
        test.equal(ra.get(2), "This isn't a test");
        
        test.done();
    },
    
    testResourceArrayAddStringSize: function(test) {
        test.expect(3);

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

        test.equal(ra.size(), 3);
        
        ra.addString(3, "This is the third one")
        
        test.equal(ra.size(), 4);
        
        test.done();
    },
    
    testResourceArrayAddStringUndefined: function(test) {
        test.expect(3);

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

        test.equal(ra.get(1), "This is also a test");

        ra.addString(1, undefined)
        
        test.equal(ra.get(1), "This is also a test");
        
        test.done();
    },
    
    testResourceArrayAddStringNoIndex: function(test) {
        test.expect(3);

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

        test.equal(ra.size(), 3);

        ra.addString(undefined, "foobar")
        
        test.equal(ra.size(), 3);
        
        test.done();
    },
    
    testResourceArrayAddStringEmpty: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.size(), 0);

        ra.addString(0, "foobar")
        
        test.equal(ra.size(), 1);
        
        test.done();
    },
    
    testResourceArrayAddStringEmptyRightContents: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.ok(!ra.get(0));

        ra.addString(0, "foobar")
        
        test.equal(ra.get(0), "foobar");
        
        test.done();
    },
    
    testResourceArrayAddStringMultiple: function(test) {
        test.expect(6);

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
        ra.addString(4, "This is the fourth one")

        test.equal(ra.get(0), "This is a test");
        test.equal(ra.get(1), "This is also a test");
        test.equal(ra.get(2), "This is not");
        test.equal(ra.get(3), "This is the third one");
        test.equal(ra.get(4), "This is the fourth one");
        
        test.done();
    },
    
    testResourceArrayEquals: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsNot: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "asdf",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },
    
    testResourceArrayEqualsContentDifferent: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "d"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    }
};
