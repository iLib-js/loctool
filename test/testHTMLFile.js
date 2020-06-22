/*
 * testHTMLFile.js - test the HTML file handler object.
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

if (!HTMLFile) {
    var HTMLFile = require("../lib/HTMLFile.js");
    var HTMLFileType = require("../lib/HTMLFileType.js");

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

var base = path.dirname(module.id);

module.exports.htmlfile = {
    testHTMLFileConstructor: function(test) {
        test.expect(1);

        var htf = new HTMLFile();
        test.ok(htf);

        test.done();
    },

    testHTMLFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./testfiles/html/CookieFlow.html");

        test.ok(htf);

        test.done();
    },

    testHTMLFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        test.done();
    },

    testHTMLFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testHTMLFileMakeKeyNoReturnChars: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This is\n a te\nst"), "r1055138400");

        test.done();
    },

    testHTMLFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This \t is\n \t a   test"), "r654479252");

        test.done();
    },

    testHTMLFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("\n\t This \t is\n \t a   test\n\n\n"), "r654479252");

        test.done();
    },

    testHTMLFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "r654479252", "html"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testHTMLFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testHTMLFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '<body>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testHTMLFileParseDontExtractUnicodeWhitespace: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('<div>            ​‌‍ ⁠</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLFileParseDontExtractNbspEntity: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<div>&nbsp; &nnbsp; &mmsp;</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLFileParseDoExtractOtherEntities: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<div>&uuml;</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLFileParseNoStrings: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<div class="noheader medrx"></div>');

        var set = htf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        var set = htf.getTranslationSet();
        test.equal(set.size(), 0);

        htf.parse('<html><body>This is a test</body></html>');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

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

    testHTMLFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 2);

        test.done();
    },

    testHTMLFileParseEscapeInvalidChars: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div id="foo">\n' +
                '           This is also a \u0003 test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a &#3; test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a &#3; test");
        test.equal(r.getKey(), "r1041204778");

        test.done();
    },

    testHTMLFileParseIgnoreDoctypeTag: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
            '<html>\n' +
            '   <body>\n' +
            '       This is a test\n' +
            '       <div id="foo">\n' +
            '           This is also a test\n' +
            '       </div>\n' +
            '       This is a test\n' +
            '   </body>\n' +
            '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 2);

        test.done();
    },

    testHTMLFileParseDontEscapeWhitespaceChars: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div id="foo">\n' +
                '           This is also a \u000C test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // leave the whitespace control chars alone
        var r = set.getBySource("This is also a \u000C test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a \u000C test");
        test.equal(r.getKey(), "r999080996");

        test.done();
    },

    testHTMLFileSkipScript: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = set.getBySource("// comment text");
        test.ok(!r);

        var r = set.getBySource("bar");
        test.ok(!r);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLFileParseNonBreakingTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <c0>test</c0> of the emergency parsing system.");
        test.equal(r.getKey(), "r306365966");

        test.done();
    },

    testHTMLFileParseNonBreakingTagsOutside: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">This is a test of the emergency parsing system.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");

        test.done();
    },

    testHTMLFileParseNonBreakingTagsOutsideTrimWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"> \t\t \r  This is a test of the emergency parsing system.   \t \n  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should trim the whitespace before and after the string
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");

        test.done();
    },

    testHTMLFileParseNonBreakingTagsInside: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

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

    testHTMLFileParseNonBreakingTagsAtStartOfString: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">This is a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should pick up the span tag because there is localizable text
        // after the close
        var r = set.getBySource('<c0>This is a test of the emergency parsing </c0> system.');
        test.ok(r);
        test.equal(r.getSource(), '<c0>This is a test of the emergency parsing </c0> system.');
        test.equal(r.getKey(), 'r580926060');

        test.done();
    },

    testHTMLFileParseMultipleNonBreakingTagsAtStartOfString: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"><b>This</b> is a test of the emergency parsing system.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should pick up the b tag because there is localizable text
        // after the close, but not the span tag
        var r = set.getBySource('<c0>This</c0> is a test of the emergency parsing system.');

        test.ok(r);
        test.equal(r.getSource(), '<c0>This</c0> is a test of the emergency parsing system.');
        test.equal(r.getKey(), 'r501987849');

        test.done();
    },

    testHTMLFileParseMultipleNonBreakingTagsAsOuterTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"><b>This is a test of the emergency parsing system.</b></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should not pick up the span and b tags because there is no localizable text
        // before or after them
        var r = set.getBySource('This is a test of the emergency parsing system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is a test of the emergency parsing system.');
        test.equal(r.getKey(), 'r699762575');

        test.done();
    },

    testHTMLFileParseMultipleNonBreakingTagsAtEndOfString: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test of the emergency parsing system.<span id="foo" class="bar">  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should pick up the span tag because there is localizable text
        // inside it or after the close
        var r = set.getBySource('This is a test of the emergency parsing system.');

        test.ok(r);
        test.equal(r.getSource(), 'This is a test of the emergency parsing system.');
        test.equal(r.getKey(), 'r699762575');

        test.done();
    },

    testHTMLFileParseNonBreakingTagsInsideMultiple: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // tags should be nestable
        var r = set.getBySource('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        test.equal(r.getKey(), 'r772812508');

        test.done();
    },

    testHTMLFileParseNonBreakingTagsNotWellFormed: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        test.equal(r.getKey(), 'r417724998');

        test.done();
    },

    testHTMLFileParseNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo"> a test of the <em>emergency parsing</div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing</c1></c0>');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0> a test of the <c1>emergency parsing</c1></c0>');
        test.equal(r.getKey(), 'r713898724');

        test.done();
    },

    testHTMLFileParseNonBreakingTagsTagStackIsReset: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing</em> system.</div>\n' +
                '       <div>This is <b>another test</b> of the emergency parsing </span> system.</div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0>another test</c0> of the emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <c0>another test</c0> of the emergency parsing');
        test.equal(r.getKey(), 'r2117084');

        test.done();
    },

    testHTMLFileParseLocalizableTitle: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div title="This value is localizable">\n' +
                '           This is a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

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

    testHTMLFileParseLocalizableAttributes: function(test) {
        test.expect(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="localizable placeholder here">\n' +
                '   </body>\n' +
                '</html>\n');

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

    testHTMLFileParseLocalizableAttributesSkipEmpty: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="">\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testHTMLFileParseLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

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

    testHTMLFileParseI18NComments: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <!-- i18n: this describes the text below -->\n' +
                '       This is a test of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "r699762575");
        test.equal(r.getComment(), "this describes the text below");

        test.done();
    },

    testHTMLFileParseIgnoreScriptTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>\n' +
            '<script type="javascript">\n' +
            'if (window) {\n' +
            '  $(".foo").class("asdf");\n' +
            '}\n' +
            '</script>\n' +
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

    testHTMLFileParseIgnoreStyleTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>\n' +
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

    testHTMLFileParseIgnoreCodeTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>\n' +
            '<span class="foo">foo</span>\n' +
            '<code>\n' +
            '  var js = new ResBundle();\n' +
            '  var str = js.getString("Test String");\n' +
            '</code>\n' +
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

    testHTMLFileExtractFile: function(test) {
        test.expect(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/CookieFlow.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("Get insurance quotes for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get insurance quotes for free!");
        test.equal(r.getKey(), "r308704783");

        r = set.getBySource("Send question");
        test.ok(r);
        test.equal(r.getSource(), "Send question");
        test.equal(r.getKey(), "r458583963");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "r30868880");

        test.done();
    },

    testHTMLFileExtractFile2: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/topic_navigation_main.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("Description");
        test.ok(r);
        test.equal(r.getSource(), "Description");
        test.equal(r.getKey(), "r398698468");

        r = set.getBySource('Authored by <c0>John Smith</c0>');
        test.ok(r);
        test.equal(r.getSource(), 'Authored by <c0>John Smith</c0>');
        test.equal(r.getKey(), 'r389685457');

        r = set.getBySource('Agreed');
        test.ok(r);
        test.equal(r.getSource(), 'Agreed');
        test.equal(r.getKey(), 'r906242212');

        r = set.getBySource('and <c0><c1>8</c1> of your friends agree</c0>');
        test.ok(r);
        test.equal(r.getSource(), 'and <c0><c1>8</c1> of your friends agree</c0>');
        test.equal(r.getKey(), 'r997712256');

        r = set.getBySource("Write a better description &raquo;");
        test.ok(r);
        test.equal(r.getSource(), "Write a better description &raquo;");
        test.equal(r.getKey(), "r291101881");

        test.done();
    },

    testHTMLFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/bogus.html");
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLFileLocalizeText: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
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

    testHTMLFileLocalizeTextPreserveWhitespace: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '<body>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
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

    testHTMLFileLocalizeTextPreserveSelfClosingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: "r654479252",
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

    testHTMLFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
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

    testHTMLFileLocalizeTextWithDups: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
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

    testHTMLFileLocalizeTextWithDoctypeTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
            '<html>\n' +
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
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
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

    testHTMLFileLocalizeTextSkipScript: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: "r654479252",
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

    testHTMLFileLocalizeTextNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
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

    testHTMLFileLocalizeTextNonBreakingTagsOutside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
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

    testHTMLFileLocalizeTextNonBreakingTagsInside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r124733470',
            source: 'This is <c0> a test of the emergency parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de l\'urgence.</c0>',
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

    testHTMLFileLocalizeTextNonBreakingTagsInsideMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772812508',
            source: 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence</c1>.</c0>',
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

    testHTMLFileLocalizeTextNonBreakingTagsNotWellFormed: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r417724998',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence.</c1></c0>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</em></span>\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testHTMLFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r215850552',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0>',
            target: 'Ceci est <c0> un essai du système <c1>d\'analyse syntaxique </c1></c0>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       <div>Ceci est <span id="foo" class="bar"> un essai du système <em>d\'analyse syntaxique </em></span></div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testHTMLFileLocalizeTextLocalizableTitle: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: 'r922503175',
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
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

    testHTMLFileLocalizeTextLocalizableAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: 'r1051764073',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r734414247',
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

    testHTMLFileLocalizeTextLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
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

    testHTMLFileLocalizeTextI18NComments: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
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
            key: 'r699762575',
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

    testHTMLFileLocalizeTextIdentifyResourceIds: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
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
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <span loclang="html" x-locid="r654479252">Ceci est un essai</span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '       <span loclang="html" x-locid="r654479252">Ceci est un essai</span>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHTMLFileLocalizeTextIdentifyResourceIdsWithAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
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
            key: "r561033628",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <area alt="&lt;span loclang=&quot;html&quot; x-locid=&quot;r561033628&quot;&gt;Texte de l&apos;espace réservé&lt;/span&gt;"><span loclang="html" x-locid="r654479252">Ceci est un essai</span></area>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHTMLFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
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
            key: "r561033628",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r325440473',
            source: 'This <c0>is a test</c0>',
            sourceLocale: "en-US",
            target: 'Ceci <c0>est un essai</c0>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html>\n' +
            '   <body>\n' +
            '       <span loclang="html" x-locid="r325440473">Ceci <span title="Texte de l&apos;espace réservé">est un essai</span></span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="html" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</html>\n';
           var actual = htf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHTMLFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "simple.fr-FR.html");

        test.done();
    },

    testHTMLFileGetLocalizedPathComplex: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testHTMLFileGetLocalizedPathRegularHTMLFileName: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testHTMLFileGetLocalizedPathNotEnoughParts: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR");

        test.done();
    },

    testHTMLFileGetLocalizedSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.en-US.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testHTMLFileLocalize: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/CookieFlow.html");
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
            key: 'r400586044',
            source: 'Talk',
            target: 'Consultee',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r30868880',
            source: 'Ask',
            target: 'Poser un question',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r458583963',
            source: 'Send question',
            target: 'Envoyer la question',
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
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r400586044',
            source: 'Talk',
            target: 'Beratung',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r30868880',
            source: 'Ask',
            target: 'Eine Frage stellen',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r458583963',
            source: 'Send question',
            target: 'Frage abschicken',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/html/CookieFlow.fr-FR.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/html/CookieFlow.de-DE.html")));

        var content = fs.readFileSync(path.join(base, "testfiles/html/CookieFlow.fr-FR.html"), "utf-8");

        var expected =
            '<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"></span>\n' +
            '        Obtenez des devis d\'assurance gratuitement!\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="padding-left: 0">\n' +
            '        <a class="specialist-avatar" href="/specialists/234" style="background-image: url(http://foo.com/bar.png);"></a>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150">\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="/message?from_seo=1">\n' +
            '            <div class="desktop-btn">Envoyer la question</div>\n' +
            '            <div class="mobile-btn">Poser un question</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/html/CookieFlow.de-DE.html"), "utf-8");

        test.equal(content,
            '<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"></span>\n' +
            '        Kostenlosen Versicherungs-Angebote erhalten!\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="padding-left: 0">\n' +
            '        <a class="specialist-avatar" href="/specialists/234" style="background-image: url(http://foo.com/bar.png);"></a>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150">\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="/message?from_seo=1">\n' +
            '            <div class="desktop-btn">Frage abschicken</div>\n' +
            '            <div class="mobile-btn">Eine Frage stellen</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>'
        );

        test.done();
    },

    testHTMLFileLocalizeNoStrings: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"],
            targetDir: "testfiles"
        });

        var htf = new HTMLFile(p, "./html/nostrings.html");
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
        test.ok(fs.existsSync(path.join(base, "testfiles/html/nostrings.fr-FR.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/html/nostrings.de-DE.html")));

        test.done();
    },

    testHTMLFileLocalizeTextNonTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span class="foo" <span class="bar"> Mr. Smith is not available.</span></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. Smith is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. Smith is not available.');
        test.equal(r.getKey(), 'r41505278');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r41505278',
            source: 'Mr. Smith is not available.',
            target: 'Mssr. Smith n\'est pas disponible.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
                '<html>\n' +
                '   <body>\n' +
                '       <span class="foo" span="" class="bar"> Mssr. Smith n\'est pas disponible.</span></span>\n' +
                '   </body>\n' +
                '</html>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHTMLFileLocalizeTextEscapeDoubleQuotes: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.equal(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.done();
    },

    testHTMLFileLocalizeTextIgnoreScriptTags: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body><script type="javascript">\n' +
               '  foo\n' +
            '</script>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><script>foo</script><div></div>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html><body><script type="javascript">\n' +
            '  foo\n' +
            '</script>\n' +
            '<span class="foo">asdf</span>\n' +
            '<div></div><script>foo</script><div></div>\n' +
            '</body></html>';

        diff(htf.localizeText(translations, "fr-FR"), expected);

        test.equal(htf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testHTMLFileLocalizeTextIgnoreStyleTags: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        test.ok(htf);

        htf.parse('<html><body><style>\n' +
               '  foo\n' +
            '</style>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><style>foo</style><div></div>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var expected =
            '<html><body><style>\n' +
            '  foo\n' +
            '</style>\n' +
            '<span class="foo">asdf</span>\n' +
            '<div></div><style>foo</style><div></div>\n' +
            '</body></html>';

        diff(htf.localizeText(translations, "fr-FR"), expected);

        test.equal(htf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testHTMLFileExtractFileFullyExtracted: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/meeting_panel.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("Upcoming Appointments");
        test.ok(r);
        test.equal(r.getSource(), "Upcoming Appointments");
        test.equal(r.getKey(), "r110253465");

        r = set.getBySource("Completed Meetings");
        test.ok(r);
        test.equal(r.getSource(), "Completed Meetings");
        test.equal(r.getKey(), "r163355880");

        r = set.getBySource("Get help");
        test.ok(r);
        test.equal(r.getSource(), "Get help");
        test.equal(r.getKey(), "r1035647778");

        r = set.getBySource("Colleagues are standing by to help");
        test.ok(r);
        test.equal(r.getSource(), "Colleagues are standing by to help");
        test.equal(r.getKey(), "r688256348");

        r = set.getBySource("Ask your co-workers now");
        test.ok(r);
        test.equal(r.getSource(), "Ask your co-workers now");
        test.equal(r.getKey(), "r575590209");

        test.done();
    },

    testHTMLFileExtractFileFullyExtracted2: function(test) {
        test.expect(11);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/mode.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("Choose a meeting method");
        test.ok(r);
        test.equal(r.getSource(), "Choose a meeting method");
        test.equal(r.getKey(), "r950833718");

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(r.getSource(), "Test phrase");
        test.equal(r.getKey(), "r103886803");

        r = set.getBySource("In Person Mode");
        test.ok(r);
        test.equal(r.getSource(), "In Person Mode");
        test.equal(r.getKey(), "r251839517");

        test.done();
    },

    testHTMLFileExtractFileNewResources: function(test) {
        test.expect(16);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var t = new HTMLFileType(p);

        var htf = new HTMLFile(p, "./html/mode.html", t);
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
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
            '<div class="askHeader">\n' +
            '  <h3>Choisissez une méthode de réunion d\'affaires</h3>\n' +
            '</div>\n' +
            '<div id="chooseMode">\n' +
            '  <div class="askContent">\n' +
            '    <div class="specialistInfo">\n' +
            '      <div class="portraitContainer">\n' +
            '        <div class="portrait">\n' +
            '          <img src="http://foo.com/photo.png" height="86px" width="86px"/>\n' +
            '        </div>\n' +
            '        <div class="dot on"></div>\n' +
            '      </div>\n' +
            '      <div class="rating">\n' +
            '      </div>\n' +
            '      <div class="name"></div>\n' +
            '      <div class="specialty"></div>\n' +
            '      Ťëšţ þĥŕàšë543210\n' +
            '    </div>\n' +
            '    <div class="modeSelection">\n' +
            '      <div class="modeContents">\n' +
            '        <h4>Ïñ Pëŕšõñ Mõðë6543210</h4>\n' +
            '        <p class="description"></p>\n' +
            '      </div>\n' +
            '    </div><div class="divider"></div>\n' +
            '  </div>\n' +
            '</div>\n';

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
