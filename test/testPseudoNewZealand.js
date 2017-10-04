/*
 * testPseudoNewZealand.js - test the US to New Zealand English spell-corrector
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
	locales: ["en-NZ", "en-NZ", "es-US"]
});

module.exports = {
    testPseudoNewZealandSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("traveler"), "traveller");
        
        test.done();
    },

    testPseudoNewZealandComplex: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");
        
        test.done();
    },
    
    testPseudoNewZealandOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");
        
        test.done();
    },

    testPseudoNewZealandPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler."), "I am a traveller.");
        
        test.done();
    },

    testPseudoNewZealandSingleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("globalization"), "globalisation");
        
        test.done();
    },

    testPseudoNewZealandDifferenceFromGB: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        // in British English, it is "kilogramme"
        test.equal(pb.getString("kilogram"), "kilogram");
        
        test.done();
    },

    testPseudoNewZealandNoPeriod: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        
        // don't use period in New Zealand for some abbreviations
        test.equal(pb.getString("Dr. Robert"), "Dr Robert");
        
        test.done();
    },

    testPseudoNewZealandInitialCapital: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("Globalization"), "Globalisation");
        
        test.done();
    },

    testPseudoNewZealandAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("GLOBALIZATION"), "GLOBALISATION");
        
        test.done();
    },

    testPseudoNewZealandNoSubWords: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("I'm not about to retire"), "I'm not about to retire"); // no translation
        
        test.done();
    },

    testPseudoNewZealandIncludeQuotes: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");
        
        test.done();
    },
    
    testPseudoNewZealandSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "java"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoNewZealandSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "javascript"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoNewZealandSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "html"
		});
        test.equal(pb.getString("Skip the unflavored <span name=\"estrogen\">supplements</a>."), "Skip the unflavoured <span name=\"estrogen\">supplements</a>.");
        
        test.done();
    },

    testPseudoNewZealandSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "xml"
		});
        test.equal(pb.getString("Skip the unflavored <source id=\"estrogen\">supplements</source>."), "Skip the unflavoured <source id=\"estrogen\">supplements</source>.");
        
        test.done();
    },

    testPseudoNewZealandSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "template"
		});
        test.equal(pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.");
        
        test.done();
    },
    
    testPseudoNewZealandSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "ruby"
		});
        test.equal(pb.getString("Skip the unflavored %{estrogen} #{estrogen} supplements."), "Skip the unflavoured %{estrogen} #{estrogen} supplements.");
        
        test.done();
    },

    testPseudoNewZealandSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {oestrogen} supplements.");
        
        test.done();
    },
    
    testPseudoNewZealandGetStringForResourceWithOverrideTranslation: function(test) {
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
            targetLocale: "en-NZ",
            origin: "target"
        });

        translations.add(res);

        var pb = PseudoFactory({
        	set: translations,
        	project: project,
			locale: "en-NZ",
			type: "text"
		});
        
        test.equal(pb.getStringForResource(english1), "override string");       // looked up
        test.equal(pb.getStringForResource(english2), "localisation chillis."); // auto-generated
        
        test.done();
    }
};