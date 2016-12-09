/*
 * testAndroidResourceFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!AndroidResourceFile) {
    var AndroidResourceFile = require("../lib/AndroidResourceFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var AndroidResourceString =  require("../lib/AndroidResourceString.js");
}

module.exports = {
    testAndroidResourceFileConstructor: function(test) {
        test.expect(1);

        var arf = new AndroidResourceFile();
        test.ok(arf);
        
        test.done();
    },
    
    testAndroidResourceFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./java/res/values/t1.xml",
        	locale: "en-US"
        });
        
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({project: p, pathName: "foo"});
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_doc_pre">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(AndroidResourceString.hashKey(undefined, undefined, "en-US", "thanks_doc_pre"));
        test.ok(r);
        
        test.equal(r.getSource(), "Send a thank you note to\n{name}");
        test.equal(r.getKey(), "thanks_doc_pre");
        
        test.done();
    },

    
    /*
    testAndroidResourceFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        
        test.done();
    },

    testAndroidResourceFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);

        var set = arf.getTranslationSet();
        test.equal(set.size(), 0);

        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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

    testAndroidResourceFileParseWithTranslatorComment: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
        		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
        		  'android:layout_width="match_parent">' + 
        		  '  <RelativeLayout ' + 
        		  '      android:layout_width="match_parent">' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
        		  '      android:text="This is a test" ' +
        		  '      i18n="This is a translator comment" ' +
        		  '      android:textColor="@color/error_red"/>' + 
        		  '  </RelativeLayout>' + 
        		  '</FrameLayout>');
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = setAndroidResourceString.hashKey(undefined, undefined, undefined, "text_This_is_a_test"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        test.equal(r.getComment(), "This is a translator comment");
        
        test.done();
    },

    testAndroidResourceFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "text_This_is_also_a_test");
        
        test.done();
    },

    testAndroidResourceFileParseWithDups: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testAndroidResourceFileParseMultipleWithTranslatorComments: function(test) {
        test.expect(14);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
        		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
        		  '  android:layout_width="match_parent"' + 
        		  '  android:title="foobar foo" i18n="translator comment 1">' + 
        		  '  <RelativeLayout ' + 
        		  '    android:layout_width="match_parent"' + 
        		  '    android:text="This is also a test"' +
        		  '    i18n="translator comment 2">' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
        		  '      i18n="translator comment 3" ' + 
        		  '      android:text="This is a test" ' + 
        		  '      android:textColor="@color/error_red"/>' + 
        		  '  </RelativeLayout>' + 
        		  '</FrameLayout>');
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        test.equal(r.getComment(), "translator comment 3");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "text_This_is_also_a_test");
        test.equal(r.getComment(), "translator comment 2");

        r = set.getBySource("foobar foo");
        test.ok(r);
        test.equal(r.getSource(), "foobar foo");
        test.equal(r.getKey(), "title_foobar_foo");
        test.equal(r.getComment(), "translator comment 1");

        test.done();
    },
    testAndroidResourceFileExtractFile: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./testfiles/java/res/layout/t1.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("Unlimited Doctor Consults");
        test.ok(r);
        test.equal(r.getSource(), "Unlimited Doctor Consults");
        test.equal(r.getKey(), "text_Unlimited_Doctor_Consults");

        test.done();
    },
    
    testAndroidResourceFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        // should attempt to read the file and not fail
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidResourceFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile(p, "./java/foo.java");
        test.ok(arf);
        
        // should attempt to read the file and not fail
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
    
    testAndroidResourceFileParseNoPreviouslyResourcifiedStrings: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "foo"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
      		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
      		  '  android:layout_width="match_parent"' + 
      		  '  android:title="@string/foo">' + 
      		  '  <RelativeLayout ' + 
      		  '    android:layout_width="match_parent"' + 
      		  '    android:text="@string/text_This_is_a_test">' + 
      		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
      		  '      android:id="@+id/invalidpassowrdMsg"  ' + 
      		  '      android:text="This is a test" ' + 
      		  '      android:textColor="@color/error_red"/>' + 
      		  '  </RelativeLayout>' + 
      		  '</FrameLayout>');
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testAndroidResourceFileGetXML: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "./testfiles/java/res/layout/foo.xml"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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
        
        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>' +
		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"' +
		  '  android:layout_width="match_parent"' + 
		  '  android:title="@string/foo">' + 
		  '  <RelativeLayout' + 
		  '    android:layout_width="match_parent"' + 
		  '    android:text="@string/text_This_is_also_a_test">' + 
		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView' + 
		  '      android:id="@+id/invalidpassowrdMsg"' + 
		  '      android:text="@string/text_This_is_a_test"' +
		  '      android:textColor="@color/error_red"/>' + 
		  '  </RelativeLayout>' + 
		  '</FrameLayout>';
        
        test.equal(xml, expected);
        
        test.done();
    },
    
    testAndroidResourceFileGetXMLNoChange: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
			pathName: "./testfiles/java/res/layout/foo.xml"
		});
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
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
        
        var xml = arf._getXML();
        
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
    
    testAndroidResourceFileGetLocale: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./res/layout/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-US");

        test.done();
    },

    testAndroidResourceFileGetLocaleFromDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/layout-en-rNZ/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-NZ");

        test.done();
    },

    testAndroidResourceFileGetContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/layout-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/layout-de-rCH-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de-CH");
        test.equal(arf.getContext(), "bar");

        test.done();
    },
    
    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./res/layout-zh-sHant-rCN-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "zh-Hant-CN");
        test.equal(arf.getContext(), "bar");

        test.done();
    },
    
    testAndroidResourceFileParseMultipleIdenticalStrings: function(test) {
        test.expect(7);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse('<?xml version="1.0" encoding="utf-8"?>' +
        		  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
        		  'android:layout_width="match_parent">' + 
        		  '  <RelativeLayout ' + 
        		  '      android:layout_width="match_parent">' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidpasswordMsg"  ' + 
        		  '      android:text="This is a test" ' +
        		  '      i18n="This is a translator comment" ' +
        		  '      android:textColor="@color/error_red"/>' + 
        		  '    <com.healthtap.userhtexpress.customviews.RobotoRegularTextView ' + 
        		  '      android:id="@+id/invalidUseridMsg"  ' + 
        		  '      android:text="This is a test" ' +
        		  '      i18n="This is a translator comment" ' +
        		  '      android:textColor="@color/error_burgundy"/>' + 
        		  '  </RelativeLayout>' + 
        		  '</FrameLayout>');
        
        var set = arf.getTranslationSet();
        test.ok(set);
        
        var resources = set.getAll();
        
        test.equal(resources.length, 1);
        
        var r = set.get(AndroidResourceString.hashKey(undefined, undefined, "en-US", "text_This_is_a_test"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        test.equal(r.getComment(), "This is a translator comment");
        
        test.done();
    }
    */
};