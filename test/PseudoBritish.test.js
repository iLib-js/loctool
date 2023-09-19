/*
 * PseudoBritish.test.js - test the US to British English spell-corrector
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
    locales: ["en-GB", "en-NZ", "es-US"]
});
describe("pseudobritish", function() {
    test("PseudoBritishSimpleWord", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("traveler")).toBe("traveller");
    });
    test("PseudoBritishComplex", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("I am a traveler of regions far and wide.")).toBe("I am a traveller of regions far and wide.");
    });
    test("PseudoBritishOddWordBoundaries", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("I am a traveler, for the most part, of regions far and wide.")).toBe("I am a traveller, for the most part, of regions far and wide.");
    });
    test("PseudoBritishPunctWordBoundaries", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("I am a traveler.")).toBe("I am a traveller.");
    });
    test("PseudoBritishSingleWord", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("globalization")).toBe("globalisation");
    });
    test("PseudoBritishInitialCapital", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("Globalization")).toBe("Globalisation");
    });
    test("PseudoBritishAllCapitals", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("GLOBALIZATION")).toBe("GLOBALISATION");
    });
    test("PseudoBritishNoSubWords", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("I'm not about to retire")).toBe("I'm not about to retire"); // no translation
    });
    test("PseudoBritishIncludeQuotes", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("The spirochete's proteins were difficult to decipher.")).toBe("The spirochaete's proteins were difficult to decipher.");
    });
    test("PseudoBritishSkipReplacementsJava", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "java"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe("Skip the unflavoured {estrogen} supplements.");
    });
    test("PseudoBritishSkipReplacementsJavascript", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "javascript"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe("Skip the unflavoured {estrogen} supplements.");
    });
    test("PseudoBritishSkipReplacementsHTML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "html"
        });
        expect(pb.getString("Skip the unflavored <span name=\"estrogen\">supplements</a>.")).toBe("Skip the unflavoured <span name=\"estrogen\">supplements</a>.");
    });
    test("PseudoBritishSkipReplacementsXML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "xml"
        });
        expect(pb.getString("Skip the unflavored <source id=\"estrogen\">supplements</source>.")).toBe("Skip the unflavoured <source id=\"estrogen\">supplements</source>.");
    });
    test("PseudoBritishSkipReplacementsMarkdown", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "markdown"
        });
        expect(pb.getString("Skip the unflavored <c0>supplements</c0>.")).toBe("Skip the unflavoured <c0>supplements</c0>.");
    });
    test("PseudoBritishSkipReplacementsTemplate", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "template"
        });
        expect(pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.")).toBe("Skip the unflavoured <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.");
    });
    test("PseudoBritishSkipReplacementsRuby", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "ruby"
        });
        expect(pb.getString("Skip the unflavored %{estrogen} #{estrogen} supplements.")).toBe("Skip the unflavoured %{estrogen} #{estrogen} supplements.");
    });
    test("PseudoBritishSkipReplacementsPlaintext", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe("Skip the unflavoured {oestrogen} supplements.");
    });
    test("PseudoBritishSkipReplacementsYaml", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "ruby"
        });
        expect(pb.getString("Skip the unflavored %ESTROGEN% supplements.")).toBe("Skip the unflavoured %ESTROGEN% supplements.");
    });
    test("PseudoBritishInheritedLocaleNZ", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-NZ",
            type: "text"
        });
        expect(pb.getString("colorful globalization traveler")).toBe("colourful globalisation traveller");
    });
    test("PseudoBritishInheritedLocaleAU", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-AU",
            type: "text"
        });
        expect(pb.getString("colorful globalization traveler")).toBe("colourful globalisation traveller");
    });
    test("PseudoBritishInheritedLocaleZA", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-ZA",
            type: "text"
        });
        expect(pb.getString("colorful globalization traveler")).toBe("colourful globalisation traveller");
    });
    test("PseudoBritishInheritedLocaleHK", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-HK",
            type: "text"
        });
        expect(pb.getString("colorful globalization traveler")).toBe("colourful globalisation traveller");
    });
    test("PseudoBritishNotInheritedLocalePH", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-PH", // Philippines uses US English
            type: "text"
        });
        expect(!pb).toBeTruthy();
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
            source: "localization chilis.",
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
            targetLocale: "en-GB",
            origin: "target"
        });
        translations.add(res);
        var pb = PseudoFactory({
            set: translations,
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pb.getStringForResource(english1)).toBe("override string");       // looked up
        expect(pb.getStringForResource(english2)).toBe("localisation chillis."); // auto-generated
    });
});
