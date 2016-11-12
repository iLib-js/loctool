/*
 * testRubyFile.js - test the Ruby file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!RubyFile) {
    var RubyFile = require("../lib/RubyFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testRubyFileConstructor: function(test) {
        test.expect(1);

        var rf = new RubyFile();
        test.ok(rf);
        
        test.done();
    },
    
    testRubyFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p, "./ruby/t1.rb");
        
        test.ok(rf);
        
        test.done();
    },

    testRubyFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        test.done();
    },

    testRubyFileMakeKey: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        test.equal(rf.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testRubyFileMakeKeySimpleTexts1: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Medications in your profile"), "r32020327");
		test.equals(rf.makeKey("All medications"), "r835310324");
		test.equals(rf.makeKey("Conditions"), "r103883086");
		test.equals(rf.makeKey("Symptoms"), "r481086103");
		test.equals(rf.makeKey("Experts"), "r343852585");
        
        test.done();
	},

	testRubyFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Procedures"), "r807691021");
		test.equals(rf.makeKey("Health Apps"), "r941505899");
		test.equals(rf.makeKey("Conditions in your profile"), "r240633868");
		test.equals(rf.makeKey("Treatment Reviews"), "r795086964");
		test.equals(rf.makeKey("Answers"), "r221604632");
        
        test.done();
	},

	testRubyFileMakeKeySimpleTexts3: function(test) {
        test.expect(11);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Private Health Profile"), "r669315500");
		test.equals(rf.makeKey("People you care for"), "r710774033");
		test.equals(rf.makeKey("Notifications"), "r284964820");
		test.equals(rf.makeKey("News"), "r613036745");
		test.equals(rf.makeKey("More Tips"), "r216617786");
		test.equals(rf.makeKey("Goals"), "r788359072");
		test.equals(rf.makeKey("Referral Link"), "r140625167");
		test.equals(rf.makeKey("Questions"), "r256277957");
		test.equals(rf.makeKey("Private consults"), "r18128760");
		test.equals(rf.makeKey("Suggested doctors for you"), "r584966709");
        
        test.done();
	},

	testRubyFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Can\'t find treatment id"), "r926831062");
		test.equals(rf.makeKey("Can\'t find an application for SMS"), "r909283218");
        
        test.done();
	},
	
	testRubyFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("{topic_name}({topic_generic_name})"), "r382554039");
		test.equals(rf.makeKey("{doctor_name}, {sharer_name} {start}found this helpful{end}"), "r436261634");
		test.equals(rf.makeKey("{sharer_name} {start}found this helpful{end}"), "r858107784");
		test.equals(rf.makeKey("Grow your Care-Team"), "r522565682");
		test.equals(rf.makeKey("Failed to send connection request!"), "r1015770123");
		test.equals(rf.makeKey("{goal_name} Goals"), "r993422001");
		test.equals(rf.makeKey("Referral link copied!"), "r201354363");
        
        test.done();
	},

    testRubyFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        test.equal(rf.makeKey("This is a test"), "r654479252");
        test.equal(rf.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testRubyFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("r654479252");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testRubyFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testRubyFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },


    testRubyFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        rf.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testRubyFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("foobar");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "foobar");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testRubyFileParseWithKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test", "unique_id")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testRubyFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test", "unique_id")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testRubyFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        
        test.done();
    },

    testRubyFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("x");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "x");
        
        r = set.get("y");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "y");
        
        test.done();
    },

    testRubyFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "foo");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testRubyFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("asdf");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "asdf");
        test.equal(r.getComment(), "foo");
        
        r = set.get("kdkdkd");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "kdkdkd");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testRubyFileParseWithDups: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testRubyFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = rf.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString("This is a test" + foobar);');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString(foobar);');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('RB.getString();');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('EPIRB.getString("This is a test");');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseSubobject: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('App.RB.getString("This is a test");');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileExtractFile: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p, "./ruby/t1.rb");
        test.ok(rf);
        
        // should read the file
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = set.get("id1");
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");
        
        test.done();
    },
    
    testRubyFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        // should attempt to read the file and not fail
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p, "./ruby/foo.rb");
        test.ok(rf);
        
        // should attempt to read the file and not fail
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

};