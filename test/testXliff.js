/*
 * testXliff.js - test the Xliff object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!Xliff) {
	var Xliff = require("../lib/Xliff.js");
	var TranslationUnit = Xliff.TranslationUnit;
    var ResourceString = require("../lib/ResourceString.js");
    var AndroidResourceString = require("../lib/AndroidResourceString.js");
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
    
    testXliffAddResource: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "ht-webapp12"
        });
        
        x.addResource(res);
        
        var reslist = x.getResources({
            reskey: "foobar"
        });
        
        test.ok(reslist);
        
        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getState(), "new");
        test.equal(reslist[0].getContext(), "asdf");
        test.equal(reslist[0].getComment(), "this is a comment");
        test.equal(reslist[0].getProject(), "ht-webapp12");
       
        test.done();
    },

    testXliffSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "ht-webapp12"
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });
        
        test.ok(reslist);
        
        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
       
        test.done();
    },

    testXliffAddMultipleResourcesRightSize: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        test.equal(x.size(), 0);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });
        
        test.ok(reslist);
        
        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        test.equal(x.size(), 1);
        
        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "ht-webapp12"
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        // this one has a different locale
        // so it should not overwrite the one above
        res = new ResourceString({
            source: "Asdf asdf",
            locale: "fr-FR",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.ok(!reslist[0].getComment());

        test.equal(reslist[1].getSource(), "Asdf asdf");
        test.equal(reslist[1].getLocale(), "fr-FR");
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        // should not add this one
        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        var reslist = x.getResources({
            locale: "en-US"
        });
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");

        test.done();
    },

    testXliffSerializeWithSourceOnly: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffSerializeWithContext: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var res = new AndroidResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            context: "foobar"
        });
        
        x.addResource(res);

        var res = new AndroidResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            context: "asdf"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext" x-context="foobar">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="string" datatype="plaintext" x-context="asdf">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffSerializeWithExplicitIds: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            id: 4444444
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        diff(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444444" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444445" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444444" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444445" resname="huzzah" restype="string" datatype="plaintext">\n' +
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
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "source"
        });
        
        x.addResource(res);

        var res = new ResourceString({
            source: "foobarfoo",
            locale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "source"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "bebe bebe",
            locale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        x.addResource(res);

        diff(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            comment: "foobar is where it's at!",
            origin: "source"
        });
        
        x.addResource(res);

        var res = new ResourceString({
            source: "foobarfoo",
            locale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            comment: "come & enjoy it with us",
            origin: "source"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "bebe bebe",
            locale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note annotates="source">foobar is where it&apos;s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '        <note annotates="source">come &amp; enjoy it with us</note>\n' +
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
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <header>\n' +
            	'      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."></tool>\n' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."></tool>\n' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
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
        
        var res = new ResourcePlural({
            strings: {
            	"one": "There is 1 object.",
            	"other": "There are {n} objects."
            },
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            resType: "plural",
            quantity: "one"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
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
       
        test.done();
    },

    testXliffSerializeWithArrays: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var res = new ResourceArray({
            array: ["Zero", "One", "Two"],
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
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
       
        test.done();
    },

    testXliffSerializeWithXMLEscaping: function(test) {
        test.expect(2);

        var x = new Xliff();
        test.ok(x);
        
        var res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
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
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            comment: "A very nice string"
        });
        
        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            comment: "Totally awesome."
        });
        
        x.addResource(res);

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <note annotates="source">A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <note annotates="source">Totally awesome.</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    },

    testXliffDeserializeWithSourceOnly: function(test) {
        test.expect(17);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
      
        test.done();
    },

    testXliffDeserializeWithSourceAndTarget: function(test) {
        test.expect(31);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        
        test.equal(reslist.length, 4);
        
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "foobarfoo");
        test.equal(reslist[1].getLocale(), "de-DE");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[1].getProject(), "ht-androidapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "1");

        test.equal(reslist[2].getSource(), "baby baby");
        test.equal(reslist[2].getLocale(), "en-US");
        test.equal(reslist[2].getKey(), "huzzah");
        test.equal(reslist[2].getPath(), "foo/bar/j.java");
        test.equal(reslist[2].getProject(), "ht-webapp12");
        test.equal(reslist[2].resType, "string");
        test.equal(reslist[2].getId(), "2");
      
        test.equal(reslist[3].getSource(), "bebe bebe");
        test.equal(reslist[3].getLocale(), "fr-FR");
        test.equal(reslist[3].getKey(), "huzzah");
        test.equal(reslist[3].getPath(), "foo/bar/j.java");
        test.equal(reslist[3].getProject(), "ht-webapp12");
        test.equal(reslist[3].resType, "string");
        test.equal(reslist[3].getId(), "2");

        test.done();
    },

    testXliffDeserializeWithXMLUnescaping: function(test) {
        test.expect(17);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
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
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
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
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
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
        
        test.deepEqual(reslist[0].getPlurals(), {
        	one: "There is 1 object.",
        	other: "There are {n} objects."
        });
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "plural");
        test.equal(reslist[0].getId(), "1");

        test.done();
    },

    testXliffDeserializeWithArrays: function(test) {
        test.expect(9);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
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

        test.deepEqual(reslist[0].getArray(), ["Zero", "One", "Two"]);
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "array");

        test.done();
    },

    testXliffDeserializeWithArraysAndTranslations: function(test) {
        test.expect(25);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="ht-androidapp">\n' +
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
        
        test.equal(reslist.length, 2);

        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");
        
        var items = reslist[0].getArray();
        
        test.equal(items.length, 4);
        test.equal(items[0], "This is element 0");
        test.equal(items[1], "This is element 1");
        test.equal(items[2], "This is element 2");
        test.equal(items[3], "This is element 3");

        test.equal(reslist[1].getLocale(), "es-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "res/values/arrays.xml");
        test.equal(reslist[1].getProject(), "ht-androidapp");
        test.equal(reslist[1].resType, "array");
        test.equal(reslist[1].getOrigin(), "target");

        var items = reslist[1].getArray();
        
        test.equal(items.length, 4);
        test.equal(items[0], "Este es 0");
        test.equal(items[1], "Este es 1");
        test.equal(items[2], "Este es 2");
        test.equal(items[3], "Este es 3");

        test.done();
    },

    testXliffDeserializeWithArraysAndTranslationsPartial: function(test) {
        test.expect(25);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="ht-androidapp">\n' +
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
        
        test.equal(reslist.length, 2);

        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");
        
        var items = reslist[0].getArray();
        
        test.equal(items.length, 4);
        test.equal(items[0], null);
        test.equal(items[1], null);
        test.equal(items[2], null);
        test.equal(items[3], "This is element 3");

        test.equal(reslist[1].getLocale(), "es-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "res/values/arrays.xml");
        test.equal(reslist[1].getProject(), "ht-androidapp");
        test.equal(reslist[1].resType, "array");
        test.equal(reslist[1].getOrigin(), "target");

        var items = reslist[1].getArray();
        
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
        	    '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
        	    '    <body>\n' +
        	    '      <trans-unit id="1" resname="foobar" restype="string">\n' +
        	    '        <source>Asdf asdf</source>\n' +
        	    '        <note annotates="source">A very nice string</note>\n' +
        	    '      </trans-unit>\n' +
        	    '    </body>\n' +
        	    '  </file>\n' + 
        	    '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
        	    '    <body>\n' +
        	    '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
        	    '        <source>baby baby</source>\n' +
        	    '        <note annotates="source">Totally awesome.</note>\n' +
        	    '      </trans-unit>\n' +
        	    '    </body>\n' +
        	    '  </file>\n' +
        	    '</xliff>');

        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getComment(), "A very nice string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
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
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getContext(), "na na na");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getContext(), "asdf");
      
        test.done();
    },
    
    /*
    testXliffDeserializeRealFile: function(test) {
        test.expect(3);

        var x = new Xliff();
        test.ok(x);
        
        var fs = require("fs");
        
        var str = fs.readFileSync("/Users/edwinhoogerbeets/src/ht-iosapp/en-US.xliff", "utf-8");
        
        x.deserialize(str);

        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 3757);

        test.done();
    }
    */
    
    testXliffDeserializeEmptySource: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source></source>\n' +
                '        <target>Baby Baby</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "bebe bebe");
        test.equal(reslist[1].getLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "target");
      
        test.done();
    },

    testXliffDeserializeEmptyTarget: function(test) {
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
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "ht-androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");
        
        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");
        
        test.done();
    },

    testXliffDeserializeWithMrkTagInTarget: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">bebe bebe</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "bebe bebe");
        test.equal(reslist[1].getLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "target");

        test.done();
    },

    testXliffDeserializeWithEmptyMrkTagInTarget: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.done();
    },
    
    testXliffDeserializeWithMultipleMrkTagsInTargetEuro: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "This is segment 1. This is segment 2. This is segment 3.");
        test.equal(reslist[1].getLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "target");

        test.done();
    },
    
    testXliffDeserializeWithMultipleMrkTagsInTargetAsian: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="zh-Hans-CN" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "ht-webapp12");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "This is segment 1.This is segment 2.This is segment 3.");
        test.equal(reslist[1].getLocale(), "zh-Hans-CN");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "ht-webapp12");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "target");

        test.done();
    },
    
    testXliffTranslationUnitConstructor: function(test) {
    	test.expect(1);
    	
    	var tu = new TranslationUnit({
    		"source": "a", 
    		"sourceLocale": "en-US", 
    		"key": "foobar", 
    		"file": "/a/b/asdf.js", 
    		"project": "ht-iosapp"
    	});
    	
    	test.ok(tu);
    	
    	test.done();
    },

    testXliffTranslationUnitConstructorEverythingCopied: function(test) {
    	test.expect(10);
    	
    	var tu = new TranslationUnit({
    		"source": "a", 
    		"sourceLocale": "en-US", 
    		"key": "foobar", 
    		"file": "/a/b/asdf.js",
    		"project": "ht-iosapp",
    		"id": 2334,
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment"
    	});
    	
    	test.ok(tu);
    	
    	test.equal(tu.source, "a");
    	test.equal(tu.sourceLocale, "en-US");
    	test.equal(tu.key, "foobar");
    	test.equal(tu.file, "/a/b/asdf.js");
    	test.equal(tu.project, "ht-iosapp");
    	test.equal(tu.id, 2334);
    	test.equal(tu.origin, "source");
    	test.equal(tu.context, "asdfasdf");
    	test.equal(tu.comment, "this is a comment");

    	test.done();
    },
    
    testXliffTranslationUnitConstructorMissingBasicProperties: function(test) {
    	test.expect(1);
    	
    	test.throws(function() {
	    	var tu = new TranslationUnit({
	    		"source": "a", 
	    		"sourceLocale": "en-US", 
	    		"file": "/a/b/asdf.js",
	    		"project": "ht-iosapp",
	    		"id": 2334,
	    		"origin": "source",
	    		"context": "asdfasdf",
	    		"comment": "this is a comment"
	    	});
    	});
    	
    	test.done();
    },

    testXliffAddTranslationUnit: function(test) {
        test.expect(11);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
    		"source": "a", 
    		"sourceLocale": "en-US", 
    		"key": "foobar", 
    		"file": "/a/b/asdf.js",
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment"
        }));
        
        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 1);
        
        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "ht-iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), 2334);
        test.equal(reslist[0].getOrigin(), "source");

        test.done();
    },
    
    testXliffAddTranslationUnitMergeResources: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
    		"source": "a", 
    		"sourceLocale": "en-US", 
    		"key": "foobar", 
    		"file": "/a/b/asdf.js",
    		"project": "ht-iosapp",
    		"id": 2334,
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
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment"
        }));
        
        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 2);
        
        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "ht-iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), 2334);
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "b");
        test.equal(reslist[1].getLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "/a/b/asdf.js");
        test.equal(reslist[1].getProject(), "ht-iosapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), 2334);
        test.equal(reslist[1].getOrigin(), "target");

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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
        test.equal(units[0].project, "ht-iosapp");
        test.equal(units[0].id, 2334);
        test.equal(units[0].resType, "string");
        test.equal(units[0].origin, "source");
        test.equal(units[0].context, "asdfasdf");
        test.equal(units[0].comment, "this is a new comment");

        test.done();
    },

    testXliffAddTranslationUnitRightResourceTypesRegularString: function(test) {
        test.expect(5);

        var x = new Xliff();
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
    		"source": "a", 
    		"sourceLocale": "en-US", 
    		"target": "b",
    		"targetLocale": "fr-FR",
    		"key": "foobar", 
    		"file": "/a/b/asdf.js",
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType": "string",
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment",
    		"datatype": "javascript"
        }));
                
        var resources = x.getResources();
        
        test.ok(resources);
        
        test.equal(resources.length, 2);

        test.ok(resources[0] instanceof ResourceString);
        test.ok(resources[1] instanceof ResourceString);

        test.done();
    },

    testXliffAddTranslationUnitRightResourceTypesContextString: function(test) {
        test.expect(7);

        ResourceFactory.registerDataType("x-android-resource", "string", AndroidResourceString);
        
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
    		"datatype": "x-android-resource"
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
    		"datatype": "x-android-resource"
        }));
        
        var resources = x.getResources();
        
        test.ok(resources);
        
        test.equal(resources.length, 4);

        test.ok(resources[0] instanceof AndroidResourceString);
        test.ok(resources[1] instanceof AndroidResourceString);
        test.ok(resources[2] instanceof AndroidResourceString);
        test.ok(resources[3] instanceof AndroidResourceString);

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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
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
        test.expect(7);

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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "target",
    		"comment": "this is a comment",
    		"datatype": "x-xib"
        }));
        
        var resources = x.getResources();
        
        test.ok(resources);
        
        test.equal(resources.length, 4);
        
        test.ok(resources[0] instanceof IosLayoutResourceString);
        test.ok(resources[1] instanceof IosLayoutResourceString);
        test.ok(resources[2] instanceof IosLayoutResourceString);
        test.ok(resources[3] instanceof IosLayoutResourceString);
        
        test.done();
    },
    
    testXliffAddTranslationUnitDifferentPaths: function(test) {
        test.expect(35);

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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "target",
    		"comment": "this is a comment",
    		"datatype": "x-xib"
        }));
        
        var reslist = x.getResources();
        
        test.ok(reslist);
        
        test.equal(reslist.length, 4);

        test.equal(reslist[0].getSource(), "a");
        test.equal(reslist[0].getLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "a/b/asdf.xib");
        test.equal(reslist[0].getProject(), "ht-iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), 2334);
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "foo");
        test.equal(reslist[1].getLocale(), "de-DE");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "a/b/asdf.xib");
        test.equal(reslist[1].getProject(), "ht-iosapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), 2334);
        test.equal(reslist[1].getOrigin(), "target");

        test.equal(reslist[2].getSource(), "a");
        test.equal(reslist[2].getLocale(), "en-US");
        test.equal(reslist[2].getKey(), "foobar");
        test.equal(reslist[2].getPath(), "a/b/asdf~ipad.xib");
        test.equal(reslist[2].getProject(), "ht-iosapp");
        test.equal(reslist[2].resType, "string");
        test.equal(reslist[2].getId(), 2334);
        test.equal(reslist[2].getOrigin(), "source");

        test.equal(reslist[3].getSource(), "foo");
        test.equal(reslist[3].getLocale(), "de-DE");
        test.equal(reslist[3].getKey(), "foobar");
        test.equal(reslist[3].getPath(), "a/b/asdf~ipad.xib");
        test.equal(reslist[3].getProject(), "ht-iosapp");
        test.equal(reslist[3].resType, "string");
        test.equal(reslist[3].getId(), 2334);
        test.equal(reslist[3].getOrigin(), "target");
        
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment"
        }));

        diff(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
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
    		"project": "ht-iosapp",
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
    		"project": "ht-iosapp",
    		"id": 2334,
    		"resType":"string",
    		"origin": "source",
    		"context": "asdfasdf",
    		"comment": "this is a comment"
        }));

        diff(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="de-DE" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="de-DE" product-name="ht-iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note annotates="source">this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
       
        test.done();
    }
};