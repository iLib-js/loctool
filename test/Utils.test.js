/*
 * Utils.test.js - test the utils object.
 *
 * Copyright © 2016-2017, 2022-2024 HealthTap, Inc.
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
        expect(utils.hashKey("Settings in your profile")).toBe("r618035987");
        expect(utils.hashKey("All locations")).toBe("r246937959");
        expect(utils.hashKey("Conditions")).toBe("r103883086");
        expect(utils.hashKey("Everything")).toBe("r414542544");
        expect(utils.hashKey("Locations")).toBe("r29058502");
    });

    test("HashKeySimpleTexts2", function() {
        expect.assertions(5);
        expect(utils.hashKey("Procedures")).toBe("r807691021");
        expect(utils.hashKey("Functions")).toBe("r535786086");
        expect(utils.hashKey("Morning and afternoon")).toBe("r409842466");
        expect(utils.hashKey("Evening")).toBe("r72303136");
        expect(utils.hashKey("Nighttime")).toBe("r332185734");
    });

    test("HashKeySimpleTexts3", function() {
        expect.assertions(8);
        expect(utils.hashKey("Private Profile")).toBe("r314592735");
        expect(utils.hashKey("People you are connected to")).toBe("r711926199");
        expect(utils.hashKey("Notifications")).toBe("r284964820");
        expect(utils.hashKey("News")).toBe("r613036745");
        expect(utils.hashKey("More Tips")).toBe("r216617786");
        expect(utils.hashKey("Filters")).toBe("r81370429");
        expect(utils.hashKey("Referral Link")).toBe("r140625167");
        expect(utils.hashKey("Questions")).toBe("r256277957");
    });

    test("HashKeyEscapes", function() {
        expect.assertions(2);
        expect(utils.hashKey("Can\'t find id")).toBe("r743945592");
        expect(utils.hashKey("Can\'t find an application for SMS")).toBe("r909283218");
    });

    test("HashKeyPunctuation", function() {
        expect.assertions(6);
        expect(utils.hashKey("{name}({generic_name})")).toBe("r300446104");
        expect(utils.hashKey("{name}, {sharer_name} {start}found this interesting{end}")).toBe("r8321889");
        expect(utils.hashKey("{sharer_name} {start}found this interesting{end}")).toBe("r639868344");
        expect(utils.hashKey("Grow your network")).toBe("r214079422");
        expect(utils.hashKey("Failed to send connection request!")).toBe("r1015770123");
        expect(utils.hashKey("Connection request copied!")).toBe("r136272443");
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
        expect(utils.formatPath('resources/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("resources/de/DE/strings.json");
    });

    test("GetLocalizedPathDir", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de/DE/strings.json");
    });

    test("GetLocalizedPathBasename", function() {
        expect.assertions(1);
        expect(utils.formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.j");
    });

    test("GetLocalizedPathBasenameAlternateExtension", function() {
        expect.assertions(1);
        expect(utils.formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.md",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.j");
    });

    test("GetLocalizedPathFilename", function() {
        expect.assertions(1);
        expect(utils.formatPath('[localeDir]/tr-[filename]', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.json");
    });

    test("GetLocalizedPathExtension", function() {
        expect.assertions(1);
        expect(utils.formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings.jsn",
            locale: "de-DE"
        })).toBe("de/DE/tr-foobar.jsn");
    });

    test("GetLocalizedPathExtensionNotThere", function() {
        expect.assertions(1);
        expect(utils.formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings",
            locale: "de-DE"
        })).toBe("de/DE/tr-foobar.");
    });

    test("GetLocalizedPathLocale", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[locale]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de-DE/strings.json");
    });

    test("GetLocalizedPathLanguage", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de/strings.json");
    });

    test("GetLocalizedPathLanguageNotThere", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "DE"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathRegion", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/DE/strings.json");
    });

    test("GetLocalizedPathRegionNotThere", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathScript", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/Hans/strings.json");
    });

    test("GetLocalizedPathScriptNotThere", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-CN"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathLocaleUnder", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/strings_[localeUnder].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/strings_zh_Hans_CN.json");
    });

    test("GetLocalizedPathLocaleLower", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/strings_[localeLower].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/strings_zh-hans-cn.json");
    });

    test("GetresourceDirPath", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "ko",
            resourceDir: "res"
        })).toBe("x/y/res/ko/strings.json");
    });

    test("GetresourceDirPath2", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "fr-CA",
            resourceDir: "resources"
        })).toBe("x/y/resources/fr/CA/strings.json");
    });

    test("GetresourceDirPath3", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/[resourceDir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "es"
        })).toBe("x/y/es/strings.json");
    });

    test("Formatting a path with multiple dots in it", function() {
        expect.assertions(1);
        expect(utils.formatPath('[dir]/x-config.[locale].json', {
            sourcepath: "x/y/x-config.en-US.json",
            locale: "es"
        })).toBe("x/y/x-config.es.json");
    });

    test("GetLocaleFromPathDir", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings.json', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathBasename", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[basename].json', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathBasenameAlternateExtension", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[basename].md', "x/y/strings.md")).toBe("");
    });

    test("GetLocaleFromPathBasenameWithLocaleDir", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[locale]/[basename].json', "x/y/zh-Hans-CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathBasenameWithLocaleAlternateExtension", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[locale]/[basename].md', "x/y/de-DE/strings.md")).toBe("de-DE");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogether1", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "x/y/strings_de-DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogether2", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[basename]_[localeUnder].[extension]', "x/y/strings_de_DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathFilename", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[filename]', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathLocale", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/de-DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleLong", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/zh-Hans-CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleShort", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/fr/strings.json")).toBe("fr");
    });

    test("GetLocaleFromPathLanguage", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[language]/strings.json', "x/y/de/strings.json")).toBe("de");
    });

    test("GetLocaleFromPathScript", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[language]-[script]/strings.json', "x/y/zh-Hans/strings.json")).toBe("zh-Hans");
    });

    test("GetLocaleFromPathRegion", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[region]/strings.json', "x/y/JP/strings.json")).toBe("JP");
    });

    test("GetLocaleFromPathLocaleDir", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleResourceDir", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[resourceDir]/[localeDir]/strings.json', "x/y/res/de/DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleResourceDir2", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[resourceDir]/[locale]/strings.json', "x/y/res/de-DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleDirShort", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/strings.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleDirLong", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/zh/Hans/CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleDirStart", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[localeDir]/strings.json', "de/DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleUnder", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de_DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleUnderShort", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleUnderLong", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_zh_Hans_CN.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleLower", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de-de.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleLowerShort", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleLowerLong", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_zh-hans-cn.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathNoTemplate", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath(undefined, "x/y/strings_zh-hans-cn.json")).toBe("");
    });

    test("Getting the locale from the path where there are multiple dots in the file name", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/config.[locale].json', "x/y/config.en-US.json")).toBe("en-US");
    });

    test("Getting the locale from the path where there are multiple dots in the file name and a short locale", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/config.[locale].json', "x/y/config.en.json")).toBe("en");
    });

    test("Getting the locale from the path where there are multiple dots in the file name with a dash", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/x-config.[locale].json', "x/y/x-config.en-US.json")).toBe("en-US");
    });

    test("Getting the locale from the path where there are multiple dots in the file name with a dash and a short locale", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/x-config.[locale].json', "x/y/x-config.en.json")).toBe("en");
    });

    test("Getting the locale from the path where there are multiple dots in the file name with a dash in Bengali", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/x-config.[locale].json', "x/y/x-config.bn-IN.json")).toBe("bn-IN");
    });

    test("Getting the locale from the path where there are multiple dots in the file name with a dash and a short locale in Bengali", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/x-config.[locale].json', "x/y/x-config.bn.json")).toBe("bn");
    });

    test("GetLocaleFromPathNoPath", function() {
        expect.assertions(1);
        expect(utils.getLocaleFromPath('[dir]/strings_[localeLower].json', undefined)).toBe("");
    });

    test("UtilsCleanString", function() {
        expect.assertions(1);
        expect(utils.cleanString(' \n \t \\    &quot;a    b&apos;s &lt;b&gt;&amp; c’s     ')).toBe("\"a b's <b>& c's");
    });

    test("UtilsCleanStringBadInput", function() {
        expect.assertions(6);
        expect(utils.cleanString('')).toBe('');
        expect(!utils.cleanString(null)).toBeTruthy();
        expect(!utils.cleanString(undefined)).toBeTruthy();
        expect(!utils.cleanString(345)).toBeTruthy();
        expect(!utils.cleanString(true)).toBeTruthy();
        expect(!utils.cleanString({'obj': 'foo'})).toBeTruthy();
    });
    test("isBaseLocale", function() {
        expect.assertions(3);
        expect(utils.isBaseLocale("ko-KR")).toBe(true);
        expect(utils.isBaseLocale("fr-CA")).toBe(false);
        expect(utils.isBaseLocale()).toBe(false);
    });
    test("getBaseLocale", function() {
        expect.assertions(3);
        expect(utils.getBaseLocale("ko-KR")).toBe("ko-KR");
        expect(utils.getBaseLocale("fr-CA")).toBe("fr-FR");
        expect(utils.getBaseLocale()).toBeUndefined()
    });
    test("setBaseLocale", function() {
        expect.assertions(12);
        var localeMap = {
            "es-CO": "es",
            "fr-CA": "fr"
        };

        utils.setBaseLocale(localeMap);
        expect(utils.isBaseLocale("es-ES")).toBe(false);
        expect(utils.isBaseLocale("es-CO")).toBe(true);
        expect(utils.isBaseLocale("fr-FR")).toBe(false);
        expect(utils.isBaseLocale("fr-CA")).toBe(true);
        expect(utils.getBaseLocale("es-ES")).toBe("es-CO");
        expect(utils.getBaseLocale("fr-FR")).toBe("fr-CA");
        utils.clearOverrideBaseLocale();
        expect(utils.isBaseLocale("es-ES")).toBe(true);
        expect(utils.isBaseLocale("es-CO")).toBe(false);
        expect(utils.isBaseLocale("fr-FR")).toBe(true);
        expect(utils.isBaseLocale("fr-CA")).toBe(false);
        expect(utils.getBaseLocale("es-CO")).toBe("es-ES");
        expect(utils.getBaseLocale("fr-FR")).toBe("fr-FR");
    });
});
