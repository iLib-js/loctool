/*
 * testUtils.js - test the utils object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!utils) {
	var utils = require("../lib/utils.js");
}

module.exports = {
    testUtilsIsAndroidResourceYes: function(test) {
        test.expect(10);
        
        test.ok(utils.isAndroidResource("@anim/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@array/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@color/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@dimen/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@drawable/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@id/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@integer/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@layout/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@string/foo_bar_foo"));
        test.ok(utils.isAndroidResource("@style/foo_bar_foo"));

        test.done();
    },

    testUtilsIsAndroidResourceNo: function(test) {
        test.expect(1);

        test.ok(!utils.isAndroidResource("foo bar faooasdfas"));
        
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
    }
}