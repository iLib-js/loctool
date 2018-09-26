/*
 * testUtils.js - test the utils object.
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

if (!utils) {
    var utils = require("../lib/utils.js");
}

module.exports = {
    testUtilsIsAndroidResourceYes: function(test) {
        test.expect(17);

        test.ok(utils.isAndroidResource("@anim/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@array/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@color/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@dimen/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@drawable/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@integer/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@layout/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@string/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@+id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@+style/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@+android:id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@android:id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@android:anim/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@android:color/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@android:id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@android:style/foo_bar_foo"));

        test.done();
    },

    testUtilsIsAndroidResourceNo: function(test) {
        test.expect(2);

        test.ok(!utils.isAndroidResource("foo bar faooasdfas"));
        test.ok(!utils.isAndroidResource("@foobar/foobar"));

        test.done();
    },

    testUtilsIsAndroidResourceUnknownType: function(test) {
        test.expect(1);

        test.ok(!utils.isAndroidResource("@foo/asdf"));

        test.done();
    },

    testUtilsIsAsianLocaleTrue: function(test) {
        test.expect(4);

        test.ok(utils.isAsianLocale("zh-Hans-CN"));
        test.ok(utils.isAsianLocale("zh-Hant-TW"));
        test.ok(utils.isAsianLocale("ja-JP"));
        test.ok(utils.isAsianLocale("th-tH"));

        test.done();
    },

    testUtilsIsAsianLocaleFalse: function(test) {
        test.expect(4);

        test.ok(!utils.isAsianLocale("ko-KR"));
        test.ok(!utils.isAsianLocale("vi-VN"));
        test.ok(!utils.isAsianLocale("en-US"));
        test.ok(!utils.isAsianLocale("es-US"));

        test.done();
    },

    testHashKey: function(test) {
        test.expect(1);

        test.equal(utils.hashKey("This is a test"), "r654479252");

        test.done();
    },

    testHashKeySimpleTexts1: function(test) {
        test.expect(5);

        test.equals(utils.hashKey("Settings in your profile"), "r618035987");
        test.equals(utils.hashKey("All locations"), "r246937959");
        test.equals(utils.hashKey("Conditions"), "r103883086");
        test.equals(utils.hashKey("Everything"), "r414542544");
        test.equals(utils.hashKey("Locations"), "r29058502");

        test.done();
    },

    testHashKeySimpleTexts2: function(test) {
        test.expect(5);

        test.equals(utils.hashKey("Procedures"), "r807691021");
        test.equals(utils.hashKey("Functions"), "r535786086");
        test.equals(utils.hashKey("Morning and afternoon"), "r409842466");
        test.equals(utils.hashKey("Evening"), "r72303136");
        test.equals(utils.hashKey("Nighttime"), "r332185734");

        test.done();
    },

    testHashKeySimpleTexts3: function(test) {
        test.expect(8);

        test.equals(utils.hashKey("Private Profile"), "r314592735");
        test.equals(utils.hashKey("People you are connected to"), "r711926199");
        test.equals(utils.hashKey("Notifications"), "r284964820");
        test.equals(utils.hashKey("News"), "r613036745");
        test.equals(utils.hashKey("More Tips"), "r216617786");
        test.equals(utils.hashKey("Filters"), "r81370429");
        test.equals(utils.hashKey("Referral Link"), "r140625167");
        test.equals(utils.hashKey("Questions"), "r256277957");

        test.done();
    },

    testHashKeyEscapes: function(test) {
        test.expect(2);

        test.equals(utils.hashKey("Can\'t find id"), "r743945592");
        test.equals(utils.hashKey("Can\'t find an application for SMS"), "r909283218");

        test.done();
    },

    testHashKeyPunctuation: function(test) {
        test.expect(6);

        test.equals(utils.hashKey("{name}({generic_name})"), "r300446104");
        test.equals(utils.hashKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(utils.hashKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(utils.hashKey("Grow your network"), "r214079422");
        test.equals(utils.hashKey("Failed to send connection request!"), "r1015770123");
        test.equals(utils.hashKey("Connection request copied!"), "r136272443");

        test.done();
    },

    testHashKeySameStringMeansSameKey: function(test) {
        test.expect(2);

        test.equal(utils.hashKey("This is a test"), "r654479252");
        test.equal(utils.hashKey("This is a test"), "r654479252");

        test.done();
    },

    testTrimEscapedRealWhitespace: function(test) {
        test.expect(4);

        test.equal(utils.trimEscaped("This is a test"), "This is a test");
        test.equal(utils.trimEscaped(" \t \n   This is a test"), "This is a test");
        test.equal(utils.trimEscaped("This is a test   \t  \n"), "This is a test");
        test.equal(utils.trimEscaped("\n \t \r This is a test \r \t \n"), "This is a test");

        test.done();
    },

    testTrimEscapedEscapedWhitespace: function(test) {
        test.expect(3);

        test.equal(utils.trimEscaped(" \\t \\n   This is a test"), "This is a test");
        test.equal(utils.trimEscaped("This is a test   \\t  \\n"), "This is a test");
        test.equal(utils.trimEscaped("\\n \\t \\r This is a test \\r \\t \\n"), "This is a test");

        test.done();
    },

    testTrimEscapedEscapedUndefined: function(test) {
        test.expect(1);

        test.equal(utils.trimEscaped(undefined), undefined);

        test.done();
    }

}
