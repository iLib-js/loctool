/*
 * testAndroidLayoutFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!AndroidLayoutFile) {
    var AndroidLayoutFile = require("../lib/AndroidLayoutFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
}

module.exports = {
    testAndroidLayoutFileConstructor: function(test) {
        test.expect(1);

        var alf = new AndroidLayoutFile();
        test.ok(alf);
        
        test.done();
    },
    
    testAndroidLayoutFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p, 
        	pathName: "./testfiles/res/layout/t1.xml",
        	locale: "en-US"
        });
        
        test.ok(alf);
        
        test.done();
    },

    testAndroidLayoutFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        test.ok(alf);
        
        test.done();
    },

    testAndroidLayoutFileMakeKey: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        test.ok(alf);
        
        test.equal(alf.makeKey("This is a test"), "This_is_a_test");
        
        test.done();
    },

    testAndroidLayoutFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "foo"
        });
        test.ok(alf);
        
        test.equal(alf.makeKey("This is a test"), "This_is_a_test");
        test.equal(alf.makeKey("This is a test"), "This_is_a_test");
        
        test.done();
    },

    testAndroidLayoutFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "foo"
        });
        test.ok(alf);
        
        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
        		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
        		  'android:layout_width="match_parent">' + 
        		  '  <RelativeLayout ' + 
        		  '      android:layout_width="match_parent">' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
        		  '      android:text="This is a test" ' + 
        		  '      android:textColor="@color/error_red"/>' + 
        		  '  </RelativeLayout>' + 
        		  '</FrameLayout>');
        
        var set = alf.getTranslationSet();
        test.ok(set);
        
        var r = set.get("This_is_a_test");
        test.ok(r);
        console.log("parsesimple: r is " + JSON.stringify(r));
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This_is_a_test");
        
        test.done();
    },

    /*
    testAndroidLayoutFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");
        
        test.done();
    },

    testAndroidLayoutFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");
        
        test.done();
    },


    testAndroidLayoutFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidLayoutFileParseWithKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testAndroidLayoutFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testAndroidLayoutFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r90625302087578");
        
        test.done();
    },

    testAndroidLayoutFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        
        var set = j.getTranslationSet();
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

    testAndroidLayoutFileParseWithDups: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidLayoutFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");
        
        r = set.get("unique_id");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testAndroidLayoutFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testAndroidLayoutFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testAndroidLayoutFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString(foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testAndroidLayoutFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('RB.getString();');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testAndroidLayoutFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('EPIRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testAndroidLayoutFileParseSubobject: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        j.parse('App.RB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidLayoutFileExtractFile: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p, "./java/t1.java");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r99578090116730");

        var r = set.get("id1");
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");
        
        test.done();
    },
    
    testAndroidLayoutFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidLayoutFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p, "./java/foo.java");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
	*/
};