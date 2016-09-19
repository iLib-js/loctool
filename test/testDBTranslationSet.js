/*
 * testDBTranslationSet.js - test the Database Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!DBTranslationSet) {
    var DBTranslationSet = require("../lib/DBTranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
}

module.exports = {
     testDBTranslationSetConstructor: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        test.ok(ts);
        test.done();
    },
    
    testDBTranslationSetRightSourceLocaleDefault: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        
        test.equal(ts.sourceLocale, "en-US");
        test.done();
    },

    testDBTranslationSetGetEmpty: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        
        ts.getBy({
        	project: "asdf"
        }, function(r) {
        	console.log("set get empty");
            test.ok(!r);
            test.done();
        });        
    },
    
    testDBTranslationSetGet: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	project: "a",
        	context: "b",
        	locale: "de-DE",
        	key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res, function(err, info) {
        	console.log("got here " + err + " " + JSON.stringify(info));
        	test.equal(err, 0);
        	test.ok(!info);
        	
        	ts.getBy({
        		key: "asdf"
        	}, function(resources) {
        		test.ok(resources);
        		
        		console.log("got here too ");
        		console.dir(resources);
            	
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "de-DE");
        		test.equal(resources[0].getKey(), "asdf");
        		test.equal(resources[0].getSource(), "This is a test");

        		test.done();
        	});
        });
    },

    /*
    testDBTranslationSetGetWithContext: function(test) {
        test.expect(6);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            context: "different"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.get("asdf", "different");

        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "different");
        
        test.done();
    },

    testDBTranslationSetGetUndefined: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var r = ts.get();
        
        test.ok(!r);
        test.done();
    },
    
    testDBTranslationSetGetFromMany: function(test) {
        test.expect(4);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("qwerty");
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testDBTranslationSetGetBySource: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testDBTranslationSetGetBySourceNonAutoKey: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.ok(!r);

        test.done();
    },

    testDBTranslationSetGetBySourceFromMany: function(test) {
        test.expect(4);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            autoKey: true,
            source: "This is another test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.getBySource("This is another test");
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testDBTranslationSetGetBySourceUndefined: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var r = ts.getBySource();
        
        test.ok(!r);
        test.done();
    },

    testDBTranslationSetGetBySourceWithContext: function(test) {
        test.expect(6);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test",
            context: "foo"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = ts.getBySource("This is a test", "foo");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        
        test.done();
    },

    testDBTranslationSetGetBySourceOnlyAutoKeys: function(test) {
        test.expect(6);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	key: "r3423423",
        	autoKey: true,
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "explicit_id",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.getBySource("This is a test");
        
        test.equal(r.getKey(), "r3423423");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("explicit_id");
        
        test.equal(r.getKey(), "explicit_id");
        test.equal(r.getSource(), "This is a test");
        
        r = ts.get("r3423423");
        
        test.equal(r.getKey(), "r3423423");
        test.equal(r.getSource(), "This is a test");
        
        test.done();
    },

    testDBTranslationSetGetAll: function(test) {
        test.expect(6);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "qwerty",
            source: "This is another test"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        
        r = resources[1];
        
        test.equal(r.getKey(), "qwerty");
        test.equal(r.getSource(), "This is another test");
        test.done();
    },

    testDBTranslationSetGetAllEmpty: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        var r = ts.getAll();
        test.ok(r);
        test.equal(r.length, 0);
        
        test.done();
    },
    
    testDBTranslationSetAddTranslationMerged: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        test.done();
    },

    testDBTranslationSetAddTranslationDifferentContext: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            locale: "en-US"
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
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

    testDBTranslationSetAddAll: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);
        
        var r = ts.get("asdf");
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

    testDBTranslationSetAddAllDifferentContexts: function(test) {
        test.expect(8);

        var ts = new DBTranslationSet();
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test",
	            context: "foo"
	        })
	    ]);
        
        var resources = ts.getAll();
        test.ok(resources);
        test.equal(resources.length, 2);
        
        var r = resources[0];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getContext());
        
        r = resources[1];
        
        test.equal(r.getKey(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getContext(), "foo");
        test.done();
    },
    
    testDBTranslationSetSize: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 1);
        test.done();
    },

    testDBTranslationSetSizeMultiple: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });
        
        ts.add(res);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            context: "different"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 2);
        
        test.done();
    },

    testDBTranslationSetEmpty: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        
        test.equal(ts.size(), 0);
        test.done();
    },

    testDBTranslationSetSizeMerged: function(test) {
        test.expect(3);

        var ts = new DBTranslationSet();
        
        test.equal(ts.size(), 0);
        
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 1);
        
        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            locale: "de-DE"
        });
        
        ts.add(res);
        
        test.equal(ts.size(), 2);

        test.done();
    },

    testDBTranslationSetSizeAddAll: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        
        test.equal(ts.size(), 0);
        
        ts.addAll([
	        new ResourceString({
	            key: "asdf",
	            source: "This is a test"
	        }),
	        new ResourceString({
	            key: "qwerty",
	            source: "This is another test"
	        })
	    ]);
        
        test.equal(ts.size(), 2);

        test.done();
    }
    
    */
};
