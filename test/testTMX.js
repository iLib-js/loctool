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
        test.expect(5);

        var tmx = new Tmx({
            properties: {
                creationtool: "loctool",
                "tool-name": "Localization Tool",
                creationtoolversion: "1.2.34",
            },
            path: "a/b/c.tmx"
        });
        test.ok(tmx);
        var props = tmx.getProperties();

        test.equal(props["creationtool"], "loctool");
        test.equal(props["creationtoolversion"], "1.2.34");
        test.equal(props["tool-name"], "Localization Tool");

        test.equal(tmx.getPath(), "a/b/c.tmx");

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

        var props = units[0].getProperties();
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
        test.expect(12);

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

        var props = units[0].getProperties();
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
        test.expect(19);

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
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.ok(!props["x-context"]);

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "Asdf asdf");
        test.equal(variants[0].locale, "en-US");

        test.ok(!units[1].comment);
        props = units[1].getProperties();
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
        test.expect(23);

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
        var props = units[0].getProperties();
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
        props = units[1].getProperties();
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
        test.expect(15);

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
        var props = units[0].getProperties();
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
        test.expect(14);

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
        test.equal(units.length, 1);

        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "a");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

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

    testTmxAddResourceStringNotSourceLocale: function(test) {
        test.expect(3);

        var tmx = new Tmx({
            locale: "en-US"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 0);

        test.done();
    },

    testTmxAddMultipleResourceStringHandleDups: function(test) {
        test.expect(14);

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

        test.equal(units[0].string, "Asdf asdf");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
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

        test.done();
    },

    testTmxAddResourceArray: function(test) {
        test.expect(25);

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

        test.equal(units[0].string, "a");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "a");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "b");
        test.equal(units[1].locale, "en-US");
        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[2].string, "c");
        test.equal(units[2].locale, "en-US");
        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceArrayWithTranslations: function(test) {
        test.expect(31);

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

        test.equal(units[0].string, "a");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
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

        test.equal(units[1].string, "b");
        test.equal(units[1].locale, "en-US");
        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "y");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[2].string, "c");
        test.equal(units[2].locale, "en-US");
        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "z");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceArrayMultiple: function(test) {
        test.expect(31);

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

        var props = units[0].getProperties();
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
        test.expect(43);

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

        var props = units[0].getProperties();
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
        test.expect(43);

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
        test.equal(units.length, 4);

        test.equal(units[0].string, "a");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
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

        test.equal(units[1].string, "b");
        test.equal(units[1].locale, "en-US");
        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "b");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "y");
        test.equal(variants[1].locale, "de-DE");

        test.equal(variants[2].string, "q");
        test.equal(variants[2].locale, "de-DE");

        test.equal(units[2].string, "c");
        test.equal(units[2].locale, "en-US");
        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "c");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "z");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[3].string, "o");
        test.equal(units[3].locale, "en-US");
        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "o");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "r");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourcePlural: function(test) {
        test.expect(19);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].locale, "en-US");
        test.equal(units[0].string, "one string");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].locale, "en-US");
        test.equal(units[1].string, "other string");

        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "other string");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourcePluralWithTranslations: function(test) {
        test.expect(23);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "one string");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
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

        test.equal(units[1].string, "other string");
        test.equal(units[1].locale, "en-US");
        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "other string");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "mehrere Zeichenfolge");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourcePluralMultiple: function(test) {
        test.expect(31);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        test.equal(units[0].string, "one string");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "one string");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "other strings");
        test.equal(units[1].locale, "en-US");
        variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "other strings");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[2].string, "a string");
        test.equal(units[2].locale, "en-US");
        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "a string");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[3].string, "some strings");
        test.equal(units[3].locale, "en-US");
        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "some strings");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourcePluralMultipleWithMoreTranslations: function(test) {
        test.expect(33);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        var props = units[0].getProperties();
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

        test.equal(variants[1].string, "много струн");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(variants[2].string, "несколько струны");
        test.equal(variants[2].locale, "ru-RU");

        test.done();
    },

    testTmxAddResourcePluralMultipleWithLessTranslations: function(test) {
        test.expect(21);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        var props = units[0].getProperties();
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

    testTmxAddResourcePluralMultipleWithTranslationsAndOverlappingSources: function(test) {
        test.expect(27);

        var tmx = new Tmx();
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 3);

        var props = units[0].getProperties();
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

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.11.0" adminlang="en-US" datatype="unknown"/>\n' +
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

        var actual = tmx.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<tmx version="1.4">\n' +
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.11.0" adminlang="en-US" datatype="unknown"/>\n' +
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
            '  <header segtype="paragraph" creationtool="loctool" creationtoolversion="2.11.0" adminlang="en-US" datatype="unknown"/>\n' +
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
        test.equal(actual, expected);

        test.done();
    },

    testTmxAddResourceSegmentSentenceSource: function(test) {
        test.expect(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceSegmentSentenceSourceTricky: function(test) {
        test.expect(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "I would like to see Dr. Smith in the U.S. not someone else. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "I would like to see Dr. Smith in the U.S. not someone else. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "Please arrange that.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "Please arrange that.");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceSegmentSentenceSourceOnlyOneSentence: function(test) {
        test.expect(13);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        test.equal(units[0].string, "This is a test.");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is a test.");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTarget: function(test) {
        test.expect(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist nur eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetJapanese: function(test) {
        test.expect(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "これはテストです。");
        test.equal(variants[1].locale, "ja-JP");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "これは単なるテストです。");
        test.equal(variants[1].locale, "ja-JP");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetOnlyOneSentence: function(test) {
        test.expect(15);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 1);

        test.equal(units[0].string, "This is a test.");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentenceArray: function(test) {
        test.expect(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetArray: function(test) {
        test.expect(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist nur eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetArrayMultiple: function(test) {
        test.expect(51);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist nur eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[2].string, "Yet another test. ");
        test.equal(units[2].locale, "en-US");
        props = units[2].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Yet another test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Jemals noch eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[3].string, "Another test.");
        test.equal(units[3].locale, "en-US");
        props = units[3].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Another test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Noch eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentencePlural: function(test) {
        test.expect(23);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetPlural: function(test) {
        test.expect(27);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 2);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist nur eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetPluralMultiple: function(test) {
        test.expect(51);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Dies ist nur eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[2].string, "Yet another test. ");
        test.equal(units[2].locale, "en-US");
        props = units[2].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Yet another test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Jemals noch eine Untersuchung. ");
        test.equal(variants[1].locale, "de-DE");

        test.equal(units[3].string, "Another test.");
        test.equal(units[3].locale, "en-US");
        props = units[3].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Another test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Noch eine Untersuchung.");
        test.equal(variants[1].locale, "de-DE");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetPluralLessCategories: function(test) {
        test.expect(47);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 1);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(units[2].string, "Yet another test. ");
        test.equal(units[2].locale, "en-US");
        props = units[2].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Yet another test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "さらに別のテスト。");
        test.equal(variants[1].locale, "ja-JP");

        test.equal(units[3].string, "Another test.");
        test.equal(units[3].locale, "en-US");
        props = units[3].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "Another test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "別のテスト。");
        test.equal(variants[1].locale, "ja-JP");

        test.done();
    },

    testTmxAddResourceSegmentSentenceTargetPluralMoreCategories: function(test) {
        test.expect(55);

        var tmx = new Tmx({
            segmentation: "sentence"
        });
        test.ok(tmx);

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
        test.ok(units);
        test.equal(units.length, 4);

        test.equal(units[0].string, "This is a test. ");
        test.equal(units[0].locale, "en-US");
        var props = units[0].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[0].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is a test. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Это тест. ");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(units[1].string, "This is only a test.");
        test.equal(units[1].locale, "en-US");
        props = units[1].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        var variants = units[1].getVariants();
        test.ok(variants);
        test.equal(variants.length, 2);

        test.equal(variants[0].string, "This is only a test.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Это всего лишь тест.");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(units[2].string, "These are some tests. ");
        test.equal(units[2].locale, "en-US");
        props = units[2].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[2].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "These are some tests. ");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Это некоторые тестов. ");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(variants[2].string, "Это некоторые теста. ");
        test.equal(variants[2].locale, "ru-RU");

        test.equal(units[3].string, "These are only some tests.");
        test.equal(units[3].locale, "en-US");
        props = units[3].getProperties();
        test.ok(props);
        test.equal(props["x-project"], "webapp");
        test.equal(props["x-context"], "asdf");
        test.equal(props["x-flavor"], "chocolate");

        variants = units[3].getVariants();
        test.ok(variants);
        test.equal(variants.length, 3);

        test.equal(variants[0].string, "These are only some tests.");
        test.equal(variants[0].locale, "en-US");

        test.equal(variants[1].string, "Это только некоторые тестов.");
        test.equal(variants[1].locale, "ru-RU");

        test.equal(variants[2].string, "Это только некоторые теста.");
        test.equal(variants[2].locale, "ru-RU");

        test.done();
    },

};
