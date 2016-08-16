/*
 * testResourceString.js - test the Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourceString) {
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports = {
     testResourceStringConstructorEmpty: function(test) {
        test.expect(1);

        var rs = new ResourceString();
        test.ok(rs);
        test.done();
    },

    testResourceStringConstructor: function(test) {
        test.expect(1);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.done();
    },

    testResourceStringGetId: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getId(), "foo");
        
        test.done();
    },

    testResourceStringGetIdEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getId());
        
        test.done();
    },

    testResourceStringGetSource: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getSource(), "source string");
        
        test.done();
    },

    testResourceStringGetSourceEmpty: function(test) {
        test.expect(2);

        var rs = new ResourceString();
        test.ok(rs);
        test.ok(!rs.getSource());
        
        test.done();
    },

    testResourceStringGetSource: function(test) {
        test.expect(2);

        var rs = new ResourceString({
            id: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });
        test.ok(rs);
        test.equal(rs.getSource(), "source string");
        
        test.done();
    },


};
