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
        
        var rf = new RubyFile(p, "./ruby/external_user_metric.rb");
        
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
        
        test.equal(rf.makeKey("This is a test"), "This_is_a_test");
        
        test.done();
    },

    testRubyFileMakeKeyCompressUnderscores: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Medications    in $$$  your profile"), "Medications_in_your_profile");
        
        test.done();
	},

	testRubyFileMakeKeyCompressUnderscores2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);

        test.equals(rf.makeKey("Terms___and___Conditions"), "Terms_and_Conditions");
        
        test.done();
	},

    testRubyFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("This_is_a_test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
        test.done();
    },

    testRubyFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
        test.done();
    },

    testRubyFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("")');
        
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
        
        rf.parse('   Rb.t  (    \t "This is a test"    );  ');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
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

        rf.parse('Rb.t("This is a test")');
        
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
        
        rf.parse('\tRb.t("This is a test"); # i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testRubyFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This_is_also_a_test");
        
        test.done();
    },

    testRubyFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");\t# i18n: bar');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        test.equal(r.getComment(), "foo");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This_is_also_a_test");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testRubyFileParseMultipleWithParametersAndComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test", "asdf");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test", "kdkdkd");\t# i18n: bar');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        test.equal(r.getComment(), "foo");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This_is_also_a_test");
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
        
        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is a test");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p);
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test" + " and this isnt");');
        
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
        
        rf.parse('Rb.t("This is a test" + foobar);');
        
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
        
        rf.parse('Rb.t(foobar);');
        
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
        
        rf.parse('Rb.t();');
        
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
        
        rf.parse('EPIRb.t("This is a test");');
        
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
        
        rf.parse('App.Rb.t("This is a test");');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileExtractFile: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p, "./ruby/external_user_metric.rb");
        test.ok(rf);
        
        // should read the file
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 13);
        
        var r = set.getBySource("Noted that person %{person_id} has %{source} installed");
        test.ok(r);
        test.equal(r.getSource(), "Noted that person %{person_id} has %{source} installed");
        test.equal(r.getKey(), "Noted_that_person_person_id_has_source_installed");
        
        r = set.getBySource("data is missing or empty.");
        test.ok(r);
        test.equal(r.getSource(), "data is missing or empty.");
        test.equal(r.getKey(), "data_is_missing_or_empty");
        
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