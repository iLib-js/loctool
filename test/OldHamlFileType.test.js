/*
 * OldHamlFileType.test.js - test the HTML template file type handler object.
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
if (!OldHamlFileType) {
    var OldHamlFileType = require("../lib/OldHamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}
describe("oldhamlfiletype", function() {
    test("OldHamlFileTypeConstructor", function() {
        expect.assertions(1);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesTrue", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.html.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.tml.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesFalse", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.html.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.en-GB.html.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesAlreadyLocalizedES", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.es-US.html.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("OldHamlFileTypeHandlesAlreadyLocalizedCN2", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var htf = new OldHamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml")).toBeTruthy();
    });
});
