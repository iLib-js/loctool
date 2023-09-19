/*
 * DBTranslationSet.test.js - test the Database Translation Set object.
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

if (!DBTranslationSet) {
    var DBTranslationSet = require("../lib/DBTranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var TranslationSet = require("../lib/TranslationSet.js");
}
describe.skip("dbtranslationset", function() {
    test("SetUp", function() {
        expect.assertions(1);

        var ts = new DBTranslationSet();

        ts.clear(function() {
            ts.size(function(s) {
                expect(s).toBe(0);

                ts.close();
            })
        });
    });

    test("DBTranslationSetConstructor", function() {
        expect.assertions(1);

        var ts = new DBTranslationSet();
        expect(ts).toBeTruthy();
        ts.close();
    });

    test("DBTranslationSetRightSourceLocaleDefault", function() {
        expect.assertions(1);

        var ts = new DBTranslationSet();

        expect(ts.sourceLocale).toBe("en-US");
        ts.close();
    });

    test("DBTranslationSetGetEmpty", function() {
        expect.assertions(2);

        var ts = new DBTranslationSet();

        ts.getBy({
            project: "asdf"
        }, function(r) {
            expect(r).toBeTruthy();
            expect(r.length).toBe(0);
            ts.close();
        });
    });

    test("DBTranslationSetGet", function() {
        expect.assertions(10);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            project: "a",
            context: "b",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);

            ts.getBy({
                key: "asdf"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getLocale()).toBe("de-DE");
                expect(resources[0].getKey()).toBe("asdf");
                expect(resources[0].getSource()).toBe("This is a test");

                ts.close();
            });
        });
    });

    test("DBTranslationSetGetComplicated", function() {
        expect.assertions(18);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            project: "a",
            context: "b",
            sourceLocale: "de-DE",
            key: "foofoo",
            source: "This is yet another test"
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);

            res = new ResourceString({
                project: "a",
                context: "b",
                sourceLocale: "fr-FR",
                key: "asdf",
                source: "Ceci est une teste."
            });

            ts.add(res, function(err, info) {
                expect(err).toBe(null);
                expect(info).toBeTruthy();
                expect(info.affectedRows).toBe(1);

                ts.getBy({
                    project: "a",
                    context: "b",
                    key: "asdf"
                }, function(resources) {
                    expect(resources).toBeTruthy();

                    expect(resources.length).toBe(2);
                    expect(resources[0].getProject()).toBe("a");
                    expect(resources[0].getContext()).toBe("b");
                    expect(resources[0].getLocale()).toBe("de-DE");
                    expect(resources[0].getKey()).toBe("asdf");
                    expect(resources[0].getSource()).toBe("This is a test");

                    expect(resources[1].getProject()).toBe("a");
                    expect(resources[1].getContext()).toBe("b");
                    expect(resources[1].getLocale()).toBe("fr-FR");
                    expect(resources[1].getKey()).toBe("asdf");
                    expect(resources[1].getSource()).toBe("Ceci est une teste.");

                    ts.close();
                });
            });
        });
    });

    test("DBTranslationSetGetNoMatches", function() {
        expect.assertions(2);

        var ts = new DBTranslationSet();
        ts.getBy({
            project: "asdfasdfasdf"
        }, function(resources) {
            expect(resources).toBeTruthy();

            expect(resources.length).toBe(0);

            ts.close();
        });
    });

    test("DBTranslationSetRemove", function() {
        expect.assertions(13);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "foofoo",
            source: "Dit is noch een test."
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "foofoo",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("foofoo");
                expect(resources[0].getSource()).toBe("Dit is noch een test.");

                // now remove it and make sure it is no longer there
                ts.remove(res, function(err, info) {
                    expect(err).toBe(null);
                    expect(info).toBeTruthy();

                    ts.getBy({
                        project: "a",
                        context: "b",
                        key: "foofoo",
                        sourceLocale: "nl-NL"
                    }, function(resources) {
                        expect(resources.length).toBe(0); // not found
                        ts.close();
                    });
                });
            });
        });
    });

    test("DBTranslationSetRemoveNonExistent", function() {
        expect.assertions(5);

        var ts = new DBTranslationSet();

        // make sure it is not there
        ts.getBy({
            project: "a",
            context: "b",
            key: "foofoo",
            sourceLocale: "nl-NL"
        }, function(resources) {
            expect(resources).toBeTruthy();

            expect(resources.length).toBe(0);

            // now remove it and make sure it is no longer there
            ts.remove({
                project: "a",
                context: "b",
                key: "foofoo",
                sourceLocale: "nl-NL"
            }, function(err, info) {
                expect(err).toBe(null);
                expect(info).toBeTruthy();

                ts.getBy({
                    project: "a",
                    context: "b",
                    key: "foofoo",
                    sourceLocale: "nl-NL"
                }, function(resources) {
                    expect(resources.length).toBe(0); // still not found
                    ts.close();
                });
            });
        });
    });

    test("DBTranslationSetRemoveNoParams", function() {
        expect.assertions(13);

        var ts = new DBTranslationSet();
        var res = new ResourceString({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "foofoo",
            source: "Dit is noch een test."
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(1);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "foofoo",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("foofoo");
                expect(resources[0].getSource()).toBe("Dit is noch een test.");

                // now remove with bogus params and make sure it didn't ruin the db
                ts.remove({
                    resType: "string"
                }, function(err, info) {
                    console.log("err is " + err + " and info is " + JSON.stringify(info));
                    expect(err).toBeTruthy();
                    expect(!info).toBeTruthy();

                    ts.getBy({
                        project: "a",
                        context: "b",
                        key: "foofoo",
                        sourceLocale: "nl-NL"
                    }, function(resources) {
                        expect(resources.length).toBe(1); // still there
                        ts.close();
                    });
                });
            });
        });
    });

    test("DBTranslationSetAddAll", function() {
        expect.assertions(20);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);

            ts.getBy({
                project: "a",
                context: "b",
                key: "barbar",
                sort: "id"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(3);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getKey()).toBe("barbar");
                expect(resources[0].getSourceLocale()).toBe("en-US");
                expect(resources[0].getSource()).toBe("Elephants can fly!");

                expect(resources[1].getProject()).toBe("a");
                expect(resources[1].getContext()).toBe("b");
                expect(resources[1].getKey()).toBe("barbar");
                expect(resources[1].getSourceLocale()).toBe("en-US");
                expect(resources[1].getSource()).toBe("Elephants can fly!");
                expect(resources[1].getTargetLocale()).toBe("de-DE");
                expect(resources[1].getTarget()).toBe("Olifanten koennen fliegen!");

                expect(resources[2].getProject()).toBe("a");
                expect(resources[2].getContext()).toBe("b");
                expect(resources[0].getKey()).toBe("barbar");
                expect(resources[0].getSourceLocale()).toBe("en-US");
                expect(resources[0].getSource()).toBe("Elephants can fly!");
                expect(resources[2].getTargetLocale()).toBe("nl-NL");
                expect(resources[2].getTarget()).toBe("Oliephanten kunnen fliegen!");

                ts.close();
            });
        });
    });

    test("DBTranslationSetAddArray", function() {
        expect.assertions(10);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(4);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "sultansofswing",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(1);
                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getSourceLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("sultansofswing");
                expect(resources[0].getSourceArray()).toStrictEqual(["a one", "a two", "a one two three four", "hit it"]);
                ts.close();
            });
        });
    });

    test("DBTranslationSetAddArrayEmpty", function() {
        expect.assertions(5);

        var ts = new DBTranslationSet();
        var res = new ResourceArray({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "jajajajaja"
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(0);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "jajajajaja",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(0);

                ts.close();
            });
        });
    });

    test("DBTranslationSetAddPlural", function() {
        expect.assertions(10);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(4);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "jawel",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();

                expect(resources.length).toBe(1);

                expect(resources[0].getProject()).toBe("a");
                expect(resources[0].getContext()).toBe("b");
                expect(resources[0].getSourceLocale()).toBe("nl-NL");
                expect(resources[0].getKey()).toBe("jawel");
                expect(resources[0].getSourcePlurals()).toStrictEqual({
                    one: "a one",
                    two: "a two",
                    few: "a one two three four",
                    many: "hit it"
                });

                ts.close();
            });
        });
    });

    test("DBTranslationSetAddPluralEmpty", function() {
        expect.assertions(5);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
            project: "a",
            context: "b",
            sourceLocale: "nl-NL",
            key: "gossie"
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(0);

            // make sure it is there
            ts.getBy({
                project: "a",
                context: "b",
                key: "gossie",
                sourceLocale: "nl-NL"
            }, function(resources) {
                expect(resources).toBeTruthy();
                expect(resources.length).toBe(0);

                ts.close();
            });
        });
    });

    test("DBTranslationSetContains", function() {
        expect.assertions(4);

        var ts = new DBTranslationSet();
        var res = new ResourcePlural({
            project: "a",
            context: "c",
            sourceLocale: "ja-JP",
            key: "katakana",
            sourceStrings: {one: "one", two: "two", few: "few"}
        });

        ts.add(res, function(err, info) {
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);

            // make sure it is there
            ts.contains(res, function(there) {
                expect(there).toBeTruthy();

                ts.close();
            });
        });
    });

    test("DBTranslationSetContainsNot", function() {
        expect.assertions(1);

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
            expect(there).not.toBeTruthy();
            ts.close();
        });
    });

    test("DBTranslationSetGetProjects", function() {
        expect.assertions(8);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);

            ts.getProjects(function(projects) {
                expect(projects).toBeTruthy();

                expect(projects.length).toBe(3);
                expect(projects[0]).toBe("a");
                expect(projects[1]).toBe("b");
                expect(projects[2]).toBe("c");

                ts.close();
            });
        });
    });

    test("DBTranslationSetGetContexts", function() {
        expect.assertions(8);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);

            ts.getContexts("a", function(contexts) {
                expect(contexts).toBeTruthy();

                expect(contexts.length).toBe(3);
                expect(contexts[0]).toBe("a");
                expect(contexts[1]).toBe("b");
                expect(contexts[2]).toBe("c");

                ts.close();
            });
        });
    });

    test("DBTranslationSetGetLocales", function() {
        expect.assertions(9);

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
            expect(err).toBe(null);
            expect(info).toBeTruthy();
            expect(info.affectedRows).toBe(3);

            ts.getLocales("a", "a", function(locales) {
                expect(locales).toBeTruthy();

                expect(locales.length).toBe(4);
                expect(locales[0]).toBe("de-DE");
                expect(locales[1]).toBe("en-CA");
                expect(locales[2]).toBe("en-US");
                expect(locales[3]).toBe("nl-NL");

                ts.close();
            });
        });
    });
});
