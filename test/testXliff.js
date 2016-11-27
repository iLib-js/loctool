/*
 * testXliff.js - test the Xliff object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!Xliff) {
	var Xliff = require("../lib/Xliff.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
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
            ocale: "en-US",
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
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
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
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            context: "foobar"
        });
        
        x.addResource(res);

        var res = new ResourceString({
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
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="foobar">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="string" x-context="asdf">\n' +
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

        test.equal(x.serialize(), 
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="ht-androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444444" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444445" resname="huzzah" restype="string">\n' +
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
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
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
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note annotates="source">foobar is where it&apos;s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
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
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="ht-webapp12">\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."></tool>\n' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
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
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' + 
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
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
                '      <trans-unit id="1" resname="foobar" restype="plural" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" extype="other">\n' +
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
    
    testXliffDeserializeWithMultipleMrkTagsInTarget: function(test) {
        test.expect(19);

        var x = new Xliff();
        test.ok(x);
        
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="ht-webapp12">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk><mrk mtype="seg" mid="5"> This is segment 2.</mrk><mrk mtype="seg" mid="6"> This is segment 3.</mrk></target>\n' +
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
    }
};