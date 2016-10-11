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
        	pathName: "./java/res/layout/t1.xml",
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
        
        test.equal(alf.makeKey("android:text", "This is a test"), "android_text_This_is_a_test");
        
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
        
        test.equal(alf.makeKey("foo", "This is a test"), "foo_This_is_a_test");
        test.equal(alf.makeKey("foo", "This is a test"), "foo_This_is_a_test");
        
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
        
        var r = set.get("android_text_This_is_a_test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "android_text_This_is_a_test");
        
        test.done();
    },

    testAndroidLayoutFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
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
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "android_text_This_is_a_test");
        
        test.done();
    },

    testAndroidLayoutFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
			project: p,
			pathName: "foo"
		});
        test.ok(alf);

        var set = alf.getTranslationSet();
        test.equal(set.size(), 0);

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
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidLayoutFileParseMultiple: function(test) {
        test.expect(8);

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
        		  '  android:layout_width="match_parent"' + 
        		  '  android:title="foobar foo">' + 
        		  '  <RelativeLayout ' + 
        		  '    android:layout_width="match_parent"' + 
        		  '    android:text="This is also a test">' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
        		  '      android:text="This is a test" ' + 
        		  '      android:textColor="@color/error_red"/>' + 
        		  '  </RelativeLayout>' + 
        		  '</FrameLayout>');
        
        var set = alf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "android_text_This_is_a_test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "android_text_This_is_also_a_test");
        
        test.done();
    },

    testAndroidLayoutFileParseWithDups: function(test) {
        test.expect(6);

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
      		  '  android:layout_width="match_parent"' + 
      		  '  android:title="This is another test">' + 
      		  '  <RelativeLayout ' + 
      		  '    android:layout_width="match_parent"' + 
      		  '    android:text="This is a test">' + 
      		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
      		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
      		  '      android:text="This is a test" ' + 
      		  '      android:textColor="@color/error_red"/>' + 
      		  '  </RelativeLayout>' + 
      		  '</FrameLayout>');
        
        var set = alf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "android_text_This_is_a_test");
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testAndroidLayoutFileExtractFile: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p, 
        	pathName: "./testfiles/java/res/layout/t1.xml"
        });
        test.ok(alf);
        
        // should read the file
        alf.extract();
        
        var set = alf.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("Unlimited Doctor Consults");
        test.ok(r);
        test.equal(r.getSource(), "Unlimited Doctor Consults");
        test.equal(r.getKey(), "android_text_Unlimited_Doctor_Consults");

        test.done();
    },
    
    testAndroidLayoutFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
			project: p,
			pathName: "foo"
		});
        test.ok(alf);
        
        // should attempt to read the file and not fail
        alf.extract();
        
        var set = alf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidLayoutFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile(p, "./java/foo.java");
        test.ok(alf);
        
        // should attempt to read the file and not fail
        alf.extract();
        
        var set = alf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
    
    testAndroidLayoutFileParseNoPreviouslyResourcifiedStrings: function(test) {
        test.expect(6);

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
      		  '  android:layout_width="match_parent"' + 
      		  '  android:title="@string/foo">' + 
      		  '  <RelativeLayout ' + 
      		  '    android:layout_width="match_parent"' + 
      		  '    android:text="@string/android_text_This_is_a_test">' + 
      		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
      		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
      		  '      android:text="This is a test" ' + 
      		  '      android:textColor="@color/error_red"/>' + 
      		  '  </RelativeLayout>' + 
      		  '</FrameLayout>');
        
        var set = alf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "android_text_This_is_a_test");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidLayoutFileGetXML: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
			project: p,
			pathName: "./testfiles/java/res/layout/foo.xml"
		});
        test.ok(alf);
        
        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
      		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"' +
      		  '  android:layout_width="match_parent"' + 
      		  '  android:title="@string/foo">' + 
      		  '  <RelativeLayout' + 
      		  '    android:layout_width="match_parent"' + 
      		  '    android:text="This is also a test">' + 
      		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView' + 
      		  '      android:id="@+id/invalidpassowrdMsg"' + 
      		  '      android:text="This is a test"' + 
      		  '      android:textColor="@color/error_red"/>' + 
      		  '  </RelativeLayout>' + 
      		  '</FrameLayout>');
        
        var xml = alf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>' +
		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"' +
		  '  android:layout_width="match_parent"' + 
		  '  android:title="@string/foo">' + 
		  '  <RelativeLayout' + 
		  '    android:layout_width="match_parent"' + 
		  '    android:text="@string/android_text_This_is_also_a_test">' + 
		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView' + 
		  '      android:id="@+id/invalidpassowrdMsg"' + 
		  '      android:text="@string/android_text_This_is_a_test"' +
		  '      android:textColor="@color/error_red"/>' + 
		  '  </RelativeLayout>' + 
		  '</FrameLayout>';
        
        test.equal(xml, expected);
        
        test.done();
    },
    
    testAndroidLayoutFileGetXMLNoChange: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
			project: p,
			pathName: "./testfiles/java/res/layout/foo.xml"
		});
        test.ok(alf);
        
        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
      		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
      		  '  android:layout_width="match_parent"' + 
      		  '  android:title="@string/foo">' + 
      		  '  <RelativeLayout ' + 
      		  '    android:layout_width="match_parent"' + 
      		  '    android:foo="This is also a test">' + 
      		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
      		  '      android:id="@+id/invalidpassowrdMsg" ' + 
      		  '      android:foo="This is a test" ' + 
      		  '      android:textColor="@color/error_red"/>' + 
      		  '  </RelativeLayout>' + 
      		  '</FrameLayout>');
        
        var xml = alf._getXML();
        
        // same as above -- xml is not dirty, so no change
        var expected = '<?xml version="1.0" encoding="utf-8"?>' +
		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
  		  '  android:layout_width="match_parent"' + 
  		  '  android:title="@string/foo">' + 
  		  '  <RelativeLayout ' + 
  		  '    android:layout_width="match_parent"' + 
  		  '    android:foo="This is also a test">' + 
  		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
  		  '      android:id="@+id/invalidpassowrdMsg" ' + 
  		  '      android:foo="This is a test" ' + 
  		  '      android:textColor="@color/error_red"/>' + 
  		  '  </RelativeLayout>' + 
  		  '</FrameLayout>';
        
        test.equal(xml, expected);
        
        test.done();
    },
    
    testAndroidLayoutFileGetLocale: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p, 
        	pathName: "./res/layout/foo.xml"
        });
        test.ok(alf);
        
        var l = alf.getLocale();
        
        test.equal(l, "en-US");

        test.done();
    },

    testAndroidLayoutFileGetLocaleFromDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "./res/layout-en-rNZ/foo.xml"
        });
        test.ok(alf);
        
        var l = alf.getLocale();
        
        test.equal(l, "en-NZ");

        test.done();
    },

    testAndroidLayoutFileGetContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "./res/layout-bar/foo.xml"
        });
        test.ok(alf);
        
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(alf);
        
        test.equal(alf.getLocale(), "de");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(alf);
        
        test.equal(alf.getLocale(), "de");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p,
        	pathName: "./res/layout-de-rCH-bar/foo.xml"
        });
        test.ok(alf);
        
        test.equal(alf.getLocale(), "de-CH");
        test.equal(alf.getContext(), "bar");

        test.done();
    },
    
    testAndroidLayoutFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var alf = new AndroidLayoutFile({
        	project: p, 
        	pathName: "./res/layout-zh-sHant-rCN-bar/foo.xml"
        });
        test.ok(alf);
        
        test.equal(alf.getLocale(), "zh-Hant-CN");
        test.equal(alf.getContext(), "bar");

        test.done();
    }
};