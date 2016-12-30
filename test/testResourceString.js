/*
 * testResourceString.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceString) {
    var ResourceString = require("../lib/ResourceString.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
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
    
    testResourceStringConstructorDefaults: function(test) {
        test.expect(6);

        var rs = new ResourceString({
        	key: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        // got the right one?
        test.equal(rs.getKey(), "asdf");
        
        // now the defaults
        test.equal(rs.locale, "en-US");
        test.equal(rs.origin, "source");
        test.equal(rs.datatype, "plaintext");
        test.equal(rs.resType, "string");
        
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

    testResourceStringGeneratePseudoSkipEmbeddedHTML: function(test) {
        test.expect(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This <span class=\"foobar\">is a</span> test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
        	type: "html",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getSource(), "Ťĥíš <span class=\"foobar\">íš à</span> ţëšţ");
        
        test.done();
    },

    testResourceStringGeneratePseudoSkipEmbeddedXML: function(test) {
        test.expect(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This <%= a ? \"foo\" : \"bar\" %> is a test",
            pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rb = new ResBundle({
        	type: "html",
            locale: "zxx-XX" // the pseudo-locale!
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getSource(), "Ťĥíš <%= a ? \"foo\" : \"bar\" %> íš à ţëšţ");
        
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
    },
    
    testResourceStringGetOrigin: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE",
            origin: "target"
        });
        
        test.ok(rs);
        test.equal(rs.getOrigin(), "target");
        
        test.done();
    },

    testResourceStringGetOriginDefault: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        
        test.ok(rs);
        test.equal(rs.getOrigin(), "source");
        
        test.done();
    },

    testResourceStringStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ResourceString.hashKey("ht-iosapp", "de-DE", "This is a test"), "rs_ht-iosapp_de-DE_This is a test");
        
        test.done();
    },

    testResourceStringStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ResourceString.hashKey(undefined, "de-DE", undefined), "rs__de-DE_");
        
        test.done();
    },

    testResourceStringHashKey: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	project: "ht-iosapp",
        	key: "This is a test",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        test.equal(rs.hashKey(), "rs_ht-iosapp_de-DE_This is a test");
        
        test.done();
    },
    
    testContextResourceStringStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ContextResourceString.hashKey("ht-iosapp", "foobar", "de-DE", "This is a test"), "ars_ht-iosapp_foobar_de-DE_This is a test");
        
        test.done();
    },

    testContextResourceStringStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ContextResourceString.hashKey(undefined, undefined, "de-DE", undefined), "ars___de-DE_");
        
        test.done();
    },

    testContextResourceStringHashKey: function(test) {
        test.expect(2);

        var rs = new ContextResourceString({
        	project: "ht-iosapp",
        	context: "foobar",
        	key: "This is a test",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        test.equal(rs.hashKey(), "ars_ht-iosapp_foobar_de-DE_This is a test");
        
        test.done();
    },

    testIosLayoutResourceStringStaticHashKey: function(test) {
        test.expect(1);

        test.equal(IosLayoutResourceString.hashKey("ht-iosapp", "de-DE", "a/b/es.lproj/foo.xib", "This is a test"), "irs_ht-iosapp_de-DE_a/b/es.lproj/foo.xib_This is a test");
        
        test.done();
    },

    testIosLayoutResourceStringStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(IosLayoutResourceString.hashKey(undefined, undefined, "de-DE", undefined), "irs___de-DE_");
        
        test.done();
    },

    testIosLayoutResourceStringHashKey: function(test) {
        test.expect(2);

        var rs = new IosLayoutResourceString({
        	project: "ht-iosapp",
        	context: "foobar",
        	key: "This is a test",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/es.lproj/foo.xib"
        });
        test.ok(rs);
        
        test.equal(rs.hashKey(), "irs_ht-iosapp_de-DE_a/b/es.lproj/foo.xib_This is a test");
        
        test.done();
    }
};
