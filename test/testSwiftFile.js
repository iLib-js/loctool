/*
 * testSwiftFile.js - test the Swift file handler object.
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

if (!SwiftFile) {
    var SwiftFile = require("../lib/SwiftFile.js");
    var SwiftFileType = require("../lib/SwiftFileType.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

var p = new SwiftProject({
	sourceLocale: "en-US"
}, "./testfiles");

var sft = new SwiftFileType(p);

module.exports = {
    testSwiftFileConstructor: function(test) {
        test.expect(1);

        var j = new SwiftFile();
        test.ok(j);
        
        test.done();
    },
    
    testSwiftFileConstructorParams: function(test) {
        test.expect(1);

        var j = new SwiftFile(p, "./testfiles/swift/PNXStrings.swift", sft);
        
        test.ok(j);
        
        test.done();
    },

    testSwiftFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        test.done();
    },

    testSwiftFileMakeKey: function(test) {
        test.expect(2);
        
        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testSwiftFileMakeKeyCleaned: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        test.equal(j.makeKey("   This\t is\n a test.   "), "This is a test.");
        
        test.done();
    },

    testSwiftFileMakeKeyUnescapeQuotes: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        test.equal(j.makeKey("This \\\"is\\\" \\'a test\\'."), "This \"is\" 'a test'.");
        
        test.done();
    },

    testSwiftFileMakeKeyUnescapeBackslash: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        test.equal(j.makeKey("This \\\\is a test."), "This \\is a test.");
        
        test.done();
    },

    testSwiftFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('NSLocalizedString("", comment: "translator\'s comment");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseNoComment: function(test) {
        test.expect(6);

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('   NSLocalizedString  (  "This is a test"  ,  comment:   "translator\'s comment"   )         ');
        
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test" + " and this isnt", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('NSLocalizedString("This is a test" + foobar, comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('NSLocalizedString(foobar, comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseNonNilComment: function(test) {
        test.expect(6);

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
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

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('NSLocalizedString()');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseWholeWord: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('BANSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testSwiftFileParseSubobject: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        j.parse('App.NSLocalizedString("This is a test", comment: "translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testSwiftFileParseEscapedQuotes: function(test) {
        test.expect(7);

        var j = new SwiftFile(p, undefined, sft);
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
        test.expect(26);

        var j = new SwiftFile(p, "./swift/PNXStrings.swift", sft);
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 27);
        
        var r = set.getBySource("Options");
        test.ok(r);
        test.equal(r.getSource(), "Options");
        test.equal(r.getKey(), "Options");
        test.equal(r.getComment(), "Add Action sheet message");

        r = set.getBySource("Error logging out");
        test.ok(r);
        test.equal(r.getSource(), "Error logging out");
        test.equal(r.getKey(), "Error logging out");
        test.equal(r.getComment(), "Error logging out title");
        
        r = set.getBySource("Reason for visit");
        test.ok(r);
        test.equal(r.getSource(), "Reason for visit");
        test.equal(r.getKey(), "Reason for visit");
        test.equal(r.getComment(), "appointment table view section header");

        r = set.getBySource("You have no upcoming appointments right now. Consider spending your free time sharing a smile with someone.");
        test.ok(r);
        test.equal(r.getSource(), "You have no upcoming appointments right now. Consider spending your free time sharing a smile with someone.");
        test.equal(r.getKey(), "You have no upcoming appointments right now. Consider spending your free time sharing a smile with someone.");
        test.equal(r.getComment(), "message subheader shown when no appointments in get help feed");

        r = set.getBySource("Login");
        test.ok(r);
        test.equal(r.getSource(), "Login");
        test.equal(r.getKey(), "Login");
        test.ok(!r.getComment()); // it's there, but a zero-length string, so it should say there is no comment

        r = set.getBySource("Save time");
        test.ok(r);
        test.equal(r.getSource(), "Save time");
        test.equal(r.getKey(), "Save time");
        test.ok(!r.getComment());

        test.done();
    },
    
    testSwiftFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, undefined, sft);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testSwiftFileExtractBogusFile: function(test) {
        test.expect(2);

        var j = new SwiftFile(p, "./swift/foo.swift", sft);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    }
};