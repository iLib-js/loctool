/*
 * testJavaScriptFile.js - test the JavaScript file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptFile) {
    var JavaScriptFile = require("../lib/JavaScriptFile.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJavaScriptFileConstructor: function(test) {
        test.expect(1);

        var j = new JavaScriptFile();
        test.ok(j);
        
        test.done();
    },
    
    testJavaScriptFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p, "./testfiles/js/t1.js");
        
        test.ok(j);
        
        test.done();
    },

    testJavaScriptFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        test.done();
    },

    testJavaScriptFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testJavaScriptFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "This is a test"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "This is a test");
        
        test.done();
    },

    testJavaScriptFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testJavaScriptFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },


    testJavaScriptFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaScriptFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testJavaScriptFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "foobar"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "foobar");
        test.equal(r[0].getComment(), "this is a translator's comment");
        
        test.done();
    },

    testJavaScriptFileParseWithKey: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "unique_id"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "unique_id");
        
        test.done();
    },

    testJavaScriptFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testJavaScriptFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        
        test.done();
    },

    testJavaScriptFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "x"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "x");
        
        r = set.getBy({
        	reskey: "y"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "y");
        
        test.done();
    },

    testJavaScriptFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "foo");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testJavaScriptFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "asdf"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "asdf");
        test.equal(r[0].getComment(), "foo");
        
        r = set.getBy({
        	reskey: "kdkdkd"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is also a test");
        test.equal(r[0].getKey(), "kdkdkd");
        test.equal(r[0].getComment(), "bar");
        
        test.done();
    },

    testJavaScriptFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaScriptFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBy({
        	reskey: "unique_id"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "unique_id");
        
        test.done();
    },

    testJavaScriptFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaScriptFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaScriptFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString(foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaScriptFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('RB.getString();');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaScriptFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('EPIRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaScriptFileParseSubobject: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        j.parse('App.RB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaScriptFileExtractFile: function(test) {
        test.expect(8);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p, "./js/t1.js");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        var r = set.getBy({
        	reskey: "id1"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test with a unique id");
        test.equal(r[0].getKey(), "id1");
        
        test.done();
    },
    
    testJavaScriptFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testJavaScriptFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaScriptFile(p, "./java/foo.js");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    }
};