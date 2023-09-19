/*
 * HTMLTemplateFile.test.js - test the HTML template file handler object.
 *
 * Copyright © 2016-2017, 2019, 2023 2023 HealthTap, Inc.
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

if (!HTMLTemplateFile) {
    var HTMLTemplateFile = require("../lib/HTMLTemplateFile.js");
    var HTMLTemplateFileType = require("../lib/HTMLTemplateFileType.js");

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

describe("htmltemplatefile", function() {
    test("HTMLTemplateFileConstructor", function() {
        expect.assertions(1);

        var htf = new HTMLTemplateFile();
        expect(htf).toBeTruthy();
    });

    test("HTMLTemplateFileConstructorParams", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new HTMLTemplateFile(p, "./test/testfiles/tmpl/CookieFlowTemplate.tmpl.html");
        expect(htf).toBeTruthy();
    });

    test("HTMLTemplateFileConstructorNoFile", function() {
        expect.assertions(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();
    });

    test("HTMLTemplateFileMakeKey", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This is a test")).toBe("This is a test");
    });

    test("HTMLTemplateFileMakeKeyNoReturnChars", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This is\n a te\nst")).toBe("This is a te st");
    });

    test("HTMLTemplateFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("This \t is\n \t a   test")).toBe("This is a test");
    });

    test("HTMLTemplateFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        expect(htf.makeKey("\n\t This \t is\n \t a   test\n\n\n")).toBe("This is a test");
    });

    test("HTMLTemplateFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "This is a test", "html"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("HTMLTemplateFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("HTMLTemplateFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");
    });

    test("HTMLTemplateFileParseDontExtractUnicodeWhitespace", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('<div>            ​‌‍ ⁠⁡⁢⁣⁤</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("HTMLTemplateFileParseDontExtractNbspEntity", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div>&nbsp; &nnbsp; &mmsp;</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("HTMLTemplateFileParseDoExtractOtherEntities", function() {
        expect.assertions(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div>&uuml;</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLTemplateFileParseNoStrings", function() {
        expect.assertions(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div class="noheader medrx"></div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("HTMLTemplateFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        var set = htf.getTranslationSet();
        expect(set.size()).toBe(0);

        htf.parse('<html><body>This is a test</body></html>');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLTemplateFileParseMultiple", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
    });

    test("HTMLTemplateFileParseWithDups", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");

        expect(set.size()).toBe(2);
    });

    test("HTMLTemplateFileParseEscapeInvalidChars", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is also a &#3; test");
    });

    test("HTMLTemplateFileParseIgnoreDoctypeTag", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
    });

    test("HTMLTemplateFileParseDontEscapeWhitespaceChars", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is also a test");
    });

    test("HTMLTemplateFileParseSkipTemplateEchoTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
            '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
            '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
            '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
            '<% fileSize = fileSize.toString(); %>\n' +
            '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
            '\n' +
            '<div class="chat-attachment">\n' +
            '  <a href="<%= url %>" target="_blank">\n' +
            '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
            '      <img class="uploaded-image" src="<%= url %>" />\n' +
            '    <% } else { %>\n' +
            '      <div class="attachment-placeholder">\n' +
            '        <div class="attachment-icon"></div>\n' +
            '      </div>\n' +
            '    <% } %>\n' +
            '  </a>\n' +
            '  <% if (caption) { %>\n' +
            '    <div class="attachment-caption">\n' +
            '      <%= caption %>\n' +
            '    </div>\n' +
            '  <% } %>\n' +
            '  <div class="attachment-timestamp">\n' +
            '    Uploaded <%= dateString %>\n' +
            '  </div>\n' +
            '  <div class="attachment-size">\n' +
            '    <%= fileSize + \' \' + measurement %> \n' +
            '  </div>\n' +
            '</div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey(undefined, "en-US", "Uploaded <%= dateString %>", "html"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Uploaded <%= dateString %>");
        expect(r.getKey()).toBe("Uploaded <%= dateString %>");
    });

    test("HTMLTemplateFileParseSkipTemplateEchoEscapedTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
            '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
            '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
            '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
            '<% fileSize = fileSize.toString(); %>\n' +
            '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
            '\n' +
            '<div class="chat-attachment">\n' +
            '  <a href="<%- url %>" target="_blank">\n' +
            '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
            '      <img class="uploaded-image" src="<%- url %>" />\n' +
            '    <% } else { %>\n' +
            '      <div class="attachment-placeholder">\n' +
            '        <div class="attachment-icon"></div>\n' +
            '      </div>\n' +
            '    <% } %>\n' +
            '  </a>\n' +
            '  <% if (caption) { %>\n' +
            '    <div class="attachment-caption">\n' +
            '      <%- caption %>\n' +
            '    </div>\n' +
            '  <% } %>\n' +
            '  <div class="attachment-timestamp">\n' +
            '    Uploaded <%- dateString %>\n' +
            '  </div>\n' +
            '  <div class="attachment-size">\n' +
            '    <%- fileSize + \' \' + measurement %> \n' +
            '  </div>\n' +
            '</div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "Uploaded", "html"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Uploaded");
        expect(r.getKey()).toBe("Uploaded");
    });

    test("HTMLTemplateFileSkipScript", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");

        var r = set.getBySource("// comment text");
        expect(!r).toBeTruthy();

        var r = set.getBySource("bar");
        expect(!r).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("HTMLTemplateFileParseNonBreakingTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a <em>test</em> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <em>test</em> of the emergency parsing system.");
        expect(r.getKey()).toBe("This is a<em>test</em>of the emergency parsing system.");
    });

    test("HTMLTemplateFileParseNonBreakingTagsOutside", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("This is a test of the emergency parsing system.");
    });

    test("HTMLTemplateFileParseNonBreakingTagsInside", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        expect(r.getKey()).toBe('This is<span id="foo" class="bar">a test of the emergency parsing</span>system.');
    });

    test("HTMLTemplateFileParseNonBreakingTagsInsideMultiple", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // tags should be nestable
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        expect(r.getKey()).toBe('This is<span id="foo" class="bar">a test of the<em>emergency</em>parsing</span>system.');
    });

    test("HTMLTemplateFileParseNonBreakingTagsNotWellFormed", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        expect(r.getKey()).toBe('This is<span id="foo" class="bar">a test of the<em>emergency parsing</span>system.');
    });

    test("HTMLTemplateFileParseNonBreakingTagsNotWellFormedWithTerminatorTag", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        expect(r.getKey()).toBe('This is<span id="foo" class="bar">a test of the<em>emergency parsing');
    });

    test("HTMLTemplateFileParseNonBreakingTagsTagStackIsReset", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        var r = set.getBySource('This is <b>another test</b> of the emergency parsing');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <b>another test</b> of the emergency parsing');
        expect(r.getKey()).toBe('This is<b>another test</b>of the emergency parsing');
    });

    test("HTMLTemplateFileParseLocalizableTitle", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This value is localizable");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This value is localizable");
        expect(r.getKey()).toBe("This value is localizable");
    });

    test("HTMLTemplateFileParseLocalizableAttributes", function() {
        expect.assertions(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("Alternate text");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Alternate text");
        expect(r.getKey()).toBe("Alternate text");

        r = set.getBySource("localizable placeholder here");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable placeholder here");
        expect(r.getKey()).toBe("localizable placeholder here");
    });

    test("HTMLTemplateFileParseLocalizableAttributesSkipEmpty", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test");
    });

    test("HTMLTemplateFileParseLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        expect(r.getKey()).toBe('This is<a href="foo.html" title="{title}">a test</a>of non-breaking tags.');

        r = set.getBySource("localizable title");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable title");
        expect(r.getKey()).toBe("localizable title");
    });

    test("HTMLTemplateFileParseBreakBetweenTemplateTags", function() {
        expect.assertions(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <% if(specialist){ %>\n' +
                '           Consult\n' +
                '       <% } else { %>\n' +
                '           Get insurance quotes for free!\n' +
                '       <% } %>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Consult');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Consult');
        expect(r.getKey()).toBe('Consult');

        r = set.getBySource("Get insurance quotes for free!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Get insurance quotes for free!");
        expect(r.getKey()).toBe("Get insurance quotes for free!");
    });

    test("HTMLTemplateFileParseDontBreakBetweenTemplateEchoTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Mr. <%= family_name %> is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%= family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%= family_name %> is not available.');
    });

    test("HTMLTemplateFileParseDontIncludeStartingTemplateEchoTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <%= greeting %> Your friend is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Your friend is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Your friend is not available.');
        expect(r.getKey()).toBe('Your friend is not available.');
    });

    test("HTMLTemplateFileParseDontIncludeEndingTemplateEchoTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Your friend is not available. <%= until_when %>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('Your friend is not available. <%= until_when %>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Your friend is not available. <%= until_when %>');
        expect(r.getKey()).toBe('Your friend is not available. <%= until_when %>');
    });

    test("HTMLTemplateFileParseTemplateEchoTagsInsideTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %>class="foo"<% } %>> Mr. <%= family_name %> is not available.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%= family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%= family_name %> is not available.');
    });

    test("HTMLTemplateFileParseDontBreakBetweenTemplateEchoEscapedTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Mr. <%- family_name %> is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%- family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%- family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%- family_name %> is not available.');
    });

    test("HTMLTemplateFileParseDontIncludeStartingTemplateEchoEscapedTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <%- greeting %> Your friend is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Your friend is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Your friend is not available.');
        expect(r.getKey()).toBe('Your friend is not available.');
    });

    test("HTMLTemplateFileParseDontIncludeEndingTemplateEchoTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Your friend is not available. <%- until_when %>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Your friend is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Your friend is not available.');
        expect(r.getKey()).toBe('Your friend is not available.');
    });

    test("HTMLTemplateFileParseTemplateEchoEscapedTagsInsideTags", function() {
        expect.assertions(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %>class="foo"<% } %>> Mr. <%- family_name %> is not available.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%- family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%- family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%- family_name %> is not available.');
    });

    test("HTMLTemplateFileParseI18NComments", function() {
        expect.assertions(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("This is a test of the emergency parsing system.");
        expect(r.getComment()).toBe("this describes the text below");
    });

    test("HTMLTemplateFileParseIgnoreScriptTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("foo");
    });

    test("HTMLTemplateFileParseIgnoreStyleTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("foo");
    });

    test("HTMLTemplateFileParseIgnoreCodeTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(r.getKey()).toBe("foo");
    });

    test("HTMLTemplateFileExtractFile", function() {
        expect.assertions(14);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowTemplate.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(4);

        var r = set.getBySource("Get insurance quotes for free!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Get insurance quotes for free!");
        expect(r.getKey()).toBe("Get insurance quotes for free!");

        r = set.getBySource("Talk");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Talk");
        expect(r.getKey()).toBe("Talk");

        r = set.getBySource("Send question");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Send question");
        expect(r.getKey()).toBe("Send question");

        r = set.getBySource("Ask");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ask");
        expect(r.getKey()).toBe("Ask");
    });

    test("HTMLTemplateFileExtractFile2", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/topic_navigation_main.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(5);

        var r = set.getBySource("Description");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Description");
        expect(r.getKey()).toBe("Description");
        r = set.getBySource('Authored by <%=val.author.full_name%>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Authored by <%=val.author.full_name%>');
        expect(r.getKey()).toBe('Authored by <%=val.author.full_name%>');
        r = set.getBySource('Agreed');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Agreed');
        expect(r.getKey()).toBe('Agreed');
        r = set.getBySource('and <%=val.desc_agrees.length%><a class="bold"><span class="friend_agree_count_h"></span> of your friends agree</a>');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('and <%=val.desc_agrees.length%><a class="bold"><span class="friend_agree_count_h"></span> of your friends agree</a>');
        expect(r.getKey()).toBe('and <%=val.desc_agrees.length%><a class="bold"><span class="friend_agree_count_h"></span>of your friends agree</a>');
        r = set.getBySource("Write a better description &raquo;");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Write a better description &raquo;");
        expect(r.getKey()).toBe("Write a better description &raquo;");
    });

    test("HTMLTemplateFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("HTMLTemplateFileExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/bogus.tmpl.html");
        expect(htf).toBeTruthy();

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("HTMLTemplateFileLocalizeText", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextPreserveWhitespace", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '<body>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextPreserveSelfClosingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
            key: "This is a test",
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

    test("HTMLTemplateFileLocalizeTextMultiple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextWithDups", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    test("HTMLTemplateFileLocalizeTextWithDoctypeTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    test("HTMLTemplateFileLocalizeTextSkipScript", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
            key: "This is a test",
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

    test("HTMLTemplateFileLocalizeTextNonBreakingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.  \n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       <span id="foo" class="bar">  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  </span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonBreakingTagsInside", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonBreakingTagsInsideMultiple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormed", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</span>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <div>Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique </div> system.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextLocalizableTitle", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <div title="Cette valeur est localisable">\n' +
                '           Ceci est un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextLocalizableAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Texte alternative">\n' +
                '       Ceci est un essai\n' +
                '       <input type="text" placeholder="espace réservé localisable ici">\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

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

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextBreakBetweenTemplateTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <% if(specialist){ %>\n' +
                '           Consult\n' +
                '       <% } else { %>\n' +
                '           Get insurance quotes for free!\n' +
                '       <% } %>\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Consult',
            source: 'Consult',
            target: 'Une consultation',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'Get insurance quotes for free!',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
            '   <body>\n' +
            '       <% if(specialist){ %>\n' +
            '           Une consultation\n' +
            '       <% } else { %>\n' +
            '           Obtenez des devis d\'assurance gratuitement!\n' +
            '       <% } %>\n' +
            '   </body>\n' +
            '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextDontBreakBetweenTemplateEchoTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Mr. <%= family_name %> is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Mr. <%= family_name %> is not available.',
            source: 'Mr. <%= family_name %> is not available.',
            target: 'Mr. <%= family_name %> n\'est pas disponibles.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Mr. <%= family_name %> n\'est pas disponibles.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextDontBreakBetweenTemplateEchoEscapedTags", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Mr. <%- family_name %> is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Mr. <%- family_name %> is not available.',
            source: 'Mr. <%- family_name %> is not available.',
            target: 'Mr. <%- family_name %> n\'est pas disponibles.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       Mr. <%- family_name %> n\'est pas disponibles.\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextI18NComments", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
            key: 'This is a test of the emergency parsing system.',
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

    test("HTMLTemplateFileLocalizeTextIdentifyResourceIds", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextIdentifyResourceIdsWithAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileGetLocalizedPathSimple", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "simple.tmpl.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("simple.fr-FR.tmpl.html");
    });

    test("HTMLTemplateFileGetLocalizedPathComplex", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.tmpl.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.tmpl.html");
    });

    test("HTMLTemplateFileGetLocalizedPathWithLocaleMap", function() {
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

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.tmpl.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr.tmpl.html");
    });

    test("HTMLTemplateFileGetLocalizedPathRegularHTMLFileName", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.html");
    });

    test("HTMLTemplateFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR");
    });

    test("HTMLTemplateFileGetLocalizedSourceLocale", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.en-US.tmpl.html");
        expect(htf).toBeTruthy();

        expect(htf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple.fr-FR.tmpl.html");
    });

    test("HTMLTemplateFileLocalize", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowTemplate.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Get insurance quotes for free!',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Talk',
            source: 'Talk',
            target: 'Consultee',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Ask',
            source: 'Ask',
            target: 'Poser un question',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Send question',
            source: 'Send question',
            target: 'Envoyer la question',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        translations.add(new ResourceString({
            project: "webapp",
            key: 'Get insurance quotes for free!',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Talk',
            source: 'Talk',
            target: 'Beratung',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Ask',
            source: 'Ask',
            target: 'Eine Frage stellen',
            targetLocale: "de-DE",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Send question',
            source: 'Send question',
            target: 'Frage abschicken',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.fr-FR.tmpl.html"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.de-DE.tmpl.html"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.fr-FR.tmpl.html"), "utf-8");

        var expected =
            '<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"><%=title%></span>\n' +
            '          <% if(specialist){ %>\n' +
            '            <%=\n' +
            '              RB.getString(\'Talk with {span_tag_start}{value}{span_tag_end}, a {specialist_name} with {years} years in insurance brokering:\').format({\n' +
            '                value: specialist.name,\n' +
            '                specialist_name: specialist.specialist_name,\n' +
            '                years: specialist.years_experience,\n' +
            '                span_tag_start: \'<span class="upsell-header-bold">\',\n' +
            '                span_tag_end: \'</span>\'\n' +
            '              })\n' +
            '            %>\n' +
            '            Consultee\n' +
            '          <% } else { %>\n' +
            '            Obtenez des devis d\'assurance gratuitement!\n' +
            '          <% } %>\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="<%- specialist ? \'\' : \'padding-left: 0\' %>">\n' +
            '         <% if(specialist){ %>\n' +
            '          <a class="specialist-avatar" href="/specialists/<%= specialist.id %>" style="background-image: url(<%= specialist.avatar_transparent_circular %>);"></a>\n' +
            '        <% } %>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150" placeholder=\'<%= placeholder %>\'>\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="<%= specialist ? \'/specialists/\' + specialist.id + \'/message?from_seo=1\' : \'/send_question\' %>">\n' +
            '            <div class="desktop-btn">Envoyer la question</div>\n' +
            '            <div class="mobile-btn">Poser un question</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.de-DE.tmpl.html"), "utf-8");

        expect(content).toBe('<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"><%=title%></span>\n' +
            '          <% if(specialist){ %>\n' +
            '            <%=\n' +
            '              RB.getString(\'Talk with {span_tag_start}{value}{span_tag_end}, a {specialist_name} with {years} years in insurance brokering:\').format({\n' +
            '                value: specialist.name,\n' +
            '                specialist_name: specialist.specialist_name,\n' +
            '                years: specialist.years_experience,\n' +
            '                span_tag_start: \'<span class="upsell-header-bold">\',\n' +
            '                span_tag_end: \'</span>\'\n' +
            '              })\n' +
            '            %>\n' +
            '            Beratung\n' +
            '          <% } else { %>\n' +
            '            Kostenlosen Versicherungs-Angebote erhalten!\n' +
            '          <% } %>\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="<%- specialist ? \'\' : \'padding-left: 0\' %>">\n' +
            '         <% if(specialist){ %>\n' +
            '          <a class="specialist-avatar" href="/specialists/<%= specialist.id %>" style="background-image: url(<%= specialist.avatar_transparent_circular %>);"></a>\n' +
            '        <% } %>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150" placeholder=\'<%= placeholder %>\'>\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="<%= specialist ? \'/specialists/\' + specialist.id + \'/message?from_seo=1\' : \'/send_question\' %>">\n' +
            '            <div class="desktop-btn">Frage abschicken</div>\n' +
            '            <div class="mobile-btn">Eine Frage stellen</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>'
        );
    });

    test("HTMLTemplateFileLocalizeNoStrings", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/nostrings.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Get insurance quotes for free!',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "html"
        }));
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Get insurance quotes for free!',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.fr-FR.tmpl.html"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.de-DE.tmpl.html"))).toBeTruthy();
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %>class="foo"<% } %>> Mr. <%= family_name %> is not available.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%= family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%= family_name %> is not available.');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Mr. <%= family_name %> is not available.',
            source: 'Mr. <%= family_name %> is not available.',
            target: 'Mssr. <%= family_name %> n\'est pas disponible.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %> class="foo" <% } %>> Mssr. <%= family_name %> n\'est pas disponible.</span>\n' +
                '   </body>\n' +
                '</html>\n');
    });

    test("HTMLTemplateFileLocalizeTextNonTemplateTagsInsideTags", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span class="foo" <span class="bar"> Mr. <%= family_name %> is not available.</span></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Mr. <%= family_name %> is not available.');
        expect(r.getKey()).toBe('Mr. <%= family_name %> is not available.');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Mr. <%= family_name %> is not available.',
            source: 'Mr. <%= family_name %> is not available.',
            target: 'Mssr. <%= family_name %> n\'est pas disponible.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
                '<html>\n' +
                '   <body>\n' +
                '       <span class="foo" span="" class="bar"> Mssr. <%= family_name %> n\'est pas disponible.</span></span>\n' +
                '   </body>\n' +
                '</html>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags2", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(specialist.entity_type == \'group\'){ %>checked=yes<% } %> >\n' +
            '<label for="entity_group" class="radio-label">Group</label>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('Group');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('Group');
        expect(r.getKey()).toBe('Group');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Group',
            source: 'Group',
            target: 'Groupe',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(specialist.entity_type == \'group\'){ %> checked=yes <% } %>>\n' +
                '<label for="entity_group" class="radio-label">Groupe</label>');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags3", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '    <select class=\'end_hour\' value=<%=end_hour%>>\n' +
            '      foo\n' +
            '    </select>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('    <select class=\'end_hour\' value=<%=end_hour%>>\n' +
                '      asdf\n' +
                '    </select>\n');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags4", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<span has-sub-options = <%= option.sub_options.length > 0 %> data-tracking-value = "<%= option.tracking_value%>" >\n' +
            '    foo\n' +
            '</span>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<span has-sub-options=<%= option.sub_options.length > 0 %> data-tracking-value="<%= option.tracking_value%>">\n' +
                '    asdf\n' +
                '</span>\n');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags5", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<a class="specialist-name" href=<%= val.specialist.url%>>foo</a>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<a class="specialist-name" href=<%= val.specialist.url%>>asdf</a>\n');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags5a", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<a class="specialist-name" href=<%- val.specialist.url%>>foo</a>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<a class="specialist-name" href=<%- val.specialist.url%>>asdf</a>\n');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags6", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<% _.each(specialists, function( val, index ){ %>\n' +
            '  <div class="specialist-review">\n' +
            '    <div class="specialist-item" >\n' +
            '      <div class="specialist-avatar" style="background-image: url(<%= val.specialist.avatar_transparent_circular %>);"></div>\n' +
            '      <div class="specialist-info">\n' +
            '        <div class="icon"></div>\n' +
            '        <a class="specialist-name" href=<%= val.specialist.url%>><%= val.specialist.name%></a>\n' +
            '        <div class ="specialty"><%= val.specialist.intro%></div>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '    <div class="rating-stars">\n' +
            '      <% for (var index = 1; index<=5; index++) {%>\n' +
            '        <% if (val.rating < index) {%>\n' +
            '          <div class="rating-star-empty"></div>\n' +
            '        <% } else { %>\n' +
            '          <div class="rating-star-filled"></div>\n' +
            '        <% } %>\n' +
            '      <% } %>\n' +
            '    </div>\n' +
            '    <div class="notes">\n' +
            '      <%= val.note%>\n' +
            '      foo\n' +
            '    </div>\n' +
            '  </div>\n' +
            '<% }) %>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
            '<% _.each(specialists, function( val, index ){ %>\n' +
            '  <div class="specialist-review">\n' +
            '    <div class="specialist-item">\n' +
            '      <div class="specialist-avatar" style="background-image: url(<%= val.specialist.avatar_transparent_circular %>);"></div>\n' +
            '      <div class="specialist-info">\n' +
            '        <div class="icon"></div>\n' +
            '        <a class="specialist-name" href=<%= val.specialist.url%>><%= val.specialist.name%></a>\n' +
            '        <div class="specialty"><%= val.specialist.intro%></div>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '    <div class="rating-stars">\n' +
            '      <% for (var index = 1; index<=5; index++) {%>\n' +
            '        <% if (val.rating < index) {%>\n' +
            '          <div class="rating-star-empty"></div>\n' +
            '        <% } else { %>\n' +
            '          <div class="rating-star-filled"></div>\n' +
            '        <% } %>\n' +
            '      <% } %>\n' +
            '    </div>\n' +
            '    <div class="notes">\n' +
            '      <%= val.note%>\n' +
            '      asdf\n' +
            '    </div>\n' +
            '  </div>\n' +
            '<% }) %>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags7", function() {
        expect.assertions(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nfoo\n</div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('foo');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('foo');
        expect(r.getKey()).toBe('foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nasdf\n</div>');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags8", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('<div class="star <%= (score > 30) ? "filled-star" : (score > 20) ? "half-star" : "empty-star"%>">foo</div>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expect(htf.localizeText(translations, "fr-FR")).toBe('<div class="star <%= (score > 30) ? "filled-star" : (score > 20) ? "half-star" : "empty-star"%>">asdf</div>');
    });

    test("HTMLTemplateFileLocalizeTextTemplateTagsInsideTags9", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
                '  <% if(two_buttons){ %>\n' +
                '    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
                '    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
                '  <% } else { %>\n' +
                '    <div class="btn grey confirm-btn" style="width: 93%" ><%= confirm_btn.text %></div>\n' +
                '  <% } %>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '  <% if(two_buttons){ %>\n' +
                '    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
                '    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
                '  <% } else { %>\n' +
                '    <div class="btn grey confirm-btn" style="width: 93%"><%= confirm_btn.text %></div>\n' +
                '  <% } %>');

        expect(htf.localizeText(translations, "fr-FR")).toBe('  <% if(two_buttons){ %>\n' +
                '    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
                '    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
                '  <% } else { %>\n' +
                '    <div class="btn grey confirm-btn" style="width: 93%"><%= confirm_btn.text %></div>\n' +
                '  <% } %>');
    });

    test("HTMLTemplateFileLocalizeTextEscapeDoubleQuotes", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        expect(htf.localizeText(translations, "fr-FR")).toBe('  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');
    });

    test("HTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTags", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>foo</span>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>asdf</span>');

        expect(htf.localizeText(translations, "fr-FR")).toBe('  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>asdf</span>');
    });

    test("HTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTagsWithPercentInThem", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse('  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>foo</span>');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>asdf</span>');

        expect(htf.localizeText(translations, "fr-FR")).toBe('  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>asdf</span>');
    });

    test("HTMLTemplateFileLocalizeTextIgnoreScriptTags", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
            key: 'foo',
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

    test("HTMLTemplateFileLocalizeTextIgnoreStyleTags", function() {
        expect.assertions(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
            key: 'foo',
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

    test("HTMLTemplateFileLocalizeTextWithEmbeddedTemplateEchoTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
            '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
            '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
            '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
            '<% fileSize = fileSize.toString(); %>\n' +
            '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
            '<div class="chat-attachment">\n' +
            '  <a href="<%= url %>" target="_blank">\n' +
            '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
            '      <img class="uploaded-image" src="<%= url %>" />\n' +
            '    <% } else { %>\n' +
            '      <div class="attachment-placeholder">\n' +
            '        <div class="attachment-icon"></div>\n' +
            '      </div>\n' +
            '    <% } %>\n' +
            '  </a>\n' +
            '  <% if (caption) { %>\n' +
            '    <div class="attachment-caption">\n' +
            '      <%= caption %>\n' +
            '    </div>\n' +
            '  <% } %>\n' +
            '  <div class="attachment-timestamp">\n' +
            '    Uploaded <%= dateString %>\n' +
            '  </div>\n' +
            '  <div class="attachment-size">\n' +
            '    <%= fileSize + \' \' + measurement %> \n' +
            '  </div>\n' +
            '</div>    \n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Uploaded <%= dateString %>',
            source: 'Uploaded <%= dateString %>',
            target: 'Téléchargé sur <%= dateString %>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        expected =
                '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
                '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
                '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
                '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
                '<% fileSize = fileSize.toString(); %>\n' +
                '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
                '<div class="chat-attachment">\n' +
                '  <a href="<%= url %>" target="_blank">\n' +
                '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
                '      <img class="uploaded-image" src="<%= url %>"/>\n' +
                '    <% } else { %>\n' +
                '      <div class="attachment-placeholder">\n' +
                '        <div class="attachment-icon"></div>\n' +
                '      </div>\n' +
                '    <% } %>\n' +
                '  </a>\n' +
                '  <% if (caption) { %>\n' +
                '    <div class="attachment-caption">\n' +
                '      <%= caption %>\n' +
                '    </div>\n' +
                '  <% } %>\n' +
                '  <div class="attachment-timestamp">\n' +
                '    Téléchargé sur <%= dateString %>\n' +
                '  </div>\n' +
                '  <div class="attachment-size">\n' +
                '    <%= fileSize + \' \' + measurement %> \n' +
                '  </div>\n' +
                '</div>    \n';

        diff(htf.localizeText(translations, "fr-FR"), expected);
        expect(htf.localizeText(translations, "fr-FR")).toBe(expected);
    });

    test("HTMLTemplateFileParseWithHTMLInTheTemplateTag", function() {
        expect.assertions(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
                '<div class = "modal-title">\n' +
                '  Assumptions\n' +
                '</div>  \n' +
                '<div class="static_text clearfix">\n' +
                '    <p>\n' +
                '      <%=\n' +
                '        RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
                '          link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
                '          link_tag_end: \'</a>\'\n' +
                '        })\n' +
                '      %>\n' +
                '    \n' +
                '    </p>\n' +
                '    <br/>\n' +
                '    <ul class="fg-list" >\n' +
                '      <li>30% more customer interest</li>\n' +
                '      <li>20% more customer emails</li>\n' +
                '      <li>20% more customer tweets/social messages</li>\n' +
                '      <li>75% cost reduction for acquiring new customers</li>\n' +
                '    </ul>         \n' +
                '</div>\n');

        var set = htf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Assumptions");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Assumptions");
        expect(r.getKey()).toBe("Assumptions");

        r = set.getBySource('30% more customer interest');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('30% more customer interest');
        expect(r.getKey()).toBe('30% more customer interest');

        r = set.getBySource('75% cost reduction for acquiring new customers');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('75% cost reduction for acquiring new customers');
        expect(r.getKey()).toBe('75% cost reduction for acquiring new customers');
    });

    test("HTMLTemplateFileLocalizeTextWithEmbeddedTemplateTag", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<div class = "modal-title">\n' +
            '  Assumptions\n' +
            '</div>  \n' +
            '<div class="static_text clearfix">\n' +
            '    <p>\n' +
            '      <%=\n' +
            '        RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
            '          link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
            '          link_tag_end: \'</a>\'\n' +
            '        })\n' +
            '      %>\n' +
            '    \n' +
            '    </p>\n' +
            '    <br/>\n' +
            '    <ul class="fg-list" >\n' +
            '      <li>30% more customer interest</li>\n' +
            '      <li>20% more customer emails</li>\n' +
            '      <li>20% more customer tweets/social messages</li>\n' +
            '      <li>75% cost reduction for acquiring new customers</li>\n' +
            '    </ul>         \n' +
            '</div>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Assumptions',
            source: 'Assumptions',
            target: 'Téléchargé sur <%= dateString %>',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
                '<div class="modal-title">\n' +
                '  Téléchargé sur <%= dateString %>\n' +
                '</div>  \n' +
                '<div class="static_text clearfix">\n' +
                '    <p>\n' +
                '      <%=\n' +
                '        RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
                '          link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
                '          link_tag_end: \'</a>\'\n' +
                '        })\n' +
                '      %>\n' +
                '    \n' +
                '    </p>\n' +
                '    <br/>\n' +
                '    <ul class="fg-list">\n' +
                '      <li>30% more customer interest</li>\n' +
                '      <li>20% more customer emails</li>\n' +
                '      <li>20% more customer tweets/social messages</li>\n' +
                '      <li>75% cost reduction for acquiring new customers</li>\n' +
                '    </ul>         \n' +
                '</div>\n');

        expect(htf.localizeText(translations, "fr-FR")).toBe('<div class="modal-title">\n' +
                '  Téléchargé sur <%= dateString %>\n' +
                '</div>  \n' +
                '<div class="static_text clearfix">\n' +
                '    <p>\n' +
                '      <%=\n' +
                '        RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
                '          link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
                '          link_tag_end: \'</a>\'\n' +
                '        })\n' +
                '      %>\n' +
                '    \n' +
                '    </p>\n' +
                '    <br/>\n' +
                '    <ul class="fg-list">\n' +
                '      <li>30% more customer interest</li>\n' +
                '      <li>20% more customer emails</li>\n' +
                '      <li>20% more customer tweets/social messages</li>\n' +
                '      <li>75% cost reduction for acquiring new customers</li>\n' +
                '    </ul>         \n' +
                '</div>\n');
    });

    test("HTMLTemplateFileLocalizeTextBug1", function() {
        expect.assertions(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<%\n' +
            '  var person_obj = person_obj || {};\n' +
            '%>\n' +

            '<div class="refer-message">\n' +
            '  There are <%= avatar.count ? (\' the following avatars available. As a member of \' + avatars.type + \', your avatar must be unique within your group.\') : \'\' %>:\n' +
            '  <div class="specialist-result clearfix">\n' +
            '<% var imageStyle = specialist.avatar_transparent_circular ? "background-image: url(\'"+specialist.avatar_transparent_circular+ "\')" : "" %>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'There are <%= avatar.count ? (\' the following avatars available. As a member of \' + avatars.type + \', your avatar must be unique within your group.\') : \'\' %>:',
            source: 'There are <%= avatar.count ? (\' the following avatars available. As a member of \' + avatars.type + \', your avatar must be unique within your group.\') : \'\' %>:',
            target: 'Es gibt <%=  avatar.count ? (\' folgende Avatare. Als Mitglied der \' + avatars.type + \', Gruppe muss dein Avatar innerhalb der Gruppe einzigartig sein.\') : \'\' %>:',
            targetLocale: "de-DE",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "de-DE");
        var expected =
                '<%\n' +
                '  var person_obj = person_obj || {};\n' +
                '%>\n' +

                '<div class="refer-message">\n' +
                '  Es gibt <%=  avatar.count ? (\' folgende Avatare. Als Mitglied der \' + avatars.type + \', Gruppe muss dein Avatar innerhalb der Gruppe einzigartig sein.\') : \'\' %>:\n' +
                '  <div class="specialist-result clearfix">\n' +
                '<% var imageStyle = specialist.avatar_transparent_circular ? "background-image: url(\'"+specialist.avatar_transparent_circular+ "\')" : "" %>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileLocalizeTextBug2", function() {
        expect.assertions(2);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        expect(htf).toBeTruthy();

        htf.parse(
            '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
            '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
            '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
            '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
            '<% fileSize = fileSize.toString(); %>\n' +
            '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
            '\n' +
            '<div class="chat-attachment">\n' +
            '  <a href="<%= url %>" target="_blank">\n' +
            '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
            '      <img class="uploaded-image" src="<%= url %>" />\n' +
            '    <% } else { %>\n' +
            '      <div class="attachment-placeholder">\n' +
            '        <div class="attachment-icon"></div>\n' +
            '      </div>\n' +
            '    <% } %>\n' +
            '  </a>\n' +
            '  <% if (caption) { %>\n' +
            '    <div class="attachment-caption">\n' +
            '      <%= caption %>\n' +
            '    </div>\n' +
            '  <% } %>\n' +
            '  <div class="attachment-timestamp">\n' +
            '    Uploaded <%= dateString %>\n' +
            '  </div>\n' +
            '  <div class="attachment-size">\n' +
            '    <%= fileSize + \' \' + measurement %> \n' +
            '  </div>\n' +
            '</div>');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'Uploaded <%= dateString %>',
            source: 'Uploaded <%= dateString %>',
            target: 'Cargada <%= dateString %>',
            targetLocale: "es-US",
            datatype: "html"
        }));

        var actual = htf.localizeText(translations, "es-US");
        var expected =
            '<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
            '<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
            '<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
            '<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
            '<% fileSize = fileSize.toString(); %>\n' +
            '<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
            '\n' +
            '<div class="chat-attachment">\n' +
            '  <a href="<%= url %>" target="_blank">\n' +
            '    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
            '      <img class="uploaded-image" src="<%= url %>"/>\n' +
            '    <% } else { %>\n' +
            '      <div class="attachment-placeholder">\n' +
            '        <div class="attachment-icon"></div>\n' +
            '      </div>\n' +
            '    <% } %>\n' +
            '  </a>\n' +
            '  <% if (caption) { %>\n' +
            '    <div class="attachment-caption">\n' +
            '      <%= caption %>\n' +
            '    </div>\n' +
            '  <% } %>\n' +
            '  <div class="attachment-timestamp">\n' +
            '    Cargada <%= dateString %>\n' +
            '  </div>\n' +
            '  <div class="attachment-size">\n' +
            '    <%= fileSize + \' \' + measurement %> \n' +
            '  </div>\n' +
            '</div>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("HTMLTemplateFileExtractFileFullyExtracted", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/meeting_panel.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(5);

        var r = set.getBySource("Upcoming Appointments\n      <%= upcoming_meetings.length %>");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Upcoming Appointments\n      <%= upcoming_meetings.length %>");
        expect(r.getKey()).toBe("Upcoming Appointments <%= upcoming_meetings.length %>");
        r = set.getBySource("Completed Meetings");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Completed Meetings");
        expect(r.getKey()).toBe("Completed Meetings");

        r = set.getBySource("Get help");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Get help");
        expect(r.getKey()).toBe("Get help");

        r = set.getBySource("Colleagues are standing by to help");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Colleagues are standing by to help");
        expect(r.getKey()).toBe("Colleagues are standing by to help");

        r = set.getBySource("Ask your co-workers now");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ask your co-workers now");
        expect(r.getKey()).toBe("Ask your co-workers now");
    });

    test("HTMLTemplateFileExtractFileFullyExtracted2", function() {
        expect.assertions(8);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/mode.tmpl.html");
        expect(htf).toBeTruthy();

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.getBySource("Choose a meeting method");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Choose a meeting method");
        expect(r.getKey()).toBe("Choose a meeting method");

        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Test phrase");
        expect(r.getKey()).toBe("Test phrase");
    });

    test("HTMLTemplateFileExtractFileNewResources", function() {
        expect.assertions(10);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var t = new HTMLTemplateFileType(p);

        var htf = new HTMLTemplateFile(p, "./tmpl/mode.tmpl.html", t);
        expect(htf).toBeTruthy();

        htf.extract();

        var translations = new TranslationSet();

        translations.add(new ResourceString({
            project: "foo",
            key: "Choose a meeting method",
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
            '          <img src="<%= photo %>" height="86px" width="86px"/>\n' +
            '        </div>\n' +
            '        <div class="dot<%= (availability == \'available\') ? \' on\' : \'\' %>"></div>\n' +
            '      </div>\n' +
            '      <div class="rating">\n' +
            '        <% $.each(stars, function(i, star) { %>\n' +
            '        <div class="star <%= star %>"></div>\n' +
            '        <% }); %>\n' +
            '      </div>\n' +
            '      <div class="name"><%= name %></div>\n' +
            '      <div class="specialty"><%= specialty %></div>\n' +
            '      <% $.each(supplementary_descriptions, function(index, desc) { %>\n' +
            '      <div class="addInfo"><%= desc %></div>\n' +
            '      <% }); %>\n' +
            '      [Ťëšţ þĥŕàšë543210]\n' +
            '    </div>\n' +
            '    <div class="modeSelection">\n' +
            '      <% $.each(modes, function(index, mode) { %>\n' +
            '      <%= (index > 0) ? \'-->\' : \'\' %><div class="mode <%= mode.type %><%= mode.active ? \'\' : \' inactive\' %>" data-type="<%= mode.type %>">\n' +
            '        <div class="modeContents">\n' +
            '          <h4><%= mode.title %></h4>\n' +
            '          <p class="description"><%= mode.description %></p>\n' +
            '          <% if (mode.price) { %>\n' +
            '          <p> <%= RB.getString("Starting at {currency_symbol}{price}").format({currency_symbol: currency_symbol, price: mode.price}) %></p>\n' +
            '          <% } %>\n' +
            '          <% if (mode.message) { %>\n' +
            '          <p class="warn"><%= mode.message %></p>\n' +
            '          <% } %>\n' +
            '        </div>\n' +
            '      </div><div class="divider"></div><%= (index < modes.length - 1) ? \'<!--\' : \'\' %>\n' +
            '      <% }); %>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '  <div class="pageFooter"></div>\n' +
            '</div>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);

        var set = t.newres;
        var resources = set.getAll();

        expect(resources.length).toBe(1);

        var r = set.getBySource("Choose a meeting method");
        expect(r).toBeFalsy();
        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(resources[0].getKey()).toBe("Test phrase");
        expect(resources[0].getSource()).toBe("Test phrase");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Test phrase");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");
    });
});
