/*
 * JsxFile.test.js - test the React jsx file handler object.
 *
 * Copyright © 2018, 2023 HealthTap, Inc.
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
}, "./test/testfiles", {
    locales:["en-GB"]
});
var jsft = new JsxFileType(p);
describe("jsxfile", function() {
    test("JsxFileConstructor", function() {
        expect.assertions(1);
        var j = new JsxFile();
        expect(j).toBeTruthy();
    });
    test("JsxFileConstructorParams", function() {
        expect.assertions(1);
        var j = new JsxFile(p, "./test/testfiles/js/t1.jsx", jsft);
        expect(j).toBeTruthy();
    });
    test("JsxFileConstructorNoFile", function() {
        expect.assertions(1);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
    });
    test("JsxFileMakeKey", function() {
        expect.assertions(2);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        expect(j.makeKey("This is a test")).toBe("This is a test");
    });
    test("JsxFileParseSimpleGetByKey", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
    });
    test("JsxFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JsxFileParseJSSimpleGetBySource", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JsxFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('   <Translate>    \t This is a test  </Translate>  ');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JsxFileParseSimpleIgnoreReturnChars", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('   <Translate>\n' +
                '     This is a test\n' +
                '   </Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JsxFileParseJSCompressWhitespaceInKey", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>\t\t This \\n \n is \\\n\t a    test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JsxFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
        j.parse('<Translate>This is a test</Translate>');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("JsxFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate> { /* i18n: this is a translator\'s comment */ }\n\tfoo("This is not");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });
    test("JsxFileParseWithParameters", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse(
            '    <Translate prefix={detail.name_prefix} last_name={detail.last_name}>\n' +
            '      We will notify you when [[prefix]] [[last_name]] accepts you as a friend!\n' +
            '    </Translate>\n'
        );
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("We will notify you when {prefix} {last_name} accepts you as a friend!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We will notify you when {prefix} {last_name} accepts you as a friend!");
        expect(r.getKey()).toBe("We will notify you when {prefix} {last_name} accepts you as a friend!");
    });
    test("JsxFileParseWithEmbeddedEntities", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse(
            '    <Translate>We&apos;ll notify you when &quot;your friend&quot; accepts you as a friend!</Translate>'
        );
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("We'll notify you when \"your friend\" accepts you as a friend!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We'll notify you when \"your friend\" accepts you as a friend!");
        expect(r.getKey()).toBe("We'll notify you when \"your friend\" accepts you as a friend!");
    });
    test("JsxFileParseWithEmbeddedHTMLElements", function() {
        expect.assertions(5);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse(
            '    <Translate>We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!</Translate>'
        );
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');
        expect(r.getKey()).toBe('We will <span class="foo">notify <br/>you</span> when your friend accepts you as a <b>friend</b>!');
    });
    test("JsxFileParseSimpleWithUniqueIdAndTranslatorComment", function() {
        expect.assertions(6);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('\tconst x = (<Translate key="foobar">This is a test</Translate>); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "foobar"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("foobar");
        expect(r[0].getComment()).toBe("this is a translator's comment");
    });
    test("JsxFileParseSimpleWithUniqueIdAndTranslatorCommentParam", function() {
        expect.assertions(6);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('\tconst x = (<Translate key="foobar" comment="this is a translator\'s comment">This is a test</Translate>);\n\tfoo("This is not");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "foobar"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("foobar");
        expect(r[0].getComment()).toBe("this is a translator's comment");
    });
    test("JsxFileParseWithKeyCantGetBySource", function() {
        expect.assertions(3);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate key="unique_id">This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(!r).toBeTruthy();
    });
    test("JsxFileParseMultiple", function() {
        expect.assertions(8);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>\n' +
                '\t<Translate>This is another test</Translate>\n' +
                '\t\t<Translate>This is also a test</Translate>;');
        var set = j.getTranslationSet();
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
    test("JsxFileParseMultipleWithKey", function() {
        expect.assertions(10);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate key="x">This is a test</Translate>\n' +
                '\t<Translate>This is another test</Translate>\n' +
                '\t\t<Translate key="y">This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "x"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("x");
        r = set.getBy({
            reskey: "y"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("y");
    });
    test("JsxFileParseNestedTranslate", function() {
        expect.assertions(2);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        expect(function() {
            j.parse('<Translate key="x">This is a test <Translate>This is another test</Translate> This is a test</Translate>');
        }).toThrow();
    });
    test("JsxFileParseMultipleSameLine", function() {
        expect.assertions(12);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate> <Translate>This is a second test</Translate> <Translate>This is a third test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        r = set.getBySource("This is a second test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a second test");
        expect(r.getKey()).toBe("This is a second test");
        r = set.getBySource("This is a third test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a third test");
        expect(r.getKey()).toBe("This is a third test");
    });
    test("JsxFileParseMultipleWithComments", function() {
        expect.assertions(10);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate> { // i18n: foo\n\t}\n\t<Translate>This is another test</Translate>\n\t\t<Translate>This is also a test</Translate>\t{ /* i18n: bar */ }\n');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("foo");
        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
        expect(r.getComment()).toBe("bar");
    });
    test("JsxFileParseMultipleWithUniqueIdsAndComments", function() {
        expect.assertions(10);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate key="asdf">This is a test</Translate> { /* i18n: foo */ }\n\t<Translate>This is another test</Translate>\n\t\t<Translate key="kdkdkd">This is also a test</Translate>\t { /* i18n: bar */ }\n');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "asdf"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("asdf");
        expect(r[0].getComment()).toBe("foo");
        r = set.getBy({
            reskey: "kdkdkd"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is also a test");
        expect(r[0].getKey()).toBe("kdkdkd");
        expect(r[0].getComment()).toBe("bar");
    });
    test("JsxFileParseWithDups", function() {
        expect.assertions(6);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>\n\t<Translate>This is another test.</Translate>\n\t\t<Translate>This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(set.size()).toBe(2);
    });
    test("JsxFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate>This is a test</Translate>\n\t<Translate>This is another test.</Translate>\n\t\t<Translate key="unique_id">This is a test</Translate>');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("JsxFileParseEmbeddedReplacement", function() {
        expect.assertions(3);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        expect(function() {
            j.parse('<Translate>This is a {test} and this isnt</Translate>');
        }).toThrow();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JsxFileParseBogusNonStringParam", function() {
        expect.assertions(3);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        expect(function() {
            j.parse('<Translate>[[test]]</Translate>');
        }).toThrow();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JsxFileParseEmptyParams", function() {
        expect.assertions(2);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        j.parse('<Translate></Translate>');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JsxFileExtractFile", function() {
        expect.assertions(8);
        var j = new JsxFile(p, "./js/t1.jsx", jsft);
        expect(j).toBeTruthy();
        // should read the file
        j.extract();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(2);
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        var r = set.getBy({
            reskey: "id1"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test with a unique id");
        expect(r[0].getKey()).toBe("id1");
    });
    test("JsxFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var j = new JsxFile(p, undefined, jsft);
        expect(j).toBeTruthy();
        // should attempt to read the file and not fail
        j.extract();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JsxFileExtractBogusFile", function() {
        expect.assertions(2);
        var j = new JsxFile(p, "./java/foo.jsx", jsft);
        expect(j).toBeTruthy();
        // should attempt to read the file and not fail
        j.extract();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
});
