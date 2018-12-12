/*
 * testPseudoCanadian.js - test the US to Canadian English spell-corrector
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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
    pseudoLocale: "ps-DO",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-CA", "es-US"]
});

module.exports.pseudocanadian = {
    testPseudoCanadianSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("traveler"), "traveller");

        test.done();
    },

    testPseudoCanadianComplex: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");

        test.done();
    },

    testPseudoCanadianOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");

        test.done();
    },

    testPseudoCanadianPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("I am a traveler."), "I am a traveller.");

        test.done();
    },

    testPseudoCanadianSingleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("color"), "colour");

        test.done();
    },

    testPseudoCanadianInitialCapital: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("Color"), "Colour");

        test.done();
    },

    testPseudoCanadianAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("COLOR"), "COLOUR");

        test.done();
    },

    testPseudoCanadianSingleWordNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("globalization"), "globalization");

        test.done();
    },

    testPseudoCanadianInitialCapitalNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("Globalization"), "Globalization");

        test.done();
    },

    testPseudoCanadianAllCapitalsNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("GLOBALIZATION"), "GLOBALIZATION");

        test.done();
    },

    testPseudoCanadianNoSubWords: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("I'm not about to avuncolor"), "I'm not about to avuncolor"); // no translation

        test.done();
    },

    testPseudoCanadianIncludeQuotes: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "java"
        });
        test.equal(pb.getString("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colorful} supplements.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "javascript"
        });
        test.equal(pb.getString("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colorful} supplements.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "html"
        });
        test.equal(pb.getString("Skip the unflavored <span name=\"colorful\">supplements</a>."), "Skip the unflavoured <span name=\"colorful\">supplements</a>.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "xml"
        });
        test.equal(pb.getString("Skip the unflavored <source id=\"colorful\">supplements</source>."), "Skip the unflavoured <source id=\"colorful\">supplements</source>.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "template"
        });
        test.equal(pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "ruby"
        });
        test.equal(pb.getString("Skip the unflavored %{colorful} #{colorful} supplements."), "Skip the unflavoured %{colorful} #{colorful} supplements.");

        test.done();
    },

    testPseudoCanadianSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.equal(pb.getString("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colourful} supplements.");

        test.done();
    },

    testPseudoBritishGetStringForResourceWithOverrideTranslation: function(test) {
        test.expect(2);

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

        test.equal(pb.getStringForResource(english1), "override string");       // looked up
        test.equal(pb.getStringForResource(english2), "The colour of your homogenized yogurt."); // auto-generated

        test.done();
    }
};
