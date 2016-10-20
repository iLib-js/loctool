/*
 * testTranslationUnit.js - test the translation unit object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!TranslationUnit) {
    var TranslationUnit = require("../lib/TranslationUnit.js");
}

module.exports = {
    testTranslationUnitConstructorEmpty: function(test) {
        test.expect(1);

        var tu = new TranslationUnit();
        test.ok(tu);
        
        test.done();
    },
    
    testTranslationUnitConstructorWithRequiredParams: function(test) {
        test.expect(6);

        var tu = new TranslationUnit({
        	 source: "Asdf asdf",
        	 sourceLocale: "en-US",
        	 targetLocale: "de-DE",
        	 key: "foobar",
        	 file: "foo/bar/asdf.java"         	
        });
        test.ok(tu);
        
        test.equal(tu.source, "Asdf asdf");
        test.equal(tu.sourceLocale, "en-US");
        test.equal(tu.targetLocale, "de-DE");
        test.equal(tu.key, "foobar");
        test.equal(tu.file, "foo/bar/asdf.java");
        
        test.done();
    },

    testTranslationUnitConstructorWithAllParams: function(test) {
        test.expect(9);

        var tu = new TranslationUnit({
        	 source: "asdf asdf",
        	 sourceLocale: "en-US",
        	 targetLocale: "de-DE",
        	 key: "foobar",
        	 file: "foo/bar/asdf.java",
        	 target: "german Asdf Asdf",
        	 state: "approved",
        	 comment: "Gut!"
        });
        test.ok(tu);
        
        test.equal(tu.source, "asdf asdf");
        test.equal(tu.sourceLocale, "en-US");
        test.equal(tu.targetLocale, "de-DE");
        test.equal(tu.key, "foobar");
        test.equal(tu.file, "foo/bar/asdf.java");
        test.equal(tu.target, "german Asdf Asdf"),
        test.equal(tu.state, "approved"),
        test.equal(tu.comment, "Gut!")

        test.done();
    },

    testTranslationUnitConstructorMissingRequiredParams: function(test) {
        test.expect(1);

        test.throws(function() {
        	new TranslationUnit({
	        	source: "Asdf asdf",
	        	sourceLocale: "en-US",
	        	targetLocale: "de-DE",
	        	file: "foo/bar/asdf.java"
        	});
        });
        
        test.done();
    }
};