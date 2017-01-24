/*
 * testJavaFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaFile) {
    var JavaFile = require("../lib/JavaFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
}

module.exports = {
    testJavaFileConstructor: function(test) {
        test.expect(1);

        var j = new JavaFile();
        test.ok(j);
        
        test.done();
    },
    
    testJavaFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p, "./testfiles/java/t1.java");
        
        test.ok(j);
        
        test.done();
    },

    testJavaFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.done();
    },

    testJavaFileMakeKey: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testJavaFileMakeKeySimpleTexts1: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("Medications in your profile"), "r32020327");
		test.equals(j.makeKey("All medications"), "r835310324");
		test.equals(j.makeKey("Conditions"), "r103883086");
		test.equals(j.makeKey("Symptoms"), "r481086103");
		test.equals(j.makeKey("Experts"), "r343852585");
        
        test.done();
	},

    testJavaFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(j.makeKey("\\n \\t bar"), "r755240053");
		test.equals(j.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
		test.equals(j.makeKey("\\'Dude\\'"), "r6259609");
		
        test.done();
	},

	testJavaFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("Procedures"), "r807691021");
		test.equals(j.makeKey("Health Apps"), "r941505899");
		test.equals(j.makeKey("Conditions in your profile"), "r240633868");
		test.equals(j.makeKey("Treatment Reviews"), "r795086964");
		test.equals(j.makeKey("Answers"), "r221604632");
        
        test.done();
	},

	testJavaFileMakeKeySimpleTexts3: function(test) {
        test.expect(11);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("Private Health Profile"), "r669315500");
		test.equals(j.makeKey("People you care for"), "r710774033");
		test.equals(j.makeKey("Notifications"), "r284964820");
		test.equals(j.makeKey("News"), "r613036745");
		test.equals(j.makeKey("More Tips"), "r216617786");
		test.equals(j.makeKey("Goals"), "r788359072");
		test.equals(j.makeKey("Referral Link"), "r140625167");
		test.equals(j.makeKey("Questions"), "r256277957");
		test.equals(j.makeKey("Private consults"), "r18128760");
		test.equals(j.makeKey("Suggested doctors for you"), "r584966709");
        
        test.done();
	},

	testJavaFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("Can\'t find treatment id"), "r926831062");
		test.equals(j.makeKey("Can\'t find an application for SMS"), "r909283218");
        
        test.done();
	},
	
	testJavaFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equals(j.makeKey("{topic_name}({topic_generic_name})"), "r382554039");
		test.equals(j.makeKey("{doctor_name}, {sharer_name} {start}found this helpful{end}"), "r436261634");
		test.equals(j.makeKey("{sharer_name} {start}found this helpful{end}"), "r858107784");
		test.equals(j.makeKey("Grow your Care-Team"), "r522565682");
		test.equals(j.makeKey("Failed to send connection request!"), "r1015770123");
		test.equals(j.makeKey("{goal_name} Goals"), "r993422001");
		test.equals(j.makeKey("Referral link copied!"), "r201354363");
        
        test.done();
	},

    testJavaFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "r654479252");
        test.equal(j.makeKey("This is a test"), "r654479252");
        
        test.done();
    },
    
    testJavaFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("Can\'t find treatment id"), "r926831062");
		test.equal(j.makeKey("Can\'t    find    treatment           id"), "r926831062");
		
		test.equal(j.makeKey("Can\'t find an application for SMS"), "r909283218");
		test.equal(j.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");
        
        test.done();
	},
	
    testJavaFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        test.equal(j.makeKey("Can\'t find treatment id"), "r926831062");
        test.equal(j.makeKey("      Can\'t find treatment id "), "r926831062");
		
        test.equal(j.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(j.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

		test.done();
	},

	testJavaFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(jf.makeKey("A \n B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(jf.makeKey("A \\n B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyTabs: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("A \t B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("A \\t B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("A \\'B\\' C"), "r935639115");
        
        test.done();
	},

	testJavaFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("\\u00A0 \\u0023"), "r2293235");
        
        test.done();
	},

	testJavaFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("Talk to a doctor live 24/7 via video or \u00a0 text\u00a0chat"), "r705871347");
        
        test.done();
	},

	testJavaFileMakeKeyInterpretEscapedOctalChars: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("A \\40 \\011 B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyJavaEscapeSequences: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("A \\b\\t\\n\\f\\r\\\\ B"), "r191336864");
        
        test.done();
	},

	testJavaFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var p = new AndroidProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var jf = new JavaFile({
			project: p
		});
        test.ok(jf);

        test.equals(jf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(jf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(jf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(jf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(jf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(jf.makeKey('This is a single quoted string'), "r683276274");
        test.equals(jf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(jf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(jf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(jf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(jf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(jf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");
        
        test.done();
	},
	
    testJavaFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "r654479252", "java"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testJavaFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testJavaFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('   RB.getString  (    \t "This is a test"    );  ');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testJavaFileParseIgnoreLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("  \t \n  This is a test\n\n\t   ");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testJavaFileParseIgnoreEscapedLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("  \\t \\n  This is a test\\n\\n\\t   ");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },


    testJavaFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('RB.getString("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testJavaFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "foobar", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "foobar");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testJavaFileParseWithKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testJavaFileParseWithKeyIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("   \t\n This is a test       ", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");
        
        test.done();
    },

    testJavaFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "unique_id")');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(!r);
        
        test.done();
    },

    testJavaFileParseMultiple: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseMultipleOnSameLine: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");  a.parse("This is another test."); RB.getString("This is another test");\n');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseWithDups: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        
        var set = j.getTranslationSet();
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

    testJavaFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + " and this isnt");');
        
        var set = j.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString("This is a test" + foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString(foobar);');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('RB.getString();');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('EPIRB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testJavaFileParseSubobject: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        j.parse('App.RB.getString("This is a test");');
        
        var set = j.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testJavaFileExtractFile: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p, "./java/t1.java");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
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
    
    testJavaFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testJavaFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new JavaFile(p, "./java/foo.java");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

};