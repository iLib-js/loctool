/*
 * SwiftFile.test.js - test the Swift file handler object.
 *
 * Copyright © 2016-2017, 2019, 2023 HealthTap, Inc.
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

if (!SwiftFile) {
    var SwiftFile = require("../lib/SwiftFile.js");
    var SwiftFileType = require("../lib/SwiftFileType.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

var p = new SwiftProject({
    sourceLocale: "en-US"
}, "./testfiles");

var sft = new SwiftFileType(p);

describe("swiftfile", function() {
    test("SwiftFileConstructor", function() {
        expect.assertions(1);

        var j = new SwiftFile();
        expect(j).toBeTruthy();
    });

    test("SwiftFileConstructorParams", function() {
        expect.assertions(1);

        var j = new SwiftFile(p, "./testfiles/swift/MyproductStrings.swift", sft);

        expect(j).toBeTruthy();
    });

    test("SwiftFileConstructorNoFile", function() {
        expect.assertions(1);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();
    });

    test("SwiftFileMakeKey", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This is a test")).toBe("This is a test");
    });

    test("SwiftFileMakeKeyCleaned", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        expect(j.makeKey("   This\t is\n a test.   ")).toBe("This is a test.");
    });

    test("SwiftFileMakeKeyUnescapeQuotes", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This \\\"is\\\" \\'a test\\'.")).toBe("This \"is\" 'a test'.");
    });

    test("SwiftFileMakeKeyUnescapeBackslash", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        expect(j.makeKey("This \\\\is a test.")).toBe("This \\is a test.");
    });

    test("SwiftFileParseSimpleGetByKey", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")');

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

    test("SwiftFileParseSimpleHTLocalizedString", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('HTLocalizedString("This is a test", comment: "translator\'s comment")');

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

    test("SwiftFileParseSimpleGetBySource", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");
    });

    test("SwiftFileParseIgnoreEmptyString", function() {
        expect.assertions(3);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("", comment: "translator\'s comment");');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseNoComment", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", nil);');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();
    });

    test("SwiftFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('   NSLocalizedString  (  "This is a test"  ,  comment:   "translator\'s comment"   )         ');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");
    });

    test("SwiftFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("SwiftFileParseMultiple", function() {
        expect.assertions(10);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString("This is also a test", comment: "translator\'s comment 2")');

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

    test("SwiftFileParseMultipleSameLine", function() {
        expect.assertions(10);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment"); a.parse("This is another test."); NSLocalizedString("This is also a test", comment: "translator\'s comment 2")');

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

    test("SwiftFileParseWithDups", function() {
        expect.assertions(7);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", comment: "translator\'s comment")\n\ta.parse("This is another test.");\n\t\tNSLocalizedString("This is a test", comment: "translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("translator's comment");

        expect(set.size()).toBe(1);
    });

    test("SwiftFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test" + " and this isnt", comment: "translator\'s comment")');

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test" + foobar, comment: "translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString(foobar, comment: "translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseNonNilComment", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", foobar)');

        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("SwiftFileParseZeroComment", function() {
        expect.assertions(6);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This is a test", 0)');

        var set = j.getTranslationSet();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(!r.getComment()).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("SwiftFileParseEmptyParams", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString()');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseWholeWord", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('BANSLocalizedString("This is a test", comment: "translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("SwiftFileParseSubobject", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('App.NSLocalizedString("This is a test", comment: "translator\'s comment")');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(1);
    });

    test("SwiftFileParseEscapedQuotes", function() {
        expect.assertions(7);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        j.parse('NSLocalizedString("This \\\'is\\\' a \\\"test\\\"", comment: "translator\'s \\\'comment\\\'")');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This 'is' a \"test\"");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This 'is' a \"test\"");
        expect(r.getKey()).toBe("This 'is' a \"test\"");
        expect(r.getComment()).toBe("translator's 'comment'");

        expect(set.size()).toBe(1);
    });

    test("SwiftFileExtractFile", function() {
        expect.assertions(31);

        var j = new SwiftFile(p, "./swift/MyproductStrings.swift", sft);
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(14);

        var r = set.getBySource("Options");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Options");
        expect(r.getKey()).toBe("Options");
        expect(r.getComment()).toBe("Add Action sheet title");

        var instances = r.getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
        expect(instances[0].getSource()).toBe("Options");
        expect(instances[0].getKey()).toBe("Options");
        expect(instances[0].getComment()).toBe("Add Action sheet message");

        r = set.getBySource("Error logging out");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Error logging out");
        expect(r.getKey()).toBe("Error logging out");
        expect(r.getComment()).toBe("Error logging out title");

        r = set.getBySource("NOTIFICATIONS");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("NOTIFICATIONS");
        expect(r.getKey()).toBe("NOTIFICATIONS");
        expect(r.getComment()).toBe("tab bar title");

        r = set.getBySource("An issue occurred trying to log out. Please try again");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("An issue occurred trying to log out. Please try again");
        expect(r.getKey()).toBe("An issue occurred trying to log out. Please try again");
        expect(r.getComment()).toBe("Error logging out message");

        r = set.getBySource("Login");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Login");
        expect(r.getKey()).toBe("Login");
        expect(!r.getComment()).toBeTruthy(); // it's there, but a zero-length string, so it should say there is no comment

        r = set.getBySource("Save time");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Save time");
        expect(r.getKey()).toBe("Save time");
        expect(!r.getComment()).toBeTruthy();
    });

    test("SwiftFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, undefined, sft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("SwiftFileExtractBogusFile", function() {
        expect.assertions(2);

        var j = new SwiftFile(p, "./swift/foo.swift", sft);
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });
});
