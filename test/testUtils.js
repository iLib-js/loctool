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
    },
    
    testHashKey: function(test) {
        test.expect(1);

        test.equal(utils.hashKey("This is a test"), "r654479252");
        
        test.done();
    },

    testHashKeySimpleTexts1: function(test) {
        test.expect(5);

        test.equals(utils.hashKey("Medications in your profile"), "r32020327");
		test.equals(utils.hashKey("All medications"), "r835310324");
		test.equals(utils.hashKey("Conditions"), "r103883086");
		test.equals(utils.hashKey("Symptoms"), "r481086103");
		test.equals(utils.hashKey("Experts"), "r343852585");
        
        test.done();
	},

	testHashKeySimpleTexts2: function(test) {
        test.expect(5);

        test.equals(utils.hashKey("Procedures"), "r807691021");
		test.equals(utils.hashKey("Health Apps"), "r941505899");
		test.equals(utils.hashKey("Conditions in your profile"), "r240633868");
		test.equals(utils.hashKey("Treatment Reviews"), "r795086964");
		test.equals(utils.hashKey("Answers"), "r221604632");
        
        test.done();
	},

	testHashKeySimpleTexts3: function(test) {
        test.expect(10);

        test.equals(utils.hashKey("Private Health Profile"), "r669315500");
		test.equals(utils.hashKey("People you care for"), "r710774033");
		test.equals(utils.hashKey("Notifications"), "r284964820");
		test.equals(utils.hashKey("News"), "r613036745");
		test.equals(utils.hashKey("More Tips"), "r216617786");
		test.equals(utils.hashKey("Goals"), "r788359072");
		test.equals(utils.hashKey("Referral Link"), "r140625167");
		test.equals(utils.hashKey("Questions"), "r256277957");
		test.equals(utils.hashKey("Private consults"), "r18128760");
		test.equals(utils.hashKey("Suggested doctors for you"), "r584966709");
        
        test.done();
	},

	testHashKeyEscapes: function(test) {
        test.expect(2);

        test.equals(utils.hashKey("Can\'t find treatment id"), "r926831062");
		test.equals(utils.hashKey("Can\'t find an application for SMS"), "r909283218");
        
        test.done();
	},
	
	testHashKeyPunctuation: function(test) {
        test.expect(7);

        test.equals(utils.hashKey("{topic_name}({topic_generic_name})"), "r382554039");
		test.equals(utils.hashKey("{doctor_name}, {sharer_name} {start}found this helpful{end}"), "r436261634");
		test.equals(utils.hashKey("{sharer_name} {start}found this helpful{end}"), "r858107784");
		test.equals(utils.hashKey("Grow your Care-Team"), "r522565682");
		test.equals(utils.hashKey("Failed to send connection request!"), "r1015770123");
		test.equals(utils.hashKey("{goal_name} Goals"), "r993422001");
		test.equals(utils.hashKey("Referral link copied!"), "r201354363");
        
        test.done();
	},

    testHashKeySameStringMeansSameKey: function(test) {
        test.expect(2);
        
        test.equal(utils.hashKey("This is a test"), "r654479252");
        test.equal(utils.hashKey("This is a test"), "r654479252");
        
        test.done();
    }
}