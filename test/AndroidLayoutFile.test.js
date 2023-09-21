/*
 * AndroidLayoutFile.test.js - test the Java file handler object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
}, "./test/testfiles", {
    locales:["en-GB"]
});

var alft = new AndroidLayoutFileType(p);

describe("androidlayoutfile", function() {
    test("AndroidLayoutFileConstructor", function() {
        expect.assertions(1);

        var alf = new AndroidLayoutFile();
        expect(alf).toBeTruthy();
    });

    test("AndroidLayoutFileConstructorParams", function() {
        expect.assertions(1);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./java/res/layout/t1.xml",
            locale: "en-US"
        });

        expect(alf).toBeTruthy();
    });

    test("AndroidLayoutFileConstructorNoFile", function() {
        expect.assertions(1);

        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        expect(alf).toBeTruthy();
    });

    test("AndroidLayoutFileMakeKey", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({project: p, pathName: "foo"});
        expect(alf).toBeTruthy();

        expect(alf.makeKey("android:text", "This is a test")).toBe("text_This_is_a_test");
    });

    test("AndroidLayoutFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

        expect(alf.makeKey("foo", "This is a test")).toBe("foo_This_is_a_test");
        expect(alf.makeKey("foo", "This is a test")).toBe("foo_This_is_a_test");
    });

    test("AndroidLayoutFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            type: alft
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");
    });

    test("AndroidLayoutFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");
    });

    test("AndroidLayoutFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

        var set = alf.getTranslationSet();
        expect(set.size()).toBe(0);

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

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("AndroidLayoutFileParseWithTranslatorComment", function() {
        expect.assertions(6);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");
        expect(r.getComment()).toBe("This is a translator comment");
    });

    test("AndroidLayoutFileParseMultiple", function() {
        expect.assertions(8);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("text_This_is_also_a_test");
    });

    test("AndroidLayoutFileParseWithDups", function() {
        expect.assertions(6);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");

        expect(set.size()).toBe(2);
    });

    test("AndroidLayoutFileParseMultipleWithTranslatorComments", function() {
        expect.assertions(14);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");
        expect(r.getComment()).toBe("translator comment 3");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("text_This_is_also_a_test");
        expect(r.getComment()).toBe("translator comment 2");

        r = set.getBySource("foobar foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foobar foo");
        expect(r.getKey()).toBe("title_foobar_foo");
        expect(r.getComment()).toBe("translator comment 1");
    });
    test("AndroidLayoutFileExtractFile", function() {
        expect.assertions(5);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./test/testfiles/java/res/layout/t1.xml"
        });
        expect(alf).toBeTruthy();

        // should read the file
        alf.extract();

        var set = alf.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.getBySource("Unlimited Gigabytes of Data");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Unlimited Gigabytes of Data");
        expect(r.getKey()).toBe("text_Unlimited_Gigabytes_of_Data");
    });

    test("AndroidLayoutFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

        // should attempt to read the file and not fail
        alf.extract();

        var set = alf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("AndroidLayoutFileExtractBogusFile", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile(p, "./java/foo.java");
        expect(alf).toBeTruthy();

        // should attempt to read the file and not fail
        alf.extract();

        var set = alf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("AndroidLayoutFileParseNoPreviouslyResourcifiedStrings", function() {
        expect.assertions(6);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "foo"
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");

        expect(set.size()).toBe(1);
    });

    test("AndroidLayoutFileGetXML", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./test/testfiles/java/res/layout/foo.xml"
        });
        expect(alf).toBeTruthy();

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

        expect(xml).toBe(expected);
    });

    test("AndroidLayoutFileGetXMLNoChange", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./test/testfiles/java/res/layout/foo.xml"
        });
        expect(alf).toBeTruthy();

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

        expect(xml).toBe(expected);
    });

    test("AndroidLayoutFileGetLocale", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout/foo.xml"
        });
        expect(alf).toBeTruthy();

        var l = alf.getLocale();

        expect(l).toBe("en-US");
    });

    test("AndroidLayoutFileGetLocaleFromDir", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-en-rNZ/foo.xml"
        });
        expect(alf).toBeTruthy();

        var l = alf.getLocale();

        expect(l).toBe("en-NZ");
    });

    test("AndroidLayoutFileGetContext", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-bar/foo.xml"
        });
        expect(alf).toBeTruthy();

        expect(alf.getContext()).toBe("bar");
    });

    test("AndroidLayoutFileGetLocaleAndContext1", function() {
        expect.assertions(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-bar/foo.xml"
        });
        expect(alf).toBeTruthy();

        expect(alf.getLocale()).toBe("de");
        expect(alf.getContext()).toBe("bar");
    });

    test("AndroidLayoutFileGetLocaleAndContext1", function() {
        expect.assertions(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-bar/foo.xml"
        });
        expect(alf).toBeTruthy();

        expect(alf.getLocale()).toBe("de");
        expect(alf.getContext()).toBe("bar");
    });

    test("AndroidLayoutFileGetLocaleAndContext2", function() {
        expect.assertions(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-de-rCH-bar/foo.xml"
        });
        expect(alf).toBeTruthy();

        expect(alf.getLocale()).toBe("de-CH");
        expect(alf.getContext()).toBe("bar");
    });

    test("AndroidLayoutFileGetLocaleAndContext2", function() {
        expect.assertions(3);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./res/layout-zh-sHans-rCN-bar/foo.xml"
        });
        expect(alf).toBeTruthy();

        expect(alf.getLocale()).toBe("zh-Hans-CN");
        expect(alf.getContext()).toBe("bar");
    });

    test("AndroidLayoutFileParseMultipleIdenticalStrings", function() {
        expect.assertions(7);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft
        });
        expect(alf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var resources = set.getAll();

        expect(resources.length).toBe(1);

        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "text_This_is_a_test", "x-android-resource"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("text_This_is_a_test");
        expect(r.getComment()).toBe("This is a translator comment");
    });

    test("AndroidLayoutFileModifyAndroidTextWithApostrophe", function() {
        expect.assertions(2);

        var alf = new AndroidLayoutFile({
            project: p,
            type: alft,
            pathName: "./test/testfiles/java/res/layout/foo.xml"
        });
        expect(alf).toBeTruthy();

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

        expect(xml).toBe(expected);
    });
});
