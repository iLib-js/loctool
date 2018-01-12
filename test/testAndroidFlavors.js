/*
 * testAndroidFlavors.js - test the Android flavors handler object.
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

if (!AndroidFlavors) {
    var AndroidFlavors = require("../lib/AndroidFlavors.js");
}

module.exports = {
    testAndroidFlavorsConstructor: function(test) {
        test.expect(1);

        var af = new AndroidFlavors();
        test.ok(af);

        test.done();
    },

    testAndroidFlavorsHasFlavorsFalse: function(test) {
        test.expect(2);

        var af = new AndroidFlavors();
        test.ok(af);

        test.ok(!af.hasFlavors());

        test.done();
    },

    testAndroidFlavorsHasFlavorsTrue: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.ok(af.hasFlavors());

        test.done();
    },

    testAndroidFlavorsGetFlavors: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.deepEqual(af.getAllFlavors(), ["a", "b", "c"]);

        test.done();
    },

    testAndroidFlavorsGetSourceDir: function(test) {
        test.expect(4);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.deepEqual(af.getSourceDirs("a"), ["flavors/a/src"]);
        test.deepEqual(af.getSourceDirs("b"), ["flavors/bproj/src"]);
        test.deepEqual(af.getSourceDirs("c"), ["flavors/xXx/src"]);

        test.done();
    },

    testAndroidFlavorsGetSourceDirMain: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.deepEqual(af.getSourceDirs("main"), ["android/java"]);

        test.done();
    },

    testAndroidFlavorsGetResourceDir: function(test) {
        test.expect(4);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.deepEqual(af.getResourceDirs("a"), ["flavors/a/res"]);
        test.deepEqual(af.getResourceDirs("b"), ["flavors/bproj/res"]);
        test.deepEqual(af.getResourceDirs("c"), ["flavors/xXx/res"]);

        test.done();
    },

    testAndroidFlavorsGetResourceDirMain: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.deepEqual(af.getResourceDirs("main"), ["android/res"]);

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathMain: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("a/b.java"), "main");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathA: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("flavors/a/src/com/mycompany/x.java"), "a");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathB: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("flavors/bproj/src/com/mycompany/x.java"), "b");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathC: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("flavors/xXx/src/com/mycompany/x.java"), "c");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathAlmostFlavorA: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("flavors/a/java/b.java"), "main");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathUndefined: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath(), "main");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathEmpty: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath(""), "main");

        test.done();
    },

    testAndroidFlavorsGetFlavorForPathWithRoot: function(test) {
        test.expect(2);

        var af = new AndroidFlavors("./build1.gradle", "./testfiles");
        test.ok(af);

        test.equal(af.getFlavorForPath("testfiles/flavors/a/src/myclass.java"), "a");

        test.done();
    }
};
