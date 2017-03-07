/*
 * testPseudoCanadian.js - test the US to Canadian English spell-corrector
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

if (!PseudoFactory) {
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var WebProject = require("../lib/WebProject.js");
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

module.exports = {
    testPseudoCanadianSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("traveler"), "traveller");
        
        test.done();
    },

    testPseudoCanadianComplex: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");
        
        test.done();
    },
    
    testPseudoCanadianOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");
        
        test.done();
    },

    testPseudoCanadianPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler."), "I am a traveller.");
        
        test.done();
    },

    testPseudoCanadianSingleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("color"), "colour");
        
        test.done();
    },
    
    testPseudoCanadianInitialCapital: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("Color"), "Colour");
        
        test.done();
    },

    testPseudoCanadianAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("COLOR"), "COLOUR");
        
        test.done();
    },

    testPseudoCanadianSingleWordNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("globalization"), "globalization");
        
        test.done();
    },
    
    testPseudoCanadianInitialCapitalNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("Globalization"), "Globalization");
        
        test.done();
    },

    testPseudoCanadianAllCapitalsNotTranslated: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("GLOBALIZATION"), "GLOBALIZATION");
        
        test.done();
    },

    testPseudoCanadianNoSubWords: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("I'm not about to avuncolor"), "I'm not about to avuncolor"); // no translation
        
        test.done();
    },

    testPseudoCanadianIncludeQuotes: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");
        
        test.done();
    },
    
    testPseudoCanadianSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "java"
		});
        test.equal(pb.getStringJS("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colorful} supplements.");
        
        test.done();
    },
    
    testPseudoCanadianSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "javascript"
		});
        test.equal(pb.getStringJS("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colorful} supplements.");
        
        test.done();
    },
    
    testPseudoCanadianSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "html"
		});
        test.equal(pb.getStringJS("Skip the unflavored <span name=\"colorful\">supplements</a>."), "Skip the unflavoured <span name=\"colorful\">supplements</a>.");
        
        test.done();
    },

    testPseudoCanadianSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "xml"
		});
        test.equal(pb.getStringJS("Skip the unflavored <source id=\"colorful\">supplements</source>."), "Skip the unflavoured <source id=\"colorful\">supplements</source>.");
        
        test.done();
    },

    testPseudoCanadianSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "template"
		});
        test.equal(pb.getStringJS("Skip the unflavored <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"colorful\") : RB.getString(\"%\") %> supplements.");
        
        test.done();
    },
    
    testPseudoCanadianSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "ruby"
		});
        test.equal(pb.getStringJS("Skip the unflavored %{colorful} #{colorful} supplements."), "Skip the unflavoured %{colorful} #{colorful} supplements.");
        
        test.done();
    },

    testPseudoCanadianSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-CA",
			type: "text"
		});
        test.equal(pb.getStringJS("Skip the unflavored {colorful} supplements."), "Skip the unflavoured {colourful} supplements.");
        
        test.done();
    }
};