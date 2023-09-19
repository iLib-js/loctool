/*
 * TMX.test.js - test the Tmx object.
 *
 * Copyright © 2021, 2023 Box, Inc.
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

if (!Tmx) {
    var path = require("path");
    var fs = require("fs");

    var Tmx = require("../lib/TMX.js");
    var TranslationUnit = Tmx.TranslationUnit;
    var ResourceString = require("../lib/ResourceString.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ResourceFactory = require("../lib/ResourceFactory.js");
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
    });
}

var loctoolVersion = require("../package.json").version;

describe("tmx", function() {
    test("TmxConstructor", function() {
        expect.assertions(1);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();
    });

    test("TmxConstructorIsEmpty", function() {
        expect.assertions(2);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        expect(tmx.size()).toBe(0);
    });

    test("TmxConstructorFull", function() {
        expect.assertions(5);

        var tmx = new Tmx({
            properties: {
                creationtool: "loctool",
                "tool-name": "Localization Tool",
                creationtoolversion: "1.2.34",
            },
            path: "a/b/c.tmx"
        });
        expect(tmx).toBeTruthy();
        var props = tmx.getProperties();

        expect(props["creationtool"]).toBe("loctool");
        expect(props["creationtoolversion"]).toBe("1.2.34");
        expect(props["tool-name"]).toBe("Localization Tool");

        expect(tmx.getPath()).toBe("a/b/c.tmx");
    });

    test("TmxGetPath", function() {
        expect.assertions(2);

        var tmx = new Tmx({
            path: "foo/bar/x.tmx"
        });
        expect(tmx).toBeTruthy();

        expect(tmx.getPath()).toBe("foo/bar/x.tmx");
    });

    test("TmxSetPath", function() {
        expect.assertions(3);

        var tmx = new Tmx({
            path: "foo/bar/x.tmx"
        });
        expect(tmx).toBeTruthy();

        expect(tmx.getPath()).toBe("foo/bar/x.tmx");

        tmx.setPath("asdf/asdf/y.tmx");

        expect(tmx.getPath()).toBe("asdf/asdf/y.tmx");
    });

    test("TmxSetPathInitiallyEmpty", function() {
        expect.assertions(3);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        expect(!tmx.getPath()).toBeTruthy();

        tmx.setPath("asdf/asdf/y.tmx");

        expect(tmx.getPath()).toBe("asdf/asdf/y.tmx");
    });

    test("TmxAddResourceString", function() {
        expect.assertions(11);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceStringWithTranslation", function() {
        expect.assertions(12);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddMultipleResourceString", function() {
        expect.assertions(19);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(!units[0].comment).toBeTruthy();
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(!units[1].comment).toBeTruthy();
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddMultipleResourceStringWithTranslations", function() {
        expect.assertions(23);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(!units[0].comment).toBeTruthy();
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        expect(!units[1].comment).toBeTruthy();
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("baby baby");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("vier fumpf sechs");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddMultipleResourceStringSameSource", function() {
        expect.assertions(15);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "fr-FR",
            target: "un deu trois"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(!units[0].comment).toBeTruthy();
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        // should add a variant to the previous translation
        // unit instead of creating a new one
        expect(variants[2].string).toBe("un deu trois");
        expect(variants[2].locale).toBe("fr-FR");
    });

    test("TmxAddMultipleResourceStringSameSourceDifferentTranslation", function() {
        expect.assertions(14);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei",
            context: "a"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "a/b/cfoo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "sieben acht neun",
            context: "b"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("a");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");

        // should become a new variant of the source, even
        // though we already have a german translation
        expect(variants[2].string).toBe("sieben acht neun");
        expect(variants[2].locale).toBe("de-DE");
    });

    test("TmxAddResourceStringNotSourceLocale", function() {
        expect.assertions(3);

        var tmx = new Tmx({
            locale: "en-US"
        });
        expect(tmx).toBeTruthy();

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "en-US",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        // should reject it. Only units with the source
        // locale of en-US go in this tmx
        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(0);
    });

    test("TmxAddMultipleResourceStringHandleDups", function() {
        expect.assertions(14);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        // should not duplicate the unit or the variants

        expect(units[0].string).toBe("Asdf asdf");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(!props["x-context"]).toBeTruthy();

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Asdf asdf");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eins zwei drei");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceArray", function() {
        expect.assertions(25);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        expect(units[0].string).toBe("a");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("b");
        expect(units[1].locale).toBe("en-US");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en-US");

        expect(units[2].string).toBe("c");
        expect(units[2].locale).toBe("en-US");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceArrayWithTranslations", function() {
        expect.assertions(31);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        expect(units[0].string).toBe("a");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("b");
        expect(units[1].locale).toBe("en-US");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].string).toBe("c");
        expect(units[2].locale).toBe("en-US");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceArrayMultiple", function() {
        expect.assertions(31);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "m",
                "n",
                "o"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(6);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en-US");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en-US");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en-US");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("m");
        expect(variants[0].locale).toBe("en-US");

        variants = units[4].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("n");
        expect(variants[0].locale).toBe("en-US");

        variants = units[5].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceArrayMultipleWithTranslations", function() {
        expect.assertions(43);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "m",
                "n",
                "o"
            ],
            sourceLocale: "en-US",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "p",
                "q",
                "r"
            ]
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(6);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("m");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("p");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[4].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("n");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("q");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[5].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("r");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceArrayMultipleWithTranslationsAndOverlappingSources", function() {
        expect.assertions(43);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "o"
            ],
            sourceLocale: "en-US",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "p",
                "q",
                "r"
            ]
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("a");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("a");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("x");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("p");
        expect(variants[2].locale).toBe("de-DE");

        expect(units[1].string).toBe("b");
        expect(units[1].locale).toBe("en-US");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("b");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("y");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("q");
        expect(variants[2].locale).toBe("de-DE");

        expect(units[2].string).toBe("c");
        expect(units[2].locale).toBe("en-US");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("c");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("z");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].string).toBe("o");
        expect(units[3].locale).toBe("en-US");
        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("o");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("r");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourcePlural", function() {
        expect.assertions(19);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other string"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].locale).toBe("en-US");
        expect(units[0].string).toBe("one string");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].locale).toBe("en-US");
        expect(units[1].string).toBe("other string");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("other string");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourcePluralWithTranslations", function() {
        expect.assertions(23);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other string"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("one string");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("other string");
        expect(units[1].locale).toBe("en-US");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourcePluralMultiple", function() {
        expect.assertions(31);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "a string",
                other: "some strings"
            },
            sourceLocale: "en-US",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("one string");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("other strings");
        expect(units[1].locale).toBe("en-US");
        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en-US");

        expect(units[2].string).toBe("a string");
        expect(units[2].locale).toBe("en-US");
        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("a string");
        expect(variants[0].locale).toBe("en-US");

        expect(units[3].string).toBe("some strings");
        expect(units[3].locale).toBe("en-US");
        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("some strings");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourcePluralMultipleWithMoreTranslations", function() {
        expect.assertions(33);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "a string",
                other: "many strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "ru-RU",
            targetStrings: {
                one: "одна струна",
                few: "несколько струны",
                other: "много струн"
            }
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("a string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("одна струна");
        expect(variants[1].locale).toBe("ru-RU");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("many strings");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("много струн");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("несколько струны");
        expect(variants[2].locale).toBe("ru-RU");
    });

    test("TmxAddResourcePluralMultipleWithLessTranslations", function() {
        expect.assertions(21);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "ein Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "ja-JP",
            targetStrings: {
                other: "1つの弦"
            }
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("ein Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("1つの弦");
        expect(variants[2].locale).toBe("ja-JP");
    });

    test("TmxAddResourcePluralMultipleWithTranslationsAndOverlappingSources", function() {
        expect.assertions(27);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "some other strings"
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "1 Zeichenfolge",
                other: "mehrere andere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(3);

        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        // the "one" string shares some translations and the "other" string doesn't
        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("one string");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("eine Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        expect(variants[2].string).toBe("1 Zeichenfolge");
        expect(variants[2].locale).toBe("de-DE");

        variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("other strings");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("mehrere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("some other strings");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("mehrere andere Zeichenfolge");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxSerializeStringMultipleWithTranslations", function() {
        expect.assertions(2);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "foobar auf deutsch",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "foobar en francais",
            targetLocale: "fr-FR"
        });

        tmx.addResource(res);

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" srclang="en-US" adminlang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>foobar auf deutsch</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="fr-FR">\n' +
            '        <seg>foobar en francais</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TmxSerializeString", function() {
        expect.assertions(2);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" srclang="en-US" adminlang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>baby baby</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>vier fumpf sechs</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TmxSerializeComplex", function() {
        expect.assertions(2);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "blah blah",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        var res = new ResourceArray({
            sourceArray: [
                "a",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "x",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" srclang="en-US" adminlang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>a</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>x</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TmxAddResourceSegmentSentenceSource", function() {
        expect.assertions(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceSegmentSentenceSourceTricky", function() {
        expect.assertions(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "I would like to see Dr. Smith in the U.S. not someone else. Please arrange that.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("I would like to see Dr. Smith in the U.S. not someone else.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("I would like to see Dr. Smith in the U.S. not someone else.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("Please arrange that.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("Please arrange that.");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceSegmentSentenceSourceOnlyOneSentence", function() {
        expect.assertions(13);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "This is a test.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceSegmentSentenceTarget", function() {
        expect.assertions(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentenceTargetJapanese", function() {
        expect.assertions(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "This is a test. This is only a test.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "これはテストです。これは単なるテストです。",
            targetLocale: "ja-JP"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("これはテストです。");
        expect(variants[1].locale).toBe("ja-JP");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("これは単なるテストです。");
        expect(variants[1].locale).toBe("ja-JP");
    });

    test("TmxAddResourceSegmentSentenceTargetOnlyOneSentence", function() {
        expect.assertions(15);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "This is a test.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "Dies ist eine Untersuchung.",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentenceArray", function() {
        expect.assertions(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test."
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceSegmentSentenceTargetArray", function() {
        expect.assertions(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test."
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetArray: [
                "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung."
            ],
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentenceTargetArrayMultiple", function() {
        expect.assertions(51);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceArray({
            sourceArray: [
                "This is a test. This is only a test.",
                "Yet another test. Another test."
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetArray: [
                "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
                "Jemals noch eine Untersuchung. Noch eine Untersuchung."
            ],
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].string).toBe("Yet another test.");
        expect(units[2].locale).toBe("en-US");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Jemals noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].string).toBe("Another test.");
        expect(units[3].locale).toBe("en-US");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentencePlural", function() {
        expect.assertions(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourcePlurals: {
                other: "This is a test. This is only a test."
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");
    });

    test("TmxAddResourceSegmentSentenceTargetPlural", function() {
        expect.assertions(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourcePlurals: {
                "other": "This is a test. This is only a test."
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                "other": "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung."
            },
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentenceTargetPluralMultiple", function() {
        expect.assertions(51);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "Yet another test. Another test."
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                one: "Dies ist eine Untersuchung. Dies ist nur eine Untersuchung.",
                other: "Jemals noch eine Untersuchung. Noch eine Untersuchung."
            },
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Dies ist nur eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[2].string).toBe("Yet another test.");
        expect(units[2].locale).toBe("en-US");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Jemals noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");

        expect(units[3].string).toBe("Another test.");
        expect(units[3].locale).toBe("en-US");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Noch eine Untersuchung.");
        expect(variants[1].locale).toBe("de-DE");
    });

    test("TmxAddResourceSegmentSentenceTargetPluralLessCategories", function() {
        expect.assertions(47);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "Yet another test. Another test."
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                other: "さらに別のテスト。別のテスト。"
            },
            targetLocale: "ja-JP"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(1);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(units[2].string).toBe("Yet another test.");
        expect(units[2].locale).toBe("en-US");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Yet another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("さらに別のテスト。");
        expect(variants[1].locale).toBe("ja-JP");

        expect(units[3].string).toBe("Another test.");
        expect(units[3].locale).toBe("en-US");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("Another test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("別のテスト。");
        expect(variants[1].locale).toBe("ja-JP");
    });

    test("TmxAddResourceSegmentSentenceTargetPluralMoreCategories", function() {
        expect.assertions(55);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourcePlural({
            sourcePlurals: {
                one: "This is a test. This is only a test.",
                other: "These are some tests. These are only some tests."
            },
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetPlurals: {
                one: "Это тест. Это всего лишь тест.",
                few: "Это некоторые теста. Это только некоторые теста.",
                other: "Это некоторые тестов. Это только некоторые тестов."
            },
            targetLocale: "ru-RU"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(4);

        expect(units[0].string).toBe("This is a test.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Это тест.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(units[1].string).toBe("This is only a test.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("This is only a test.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Это всего лишь тест.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(units[2].string).toBe("These are some tests.");
        expect(units[2].locale).toBe("en-US");
        props = units[2].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[2].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("These are some tests.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Это некоторые тестов.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("Это некоторые теста.");
        expect(variants[2].locale).toBe("ru-RU");

        expect(units[3].string).toBe("These are only some tests.");
        expect(units[3].locale).toBe("en-US");
        props = units[3].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        variants = units[3].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(3);

        expect(variants[0].string).toBe("These are only some tests.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Это только некоторые тестов.");
        expect(variants[1].locale).toBe("ru-RU");

        expect(variants[2].string).toBe("Это только некоторые теста.");
        expect(variants[2].locale).toBe("ru-RU");
    });

    test("TmxWrite", function() {
        expect.assertions(4);

        var tmx = new Tmx({
            path: "./test/output.tmx",
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf. Foobar foo.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "Eins zwei drei. Vier fumpf sechs."
        });

        tmx.addResource(res);

        var res = new ResourcePlural({
            sourceStrings: {
                one: "one string",
                other: "other strings"
            },
            sourceLocale: "en-US",
            key: "blah blah",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetStrings: {
                one: "eine Zeichenfolge",
                other: "mehrere Zeichenfolge"
            }
        });

        tmx.addResource(res);

        var res = new ResourceArray({
            sourceArray: [
                "A b cee. E f g.",
                "b",
                "c"
            ],
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            targetLocale: "de-DE",
            targetArray: [
                "X y zee. M n o.",
                "y",
                "z"
            ]
        });

        tmx.addResource(res);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/test/output.tmx"))) {
            fs.unlinkSync(path.join(base, "testfiles/test/output.tmx"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/test/output.tmx"))).toBeTruthy();

        tmx.write(path.join(base, "testfiles"));

        expect(fs.existsSync(path.join(base, "testfiles/test/output.tmx"))).toBeTruthy();

        var actual = fs.readFileSync(path.join(base, "testfiles/test/output.tmx"), "utf-8");
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="sentence" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" srclang="en-US" adminlang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Eins zwei drei.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Foobar foo.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>Vier fumpf sechs.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>A b cee.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>X y zee.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>E f g.</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>M n o.</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>c</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>z</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("TmxAddResourceSegmentSentenceTargetSpecial", function() {
        expect.assertions(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "The SignRequest subdomain cannot be changed. If you need a different domain you can create a new team.",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            flavor: "chocolate",
            comment: "this is a comment",
            project: "webapp",
            target: "SignRequest domänen kan inte ändras. Om du behöver en annan domän kan du skapa en nya arbetsgrupp.",
            targetLocale: "sv"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);

        expect(units[0].string).toBe("The SignRequest subdomain cannot be changed.");
        expect(units[0].locale).toBe("en-US");
        var props = units[0].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[0].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("The SignRequest subdomain cannot be changed.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("SignRequest domänen kan inte ändras.");
        expect(variants[1].locale).toBe("sv");

        expect(units[1].string).toBe("If you need a different domain you can create a new team.");
        expect(units[1].locale).toBe("en-US");
        props = units[1].getProperties();
        expect(props).toBeTruthy();
        expect(props["x-project"]).toBe("webapp");
        expect(props["x-context"]).toBe("asdf");
        expect(props["x-flavor"]).toBe("chocolate");

        var variants = units[1].getVariants();
        expect(variants).toBeTruthy();
        expect(variants.length).toBe(2);

        expect(variants[0].string).toBe("If you need a different domain you can create a new team.");
        expect(variants[0].locale).toBe("en-US");

        expect(variants[1].string).toBe("Om du behöver en annan domän kan du skapa en nya arbetsgrupp.");
        expect(variants[1].locale).toBe("sv");
    });

    test("TmxSerializeStringDontSerializeUnitsWithNoTranslations", function() {
        expect.assertions(2);

        var tmx = new Tmx();
        expect(tmx).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "eins zwei drei"
        });

        tmx.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        // source-only resource should not appear in the serialized output
        res = new ResourceString({
            source: "oh yeah!",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "de-DE"
        });

        tmx.addResource(res);

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="' + loctoolVersion + '" srclang="en-US" adminlang="en-US" datatype="unknown"/>\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eins zwei drei</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>baby baby</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>vier fumpf sechs</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });
});
