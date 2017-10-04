/*
 * testPseudoBritish.js - test the US to British English spell-corrector
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
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
	locales: ["en-GB", "en-NZ", "es-US"]
});

module.exports = {
    testPseudoBritishSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("traveler"), "traveller");
        
        test.done();
    },

    testPseudoBritishComplex: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");
        
        test.done();
    },
    
    testPseudoBritishOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");
        
        test.done();
    },

    testPseudoBritishPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("I am a traveler."), "I am a traveller.");
        
        test.done();
    },

    testPseudoBritishSingleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("globalization"), "globalisation");
        
        test.done();
    },
    
    testPseudoBritishInitialCapital: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("Globalization"), "Globalisation");
        
        test.done();
    },

    testPseudoBritishAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("GLOBALIZATION"), "GLOBALISATION");
        
        test.done();
    },

    testPseudoBritishNoSubWords: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("I'm not about to retire"), "I'm not about to retire"); // no translation
        
        test.done();
    },

    testPseudoBritishIncludeQuotes: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "java"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "javascript"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "html"
		});
        test.equal(pb.getString("Skip the unflavored <span name=\"estrogen\">supplements</a>."), "Skip the unflavoured <span name=\"estrogen\">supplements</a>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "xml"
		});
        test.equal(pb.getString("Skip the unflavored <source id=\"estrogen\">supplements</source>."), "Skip the unflavoured <source id=\"estrogen\">supplements</source>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "template"
		});
        test.equal(pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "ruby"
		});
        test.equal(pb.getString("Skip the unflavored %{estrogen} #{estrogen} supplements."), "Skip the unflavoured %{estrogen} #{estrogen} supplements.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {oestrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishInheritedLocaleNZ: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getString("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleAU: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-AU",
			type: "text"
		});
        test.equal(pb.getString("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleZA: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-ZA",
			type: "text"
		});
        test.equal(pb.getString("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleHK: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-HK",
			type: "text"
		});
        test.equal(pb.getString("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishNotInheritedLocalePH: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-PH", // Philippines uses US English
			type: "text"
		});
        
        test.ok(!pb);
        
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
			locale: "en-GB",
			type: "text"
		});
        
        test.equal(pb.getStringForResource(english1), "override string");       // looked up
        test.equal(pb.getStringForResource(english2), "localisation chillis."); // auto-generated
        
        test.done();
    }
};