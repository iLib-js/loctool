/*
 * testMarkdownFile.js - test the Markdown file handler object.
 *
 * Copyright © 2018, Box, Inc.
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

var path = require("path");
var fs = require("fs");

if (!MarkdownFile) {
    var MarkdownFile = require("../lib/MarkdownFile.js");
    var MarkdownFileType = require("../lib/MarkdownFileType.js");

    var WebProject =  require("../lib/WebProject.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

function diff(a, b) {
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
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    targetDir: "testfiles"
});

var mdft = new MarkdownFileType(p);

module.exports.markdown = {
    testMarkdownFileConstructor: function(test) {
        test.expect(1);

        var htf = new MarkdownFile();
        test.ok(htf);

        test.done();
    },

    testMarkdownFileConstructorParams: function(test) {
        test.expect(1);

        var htf = new MarkdownFile(p, "./testfiles/md/test1.md");

        test.ok(htf);

        test.done();
    },

    testMarkdownFileConstructorNoFile: function(test) {
        test.expect(1);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        test.done();
    },


    testMarkdownFileMakeKey: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testMarkdownFileMakeKeySimpleTexts1: function(test) {
        test.expect(5);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("Preferences in your profile"), "r372802078");
        test.equals(j.makeKey("All settings"), "r725930887");
        test.equals(j.makeKey("Colour scheme"), "r734599412");
        test.equals(j.makeKey("Experts"), "r343852585");

        test.done();
    },

    testMarkdownFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(j.makeKey("\\n \\t bar"), "r755240053");
        test.equals(j.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
        test.equals(j.makeKey("\\'Dude\\'"), "r6259609");

        test.done();
    },

    testMarkdownFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("Procedures"), "r807691021");
        test.equals(j.makeKey("Mobile Apps"), "r898923204");
        test.equals(j.makeKey("Settings in your profile"), "r618035987");
        test.equals(j.makeKey("Product Reviews"), "r175350918");
        test.equals(j.makeKey("Answers"), "r221604632");

        test.done();
    },

    testMarkdownFileMakeKeySimpleTexts3: function(test) {
        test.expect(9);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("Private Profile"), "r314592735");
        test.equals(j.makeKey("People you are connected to"), "r711926199");
        test.equals(j.makeKey("Notifications"), "r284964820");
        test.equals(j.makeKey("News"), "r613036745");
        test.equals(j.makeKey("More Tips"), "r216617786");
        test.equals(j.makeKey("Filters"), "r81370429");
        test.equals(j.makeKey("Referral Link"), "r140625167");
        test.equals(j.makeKey("Questions"), "r256277957");

        test.done();
    },

    testMarkdownFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("Can\'t find id"), "r743945592");
        test.equals(j.makeKey("Can\'t find an application for SMS"), "r909283218");

        test.done();
    },

    testMarkdownFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equals(j.makeKey("{name}({generic_name})"), "r300446104");
        test.equals(j.makeKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(j.makeKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(j.makeKey("Grow your Network"), "r895214324");
        test.equals(j.makeKey("Failed to send connection request!"), "r1015770123");
        test.equals(j.makeKey("{goal_name} Goals"), "r993422001");
        test.equals(j.makeKey("Connection link copied!"), "r180897411");

        test.done();
    },

    testMarkdownFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("This is a test"), "r654479252");
        test.equal(mdf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testMarkdownFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("Can\'t find  id"), "r743945592");
        test.equal(mdf.makeKey("Can\'t    find               id"), "r743945592");

        test.equal(mdf.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(mdf.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");

        test.done();
    },

    testMarkdownFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("Can\'t find  id"), "r743945592");
        test.equal(mdf.makeKey("      Can\'t find  id "), "r743945592");

        test.equal(mdf.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(mdf.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

        test.done();
    },

    testMarkdownFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equal(mdf.makeKey("A \n B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equal(mdf.makeKey("A \\n B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyTabs: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("A \t B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("A \\t B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("A \\'B\\' C"), "r935639115");

        test.done();
    },

    testMarkdownFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("\\u00A0 \\u0023"), "r2293235");

        test.done();
    },

    testMarkdownFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat"), "r969175354");

        test.done();
    },

    testMarkdownFileMakeKeyInterpretEscapedOctalChars: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("A \\40 \\011 B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyJavaEscapeSequences: function(test) {
        test.expect(2);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("A \\b\\t\\n\\f\\r B"), "r191336864");

        test.done();
    },

    testMarkdownFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var mdf = new MarkdownFile(p, undefined, mdft);
        test.ok(mdf);

        test.equal(mdf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equal(mdf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equal(mdf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equal(mdf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equal(mdf.makeKey("This is a double quoted string"), "r494590307");
        test.equal(mdf.makeKey('This is a single quoted string'), "r683276274");
        test.equal(mdf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equal(mdf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equal(mdf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equal(mdf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equal(mdf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equal(mdf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");

        test.done();
    },

    testMarkdownFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test\n\nThis is a test too\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "This is a test", "html"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testMarkdownFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test\n\nThis is a test too\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testMarkdownFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test            \t   \t     \n\nThis is a test too\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testMarkdownFileParseDontExtractUnicodeWhitespace: function(test) {
        test.expect(3);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('            ​‌‍ \n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testMarkdownFileParseDontExtractNbspEntity: function(test) {
        test.expect(3);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('&nbsp; &nnbsp; &mmsp;\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testMarkdownFileParseDoExtractOtherEntities: function(test) {
        test.expect(3);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('&uuml;\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testMarkdownFileParseNoStrings: function(test) {
        test.expect(3);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('---\ntitle: "foo"\nexcerpt: ""\n---\n\n');

        var set = htf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);

        test.done();
    },

    testMarkdownFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        var set = htf.getTranslationSet();
        test.equal(set.size(), 0);

        htf.parse('This is a test\n\n');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testMarkdownFileParseMultiple: function(test) {
        test.expect(8);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test\n\n' +
                  'This is also a test\n');

        var set = htf.getTranslationSet();
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

    testMarkdownFileParseContinuedParagraph: function(test) {
        test.expect(9);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test.\n' +
                  'This is also a test.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test. This is also a test.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test. This is also a test.");
        test.equal(r.getKey(), "r770271164");

        r = set.getBySource("This is a test.");
        test.ok(!r);

        r = set.getBySource("This is also a test.");
        test.ok(!r);

        test.done();
    },


    testMarkdownFileParseWithDups: function(test) {
        test.expect(6);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test\n\n' +
                  'This is also a test\n\n' +
                  'This is a test\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 2);

        test.done();
    },

    testMarkdownFileParseEscapeInvalidChars: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is also a &#x3; test\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a &#3; test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a &#3; test");
        test.equal(r.getKey(), "");

        test.done();
    },

    testMarkdownFileParseDontEscapeWhitespaceChars: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is also a &#x000C; test\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // leave the whitespace control chars alone
        var r = set.getBySource("This is also a &#x000C; test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a &#x000C; test");
        test.equal(r.getKey(), "");

        test.done();
    },

    testMarkdownFileSkipReadmeIOBlocks: function(test) {
        test.expect(8);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test\n' +
                  '[block:parameters]\n' +
                  '{\n' +
                  '  "data": {\n' +
                  '      "h-0": "Parameter",\n' +
                  '      "h-1": "Description",\n' +
                  '      "0-0": "**response_type**",\n' +
                  '      "1-0": "**client_id**",\n' +
                  '      "2-0": "**redirect_uri**",\n' +
                  '      "3-0": "**state**",\n' +
                  '      "4-0": "**scope** *optional*",\n' +
                  '      "0-1": "String",\n' +
                  '      "1-1": "String",\n' +
                  '      "2-1": "URI"\n' +
                  '  }\n' +
                  '}\n' +
                  '[/block]\n' +
                  'bar\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = set.getBySource("Description");
        test.ok(!r);

        var r = set.getBySource("bar");
        test.ok(r);

        test.equal(set.size(), 2);

        test.done();
    },

    testMarkdownFileParseNonBreakingEmphasis: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a *test* of the emergency parsing system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <c0>test</c0> of the emergency parsing system.");
        test.equal(r.getKey(), "r306365966");

        test.done();
    },

    testMarkdownFileParseNestedNonBreakingEmphasis: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This _is a *test* of the emergency parsing_ system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        test.ok(r);
        test.equal(r.getSource(), "This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        test.equal(r.getKey(), "r96403243");

        test.done();
    },

    testMarkdownFileParseNestedAndSequentialNonBreakingEmphasis: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This _is a *test* of the_ *emergency parsing* system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        test.ok(r);
        test.equal(r.getSource(), "This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        test.equal(r.getKey(), "r456647808");

        test.done();
    },

    testMarkdownFileParseNonBreakingLinks: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a test of the [emergency parsing system](http://foo.com/bar/asdf.html).\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test of the <c0>emergency parsing system</c0>.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the <c0>emergency parsing system</c0>.");
        test.equal(r.getKey(), "r34753043");

        test.done();
    },

    testMarkdownFileParseNonBreakingHTMLTags: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is a <em>test</em> of the emergency parsing system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <c0>test</c0> of the emergency parsing system.");
        test.equal(r.getKey(), "r306365966");

        test.done();
    },

    testMarkdownFileParseNonBreakingHTMLTagsOutside: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<em>This is a test of the emergency parsing system.</em>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");

        test.done();
    },

    testMarkdownFileParseNonBreakingEmphasisOutside: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('*This is a test of the emergency parsing system.*\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");

        test.done();
    },

    testMarkdownFileParseNonBreakingHTMLTagsInside: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should pick up the span tag because there is localizable text
        // before it and after it
        var r = set.getBySource('This is <c0> a test of the emergency parsing </c0> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the emergency parsing </c0> system.');
        test.equal(r.getKey(), 'r124733470');

        test.done();
    },

    testMarkdownFileParseNonBreakingHTMLTagsInsideMultiple: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // tags should be nestable
        var r = set.getBySource('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        test.equal(r.getKey(), 'r772812508');

        test.done();
    },

    testMarkdownFileParseNonBreakingTagsNotWellFormed: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        test.equal(r.getKey(), 'r417724998');

        test.done();
    },

    testMarkdownFileParseNonBreakingTagsTagStackIsReset: function(test) {
        test.expect(5);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing</em> system.</div>\n\n' +
                  'This is <b>another test</b> of the emergency parsing </span> system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0>another test</c0> of the emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0>another test</c0> of the emergency parsing');
        test.equal(r.getKey(), 'r2117084');

        test.done();
    },

    testMarkdownFileParseLocalizableTitle: function(test) {
        test.expect(8);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<div title="This value is localizable">\n' +
                '  This is a test\n' +
                '</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.getBySource("This value is localizable");
        test.ok(r);
        test.equal(r.getSource(), "This value is localizable");
        test.equal(r.getKey(), "r922503175");

        test.done();
    },

    testMarkdownFileParseLocalizableAttributes: function(test) {
        test.expect(11);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<img src="http://www.test.test/foo.png" alt="Alternate text">\n' +
                'This is a test\n' +
                '<input type="text" placeholder="localizable placeholder here">\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.getBySource("Alternate text");
        test.ok(r);
        test.equal(r.getSource(), "Alternate text");
        test.equal(r.getKey(), "r1051764073");

        r = set.getBySource("localizable placeholder here");
        test.ok(r);
        test.equal(r.getSource(), "localizable placeholder here");
        test.equal(r.getKey(), "r734414247");

        test.done();
    },

    testMarkdownFileParseLocalizableAttributesSkipEmpty: function(test) {
        test.expect(6);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<img src="http://www.test.test/foo.png" alt="">\n' +
                '       This is a test\n' +
                '<input type="text" placeholder="">\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testMarkdownFileParseLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(8);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('This is <c0>a test</c0> of non-breaking tags.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0>a test</c0> of non-breaking tags.');
        test.equal(r.getKey(), 'r1063253939');

        r = set.getBySource("localizable title");
        test.ok(r);
        test.equal(r.getSource(), "localizable title");
        test.equal(r.getKey(), "r160369622");

        test.done();
    },

    testMarkdownFileParseI18NComments: function(test) {
        test.expect(6);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<!-- i18n: this describes the text below -->\n' +
                'This is a test of the emergency parsing system.\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");
        test.equal(r.getComment(), "this describes the text below");

        test.done();
    },

    testMarkdownFileParseIgnoreTags: function(test) {
        test.expect(6);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html><body>\n' +
            '<script type="javascript">\n' +
            'if (window) {\n' +
            '  $(".foo").class("asdf");\n' +
            '}\n' +
            '</script>\n' +
            '<style>\n' +
            '  .activity_title{\n' +
            '    font-size: 18px;\n' +
            '    font-weight: 300;\n' +
            '    color: #777;\n' +
            '    line-height: 40px;\n' +
            '  }\n' +
            '</style>\n' +
            '<span class="foo">foo</span>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        var r = set.getBySource("foo");
        test.ok(r);
        test.equal(r.getSource(), "foo");
        test.equal(r.getKey(), "r941132140");

        test.done();
    },

    testMarkdownFileExtractFile: function(test) {
        test.expect(11);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/test1.md");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.ok(r);
        test.equal(r.getSource(), "This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.equal(r.getKey(), "r548615397");

        r = set.getBySource("This is some text. This is more text. Pretty, pretty text.");
        test.ok(r);
        test.equal(r.getSource(), "This is some text. This is more text. Pretty, pretty text.");
        test.equal(r.getKey(), "r777006502");

        r = set.getBySource("This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.ok(r);
        test.equal(r.getSource(), "This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.equal(r.getKey(), "r112215756");

        test.done();
    },

    testMarkdownFileExtractFile2: function(test) {
        test.expect(8);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/test2.md");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("This is text with a <c0>link</c0> in it.");
        test.ok(r);
        test.equal(r.getSource(), "This is text with a <c0>link</c0> in it.");
        test.equal(r.getKey(), "r717941707");


        r = set.getBySource("This is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.ok(r);
        test.equal(r.getSource(), "his is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        test.equal(r.getKey(), "r736057533");

        test.done();
    },

    testMarkdownFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p);
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMarkdownFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/bogus.md");
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMarkdownFileLocalizeText: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected = '<html><body>Ceci est un essai</body></html>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testMarkdownFileLocalizeTextPreserveWhitespace: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '<body>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '<body>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextPreserveSelfClosingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '<body>\n' +
                '     <div class="foo"/>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '<body>\n' +
            '     <div class="foo"/>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "This is also a test",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextWithDups: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "This is also a test",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '       Ceci est un essai\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextSkipScript: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <head>\n' +
                '   <script>\n' +
                '// comment text\n' +
                'if (locales.contains[thisLocale]) {\n' +
                '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
                '}\n' +
                '   </head>\n' +
                '   </script>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <head>\n' +
            '   <script>\n' +
            '// comment text\n' +
            'if (locales.contains[thisLocale]) {\n' +
            '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
            '}\n' +
            '   </head>\n' +
            '   </script>\n' +
            '   <body>\n' +
            '       Ceci est un essai\n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a<em>test</em>of the emergency parsing system.",
            source: "This is a<em>test</em>of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <em>essai</em> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <body>\n' +
            '       Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.  \n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTagsOutside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test of the emergency parsing system.",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <body>\n' +
            '       <span id="foo" class="bar">  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  </span>\n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTagsInside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is<span id="foo" class="bar">a test of the emergency parsing</span>system.',
            source: 'This is<span id="foo" class="bar">a test of the emergency parsing</span>system.',
            target: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>\n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTagsInsideMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is<span id="foo" class="bar">a test of the<em>emergency</em>parsing</span>system.',
            source: 'This is<span id="foo" class="bar">a test of the<em>emergency</em>parsing</span>system.',
            target: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTagsNotWellFormed: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is<span id="foo" class="bar">a test of the<em>emergency parsing</span>system.',
            source: 'This is<span id="foo" class="bar">a test of the<em>emergency parsing</span>system.',
            target: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</span>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is<span id="foo" class="bar">a test of the<em>emergency parsing',
            source: 'This is<span id="foo" class="bar">a test of the<em>emergency parsing',
            target: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       <div>Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique </div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextLocalizableTitle: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div title="This value is localizable">\n' +
                '           This is a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This value is localizable',
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is a test',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       <div title="Cette valeur est localisable">\n' +
                '           Ceci est un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextLocalizableAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="localizable placeholder here">\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Alternate text',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is a test',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'localizable placeholder here',
            source: 'localizable placeholder here',
            target: 'espace réservé localisable ici',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Texte alternative">\n' +
                '       Ceci est un essai\n' +
                '       <input type="text" placeholder="espace réservé localisable ici">\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is<a href="foo.html" title="{title}">a test</a>of non-breaking tags.',
            source: 'This is<a href="foo.html" title="{title}">a test</a>of non-breaking tags.',
            target: 'Ceci est <a href="foo.html" title="{title}">un essai</a> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'localizable title',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextI18NComments: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <!-- i18n: this describes the text below -->\n' +
                '       This is a test of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is a test of the emergency parsing system.',
            source: 'This is a test of the emergency parsing system.',
            target: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       \n' +
                '       Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  \n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testMarkdownFileLocalizeTextIdentifyResourceIds: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "This is also a test",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <span loclang="html" locid="This is a test">Ceci est un essai</span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" locid="This is also a test">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '       <span loclang="html" locid="This is a test">Ceci est un essai</span>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testMarkdownFileLocalizeTextIdentifyResourceIdsWithAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <area alt="placeholder text">This is a test</area>\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "placeholder text",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'This is a test',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "This is also a test",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <area alt="&lt;span loclang=&quot;html&quot; locid=&quot;placeholder text&quot;&gt;Texte de l&apos;espace réservé&lt;/span&gt;"><span loclang="html" locid="This is a test">Ceci est un essai</span></area>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" locid="This is also a test">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testMarkdownFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new MarkdownFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This <span title="placeholder text">is a test</span>\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "placeholder text",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'This<span title="{title}">is a test</span>',
            source: 'This<span title="{title}">is a test</span>',
            sourceLocale: "en-US",
            target: 'Ceci <span title="{title}">est un essai</span>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "This is also a test",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <span loclang="html" locid="This&lt;span title=&quot;{title}&quot;&gt;is a test&lt;/span&gt;">Ceci <span title="&lt;span loclang=&quot;html&quot; locid=&quot;placeholder text&quot;&gt;Texte de l&apos;espace réservé&lt;/span&gt;">est un essai</span></span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" locid="This is also a test">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testMarkdownFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p, "simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "simple.fr-FR.html");

        test.done();
    },

    testMarkdownFileGetLocalizedPathComplex: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p, "./asdf/bar/simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testMarkdownFileGetLocalizedPathRegularMarkdownFileName: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p, "./asdf/bar/simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testMarkdownFileGetLocalizedPathNotEnoughParts: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p, "./asdf/bar/simple");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR");

        test.done();
    },

    testMarkdownFileGetLocalizedSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new MarkdownFile(p, "./asdf/bar/simple.en-US.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testMarkdownFileLocalize: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/test1.md");
        test.ok(htf);

        // should read the file
        htf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        translations.add(new ResourceString({
            project: "webapp",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "fr-FR/md/test1.md")));
        test.ok(fs.existsSync(path.join(base, "de-DE/md/test1.md")));

        var content = fs.readFileSync(path.join(base, "fr-FR/md/test1.md"), "utf-8");

        var expected =
            '---\n' +
            'title: "This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself."\n' +
            'excerpt: ""\n' +
            '---\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '==================================\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n' +
            '\n' +
            '[block:code]\n' +
            '{\n' +
            '  "codes": [\n' +
            '    {\n' +
            '      "code": "https://account.box.com/api/oauth2/authorize?response_type=code&client_id=<MY_CLIENT_ID>&redirect_uri=<MY_REDIRECT_URL>&state=<MY_SECURITY_TOKEN>",\n' +
            '      "language": "text",\n' +
            '      "name": "Box authorize URL"\n' +
            '    }\n' +
            '  ]\n' +
            '}\n' +
            '[/block]\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '[block:parameters]\n' +
            '{\n' +
            '  "data": {\n' +
            '    "h-0": "Parameter",\n' +
            '    "h-1": "Description",\n' +
            '    "0-0": "**response_type**",\n' +
            '    "1-0": "**client_id**",\n' +
            '  },\n' +
            '  "cols": 3,\n' +
            '  "rows": 5\n' +
            '}\n' +
            '[/block]\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';

        diff(content, expected);
        test.equal(content, expected);

        var content = fs.readFileSync(path.join(base, "de-DE/md/test1.md"), "utf-8");

        var expected =
            '---\n' +
            'title: "This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself."\n' +
            'excerpt: ""\n' +
            '---\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '==================================\n' +
            '\n' +
            'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.\n' +
            '\n' +
            '[block:code]\n' +
            '{\n' +
            '  "codes": [\n' +
            '    {\n' +
            '      "code": "https://account.box.com/api/oauth2/authorize?response_type=code&client_id=<MY_CLIENT_ID>&redirect_uri=<MY_REDIRECT_URL>&state=<MY_SECURITY_TOKEN>",\n' +
            '      "language": "text",\n' +
            '      "name": "Box authorize URL"\n' +
            '    }\n' +
            '  ]\n' +
            '}\n' +
            '[/block]\n' +
            'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '[block:parameters]\n' +
            '{\n' +
            '  "data": {\n' +
            '    "h-0": "Parameter",\n' +
            '    "h-1": "Description",\n' +
            '    "0-0": "**response_type**",\n' +
            '    "1-0": "**client_id**",\n' +
            '  },\n' +
            '  "cols": 3,\n' +
            '  "rows": 5\n' +
            '}\n' +
            '[/block]\n' +
            'Dies ist der letzte Teil des lokalisierbaren Textes.\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testMarkdownFileLocalizeNoStrings: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/nostrings.md");
        test.ok(htf);

        // should read the file
        htf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "fr-FR/testfiles/md/nostrings.md")));
        test.ok(fs.existsSync(path.join(base, "de-DE/testfiles/md/nostrings.md")));

        test.done();
    },


    testMarkdownFileExtractFileNewResources: function(test) {
        test.expect(16);

        var base = path.dirname(module.id);

        var htf = new MarkdownFile(p, "./md/mode.md", mdft);
        test.ok(htf);

        htf.extract();

        var translations = new TranslationSet();

        translations.add(new ResourceString({
            project: "foo",
            key: "r950833718",
            source: "Choose a meeting method",
            sourceLocale: "en-US",
            target: "Choisissez une méthode de réunion d'affaires",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
            'Choisissez une méthode de réunion d\'affaires\n' +
            '-----------------------\n' +
            '\n' +
            '<img src="http://foo.com/photo.png" height="86px" width="86px"/>\n' +
            '\n' +
            'Ťëšţ þĥŕàšë543210\n' +
            '\n' +
            'Ïñ Pëŕšõñ Mõðë6543210\n' +
            '--------------\n' +
            '\n' +
            '\n';

        diff(actual, expected);
        test.equal(actual, expected);

        var set = t.newres;
        var resources = set.getAll();

        test.equal(resources.length, 2);

        var r = set.getBySource("Choose a meeting method");
        test.ok(!r);

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(resources[0].getKey(), "r103886803");
        test.equal(resources[0].getSource(), "Test phrase");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "Test phrase");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        r = set.getBySource("In Person Mode");
        test.ok(r);
        test.equal(resources[1].getKey(), "r251839517");
        test.equal(resources[1].getSource(), "In Person Mode");
        test.equal(resources[1].getSourceLocale(), "en-US");
        test.equal(resources[1].getTarget(), "In Person Mode");
        test.equal(resources[1].getTargetLocale(), "fr-FR");

        test.done();
    }
};

