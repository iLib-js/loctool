/*
 * testHamlFile.js - test the Haml file handler object.
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
    }
    var min = Math.min(a.length, b.length);
    
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
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

var hft = new HamlFileType(p);

module.exports = {
    testHamlFileConstructor: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.ok(h);
        
        test.done();
    },
    
    testHamlFileConstructorParams: function(test) {
        test.expect(1);

        var h = new HamlFile({
            project: p,
            pathName: "./testfiles/ruby/t2.html.haml",
            type: hft
        });
        
        test.ok(h);
        
        test.done();
    },

    testHamlFileConstructorNoFile: function(test) {
        test.expect(1);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        test.done();
    },

    testHamlFileEscapeSimple: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("This is text & more."), "This is text &amp; more.");
        
        test.done();
    },

    testHamlFileEscapeMultipleAnds: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("This & that is text & more."), "This &amp; that is text &amp; more.");
        
        test.done();
    },

    testHamlFileEscapeWithEmbeddedRuby: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("This is text #{and} more."), "This is text #{and} more.");
        
        test.done();
    },

    testHamlFileEscapeWithEmbeddedRubyNoEscape: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("This is text #{person&.name} more."), "This is text #{person&.name} more.");
        
        test.done();
    },

    testHamlFileEscapeWithAndsAndEmbeddedRubyNoEscape: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("This & that is text #{person&.name} more."), "This &amp; that is text #{person&.name} more.");
        
        test.done();
    },

    testHamlFileEscapeWithAndsAndEmbeddedRubyMultipleNoEscape: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("requested topic: #{@topic_requested&.id}, topic: #{@topic&.id} test"), "requested topic: #{@topic_requested&.id}, topic: #{@topic&.id} test");
        
        test.done();
    },

    testHamlFileEscapeWithAndsAndEmbeddedRubyMultipleNoEscapeEndingInRuby: function(test) {
        test.expect(1);

        test.equal(HamlFile.escape("requested topic: #{@topic_requested&.id}, topic: #{@topic&.id}"), "requested topic: #{@topic_requested&.id}, topic: #{@topic&.id}");
        
        test.done();
    },

    testHamlFileMakeKey: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        test.equal(h.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testHamlFileMakeKeySimpleTexts1: function(test) {
        test.expect(5);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("Preferences in your profile"), "r372802078");
        test.equals(h.makeKey("All settings"), "r725930887");
        test.equals(h.makeKey("Colour scheme"), "r734599412");
        test.equals(h.makeKey("Experts"), "r343852585");
        
        test.done();
    },

    testHamlFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(h.makeKey("\\n \\t bar"), "r755240053");
        test.equals(h.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
        test.equals(h.makeKey("\\'Dude\\'"), "r6259609");
        
        test.done();
    },

    testHamlFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("Procedures"), "r807691021");
        test.equals(h.makeKey("Mobile Apps"), "r898923204");
        test.equals(h.makeKey("Settings in your profile"), "r618035987");
        test.equals(h.makeKey("Product Reviews"), "r175350918");
        test.equals(h.makeKey("Answers"), "r221604632");
        
        test.done();
    },

    testHamlFileMakeKeySimpleTexts3: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("Private Profile"), "r314592735");
        test.equals(h.makeKey("People you are connected to"), "r711926199");
        test.equals(h.makeKey("Notifications"), "r284964820");
        test.equals(h.makeKey("News"), "r613036745");
        test.equals(h.makeKey("More Tips"), "r216617786");
        test.equals(h.makeKey("Filters"), "r81370429");
        test.equals(h.makeKey("Referral Link"), "r140625167");
        test.equals(h.makeKey("Questions"), "r256277957");
        
        test.done();
    },

    testHamlFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("Can\'t find id"), "r743945592");
        test.equals(h.makeKey("Can\'t find an application for SMS"), "r909283218");
        
        test.done();
    },
    
    testHamlFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equals(h.makeKey("{name}({generic_name})"), "r300446104");
        test.equals(h.makeKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(h.makeKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(h.makeKey("Grow your Network"), "r895214324");
        test.equals(h.makeKey("Failed to send connection request!"), "r1015770123");
        test.equals(h.makeKey("{goal_name} Goals"), "r993422001");
        test.equals(h.makeKey("Connection link copied!"), "r180897411");
        
        test.done();
    },

    testHamlFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        test.equal(h.makeKey("This is a test"), "r654479252");
        test.equal(h.makeKey("This is a test"), "r654479252");
        
        test.done();
    },
    
    testHamlFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        test.equal(h.makeKey("Can\'t find  id"), "r743945592");
        test.equal(h.makeKey("Can\'t    find               id"), "r743945592");
        
        test.equal(h.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(h.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");
        
        test.done();
    },
    
    testHamlFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

        test.equal(h.makeKey("Can\'t find  id"), "r743945592");
        test.equal(h.makeKey("      Can\'t find  id "), "r743945592");
        
        test.equal(h.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(h.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

        test.done();
    },
    
    testHamlFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \n B"), "r191336864");
        
        test.done();
    },

    testHamlFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \\n B"), "r191336864");
        
        test.done();
    },

    testHamlFileMakeKeyTabs: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("A \t B"), "r191336864");
        
        test.done();
    },

    testHamlFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("A \\t B"), "r191336864");
        
        test.done();
    },

    testHamlFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("A \\'B\\' C"), "r935639115");
        
        test.done();
    },

    testHamlFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("\\u00A0 \\u0023"), "r2293235");
        
        test.done();
    },

    testHamlFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("\u00a0 text\u00a0chat"), "r87956021");
        
        test.done();
    },

    testHamlFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

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
        
        test.done();
    },

    testHamlFileMakeKeyCheckRubyCompatibilitySpecialChars: function(test) {
        test.expect(2);

        var hf = new HamlFile({
            project: p
        });
        test.ok(hf);

        test.equals(hf.makeKey("Foo\u2028 24/7 bar"), "r102490768");
        
        test.done();
    },

    testHamlFileFindMatchingOneLine: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar{ {} {{{}}}}  asdf\n"];
        h.currentLine = 0;
        
        test.equal(h.findMatchingBrackets(11), 22);
        test.equal(h.currentLine, 0);
        
        test.done();
    },
    
    testHamlFileFindMatchingMixedBrackets: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar{ [] <()>]]}  asdf"];
        h.currentLine = 0;
        
        test.equal(h.findMatchingBrackets(11), 22);
        test.equal(h.currentLine, 0);

        test.done();
    },

    testHamlFileFindMatchingParens: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = 'bar')  asdf"];
        h.currentLine = 0;
        
        test.equal(h.findMatchingBrackets(11), 23);
        test.equal(h.currentLine, 0);
        
        test.done();
    },

    testHamlFileFindMatchingParensMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = ('bar'))  "];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(11), 25);
        test.equal(h.currentLine, 0);

        test.done();
    },

    testHamlFileFindMatchingSquareBrackets: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = 'bar']  "];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(11), 23);
        test.equal(h.currentLine, 0);

        test.done();
    },

    testHamlFileFindMatchingSquareBracketsMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = ['bar']]  "];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(11), 25);
        test.equal(h.currentLine, 0);

        test.done();
    },

    testHamlFileFindMatchingMultipleLines: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf}"
        ];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(11), 21);
        test.equal(h.currentLine, 1);

        test.done();
    },

    testHamlFileFindMatchingMultipleLinesTrailingTextIsIgnored: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text"
        ];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(11), 21);
        test.equal(h.currentLine, 1);

        test.done();
    },

    testHamlFileFindMatchingMultipleLinesWithStartIndex0: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text",
            "   .class.otherclass{asdf}"
        ];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(0), 21);
        test.equal(h.currentLine, 1);

        test.done();
    },

    testHamlFileFindMatchingMultipleLinesWithStartIndex57: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
            "   %foo.bar{ {asdf{",
            "     asdf} asdf} asdf} trailing text",
            "   .class.otherclass{asdf}"
        ];
        h.currentLine = 2;

        test.equal(h.findMatchingBrackets(4), 25);
        test.equal(h.currentLine, 2);

        test.done();
    },

    testHamlFileFindMatchingNoSpaces: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
            '  %span{:itemprop=>"author"}= this_friend.friend? ? (link_to(this_friend.to_s,friend_path(this_friend))) : this_friend.profile_name\n'
        ];
        h.currentLine = 0;

        test.equal(h.findMatchingBrackets(2), 27);
        test.equal(h.currentLine, 0);

        test.done();
    },

    testHamlFileIndentationTabs: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.equal(h.indentation(
            "\t\t%foo.bar{ {asdf{\n", 0), 2);

        test.done();
    },

    testHamlFileIndentationSkipReturn: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.equal(h.indentation(
            "   %foo.bar{ {asdf{\n" +
            "     asdf} asdf} asdf} trailing text\n" +
            "   .class.otherclass {asdf} \n", 57), 3);

        test.done();
    },

    testHamlFileFindMatchingIndentSame: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "   d",
            "   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 2);

        test.done();
    },

    testHamlFileFindMatchingIndentLess: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            " d",
            "   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 2);

        test.done();
    },

    testHamlFileFindMatchingIndentMore: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "       d",
            "   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 3);

        test.done();
    },

    testHamlFileFindMatchingIndentNoneToEnd: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "   a",
            "     b",
            "     c",
            "       d"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 3);

        test.done();
    },

    testHamlFileFindMatchingIndentNone: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "   a",
            "   b",
            "   c",
            "       d"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 0);

        test.done();
    },

    testHamlFileFindMatchingIndentSkipBlankLines: function(test) {
        test.expect(1);

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
        
        test.equal(h.findMatchingIndent(), 5);

        test.done();
    },

    testHamlFileFindMatchingIndentIncludeBlankLinesAtTheEnd: function(test) {
        test.expect(1);

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
        
        test.equal(h.findMatchingIndent(), 4);

        test.done();
    },

    testHamlFileFirstLocalizable: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 5);

        test.done();
    },

    testHamlFileFirstLocalizableNoIndent: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "%p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(0), 3);

        test.done();
    },

    testHamlFileFirstLocalizableSkipSpaces: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 7);

        test.done();
    },
    
    testHamlFileFirstLocalizableSkipAttr: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'} This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 16);

        test.done();
    },

    testHamlFileFirstLocalizableSkipAttrAndWhitespace: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'}   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 18);

        test.done();
    },

    testHamlFileFirstLocalizableSkipSuffixes: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 8);

        test.done();
    },

    testHamlFileFirstLocalizableSkipSuffixesEqual: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p= This is not a string but ruby code instead\n"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 6);

        test.done();
    },

    testHamlFileFirstLocalizableSkipAttrsAndSuffixes: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
            "  %p{:a => 'b'}<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 19);

        test.done();
    },
    
    testHamlFileConvertTagSimple: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %b testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b>");
        
        test.done();
    },

    testHamlFileConvertTagOneAttr: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %b{ :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagOneAttrColons: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %b{ class: 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagWithSlashSuffix: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %br/ testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<br/>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs2: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %p{ :id => 'newpara2', :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs2Colons: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %p{id: 'newpara2', class : 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs3: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %p{ :id => 'newpara2', :name=>\"asdf\", :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' name=\"asdf\" class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs3Colons: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["  %p{id: 'newpara2', name:\"asdf\", class : 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' name=\"asdf\" class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagAttrsAndClass: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ['  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<a class=\"data icon\" href=\"/pages/contact_us\">");
        
        test.done();
    },

    testHamlFileConvertTagId: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ['  %span#data-part non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<span id=\"data-part\">");
        
        test.done();
    },

    testHamlFileConvertTagIdAndClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ['  %span#data-part.foo.bar non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), '<span id=\"data-part\" class="foo bar">');
        
        test.done();
    },

    testHamlFileConvertTagIdAndClassesAndAttrs: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ['  %span#data-asdf.foo.bar{:precision => "2"} non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), '<span id=\"data-asdf\" class="foo bar" precision="2">');
        
        test.done();
    },

    testHamlFileDontConvertTagWithNonAttrs: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.lines = ["    %span.text{:class=>page=='smile' ? 'active' : 'hidden'} &#8250; Smile\n"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), '');
        
        test.done();
    },

    testHamlFileParseTextSimple: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextMultiLine: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  This is more text at the same indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at the same indentation level.");
        test.equal(r.getKey(), "r130670021");
        
        test.done();
    },

    testHamlFileParseTextMultiLineDifferentLevelOutdent: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test\n' +
                'This is more text at a different indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is more text at a different indentation level.");
        test.equal(r.getKey(), "r464867050");
        
        test.done();
    },

    testHamlFileParseTextMultiLineDifferentLevelIndent: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '    This is more text at a different indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at a different indentation level.");
        test.equal(r.getKey(), "r783876767");

        test.done();
    },

    testHamlFileParseTextBlankIndentedLineSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test\n' +
                '  \n' +
                '  This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

        test.done();
    },

    testHamlFileParseTextCompletelyBlankLineSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test\n' +
                '\n' +
                '  This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

        test.done();
    },

    testHamlFileParseTextBlankMoreIndentedLineAlsoSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test\n' +
                '    \n' +
                '    This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

        test.done();
    },

    testHamlFileParseTextEmbeddedHTML: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is <span class="foo">a test</a> for the ages.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'This is <span class="foo">a test</a> for the ages.');
        test.equal(r.getKey(), "r533194803");

        test.done();
    },

    testHamlFileParseTextEmbeddedRuby: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  There are #{group.count(:friend).uniq} friends.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'There are #{group.count(:friend).uniq} friends.');
        test.equal(r.getKey(), "r858463218");

        test.done();
    },

    testHamlFileParseTextEmbeddedRubyWithAmpersand: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  There are #{group.count(:friend)&.uniq} friends.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'There are #{group.count(:friend)&.uniq} friends.');
        test.equal(r.getKey(), "r672148600");

        test.done();
    },

    testHamlFileParseTextWithCSSClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  .fg-bold.fg-test This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTags: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %p This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsMultiline: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %p This is a test.\n' +   // text wrapped in a div
                '  This is more text at the same indentation level.\n');  // should be a separate string
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is more text at the same indentation level.");
        test.equal(r.getKey(), "r467961626");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithAttributes: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %a{:href=>"/pages/contact_us"} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithNestedAttributes: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('    %a.apply_btn.green.btn{:href=>"#{job[\'url\']}", :target=>\'_blank\'} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithAttributesAndClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %a.data.icon{:href=>"/pages/contact_us"} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },
    
    testHamlFileParseTextWithHTMLNonBreakingTags: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test of\n' +
                '  %b bold text\n' + 
                '  embedded in the sentence.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test of <b>bold text</b> embedded in the sentence.");
        test.equal(r.getKey(), "r425499692");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLNonBreakingTagsWithAttributesAndClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test of the\n' +
                '  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
                '  tags.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'This is a test of the <a class="data icon" href="/pages/contact_us">non-breaking</a> tags.');
        test.equal(r.getKey(), "r198921042");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLNonBreakingTagsWithNonAttributes: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        // the code in the attributes disqualifies it from being converted into a <span> tag in line
        h.parse("    Mission\n" +
                "    %span.text{:class=>page=='smile' ? 'active' : 'hidden'} &#8250; Smile\n" +
                "    %span.text{:class=>page=='thanks' ? 'active' : 'hidden'} &#8250; Thanks, Friend!\n");
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'Mission');
        test.equal(r.getKey(), "r642046153");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), '&#8250; Smile');
        test.equal(r.getKey(), "r238348915");
        
        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), '&#8250; Thanks, Friend!');
        test.equal(r.getKey(), "r88865504");
        
        test.done();
    },
 
    


    testHamlFileParseTextWithHTMLBreakingTags: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  %div A different string.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStrings: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  %p\n' +
                '    A different string.\n' + 
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsSameLineContinued: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  %p A different string.\n' + 
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsContinuedMultiple: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  %p\n' +
                '    A different string.\n' + 
                '    Another string.\n' +
                '    Yet another string.\n' +
                '  Not indented.');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string. Another string. Yet another string.");
        test.equal(r.getKey(), "r983432399");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsSameLineNotContinued: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  %p A different string.\n' + 
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithTripleBang: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('!!! Frameset\n' +
                'This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithTripleBangAlone: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('!!!\n' +
                'This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithSingleBang: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('! Frameset\n' +
                'This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "! Frameset This is a test");
        test.equal(r.getKey(), "r414916314");
        
        test.done();
    },

    testHamlFileParseSkipScriptBlocks: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  :ruby\n' + 
                '     Rb.t("Not indented.);\n' +
                '     = asdf asdfasdf\n' + 
                '     Skip this string.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
                
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },
    
    testHamlFileParseTextWithClasses: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '    .a.b A different string.\n' +   // this is a div
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithClassesSameIndent: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  .a.b A different string.\n' +    // this is a div
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHashIdDiv: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  #abc A different string.\n' +    // this is a div with an id
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHashIdDivWithAttrs: function(test) {
        test.expect(12);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  #abc{a: "b", c: "d"} A different string.\n' +    // this is a div with an id and attributes
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHashSubstitutionAtBeginningOfTheLine: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  This is a test.\n' +
                '  #{abc} A different string.\n' +    // this is NOT a div but a hash substitution instead
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. #{abc} A different string. Not indented.");
        test.equal(r.getKey(), "r356714989");
        
        test.done();
    },

    testHamlFileParseTextWithHtmlComments: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  / This is a test.\n' +
                '  / A different string.\n' +    // this is a comment
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHamlComments: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  -# This is a test.\n' +
                '  -# A different string.\n' +    // this is a comment
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHamlCommentsWithSpaces: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  - # This is a test.\n' +
                '  - # A different string.\n' +    // this is a comment
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHtmlCommentsIndented: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  / This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHamlCommentsIndented: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  -# This is a test.\n' +
                '    This indented string is still within the comment.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  = This is a test.\n' +
                '  = This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithRubyCodeWithIndentedContents: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  = This is a test.\n' +
                '  = This indented string is still within the ruby code.\n' +
                '    Indented text.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Indented text.");
        test.equal(r.getKey(), "r899620093");

        test.done();
    },

    testHamlFileParseTextWithHtmlSafeRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  &= This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextThatStartsWithAnEntity: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        // do not treat this as a html-safe ruby code
        h.parse('  &amp; This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "& This is a test.");
        test.equal(r.getKey(), "r470281808");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextThatStartsWithAnExclamationMark: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        // do not treat this as a html-safe ruby code
        h.parse('  ! This is a test.\n' +
                '  &= This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "! This is a test.");
        test.equal(r.getKey(), "r495928089");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithNotHtmlSafeRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  != This is a test.\n' +
                '  != This indented string is still within the ruby code.\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextSkipRubyCommands: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('- paragraphs = ["Dear #{@friend.to_s(true, true)},"] \n' +
                '- if @friend.isActive?\n' +
                '  Positive.\n' +
                '- else\n' +
                '  Negative.\n' +
                '- endif\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Positive.");
        test.equal(r.getKey(), "r389103942");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Negative.");
        test.equal(r.getKey(), "r1006126501");

        test.done();
    },

    testHamlFileParseTextRubyCommandsBracketsNotMatchedAtEOL: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('- paragraphs = ["Dear #{@friend.to_s(true, true)},", \n' +
                '  "Thank you for committing to volunteer","Your time will help hundreds rebuild their lives after the deadly hurricanes. Call #{@support_phone} for more info."]\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithMultilineRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('= func(                         |\n' +
                '  "I think this might get " +   |\n' +
                '  "pretty long so I should " +  |\n' +
                '  "probably make it " +         |\n' +
                '  "multiline so it doesn\'t " + |\n' +
                '  "look awful.")                |\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%p= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagComplicatedWithSuffixEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagComplicatedWithMultipleSuffixesAndEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagComplicatedWithNoSpaceAndEqualsSuffix: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%span{:itemprop=>"author"}= this_friend.friend? ? (link_to(this_friend.to_s,friend_path(this_friend))) : this_friend.profile_name\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },
    
    testHamlFileParseTextTagWithSuffixSlash: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}/ This is a test.\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixLT: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}< This is a test.\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixGT: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}> This is a test.\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixMultiple: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}<> This is a test.\n' +
                'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextIgnoreOnlyHashRuby: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} #{this should be ignored}\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextIgnoreOnlyHtml: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} <img src="http://some.com/url/here" />\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextIgnoreOnlyNonText: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} .,$#$@%\n' +
                '  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },


    testHamlFileParseTextDoNotIncludeOutdentedNonBreakingTags: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('            Message\n' +
                '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
                '            %span.check_icon\n' +
                '            Recommend\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Message");
        test.equal(r.getKey(), "r727846503");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Recommend");
        test.equal(r.getKey(), "r108032100");

        test.done();
    },

    testHamlFileParseTextWrapNonBreakingTagContentsProperly: function(test) {
        test.expect(9);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('          Message\n' +
                '          %a.btn.grey.recommend_friend{:href=>"/recommend/#{@friend.id}"}\n' +
                '            %span.check_icon\n' +
                '            Recommend\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'Message');
        test.equal(r.getKey(), "r727846503");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), 'Recommend');
        test.equal(r.getKey(), "r108032100");

        test.done();
    },

    testHamlFileParseTextConvertHTMLEntities: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        h.parse('  Read more&nbsp;&rsaquo;\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'Read more ›');
        test.equal(r.getKey(), "r818505217");

        test.done();
    },
    
    

    testHamlFileAssembleTranslation: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationWithEmbeddedTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationWithEmbeddedTagsOnTheSameLine: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationModernTranslationIsCorrect: function(test) {
        test.expect(5);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        
        var key = h.makeKey(segment.text);
        var resource = hft.modern.getClean(ResourceString.cleanHashKey("webapp", "fr-FR", key, "x-haml"));
        test.ok(resource);

        test.equal(resource.getTarget(), expected);
        test.equal(resource.reskey, key);
        
        test.done();
    },

    testHamlFileAssembleTranslationWithEmbeddedEntities: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationWithEmbeddedTagsMissingStrings: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationMissingStringsGivesPartialOutput: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },



    testHamlFileAssembleTranslationModernTranslationsUpdated: function(test) {
        test.expect(3);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.ok(resource);
        
        diff(resource.getTarget(), expected);
        test.equal(resource.getTarget(), expected);
        
        test.done();
    },

    testHamlFileAssembleTranslationMissingStringsInModernTranslation: function(test) {
        test.expect(4);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        hft.modern.clear();
        test.equal(hft.modern.size(), 0);
        
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
        test.ok(resource);
        
        diff(resource.getTarget(), expected);
        test.equal(resource.getTarget(), expected);
        
        test.done();
    },


    testHamlFileLocalizeText: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithIdentify: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: pi, // project with identify set to true
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },


    testHamlFileLocalizeTextLowerIndentLevel: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

   
    testHamlFileLocalizeTextEmbeddedHTML: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithCSSClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithCSSClassesAndIdentify: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: pi, // project with identify set to true
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTagsSameIndent: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTagsWithAttrs: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },
    
    testHamlFileLocalizeTextWithNonBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithNonBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithNonBreakingHTMLTagsButNoContentOnSameLine: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLIndentedStringsContinuedMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLNotIndentedStrings: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithRubySubstitutions: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithRubySubstitutionsAvoidEscapingInRubyParts: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithTripleBang: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithTripleBangAlone: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithDoubleBang: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSingleBang: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipScriptBlocks: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextDontSkipInsideDashCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHtmlComments: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlComments: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHtmlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHtmlSafeRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithNotHtmlSafeRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithMultilineRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextComplicatedWithSuffixEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextComplicatedWithMultipleSuffixesAndEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixSlash: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixSlashNonBreakingTag: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextEscapeHTML: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextTagWithSuffixLT: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextTagWithSuffixMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextCorrectIndentationAfterBlankLines: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);

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
        test.equal(actual, expected);
        test.done();
    },
    
    testHamlFileLocalizeTextNewResIsCorrect: function(test) {
        test.expect(8);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        hft.newres.clear();
        test.equal(hft.newres.size(), 0);

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
        test.equal(actual, expected);

        test.equal(hft.newres.size(), 1);
        
        var resource = hft.newres.getClean(
            ResourceString.cleanHashKey(
                    p.getProjectId(), "fr-FR", h.makeKey("Type your organization's own values to estimate your ROI"), "x-haml"));
        
        test.ok(resource);
        test.equal(resource.getSource(), "Type your organization's own values to estimate your ROI");
        test.equal(resource.getTarget(), "Type your organization's own values to estimate your ROI");
        test.equal(resource.getTargetLocale(), "fr-FR");

        test.done();
    },


    testHamlFileExtractFile: function(test) {
        test.expect(8);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 9);
        
        var r = set.getBySource("Type your organization's own values to estimate your ROI");
        test.ok(r);
        test.equal(r.getSource(), "Type your organization's own values to estimate your ROI");
        test.equal(r.getKey(), "r64223466");
        
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r251869351", "x-haml"));
        test.ok(r);
        test.equal(r.getSource(), "Annual gross savings");
        test.equal(r.getKey(), "r251869351");
        
        test.done();
    },

    testHamlFileExtractFileNoRubyStringsExtracted: function(test) {
        test.expect(6);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 9);
        
        // "Size of organization"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "x-haml"));
        test.ok(!r);
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "ruby"));
        test.ok(!r);
        
        // "Average cost of ER visit"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "x-haml"));
        test.ok(!r);
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "ruby"));
        test.ok(!r);
        
        test.done();
    },

    testHamlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            type: hft
        });
        test.ok(h);
        
        // should attempt to read the file and not fail
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHamlFileExtractBogusFile: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.html.haml",
            type: hft
        });
        test.ok(h);
        
        // should attempt to read the file and not fail
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHamlFileGetLocalizedPath: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            pathName: "foo.html.haml",
            type: hft
        });
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "foo.fr-FR.html.haml");

        test.done();
    },

    testHamlFileGetLocalizedPathWithDir: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.html.haml",
            type: hft
        });
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "ruby/foo.fr-FR.html.haml");

        test.done();
    },

    testHamlFileGetLocalizedPathWithImproperSuffix: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/foo.haml",
            type: hft
        });
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "ruby/foo.fr-FR.haml");

        test.done();
    },

    testHamlFileLocalize: function(test) {
        test.expect(2);

        var h = new HamlFile({
            project: p,
            pathName: "./ruby/t2.html.haml",
            type: hft
        });
        test.ok(h);
        
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
        
        test.ok(fs.existsSync("./testfiles/ruby/t2.fr-FR.html.haml"));
        
        test.done();
    }
};
