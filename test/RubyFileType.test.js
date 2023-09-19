/*
 * RubyFileType.test.js - test the HTML template file type handler object.
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
if (!RubyFileType) {
    var RubyFileType = require("../lib/RubyFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}
describe("rubyfiletype", function() {
    test("RubyFileTypeConstructor", function() {
        expect.assertions(1);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
    });
    test("RubyFileTypeHandlesJSTrue", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(rf.handles("foo.rb")).toBeTruthy();
    });
    test("RubyFileTypeHandlesHamlTrue", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(rf.handles("foo.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesJSFalseClose", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("foorb")).toBeTruthy();
    });
    test("RubyFileTypeHandlesHamlFalseClose", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("foohtml.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesFalse", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("foo.html")).toBeTruthy();
    });
    test("RubyFileTypeHandlesJSTrueWithDir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(rf.handles("a/b/c/foo.rb")).toBeTruthy();
    });
    test("RubyFileTypeHandlesHamlTrueWithDir", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(rf.handles("a/b/c/foo.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("a/b/c/foo.en-GB.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesAlreadyLocalizedES", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("a/b/c/foo.es-US.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("a/b/c/foo.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesAlreadyLocalizedCN2", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("RubyFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var p = new WebProject({
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var rf = new RubyFileType(p);
        expect(rf).toBeTruthy();
        expect(!rf.handles("app/views/who_we_are/press.en-ZA-ASDF.html.haml")).toBeTruthy();
    });
});
