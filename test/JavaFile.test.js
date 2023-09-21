/*
 * JavaFile.test.js - test the Java file handler object.
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

if (!JavaFile) {
    var JavaFile = require("../lib/JavaFile.js");
    var JavaFileType = require("../lib/JavaFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
}

var p = new AndroidProject({
    id: "webapp",
    sourceLocale: "en-US",
    pseudoLocale: "de-DE"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var jft = new JavaFileType(p);

describe("javafile", function() {
    test("JavaFileConstructor", function() {
        expect.assertions(1);

        var j = new JavaFile(p);
        expect(j).toBeTruthy();
    });

    test("JavaFileConstructorParams", function() {
        expect.assertions(1);
        var j = new JavaFile(p, "./test/testfiles/java/t1.java", jft);
        expect(j).toBeTruthy();
    });

    test("JavaFileConstructorNoFile", function() {
        expect.assertions(1);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
    });

    test("JavaFileMakeKey", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This is a test")).toBe("r654479252");
    });

    test("JavaFileMakeKeySimpleTexts1", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("Preferences in your profile")).toBe("r372802078");
        expect(j.makeKey("All settings")).toBe("r725930887");
        expect(j.makeKey("Colour scheme")).toBe("r734599412");
        expect(j.makeKey("Experts")).toBe("r343852585");
    });

    test("JavaFileMakeKeyUnescaped", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("foo \\n \\t bar")).toBe("r1056543475");
        expect(j.makeKey("\\n \\t bar")).toBe("r755240053");
        expect(j.makeKey("The \\'Dude\\' played by Jeff Bridges")).toBe("r600298088");
        expect(j.makeKey("\\'Dude\\'")).toBe("r6259609");
    });

    test("JavaFileMakeKeySimpleTexts2", function() {
        expect.assertions(6);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("Procedures")).toBe("r807691021");
        expect(j.makeKey("Mobile Apps")).toBe("r898923204");
        expect(j.makeKey("Settings in your profile")).toBe("r618035987");
        expect(j.makeKey("Product Reviews")).toBe("r175350918");
        expect(j.makeKey("Answers")).toBe("r221604632");
    });

    test("JavaFileMakeKeySimpleTexts3", function() {
        expect.assertions(9);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("Private Profile")).toBe("r314592735");
        expect(j.makeKey("People you are connected to")).toBe("r711926199");
        expect(j.makeKey("Notifications")).toBe("r284964820");
        expect(j.makeKey("News")).toBe("r613036745");
        expect(j.makeKey("More Tips")).toBe("r216617786");
        expect(j.makeKey("Filters")).toBe("r81370429");
        expect(j.makeKey("Referral Link")).toBe("r140625167");
        expect(j.makeKey("Questions")).toBe("r256277957");
    });

    test("JavaFileMakeKeyEscapes", function() {
        expect.assertions(3);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("Can\'t find id")).toBe("r743945592");
        expect(j.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
    });

    test("JavaFileMakeKeyPunctuation", function() {
        expect.assertions(8);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();
        expect(j.makeKey("{name}({generic_name})")).toBe("r300446104");
        expect(j.makeKey("{name}, {sharer_name} {start}found this interesting{end}")).toBe("r8321889");
        expect(j.makeKey("{sharer_name} {start}found this interesting{end}")).toBe("r639868344");
        expect(j.makeKey("Grow your Network")).toBe("r895214324");
        expect(j.makeKey("Failed to send connection request!")).toBe("r1015770123");
        expect(j.makeKey("{goal_name} Goals")).toBe("r993422001");
        expect(j.makeKey("Connection link copied!")).toBe("r180897411");
    });

    test("JavaFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This is a test")).toBe("r654479252");
        expect(j.makeKey("This is a test")).toBe("r654479252");
    });

    test("JavaFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        expect(j.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(j.makeKey("Can\'t    find               id")).toBe("r743945592");

        expect(j.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(j.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS")).toBe("r909283218");
    });

    test("JavaFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        expect(j.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(j.makeKey("      Can\'t find  id ")).toBe("r743945592");

        expect(j.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(j.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r")).toBe("r909283218");
    });

    test("JavaFileMakeKeyNewLines", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(jf.makeKey("A \n B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyEscapeN", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(jf.makeKey("A \\n B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyTabs", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("A \t B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyEscapeT", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("A \\t B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyQuotes", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("A \\'B\\' C")).toBe("r935639115");
    });

    test("JavaFileMakeKeyInterpretEscapedUnicodeChars", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("\\u00A0 \\u0023")).toBe("r2293235");
    });

    test("JavaFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat")).toBe("r969175354");
    });

    test("JavaFileMakeKeyInterpretEscapedOctalChars", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("A \\40 \\011 B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyJavaEscapeSequences", function() {
        expect.assertions(2);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("A \\b\\t\\n\\f\\r B")).toBe("r191336864");
    });

    test("JavaFileMakeKeyCheckRubyCompatibility", function() {
        expect.assertions(13);

        var jf = new JavaFile(p);
        expect(jf).toBeTruthy();
        expect(jf.makeKey("This has \\\"double quotes\\\" in it.")).toBe("r487572481");
        expect(jf.makeKey('This has \\\"double quotes\\\" in it.')).toBe("r487572481");
        expect(jf.makeKey("This has \\\'single quotes\\\' in it.")).toBe("r900797640");
        expect(jf.makeKey('This has \\\'single quotes\\\' in it.')).toBe("r900797640");
        expect(jf.makeKey("This is a double quoted string")).toBe("r494590307");
        expect(jf.makeKey('This is a single quoted string')).toBe("r683276274");
        expect(jf.makeKey("This is a double quoted string with \\\"quotes\\\" in it.")).toBe("r246354917");
        expect(jf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.')).toBe("r248819747");
        expect(jf.makeKey("This is a double quoted string with \\n return chars in it")).toBe("r1001831480");
        expect(jf.makeKey('This is a single quoted string with \\n return chars in it')).toBe("r147719125");
        expect(jf.makeKey("This is a double quoted string with \\t tab chars in it")).toBe("r276797171");
        expect(jf.makeKey('This is a single quoted string with \\t tab chars in it')).toBe("r303137748");
    });

    test("JavaFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r654479252", "java"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("JavaFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("JavaFileParseIgnoreEmpty", function() {
        expect.assertions(3);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("JavaFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('   RB.getString  (    \t "This is a test"    );  ');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("JavaFileParseIgnoreLeadingAndTrailingWhitespace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("  \t \n  This is a test\n\n\t   ");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("JavaFileParseDoubleEscapedWhitespace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('ssb.append(RB.getString("\\\\nTry a Virtual Consult ›"));');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Try a Virtual Consult ›");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Try a Virtual Consult ›");
        expect(r.getKey()).toBe("r682432029");
    });

    test("JavaFileParseIgnoreEscapedLeadingAndTrailingWhitespace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("  \\t \\n  This is a test\\n\\n\\t   ");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });


    test("JavaFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);

        j.parse('RB.getString("This is a test")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("JavaFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("JavaFileParseSimpleWithUniqueIdAndTranslatorComment", function() {
        expect.assertions(6);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "foobar", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("foobar");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("JavaFileParseWithEmbeddedDoubleQuotes", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('\tRB.getString("This is a \\\"test\\\".");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a \"test\".");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a \"test\".");
        expect(r.getKey()).toBe("r446151779");
    });

    test("JavaFileParseWithEmbeddedEscapedSingleQuotes", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('\tRB.getString("This is a \\\'test\\\'.");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a 'test'.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a 'test'.");
        expect(r.getKey()).toBe("r531222461");
    });

    test("JavaFileParseWithEmbeddedUnescapedSingleQuotes", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('\tRB.getString("This is a \'test\'.");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a 'test'.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a 'test'.");
        expect(r.getKey()).toBe("r531222461");
    });

    test("JavaFileParseWithKey", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test", "unique_id")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("unique_id");
    });

    test("JavaFileParseWithKeyIgnoreWhitespace", function() {
        expect.assertions(5);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("   \t\n This is a test       ", "unique_id")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("unique_id");
    });

    test("JavaFileParseWithKeyCantGetBySource", function() {
        expect.assertions(3);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test", "unique_id")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(!r).toBeTruthy();
    });

    test("JavaFileParseMultiple", function() {
        expect.assertions(8);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');

        var set = j.getTranslationSet();
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

    test("JavaFileParseMultipleWithKey", function() {
        expect.assertions(10);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "x", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getAutoKey()).toBeTruthy();
        expect(r.getKey()).toBe("x");

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "y", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getAutoKey()).toBeTruthy();
        expect(r.getKey()).toBe("y");
    });

    test("JavaFileParseMultipleOnSameLine", function() {
        expect.assertions(8);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test");  a.parse("This is another test."); RB.getString("This is another test");\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getAutoKey()).toBeTruthy();

        r = set.getBySource("This is another test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test");
        expect(r.getAutoKey()).toBeTruthy();
    });

    test("JavaFileParseMultipleWithComments", function() {
        expect.assertions(10);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');

        var set = j.getTranslationSet();
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

    test("JavaFileParseMultipleWithUniqueIdsAndComments", function() {
        expect.assertions(10);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "asdf", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("asdf");
        expect(r.getComment()).toBe("foo");

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "kdkdkd", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("kdkdkd");
        expect(r.getComment()).toBe("bar");
    });

    test("JavaFileParseWithDups", function() {
        expect.assertions(6);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        expect(set.size()).toBe(1);
    });

    test("JavaFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("unique_id");
    });

    test("JavaFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test" + " and this isnt");');

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("JavaFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString("This is a test" + foobar);');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("JavaFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString(foobar);');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("JavaFileParseEmptyParams", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('RB.getString();');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("JavaFileParseWholeWord", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('EPIRB.getString("This is a test");');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("JavaFileParseSubobject", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        j.parse('App.RB.getString("This is a test");');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(1);
    });

    test("JavaFileExtractFile", function() {
        expect.assertions(8);

        var j = new JavaFile(p, "./java/t1.java", jft);
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "id1", "java"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test with a unique id");
        expect(r.getKey()).toBe("id1");
    });

    test("JavaFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var j = new JavaFile(p, undefined, jft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("JavaFileExtractBogusFile", function() {
        expect.assertions(2);

        var j = new JavaFile(p, "./java/foo.java", jft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("JavaFileExtractFile2", function() {
        expect.assertions(11);

        var j = new JavaFile(p, "./java/AskPickerSearchFragment.java", jft);
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(3);

        var r = set.getBySource("Can't find a group?");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Can't find a group?");
        expect(r.getKey()).toBe("r315749545");

        r = set.getBySource("Can't find a friend?");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Can't find a friend?");
        expect(r.getKey()).toBe("r23431269");

        r = set.getBySource("Invite them to Myproduct");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Invite them to Myproduct");
        expect(r.getKey()).toBe("r245047512");
    });
});
