/*
 * testResourceArray.js - test the resource array object.
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

if (!ResourceArray) {
    var ResourceArray = require("../lib/ResourceArray.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

module.exports.resourcearray = {
    testResourceArrayConstructorEmpty: function(test) {
        test.expect(1);

        var ra = new ResourceArray();
        test.ok(ra);

        test.done();
    },

    testResourceArrayConstructorNoProps: function(test) {
        test.expect(1);

        var ra = new ResourceArray({});
        test.ok(ra);

        test.done();
    },

    testResourceArrayConstructorEmptyNoSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.equal(ra.size(), 0);

        test.done();
    },

    testResourceArrayConstructor: function(test) {
        test.expect(1);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        test.done();
    },

    testResourceArrayConstructorRightContents: function(test) {
        test.expect(5);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        test.equal(ra.getKey(), "asdf");
        test.deepEqual(ra.getSourceArray(), ["This is a test", "This is also a test", "This is not"]);
        test.equal(ra.getSourceLocale(), "de-DE");
        test.equal(ra.pathName, "a/b/c.java");

        test.done();
    },

    testResourceArrayConstructorFull: function(test) {
        test.expect(1);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        test.done();
    },

    testResourceArrayConstructorFullRightContents: function(test) {
        test.expect(7);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        test.equal(ra.getKey(), "asdf");
        test.deepEqual(ra.getSourceArray(), ["This is a test", "This is also a test", "This is not"]);
        test.equal(ra.getSourceLocale(), "en-US");
        test.deepEqual(ra.getTargetArray(), ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
        test.equal(ra.getTargetLocale(), "de-DE");
        test.equal(ra.pathName, "a/b/c.java");

        test.done();
    },

    testResourceArrayConstructorDefaults: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        // got the right one?
        test.equal(ra.getKey(), "asdf");

        // now the defaults
        test.equal(ra.getSourceLocale(), "en-US");
        test.equal(ra.origin, "source");
        test.equal(ra.datatype, "x-android-resource");
        test.equal(ra.resType, "array");

        test.ok(!ra.getTargetLocale());
        test.ok(!ra.target);

        test.done();
    },

    testResourceArrayConstructorRightSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        test.equal(ra.size(), 3);

        test.done();
    },

    testResourceArrayGetKey: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getKey(), "foo");

        test.done();
    },

    testResourceArrayGetKeyEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.ok(!ra.getKey());

        test.done();
    },

    testResourceStringGetContext: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        test.ok(ra);
        test.equal(ra.getContext(), "landscape");

        test.done();
    },

    testResourceStringGetContextEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getContext());

        test.done();
    },

    testResourceArrayGetArray: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.deepEqual(ra.getSourceArray(), ["This is a test", "This is also a test", "This is not"]);

        test.done();
    },

    testResourceArrayGetSourceArrayEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.deepEqual(ra.getSourceArray(), []);

        test.done();
    },

    testResourceArrayGetTargetArrayEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.ok(!ra.getTargetArray());

        test.done();
    },

    testResourceArrayGetSource: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getSource(0), "This is a test");
        test.equal(ra.getSource(1), "This is also a test");
        test.equal(ra.getSource(2), "This is not");

        test.done();
    },

    testResourceArrayGetTarget: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getTarget(0), "Dies ist einen Test.");
        test.equal(ra.getTarget(1), "Dies ist auch einen Test.");
        test.equal(ra.getTarget(2), "Dies ist nicht.");

        test.done();
    },

    testResourceArrayGetSourceNegativeIndex: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getSource(-1));

        test.done();
    },

    testResourceArrayGetTargetNegativeIndex: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getTarget(-1));

        test.done();
    },

    testResourceArrayGetSourceIndexTooBig: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getSource(6));

        test.done();
    },

    testResourceArrayGetTargetIndexTooBig: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US"
        });
        test.ok(ra);
        test.ok(!ra.getTarget(6));

        test.done();
    },

    testResourceArrayGetIndexNotWhole: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getSource(2.6));

        test.done();
    },

    testResourceArrayGeneratePseudo: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var rb = new RegularPseudo({
            type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getSourceLocale(), "en-US");
        test.ok(ra2.getTargetLocale(), "de-DE");

        test.done();
    },

    testResourceArrayGeneratePseudoRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var rb = new RegularPseudo({
            type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "de-DE");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à ţëšţ6543210");
        test.equal(strings[1], "Ťĥíš íš àľšõ à ţëšţ9876543210");
        test.equal(strings[2], "Ťĥíš íš ñõţ543210");

        test.done();
    },

    testResourceArrayGeneratePseudoSkipPercents: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a %s test", "This is also a %f test", "This is not %4$-2.2d"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var rb = new RegularPseudo({
            type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "de-DE");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à %s ţëšţ876543210");
        test.equal(strings[1], "Ťĥíš íš àľšõ à %f ţëšţ6543210");
        test.equal(strings[2], "Ťĥíš íš ñõţ %4$-2.2d9876543210");

        test.done();
    },

    testResourceArrayGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var rb = new RegularPseudo({
            type: "c"
        });

        var ra2 = ra.generatePseudo(undefined, rb);
        test.ok(!ra2);

        test.done();
    },

    testResourceArrayGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var ra2 = ra.generatePseudo("de-DE", undefined);

        test.ok(!ra2);

        test.done();
    },

    testResourceArrayGeneratePseudoBritishRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-GB",
            type: "c"
        });

        var ra2 = ra.generatePseudo("en-GB", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "en-GB");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is oestrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not translated.");

        test.done();
    },

    testResourceArrayGeneratePseudoBritishLikeRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
            locales:["en-GB", "en-ZA"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-ZA",
            type: "c"
        });

        var ra2 = ra.generatePseudo("en-ZA", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "en-ZA");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is oestrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not translated.");

        test.done();
    },

    testResourceArrayGeneratePseudoCanadianRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is estrogen", "I color my checkbooks", "This is not localized."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
            locales:["en-GB", "en-CA"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-CA",
            type: "c"
        });

        var ra2 = ra.generatePseudo("en-CA", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "en-CA");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is estrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not localized.");

        test.done();
    },

    testResourceArrayGeneratePseudoTraditionalChineseRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            project: "foo",
            key: "asdf",
            sourceArray: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        test.ok(ra);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
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

        var ra2 = ra.generatePseudo("zh-Hant-TW", rb);

        test.ok(ra2);
        test.ok(ra2.getTargetLocale(), "zh-Hant-TW");

        var strings = ra2.getTargetArray();

        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "你好嗎？");
        test.equal(strings[1], "燕子的巡航速度是多少？");
        test.equal(strings[2], "什麼？ 你是指歐洲的燕子還是非洲的燕子？");

        test.done();
    },

    testResourceArrayClone: function(test) {
        test.expect(12);

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
        test.ok(ra);

        var ra2 = ra.clone();

        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.getSourceLocale(), ra.getSourceLocale());
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.sourceArray, ra.sourceArray);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, ra.state);
        test.equal(ra2.getTargetLocale(), ra.getTargetLocale());
        test.deepEqual(ra2.targetArray, ra.targetArray);

        test.done();
    },

    testResourceArrayCloneWithOverrides: function(test) {
        test.expect(12);

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
        test.ok(ra);

        var ra2 = ra.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });

        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.getSourceLocale(), "fr-FR");
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.array, ra.array);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, "asdfasdf");
        test.equal(ra2.getTargetLocale(), "de-DE");
        test.deepEqual(ra2.targetArray, ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);

        test.done();
    },

    testResourceArrayAddSourceString: function(test) {
        test.expect(2);

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
        test.ok(ra);

        ra.addSource(3, "This is the third one")

        test.equal(ra.getSource(3), "This is the third one");

        test.done();
    },

    testResourceArrayAddTargetString: function(test) {
        test.expect(2);

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
        test.ok(ra);

        ra.addTarget(3, "This is the third one")

        test.equal(ra.getTarget(3), "This is the third one");

        test.done();
    },

    testResourceArrayAddStringReplace: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.getSource(2), "This is not");

        ra.addSource(2, "This isn't a test")

        test.equal(ra.getSource(2), "This isn't a test");

        test.done();
    },

    testResourceArrayAddTargetReplace: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.getTarget(2), "Dies ist nicht.");

        ra.addTarget(2, "Dies ist nicht einen Test.")

        test.equal(ra.getTarget(2), "Dies ist nicht einen Test.");

        test.done();
    },

    testResourceArrayAddStringSize: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.size(), 3);

        ra.addSource(3, "This is the third one")

        test.equal(ra.size(), 4);

        test.done();
    },

    testResourceArrayAddTargetSize: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.size(), 3);

        ra.addTarget(3, "This is the third one")

        test.equal(ra.size(), 4);

        test.done();
    },

    testResourceArrayAddStringUndefined: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.getSource(1), "This is also a test");

        ra.addSource(1, undefined)

        test.equal(ra.getSource(1), "This is also a test");

        test.done();
    },

    testResourceArrayAddTargetUndefined: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.getTarget(1), "Dies ist auch einen Test.");

        ra.addTarget(1, undefined)

        test.equal(ra.getTarget(1), "Dies ist auch einen Test.");

        test.done();
    },

    testResourceArrayAddStringNoIndex: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.size(), 3);

        ra.addSource(undefined, "foobar")

        test.equal(ra.size(), 3);

        test.done();
    },

    testResourceArrayAddTargetNoIndex: function(test) {
        test.expect(3);

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
        test.ok(ra);

        test.equal(ra.size(), 3);

        ra.addTarget(undefined, "foobar")

        test.equal(ra.size(), 3);

        test.done();
    },

    testResourceArrayAddStringEmpty: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.size(), 0);

        ra.addSource(0, "foobar")

        test.equal(ra.size(), 1);

        test.done();
    },

    testResourceArrayAddStringEmptyRightContents: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.ok(!ra.getSource(0));

        ra.addSource(0, "foobar")

        test.equal(ra.getSource(0), "foobar");

        test.done();
    },

    testResourceArrayAddTargetEmptyRightContents: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.ok(!ra.getTarget(0));

        ra.addTarget(0, "foobar")

        test.equal(ra.getTarget(0), "foobar");

        test.done();
    },

    testResourceArrayAddStringMultiple: function(test) {
        test.expect(6);

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
        test.ok(ra);

        ra.addSource(3, "This is the third one")
        ra.addSource(4, "This is the fourth one")

        test.equal(ra.getSource(0), "This is a test");
        test.equal(ra.getSource(1), "This is also a test");
        test.equal(ra.getSource(2), "This is not");
        test.equal(ra.getSource(3), "This is the third one");
        test.equal(ra.getSource(4), "This is the fourth one");

        test.done();
    },

    testResourceArrayEqualsSourceOnly: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsFull: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsSourceOnlyNot: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsFullNot: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsContentDifferent: function(test) {
        test.expect(3);

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

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ResourceArray.hashKey("androidapp", "foo", "de-DE", "This is a test"), "ra_androidapp_foo_de-DE_This is a test");

        test.done();
    },

    testResourceArrayStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ResourceArray.hashKey(undefined, undefined, "de-DE", undefined), "ra___de-DE_");

        test.done();
    },

    testResourceArrayHashKeySourceOnly: function(test) {
        test.expect(2);

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
        test.ok(ra);

        test.equal(ra.hashKey(), "ra_foo_blah_en-US_asdf");
        test.done();

    },

    testResourceArrayHashKeySourceOnly: function(test) {
        test.expect(2);

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
        test.ok(ra);

        test.equal(ra.hashKey(), "ra_foo_blah_de-DE_asdf");

        test.done();
    },

    testResourceArrayIsInstanceSame: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.isInstance(dup));

        test.done();
    },

    testResourceArrayIsInstanceDifferingInSource: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(!rs.isInstance(dup));

        test.done();
    }
};
