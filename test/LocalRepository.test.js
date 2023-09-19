/*
 * LocalRepository.test.js - test the Database Translation Set object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
describe("localrepository", function() {
    test("SetUp", function() {
        expect.assertions(1);
        var repo = new LocalRepository();
        repo.clear(function() {
            repo.size(function(s) {
                expect(s).toBe(0);
                repo.close(function() {
                });
            })
        });
    });
    test("LocalRepositoryConstructor", function() {
        expect.assertions(1);
        var repo = new LocalRepository();
        expect(repo).toBeTruthy();
        repo.close(function() {
        });
    });
    test("LocalRepositoryRightSourceLocaleDefault", function() {
        expect.assertions(1);
        var repo = new LocalRepository();
        expect(repo.sourceLocale).toBe("en-US");
        repo.close(function() {
        });
    });
    test("LocalRepositoryConstructorWithPath", function() {
        expect.assertions(10);
        var repo = new LocalRepository({
            sourceLocale: "en-US",
            pathName: "./testfiles/test.xliff"
        });
        expect(repo).toBeTruthy();
        repo.init(function(){
            repo.getBy({
                reskey: "foobar"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getKey()).toBe("foobar");
                expect(resources[0].getProject()).toBe("webapp");
                expect(resources[0].getSourceLocale()).toBe("en-US");
                expect(resources[0].getSource()).toBe("Asdf asdf");
                expect(resources[0].getTargetLocale()).toBe("de-DE");
                expect(resources[0].getTarget()).toBe("foobarfoo");
                expect(resources[0].getComment()).toBe("foobar is where it's at!");
                repo.close(function() {
                });
            });
        })
    });
    test("LocalRepositoryConstructorWithXliffsDir", function() {
        expect.assertions(24);
        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: "./testfiles/xliffs"
        });
        expect(repo).toBeTruthy();
        repo.init(function(){
            repo.getBy({
                reskey: "foobar"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(3);
                resources.sort(function(left, right) {
                    var leftLocale = left.getTargetLocale();
                    var rightLocale = right.getTargetLocale();
                    return leftLocale < rightLocale ? -1 : (leftLocale > rightLocale ? 1 : 0);
                });
                expect(resources[0].getKey()).toBe("foobar");
                expect(resources[0].getProject()).toBe("webapp");
                expect(resources[0].getSourceLocale()).toBe("en-US");
                expect(resources[0].getSource()).toBe("Asdf asdf");
                expect(resources[0].getTargetLocale()).toBe("de-DE");
                expect(resources[0].getTarget()).toBe("foobarfoo");
                expect(resources[0].getComment()).toBe("foobar is where it's at!");
                expect(resources[1].getKey()).toBe("foobar");
                expect(resources[1].getProject()).toBe("webapp");
                expect(resources[1].getSourceLocale()).toBe("en-US");
                expect(resources[1].getSource()).toBe("Asdf asdf");
                expect(resources[1].getTargetLocale()).toBe("fr-FR");
                expect(resources[1].getTarget()).toBe("La asdf");
                expect(resources[1].getComment()).toBe("foobar is where it's at!");
                expect(resources[2].getKey()).toBe("foobar");
                expect(resources[2].getProject()).toBe("webapp");
                expect(resources[2].getSourceLocale()).toBe("en-US");
                expect(resources[2].getSource()).toBe("Asdf asdf");
                expect(resources[2].getTargetLocale()).toBe("nl-NL");
                expect(resources[2].getTarget()).toBe("Het asdf");
                expect(resources[2].getComment()).toBe("foobar is where it's at!");
                repo.close(function() {
                });
            });
        })
    });
    test("LocalRepositoryConstructorWithXliffsDirIgnoreNonmatchingFiles", function() {
        expect.assertions(3);
        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: "./testfiles/xliffs"
        });
        expect(repo).toBeTruthy();
        repo.init(function(){
            repo.getBy({
                reskey: "foobar",
                targetLocale: "es-ES"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(0);
                repo.close(function() {
                });
            });
        })
    });
    test("LocalRepositoryConstructorWithXliffsDirArray", function() {
        expect.assertions(21);
        // should read all xliffs from both directories
        var repo = new LocalRepository({
            sourceLocale: "en-US",
            xliffsDir: ["./testfiles/xliff20/app3", "./testfiles/xliff20/app4"],
        });
        expect(repo).toBeTruthy();
        repo.init(function(){
            repo.getBy({
                reskey: "String 1a"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(3);
                resources.sort(function(left, right) {
                    var leftLocale = left.getTargetLocale();
                    var rightLocale = right.getTargetLocale();
                    return leftLocale < rightLocale ? -1 : (leftLocale > rightLocale ? 1 : 0);
                });
                expect(resources[0].getKey()).toBe("String 1a");
                expect(resources[0].getProject()).toBe("app3");
                expect(resources[0].getSourceLocale()).toBe("en-KR");
                expect(resources[0].getSource()).toBe("app3:String 1a");
                expect(resources[0].getTargetLocale()).toBe("de-DE");
                expect(resources[0].getTarget()).toBe("Das app3:String 1a");
                expect(resources[1].getKey()).toBe("String 1a");
                expect(resources[1].getProject()).toBe("app3");
                expect(resources[1].getSourceLocale()).toBe("en-KR");
                expect(resources[1].getSource()).toBe("app3:String 1a");
                expect(resources[1].getTargetLocale()).toBe("en-US");
                expect(resources[1].getTarget()).toBe("app3:String 1a");
                expect(resources[2].getKey()).toBe("String 1a");
                expect(resources[2].getProject()).toBe("app3");
                expect(resources[2].getSourceLocale()).toBe("en-KR");
                expect(resources[2].getSource()).toBe("app3:String 1a");
                expect(resources[2].getTargetLocale()).toBe("fr-FR");
                expect(resources[2].getTarget()).toBe("Le app3:String 1a");
                repo.close(function() {
                });
            });
        })
    });
    test("LocalRepositoryGetEmpty", function() {
        expect.assertions(2);
        var repo = new LocalRepository();
        repo.getBy({
            project: "asdf"
        }, function(err, r) {
            expect(r).toBeTruthy();
            expect(r.length).toBe(0);
            repo.close(function() {
            });
        });
    });
    test("LocalRepositoryGet", function() {
        expect.assertions(11);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);
            repo.getBy({
                reskey: "asdf"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getSourceLocale()).toBe("en-US");
                expect(resources[0].getTargetLocale()).toBe("de-DE");
                expect(resources[0].getKey()).toBe("asdf");
                expect(resources[0].getTarget()).toBe("This is a test");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetComplicated", function() {
        expect.assertions(20);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);
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
                expect(err).toBe(null);
                expect(info).toBeTruthy();
                expect(info.affectedRows).toBe(1);
                repo.getBy({
                    project: "a",
                    context: "b",
                    reskey: "asdf"
                }, function(err, resources) {
                    expect(resources).toBeTruthy();
                    expect(resources.length).toBe(2);
                    expect(resources[0].getProject()).toBe("a");
                    expect(resources[0].getContext()).toBe("b");
                    expect(resources[0].getTargetLocale()).toBe("de-DE");
                    expect(resources[0].getKey()).toBe("asdf");
                    expect(resources[0].getSource()).toBe("asdf");
                    expect(resources[0].getTarget()).toBe("This is yet another test");
                    expect(resources[1].getProject()).toBe("a");
                    expect(resources[1].getContext()).toBe("b");
                    expect(resources[1].getTargetLocale()).toBe("fr-FR");
                    expect(resources[1].getKey()).toBe("asdf");
                    expect(resources[1].getSource()).toBe("asdf");
                    expect(resources[1].getTarget()).toBe("Ceci est une teste.");
                    repo.close(function() {
                    });
                });
            });
        });
    });
    test("LocalRepositoryGetNoMatches", function() {
        expect.assertions(2);
        var repo = new LocalRepository();
        repo.getBy({
            project: "asdfasdfasdf"
        }, function(err, resources) {
            expect(resources).toBeTruthy();
            expect(resources.length).toBe(0);
            repo.close(function() {
            });
        });
    });
    test("LocalRepositoryRemove", function() {
        expect.assertions(13);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "foofoo",
                targetLocale: "nl-NL"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getTargetLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("foofoo");
                expect(resources[0].getTarget()).toBe("Dit is noch een test.");
                // now remove it and make sure it is no longer there
                repo.remove(res, function(err, info) {
                    expect(err).toBe(null);
                    expect(info).toBeTruthy();
                    repo.getBy({
                        project: "a",
                        context: "b",
                        reskey: "foofoo",
                        targetLocale: "nl-NL"
                    }, function(err, resources) {
                        expect(resources.length).toBe(0); // not found
                        repo.close(function() {
                        });
                    });
                });
            });
        });
    });
    test("LocalRepositoryRemoveNonExistent", function() {
        expect.assertions(5);
        var repo = new LocalRepository();
        // make sure it is not there
        repo.getBy({
            project: "a",
            context: "b",
            reskey: "foofoo",
            targetLocale: "nl-NL",
            resType: "string"
        }, function(err, resources) {
            expect(resources).toBeTruthy();
            expect(resources.length).toBe(0);
            // now remove it and make sure it is no longer there
            repo.remove({
                project: "a",
                context: "b",
                reskey: "foofoo",
                targetLocale: "nl-NL",
                resType: "string"
            }, function(err, info) {
                expect(err).toBe(null);
                expect(!info).toBeTruthy();
                repo.getBy({
                    project: "a",
                    context: "b",
                    reskey: "foofoo",
                    targetLocale: "nl-NL",
                    resType: "string"
                }, function(err, resources) {
                    expect(resources.length).toBe(0); // still not found
                    repo.close(function() {
                    });
                });
            });
        });
    });
    test("LocalRepositoryRemoveNoParams", function() {
        expect.assertions(13);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "foofoo",
                targetLocale: "nl-NL",
                resType: "string"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getTargetLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("foofoo");
                expect(resources[0].getTarget()).toBe("Dit is noch een test.");
                // now remove with bogus params and make sure it didn't ruin the db
                repo.remove({
                    resType: "string"
                }, function(err, info) {
                    expect(!err).toBeTruthy();
                    expect(!info).toBeTruthy();
                    repo.getBy({
                        project: "a",
                        context: "b",
                        reskey: "foofoo",
                        targetLocale: "nl-NL",
                        resType: "string"
                    }, function(err, resources) {
                        expect(resources.length).toBe(1); // still there
                        repo.close(function() {
                        });
                    });
                });
            });
        });
    });
    test("LocalRepositoryAddAll", function() {
        expect.assertions(20);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "barbar"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(3);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getTargetLocale()).toBe("en-US");
                expect(resources[0].getKey()).toBe("barbar");
                expect(resources[0].getTarget()).toBe("Elephants can fly!");
                expect(resources[1].getProject()).toBe("a");
                expect(resources[1].getContext()).toBe("b");
                expect(resources[1].getTargetLocale()).toBe("de-DE");
                expect(resources[1].getKey()).toBe("barbar");
                expect(resources[1].getTarget()).toBe("Olifanten koennen fliegen!");
                expect(resources[2].getProject()).toBe("a");
                expect(resources[2].getContext()).toBe("b");
                expect(resources[2].getTargetLocale()).toBe("nl-NL");
                expect(resources[2].getKey()).toBe("barbar");
                expect(resources[2].getTarget()).toBe("Oliefanten kunnen fliegen!");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryAddArray", function() {
        expect.assertions(10);
        var repo = new LocalRepository();
        var res = new ResourceArray({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "sultansofswing",
            sourceArray: ["a one", "a two", "a one two three four", "hit it"]
        });
        repo.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(4);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "sultansofswing",
                sourceLocale: "nl-NL"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getSourceLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("sultansofswing");
                expect(resources[0].getSourceArray(), ["a one", "a two", "a one two three four").toStrictEqual("hit it"]);
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryAddArrayEmpty", function() {
        expect.assertions(6);
        var repo = new LocalRepository();
        var res = new ResourceArray({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "jajajajaja"
        });
        repo.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(0);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "jajajajaja",
                sourceLocale: "nl-NL"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].size()).toBe(0);
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryAddPlural", function() {
        expect.assertions(10);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(4);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "jawel",
                targetLocale: "nl-NL",
                resType: "plural"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getTargetLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("jawel");
                expect(resources[0].getSourcePlurals()).toStrictEqual({
                    one: "a one",
                    two: "a two",
                    few: "a one two three four",
                    many: "hit it"
                });
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryAddPluralEmpty", function() {
        expect.assertions(6);
        var repo = new LocalRepository();
        var res = new ResourcePlural({
            project: "a",
            context: "b",
            targetLocale: "nl-NL",
            key: "gossie"
        });
        repo.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(0);
            // make sure it is there
            repo.getBy({
                project: "a",
                context: "b",
                reskey: "gossie",
                targetLocale: "nl-NL",
                resType: "plural"
            }, function(err, resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(1);
                expect(resources[0].size()).toBe(0);
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryContains", function() {
        expect.assertions(4);
        var repo = new LocalRepository();
        var res = new ResourcePlural({
            project: "a",
            context: "c",
            targetLocale: "ja-JP",
            key: "katakana",
            sourceStrings: {one: "one", two: "two", few: "few"}
        });
        repo.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            // make sure it is there
            repo.contains(res, function(there) {
                expect(there).toBeTruthy();
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryContainsNot", function() {
        expect.assertions(1);
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
            expect(!there).toBeTruthy();
            repo.close(function() {
            });
        });
    });
    test("LocalRepositoryGetProjects", function() {
        expect.assertions(8);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getProjects(function(projects) {
                expect(projects).toBeTruthy();
                expect(projects.length).toBe(3);
                expect(projects[0]).toBe("a");
                expect(projects[1]).toBe("b");
                expect(projects[2]).toBe("c");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetContexts", function() {
        expect.assertions(8);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getContexts("a", function(contexts) {
                expect(contexts).toBeTruthy();
                expect(contexts.length).toBe(3);
                expect(contexts[0]).toBe("a");
                expect(contexts[1]).toBe("b");
                expect(contexts[2]).toBe("c");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetLocales", function() {
        expect.assertions(8);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getLocales("a", "a", function(locales) {
                expect(locales).toBeTruthy();
                expect(locales.length).toBe(3);
                expect(locales[0]).toBe("de-DE");
                expect(locales[1]).toBe("en-CA");
                expect(locales[2]).toBe("nl-NL");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetResourceByHashKey", function() {
        expect.assertions(9);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getResourceByHashKey(resources[0].hashKeyForTranslation("de-DE"), function(err, resource) {
                expect(resource).toBeTruthy();
                expect(resource.getProject()).toBe("a");
                expect(resource.getContext()).toBe("b");
                expect(resource.getTargetLocale()).toBe("de-DE");
                expect(resource.getKey()).toBe("barbar");
                expect(resource.getTarget()).toBe("Olifanten koennen fliegen!");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetResourceByHashKeyNotThere", function() {
        expect.assertions(4);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getResourceByHashKey(resources[0].hashKeyForTranslation("fr-FR"), function(err, resource) {
                expect(!resource).toBeTruthy();
                repo.close(function() {
                });
            });
        });
    });
    /*
        test("LocalRepositoryGetResource", function() {
        expect.assertions(9);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getResource("barbar", "string", "b", "de-DE", "a", undefined, function(err, resource) {
                expect(resource).toBeTruthy();
                expect(resource.getProject()).toBe("a");
                expect(resource.getContext()).toBe("b");
                expect(resource.getTargetLocale()).toBe("de-DE");
                expect(resource.getKey()).toBe("barbar");
                expect(resource.getTarget()).toBe("Olifanten koennen fliegen!");
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetResourceWrongCriteria", function() {
        expect.assertions(4);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getResource("barbar", "string", "c", "de-DE", "a", undefined, function(err, resource) {
                expect(!resource).toBeTruthy();
                repo.close(function() {
                });
            });
        });
    });
    test("LocalRepositoryGetResourceNotThere", function() {
        expect.assertions(4);
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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);
            repo.getResource("barbar", "string", "b", "zh-Hans-CN", "a", undefined, function(err, resource) {
                expect(!resource).toBeTruthy();
                repo.close(function() {
                });
            });
        });
    });
    */
});
