/*
 * TranslationSet.test.js - test the Translation Set object.
 *
 * Copyright © 2016-2017, 2023-2024 HealthTap, Inc.
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

var TranslationSet = require("../lib/TranslationSet.js");
var ResourceString = require("../lib/ResourceString.js");
var ContextResourceString = require("../lib/ContextResourceString.js");
var ResourceArray = require("../lib/ResourceArray.js");
var ResourcePlural = require("../lib/ResourcePlural.js");

describe("translationset", function() {
     test("TranslationSetConstructor", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        expect(ts).toBeTruthy();
    });

    test("TranslationSetRightSourceLocaleDefault", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        expect(ts.sourceLocale).toBe("zxx-XX");
    });

    test("TranslationSetGetEmpty", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        var r = ts.get("asdf");

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGet", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            project: "foo",
            source: "This is a test",
            target: "Dies ist einen Test.",
            datatype: "html"
        });

        ts.add(res);

        var r = ts.get(ResourceString.hashKey("foo", res.getSourceLocale(), "asdf", "html"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationIsDirtyNew", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyTrue", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyFalse", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyTrue2", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        res = new ResourceString({
            key: "asdfasdfasdf",
            source: "This is another test"
        });

        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyAddSameResourceTwice", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        // should not set the flag to dirty because the resource
        // is already there, so nothing is added
        ts.add(res);

        expect(!ts.isDirty()).toBeTruthy();
    });

    test("TranslationIsDirtyUpdateSource", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            project: "foo",
            sourceLocale: "en-US",
            source: "This is a test"
        });

        ts.add(res);
        ts.setClean();

        expect(!ts.isDirty()).toBeTruthy();

        res = new ResourceString({
            key: "asdf",
            project: "foo",
            sourceLocale: "en-US",
            source: "This is a new test"
        });

        // should not set the flag to dirty because the resource
        // is already there, so nothing is added
        ts.add(res);

        expect(ts.isDirty()).toBeTruthy();
    });

    test("TranslationSetGetIgnoreContext", function() {
        expect.assertions(3);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });

        ts.add(res);

        // should not overwrite the one above
        res = new ResourceString({
            key: "asdf",
            source: "This is a test",
                target: "Dies ist einen Test.",
            context: "different"
        });

        ts.add(res);

        var r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();
    });

    test("TranslationSetGetWithAndroidContext", function() {
        expect.assertions(6);

        var ts = new TranslationSet();
        var res = new ContextResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });

        ts.add(res);

        res = new ContextResourceString({
            key: "asdf",
            source: "This is a test",
                target: "Dies ist einen Test.",
            context: "different"
        });

        ts.add(res);

        var r = ts.get(ContextResourceString.hashKey(undefined, undefined, res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();

        r = ts.get(ContextResourceString.hashKey(undefined, "different", res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(r.getContext()).toBe("different");
    });

    test("TranslationSetGetDifferentTypesSameKeyIsOkay", function() {
        expect.assertions(6);

        var ts = new TranslationSet();
        var res1 = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "this too"]
        });

        ts.add(res1);

        var res2 = new ResourceString({
            key: "asdf", // same key
            source: "This is a test"
        });

        ts.add(res2);

        // default type is string
        var r = ts.get(ResourceString.hashKey(undefined, res2.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.resType).toBe("string");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceArray.hashKey(undefined, undefined, res1.getSourceLocale(), "asdf"));

        expect(r.getKey()).toBe("asdf");
        expect(r.resType).toBe("array");
        expect(r.getSourceArray()).toStrictEqual(["This is a test", "this too"]);
    });

    test("TranslationSetGetUndefined", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var r = ts.get();

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetFromMany", function() {
        expect.assertions(4);

        var ts = new TranslationSet();
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

        var r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "qwerty", "plaintext"));

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySource", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
        });

        ts.add(res);

        var r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetGetBySourceNonAutoKey", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        var r = ts.getBySource("This is a test");

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetBySourceFromMany", function() {
        expect.assertions(4);

        var ts = new TranslationSet();
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

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = ts.getBySource("This is another test");

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySourceUndefined", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var r = ts.getBySource();

        expect(!r).toBeTruthy();
    });

    test("TranslationSetGetBySourceWithContext", function() {
        expect.assertions(6);

        var ts = new TranslationSet();
        var res = new ContextResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test"
            // no context
        });

        ts.add(res);

        res = new ContextResourceString({
            key: "asdf",
            autoKey: true,
            source: "This is a test",
                target: "Dies ist einen Test.",
            context: "foo"
        });

        ts.add(res);

        var r = ts.getBySource("This is a test");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();

        r = ts.getBySource("This is a test", "foo");

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(r.getContext()).toBe("foo");
    });

    test("TranslationSetGetBySourceOnlyAutoKeys", function() {
        expect.assertions(6);

        var ts = new TranslationSet();
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

        expect(r.getKey()).toBe("r3423423");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "explicit_id", "plaintext"));

        expect(r.getKey()).toBe("explicit_id");
        expect(r.getSource()).toBe("This is a test");

        r = ts.get(ResourceString.hashKey(undefined, res.getSourceLocale(), "r3423423", "plaintext"));

        expect(r.getKey()).toBe("r3423423");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetGetAll", function() {
        expect.assertions(6);

        var ts = new TranslationSet();
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
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        var r = resources[0];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");

        r = resources[1];

        expect(r.getKey()).toBe("qwerty");
        expect(r.getSource()).toBe("This is another test");
    });

    test("TranslationSetGetAllEmpty", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var r = ts.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("TranslationSetAddTranslationMerged", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
            target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE"
        });

        ts.add(res);

        var resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
    });

    test("TranslationSetAddTranslationDifferentContext", function() {
        expect.assertions(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test",
            target: "Dies ist einen Test.",
            sourceLocale: "en-US"
        });

        ts.add(res);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
                target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE",
            context: "foo"
        });

        ts.add(res);

        var resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);
    });

    test("TranslationSetAddAll", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

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

        var r = ts.get(ResourceString.hashKey(undefined, "en-US", "asdf", "plaintext"));

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
    });

    test("TranslationSetAddAllDifferentContexts", function() {
        expect.assertions(8);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                context: "foo"
            })
        ]);

        var resources = ts.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        var r = resources[0];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(!r.getContext()).toBeTruthy();

        r = resources[1];

        expect(r.getKey()).toBe("asdf");
        expect(r.getSource()).toBe("This is a test");
        expect(r.getContext()).toBe("foo");
    });

    test("TranslationSetAddAllRightSize", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);

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

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetAddTranslationUndefined", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        try {
            expect(ts.size()).toBe(0);
            ts.add(undefined);
            expect(ts.size()).toBe(0);
        } catch (e) {
            test.fail();
        }
    });

    test("TranslationSetAddAllEmpty", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll([]);

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetAddAllUndefined", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        ts.addAll(undefined);

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetSize", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.size()).toBe(1);
    });

    test("TranslationSetSizeMultiple", function() {
        expect.assertions(1);

        var ts = new TranslationSet();
        var res = new ContextResourceString({
            key: "asdf",
            source: "This is a test"
            // no context
        });

        ts.add(res);

        res = new ContextResourceString({
            key: "asdf",
            source: "This is a test",
                target: "Dies ist einen Test.",
            context: "different"
        });

        ts.add(res);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetEmpty", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetSizeMerged", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);

        var res = new ResourceString({
            key: "asdf",
            source: "This is a test"
        });

        ts.add(res);

        expect(ts.size()).toBe(1);

        res = new ResourceString({
            key: "asdf",
            source: "This is another test",
                target: "Dies ist nochmals einen Test",
            targetLocale: "de-DE"
        });

        ts.add(res);

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetSizeAddAll", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        expect(ts.size()).toBe(0);

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

        expect(ts.size()).toBe(2);
    });

    test("TranslationSetAddSet", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "foobar",
                source: "This is yet another test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(4);
    });

    test("TranslationSetAddSetRightContents", function() {
        expect.assertions(10);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "foobar",
                source: "This is yet another test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        ts1.addSet(ts2);

        var r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(4);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");

        expect(r[2].reskey).toBe("foobar");
        expect(r[2].getSource()).toBe("This is yet another test");

        expect(r[3].reskey).toBe("blahblah");
        expect(r[3].getSource()).toBe("One of its feet is both the same.");
    });

    test("TranslationSetAddSetMerge", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(3);
    });

    test("TranslationSetAddSetMergeRightContents", function() {
        expect.assertions(8);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts2.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "blahblah",
                source: "One of its feet is both the same."
            })
        ]);

        ts1.addSet(ts2);

        var r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");

        expect(r[2].reskey).toBe("blahblah");
        expect(r[2].getSource()).toBe("One of its feet is both the same.");
    });

    test("TranslationSetAddSetEmpty", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(ts2);

        expect(ts1.size()).toBe(2);
    });

    test("TranslationSetAddSetEmptyRightContents", function() {
        expect.assertions(6);

        var ts1 = new TranslationSet(),
            ts2 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts1.addSet(ts2);

        var r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
    });

    test("TranslationSetAddSetUndefined", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        expect(ts1.size()).toBe(2);

        ts1.addSet(undefined);

        expect(ts1.size()).toBe(2);
    });

    test("TranslationSetAddSetUndefinedRightContents", function() {
        expect.assertions(6);

        var ts1 = new TranslationSet();

        ts1.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test"
            })
        ]);

        ts1.addSet(undefined);

        var r = ts1.getAll();

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
    });

    test("TranslationSetGetBySingleField", function() {
        expect.assertions(6);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                source: "test test",
                target: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test",
                target: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test",
                target: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "test test",
                target: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var r = ts.getBy({
            project: "yowza"
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].reskey).toBe("llashdfoi");
        expect(r[0].getTarget()).toBe("blah blah blah");

        expect(r[1].reskey).toBe("ajajsdjdsj");
        expect(r[1].getTarget()).toBe("blah blah blah en espanol");
    });

    test("TranslationSetGetByDoubleFields", function() {
        expect.assertions(17);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var r = ts.getBy({
            project: "foo",
            targetLocale: "de-DE"
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getProject()).toBe("foo");
        expect(r[0].getTargetLocale()).toBe("de-DE");
        expect(r[0].getContext()).toBe("bar");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
        expect(r[1].getProject()).toBe("foo");
        expect(r[1].getTargetLocale()).toBe("de-DE");
        expect(r[1].getContext()).toBe("bar");

        expect(r[2].reskey).toBe("qwerty");
        expect(r[2].getSource()).toBe("This is another test");
        expect(r[2].getProject()).toBe("foo");
        expect(r[2].getTargetLocale()).toBe("de-DE");
        expect(!r[2].getContext()).toBeTruthy();
    });

    test("TranslationSetGetByOrOperator", function() {
        expect.assertions(17);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "de-DE",
                context: "ajajajaj"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        // should match one or the other
        var r = ts.getBy({
            targetLocale: ["en-US", "de-DE"]
        });

        expect(r).toBeTruthy();
        expect(r.length).toBe(5);

        expect(r[0].reskey).toBe("asdf");
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getTargetLocale()).toBe("de-DE");

        expect(r[1].reskey).toBe("qwerty");
        expect(r[1].getSource()).toBe("This is another test");
        expect(r[1].getTargetLocale()).toBe("de-DE");

        expect(r[2].reskey).toBe("qwerty");
        expect(r[2].getSource()).toBe("This is another test");
        expect(r[2].getTargetLocale()).toBe("de-DE");

        expect(r[3].reskey).toBe("qwerty");
        expect(r[3].getSource()).toBe("This is yet another test");
        expect(r[3].getTargetLocale()).toBe("de-DE");

        expect(r[4].reskey).toBe("llashdfoi");
        expect(r[4].getSource()).toBe("blah blah blah");
        expect(r[4].getTargetLocale()).toBe("en-US");
    });

    test("TranslationSetGetProjects", function() {
        expect.assertions(5);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var projects = ts.getProjects();

        expect(projects).toBeTruthy();
        expect(projects.length).toBe(3);

        expect(projects[0]).toBe("foo");
        expect(projects[1]).toBe("asdf");
        expect(projects[2]).toBe("yowza");
    });

    test("TranslationSetGetProjectsEmpty", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        var projects = ts.getProjects();

        expect(!projects).toBeTruthy();
    });

    test("TranslationSetGetContexts", function() {
        expect.assertions(4);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var contexts = ts.getContexts("foo");

        expect(contexts).toBeTruthy();
        expect(contexts.length).toBe(2);

        expect(contexts[0]).toBe("bar");
        expect(contexts[1]).toBe("");
    });

    test("TranslationSetGetContextsEmpty", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        var contexts = ts.getContexts("foo");

        expect(!contexts).toBeTruthy();
    });

    test("TranslationSetGetContextsOnlyRoot", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var contexts = ts.getContexts("yowza");

        expect(contexts).toBeTruthy();
        expect(contexts.length).toBe(1);

        expect(contexts[0]).toBe("");
    });

    test("TranslationSetGetLocales", function() {
        expect.assertions(5);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var locales = ts.getLocales("foo", "bar");

        expect(locales).toBeTruthy();
        expect(locales.length).toBe(3);

        expect(locales[0]).toBe("de-DE");
        expect(locales[1]).toBe("fr-FR");
        expect(locales[2]).toBe("nl-NL");
    });

    test("TranslationSetGetLocalesEmpty", function() {
        expect.assertions(1);

        var ts = new TranslationSet();

        var locales = ts.getLocales("foo", "bar");

        expect(!locales).toBeTruthy();
    });

    test("TranslationSetClear", function() {
        expect.assertions(2);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        ts.clear();

        expect(ts.size()).toBe(0);
    });

    test("TranslationSetClearReallyGone", function() {
        expect.assertions(4);

        var ts = new TranslationSet();

        ts.addAll([
            new ResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                context: "bar",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var resources = ts.getBy({project: "yowza"})

        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        ts.clear();

        resources = ts.getBy({project: "yowza"})

        expect(resources).toBeTruthy();
        expect(resources.length).toBe(0);
    });

    test("TranslationSetRemoveRightSize", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);
        expect(ts.remove(new ResourceString({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            key: "foobarfoo"
        }))).toBeTruthy();
        expect(ts.size()).toBe(9);
    });

    test("TranslationSetRemoveReallyGone", function() {
        expect.assertions(10);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        var res = ts.getBy({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            reskey: "foobarfoo",
            resType: "string"
        });

        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0].getProject()).toBe("asdf");
        expect(res[0].getContext()).toBe("bar");
        expect(res[0].getTargetLocale()).toBe("ja-JP");
        expect(res[0].getKey()).toBe("foobarfoo");
        expect(res[0].getSource()).toBe("test test blah");
        expect(ts.remove(new ContextResourceString({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            key: "foobarfoo"
        }))).toBeTruthy();
        res = ts.getBy({
            project: "asdf",
            context: "bar",
            targetLocale: "ja-JP",
            reskey: "foobarfoo",
            resType: "string"
        });

        expect(res).toBeTruthy();
        expect(res.length).toBe(0);
    });

    test("TranslationSetRemoveInsufficientFields", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // have to specify everything needed to identify a single resource
        expect(!ts.remove(ContextResourceString.hashKey(undefined, "bar", "ja-JP", "foobarfoo"))).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetRemoveBogusInput", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ContextResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // have to specify everything needed to identify a single resource
        expect(!ts.remove(undefined)).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetRemoveNoMatch", function() {
        expect.assertions(3);

        var ts = new TranslationSet();

        ts.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                targetLocale: "pt-BR"
            }),
            new ContextResourceString({
                source: "test test blah",
                key: "foobarfoo",
                project: "asdf",
                context: "bar",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "test test d blah",
                key: "foobarfoo",
                project: "asdf",
                targetLocale: "ja-JP"
            }),
            new ContextResourceString({
                source: "blah blah blah",
                key: "llashdfoi",
                project: "yowza",
                targetLocale: "en-US"
            }),
            new ResourceString({
                source: "blah blah blah en espanol",
                key: "ajajsdjdsj",
                project: "yowza",
                targetLocale: "es-ES"
            })
        ]);

        expect(ts.size()).toBe(10);

        // does not match anything
        expect(!ts.remove(ContextResourceString.hashKey("ai jai jai", "blech", "en-NZ", "juicy"))).toBeTruthy();

        expect(ts.size()).toBe(10);
    });

    test("TranslationSetDiffRightSize", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet();
        var ts2 = new TranslationSet();

        ts1.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        var diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();
        expect(diff.size()).toBe(2);
    });

    test("TranslationSetDiffRightContents", function() {
        expect.assertions(14);

        var ts1 = new TranslationSet();
        var ts2 = new TranslationSet();

        ts1.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        var diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        var resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        // guarantee the order of the array elements
        resources = resources.sort(function(left, right) {return left.getTarget() < right.getTarget() ? 1 : (left.getTarget() > right.getTarget() ? -1 : 0)})

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is another test");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("nl-NL");
        expect(resources[0].getTarget()).toBe("gossie");

        expect(resources[1].getKey()).toBe("qwerty");
        expect(resources[1].getSource()).toBe("This is another test");
        expect(resources[1].getTarget()).toBe("Dies ist nochmals einen Test");
        expect(resources[1].getProject()).toBe("foo");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
    });

    test("TranslationSetDiffNoOverlap", function() {
        expect.assertions(14);

        var ts1 = new TranslationSet();
        var ts2 = new TranslationSet();

        ts1.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "gossie",
                project: "foo",
                context: "bar",
                targetLocale: "nl-NL"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                targetLocale: "de-DE"
            })
        ]);

        var diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        var resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        // guarantee the order of the array elements
        resources = resources.sort(function(left, right) {return left.getTarget() < right.getTarget() ? 1 : (left.getTarget() > right.getTarget() ? -1 : 0)})

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is another test");
        expect(resources[0].getTarget()).toBe("gossie");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("nl-NL");

        expect(resources[1].getKey()).toBe("qwerty");
        expect(resources[1].getSource()).toBe("This is another test");
        expect(resources[1].getProject()).toBe("foo");
        expect(resources[1].getTarget()).toBe("Dies ist nochmals einen Test");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
    });

    test("TranslationSetDiffNoDiff", function() {
        expect.assertions(2);

        var ts1 = new TranslationSet();
        var ts2 = new TranslationSet();

        ts1.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        var diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        expect(diff.size()).toBe(0);
    });

    test("TranslationSetDiffChangedFields", function() {
        expect.assertions(8);

        var ts1 = new TranslationSet();
        var ts2 = new TranslationSet();

        ts1.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        ts2.addAll([
            new ContextResourceString({
                key: "asdf",
                source: "This is a test",
                target: "Dies ist einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "This is yet another test",
                target: "Dies ist noch einen Test.",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            }),
            new ContextResourceString({
                key: "qwerty",
                source: "ooo la la",
                target: "Ou, la, la.",
                project: "foo",
                context: "bar",
                targetLocale: "fr-FR"
            })
        ]);

        var diff = ts1.diff(ts2);

        expect(diff).toBeTruthy();

        var resources = diff.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);

        expect(resources[0].getKey()).toBe("qwerty");
        expect(resources[0].getSource()).toBe("This is yet another test");
        expect(resources[0].getProject()).toBe("foo");
        expect(resources[0].getContext()).toBe("bar");
        expect(resources[0].getTargetLocale()).toBe("de-DE");
    });

    test("TranslationSetAddToClean", function() {
        expect.assertions(6);
        var ts = new TranslationSet();
        expect(ts).toBeTruthy();

        orig = new ContextResourceString({
                key: "qwerty    ",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            });
        squished = new ContextResourceString({
                key: "qwerty",
                source: "This is another test",
                target: "Dies ist nochmals einen Test",
                project: "foo",
                context: "bar",
                targetLocale: "de-DE"
            });
        ts.add(orig);
        ts.add(squished);
        var allRes = ts.getAll();
        expect(allRes.length).toBe(2);
        expect(orig).toBe(ts.get(orig.hashKey()));
        expect(squished).toBe(ts.get(squished.hashKey()));
        expect(orig).toBe(ts.getClean(orig.cleanHashKey()));
        expect(squished).toBe(ts.getClean(squished.cleanHashKey()));
    });
});

describe("translation set conversion functions", function() {
    test("for each resource in a set, convert plural source to string ", function() {
        expect.assertions(8);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourcePlural({
                key: "a",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "There is {n} string.",
                    other: "There are {n} strings."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Es gibt {n} Zeichenfolge.",
                    other: "Es gibt {n} Zeichenfolgen.",
                }
            }),
            new ResourcePlural({
                key: "b",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "This is a singular string.",
                    other: "This is a plural string."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Dies ist eine einzelne Zeichenfolge.",
                    other: "Dies ist eine Pluralzeichenfolgen.",
                }
            }),
        ]);

        var other = set.convertToICU();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("{count, plural, one {There is {n} string.} other {There are {n} strings.}}");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("{count, plural, one {This is a singular string.} other {This is a plural string.}}");
    });

    test("for each resource in a set, convert plural source to string but do not touch non-plural resources", function() {
        expect.assertions(10);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourcePlural({
                key: "a",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "There is {n} string.",
                    other: "There are {n} strings."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Es gibt {n} Zeichenfolge.",
                    other: "Es gibt {n} Zeichenfolgen.",
                }
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "This is a singular string.",
                targetLocale: "de-DE",
                target: "Dies ist eine einzelne Zeichenfolge."
            }),
            new ResourceArray({
                key: "c",
                sourceLocale: "en-US",
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                targetLocale: "de-DE",
                targetArray: [
                    "eins",
                    "zwei",
                    "drei"
                ]
            })
        ]);

        var other = set.convertToICU();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("{count, plural, one {There is {n} string.} other {There are {n} strings.}}");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("This is a singular string.");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getSourceArray()).toStrictEqual([
            "one",
            "two",
            "three"
        ]);
    });

    test("for each resource in a set, convert plural target to string ", function() {
        expect.assertions(8);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourcePlural({
                key: "a",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "There is {n} string.",
                    other: "There are {n} strings."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Es gibt {n} Zeichenfolge.",
                    other: "Es gibt {n} Zeichenfolgen.",
                }
            }),
            new ResourcePlural({
                key: "b",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "This is a singular string.",
                    other: "This is a plural string."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Dies ist eine einzelne Zeichenfolge.",
                    other: "Dies ist eine Pluralzeichenfolgen.",
                }
            }),
        ]);

        var other = set.convertToICU();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getTarget()).toBe("{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getTarget()).toBe("{count, plural, one {Dies ist eine einzelne Zeichenfolge.} other {Dies ist eine Pluralzeichenfolgen.}}");
    });

    test("for each resource in a set, convert plural target to string but do not touch non-plural resources", function() {
        expect.assertions(10);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourcePlural({
                key: "a",
                sourceLocale: "en-US",
                sourceStrings: {
                    one: "There is {n} string.",
                    other: "There are {n} strings."
                },
                targetLocale: "de-DE",
                targetStrings: {
                    one: "Es gibt {n} Zeichenfolge.",
                    other: "Es gibt {n} Zeichenfolgen.",
                }
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "This is a singular string.",
                targetLocale: "de-DE",
                target: "Dies ist eine einzelne Zeichenfolge."
            }),
            new ResourceArray({
                key: "c",
                sourceLocale: "en-US",
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                targetLocale: "de-DE",
                targetArray: [
                    "eins",
                    "zwei",
                    "drei"
                ]
            })
        ]);

        var other = set.convertToICU();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getTarget()).toBe("{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getTarget()).toBe("Dies ist eine einzelne Zeichenfolge.");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getTargetArray()).toStrictEqual([
            "eins",
            "zwei",
            "drei"
        ]);
    });

    test("Do not crash when given an empty set to convert to ICU strings", function() {
        expect.assertions(4);

        var set = new TranslationSet("en-US");

        var other = set.convertToICU();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(0);
    });

    test("for each resource in a set, convert string source to plural ", function() {
        expect.assertions(8);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourceString({
                key: "a",
                sourceLocale: "en-US",
                source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}"
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "{count, plural, one {This is a singular string.} other {This is a plural string.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Dies ist eine einzelne Zeichenfolge.} other {Dies ist eine Pluralzeichenfolgen.}}"
            }),
        ]);

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getSourcePlurals()).toStrictEqual({
            one: "There is {n} string.",
            other: "There are {n} strings."
        });

        expect(resources[1].getType()).toBe("plural");
        expect(resources[1].getSourcePlurals()).toStrictEqual({
            one: "This is a singular string.",
            other: "This is a plural string."
        });
    });

    test("for each resource in a set, convert string source to plural but do not touch non-plural resources", function() {
        expect.assertions(10);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourceString({
                key: "a",
                sourceLocale: "en-US",
                source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}"
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "This is a singular string.",
                targetLocale: "de-DE",
                target: "Dies ist eine einzelne Zeichenfolge."
            }),
            new ResourceArray({
                key: "c",
                sourceLocale: "en-US",
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                targetLocale: "de-DE",
                targetArray: [
                    "eins",
                    "zwei",
                    "drei"
                ]
            })
        ]);

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getSourcePlurals()).toStrictEqual({
            one: "There is {n} string.",
            other: "There are {n} strings."
        });

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("This is a singular string.");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getSourceArray()).toStrictEqual([
            "one",
            "two",
            "three"
        ]);
    });

    test("for each resource in a set, convert string source to plural and check you can still get the resource by hashkey", function() {
        expect.assertions(7);

        var set = new TranslationSet("en-US");
        var input = [
            new ResourceString({
                key: "a",
                sourceLocale: "en-US",
                source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}"
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "This is a singular string.",
                targetLocale: "de-DE",
                target: "Dies ist eine einzelne Zeichenfolge."
            }),
            new ResourceArray({
                key: "c",
                sourceLocale: "en-US",
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                targetLocale: "de-DE",
                targetArray: [
                    "eins",
                    "zwei",
                    "drei"
                ]
            })
        ];

        set.addAll(input);

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(3);

        for (var i = 0; i < resources.length; i++) {
            var other = set.get(resources[i].hashKey());
            expect(other).toStrictEqual(resources[i]);
        }
    });

    test("for each resource in a set, convert string target to plural ", function() {
        expect.assertions(8);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourceString({
                key: "a",
                sourceLocale: "en-US",
                source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}"
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "{count, plural, one {This is a singular string.} other {This is a plural string.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Dies ist eine einzelne Zeichenfolge.} other {Dies ist eine Pluralzeichenfolgen.}}"
            }),
        ]);

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getTargetPlurals()).toStrictEqual({
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen."
        });

        expect(resources[1].getType()).toBe("plural");
        expect(resources[1].getTargetPlurals()).toStrictEqual({
            one: "Dies ist eine einzelne Zeichenfolge.",
            other: "Dies ist eine Pluralzeichenfolgen."
        });
    });

    test("for each resource in a set, convert string target to plural but do not touch non-plural resources", function() {
        expect.assertions(10);

        var set = new TranslationSet("en-US");
        set.addAll([
            new ResourceString({
                key: "a",
                sourceLocale: "en-US",
                source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
                targetLocale: "de-DE",
                target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}"
            }),
            new ResourceString({
                key: "b",
                sourceLocale: "en-US",
                source: "This is a singular string.",
                targetLocale: "de-DE",
                target: "Dies ist eine einzelne Zeichenfolge."
            }),
            new ResourceArray({
                key: "c",
                sourceLocale: "en-US",
                sourceArray: [
                    "one",
                    "two",
                    "three"
                ],
                targetLocale: "de-DE",
                targetArray: [
                    "eins",
                    "zwei",
                    "drei"
                ]
            })
        ]);

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getTargetPlurals()).toStrictEqual({
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen."
        });

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getTarget()).toBe("Dies ist eine einzelne Zeichenfolge.");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getTargetArray()).toStrictEqual([
            "eins",
            "zwei",
            "drei"
        ]);
    });

    test("Do not crash when given an empty set to convert to plural resources", function() {
        expect.assertions(4);

        var set = new TranslationSet("en-US");

        var other = set.convertToPluralRes();
        expect(other).toBe(set);

        var resources = set.getAll();
        expect(resources).toBeDefined();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(0);
    });
});