/*
 * testSwiftFile.js - test the Swift file handler object.
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

if (!SwiftFile) {
    var SwiftFile = require("../lib/SwiftFile.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

module.exports = {
    testSwiftFileConstructor: function(test) {
        test.expect(1);

        var j = new SwiftFile();
        test.ok(j);
        
        test.done();
    },
    
    testSwiftFileConstructorParams: function(test) {
        test.expect(1);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p, "./testfiles/swift/PNXStrings.swift");
        
        test.ok(j);
        
        test.done();
    },

    testSwiftFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        test.done();
    },

    testSwiftFileMakeKey: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testSwiftFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "This is a test"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "This is a test");
        test.equal(r[0].getComment(), "translator's comment");
        
        test.done();
    },

    testSwiftFileParseSimpleGetBySource: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        test.done();
    },

    testSwiftFileParseIgnoreEmptyString: function(test) {
        test.expect(3);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("", comment: "translator\'s comment");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseNoComment: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", nil);');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.done();
    },

    testSwiftFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('   NSLocalizedString  (  "This is a test"  ,     "translator\'s comment"   )         ');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        test.done();
    },

    testSwiftFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseMultiple: function(test) {
        test.expect(10);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString("This is also a test", comment: "translator\'s comment 2")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        test.equal(r.getComment(), "translator's comment 2");
        
        test.done();
    },

    testSwiftFileParseMultipleSameLine: function(test) {
        test.expect(10);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment"); a.parse("This is another test."); NSLocalizedString("This is also a test", comment: "translator\'s comment 2")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        test.equal(r.getComment(), "translator's comment 2");
        
        test.done();
    },

    testSwiftFileParseWithDups: function(test) {
        test.expect(7);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test" + " and this isnt", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test" + foobar, comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString(foobar, comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseNonNilComment: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", foobar)');
        
        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseZeroComment: function(test) {
        test.expect(6);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test", 0)');
        
        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString()');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('BANSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseSubobject: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        j.parse('App.NSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseEscapedQuotes: function(test) {
        test.expect(7);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);

        j.parse('NSLocalizedString("This \\\'is\\\' a \\\"test\\\"", comment: "translator\'s \\\'comment\\\'")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This 'is' a \"test\"");
        test.ok(r);
        test.equal(r.getSource(), "This 'is' a \"test\"");
        test.equal(r.getKey(), "This 'is' a \"test\"");
        test.equal(r.getComment(), "translator's 'comment'");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileExtractFile: function(test) {
        test.expect(42);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p, "./swift/PNXStrings.swift");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 10);
        
        var r = set.getBySource("Staff");
        test.ok(r);
        test.equal(r.getSource(), "Staff");
        test.equal(r.getKey(), "Staff");
        test.ok(!r.getComment());

        r = set.getBySource("Patient");
        test.ok(r);
        test.equal(r.getSource(), "Patient");
        test.equal(r.getKey(), "Patient");
        test.ok(!r.getComment());
        
        r = set.getBySource("Left consult");
        test.ok(r);
        test.equal(r.getSource(), "Left consult");
        test.equal(r.getKey(), "Left consult");
        test.ok(!r.getComment());

        r = set.getBySource("Owner");
        test.ok(r);
        test.equal(r.getSource(), "Owner");
        test.equal(r.getKey(), "Owner");
        test.equal(r.getComment(), "Owner of the consult");

        r = set.getBySource("Inviting ...");
        test.ok(r);
        test.equal(r.getSource(), "Inviting ...");
        test.equal(r.getKey(), "Inviting ...");
        test.ok(!r.getComment());

        r = set.getBySource("Joined");
        test.ok(r);
        test.equal(r.getSource(), "Joined");
        test.equal(r.getKey(), "Joined");
        test.ok(!r.getComment());

        r = set.getBySource("Remove");
        test.ok(r);
        test.equal(r.getSource(), "Remove");
        test.equal(r.getKey(), "Remove");
        test.ok(!r.getComment());

        r = set.getBySource("Make owner");
        test.ok(r);
        test.equal(r.getSource(), "Make owner");
        test.equal(r.getKey(), "Make owner");
        test.equal(r.getComment(), " ... of the consult");

        r = set.getBySource("Calling ...");
        test.ok(r);
        test.equal(r.getSource(), "Calling ...");
        test.equal(r.getKey(), "Calling ...");
        test.ok(!r.getComment());

        r = set.getBySource("Call now");
        test.ok(r);
        test.equal(r.getSource(), "Call now");
        test.equal(r.getKey(), "Call now");
        test.ok(!r.getComment());

        test.done();
    },
    
    testSwiftFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testSwiftFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new SwiftFile(p, "./swift/foo.swift");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    }
};