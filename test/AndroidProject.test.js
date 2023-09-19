/*
 * AndroidProject.test.js - test the Android Project class.
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

if (!AndroidProject) {
    var AndroidProject = require("../lib/AndroidProject.js");
    var AndroidResourceFileType = require("../lib/AndroidResourceFileType.js");
}

describe("androidproject", function() {
    test("AndroidProjectConstructor", function() {
        expect.assertions(1);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();
    });

    test("AndroidProjectRightResourceType", function() {
        expect.assertions(2);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        expect(p).toBeTruthy();

        var rt = p.getResourceFileType();

        expect(rt instanceof AndroidResourceFileType).toBeTruthy();
    });

    test("AndroidProjectGotFlavors", function() {
        expect.assertions(2);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            "build.gradle": "./build1.gradle"
        });

        expect(p).toBeTruthy();

        expect(p.flavors).toBeTruthy();
    });

    test("AndroidProjectGotRightFlavors", function() {
        expect.assertions(8);

        var p = new AndroidProject({
            id: "android",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            "build.gradle": "./build1.gradle"
        });

        expect(p).toBeTruthy();
        expect(p.flavors).toBeTruthy();

        expect(p.flavors.getSourceDirs("a")).toStrictEqual(["flavors/a/src"]);
        expect(p.flavors.getResourceDirs("a")).toStrictEqual(["flavors/a/res"]);

        expect(p.flavors.getSourceDirs("b")).toStrictEqual(["flavors/bproj/src"]);
        expect(p.flavors.getResourceDirs("b")).toStrictEqual(["flavors/bproj/res"]);

        expect(p.flavors.getSourceDirs("c")).toStrictEqual(["flavors/xXx/src"]);
        expect(p.flavors.getResourceDirs("c")).toStrictEqual(["flavors/xXx/res"]);
    });
});
