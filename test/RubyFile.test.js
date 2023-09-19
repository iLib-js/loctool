/*
 * RubyFile.test.js - test the Ruby file handler object.
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

if (!RubyFile) {
    var RubyFile = require("../lib/RubyFile.js");
    var RubyFileType = require("../lib/RubyFileType.js");
    var WebProject =  require("../lib/WebProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

var p = new WebProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var rft = new RubyFileType(p);

describe("rubyfile", function() {
    test("RubyFileConstructor", function() {
        expect.assertions(1);

        var rf = new RubyFile();
        expect(rf).toBeTruthy();
    });

    test("RubyFileConstructorParams", function() {
        expect.assertions(1);

        var rf = new RubyFile(p, "./ruby/external_user_metric.rb");

        expect(rf).toBeTruthy();
    });

    test("RubyFileConstructorNoFile", function() {
        expect.assertions(1);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();
    });

    test("RubyFileMakeKey", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        expect(rf.makeKey("This is a test")).toBe("r654479252");
    });

    test("RubyFileMakeKeyCompressUnderscores", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("Settings    in $$$  your profile"), "r729246322");
    });

    test("RubyFileMakeKeyCompressUnderscores2", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("Terms___and___Conditions"), "r906781227");
    });

    test("RubyFileMakeKeyNewLines", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(rf.makeKey("A \n B"), "r191336864");
    });

    test("RubyFileMakeKeyTabs", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("A \t B"), "r191336864");
    });

    test("RubyFileMakeKeyQuotes", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("A \\'B\\' C"), "r935639115");
    });

    test("RubyFileMakeKeyInterpretEscapedNonSpecialChars", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("\\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z"), "r1027573048");
    });

    test("RubyFileMakeKeyInterpretEscapedSpecialChars", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("\\u00A0 \\x23"), "r2293235");
    });

    test("RubyFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("Talk to a support representative live 24/7 via video or\u00a0text\u00a0chat"), "r133149847");
    });

    test("RubyFileMakeKeyNoSkipHTML", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("A <br> B"), "r158397839");
    });

    test("RubyFileMakeKeyCheckRubyCompatibility", function() {
        expect.assertions(18);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(rf.makeKeyUnescaped('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(rf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(rf.makeKeyUnescaped('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(rf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string'), "r683276274");
        test.equals(rf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(rf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(rf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\t tab chars in it'), "r303137748");
        test.equals(rf.makeKey("This is a double quoted string with \\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z other escape chars in it"), "r529567158");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z other escape chars in it'), "r102481693");
        test.equals(rf.makeKey("This is a double quoted string with \\u00A0 \\x23 hex escape chars in it"), "r347049046");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\u00A0 \\x23 hex escape chars in it'), "r1000517606");

        test.equals(rf.makeKey("We help more than %{num_ceos} CEOs in our network enhance their reputations,<br>build professional networks, better serve existing customers, grow their businesses,<br>and increase their bottom line."), "r885882110");
    });

    test("RubyFileMakeKeyUnescapedNewLines", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        // unescaped is used for single quoted strings
        test.equals(rf.makeKeyUnescaped("A \\\\n B"), "r968833504");
    });

    test("RubyFileMakeKeyUnescapedTabs", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKeyUnescaped("A \\\\t B"), "r215504705");
    });

    test("RubyFileMakeKeyUnescapedQuotes", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKeyUnescaped("A \\'B\\' C"), "r935639115");
    });

    test("RubyFileMakeKeyInterpretUnescapedSpecialChars", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        test.equals(rf.makeKeyUnescaped("\\u00A0 \\x23"), "r262108213");
    });

    test("RubyFileMakeKeyDigits", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        expect(rf.makeKey("0")).toBe("r3145008");
    });

    test("RubyFileMakeKeyNonChars", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        expect(rf.makeKey("foo: done?!@#$%^&*()")).toBe("r621645297");
    });

    test("RubyFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RubyFileParseSingleQuotes", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.t('This is a test')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RubyFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RubyFileParseIgnoreLeadingAndTrailingWhitespace", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("  \t \n This is a test \t \t \n")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RubyFileParseIgnoreEscapedLeadingAndTrailingWhitespace", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("  \\t \\n This is a test \\t \\t \\n\\n")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RubyFileParseSingleQuotesUnescaped", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.t('This is \\'a\\' test')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is 'a' test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is 'a' test");
        expect(r.getKey()).toBe("r240708166");
    });

    test("RubyFileParseDoubleQuotesEscaped", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.t(\"This is \\'a\\' test\")");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is 'a' test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is 'a' test");
        expect(r.getKey()).toBe("r240708166");
    });

    test("RubyFileParseIgnoreEmpty", function() {
        expect.assertions(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("RubyFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('   Rb.t  (    \t "This is a test"    );  ');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });


    test("RubyFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);

        rf.parse('Rb.t("This is a test")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("RubyFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('\tRb.t("This is a test"); # i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("RubyFileParseWithVariables", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.t('Created at %{date}', variables: {date: @date.localize.to_s})");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Created at %{date}");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Created at %{date}");
        expect(r.getKey()).toBe("r783004496");
    });

    test("RubyFileParseWithExplicitResourceIdSingleQuote", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.t('what', {resource_id: 'which_what'})");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("what");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("what");
        expect(r.getKey()).toBe("which_what");
    });

    test("RubyFileParseWithExplicitResourceIdDoubleQuote", function() {
        expect.assertions(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("what", {resource_id: "which_what"})');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("what");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("what");
        expect(r.getKey()).toBe("which_what");
    });

    test("RubyFileParseMultiple", function() {
        expect.assertions(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
    });

       test("RubyFileParseMultipleSameLine", function() {
        expect.assertions(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('This is Rb.t("This is a test"), a.parse("This is another test."), Rb.t("This is also a test"));');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
    });

    test("RubyFileParseMultipleSameLineWithQuotes", function() {
        expect.assertions(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("[Rb.t('Access the world’s leading online knowledgebase.'), Rb.t('We‘re committed to helping you grow your business!')],");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Access the world’s leading online knowledgebase.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Access the world’s leading online knowledgebase.");
        expect(r.getKey()).toBe("r640890129");

        r = set.getBySource("We‘re committed to helping you grow your business!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We‘re committed to helping you grow your business!");
        expect(r.getKey()).toBe("r592284603");
    });

    test("RubyFileParseMultipleWithComments", function() {
        expect.assertions(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");\t# i18n: bar');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
        expect(r.getComment()).toBe("bar");
    });

    test("RubyFileParseMultipleWithParametersAndComments", function() {
        expect.assertions(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test", "asdf");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test", "kdkdkd");\t# i18n: bar');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
        expect(r.getComment()).toBe("bar");
    });

    test("RubyFileParseMultipleOnSameLineWithComments", function() {
        expect.assertions(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
                '            .about-item\n' +
                '              .item-title\n' +
                '                = @is_ceo ? Rb.t(\'Specialty\') : Rb.t(\'I specialize in\') # i18n this is a section title. Ie. Title: Specialty, Content: Growth Hacking\n'
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Specialty");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Specialty");
        expect(r.getKey()).toBe("r912467643");
        expect(r.getComment(), "this is a section title. Ie. Title: Specialty).toBe(Content: Growth Hacking");

        r = set.getBySource("I specialize in");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("I specialize in");
        expect(r.getKey()).toBe("r271968593");
        expect(r.getComment(), "this is a section title. Ie. Title: Specialty).toBe(Content: Growth Hacking");
    });


    test("RubyFileParseWithDups", function() {
        expect.assertions(6);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is a test");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        expect(set.size()).toBe(1);
    });

    test("RubyFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test" + " and this isnt");');

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RubyFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("This is a test" + foobar);');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t(foobar);');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParseEmptyParams", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t();');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParseWholeWord", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('EPIRb.t("This is a test");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParseSubobject", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('App.Rb.t("This is a test");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
    });

    test("RubyFileParseIgnoreBraces", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.t("asdf asdfs{/link}")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var r = set.getAll()[0];

        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("asdf asdfs{/link}");
        expect(r.getKey()).toBe("r23430520");

        expect(set.size()).toBe(1);
    });

    test("RubyFileExtractFile", function() {
        expect.assertions(8);

        var rf = new RubyFile({
            project: p,
            type: rft,
            pathName: "./ruby/external_user_metric.rb"
        });
        expect(rf).toBeTruthy();

        // should read the file
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(11);

        var r = set.getBySource("Noted that person %{person_id} has %{source} installed");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Noted that person %{person_id} has %{source} installed");
        expect(r.getKey()).toBe("r924558074");

        r = set.getBySource("data is missing or empty.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("data is missing or empty.");
        expect(r.getKey()).toBe("r62756614");
    });

    test("RubyFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RubyFileExtractBogusFile", function() {
        expect.assertions(2);

        var rf = new RubyFile({
            project: p,
            type: rft,
            pathName: "./ruby/foo.rb"
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RubyFileParseHamlFile", function() {
        expect.assertions(18);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
            '.contain-width\n' +
            '  .for-everyone\n' +
            '    %p.big-text.montserrat-regular\n' +
            '      WE HAVE INSURANCE FOR EVERYONE\n' +
            '    .items\n' +
            '      :ruby\n' +
            '        data=[\n' +
            '          {:links=>[{:href=>"/what_we_make/members",:caption=>Rb.t("Learn more about members")}],:img=>"members-mobile@3x.png",:title=>Rb.t("Members"),:caption=>Rb.t("Immediate access to other CEOs and their expertise, anytime, anywhere")},\n' +
            '          {:links=>[{:href=>"/enterprise/providers",:caption=>Rb.t("Learn about business service providers")},{:href=>"/enterprise/practices",:caption=>Rb.t("Learn about best practices")}],:img=>"providers-and-data-warehouse-systems-mobile@3x.png",:title=>Rb.t("Providers & Data Warehouse Systems"))},\n' +
            '          {:links=>[{:href=>"/enterprise/insurers",:caption=>Rb.t("Learn more about employers & insurers")}],:img=>"employers-and-insurers-mobile@3x.png",:title=>Rb.t("Employers & Insurers"),:caption=>Rb.t("Lower costs and improve productivity & satisfaction by providing the right service at the right cost at the right time ")},\n' +
            '          {:links=>[{:href=>"/enterprise/sos",:caption=>Rb.t("Learn more about government & population managers")}],:img=>"govt-pop-mangagers@3x.png",:title=>Rb.t("Government & Population Managers")},\n' +
            '          {:links=>[{:href=>"/what_we_make/developers",:caption=>Rb.t("Learn more about developers")}],:img=>"developers-mobile@3x.png",:title=>Rb.t("Developers"),:caption=>Rb.t("MyProduct Cloud enables developers to build interoperable, engaging, and smart business experiences, powered by our massive backend.")}\n' +
            '        ]\n' +
            '      -data.each do |item|\n' +
            '        .item\n' +
            '          .item-inner\n' +
            '            %img{:src=>"/imgs/static_pages/home/new/" + item[:img]}\n' +
            '            %p.title.montserrat-regular #{item[:title].html_safe}\n' +
            '            %p.small-text #{item[:caption].html_safe}\n' +
            '            - item[:links] ||= []\n' +
            '            - item[:links].each do |link|\n' +
            '              %a.small-text.link{:href=>link[:href]} \n' +
            '                #{link[:caption]}\n' +
            '                %span.arrow &rsaquo;\n'

        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Learn more about members");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Learn more about members");
        expect(r.getKey()).toBe("r899361143");

        r = set.getBySource("Members");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Members");
        expect(r.getKey()).toBe("r412671705");

        r = set.getBySource("Immediate access to other CEOs and their expertise, anytime, anywhere");
        expect(r).toBeTruthy();
        expect(r.getSource(), "Immediate access to other CEOs and their expertise, anytime).toBe(anywhere");
        expect(r.getKey()).toBe("r1016102330");

        r = set.getBySource("Learn about business service providers");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Learn about business service providers");
        expect(r.getKey()).toBe("r400382078");

        r = set.getBySource("Learn more about government & population managers");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Learn more about government & population managers");
        expect(r.getKey()).toBe("r107502447");

        expect(set.size()).toBe(14);
    });

    test("RubyFileParseDoublePluralArrow", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.p({:one => "This is 1 test", :other => "There are %{count} tests"}, {count: 1})');
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseSinglePluralArrow", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({:one => 'This is 1 test', :other => 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseDoublePluralColon", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.p({one: "This is 1 test", other: "There are %{count} tests"}, {count: 1})');
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseSinglePluralColon", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 test', other: 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseMixedPluralOne", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: \"This is 1 test\", :other => 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseMixedPluralTwo", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 test', :other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseOutOfOrder", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({:other => \"There are %{count} tests\", one: 'This is 1 test'}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParsePluralMissingRequiredKey", function() {
        expect.assertions(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({:other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParsePluralSkipInvalidKey", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 test', :three => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('three'),undefined)
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParsePluralAllValid", function() {
        expect.assertions(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 test', two: 'There are a couple tests', zero: 'There are no tests', few: 'There are a few tests', many: 'There are many tests', :other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('two'),'There are a couple tests');
        test.equals(r.getSource('zero'),'There are no tests');
        test.equals(r.getSource('few'),'There are a few tests');
        test.equals(r.getSource('many'),'There are many tests');
        test.equals(r.getSource('other'),"There are %{count} tests");
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParsePluralWithoutVariables", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 %{thing}'}, {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
    });

    test("RubyFileParsePluralFullySpecified", function() {
        expect.assertions(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p({one: 'This is 1 %{thing}', other: 'There are %{count} %{thing}'}, {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('other'),'There are %{count} %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
    });


    test("RubyFileParseComplicated", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("        = Rb.p({:one => '%{link}%{name}%{link_end} + %{question_link}1 colleague%{link_end} weighed in', :other => '%{link}%{name}%{link_end} + %{question_link}%{count} colleagues%{link_end} weighed in'}, {:link => \"<a href='#{url}'>\", :name => colleague.full_name, :link_end => '</a>', :question_link => \"<a href='#{question_url}'>\", :count => count}).html_safe        ");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'%{link}%{name}%{link_end} + %{question_link}1 colleague%{link_end} weighed in');
        test.equals(r.getSource('other'),'%{link}%{name}%{link_end} + %{question_link}%{count} colleagues%{link_end} weighed in');
        test.equals(r.getKey(), 'r747576181');
    });

    test("RubyFileParseLazyDoublePluralArrow", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.p(:one => "This is 1 test", :other => "There are %{count} tests", {count: 1})');
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazySinglePluralArrow", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(:one => 'This is 1 test', :other => 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyDoublePluralColon", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('Rb.p(one: "This is 1 test", other: "There are %{count} tests", {count: 1})');
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazySinglePluralColon", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: 'This is 1 test', other: 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyMixedPluralOne", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: \"This is 1 test\", :other => 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyMixedPluralTwo", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: 'This is 1 test', :other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyOutOfOrder", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(:other => \"There are %{count} tests\", one: 'This is 1 test', {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyPluralMissingRequiredKey", function() {
        expect.assertions(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(:other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("RubyFileParseLazyPluralSkipInvalidKey", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: 'This is 1 test', :three => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('three'),undefined)
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyPluralAllValid", function() {
        expect.assertions(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: 'This is 1 test', two: 'There are a couple tests', zero: 'There are no tests', few: 'There are a few tests', many: 'There are many tests', :other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('two'),'There are a couple tests');
        test.equals(r.getSource('zero'),'There are no tests');
        test.equals(r.getSource('few'),'There are a few tests');
        test.equals(r.getSource('many'),'There are many tests');
        test.equals(r.getSource('other'),"There are %{count} tests");
        test.equals(r.getKey(), 'r186608186');
    });

    test("RubyFileParseLazyPluralWithoutVariables", function() {
        expect.assertions(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("Rb.p(one: 'This is 1 %{thing}', {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getAll()[0];
        expect(r).toBeTruthy();
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
    });

    test("RubyFileParseShortStringInHaml", function() {
        expect.assertions(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('%html\n' +
                 '  %head\n' +
                 '    %meta{:name=>"pdfkit-page_size", :content => Rb.t("A4")}\n' +
                 '    %meta{:name=>"pdfkit-margin_top", :content => Rb.t("0.05in")}\n' +
                 '    %meta{:name=>"pdfkit-margin_right", :content => Rb.t("0.05in")}\n');
        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        var r = resources[0];
        expect(r).toBeTruthy();

        test.equals(r.getSource(), 'A4');
        test.equals(r.getKey(), 'r949377406');

        r = resources[1];
        expect(r).toBeTruthy();

        test.equals(r.getSource(), '0.05in');
        test.equals(r.getKey(), 'r586828064');
    });
});
