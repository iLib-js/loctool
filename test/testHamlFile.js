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
    var TranslationSet =  require("../lib/TranslationSet.js");
    var ResourceString =  require("../lib/ResourceString.js");
    
    var fs = require("fs");
}

function diff(a, b) {
	var min = Math.min(a.length, b.length);
	
	for (var i = 0; i < min; i++) {
		if (a[i] !== b[i]) {
			console.log("Found difference at character " + i);
			console.log("a: " + a.substring(i));
			console.log("b: " + b.substring(i));
			break;
		}
	}
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

    testHamlFileFindMatchingIndentSkipBlankLines: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	":a",
        	"  b",
        	"",
        	"  c",
        	"        ",
        	"    d",
        	"e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 5);

		test.done();
	},

    testHamlFileFindMatchingIndentIncludeBlankLinesAtTheEnd: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	":a",
        	"  b",
        	"",
        	"  c",
        	"        ",
        	"d",
        	"e"
        ];
        h.currentLine = 0;
        
        test.equal(h.findMatchingIndent(), 4);

		test.done();
	},

    testHamlFileFirstLocalizable: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 5);

		test.done();
	},

    testHamlFileFirstLocalizableNoIndent: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"%p This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(0), 3);

		test.done();
	},

    testHamlFileFirstLocalizableSkipSpaces: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 7);

		test.done();
	},
	
    testHamlFileFirstLocalizableSkipAttr: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p{:a => 'b'} This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 16);

		test.done();
	},

    testHamlFileFirstLocalizableSkipAttrAndWhitespace: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p{:a => 'b'}   This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 18);

		test.done();
	},

    testHamlFileFirstLocalizableSkipSuffixes: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 8);

		test.done();
	},

	testHamlFileFirstLocalizableSkipSuffixesEqual: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p= This is not a string but ruby code instead\n"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 6);

		test.done();
	},

    testHamlFileFirstLocalizableSkipAttrsAndSuffixes: function(test) {
        test.expect(1);

        var h = new HamlFile();
        h.lines = [
        	"  %p{:a => 'b'}<>/ This is not a string but ruby code instead"
        ];
        h.currentLine = 0;
        
        test.equal(h.firstLocalizable(2), 19);

		test.done();
	},
	
    testHamlFileConvertTagSimple: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %b testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b>");
        
        test.done();
    },

    testHamlFileConvertTagOneAttr: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %b{ :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagOneAttrColons: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %b{ class: 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<b class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagWithSlashSuffix: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %br/ testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<br/>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs2: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %p{ :id => 'newpara2', :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs2Colons: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %p{id: 'newpara2', class : 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs3: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %p{ :id => 'newpara2', :name=>\"asdf\", :class => 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' name=\"asdf\" class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagMultipleAttrs3Colons: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ["  %p{id: 'newpara2', name:\"asdf\", class : 'foo' } testing"];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<p id='newpara2' name=\"asdf\" class='foo'>");
        
        test.done();
    },

    testHamlFileConvertTagAttrsAndClass: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ['  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<a class=\"data icon\" href=\"/pages/contact_us\">");
        
        test.done();
    },

    testHamlFileConvertTagId: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ['  %span#data-part non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), "<span id=\"data-part\">");
        
        test.done();
    },

    testHamlFileConvertTagIdAndClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ['  %span#data-part.foo.bar non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), '<span id=\"data-part\" class="foo bar">');
        
        test.done();
    },

    testHamlFileConvertTagIdAndClassesAndAttrs: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.lines = ['  %span#data-asdf.foo.bar{:precision => "2"} non-breaking\n'];
        h.currentLine = 0;
        
        test.equal(h.convertTag(3), '<span id=\"data-asdf\" class="foo bar" precision="2">');
        
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

	testHamlFileParseTextBlankIndentedLineSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test\n' +
        		'  \n' +
        		'  This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

        test.done();
    },

	testHamlFileParseTextCompletelyBlankLineSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test\n' +
        		'\n' +
        		'  This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

        test.done();
    },

	testHamlFileParseTextBlankMoreIndentedLineAlsoSeparatesResources: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test\n' +
        		'    \n' +
        		'    This is another test.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "This is another test.");
        test.equal(r.getKey(), "r139148599");

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
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test.\n' +   // text wrapped in a div
        		'  This is more text at the same indentation level.\n');  // should be a separate string
        
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
        
        test.equal(r.getSource(), "This is more text at the same indentation level.");
        test.equal(r.getKey(), "r467961626");
        
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
        
        h.parse('  This is a test of the\n' +
        		'  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
        		'  tags.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'This is a test of the <a class="data icon" href="/pages/contact_us">non-breaking</a> tags.');
        test.equal(r.getKey(), "r198921042");
        
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
        
        r = resources[1];
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
        test.expect(12);

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
    
    testHamlFileParseTextWithClasses: function(test) {
        test.expect(12);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'    .a.b A different string.\n' +   // this is a div
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

    testHamlFileParseTextWithClassesSameIndent: function(test) {
        test.expect(12);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  .a.b A different string.\n' +    // this is a div
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

    testHamlFileParseTextWithHtmlComments: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  / This is a test.\n' +
        		'  / A different string.\n' +    // this is a div
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHamlComments: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  -# This is a test.\n' +
        		'  -# A different string.\n' +    // this is a div
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHtmlCommentsIndented: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  / This is a test.\n' +
        		'    This indented string is still within the comment.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHamlCommentsIndented: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  -# This is a test.\n' +
        		'    This indented string is still within the comment.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  = This is a test.\n' +
        		'  = This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithHtmlSafeRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  &= This is a test.\n' +
        		'  &= This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextThatStartsWithAnEntity: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        // do not treat this as a html-safe ruby code
        h.parse('  &amp; This is a test.\n' +
        		'  &= This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "& This is a test.");
        test.equal(r.getKey(), "r470281808");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextThatStartsWithAnExclamationMark: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        // do not treat this as a html-safe ruby code
        h.parse('  ! This is a test.\n' +
        		'  &= This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "! This is a test.");
        test.equal(r.getKey(), "r495928089");

        r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithNotHtmlSafeRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  != This is a test.\n' +
        		'  != This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextWithMultilineRubyCode: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('= func(                         |\n' +
        	    '  "I think this might get " +   |\n' +
        	    '  "pretty long so I should " +  |\n' +
        	    '  "probably make it " +         |\n' +
        	    '  "multiline so it doesn\'t " + |\n' +
        	    '  "look awful.")                |\n' +
        		'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%p= This is not a string but ruby code instead\n' +
        		'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagComplicatedWithSuffixEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
        		'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagComplicatedWithMultipleSuffixesAndEquals: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
        		'Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextTagWithSuffixSlash: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}/ This is a test.\n' +
        		'Not indented.\n');
        
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

    testHamlFileParseTextTagWithSuffixLT: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}< This is a test.\n' +
        		'Not indented.\n');
        
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

    testHamlFileParseTextTagWithSuffixGT: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}> This is a test.\n' +
        		'Not indented.\n');
        
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

    testHamlFileParseTextTagWithSuffixMultiple: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('%meta{:attr => "value", :x => "y"}<> This is a test.\n' +
        		'Not indented.\n');
        
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

    testHamlFileParseTextIgnoreOnlyHashRuby: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} #{this should be ignored}\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextIgnoreOnlyHtml: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} <img src="http://some.com/url/here" />\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },

    testHamlFileParseTextIgnoreOnlyNonText: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %div{:attr => "value"} .,$#$@%\n' +
        		'  Not indented.\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Not indented.");
        test.equal(r.getKey(), "r313193297");

        test.done();
    },


    testHamlFileParseTextDoNotIncludeOutdentedNonBreakingTags: function(test) {
        test.expect(9);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('            Message\n' +
        	    '          %a.btn.grey.recommend_expert{:href=>"/recommend/#{@expert.id}"}\n' +
        	    '            %span.check_icon\n' +
        	    '            Recommend\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), "Message");
        test.equal(r.getKey(), "r727846503");

        var r = resources[1];
        test.ok(r);
        
        test.equal(r.getSource(), "Recommend");
        test.equal(r.getKey(), "r108032100");

        test.done();
    },

    testHamlFileParseTextWrapNonBreakingTagContentsProperly: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('          Message\n' +
        	    '          %a.btn.grey.recommend_expert{:href=>"/recommend/#{@expert.id}"}\n' +
        	    '            %span.check_icon\n' +
        	    '            Recommend\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'Message <a class="btn grey recommend_expert" href="/recommend/#{@expert.id}"><span class="check_icon"></span>Recommend</a>');
        test.equal(r.getKey(), "r242350119");

        test.done();
    },

    testHamlFileParseTextConvertHTMLEntities: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  Read more&nbsp;&rsaquo;\n');
        
        var set = h.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var resources = set.getAll();
        var r = resources[0];
        test.ok(r);
        
        test.equal(r.getSource(), 'Read more ›');
        test.equal(r.getKey(), "r818505217");

        test.done();
    },
    
    

    testHamlFileAssembleTranslation: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        var segment = {
        	text: "This is a test. This should all be in one string.",
        	original: '  This is a test.\n' +
    				  '  This should all be in one string.\n'
        };
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is a test."),
        	source: "Ceci est un essai.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This should all be in one string."),
        	source: "Tout doit etre en une phrase.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        
        var expected = 'Ceci est un essai. Tout doit etre en une phrase.';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationWithEmbeddedTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        var segment = {
        	text: "This is a test. <b>Bold text.</b> This should all be in one string.",
        	original: 'This is a test.\n' +
        	          '<b>Bold text.</b>\n' +
    				  'This should all be in one string.\n'
        };
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is a test."),
        	source: "Ceci est un essai.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("Bold text."),
        	source: "Texte gras.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This should all be in one string."),
        	source: "Tout doit etre en une phrase.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileAssembleTranslationModernTranslationIsCorrect: function(test) {
        test.expect(5);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        var segment = {
        	text: "This is a test. <b>Bold text.</b> This should all be in one string.",
        	original: 'This is a test.\n' +
        	          '<b>Bold text.</b>\n' +
    				  'This should all be in one string.\n'
        };
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is a test."),
        	source: "Ceci est un essai.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("Bold text."),
        	source: "Texte gras.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This should all be in one string."),
        	source: "Tout doit etre en une phrase.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.assembleTranslation(segment, translations, "fr-FR");
        
        var expected = 'Ceci est un essai. <b>Texte gras.</b> Tout doit etre en une phrase.';
        test.equal(actual, expected);
        
        var key = h.makeKey(segment.text);
        var resource = h.modern.getClean(ResourceString.cleanHashKey("webapp", "fr-FR", key, "x-haml"));
        test.ok(resource);

        test.equal(resource.getSource(), expected);
        test.equal(resource.reskey, key);
        
        test.done();
    },

    
    testHamlFileLocalizeText: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
        		'  This should all be in one string.\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is a test. This should all be in one string."),
        	source: "Ceci est un essai. Tout doit etre en une phrase.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai. Tout doit etre en une phrase.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextLowerIndentLevel: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is a test.\n' +
		        'This is more text at a different indentation level.\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is a test."),
        	source: "Ceci est un essai.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey("This is more text at a different indentation level."),
        	source: "Tout doit etre dans deux phrases.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       'Tout doit etre dans deux phrases.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

   
    testHamlFileLocalizeTextEmbeddedHTML: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  This is <span class="foo">a test</span> for the ages.\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is <span class="foo">a test</span> for the ages.'),
        	source: 'Ceci est <span class="foo">un essai</span> pour les temps entiere.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est <span class="foo">un essai</span> pour les temps entiere.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithCSSClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  .fg-bold.fg-test This is a test.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  .fg-bold.fg-test Ceci est un essai.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test.\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p Ceci est un essai.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTagsSameIndent: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);
        
        h.parse('  %p This is a test.\n' +   // text wrapped in a div
    	        '  This is more text at the same indentation level.\n');  // should be a separate string
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is more text at the same indentation level.'),
        	source: 'Ceci est plus texte avec le meme niveau d\'indentation.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p Ceci est un essai.\n' +
                       '  Ceci est plus texte avec le meme niveau d\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLTagsWithAttrs: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %a{:href=>"/pages/contact_us"} This is a test.\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %a{:href=>"/pages/contact_us"} Ceci est un essai.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },
    
    testHamlFileLocalizeTextWithNonBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is a test of\n' +
        		'  %b bold text\n' + 
        		'  embedded in the sentence.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test of <b>bold text</b> embedded in the sentence.'),
        	source: 'Ceci est un essai de <b>texte en gras</b> incorporé dans la phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai de <b>texte en gras</b> incorporé dans la phrase.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithNonBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is a test of the\n' +
        		'  %a.data.icon{:href=>"/pages/contact_us"} non-breaking\n' +
        		'  tags.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test of the <a class="data icon" href="/pages/contact_us">non-breaking</a> tags.'),
        	source: 'Ceci est un essai des mots clés <a class="data icon" href="/pages/contact_us">sans ruptures</a>.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai des mots clés <a class="data icon" href="/pages/contact_us">sans ruptures</a>.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithBreakingHTMLTags: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is a test.\n' +
    	        '  %div A different string.\n');


        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %div Une autre phrase.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLIndentedStringsContinuedMultiple: function(test) {
        test.expect(2);

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

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string. Another string. Yet another string.'),
        	source: 'Une autre phrase. Plus une autre. Encore une phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %p\n' +
                       '    Une autre phrase. Plus une autre. Encore une phrase.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHTMLNotIndentedStrings: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is a test.\n' +
        		'  %p A different string.\n' + 
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  %p Une autre phrase.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipScriptBlocks: function(test) {
        test.expect(2);

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

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
					   '  :ruby\n' + 
					   '     Rb.t("Not indented.);\n' +
					   '     = asdf asdfasdf\n' + 
					   '     Skip this string.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextDontSkipInsideDashCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('- content_for :guest_content do\n' +
        		'  This is a test.\n' +
        		'  :ruby\n' + 
        		'     Rb.t("Not indented.);\n' +
        		'     = asdf asdfasdf\n' + 
        		'     Skip this string.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '- content_for :guest_content do\n' +
                       '  Ceci est un essai.\n' +
					   '  :ruby\n' + 
					   '     Rb.t("Not indented.);\n' +
					   '     = asdf asdfasdf\n' + 
					   '     Skip this string.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithClasses: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is a test.\n' +
        		'  .a.b A different string.\n' +   // this is a div
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est un essai.\n' +
                       '  .a.b Une autre phrase.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHtmlComments: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  / This is a test.\n' +
        		'  / A different string.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlComments: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  -# This is a test.\n' +
        		'  -# A different string.\n' +    // this is a div
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHtmlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  / This is a test.\n' +
        		'    This indented string is still within the comment.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  -# This is a test.\n' +
        		'    This indented string is still within the comment.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        // don't need comments in the output
        var expected = '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextSkipHamlCommentsIndented: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  = This is a test.\n' +
        		'  = This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  = This is a test.\n' +
		               '  = This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithHtmlSafeRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  &= This is a test.\n' +
        		'  &= This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  &= This is a test.\n' +
		               '  &= This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithNotHtmlSafeRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  != This is a test.\n' +
        		'  != This indented string is still within the ruby code.\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  != This is a test.\n' +
		               '  != This indented string is still within the ruby code.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithMultilineRubyCode: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  = func(                         |\n' +
        	    '    "I think this might get " +   |\n' +
        	    '    "pretty long so I should " +  |\n' +
        	    '    "probably make it " +         |\n' +
        	    '    "multiline so it doesn\'t " + |\n' +
        	    '    "look awful.")                |\n' +
        		'  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  = func(                         |\n' +
					   '    "I think this might get " +   |\n' +
					   '    "pretty long so I should " +  |\n' +
					   '    "probably make it " +         |\n' +
					   '    "multiline so it doesn\'t " + |\n' +
					   '    "look awful.")                |\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %p= This is not a string but ruby code instead\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextComplicatedWithSuffixEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p.x.y{:attr => "value", :x => "y"}= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextComplicatedWithMultipleSuffixesAndEquals: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %p.x.y{:attr => "value", :x => "y"}<>= This is not a string but ruby code instead\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixSlash: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %meta{:attr => "value", :x => "y"}/ This is a test.\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}/ Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextWithSuffixSlashNonBreakingTag: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  This is\n' +
        		'  %br/\n' +
 		        '  Spinal Tap.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is <br/> Spinal Tap.'),
        	source: 'Ceci est <br/> Spinal Tap.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  Ceci est <br/> Spinal Tap.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextEscapeHTML: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  A &amp; B\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A & B'),
        	source: 'C & D',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  C &amp; D\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextTagWithSuffixLT: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %meta{:attr => "value", :x => "y"}< This is a test.\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}< Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextTagWithSuffixMultiple: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('  %meta{:attr => "value", :x => "y"}<> This is a test.\n' +
 		        '  Not indented.\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('This is a test.'),
        	source: 'Ceci est un essai.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('A different string.'),
        	source: 'Une autre phrase.',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Not indented.'),
        	source: "Sans l'indentation.",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '  %meta{:attr => "value", :x => "y"}<> Ceci est un essai.\n' +
                       '  Sans l\'indentation.\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testHamlFileLocalizeTextCorrectIndentationAfterBlankLines: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			type: hft
		});
        test.ok(h);

        h.parse('.compass-pricing\n' +
                '  .pricing-intro\n' +
                '    %h2.header-medium.light\n' + 
                '      Calculate ROI for\n' +
                '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' + 
                '\n' +
        		'    %p\n' +
        		'      Type your organization\'s own values to estimate your ROI\n' +
        		'    \n' +
        		'  .desktop-ui.calc-links\n' +
        		'    %a.reset Reset values\n' +
        		'    %span.sep\n' +
        		'    %a.assumptions Assumptions\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Type your organization\'s own values to estimate your ROI'),
        	source: 'Tapez les valeurs propres de votre organisation pour estimer votre ROI',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Calculate ROI for'),
        	source: 'Calculer le ROI pour',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Reset values'),
        	source: 'Réinitialiser les valeurs',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Assumptions'),
        	source: "Hypothèses",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        var actual = h.localizeText(translations, "fr-FR");
        var expected = '.compass-pricing\n' +
				       '  .pricing-intro\n' +
		               '    %h2.header-medium.light\n' + 
		               '      Calculer le ROI pour\n' +
		               '      = render :partial  =>  \'b2b/partial/organization_logo_name\'\n' +
		               '\n' +
					   '    %p\n' +
					   '      Tapez les valeurs propres de votre organisation pour estimer votre ROI\n' +
					   '    \n' +
					   '  .desktop-ui.calc-links\n' +
					   '    %a.reset Réinitialiser les valeurs\n' +
					   '    %span.sep\n' +
					   '    %a.assumptions Hypothèses\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },
    


    testHamlFileExtractFile: function(test) {
        test.expect(8);

        var h = new HamlFile({
			project: p,
			pathName: "./ruby/t2.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 9);
        
        var r = set.getBySource("Type your organization's own values to estimate your ROI");
        test.ok(r);
        test.equal(r.getSource(), "Type your organization's own values to estimate your ROI");
        test.equal(r.getKey(), "r64223466");
        
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r251869351", "x-haml"));
        test.ok(r);
        test.equal(r.getSource(), "Annual gross savings");
        test.equal(r.getKey(), "r251869351");
        
        test.done();
    },

    testHamlFileExtractFileNoRubyStringsExtracted: function(test) {
        test.expect(6);

        var h = new HamlFile({
			project: p,
			pathName: "./ruby/t2.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 9);
        
        // "Size of organization"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "x-haml"));
        test.ok(!r);
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r805820076", "ruby"));
        test.ok(!r);
        
        // "Average cost of ER visit"
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "x-haml"));
        test.ok(!r);
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r972427737", "ruby"));
        test.ok(!r);
        
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
			pathName: "./ruby/foo.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        h.extract();
        
        var set = h.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHamlFileGetLocalizedPath: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			pathName: "foo.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "testfiles/foo.fr-FR.html.haml");

        test.done();
    },

    testHamlFileGetLocalizedPathWithDir: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			pathName: "./ruby/foo.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "testfiles/ruby/foo.fr-FR.html.haml");

        test.done();
    },

    testHamlFileGetLocalizedPathWithImproperSuffix: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			pathName: "./ruby/foo.haml",
			type: hft
		});
        test.ok(h);
        
        // should attempt to read the file and not fail
        test.equal(h.getLocalizedPath("fr-FR"), "testfiles/ruby/foo.fr-FR.haml");

        test.done();
    },

    testHamlFileLocalize: function(test) {
        test.expect(2);

        var h = new HamlFile({
			project: p,
			pathName: "./ruby/t2.html.haml",
			type: hft
		});
        test.ok(h);
        
        // should read the file
        h.extract();
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Calculate ROI for'),
        	source: 'Calculer le ROI pour',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Type your organization\'s own values to estimate your ROI'),
        	source: 'Tapez les valeurs propres de votre organisation pour estimer votre ROI',
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Reset values'),
        	source: "Réinitialiser les valeurs",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Assumptions'),
        	source: "Hypothèses",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        translations.add(new ResourceString({
        	project: "webapp",
        	key: h.makeKey('Return on investment'),
        	source: "Retour sur investissement",
        	locale: "fr-FR",
        	datatype: hft.datatype,
        	origin: "target"
        }));
        
        h.localize(translations, ["fr-FR"]);
        
        // now make sure the file was written out
        
        test.ok(fs.existsSync("testfiles/ruby/t2.fr-FR.html.haml"));
        
        test.done();
    }
};