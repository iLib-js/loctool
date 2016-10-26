/*
 * testResourceString.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceString) {
    var ResourceString = require("../lib/ResourceString.js");
    var ilib = require("ilib");
    var ResBundle = require("ilib/lib/ResBundle");
}

module.exports = {
    testResourceStringConstructorEmpty: function(test) {
        test.expect(1);

        var rs = new ResourceString();
        test.ok(rs);
        
        test.done();
    },
    
	testResourceStringConstructorNoProps: function(test) {
	    test.expect(1);
	
	    var rs = new ResourceString({});
	    test.ok(rs);
	    
	    test.done();
	},
	
    testResourceStringConstructor: function(test) {
        test.expect(1);

        var rs = new ResourceString({
        	key: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        test.done();
    },

    testResourceStringConstructorWithContext: function(test) {
        test.expect(1);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.java",
            context: "landscape"
        });
        test.ok(rs);
        
        test.done();
    },

    testResourceStringConstructorRightContents: function(test) {
        test.expect(5);

        var rs = new ResourceString({
        	key: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        test.equal(rs.getKey(), "asdf");
        test.equal(rs.getSource(), "This is a test");
        test.equal(rs.locale, "de-DE");
        test.equal(rs.pathName, "a/b/c.java");
        
        test.done();
    },
    
    testResourceStringGetKey: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getKey(), "foo");
        
        test.done();
    },

    testResourceStringAutoKey: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            autoKey: true,
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.ok(rs.getAutoKey());
        
        test.done();
    },

    testResourceStringNotAutoKey: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.ok(!rs.getAutoKey());
        
        test.done();
    },

    testResourceStringGetKeyEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getKey());
        
        test.done();
    },

    testResourceStringGetContext: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE",
            context: "landscape"
        });
        test.ok(rs);
        test.equal(rs.getContext(), "landscape");
        
        test.done();
    },

    testResourceStringGetContextEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.ok(!rs.getContext());
        
        test.done();
    },

    testResourceStringGetSource: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getSource(), "source string");
        
        test.done();
    },

    testResourceStringSize: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        
        test.ok(rs);
        test.equal(rs.size(), 1); // should always be 1
        
        test.done();
    },

    testResourceStringGetSourceEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getSource());
        
        test.done();
    },
    
    testResourceStringGeneratePseudo: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX", // the pseudo-locale!
            type: "c"
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        
        test.done();
    },

    testResourceStringGeneratePseudoRightString: function(test) {
        test.expect(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX", // the pseudo-locale!
            type: "c"
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getSource(), "Ťĥíš íš à ţëšţ");
        
        test.done();
    },

    testResourceStringGeneratePseudoSkipPercents: function(test) {
        test.expect(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This %2$-2.2s is a %s test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getSource(), "Ťĥíš %2$-2.2s íš à %s ţëšţ");
        
        test.done();
    },

    testResourceStringGeneratePseudoSkipPercentsAndReplacements: function(test) {
        test.expect(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This %2$-2.2s is a %s {foobar} test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getSource(), "Ťĥíš %2$-2.2s íš à %s {foobar} ţëšţ");
        
        test.done();
    },

    testResourceStringGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
        	type: "c",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var rs2 = rs.generatePseudo(undefined, rb);

        test.ok(!rs2);
        
        test.done();
    },

    testResourceStringGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rs2 = rs.generatePseudo("de-DE", undefined);

        test.ok(!rs2);
        
        test.done();
    },
    
    testResourceStringClone: function(test) {
        test.expect(10);

        var rs = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
        	pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rs);

        var rs2 = rs.clone();
        
        test.ok(rs2);
        test.equal(rs2.project, rs.project);
        test.equal(rs2.context, rs.context);
        test.equal(rs2.locale, rs.locale);
        test.equal(rs2.reskey, rs.reskey);
        test.deepEqual(rs2.text, rs.text);
        test.equal(rs2.pathName, rs.pathName);
        test.equal(rs2.comment, rs.comment);
        test.equal(rs2.state, rs.state);
        
        test.done();
    },
    
    testResourceStringCloneWithOverrides: function(test) {
        test.expect(10);

        var rs = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
        	source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rs);

        var rs2 = rs.clone({
        	locale: "fr-FR",
        	state: "asdfasdf"
        });
        
        test.ok(rs2);
        test.equal(rs2.project, rs.project);
        test.equal(rs2.context, rs.context);
        test.equal(rs2.locale, "fr-FR");
        test.equal(rs2.reskey, rs.reskey);
        test.deepEqual(rs2.text, rs.text);
        test.equal(rs2.pathName, rs.pathName);
        test.equal(rs2.comment, rs.comment);
        test.equal(rs2.state, "asdfasdf");
        
        test.done();
    },
    
    testResourceStringEquals: function(test) {
        test.expect(3);

        var ra1 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceStringEqualsNot: function(test) {
        test.expect(3);

        var ra1 = new ResourceString({
        	project: "foo",
        	context: "asdf",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceStringEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

        var ra1 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },
    
    testResourceStringEqualsContentDifferent: function(test) {
        test.expect(3);

        var ra1 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceString({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            source: "This is not a test",
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
