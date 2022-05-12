/*
 * testLocalRepository.js - test the Database Translation Set object.
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

if (!LocalRepository) {
    var LocalRepository = require("../lib/LocalRepository.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var TranslationSet = require("../lib/TranslationSet.js");
}

module.exports.localrepository = {
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
        test.expect(10);

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
                test.equal(resources.length, 1);

                test.equal(resources[0].getKey(), "foobar");
                test.equal(resources[0].getProject(), "webapp");
                test.equal(resources[0].getSourceLocale(), "en-US");
                test.equal(resources[0].getSource(), "Asdf asdf");
                test.equal(resources[0].getTargetLocale(), "de-DE");
                test.equal(resources[0].getTarget(), "foobarfoo");
                test.equal(resources[0].getComment(), "foobar is where it's at!");

                repo.close(function() {
                    test.done();
                });
            });
        })
    },

    testLocalRepositoryConstructorWithXliffsDir: function(test) {
        test.expect(24);

        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: "./testfiles/xliffs"
        });

        test.ok(repo);

        repo.init(function(){
            repo.getBy({
                reskey: "foobar"
            }, function(err, resources) {
                test.ok(resources);
                test.equal(resources.length, 3);

                resources.sort(function(left, right) {
                    var leftLocale = left.getTargetLocale();
                    var rightLocale = right.getTargetLocale();
                    return leftLocale < rightLocale ? -1 : (leftLocale > rightLocale ? 1 : 0);
                });

                test.equal(resources[0].getKey(), "foobar");
                test.equal(resources[0].getProject(), "webapp");
                test.equal(resources[0].getSourceLocale(), "en-US");
                test.equal(resources[0].getSource(), "Asdf asdf");
                test.equal(resources[0].getTargetLocale(), "de-DE");
                test.equal(resources[0].getTarget(), "foobarfoo");
                test.equal(resources[0].getComment(), "foobar is where it's at!");

                test.equal(resources[1].getKey(), "foobar");
                test.equal(resources[1].getProject(), "webapp");
                test.equal(resources[1].getSourceLocale(), "en-US");
                test.equal(resources[1].getSource(), "Asdf asdf");
                test.equal(resources[1].getTargetLocale(), "fr-FR");
                test.equal(resources[1].getTarget(), "La asdf");
                test.equal(resources[1].getComment(), "foobar is where it's at!");

                test.equal(resources[2].getKey(), "foobar");
                test.equal(resources[2].getProject(), "webapp");
                test.equal(resources[2].getSourceLocale(), "en-US");
                test.equal(resources[2].getSource(), "Asdf asdf");
                test.equal(resources[2].getTargetLocale(), "nl-NL");
                test.equal(resources[2].getTarget(), "Het asdf");
                test.equal(resources[2].getComment(), "foobar is where it's at!");

                repo.close(function() {
                    test.done();
                });
            });
        })
    },

    testLocalRepositoryConstructorWithXliffsDirIgnoreNonmatchingFiles: function(test) {
        test.expect(3);

        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: "./testfiles/xliffs"
        });

        test.ok(repo);

        repo.init(function(){
            repo.getBy({
                reskey: "foobar",
                targetLocale: "es-ES"
            }, function(err, resources) {
                test.ok(resources);
                test.equal(resources.length, 0);

                repo.close(function() {
                    test.done();
                });
            });
        })
    },

    testLocalRepositoryConstructorWithXliffsDirArray: function(test) {
        test.expect(21);

        // should read all xliffs from both directories
        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: ["./testfiles/xliff20/app3", "./testfiles/xliff20/app4"],
        });

        test.ok(repo);

        repo.init(function(){
            repo.getBy({
                reskey: "String 1a"
            }, function(err, resources) {
                test.ok(resources);
                test.equal(resources.length, 3);

                resources.sort(function(left, right) {
                    var leftLocale = left.getTargetLocale();
                    var rightLocale = right.getTargetLocale();
                    return leftLocale < rightLocale ? -1 : (leftLocale > rightLocale ? 1 : 0);
                });

                test.equal(resources[0].getKey(), "String 1a");
                test.equal(resources[0].getProject(), "app1");
                test.equal(resources[0].getSourceLocale(), "en-KR");
                test.equal(resources[0].getSource(), "app1:String 1a");
                test.equal(resources[0].getTargetLocale(), "de-DE");
                test.equal(resources[0].getTarget(), "Das app1:String 1a");

                test.equal(resources[1].getKey(), "String 1a");
                test.equal(resources[1].getProject(), "app1");
                test.equal(resources[1].getSourceLocale(), "en-KR");
                test.equal(resources[1].getSource(), "app1:String 1a");
                test.equal(resources[1].getTargetLocale(), "en-US");
                test.equal(resources[1].getTarget(), "app1:String 1a");

                test.equal(resources[2].getKey(), "String 1a");
                test.equal(resources[2].getProject(), "app1");
                test.equal(resources[2].getSourceLocale(), "en-KR");
                test.equal(resources[2].getSource(), "app1:String 1a");
                test.equal(resources[2].getTargetLocale(), "fr-FR");
                test.equal(resources[2].getTarget(), "Le app1:String 1a");

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
        test.expect(11);

        var repo = new LocalRepository();
        var res = new ResourceString({
            project: "a",
            context: "b",
            targetLocale: "de-DE",
            key: "asdf",
            sourceLocale: "en-US",
            source: "asdf",
            target: "This is a test"
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
                test.equal(resources[0].getSourceLocale(), "en-US");
                test.equal(resources[0].getTargetLocale(), "de-DE");
                test.equal(resources[0].getKey(), "asdf");
                test.equal(resources[0].getTarget(), "This is a test");

                repo.close(function() {
                    test.done();
                });
            });
        });
    },

    testLocalRepositoryGetComplicated: function(test) {
        test.expect(20);

        var repo = new LocalRepository();
        var res = new ResourceString({
            project: "a",
            context: "b",
            targetLocale: "de-DE",
            key: "asdf",
            sourceLocale: "en-US",
            source: "asdf",
            target: "This is yet another test"
        });

        repo.add(res, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 1);

            res = new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "fr-FR",
                key: "asdf",
                sourceLocale: "en-US",
                source: "asdf",
                target: "Ceci est une teste."
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
                    test.equal(resources[0].getTargetLocale(), "de-DE");
                    test.equal(resources[0].getKey(), "asdf");
                    test.equal(resources[0].getSource(), "asdf");
                    test.equal(resources[0].getTarget(), "This is yet another test");

                    test.equal(resources[1].getProject(), "a");
                    test.equal(resources[1].getContext(), "b");
                    test.equal(resources[1].getTargetLocale(), "fr-FR");
                    test.equal(resources[1].getKey(), "asdf");
                    test.equal(resources[1].getSource(), "asdf");
                    test.equal(resources[1].getTarget(), "Ceci est une teste.");

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
            targetLocale: "nl-NL",
            key: "foofoo",
            sourceLocale: "en-US",
            source: "foofoo",
            target: "Dit is noch een test."
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
                targetLocale: "nl-NL"
            }, function(err, resources) {
                test.ok(resources);

                test.equal(resources.length, 1);
                test.equal(resources[0].getProject(), "a");
                test.equal(resources[0].getContext(), "b");
                test.equal(resources[0].getTargetLocale(), "nl-NL");
                test.equal(resources[0].getKey(), "foofoo");
                test.equal(resources[0].getTarget(), "Dit is noch een test.");

                // now remove it and make sure it is no longer there
                repo.remove(res, function(err, info) {
                    test.equal(err, null);
                    test.ok(info);

                    repo.getBy({
                        project: "a",
                        context: "b",
                        reskey: "foofoo",
                        targetLocale: "nl-NL"
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
            targetLocale: "nl-NL",
            resType: "string"
        }, function(err, resources) {
            test.ok(resources);

            test.equal(resources.length, 0);

            // now remove it and make sure it is no longer there
            repo.remove({
                project: "a",
                context: "b",
                reskey: "foofoo",
                targetLocale: "nl-NL",
                resType: "string"
            }, function(err, info) {
                test.equal(err, null);
                test.ok(!info);

                repo.getBy({
                    project: "a",
                    context: "b",
                    reskey: "foofoo",
                    targetLocale: "nl-NL",
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
            targetLocale: "nl-NL",
            key: "foofoo",
            sourceLocale: "en-US",
            source: "foofoo",
            target: "Dit is noch een test."
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
                targetLocale: "nl-NL",
                resType: "string"
            }, function(err, resources) {
                test.ok(resources);

                test.equal(resources.length, 1);
                test.equal(resources[0].getProject(), "a");
                test.equal(resources[0].getContext(), "b");
                test.equal(resources[0].getTargetLocale(), "nl-NL");
                test.equal(resources[0].getKey(), "foofoo");
                test.equal(resources[0].getTarget(), "Dit is noch een test.");

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
                        targetLocale: "nl-NL",
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
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
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
                test.equal(resources[0].getTargetLocale(), "en-US");
                test.equal(resources[0].getKey(), "barbar");
                test.equal(resources[0].getTarget(), "Elephants can fly!");

                test.equal(resources[1].getProject(), "a");
                test.equal(resources[1].getContext(), "b");
                test.equal(resources[1].getTargetLocale(), "de-DE");
                test.equal(resources[1].getKey(), "barbar");
                test.equal(resources[1].getTarget(), "Olifanten koennen fliegen!");

                test.equal(resources[2].getProject(), "a");
                test.equal(resources[2].getContext(), "b");
                test.equal(resources[2].getTargetLocale(), "nl-NL");
                test.equal(resources[2].getKey(), "barbar");
                test.equal(resources[2].getTarget(), "Oliefanten kunnen fliegen!");

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
            sourceLocale: "nl-NL",
            key: "sultansofswing",
            sourceArray: ["a one", "a two", "a one two three four", "hit it"]
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
                sourceLocale: "nl-NL"
            }, function(err, resources) {
                test.ok(resources);

                test.equal(resources.length, 1);
                test.equal(resources[0].getProject(), "a");
                test.equal(resources[0].getContext(), "b");
                test.equal(resources[0].getSourceLocale(), "nl-NL");
                test.equal(resources[0].getKey(), "sultansofswing");
                test.deepEqual(resources[0].getSourceArray(), ["a one", "a two", "a one two three four", "hit it"]);

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
            sourceLocale: "nl-NL",
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
                sourceLocale: "nl-NL"
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
            targetLocale: "nl-NL",
            key: "jawel",
            sourceStrings: {
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
                targetLocale: "nl-NL",
                resType: "plural"
            }, function(err, resources) {
                test.ok(resources);

                test.equal(resources.length, 1);

                test.equal(resources[0].getProject(), "a");
                test.equal(resources[0].getContext(), "b");
                test.equal(resources[0].getTargetLocale(), "nl-NL");
                test.equal(resources[0].getKey(), "jawel");
                test.deepEqual(resources[0].getSourcePlurals(), {
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
            targetLocale: "nl-NL",
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
                targetLocale: "nl-NL",
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
            targetLocale: "ja-JP",
            key: "katakana",
            sourceStrings: {one: "one", two: "two", few: "few"}
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
            targetLocale: "ru-RU",
            key: "blahblah",
            sourceStrings: {one: "one", two: "two", few: "few"}
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
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "b",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "c",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
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
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "c",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
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
                targetLocale: "en-CA",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "a",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "a",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
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
    },

    testLocalRepositoryGetResourceByHashKey: function(test) {
        test.expect(9);

        var repo = new LocalRepository();
        var set = new TranslationSet();
        var resources = [
             new ResourceString({
                 project: "a",
                 context: "b",
                 targetLocale: "en-US",
                 key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target:  "Elephants can fly!"
             }),
             new ResourceString({
                 project: "a",
                 context: "b",
                 targetLocale: "de-DE",
                 key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target:  "Olifanten koennen fliegen!"
             }),
             new ResourceString({
                 project: "a",
                 context: "b",
                 targetLocale: "nl-NL",
                 key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target:  "Oliefanten kunnen fliegen!"
             })
         ];
         set.addAll(resources);

        repo.addAll(set, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 3);

            repo.getResourceByHashKey(resources[0].hashKeyForTranslation("de-DE"), function(err, resource) {
                test.ok(resource);

                test.equal(resource.getProject(), "a");
                test.equal(resource.getContext(), "b");
                test.equal(resource.getTargetLocale(), "de-DE");
                test.equal(resource.getKey(), "barbar");
                test.equal(resource.getTarget(), "Olifanten koennen fliegen!");

                repo.close(function() {
                    test.done();
                });
            });
        });
    },

    testLocalRepositoryGetResourceByHashKeyNotThere: function(test) {
        test.expect(4);

        var repo = new LocalRepository();
        var set = new TranslationSet();
        var resources = [
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
            })
        ];
        set.addAll(resources);

        repo.addAll(set, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 3);

            repo.getResourceByHashKey(resources[0].hashKeyForTranslation("fr-FR"), function(err, resource) {
                test.ok(!resource);

                repo.close(function() {
                    test.done();
                });
            });
        });
    }

    /*
        testLocalRepositoryGetResource: function(test) {
        test.expect(9);

        var repo = new LocalRepository();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
            })
        ]);

        repo.addAll(set, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 3);

            repo.getResource("barbar", "string", "b", "de-DE", "a", undefined, function(err, resource) {
                test.ok(resource);

                test.equal(resource.getProject(), "a");
                test.equal(resource.getContext(), "b");
                test.equal(resource.getTargetLocale(), "de-DE");
                test.equal(resource.getKey(), "barbar");
                test.equal(resource.getTarget(), "Olifanten koennen fliegen!");

                repo.close(function() {
                    test.done();
                });
            });
        });
    },

    testLocalRepositoryGetResourceWrongCriteria: function(test) {
        test.expect(4);

        var repo = new LocalRepository();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
            })
        ]);

        repo.addAll(set, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 3);

            repo.getResource("barbar", "string", "c", "de-DE", "a", undefined, function(err, resource) {
                test.ok(!resource);

                repo.close(function() {
                    test.done();
                });
            });
        });
    },

    testLocalRepositoryGetResourceNotThere: function(test) {
        test.expect(4);

        var repo = new LocalRepository();
        var set = new TranslationSet();
        set.addAll([
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "en-US",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Elephants can fly!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "de-DE",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Olifanten koennen fliegen!"
            }),
            new ResourceString({
                project: "a",
                context: "b",
                targetLocale: "nl-NL",
                key: "barbar",
                sourceLocale: "en-US",
                source: "barbar",
                target: "Oliefanten kunnen fliegen!"
            })
        ]);

        repo.addAll(set, function(err, info) {
            test.equal(err, null);
            test.ok(info);
            test.equal(info.affectedRows, 3);

            repo.getResource("barbar", "string", "b", "zh-Hans-CN", "a", undefined, function(err, resource) {
                test.ok(!resource);

                repo.close(function() {
                    test.done();
                });
            });
        });
    }
    */
};
