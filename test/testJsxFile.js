/*
 * testJsxFile.js - test the React jsx file handler object.
 *
 * Copyright © 2018, HealthTap, Inc.
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

if (!JsxFile) {
    var JsxFile = require("../lib/JsxFile.js");
    var JsxFileType = require("../lib/JsxFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

var p = new WebProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var jsft = new JsxFileType(p);

module.exports.jsxfile = {
    testJsxFileConstructor: function(test) {
        test.expect(1);

        var j = new JsxFile();
        test.ok(j);

        test.done();
    },

    testJsxFileConstructorParams: function(test) {
        test.expect(1);

        var j = new JsxFile(p, "./testfiles/js/t1.jsx", jsft);

        test.ok(j);

        test.done();
    },

    testJsxFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        test.done();
    },

    testJsxFileMakeKey: function(test) {
        test.expect(2);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        test.equal(j.makeKey("This is a test"), "This is a test");

        test.done();
    },

    testJsxFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "This is a test"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseJSSimpleGetBySource: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('   <Translate>    \t This is a test  </Translate>  ');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseSimpleIgnoreReturnChars: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('   <Translate>\n' +
                '     This is a test\n' +
                '   </Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseJSCompressWhitespaceInKey: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>\t\t This \\n \n is \\\n\t a    test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.done();
    },

    testJsxFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('<Translate>This is a test</Translate>');

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testJsxFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate> { /* i18n: this is a translator\'s comment */ }\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testJsxFileParseWithParameters: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse(
            '    <Translate prefix={detail.name_prefix} last_name={detail.last_name}>\n' +
            '      We will notify you when [[prefix]] [[last_name]] accepts you as a friend!\n' +
            '    </Translate>\n'
        );

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("We will notify you when {prefix} {last_name} accepts you as a friend!");
        test.ok(r);
        test.equal(r.getSource(), "We will notify you when {prefix} {last_name} accepts you as a friend!");
        test.equal(r.getKey(), "We will notify you when {prefix} {last_name} accepts you as a friend!");

        test.done();
    },

    testJsxFileParseWithEmbeddedEntities: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse(
            '    <Translate>We&apos;ll notify you when &quot;your friend&quot; accepts you as a friend!</Translate>'
        );

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("We'll notify you when \"your friend\" accepts you as a friend!");
        test.ok(r);
        test.equal(r.getSource(), "We'll notify you when \"your friend\" accepts you as a friend!");
        test.equal(r.getKey(), "We'll notify you when \"your friend\" accepts you as a friend!");

        test.done();
    },

    testJsxFileParseWithEmbeddedHTMLElements: function(test) {
        test.expect(5);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse(
            '    <Translate>We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!</Translate>'
        );

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');
        test.ok(r);
        test.equal(r.getSource(), 'We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');
        test.equal(r.getKey(), 'We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');

        test.done();
    },

    testJsxFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('\tconst x = (<Translate key="foobar">This is a test</Translate>); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "foobar"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "foobar");
        test.equal(r[0].getComment(), "this is a translator's comment");

        test.done();
    },

    testJsxFileParseSimpleWithUniqueIdAndTranslatorCommentParam: function(test) {
        test.expect(6);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('\tconst x = (<Translate key="foobar" comment="this is a translator\'s comment">This is a test</Translate>);\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "foobar"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "foobar");
        test.equal(r[0].getComment(), "this is a translator's comment");

        test.done();
    },

    testJsxFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate key="unique_id">This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(!r);

        test.done();
    },

    testJsxFileParseMultiple: function(test) {
        test.expect(8);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>\n' +
                '\t<Translate>This is another test</Translate>\n' +
                '\t\t<Translate>This is also a test</Translate>;');

        var set = j.getTranslationSet();
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

    testJsxFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate key="x">This is a test</Translate>\n' +
                '\t<Translate>This is another test</Translate>\n' +
                '\t\t<Translate key="y">This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "x"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "x");

        r = set.getBy({
            reskey: "y"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "y");

        test.done();
    },

    testJsxFileParseNestedTranslate: function(test) {
        test.expect(2);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        test.throws(function() {
            j.parse('<Translate key="x">This is a test <Translate>This is another test</Translate> This is a test</Translate>');
        });

        test.done();
    },

    testJsxFileParseMultipleSameLine: function(test) {
        test.expect(12);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate> <Translate>This is a second test</Translate> <Translate>This is a third test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        r = set.getBySource("This is a second test");
        test.ok(r);
        test.equal(r.getSource(), "This is a second test");
        test.equal(r.getKey(), "This is a second test");

        r = set.getBySource("This is a third test");
        test.ok(r);
        test.equal(r.getSource(), "This is a third test");
        test.equal(r.getKey(), "This is a third test");

        test.done();
    },

    testJsxFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate> { // i18n: foo\n\t}\n\t<Translate>This is another test</Translate>\n\t\t<Translate>This is also a test</Translate>\t{ /* i18n: bar */ }\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testJsxFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate key="asdf">This is a test</Translate> { /* i18n: foo */ }\n\t<Translate>This is another test</Translate>\n\t\t<Translate key="kdkdkd">This is also a test</Translate>\t { /* i18n: bar */ }\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "asdf"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "asdf");
        test.equal(r[0].getComment(), "foo");

        r = set.getBy({
            reskey: "kdkdkd"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is also a test");
        test.equal(r[0].getKey(), "kdkdkd");
        test.equal(r[0].getComment(), "bar");

        test.done();
    },

    testJsxFileParseWithDups: function(test) {
        test.expect(6);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>\n\t<Translate>This is another test.</Translate>\n\t\t<Translate>This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        test.equal(set.size(), 2);

        test.done();
    },

    testJsxFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate>This is a test</Translate>\n\t<Translate>This is another test.</Translate>\n\t\t<Translate key="unique_id">This is a test</Translate>');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        r = set.getBy({
            reskey: "unique_id"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "unique_id");

        test.done();
    },

    testJsxFileParseEmbeddedReplacement: function(test) {
        test.expect(3);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        test.throws(function() {
            j.parse('<Translate>This is a {test} and this isnt</Translate>');
        });

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testJsxFileParseBogusNonStringParam: function(test) {
        test.expect(3);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        test.throws(function() {
            j.parse('<Translate>[[test]]</Translate>');
        });

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testJsxFileParseEmptyParams: function(test) {
        test.expect(2);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        j.parse('<Translate></Translate>');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testJsxFileExtractFile: function(test) {
        test.expect(8);

        var j = new JsxFile(p, "./js/t1.jsx", jsft);
        test.ok(j);

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        var r = set.getBy({
            reskey: "id1"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test with a unique id");
        test.equal(r[0].getKey(), "id1");

        test.done();
    },

    testJsxFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var j = new JsxFile(p, undefined, jsft);
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testJsxFileExtractBogusFile: function(test) {
        test.expect(2);

        var j = new JsxFile(p, "./java/foo.jsx", jsft);
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    }
};
