/*
 * ResourcePlural.test.js - test the resource plural object.
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

if (!ResourcePlural) {
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

describe("resourceplural", function() {
    test("ResourcePluralConstructorEmpty", function() {
        expect.assertions(1);

        var rp = new ResourcePlural();
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorNoProps", function() {
        expect.assertions(1);

        var rp = new ResourcePlural({});
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructor", function() {
        expect.assertions(1);

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
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorRightContents", function() {
        expect.assertions(5);

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
        expect(rp).toBeTruthy();

        expect(rp.getKey()).toBe("asdf");
        expect(rp.getSourcePlurals()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.pathName).toBe("a/b/c.java");
    });

    test("ResourcePluralConstructorFull", function() {
        expect.assertions(1);

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
        expect(rp).toBeTruthy();
    });

    test("ResourcePluralConstructorRightContentsFull", function() {
        expect.assertions(7);

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
        expect(rp).toBeTruthy();

        expect(rp.getKey()).toBe("asdf");
        expect(rp.getSourcePlurals()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.pathName).toBe("a/b/c.java");
        expect(rp.getTargetLocale()).toBe("de-DE");
        expect(rp.getTargetPlurals()).toStrictEqual({
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });
    });

    test("ResourcePluralConstructorDefaults", function() {
        expect.assertions(5);

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
        expect(rp).toBeTruthy();

        // got the right one?
        expect(rp.getKey()).toBe("asdf");

        // now the defaults
        expect(rp.getSourceLocale()).toBe("en-US");
        expect(rp.datatype).toBe("x-android-resource");
        expect(rp.resType).toBe("plural");
    });

    test("ResourcePluralGetKey", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();
        expect(rp.getKey()).toBe("foo");
    });

    test("ResourcePluralGetSource", function() {
        expect.assertions(5);

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
        expect(rp).toBeTruthy();
        expect(rp.getSource("one")).toBe("This is singular");
        expect(rp.getSource("two")).toBe("This is double");
        expect(rp.getSource("few")).toBe("This is the few case");
        expect(rp.getSource("many")).toBe("This is the many case");
    });

    test("ResourcePluralGetTarget", function() {
        expect.assertions(5);

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
        expect(rp).toBeTruthy();
        expect(rp.getTarget("one")).toBe("Dies ist einzigartig");
        expect(rp.getTarget("two")).toBe("Dies ist doppelt");
        expect(rp.getTarget("few")).toBe("Dies ist der wenige Fall");
        expect(rp.getTarget("many")).toBe("Dies ist der viele Fall");
    });

    test("ResourcePluralGetNonExistent", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();
        expect(!rp.getSource("zero")).toBeTruthy();
        expect(!rp.getTarget("zero")).toBeTruthy();
    });

    test("ResourcePluralGetKeyEmpty", function() {
        expect.assertions(2);

        var rp = new ResourcePlural();
        expect(rp).toBeTruthy();
        expect(!rp.getKey()).toBeTruthy();
    });

    test("ResourcePluralGetContext", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();
        expect(rp.getContext()).toBe("landscape");
    });

    test("ResourcePluralGetContextEmpty", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();
        expect(!rp.getContext()).toBeTruthy();
    });

    test("ResourcePluralGetSourcePlurals", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();
        expect(rp.getSourcePlurals()).toStrictEqual({
            "one": "This is singular",
            "two": "This is double",
            "few": "This is the few case",
            "many": "This is the many case"
        });
    });

    test("ResourcePluralGetTargetPlurals", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();
        expect(rp.getTargetPlurals()).toStrictEqual({
            "one": "Dies ist einzigartig",
            "two": "Dies ist doppelt",
            "few": "Dies ist der wenige Fall",
            "many": "Dies ist der viele Fall"
        });
    });


    test("ResourcePluralGetPluralsEmpty", function() {
        expect.assertions(2);

        var rp = new ResourcePlural();
        expect(rp).toBeTruthy();
        var plurals = rp.getSourcePlurals();
        var count = 0;
        for (var p in plurals) {
            count++;
        }
        expect(count).toBe(0);
    });

    test("ResourcePluralGeneratePseudo", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("de-DE", rb);

            expect(rp2).toBeTruthy();
            expect(rp2.getTargetLocale()).toBe("de-DE");
        });
    });

    test("ResourcePluralGeneratePseudoRightString", function() {
        expect.assertions(4);

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
        expect(rp).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("de-DE", rb);

            expect(rp2).toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                "one": "[Ťĥíš íš šíñğüľàŕ76543210]",
                "two": "[Ťĥíš íš ðõübľë6543210]",
                "few": "[Ťĥíš íš ţĥë fëŵ çàšë9876543210]",
                "many": "[Ťĥíš íš ţĥë màñÿ çàšë6543210]"
            });
        });
    });

    test("ResourcePluralGeneratePseudoSkipPercents", function() {
        expect.assertions(4);

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
        expect(rp).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("de-DE", rb);

            expect(rp2).toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                "one": "[Ťĥíš íš %s šíñğüľàŕ9876543210]",
                "two": "[Ťĥíš íš %d ðõübľë876543210]",
                "few": "[Ťĥíš íš ţĥë fëŵ %2$-2.2f çàšë9876543210]",
                "many": "[Ťĥíš íš ţĥë màñÿ %7x çàšë76543210]"
            });
        });
    });

    test("ResourcePluralGeneratePseudoBadLocale", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo(undefined, rb);
            expect(!rp2).toBeTruthy();
        });
    });

    test("ResourcePluralGeneratePseudoBadBundle", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();

        var rp2 = rp.generatePseudo("de-DE", undefined);

        expect(!rp2).toBeTruthy();
    });

    test("ResourcePluralGeneratePseudoBritishRightString", function() {
        expect.assertions(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen",
                "few": "I color my checkbooks",
                "many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        expect(rp).toBeTruthy();

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-GB",
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("en-GB", rb);

            expect(rp2).toBeTruthy();
            expect(rp2.getTargetLocale(), "en-GB").toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                "one": "This is oestrogen",
                "few": "I colour my chequebooks",
                "many": "This is not translated."
            });
        });
    });

    test("ResourcePluralGeneratePseudoBritishLikeRightString", function() {
        expect.assertions(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen",
                "few": "I color my checkbooks",
                "many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        expect(rp).toBeTruthy();

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB", "en-ZA"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-ZA",
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("en-ZA", rb);

            expect(rp2).toBeTruthy();
            expect(rp2.getTargetLocale(), "en-ZA").toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                "one": "This is oestrogen",
                "few": "I colour my chequebooks",
                "many": "This is not translated."
            });
        });
    });

    test("ResourcePluralGeneratePseudoCanadianRightString", function() {
        expect.assertions(5);

        var rp = new ResourcePlural({
            key: "asdf",
            sourceStrings: {
                "one": "This is estrogen",
                "few": "I color my checkbooks",
                "many": "This is not localized."
            },
            pathName: "a/b/c.java"
        });
        expect(rp).toBeTruthy();

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB", "en-CA"]
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-CA",
            type: "c"
        });

        rb.init(function() {
            var rp2 = rp.generatePseudo("en-CA", rb);

            expect(rp2).toBeTruthy();
            expect(rp2.getTargetLocale(), "en-CA").toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                "one": "This is estrogen",
                "few": "I colour my chequebooks",
                "many": "This is not localized."
            });
        });
    });

    test("ResourcePluralGeneratePseudoTraditionalChineseRightString", function() {
        expect.assertions(5);

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

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
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

        rb.init(function() {
            var rp2 = rp.generatePseudo("zh-Hant-TW", rb);

            expect(rp2).toBeTruthy();
            expect(rp2.getTargetLocale(), "zh-Hant-TW").toBeTruthy();

            var t = rp2.getTargetPlurals();

            expect(t).toBeTruthy();
            expect(t).toStrictEqual({
                one: "你好嗎？",
                few: "燕子的巡航速度是多少？",
                many: "什麼？ 你是指歐洲的燕子還是非洲的燕子？"
            });
        });
    });

    test("ResourcePluralClone", function() {
        expect.assertions(10);

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
        expect(rp).toBeTruthy();

        var rp2 = rp.clone();

        expect(rp2).toBeTruthy();
        expect(rp2.project).toBe(rp.project);
        expect(rp2.context).toBe(rp.context);
        expect(rp2.getSourceLocale()).toBe(rp.getSourceLocale());
        expect(rp2.reskey).toBe(rp.reskey);
        expect(rp2.strings).toStrictEqual(rp.strings);
        expect(rp2.pathName).toBe(rp.pathName);
        expect(rp2.comment).toBe(rp.comment);
        expect(rp2.state).toBe(rp.state);
    });

    test("ResourcePluralCloneWithOverrides", function() {
        expect.assertions(10);

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
        expect(rp).toBeTruthy();

        var rp2 = rp.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf"
        });

        expect(rp2).toBeTruthy();
        expect(rp2.project).toBe(rp.project);
        expect(rp2.context).toBe(rp.context);
        expect(rp2.getSourceLocale()).toBe("fr-FR");
        expect(rp2.reskey).toBe(rp.reskey);
        expect(rp2.strings).toStrictEqual(rp.strings);
        expect(rp2.pathName).toBe(rp.pathName);
        expect(rp2.comment).toBe(rp.comment);
        expect(rp2.state).toBe("asdfasdf");
    });

    test("ResourcePluralAddSource", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(!rp.getSource("zero")).toBeTruthy();

        rp.addSource("zero", "This is the zero one")

        expect(rp.getSource("zero")).toBe("This is the zero one");
    });

    test("ResourcePluralAddSourceReplace", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.getSource("two")).toBe("This is double");

        rp.addSource("two", "This is two at a time")

        expect(rp.getSource("two")).toBe("This is two at a time");
    });

    test("ResourcePluralAddSourceSize", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addSource("many", "This is the many one")

        expect(rp.size()).toBe(4);
    });

    test("ResourcePluralAddSourceUndefined", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.getSource("one")).toBe("This is singular");

        rp.addSource("one", undefined)

        expect(rp.getSource("one")).toBe("This is singular");
    });

    test("ResourcePluralAddSourceNoClass", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addSource(undefined, "foobar")

        expect(rp.size()).toBe(3);
    });

    test("ResourcePluralAddSourceEmpty", function() {
        expect.assertions(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(0);

        rp.addSource("one", "foobar")

        expect(rp.size()).toBe(1);
    });

    test("ResourcePluralAddSourceEmptyRightContents", function() {
        expect.assertions(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getSource("one")).toBeTruthy();

        rp.addSource("one", "foobar")

        expect(rp.getSource("one")).toBe("foobar");
    });

    test("ResourcePluralAddSourceMultiple", function() {
        expect.assertions(6);

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

        expect(rp).toBeTruthy();

        rp.addSource("one", "This is singular");
        rp.addSource("zero", "This is the zero one");

        expect(rp.getSource("zero")).toBe("This is the zero one");
        expect(rp.getSource("one")).toBe("This is singular");
        expect(rp.getSource("two")).toBe("This is double");
        expect(rp.getSource("few")).toBe("This is the few case");
        expect(rp.getSource("many")).toBe("This is the many case");
    });

    test("ResourcePluralAddTarget", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(!rp.getTarget("zero")).toBeTruthy();

        rp.addTarget("zero", "This is the zero one")

        expect(rp.getTarget("zero")).toBe("This is the zero one");
    });

    test("ResourcePluralAddTargetReplace", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.getTarget("two")).toBe("Dies ist doppelt");

        rp.addTarget("two", "This is two at a time")

        expect(rp.getTarget("two")).toBe("This is two at a time");
    });

    test("ResourcePluralAddTargetSize", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addTarget("many", "This is the many one")

        expect(rp.size()).toBe(4);
    });

    test("ResourcePluralAddTargetUndefined", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.getTarget("one")).toBe("Dies ist einzigartig");

        rp.addTarget("one", undefined)

        expect(rp.getTarget("one")).toBe("Dies ist einzigartig");
    });

    test("ResourcePluralAddTargetNoClass", function() {
        expect.assertions(3);

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
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(3);

        rp.addTarget(undefined, "foobar")

        expect(rp.size()).toBe(3);
    });

    test("ResourcePluralAddTargetEmpty", function() {
        expect.assertions(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(rp.size()).toBe(0);

        rp.addTarget("one", "foobar")

        expect(rp.size()).toBe(1);
    });

    test("ResourcePluralAddTargetEmptyRightContents", function() {
        expect.assertions(3);

        var rp = new ResourcePlural({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rp).toBeTruthy();

        expect(!rp.getTarget("one")).toBeTruthy();

        rp.addTarget("one", "foobar")

        expect(rp.getTarget("one")).toBe("foobar");
    });

    test("ResourcePluralEqualsSourceOnly", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsFull", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsSourceOnlyNot", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsFullNot", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsIgnoreSomeFields", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralEqualsContentDifferent", function() {
        expect.assertions(3);

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

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourcePluralStaticHashKey", function() {
        expect.assertions(1);

        expect(ResourcePlural.hashKey("androidapp", "foo", "de-DE", "This is a test")).toBe("rp_androidapp_foo_de-DE_This is a test");
    });

    test("ResourcePluralStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(ResourcePlural.hashKey(undefined, undefined, "de-DE", undefined)).toBe("rp___de-DE_");
    });

    test("ResourcePluralSourceOnlyHashKey", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();

        expect(rp.hashKey()).toBe("rp_foo_blah_en-US_asdf");
    });

    test("ResourcePluralFullHashKey", function() {
        expect.assertions(2);

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
        expect(rp).toBeTruthy();

        expect(rp.hashKey()).toBe("rp_foo_blah_de-DE_asdf");
    });

    test("ResourcePluralIsInstanceSame", function() {
        expect.assertions(3);

        var rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(rs).toBeTruthy();

        var dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourcePluralIsInstanceDifferingOnlyInWhitespace", function() {
        expect.assertions(3);

        var rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a test ",
                other: " These are tests"
            }
        });
        expect(rs).toBeTruthy();

        var dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a \ttest    ",
                other: " These  are tests "
            }
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourcePluralIsInstanceDifferingInSource", function() {
        expect.assertions(3);

        var rs = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a test",
                other: "These are tests"
            }
        });
        expect(rs).toBeTruthy();

        var dup = new ResourcePlural({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            sourceStrings: {
                one: "This is a test",
                other: "These are tests."
            }
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });
});
