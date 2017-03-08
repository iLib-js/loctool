/*
 * testResourceArray.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceArray) {
    var ResourceArray = require("../lib/ResourceArray.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

module.exports = {
    testResourceArrayConstructorEmpty: function(test) {
        test.expect(1);

        var ra = new ResourceArray();
        test.ok(ra);
        
        test.done();
    },
    
	testResourceArrayConstructorNoProps: function(test) {
	    test.expect(1);
	
	    var ra = new ResourceArray({});
	    test.ok(ra);
	    
	    test.done();
	},
	
    testResourceArrayConstructorEmptyNoSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.equal(ra.size(), 0);
        
        test.done();
    },

    testResourceArrayConstructor: function(test) {
        test.expect(1);

        var ra = new ResourceArray({
        	key: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        test.done();
    },
    
    testResourceArrayConstructorRightContents: function(test) {
        test.expect(5);

        var ra = new ResourceArray({
        	key: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	locale: "de-DE",
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.getKey(), "asdf");
        test.deepEqual(ra.getArray(), ["This is a test", "This is also a test", "This is not"]);
        test.equal(ra.locale, "de-DE");
        test.equal(ra.pathName, "a/b/c.java");
        
        test.done();
    },

    testResourceArrayConstructorDefaults: function(test) {
        test.expect(6);

        var ra = new ResourceArray({
        	key: "asdf",
        	array: ["This is a test", "This is also a test", "This is not"],
        	pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        // got the right one?
        test.equal(ra.getKey(), "asdf");
        
        // now the defaults
        test.equal(ra.locale, "en-US");
        test.equal(ra.origin, "source");
        test.equal(ra.datatype, "x-android-resource");
        test.equal(ra.resType, "array");
        
        test.done();
    },
    
    testResourceArrayConstructorRightSize: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            locale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(ra);
    
        test.equal(ra.size(), 3);
        
        test.done();
    },

    testResourceArrayGetKey: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.getKey(), "foo");
        
        test.done();
    },

    testResourceArrayGetKeyEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.ok(!ra.getKey());
        
        test.done();
    },

    testResourceStringGetContext: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE",
            context: "landscape"
        });
        test.ok(ra);
        test.equal(ra.getContext(), "landscape");
        
        test.done();
    },

    testResourceStringGetContextEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.getContext());
        
        test.done();
    },

    testResourceArrayGetArray: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.deepEqual(ra.getArray(), ["This is a test", "This is also a test", "This is not"]);
        
        test.done();
    },

    testResourceArrayGetArrayEmpty: function(test) {
        test.expect(2);

        var ra = new ResourceArray();
        test.ok(ra);
        test.deepEqual(ra.getArray(), []);
        
        test.done();
    },

    testResourceArrayGet: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.equal(ra.get(0), "This is a test");
        test.equal(ra.get(1), "This is also a test");
        test.equal(ra.get(2), "This is not");
        
        test.done();
    },

    testResourceArrayGetNegativeIndex: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(-1));
        
        test.done();
    },

    testResourceArrayGetIndexTooBig: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(6));
        
        test.done();
    },

    testResourceArrayGetIndexNotWhole: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "foo",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(ra);
        test.ok(!ra.get(2.6));
        
        test.done();
    },
    
    testResourceArrayGeneratePseudo: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new RegularPseudo({
        	type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        test.done();
    },

    testResourceArrayGeneratePseudoRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new RegularPseudo({
        	type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à ţëšţ6543210");
        test.equal(strings[1], "Ťĥíš íš àľšõ à ţëšţ9876543210");
        test.equal(strings[2], "Ťĥíš íš ñõţ543210");
        
        test.done();
    },

    testResourceArrayGeneratePseudoSkipPercents: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a %s test", "This is also a %f test", "This is not %4$-2.2d"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new RegularPseudo({
        	type: "c"
        });

        var ra2 = ra.generatePseudo("de-DE", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "de-DE");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "Ťĥíš íš à %s ţëšţ876543210");
        test.equal(strings[1], "Ťĥíš íš àľšõ à %f ţëšţ6543210");
        test.equal(strings[2], "Ťĥíš íš ñõţ %4$-2.2d9876543210");
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var rb = new RegularPseudo({
        	type: "c"
        });

        var ra2 = ra.generatePseudo(undefined, rb);
        test.ok(!ra2);
        
        test.done();
    },

    testResourceArrayGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var ra2 = ra.generatePseudo("de-DE", undefined);

        test.ok(!ra2);
        
        test.done();
    },
    
    testResourceArrayGeneratePseudoBritishRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-GB",
        	type: "c"
        });

        var ra2 = ra.generatePseudo("en-GB", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "en-GB");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is oestrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not translated.");
        
        test.done();
    },

    testResourceArrayGeneratePseudoBritishLikeRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is estrogen", "I color my checkbooks", "This is not translated."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "en-ZA"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-ZA",
        	type: "c"
        });

        var ra2 = ra.generatePseudo("en-ZA", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "en-ZA");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is oestrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not translated.");
        
        test.done();
    },

    testResourceArrayGeneratePseudoCanadianRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
            key: "asdf",
            array: ["This is estrogen", "I color my checkbooks", "This is not localized."],
            pathName: "a/b/c.java"
        });
        test.ok(ra);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "en-CA"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-CA",
        	type: "c"
        });

        var ra2 = ra.generatePseudo("en-CA", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "en-CA");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "This is estrogen");
        test.equal(strings[1], "I colour my chequebooks");
        test.equal(strings[2], "This is not localized.");
        
        test.done();
    },

    testResourceArrayGeneratePseudoTraditionalChineseRightString: function(test) {
        test.expect(8);

        var ra = new ResourceArray({
        	project: "foo",
            key: "asdf",
            array: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(ra);
        
        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "zh-Hans-CN", "zh-Hant-TW"]
		});

        var translations = new TranslationSet();
        translations.add(new ResourceArray({
        	project: "foo",
        	key: 'asdf',
        	array: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
        
        var rb = new PseudoFactory({
        	project: p,
        	locale: "zh-Hant-TW",
        	type: "c",
        	set: translations
        });

        var ra2 = ra.generatePseudo("zh-Hant-TW", rb);

        test.ok(ra2);
        test.ok(ra2.getLocale(), "zh-Hant-TW");
        
        var strings = ra2.getArray();
        
        test.ok(strings);
        test.equal(strings.length, 3);
        test.equal(strings[0], "你好嗎？");
        test.equal(strings[1], "燕子的巡航速度是多少？");
        test.equal(strings[2], "什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        
        test.done();
    },

    testResourceArrayClone: function(test) {
        test.expect(10);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        var ra2 = ra.clone();
        
        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.locale, ra.locale);
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.array, ra.array);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, ra.state);
        
        test.done();
    },
    
    testResourceArrayCloneWithOverrides: function(test) {
        test.expect(10);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        var ra2 = ra.clone({
        	locale: "fr-FR",
        	state: "asdfasdf"
        });
        
        test.ok(ra2);
        test.equal(ra2.project, ra.project);
        test.equal(ra2.context, ra.context);
        test.equal(ra2.locale, "fr-FR");
        test.equal(ra2.reskey, ra.reskey);
        test.deepEqual(ra2.array, ra.array);
        test.equal(ra2.pathName, ra.pathName);
        test.equal(ra2.comment, ra.comment);
        test.equal(ra2.state, "asdfasdf");
        
        test.done();
    },
    
    testResourceArrayAddString: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        ra.addString(3, "This is the third one")
        
        test.equal(ra.get(3), "This is the third one");
        
        test.done();
    },
    
    testResourceArrayAddStringReplace: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.get(2), "This is not");

        ra.addString(2, "This isn't a test")
        
        test.equal(ra.get(2), "This isn't a test");
        
        test.done();
    },
    
    testResourceArrayAddStringSize: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.size(), 3);
        
        ra.addString(3, "This is the third one")
        
        test.equal(ra.size(), 4);
        
        test.done();
    },
    
    testResourceArrayAddStringUndefined: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.get(1), "This is also a test");

        ra.addString(1, undefined)
        
        test.equal(ra.get(1), "This is also a test");
        
        test.done();
    },
    
    testResourceArrayAddStringNoIndex: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.size(), 3);

        ra.addString(undefined, "foobar")
        
        test.equal(ra.size(), 3);
        
        test.done();
    },
    
    testResourceArrayAddStringEmpty: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.equal(ra.size(), 0);

        ra.addString(0, "foobar")
        
        test.equal(ra.size(), 1);
        
        test.done();
    },
    
    testResourceArrayAddStringEmptyRightContents: function(test) {
        test.expect(3);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        test.ok(!ra.get(0));

        ra.addString(0, "foobar")
        
        test.equal(ra.get(0), "foobar");
        
        test.done();
    },
    
    testResourceArrayAddStringMultiple: function(test) {
        test.expect(6);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);

        ra.addString(3, "This is the third one")
        ra.addString(4, "This is the fourth one")

        test.equal(ra.get(0), "This is a test");
        test.equal(ra.get(1), "This is also a test");
        test.equal(ra.get(2), "This is not");
        test.equal(ra.get(3), "This is the third one");
        test.equal(ra.get(4), "This is the fourth one");
        
        test.done();
    },
    
    testResourceArrayEquals: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsNot: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "asdf",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },
    
    testResourceArrayEqualsContentDifferent: function(test) {
        test.expect(3);

        var ra1 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        var ra2 = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "d"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        
        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourceArrayStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ResourceArray.hashKey("ht-androidapp", "foo", "de-DE", "This is a test"), "ra_ht-androidapp_foo_de-DE_This is a test");
        
        test.done();
    },

    testResourceArrayStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ResourceArray.hashKey(undefined, undefined, "de-DE", undefined), "ra___de-DE_");
        
        test.done();
    },

    testResourceArrayHashKey: function(test) {
        test.expect(2);

        var ra = new ResourceArray({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            array: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(ra);
        
        test.equal(ra.hashKey(), "ra_foo_blah_de-DE_asdf");
        
        test.done();
    }
};
