/*
 * Xliff20.test.js - test the Xliff 2.0 object.
 *
 * Copyright © 2019,2021, 2023 JEDLSoft
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
describe("xliff20", function() {
    beforeAll(function () {
        ResourceFactory.unregisterDataType("x-android-resource");
    });

    test("Xliff20Constructor", function() {
        expect.assertions(1);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
    });
    test("Xliff20ConstructorIsEmpty", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });
    test("Xliff20ConstructorRightVersion", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2);
    });
    test("Xliff20ConstructorNumericVersion12", function() {
        expect.assertions(2);
        var x = new Xliff({version: 1.2});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(1.2);
    });
    test("Xliff20ConstructorNumericVersion20", function() {
        expect.assertions(2);
        var x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2);
    });
    test("Xliff20ConstructorFull", function() {
        expect.assertions(8);
        var x = new Xliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2);
        expect(x["tool-id"]).toBe("loctool");
        expect(x["tool-name"]).toBe("Localization Tool");
        expect(x["tool-version"]).toBe("1.2.34");
        expect(x["tool-company"]).toBe("My Company, Inc.");
        expect(x.copyright).toBe("Copyright 2016, My Company, Inc. All rights reserved.");
        expect(x.path).toBe("a/b/c.xliff");
    });
    test("Xliff20GetPath", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
    });
    test("Xliff20SetPath", function() {
        expect.assertions(3);
        var x = new Xliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("Xliff20SetPathInitiallyEmpty", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(!x.getPath()).toBeTruthy();
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("Xliff20AddResource", function() {
        expect.assertions(11);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20Size", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddMultipleResources", function() {
        expect.assertions(8);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddMultipleResourcesRightSize", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddMultipleResourcesOverwrite", function() {
        expect.assertions(9);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddMultipleResourcesOverwriteRightSize", function() {
        expect.assertions(4);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddMultipleResourcesNoOverwrite", function() {
        expect.assertions(13);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddResourceDontAddSourceLocaleAsTarget", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
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
    test("Xliff20GetResourcesMultiple", function() {
        expect.assertions(11);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20SerializeWithContext", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext" l:context="foobar">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target>gutver</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithSourceOnly", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });
        x.addResource(res);
        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" l:project="webapp">\n' +
            '    <group id="group_2" name="plaintext">\n' +
            '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>baby baby</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializediffrentFileSampePrj", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            project: "androidapp",
            targetLocale: "de-DE"
        });
        x.addResource(res);
        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" l:project="androidapp">\n' +
            '    <group id="group_2" name="plaintext">\n' +
            '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>baby baby</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeSampeFilesPrj", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            targetLocale: "de-DE"
        });
        x.addResource(res);
        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>baby baby</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithSourceOnlyFilterOutWrongLocales", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
        // should be filtered out because of the different target locale
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
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithFlavors", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp" l:flavor="chocolate">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target>gutver</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithSourceOnlyAndPlurals", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });
        x.addResource(res);
        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" l:project="webapp">\n' +
            '    <group id="group_2" name="x-android-resource">\n' +
            '      <unit id="2" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="zero">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"zero","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>0</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="3" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>1</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="4" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>few</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithSourceOnlyAndArray", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });
        x.addResource(res);
        var actual = x.serialize();
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" l:project="webapp">\n' +
            '    <group id="group_2" name="x-android-resource">\n' +
            '      <unit id="2" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
            '        <segment>\n' +
            '          <source>one</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="3" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
            '        <segment>\n' +
            '          <source>two</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="4" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
            '        <segment>\n' +
            '          <source>three</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithExplicitIds", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="4444444" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="4444445" name="asdf" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>abcdef</source>\n' +
                '          <target>hijklmn</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithSourceAndTarget", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });
        x.addResource(res);
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>foobarfoo</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(x.serialize(), expected);
        expect(x.serialize()).toBe(expected);
    });
    test("Xliff20SerializeWithSourceAndTargetAndComment", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });
        x.addResource(res);
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">foobar is where it\'s at!</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>foobarfoo</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">come &amp; enjoy it with us</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        var actual = x.serialize();
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithHeader", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>\n' +
                '    </header>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithPlurals", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="ruby">\n' +
                '      <unit id="1" name="foobar" type="res:plural" l:datatype="ruby" l:category="one">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There is 1 object.</source>\n' +
                '          <target state="new">Da gibts 1 Objekt.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:plural" l:datatype="ruby" l:category="other">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Da gibts {n} Objekten.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithPluralsToLangWithMorePluralsThanEnglish", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="ruby">\n' +
                '      <unit id="1" name="foobar" type="res:plural" l:datatype="ruby" l:category="one">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There is 1 object.</source>\n' +
                '          <target state="new">Имеется {n} объект.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:plural" l:datatype="ruby" l:category="few">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Есть {n} объекта.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="3" name="foobar" type="res:plural" l:datatype="ruby" l:category="other">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Всего {n} объектов.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithArrays", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="x-android-resource">\n' +
                '      <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '        <segment>\n' +
                '          <source>Zero</source>\n' +
                '          <target>Zero</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '        <segment>\n' +
                '          <source>One</source>\n' +
                '          <target>Eins</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '        <segment>\n' +
                '          <source>Two</source>\n' +
                '          <target>Zwei</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected)
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithXMLEscaping", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar &quot;asdf&quot;" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '          <target>Asdf \'quotes\'</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah &amp;quot;asdf&amp;quot; #(test)" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '          <target>baby #(test)</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithXMLEscapingWithQuotes", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="&quot;double&quot; and &apos;single&apos;" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Here are "double" and \'single\' quotes.</source>\n' +
                '          <target>Hier zijn "dubbel" en \'singel\' quotaties.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');
    });
    test("Xliff20SerializeWithEscapeCharsInResname", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        var res = new ResourceString({
            source: "Here are \\ndouble\\n quotes.",
            sourceLocale: "en-US",
            target: "Hier zijn \\ndubbel\\n quotaties.",
            targetLocale: "nl-NL",
            key: 'Double \\ndouble\\n.',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });
        x.addResource(res);
        expect(x.serialize()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="Double \\ndouble\\n." type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Here are \\ndouble\\n quotes.</source>\n' +
                '          <target>Hier zijn \\ndubbel\\n quotaties.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');
    });
    test("Xliff20SerializeWithComments", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">A very nice string</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');
    });
    test("Xliff20DeserializeWithSourceOnly", function() {
        expect.assertions(21);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(reslist[1].getTargetLocale()).toBe("de-DE");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });
    test("Xliff20DeserializeWithSourceAndTarget", function() {
        expect.assertions(21);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(reslist[1].getTargetLocale()).toBe("de-DE");
    });
    test("Xliff20DeserializeWithXMLUnescaping", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithEscapedNewLines", function() {
        expect.assertions(17);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="en-CA" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>a\\nb</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>e\\nh</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithEscapedNewLinesInResname", function() {
        expect.assertions(17);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="en-CA" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar\\nbar\\t" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>a\\nb</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah\\n\\na plague on both your houses" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>e\\nh</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("a\\nb");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar\\nbar\\t");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("e\\nh");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah\\n\\na plague on both your houses");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });
    test("Xliff20DeserializeWithPlurals", function() {
        expect.assertions(10);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                '      <segment>\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                '      <segment>\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithPluralsTranslated", function() {
        expect.assertions(13);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                '      <segment>\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target>Hay 1 objeto.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                '      <segment>\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target>Hay {n} objetos.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithArrays", function() {
        expect.assertions(10);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>Zero</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>One</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>Two</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithArraysTranslated", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithArraysAndTranslations", function() {
        expect.assertions(20);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="res/values/arrays.xml" l:project="androidapp">\n' +
                '    <unit id="2" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>This is element 0</source>\n' +
                '        <target>Este es 0</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>This is element 1</source>\n' +
                '        <target>Este es 1</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="4" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>This is element 2</source>\n' +
                '        <target>Este es 2</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="5" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                '      <segment>\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithArraysAndTranslationsPartial", function() {
        expect.assertions(20);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="res/values/arrays.xml" l:project="androidapp">\n' +
                '    <unit id="5" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                '      <segment>\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithComments", function() {
        expect.assertions(18);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">A very nice string</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">Totally awesome.</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeWithContext", function() {
        expect.assertions(19);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:context="na na na">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:context="asdf">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializeRealFile", function() {
        expect.assertions(3);
        var x = new Xliff();
        expect(x).toBeTruthy();
        var fs = require("fs");
        var str = fs.readFileSync("test/testfiles/test4.xliff", "utf-8");
        x.deserialize(str);
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(4);
    });
    test("Xliff20DeserializeEmptySource", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:context="na na na">\n' +
                '      <segment>\n' +
                '        <source></source>\n' +
                '        <target>Baby Baby</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
    });
    test("Xliff20DeserializeEmptyTarget", function() {
        expect.assertions(23);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getOrigin()).toBe("source");
    });
    test("Xliff20DeserializeEmptyTargetNoTargetLocale", function() {
        expect.assertions(23);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(!reslist[0].getTargetLocale()).toBeTruthy();
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(!reslist[0].getTargetLocale()).toBeTruthy();
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getOrigin()).toBe("source");
    });
    test("Xliff20DeserializeWithMultipleSegments", function() {
        expect.assertions(12);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment id="1">\n' +
                '        <source>seg1 </source>\n' +
                '        <target>This is segment 1. </target>\n' +
                '      </segment>\n' +
                '      <segment id="2">\n' +
                '        <source>seg2 </source>\n' +
                '        <target>This is segment 2. </target>\n' +
                '      </segment>\n' +
                '      <segment id="3">\n' +
                '        <source>seg3</source>\n' +
                '        <target>This is segment 3.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("seg1 seg2 seg3");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getTarget()).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });
    test("Xliff20DeserializePreserveSourceWhitespace", function() {
        expect.assertions(9);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="UI/AddAnotherButtonView.m" l:project="iosapp">\n' +
                '    <unit id="196" name="      Add Another" type="res:string" l:datatype="x-objective-c">\n' +
                '      <segment>\n' +
                '        <source>      Add Another</source>\n' +
                '        <target>Añadir Otro</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20DeserializePreserveTargetWhitespace", function() {
        expect.assertions(9);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="UI/AddAnotherButtonView.m" l:project="iosapp">\n' +
                '    <unit id="196" name="      Add Another" type="res:string" l:datatype="x-objective-c">\n' +
                '      <segment>\n' +
                '        <source>      Add Another</source>\n' +
                '        <target> Añadir    Otro  </target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
    test("Xliff20AddTranslationUnit", function() {
        expect.assertions(10);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitMergeResources", function() {
        expect.assertions(12);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitAddMultipleUnits", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitReplacePreviousUnit", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitRightContents", function() {
        expect.assertions(15);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitRightResourceTypesRegularString", function() {
        expect.assertions(4);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitRightResourceTypesContextString", function() {
        expect.assertions(5);
        ResourceFactory.registerDataType("x-android-resource", "string", ContextResourceString);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitReplaceSourceOnlyUnit", function() {
        expect.assertions(3);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitDifferentPathsRightTypes", function() {
        expect.assertions(5);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20AddTranslationUnitDifferentPaths", function() {
        expect.assertions(23);
        var x = new Xliff({version: "2.0"});
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
    test("Xliff20SerializeWithTranslationUnits", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="/a/b/asdf.js" l:project="iosapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="2333" name="asdf" type="res:string" l:context="asdfasdf">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">this is a comment</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>bababa</source>\n' +
                '          <target>ababab</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2334" name="foobar" type="res:string" l:context="asdfasdf">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">this is a comment</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>a</source>\n' +
                '          <target>b</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(x.serialize(), expected);
        expect(x.serialize()).toBe(expected);
    });
    test("Xliff20SerializeWithTranslationUnitsDifferentLocales", function() {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
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
        try {
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
        } catch (e) {
            // cannot add new units with a different source/language combo
            expect(e).toBeTruthy();
        }
    });
    test("Xliff20AddResourcesWithInstances", function() {
        expect.assertions(9);
        var x = new Xliff({
            version: "2.0",
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
    test("Xliff20AddMultipleResourcesAddInstances", function() {
        expect.assertions(17);
        var x = new Xliff({
            version: "2.0",
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
    test("Xliff20SerializeWithResourcesWithInstancesWithNoTarget", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
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
            '<xliff version="2.0" srcLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="2" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">blah blah blah</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        var actual = x.serialize();
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithTranslationUnitsWithInstances", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
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
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="/a/b/asdf.js" l:project="iosapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="2333" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">this is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>bababa</source>\n' +
            '          <target>ababab</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="2334" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">this is a different comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>bababa</source>\n' +
            '          <target>ababab</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        var actual = x.serialize();
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20SerializeWithTranslationUnitsWithTypes", function() {
        expect.assertions(2);
        var x = new Xliff({
            version: "2.0",
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
            "project": "webapp1",
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment",
            "datatype": "javascript"
        }));
        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "webapp1",
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a different comment",
            "datatype": "x-json"
        }));
        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="/a/b/asdf.js" l:project="webapp1">\n' +
            '    <group id="group_1" name="javascript">\n' +
            '      <unit id="1" name="asdf" type="res:string" l:datatype="javascript" l:context="asdfasdf">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">this is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>bababa</source>\n' +
            '          <target>ababab</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '    <group id="group_2" name="x-json">\n' +
            '      <unit id="2" name="asdf" type="res:string" l:datatype="x-json" l:context="asdfasdf">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">this is a different comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>bababa</source>\n' +
            '          <target>ababab</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';
        var actual = x.serialize();
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("Xliff20DeserializeCreateInstances", function() {
        expect.assertions(21);
        var x = new Xliff({
            version: "2.0",
            allowDups: true
        });
        expect(x).toBeTruthy();
        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="/a/b/asdf.js" l:project="iosapp">\n' +
            '    <unit id="2333" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '      <notes>\n' +
            '        <note appliesTo="source">this is a comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="2334" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '      <notes>\n' +
            '        <note appliesTo="source">this is a different comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
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
    test("Xliff20DeserializeLGStyleXliff", function() {
        expect.assertions(24);
        var x = new Xliff();
        expect(x).toBeTruthy();
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-KR" trgLang="ko-KR">\n' +
                '  <file id="f1" original="foo/bar/asdf.java" >\n' +
                '    <group id="g1" name="javascript">\n' +
                '      <unit id="1">\n' +
                '        <segment>\n' +
                '          <source>Closed Caption Settings</source>\n' +
                '          <target>자막 설정</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2">\n' +
                '        <segment>\n' +
                '          <source>Low</source>\n' +
                '          <target>낮음</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist[0].getSource()).toBe("Closed Caption Settings");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getTarget()).toBe("자막 설정");
        expect(reslist[0].getTargetLocale()).toBe("ko-KR");
        expect(reslist[0].getKey()).toBe("Closed Caption Settings");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("foo/bar/asdf.java");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].datatype).toBe("javascript");
        expect(!reslist[0].getComment()).toBeTruthy();
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[1].getSource()).toBe("Low");
        expect(reslist[1].getSourceLocale()).toBe("en-KR");
        expect(reslist[1].getTarget()).toBe("낮음");
        expect(reslist[1].getTargetLocale()).toBe("ko-KR");
        expect(reslist[1].getKey()).toBe("Low");
        expect(reslist[1].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[1].getProject()).toBe("foo/bar/asdf.java");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].datatype).toBe("javascript");
        expect(!reslist[1].getComment()).toBeTruthy();
        expect(reslist[1].getId()).toBe("2");
    });
    test("Xliff20DeserializeRealLGFile", function() {
        expect.assertions(37);
        var x = new Xliff();
        expect(x).toBeTruthy();
        var fs = require("fs");
        var str = fs.readFileSync("test/testfiles/test5.xliff", "utf-8");
        x.deserialize(str);
        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(7);
        expect(reslist[0].getSource()).toBe("Closed Caption Settings");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getTarget()).toBe("자막 설정");
        expect(reslist[0].getTargetLocale()).toBe("ko-KR");
        expect(reslist[0].getKey()).toBe("Closed Caption Settings");
        expect(reslist[0].getPath()).toBe("settings");
        expect(reslist[0].getProject()).toBe("settings");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].datatype).toBe("javascript");
        expect(!reslist[0].getComment()).toBeTruthy();
        expect(reslist[0].getId()).toBe("settings_1");
        expect(reslist[3].getSource()).toBe("Low");
        expect(reslist[3].getSourceLocale()).toBe("en-KR");
        expect(reslist[3].getTarget()).toBe("낮음");
        expect(reslist[3].getTargetLocale()).toBe("ko-KR");
        expect(reslist[3].getKey()).toBe("pictureControlLow_Male");
        expect(reslist[3].getPath()).toBe("settings");
        expect(reslist[3].getProject()).toBe("settings");
        expect(reslist[3].resType).toBe("string");
        expect(reslist[3].datatype).toBe("javascript");
        expect(!reslist[3].getComment()).toBeTruthy();
        expect(reslist[3].getId()).toBe("settings_1524");
        expect(reslist[6].getSource()).toBe("SEARCH");
        expect(reslist[6].getSourceLocale()).toBe("en-KR");
        expect(reslist[6].getTarget()).toBe("검색");
        expect(reslist[6].getTargetLocale()).toBe("ko-KR");
        expect(reslist[6].getKey()).toBe("SEARCH");
        expect(reslist[6].getPath()).toBe("settings");
        expect(reslist[6].getProject()).toBe("settings");
        expect(reslist[6].resType).toBe("string");
        expect(reslist[6].datatype).toBe("x-qml");
        expect(reslist[6].getComment()).toBeTruthy();
        expect(reslist[6].getComment()).toBe("copy strings from voice app");
        expect(reslist[6].getId()).toBe("settings_22");
    });
});
