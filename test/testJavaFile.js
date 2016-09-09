/*
 * testJavaFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaFile) {
    var JavaFile = require("../lib/JavaFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testJavaFileConstructor: function(test) {
        test.expect(1);

        var j = new JavaFile();
        test.ok(j);
        
        test.done();
    },
    
    testJavaFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p, "./testfiles/java/t1.java");
        
        test.ok(j);
        
        test.done();
    },

    testJavaFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.done();
    },

    testJavaFileMakeKey: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "r99578090116730");
        
        test.done();
    },

    testJavaFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "r99578090116730");
        test.equal(j.makeKey("This is a test"), "r99578090116730");
        
        test.done();
    },

    testJavaFileParseSimpleGetById: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.get("r99578090116730");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        test.done();
    },

    testJavaFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        test.done();
    },

    testJavaFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        test.done();
    },


    testJavaFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        var set = p.getTranslationSet();
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equal(set.size(), 0);

        j.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaFileParseWithId: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "unique_id");
        
        test.done();
    },

    testJavaFileParseWithIdCantGetBySource: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testJavaFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getId(), "r90625302087578");
        
        test.done();
    },

    testJavaFileParseWithDups: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaFileParseDupsDifferingByIdOnly: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = p.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "r99578090116730");
        
        r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getId(), "unique_id");
        
        test.done();
    },

    testJavaFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = p.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + foobar);');
        
        var set = p.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString(foobar);');
        
        var set = p.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString();');
        
        var set = p.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('EPIRB.getString("This is a test");');
        
        var set = p.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseSubobject: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('App.RB.getString("This is a test");');
        
        var set = p.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

};