/*
 * testSet.js - test the generic set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!Set) {
    var Set = require("../lib/Set.js");
}

module.exports = {
    testSetConstructor: function(test) {
        test.expect(1);

        var s = new Set();
        test.ok(s);
        
        test.done();
    },
    
    testSetConstructorIsEmpty: function(test) {
        test.expect(2);

        var s = new Set();
        test.ok(s);
        
        test.equal(s.size(), 0);
        
        test.done();
    },

    testSetConstructorWithInitialItems: function(test) {
        test.expect(2);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);
        
        test.equal(s.size(), 3);
        
        test.done();
    },

    testSetConstructorWithInitialItemsRightItems: function(test) {
        test.expect(4);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);
        
        test.ok(s.contains("a"));
        test.ok(s.contains("b"));
        test.ok(s.contains("c"));
        
        test.done();
    },
    
    testSetConstructorWithInitialItemsDigits: function(test) {
        test.expect(2);

        var s = new Set([1, 2, 3]);
        test.ok(s);
        
        test.equal(s.size(), 3);
        
        test.done();
    },

    testSetConstructorWithInitialItemsDigitsRightItems: function(test) {
        test.expect(5);

        var s = new Set([1, 2, 3]);
        test.ok(s);
        
        test.ok(s.contains(1));
        test.ok(s.contains(2));
        test.ok(s.contains(3));
        
        test.ok(!s.contains(4));

        test.done();
    },

    testSetConstructorWithInitialItemsEmpty: function(test) {
        test.expect(2);

        var s = new Set([]);
        test.ok(s);
        
        test.equal(s.size(), 0);
        
        test.done();
    },

    testSetConstructorWithInitialItemsRemoveDups: function(test) {
        test.expect(2);

        var s = new Set(["a", "b", "c", "a", "b", "c"]);
        test.ok(s);
        
        test.equal(s.size(), 3);
        
        test.done();
    },

    testSetAdd: function(test) {
        test.expect(2);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        
        test.ok(s.contains("a"));
        
        test.done();
    },

    testSetAddNotThere: function(test) {
        test.expect(3);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        
        test.ok(!s.contains("b"));
        test.ok(!s.contains("c"));
        
        test.done();
    },

    testSetAddRemoveDups: function(test) {
        test.expect(2);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        s.add("b");
        s.add("c");
        s.add("a");
        s.add("b");
        s.add("c");
        
        test.equal(s.size(), 3);
        
        test.done();
    },

    testSetAddUndefined: function(test) {
        test.expect(5);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        
        test.ok(s.contains("a"));
        
        test.equal(s.size(), 1);
        
        s.add(undefined);
        
        test.equal(s.size(), 1);

        test.ok(!s.contains(undefined));
        test.done();
    },

    testSetAddEmptyString: function(test) {
        test.expect(4);

        var s = new Set();
        test.ok(s);
        
        test.ok(!s.contains(""));
        
        s.add("");
        
        test.ok(s.contains(""));
        
        test.equal(s.size(), 1);
        
        test.done();
    },
    
    testSetRemove: function(test) {
        test.expect(3);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        s.add("b");
        s.add("c");
        
        test.ok(s.contains("a"));
        
        s.remove("a");
        
        test.ok(!s.contains("a"));
        
        test.done();
    },

    testSetRemoveRightSize: function(test) {
        test.expect(3);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        s.add("b");
        s.add("c");
        
        test.equal(s.size(), 3);
        
        s.remove("a");
        
        test.equal(s.size(), 2);
        
        test.done();
    },

    testSetRemoveNotThere: function(test) {
        test.expect(3);

        var s = new Set();
        test.ok(s);
        
        s.add("a");
        s.add("b");
        s.add("c");
        
        test.equal(s.size(), 3);
        
        s.remove("d");
        
        test.equal(s.size(), 3);
        
        test.done();
    },
    
    testSetAddAllRightSize: function(test) {
        test.expect(3);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        var s2 = new Set(["d", "e", "f"]);
        
        test.equal(s2.size(), 3);
        
        s2.addAll(s);
        
        test.equal(s2.size(), 6);

        test.done();
    },

    testSetAddAllRightItems: function(test) {
        test.expect(8);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        var s2 = new Set(["d", "e", "f"]);
        
        s2.addAll(s);
        
        test.ok(s2.contains("a"));
        test.ok(s2.contains("b"));
        test.ok(s2.contains("c"));
        test.ok(s2.contains("d"));
        test.ok(s2.contains("e"));
        test.ok(s2.contains("f"));
        
        test.ok(!s2.contains("x"));

        test.done();
    },

    testSetAddAllNoDups: function(test) {
        test.expect(7);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        var s2 = new Set(["a", "b", "f"]);
        
        s2.addAll(s);
        
        test.ok(s2.contains("a"));
        test.ok(s2.contains("b"));
        test.ok(s2.contains("c"));
        test.ok(!s2.contains("d"));
        test.ok(!s2.contains("e"));
        test.ok(s2.contains("f"));

        test.done();
    },
    
    testSetAsArray: function(test) {
        test.expect(3);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        var a = s.asArray();
        test.ok(a);
        test.equal(a.length, 3);
        
        test.done();
    },

    testSetAsArrayRightContents: function(test) {
        test.expect(5);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        var a = s.asArray();
        test.ok(a);
        
        test.equal(a[0], "a");
        test.equal(a[1], "b");
        test.equal(a[2], "c");
        
        test.done();
    },

    testSetAsArrayEmpty: function(test) {
        test.expect(3);

        var s = new Set();
        test.ok(s);

        var a = s.asArray();
        test.ok(a);
        test.equal(a.length, 0);
        
        test.done();
    },
    
    testSetAsArrayNoDups: function(test) {
        test.expect(3);

        var s = new Set(["a", "b", "c"]);
        test.ok(s);

        s.add("a");
        
        var a = s.asArray();
        test.ok(a);
        test.equal(a.length, 3);
        
        test.done();
    }
};