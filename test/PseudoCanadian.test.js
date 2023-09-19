/*
 * PseudoCanadian.test.js - test the US to Canadian English spell-corrector
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
if (!PseudoFactory) {
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var WebProject = require("../lib/WebProject.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
}
var project = new WebProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
    locales: ["en-CA", "es-US"]
});
describe("pseudocanadian", function() {
    test("PseudoCanadianSimpleWord", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("traveler")).toBe("traveller");
    });
    test("PseudoCanadianComplex", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("I am a traveler of regions far and wide.")).toBe("I am a traveller of regions far and wide.");
    });
    test("PseudoCanadianOddWordBoundaries", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("I am a traveler, for the most part, of regions far and wide.")).toBe("I am a traveller, for the most part, of regions far and wide.");
    });
    test("PseudoCanadianPunctWordBoundaries", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("I am a traveler.")).toBe("I am a traveller.");
    });
    test("PseudoCanadianSingleWord", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("color")).toBe("colour");
    });
    test("PseudoCanadianInitialCapital", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("Color")).toBe("Colour");
    });
    test("PseudoCanadianAllCapitals", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("COLOR")).toBe("COLOUR");
    });
    test("PseudoCanadianSingleWordNotTranslated", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("globalization")).toBe("globalization");
    });
    test("PseudoCanadianInitialCapitalNotTranslated", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("Globalization")).toBe("Globalization");
    });
    test("PseudoCanadianAllCapitalsNotTranslated", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("GLOBALIZATION")).toBe("GLOBALIZATION");
    });
    test("PseudoCanadianNoSubWords", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("I'm not about to avuncolor")).toBe("I'm not about to avuncolor"); // no translation
    });
    test("PseudoCanadianIncludeQuotes", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("The spirochete's proteins were difficult to decipher.")).toBe("The spirochaete's proteins were difficult to decipher.");
    });
    test("PseudoCanadianSkipReplacementsJava", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "java"
        });
        expect(pb.getString("Skip the unflavored {colorful} supplements.")).toBe("Skip the unflavoured {colorful} supplements.");
    });
    test("PseudoCanadianSkipReplacementsJavascript", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "javascript"
        });
        expect(pb.getString("Skip the unflavored {colorful} supplements.")).toBe("Skip the unflavoured {colorful} supplements.");
    });
    test("PseudoCanadianSkipReplacementsHTML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "html"
        });
        expect(pb.getString("Skip the unflavored <span name=\"colorful\">supplements</a>.")).toBe("Skip the unflavoured <span name=\"colorful\">supplements</a>.");
    });
    test("PseudoCanadianSkipReplacementsXML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "xml"
        });
        expect(pb.getString("Skip the unflavored <source id=\"colorful\">supplements</source>.")).toBe("Skip the unflavoured <source id=\"colorful\">supplements</source>.");
    });
    test("PseudoCanadianSkipReplacementsTemplate", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "template"
        });
        expect(pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements.")).toBe("Skip the unflavoured <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements.");
    });
    test("PseudoCanadianSkipReplacementsRuby", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "ruby"
        });
        expect(pb.getString("Skip the unflavored %{colorful} #{colorful} supplements.")).toBe("Skip the unflavoured %{colorful} #{colorful} supplements.");
    });
    test("PseudoCanadianSkipReplacementsPlaintext", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getString("Skip the unflavored {colorful} supplements.")).toBe("Skip the unflavoured {colourful} supplements.");
    });
    test("PseudoBritishGetStringForResourceWithOverrideTranslation", function() {
        expect.assertions(2);
        var translations = new TranslationSet();
        var english1 = new ResourceString({
            key: "foo",
            autoKey: true,
            source: "I am enamored by color of your homogenized yogurt.",
            sourceLocale: "en-US",
            origin: "source"
        });
        translations.add(english1);
        var english2 = new ResourceString({
            key: "asdf",
            autoKey: true,
            source: "The color of your homogenized yogurt.",
            sourceLocale: "en-US",
            origin: "source"
        });
        translations.add(english1);
        res = new ResourceString({
            key: "foo",
            autoKey: true,
            source: "I am enamored by color of your homogenized yogurt.",
            sourceLocale: "en-US",
            target: "override string",
            targetLocale: "en-CA",
            origin: "target"
        });
        translations.add(res);
        var pb = PseudoFactory({
            set: translations,
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pb.getStringForResource(english1)).toBe("override string");       // looked up
        expect(pb.getStringForResource(english2)).toBe("The colour of your homogenized yogurt."); // auto-generated
    });
});
