/*
 * AndroidFlavors.test.js - test the Android flavors handler object.
 *
 * Copyright © 2017, 2023 HealthTap, Inc.
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
if (!AndroidFlavors) {
    var AndroidFlavors = require("../lib/AndroidFlavors.js");
}
describe("androidflavors", function() {
    test("AndroidFlavorsConstructor", function() {
        expect.assertions(1);
        var af = new AndroidFlavors();
        expect(af).toBeTruthy();
    });
    test("AndroidFlavorsHasFlavorsFalse", function() {
        expect.assertions(2);
        var af = new AndroidFlavors();
        expect(af).toBeTruthy();
        expect(!af.hasFlavors()).toBeTruthy();
    });
    test("AndroidFlavorsHasFlavorsTrue", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.hasFlavors()).toBeTruthy();
    });
    test("AndroidFlavorsGetFlavors", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getAllFlavors()).toStrictEqual(["a", "b", "c"]);
    });
    test("AndroidFlavorsGetSourceDir", function() {
        expect.assertions(4);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getSourceDirs("a")).toStrictEqual(["flavors/a/src"]);
        expect(af.getSourceDirs("b")).toStrictEqual(["flavors/bproj/src"]);
        expect(af.getSourceDirs("c")).toStrictEqual(["flavors/xXx/src"]);
    });
    test("AndroidFlavorsGetSourceDirMain", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getSourceDirs("main")).toStrictEqual(["android/java"]);
    });
    test("AndroidFlavorsGetResourceDir", function() {
        expect.assertions(4);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getResourceDirs("a")).toStrictEqual(["flavors/a/res"]);
        expect(af.getResourceDirs("b")).toStrictEqual(["flavors/bproj/res"]);
        expect(af.getResourceDirs("c")).toStrictEqual(["flavors/xXx/res"]);
    });
    test("AndroidFlavorsGetResourceDirMain", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getResourceDirs("main")).toStrictEqual(["android/res"]);
    });
    test("AndroidFlavorsGetFlavorForPathMain", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("a/b.java")).toBe("main");
    });
    test("AndroidFlavorsGetFlavorForPathA", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("flavors/a/src/com/mycompany/x.java")).toBe("a");
    });
    test("AndroidFlavorsGetFlavorForPathB", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("flavors/bproj/src/com/mycompany/x.java")).toBe("b");
    });
    test("AndroidFlavorsGetFlavorForPathC", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("flavors/xXx/src/com/mycompany/x.java")).toBe("c");
    });
    test("AndroidFlavorsGetFlavorForPathAlmostFlavorA", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("flavors/a/java/b.java")).toBe("main");
    });
    test("AndroidFlavorsGetFlavorForPathUndefined", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath()).toBe("main");
    });
    test("AndroidFlavorsGetFlavorForPathEmpty", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("")).toBe("main");
    });
    test("AndroidFlavorsGetFlavorForPathWithRoot", function() {
        expect.assertions(2);
        var af = new AndroidFlavors("./build1.gradle", "./test/testfiles");
        expect(af).toBeTruthy();
        expect(af.getFlavorForPath("test/testfiles/flavors/a/src/myclass.java")).toBe("a");
    });
});
