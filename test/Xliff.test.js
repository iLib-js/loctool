/*
 * Xliff.test.js - test the Xliff object.
 *
 * Copyright © 2016-2017, 2023 2019-2021, 2023 HealthTap, Inc.
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
describe("xliff", function() {
    test("XliffConstructor", function() {
        expect.assertions(1);
        var x = new Xliff();
        expect(x).toBeTruthy();
    });
    test("XliffConstructorIsEmpty", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });
    test("XliffConstructorFull", function() {
        expect.assertions(7);
        var x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();
        expect(x["tool-id"]).toBe("loctool");
        expect(x["tool-name"]).toBe("Localization Tool");
        expect(x["tool-version"]).toBe("1.2.34");
        expect(x["tool-company"]).toBe("My Company, Inc.");
        expect(x.copyright).toBe("Copyright 2016, My Company, Inc. All rights reserved.");
        expect(x.path).toBe("a/b/c.xliff");
    });
    test("XliffGetPath", function() {
        expect.assertions(2);
        var x = new Xliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
    });
    test("XliffSetPath", function() {
        expect.assertions(3);
        var x = new Xliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("XliffSetPathInitiallyEmpty", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
        expect(!x.getPath()).toBeTruthy();
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("XliffAddResource", function() {
        expect.assertions(11);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getState()).toBe("new");
        expect(reslist[0].getContext()).toBe("asdf");
        expect(reslist[0].getComment()).toBe("this is a comment");
        expect(reslist[0].getProject()).toBe("webapp");
    });
    test("XliffSize", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(x.size()).toBe(0);
        x.addResource(res);
        expect(x.size()).toBe(1);
    });
    test("XliffAddMultipleResources", function() {
        expect.assertions(8);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
    });
    test("XliffAddMultipleResourcesRightSize", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
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
        expect(x.size()).toBe(2);
    });
    test("XliffAddMultipleResourcesOverwrite", function() {
        expect.assertions(9);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].getComment()).toBe("blah blah blah");
    });
    test("XliffAddMultipleResourcesOverwriteRightSize", function() {
        expect.assertions(4);
        var x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });
        x.addResource(res);
        expect(x.size()).toBe(1);
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
        expect(x.size()).toBe(1);
    });
    test("XliffAddMultipleResourcesNoOverwrite", function() {
        expect.assertions(13);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(!reslist[0].getComment()).toBeTruthy();
        expect(reslist[1].getSource()).toBe("Asdf asdf");
        expect(reslist[1].getSourceLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("foobar");
        expect(reslist[1].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[1].getComment()).toBe("blah blah blah");
    });
    test("XliffAddResourceDontAddSourceLocaleAsTarget", function() {
        expect.assertions(2);
        var x = new Xliff({
            sourceLocale: "en-US"
        });
        expect(x).toBeTruthy();
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
        expect(x.size()).toBe(1);
    });
    test("XliffGetResourcesMultiple", function() {
        expect.assertions(11);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
    });
    test("XliffSerializeWithContext", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceOnly", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithFlavors", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceOnlyAndPlurals", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
            '        <note>{"pluralForm":"zero","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="huzzah" restype="plural" datatype="x-android-resource" extype="one">\n' +
            '        <source>1</source>\n' +
            '        <note>{"pluralForm":"one","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="huzzah" restype="plural" datatype="x-android-resource" extype="few">\n' +
            '        <source>few</source>\n' +
            '        <note>{"pluralForm":"few","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceOnlyAndArray", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceOnlyAndArrayWithMissingElement", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
            sourceArray: ["one", "two", undefined, "three"],
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
            '      <trans-unit id="4" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
            '        <source>three</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceOnlyAndArrayWithEmptyElement", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
            sourceArray: ["one", "two", "", "three"],
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
            '      <trans-unit id="4" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
            '        <source>three</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithExplicitIds", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithSourceAndTarget", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(x.serialize()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
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
    });
    test("XliffSerializeWithSourceAndTargetAndComment", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithHeader", function() {
        expect.assertions(2);
        var x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithPlurals", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Da gibts {n} Objekten.</target>\n' +
                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithPluralsToLangWithMorePluralsThanEnglish", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="few">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Есть {n} объекта.</target>\n' +
                '        <note>{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Всего {n} объектов.</target>\n' +
                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithArrays", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithXMLEscaping", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithXMLEscapingInResname", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithXMLEscapingWithQuotes", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(x.serialize()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
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
    });
    test("XliffSerializeWithEscapeCharsInResname", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "Asdf translated",
            targetLocale: "de-DE",
            key: 'asdf \\n\\nasdf',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });
        x.addResource(res);
        res = new ResourceString({
            source: "asdf \\t\\n\\n asdf\\n",
            sourceLocale: "en-US",
            target: "fdsa \\t\\n\\n fdsa\\n",
            targetLocale: "de-DE",
            key: "asdf \\t\\n\\n asdf\\n",
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
                '      <trans-unit id="1" resname="asdf \\n\\nasdf" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>Asdf translated</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="asdf \\t\\n\\n asdf\\n" restype="string" datatype="plaintext">\n' +
                '        <source>asdf \\t\\n\\n asdf\\n</source>\n' +
                '        <target>fdsa \\t\\n\\n fdsa\\n</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithComments", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(x.serialize()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
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
    });
    test("XliffDeserializeWithSourceOnly", function() {
        expect.assertions(21);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(!reslist[1].getTarget()).toBeTruthy();
        expect(reslist[1].getTargetLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });
    test("XliffDeserializeWithSourceAndTarget", function() {
        expect.assertions(21);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getTarget()).toBe("foobarfoo");
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getTarget()).toBe("bebe bebe");
        expect(reslist[1].getTargetLocale()).toBe("fr-FR");
    });
    test("XliffDeserializeWithXMLUnescaping", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf <b>asdf</b>");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[1].getSource()).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(!reslist[1].getTarget()).toBeTruthy();
    });
    test("XliffDeserializeWithXMLUnescapingInResname", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf <b>asdf</b>");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar <a>link</a>");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[1].getSource()).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("<b>huzzah</b>");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(!reslist[1].getTarget()).toBeTruthy();
    });
    test("XliffDeserializeWithEscapedNewLines", function() {
        expect.assertions(17);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("a\\nb");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("e\\nh");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });
    test("XliffDeserializeWithEscapedNewLinesInResname", function() {
        expect.assertions(17);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="en-CA" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar\\n\\nasdf" restype="string">\n' +
                '        <source>a\\nb</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="en-CA" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah\\t\\n" restype="string">\n' +
                '        <source>e\\nh</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("a\\nb");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar\\n\\nasdf");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("e\\nh");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah\\t\\n");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });
    test("XliffDeserializeWithPlurals", function() {
        expect.assertions(10);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourcePlurals()).toStrictEqual({
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("plural");
        expect(reslist[0].getId()).toBe("1");
    });
    test("XliffDeserializeWithPluralsTranslated", function() {
        expect.assertions(13);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourcePlurals()).toStrictEqual({
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("plural");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[0].getTargetPlurals()).toStrictEqual({
            one: "Hay 1 objeto.",
            other: "Hay {n} objetos."
        });
        expect(reslist[0].getTargetLocale()).toBe("es-US");
    });
    test("XliffDeserializeWithArrays", function() {
        expect.assertions(10);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourceArray()).toStrictEqual(["Zero", "One", "Two"]);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(!reslist[0].getTargetArray()).toBeTruthy();
    });
    test("XliffDeserializeWithArraysTranslated", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourceArray()).toStrictEqual(["Zero", "One", "Two"]);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[0].getTargetArray()).toStrictEqual(["Zero", "Eins", "Zwei"]);
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
    });
    test("XliffDeserializeWithArraysAndTranslations", function() {
        expect.assertions(20);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("res/values/arrays.xml");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");
        var items = reslist[0].getSourceArray();
        expect(items.length).toBe(4);
        expect(items[0]).toBe("This is element 0");
        expect(items[1]).toBe("This is element 1");
        expect(items[2]).toBe("This is element 2");
        expect(items[3]).toBe("This is element 3");
        items = reslist[0].getTargetArray();
        expect(items.length).toBe(4);
        expect(items[0]).toBe("Este es 0");
        expect(items[1]).toBe("Este es 1");
        expect(items[2]).toBe("Este es 2");
        expect(items[3]).toBe("Este es 3");
    });
    test("XliffDeserializeWithArraysAndTranslationsPartial", function() {
        expect.assertions(20);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("res/values/arrays.xml");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");
        var items = reslist[0].getSourceArray();
        expect(items.length).toBe(4);
        expect(items[0]).toBeUndefined();
        expect(items[1]).toBeUndefined();
        expect(items[2]).toBeUndefined();
        expect(items[3]).toBe("This is element 3");
        items = reslist[0].getTargetArray();
        expect(items.length).toBe(4);
        expect(items[0]).toBeUndefined();
        expect(items[1]).toBeUndefined();
        expect(items[2]).toBeUndefined();
        expect(items[3]).toBe("Este es 3");
    });
    test("XliffDeserializeWithComments", function() {
        expect.assertions(18);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getComment()).toBe("A very nice string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getComment()).toBe("Totally awesome.");
        expect(reslist[1].getId()).toBe("2");
    });
    test("XliffDeserializeWithContext", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getContext()).toBe("na na na");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getContext()).toBe("asdf");
    });
    test("XliffDeserializeRealFile", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
        var fs = require("fs");
        var str = fs.readFileSync("test/testfiles/test.xliff", "utf-8");
        x.deserialize(str);
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(4);
    });
    test("XliffDeserializeEmptySource", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getTarget()).toBe("bebe bebe");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });
    test("XliffDeserializeEmptyTarget", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getOrigin()).toBe("source");
    });
    test("XliffDeserializeWithMrkTagInTarget", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getTarget()).toBe("bebe bebe");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });
    test("XliffDeserializeWithEmptyMrkTagInTarget", function() {
        expect.assertions(11);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getOrigin()).toBe("source");
    });
    test("XliffDeserializeWithMultipleMrkTagsInTargetEuro", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getTarget()).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });
    test("XliffDeserializeWithMultipleMrkTagsInTargetAsian", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getTarget()).toBe("This is segment 1.This is segment 2.This is segment 3.");
        expect(reslist[0].getTargetLocale()).toBe("zh-Hans-CN");
    });
    test("XliffDeserializePreserveSourceWhitespace", function() {
        expect.assertions(9);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("      Add Another");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("      Add Another");
        expect(reslist[0].getPath()).toBe("UI/AddAnotherButtonView.m");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
    });
    test("XliffDeserializePreserveTargetWhitespace", function() {
        expect.assertions(9);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getTarget()).toBe(" Añadir    Otro  ");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("      Add Another");
        expect(reslist[0].getPath()).toBe("UI/AddAnotherButtonView.m");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
    });
    test("XliffTranslationUnitConstructor", function() {
        expect.assertions(1);
        var tu = new TranslationUnit({
            "source": "a",
            "sourceLocale": "en-US",
            "key": "foobar",
            "file": "/a/b/asdf.js",
            "project": "iosapp"
        });
        expect(tu).toBeTruthy();
    });
    test("XliffTranslationUnitConstructorEverythingCopied", function() {
        expect.assertions(11);
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
        expect(tu).toBeTruthy();
        expect(tu.source).toBe("a");
        expect(tu.sourceLocale).toBe("en-US");
        expect(tu.key).toBe("foobar");
        expect(tu.file).toBe("/a/b/asdf.js");
        expect(tu.project).toBe("iosapp");
        expect(tu.id).toBe(2334);
        expect(tu.origin).toBe("source");
        expect(tu.context).toBe("asdfasdf");
        expect(tu.comment).toBe("this is a comment");
        expect(tu.flavor).toBe("chocolate");
    });
    test("XliffTranslationUnitConstructorMissingBasicProperties", function() {
        expect.assertions(1);
        expect(function() {
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
        }).toThrow();
    });
    test("XliffAddTranslationUnit", function() {
        expect.assertions(10);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("a");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe(2334);
    });
    test("XliffAddTranslationUnitMergeResources", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("a");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTarget()).toBe("b");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe(2334);
    });
    test("XliffAddTranslationUnitAddMultipleUnits", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(units).toBeTruthy();
        expect(units.length).toBe(2);
    });
    test("XliffAddTranslationUnitReplacePreviousUnit", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(units).toBeTruthy();
        // should have merged them into 1 unit because the signature was the same
        expect(units.length).toBe(1);
    });
    test("XliffAddTranslationUnitRightContents", function() {
        expect.assertions(15);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(units).toBeTruthy();
        expect(units.length).toBe(1);
        expect(units[0].source).toBe("ab");
        expect(units[0].sourceLocale).toBe("en-US");
        expect(units[0].target).toBe("ba");
        expect(units[0].targetLocale).toBe("fr-FR");
        expect(units[0].key).toBe("foobar");
        expect(units[0].file).toBe("/a/b/asdf.js");
        expect(units[0].project).toBe("iosapp");
        expect(units[0].id).toBe(2334);
        expect(units[0].resType).toBe("string");
        expect(units[0].origin).toBe("source");
        expect(units[0].context).toBe("asdfasdf");
        expect(units[0].comment).toBe("this is a new comment");
    });
    test("XliffAddTranslationUnitRightResourceTypesRegularString", function() {
        expect.assertions(4);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        expect(resources[0] instanceof ResourceString).toBeTruthy();
    });
    test("XliffAddTranslationUnitRightResourceTypesContextString", function() {
        expect.assertions(5);
        ResourceFactory.registerDataType("x-android-resource", "string", ContextResourceString);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
        expect(resources[0] instanceof ContextResourceString).toBeTruthy();
        expect(resources[1] instanceof ContextResourceString).toBeTruthy();
    });
    test("XliffAddTranslationUnitReplaceSourceOnlyUnit", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(units).toBeTruthy();
        // should have merged them into 1 unit because the signature was the same
        expect(units.length).toBe(1);
    });
    test("XliffAddTranslationUnitDifferentPathsRightTypes", function() {
        expect.assertions(5);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
        expect(resources[0] instanceof IosLayoutResourceString).toBeTruthy();
        expect(resources[1] instanceof IosLayoutResourceString).toBeTruthy();
    });
    test("XliffAddTranslationUnitDifferentPaths", function() {
        expect.assertions(23);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("a");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTarget()).toBe("foo");
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("a/b/asdf.xib");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].datatype).toBe("x-xib");
        expect(reslist[0].getId()).toBe(2334);
        expect(reslist[1].getSource()).toBe("a");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getTarget()).toBe("foo");
        expect(reslist[1].getTargetLocale()).toBe("de-DE");
        expect(reslist[1].getKey()).toBe("foobar");
        expect(reslist[1].getPath()).toBe("a/b/asdf~ipad.xib");
        expect(reslist[1].getProject()).toBe("iosapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].datatype).toBe("x-xib");
        expect(reslist[1].getId()).toBe(2334);
    });
    test("XliffSerializeWithTranslationUnits", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(x.serialize()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
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
    });
    test("XliffSerializeWithTranslationUnitsDifferentLocales", function() {
        expect.assertions(2);
        var x = new Xliff();
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffAddResourcesWithInstances", function() {
        expect.assertions(9);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(!reslist[0].getComment()).toBeTruthy();
    });
    test("XliffAddMultipleResourcesAddInstances", function() {
        expect.assertions(17);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(!reslist[0].getComment()).toBeTruthy();
        var instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
        expect(instances[0].getSource()).toBe("Asdf asdf");
        expect(instances[0].getSourceLocale()).toBe("en-US");
        expect(instances[0].getKey()).toBe("foobar");
        expect(instances[0].getPath()).toBe("foo/bar/asdf.java");
        expect(instances[0].getProject()).toBe("webapp");
        expect(instances[0].getComment()).toBe("blah blah blah");
    });
    test("XliffSerializeWithResourcesWithInstances", function() {
        expect.assertions(2);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffSerializeWithTranslationUnitsWithInstances", function() {
        expect.assertions(2);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("XliffDeserializeCreateInstances", function() {
        expect.assertions(21);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getTarget()).toBe("ababab");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("asdf");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].context).toBe("asdfasdf");
        expect(reslist[0].comment).toBe("this is a comment");
        var instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
        expect(instances[0].getTarget()).toBe("ababab");
        expect(instances[0].getTargetLocale()).toBe("fr-FR");
        expect(instances[0].getKey()).toBe("asdf");
        expect(instances[0].getPath()).toBe("/a/b/asdf.js");
        expect(instances[0].getProject()).toBe("iosapp");
        expect(instances[0].resType).toBe("string");
        expect(instances[0].context).toBe("asdfasdf");
        expect(instances[0].comment).toBe("this is a different comment");
    });
    test("XliffDeserializeStillAcceptsAnnotatesAttr", function() {
        expect.assertions(21);
        var x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
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
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getTarget()).toBe("ababab");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("asdf");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].context).toBe("asdfasdf");
        expect(reslist[0].comment).toBe("this is a comment");
        var instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
        expect(instances[0].getTarget()).toBe("ababab");
        expect(instances[0].getTargetLocale()).toBe("fr-FR");
        expect(instances[0].getKey()).toBe("asdf");
        expect(instances[0].getPath()).toBe("/a/b/asdf.js");
        expect(instances[0].getProject()).toBe("iosapp");
        expect(instances[0].resType).toBe("string");
        expect(instances[0].context).toBe("asdfasdf");
        expect(instances[0].comment).toBe("this is a different comment");
    });
});
