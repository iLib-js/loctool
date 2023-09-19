/*
 * Utils.test.js - test the utils object.
 *
 * Copyright © 2016-2017, 2023 2022-2023 HealthTap, Inc.
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
describe("utils", function() {
    test("UtilsIsAndroidResourceYes", function() {
        expect.assertions(17);
        expect(utils.isAndroidResource("@anim/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@array/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@color/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@dimen/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@drawable/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@id/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@integer/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@layout/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@string/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@+id/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@+style/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@+android:id/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@android:id/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@android:anim/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@android:color/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@android:id/foo_bar_foo")).toBeTruthy();
        expect(utils.isAndroidResource("@android:style/foo_bar_foo")).toBeTruthy();
    });
    test("UtilsIsAndroidResourceNo", function() {
        expect.assertions(2);
        expect(!utils.isAndroidResource("foo bar faooasdfas")).toBeTruthy();
        expect(!utils.isAndroidResource("@foobar/foobar")).toBeTruthy();
    });
    test("UtilsIsAndroidResourceUnknownType", function() {
        expect.assertions(1);
        expect(!utils.isAndroidResource("@foo/asdf")).toBeTruthy();
    });
    test("UtilsIsAsianLocaleTrue", function() {
        expect.assertions(4);
        expect(utils.isAsianLocale("zh-Hans-CN")).toBeTruthy();
        expect(utils.isAsianLocale("zh-Hant-TW")).toBeTruthy();
        expect(utils.isAsianLocale("ja-JP")).toBeTruthy();
        expect(utils.isAsianLocale("th-tH")).toBeTruthy();
    });
    test("UtilsIsAsianLocaleFalse", function() {
        expect.assertions(4);
        expect(!utils.isAsianLocale("ko-KR")).toBeTruthy();
        expect(!utils.isAsianLocale("vi-VN")).toBeTruthy();
        expect(!utils.isAsianLocale("en-US")).toBeTruthy();
        expect(!utils.isAsianLocale("es-US")).toBeTruthy();
    });
    test("HashKey", function() {
        expect.assertions(1);
        expect(utils.hashKey("This is a test")).toBe("r654479252");
    });
    test("HashKeySimpleTexts1", function() {
        expect.assertions(5);
        test.equals(utils.hashKey("Settings in your profile"), "r618035987");
        test.equals(utils.hashKey("All locations"), "r246937959");
        test.equals(utils.hashKey("Conditions"), "r103883086");
        test.equals(utils.hashKey("Everything"), "r414542544");
        test.equals(utils.hashKey("Locations"), "r29058502");
    });
    test("HashKeySimpleTexts2", function() {
        expect.assertions(5);
        test.equals(utils.hashKey("Procedures"), "r807691021");
        test.equals(utils.hashKey("Functions"), "r535786086");
        test.equals(utils.hashKey("Morning and afternoon"), "r409842466");
        test.equals(utils.hashKey("Evening"), "r72303136");
        test.equals(utils.hashKey("Nighttime"), "r332185734");
    });
    test("HashKeySimpleTexts3", function() {
        expect.assertions(8);
        test.equals(utils.hashKey("Private Profile"), "r314592735");
        test.equals(utils.hashKey("People you are connected to"), "r711926199");
        test.equals(utils.hashKey("Notifications"), "r284964820");
        test.equals(utils.hashKey("News"), "r613036745");
        test.equals(utils.hashKey("More Tips"), "r216617786");
        test.equals(utils.hashKey("Filters"), "r81370429");
        test.equals(utils.hashKey("Referral Link"), "r140625167");
        test.equals(utils.hashKey("Questions"), "r256277957");
    });
    test("HashKeyEscapes", function() {
        expect.assertions(2);
        test.equals(utils.hashKey("Can\'t find id"), "r743945592");
        test.equals(utils.hashKey("Can\'t find an application for SMS"), "r909283218");
    });
    test("HashKeyPunctuation", function() {
        expect.assertions(6);
        test.equals(utils.hashKey("{name}({generic_name})"), "r300446104");
        test.equals(utils.hashKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(utils.hashKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(utils.hashKey("Grow your network"), "r214079422");
        test.equals(utils.hashKey("Failed to send connection request!"), "r1015770123");
        test.equals(utils.hashKey("Connection request copied!"), "r136272443");
    });
    test("HashKeySameStringMeansSameKey", function() {
        expect.assertions(2);
        expect(utils.hashKey("This is a test")).toBe("r654479252");
        expect(utils.hashKey("This is a test")).toBe("r654479252");
    });
    test("TrimEscapedRealWhitespace", function() {
        expect.assertions(4);
        expect(utils.trimEscaped("This is a test")).toBe("This is a test");
        expect(utils.trimEscaped(" \t \n   This is a test")).toBe("This is a test");
        expect(utils.trimEscaped("This is a test   \t  \n")).toBe("This is a test");
        expect(utils.trimEscaped("\n \t \r This is a test \r \t \n")).toBe("This is a test");
    });
    test("TrimEscapedEscapedWhitespace", function() {
        expect.assertions(3);
        expect(utils.trimEscaped(" \\t \\n   This is a test")).toBe("This is a test");
        expect(utils.trimEscaped("This is a test   \\t  \\n")).toBe("This is a test");
        expect(utils.trimEscaped("\\n \\t \\r This is a test \\r \\t \\n")).toBe("This is a test");
    });
    test("TrimEscapedEscapedUndefined", function() {
        expect.assertions(1);
        expect(utils.trimEscaped(undefined)).toBe(undefined);
    });
    test("GetLocalizedPathLocaleDir", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('resources/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "resources/de/DE/strings.json");
    });
    test("GetLocalizedPathDir", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "x/y/de/DE/strings.json");
    });
    test("GetLocalizedPathBasename", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "de/DE/tr-strings.j");
    });
    test("GetLocalizedPathBasenameAlternateExtension", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.md",
            locale: "de-DE"
        }), "de/DE/tr-strings.j");
    });
    test("GetLocalizedPathFilename", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[localeDir]/tr-[filename]', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "de/DE/tr-strings.json");
    });
    test("GetLocalizedPathExtension", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings.jsn",
            locale: "de-DE"
        }), "de/DE/tr-foobar.jsn");
    });
    test("GetLocalizedPathExtensionNotThere", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings",
            locale: "de-DE"
        }), "de/DE/tr-foobar.");
    });
    test("GetLocalizedPathLocale", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[locale]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "x/y/de-DE/strings.json");
    });
    test("GetLocalizedPathLanguage", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "x/y/de/strings.json");
    });
    test("GetLocalizedPathLanguageNotThere", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "DE"
        }), "x/y/strings.json");
    });
    test("GetLocalizedPathRegion", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        }), "x/y/DE/strings.json");
    });
    test("GetLocalizedPathRegionNotThere", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de"
        }), "x/y/strings.json");
    });
    test("GetLocalizedPathScript", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        }), "x/y/Hans/strings.json");
    });
    test("GetLocalizedPathScriptNotThere", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-CN"
        }), "x/y/strings.json");
    });
    test("GetLocalizedPathLocaleUnder", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/strings_[localeUnder].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        }), "x/y/strings_zh_Hans_CN.json");
    });
    test("GetLocalizedPathLocaleLower", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/strings_[localeLower].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        }), "x/y/strings_zh-hans-cn.json");
    });
    test("GetresourceDirPath", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "ko",
            resourceDir: "res"
        }), "x/y/res/ko/strings.json");
    });
    test("GetresourceDirPath2", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "fr-CA",
            resourceDir: "resources"
        }), "x/y/resources/fr/CA/strings.json");
    });
    test("GetresourceDirPath3", function() {
        expect.assertions(1);
        test.equals(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "es"
        }), "x/y/es/strings.json");
    });
    test("GetLocaleFromPathDir", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings.json', "x/y/strings.json"), "");
    });
    test("GetLocaleFromPathBasename", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[basename].json', "x/y/strings.json"), "");
    });
    test("GetLocaleFromPathBasenameAlternateExtension", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[basename].md', "x/y/strings.md"), "");
    });
    test("GetLocaleFromPathBasenameWithLocaleDir", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[locale]/[basename].json', "x/y/zh-Hans-CN/strings.json"), "zh-Hans-CN");
    });
    test("GetLocaleFromPathBasenameWithLocaleAlternateExtension", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[locale]/[basename].md', "x/y/de-DE/strings.md"), "de-DE");
    });
    test("GetLocaleFromPathBasenameAndLocaleTogether1", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "x/y/strings_de-DE.json"), "de-DE");
    });
    test("GetLocaleFromPathBasenameAndLocaleTogether2", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[basename]_[localeUnder].[extension]', "x/y/strings_de_DE.json"), "de-DE");
    });
    test("GetLocaleFromPathFilename", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[filename]', "x/y/strings.json"), "");
    });
    test("GetLocaleFromPathLocale", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/de-DE/strings.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleLong", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/zh-Hans-CN/strings.json"), "zh-Hans-CN");
    });
    test("GetLocaleFromPathLocaleShort", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/fr/strings.json"), "fr");
    });
    test("GetLocaleFromPathLanguage", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[language]/strings.json', "x/y/de/strings.json"), "de");
    });
    test("GetLocaleFromPathScript", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[language]-[script]/strings.json', "x/y/zh-Hans/strings.json"), "zh-Hans");
    });
    test("GetLocaleFromPathRegion", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[region]/strings.json', "x/y/JP/strings.json"), "JP");
    });
    test("GetLocaleFromPathLocaleDir", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/DE/strings.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleResourceDir", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[resourceDir]/[localeDir]/strings.json', "x/y/res/de/DE/strings.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleResourceDir2", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[resourceDir]/[locale]/strings.json', "x/y/res/de-DE/strings.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleDirShort", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/strings.json"), "de");
    });
    test("GetLocaleFromPathLocaleDirLong", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/zh/Hans/CN/strings.json"), "zh-Hans-CN");
    });
    test("GetLocaleFromPathLocaleDirStart", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[localeDir]/strings.json', "de/DE/strings.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleUnder", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de_DE.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleUnderShort", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de.json"), "de");
    });
    test("GetLocaleFromPathLocaleUnderLong", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_zh_Hans_CN.json"), "zh-Hans-CN");
    });
    test("GetLocaleFromPathLocaleLower", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de-de.json"), "de-DE");
    });
    test("GetLocaleFromPathLocaleLowerShort", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de.json"), "de");
    });
    test("GetLocaleFromPathLocaleLowerLong", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_zh-hans-cn.json"), "zh-Hans-CN");
    });
    test("GetLocaleFromPathNoTemplate", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath(undefined, "x/y/strings_zh-hans-cn.json"), "");
    });
    test("GetLocaleFromPathNoPath", function() {
        expect.assertions(1);
        test.equals(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', undefined), "");
    });
    test("UtilsCleanString", function() {
        expect.assertions(1);
        test.equals(utils.cleanString(' \n \t \\    &quot;a    b&apos;s &lt;b&gt;&amp; c’s     '), "\"a b's <b>& c's");
    });
    test("UtilsCleanStringBadInput", function() {
        expect.assertions(6);
        test.equals(utils.cleanString(''), '');
        expect(!utils.cleanString(null)).toBeTruthy();
        expect(!utils.cleanString(undefined)).toBeTruthy();
        expect(!utils.cleanString(345)).toBeTruthy();
        expect(!utils.cleanString(true)).toBeTruthy();
        expect(!utils.cleanString({'obj': 'foo'})).toBeTruthy();
    });
    testisBaseLocale: function(test) {
        expect.assertions(3);
        test.equals(utils.isBaseLocale("ko-KR"), true);
        test.equals(utils.isBaseLocale("fr-CA"), false);
        test.equals(utils.isBaseLocale(), false);
    });
    testgetBaseLocale: function(test) {
        expect.assertions(3);
        test.equals(utils.getBaseLocale("ko-KR"), "ko-KR");
        test.equals(utils.getBaseLocale("fr-CA"), "fr-FR");
        test.equals(utils.getBaseLocale(), undefined);
    });
    testsetBaseLocale: function(test) {
        expect.assertions(12);
        var localeMap = {
            "es-CO": "es",
            "fr-CA": "fr"
        };
        utils.setBaseLocale(localeMap);
        test.equals(utils.isBaseLocale("es-ES"), false);
        test.equals(utils.isBaseLocale("es-CO"), true);
        test.equals(utils.isBaseLocale("fr-FR"), false);
        test.equals(utils.isBaseLocale("fr-CA"), true);
        test.equals(utils.getBaseLocale("es-ES"), "es-CO");
        test.equals(utils.getBaseLocale("fr-FR"), "fr-CA");
        utils.clearOverrideBaseLocale();
        test.equals(utils.isBaseLocale("es-ES"), true);
        test.equals(utils.isBaseLocale("es-CO"), false);
        test.equals(utils.isBaseLocale("fr-FR"), true);
        test.equals(utils.isBaseLocale("fr-CA"), false);
        test.equals(utils.getBaseLocale("es-CO"), "es-ES");
        test.equals(utils.getBaseLocale("fr-FR"), "fr-FR");
    });
}
