/*
 * SwiftFileTypeType.test.js - test the Swift file type handler object.
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

if (!SwiftFileType) {
    var SwiftFileType = require("../lib/SwiftFileType.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

describe("swiftfiletype", function() {
    test("SwiftFileTypeConstructor", function() {
        expect.assertions(1);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);

        expect(stf).toBeTruthy();
    });

    test("SwiftFileTypeHandlesTrue", function() {
        expect.assertions(2);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("foo.swift")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesHeaderFileTrue", function() {
        expect.assertions(2);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("foo.h")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(!stf.handles("fooswift")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(!stf.handles("foo.html")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var p = new SwiftProject({
            sourceLocale: "en-US"
        }, "./test/testfiles");
        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("a/b/c/foo.swift")).toBeTruthy();
    });
});
