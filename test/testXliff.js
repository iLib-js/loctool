/*
 * testXliff.js - test the Xliff object.
 *
 * Copyright © 2016-2017, 2019-2021 HealthTap, Inc.
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

if (!Xliff) {
    var Xliff = require("../lib/Xliff.js");
    var TranslationUnit = Xliff.TranslationUnit;
    var ResourceString = require("../lib/ResourceString.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
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

module.exports.xliff = {
    testXliffConstructor: function(test) {
        test.expect(1);

        var x = new Xliff();
        test.ok(x);

        test.done();
    },

    testXliffConstructorIsEmpty: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        test.equal(x.size(), 0);

        test.done();
    },

    testXliffConstructorFull: function(test) {
        test.expect(7);

        var x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        test.equal(x["tool-id"], "loctool");
        test.equal(x["tool-name"], "Localization Tool"),
        test.equal(x["tool-version"], "1.2.34"),
        test.equal(x["tool-company"], "My Company, Inc."),
        test.equal(x.copyright, "Copyright 2016, My Company, Inc. All rights reserved."),
        test.equal(x.path, "a/b/c.xliff");

        test.done();
    },

    testXliffGetPath: function(test) {
        test.expect(2);

        var x = new Xliff({
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        test.done();
    },


    testXliffSetPath: function(test) {
        test.expect(3);

        var x = new Xliff({
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliffSetPathInitiallyEmpty: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        test.ok(!x.getPath());

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliffAddResource: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getState(), "new");
        test.equal(reslist[0].getContext(), "asdf");
        test.equal(reslist[0].getComment(), "this is a comment");
        test.equal(reslist[0].getProject(), "webapp");

        test.done();
    },

    testXliffSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp"
        });

        test.equal(x.size(), 0);

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliffAddMultipleResources: function(test) {
        test.expect(8);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");

        test.done();
    },

    testXliffAddMultipleResourcesRightSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        test.equal(x.size(), 0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 2);

        test.done();
    },

    testXliffAddMultipleResourcesOverwrite: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].getComment(), "blah blah blah");

        test.done();
    },

    testXliffAddMultipleResourcesOverwriteRightSize: function(test) {
        test.expect(4);

        var x = new Xliff();
        test.ok(x);

        test.equal(x.size(), 0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliffAddMultipleResourcesNoOverwrite: function(test) {
        test.expect(13);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has a different locale
        // so it should not overwrite the one above
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "fr-FR",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.ok(!reslist[0].getComment());

        test.equal(reslist[1].getSource(), "Asdf asdf");
        test.equal(reslist[1].getSourceLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[1].getComment(), "blah blah blah");

        test.done();
    },

    testXliffAddResourceDontAddSourceLocaleAsTarget: function(test) {
        test.expect(2);

        var x = new Xliff({
            sourceLocale: "en-US"
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // should not add this one
        res = new ResourceString({
            source: "baby baby",
            target: "babes babes",
            targetLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliffGetResourcesMultiple: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "source"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "origin"
        });

        x.addResource(res);

        var reslist = x.getResources({
            sourceLocale: "en-US"
        });

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");

        test.done();
    },

    testXliffSerializeWithContext: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ContextResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "gutver",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            context: "foobar"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext" x-context="foobar">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target>gutver</target>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithSourceOnly: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ContextResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            targetLocale: "de-DE"
        });

        x.addResource(res);

        res = new ContextResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "fr-FR"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
            '        <source>baby baby</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithFlavors: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ContextResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "gutver",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "source",
            flavor: "chocolate"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp" x-flavor="chocolate">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target>gutver</target>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithSourceOnlyAndPlurals: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ContextResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            targetLocale: "de-DE"
        });

        x.addResource(res);

        res = new ResourcePlural({
            sourceStrings: {
                "zero": "0",
                "one": "1",
                "few": "few"
            },
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "fr-FR"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2" resname="huzzah" restype="plural" datatype="x-android-resource" extype="zero">\n' +
            '        <source>0</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="huzzah" restype="plural" datatype="x-android-resource" extype="one">\n' +
            '        <source>1</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="huzzah" restype="plural" datatype="x-android-resource" extype="few">\n' +
            '        <source>few</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithSourceOnlyAndArray: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ContextResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            targetLocale: "de-DE"
        });

        x.addResource(res);

        res = new ResourceArray({
            sourceArray: ["one", "two", "three"],
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            targetLocale: "fr-FR"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2" resname="huzzah" restype="array" datatype="x-android-resource" extype="0">\n' +
            '        <source>one</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="huzzah" restype="array" datatype="x-android-resource" extype="1">\n' +
            '        <source>two</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="huzzah" restype="array" datatype="x-android-resource" extype="2">\n' +
            '        <source>three</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithExplicitIds: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target",
            id: 4444444
        });

        x.addResource(res);

        res = new ResourceString({
            source: "abcdef",
            sourceLocale: "en-US",
            target: "hijklmn",
            targetLocale: "nl-NL",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444444" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="4444445" resname="asdf" restype="string" datatype="plaintext">\n' +
                '        <source>abcdef</source>\n' +
                '        <target>hijklmn</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithSourceAndTarget: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        diff(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.equal(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliffSerializeWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            comment: "foobar is where it's at!"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });

        x.addResource(res);

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note>foobar is where it\'s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '        <note>come &amp; enjoy it with us</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        var actual = x.serialize();

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithHeader: function(test) {
        test.expect(2);

        var x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="webapp">\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>\n' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithPlurals: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        res = new ResourcePlural({
            sourceStrings: {
                "one": "There is 1 object.",
                "other": "There are {n} objects."
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Da gibts 1 Objekt.",
                "other": "Da gibts {n} Objekten."
            },
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            resType: "plural",
            origin: "target",
            autoKey: true,
            state: "new",
            datatype: "ruby"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="ruby" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target state="new">Da gibts 1 Objekt.</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Da gibts {n} Objekten.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithPluralsToLangWithMorePluralsThanEnglish: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        res = new ResourcePlural({
            sourceStrings: {
                "one": "There is 1 object.",
                "other": "There are {n} objects."
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Имеется {n} объект.",
                "few": "Есть {n} объекта.",
                "other": "Всего {n} объектов."
            },
            targetLocale: "ru-RU",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            resType: "plural",
            origin: "target",
            autoKey: true,
            state: "new",
            datatype: "ruby"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="ru-RU" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="ruby" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target state="new">Имеется {n} объект.</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="few">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Есть {n} объекта.</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Всего {n} объектов.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithArrays: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        res = new ResourceArray({
            sourceArray: ["Zero", "One", "Two"],
            sourceLocale: "en-US",
            targetArray: ["Zero", "Eins", "Zwei"],
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected)
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscaping: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            sourceLocale: "en-US",
            target: "Asdf 'quotes'",
            targetLocale: "de-DE",
            key: 'foobar "asdf"',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            sourceLocale: "en-US",
            target: "baby #(test)",
            targetLocale: "de-DE",
            key: "huzzah &quot;asdf&quot; #(test)",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &quot;asdf&quot;" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '        <target>Asdf \'quotes\'</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah &amp;quot;asdf&amp;quot; #(test)" restype="string" datatype="plaintext">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '        <target>baby #(test)</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscapingInResname: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            sourceLocale: "en-US",
            target: "Asdf 'quotes'",
            targetLocale: "de-DE",
            key: 'foobar <i>asdf</i>',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            sourceLocale: "en-US",
            target: "baby #(test)",
            targetLocale: "de-DE",
            key: "huzzah <b>asdf</b> #(test)",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &lt;i>asdf&lt;/i>" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '        <target>Asdf \'quotes\'</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah &lt;b>asdf&lt;/b> #(test)" restype="string" datatype="plaintext">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '        <target>baby #(test)</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscapingWithQuotes: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Here are \"double\" and 'single' quotes.",
            sourceLocale: "en-US",
            target: "Hier zijn \"dubbel\" en 'singel' quotaties.",
            targetLocale: "nl-NL",
            key: '"double" and \'single\'',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="&quot;double&quot; and &apos;single&apos;" restype="string" datatype="plaintext">\n' +
                '        <source>Here are "double" and \'single\' quotes.</source>\n' +
                '        <target>Hier zijn "dubbel" en \'singel\' quotaties.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliffSerializeWithComments: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            comment: "A very nice string",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '        <note>A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliffDeserializeWithSourceOnly: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "de-DE");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[1].getTarget());
        test.equal(reslist[1].getTargetLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliffDeserializeWithSourceAndTarget: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));
        var reslist = x.getResources();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getTarget(), "foobarfoo");
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getTarget(), "bebe bebe");
        test.equal(reslist[1].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXliffDeserializeWithXMLUnescaping: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf <b>asdf</b>");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.ok(!reslist[0].getTarget());

        test.equal(reslist[1].getSource(), "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.ok(!reslist[1].getTarget());

        test.done();
    },

    testXliffDeserializeWithXMLUnescapingInResname: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &lt;a>link&lt;/a>" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="&lt;b>huzzah&lt;/b>" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf <b>asdf</b>");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar <a>link</a>");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.ok(!reslist[0].getTarget());

        test.equal(reslist[1].getSource(), "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "<b>huzzah</b>");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.ok(!reslist[1].getTarget());

        test.done();
    },

    testXliffDeserializeWithEscapedNewLines: function(test) {
        test.expect(17);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="en-CA" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>a\\nb</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="en-CA" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>e\\nh</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "a\\nb");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "e\\nh");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliffDeserializeWithPlurals: function(test) {
        test.expect(10);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        var reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourcePlurals(), {
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "plural");
        test.equal(reslist[0].getId(), "1");

        test.done();
    },

    testXliffDeserializeWithPluralsTranslated: function(test) {
        test.expect(13);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target>Hay 1 objeto.</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target>Hay {n} objetos.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        var reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourcePlurals(), {
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "plural");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.deepEqual(reslist[0].getTargetPlurals(), {
            one: "Hay 1 objeto.",
            other: "Hay {n} objetos."
        });
        test.equal(reslist[0].getTargetLocale(), "es-US");

        test.done();
    },

    testXliffDeserializeWithArrays: function(test) {
        test.expect(10);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourceArray(), ["Zero", "One", "Two"]);
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.ok(!reslist[0].getTargetArray());

        test.done();
    },

    testXliffDeserializeWithArraysTranslated: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourceArray(), ["Zero", "One", "Two"]);
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");
        test.deepEqual(reslist[0].getTargetArray(), ["Zero", "Eins", "Zwei"]);
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliffDeserializeWithArraysAndTranslations: function(test) {
        test.expect(20);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>This is element 0</source>\n' +
                '        <target>Este es 0</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="huzzah" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>This is element 1</source>\n' +
                '        <target>Este es 1</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="4" resname="huzzah" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>This is element 2</source>\n' +
                '        <target>Este es 2</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="5" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");

        var items = reslist[0].getSourceArray();

        test.equal(items.length, 4);
        test.equal(items[0], "This is element 0");
        test.equal(items[1], "This is element 1");
        test.equal(items[2], "This is element 2");
        test.equal(items[3], "This is element 3");

        items = reslist[0].getTargetArray();

        test.equal(items.length, 4);
        test.equal(items[0], "Este es 0");
        test.equal(items[1], "Este es 1");
        test.equal(items[2], "Este es 2");
        test.equal(items[3], "Este es 3");

        test.done();
    },

    testXliffDeserializeWithArraysAndTranslationsPartial: function(test) {
        test.expect(20);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="5" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");

        var items = reslist[0].getSourceArray();

        test.equal(items.length, 4);
        test.equal(items[0], null);
        test.equal(items[1], null);
        test.equal(items[2], null);
        test.equal(items[3], "This is element 3");

        items = reslist[0].getTargetArray();

        test.equal(items.length, 4);
        test.equal(items[0], null);
        test.equal(items[1], null);
        test.equal(items[2], null);
        test.equal(items[3], "Este es 3");

        test.done();
    },

    testXliffDeserializeWithComments: function(test) {
        test.expect(18);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <note>A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <note>Totally awesome.</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getComment(), "A very nice string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getComment(), "Totally awesome.");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliffDeserializeWithContext: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" x-context="asdf">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getContext(), "na na na");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getContext(), "asdf");

        test.done();
    },

    testXliffDeserializeRealFile: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        var fs = require("fs");

        var str = fs.readFileSync("testfiles/test.xliff", "utf-8");

        x.deserialize(str);

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 4);

        test.done();
    },

    testXliffDeserializeEmptySource: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source></source>\n' +
                '        <target>Baby Baby</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "bebe bebe");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXliffDeserializeEmptyTarget: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");

        test.done();
    },

    testXliffDeserializeWithMrkTagInTarget: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">bebe bebe</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "bebe bebe");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXliffDeserializeWithEmptyMrkTagInTarget: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4"/></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.done();
    },

    testXliffDeserializeWithMultipleMrkTagsInTargetEuro: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "This is segment 1. This is segment 2. This is segment 3.");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXliffDeserializeWithMultipleMrkTagsInTargetAsian: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="zh-Hans-CN" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "This is segment 1.This is segment 2.This is segment 3.");
        test.equal(reslist[0].getTargetLocale(), "zh-Hans-CN");

        test.done();
    },

    testXliffDeserializePreserveSourceWhitespace: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="UI/AddAnotherButtonView.m" source-language="en-US" target-language="es-US" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="196" resname="      Add Another" restype="string" datatype="x-objective-c">\n' +
                '        <source>      Add Another</source>\n' +
                '        <target>Añadir Otro</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "      Add Another");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "      Add Another");
        test.equal(reslist[0].getPath(), "UI/AddAnotherButtonView.m");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");

        test.done();
    },

    testXliffDeserializePreserveTargetWhitespace: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="UI/AddAnotherButtonView.m" source-language="en-US" target-language="es-US" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="196" resname="      Add Another" restype="string" datatype="x-objective-c">\n' +
                '        <source>      Add Another</source>\n' +
                '        <target> Añadir    Otro  </target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getTarget(), " Añadir    Otro  ");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "      Add Another");
        test.equal(reslist[0].getPath(), "UI/AddAnotherButtonView.m");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");

        test.done();
    },


    testXliffTranslationUnitConstructor: function(test) {
        test.expect(1);

        var tu = new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp"
        });

        test.ok(tu);

        test.done();
    },

    testXliffTranslationUnitConstructorEverythingCopied: function(test) {
        test.expect(11);

        var tu = new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment",
            "flavor": "chocolate"
        });

        test.ok(tu);

        test.equal(tu.source, "a");
        test.equal(tu.sourceLocale, "en-US");
        test.equal(tu.key, "foobar");
        test.equal(tu.file, "/a/b/asdf.js");
        test.equal(tu.project, "iosapp");
        test.equal(tu.id, 2334);
        test.equal(tu.origin, "source");
        test.equal(tu.context, "asdfasdf");
        test.equal(tu.comment, "this is a comment");
        test.equal(tu.flavor, "chocolate");

        test.done();
    },

    testXliffTranslationUnitConstructorMissingBasicProperties: function(test) {
        test.expect(1);

        test.throws(function() {
            var tu = new TranslationUnit({
                "source": "a",
                "sourceLocale": "en-US",
                "file": "/a/b/asdf.js",
                "project": "iosapp",
                "id": 2334,
                "origin": "source",
                "context": "asdfasdf",
                "comment": "this is a comment"
            });
        });

        test.done();
    },

    testXliffAddTranslationUnit: function(test) {
        test.expect(10);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), 2334);

        test.done();
    },

    testXliffAddTranslationUnitMergeResources: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTarget(), "b");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), 2334);

        test.done();
    },

    testXliffAddTranslationUnitAddMultipleUnits: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2333,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        var units = x.getTranslationUnits();

        test.ok(units);

        test.equal(units.length, 2);

        test.done();
    },

    testXliffAddTranslationUnitReplacePreviousUnit: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "ab",
            "sourceLocale": "en-US",
            "target": "ba",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a new comment"
        }));

        var units = x.getTranslationUnits();

        test.ok(units);

        // should have merged them into 1 unit because the signature was the same
        test.equal(units.length, 1);

        test.done();
    },

    testXliffAddTranslationUnitRightContents: function(test) {
        test.expect(15);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "ab",
            "sourceLocale": "en-US",
            "target": "ba",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a new comment"
        }));

        var units = x.getTranslationUnits();

        test.ok(units);

        test.equal(units.length, 1);

        test.equal(units[0].source, "ab");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].target, "ba");
        test.equal(units[0].targetLocale, "fr-FR");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "/a/b/asdf.js");
        test.equal(units[0].project, "iosapp");
        test.equal(units[0].id, 2334);
        test.equal(units[0].resType, "string");
        test.equal(units[0].origin, "source");
        test.equal(units[0].context, "asdfasdf");
        test.equal(units[0].comment, "this is a new comment");

        test.done();
    },

    testXliffAddTranslationUnitRightResourceTypesRegularString: function(test) {
        test.expect(4);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType": "string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment",
            "datatype": "javascript"
        }));

        var resources = x.getResources();

        test.ok(resources);

        test.equal(resources.length, 1);

        test.ok(resources[0] instanceof ResourceString);

        test.done();
    },

    testXliffAddTranslationUnitRightResourceTypesContextString: function(test) {
        test.expect(5);

        ResourceFactory.registerDataType("x-android-resource", "string", ContextResourceString);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "ba",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.xml",
            "project": "androidapp",
            "id": 2334,
            "resType":"string",
            "comment": "this is a comment",
            "datatype": "x-android-resource",
            "flavor": "chocolate"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "baa",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b-x/asdf.xml",
            "project": "androidapp",
            "id": 2334,
            "resType": "string",
            "context": "x",
            "comment": "this is a new comment",
            "datatype": "x-android-resource",
            "flavor": "chocolate"
        }));

        var resources = x.getResources();

        test.ok(resources);

        test.equal(resources.length, 2);

        test.ok(resources[0] instanceof ContextResourceString);
        test.ok(resources[1] instanceof ContextResourceString);

        test.done();
    },

    testXliffAddTranslationUnitReplaceSourceOnlyUnit: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType": "string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        var units = x.getTranslationUnits();

        test.ok(units);

        // should have merged them into 1 unit because the signature was the same
        test.equal(units.length, 1);

        test.done();
    },

    testXliffAddTranslationUnitDifferentPathsRightTypes: function(test) {
        test.expect(5);

        var x = new Xliff();
        test.ok(x);

        ResourceFactory.registerDataType("x-xib", "string", IosLayoutResourceString);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "foo",
            "targetLocale": "de-DE",
            "key": "foobar",
            "file": "a/b/asdf.xib",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "target",
            "comment": "this is a comment",
            "datatype": "x-xib"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "foo",
            "targetLocale": "de-DE",
            "key": "foobar",
            "file": "a/b/asdf~ipad.xib",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "target",
            "comment": "this is a comment",
            "datatype": "x-xib"
        }));

        var resources = x.getResources();

        test.ok(resources);

        test.equal(resources.length, 2);

        test.ok(resources[0] instanceof IosLayoutResourceString);
        test.ok(resources[1] instanceof IosLayoutResourceString);

        test.done();
    },

    testXliffAddTranslationUnitDifferentPaths: function(test) {
        test.expect(23);

        var x = new Xliff();
        test.ok(x);

        ResourceFactory.registerDataType("x-xib", "string", IosLayoutResourceString);

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "foo",
            "targetLocale": "de-DE",
            "key": "foobar",
            "file": "a/b/asdf.xib",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "comment": "this is a comment",
            "datatype": "x-xib"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "foo",
            "targetLocale": "de-DE",
            "key": "foobar",
            "file": "a/b/asdf~ipad.xib",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "comment": "this is a comment",
            "datatype": "x-xib"
        }));

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTarget(), "foo");
        test.equal(reslist[0].getTargetLocale(), "de-DE");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "a/b/asdf.xib");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].datatype, "x-xib");
        test.equal(reslist[0].getId(), 2334);

        test.equal(reslist[1].getSource(), "a");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getTarget(), "foo");
        test.equal(reslist[1].getTargetLocale(), "de-DE");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "a/b/asdf~ipad.xib");
        test.equal(reslist[1].getProject(), "iosapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].datatype, "x-xib");
        test.equal(reslist[1].getId(), 2334);

        test.done();
    },

    testXliffSerializeWithTranslationUnits: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2333,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "fr-FR",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        diff(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.equal(x.serialize(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliffSerializeWithTranslationUnitsDifferentLocales: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2333,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "target": "b",
            "targetLocale": "de-DE",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        var actual = x.serialize();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="de-DE" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffAddResourcesWithInstances: function(test) {
        test.expect(9);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        var res2 = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            comment: "special translators note"
        });
        res.addInstance(res2);

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.ok(!reslist[0].getComment());

        test.done();
    },

    testXliffAddMultipleResourcesAddInstances: function(test) {
        test.expect(17);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should create an instance of the first one
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.ok(!reslist[0].getComment());

        var instances = reslist[0].getInstances();
        test.ok(instances);
        test.equal(instances.length, 1);

        test.equal(instances[0].getSource(), "Asdf asdf");
        test.equal(instances[0].getSourceLocale(), "en-US");
        test.equal(instances[0].getKey(), "foobar");
        test.equal(instances[0].getPath(), "foo/bar/asdf.java");
        test.equal(instances[0].getProject(), "webapp");
        test.equal(instances[0].getComment(), "blah blah blah");

        test.done();
    },

    testXliffSerializeWithResourcesWithInstances: function(test) {
        test.expect(2);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should create an instance of the first one
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <note>blah blah blah</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        var actual = x.serialize();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithTranslationUnitsWithInstances: function(test) {
        test.expect(2);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2333,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2334,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a different comment"
        }));

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        var actual = x.serialize();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testXliffDeserializeCreateInstances: function(test) {
        test.expect(21);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getTarget(), "ababab");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "asdf");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].context, "asdfasdf");
        test.equal(reslist[0].comment, "this is a comment");

        var instances = reslist[0].getInstances();
        test.ok(instances);
        test.equal(instances.length, 1);

        test.equal(instances[0].getTarget(), "ababab");
        test.equal(instances[0].getTargetLocale(), "fr-FR");
        test.equal(instances[0].getKey(), "asdf");
        test.equal(instances[0].getPath(), "/a/b/asdf.js");
        test.equal(instances[0].getProject(), "iosapp");
        test.equal(instances[0].resType, "string");
        test.equal(instances[0].context, "asdfasdf");
        test.equal(instances[0].comment, "this is a different comment");

        test.done();
    },

    testXliffDeserializeStillAcceptsAnnotatesAttr: function(test) {
        test.expect(21);

        var x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getTarget(), "ababab");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "asdf");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].context, "asdfasdf");
        test.equal(reslist[0].comment, "this is a comment");

        var instances = reslist[0].getInstances();
        test.ok(instances);
        test.equal(instances.length, 1);

        test.equal(instances[0].getTarget(), "ababab");
        test.equal(instances[0].getTargetLocale(), "fr-FR");
        test.equal(instances[0].getKey(), "asdf");
        test.equal(instances[0].getPath(), "/a/b/asdf.js");
        test.equal(instances[0].getProject(), "iosapp");
        test.equal(instances[0].resType, "string");
        test.equal(instances[0].context, "asdfasdf");
        test.equal(instances[0].comment, "this is a different comment");

        test.done();
    }
};
