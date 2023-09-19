/*
 * PseudoHant.test.js - test the resource string object.
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
if (!PseudoHant) {
    var PseudoHant = require("../lib/PseudoHant.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ResourceString = require("../lib/ResourceString.js");
}
describe("pseudohant", function() {
    test("PseudoHantRightSourceLocale", function() {
        expect.assertions(2);
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            sourceLocale: "zh-Hans-CN",
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getSourceLocale()).toBe("zh-Hans-CN");
        expect(ph.getTargetLocale()).toBe("zh-Hant-HK");
    });
    test("PseudoHantGetString", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        /*
        translations.add(new ResourceArray({
            project: "foo",
            key: 'asdf',
            sourceArray: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
            pathName: "a/b/c.java",
            sourceLocale: "zh-Hans-CN"
        }));
         */
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getString('你好吗？')).toBe("你好嗎？");
        expect(ph.getString('燕子的巡航速度是多少？')).toBe("燕子的巡航速度是多少？");
        expect(ph.getString('什么？ 你是指欧洲的燕子还是非洲的燕子？')).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
    });
    test("PseudoHantGetStringEnglish", function() {
        expect.assertions(2);
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getString('foo')).toBe("foo");
        expect(ph.getString('What is the cruising speed of a swallow?')).toBe("What is the cruising speed of a swallow?");
    });
    test("PseudoHantGetStringForResourceArray", function() {
        expect.assertions(4);
        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(ra).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceArray({
            project: "foo",
            key: 'asdf',
            sourceLocale: "en-US",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            targetLocale: "zh-Hans-CN",
            targetArray: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
            pathName: "a/b/c.java"
        }));
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getStringForResource(ra, 0)).toBe("你好嗎？");
        expect(ph.getStringForResource(ra, 1)).toBe("燕子的巡航速度是多少？");
        expect(ph.getStringForResource(ra, 2)).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
    });
    test("PseudoHantGetStringForResourcePlural", function() {
        expect.assertions(4);
        var rp = new ResourcePlural({
            project: "foo",
            key: "asdf",
            sourceStrings: {
                one: "How are you?",
                few: "What is the cruising speed of a swallow?？",
                many: "What? Do you mean a European swallow or an African swallow?"
            },
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(rp).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: 'asdf',
            sourceStrings: {
                one: "How are you?",
                few: "What is the cruising speed of a swallow?？",
                many: "What? Do you mean a European swallow or an African swallow?"
            },
            sourceLocale: "en-US",
            targetStrings: {
                one: '你好吗？',
                few: '燕子的巡航速度是多少？',
                many: '什么？ 你是指欧洲的燕子还是非洲的燕子？'
            },
            pathName: "a/b/c.java",
            targetLocale: "zh-Hans-CN"
        }));
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getStringForResource(rp, "one")).toBe("你好嗎？");
        expect(ph.getStringForResource(rp, "few")).toBe("燕子的巡航速度是多少？");
        expect(ph.getStringForResource(rp, "many")).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
    });
    test("PseudoHantGetStringForResourceString", function() {
        expect.assertions(2);
        var rs = new ResourceString({
            project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            sourceLocale: "en-US",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'asdf',
            source: "What? Do you mean a European swallow or an African swallow?",
            sourceLocale: "en-US",
            target: '什么？ 你是指欧洲的燕子还是非洲的燕子？',
            targetLocale: "zh-Hans-CN",
            pathName: "a/b/c.java"
        }));
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getStringForResource(rs)).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
    });
    test("PseudoHantGetStringForResourceArrayNoPreviousTranslation", function() {
        expect.assertions(4);
        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(ra).toBeTruthy();
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        // no translation? Just return the source
        expect(ph.getStringForResource(ra, 0)).toBe("How are you?");
        expect(ph.getStringForResource(ra, 1)).toBe("What is the cruising speed of a swallow?");
        expect(ph.getStringForResource(ra, 2)).toBe("What? Do you mean a European swallow or an African swallow?");
    });
    test("PseudoHantGetStringForResourcePluralNoPreviousTranslation", function() {
        expect.assertions(4);
        var rp = new ResourcePlural({
            project: "foo",
            key: "asdf",
            sourceStrings: {
                one: "How are you?",
                few: "What is the cruising speed of a swallow?",
                many: "What? Do you mean a European swallow or an African swallow?"
            },
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(rp).toBeTruthy();
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        // no translation? Just return the source
        expect(ph.getStringForResource(rp, "one")).toBe("How are you?");
        expect(ph.getStringForResource(rp, "few")).toBe("What is the cruising speed of a swallow?");
        expect(ph.getStringForResource(rp, "many")).toBe("What? Do you mean a European swallow or an African swallow?");
    });
    test("PseudoHantGetStringForResourceStringNoPreviousTranslation", function() {
        expect.assertions(2);
        var rs = new ResourceString({
            project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(rs).toBeTruthy();
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getStringForResource(rs)).toBe("What? Do you mean a European swallow or an African swallow?");
    });
    test("PseudoHantGetStringForResourceUndefined", function() {
        expect.assertions(1);
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(!ph.getStringForResource(undefined, 0)).toBeTruthy();
    });
    test("PseudoHantGetStringTW", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        // test Taiwan specific phrases
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-TW"
        });
        // TW specific
        expect(ph.getString('卸載')).toBe("解除安裝");
        expect(ph.getString('城域網')).toBe("都會網路");
        expect(ph.getString('優先級')).toBe("優先順序");
    });
    test("PseudoHantGetStringTWGeneric", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-TW"
        });
        // generic traditional should still work too
        expect(ph.getString('与君一席话胜读十年书')).toBe("與君一席話勝讀十年書");
        expect(ph.getString('东荡西除？')).toBe("東蕩西除？");
        expect(ph.getString('云从龙风从虎')).toBe("雲從龍風從虎");
    });
    test("PseudoHantGetStringHK", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        // test Hong Kong specific phrases
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getString('鰂魚涌')).toBe("鰂魚湧");
        expect(ph.getString('深涌')).toBe("深涌");
        expect(ph.getString('蔥')).toBe("葱");
    });
    test("PseudoHantGetStringHKGeneric", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        // test Hong Kong specific phrases
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        // generic traditional should still work too
        expect(ph.getString('与君一席话胜读十年书')).toBe("與君一席話勝讀十年書");
        expect(ph.getString('东荡西除？')).toBe("東蕩西除？");
        expect(ph.getString('云从龙风从虎')).toBe("雲從龍風從虎");
    });
    test("PseudoHantGetStringForResourceWithOverrideTranslation", function() {
        expect.assertions(2);
        var translations = new TranslationSet();
        var english1 = new ResourceString({
            key: "foo",
            autoKey: true,
            source: "The king of a thousand words can read a book",
            sourceLocale: "en-US",
            origin: "source"
        });
        translations.add(english1);
        var english2 = new ResourceString({
            autoKey: true,
            key: "East and West?",
            source: "East and West?",
            sourceLocale: "en-US",
            origin: "source"
        });
        translations.add(english2);
        res = new ResourceString({
            autoKey: true,
            key: "East and West?",
            source: "East and West?",
            sourceLocale: "en-US",
            target: "东荡西除？",
            targetLocale: "zh-Hans-CN",
            origin: "target"
        });
        translations.add(res);
        res = new ResourceString({
            key: "foo",
            autoKey: true,
            source: "The king of a thousand words can read a book",
            sourceLocale: "en-US",
            target: "与君一席话胜读十年书",
            targetLocale: "zh-Hans-CN",
            origin: "target"
        });
        translations.add(res);
        res = new ResourceString({
            key: "foo",
            autoKey: true,
            source: "The king of a thousand words can read a book",
            sourceLocale: "en-US",
            target: "override string",
            targetLocale: "zh-Hant-HK",
            origin: "target"
        });
        translations.add(res);
        // test Hong Kong specific phrases
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });
        expect(ph.getStringForResource(english1)).toBe("override string");  // looked up
        expect(ph.getStringForResource(english2)).toBe("東蕩西除？");        // auto-generated
    });
    test("PseudoHantGetStringXML", function() {
        expect.assertions(3);
        var translations = new TranslationSet();
        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK",
            type: "xml"
        });
        expect(ph.getString('<span>你好吗</span>？')).toBe("<span>你好嗎</span>？");
        expect(ph.getString('燕子的巡航速度是多少？')).toBe("燕子的巡航速度是多少？");
        expect(ph.getString('<i>什么</i>？ 你是指欧洲的燕子还是非洲的燕子？')).toBe("<i>什麼</i>？ 你是指歐洲的燕子還是非洲的燕子？");
    });
});
