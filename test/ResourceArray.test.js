/*
 * ResourceArray.test.js - test the resource array object.
 *
 * Copyright © 2016-2017, 2023 2019-2020, 2023 2023 HealthTap, Inc.
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
if (!ResourceArray) {
    var ResourceArray = require("../lib/ResourceArray.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}
describe("resourcearray", function() {
    test("ResourceArrayConstructorEmpty", function() {
        expect.assertions(1);
        var ra = new ResourceArray();
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorNoProps", function() {
        expect.assertions(1);
        var ra = new ResourceArray({});
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorEmptyNoSize", function() {
        expect.assertions(2);
        var ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(0);
    });
    test("ResourceArrayConstructor", function() {
        expect.assertions(1);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorRightContents", function() {
        expect.assertions(5);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        expect(ra.getKey()).toBe("asdf");
        expect(ra.getSourceArray()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
        expect(ra.getSourceLocale()).toBe("de-DE");
        expect(ra.pathName).toBe("a/b/c.java");
    });
    test("ResourceArrayConstructorFull", function() {
        expect.assertions(1);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorMissingElements", function() {
        expect.assertions(1);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", undefined, "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", undefined, "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorEmptyElements", function() {
        expect.assertions(1);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });
    test("ResourceArrayConstructorFullRightContents", function() {
        expect.assertions(7);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        expect(ra.getKey()).toBe("asdf");
        expect(ra.getSourceArray()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
        expect(ra.getSourceLocale()).toBe("en-US");
        expect(ra.getTargetArray()).toStrictEqual(["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
        expect(ra.getTargetLocale()).toBe("de-DE");
        expect(ra.pathName).toBe("a/b/c.java");
    });
    test("ResourceArrayConstructorDefaults", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        // got the right one?
        expect(ra.getKey()).toBe("asdf");
        // now the defaults
        expect(ra.getSourceLocale()).toBe("en-US");
        expect(ra.origin).toBe("source");
        expect(ra.datatype).toBe("x-android-resource");
        expect(ra.resType).toBe("array");
        expect(ra.getTargetLocale()).toBeFalsy();
        expect(ra.target).toBeFalsy();
    });
    test("ResourceArrayConstructorRightSize", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(3);
    });
    test("ResourceArrayConstructorRightSizeMissingElements", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", undefined, "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(4);
    });
    test("ResourceArrayConstructorRightSizeEmptyElements", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(4);
    });
    test("ResourceArrayGetKey", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getKey()).toBe("foo");
    });
    test("ResourceArrayGetKeyEmpty", function() {
        expect.assertions(2);
        var ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(!ra.getKey()).toBeTruthy();
    });
    test("ResourceStringGetContext", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        expect(ra).toBeTruthy();
        expect(ra.getContext()).toBe("landscape");
    });
    test("ResourceStringGetContextEmpty", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getContext()).toBeTruthy();
    });
    test("ResourceArrayGetArray", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSourceArray()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
    });
    test("ResourceArrayGetSourceArrayEmpty", function() {
        expect.assertions(2);
        var ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(ra.getSourceArray()).toStrictEqual([]);
    });
    test("ResourceArrayGetTargetArrayEmpty", function() {
        expect.assertions(2);
        var ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(!ra.getTargetArray()).toBeTruthy();
    });
    test("ResourceArrayGetSource", function() {
        expect.assertions(4);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource(0)).toBe("This is a test");
        expect(ra.getSource(1)).toBe("This is also a test");
        expect(ra.getSource(2)).toBe("This is not");
    });
    test("ResourceArrayGetSourceMissingElements", function() {
        expect.assertions(5);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", undefined, "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource(0)).toBe("This is a test");
        expect(ra.getSource(1)).toBe("This is also a test");
        expect(!ra.getSource(2)).toBeTruthy();
        expect(ra.getSource(3)).toBe("This is not");
    });
    test("ResourceArrayGetSourceEmptyElements", function() {
        expect.assertions(5);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource(0)).toBe("This is a test");
        expect(ra.getSource(1)).toBe("This is also a test");
        expect(ra.getSource(2)).toBe("");
        expect(ra.getSource(3)).toBe("This is not");
    });
    test("ResourceArrayGetTarget", function() {
        expect.assertions(4);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTarget(0)).toBe("Dies ist einen Test.");
        expect(ra.getTarget(1)).toBe("Dies ist auch einen Test.");
        expect(ra.getTarget(2)).toBe("Dies ist nicht.");
    });
    test("ResourceArrayGetTargetMissingElements", function() {
        expect.assertions(5);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", undefined, "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", undefined, "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTarget(0)).toBe("Dies ist einen Test.");
        expect(ra.getTarget(1)).toBe("Dies ist auch einen Test.");
        expect(!ra.getTarget(2)).toBeTruthy();
        expect(ra.getTarget(3)).toBe("Dies ist nicht.");
    });
    test("ResourceArrayGetTargetEmptyElements", function() {
        expect.assertions(5);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTarget(0)).toBe("Dies ist einen Test.");
        expect(ra.getTarget(1)).toBe("Dies ist auch einen Test.");
        expect(ra.getTarget(2)).toBe("");
        expect(ra.getTarget(3)).toBe("Dies ist nicht.");
    });
    test("ResourceArrayGetSourceNegativeIndex", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSource(-1)).toBeTruthy();
    });
    test("ResourceArrayGetTargetNegativeIndex", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getTarget(-1)).toBeTruthy();
    });
    test("ResourceArrayGetSourceIndexTooBig", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSource(6)).toBeTruthy();
    });
    test("ResourceArrayGetTargetIndexTooBig", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getTarget(6)).toBeTruthy();
    });
    test("ResourceArrayGetIndexNotWhole", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSource(2.6)).toBeTruthy();
    });
    test("ResourceArrayGeneratePseudo", function() {
        expect.assertions(4);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var rb = new RegularPseudo({
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("de-DE", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getSourceLocale()).toBe("en-US");
            expect(ra2.getTargetLocale()).toBe("de-DE");
        });
    });
    test("ResourceArrayGeneratePseudoRightString", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var rb = new RegularPseudo({
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("de-DE", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("de-DE");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("[Ťĥíš íš à ţëšţ6543210]");
            expect(strings[1]).toBe("[Ťĥíš íš àľšõ à ţëšţ9876543210]");
            expect(strings[2]).toBe("[Ťĥíš íš ñõţ543210]");
        });
    });
    test("ResourceArrayGeneratePseudoRightStringMissingOrEmptyElements", function() {
        expect.assertions(10);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", undefined, "", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var rb = new RegularPseudo({
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("de-DE", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("de-DE");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(5);
            expect(strings[0]).toBe("[Ťĥíš íš à ţëšţ6543210]");
            expect(strings[1]).toBe("[Ťĥíš íš àľšõ à ţëšţ9876543210]");
            expect(!strings[2]).toBeTruthy();
            expect(strings[3]).toBe("");
            expect(strings[4]).toBe("[Ťĥíš íš ñõţ543210]");
        });
    });
    test("ResourceArrayGeneratePseudoSkipPercents", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a %s test", "This is also a %f test", "This is not %4$-2.2d"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var rb = new RegularPseudo({
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("de-DE", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("de-DE");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("[Ťĥíš íš à %s ţëšţ876543210]");
            expect(strings[1]).toBe("[Ťĥíš íš àľšõ à %f ţëšţ6543210]");
            expect(strings[2]).toBe("[Ťĥíš íš ñõţ %4$-2.2d9876543210]");
        });
    });
    test("ResourceArrayGeneratePseudoBadLocale", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var rb = new RegularPseudo({
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo(undefined, rb);
            expect(!ra2).toBeTruthy();
        });
    });
    test("ResourceArrayGeneratePseudoBadBundle", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var ra2 = ra.generatePseudo("de-DE", undefined);
        expect(!ra2).toBeTruthy();
    });
    test("ResourceArrayGeneratePseudoBritishRightString", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-GB",
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("en-GB", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("en-GB");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("This is oestrogen");
            expect(strings[1]).toBe("I colour my chequebooks");
            expect(strings[2]).toBe("This is not translated.");
        });
    });
    test("ResourceArrayGeneratePseudoBritishLikeRightString", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB", "en-ZA"]
        });
        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-ZA",
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("en-ZA", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("en-ZA");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("This is oestrogen");
            expect(strings[1]).toBe("I colour my chequebooks");
            expect(strings[2]).toBe("This is not translated.");
        });
    });
    test("ResourceArrayGeneratePseudoCanadianRightString", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not localized."],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB", "en-CA"]
        });
        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-CA",
            type: "c"
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("en-CA", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("en-CA");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("This is estrogen");
            expect(strings[1]).toBe("I colour my chequebooks");
            expect(strings[2]).toBe("This is not localized.");
        });
    });
    test("ResourceArrayGeneratePseudoTraditionalChineseRightString", function() {
        expect.assertions(8);
        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(ra).toBeTruthy();
        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB", "zh-Hans-CN", "zh-Hant-TW"]
        });
        var translations = new TranslationSet();
        translations.add(new ResourceArray({
            project: "foo",
            key: 'asdf',
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            sourceLocale: "en-US",
            targetArray: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
            pathName: "a/b/c.java",
            targetLocale: "zh-Hans-CN"
        }));
        var rb = new PseudoFactory({
            project: p,
            targetLocale: "zh-Hant-TW",
            type: "c",
            set: translations
        });
        rb.init(function() {
            var ra2 = ra.generatePseudo("zh-Hant-TW", rb);
            expect(ra2).toBeTruthy();
            expect(ra2.getTargetLocale()).toBe("zh-Hant-TW");
            var strings = ra2.getTargetArray();
            expect(strings).toBeTruthy();
            expect(strings.length).toBe(3);
            expect(strings[0]).toBe("你好嗎？");
            expect(strings[1]).toBe("燕子的巡航速度是多少？");
            expect(strings[2]).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        });
    });
    test("ResourceArrayClone", function() {
        expect.assertions(12);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        var ra2 = ra.clone();
        expect(ra2).toBeTruthy();
        expect(ra2.project).toBe(ra.project);
        expect(ra2.context).toBe(ra.context);
        expect(ra2.getSourceLocale()).toBe(ra.getSourceLocale());
        expect(ra2.reskey).toBe(ra.reskey);
        expect(ra2.sourceArray).toStrictEqual(ra.sourceArray);
        expect(ra2.pathName).toBe(ra.pathName);
        expect(ra2.comment).toBe(ra.comment);
        expect(ra2.state).toBe(ra.state);
        expect(ra2.getTargetLocale()).toBe(ra.getTargetLocale());
        expect(ra2.targetArray).toStrictEqual(ra.targetArray);
    });
    test("ResourceArrayCloneWithOverrides", function() {
        expect.assertions(12);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        var ra2 = ra.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra2).toBeTruthy();
        expect(ra2.project).toBe(ra.project);
        expect(ra2.context).toBe(ra.context);
        expect(ra2.getSourceLocale()).toBe("fr-FR");
        expect(ra2.reskey).toBe(ra.reskey);
        expect(ra2.array).toStrictEqual(ra.array);
        expect(ra2.pathName).toBe(ra.pathName);
        expect(ra2.comment).toBe(ra.comment);
        expect(ra2.state).toBe("asdfasdf");
        expect(ra2.getTargetLocale()).toBe("de-DE");
        expect(ra2.targetArray).toStrictEqual(["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
    });
    test("ResourceArrayAddSourceString", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        ra.addSource(3, "This is the third one")
        expect(ra.getSource(3)).toBe("This is the third one");
    });
    test("ResourceArrayAddTargetString", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        ra.addTarget(3, "This is the third one")
        expect(ra.getTarget(3)).toBe("This is the third one");
    });
    test("ResourceArrayAddStringReplace", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource(2)).toBe("This is not");
        ra.addSource(2, "This isn't a test")
        expect(ra.getSource(2)).toBe("This isn't a test");
    });
    test("ResourceArrayAddTargetReplace", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTarget(2)).toBe("Dies ist nicht.");
        ra.addTarget(2, "Dies ist nicht einen Test.")
        expect(ra.getTarget(2)).toBe("Dies ist nicht einen Test.");
    });
    test("ResourceArrayAddStringSize", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(3);
        ra.addSource(3, "This is the third one")
        expect(ra.size()).toBe(4);
    });
    test("ResourceArrayAddTargetSize", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(3);
        ra.addTarget(3, "This is the third one")
        expect(ra.size()).toBe(4);
    });
    test("ResourceArrayAddStringUndefined", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource(1)).toBe("This is also a test");
        ra.addSource(1, undefined)
        expect(ra.getSource(1)).toBe("This is also a test");
    });
    test("ResourceArrayAddTargetUndefined", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTarget(1)).toBe("Dies ist auch einen Test.");
        ra.addTarget(1, undefined)
        expect(ra.getTarget(1)).toBe("Dies ist auch einen Test.");
    });
    test("ResourceArrayAddStringNoIndex", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(3);
        ra.addSource(undefined, "foobar")
        expect(ra.size()).toBe(3);
    });
    test("ResourceArrayAddTargetNoIndex", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(3);
        ra.addTarget(undefined, "foobar")
        expect(ra.size()).toBe(3);
    });
    test("ResourceArrayAddStringEmpty", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(0);
        ra.addSource(0, "foobar")
        expect(ra.size()).toBe(1);
    });
    test("ResourceArrayAddStringEmptyRightContents", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSource(0)).toBeTruthy();
        ra.addSource(0, "foobar")
        expect(ra.getSource(0)).toBe("foobar");
    });
    test("ResourceArrayAddTargetEmptyRightContents", function() {
        expect.assertions(3);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getTarget(0)).toBeTruthy();
        ra.addTarget(0, "foobar")
        expect(ra.getTarget(0)).toBe("foobar");
    });
    test("ResourceArrayAddStringMultiple", function() {
        expect.assertions(6);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        ra.addSource(3, "This is the third one")
        ra.addSource(4, "This is the fourth one")
        expect(ra.getSource(0)).toBe("This is a test");
        expect(ra.getSource(1)).toBe("This is also a test");
        expect(ra.getSource(2)).toBe("This is not");
        expect(ra.getSource(3)).toBe("This is the third one");
        expect(ra.getSource(4)).toBe("This is the fourth one");
    });
    test("ResourceArrayEqualsSourceOnly", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayEqualsFull", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayEqualsSourceOnlyNot", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(!ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayEqualsFullNot", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(!ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayEqualsIgnoreSomeFields", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayEqualsContentDifferent", function() {
        expect.assertions(3);
        var ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        var ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceArray: ["a", "b", "d"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();
        expect(!ra1.equals(ra2)).toBeTruthy();
    });
    test("ResourceArrayStaticHashKey", function() {
        expect.assertions(1);
        expect(ResourceArray.hashKey("androidapp", "foo", "de-DE", "This is a test")).toBe("ra_androidapp_foo_de-DE_This is a test");
    });
    test("ResourceArrayStaticHashKeyMissingParts", function() {
        expect.assertions(1);
        expect(ResourceArray.hashKey(undefined, undefined, "de-DE", undefined)).toBe("ra___de-DE_");
    });
    test("ResourceArrayHashKeySourceOnly", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.hashKey()).toBe("ra_foo_blah_en-US_asdf");
    });
    test("ResourceArrayHashKeySourceOnly", function() {
        expect.assertions(2);
        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceArray: ["a", "b", "c"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();
        expect(ra.hashKey()).toBe("ra_foo_blah_de-DE_asdf");
    });
    test("ResourceArrayIsInstanceSame", function() {
        expect.assertions(3);
        var rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: ["a", "b", "c"]
        });
        expect(rs).toBeTruthy();
        var dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: ["a", "b", "c"]
        });
        expect(dup).toBeTruthy();
        expect(rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceArrayIsInstanceDifferingOnlyInWhitespace", function() {
        expect.assertions(3);
        var rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();
        var dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: [" a   b\t\tc  \t", " b", "c "]
        });
        expect(dup).toBeTruthy();
        expect(rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceArrayIsInstanceDifferingInSource", function() {
        expect.assertions(3);
        var rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: ["a", "b", "c"]
        });
        expect(rs).toBeTruthy();
        var dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceArray: ["a", "b", "cd"]
        });
        expect(dup).toBeTruthy();
        expect(!rs.isInstance(dup)).toBeTruthy();
    });
});
