/*
 * testDBTranslationSet.js - test the Database Translation Set object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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

if (!DBTranslationSet) {
    var DBTranslationSet = require("../lib/DBTranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var TranslationSet = require("../lib/TranslationSet.js");
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
        	sourceLocale: "de-DE",
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
        	sourceLocale: "de-DE",
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
            	sourceLocale: "fr-FR",
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
        	sourceLocale: "nl-NL",
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
        		sourceLocale: "nl-NL"
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
                		sourceLocale: "nl-NL"
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
    		sourceLocale: "nl-NL"
    	}, function(resources) {
    		test.ok(resources);

    		test.equal(resources.length, 0);

    		// now remove it and make sure it is no longer there
    		ts.remove({
        		project: "a",
        		context: "b",
        		key: "foofoo",
        		sourceLocale: "nl-NL"    			
    		}, function(err, info) {
    			test.equal(err, null);
    			test.ok(info);

    			ts.getBy({
    				project: "a",
    				context: "b",
    				key: "foofoo",
    				sourceLocale: "nl-NL"
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
        	sourceLocale: "nl-NL",
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
        		sourceLocale: "nl-NL"
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
                		sourceLocale: "nl-NL"
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
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Olifanten koennen fliegen!",
	        	targetLocale: "de-DE"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Oliephanten kunnen fliegen!",
	            targetLocale: "nl-NL"
	        })
	    ]);
        
        ts.addAll(set, function(err, info) {
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
        		test.equal(resources[0].getKey(), "barbar");
        		test.equal(resources[0].getSourceLocale(), "en-US");
        		test.equal(resources[0].getSource(), "Elephants can fly!");

        		test.equal(resources[1].getProject(), "a");
        		test.equal(resources[1].getContext(), "b");
        		test.equal(resources[1].getKey(), "barbar");
        		test.equal(resources[1].getSourceLocale(), "en-US");
        		test.equal(resources[1].getSource(), "Elephants can fly!");
        		test.equal(resources[1].getTargetLocale(), "de-DE");
        		test.equal(resources[1].getTarget(), "Olifanten koennen fliegen!");

        		test.equal(resources[2].getProject(), "a");
        		test.equal(resources[2].getContext(), "b");
        		test.equal(resources[0].getKey(), "barbar");
        		test.equal(resources[0].getSourceLocale(), "en-US");
        		test.equal(resources[0].getSource(), "Elephants can fly!");
        		test.equal(resources[2].getTargetLocale(), "nl-NL");
        		test.equal(resources[2].getTarget(), "Oliephanten kunnen fliegen!");

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
        	sourceLocale: "nl-NL",
        	key: "sultansofswing",
            sourceArray: ["a one", "a two", "a one two three four", "hit it"]
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
        		sourceLocale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getSourceLocale(), "nl-NL");
        		test.equal(resources[0].getKey(), "sultansofswing");
        		test.deepEqual(resources[0].getSourceArray(), ["a one", "a two", "a one two three four", "hit it"]);
        		
        		ts.close();
        		test.done();
        	});
        });
    },
    
    testDBTranslationSetAddArrayEmpty: function(test) {
        test.expect(5);

        var ts = new DBTranslationSet();
        var res = new ResourceArray({
        	project: "a",
        	context: "b",
        	sourceLocale: "nl-NL",
        	key: "jajajajaja"
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 0);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "jajajajaja",
        		sourceLocale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		test.equal(resources.length, 0);
        		
        		ts.close();
        		test.done();
        	});
        });
    },

    testDBTranslationSetAddPlural: function(test) {
        test.expect(10);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
        	project: "a",
        	context: "b",
        	sourceLocale: "nl-NL",
        	key: "jawel",
            sourceStrings: {
            	one: "a one", 
            	two: "a two", 
            	few: "a one two three four", 
            	many: "hit it"
            }
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 4);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "jawel",
        		sourceLocale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		
        		test.equal(resources.length, 1);
        		
        		test.equal(resources[0].getProject(), "a");
        		test.equal(resources[0].getContext(), "b");
        		test.equal(resources[0].getSourceLocale(), "nl-NL");
        		test.equal(resources[0].getKey(), "jawel");
        		test.deepEqual(resources[0].getSourcePlurals(), {
                	one: "a one", 
                	two: "a two", 
                	few: "a one two three four", 
                	many: "hit it"
                });
        		
        		ts.close();
        		test.done();
        	});
        });
    },
    
    testDBTranslationSetAddPluralEmpty: function(test) {
        test.expect(5);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
        	project: "a",
        	context: "b",
        	sourceLocale: "nl-NL",
        	key: "gossie"
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 0);
        	
        	// make sure it is there
        	ts.getBy({
        		project: "a",
        		context: "b",
        		key: "gossie",
        		sourceLocale: "nl-NL"
        	}, function(resources) {
        		test.ok(resources);
        		test.equal(resources.length, 0);
        		
        		ts.close();
        		test.done();
        	});
        });
    },
    
    testDBTranslationSetContains: function(test) {
        test.expect(4);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
        	project: "a",
        	context: "c",
        	sourceLocale: "ja-JP",
        	key: "katakana",
        	sourceStrings: {one: "one", two: "two", few: "few"}
        });
        
        ts.add(res, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 3);
        	
        	// make sure it is there
        	ts.contains(res, function(there) {
        		test.ok(there);
        		
        		ts.close();
        		test.done();
        	});
        });
    },

    testDBTranslationSetContainsNot: function(test) {
        test.expect(1);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
        	project: "a",
        	context: "c",
        	sourceLocale: "ru-RU",
        	key: "blahblah",
        	sourceStrings: {one: "one", two: "two", few: "few"}
        });
        
    	// make sure it is not there
    	ts.contains(res, function(there) {
    		test.ok(!there);
    		
    		ts.close();
    		test.done();
    	});
    },

    testDBTranslationSetGetProjects: function(test) {
        test.expect(8);

        var ts = new DBTranslationSet();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US"
	        }),
            new ResourceString({
	        	project: "b",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Olifanten koennen fliegen!",
	        	targetLocale: "de-DE"
	        }),
            new ResourceString({
	        	project: "c",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Oliephanten kunnen fliegen!",
	            targetLocale: "nl-NL"
	        })
	    ]);
        
        ts.addAll(set, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 3);
        	
        	ts.getProjects(function(projects) {
        		test.ok(projects);

        		test.equal(projects.length, 3);
        		test.equal(projects[0], "a");
        		test.equal(projects[1], "b");
        		test.equal(projects[2], "c");

        		ts.close();
        		test.done();
        	});
        });
    },

    testDBTranslationSetGetContexts: function(test) {
        test.expect(8);

        var ts = new DBTranslationSet();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Olifanten koennen fliegen!",
	        	targetLocale: "de-DE"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "c",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Oliephanten kunnen fliegen!",
	            targetLocale: "nl-NL"
	        })
	    ]);
        
        ts.addAll(set, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 3);
        	
        	ts.getContexts("a", function(contexts) {
        		test.ok(contexts);

        		test.equal(contexts.length, 3);
        		test.equal(contexts[0], "a");
        		test.equal(contexts[1], "b");
        		test.equal(contexts[2], "c");

        		ts.close();
        		test.done();
        	});
        });
    },

    testDBTranslationSetGetLocales: function(test) {
        test.expect(9);

        var ts = new DBTranslationSet();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Elephants can fly, eh?",
	        	targetLocale: "en-CA"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Olifanten koennen fliegen!",
	        	targetLocale: "de-DE"
	        }),
            new ResourceString({
	        	project: "a",
	        	context: "b",
	        	key: "barbar",
	            source: "Elephants can fly!",
	        	sourceLocale: "en-US",
	            target: "Oliephanten kunnen fliegen!",
	            targetLocale: "nl-NL"
	        })
	    ]);
        
        ts.addAll(set, function(err, info) {
        	test.equal(err, null);
        	test.ok(info);
        	test.equal(info.affectedRows, 3);
        	
        	ts.getLocales("a", "a", function(locales) {
        		test.ok(locales);
        		
        		test.equal(locales.length, 4);
        		test.equal(locales[0], "de-DE");
        		test.equal(locales[1], "en-CA");
        		test.equal(locales[2], "en-US");
        		test.equal(locales[3], "nl-NL");

        		ts.close();
        		test.done();
        	});
        });
    }
};
