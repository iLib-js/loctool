/*
 * testTranslationSet.js - test the Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!TranslationSet) {
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports = {
     testTranslationSetConstructor: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        test.ok(ts);
        test.done();
    },
    
    testTranslationSetRightSourceLocaleDefault: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        test.equal(ts.sourceLocale, "zxx-XX");
        test.done();
    },

    testTranslationSetGetEmpty: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        var r = ts.get("asdf");
        
        test.ok(!r);
        test.done();
    },
    
    testTranslationSetGet: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationSetGetWithContext: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "asdf",
            source: "This is a test",
            context: "different"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.get("asdf", "different");

        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "different");
        
        test.done();
    },


    testTranslationSetGetUndefined: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var r = ts.get();
        
        test.ok(!r);
        test.done();
    },
    
    testTranslationSetGetFromMany: function(test) {
        test.expect(4);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("qwerty");
        
        test.equal(r.getId(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetBySource: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationSetGetBySourceFromMany: function(test) {
        test.expect(4);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.getBySource("This is another test");
        
        test.equal(r.getId(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetBySourceUndefined: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        var r = ts.getBySource();
        
        test.ok(!r);
        test.done();
    },

    testTranslationSetGetBySourceWithContext: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "asdf",
            source: "This is a test",
            context: "foo"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.getBySource("This is a test", "foo");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        
        test.done();
    },

    testTranslationSetGetAll: function(test) {
        test.expect(6);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = resources[1];
        
        test.equal(r.getId(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testTranslationSetGetAllEmpty: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var r = ts.getAll();
        test.ok(r);
        test.equal(r.length, 0);
        
        test.done();
    },
    
    testTranslationSetAddTranslationMerged: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 1);
        test.done();
    },

    testTranslationSetAddTranslationDifferentContext: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test",
            locale: "en-US"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "asdf",
            source: "This is another test",
            locale: "de-DE",
            context: "foo"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        test.done();
    },

    testTranslationSetAddTranslationTranslationAvailable: function(test) {
        test.expect(3);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            id: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        var t = r.getTranslation("de-DE");
        
        test.equal(t, "This is another test");
        test.done();
    },

    testTranslationSetAddAll: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            id: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            id: "qwerty",
	            source: "This is another test"
	        })
	    ]);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testTranslationSetAddAllDifferentContexts: function(test) {
        test.expect(8);

        var ts = new TranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            id: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            id: "asdf",
	            source: "This is a test",
	            context: "foo"
	        })
	    ]);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = resources[1];
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        test.done();
    }

};
