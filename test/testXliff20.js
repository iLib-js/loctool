/*
 * testXliff20.js - test the Xliff 2.0 object.
 *
 * Copyright © 2019 JEDLSoft
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
    testXliff20Constructor: function(test) {
        test.expect(1);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.done();
    },

    testXliff20ConstructorIsEmpty: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.equal(x.size(), 0);
        test.done();
    },

    testXliff20ConstructorRightVersion: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorNumericVersion12: function(test) {
        test.expect(2);

        var x = new Xliff({version: 1.2});
        test.ok(x);

        test.equal(x.getVersion(), "1.2");
        test.done();
    },

    testXliff20ConstructorNumericVersion20: function(test) {
        test.expect(2);

        var x = new Xliff({version: 2.0});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorFull: function(test) {
        test.expect(8);

        var x = new Xliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        test.equal(x.getVersion(), "2.0");

        test.equal(x["tool-id"], "loctool");
        test.equal(x["tool-name"], "Localization Tool"),
        test.equal(x["tool-version"], "1.2.34"),
        test.equal(x["tool-company"], "My Company, Inc."),
        test.equal(x.copyright, "Copyright 2016, My Company, Inc. All rights reserved."),
        test.equal(x.path, "a/b/c.xliff");

        test.done();
    },

    testXliff20GetPath: function(test) {
        test.expect(2);

        var x = new Xliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        test.done();
    },


    testXliff20SetPath: function(test) {
        test.expect(3);

        var x = new Xliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliff20SetPathInitiallyEmpty: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.ok(!x.getPath());

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliff20AddResource: function(test) {
        test.expect(11);

        var x = new Xliff({version: "2.0"});
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

    testXliff20Size: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddMultipleResources: function(test) {
        test.expect(8);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddMultipleResourcesRightSize: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddMultipleResourcesOverwrite: function(test) {
        test.expect(9);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddMultipleResourcesOverwriteRightSize: function(test) {
        test.expect(4);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddMultipleResourcesNoOverwrite: function(test) {
        test.expect(13);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddResourceDontAddSourceLocaleAsTarget: function(test) {
        test.expect(2);

        var x = new Xliff({
            version: "2.0",
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

    testXliff20GetResourcesMultiple: function(test) {
        test.expect(11);

        var x = new Xliff({version: "2.0"});
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

    testXliff20SerializeWithContext: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext" l:context="foobar">\n' +
            '      <segment>\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target>gutver</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithSourceOnly: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
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
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithSourceOnlyFilterOutWrongLocales: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '      <segment>\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithFlavors: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp" l:flavor="chocolate">\n' +
            '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '      <segment>\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target>gutver</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithSourceOnlyAndPlurals: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
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
            '    <unit id="2" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="zero">\n' +
            '      <segment>\n' +
            '        <source>0</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="3" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
            '      <segment>\n' +
            '        <source>1</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="4" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
            '      <segment>\n' +
            '        <source>few</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithSourceOnlyAndArray: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE"
        });

        x.addResource(res);

        var actual = x.serialize();
        var expected =
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
            '    <unit id="2" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
            '      <segment>\n' +
            '        <source>one</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="3" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
            '      <segment>\n' +
            '        <source>two</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="4" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
            '      <segment>\n' +
            '        <source>three</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
             '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithExplicitIds: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="4444444" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="4444445" name="asdf" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>abcdef</source>\n' +
                '        <target>hijklmn</target>\n' +
                '      </segment>\n' +
               '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20SerializeWithSourceAndTarget: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(x.serialize(), expected);
        test.equal(x.serialize(), expected);

        test.done();
    },

    testXliff20SerializeWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });

        x.addResource(res);

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">foobar is where it\'s at!</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">come &amp; enjoy it with us</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

        var actual = x.serialize();

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20SerializeWithHeader: function(test) {
        test.expect(2);

        var x = new Xliff({
            version: "2.0",
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."></tool>\n' +
                '    </header>\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithPlurals: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:plural" l:datatype="ruby" l:category="one">\n' +
                '      <segment>\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target state="new">Da gibts 1 Objekt.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:plural" l:datatype="ruby" l:category="other">\n' +
                '      <segment>\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Da gibts {n} Objekten.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20SerializeWithArrays: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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
                '</xliff>';
        diff(actual, expected)
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithXMLEscaping: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar &quot;asdf&quot;" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '        <target>Asdf \'quotes\'</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah &amp;quot;asdf&amp;quot; #(test)" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '        <target>baby #(test)</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithXMLEscapingWithQuotes: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="&quot;double&quot; and &apos;single&apos;" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Here are "double" and \'single\' quotes.</source>\n' +
                '        <target>Hier zijn "dubbel" en \'singel\' quotaties.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliff20SerializeWithComments: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">A very nice string</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliff20DeserializeWithSourceOnly: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);

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
        test.equal(reslist[1].getTargetLocale(), "de-DE");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20DeserializeWithSourceAndTarget: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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
        test.equal(reslist[1].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliff20DeserializeWithXMLUnescaping: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

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

    testXliff20DeserializeWithEscapedNewLines: function(test) {
        test.expect(17);

        var x = new Xliff();
        test.ok(x);

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

    testXliff20DeserializeWithPlurals: function(test) {
        test.expect(10);

        var x = new Xliff();
        test.ok(x);

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

    testXliff20DeserializeWithPluralsTranslated: function(test) {
        test.expect(13);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeWithArrays: function(test) {
        test.expect(10);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeWithArraysTranslated: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeWithArraysAndTranslations: function(test) {
        test.expect(20);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeWithArraysAndTranslationsPartial: function(test) {
        test.expect(20);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeWithComments: function(test) {
        test.expect(18);

        var x = new Xliff();
        test.ok(x);

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

    testXliff20DeserializeWithContext: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeRealFile: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);

        var fs = require("fs");

        var str = fs.readFileSync("testfiles/test4.xliff", "utf-8");

        x.deserialize(str);

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 4);

        test.done();
    },

    testXliff20DeserializeEmptySource: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliff20DeserializeEmptyTarget: function(test) {
        test.expect(23);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");

        test.done();
    },

    testXliff20DeserializeEmptyTargetNoTargetLocale: function(test) {
        test.expect(23);

        var x = new Xliff();
        test.ok(x);

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

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.ok(!reslist[0].getTargetLocale());
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.ok(!reslist[0].getTargetLocale());
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");

        test.done();
    },

    testXliff20DeserializeWithMultipleSegments: function(test) {
        test.expect(12);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "seg1 seg2 seg3");
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

    testXliff20DeserializePreserveSourceWhitespace: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializePreserveTargetWhitespace: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20AddTranslationUnit: function(test) {
        test.expect(10);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitMergeResources: function(test) {
        test.expect(12);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitAddMultipleUnits: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitReplacePreviousUnit: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitRightContents: function(test) {
        test.expect(15);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitRightResourceTypesRegularString: function(test) {
        test.expect(4);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitRightResourceTypesContextString: function(test) {
        test.expect(5);

        ResourceFactory.registerDataType("x-android-resource", "string", ContextResourceString);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitReplaceSourceOnlyUnit: function(test) {
        test.expect(3);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitDifferentPathsRightTypes: function(test) {
        test.expect(5);

        var x = new Xliff({version: "2.0"});
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

    testXliff20AddTranslationUnitDifferentPaths: function(test) {
        test.expect(23);

        var x = new Xliff({version: "2.0"});
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

    testXliff20SerializeWithTranslationUnits: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
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
                '    <unit id="2334" name="foobar" type="res:string" l:context="asdfasdf">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">this is a comment</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(x.serialize(), expected);
        test.equal(x.serialize(), expected);

        test.done();
    },

    testXliff20SerializeWithTranslationUnitsDifferentLocales: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
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
            test.ok(e);
        }

        test.done();
    },

    testXliff20AddResourcesWithInstances: function(test) {
        test.expect(9);

        var x = new Xliff({
            version: "2.0",
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

    testXliff20AddMultipleResourcesAddInstances: function(test) {
        test.expect(17);

        var x = new Xliff({
            version: "2.0",
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

    testXliff20SerializeWithResourcesWithInstancesWithNoTarget: function(test) {
        test.expect(2);

        var x = new Xliff({
            version: "2.0",
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
            '<xliff version="2.0" srcLang="en-US" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '      <segment>\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="2" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '      <notes>\n' +
            '        <note appliesTo="source">blah blah blah</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>';

        var actual = x.serialize();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testXliff20SerializeWithTranslationUnitsWithInstances: function(test) {
        test.expect(2);

        var x = new Xliff({
            version: "2.0",
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
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
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
            '</xliff>';

        var actual = x.serialize();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testXliff20DeserializeCreateInstances: function(test) {
        test.expect(21);

        var x = new Xliff({
            version: "2.0",
            allowDups: true
        });
        test.ok(x);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" \n' +
            '  xmlns:l="http://ilib-js.com/loctool">\n' +
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

    testXliff20DeserializeLGStyleXliff: function(test) {
        test.expect(24);

        var x = new Xliff();
        test.ok(x);

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

        test.ok(reslist);

        test.equal(reslist[0].getSource(), "Closed Caption Settings");
        test.equal(reslist[0].getSourceLocale(), "en-KR");
        test.equal(reslist[0].getTarget(), "자막 설정");
        test.equal(reslist[0].getTargetLocale(), "ko-KR");
        test.equal(reslist[0].getKey(), "Closed Caption Settings");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "foo/bar/asdf.java");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].datatype, "javascript");
        test.ok(!reslist[0].getComment());
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "Low");
        test.equal(reslist[1].getSourceLocale(), "en-KR");
        test.equal(reslist[1].getTarget(), "낮음");
        test.equal(reslist[1].getTargetLocale(), "ko-KR");
        test.equal(reslist[1].getKey(), "Low");
        test.equal(reslist[1].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[1].getProject(), "foo/bar/asdf.java");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].datatype, "javascript");
        test.ok(!reslist[1].getComment());
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20DeserializeRealLGFile: function(test) {
        test.expect(25);

        var x = new Xliff();
        test.ok(x);

        var fs = require("fs");

        var str = fs.readFileSync("testfiles/test5.xliff", "utf-8");

        x.deserialize(str);

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 6);

        test.equal(reslist[0].getSource(), "Closed Caption Settings");
        test.equal(reslist[0].getSourceLocale(), "en-KR");
        test.equal(reslist[0].getTarget(), "자막 설정");
        test.equal(reslist[0].getTargetLocale(), "ko-KR");
        test.equal(reslist[0].getKey(), "Closed Caption Settings");
        test.equal(reslist[0].getPath(), "settings");
        test.equal(reslist[0].getProject(), "settings");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].datatype, "javascript");
        test.ok(!reslist[0].getComment());
        test.equal(reslist[0].getId(), "settings_1");

        test.equal(reslist[3].getSource(), "Low");
        test.equal(reslist[3].getSourceLocale(), "en-KR");
        test.equal(reslist[3].getTarget(), "낮음");
        test.equal(reslist[3].getTargetLocale(), "ko-KR");
        test.equal(reslist[3].getKey(), "pictureControlLow_Male");
        test.equal(reslist[3].getPath(), "settings");
        test.equal(reslist[3].getProject(), "settings");
        test.equal(reslist[3].resType, "string");
        test.equal(reslist[3].datatype, "javascript");
        test.ok(!reslist[3].getComment());
        test.equal(reslist[3].getId(), "settings_1524");

        test.done();
    }
};
