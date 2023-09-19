/*
 * Set.test.js - test the generic set object.
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
if (!Set) {
    var Set = require("../lib/Set.js");
}
describe("set", function() {
    test("SetConstructor", function() {
        expect.assertions(1);
        var s = new Set();
        expect(s).toBeTruthy();
    });
    test("SetConstructorIsEmpty", function() {
        expect.assertions(2);
        var s = new Set();
        expect(s).toBeTruthy();
        expect(s.size()).toBe(0);
    });
    test("SetConstructorWithInitialItems", function() {
        expect.assertions(2);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        expect(s.size()).toBe(3);
    });
    test("SetConstructorWithInitialItemsRightItems", function() {
        expect.assertions(4);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        expect(s.contains("a")).toBeTruthy();
        expect(s.contains("b")).toBeTruthy();
        expect(s.contains("c")).toBeTruthy();
    });
    test("SetConstructorWithInitialItemsDigits", function() {
        expect.assertions(2);
        var s = new Set([1, 2, 3]);
        expect(s).toBeTruthy();
        expect(s.size()).toBe(3);
    });
    test("SetConstructorWithInitialItemsDigitsRightItems", function() {
        expect.assertions(5);
        var s = new Set([1, 2, 3]);
        expect(s).toBeTruthy();
        expect(s.contains(1)).toBeTruthy();
        expect(s.contains(2)).toBeTruthy();
        expect(s.contains(3)).toBeTruthy();
        expect(!s.contains(4)).toBeTruthy();
    });
    test("SetConstructorWithInitialItemsEmpty", function() {
        expect.assertions(2);
        var s = new Set([]);
        expect(s).toBeTruthy();
        expect(s.size()).toBe(0);
    });
    test("SetConstructorWithInitialItemsRemoveDups", function() {
        expect.assertions(2);
        var s = new Set(["a", "b", "c", "a", "b", "c"]);
        expect(s).toBeTruthy();
        expect(s.size()).toBe(3);
    });
    test("SetAdd", function() {
        expect.assertions(2);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        expect(s.contains("a")).toBeTruthy();
    });
    test("SetAddNotThere", function() {
        expect.assertions(3);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        expect(!s.contains("b")).toBeTruthy();
        expect(!s.contains("c")).toBeTruthy();
    });
    test("SetAddRemoveDups", function() {
        expect.assertions(2);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        s.add("b");
        s.add("c");
        s.add("a");
        s.add("b");
        s.add("c");
        expect(s.size()).toBe(3);
    });
    test("SetAddUndefined", function() {
        expect.assertions(5);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        expect(s.contains("a")).toBeTruthy();
        expect(s.size()).toBe(1);
        s.add(undefined);
        expect(s.size()).toBe(1);
        expect(!s.contains(undefined)).toBeTruthy();
    });
    test("SetAddEmptyString", function() {
        expect.assertions(4);
        var s = new Set();
        expect(s).toBeTruthy();
        expect(!s.contains("")).toBeTruthy();
        s.add("");
        expect(s.contains("")).toBeTruthy();
        expect(s.size()).toBe(1);
    });
    test("SetRemove", function() {
        expect.assertions(3);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        s.add("b");
        s.add("c");
        expect(s.contains("a")).toBeTruthy();
        s.remove("a");
        expect(!s.contains("a")).toBeTruthy();
    });
    test("SetRemoveRightSize", function() {
        expect.assertions(3);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        s.add("b");
        s.add("c");
        expect(s.size()).toBe(3);
        s.remove("a");
        expect(s.size()).toBe(2);
    });
    test("SetRemoveNotThere", function() {
        expect.assertions(3);
        var s = new Set();
        expect(s).toBeTruthy();
        s.add("a");
        s.add("b");
        s.add("c");
        expect(s.size()).toBe(3);
        s.remove("d");
        expect(s.size()).toBe(3);
    });
    test("SetAddAllRightSize", function() {
        expect.assertions(3);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        var s2 = new Set(["d", "e", "f"]);
        expect(s2.size()).toBe(3);
        s2.addAll(s);
        expect(s2.size()).toBe(6);
    });
    test("SetAddAllRightItems", function() {
        expect.assertions(8);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        var s2 = new Set(["d", "e", "f"]);
        s2.addAll(s);
        expect(s2.contains("a")).toBeTruthy();
        expect(s2.contains("b")).toBeTruthy();
        expect(s2.contains("c")).toBeTruthy();
        expect(s2.contains("d")).toBeTruthy();
        expect(s2.contains("e")).toBeTruthy();
        expect(s2.contains("f")).toBeTruthy();
        expect(!s2.contains("x")).toBeTruthy();
    });
    test("SetAddAllNoDups", function() {
        expect.assertions(7);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        var s2 = new Set(["a", "b", "f"]);
        s2.addAll(s);
        expect(s2.contains("a")).toBeTruthy();
        expect(s2.contains("b")).toBeTruthy();
        expect(s2.contains("c")).toBeTruthy();
        expect(!s2.contains("d")).toBeTruthy();
        expect(!s2.contains("e")).toBeTruthy();
        expect(s2.contains("f")).toBeTruthy();
    });
    test("SetAsArray", function() {
        expect.assertions(3);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        var a = s.asArray();
        expect(a).toBeTruthy();
        expect(a.length).toBe(3);
    });
    test("SetAsArrayRightContents", function() {
        expect.assertions(5);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        var a = s.asArray();
        expect(a).toBeTruthy();
        expect(a[0]).toBe("a");
        expect(a[1]).toBe("b");
        expect(a[2]).toBe("c");
    });
    test("SetAsArrayEmpty", function() {
        expect.assertions(3);
        var s = new Set();
        expect(s).toBeTruthy();
        var a = s.asArray();
        expect(a).toBeTruthy();
        expect(a.length).toBe(0);
    });
    test("SetAsArrayNoDups", function() {
        expect.assertions(3);
        var s = new Set(["a", "b", "c"]);
        expect(s).toBeTruthy();
        s.add("a");
        var a = s.asArray();
        expect(a).toBeTruthy();
        expect(a.length).toBe(3);
    });
});
