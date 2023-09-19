/*
 * HamlFile.test.js - test the Haml file handler object.
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
if (!HamlFile) {
    var HamlFile = require("../lib/HamlFile.js");
    var HamlFileType = require("../lib/HamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var fs = require("fs");
}
function diff(a, b) {
    if ((!a || !b) && (a || b)) {
        console.log("a is " + a + ", b is " + b);
        return;
    });
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    });
}
var p = new WebProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./testfiles", {
    nopseudo: true,
    locales: ["fr-FR", "es-US", "zh-Hans-CN", "zh-Hant-HK"]
});
var pi = new WebProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./testfiles", {
    nopseudo: true,
    locales: ["fr-FR", "es-US", "zh-Hans-CN", "zh-Hant-HK"],
    identify: true
});
var p2 = new WebProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./testfiles", {
    nopseudo: true,
    locales: ["fr-FR", "es-US", "zh-Hans-CN", "zh-Hant-HK"],
    localeMap: {
        "fr-FR": "fr",
        "zh-Hans-CN": "zh"
    });
});
var hft = new HamlFileType(p);
describe("hamlfile", function() {
    test("HamlFileConstructor", function() {
        expect.assertions(1);
        var h = new HamlFile();
        expect(h).toBeTruthy();
    });
    test("HamlFileConstructorParams", function() {
        expect.assertions(1);
        var h = new HamlFile({
            project: p,
            pathName: "./testfiles/ruby/t2.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
    });
    test("HamlFileConstructorNoFile", function() {
        expect.assertions(1);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
    });
    test("HamlFileEscapeSimple", function() {
        expect.assertions(1);
        expect(HamlFile.escape("This is text & more.")).toBe("This is text &amp; more.");
    });
    test("HamlFileEscapeMultipleAnds", function() {
        expect.assertions(1);
        expect(HamlFile.escape("This & that is text & more.")).toBe("This &amp; that is text &amp; more.");
    });
    test("HamlFileEscapeWithEmbeddedRuby", function() {
        expect.assertions(1);
        expect(HamlFile.escape("This is text #{and} more.")).toBe("This is text #{and} more.");
    });
    test("HamlFileEscapeWithEmbeddedRubyNoEscape", function() {
        expect.assertions(1);
        expect(HamlFile.escape("This is text #{person&.name} more.")).toBe("This is text #{person&.name} more.");
    });
    test("HamlFileEscapeWithAndsAndEmbeddedRubyNoEscape", function() {
        expect.assertions(1);
        expect(HamlFile.escape("This & that is text #{person&.name} more.")).toBe("This &amp; that is text #{person&.name} more.");
    });
    test("HamlFileEscapeWithAndsAndEmbeddedRubyMultipleNoEscape", function() {
        expect.assertions(1);
        expect(HamlFile.escape("requested topic: #{@topic_requested&.id}, topic: #{@topic&.id} test"), "requested topic: #{@topic_requested&.id}).toBe(topic: #{@topic&.id} test");
    });
    test("HamlFileEscapeWithAndsAndEmbeddedRubyMultipleNoEscapeEndingInRuby", function() {
        expect.assertions(1);
        expect(HamlFile.escape("requested topic: #{@topic_requested&.id}, topic: #{@topic&.id}"), "requested topic: #{@topic_requested&.id}).toBe(topic: #{@topic&.id}");
    });
    test("HamlFileMakeKey", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        expect(h.makeKey("This is a test")).toBe("r654479252");
    });
    test("HamlFileMakeKeySimpleTexts1", function() {
        expect.assertions(5);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("Preferences in your profile"), "r372802078");
        test.equals(h.makeKey("All settings"), "r725930887");
        test.equals(h.makeKey("Colour scheme"), "r734599412");
        test.equals(h.makeKey("Experts"), "r343852585");
    });
    test("HamlFileMakeKeyUnescaped", function() {
        expect.assertions(5);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(h.makeKey("\\n \\t bar"), "r755240053");
        test.equals(h.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
        test.equals(h.makeKey("\\'Dude\\'"), "r6259609");
    });
    test("HamlFileMakeKeySimpleTexts2", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("Procedures"), "r807691021");
        test.equals(h.makeKey("Mobile Apps"), "r898923204");
        test.equals(h.makeKey("Settings in your profile"), "r618035987");
        test.equals(h.makeKey("Product Reviews"), "r175350918");
        test.equals(h.makeKey("Answers"), "r221604632");
    });
    test("HamlFileMakeKeySimpleTexts3", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("Private Profile"), "r314592735");
        test.equals(h.makeKey("People you are connected to"), "r711926199");
        test.equals(h.makeKey("Notifications"), "r284964820");
        test.equals(h.makeKey("News"), "r613036745");
        test.equals(h.makeKey("More Tips"), "r216617786");
        test.equals(h.makeKey("Filters"), "r81370429");
        test.equals(h.makeKey("Referral Link"), "r140625167");
        test.equals(h.makeKey("Questions"), "r256277957");
    });
    test("HamlFileMakeKeyEscapes", function() {
        expect.assertions(3);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("Can\'t find id"), "r743945592");
        test.equals(h.makeKey("Can\'t find an application for SMS"), "r909283218");
    });
    test("HamlFileMakeKeyPunctuation", function() {
        expect.assertions(8);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        test.equals(h.makeKey("{name}({generic_name})"), "r300446104");
        test.equals(h.makeKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(h.makeKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(h.makeKey("Grow your Network"), "r895214324");
        test.equals(h.makeKey("Failed to send connection request!"), "r1015770123");
        test.equals(h.makeKey("{goal_name} Goals"), "r993422001");
        test.equals(h.makeKey("Connection link copied!"), "r180897411");
    });
    test("HamlFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        expect(h.makeKey("This is a test")).toBe("r654479252");
        expect(h.makeKey("This is a test")).toBe("r654479252");
    });
    test("HamlFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(5);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        expect(h.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(h.makeKey("Can\'t    find               id")).toBe("r743945592");
        expect(h.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(h.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS")).toBe("r909283218");
    });
    test("HamlFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(5);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        expect(h.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(h.makeKey("      Can\'t find  id ")).toBe("r743945592");
        expect(h.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(h.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r")).toBe("r909283218");
    });
    test("HamlFileMakeKeyNewLines", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \n B"), "r191336864");
    });
    test("HamlFileMakeKeyEscapeN", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \\n B"), "r191336864");
    });
    test("HamlFileMakeKeyTabs", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("A \t B"), "r191336864");
    });
    test("HamlFileMakeKeyEscapeT", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("A \\t B"), "r191336864");
    });
    test("HamlFileMakeKeyQuotes", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("A \\'B\\' C"), "r935639115");
    });
    test("HamlFileMakeKeyInterpretEscapedUnicodeChars", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("\\u00A0 \\u0023"), "r2293235");
    });
    test("HamlFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("\u00a0 text\u00a0chat"), "r87956021");
    });
    test("HamlFileMakeKeyCheckRubyCompatibility", function() {
        expect.assertions(13);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(hf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(hf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(hf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(hf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(hf.makeKey('This is a single quoted string'), "r683276274");
        test.equals(hf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(hf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(hf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(hf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(hf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(hf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");
    });
    test("HamlFileMakeKeyCheckRubyCompatibilitySpecialChars", function() {
        expect.assertions(2);
        var hf = new HamlFile({
            project: p
        });
        expect(hf).toBeTruthy();
        test.equals(hf.makeKey("Foo\u2028 24/7 bar"), "r102490768");
    });
    test("HamlFileFindMatchingOneLine", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar{ {} {{{}}}}  asdf\n"];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(22);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingMixedBrackets", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar{ [] <()>]]}  asdf"];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(22);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingParens", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = 'bar')  asdf"];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(23);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingParensMultiple", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = ('bar'))  "];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(25);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingSquareBrackets", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = 'bar']  "];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(23);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingSquareBracketsMultiple", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = ['bar']]  "];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(25);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileFindMatchingMultipleLines", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf}"
        ];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(21);
        expect(h.currentLine).toBe(1);
    });
    test("HamlFileFindMatchingMultipleLinesTrailingTextIsIgnored", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text"
        ];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(11)).toBe(21);
        expect(h.currentLine).toBe(1);
    });
    test("HamlFileFindMatchingMultipleLinesWithStartIndex0", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text",
            "   .class.otherclass{asdf}"
        ];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(0)).toBe(21);
        expect(h.currentLine).toBe(1);
    });
    test("HamlFileFindMatchingMultipleLinesWithStartIndex57", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text",
            "   .class.otherclass{asdf}"
        ];
        h.currentLine = 2;
        expect(h.findMatchingBrackets(4)).toBe(25);
        expect(h.currentLine).toBe(2);
    });
    test("HamlFileFindMatchingNoSpaces", function() {
        expect.assertions(2);
        var h = new HamlFile();
        h.lines = [
            '  %span{:itemprop=>"author"}= this_friend.friend? ? (link_to(this_friend.to_s,friend_path(this_friend))) : this_friend.profile_name\n'
        ];
        h.currentLine = 0;
        expect(h.findMatchingBrackets(2)).toBe(27);
        expect(h.currentLine).toBe(0);
    });
    test("HamlFileIndentationTabs", function() {
        expect.assertions(1);
        var h = new HamlFile();
        test.equal(h.indentation(
            "\t\t%foo.bar{ {asdf{\n", 0), 2);
    });
    test("HamlFileIndentationSkipReturn", function() {
        expect.assertions(1);
        var h = new HamlFile();
        test.equal(h.indentation(
            "   %foo.bar{ {asdf{\n" +
            "     asdf} asdf} asdf} trailing text\n" +
            "   .class.otherclass {asdf} \n", 57), 3);
    });
    test("HamlFileFindMatchingIndentSame", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "   d",
            "   e"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(2);
    });
    test("HamlFileFindMatchingIndentLess", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            " d",
            "   e"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(2);
    });
    test("HamlFileFindMatchingIndentMore", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "       d",
            "   e"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(3);
    });
    test("HamlFileFindMatchingIndentNoneToEnd", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "       d"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(3);
    });
    test("HamlFileFindMatchingIndentNone", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "   a",
            "   b",
            "   c",
            "       d"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(0);
    });
    test("HamlFileFindMatchingIndentSkipBlankLines", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            ":a",
            "  b",
            "",
            "  c",
            "        ",
            "    d",
            "e"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(5);
    });
    test("HamlFileFindMatchingIndentIncludeBlankLinesAtTheEnd", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            ":a",
            "  b",
            "",
            "  c",
            "        ",
            "d",
            "e"
        ];
        h.currentLine = 0;
        expect(h.findMatchingIndent()).toBe(4);
    });
    test("HamlFileFirstLocalizable", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(5);
    });
    test("HamlFileFirstLocalizableNoIndent", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "%p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(0)).toBe(3);
    });
    test("HamlFileFirstLocalizableSkipSpaces", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(7);
    });
    test("HamlFileFirstLocalizableSkipAttr", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'} This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(16);
    });
    test("HamlFileFirstLocalizableSkipAttrAndWhitespace", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'}   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(18);
    });
    test("HamlFileFirstLocalizableSkipSuffixes", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(8);
    });
    test("HamlFileFirstLocalizableSkipSuffixesEqual", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p= This is not a string but ruby code instead\n"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(6);
    });
    test("HamlFileFirstLocalizableSkipAttrsAndSuffixes", function() {
        expect.assertions(1);
        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'}<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        expect(h.firstLocalizable(2)).toBe(19);
    });
    test("HamlFileConvertTagSimple", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %b testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<b>");
    });
    test("HamlFileConvertTagOneAttr", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %b{ :class => 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<b class='foo'>");
    });
    test("HamlFileConvertTagOneAttrColons", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %b{ class: 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<b class='foo'>");
    });
    test("HamlFileConvertTagWithSlashSuffix", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %br/ testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<br/>");
    });
    test("HamlFileConvertTagMultipleAttrs2", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %p{ :id => 'newpara2', :class => 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<p id='newpara2' class='foo'>");
    });
    test("HamlFileConvertTagMultipleAttrs2Colons", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %p{id: 'newpara2', class : 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<p id='newpara2' class='foo'>");
    });
    test("HamlFileConvertTagMultipleAttrs3", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %p{ :id => 'newpara2', :name=>\"asdf\", :class => 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<p id='newpara2' name=\"asdf\" class='foo'>");
    });
    test("HamlFileConvertTagMultipleAttrs3Colons", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["  %p{id: 'newpara2', name:\"asdf\", class : 'foo' } testing"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<p id='newpara2' name=\"asdf\" class='foo'>");
    });
    test("HamlFileConvertTagAttrsAndClass", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ['  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n'];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<a class=\"data icon\" href=\"/pages/contact_us\">");
    });
    test("HamlFileConvertTagId", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ['  %span#data-part non-breaking\n'];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe("<span id=\"data-part\">");
    });
    test("HamlFileConvertTagIdAndClasses", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ['  %span#data-part.foo.bar non-breaking\n'];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe('<span id=\"data-part\" class="foo bar">');
    });
    test("HamlFileConvertTagIdAndClassesAndAttrs", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ['  %span#data-asdf.foo.bar{:precision => "2"} non-breaking\n'];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe('<span id=\"data-asdf\" class="foo bar" precision="2">');
    });
    test("HamlFileDontConvertTagWithNonAttrs", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.lines = ["    %span.text{:class=>page=='smile' ? 'active' : 'hidden'} &#8250; Smile\n"];
        h.currentLine = 0;
        expect(h.convertTag(3)).toBe('');
    });
    test("HamlFileParseTextSimple", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextMultiLine", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  This is more text at the same indentation level.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test. This is more text at the same indentation level.");
        expect(r.getKey()).toBe("r130670021");
    });
    test("HamlFileParseTextMultiLineDifferentLevelOutdent", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test\n' +
                'This is more text at a different indentation level.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is more text at a different indentation level.");
        expect(r.getKey()).toBe("r464867050");
    });
    test("HamlFileParseTextMultiLineDifferentLevelIndent", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '    This is more text at a different indentation level.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test. This is more text at a different indentation level.");
        expect(r.getKey()).toBe("r783876767");
    });
    test("HamlFileParseTextBlankIndentedLineSeparatesResources", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test\n' +
                '  \n' +
                '  This is another test.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        var r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test.");
        expect(r.getKey()).toBe("r139148599");
    });
    test("HamlFileParseTextCompletelyBlankLineSeparatesResources", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test\n' +
                '\n' +
                '  This is another test.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        var r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test.");
        expect(r.getKey()).toBe("r139148599");
    });
    test("HamlFileParseTextBlankMoreIndentedLineAlsoSeparatesResources", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test\n' +
                '    \n' +
                '    This is another test.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        var r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test.");
        expect(r.getKey()).toBe("r139148599");
    });
    test("HamlFileParseTextEmbeddedHTML", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is <span class="foo">a test</a> for the ages.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <span class="foo">a test</a> for the ages.');
        expect(r.getKey()).toBe("r533194803");
    });
    test("HamlFileParseTextEmbeddedRuby", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  There are #{group.count(:friend).uniq} friends.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('There are #{group.count(:friend).uniq} friends.');
        expect(r.getKey()).toBe("r858463218");
    });
    test("HamlFileParseTextEmbeddedRubyWithAmpersand", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  There are #{group.count(:friend)&.uniq} friends.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('There are #{group.count(:friend)&.uniq} friends.');
        expect(r.getKey()).toBe("r672148600");
    });
    test("HamlFileParseTextWithCSSClasses", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  .fg-bold.fg-test This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithHTMLTags", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithHTMLTagsMultiline", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p This is a test.\n' +   // text wrapped in a div
                '  This is more text at the same indentation level.\n');  // should be a separate string
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is more text at the same indentation level.");
        expect(r.getKey()).toBe("r467961626");
    });
    test("HamlFileParseTextWithHTMLTagsWithAttributes", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %a{:href=>"/pages/contact_us"} This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithHTMLTagsWithNestedAttributes", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('    %a.apply_btn.green.btn{:href=>"#{job[\'url\']}", :target=>\'_blank\'} This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithHTMLTagsWithAttributesAndClasses", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %a.data.icon{:href=>"/pages/contact_us"} This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithHTMLNonBreakingTags", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of\n' +
                '  %b bold text\n' +
                '  embedded in the sentence.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of <b>bold text</b> embedded in the sentence.");
        expect(r.getKey()).toBe("r425499692");
    });
    test("HamlFileParseTextWithHTMLNonBreakingTagsWithAttributesAndClasses", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of the\n' +
                '  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
                '  tags.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is a test of the <a class="data icon" href="/pages/contact_us">non-breaking</a> tags.');
        expect(r.getKey()).toBe("r198921042");
    });
    test("HamlFileParseTextWithHTMLNonBreakingTagsWithNonAttributes", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        // the code in the attributes disqualifies it from being converted into a <span> tag in line
        h.parse("    Mission\n" +
                "    %span.text{:class=>page=='smile' ? 'active' : 'hidden'} &#8250; Smile\n" +
                "    %span.text{:class=>page=='thanks' ? 'active' : 'hidden'} &#8250; Thanks, Friend!\n");
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mission');
        expect(r.getKey()).toBe("r642046153");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('&#8250; Smile');
        expect(r.getKey()).toBe("r238348915");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource(), '&#8250; Thanks).toBe(Friend!');
        expect(r.getKey()).toBe("r88865504");
    });
    test("HamlFileParseTextWithHTMLBreakingTags", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %div A different string.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
    });
    test("HamlFileParseTextWithHTMLIndentedStrings", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p\n' +
                '    A different string.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHTMLIndentedStringsSameLineContinued", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p A different string.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHTMLIndentedStringsContinuedMultiple", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p\n' +
                '    A different string.\n' +
                '    Another string.\n' +
                '    Yet another string.\n' +
                '  Not indented.');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string. Another string. Yet another string.");
        expect(r.getKey()).toBe("r983432399");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHTMLIndentedStringsSameLineNotContinued", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p A different string.\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithTripleBang", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('!!! Frameset\n' +
                'This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithTripleBangAlone", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('!!!\n' +
                'This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });
    test("HamlFileParseTextWithSingleBang", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('! Frameset\n' +
                'This is a test\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("! Frameset This is a test");
        expect(r.getKey()).toBe("r414916314");
    });
    test("HamlFileParseSkipScriptBlocks", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  :ruby\n' +
                '     Rb.t("Not indented.);\n' +
                '     = asdf asdfasdf\n' +
                '     Skip this string.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithClasses", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '    .a.b A different string.\n' +   // this is a div
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithClassesSameIndent", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  .a.b A different string.\n' +    // this is a div
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHashIdDiv", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  #abc A different string.\n' +    // this is a div with an id
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHashIdDivWithAttrs", function() {
        expect.assertions(12);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  #abc{a: "b", c: "d"} A different string.\n' +    // this is a div with an id and attributes
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A different string.");
        expect(r.getKey()).toBe("r216287039");
        r = resources[2];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHashSubstitutionAtBeginningOfTheLine", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  #{abc} A different string.\n' +    // this is NOT a div but a hash substitution instead
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test. #{abc} A different string. Not indented.");
        expect(r.getKey()).toBe("r356714989");
    });
    test("HamlFileParseTextWithHtmlComments", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  / This is a test.\n' +
                '  / A different string.\n' +    // this is a comment
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHamlComments", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  -# This is a test.\n' +
                '  -# A different string.\n' +    // this is a comment
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHamlCommentsWithSpaces", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  - # This is a test.\n' +
                '  - # A different string.\n' +    // this is a comment
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHtmlCommentsIndented", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  / This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithHamlCommentsIndented", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  -# This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithRubyCode", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  = This is a test.\n' +
                '  = This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithRubyCodeWithIndentedContents", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  = This is a test.\n' +
                '  = This indented string is still within the ruby code.\n' +
                '    Indented text.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Indented text.");
        expect(r.getKey()).toBe("r899620093");
    });
    test("HamlFileParseTextWithHtmlSafeRubyCode", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  &= This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextThatStartsWithAnEntity", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        // do not treat this as a html-safe ruby code
        h.parse('  &amp; This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("& This is a test.");
        expect(r.getKey()).toBe("r470281808");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextThatStartsWithAnExclamationMark", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        // do not treat this as a html-safe ruby code
        h.parse('  ! This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("! This is a test.");
        expect(r.getKey()).toBe("r495928089");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithNotHtmlSafeRubyCode", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  != This is a test.\n' +
                '  != This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextSkipRubyCommands", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('- paragraphs = ["Dear #{@friend.to_s(true, true)},"] \n' +
                '- if @friend.isActive?\n' +
                '  Positive.\n' +
                '- else\n' +
                '  Negative.\n' +
                '- endif\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Positive.");
        expect(r.getKey()).toBe("r389103942");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Negative.");
        expect(r.getKey()).toBe("r1006126501");
    });
    test("HamlFileParseTextRubyCommandsBracketsNotMatchedAtEOL", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('- paragraphs = ["Dear #{@friend.to_s(true, true)},", \n' +
                '  "Thank you for committing to volunteer","Your time will help hundreds rebuild their lives after the deadly hurricanes. Call #{@support_phone} for more info."]\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextWithMultilineRubyCode", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('= func(                         |\n' +
                '  "I think this might get " +   |\n' +
                '  "pretty long so I should " +  |\n' +
                '  "probably make it " +         |\n' +
                '  "multiline so it doesn\'t " + |\n' +
                '  "look awful.")                |\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagWithSuffixEquals", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%p= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagComplicatedWithSuffixEquals", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagComplicatedWithMultipleSuffixesAndEquals", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagComplicatedWithNoSpaceAndEqualsSuffix", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%span{:itemprop=>"author"}= this_friend.friend? ? (link_to(this_friend.to_s,friend_path(this_friend))) : this_friend.profile_name\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagWithSuffixSlash", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%meta{:attr => "value", :x => "y"}/ This is a test.\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagWithSuffixLT", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%meta{:attr => "value", :x => "y"}< This is a test.\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagWithSuffixGT", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%meta{:attr => "value", :x => "y"}> This is a test.\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextTagWithSuffixMultiple", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('%meta{:attr => "value", :x => "y"}<> This is a test.\n' +
                'Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.");
        expect(r.getKey()).toBe("r112256965");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextIgnoreOnlyHashRuby", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %div{:attr => "value"} #{this should be ignored}\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextIgnoreOnlyHtml", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %div{:attr => "value"} <img src="http://some.com/url/here" />\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextIgnoreOnlyNonText", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %div{:attr => "value"} .,$#$@%\n' +
                '  Not indented.\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Not indented.");
        expect(r.getKey()).toBe("r313193297");
    });
    test("HamlFileParseTextDoNotIncludeOutdentedNonBreakingTags", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('            Message\n' +
                '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
                '            %span.check_icon\n' +
                '            Recommend\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Message");
        expect(r.getKey()).toBe("r727846503");
        var r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Recommend");
        expect(r.getKey()).toBe("r108032100");
    });
    test("HamlFileParseTextWrapNonBreakingTagContentsProperly", function() {
        expect.assertions(9);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('          Message\n' +
                '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
                '            %span.check_icon\n' +
                '            Recommend\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Message');
        expect(r.getKey()).toBe("r727846503");
        r = resources[1];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Recommend');
        expect(r.getKey()).toBe("r108032100");
    });
    test("HamlFileParseTextConvertHTMLEntities", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  Read more&nbsp;&rsaquo;\n');
        var set = h.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var resources = set.getAll();
        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Read more ›');
        expect(r.getKey()).toBe("r818505217");
    });
    test("HamlFileAssembleTranslation", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test. This should all be in one string.",
            original: '  This is a test.\n' +
                      '  This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. Tout doit etre en une phrase.';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationWithEmbeddedTags", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test. <b>Bold text.</b> This should all be in one string.",
            original: 'This is a test.\n' +
                      '<b>Bold text.</b>\n' +
                      'This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("Bold text."),
            target: "Texte gras.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationWithEmbeddedTagsOnTheSameLine", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test.<b>Bold text.</b>This should all be in one string.",
            original: 'This is a test.<b>Bold text.</b>This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("Bold text."),
            target: "Texte gras.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationModernTranslationIsCorrect", function() {
        expect.assertions(5);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test. <b>Bold text.</b> This should all be in one string.",
            original: 'This is a test.\n' +
                      '<b>Bold text.</b>\n' +
                      'This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            source: "This is a test.",
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("Bold text."),
            source: "Bold text.",
            target: "Texte gras.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            source: "This should all be in one string.",
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        expect(actual).toBe(expected);
        var key = h.makeKey(segment.text);
        var resource = hft.modern.getClean(ResourceString.cleanHashKey("webapp", "fr-FR", key, "x-haml"));
        expect(resource).toBeTruthy();
        expect(resource.getTarget()).toBe(expected);
        expect(resource.reskey).toBe(key);
    });
    test("HamlFileAssembleTranslationWithEmbeddedEntities", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test & another test.",
            original: 'This is a test &amp; another test.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test"),
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("another test."),
            target: "encore un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai & encore un essai.';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationWithEmbeddedTagsMissingStrings", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test. <b>Bold text.</b> This should all be in one string.",
            original: 'This is a test.\n' +
                      '<b>Bold text.</b>\n' +
                      'This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Bold text.</b> Tout doit etre en une phrase.';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationMissingStringsGivesPartialOutput", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "#{friend_name}'s video is unavailable.<br>Please continue by voice or chat.",
            original: "        #{friend_name}'s video is unavailable.<br>\n" +
                      "        Please continue by voice or chat.\n"
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("Please continue by voice or chat."),
            target: "Por favor, continúa por voz o chat.",
            targetLocale: "es-US",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "es-US");
        var expected = "#{friend_name}'s video is unavailable. <br>Por favor, continúa por voz o chat.";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileAssembleTranslationModernTranslationsUpdated", function() {
        expect.assertions(3);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        var segment = {
            text: "This is a test. <b>Bold text.</b> This should all be in one string.",
            original: 'This is a test.\n' +
                      '<b>Bold text.</b>\n' +
                      'This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("Bold text."),
            target: "Texte gras.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        var resource = hft.modern.get(ResourceString.hashKey("webapp", "fr-FR", h.makeKey(segment.text), hft.datatype));
        expect(resource).toBeTruthy();
        diff(resource.getTarget(), expected);
        expect(resource.getTarget()).toBe(expected);
    });
    test("HamlFileAssembleTranslationMissingStringsInModernTranslation", function() {
        expect.assertions(4);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        hft.modern.clear();
        expect(hft.modern.size()).toBe(0);
        var segment = {
            text: "This is a test. <b>Bold text.</b> This should all be in one string.",
            original: 'This is a test.\n' +
                      '<b>Bold text.</b>\n' +
                      'This should all be in one string.\n'
        };
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This should all be in one string."),
            target: "Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        var expected = 'Ceci est un essai. <b>Bold text.</b> Tout doit etre en une phrase.';
        // because it was not completely translated, it goes into the newres set so that it
        // will get retranslated later through the vendor
        var resource = hft.newres.get(ResourceString.hashKey("webapp", "fr-FR", h.makeKey(segment.text), hft.datatype));
        expect(resource).toBeTruthy();
        diff(resource.getTarget(), expected);
        expect(resource.getTarget()).toBe(expected);
    });
    test("HamlFileLocalizeText", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  This should all be in one string.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test. This should all be in one string."),
            target: "Ceci est un essai. Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai. Tout doit etre en une phrase.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithIdentify", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: pi, // project with identify set to true
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  This should all be in one string.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test. This should all be in one string."),
            target: "Ceci est un essai. Tout doit etre en une phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  <span loclang="haml" locid="' + h.makeKey("This is a test. This should all be in one string.") + '">Ceci est un essai. Tout doit etre en une phrase.</span>\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextLowerIndentLevel", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                'This is more text at a different indentation level.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is a test."),
            target: "Ceci est un essai.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey("This is more text at a different indentation level."),
            target: "Tout doit etre dans deux phrases.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       'Tout doit etre dans deux phrases.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextEmbeddedHTML", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is <span class="foo">a test</span> for the ages.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is <span class="foo">a test</span> for the ages.'),
            source: "This is <span class=\"foo\">a test</span> for the ages.",
            sourceLocale: "en-US",
            target: 'Ceci est <span class="foo">un essai</span> pour les temps entiere.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est <span class="foo">un essai</span> pour les temps entiere.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithCSSClasses", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  .fg-bold.fg-test This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  .fg-bold.fg-test Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithCSSClassesAndIdentify", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: pi, // project with identify set to true
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  .fg-bold.fg-test This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  .fg-bold.fg-test <span loclang="haml" locid="' + h.makeKey("This is a test.") + '">Ceci est un essai.</span>\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHTMLTags", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHTMLTagsSameIndent", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p This is a test.\n' +   // text wrapped in a div
                '  This is more text at the same indentation level.\n');  // should be a separate string
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is more text at the same indentation level.'),
            source: "This is more text at the same indentation level.",
            sourceLocale: "en-US",
            target: 'Ceci est plus texte avec le meme niveau d\'indentation.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p Ceci est un essai.\n' +
                       '  Ceci est plus texte avec le meme niveau d\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHTMLTagsWithAttrs", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %a{:href=>"/pages/contact_us"} This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %a{:href=>"/pages/contact_us"} Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithNonBreakingHTMLTags", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of\n' +
                '  %b bold text\n' +
                '  embedded in the sentence.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test of <b>bold text</b> embedded in the sentence.'),
            source: "This is a test of <b>bold text</b> embedded in the sentence.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai de <b>texte en gras</b> incorporé dans la phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai de <b>texte en gras</b> incorporé dans la phrase.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithNonBreakingHTMLTags", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of the\n' +
                '  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
                '  tags.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
                project: "webapp",
                key: h.makeKey('This is a test of the <a class="data icon" href="/pages/contact_us">non-breaking</a> tags.'),
            source: "This is a test of the <a class=\"data icon\" href=\"/pages/contact_us\">non-breaking</a> tags.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai des mots clés <a class="data icon" href="/pages/contact_us">sans ruptures</a>.',
                targetLocale: "fr-FR",
                datatype: hft.datatype,
                origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai des mots clés <a class="data icon" href="/pages/contact_us">sans ruptures</a>.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithNonBreakingHTMLTagsButNoContentOnSameLine", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('          Message\n' +
                '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
                '            %span.check_icon\n' +
                '            Recommend\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
                project: "webapp",
                key: h.makeKey('Message'),
            source: "Message",
            sourceLocale: "en-US",
                target: 'Méssage',
                targetLocale: "fr-FR",
                datatype: hft.datatype,
                origin: "target"
        }));
        translations.add(new ResourceString({
                project: "webapp",
                key: h.makeKey('Recommend'),
            source: "Recommend",
            sourceLocale: "en-US",
                target: 'Recommendez',
                targetLocale: "fr-FR",
                datatype: hft.datatype,
                origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected =
            '          Méssage\n' +
            '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
            '            %span.check_icon\n' +
            '            Recommendez\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithBreakingHTMLTags", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %div A different string.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %div Une autre phrase.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHTMLIndentedStringsContinuedMultiple", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p\n' +
                '    A different string.\n' +
                '    Another string.\n' +
                '    Yet another string.\n' +
                '  Not indented.');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string. Another string. Yet another string.'),
            source: "A different string. Another string. Yet another string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase. Plus une autre. Encore une phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %p\n' +
                       '    Une autre phrase. Plus une autre. Encore une phrase.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHTMLNotIndentedStrings", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  %p A different string.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %p Une autre phrase.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithRubySubstitutions", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of #{name} localization.\n' +
                '  More text is not\n' +
                '  embedded in the sentence.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test of #{name} localization. More text is not embedded in the sentence.'),
            source: "This is a test of #{name} localization. More text is not embedded in the sentence.",
            sourceLocale: "en-US",
            target: "Ceci est un essai de tradducion de #{name}. Plus de texte n'est pas incorporé dans la phrase.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = "  Ceci est un essai de tradducion de #{name}. Plus de texte n'est pas incorporé dans la phrase.\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithRubySubstitutionsAvoidEscapingInRubyParts", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test of #{person&.name} localization.\n' +
                '  More text is not\n' +
                '  embedded in the sentence. &\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test of #{person&.name} localization. More text is not embedded in the sentence. &'),
            source: "This is a test of #{person&.name} localization. More text is not embedded in the sentence. &",
            sourceLocale: "en-US",
            target: "Ceci est un essai de tradducion de #{person&.name}. Plus de texte n'est pas incorporé dans la phrase. &",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = "  Ceci est un essai de tradducion de #{person&.name}. Plus de texte n'est pas incorporé dans la phrase. &amp;\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithTripleBang", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('!!! XML\n' +
                'This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected =
            '!!! XML\n' +
            'Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithTripleBangAlone", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('!!!\n' +
                'This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected =
            '!!!\n' +
            'Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithDoubleBang", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('!! XML\n' +
                'This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('!! XML This is a test.'),
            source: "!! XML This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected =
            'Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithSingleBang", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('! XML\n' +
                'This is a test.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('! XML This is a test.'),
            source: "! XML This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected =
            'Ceci est un essai.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipScriptBlocks", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  :ruby\n' +
                '     Rb.t("Not indented.);\n' +
                '     = asdf asdfasdf\n' +
                '     Skip this string.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  :ruby\n' +
                       '     Rb.t("Not indented.);\n' +
                       '     = asdf asdfasdf\n' +
                       '     Skip this string.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextDontSkipInsideDashCode", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('- content_for :guest_content do\n' +
                '  This is a test.\n' +
                '  :ruby\n' +
                '     Rb.t("Not indented.);\n' +
                '     = asdf asdfasdf\n' +
                '     Skip this string.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '- content_for :guest_content do\n' +
                       '  Ceci est un essai.\n' +
                       '  :ruby\n' +
                       '     Rb.t("Not indented.);\n' +
                       '     = asdf asdfasdf\n' +
                       '     Skip this string.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithClasses", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is a test.\n' +
                '  .a.b A different string.\n' +   // this is a div
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  .a.b Une autre phrase.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipHtmlComments", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  / This is a test.\n' +
                '  / A different string.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  / This is a test.\n' +
                       '  / A different string.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipHamlComments", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  -# This is a test.\n' +
                '  -# A different string.\n' +    // this is a div
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  -# This is a test.\n' +
                       '  -# A different string.\n' +    // this is a div
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipHtmlCommentsIndented", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  / This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  / This is a test.\n' +
                       '    This indented string is still within the comment.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipHamlCommentsIndented", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  -# This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  -# This is a test.\n' +
                       '    This indented string is still within the comment.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextSkipHamlCommentsIndented", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  = This is a test.\n' +
                '  = This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  = This is a test.\n' +
                       '  = This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithHtmlSafeRubyCode", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  &= This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  &= This is a test.\n' +
                       '  &= This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithNotHtmlSafeRubyCode", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  != This is a test.\n' +
                '  != This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  != This is a test.\n' +
                       '  != This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithMultilineRubyCode", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  = func(                         |\n' +
                '    "I think this might get " +   |\n' +
                '    "pretty long so I should " +  |\n' +
                '    "probably make it " +         |\n' +
                '    "multiline so it doesn\'t " + |\n' +
                '    "look awful.")                |\n' +
                '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  = func(                         |\n' +
                       '    "I think this might get " +   |\n' +
                       '    "pretty long so I should " +  |\n' +
                       '    "probably make it " +         |\n' +
                       '    "multiline so it doesn\'t " + |\n' +
                       '    "look awful.")                |\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithSuffixEquals", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p= This is not a string but ruby code instead\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextComplicatedWithSuffixEquals", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextComplicatedWithMultipleSuffixesAndEquals", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithSuffixSlash", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %meta{:attr => "value", :x => "y"}/ This is a test.\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}/ Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextWithSuffixSlashNonBreakingTag", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  This is\n' +
                '  %br/\n' +
                 '  Spinal Tap.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is <br/> Spinal Tap.'),
            source: "This is <br/> Spinal Tap.",
            sourceLocale: "en-US",
            target: 'Ceci est <br/> Spinal Tap.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est <br/> Spinal Tap.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextEscapeHTML", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  A &amp; B\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A & B'),
            source: "A & B",
            sourceLocale: "en-US",
            target: 'C & D',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  C &amp; D\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextTagWithSuffixLT", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %meta{:attr => "value", :x => "y"}< This is a test.\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}< Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextTagWithSuffixMultiple", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('  %meta{:attr => "value", :x => "y"}<> This is a test.\n' +
                 '  Not indented.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('This is a test.'),
            source: "This is a test.",
            sourceLocale: "en-US",
            target: 'Ceci est un essai.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('A different string.'),
            source: "A different string.",
            sourceLocale: "en-US",
            target: 'Une autre phrase.',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Not indented.'),
            source: "Not indented.",
            sourceLocale: "en-US",
            target: "Sans l'indentation.",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}<> Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextCorrectIndentationAfterBlankLines", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        h.parse('.pricing\n' +
                '  .pricing-intro\n' +
                '    %h2.header-medium.light\n' +
                '      Calculate ROI for\n' +
                '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' +
                '\n' +
                '    %p\n' +
                '      Type your organization\'s own values to estimate your ROI\n' +
                '    \n' +
                '  .desktop-ui.calc-links\n' +
                '    %a.reset Reset values\n' +
                '    %span.sep\n' +
                '    %a.assumptions Assumptions\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Type your organization\'s own values to estimate your ROI'),
            source: "Type your organization\'s own values to estimate your ROI",
            sourceLocale: "en-US",
            target: 'Tapez les valeurs propres de votre organisation pour estimer votre ROI',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Calculate ROI for'),
            source: "Calculate ROI for",
            sourceLocale: "en-US",
            target: 'Calculer le ROI pour',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Reset values'),
            source: "Reset values",
            sourceLocale: "en-US",
            target: 'Réinitialiser les valeurs',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Assumptions'),
            source: "Assumptions",
            sourceLocale: "en-US",
            target: "Hypothèses",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '.pricing\n' +
                       '  .pricing-intro\n' +
                       '    %h2.header-medium.light\n' +
                       '      Calculer le ROI pour\n' +
                       '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' +
                       '\n' +
                       '    %p\n' +
                       '      Tapez les valeurs propres de votre organisation pour estimer votre ROI\n' +
                       '    \n' +
                       '  .desktop-ui.calc-links\n' +
                       '    %a.reset Réinitialiser les valeurs\n' +
                       '    %span.sep\n' +
                       '    %a.assumptions Hypothèses\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("HamlFileLocalizeTextNewResIsCorrect", function() {
        expect.assertions(8);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        hft.newres.clear();
        expect(hft.newres.size()).toBe(0);
        h.parse('.pricing\n' +
                '  .pricing-intro\n' +
                '    %h2.header-medium.light\n' +
                '      Calculate ROI for\n' +
                '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' +
                '\n' +
                '    %p\n' +
                '      Type your organization\'s own values to estimate your ROI\n' +
                '    \n' +
                '  .desktop-ui.calc-links\n' +
                '    %a.reset Reset values\n' +
                '    %span.sep\n' +
                '    %a.assumptions Assumptions\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Calculate ROI for'),
            source: "Calculate ROI for",
            sourceLocale: "en-US",
            target: 'Calculer le ROI pour',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Reset values'),
            source: "Reset values",
            sourceLocale: "en-US",
            target: 'Réinitialiser les valeurs',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Assumptions'),
            source: "Assumptions",
            sourceLocale: "en-US",
            target: "Hypothèses",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '.pricing\n' +
                       '  .pricing-intro\n' +
                       '    %h2.header-medium.light\n' +
                       '      Calculer le ROI pour\n' +
                       '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' +
                       '\n' +
                       '    %p\n' +
                       '      Type your organization\'s own values to estimate your ROI\n' +
                       '    \n' +
                       '  .desktop-ui.calc-links\n' +
                       '    %a.reset Réinitialiser les valeurs\n' +
                       '    %span.sep\n' +
                       '    %a.assumptions Hypothèses\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
        expect(hft.newres.size()).toBe(1);
        var resource = hft.newres.getClean(
            ResourceString.cleanHashKey(
                    p.getProjectId(), "fr-FR", h.makeKey("Type your organization's own values to estimate your ROI"), "x-haml"));
        expect(resource).toBeTruthy();
        expect(resource.getSource()).toBe("Type your organization's own values to estimate your ROI");
        expect(resource.getTarget()).toBe("Type your organization's own values to estimate your ROI");
        expect(resource.getTargetLocale()).toBe("fr-FR");
    });
    test("HamlFileExtractFile", function() {
        expect.assertions(8);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should read the file
        h.extract();
        var set = h.getTranslationSet();
        expect(set.size()).toBe(9);
        var r = set.getBySource("Type your organization's own values to estimate your ROI");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Type your organization's own values to estimate your ROI");
        expect(r.getKey()).toBe("r64223466");
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r251869351", "x-haml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Annual gross savings");
        expect(r.getKey()).toBe("r251869351");
    });
    test("HamlFileExtractFileNoRubyStringsExtracted", function() {
        expect.assertions(6);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should read the file
        h.extract();
        var set = h.getTranslationSet();
        expect(set.size()).toBe(9);
        // "Size of organization"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "x-haml"));
        expect(!r).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "ruby"));
        expect(!r).toBeTruthy();
        // "Average cost of ER visit"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "x-haml"));
        expect(!r).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "ruby"));
        expect(!r).toBeTruthy();
    });
    test("HamlFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        h.extract();
        var set = h.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("HamlFileExtractBogusFile", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        h.extract();
        var set = h.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("HamlFileGetLocalizedPath", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            pathName: "foo.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        expect(h.getLocalizedPath("fr-FR")).toBe("foo.fr-FR.html.haml");
    });
    test("HamlFileGetLocalizedPathWithDir", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        expect(h.getLocalizedPath("fr-FR")).toBe("ruby/foo.fr-FR.html.haml");
    });
    test("HamlFileGetLocalizedPathWithLocaleMap", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p2,
            pathName: "./ruby/foo.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        expect(h.getLocalizedPath("fr-FR")).toBe("ruby/foo.fr.html.haml");
    });
    test("HamlFileGetLocalizedPathWithImproperSuffix", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should attempt to read the file and not fail
        expect(h.getLocalizedPath("fr-FR")).toBe("ruby/foo.fr-FR.haml");
    });
    test("HamlFileLocalize", function() {
        expect.assertions(2);
        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        expect(h).toBeTruthy();
        // should read the file
        h.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Calculate ROI for'),
            source: "Calculate ROI for",
            sourceLocale: "en-US",
            target: 'Calculer le ROI pour',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Type your organization\'s own values to estimate your ROI'),
            source: "Type your organization's own values to estimate your ROI",
            sourceLocale: "en-US",
            target: 'Tapez les valeurs propres de votre organisation pour estimer votre ROI',
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Reset values'),
            source: "Reset values",
            sourceLocale: "en-US",
            target: "Réinitialiser les valeurs",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Assumptions'),
            source: "Assumptions",
            sourceLocale: "en-US",
            target: "Hypothèses",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: h.makeKey('Return on investment'),
            source: "Return on investment",
            sourceLocale: "en-US",
            target: "Retour sur investissement",
            targetLocale: "fr-FR",
            datatype: hft.datatype,
            origin: "target"
        }));
        h.localize(translations, ["fr-FR"]);
        // now make sure the file was written out
        expect(fs.existsSync("./testfiles/ruby/t2.fr-FR.html.haml")).toBeTruthy();
    });
});
