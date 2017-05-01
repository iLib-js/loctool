/*
 * testObjectiveCFile.js - test the Objective C file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ObjectiveCFile) {
    var ObjectiveCFile = require("../lib/ObjectiveCFile.js");
    var ObjectiveCFileType = require("../lib/ObjectiveCFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

var p = new ObjectiveCProject({
	id: "ios",
	sourceLocale: "en-US"
}, "./testfiles", {
	locales:["en-GB"]
});

var ocft = new ObjectiveCFileType(p);

module.exports = {
    testObjectiveCFileConstructor: function(test) {
        test.expect(1);

        var j = new ObjectiveCFile();
        test.ok(j);
        
        test.done();
    },
    
    testObjectiveCFileConstructorParams: function(test) {
        test.expect(1);

        var j = new ObjectiveCFile(p, "./testfiles/objc/t1.m", ocft, ocft);
        
        test.ok(j);
        
        test.done();
    },

    testObjectiveCFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        test.done();
    },

    testObjectiveCFileMakeKey: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testObjectiveCFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")');
        
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

    testObjectiveCFileParseSimpleGetBySource: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        test.done();
    },

    testObjectiveCFileParseIgnoreEmptyString: function(test) {
        test.expect(3);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"", @"translator\'s comment");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseNoComment: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", nil);');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.done();
    },

    testObjectiveCFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('   NSLocalizedString  (  @"This is a test"  ,     @"translator\'s comment"   )         ');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "translator's comment");
        
        test.done();
    },

    testObjectiveCFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testObjectiveCFileParseMultiple: function(test) {
        test.expect(10);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString(@"This is also a test", @"translator\'s comment 2")');
        
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

    testObjectiveCFileParseMultipleSameLine: function(test) {
        test.expect(10);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment"); a.parse("This is another test."); NSLocalizedString(@"This is also a test", @"translator\'s comment 2")');
        
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

    testObjectiveCFileParseWithDups: function(test) {
        test.expect(7);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString(@"This is a test", @"translator\'s comment")');
        
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

    testObjectiveCFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test" + @" and this isnt", @"translator\'s comment")');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test" + foobar, @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(foobar, @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseNonNilComment: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", foobar)');
        
        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testObjectiveCFileParseZeroComment: function(test) {
        test.expect(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", 0)');
        
        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.ok(!r.getComment());
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testObjectiveCFileParseEmptyParams: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('NSLocalizedString()');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseWholeWord: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('BANSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testObjectiveCFileParseSubobject: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        j.parse('App.NSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testObjectiveCFileParseEscapedQuotes: function(test) {
        test.expect(7);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);

        j.parse('NSLocalizedString(@"This \\\'is\\\' a \\\"test\\\"", @"translator\'s \\\'comment\\\'")');
        
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

    testObjectiveCFileExtractFile: function(test) {
        test.expect(42);

        var j = new ObjectiveCFile(p, "./objc/t1.m", ocft, ocft);
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
    
    testObjectiveCFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testObjectiveCFileExtractBogusFile: function(test) {
        test.expect(2);

        var j = new ObjectiveCFile(p, "./objc/foo.m", ocft);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    }
};