/*
 * HTMLFile.test.js - test the HTML file handler object.
 *
 * Copyright © 2018, 2023 2023 Box, Inc.
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

describe("htmlfile", function() {
    test("HTMLFileConstructor", function() {
        expect.assertions(1);

        var htf = new HTMLFile();
        expect(htf).toBeTruthy();
    });

    test("HTMLFileConstructorParams", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new HTMLFile(p, "./test/testfiles/html/CookieFlow.html");
        expect(htf).toBeTruthy();
    });

    test("HTMLFileConstructorNoFile", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();
    });

    test("HTMLFileMakeKey", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This is a test")).toBe("r654479252");
    });

    test("HTMLFileMakeKeyNoReturnChars", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This is\n a te\nst")).toBe("r1055138400");
    });

    test("HTMLFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This \t is\n \t a   test")).toBe("r654479252");
    });

    test("HTMLFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("\n\t This \t is\n \t a   test\n\n\n")).toBe("r654479252");
    });

    test("HTMLFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "r654479252", "html"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("HTMLFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("HTMLFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '<body>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("HTMLFileParseDontExtractUnicodeWhitespace", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('<div>            ​‌‍ ⁠</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("HTMLFileParseDontExtractNbspEntity", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div>&nbsp; &nnbsp; &mmsp;</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("HTMLFileParseDoExtractOtherEntities", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div>&uuml;</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLFileParseNoStrings", function() {
        expect.assertions(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div class="noheader medrx"></div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("HTMLFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        var set = htf.getTranslationSet();
        expect(set.size()).toBe(0);

        htf.parse('<html><body>This is a test</body></html>');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLFileParseMultiple", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
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

    test("HTMLFileParseWithDups", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        expect(set.size()).toBe(2);
    });

    test("HTMLFileParseEscapeInvalidChars", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div id="foo">\n' +
                '           This is also a \u0003 test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a &#3; test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a &#3; test");
        expect(r.getKey()).toBe("r1041204778");
    });

    test("HTMLFileParseIgnoreDoctypeTag", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        expect(set.size()).toBe(2);
    });

    test("HTMLFileParseDontEscapeWhitespaceChars", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div id="foo">\n' +
                '           This is also a \u000C test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // leave the whitespace control chars alone
        var r = set.getBySource("This is also a \u000C test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a \u000C test");
        expect(r.getKey()).toBe("r999080996");
    });

    test("HTMLFileSkipScript", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        var r = set.getBySource("// comment text");
        expect(!r).toBeTruthy();

        var r = set.getBySource("bar");
        expect(!r).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLFileParseNonBreakingTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("r306365966");
    });

    test("HTMLFileParseNonBreakingTagsOutside", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">This is a test of the emergency parsing system.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("HTMLFileParseNonBreakingTagsOutsideTrimWhitespace", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"> \t\t \r  This is a test of the emergency parsing system.   \t \n  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should trim the whitespace before and after the string
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("HTMLFileParseNonBreakingTagsInside", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should pick up the span tag because there is localizable text
        // before it and after it
        var r = set.getBySource('This is <c0> a test of the emergency parsing </c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the emergency parsing </c0> system.');
        expect(r.getKey()).toBe('r124733470');
    });

    test("HTMLFileParseNonBreakingTagsAtStartOfString", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">This is a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should pick up the span tag because there is localizable text
        // after the close
        var r = set.getBySource('<c0>This is a test of the emergency parsing </c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('<c0>This is a test of the emergency parsing </c0> system.');
        expect(r.getKey()).toBe('r580926060');
    });

    test("HTMLFileParseMultipleNonBreakingTagsAtStartOfString", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"><b>This</b> is a test of the emergency parsing system.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should pick up the b tag because there is localizable text
        // after the close, but not the span tag
        var r = set.getBySource('<c0>This</c0> is a test of the emergency parsing system.');

        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('<c0>This</c0> is a test of the emergency parsing system.');
        expect(r.getKey()).toBe('r501987849');
    });

    test("HTMLFileParseMultipleNonBreakingTagsAsOuterTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar"><b>This is a test of the emergency parsing system.</b></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should not pick up the span and b tags because there is no localizable text
        // before or after them
        var r = set.getBySource('This is a test of the emergency parsing system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is a test of the emergency parsing system.');
        expect(r.getKey()).toBe('r699762575');
    });

    test("HTMLFileParseMultipleNonBreakingTagsAtEndOfString", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a test of the emergency parsing system.<span id="foo" class="bar">  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should pick up the span tag because there is localizable text
        // inside it or after the close
        var r = set.getBySource('This is a test of the emergency parsing system.');

        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is a test of the emergency parsing system.');
        expect(r.getKey()).toBe('r699762575');
    });

    test("HTMLFileParseNonBreakingTagsInsideMultiple", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // tags should be nestable
        var r = set.getBySource('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        expect(r.getKey()).toBe('r772812508');
    });

    test("HTMLFileParseNonBreakingTagsNotWellFormed", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        expect(r.getKey()).toBe('r417724998');
    });

    test("HTMLFileParseNonBreakingTagsNotWellFormedWithTerminatorTag", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo"> a test of the <em>emergency parsing</div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing</c1></c0>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the <c1>emergency parsing</c1></c0>');
        expect(r.getKey()).toBe('r713898724');
    });

    test("HTMLFileParseNonBreakingTagsTagStackIsReset", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing</em> system.</div>\n' +
                '       <div>This is <b>another test</b> of the emergency parsing </span> system.</div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0>another test</c0> of the emergency parsing');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0>another test</c0> of the emergency parsing');
        expect(r.getKey()).toBe('r2117084');
    });

    test("HTMLFileParseLocalizableTitle", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div title="This value is localizable">\n' +
                '           This is a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("This value is localizable");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This value is localizable");
        expect(r.getKey()).toBe("r922503175");
    });

    test("HTMLFileParseLocalizableAttributes", function() {
        expect.assertions(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="localizable placeholder here">\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("Alternate text");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Alternate text");
        expect(r.getKey()).toBe("r1051764073");

        r = set.getBySource("localizable placeholder here");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable placeholder here");
        expect(r.getKey()).toBe("r734414247");
    });

    test("HTMLFileParseLocalizableAttributesSkipEmpty", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="">\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("HTMLFileParseLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('This is <c0>a test</c0> of non-breaking tags.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0>a test</c0> of non-breaking tags.');
        expect(r.getKey()).toBe('r1063253939');

        r = set.getBySource("localizable title");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable title");
        expect(r.getKey()).toBe("r160369622");
    });

    test("HTMLFileParseI18NComments", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <!-- i18n: this describes the text below -->\n' +
                '       This is a test of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        expect(r.getComment()).toBe("this describes the text below");
    });

    test("HTMLFileParseIgnoreScriptTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>\n' +
            '<script type="javascript">\n' +
            'if (window) {\n' +
            '  $(".foo").class("asdf");\n' +
            '}\n' +
            '</script>\n' +
            '<span class="foo">foo</span>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
    });

    test("HTMLFileParseIgnoreStyleTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
    });

    test("HTMLFileParseIgnoreCodeTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>\n' +
            '<span class="foo">foo</span>\n' +
            '<code>\n' +
            '  var js = new ResBundle();\n' +
            '  var str = js.getString("Test String");\n' +
            '</code>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
    });

    test("HTMLFileExtractFile", function() {
        expect.assertions(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/CookieFlow.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(3);

        var r = set.getBySource("Get insurance quotes for free!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Get insurance quotes for free!");
        expect(r.getKey()).toBe("r308704783");

        r = set.getBySource("Send question");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Send question");
        expect(r.getKey()).toBe("r458583963");

        r = set.getBySource("Ask");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ask");
        expect(r.getKey()).toBe("r30868880");
    });

    test("HTMLFileExtractFile2", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/topic_navigation_main.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(5);

        var r = set.getBySource("Description");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Description");
        expect(r.getKey()).toBe("r398698468");

        r = set.getBySource('Authored by <c0>John Smith</c0>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Authored by <c0>John Smith</c0>');
        expect(r.getKey()).toBe('r389685457');

        r = set.getBySource('Agreed');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Agreed');
        expect(r.getKey()).toBe('r906242212');

        r = set.getBySource('and <c0><c1>8</c1> of your friends agree</c0>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('and <c0><c1>8</c1> of your friends agree</c0>');
        expect(r.getKey()).toBe('r997712256');

        r = set.getBySource("Write a better description &raquo;");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Write a better description &raquo;");
        expect(r.getKey()).toBe("r291101881");
    });

    test("HTMLFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("HTMLFileExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/bogus.html");
        expect(htf).toBeTruthy();

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("HTMLFileLocalizeText", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("HTMLFileLocalizeTextPreserveWhitespace", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '<body>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextPreserveSelfClosingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '<body>\n' +
            '     <div class="foo"/>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextMultiple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextWithDups", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '       Ceci est un essai\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextWithDoctypeTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
            '<html>\n' +
            '   <body>\n' +
            '       Ceci est un essai\n' +
            '       <div id="foo">\n' +
            '           Ceci est aussi un essai\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextSkipScript", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
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
    });

    test("HTMLFileLocalizeTextNonBreakingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.  \n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       <span id="foo" class="bar">  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  </span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextNonBreakingTagsInside", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextNonBreakingTagsInsideMultiple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLFileLocalizeTextNonBreakingTagsNotWellFormed", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</em></span>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <div>Ceci est <span id="foo" class="bar"> un essai du système <em>d\'analyse syntaxique </em></span></div> system.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextLocalizableTitle", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <div title="Cette valeur est localisable">\n' +
                '           Ceci est un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextLocalizableAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Texte alternative">\n' +
                '       Ceci est un essai\n' +
                '       <input type="text" placeholder="espace réservé localisable ici">\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextI18NComments", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       \n' +
                '       Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  \n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLFileLocalizeTextIdentifyResourceIds", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("HTMLFileLocalizeTextIdentifyResourceIdsWithAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("HTMLFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("HTMLFileGetLocalizedPathSimple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "simple.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("simple.fr-FR.html");
    });

    test("HTMLFileGetLocalizedPathComplex", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.html");
    });

    test("HTMLFileGetLocalizedPathWithMapping", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            localeMap: {
                "fr-FR": "fr"
            }
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr.html");
    });

    test("HTMLFileGetLocalizedPathRegularHTMLFileName", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.html");
    });

    test("HTMLFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR");
    });

    test("HTMLFileGetLocalizedSourceLocale", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./asdf/bar/simple.en-US.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.html");
    });

    test("HTMLFileLocalize", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/CookieFlow.html");
        expect(htf).toBeTruthy();

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

        expect(fs.existsSync(path.join(base, "testfiles/html/CookieFlow.fr-FR.html"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/html/CookieFlow.de-DE.html"))).toBeTruthy();

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
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/html/CookieFlow.de-DE.html"), "utf-8");

        expect(content).toBe('<div class="upsell-ad-item clearfix">  \n' +
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
    });

    test("HTMLFileLocalizeNoStrings", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/nostrings.html");
        expect(htf).toBeTruthy();

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
        expect(fs.existsSync(path.join(base, "testfiles/html/nostrings.fr-FR.html"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/html/nostrings.de-DE.html"))).toBeTruthy();
    });

    test("HTMLFileLocalizeTextNonTemplateTagsInsideTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span class="foo" <span class="bar"> Mr. Smith is not available.</span></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. Smith is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. Smith is not available.');
        expect(r.getKey()).toBe('r41505278');

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
        expect(actual).toBe(expected);
    });

    test("HTMLFileLocalizeTextEscapeDoubleQuotes", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');
    });

    test("HTMLFileLocalizeTextIgnoreScriptTags", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body><script type="javascript">\n' +
               '  foo\n' +
            '</script>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><script>foo</script><div></div>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe(expected);
    });

    test("HTMLFileLocalizeTextIgnoreStyleTags", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body><style>\n' +
               '  foo\n' +
            '</style>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><style>foo</style><div></div>\n' +
            '</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe(expected);
    });

    test("HTMLFileExtractFileFullyExtracted", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/meeting_panel.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(5);

        var r = set.getBySource("Upcoming Appointments");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Upcoming Appointments");
        expect(r.getKey()).toBe("r110253465");

        r = set.getBySource("Completed Meetings");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Completed Meetings");
        expect(r.getKey()).toBe("r163355880");

        r = set.getBySource("Get help");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Get help");
        expect(r.getKey()).toBe("r1035647778");

        r = set.getBySource("Colleagues are standing by to help");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Colleagues are standing by to help");
        expect(r.getKey()).toBe("r688256348");

        r = set.getBySource("Ask your co-workers now");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ask your co-workers now");
        expect(r.getKey()).toBe("r575590209");
    });

    test("HTMLFileExtractFileFullyExtracted2", function() {
        expect.assertions(11);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLFile(p, "./html/mode.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(3);

        var r = set.getBySource("Choose a meeting method");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Choose a meeting method");
        expect(r.getKey()).toBe("r950833718");

        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Test phrase");
        expect(r.getKey()).toBe("r103886803");

        r = set.getBySource("In Person Mode");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("In Person Mode");
        expect(r.getKey()).toBe("r251839517");
    });

    test("HTMLFileExtractFileNewResources", function() {
        expect.assertions(16);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var t = new HTMLFileType(p);

        var htf = new HTMLFile(p, "./html/mode.html", t);
        expect(htf).toBeTruthy();

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
            '      [Ťëšţ þĥŕàšë543210]\n' +
            '    </div>\n' +
            '    <div class="modeSelection">\n' +
            '      <div class="modeContents">\n' +
            '        <h4>[Ïñ Pëŕšõñ Mõðë6543210]</h4>\n' +
            '        <p class="description"></p>\n' +
            '      </div>\n' +
            '    </div><div class="divider"></div>\n' +
            '  </div>\n' +
            '</div>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);

        var set = t.newres;
        var resources = set.getAll();

        expect(resources.length).toBe(2);

        var r = set.getBySource("Choose a meeting method");
        expect(!r).toBeTruthy();

        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(resources[0].getKey()).toBe("r103886803");
        expect(resources[0].getSource()).toBe("Test phrase");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Test phrase");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        r = set.getBySource("In Person Mode");
        expect(r).toBeTruthy();
        expect(resources[1].getKey()).toBe("r251839517");
        expect(resources[1].getSource()).toBe("In Person Mode");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTarget()).toBe("In Person Mode");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");
    });
});
