/*
 * ResourceConvert.test.js - test the resource conversion functions.
 *
 * Copyright © 2024 Box, Inc.
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

var ResourcePlural = require("../lib/ResourcePlural.js");
var ResourceString = require("../lib/ResourceString.js");
var ResourceArray = require("../lib/ResourceArray.js");
var TranslationSet = require("../lib/TranslationSet.js");
var conv = require("../lib/ResourceConvert.js");

describe("resource conversion functions", function() {
    test("convert plural source to string", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural source to string in a source-only resource", function() {
        expect.assertions(5);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
        expect(string.getSourceLocale()).toBe("en-US");

        expect(string.getTarget()).toBeUndefined();
        expect(string.getTargetLocale()).toBeUndefined();
    });

    test("convert plural target to string", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("convert plural source to string when the target has more plural categories than the source", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            targetStrings: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {There is {n} item.} other {There are {n} items.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural target to string when the target has more plural categories than the source", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            targetStrings: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("convert plural source to string when the target has less plural categories than the source", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            targetStrings: {
                other: "{n}1件の商品があります。",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {There is {n} item.} other {There are {n} items.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural target to string when the target has less plural categories than the source", function() {
        expect.assertions(2);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            targetStrings: {
                other: "{n}1件の商品があります。",
            }
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, other {{n}1件の商品があります。}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("don't convert array resources to a string", function() {
        expect.assertions(1);

        var plural = new ResourceArray({
            sourceLocale: "en-US",
            sourceArray: [
                "There is 1 string.",
                "There are 2 strings."
            ],
            targetLocale: "de-DE",
            targetArray: [
                "Es gibt 1 Zeichenfolge.",
                "Es gibt 2 Zeichenfolgen.",
            ]
        });

        var string = conv.convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversino
    });

    test("don't convert string resources to a different string", function() {
        expect.assertions(1);

        var plural = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        var string = conv.convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversino
    });

    test("convert string source to plural", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
        });

        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };
        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("convert string source to plural in a source-only resource", function() {
        expect.assertions(5);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}"
        });

        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };
        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
        expect(plural.getSourceLocale()).toBe("en-US");

        expect(plural.getTargetPlurals()).toBeUndefined();
        expect(plural.getTargetLocale()).toBeUndefined();
    });

    test("convert plural source to string preserves all other fields", function() {
        expect.assertions(9);

        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            },
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });

        var string = conv.convertPluralResToICU(plural);
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });

    test("convert string target to plural", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural,  one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
        });

        var expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };
        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("convert string source to plural when the target has more plural categories than the source", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });

        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("convert string target to plural when the target has more plural categories than the source", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });

        var expected = {
            one: "Jest {n} pozycja.",
            few: "Jest {n} pozycje.",
            other: "Jest {n} pozycji.",
        };

        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("convert string source to plural when the target has less plural categories than the source", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{count, plural, other {{n}1件の商品があります。}}"
        });

        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("convert string target to plural when the target has less plural categories than the source", function() {
        expect.assertions(2);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{count, plural, other {{n}1件の商品があります。}}"
        });

        var expected = {
            other: "{n}1件の商品があります。",
        };

        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("convert string target to plural, preserving all other fields", function() {
        expect.assertions(9);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural,  one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });

        var expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };
        var plural = conv.convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });

    test("don't convert non-plural string to plural", function() {
        expect.assertions(1);

        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        var plural = conv.convertICUToPluralRes(string);
        expect(plural).toBeUndefined();
    });

    test("don't convert array to plural", function() {
        expect.assertions(1);

        var array = new ResourceArray({
            key: "c",
            sourceLocale: "en-US",
            sourceArray: [
                "one",
                "two",
                "three"
            ],
            targetLocale: "de-DE",
            targetArray: [
                "eins",
                "zwei",
                "drei"
            ]
        });

        var plural = conv.convertICUToPluralRes(array);
        expect(plural).toBeUndefined();
    });

    test("don't convert plural to another plural", function() {
        expect.assertions(1);

        var plural = new ResourcePlural({
            key: "a",
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        plural = conv.convertICUToPluralRes(plural);
        expect(plural).toBeUndefined();
    });
});

