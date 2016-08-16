/*
 * testResourceString.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceString) {
    var ResourceString = require("../lib/ResourceString.js");
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
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        test.done();
    },
    
    testResourceStringConstructorRightContents: function(test) {
        test.expect(5);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        test.equal(rs.getId(), "asdf");
        test.equal(rs.getSource(), "This is a test");
        test.equal(rs.locale, "de-DE");
        test.equal(rs.pathName, "a/b/c.java");
        
        test.done();
    },
    
        testResourceStringGetId: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getId(), "foo");
        
        test.done();
    },

    testResourceStringGetIdEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getId());
        
        test.done();
    },

    testResourceStringGetSource: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getSource(), "source string");
        
        test.done();
    },

    testResourceStringGetSourceEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getSource());
        
        test.done();
    },

    testResourceStringGetSource: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getSource(), "source string");
        
        test.done();
    },
    
    testResourceAddTranslation: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", "Dies ist einem Test.");
        
        test.equal(rs.getTranslation("de-DE"), "Dies ist einem Test.");
        
        test.done();
    },

    testResourceAddTranslationEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", undefined);
        
        test.ok(!rs.getTranslation("de-DE"));
        
        test.done();
    },

    testResourceAddTranslationNoLocale: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation(undefined, "foo");
        
        test.ok(rs);
        
        test.done();
    },

    testResourceGetTranslationEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        test.ok(!rs.getTranslation("de-DE"));
        
        test.done();
    },

    testResourceAddTranslationMultiple: function(test) {
        test.expect(3);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", "Dies ist einem Test.");
        rs.addTranslation("fr-FR", "Ceci est une teste.");
        
        test.equal(rs.getTranslation("de-DE"), "Dies ist einem Test.");
        test.equal(rs.getTranslation("fr-FR"), "Ceci est une teste.");
        
        test.done();
    },

    testResourceAddTranslationClear: function(test) {
        test.expect(3);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", "Dies ist einem Test.");
        
        test.equal(rs.getTranslation("de-DE"), "Dies ist einem Test.");

        rs.addTranslation("de-DE", undefined);
        
        test.ok(!rs.getTranslation("de-DE"));

        test.done();
    },

    testResourceGetTranslatedResource: function(test) {
        test.expect(6);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", "Dies ist einem Test.");
        
        var rs2 = rs.getTranslatedResource("de-DE");
        
        test.ok(rs2);
        test.equal(rs2.getId(), "asdf");
        test.equal(rs2.getSource(), "Dies ist einem Test.");
        test.equal(rs.locale, "de-DE");
        test.equal(rs.pathName, "a/b/c.java");
                
        test.done();
    },

    testResourceGetTranslatedResourceNoTranslation: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        var rs2 = rs.getTranslatedResource("de-DE");
        
        test.ok(!rs2);
                
        test.done();
    },

    testResourceGetTranslationLocales: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", "Dies ist einem Test.");
        rs.addTranslation("fr-FR", "Ceci est une teste.");
        
        test.deepEqual(rs.getTranslationLocales(), ["de-DE", "fr-FR"]);
                
        test.done();
    },

    testResourceGetTranslationLocalesNoTranslations: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
    
        test.deepEqual(rs.getTranslationLocales(), []);
                
        test.done();
    },
    
    testResourceMerge: function(test) {
        test.expect(3);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rs2 = new ResourceString({
        	id: "asdf",
        	source: "Dies ist einem Test.",
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(rs2);
        
        rs.merge(rs2);
        
        test.equal(rs.getTranslation("de-DE"), "Dies ist einem Test.");
        
        test.done();
    },

    testResourceMergeEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
                
        rs.merge();
        
        test.ok(rs);
        
        test.done();
    },

    testResourceMergeSame: function(test) {
        test.expect(4);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rs2 = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs2);
        
        rs.merge(rs2);
        
        test.ok(rs);
        test.ok(rs2);
        
        test.done();
    },

    testResourceMergeDup: function(test) {
        test.expect(3);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	locale: "en-US",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rs2 = new ResourceString({
        	id: "asdf",
        	source: "Dies ist einem Test.",
        	locale: "en-US",
        	pathName: "a/b/c.java"
        });
        test.ok(rs2);
        
        test.throws(function() {
        	rs.merge(rs2);
        });
        
        test.done();
    },

    testResourceMergeDupNoLocales: function(test) {
        test.expect(3);

        var rs = new ResourceString({
        	id: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java"
        });
        test.ok(rs);
        
        var rs2 = new ResourceString({
        	id: "asdf",
        	source: "Dies ist einem Test.",
        	pathName: "a/b/c.java"
        });
        test.ok(rs2);
        
        test.throws(function() {
        	rs.merge(rs2);
        });
        
        test.done();
    },

};
