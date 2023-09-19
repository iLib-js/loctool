/*
 * AndroidResourceFile.test.js - test the Android resource file handler object.
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
if (!AndroidResourceFile) {
    var AndroidResourceFile = require("../lib/AndroidResourceFile.js");
    var AndroidResourceFileType = require("../lib/AndroidResourceFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
    var ResourcePlural =  require("../lib/ResourcePlural.js");
    var ResourceArray =  require("../lib/ResourceArray.js");
}
function diff(a, b) {
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    });
}
var p = new AndroidProject({
    id: "android",
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});
var arft = new AndroidResourceFileType(p);
describe("androidresourcefile", function() {
    test("AndroidResourceFileConstructor", function() {
        expect.assertions(1);
        var arf = new AndroidResourceFile();
        expect(arf).toBeTruthy();
    });
    test("AndroidResourceFileConstructorParams", function() {
        expect.assertions(1);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./java/res/values/t1.xml",
            locale: "en-US"
        });
        expect(arf).toBeTruthy();
    });
    test("AndroidResourceFileConstructorNoFile", function() {
        expect.assertions(1);
        var arf = new AndroidResourceFile({project: p, pathName: "foo"});
        expect(arf).toBeTruthy();
    });
    test("AndroidResourceFileParseStringGetByKey", function() {
        expect.assertions(6);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "thanks_friend_pre", "x-android-resource"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Send a thank you note to\n{name}");
        expect(r.getKey()).toBe("thanks_friend_pre");
        expect(r.getState()).toBe("new");
    });
    test("AndroidResourceFileParsePluralTargetOnly", function() {
        expect.assertions(10);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            locale: "de-DE" // different from source locale, so should produce target resources
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <plurals name="friend_comment">\n' +
                '    <item quantity="one">\n' +
                '      {start}1 friend{end} commented\n' +
                '    </item>\n' +
                '    <item quantity="other">\n' +
                '      {start}%d friends{end} commented\n' +
                '    </item>\n' +
                '  </plurals>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourcePlural.hashKey("android", undefined, "de-DE", "friend_comment"));
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("friend_comment");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getTargetLocale()).toBe("de-DE");
        expect(r.getState()).toBe("new");
        var plurals = r.getTargetPlurals();
        expect(plurals).toBeTruthy();
        expect(plurals.one).toBe("{start}1 friend{end} commented");
        expect(plurals.other).toBe("{start}%d friends{end} commented");
    });
    test("AndroidResourceFileParsePluralSourceOnly", function() {
        expect.assertions(10);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            targetLocale: "en-US"  // same as source locale, so should produce source-only resources
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <plurals name="friend_comment">\n' +
                '    <item quantity="one">\n' +
                '      {start}1 friend{end} commented\n' +
                '    </item>\n' +
                '    <item quantity="other">\n' +
                '      {start}%d friends{end} commented\n' +
                '    </item>\n' +
                '  </plurals>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourcePlural.hashKey("android", undefined, "en-US", "friend_comment"));
        expect(r).toBeTruthy();
        expect(r.getSourceLocale()).toBe("en-US");
        expect(!r.getTargetLocale()).toBeTruthy();
        expect(r.getKey()).toBe("friend_comment");
        expect(r.getState()).toBe("new");
        var plurals = r.getSourcePlurals();
        expect(plurals).toBeTruthy();
        expect(plurals.one).toBe("{start}1 friend{end} commented");
        expect(plurals.other).toBe("{start}%d friends{end} commented");
    });
    test("AndroidResourceFileParseArrayGetByKey", function() {
        expect.assertions(10);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string-array name="self_questions">\n' +
                '    <item>How many times have you been pregnant?</item>\n' +
                '    <item>How many deliveries did you have?</item>\n' +
                '    <item>How many times did you have a pre-term deliveries?</item>\n' +
                '  </string-array>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceArray.hashKey("android", undefined, "en-US", "self_questions"));
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("self_questions");
        expect(r.getState()).toBe("new");
        var array = r.getSourceArray();
        expect(array).toBeTruthy();
        expect(array.length).toBe(3);
        expect(array[0]).toBe("How many times have you been pregnant?");
        expect(array[1]).toBe("How many deliveries did you have?");
        expect(array[2]).toBe("How many times did you have a pre-term deliveries?");
    });
    test("AndroidResourceFileParseStringDNT", function() {
        expect.assertions(7);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "app_id", "x-android-resource"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("151779581544891");
        expect(r.getKey()).toBe("app_id");
        expect(r.getState()).toBe("new");
        test.ok(r.dnt)
    });
    test("AndroidResourceFileParseStringWithComment", function() {
        expect.assertions(8);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "thanks_friend_pre", "x-android-resource"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Send a thank you note to\n{name}");
        expect(r.getKey()).toBe("thanks_friend_pre");
        expect(r.getComment()).toBe("name is name of your friend");
        expect(r.getState()).toBe("new");
        expect(!r.dnt).toBeTruthy();
    });
    test("AndroidResourceFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "foo"
        });
        expect(arf).toBeTruthy();
        var set = arf.getTranslationSet();
        expect(set.size()).toBe(0);
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(6);
    });
    test("AndroidResourceFileExtractFile", function() {
        expect.assertions(7);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./java/res/values/strings.xml"
        });
        expect(arf).toBeTruthy();
        // should read the file
        arf.extract();
        var set = arf.getTranslationSet();
        expect(set.size()).toBe(12);
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "ask_question", "x-android-resource"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ask friends");
        expect(r.getKey()).toBe("ask_question");
        expect(r.getState()).toBe("new");
        expect(!r.getContext()).toBeTruthy();
    });
    test("AndroidResourceFileExtractFilePlurals", function() {
        expect.assertions(8);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./java/res/values/plurals.xml"
        });
        expect(arf).toBeTruthy();
        // should read the file
        arf.extract();
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var r = set.get(ResourcePlural.hashKey("android", undefined, "en-US", "friend_comment"));
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("friend_comment");
        var plurals = r.getSourcePlurals();
        expect(plurals).toBeTruthy();
        expect(plurals.one).toBe("{start}1 friend{end} commented");
        expect(plurals.other).toBe("{start}%d friends{end} commented");
    });
    test("AndroidResourceFileExtractFileArrays", function() {
        expect.assertions(10);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./java/res/values/arrays.xml"
        });
        expect(arf).toBeTruthy();
        // should read the file
        arf.extract();
        var set = arf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.get(ResourceArray.hashKey("android", undefined, "en-US", "self_questions"));
        expect(r).toBeTruthy();
        expect(r.getKey()).toBe("self_questions");
        var array = r.getSourceArray();
        expect(array).toBeTruthy();
        expect(array.length).toBe(3);
        expect(array[0]).toBe("How many times have you been pregnant?");
        expect(array[1]).toBe("How many deliveries did you have?");
        expect(array[2]).toBe("How many times did you have a pre-term deliveries?");
    });
    test("AndroidResourceFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "foo"
        });
        expect(arf).toBeTruthy();
        // should attempt to read the file and not fail
        arf.extract();
        var set = arf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("AndroidResourceFileExtractBogusFile", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile(p, "./java/foo.java");
        expect(arf).toBeTruthy();
        // should attempt to read the file and not fail
        arf.extract();
        var set = arf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("AndroidResourceFileGetXMLStrings", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./testfiles/java/res/values/foo.xml"
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        arf.addResource(new ContextResourceString({
            project: "android",
            key: "asdf",
            source: "foobar",
            sourceLocale: "en-US"
        }));
        var xml = arf._getXML();
        // output is sorted by key now
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
            '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
            '  <string name="asdf">foobar</string>\n' +
            '  <string name="description_imgVw">imageView</string>\n' +
            '  <string name="disclaimer">Disclaimer</string>\n' +
            '  <string name="thanks">Thank you!</string>\n' +
            '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
            '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
            '</resources>';
        diff(xml, expected);
        expect(xml).toBe(expected);
    });
    test("AndroidResourceFileGetXMLNoChange", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./testfiles/java/res/values/foo.xml"
        });
        expect(arf).toBeTruthy();
        arf.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
                '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
                '  <string name="disclaimer">Disclaimer</string>\n' +
                '  <string name="description_imgVw">imageView</string>\n' +
                '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
                '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
                '  <string name="thanks">Thank you!</string>\n' +
                '</resources>\n');
        var xml = arf._getXML();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
            '  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
            '  <string name="disclaimer">Disclaimer</string>\n' +
            '  <string name="description_imgVw">imageView</string>\n' +
            '  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
            '  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
            '  <string name="thanks">Thank you!</string>\n' +
            '</resources>\n';
        expect(xml).toBe(expected);
    });
    test("AndroidResourceFileGetXMLPlurals", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./testfiles/java/res/values/foo.xml",
            locale: "en-US"
        });
        expect(arf).toBeTruthy();
        arf.addResource(new ResourcePlural({
            project: "android",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "few": "This is few",
                "other": "This is other"
            },
            locale: "en-US",
            comment: "comment1"
        }));
        arf.addResource(new ResourcePlural({
            project: "android",
            key: "foobar",
            sourceStrings: {
                "one": "un",
                "few": "deux",
                "other": "trois"
            },
            locale: "en-US",
            comment: "comment2"
        }));
        var xml = arf._getXML();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
            '  <plurals name="asdf" i18n="comment1">\n' +
            '    <item quantity="one">This is singular</item>\n' +
            '    <item quantity="few">This is few</item>\n' +
            '    <item quantity="other">This is other</item>\n' +
            '  </plurals>\n' +
            '  <plurals name="foobar" i18n="comment2">\n' +
            '    <item quantity="one">un</item>\n' +
            '    <item quantity="few">deux</item>\n' +
            '    <item quantity="other">trois</item>\n' +
            '  </plurals>\n' +
            '</resources>';
        expect(xml).toBe(expected);
    });
    test("AndroidResourceFileGetXMLArrays", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./testfiles/java/res/values/foo.xml",
            locale: "en-US"
        });
        expect(arf).toBeTruthy();
        arf.addResource(new ResourceArray({
            project: "android",
            key: "asdf",
            sourceArray: ["one", "two", "three"],
            sourceLocale: "en-US",
            comment: "comment1"
        }));
        arf.addResource(new ResourceArray({
            project: "android",
            key: "foobar",
            sourceArray: ["un", "deux", "trois"],
            sourceLocale: "en-US",
            comment: "comment2"
        }));
        var xml = arf._getXML();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<resources xmlns:tools="http://schemas.android.com/tools">\n' +
            '  <string-array name="asdf" i18n="comment1">\n' +
            '    <item>one</item>\n' +
            '    <item>two</item>\n' +
            '    <item>three</item>\n' +
            '  </string-array>\n' +
            '  <string-array name="foobar" i18n="comment2">\n' +
            '    <item>un</item>\n' +
            '    <item>deux</item>\n' +
            '    <item>trois</item>\n' +
            '  </string-array>\n' +
            '</resources>';
        expect(xml).toBe(expected);
    });
    test("AndroidResourceFileGetLocale", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values/foo.xml"
        });
        expect(arf).toBeTruthy();
        var l = arf.getLocale();
        expect(l).toBe("en-US");
    });
    test("AndroidResourceFileGetLocaleFromDir", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-en-rNZ/foo.xml"
        });
        expect(arf).toBeTruthy();
        var l = arf.getLocale();
        expect(l).toBe("en-NZ");
    });
    test("AndroidResourceFileGetContext", function() {
        expect.assertions(2);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-bar/foo.xml"
        });
        expect(arf).toBeTruthy();
        expect(arf.getContext()).toBe("bar");
    });
    test("AndroidResourceFileGetLocaleAndContext1", function() {
        expect.assertions(3);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-de-bar/foo.xml"
        });
        expect(arf).toBeTruthy();
        expect(arf.getLocale()).toBe("de");
        expect(arf.getContext()).toBe("bar");
    });
    test("AndroidResourceFileGetLocaleAndContext1", function() {
        expect.assertions(3);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-de-bar/foo.xml"
        });
        expect(arf).toBeTruthy();
        expect(arf.getLocale()).toBe("de");
        expect(arf.getContext()).toBe("bar");
    });
    test("AndroidResourceFileGetLocaleAndContext2", function() {
        expect.assertions(3);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-de-rCH-bar/foo.xml"
        });
        expect(arf).toBeTruthy();
        expect(arf.getLocale()).toBe("de-CH");
        expect(arf.getContext()).toBe("bar");
    });
    test("AndroidResourceFileGetLocaleAndContext2", function() {
        expect.assertions(3);
        var arf = new AndroidResourceFile({
            project: p,
            type: arft,
            pathName: "./res/values-zh-sHans-rCN-bar/foo.xml"
        });
        expect(arf).toBeTruthy();
        expect(arf.getLocale()).toBe("zh-Hans-CN");
        expect(arf.getContext()).toBe("bar");
    });
});
