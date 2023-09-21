/*
 * ObjectiveCFile.test.js - test the Objective C file handler object.
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

if (!ObjectiveCFile) {
    var ObjectiveCFile = require("../lib/ObjectiveCFile.js");
    var ObjectiveCFileType = require("../lib/ObjectiveCFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

var p = new ObjectiveCProject({
    id: "ios",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var ocft = new ObjectiveCFileType(p);

describe("objectivecfile", function() {
    test("ObjectiveCFileConstructor", function() {
        expect.assertions(1);

        var j = new ObjectiveCFile();
        expect(j).toBeTruthy();
    });

    test("ObjectiveCFileConstructorParams", function() {
        expect.assertions(1);
        var j = new ObjectiveCFile(p, "./test/testfiles/objc/t1.m", ocft, ocft);
        expect(j).toBeTruthy();
    });

    test("ObjectiveCFileConstructorNoFile", function() {
        expect.assertions(1);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();
    });

    test("ObjectiveCFileMakeKey", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This is a test")).toBe("This is a test");
    });

    test("ObjectiveCFileMakeKeyNewLines", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This is a\\ntest")).toBe("This is a\\ntest");
    });

    test("ObjectiveCFileParseSimpleGetByKey", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
        expect(r[0].getComment()).toBe("translator's comment");
    });

    test("ObjectiveCFileParseSimpleGetBySource", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");
    });

    test("ObjectiveCFileParseIgnoreEmptyString", function() {
        expect.assertions(3);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"", @"translator\'s comment");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseNoComment", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", nil);');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();
    });

    test("ObjectiveCFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('   NSLocalizedString  (  @"This is a test"  ,     @"translator\'s comment"   )         ');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");
    });

    test("ObjectiveCFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileParseWithHTLocalizedString", function() {
        expect.assertions(7);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);

        j.parse('HTLocalizedString(@"This is a test", @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");
    });

    test("ObjectiveCFileParseMultiple", function() {
        expect.assertions(10);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString(@"This is also a test", @"translator\'s comment 2")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
        expect(r.getComment()).toBe("translator's comment 2");
    });

    test("ObjectiveCFileParseMultipleSameLine", function() {
        expect.assertions(10);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment"); a.parse("This is another test."); NSLocalizedString(@"This is also a test", @"translator\'s comment 2")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
        expect(r.getComment()).toBe("translator's comment 2");
    });

    test("ObjectiveCFileParseWithDups", function() {
        expect.assertions(7);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", @"translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString(@"This is a test", @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");

        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test" + @" and this isnt", @"translator\'s comment")');

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test" + foobar, @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(foobar, @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseNonNilComment", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", foobar)');

        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileParseZeroComment", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is a test", 0)');

        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileParseEmptyParams", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString()');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseWholeWord", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('BANSLocalizedString(@"This is a test", @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParseSubobject", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('App.NSLocalizedString(@"This is a test", @"translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileParseEscapedQuotes", function() {
        expect.assertions(7);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This \\\'is\\\' a \\\"test\\\"", @"translator\'s \\\'comment\\\'")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This 'is' a \"test\"");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This 'is' a \"test\"");
        expect(r.getKey()).toBe("This 'is' a \"test\"");
        expect(r.getComment()).toBe("translator's 'comment'");

        expect(set.size()).toBe(1);
    });

    test("ObjectiveCFileExtractFile", function() {
        expect.assertions(34);

        var j = new ObjectiveCFile(p, "./objc/t1.m", ocft, ocft);
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(10);

        var r = set.getBySource("Staff");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Staff");
        expect(r.getKey()).toBe("Staff");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Owner");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Owner");
        expect(r.getKey()).toBe("Owner");
        expect(r.getComment()).toBe("Owner of the question");

        r = set.getBySource("Inviting ...");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Inviting ...");
        expect(r.getKey()).toBe("Inviting ...");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Joined");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Joined");
        expect(r.getKey()).toBe("Joined");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Remove");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Remove");
        expect(r.getKey()).toBe("Remove");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Make owner");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Make owner");
        expect(r.getKey()).toBe("Make owner");
        expect(r.getComment()).toBe(" ... of the question");

        r = set.getBySource("Calling ...");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Calling ...");
        expect(r.getKey()).toBe("Calling ...");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Call now");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Call now");
        expect(r.getKey()).toBe("Call now");
        expect(!r.getComment()).toBeTruthy();
    });

    test("ObjectiveCFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileExtractBogusFile", function() {
        expect.assertions(2);

        var j = new ObjectiveCFile(p, "./objc/foo.m", ocft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("ObjectiveCFileParsePreserveNewlineChars", function() {
        expect.assertions(6);

        var j = new ObjectiveCFile(p, undefined, ocft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(@"This is\\na test", @"translator\'s comment");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is\\na test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is\\na test");
        expect(r.getKey()).toBe("This is\\na test");
        expect(r.getComment()).toBe("translator's comment");
    });
});
