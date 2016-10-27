/*
 * testLocalRepository.js - test the Database Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!LocalRepository) {
	var LocalRepository = require("../lib/LocalRepository.js");
	var ResourceString = require("../lib/ResourceString.js");
	var ResourceArray = require("../lib/ResourceArray.js");
	var ResourcePlural = require("../lib/ResourcePlural.js");
	var TranslationSet = require("../lib/TranslationSet.js");
}

module.exports = {
	testSetUp: function(test) {
		test.expect(1);

		var repo = new LocalRepository();

		repo.clear(function() {
			repo.size(function(s) {
				test.equal(s, 0);

				repo.close(function() {
					test.done();
				});
			})
		});
	},

	testLocalRepositoryConstructor: function(test) {
		test.expect(1);

		var repo = new LocalRepository();
		test.ok(repo);
		repo.close(function() {
			test.done();
		});
	},

	testLocalRepositoryRightSourceLocaleDefault: function(test) {
		test.expect(1);

		var repo = new LocalRepository();

		test.equal(repo.sourceLocale, "en-US");
		repo.close(function() {
			test.done();
		});
	},

	testLocalRepositoryConstructorWithPath: function(test) {
		test.expect(12);

		var repo = new LocalRepository({
			sourceLocale: "en-US",
			pathName: "./testfiles/test.xliff"
		});
		
		test.ok(repo);
		
		repo.init(function(){
			repo.getBy({
				reskey: "foobar"
			}, function(err, resources) {
				test.ok(resources);
				test.equal(resources.length, 2);

				test.equal(resources[0].getKey(), "foobar");
				test.equal(resources[0].getProject(), "ht-webapp12");
				test.equal(resources[0].getSource(), "Asdf asdf");
				test.equal(resources[0].getLocale(), "en-US");
				test.equal(resources[0].getComment(), "foobar is where it's at!");

				test.equal(resources[1].getKey(), "foobar");
				test.equal(resources[1].getProject(), "ht-webapp12");
				test.equal(resources[1].getSource(), "foobarfoo");
				test.equal(resources[1].getLocale(), "de-DE");

				repo.close(function() {
					test.done();
				});
			});
		})
	},

	testLocalRepositoryGetEmpty: function(test) {
		test.expect(2);

		var repo = new LocalRepository();

		repo.getBy({
			project: "asdf"
		}, function(err, r) {
			test.ok(r);
			test.equal(r.length, 0);
			repo.close(function() {
				test.done();
			});
		});        
	},

	testLocalRepositoryGet: function(test) {
		test.expect(10);

		var repo = new LocalRepository();
		var res = new ResourceString({
			project: "a",
			context: "b",
			locale: "de-DE",
			key: "asdf",
			source: "This is a test"
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 1);

			repo.getBy({
				reskey: "asdf"
			}, function(err, resources) {
				test.ok(resources);

				test.equal(resources.length, 1);
				test.equal(resources[0].getProject(), "a");
				test.equal(resources[0].getContext(), "b");
				test.equal(resources[0].getLocale(), "de-DE");
				test.equal(resources[0].getKey(), "asdf");
				test.equal(resources[0].getSource(), "This is a test");

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryGetComplicated: function(test) {
		test.expect(18);

		var repo = new LocalRepository();
		var res = new ResourceString({
			project: "a",
			context: "b",
			locale: "de-DE",
			key: "asdf",
			source: "This is yet another test"
		});

		repo.add(res, function(err, info) {
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

			repo.add(res, function(err, info) {
				test.equal(err, null);
				test.ok(info);
				test.equal(info.affectedRows, 1);

				repo.getBy({
					project: "a",
					context: "b",
					reskey: "asdf"
				}, function(err, resources) {
					test.ok(resources);

					test.equal(resources.length, 2);
					test.equal(resources[0].getProject(), "a");
					test.equal(resources[0].getContext(), "b");
					test.equal(resources[0].getLocale(), "de-DE");
					test.equal(resources[0].getKey(), "asdf");
					test.equal(resources[0].getSource(), "This is yet another test");

					test.equal(resources[1].getProject(), "a");
					test.equal(resources[1].getContext(), "b");
					test.equal(resources[1].getLocale(), "fr-FR");
					test.equal(resources[1].getKey(), "asdf");
					test.equal(resources[1].getSource(), "Ceci est une teste.");

					repo.close(function() {
						test.done();
					});
				});
			});
		});
	},

	testLocalRepositoryGetNoMatches: function(test) {
		test.expect(2);

		var repo = new LocalRepository();
		repo.getBy({
			project: "asdfasdfasdf"
		}, function(err, resources) {
			test.ok(resources);

			test.equal(resources.length, 0);

			repo.close(function() {
				test.done();
			});
		});
	},

	testLocalRepositoryRemove: function(test) {
		test.expect(13);

		var repo = new LocalRepository();
		var res = new ResourceString({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "foofoo",
			source: "Dit is noch een test."
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 1);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "foofoo",
				locale: "nl-NL"
			}, function(err, resources) {
				test.ok(resources);

				test.equal(resources.length, 1);
				test.equal(resources[0].getProject(), "a");
				test.equal(resources[0].getContext(), "b");
				test.equal(resources[0].getLocale(), "nl-NL");
				test.equal(resources[0].getKey(), "foofoo");
				test.equal(resources[0].getSource(), "Dit is noch een test.");

				// now remove it and make sure it is no longer there
				repo.remove(res, function(err, info) {
					test.equal(err, null);
					test.ok(info);

					repo.getBy({
						project: "a",
						context: "b",
						reskey: "foofoo",
						locale: "nl-NL"
					}, function(err, resources) {
						test.equal(resources.length, 0); // not found
						repo.close(function() {
							test.done();
						});
					});
				});
			});
		});
	},

	testLocalRepositoryRemoveNonExistent: function(test) {
		test.expect(5);

		var repo = new LocalRepository();

		// make sure it is not there
		repo.getBy({
			project: "a",
			context: "b",
			reskey: "foofoo",
			locale: "nl-NL",
			resType: "string"
		}, function(err, resources) {
			test.ok(resources);

			test.equal(resources.length, 0);

			// now remove it and make sure it is no longer there
			repo.remove({
				project: "a",
				context: "b",
				reskey: "foofoo",
				locale: "nl-NL",
				resType: "string"
			}, function(err, info) {
				test.equal(err, null);
				test.ok(!info);

				repo.getBy({
					project: "a",
					context: "b",
					reskey: "foofoo",
					locale: "nl-NL",
					resType: "string"
				}, function(err, resources) {
					test.equal(resources.length, 0); // still not found
					repo.close(function() {
						test.done();
					});
				});
			});
		});
	},

	testLocalRepositoryRemoveNoParams: function(test) {
		test.expect(13);

		var repo = new LocalRepository();
		var res = new ResourceString({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "foofoo",
			source: "Dit is noch een test."
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 1);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "foofoo",
				locale: "nl-NL",
				resType: "string"
			}, function(err, resources) {
				test.ok(resources);

				test.equal(resources.length, 1);
				test.equal(resources[0].getProject(), "a");
				test.equal(resources[0].getContext(), "b");
				test.equal(resources[0].getLocale(), "nl-NL");
				test.equal(resources[0].getKey(), "foofoo");
				test.equal(resources[0].getSource(), "Dit is noch een test.");

				// now remove with bogus params and make sure it didn't ruin the db
				repo.remove({
					resType: "string"
				}, function(err, info) {
					test.ok(!err);
					test.ok(!info);

					repo.getBy({
						project: "a",
						context: "b",
						reskey: "foofoo",
						locale: "nl-NL",
						resType: "string"
					}, function(err, resources) {
						test.equal(resources.length, 1); // still there
						repo.close(function() {
							test.done();
						});
					});
				});
			});
		});
	},

	testLocalRepositoryAddAll: function(test) {
		test.expect(20);

		var repo = new LocalRepository();
		var set = new TranslationSet();
		set.addAll([
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
				source: "Oliefanten kunnen fliegen!"
			})
		]);

		repo.addAll(set, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 3);

			repo.getBy({
				project: "a",
				context: "b",
				reskey: "barbar"
			}, function(err, resources) {
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
				test.equal(resources[2].getSource(), "Oliefanten kunnen fliegen!");

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryAddArray: function(test) {
		test.expect(10);

		var repo = new LocalRepository();
		var res = new ResourceArray({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "sultansofswing",
			array: ["a one", "a two", "a one two three four", "hit it"]
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 4);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "sultansofswing",
				locale: "nl-NL"
			}, function(err, resources) {
				test.ok(resources);

				test.equal(resources.length, 1);
				test.equal(resources[0].getProject(), "a");
				test.equal(resources[0].getContext(), "b");
				test.equal(resources[0].getLocale(), "nl-NL");
				test.equal(resources[0].getKey(), "sultansofswing");
				test.deepEqual(resources[0].getArray(), ["a one", "a two", "a one two three four", "hit it"]);

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryAddArrayEmpty: function(test) {
		test.expect(6);

		var repo = new LocalRepository();
		var res = new ResourceArray({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "jajajajaja"
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 0);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "jajajajaja",
				locale: "nl-NL"
			}, function(err, resources) {
				test.ok(resources);
				test.equal(resources.length, 1);
				test.equal(resources[0].size(), 0);

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryAddPlural: function(test) {
		test.expect(10);

		var repo = new LocalRepository();
		var res = new ResourcePlural({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "jawel",
			strings: {
				one: "a one", 
				two: "a two", 
				few: "a one two three four", 
				many: "hit it"
			}
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 4);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "jawel",
				locale: "nl-NL",
				resType: "plural"
			}, function(err, resources) {
				test.ok(resources);

				test.equal(resources.length, 1);

				test.equal(resources[0].getProject(), "a");
				test.equal(resources[0].getContext(), "b");
				test.equal(resources[0].getLocale(), "nl-NL");
				test.equal(resources[0].getKey(), "jawel");
				test.deepEqual(resources[0].getPlurals(), {
					one: "a one", 
					two: "a two", 
					few: "a one two three four", 
					many: "hit it"
				});

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryAddPluralEmpty: function(test) {
		test.expect(6);

		var repo = new LocalRepository();
		var res = new ResourcePlural({
			project: "a",
			context: "b",
			locale: "nl-NL",
			key: "gossie"
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 0);

			// make sure it is there
			repo.getBy({
				project: "a",
				context: "b",
				reskey: "gossie",
				locale: "nl-NL",
				resType: "plural"
			}, function(err, resources) {
				test.ok(resources);
				test.equal(resources.length, 1);
				test.equal(resources[0].size(), 0);

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryContains: function(test) {
		test.expect(4);

		var repo = new LocalRepository();
		var res = new ResourcePlural({
			project: "a",
			context: "c",
			locale: "ja-JP",
			key: "katakana",
			strings: {one: "one", two: "two", few: "few"}
		});

		repo.add(res, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 3);

			// make sure it is there
			repo.contains(res, function(there) {
				test.ok(there);

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryContainsNot: function(test) {
		test.expect(1);

		var repo = new LocalRepository();
		var res = new ResourcePlural({
			project: "a",
			context: "c",
			locale: "ru-RU",
			key: "blahblah",
			strings: {one: "one", two: "two", few: "few"}
		});

		// make sure it is not there
		repo.contains(res, function(there) {
			test.ok(!there);

			repo.close(function() {
				test.done();
			});
		});
	},

	testLocalRepositoryGetProjects: function(test) {
		test.expect(8);

		var repo = new LocalRepository();
		var set = new TranslationSet();
		set.addAll([
			new ResourceString({
				project: "a",
				context: "b",
				locale: "en-US",
				key: "barbar",
				source: "Elephants can fly!"
			}),
			new ResourceString({
				project: "b",
				context: "b",
				locale: "de-DE",
				key: "barbar",
				source: "Olifanten koennen fliegen!"
			}),
			new ResourceString({
				project: "c",
				context: "b",
				locale: "nl-NL",
				key: "barbar",
				source: "Oliefanten kunnen fliegen!"
			})
			]);

		repo.addAll(set, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 3);

			repo.getProjects(function(projects) {
				test.ok(projects);

				test.equal(projects.length, 3);
				test.equal(projects[0], "a");
				test.equal(projects[1], "b");
				test.equal(projects[2], "c");

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryGetContexts: function(test) {
		test.expect(8);

		var repo = new LocalRepository();
		var set = new TranslationSet();
		set.addAll([
			new ResourceString({
				project: "a",
				context: "a",
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
				context: "c",
				locale: "nl-NL",
				key: "barbar",
				source: "Oliefanten kunnen fliegen!"
			})
			]);

		repo.addAll(set, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 3);

			repo.getContexts("a", function(contexts) {
				test.ok(contexts);

				test.equal(contexts.length, 3);
				test.equal(contexts[0], "a");
				test.equal(contexts[1], "b");
				test.equal(contexts[2], "c");

				repo.close(function() {
					test.done();
				});
			});
		});
	},

	testLocalRepositoryGetLocales: function(test) {
		test.expect(8);

		var repo = new LocalRepository();
		var set = new TranslationSet();
		set.addAll([
			new ResourceString({
				project: "a",
				context: "a",
				locale: "en-CA",
				key: "barbar",
				source: "Elephants can fly!"
			}),
			new ResourceString({
				project: "a",
				context: "a",
				locale: "de-DE",
				key: "barbar",
				source: "Olifanten koennen fliegen!"
			}),
			new ResourceString({
				project: "a",
				context: "a",
				locale: "nl-NL",
				key: "barbar",
				source: "Oliefanten kunnen fliegen!"
			})
		]);

		repo.addAll(set, function(err, info) {
			test.equal(err, null);
			test.ok(info);
			test.equal(info.affectedRows, 3);

			repo.getLocales("a", "a", function(locales) {
				test.ok(locales);

				test.equal(locales.length, 3);
				test.equal(locales[0], "de-DE");
				test.equal(locales[1], "en-CA");
				test.equal(locales[2], "nl-NL");

				repo.close(function() {
					test.done();
				});
			});
		});
	}
};
