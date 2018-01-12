/*
 * testBuildGradle.js - test the build.gradle reader object
 *
 * Copyright © 2017, HealthTap, Inc.
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

module.exports = {
    testBuildGradleConstructor: function(test) {
        test.expect(1);

        var bg = new BuildGradle({
            path: "build1.gradle"
        });
        test.ok(bg);

        test.done();
    },

    testBuildGradleConstructorParams: function(test) {
        test.expect(1);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        test.done();
    },

    testBuildGradleGetFlavors: function(test) {
        test.expect(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        test.deepEqual(bg.getFlavors(), ["a", "b", "c"]);

        test.done();
    },

    testBuildGradleGetFlavorsInSubdir: function(test) {
        test.expect(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "gradle/build1.gradle"
        });

        test.ok(bg);

        test.deepEqual(bg.getFlavors(), ["a", "b", "c"]);

        test.done();
    },

    testBuildGradleGetFlavorsMissingSpace: function(test) {
        test.expect(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        test.ok(bg);

        test.deepEqual(bg.getFlavors(), ["a"]);

        test.done();
    },

    testBuildGradleGetFlavorsNoFlavors: function(test) {
        test.expect(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build3.gradle"
        });

        test.ok(bg);

        test.deepEqual(bg.getFlavors(), []);

        test.done();
    },

    testBuildGradleGetFlavorsMissingFile: function(test) {
        test.expect(2);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "nonexistent.gradle"
        });

        test.ok(bg);

        test.deepEqual(bg.getFlavors(), []);

        test.done();
    },

    testBuildGradleGetFlavorRes1: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorRes("a");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/a/res");

        test.done();
    },

    testBuildGradleGetFlavorRes2: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorRes("b");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/bproj/res");

        test.done();
    },

    testBuildGradleGetFlavorRes3: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorRes("c");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/xXx/res");

        test.done();
    },

    testBuildGradleGetFlavorResInSubdir: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "gradle/build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorRes("a");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "gradle/flavors/a/res");

        test.done();
    },

    testBuildGradleGetFlavorResNoExplicitSourceSets: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorRes("a");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "src/a/res");

        test.done();
    },

    testBuildGradleGetFlavorSrc1: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorSrc("a");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/a/src");

        test.done();
    },

    testBuildGradleGetFlavorSrc2: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorSrc("b");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/bproj/src");

        test.done();
    },

    testBuildGradleGetFlavorSrc3: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build1.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorSrc("c");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "flavors/xXx/src");

        test.done();
    },

    testBuildGradleGetFlavorSrcNoExplicitSourceSets: function(test) {
        test.expect(4);

        var bg = new BuildGradle({
            root: "./testfiles",
            path: "build2.gradle"
        });

        test.ok(bg);

        var res = bg.getFlavorSrc("a");
        test.ok(res);
        test.equal(res.length, 1);
        test.equal(res[0], "src/a/java");

        test.done();
    }
};
