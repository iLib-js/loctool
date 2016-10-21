/*
 * testXliff.js - test the Xliff object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!Xliff) {
    var TranslationUnit = require("../lib/TranslationUnit.js");
    var Xliff = require("../lib/Xliff.js");
}

module.exports = {
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
    
    testXliffAddTranslationUnit: function(test) {
        test.expect(8);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);
        
        var tu2 = x.getTranslationUnits({
            key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
       
        test.done();
    },

    testXliffSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        test.equal(x.size(), 0);
        
        x.addTranslationUnit(tu);
        
        test.equal(x.size(), 1);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnits: function(test) {
        test.expect(8);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
            key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsRightSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        test.equal(x.size(), 0);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.size(), 2);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsOverwrite: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        // this one has the same source and target locales, key, and file
        // so it should overwrite the one above
        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
            key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 1);
        test.equal(tu2[0].source, "baby baby");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
        test.equal(tu2[0].comment, "blah blah blah");
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsOverwriteRightSize: function(test) {
        test.expect(4);

        var x = new Xliff();
        test.ok(x);
        
        test.equal(x.size(), 0);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.size(), 1);
        
        // this one has the same source and target locales, key, and file
        // so it should overwrite the one above
        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            coment: "blah blah blah",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.size(), 1);
       
        test.done();
    },

    testXliffAddMultipleTranslationUnitsNoOverwrite: function(test) {
        test.expect(15);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        // this one has a different target locale
        // so it should not overwrite the one above
        tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "foobar",
            file: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
            key: "foobar"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 2);
        
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");
        test.ok(!tu2[0].comment);

        test.equal(tu2[1].source, "Asdf asdf");
        test.equal(tu2[1].sourceLocale, "en-US");
        test.equal(tu2[1].targetLocale, "fr-FR");
        test.equal(tu2[1].key, "foobar");
        test.equal(tu2[1].file, "foo/bar/asdf.java");
        test.equal(tu2[1].comment, "blah blah blah");

        test.done();
    },

    testXliffGetTranslationUnitsMultiple: function(test) {
        test.expect(13);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        var tu2 = x.getTranslationUnits({
            sourceLocale: "en-US"
        });
        
        test.ok(tu2);
        
        test.equal(tu2.length, 2);
        
        test.equal(tu2[0].source, "Asdf asdf");
        test.equal(tu2[0].sourceLocale, "en-US");
        test.equal(tu2[0].targetLocale, "de-DE");
        test.equal(tu2[0].key, "foobar");
        test.equal(tu2[0].file, "foo/bar/asdf.java");

        test.equal(tu2[1].source, "baby baby");
        test.equal(tu2[1].sourceLocale, "en-US");
        test.equal(tu2[1].targetLocale, "fr-FR");
        test.equal(tu2[1].key, "huzzah");
        test.equal(tu2[1].file, "foo/bar/j.java");

        test.done();
    },

    testXliffSerializeWithSourceOnly: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "string"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12",
            resType: "string"
        });
        
        x.addTranslationUnit(tu);

        var xml = x.serialize();
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="1.2">\n' +
        '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
        '    <body>\n' +
        '      <trans-unit id="1" resname="foobar" restype="string">\n' +
        '        <source>Asdf asdf</source>\n' +
        '      </trans-unit>\n' +
        '    </body>\n' +
        '  </file>\n' + 
        '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
        '    <body>\n' +
        '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
        '        <source>baby baby</source>\n' +
        '      </trans-unit>\n' +
        '    </body>\n' +
        '  </file>\n' +
        '</xliff>';
        
        for (var i = 0; i < xml.length; i++) {
        	if (xml[i] !== expected[i]) {
        		console.log("found diff at char " + i);
        		console.log("'" + xml.substring(i) + "'");
        		console.log("'" + expected.substring(i) + "'");
        		break;
        	}
        }
        console.log(xml);
        console.log(expected);
        
        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },
    
    testXliffSerializeWithSourceAndTarget: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            target: "foobarfoo",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            target: "bebe bebe",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
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
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <header>\n' +
                    '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <header>\n' +
                    '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffSerializeWithPlurals: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "There is 1 object.",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "plural",
            quantity: "one"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "There are {n} objects.",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "plural",
            quantity: "other"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffSerializeWithArrays: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Zero",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "array",
            ordinal: 0
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "One",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "array",
            ordinal: 1
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "Two",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "array",
            ordinal: 2
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" extype="1">\n' +
                '        <source>One</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" extype="2">\n' +
                '        <source>Two</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffSerializeWithXMLEscaping: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var tu = new TranslationUnit({
            source: "Asdf <b>asdf</b>",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "string"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12",
            resType: "string"
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
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
        
        var tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "string",
            comment: "A very nice string"
        });
        
        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "ht-webapp12",
            resType: "string",
            comment: "Totally awesome."
        });
        
        x.addTranslationUnit(tu);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <note annotates="source">A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <note annotates="source">Totally awesome.</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffDeserializeWithSourceOnly: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units.length, 2);
        
        test.equal(units[0].source, "Asdf asdf");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "string");
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "baby baby");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "fr-FR");
        test.equal(units[1].key, "huzzah");
        test.equal(units[1].file, "foo/bar/j.java");
        test.equal(units[1].project, "ht-webapp12");
        test.equal(units[1].resType, "string");
        test.equal(units[1].id, "2");
      
        test.done();
    },

    testXliffDeserializeWithSourceAndTarget: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units.length, 2);
        
        test.equal(units[0].source, "Asdf asdf");
        test.equal(units[0].target, "foobarfoo");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "string");
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "baby baby");
        test.equal(units[1].target, "bebe bebe");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "fr-FR");
        test.equal(units[1].key, "huzzah");
        test.equal(units[1].file, "foo/bar/j.java");
        test.equal(units[1].project, "ht-webapp12");
        test.equal(units[1].resType, "string");
        test.equal(units[1].id, "2");
      
        test.done();
    },

    testXliffDeserializeWithXMLUnescaping: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units.length, 2);
        
        test.equal(units[0].source, "Asdf <b>asdf</b>");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "string");
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "fr-FR");
        test.equal(units[1].key, "huzzah");
        test.equal(units[1].file, "foo/bar/j.java");
        test.equal(units[1].project, "ht-webapp12");
        test.equal(units[1].resType, "string");
        test.equal(units[1].id, "2");
      
        test.done();
    },

    testXliffDeserializeWithPlurals: function(test) {
        test.expect(21);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units.length, 2);
        
        test.equal(units[0].source, "There is 1 object.");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "plural");
        test.equal(units[0].quantity, "one");
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "There are {n} objects.");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "de-DE");
        test.equal(units[1].key, "foobar");
        test.equal(units[1].file, "foo/bar/asdf.java");
        test.equal(units[1].project, "ht-androidapp");
        test.equal(units[1].resType, "plural");
        test.equal(units[1].quantity, "other");
        test.equal(units[1].id, "2");
      
        test.done();
    },

    testXliffDeserializeWithArrays: function(test) {
        test.expect(30);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" extype="1">\n' +
                '        <source>One</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" extype="2">\n' +
                '        <source>Two</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units.length, 3);

        test.equal(units[0].source, "Zero");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "array");
        test.equal(units[0].ordinal, 0);
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "One");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "de-DE");
        test.equal(units[1].key, "foobar");
        test.equal(units[1].file, "foo/bar/asdf.java");
        test.equal(units[1].project, "ht-androidapp");
        test.equal(units[1].resType, "array");
        test.equal(units[1].ordinal, 1);
        test.equal(units[1].id, "2");

        test.equal(units[1].source, "Two");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "de-DE");
        test.equal(units[1].key, "foobar");
        test.equal(units[1].file, "foo/bar/asdf.java");
        test.equal(units[1].project, "ht-androidapp");
        test.equal(units[1].resType, "array");
        test.equal(units[1].ordinal, 2);
        test.equal(units[1].id, "3");

        test.done();
    },

    testXliffDeserializeWithComments: function(test) {
        test.expect(20);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
        	    '<?xml version="1.0" encoding="utf-8"?>\n' +
        	    '<xliff version="1.2">\n' +
        	    '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
        	    '    <body>\n' +
        	    '      <trans-unit id="1" resname="foobar" restype="string">\n' +
        	    '        <source>Asdf asdf</source>\n' +
        	    '        <note annotates="source">A very nice string</note>\n' +
        	    '      </trans-unit>\n' +
        	    '    </body>\n' +
        	    '  </file>\n' + 
        	    '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">' +
        	    '    <body>\n' +
        	    '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
        	    '        <source>baby baby</source>\n' +
        	    '        <note annotates="source">Totally awesome.</note>\n' +
        	    '      </trans-unit>\n' +
        	    '    </body>\n' +
        	    '  </file>\n' +
        	    '</xliff>');

        var units = x.getTranslationUnits();
        
        test.ok(units);
        
        test.equal(units[0].source, "Asdf asdf");
        test.equal(units[0].sourceLocale, "en-US");
        test.equal(units[0].targetLocale, "de-DE");
        test.equal(units[0].key, "foobar");
        test.equal(units[0].file, "foo/bar/asdf.java");
        test.equal(units[0].project, "ht-androidapp");
        test.equal(units[0].resType, "string");
        test.equal(units[0].comment, "A very nice string");
        test.equal(units[0].id, "1");

        test.equal(units[1].source, "baby baby");
        test.equal(units[1].sourceLocale, "en-US");
        test.equal(units[1].targetLocale, "fr-FR");
        test.equal(units[1].key, "huzzah");
        test.equal(units[1].file, "foo/bar/j.java");
        test.equal(units[1].project, "ht-webapp12");
        test.equal(units[1].resType, "string");
        test.equal(units[1].comment, "Totally awesome.");
        test.equal(units[1].id, "2");

        test.done();
    }
};