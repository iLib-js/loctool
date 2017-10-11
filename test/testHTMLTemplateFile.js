/*
 * testHTMLTemplateFile.js - test the HTML template file handler object.
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

module.exports = {
    testHTMLTemplateFileConstructor: function(test) {
        test.expect(1);

        var htf = new HTMLTemplateFile();
        test.ok(htf);

        test.done();
    },

    testHTMLTemplateFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./testfiles/tmpl/CookieFlowTemplate.tmpl.html");

        test.ok(htf);

        test.done();
    },

    testHTMLTemplateFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        test.done();
    },

    testHTMLTemplateFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This is a test"), "This is a test");

        test.done();
    },

    testHTMLTemplateFileMakeKeyNoReturnChars: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This is\n a te\nst"), "This is a te st");

        test.done();
    },

    testHTMLTemplateFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("This \t is\n \t a   test"), "This is a test");

        test.done();
    },

    testHTMLTemplateFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        test.equal(htf.makeKey("\n\t This \t is\n \t a   test\n\n\n"), "This is a test");

        test.done();
    },

    testHTMLTemplateFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "This is a test", "html"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testHTMLTemplateFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html><body>This is a test</body></html>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testHTMLTemplateFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testHTMLTemplateFileParseDontExtractUnicodeWhitespace: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('<div>            ​‌‍ ⁠⁡⁢⁣⁤</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileParseDontExtractNbspEntity: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<div>&nbsp; &nnbsp; &mmsp;</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileParseDoExtractOtherEntities: function(test) {
        test.expect(3);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<div>&uuml;</div>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLTemplateFileParseNoStrings: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<div class="noheader medrx"></div>');

        var set = htf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        var set = htf.getTranslationSet();
        test.equal(set.size(), 0);

        htf.parse('<html><body>This is a test</body></html>');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLTemplateFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");

        test.done();
    },

    testHTMLTemplateFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        test.equal(set.size(), 2);

        test.done();
    },

    testHTMLTemplateFileParseEscapeInvalidChars: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is also a &#3; test");

        test.done();
    },

    testHTMLTemplateFileParseDontEscapeWhitespaceChars: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is also a test");

        test.done();
    },

    testHTMLTemplateFileParseSkipTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.ok(set);

        var r = set.get(ResourceString.hashKey(undefined, "en-US", "Uploaded", "html"));
        test.ok(r);

        test.equal(r.getSource(), "Uploaded");
        test.equal(r.getKey(), "Uploaded");

        test.done();
    },

    testHTMLTemplateFileSkipScript: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        var r = set.getBySource("// comment text");
        test.ok(!r);

        var r = set.getBySource("bar");
        test.ok(!r);

        test.equal(set.size(), 1);

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a <em>test</em> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <em>test</em> of the emergency parsing system.");
        test.equal(r.getKey(), "This is a<em>test</em>of the emergency parsing system.");

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsOutside: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsInside: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        test.equal(r.getKey(), 'This is<span id="foo" class="bar">a test of the emergency parsing</span>system.');

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsInsideMultiple: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // tags should be nestable
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        test.equal(r.getKey(), 'This is<span id="foo" class="bar">a test of the<em>emergency</em>parsing</span>system.');

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsNotWellFormed: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        test.equal(r.getKey(), 'This is<span id="foo" class="bar">a test of the<em>emergency parsing</span>system.');

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        // the end div tag ends all the other tags
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        test.equal(r.getKey(), 'This is<span id="foo" class="bar">a test of the<em>emergency parsing');

        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsTagStackIsReset: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        var r = set.getBySource('This is <b>another test</b> of the emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <b>another test</b> of the emergency parsing');
        test.equal(r.getKey(), 'This is<b>another test</b>of the emergency parsing');

        test.done();
    },

    testHTMLTemplateFileParseLocalizableTitle: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        r = set.getBySource("This value is localizable");
        test.ok(r);
        test.equal(r.getSource(), "This value is localizable");
        test.equal(r.getKey(), "This value is localizable");

        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributes: function(test) {
        test.expect(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        r = set.getBySource("Alternate text");
        test.ok(r);
        test.equal(r.getSource(), "Alternate text");
        test.equal(r.getKey(), "Alternate text");

        r = set.getBySource("localizable placeholder here");
        test.ok(r);
        test.equal(r.getSource(), "localizable placeholder here");
        test.equal(r.getKey(), "localizable placeholder here");

        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributesSkipEmpty: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.equal(r.getKey(), 'This is<a href="foo.html" title="{title}">a test</a>of non-breaking tags.');

        r = set.getBySource("localizable title");
        test.ok(r);
        test.equal(r.getSource(), "localizable title");
        test.equal(r.getKey(), "localizable title");

        test.done();
    },

    testHTMLTemplateFileParseBreakBetweenTemplateTags: function(test) {
        test.expect(8);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.ok(set);

        var r = set.getBySource('Consult');
        test.ok(r);
        test.equal(r.getSource(), 'Consult');
        test.equal(r.getKey(), 'Consult');

        r = set.getBySource("Get insurance quotes for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get insurance quotes for free!");
        test.equal(r.getKey(), "Get insurance quotes for free!");

        test.done();
    },

    testHTMLTemplateFileParseDontBreakBetweenTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Mr. <%= family_name %> is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Mr. <%= family_name %> is not available.');

        test.done();
    },

    testHTMLTemplateFileParseDontIncludeStartingTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <%= greeting %> Your friend is not available.\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Your friend is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Your friend is not available.');
        test.equal(r.getKey(), 'Your friend is not available.');

        test.done();
    },

    testHTMLTemplateFileParseDontIncludeEndingTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       Your friend is not available. <%= until_when %>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Your friend is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Your friend is not available.');
        test.equal(r.getKey(), 'Your friend is not available.');

        test.done();
    },

    testHTMLTemplateFileParseTemplateTagsInsideTags: function(test) {
        test.expect(5);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %>class="foo"<% } %>> Mr. <%= family_name %> is not available.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Mr. <%= family_name %> is not available.');

        test.done();
    },

    testHTMLTemplateFileParseI18NComments: function(test) {
        test.expect(6);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");
        test.equal(r.getComment(), "this describes the text below");

        test.done();
    },

    testHTMLTemplateFileParseIgnoreTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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
        test.equal(r.getKey(), "foo");

        test.done();
    },

    testHTMLTemplateFileExtractFile: function(test) {
        test.expect(14);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowTemplate.tmpl.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 4);

        var r = set.getBySource("Get insurance quotes for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get insurance quotes for free!");
        test.equal(r.getKey(), "Get insurance quotes for free!");

        r = set.getBySource("Talk");
        test.ok(r);
        test.equal(r.getSource(), "Talk");
        test.equal(r.getKey(), "Talk");

        r = set.getBySource("Send question");
        test.ok(r);
        test.equal(r.getSource(), "Send question");
        test.equal(r.getKey(), "Send question");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "Ask");

        test.done();
    },

    testHTMLTemplateFileExtractFile2: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/topic_navigation_main.tmpl.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("Description");
        test.ok(r);
        test.equal(r.getSource(), "Description");
        test.equal(r.getKey(), "Description");

        r = set.getBySource('Authored by');
        test.ok(r);
        test.equal(r.getSource(), 'Authored by');
        test.equal(r.getKey(), 'Authored by');

        r = set.getBySource('Agreed');
        test.ok(r);
        test.equal(r.getSource(), 'Agreed');
        test.equal(r.getKey(), 'Agreed');

        r = set.getBySource('and <a class="bold"><span class="friend_agree_count_h"><%=val.desc_agrees.length%></span> of your friends agree</a>');
        test.ok(r);
        test.equal(r.getSource(), 'and <a class="bold"><span class="friend_agree_count_h"><%=val.desc_agrees.length%></span> of your friends agree</a>');
        test.equal(r.getKey(), 'and<a class="bold"><span class="friend_agree_count_h"><%=val.desc_agrees.length%></span>of your friends agree</a>');

        r = set.getBySource("Write a better description &raquo;");
        test.ok(r);
        test.equal(r.getSource(), "Write a better description &raquo;");
        test.equal(r.getKey(), "Write a better description &raquo;");

        test.done();
    },

    testHTMLTemplateFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/bogus.tmpl.html");
        test.ok(htf);

        // should attempt to read the file and not fail
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileLocalizeText: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextPreserveWhitespace: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextPreserveSelfClosingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextWithDups: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextSkipScript: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTagsOutside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTagsInside: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTagsInsideMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormed: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextLocalizableTitle: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextLocalizableAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextBreakBetweenTemplateTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
            '<html>\n' +
            '   <body>\n' +
            '       <% if(specialist){ %>\n' +
            '           Une consultation\n' +
            '       <% } else { %>\n' +
            '           Obtenez des devis d\'assurance gratuitement!\n' +
            '       <% } %>\n' +
            '   </body>\n' +
            '</html>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextDontBreakBetweenTemplateEchoTags: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       Mr. <%= family_name %> n\'est pas disponibles.\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextI18NComments: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextIdentifyResourceIds: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextIdentifyResourceIdsWithAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"],
            identify: true
        });

        var htf = new HTMLTemplateFile(p);
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

    testHTMLTemplateFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "simple.tmpl.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/simple.fr-FR.tmpl.html");

        test.done();
    },

    testHTMLTemplateFileGetLocalizedPathComplex: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.tmpl.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.tmpl.html");

        test.done();
    },

    testHTMLTemplateFileGetLocalizedPathRegularHTMLFileName: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.html");

        test.done();
    },

    testHTMLTemplateFileGetLocalizedPathNotEnoughParts: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR");

        test.done();
    },

    testHTMLTemplateFileGetLocalizedSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.en-US.tmpl.html");
        test.ok(htf);

        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.tmpl.html");

        test.done();
    },

    testHTMLTemplateFileLocalize: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowTemplate.tmpl.html");
        test.ok(htf);

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

        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.fr-FR.tmpl.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.de-DE.tmpl.html")));

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
            '      <div class="upsell-ad-wrapper" style="<%= specialist ? \'\' : \'padding-left: 0\' %>">\n' +
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
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/tmpl/CookieFlowTemplate.de-DE.tmpl.html"), "utf-8");

        test.equal(content,
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
            '            Beratung\n' +
            '          <% } else { %>\n' +
            '            Kostenlosen Versicherungs-Angebote erhalten!\n' +
            '          <% } %>\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="<%= specialist ? \'\' : \'padding-left: 0\' %>">\n' +
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

        test.done();
    },

    testHTMLTemplateFileLocalizeNoStrings: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/nostrings.tmpl.html");
        test.ok(htf);

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
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.fr-FR.tmpl.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.de-DE.tmpl.html")));

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %>class="foo"<% } %>> Mr. <%= family_name %> is not available.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Mr. <%= family_name %> is not available.');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Mr. <%= family_name %> is not available.',
            source: 'Mr. <%= family_name %> is not available.',
            target: 'Mssr. <%= family_name %> n\'est pas disponible.',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<html>\n' +
                '   <body>\n' +
                '       <span <% if (condition) { %> class="foo" <% } %>> Mssr. <%= family_name %> n\'est pas disponible.</span>\n' +
                '   </body>\n' +
                '</html>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<html>\n' +
                '   <body>\n' +
                '       <span class="foo" <span class="bar"> Mr. <%= family_name %> is not available.</span></span>\n' +
                '   </body>\n' +
                '</html>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Mr. <%= family_name %> is not available.');

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
        test.equal(actual, expected);
        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags2: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse(
            '<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(specialist.entity_type == \'group\'){ %>checked=yes<% } %> >\n' +
            '<label for="entity_group" class="radio-label">Group</label>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Group');
        test.ok(r);
        test.equal(r.getSource(), 'Group');
        test.equal(r.getKey(), 'Group');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'Group',
            source: 'Group',
            target: 'Groupe',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(specialist.entity_type == \'group\'){ %> checked=yes <% } %>>\n' +
                '<label for="entity_group" class="radio-label">Groupe</label>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags3: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse(
            '    <select class=\'end_hour\' value=<%=end_hour%>>\n' +
            '      foo\n' +
            '    </select>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '    <select class=\'end_hour\' value=<%=end_hour%>>\n' +
                '      asdf\n' +
                '    </select>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags4: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse(
            '<span has-sub-options = <%= option.sub_options.length > 0 %> data-tracking-value = "<%= option.tracking_value%>" >\n' +
            '    foo\n' +
            '</span>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<span has-sub-options=<%= option.sub_options.length > 0 %> data-tracking-value="<%= option.tracking_value%>">\n' +
                '    asdf\n' +
                '</span>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags5: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<a class="specialist-name" href=<%= val.specialist.url%>>foo</a>\n');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<a class="specialist-name" href=<%= val.specialist.url%>>asdf</a>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags6: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.ok(set);

        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');

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
        test.equal(actual, expected);

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags7: function(test) {
        test.expect(6);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nfoo\n</div>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nasdf\n</div>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags8: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('<div class="star <%= (score > 30) ? "filled-star" : (score > 20) ? "half-star" : "empty-star"%>">foo</div>');

        var set = htf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "webapp",
            key: 'foo',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "html"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
                '<div class="star <%= (score > 30) ? "filled-star" : (score > 20) ? "half-star" : "empty-star"%>">asdf</div>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags9: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse(
                '  <% if(two_buttons){ %>\n' +
                '    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
                '    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
                '  <% } else { %>\n' +
                '    <div class="btn grey confirm-btn" style="width: 93%" ><%= confirm_btn.text %></div>\n' +
                '  <% } %>');

        var set = htf.getTranslationSet();
        test.ok(set);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
                '  <% if(two_buttons){ %>\n' +
                '    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
                '    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
                '  <% } else { %>\n' +
                '    <div class="btn grey confirm-btn" style="width: 93%"><%= confirm_btn.text %></div>\n' +
                '  <% } %>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotes: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');

        var set = htf.getTranslationSet();
        test.ok(set);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTags: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>foo</span>');

        var set = htf.getTranslationSet();
        test.ok(set);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>asdf</span>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTagsWithPercentInThem: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        htf.parse('  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>foo</span>');

        var set = htf.getTranslationSet();
        test.ok(set);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
                '  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>asdf</span>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextIgnoreScriptTags: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        test.equal(htf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testHTMLTemplateFileLocalizeTextIgnoreStyleTags: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
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

        test.equal(htf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testHTMLTemplateFileLocalizeTextWithEmbeddedTemplateTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.equal(htf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testHTMLTemplateFileParseWithHTMLInTheTemplateTag: function(test) {
        test.expect(11);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.ok(set);

        var r = set.getBySource("Assumptions");
        test.ok(r);
        test.equal(r.getSource(), "Assumptions");
        test.equal(r.getKey(), "Assumptions");

        r = set.getBySource('30% more customer interest');
        test.ok(r);
        test.equal(r.getSource(), '30% more customer interest');
        test.equal(r.getKey(), '30% more customer interest');

        r = set.getBySource('75% cost reduction for acquiring new customers');
        test.ok(r);
        test.equal(r.getSource(), '75% cost reduction for acquiring new customers');
        test.equal(r.getKey(), '75% cost reduction for acquiring new customers');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextWithEmbeddedTemplateTag: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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

        test.equal(htf.localizeText(translations, "fr-FR"),
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

        test.done();
    },

    testHTMLTemplateFileLocalizeTextBug1: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            id: "foo"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
        test.equal(actual, expected);

        test.done();
    },

    testHTMLTemplateFileLocalizeTextBug2: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

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
            key: 'Uploaded',
            source: 'Uploaded',
            target: 'Cargada',
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
        test.equal(actual, expected);

        test.done();
    },

    testHTMLTemplateFileExtractFileFullyExtracted: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/meeting_panel.tmpl.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("Upcoming Appointments");
        test.ok(r);
        test.equal(r.getSource(), "Upcoming Appointments");
        test.equal(r.getKey(), "Upcoming Appointments");

        r = set.getBySource("Completed Meetings");
        test.ok(r);
        test.equal(r.getSource(), "Completed Meetings");
        test.equal(r.getKey(), "Completed Meetings");

        r = set.getBySource("Get help");
        test.ok(r);
        test.equal(r.getSource(), "Get help");
        test.equal(r.getKey(), "Get help");

        r = set.getBySource("Colleagues are standing by to help");
        test.ok(r);
        test.equal(r.getSource(), "Colleagues are standing by to help");
        test.equal(r.getKey(), "Colleagues are standing by to help");

        r = set.getBySource("Ask your co-workers now");
        test.ok(r);
        test.equal(r.getSource(), "Ask your co-workers now");
        test.equal(r.getKey(), "Ask your co-workers now");

        test.done();
    },

    testHTMLTemplateFileExtractFileFullyExtracted2: function(test) {
        test.expect(8);

        var base = path.dirname(module.id);

        var p = new WebProject({
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var htf = new HTMLTemplateFile(p, "./tmpl/mode.tmpl.html");
        test.ok(htf);

        // should read the file
        htf.extract();

        var set = htf.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("Choose a meeting method");
        test.ok(r);
        test.equal(r.getSource(), "Choose a meeting method");
        test.equal(r.getKey(), "Choose a meeting method");

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(r.getSource(), "Test phrase");
        test.equal(r.getKey(), "Test phrase");

        test.done();
    },

    testHTMLTemplateFileExtractFileNewResources: function(test) {
        test.expect(10);

        var base = path.dirname(module.id);

        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US"
        }, path.join(base, "testfiles"), {
            locales:["en-GB"]
        });

        var t = new HTMLTemplateFileType(p);

        var htf = new HTMLTemplateFile(p, "./tmpl/mode.tmpl.html", t);
        test.ok(htf);

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
            '      Ťëšţ þĥŕàšë543210\n' +
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
        test.equal(actual, expected);

        var set = t.newres;
        var resources = set.getAll();

        test.equal(resources.length, 1);

        var r = set.getBySource("Choose a meeting method");
        test.ok(!r);

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(resources[0].getKey(), "Test phrase");
        test.equal(resources[0].getSource(), "Test phrase");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "Test phrase");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        test.done();
    }
};
