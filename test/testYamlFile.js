/*
 * testYaml.js - test the Yaml object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!YamlFile) {
	var YamlFile = require("../lib/YamlFile.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var WebProject =  require("../lib/WebProject.js");
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
    testYamlConstructorEmpty: function(test) {
        test.expect(1);

        var y = new YamlFile();
        test.ok(y);
        
        test.done();
    },
    
    testYamlConstructorFull: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
        	pathName: "a/b/en-US.yml"
        });
        test.ok(y);
        
        test.equal(y.getPath(), "a/b/en-US.yml");

        test.done();
    },
    
    testYamlGetPath: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");

        var y = new YamlFile({
        	project: p,
            pathName: "foo/bar/x.yml"
        });
        test.ok(y);
        
        test.equal(y.getPath(), "foo/bar/x.yml");
        
        test.done();
    },
    
    testYamlAddResource: function(test) {
        test.expect(11);

        var y = new YamlFile();
        test.ok(y);

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
        
        y.addResource(res);
        
        var reslist = y.getResources({
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

    testYamlAddMultipleResources: function(test) {
        test.expect(8);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            ocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        var reslist = y.getResources({
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

    testYamlAddMultipleResourcesRightSize: function(test) {
        test.expect(3);

        var y = new YamlFile();
        test.ok(y);
        test.equal(y.size(), 0);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.size(), 2);
       
        test.done();
    },

    testYamlAddMultipleResourcesOverwrite: function(test) {
        test.expect(9);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

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
        
        y.addResource(res);

        var reslist = y.getResources({
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

    testYamlAddMultipleResourcesOverwriteRightSize: function(test) {
        test.expect(4);

        var y = new YamlFile();
        test.ok(y);
        
        test.equal(y.size(), 0);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.size(), 1);
        
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
        
        y.addResource(res);

        test.equal(y.size(), 1);
       
        test.done();
    },

    testYamlAddMultipleResourcesNoOverwrite: function(test) {
        test.expect(13);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

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
        
        y.addResource(res);

        var reslist = y.getResources({
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

    testYamlGetResourcesMultiple: function(test) {
        test.expect(11);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        var reslist = y.getResources({
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

    testYamlSerializeWithSourceOnly: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithContext: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            context: "foobar"
        });
        
        y.addResource(res);

        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            context: "asdf"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithExplicitIds: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            id: 4444444
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithSourceAndTarget: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "source"
        });
        
        y.addResource(res);

        var res = new ResourceString({
            source: "foobarfoo",
            locale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "source"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "bebe bebe",
            locale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        y.addResource(res);

        diff(y.serialize(), 
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
        
        test.equal(y.serialize(), 
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

    testYamlSerializeWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            comment: "foobar is where it's at!",
            origin: "source"
        });
        
        y.addResource(res);

        var res = new ResourceString({
            source: "foobarfoo",
            locale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            comment: "come & enjoy it with us",
            origin: "source"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "bebe bebe",
            locale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            origin: "target"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithHeader: function(test) {
        test.expect(2);

        var y = new YamlFile({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            pathName: "a/b/c.xliff"
        });
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithPlurals: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
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
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithArrays: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceArray({
            array: ["Zero", "One", "Two"],
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithXMLEscaping: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12"
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlSerializeWithComments: function(test) {
        test.expect(2);

        var y = new YamlFile();
        test.ok(y);
        
        var res = new ResourceString({
            source: "Asdf asdf",
            locale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "ht-androidapp",
            comment: "A very nice string"
        });
        
        y.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            locale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "ht-webapp12",
            comment: "Totally awesome."
        });
        
        y.addResource(res);

        test.equal(y.serialize(), 
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

    testYamlDeserializeWithSourceOnly: function(test) {
        test.expect(17);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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

        var reslist = y.getResources();
        
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

    testYamlDeserializeWithSourceAndTarget: function(test) {
        test.expect(31);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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
        var reslist = y.getResources();
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

    testYamlDeserializeWithXMLUnescaping: function(test) {
        test.expect(17);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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

        var reslist = y.getResources();
        
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

    testYamlDeserializeWithPlurals: function(test) {
        test.expect(10);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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
        
        var reslist = y.getResources();
        
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

    testYamlDeserializeWithArrays: function(test) {
        test.expect(9);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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

        var reslist = y.getResources();
        
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

    testYamlDeserializeWithComments: function(test) {
        test.expect(18);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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

        var reslist = y.getResources();
        
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
    
    testYamlDeserializeWithContext: function(test) {
        test.expect(19);

        var y = new YamlFile();
        test.ok(y);
        
        y.deserialize(
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

        var reslist = y.getResources();
        
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
    }
};