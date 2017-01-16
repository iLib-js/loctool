/*
 * testPseudoBritish.js - test the US to British English spell-corrector
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

if (!PseudoBritish) {
    var PseudoBritish = require("../lib/PseudoBritish.js");
}

module.exports = {
    testPseudoBritishSimpleWord: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("traveler"), "traveller");
        
        test.done();
    },

    testPseudoBritishComplex: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");
        
        test.done();
    },
    
    testPseudoBritishOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");
        
        test.done();
    },

    testPseudoBritishPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("I am a traveler."), "I am a traveller.");
        
        test.done();
    },

    testPseudoBritishSingleWord: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("globalization"), "globalisation");
        
        test.done();
    },
    
    testPseudoBritishInitialCapital: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("Globalization"), "Globalisation");
        
        test.done();
    },

    testPseudoBritishAllCapitals: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("GLOBALIZATION"), "GLOBALISATION");
        
        test.done();
    },

    testPseudoBritishNoSubWords: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("I'm not about to retire"), "I'm not about to retire"); // no translation
        
        test.done();
    },

    testPseudoBritishIncludeQuotes: function(test) {
        test.expect(1);

        var pb = new PseudoBritish();
        test.equal(pb.getStringJS("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "java"
        });
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "javascript"
        });
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "html"
        });
        test.equal(pb.getStringJS("Skip the unflavored <span name=\"estrogen\">supplements</a>."), "Skip the unflavoured <span name=\"estrogen\">supplements</a>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "xml"
        });
        test.equal(pb.getStringJS("Skip the unflavored <source id=\"estrogen\">supplements</source>."), "Skip the unflavoured <source id=\"estrogen\">supplements</source>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "template"
        });
        test.equal(pb.getStringJS("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "ruby"
        });
        test.equal(pb.getStringJS("Skip the unflavored %{estrogen} #{estrogen} supplements."), "Skip the unflavoured %{estrogen} #{estrogen} supplements.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = new PseudoBritish({
        	type: "text"
        });
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {oestrogen} supplements.");
        
        test.done();
    }
};