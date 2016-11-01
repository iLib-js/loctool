/*
 * testIosStringsFile.js - test the Objective C file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!IosStringsFile) {
    var IosStringsFile = require("../lib/IosStringsFile.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

module.exports = {
    testIosStringsFileConstructor: function(test) {
        test.expect(1);

        var j = new IosStringsFile();
        test.ok(j);
        
        test.done();
    },
    
    testIosStringsFileConstructorParams: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p, "./testfiles/objc/Base.lproj/Localizable.strings");
        
        test.ok(j);
        
        test.done();
    },

    testIosStringsFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        test.done();
    },

    testIosStringsFileMakeKey: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testIosStringsFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('/* Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb"; */\n' +
        		'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get("2V9-YN-vxb.normalTitle");
        test.ok(r);
        
        test.equal(r.getSource(), "Terms");
        test.equal(r.getKey(), "2V9-YN-vxb.normalTitle");
        
        test.done();
    },

    testIosStringsFileParseSimpleGetBySource: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
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

    testIosStringsFileParseNoComment: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
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

    testIosStringsFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
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


    testIosStringsFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testIosStringsFileParseMultiple: function(test) {
        test.expect(10);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString(@"This is a also test", @"translator\'s comment 2")');
        
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

    testIosStringsFileParseWithDups: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
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

    testIosStringsFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test" + @" and this isnt", @"translator\'s comment")');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testIosStringsFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString(@"This is a test" + foobar, @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testIosStringsFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString(foobar, @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testIosStringsFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('NSLocalizedString()');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testIosStringsFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('BANSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testIosStringsFileParseSubobject: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        j.parse('App.NSLocalizedString(@"This is a test", @"translator\'s comment")');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testIosStringsFileExtractFile: function(test) {
        test.expect(42);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p, "./objc/t1.m");
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
    
    testIosStringsFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testIosStringsFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new IosStringsFile(p, "./objc/foo.m");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    }
};