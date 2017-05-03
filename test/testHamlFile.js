/*
 * testHamlFile.js - test the Java file handler object.
 *
 * Copyright © 2017, HealthTap, Inc. All Rights Reserved.
 */

if (!HamlFile) {
    var HamlFile = require("../lib/HamlFile.js");
    var HamlFileType = require("../lib/HamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

var p = new WebProject({
	id: "webapp",
	sourceLocale: "en-US"
}, "./testfiles");

var hft = new HamlFileType(p);

module.exports = {
    testHamlFileConstructor: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.ok(h);
        
        test.done();
    },
    
    testHamlFileConstructorParams: function(test) {
        test.expect(1);

        var h = new HamlFile({
			project: p,
			pathName: "./testfiles/ruby/t2.html.haml",
			type: hft
		});
        
        test.ok(h);
        
        test.done();
    },

    testHamlFileConstructorNoFile: function(test) {
        test.expect(1);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        test.done();
    },

    testHamlFileMakeKey: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        test.equal(h.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testHamlFileMakeKeySimpleTexts1: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("Medications in your profile"), "r32020327");
		test.equals(h.makeKey("All medications"), "r835310324");
		test.equals(h.makeKey("Conditions"), "r103883086");
		test.equals(h.makeKey("Symptoms"), "r481086103");
		test.equals(h.makeKey("Experts"), "r343852585");
        
        test.done();
	},

    testHamlFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(h.makeKey("\\n \\t bar"), "r755240053");
		test.equals(h.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
		test.equals(h.makeKey("\\'Dude\\'"), "r6259609");
		
        test.done();
	},

	testHamlFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("Procedures"), "r807691021");
		test.equals(h.makeKey("Health Apps"), "r941505899");
		test.equals(h.makeKey("Conditions in your profile"), "r240633868");
		test.equals(h.makeKey("Treatment Reviews"), "r795086964");
		test.equals(h.makeKey("Answers"), "r221604632");
        
        test.done();
	},

	testHamlFileMakeKeySimpleTexts3: function(test) {
        test.expect(11);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("Private Health Profile"), "r669315500");
		test.equals(h.makeKey("People you care for"), "r710774033");
		test.equals(h.makeKey("Notifications"), "r284964820");
		test.equals(h.makeKey("News"), "r613036745");
		test.equals(h.makeKey("More Tips"), "r216617786");
		test.equals(h.makeKey("Goals"), "r788359072");
		test.equals(h.makeKey("Referral Link"), "r140625167");
		test.equals(h.makeKey("Questions"), "r256277957");
		test.equals(h.makeKey("Private consults"), "r18128760");
		test.equals(h.makeKey("Suggested doctors for you"), "r584966709");
        
        test.done();
	},

	testHamlFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("Can\'t find treatment id"), "r926831062");
		test.equals(h.makeKey("Can\'t find an application for SMS"), "r909283218");
        
        test.done();
	},
	
	testHamlFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equals(h.makeKey("{topic_name}({topic_generic_name})"), "r382554039");
		test.equals(h.makeKey("{doctor_name}, {sharer_name} {start}found this helpful{end}"), "r436261634");
		test.equals(h.makeKey("{sharer_name} {start}found this helpful{end}"), "r858107784");
		test.equals(h.makeKey("Grow your Care-Team"), "r522565682");
		test.equals(h.makeKey("Failed to send connection request!"), "r1015770123");
		test.equals(h.makeKey("{goal_name} Goals"), "r993422001");
		test.equals(h.makeKey("Referral link copied!"), "r201354363");
        
        test.done();
	},

    testHamlFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        test.equal(h.makeKey("This is a test"), "r654479252");
        test.equal(h.makeKey("This is a test"), "r654479252");
        
        test.done();
    },
    
    testHamlFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        test.equal(h.makeKey("Can\'t find treatment id"), "r926831062");
		test.equal(h.makeKey("Can\'t    find    treatment           id"), "r926831062");
		
		test.equal(h.makeKey("Can\'t find an application for SMS"), "r909283218");
		test.equal(h.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");
        
        test.done();
	},
	
    testHamlFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        test.equal(h.makeKey("Can\'t find treatment id"), "r926831062");
        test.equal(h.makeKey("      Can\'t find treatment id "), "r926831062");
		
        test.equal(h.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(h.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

		test.done();
	},
	
	testHamlFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \n B"), "r191336864");
        
        test.done();
	},

	testHamlFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(hf.makeKey("A \\n B"), "r191336864");
        
        test.done();
	},

	testHamlFileMakeKeyTabs: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("A \t B"), "r191336864");
        
        test.done();
	},

	testHamlFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("A \\t B"), "r191336864");
        
        test.done();
	},

	testHamlFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("A \\'B\\' C"), "r935639115");
        
        test.done();
	},

	testHamlFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("\\u00A0 \\u0023"), "r2293235");
        
        test.done();
	},

	testHamlFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("Talk to a doctor live 24/7 via video or \u00a0 text\u00a0chat"), "r705871347");
        
        test.done();
	},

	testHamlFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var hf = new HamlFile({
			project: p
		});
        test.ok(hf);

        test.equals(hf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(hf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(hf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(hf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(hf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(hf.makeKey('This is a single quoted string'), "r683276274");
        test.equals(hf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(hf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(hf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(hf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(hf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(hf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");
        
        test.done();
	},

    testHamlFileFindMatchingOneLine: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar { {} {{{}}}}  "];
        h.currentLine = 0;
        
        test.equal(h.findMatching(11), 23);
        test.equal(h.currentLine, 0);
        
		test.done();
	},
	
    testHamlFileFindMatchingMixedBrackets: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar { [] <()>]]}  "];
        h.currentLine = 0;
        
        test.equal(h.findMatching(11), 23);
        test.equal(h.currentLine, 0);

		test.done();
	},

    testHamlFileFindMatchingParens: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = 'bar')  "];
        h.currentLine = 0;
        
        test.equal(h.findMatching(11), 23);
        test.equal(h.currentLine, 0);
        
		test.done();
	},

    testHamlFileFindMatchingParensMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar(foo = ('bar'))  "];
        h.currentLine = 0;

        test.equal(h.findMatching(11), 25);
        test.equal(h.currentLine, 0);

		test.done();
	},

    testHamlFileFindMatchingSquareBrackets: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = 'bar']  "];
        h.currentLine = 0;

        test.equal(h.findMatching(11), 23);
        test.equal(h.currentLine, 0);

		test.done();
	},

    testHamlFileFindMatchingSquareBracketsMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = ["   %foo.bar[foo = ['bar']]  "];
        h.currentLine = 0;

        test.equal(h.findMatching(11), 25);
        test.equal(h.currentLine, 0);

		test.done();
	},

	testHamlFileFindMatchingMultipleLines: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
        	"   %foo.bar { {asdf{",
        	"     asdf} asdf} asdf}"
        ];
        h.currentLine = 0;

        test.equal(h.findMatching(11), 21);
        test.equal(h.currentLine, 1);

		test.done();
	},

    testHamlFileFindMatchingMultipleLinesTrailingTextIsIgnored: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
        	"   %foo.bar { {asdf{",
        	"     asdf} asdf} asdf} trailing text"
        ];
        h.currentLine = 0;

        test.equal(h.findMatching(11), 21);
        test.equal(h.currentLine, 1);

		test.done();
	},

    testHamlFileFindMatchingMultipleLinesWithStartIndex0: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
        	"   %foo.bar { {asdf{",
        	"     asdf} asdf} asdf} trailing text",
        	"   .class.otherclass {asdf}"
        ];
        h.currentLine = 0;

        test.equal(h.findMatching(0), 21);
        test.equal(h.currentLine, 1);

		test.done();
	},

    testHamlFileFindMatchingMultipleLinesWithStartIndex57: function(test) {
        test.expect(2);

        var h = new HamlFile();
        h.lines = [
        	"   %foo.bar { {asdf{",
        	"     asdf} asdf} asdf} trailing text",
        	"   .class.otherclass {asdf}"
        ];
        h.currentLine = 2;

        test.equal(h.findMatching(4), 26);
        test.equal(h.currentLine, 2);

		test.done();
	},

    testHamlFileIndentationTabs: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.equal(h.indentation(
        	"\t\t%foo.bar { {asdf{\n", 0), 2);

		test.done();
	},

    testHamlFileIndentationSkipReturn: function(test) {
        test.expect(1);

        var h = new HamlFile();
        test.equal(h.indentation(
        	"   %foo.bar { {asdf{\n" +
        	"     asdf} asdf} asdf} trailing text\n" +
        	"   .class.otherclass {asdf} \n", 57), 3);

		test.done();
	},

    testHamlFileFindMatchingIndentSame: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"   a",
        	"     b",
        	"     c",
        	"   d",
        	"   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 2);

		test.done();
	},

    testHamlFileFindMatchingIndentLess: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"   a",
        	"     b",
        	"     c",
        	" d",
        	"   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 2);

		test.done();
	},

    testHamlFileFindMatchingIndentMore: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"   a",
        	"     b",
        	"     c",
        	"       d",
        	"   e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 3);

		test.done();
	},

    testHamlFileFindMatchingIndentNoneToEnd: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"   a",
        	"     b",
        	"     c",
        	"       d"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 3);

		test.done();
	},

    testHamlFileFindMatchingIndentNone: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"   a",
        	"   b",
        	"   c",
        	"       d"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 0);

		test.done();
	},

	testHamlFileParseTextSimple: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextMultiLine: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  This is more text at the same indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at the same indentation level.");
        test.equal(r.getKey(), "r130670021");
        
        test.done();
    },

    testHamlFileParseTextMultiLineDifferentLevelOutdent: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test\n' +
        		'This is more text at a different indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is more text at a different indentation level.");
        test.equal(r.getKey(), "r464867050");
        
        test.done();
    },

    testHamlFileParseTextMultiLineDifferentLevelIndent: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'    This is more text at a different indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at a different indentation level.");
        test.equal(r.getKey(), "r783876767");

        test.done();
    },

    testHamlFileParseTextEmbeddedHTML: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is <span class="foo">a test</a> for the ages.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'This is <span class="foo">a test</a> for the ages.');
        test.equal(r.getKey(), "r533194803");

        test.done();
    },

    testHamlFileParseTextEmbeddedRuby: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  There are #{enterprise.count(:doctor).uniq} doctors.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'There are #{enterprise.count(:doctor).uniq} doctors.');
        test.equal(r.getKey(), "r808325557");

        test.done();
    },

    testHamlFileParseTextWithCSSClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  .fg-bold.fg-test This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTags: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsMultiline: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test.\n' +
        		'  This is more text at the same indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at the same indentation level.");
        test.equal(r.getKey(), "r130670021");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithAttributes: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %a{:href=>"/pages/contact_us"} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithNestedAttributes: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('    %a.apply_btn.green.btn{:href=>"#{job[\'url\']}", :target=>\'_blank\'} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLTagsWithAttributesAndClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %a.data.icon{:href=>"/pages/contact_us"} This is a test\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },
    
    testHamlFileParseTextWithHTMLTagsMultiline: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test.\n' +
        		'  This is more text at the same indentation level.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test. This is more text at the same indentation level.");
        test.equal(r.getKey(), "r130670021");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLNonBreakingTags: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test of\n' +
        		'  %b bold text\n' + 
        		'  embedded in the sentence.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test of <b>bold text</b> embedded in the sentence.");
        test.equal(r.getKey(), "r425499692");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLNonBreakingTagsWithAttributesAndClasses: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test of the \n' +
        		'  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
        		'  tags.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'This is a test of the <a class="data icon" href="/pages/contact_us"> non-breaking </a> tags.');
        test.equal(r.getKey(), "r536603365");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLBreakingTags: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  %div A different string.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = set.get("r216287039");
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");
        
        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStrings: function(test) {
        test.expect(12);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  %p\n' +
        		'    A different string.\n' + 
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsSameLineContinued: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  %p A different string.\n' + 
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string. Not indented.");
        test.equal(r.getKey(), "r688946974");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsContinuedMultiple: function(test) {
        test.expect(12);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  %p\n' +
        		'    A different string.\n' + 
        		'    Another string.\n' +
        		'    Yet another string.\n' +
        		'  Not indented.');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string. Another string. Yet another string.");
        test.equal(r.getKey(), "r983432399");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHTMLIndentedStringsSameLineNotContinued: function(test) {
        test.expect(12);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  %p A different string.\n' + 
        		'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "A different string.");
        test.equal(r.getKey(), "r216287039");

        r = resources[2];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseSkipScriptBlocks: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  :ruby\n' + 
        		'     Rb.t("Not indented.);\n' +
        		'     = asdf asdfasdf\n' + 
        		'     Skip this string.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test.");
        test.equal(r.getKey(), "r112256965");
        
        r = resources[1];
        test.ok(r);
                
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    /*	
    testHamlFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test")');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("")');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseIgnoreLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("  \t \n  This is a test\n\n\t   ");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testHamlFileParseDoubleEscapedWhitespace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('ssb.append(RB.getString("\\\\nTry a Virtual Consult ›"));');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("Try a Virtual Consult ›");
        test.ok(r);
        test.equal(r.getSource(), "Try a Virtual Consult ›");
        test.equal(r.getKey(), "r682432029");
        
        test.done();
    },

    testHamlFileParseIgnoreEscapedLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("  \\t \\n  This is a test\\n\\n\\t   ");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },


    testHamlFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        var set = h.getTranslationSet();
        test.equal(set.size(), 0);

        h.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHamlFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testHamlFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "foobar", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "foobar");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testHamlFileParseWithEmbeddedDoubleQuotes: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('\tRB.getString("This is a \\\"test\\\".");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a \"test\".");
        test.ok(r);
        test.equal(r.getSource(), "This is a \"test\".");
        test.equal(r.getKey(), "r446151779");
        
        test.done();
    },

    testHamlFileParseWithEmbeddedEscapedSingleQuotes: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('\tRB.getString("This is a \\\'test\\\'.");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a 'test'.");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'.");
        test.equal(r.getKey(), "r531222461");
        
        test.done();
    },

    testHamlFileParseWithEmbeddedUnescapedSingleQuotes: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('\tRB.getString("This is a \'test\'.");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a 'test'.");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'.");
        test.equal(r.getKey(), "r531222461");
        
        test.done();
    },

    testHamlFileParseWithKey: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test", "unique_id")');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testHamlFileParseWithKeyIgnoreWhitespace: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("   \t\n This is a test       ", "unique_id")');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testHamlFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test", "unique_id")');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testHamlFileParseMultiple: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        
        test.done();
    },

    testHamlFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "x", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "x");
        
        r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "y", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "y");
        
        test.done();
    },

    testHamlFileParseMultipleOnSameLine: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test");  a.parse("This is another test."); RB.getString("This is another test");\n');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(r.getAutoKey());
        
        r = set.getBySource("This is another test");
        test.ok(r);
        test.equal(r.getSource(), "This is another test");
        test.ok(r.getAutoKey());
        
        test.done();
    },

    testHamlFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "foo");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testHamlFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "asdf", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "asdf");
        test.equal(r.getComment(), "foo");
        
        r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "kdkdkd", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "kdkdkd");
        test.equal(r.getComment(), "bar");
        
        test.done();
    },

    testHamlFileParseWithDups: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHamlFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = h.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testHamlFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = h.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString("This is a test" + foobar);');
        
        var set = h.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString(foobar);');
        
        var set = h.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseEmptyParams: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('RB.getString();');
        
        var set = h.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseWholeWord: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('EPIRB.getString("This is a test");');
        
        var set = h.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHamlFileParseSubobject: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('App.RB.getString("This is a test");');
        
        var set = h.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHamlFileExtractFile: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			pathName: "./java/t1.java",
			type: hft
		});
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "id1", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");
        
        test.done();
    },
    
    testHamlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHamlFileExtractBogusFile: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			pathName: "./java/foo.java",
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
*/
};