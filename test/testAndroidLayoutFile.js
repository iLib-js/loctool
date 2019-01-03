/*
 * testAndroidLayoutFile.js - test the Java file handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!AndroidLayoutFile) {
    var AndroidLayoutFile = require("../lib/AndroidLayoutFile.js");
    var AndroidLayoutFileType = require("../lib/AndroidLayoutFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
}

var p = new AndroidProject({
    id: "android",
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var alft = new AndroidLayoutFileType(p);

module.exports.androidlayoutfile = {
    testAndroidLayoutFileConstructor: function(test) {
        test.expect(1);

        var alf = new AndroidLayoutFile();
        test.ok(alf);

        test.done();
    },

    testAndroidLayoutFileConstructorParams: function(test) {
        test.expect(1);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./java/res/layout/t1.xml",
            locale: "en-US"
        });

        test.ok(alf);

        test.done();
    },

    testAndroidLayoutFileConstructorNoFile: function(test) {
        test.expect(1);

        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        test.ok(alf);

        test.done();
    },

    testAndroidLayoutFileMakeKey: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        test.ok(alf);

        test.equal(alf.makeKey("android:text", "This is a test"), "text_This_is_a_test");

        test.done();
    },

    testAndroidLayoutFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        test.ok(alf);

        test.equal(alf.makeKey("foo", "This is a test"), "foo_This_is_a_test");
        test.equal(alf.makeKey("foo", "This is a test"), "foo_This_is_a_test");

        test.done();
    },

    testAndroidLayoutFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            type: alft
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                  'android:layout_width="match_parent">' +
                  '  <RelativeLayout ' +
                  '      android:layout_width="match_parent">' +
                  '    <com.mycompany.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");

        test.done();
    },

    testAndroidLayoutFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                'android:layout_width="match_parent">' +
                '  <RelativeLayout ' +
                '      android:layout_width="match_parent">' +
                '    <com.myproduct.customviews.RobotoRegularTextView ' +
                '      android:id="@+id/invalidpasswordMsg"  ' +
                '      android:text="This is a test" ' +
                '      android:textColor="@color/error_red"/>' +
                '  </RelativeLayout>' +
                '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");

        test.done();
    },

    testAndroidLayoutFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testAndroidLayoutFileParseWithTranslatorComment: function(test) {
        test.expect(6);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                  'android:layout_width="match_parent">' +
                  '  <RelativeLayout ' +
                  '      android:layout_width="match_parent">' +
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      i18n="This is a translator comment" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        test.equal(r.getComment(), "This is a translator comment");

        test.done();
    },

    testAndroidLayoutFileParseMultiple: function(test) {
        test.expect(8);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        var set = alf.getTranslationSet();
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

    testAndroidLayoutFileParseWithDups: function(test) {
        test.expect(6);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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
                '    <com.myproduct.customviews.RobotoRegularTextView ' +
                '      android:id="@+id/invalidpasswordMsg"  ' +
                '      android:text="This is a test" ' +
                '      android:textColor="@color/error_red"/>' +
                '  </RelativeLayout>' +
                '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");

        test.equal(set.size(), 2);

        test.done();
    },

    testAndroidLayoutFileParseMultipleWithTranslatorComments: function(test) {
        test.expect(14);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                  '  android:layout_width="match_parent"' +
                  '  android:title="foobar foo" i18n="translator comment 1">' +
                  '  <RelativeLayout ' +
                  '    android:layout_width="match_parent"' +
                  '    android:text="This is also a test"' +
                  '    i18n="translator comment 2">' +
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      i18n="translator comment 3" ' +
                  '      android:text="This is a test" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        var set = alf.getTranslationSet();
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
    testAndroidLayoutFileExtractFile: function(test) {
        test.expect(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./testfiles/java/res/layout/t1.xml"
        });
        test.ok(alf);

        // should read the file
        alf.extract();

        var set = alf.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("Unlimited Gigabytes of Data");
        test.ok(r);
        test.equal(r.getSource(), "Unlimited Gigabytes of Data");
        test.equal(r.getKey(), "text_Unlimited_Gigabytes_of_Data");

        test.done();
    },

    testAndroidLayoutFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                '  android:layout_width="match_parent"' +
                '  android:title="@string/foo">' +
                '  <RelativeLayout ' +
                '    android:layout_width="match_parent"' +
                '    android:text="@string/text_This_is_a_test">' +
                '    <com.myproduct.customviews.RobotoRegularTextView ' +
                '      android:id="@+id/invalidpasswordMsg"  ' +
                '      android:text="This is a test" ' +
                '      android:textColor="@color/error_red"/>' +
                '  </RelativeLayout>' +
                '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");

        test.equal(set.size(), 1);

        test.done();
    },

    testAndroidLayoutFileGetXML: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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
                '    <com.myproduct.customviews.RobotoRegularTextView' +
                '      android:id="@+id/invalidpasswordMsg"' +
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
          '    android:text="@string/text_This_is_also_a_test">' +
          '    <com.myproduct.customviews.RobotoRegularTextView' +
          '      android:id="@+id/invalidpasswordMsg"' +
          '      android:text="@string/text_This_is_a_test"' +
          '      android:textColor="@color/error_red"/>' +
          '  </RelativeLayout>' +
          '</FrameLayout>';

        test.equal(xml, expected);

        test.done();
    },

    testAndroidLayoutFileGetXMLNoChange: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
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
                '    <com.myproduct.customviews.RobotoRegularTextView ' +
                '      android:id="@+id/invalidpasswordMsg" ' +
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
            '    <com.myproduct.customviews.RobotoRegularTextView ' +
            '      android:id="@+id/invalidpasswordMsg" ' +
            '      android:foo="This is a test" ' +
            '      android:textColor="@color/error_red"/>' +
            '  </RelativeLayout>' +
            '</FrameLayout>';

        test.equal(xml, expected);

        test.done();
    },

    testAndroidLayoutFileGetLocale: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout/foo.xml"
        });
        test.ok(alf);

        var l = alf.getLocale();

        test.equal(l, "en-US");

        test.done();
    },

    testAndroidLayoutFileGetLocaleFromDir: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-en-rNZ/foo.xml"
        });
        test.ok(alf);

        var l = alf.getLocale();

        test.equal(l, "en-NZ");

        test.done();
    },

    testAndroidLayoutFileGetContext: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-bar/foo.xml"
        });
        test.ok(alf);

        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(alf);

        test.equal(alf.getLocale(), "de");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-bar/foo.xml"
        });
        test.ok(alf);

        test.equal(alf.getLocale(), "de");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-rCH-bar/foo.xml"
        });
        test.ok(alf);

        test.equal(alf.getLocale(), "de-CH");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-zh-sHans-rCN-bar/foo.xml"
        });
        test.ok(alf);

        test.equal(alf.getLocale(), "zh-Hans-CN");
        test.equal(alf.getContext(), "bar");

        test.done();
    },

    testAndroidLayoutFileParseMultipleIdenticalStrings: function(test) {
        test.expect(7);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                  '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" ' +
                  'android:layout_width="match_parent">' +
                  '  <RelativeLayout ' +
                  '      android:layout_width="match_parent">' +
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidpasswordMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      i18n="This is a translator comment" ' +
                  '      android:textColor="@color/error_red"/>' +
                  '    <com.myproduct.customviews.RobotoRegularTextView ' +
                  '      android:id="@+id/invalidUseridMsg"  ' +
                  '      android:text="This is a test" ' +
                  '      i18n="This is a translator comment" ' +
                  '      android:textColor="@color/error_burgundy"/>' +
                  '  </RelativeLayout>' +
                  '</FrameLayout>');

        var set = alf.getTranslationSet();
        test.ok(set);

        var resources = set.getAll();

        test.equal(resources.length, 1);

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "text_This_is_a_test");
        test.equal(r.getComment(), "This is a translator comment");

        test.done();
    },

    testAndroidLayoutFileModifyAndroidTextWithApostrophe: function(test) {
        test.expect(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./testfiles/java/res/layout/foo.xml"
        });
        test.ok(alf);

        alf.parse('<?xml version="1.0" encoding="utf-8"?>' +
                '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"' +
                '  android:layout_width="match_parent"' +
                '  android:title="@string/foo">' +
                '  <RelativeLayout' +
                '    android:layout_width="match_parent"' +
                '    android:text="This is also a \'test\'">' +   // sneaky apostrophe
                '    <com.myproduct.customviews.RobotoRegularTextView' +
                '      android:id="@+id/invalidpasswordMsg"' +
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
          '    android:text="@string/text_This_is_also_a__test_">' +
          '    <com.myproduct.customviews.RobotoRegularTextView' +
          '      android:id="@+id/invalidpasswordMsg"' +
          '      android:text="@string/text_This_is_a_test"' +
          '      android:textColor="@color/error_red"/>' +
          '  </RelativeLayout>' +
          '</FrameLayout>';

        test.equal(xml, expected);

        test.done();
    }
};
