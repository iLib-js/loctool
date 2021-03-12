/*
 * testTMX.js - test the Tmx object.
 *
 * Copyright © 2021 Box, Inc.
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
    }
}

module.exports.tmx = {
    testTmxConstructor: function(test) {
        test.expect(1);

        var tmx = new Tmx();
        test.ok(tmx);

        test.done();
    },

    testTmxConstructorIsEmpty: function(test) {
        test.expect(2);

        var tmx = new Tmx();
        test.ok(tmx);

        test.equal(tmx.size(), 0);

        test.done();
    },

    testTmxConstructorFull: function(test) {
        test.expect(7);

        var tmx = new Tmx({
            creationtool: "loctool",
            "tool-name": "Localization Tool",
            creationtoolversion: "1.2.34",
            path: "a/b/c.tmx"
        });
        test.ok(tmx);

        test.equal(tmx["creationtool"], "loctool");
        test.equal(tmx["creationtoolversion"], "1.2.34"),
        test.equal(tmx.path, "a/b/c.tmx");

        test.done();
    },

    testTmxGetPath: function(test) {
        test.expect(2);

        var tmx = new Tmx({
            path: "foo/bar/x.tmx"
        });
        test.ok(tmx);

        test.equal(tmx.getPath(), "foo/bar/x.tmx");

        test.done();
    },

    testTmxSetPath: function(test) {
        test.expect(3);

        var tmx = new Tmx({
            path: "foo/bar/x.tmx"
        });
        test.ok(tmx);

        test.equal(tmx.getPath(), "foo/bar/x.tmx");

        tmx.setPath("asdf/asdf/y.tmx");

        test.equal(tmx.getPath(), "asdf/asdf/y.tmx");

        test.done();
    },

    testTmxSetPathInitiallyEmpty: function(test) {
        test.expect(3);

        var tmx = new Tmx();
        test.ok(tmx);

        test.ok(!tmx.getPath());

        tmx.setPath("asdf/asdf/y.tmx");

        test.equal(tmx.getPath(), "asdf/asdf/y.tmx");

        test.done();
    },

    testTmxAddResourceString: function(test) {
        test.expect(11);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceStringWithTranslation: function(test) {
        test.expect(11);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddMultipleResourceString: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.ok(!units[1].comment);
        props = units[1].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "baby baby");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddMultipleResourceStringWithTranslations: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        test.ok(!units[1].comment);
        props = units[1].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "baby baby");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "vier fumpf sechs");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddMultipleResourceStringSameSource: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        // should add a variant to the previous translation
        // unit instead of creating a new one
        test.equal(variants[2].string, "un deu trois");
        test.equal(variants[2].locale, "fr-FR");

        test.done();
    },

    testTmxAddMultipleResourceStringSameSourceDifferentTranslation: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "a");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        // should become a new variant of the source, even
        // though we already have a german translation
        test.equal(variants[2].string, "sieben acht neun");
        test.equal(variants[2].locale, "de-DE");

        test.done();
    },

    testTmxAddMultipleResourceStringSameSourceDifferentSourceLocale: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "en-US",
            target: "vier fumpf sechs"
        });

        tmx.addResource(res);

        var units = tmx.getTranslationUnits();
        test.ok(units);
        test.equal(units.length, 2);

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        test.ok(!units[1].comment);
        props = units[1].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "de-DE");

        test.equal(variants[1].string, "vier fumpf sechs");
        test.equal(variants[1].locale, "en-US");

        test.done();
    },

    testTmxAddMultipleResourceStringHandleDups: function(test) {
        test.expect(18);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        // should not duplicate the unit or the variants

        test.ok(!units[0].comment);
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eins zwei drei");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceArray: function(test) {
        test.expect(11);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 3);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceArrayWithTranslations: function(test) {
        test.expect(26);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 3);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "x");
        test.equal(variants[1].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "y");
        test.equal(variants[1].locale, "de-DE");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "z");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceArrayMultiple: function(test) {
        test.expect(32);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "m");
        test.equal(variants[0].locale, "en-US");

        variants = units[4].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "n");
        test.equal(variants[0].locale, "en-US");

        variants = units[5].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "o");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceArrayMultipleWithTranslations: function(test) {
        test.expect(44);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "x");
        test.equal(variants[1].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "y");
        test.equal(variants[1].locale, "de-DE");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "z");
        test.equal(variants[1].locale, "de-DE");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "m");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "p");
        test.equal(variants[1].locale, "de-DE");

        variants = units[4].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "n");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "q");
        test.equal(variants[1].locale, "de-DE");

        variants = units[5].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "o");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "r");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceArrayMultipleWithTranslationsAndOverlappingSources: function(test) {
        test.expect(44);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "x");
        test.equal(variants[1].locale, "de-DE");

        test.equal(variants[2].string, "p");
        test.equal(variants[2].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "y");
        test.equal(variants[1].locale, "de-DE");

        test.equal(variants[2].string, "q");
        test.equal(variants[2].locale, "de-DE");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "z");
        test.equal(variants[1].locale, "de-DE");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "o");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "r");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceString: function(test) {
        test.expect(7);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 3);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "other string");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceStringWithTranslations: function(test) {
        test.expect(20);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 3);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "ein Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "other string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceStringMultiple: function(test) {
        test.expect(24);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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

        res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "other strings");
        test.equal(variants[0].locale, "en-US");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "a string");
        test.equal(variants[0].locale, "en-US");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "some strings");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceStringMultipleWithMoreTranslations: function(test) {
        test.expect(34);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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

        res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "ein Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "other strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "a string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "одна струна");
        test.equal(variants[1].locale, "ru-RU");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "many strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "несколько струны");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(variants[2].string, "много струн");
        test.equal(variants[2].locale, "ru-RU");

        test.done();
    },

    testTmxAddResourceStringMultipleWithLessTranslations: function(test) {
        test.expect(34);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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

        res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "ein Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "other strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        test.equal(variants[2].string, "1つの弦");
        test.equal(variants[2].locale, "ja-JP");

        test.done();
    },

    testTmxAddResourceStringMultipleWithTranslationsAndOverlappingSources: function(test) {
        test.expect(28);

        var tmx = new Tmx();
        test.ok(tmx);

        var res = new ResourceString({
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

        res = new ResourceString({
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
        test.ok(units);
        test.equal(units.length, 6);

        test.equal(units[0].comment, "this is a comment");
        var props = units[0].getProps();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        // the "one" string shares some translations and the "other" string doesn't
        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "eine Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        test.equal(variants[2].string, "1 Zeichenfolge");
        test.equal(variants[2].locale, "de-DE");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "other strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "some other strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere andere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxSerializeStringMultipleWithTranslations: function(test) {
        test.expect(2);

        var x = new Tmx();
        test.ok(x);

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

        var actual = x.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <body>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-context">asdf</prop>\n' +
            '      <prop type="x-flavor">chocolate</prop>\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>Asdf asdf</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '  </body>\n' +
            '</tmx>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testTmxSerializeString: function(test) {
        test.expect(2);

        var x = new Tmx();
        test.ok(x);

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

        var actual = x.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
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
        test.equal(actual, expected);
        test.done();
    },

    testTmxSerializeComplex: function(test) {
        test.expect(2);

        var tmx = new Tmx();
        test.ok(tmx);

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

        var res = new ResourceString({
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
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>one string</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>eine Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>other strings</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>mehrere Zeichenfolge</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>a</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>x</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
            '      <prop type="x-project">webapp</prop>\n' +
            '      <tuv xml:lang="en-US">\n' +
            '        <seg>b</seg>\n' +
            '      </tuv>\n' +
            '      <tuv xml:lang="de-DE">\n' +
            '        <seg>y</seg>\n' +
            '      </tuv>\n' +
            '    </tu>\n' +
            '    <tu srclang="en-US">\n' +
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
        test.equal(actual, expected);
        test.done();
    }
};
