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
	testSetUp: function(test) {
		test.expect(1);
		
		var ts = new DBTranslationSet();
		
		ts.clear(function() {
			ts.size(function(s) {
				test.equal(s, 0);
				
				ts.close();
				test.done();
			})
		});
	},

    testDBTranslationSetConstructor: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        test.ok(ts);
        ts.close();
        test.done();
    },
    
    testDBTranslationSetRightSourceLocaleDefault: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        
        test.equal(ts.sourceLocale, "en-US");
        ts.close();
        test.done();
    },

    testDBTranslationSetGetEmpty: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
        
        ts.getBy({
        	project: "asdf"
        }, function(r) {
        	test.ok(r);
            test.equal(r.length, 0);
            ts.close();
            test.done();
        });        
    },
    
    testDBTranslationSetGet: function(test) {
        test.expect(10);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	project: "a",
        	context: "b",
        	locale: "de-DE",
        	key: "asdf",
            source: "This is a test"
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 1);
        	
        	ts.getBy({
        		key: "asdf"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "de-DE");
        		test.equal(resources[0].getKey(), "asdf");
        		test.equal(resources[0].getSource(), "This is a test");

        		ts.close();
        		test.done();
        	});
        });
    },

    testDBTranslationSetGetComplicated: function(test) {
        test.expect(18);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	project: "a",
        	context: "b",
        	locale: "de-DE",
        	key: "foofoo",
            source: "This is yet another test"
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 1);
        	
        	res = new ResourceString({
            	project: "a",
            	context: "b",
            	locale: "fr-FR",
            	key: "asdf",
                source: "Ceci est une teste."
            });
        	
        	ts.add(res, function(err, info) {
            	test.equal(err, null);
            	test.ok(info);
            	test.equal(info.affectedRows, 1);
            	
	        	ts.getBy({
	        		project: "a",
	        		context: "b",
	        		key: "asdf"
	        	}, function(resources) {
	        		test.ok(resources);
	        		
	        		test.equal(resources.length, 2);
	        		test.equal(resources[0].getProject(), "a");
	        		test.equal(resources[0].getContext(), "b");
	        		test.equal(resources[0].getLocale(), "de-DE");
	        		test.equal(resources[0].getKey(), "asdf");
	        		test.equal(resources[0].getSource(), "This is a test");
	
	        		test.equal(resources[1].getProject(), "a");
	        		test.equal(resources[1].getContext(), "b");
	        		test.equal(resources[1].getLocale(), "fr-FR");
	        		test.equal(resources[1].getKey(), "asdf");
	        		test.equal(resources[1].getSource(), "Ceci est une teste.");
	
	        		ts.close();
	        		test.done();
	        	});
        	});
        });
    },

    testDBTranslationSetGetNoMatches: function(test) {
        test.expect(2);

        var ts = new DBTranslationSet();
    	ts.getBy({
    		project: "asdfasdfasdf"
    	}, function(resources) {
    		test.ok(resources);
    		
    		test.equal(resources.length, 0);

    		ts.close();
    		test.done();
    	});
    },

    testDBTranslationSetRemove: function(test) {
        test.expect(13);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	project: "a",
        	context: "b",
        	locale: "nl-NL",
        	key: "foofoo",
            source: "Dit is noch een test."
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 1);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "foofoo",
        		locale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "nl-NL");
        		test.equal(resources[0].getKey(), "foofoo");
        		test.equal(resources[0].getSource(), "Dit is noch een test.");

        		// now remove it and make sure it is no longer there
        		ts.remove(res, function(err, info) {
        			test.equal(err, null);
        			test.ok(info);

                	ts.getBy({
                		project: "a",
                		context: "b",
                		key: "foofoo",
                		locale: "nl-NL"
                	}, function(resources) {
                		test.equal(resources.length, 0); // not found
	        			ts.close();
	            		test.done();
                	});
        		});
        	});
        });
    },
    
    testDBTranslationSetRemoveNonExistent: function(test) {
    	test.expect(5);

    	var ts = new DBTranslationSet();

    	// make sure it is not there
    	ts.getBy({
    		project: "a",
    		context: "b",
    		key: "foofoo",
    		locale: "nl-NL"
    	}, function(resources) {
    		test.ok(resources);

    		test.equal(resources.length, 0);

    		// now remove it and make sure it is no longer there
    		ts.remove({
        		project: "a",
        		context: "b",
        		key: "foofoo",
        		locale: "nl-NL"    			
    		}, function(err, info) {
    			test.equal(err, null);
    			test.ok(info);

    			ts.getBy({
    				project: "a",
    				context: "b",
    				key: "foofoo",
    				locale: "nl-NL"
    			}, function(resources) {
    				test.equal(resources.length, 0); // still not found
    				ts.close();
    				test.done();
    			});
    		});
    	});
    },
    
    testDBTranslationSetRemoveNoParams: function(test) {
        test.expect(13);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
        	project: "a",
        	context: "b",
        	locale: "nl-NL",
        	key: "foofoo",
            source: "Dit is noch een test."
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 1);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "foofoo",
        		locale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "nl-NL");
        		test.equal(resources[0].getKey(), "foofoo");
        		test.equal(resources[0].getSource(), "Dit is noch een test.");

        		// now remove with bogus params and make sure it didn't ruin the db
        		ts.remove({
        			resType: "string"
        		}, function(err, info) {
        			console.log("err is " + err + " and info is " + JSON.stringify(info));
        			test.ok(err);
        			test.ok(!info);

                	ts.getBy({
                		project: "a",
                		context: "b",
                		key: "foofoo",
                		locale: "nl-NL"
                	}, function(resources) {
                		test.equal(resources.length, 1); // still there
	        			ts.close();
	            		test.done();
                	});
        		});
        	});
        });
    },

    testDBTranslationSetAddAll: function(test) {
        test.expect(20);

        var ts = new DBTranslationSet();
        var resources = [
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	locale: "en-US",
	        	key: "barbar",
	            source: "Elephants can fly!"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	locale: "de-DE",
	        	key: "barbar",
	            source: "Olifanten koennen fliegen!"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	locale: "nl-NL",
	        	key: "barbar",
	            source: "Oliephanten kunnen fliegen!"
	        })
	    ];
        
        ts.addAll(resources, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 3);
        	
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "barbar",
        		sort: "id"
        	}, function(resources) {
        		test.ok(resources);

        		test.equal(resources.length, 3);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "en-US");
        		test.equal(resources[0].getKey(), "barbar");
        		test.equal(resources[0].getSource(), "Elephants can fly!");

        		test.equal(resources[1].getProject(), "a");
        		test.equal(resources[1].getContext(), "b");
        		test.equal(resources[1].getLocale(), "de-DE");
        		test.equal(resources[1].getKey(), "barbar");
        		test.equal(resources[1].getSource(), "Olifanten koennen fliegen!");

        		test.equal(resources[2].getProject(), "a");
        		test.equal(resources[2].getContext(), "b");
        		test.equal(resources[2].getLocale(), "nl-NL");
        		test.equal(resources[2].getKey(), "barbar");
        		test.equal(resources[2].getSource(), "Oliephanten kunnen fliegen!");

        		ts.close();
        		test.done();
        	});
        });
    },
    
    testDBTranslationSetAddArray: function(test) {
        test.expect(10);

        var ts = new DBTranslationSet();
        var res = new ResourceArray({
        	project: "a",
        	context: "b",
        	locale: "nl-NL",
        	key: "sultansofswing",
            array: ["a one", "a two", "a one two three four", "hit it"]
        });
        
        ts.add(res, function(err, info) {
        	console.log("got here err=" + err + " info " + JSON.stringify(info));
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 4);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "sultansofswing",
        		locale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getLocale(), "nl-NL");
        		test.equal(resources[0].getKey(), "sultansofswing");
        		test.deepEqual(resources[0].getArray(), ["a one", "a two", "a one two three four", "hit it"]);
        		
        		ts.close();
				test.done();
        	});
        });
    },

};
