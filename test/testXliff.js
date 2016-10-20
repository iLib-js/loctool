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
    
    testXliffConstructorFull: function(test) {
        test.expect(1);

        var x = new Xliff({
			"tool-id": "loctool",
			"tool-name": "Localization Tool",
			"tool-version": "1.2.34",
			"tool-company": "My Company, Inc.",
			copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
			path: "a/b/c.xliff"
        });
        test.ok(x);
        
        test.equal(x["tool-id"], "loctool");
        test.equal(x["tool-name"], "Localization Tool"),
        test.equal(x["tool-version"], "1.2.34"),
        test.equal(x["tool-company"], "My Company, Inc."),
        test.equal(x.copyright, "Copyright 2016, My Company, Inc. All rights reserved."),
        test.equal(x.path, "a/b/c.xliff");

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
        test.expect(8);

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
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
       
        test.done();
    },

    testXliffSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
        	source: "Asdf asdf",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java"         	
        });
        
        test.equal(x.size(), 0);
        
        x.addTranslationUnit(tu);
        
        test.equal(x.size(), 1);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnits: function(test) {
        test.expect(8);

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
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsRightSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        test.equal(x.size(), 0);
        
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

        test.equal(x.size(), 2);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsOverwrite: function(test) {
        test.expect(9);

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

        // this one has the same source and target locales, key, and file
        // so it should overwrite the one above
        tu = new TranslationUnit({
        	source: "baby baby",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java",
        	coment: "blah blah blah"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
        	key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "baby baby");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
        test.equal(tu2[0].comment, "blah blah blah");
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsOverwriteRightSize: function(test) {
        test.expect(4);

        var x = new Xliff();
        test.ok(x);
        
        test.equal(x.size(), 0);
        
        var tu = new TranslationUnit({
        	source: "Asdf asdf",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java"         	
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.size(), 1);
        
        // this one has the same source and target locales, key, and file
        // so it should overwrite the one above
        tu = new TranslationUnit({
        	source: "baby baby",
        	sourceLocale: "en-US",
        	targetLocale: "de-DE",
        	key: "foobar",
        	file: "foo/bar/asdf.java",
        	coment: "blah blah blah"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.size(), 1);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsNoOverwrite: function(test) {
        test.expect(15);

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

        // this one has a different target locale
        // so it should not overwrite the one above
        tu = new TranslationUnit({
        	source: "Asdf asdf",
        	sourceLocale: "en-US",
        	targetLocale: "fr-FR",
        	key: "foobar",
        	file: "foo/bar/asdf.java",
        	coment: "blah blah blah"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
        	key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 2);
        
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
        test.ok(!tu2[0].comment);

        test.equal(tu2[1].source, "baby baby");
        test.equal(tu2[1].sourceLocale, "en-US");
        test.equal(tu2[1].targetLocale, "fr-FR");
        test.equal(tu2[1].key, "foobar");
        test.equal(tu2[1].file, "foo/bar/asdf.java");
        test.equal(tu2[1].comment, "blah blah blah");

        test.done();
    },

    testXliffGetTranslationUnitsMultiple: function(test) {
        test.expect(8);

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
        	sourceLocale: "en-US"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 2);
        
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");

        test.equal(tu2[1].source, "baby baby");
        test.equal(tu2[1].sourceLocale, "en-US");
        test.equal(tu2[1].targetLocale, "fr-FR");
        test.equal(tu2[1].key, "huzzah");
        test.equal(tu2[1].file, "foo/bar/j.java");

        test.done();
    },

    testXliffSerialize: function(test) {
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

        test.equal(x.serialize(), 
        		'<?xml version="1.0" encoding="UTF-8"?>\n' +
        		'<xliff>\n' +
        		'    <file original="foo/bar/asdf.java" source-language="en-US" target-langauge="de-DE">\n' +
        		'        <trans-unit id="1" resname="foobar">\n' +
        		'            <source>Asdf asdf</source>\n' +
        		'        </trans-unit>\n' +
        		'    </file>\n' + 
        		'    <file original="foo/bar/j.java" source-language="en-US" target-langauge="fr-FR">' +
        		'        <trans-unit id="2" resname="huzzah">\n' +
        		'            <source>baby baby</source>\n' +
        		'        </trans-unit>\n' +
        		'    </file>\n' +
        		'</xliff>');
       
        test.done();
    }
};