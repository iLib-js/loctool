/*
 * BuildGradle.test.js - test the build.gradle reader object
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

if (!BuildGradle) {
    var BuildGradle = require("../lib/BuildGradle.js");
}

describe("buildgradle", function() {
    test("BuildGradleConstructor", function() {
        expect.assertions(1);

        var bg = new BuildGradle({
            path: "build1.gradle"
        });
        expect(bg).toBeTruthy();
    });

    test("BuildGradleConstructorParams", function() {
        expect.assertions(1);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();
    });

    test("BuildGradleGetFlavors", function() {
        expect.assertions(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        expect(bg.getFlavors(), ["a", "b").toStrictEqual("c"]);
    });

    test("BuildGradleGetFlavorsInSubdir", function() {
        expect.assertions(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "gradle/build1.gradle"
        });

        expect(bg).toBeTruthy();

        expect(bg.getFlavors(), ["a", "b").toStrictEqual("c"]);
    });

    test("BuildGradleGetFlavorsMissingSpace", function() {
        expect.assertions(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        expect(bg).toBeTruthy();

        expect(bg.getFlavors()).toStrictEqual(["a"]);
    });

    test("BuildGradleGetFlavorsNoFlavors", function() {
        expect.assertions(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build3.gradle"
        });

        expect(bg).toBeTruthy();

        expect(bg.getFlavors()).toStrictEqual([]);
    });

    test("BuildGradleGetFlavorsMissingFile", function() {
        expect.assertions(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "nonexistent.gradle"
        });

        expect(bg).toBeTruthy();

        expect(bg.getFlavors()).toStrictEqual([]);
    });

    test("BuildGradleGetFlavorRes1", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorRes("a");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/a/res");
    });

    test("BuildGradleGetFlavorRes2", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorRes("b");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/bproj/res");
    });

    test("BuildGradleGetFlavorRes3", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorRes("c");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/xXx/res");
    });

    test("BuildGradleGetFlavorResInSubdir", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "gradle/build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorRes("a");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("gradle/flavors/a/res");
    });

    test("BuildGradleGetFlavorResNoExplicitSourceSets", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorRes("a");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("src/a/res");
    });

    test("BuildGradleGetFlavorSrc1", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorSrc("a");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/a/src");
    });

    test("BuildGradleGetFlavorSrc2", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorSrc("b");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/bproj/src");
    });

    test("BuildGradleGetFlavorSrc3", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorSrc("c");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("flavors/xXx/src");
    });

    test("BuildGradleGetFlavorSrcNoExplicitSourceSets", function() {
        expect.assertions(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        expect(bg).toBeTruthy();

        var res = bg.getFlavorSrc("a");
        expect(res).toBeTruthy();
        expect(res.length).toBe(1);
        expect(res[0]).toBe("src/a/java");
    });
});
