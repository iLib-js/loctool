/*
 * ResourceString.test.js - test the resource string object.
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

if (!ResourceString) {
    var ResourceString = require("../lib/ResourceString.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var SourceContextResourceString = require("../lib/SourceContextResourceString.js");
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

describe("resourcestring", function() {
    test("ResourceStringConstructorEmpty", function() {
        expect.assertions(1);

        var rs = new ResourceString();
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorNoProps", function() {
        expect.assertions(1);

        var rs = new ResourceString({});
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructor", function() {
        expect.assertions(1);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorWithContext", function() {
        expect.assertions(1);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java",
            context: "landscape"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorWithSourceAndTarget", function() {
        expect.assertions(1);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorRightContents", function() {
        expect.assertions(7);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        expect(rs.getKey()).toBe("asdf");
        expect(rs.getSource()).toBe("This is a test");
        expect(rs.getSourceLocale()).toBe("de-DE");
        expect(rs.pathName).toBe("a/b/c.java");
        expect(!rs.getTarget()).toBeTruthy(); // source-only string
        expect(!rs.getTargetLocale()).toBeTruthy();
    });

    test("ResourceStringConstructorSourceTargetRightContents", function() {
        expect.assertions(7);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rs).toBeTruthy();

        expect(rs.getKey()).toBe("asdf");
        expect(rs.getSource()).toBe("This is a test");
        expect(rs.sourceLocale).toBe("en-US");
        expect(rs.pathName).toBe("a/b/c.java");
        expect(rs.getTarget()).toBe("Dies ist einen Test.");
        expect(rs.getTargetLocale()).toBe("de-DE");
    });

    test("ResourceStringConstructorDefaults", function() {
        expect.assertions(6);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        // got the right one?
        expect(rs.getKey()).toBe("asdf");

        // now the defaults
        expect(rs.sourceLocale).toBe("en-US");
        expect(rs.origin).toBe("source");
        expect(rs.datatype).toBe("plaintext");
        expect(rs.resType).toBe("string");
    });

    test("ResourceStringGetKey", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getKey()).toBe("foo");
    });

    test("ResourceStringAutoKey", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            autoKey: true,
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringNotAutoKey", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(!rs.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringGetKeyEmpty", function() {
        expect.assertions(2);

        var rs = new ResourceString();
        expect(rs).toBeTruthy();
        expect(!rs.getKey()).toBeTruthy();
    });

    test("ResourceStringGetContext", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        expect(rs).toBeTruthy();
        expect(rs.getContext()).toBe("landscape");
    });

    test("ResourceStringGetContextEmpty", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(!rs.getContext()).toBeTruthy();
    });

    test("ResourceStringGetSource", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getSource()).toBe("source string");
    });

    test("ResourceStringSize", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });

        expect(rs).toBeTruthy();
        expect(rs.size()).toBe(1); // should always be 1
    });

    test("ResourceStringGetSourceEmpty", function() {
        expect.assertions(2);

        var rs = new ResourceString();
        expect(rs).toBeTruthy();
        expect(!rs.getSource()).toBeTruthy();
    });

    test("ResourceStringGeneratePseudo", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("de-DE", rb);

            expect(rs2).toBeTruthy();
        });
    });

    test("ResourceStringGeneratePseudoRightString", function() {
        expect.assertions(6);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("de-DE", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getSource()).toBe("This is a test");
            expect(rs2.sourceLocale).toBe("en-US");
            expect(rs2.getTarget()).toBe("[Ťĥíš íš à ţëšţ6543210]");
            expect(rs2.getTargetLocale()).toBe("de-DE");
        });
    });

    test("ResourceStringGeneratePseudoSkipPercents", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This %2$-2.2s is a %s test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("de-DE", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTarget()).toBe("[Ťĥíš %2$-2.2s íš à %s ţëšţ876543210]");
        });
    });

    test("ResourceStringGeneratePseudoSkipEmbeddedHTML", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This <span class=\"foobar\">is a</span> test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "html"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("de-DE", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTarget()).toBe("[Ťĥíš <span class=\"foobar\">íš à</span> ţëšţ76543210]");
        });
    });

    test("ResourceStringGeneratePseudoSkipEmbeddedXML", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This <%= a ? \"foo\" : \"bar\" %> is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "html"
        });

        var rs2 = rs.generatePseudo("de-DE", rb);

        rb.init(function() {
            expect(rs2).toBeTruthy();
            expect(rs2.getTarget()).toBe("[Ťĥíš <%= a ? \"foo\" : \"bar\" %> íš à ţëšţ2109876543210]");
        });
    });

    test("ResourceStringGeneratePseudoSkipPercentsAndReplacements", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "This %2$-2.2s is a %s {foobar} test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("de-DE", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTarget()).toBe("[Ťĥíš %2$-2.2s íš à %s {foobar} ţëšţ109876543210]");
        });
    });

    test("ResourceStringGeneratePseudoBadLocale", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rb = new RegularPseudo({
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo(undefined, rb);

            expect(!rs2).toBeTruthy();
        });
    });

    test("ResourceStringGeneratePseudoBadBundle", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var rs2 = rs.generatePseudo("de-DE", undefined);

        expect(!rs2).toBeTruthy();
    });

    test("ResourceStringGeneratePseudoBritishRightString", function() {
        expect.assertions(4);

        var rs = new ResourceString({
            key: "asdf",
            source: "I color my checkbooks and localize them.",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            nopseudo: false
        });

        var rb = new PseudoFactory({
            project: p,
            targetLocale: "en-GB",
            type: "c"
        });

        rb.init(function() {
            var rs2 = rs.generatePseudo("en-GB", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTargetLocale(), "en-GB").toBeTruthy();

            expect(rs2.getTarget()).toBe("I colour my chequebooks and localise them.");
        });
    });

    test("ResourceStringGeneratePseudoBritishLikeRightString", function() {
        expect.assertions(4);

        var rs = new ResourceString({
            key: "asdf",
            source: "I color my checkbooks and localize them.",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

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
            var rs2 = rs.generatePseudo("en-ZA", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTargetLocale(), "en-ZA").toBeTruthy();

            expect(rs2.getTarget()).toBe("I colour my chequebooks and localise them.");
        });
    });

    test("ResourceStringGeneratePseudoCanadianRightString", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            key: "asdf",
            source: "I color my checkbooks and localize them.",
            pathName: "a/b/c.java"
        });

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
            var rs2 = rs.generatePseudo("en-CA", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTargetLocale(), "en-CA").toBeTruthy();

            expect(rs2.getTarget()).toBe("I colour my chequebooks and localize them.");
        });
    });

    test("ResourceStringGeneratePseudoTraditionalChineseRightString", function() {
        expect.assertions(4);

        var rs = new ResourceString({
            project: "foo",
            key: "What? Do you mean a European swallow or an African swallow?",
            source: "What? Do you mean a European swallow or an African swallow?",
            pathName: "a/b/c.java",
            sourceLocale: "en-US"
        });
        expect(rs).toBeTruthy();

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB", "zh-Hans-CN", "zh-Hant-TW"]
        });

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'What? Do you mean a European swallow or an African swallow?',
            source: "What? Do you mean a European swallow or an African swallow?",
            sourceLocale: "en-US",
            target: '什么？ 你是指欧洲的燕子还是非洲的燕子？',
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
            var rs2 = rs.generatePseudo("zh-Hant-TW", rb);

            expect(rs2).toBeTruthy();
            expect(rs2.getTargetLocale(), "zh-Hant-TW").toBeTruthy();

            expect(rs2.getTarget()).toBe("什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        });
    });

    test("ResourceStringClone", function() {
        expect.assertions(10);

        var rs = new ResourceString({
            project: "foo",
            context: "blah",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rs).toBeTruthy();

        var rs2 = rs.clone();

        expect(rs2).toBeTruthy();
        expect(rs2.project).toBe(rs.project);
        expect(rs2.context).toBe(rs.context);
        expect(rs2.sourceLocale).toBe(rs.sourceLocale);
        expect(rs2.reskey).toBe(rs.reskey);
        expect(rs2.getSource()).toStrictEqual(rs.getSource());
        expect(rs2.pathName).toBe(rs.pathName);
        expect(rs2.comment).toBe(rs.comment);
        expect(rs2.state).toBe(rs.state);
    });

    test("ResourceStringCloneWithOverrides", function() {
        expect.assertions(13);

        var rs = new ResourceString({
            project: "foo",
            context: "blah",
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rs).toBeTruthy();

        var rs2 = rs.clone({
            targetLocale: "fr-FR",
            target: "Ceci est une teste.",
            state: "asdfasdf"
        });

        expect(rs2).toBeTruthy();
        expect(rs2.project).toBe(rs.project);
        expect(rs2.context).toBe(rs.context);
        expect(rs2.sourceLocale).toBe(rs.sourceLocale);
        expect(rs2.reskey).toBe(rs.reskey);
        expect(rs2.getSource()).toStrictEqual(rs.getSource());
        expect(rs2.getTarget()).toStrictEqual("Ceci est une teste.");
        expect(rs2.pathName).toBe(rs.pathName);
        expect(rs2.comment).toBe(rs.comment);
        expect(rs2.state).toBe("asdfasdf");

        expect(rs2.getTargetLocale() !== rs.getTargetLocale()).toBeTruthy();
        expect(rs2.getTarget() !== rs.getTarget()).toBeTruthy();
    });

    test("ResourceStringEquals", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsNot", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "asdf",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsNotTarget", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            targetLocale: "de-DE",
            target: "Einen Test!",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            targetLocale: "de-AT",
            target: "Einen Test!",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsDifferentFlavor", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            flavor: "vanilla"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsIgnoreSomeFields", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsContentDifferent", function() {
        expect.assertions(3);

        var ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is not a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringStaticHashKey", function() {
        expect.assertions(1);

        expect(ResourceString.hashKey("iosapp", "de-DE", "This is a test", "html", "chocolate")).toBe("rs_iosapp_de-DE_This is a test_html_chocolate");
    });

    test("ResourceStringStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(ResourceString.hashKey(undefined, "de-DE", undefined, undefined)).toBe("rs__de-DE___");
    });

    test("ResourceStringHashKey", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_de-DE_This is a test_html_");
    });

    test("ResourceStringHashKeyWithFlavor", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html",
            flavor: "chocolate"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_de-DE_This is a test_html_chocolate");
    });

    test("ResourceStringSourceOnlyHashKey", function() {
        expect.assertions(2);

        var rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_en-US_This is a test_html_");
    });

    test("ContextResourceStringStaticHashKey", function() {
        expect.assertions(1);

        expect(ContextResourceString.hashKey("iosapp", "foobar", "de-DE", "This is a test", "html", "flavor")).toBe("crs_iosapp_foobar_de-DE_This is a test_html_flavor");
    });

    test("ContextResourceStringStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(ContextResourceString.hashKey(undefined, undefined, "de-DE", undefined, undefined, undefined)).toBe("crs___de-DE___");
    });

    test("ContextResourceStringHashKey", function() {
        expect.assertions(2);

        var rs = new ContextResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("crs_iosapp_foobar_de-DE_This is a test_html_");
    });

    test("ContextResourceStringGetFlavor", function() {
        expect.assertions(2);

        var rs = new ContextResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html",
            flavor: "a"
        });
        expect(rs).toBeTruthy();

        expect(rs.getFlavor()).toBe("a");
    });

    test("ContextResourceStringHashKeyWithFlavor", function() {
        expect.assertions(2);

        var rs = new ContextResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html",
            flavor: "chocolate"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("crs_iosapp_foobar_de-DE_This is a test_html_chocolate");
    });

    test("ContextResourceStringCleanHashKey", function() {
        expect.assertions(2);

        var rs = new ContextResourceString({
            project: "custom-app",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.js",
            datatype: "x-qml"
        });
        expect(rs).toBeTruthy();

        expect(rs.cleanHashKey()).toBe("crs_custom-app_foobar_de-DE_This is a test_x-qml_");
    });

    test("ContextResourceStringSourceOnlyHashKey", function() {
        expect.assertions(2);

        var rs = new ContextResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("crs_iosapp_foobar_en-US_This is a test_html_");
    });

    test("IosLayoutResourceStringStaticHashKey", function() {
        expect.assertions(1);

        expect(IosLayoutResourceString.hashKey("iosapp", "de-DE", "a/b/es.lproj/foo.xib", "This is a test")).toBe("irs_iosapp_de-DE_a/b/es.lproj/foo.xib_This is a test_");
    });

    test("IosLayoutResourceStringStaticHashKeyWithFlavor", function() {
        expect.assertions(1);

        expect(IosLayoutResourceString.hashKey("iosapp", "de-DE", "a/b/es.lproj/foo.xib", "This is a test", "chocolate")).toBe("irs_iosapp_de-DE_a/b/es.lproj/foo.xib_This is a test_chocolate");
    });

    test("IosLayoutResourceStringStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(IosLayoutResourceString.hashKey(undefined, undefined, "de-DE", undefined)).toBe("irs___de-DE__");
    });

    test("IosLayoutResourceStringHashKey", function() {
        expect.assertions(2);

        var rs = new IosLayoutResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/es.lproj/foo.xib",
            flavor: "chocolate"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("irs_iosapp_de-DE_a/b/es.lproj/foo.xib_This is a test_chocolate");
    });

    test("IosLayoutResourceStringSourceOnlyHashKey", function() {
        expect.assertions(2);

        var rs = new IosLayoutResourceString({
            project: "iosapp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/es.lproj/foo.xib"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("irs_iosapp_en-US_a/b/es.lproj/foo.xib_This is a test_");
    });

    test("ResourceStringIsInstanceSame", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(rs).toBeTruthy();

        var dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceStringIsInstanceDifferingOnlyInWhitespace", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test "
        });
        expect(rs).toBeTruthy();

        var dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This \tis a   test    "
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceStringIsInstanceDifferingInSource", function() {
        expect.assertions(3);

        var rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(rs).toBeTruthy();

        var dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test."
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });
    test("SourceContextResourceStringStaticHashKey", function() {
        expect.assertions(1);

        expect(SourceContextResourceString.hashKey("qmlapp", "foobar", "de-DE", "This is a test", "x-qml", "flavor", "r12345678")).toBe("scrs_qmlapp_foobar_de-DE_This is a test_x-qml_flavor_r12345678");
    });

    test("SourceContextResourceStringStaticHashKeyMissingParts", function() {
        expect.assertions(1);

        expect(SourceContextResourceString.hashKey(undefined, undefined, "de-DE", undefined, undefined, undefined, undefined)).toBe("scrs___de-DE____");
    });

    test("SourceContextResourceStringHashKey", function() {
        expect.assertions(2);

        var rs = new SourceContextResourceString({
            project: "qmlqpp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.qml",
            datatype: "x-qml"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("scrs_qmlqpp_foobar_de-DE_This is a test_x-qml__r654479252");
    });

    test("SourceContextResourceStringGetFlavor", function() {
        expect.assertions(2);

        var rs = new SourceContextResourceString({
            project: "qmlqpp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.qml",
            datatype: "x-qml",
            flavor: "a"
        });
        expect(rs).toBeTruthy();

        expect(rs.getFlavor()).toBe("a");
    });

    test("SourceContextResourceStringHashKeyWithFlavor", function() {
        expect.assertions(2);

        var rs = new SourceContextResourceString({
            project: "qmlqpp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a/b/c.qml",
            datatype: "x-qml"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("scrs_qmlqpp_foobar_de-DE_This is a test_x-qml__r654479252");
    });

    test("SourceContextResourceStringCleanHashKey", function() {
        expect.assertions(2);

        var rs = new SourceContextResourceString({
            project: "custom-app",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            locale: "de-DE",
            pathName: "a.qml",
            datatype: "x-qml"
        });
        expect(rs).toBeTruthy();

        expect(rs.cleanHashKey()).toBe("scrs_custom-app_foobar_de-DE_This is a test_x-qml__r654479252");
    });

    test("SourceContextResourceStringSourceOnlyHashKey", function() {
        expect.assertions(2);

        var rs = new SourceContextResourceString({
            project: "qmlqpp",
            context: "foobar",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.qml",
            datatype: "x-qml"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("scrs_qmlqpp_foobar_en-US_This is a test_x-qml__r654479252");
    });

});