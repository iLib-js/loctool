/*
 * testPseudoHant.js - test the resource string object.
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

if (!PseudoHant) {
    var PseudoHant = require("../lib/PseudoHant.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports.pseudohant = {
    testPseudoHantRightSourceLocale: function(test) {
        test.expect(2);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            sourceLocale: "zh-Hans-CN",
            targetLocale: "zh-Hant-HK"
        });

        test.equal(ph.getSourceLocale(), "zh-Hans-CN");
        test.equal(ph.getTargetLocale(), "zh-Hant-HK");

        test.done();
    },

    testPseudoHantGetString: function(test) {
        test.expect(3);

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

        test.equal(ph.getString('你好吗？'), "你好嗎？");
        test.equal(ph.getString('燕子的巡航速度是多少？'), "燕子的巡航速度是多少？");
        test.equal(ph.getString('什么？ 你是指欧洲的燕子还是非洲的燕子？'), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    },

    testPseudoHantGetStringEnglish: function(test) {
        test.expect(2);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        test.equal(ph.getString('foo'), "foo");
        test.equal(ph.getString('What is the cruising speed of a swallow?'), "What is the cruising speed of a swallow?");

        test.done();
    },

    testPseudoHantGetStringForResourceArray: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        test.ok(ra);

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

        test.equal(ph.getStringForResource(ra, 0), "你好嗎？");
        test.equal(ph.getStringForResource(ra, 1), "燕子的巡航速度是多少？");
        test.equal(ph.getStringForResource(ra, 2), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    },

    testPseudoHantGetStringForResourcePlural: function(test) {
        test.expect(4);

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
        test.ok(rp);

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

        test.equal(ph.getStringForResource(rp, "one"), "你好嗎？");
        test.equal(ph.getStringForResource(rp, "few"), "燕子的巡航速度是多少？");
        test.equal(ph.getStringForResource(rp, "many"), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    },

    testPseudoHantGetStringForResourceString: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            sourceLocale: "en-US",
            pathName: "a/b/c.java"
        });
        test.ok(rs);

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

        test.equal(ph.getStringForResource(rs), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    },

    testPseudoHantGetStringForResourceArrayNoPreviousTranslation: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        test.ok(ra);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        // no translation? Just return the source
        test.equal(ph.getStringForResource(ra, 0), "How are you?");
        test.equal(ph.getStringForResource(ra, 1), "What is the cruising speed of a swallow?");
        test.equal(ph.getStringForResource(ra, 2), "What? Do you mean a European swallow or an African swallow?");

        test.done();
    },

    testPseudoHantGetStringForResourcePluralNoPreviousTranslation: function(test) {
        test.expect(4);

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
        test.ok(rp);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        // no translation? Just return the source
        test.equal(ph.getStringForResource(rp, "one"), "How are you?");
        test.equal(ph.getStringForResource(rp, "few"), "What is the cruising speed of a swallow?");
        test.equal(ph.getStringForResource(rp, "many"), "What? Do you mean a European swallow or an African swallow?");

        test.done();
    },

    testPseudoHantGetStringForResourceStringNoPreviousTranslation: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        test.ok(rs);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        test.equal(ph.getStringForResource(rs), "What? Do you mean a European swallow or an African swallow?");

        test.done();
    },

    testPseudoHantGetStringForResourceUndefined: function(test) {
        test.expect(1);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        test.ok(!ph.getStringForResource(undefined, 0));

        test.done();
    },

    testPseudoHantGetStringTW: function(test) {
        test.expect(3);

        var translations = new TranslationSet();

        // test Taiwan specific phrases

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-TW"
        });

        // TW specific
        test.equal(ph.getString('卸載'), "解除安裝");
        test.equal(ph.getString('城域網'), "都會網路");
        test.equal(ph.getString('優先級'), "優先順序");

        test.done();
    },

    testPseudoHantGetStringTWGeneric: function(test) {
        test.expect(3);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-TW"
        });

        // generic traditional should still work too
        test.equal(ph.getString('与君一席话胜读十年书'), "與君一席話勝讀十年書");
        test.equal(ph.getString('东荡西除？'), "東蕩西除？");
        test.equal(ph.getString('云从龙风从虎'), "雲從龍風從虎");

        test.done();
    },

    testPseudoHantGetStringHK: function(test) {
        test.expect(3);

        var translations = new TranslationSet();

        // test Hong Kong specific phrases

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        test.equal(ph.getString('鰂魚涌'), "鰂魚涌");
        test.equal(ph.getString('深涌'), "深涌");
        test.equal(ph.getString('蔥'), "葱");
        test.done();
    },

    testPseudoHantGetStringHKGeneric: function(test) {
        test.expect(3);

        var translations = new TranslationSet();

        // test Hong Kong specific phrases

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK"
        });

        // generic traditional should still work too
        test.equal(ph.getString('与君一席话胜读十年书'), "與君一席話勝讀十年書");
        test.equal(ph.getString('东荡西除？'), "東蕩西除？");
        test.equal(ph.getString('云从龙风从虎'), "雲從龍風從虎");

        test.done();
    },

    testPseudoHantGetStringForResourceWithOverrideTranslation: function(test) {
        test.expect(2);

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

        test.equal(ph.getStringForResource(english1), "override string");  // looked up
        test.equal(ph.getStringForResource(english2), "東蕩西除？");        // auto-generated

        test.done();
    },

    testPseudoHantGetStringXML: function(test) {
        test.expect(3);

        var translations = new TranslationSet();

        var ph = new PseudoHant({
            set: translations,
            targetLocale: "zh-Hant-HK",
            type: "xml"
        });

        test.equal(ph.getString('<span>你好吗</span>？'), "<span>你好嗎</span>？");
        test.equal(ph.getString('燕子的巡航速度是多少？'), "燕子的巡航速度是多少？");
        test.equal(ph.getString('<i>什么</i>？ 你是指欧洲的燕子还是非洲的燕子？'), "<i>什麼</i>？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    }
};
