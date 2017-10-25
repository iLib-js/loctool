/*
 * testResourcePlural.js - test the resource plural object.
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

if (!ResourcePlural) {
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

module.exports = {
    testResourcePluralConstructorEmpty: function(test) {
        test.expect(1);

        var rp = new ResourcePlural();
        test.ok(rp);

        test.done();
    },

    testResourcePluralConstructorNoProps: function(test) {
        test.expect(1);

        var rp = new ResourcePlural({});
        test.ok(rp);

        test.done();
    },

    testResourcePluralConstructor: function(test) {
        test.expect(1);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        test.done();
    },

    testResourcePluralConstructorRightContents: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        test.equal(rp.getKey(), "asdf");
        test.deepEqual(rp.getSourcePlurals(), {
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        test.equal(rp.getSourceLocale(), "en-US");
        test.equal(rp.pathName, "a/b/c.java");

        test.done();
    },

    testResourcePluralConstructorFull: function(test) {
        test.expect(1);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        test.ok(rp);

        test.done();
    },

    testResourcePluralConstructorRightContentsFull: function(test) {
        test.expect(7);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        test.ok(rp);

        test.equal(rp.getKey(), "asdf");
        test.deepEqual(rp.getSourcePlurals(), {
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        test.equal(rp.getSourceLocale(), "en-US");
        test.equal(rp.pathName, "a/b/c.java");
        test.equal(rp.getTargetLocale(), "de-DE");
        test.deepEqual(rp.getTargetPlurals(), {
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });

        test.done();
    },

    testResourcePluralConstructorDefaults: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        // got the right one?
        test.equal(rp.getKey(), "asdf");

        // now the defaults
        test.equal(rp.getSourceLocale(), "en-US");
        test.equal(rp.datatype, "x-android-resource");
        test.equal(rp.resType, "plural");

        test.done();
    },

    testResourcePluralGetKey: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.equal(rp.getKey(), "foo");

        test.done();
    },

    testResourcePluralGetSource: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.equal(rp.getSource("one"), "This is singular");
        test.equal(rp.getSource("two"), "This is double");
        test.equal(rp.getSource("few"), "This is the few case");
        test.equal(rp.getSource("many"), "This is the many case");

        test.done();
    },

    testResourcePluralGetTarget: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        test.ok(rp);
        test.equal(rp.getTarget("one"), "Dies ist einzigartig");
        test.equal(rp.getTarget("two"), "Dies ist doppelt");
        test.equal(rp.getTarget("few"), "Dies ist der wenige Fall");
        test.equal(rp.getTarget("many"), "Dies ist der viele Fall");

        test.done();
    },

    testResourcePluralGetNonExistent: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.ok(!rp.getSource("zero"));
        test.ok(!rp.getTarget("zero"));

        test.done();
    },

    testResourcePluralGetKeyEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural();
        test.ok(rp);
        test.ok(!rp.getKey());

        test.done();
    },

    testResourcePluralGetContext: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            context: "landscape",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.equal(rp.getContext(), "landscape");

        test.done();
    },

    testResourcePluralGetContextEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.ok(!rp.getContext());

        test.done();
    },

    testResourcePluralGetSourcePlurals: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.deepEqual(rp.getSourcePlurals(), {
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });

        test.done();
    },

    testResourcePluralGetTargetPlurals: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            }
        });
        test.ok(rp);
        test.deepEqual(rp.getTargetPlurals(), {
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });

        test.done();
    },


    testResourcePluralGetPluralsEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural();
        test.ok(rp);
        var plurals = rp.getSourcePlurals();
        var count = 0;
        for (var p in plurals) {
            count++;
        }
        test.equal(count, 0);

        test.done();
    },

    testResourcePluralGeneratePseudo: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        var rb = new RegularPseudo({
            type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);
        test.equal(rp2.getTargetLocale(), "de-DE");

        test.done();
    },

    testResourcePluralGeneratePseudoRightString: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        var rb = new RegularPseudo({
            type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            "one": "Ťĥíš íš šíñğüľàŕ76543210",
            "two": "Ťĥíš íš ðõübľë6543210",
            "few": "Ťĥíš íš ţĥë fëŵ çàšë9876543210",
            "many": "Ťĥíš íš ţĥë màñÿ çàšë6543210"
        });

        test.done();
    },

    testResourcePluralGeneratePseudoSkipPercents: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is %s singular",
                "two": "This is %d double",
                "few": "This is the few %2$-2.2f case",
                "many": "This is the many %7x case"
            }
        });
        test.ok(rp);

        var rb = new RegularPseudo({
            type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            "one": "Ťĥíš íš %s šíñğüľàŕ9876543210",
            "two": "Ťĥíš íš %d ðõübľë876543210",
            "few": "Ťĥíš íš ţĥë fëŵ %2$-2.2f çàšë9876543210",
            "many": "Ťĥíš íš ţĥë màñÿ %7x çàšë76543210"
        });

        test.done();
    },

    testResourcePluralGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        var rb = new RegularPseudo({
            type: "c"
        });

        var rp2 = rp.generatePseudo(undefined, rb);
        test.ok(!rp2);

        test.done();
    },

    testResourcePluralGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);

        var rp2 = rp.generatePseudo("de-DE", undefined);

        test.ok(!rp2);

        test.done();
    },

    testResourcePluralGeneratePseudoBritishRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen", 
                "few": "I color my checkbooks", 
                "many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);

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

        var rp2 = rp.generatePseudo("en-GB", rb);

        test.ok(rp2);
        test.ok(rp2.getTargetLocale(), "en-GB");

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            "one": "This is oestrogen",
            "few": "I colour my chequebooks",
            "many": "This is not translated."
        });

        test.done();
    },

    testResourcePluralGeneratePseudoBritishLikeRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen", 
                "few": "I color my checkbooks", 
                "many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);

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

        var rp2 = rp.generatePseudo("en-ZA", rb);

        test.ok(rp2);
        test.ok(rp2.getTargetLocale(), "en-ZA");

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            "one": "This is oestrogen",
            "few": "I colour my chequebooks",
            "many": "This is not translated."
        });

        test.done();
    },

    testResourcePluralGeneratePseudoCanadianRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen", 
                "few": "I color my checkbooks", 
                "many": "This is not localized."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);

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

        var rp2 = rp.generatePseudo("en-CA", rb);

        test.ok(rp2);
        test.ok(rp2.getTargetLocale(), "en-CA");

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            "one": "This is estrogen",
            "few": "I colour my chequebooks",
            "many": "This is not localized."
        });

        test.done();
    },

    testResourcePluralGeneratePseudoTraditionalChineseRightString: function(test) {
        test.expect(5);

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

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
            locales:["en-GB", "zh-Hans-CN", "zh-Hant-TW"]
        });

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

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "zh-Hant-TW",
            type: "c",
            set: translations
        });

        var rp2 = rp.generatePseudo("zh-Hant-TW", rb);

        test.ok(rp2);
        test.ok(rp2.getTargetLocale(), "zh-Hant-TW");

        var t = rp2.getTargetPlurals();

        test.ok(t);
        test.deepEqual(t, {
            one: "你好嗎？",
            few: "燕子的巡航速度是多少？",
            many: "什麼？ 你是指歐洲的燕子還是非洲的燕子？"
        });

        test.done();
    },

    testResourcePluralClone: function(test) {
        test.expect(10);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        var rp2 = rp.clone();

        test.ok(rp2);
        test.equal(rp2.project, rp.project);
        test.equal(rp2.context, rp.context);
        test.equal(rp2.getSourceLocale(), rp.getSourceLocale());
        test.equal(rp2.reskey, rp.reskey);
        test.deepEqual(rp2.strings, rp.strings);
        test.equal(rp2.pathName, rp.pathName);
        test.equal(rp2.comment, rp.comment);
        test.equal(rp2.state, rp.state);

        test.done();
    },

    testResourcePluralCloneWithOverrides: function(test) {
        test.expect(10);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        var rp2 = rp.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf"
        });

        test.ok(rp2);
        test.equal(rp2.project, rp.project);
        test.equal(rp2.context, rp.context);
        test.equal(rp2.getSourceLocale(), "fr-FR");
        test.equal(rp2.reskey, rp.reskey);
        test.deepEqual(rp2.strings, rp.strings);
        test.equal(rp2.pathName, rp.pathName);
        test.equal(rp2.comment, rp.comment);
        test.equal(rp2.state, "asdfasdf");

        test.done();
    },

    testResourcePluralAddSource: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.getSource("zero"));

        rp.addSource("zero", "This is the zero one")

        test.equal(rp.getSource("zero"), "This is the zero one");

        test.done();
    },

    testResourcePluralAddSourceReplace: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.getSource("two"), "This is double");

        rp.addSource("two", "This is two at a time")

        test.equal(rp.getSource("two"), "This is two at a time");

        test.done();
    },

    testResourcePluralAddSourceSize: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addSource("many", "This is the many one")

        test.equal(rp.size(), 4);

        test.done();
    },

    testResourcePluralAddSourceUndefined: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.getSource("one"), "This is singular");

        rp.addSource("one", undefined)

        test.equal(rp.getSource("one"), "This is singular");

        test.done();
    },

    testResourcePluralAddSourceNoClass: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addSource(undefined, "foobar")

        test.equal(rp.size(), 3);

        test.done();
    },

    testResourcePluralAddSourceEmpty: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 0);

        rp.addSource("one", "foobar")

        test.equal(rp.size(), 1);

        test.done();
    },

    testResourcePluralAddSourceEmptyRightContents: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.getSource("one"));

        rp.addSource("one", "foobar")

        test.equal(rp.getSource("one"), "foobar");

        test.done();
    },

    testResourcePluralAddSourceMultiple: function(test) {
        test.expect(6);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(rp);

        rp.addSource("one", "This is singular");
        rp.addSource("zero", "This is the zero one");

        test.equal(rp.getSource("zero"), "This is the zero one");
        test.equal(rp.getSource("one"), "This is singular");
        test.equal(rp.getSource("two"), "This is double");
        test.equal(rp.getSource("few"), "This is the few case");
        test.equal(rp.getSource("many"), "This is the many case");

        test.done();
    },

    testResourcePluralAddTarget: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.getTarget("zero"));

        rp.addTarget("zero", "This is the zero one")

        test.equal(rp.getTarget("zero"), "This is the zero one");

        test.done();
    },

    testResourcePluralAddTargetReplace: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.getTarget("two"), "Dies ist doppelt");

        rp.addTarget("two", "This is two at a time")

        test.equal(rp.getTarget("two"), "This is two at a time");

        test.done();
    },

    testResourcePluralAddTargetSize: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addTarget("many", "This is the many one")

        test.equal(rp.size(), 4);

        test.done();
    },

    testResourcePluralAddTargetUndefined: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.getTarget("one"), "Dies ist einzigartig");

        rp.addTarget("one", undefined)

        test.equal(rp.getTarget("one"), "Dies ist einzigartig");

        test.done();
    },

    testResourcePluralAddTargetNoClass: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addTarget(undefined, "foobar")

        test.equal(rp.size(), 3);

        test.done();
    },

    testResourcePluralAddTargetEmpty: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 0);

        rp.addTarget("one", "foobar")

        test.equal(rp.size(), 1);

        test.done();
    },

    testResourcePluralAddTargetEmptyRightContents: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.getTarget("one"));

        rp.addTarget("one", "foobar")

        test.equal(rp.getTarget("one"), "foobar");

        test.done();
    },

    testResourcePluralEqualsSourceOnly: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsFull: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsSourceOnlyNot: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsFullNot: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist doppelt",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist ",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsContentDifferent: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourcePluralStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ResourcePlural.hashKey("androidapp", "foo", "de-DE", "This is a test"), "rp_androidapp_foo_de-DE_This is a test");

        test.done();
    },

    testResourcePluralStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ResourcePlural.hashKey(undefined, undefined, "de-DE", undefined), "rp___de-DE_");

        test.done();
    },

    testResourcePluralSourceOnlyHashKey: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.hashKey(), "rp_foo_blah_en-US_asdf");

        test.done();
    },

    testResourcePluralFullHashKey: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            sourceStrings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is a different case"
            },
            targetLocale: "de-DE",
            targetStrings: {
                "one": "Dies ist einzigartig",
                "two": "Dies ist ",
                "few": "Dies ist der wenige Fall",
                "many": "Dies ist der viele Fall"
            },
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.hashKey(), "rp_foo_blah_de-DE_asdf");

        test.done();
    }
};
