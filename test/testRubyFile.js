/*
 * testRubyFile.js - test the Ruby file handler object.
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

module.exports.rubyfile = {
    testRubyFileConstructor: function(test) {
        test.expect(1);

        var rf = new RubyFile();
        test.ok(rf);

        test.done();
    },

    testRubyFileConstructorParams: function(test) {
        test.expect(1);

        var rf = new RubyFile(p, "./ruby/external_user_metric.rb");

        test.ok(rf);

        test.done();
    },

    testRubyFileConstructorNoFile: function(test) {
        test.expect(1);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.done();
    },

    testRubyFileMakeKey: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equal(rf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testRubyFileMakeKeyCompressUnderscores: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("Settings    in $$$  your profile"), "r729246322");

        test.done();
    },

    testRubyFileMakeKeyCompressUnderscores2: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("Terms___and___Conditions"), "r906781227");

        test.done();
    },

    testRubyFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(rf.makeKey("A \n B"), "r191336864");

        test.done();
    },

    testRubyFileMakeKeyTabs: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("A \t B"), "r191336864");

        test.done();
    },

    testRubyFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("A \\'B\\' C"), "r935639115");

        test.done();
    },

    testRubyFileMakeKeyInterpretEscapedNonSpecialChars: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("\\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z"), "r1027573048");

        test.done();
    },

    testRubyFileMakeKeyInterpretEscapedSpecialChars: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("\\u00A0 \\x23"), "r2293235");

        test.done();
    },

    testRubyFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("Talk to a support representative live 24/7 via video or\u00a0text\u00a0chat"), "r133149847");

        test.done();
    },

    testRubyFileMakeKeyNoSkipHTML: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKey("A <br> B"), "r158397839");

        test.done();
    },

    testRubyFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(18);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

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

        test.done();
    },

    testRubyFileMakeKeyUnescapedNewLines: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        // unescaped is used for single quoted strings
        test.equals(rf.makeKeyUnescaped("A \\\\n B"), "r968833504");

        test.done();
    },

    testRubyFileMakeKeyUnescapedTabs: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("A \\\\t B"), "r215504705");

        test.done();
    },

    testRubyFileMakeKeyUnescapedQuotes: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("A \\'B\\' C"), "r935639115");

        test.done();
    },

    testRubyFileMakeKeyInterpretUnescapedSpecialChars: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("\\u00A0 \\x23"), "r262108213");

        test.done();
    },

    testRubyFileMakeKeyDigits: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equal(rf.makeKey("0"), "r3145008");

        test.done();
    },

    testRubyFileMakeKeyNonChars: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        test.equal(rf.makeKey("foo: done?!@#$%^&*()"), "r621645297");

        test.done();
    },

    testRubyFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test")');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testRubyFileParseSingleQuotes: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.t('This is a test')");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testRubyFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test")');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testRubyFileParseIgnoreLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("  \t \n This is a test \t \t \n")');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testRubyFileParseIgnoreEscapedLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("  \\t \\n This is a test \\t \\t \\n\\n")');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testRubyFileParseSingleQuotesUnescaped: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.t('This is \\'a\\' test')");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is 'a' test");
        test.ok(r);

        test.equal(r.getSource(), "This is 'a' test");
        test.equal(r.getKey(), "r240708166");

        test.done();
    },

    testRubyFileParseDoubleQuotesEscaped: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.t(\"This is \\'a\\' test\")");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is 'a' test");
        test.ok(r);

        test.equal(r.getSource(), "This is 'a' test");
        test.equal(r.getKey(), "r240708166");

        test.done();
    },

    testRubyFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("")');

        var set = rf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('   Rb.t  (    \t "This is a test"    );  ');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },


    testRubyFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        rf.parse('Rb.t("This is a test")');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testRubyFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('\tRb.t("This is a test"); # i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testRubyFileParseWithVariables: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.t('Created at %{date}', variables: {date: @date.localize.to_s})");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Created at %{date}");
        test.ok(r);

        test.equal(r.getSource(), "Created at %{date}");
        test.equal(r.getKey(), "r783004496");

        test.done();
    },

    testRubyFileParseWithExplicitResourceIdSingleQuote: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.t('what', {resource_id: 'which_what'})");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("what");
        test.ok(r);

        test.equal(r.getSource(), "what");
        test.equal(r.getKey(), "which_what");

        test.done();
    },

    testRubyFileParseWithExplicitResourceIdDoubleQuote: function(test) {
        test.expect(5);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("what", {resource_id: "which_what"})');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("what");
        test.ok(r);

        test.equal(r.getSource(), "what");
        test.equal(r.getKey(), "which_what");

        test.done();
    },

    testRubyFileParseMultiple: function(test) {
        test.expect(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");

        test.done();
    },

       testRubyFileParseMultipleSameLine: function(test) {
        test.expect(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('This is Rb.t("This is a test"), a.parse("This is another test."), Rb.t("This is also a test"));');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");

        test.done();
    },

    testRubyFileParseMultipleSameLineWithQuotes: function(test) {
        test.expect(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("[Rb.t('Access the world’s leading online knowledgebase.'), Rb.t('We‘re committed to helping you grow your business!')],");

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Access the world’s leading online knowledgebase.");
        test.ok(r);
        test.equal(r.getSource(), "Access the world’s leading online knowledgebase.");
        test.equal(r.getKey(), "r640890129");

        r = set.getBySource("We‘re committed to helping you grow your business!");
        test.ok(r);
        test.equal(r.getSource(), "We‘re committed to helping you grow your business!");
        test.equal(r.getKey(), "r592284603");

        test.done();
    },

    testRubyFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");\t# i18n: bar');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testRubyFileParseMultipleWithParametersAndComments: function(test) {
        test.expect(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test", "asdf");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test", "kdkdkd");\t# i18n: bar');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testRubyFileParseMultipleOnSameLineWithComments: function(test) {
        test.expect(10);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse(
                '            .about-item\n' +
                '              .item-title\n' +
                '                = @is_ceo ? Rb.t(\'Specialty\') : Rb.t(\'I specialize in\') # i18n this is a section title. Ie. Title: Specialty, Content: Growth Hacking\n'
        );

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Specialty");
        test.ok(r);
        test.equal(r.getSource(), "Specialty");
        test.equal(r.getKey(), "r912467643");
        test.equal(r.getComment(), "this is a section title. Ie. Title: Specialty, Content: Growth Hacking");

        r = set.getBySource("I specialize in");
        test.ok(r);
        test.equal(r.getSource(), "I specialize in");
        test.equal(r.getKey(), "r271968593");
        test.equal(r.getComment(), "this is a section title. Ie. Title: Specialty, Content: Growth Hacking");

        test.done();
    },


    testRubyFileParseWithDups: function(test) {
        test.expect(6);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is a test");');

        var set = rf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 1);

        test.done();
    },

    testRubyFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test" + " and this isnt");');

        var set = rf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("This is a test" + foobar);');

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t(foobar);');

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseEmptyParams: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t();');

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseWholeWord: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('EPIRb.t("This is a test");');

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseSubobject: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('App.Rb.t("This is a test");');

        var set = rf.getTranslationSet();
        test.equal(set.size(), 1);

        test.done();
    },

    testRubyFileParseIgnoreBraces: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.t("asdf asdfs{/link}")');

        var set = rf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var r = set.getAll()[0];

        test.ok(r);
        test.equal(r.getSource(), "asdf asdfs{/link}");
        test.equal(r.getKey(), "r23430520");

        test.equal(set.size(), 1);

        test.done();
    },

    testRubyFileExtractFile: function(test) {
        test.expect(8);

        var rf = new RubyFile({
            project: p,
            type: rft,
            pathName: "./ruby/external_user_metric.rb"
        });
        test.ok(rf);

        // should read the file
        rf.extract();

        var set = rf.getTranslationSet();

        test.equal(set.size(), 11);

        var r = set.getBySource("Noted that person %{person_id} has %{source} installed");
        test.ok(r);
        test.equal(r.getSource(), "Noted that person %{person_id} has %{source} installed");
        test.equal(r.getKey(), "r924558074");

        r = set.getBySource("data is missing or empty.");
        test.ok(r);
        test.equal(r.getSource(), "data is missing or empty.");
        test.equal(r.getKey(), "r62756614");

        test.done();
    },

    testRubyFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileExtractBogusFile: function(test) {
        test.expect(2);

        var rf = new RubyFile({
            project: p,
            type: rft,
            pathName: "./ruby/foo.rb"
        });
        test.ok(rf);

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileParseHamlFile: function(test) {
        test.expect(18);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

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
        test.ok(set);

        var r = set.getBySource("Learn more about members");
        test.ok(r);
        test.equal(r.getSource(), "Learn more about members");
        test.equal(r.getKey(), "r899361143");

        r = set.getBySource("Members");
        test.ok(r);
        test.equal(r.getSource(), "Members");
        test.equal(r.getKey(), "r412671705");

        r = set.getBySource("Immediate access to other CEOs and their expertise, anytime, anywhere");
        test.ok(r);
        test.equal(r.getSource(), "Immediate access to other CEOs and their expertise, anytime, anywhere");
        test.equal(r.getKey(), "r1016102330");

        r = set.getBySource("Learn about business service providers");
        test.ok(r);
        test.equal(r.getSource(), "Learn about business service providers");
        test.equal(r.getKey(), "r400382078");

        r = set.getBySource("Learn more about government & population managers");
        test.ok(r);
        test.equal(r.getSource(), "Learn more about government & population managers");
        test.equal(r.getKey(), "r107502447");

        test.equal(set.size(), 14);

        test.done();
    },

    testRubyFileParseDoublePluralArrow: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.p({:one => "This is 1 test", :other => "There are %{count} tests"}, {count: 1})');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseSinglePluralArrow: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({:one => 'This is 1 test', :other => 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseDoublePluralColon: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.p({one: "This is 1 test", other: "There are %{count} tests"}, {count: 1})');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseSinglePluralColon: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 test', other: 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseMixedPluralOne: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: \"This is 1 test\", :other => 'There are %{count} tests'}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseMixedPluralTwo: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 test', :other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseOutOfOrder: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({:other => \"There are %{count} tests\", one: 'This is 1 test'}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParsePluralMissingRequiredKey: function(test) {
        test.expect(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({:other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);
        test.done();
    },

    testRubyFileParsePluralSkipInvalidKey: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 test', :three => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('three'),undefined)
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParsePluralAllValid: function(test) {
        test.expect(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 test', two: 'There are a couple tests', zero: 'There are no tests', few: 'There are a few tests', many: 'There are many tests', :other => \"There are %{count} tests\"}, {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('two'),'There are a couple tests');
        test.equals(r.getSource('zero'),'There are no tests');
        test.equals(r.getSource('few'),'There are a few tests');
        test.equals(r.getSource('many'),'There are many tests');
        test.equals(r.getSource('other'),"There are %{count} tests");
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParsePluralWithoutVariables: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 %{thing}'}, {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
        test.done();
    },

    testRubyFileParsePluralFullySpecified: function(test) {
        test.expect(8);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p({one: 'This is 1 %{thing}', other: 'There are %{count} %{thing}'}, {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('other'),'There are %{count} %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
        test.done();
    },


    testRubyFileParseComplicated: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("        = Rb.p({:one => '%{link}%{name}%{link_end} + %{question_link}1 colleague%{link_end} weighed in', :other => '%{link}%{name}%{link_end} + %{question_link}%{count} colleagues%{link_end} weighed in'}, {:link => \"<a href='#{url}'>\", :name => colleague.full_name, :link_end => '</a>', :question_link => \"<a href='#{question_url}'>\", :count => count}).html_safe        ");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'%{link}%{name}%{link_end} + %{question_link}1 colleague%{link_end} weighed in');
        test.equals(r.getSource('other'),'%{link}%{name}%{link_end} + %{question_link}%{count} colleagues%{link_end} weighed in');
        test.equals(r.getKey(), 'r747576181');
        test.done();
    },

    testRubyFileParseLazyDoublePluralArrow: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.p(:one => "This is 1 test", :other => "There are %{count} tests", {count: 1})');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazySinglePluralArrow: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(:one => 'This is 1 test', :other => 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyDoublePluralColon: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('Rb.p(one: "This is 1 test", other: "There are %{count} tests", {count: 1})');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazySinglePluralColon: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: 'This is 1 test', other: 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyMixedPluralOne: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: \"This is 1 test\", :other => 'There are %{count} tests', {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyMixedPluralTwo: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: 'This is 1 test', :other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyOutOfOrder: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(:other => \"There are %{count} tests\", one: 'This is 1 test', {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyPluralMissingRequiredKey: function(test) {
        test.expect(3);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(:other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);
        test.done();
    },

    testRubyFileParseLazyPluralSkipInvalidKey: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: 'This is 1 test', :three => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('three'),undefined)
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyPluralAllValid: function(test) {
        test.expect(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: 'This is 1 test', two: 'There are a couple tests', zero: 'There are no tests', few: 'There are a few tests', many: 'There are many tests', :other => \"There are %{count} tests\", {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 test');
        test.equals(r.getSource('two'),'There are a couple tests');
        test.equals(r.getSource('zero'),'There are no tests');
        test.equals(r.getSource('few'),'There are a few tests');
        test.equals(r.getSource('many'),'There are many tests');
        test.equals(r.getSource('other'),"There are %{count} tests");
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseLazyPluralWithoutVariables: function(test) {
        test.expect(7);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse("Rb.p(one: 'This is 1 %{thing}', {count: 1, thing: 'test'})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.getSource('one'),'This is 1 %{thing}');
        test.equals(r.getSource('thing'),undefined);
        test.equals(r.getKey(), 'r1006137616');
        test.done();
    },

    testRubyFileParseShortStringInHaml: function(test) {
        test.expect(11);

        var rf = new RubyFile({
            project: p,
            type: rft
        });
        test.ok(rf);

        rf.parse('%html\n' +
                 '  %head\n' +
                 '    %meta{:name=>"pdfkit-page_size", :content => Rb.t("A4")}\n' +
                 '    %meta{:name=>"pdfkit-margin_top", :content => Rb.t("0.05in")}\n' +
                 '    %meta{:name=>"pdfkit-margin_right", :content => Rb.t("0.05in")}\n');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);

        var r = resources[0];
        test.ok(r);

        test.equals(r.getSource(), 'A4');
        test.equals(r.getKey(), 'r949377406');

        r = resources[1];
        test.ok(r);

        test.equals(r.getSource(), '0.05in');
        test.equals(r.getKey(), 'r586828064');

        test.done();
    }
};
