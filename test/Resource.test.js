/*
 * Resource.test.js - test the resource object.
 *
 * Copyright © 2019, 2023 Box, Inc.
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
if (!Resource) {
    var Resource = require("../lib/Resource.js");
}
describe("resource", function() {
    test("ResourceConstructorEmpty", function() {
        expect.assertions(1);
        var rs = new Resource();
        expect(rs).toBeTruthy();
    });
    test("ResourceConstructorNoProps", function() {
        expect.assertions(1);
        var rs = new Resource({});
        expect(rs).toBeTruthy();
    });
    test("ResourceConstructor", function() {
        expect.assertions(1);
        var rs = new Resource({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();
    });
    test("ResourceGetAllFields", function() {
        expect.assertions(16);
        var rs = new Resource({
            project: "x",
            context: "y",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            reskey: "z",
            pathName: "a",
            autoKey: true,
            state: "new",
            id: 4,
            formatted: true,
            comment: "c",
            dnt: true,
            datatype: "d",
            localize: true,
            flavor: "e"
        });
        expect(rs).toBeTruthy();
        expect(rs.getProject()).toBe("x");
        expect(rs.getContext()).toBe("y");
        expect(rs.getSourceLocale()).toBe("en-US");
        expect(rs.getTargetLocale()).toBe("ja-JP");
        expect(rs.getKey()).toBe("z");
        expect(rs.getPath()).toBe("a");
        expect(rs.getAutoKey()).toBeTruthy();
        expect(rs.getState()).toBe("new");
        expect(rs.getId()).toBe(4);
        expect(rs.formatted).toBeTruthy();
        expect(rs.getComment()).toBe("c");
        expect(rs.dnt).toBeTruthy();
        expect(rs.getDataType()).toBe("d");
        expect(rs.localize).toBeTruthy();
        expect(rs.getFlavor()).toBe("e");
    });
    test("ResourceIsInstanceSame", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP"
        });
        expect(dup).toBeTruthy();
        expect(rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceIsInstanceDifferInTranslationAffectingProperty", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "de-DE"
        });
        expect(dup).toBeTruthy();
        expect(!rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceIsInstanceMissingProperty", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US"
        });
        expect(dup).toBeTruthy();
        expect(!rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceIsInstanceDifferInTranslationNotAffectingProperty", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "e/f/g.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceIsInstanceEmpty", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({});
        expect(dup).toBeTruthy();
        expect(!rs.isInstance(dup)).toBeTruthy();
    });
    test("ResourceIsInstanceUndefined", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.isInstance(undefined)).toBeTruthy();
    });
    test("ResourceIsInstanceNull", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.isInstance(null)).toBeTruthy();
    });
    test("ResourceIsInstanceNotObject", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.isInstance("foo")).toBeTruthy();
    });
    test("ResourceAddInstance", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
    });
    test("ResourceAddInstanceNotInstance", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(!rs.addInstance(dup)).toBeTruthy();
    });
    test("ResourceAddInstanceSelf", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        // can't add yourself as an instance of yourself
        expect(!rs.addInstance(rs)).toBeTruthy();
    });
    test("ResourceAddInstanceUndefined", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.addInstance(undefined)).toBeTruthy();
    });
    test("ResourceAddInstanceNull", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.addInstance(null)).toBeTruthy();
    });
    test("ResourceAddInstanceNotObject", function() {
        expect.assertions(2);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        expect(!rs.addInstance("asdf")).toBeTruthy();
    });
    test("ResourceGetInstancesRightNumber", function() {
        expect.assertions(5);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        var instances = rs.getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
    });
    test("ResourceGetInstancesRightContent", function() {
        expect.assertions(5);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        var instances = rs.getInstances();
        expect(instances).toBeTruthy();
        expect(instances[0]).toStrictEqual(dup);
    });
    test("ResourceGetInstancesNone", function() {
        expect.assertions(3);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var instances = rs.getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(0);
    });
    test("ResourceGetInstancesMultipleRightNumber", function() {
        expect.assertions(9);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "g/h/i.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "j/k/l.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        var instances = rs.getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(3);
    });
    test("ResourceGetInstancesMultipleRightContent", function() {
        expect.assertions(9);
        var rs = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();
        var dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "g/h/i.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        dup = new Resource({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "j/k/l.md"
        });
        expect(dup).toBeTruthy();
        expect(rs.addInstance(dup)).toBeTruthy();
        var instances = rs.getInstances();
        expect(instances).toBeTruthy();
        expect(instances[2]).toStrictEqual(dup);
    });
});
