/*
 * testResource.js - test the resource object.
 *
 * Copyright © 2019, Box, Inc.
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

module.exports.resource = {
    testResourceConstructorEmpty: function(test) {
        test.expect(1);

        var rs = new Resource();
        test.ok(rs);

        test.done();
    },

    testResourceConstructorNoProps: function(test) {
        test.expect(1);

        var rs = new Resource({});
        test.ok(rs);

        test.done();
    },

    testResourceConstructor: function(test) {
        test.expect(1);

        var rs = new Resource({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        test.ok(rs);

        test.done();
    },

    testResourceGetAllFields: function(test) {
        test.expect(16);

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
        test.ok(rs);

        test.equal(rs.getProject(), "x");
        test.equal(rs.getContext(), "y");
        test.equal(rs.getSourceLocale(), "en-US");
        test.equal(rs.getTargetLocale(), "ja-JP");
        test.equal(rs.getKey(), "z");
        test.equal(rs.getPath(), "a");
        test.ok(rs.getAutoKey());
        test.equal(rs.getState(), "new");
        test.equal(rs.getId(), 4);
        test.ok(rs.formatted);
        test.equal(rs.getComment(), "c");
        test.ok(rs.dnt);
        test.equal(rs.getDataType(), "d");
        test.ok(rs.localize);
        test.equal(rs.getFlavor(), "e");
        test.done();
    },

    testResourceIsInstanceSame: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.isInstance(dup));

        test.done();
    },

    testResourceIsInstanceDifferInTranslationAffectingProperty: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(!rs.isInstance(dup));

        test.done();
    },

    testResourceIsInstanceMissingProperty: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(!rs.isInstance(dup));

        test.done();
    },

    testResourceIsInstanceDifferInTranslationNotAffectingProperty: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.isInstance(dup));

        test.done();
    },

    testResourceIsInstanceEmpty: function(test) {
        test.expect(3);

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
        test.ok(rs);

        var dup = new Resource({});
        test.ok(dup);

        test.ok(!rs.isInstance(dup));

        test.done();
    },

    testResourceIsInstanceUndefined: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.isInstance(undefined));

        test.done();
    },

    testResourceIsInstanceNull: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.isInstance(null));

        test.done();
    },

    testResourceIsInstanceNotObject: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.isInstance("foo"));

        test.done();
    },

    testResourceAddInstance: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

        test.done();
    },

    testResourceAddInstanceNotInstance: function(test) {
        test.expect(3);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(!rs.addInstance(dup));

        test.done();
    },

    testResourceAddInstanceUndefined: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.addInstance(undefined));

        test.done();
    },

    testResourceAddInstanceNull: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.addInstance(null));

        test.done();
    },

    testResourceAddInstanceNotObject: function(test) {
        test.expect(2);

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
        test.ok(rs);

        test.ok(!rs.addInstance("asdf"));

        test.done();
    },

    testResourceGetInstancesRightNumber: function(test) {
        test.expect(5);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

        var instances = rs.getInstances();

        test.ok(instances);
        test.equal(instances.length, 1);

        test.done();
    },

    testResourceGetInstancesRightContent: function(test) {
        test.expect(5);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

        var instances = rs.getInstances();

        test.ok(instances);
        test.deepEqual(instances[0], dup);

        test.done();
    },

    testResourceGetInstancesNone: function(test) {
        test.expect(3);

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
        test.ok(rs);

        var instances = rs.getInstances();

        test.ok(instances);
        test.equal(instances.length, 0);

        test.done();
    },

    testResourceGetInstancesMultipleRightNumber: function(test) {
        test.expect(9);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

        var instances = rs.getInstances();

        test.ok(instances);
        test.equal(instances.length, 3);

        test.done();
    },

    testResourceGetInstancesMultipleRightContent: function(test) {
        test.expect(9);

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
        test.ok(rs);

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

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
        test.ok(dup);

        test.ok(rs.addInstance(dup));

        var instances = rs.getInstances();

        test.ok(instances);
        test.deepEqual(instances[2], dup);

        test.done();
    },

};
