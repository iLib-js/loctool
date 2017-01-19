/*
 * testRubyFile.js - test the Ruby file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!RubyFile) {
    var RubyFile = require("../lib/RubyFile.js");
    var WebProject =  require("../lib/WebProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

module.exports = {
    testRubyFileConstructor: function(test) {
        test.expect(1);

        var rf = new RubyFile();
        test.ok(rf);
        
        test.done();
    },
    
    testRubyFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile(p, "./ruby/external_user_metric.rb");
        
        test.ok(rf);
        
        test.done();
    },

    testRubyFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        test.done();
    },

    testRubyFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        test.equal(rf.makeKey("This is a test"), "r654479252");
        
        test.done();
    },

    testRubyFileMakeKeyCompressUnderscores: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("Medications    in $$$  your profile"), "r1005643851");
        
        test.done();
	},

	testRubyFileMakeKeyCompressUnderscores2: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("Terms___and___Conditions"), "r906781227");
        
        test.done();
	},

	testRubyFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(rf.makeKey("A \n B"), "r718438265");
        
        test.done();
	},

	testRubyFileMakeKeyTabs: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("A \t B"), "r943923784");
        
        test.done();
	},

	testRubyFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("A \\'B\\' C"), "r935639115");
        
        test.done();
	},

	testRubyFileMakeKeyInterpretEscapedNonSpecialChars: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("\\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z"), "r1027573048");
        
        test.done();
	},

	testRubyFileMakeKeyInterpretEscapedSpecialChars: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("\\u00A0 \\x23"), "r967544232");
        
        test.done();
	},

	testRubyFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(17);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(rf.makeKeyUnescaped('This has \\\"double quotes\\\" in it.'), "r538041526");
        test.equals(rf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(rf.makeKeyUnescaped('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(rf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string'), "r683276274");
        test.equals(rf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(rf.makeKey("This is a double quoted string with \\n return chars in it"), "r1050725297");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\n return chars in it'), "r729667629");
        test.equals(rf.makeKey("This is a double quoted string with \\t tab chars in it"), "r785725858");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\t tab chars in it'), "r637301221");
        test.equals(rf.makeKey("This is a double quoted string with \\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z other escape chars in it"), "r529567158");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\d \\g \\h \\i \\j \\k \\l \\m \\o \\p \\q \\w \\y \\z other escape chars in it'), "r955027934");
        test.equals(rf.makeKey("This is a double quoted string with \\u00A0 \\x23 hex escape chars in it"), "r347049046");
        test.equals(rf.makeKeyUnescaped('This is a single quoted string with \\u00A0 \\x23 hex escape chars in it'), "r1000517606");
        
        test.done();
	},


	testRubyFileMakeKeyUnescapedNewLines: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        // unescaped is used for single quoted strings
        test.equals(rf.makeKeyUnescaped("A \\n B"), "r400574317");
        
        test.done();
	},

	testRubyFileMakeKeyUnescapedTabs: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("A \\t B"), "r720987307");
        
        test.done();
	},

	testRubyFileMakeKeyUnescapedQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("A \\'B\\' C"), "r935639115");
        
        test.done();
	},

	testRubyFileMakeKeyInterpretUnescapedSpecialChars: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        test.equals(rf.makeKeyUnescaped("\\u00A0 \\x23"), "r262108213");
        
        test.done();
	},

    testRubyFileMakeKeyDigits: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        test.equal(rf.makeKey("0"), "r3145008");
        
        test.done();
    },

    testRubyFileMakeKeyNonChars: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        test.equal(rf.makeKey("foo: done?!@#$%^&*()"), "r621645297");
        
        test.done();
    },

    testRubyFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testRubyFileParseSingleQuotes: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse("Rb.t('This is a test')");
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "r654479252", "ruby"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testRubyFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },

    testRubyFileParseSingleQuotesUnescaped: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse("Rb.t('This is \\'a\\' test')");
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is \\'a\\' test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is \\'a\\' test");
        test.equal(r.getKey(), "r240708166");
        
        test.done();
    },

    testRubyFileParseDoubleQuotesEscaped: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse("Rb.t(\"This is \\'a\\' test\")");
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is \\'a\\' test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is \\'a\\' test");
        test.equal(r.getKey(), "r240708166");
        
        test.done();
    },

    testRubyFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("")');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('   Rb.t  (    \t "This is a test"    );  ');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.done();
    },


    testRubyFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);

        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);

        rf.parse('Rb.t("This is a test")');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('\tRb.t("This is a test"); # i18n: this is a translator\'s comment\n\tfoo("This is not");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");
        
        test.done();
    },

    testRubyFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");');
        
        var set = rf.getTranslationSet();
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

    testRubyFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test");\t# i18n: bar');
        
        var set = rf.getTranslationSet();
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

    testRubyFileParseMultipleWithParametersAndComments: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test", "asdf");   # i18n: foo\n\ta.parse("This is another test.");\n\t\tRb.t("This is also a test", "kdkdkd");\t# i18n: bar');
        
        var set = rf.getTranslationSet();
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

    testRubyFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test");\n\ta.parse("This is another test.");\n\t\tRb.t("This is a test");');
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test" + " and this isnt");');
        
        var set = rf.getTranslationSet();

        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t("This is a test" + foobar);');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t(foobar);');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseEmptyParams: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('Rb.t();');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseWholeWord: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('EPIRb.t("This is a test");');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 0);
        
        test.done();
    },

    testRubyFileParseSubobject: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse('App.Rb.t("This is a test");');
        
        var set = rf.getTranslationSet();
        test.equal(set.size(), 1);
        
        test.done();
    },

    testRubyFileExtractFile: function(test) {
        test.expect(8);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
        	project: p, 
        	pathName: "./ruby/external_user_metric.rb"
        });
        test.ok(rf);
        
        // should read the file
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 13);
        
        var r = set.getBySource("Noted that person %{person_id} has %{source} installed");
        test.ok(r);
        test.equal(r.getSource(), "Noted that person %{person_id} has %{source} installed");
        test.equal(r.getKey(), "r924558074");
        
        r = set.getBySource("data is missing or empty.");
        test.ok(r);
        test.equal(r.getSource(), "data is missing or empty.");
        test.equal(r.getKey(), "r62756614");
        
        test.done();
    },
    
    testRubyFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        // should attempt to read the file and not fail
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testRubyFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
        	project: p, 
        	pathName: "./ruby/foo.rb"
        });
        test.ok(rf);
        
        // should attempt to read the file and not fail
        rf.extract();
        
        var set = rf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
    
    testRubyFileParseHamlFile: function(test) {
        test.expect(18);

        var p = new WebProject({
        	id: "webapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
			project: p
		});
        test.ok(rf);
        
        rf.parse(
    		'.contain-width\n' +
    		'  .hopes-for-everyone\n' +
    		'    %p.big-text.montserrat-regular\n' +
    		'      WE HAVE HOPES FOR EVERYONE\n' +
    		'    .items\n' +
    		'      :ruby\n' +
    		'        data=[\n' +
    		'          {:links=>[{:href=>"/what_we_make/members",:caption=>Rb.t("Learn more about members")}],:img=>"members-mobile@3x.png",:title=>Rb.t("Members"),:caption=>Rb.t("Immediate access to top doctors and their expertise, anytime, anywhere")},\n' +
    		'          {:links=>[{:href=>"/enterprise/providers",:caption=>Rb.t("Learn about providers & health systems")},{:href=>"/enterprise/practices",:caption=>Rb.t("Learn about medical practices and clinics")}],:img=>"providers-and-health-systems-mobile@3x.png",:title=>Rb.t("Providers & Health Systems"),:caption=>Rb.t("Healthier patients, happier doctors, higher income")},\n' +
    		'          {:links=>[{:href=>"/enterprise/compass",:caption=>Rb.t("Learn more about employers & insurers")}],:img=>"employers-and-insurers-mobile@3x.png",:title=>Rb.t("Employers & Insurers"),:caption=>Rb.t("Lower costs and improve productivity & satisfaction by providing the right care at the right cost at the right time ")},\n' +
    		'          {:links=>[{:href=>"/what_we_make/doctors",:caption=>Rb.t("Learn more about doctors")}],:img=>"doctors-mobile@3x.png",:title=>Rb.t("Doctors"),:caption=>Rb.t("Enhance your reputation, grow your practice ")},\n' +
    		'          {:links=>[{:href=>"/enterprise/sos",:caption=>Rb.t("Learn more about government & population managers")}],:img=>"govt-pop-mangagers@3x.png",:title=>Rb.t("Government & Population Managers"),:caption=>Rb.t("Immediate, trusted, simple disaster relief ")},\n' +
    		'          {:links=>[{:href=>"/what_we_make/developers",:caption=>Rb.t("Learn more about developers")}],:img=>"developers-mobile@3x.png",:title=>Rb.t("Developers"),:caption=>Rb.t("HealthTap Cloud enables developers to build interoperable, engaging, and smart health experiences, powered by HOPES<sup>TM</sup>")}\n' +
    		'        ]\n' +
    		'      -data.each do |item|\n' +
    		'        .item\n' +
    		'          .item-inner\n' +
    		'            %img{:src=>"/imgs/feelgood/static_pages/home/new/" + item[:img]}\n' +
    		'            %p.title.montserrat-regular #{item[:title].html_safe}\n' +
    		'            %p.small-text #{item[:caption].html_safe}\n' +
    		'            - item[:links] ||= []\n' +
    		'            - item[:links].each do |link|\n' +
    		'              %a.small-text.link{:href=>link[:href]} \n' +
    		'                #{link[:caption]}\n' +
    		'                %span.arrow &rsaquo;\n'
    
        );
        
        var set = rf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("Learn more about members");
        test.ok(r);
        test.equal(r.getSource(), "Learn more about members");
        test.equal(r.getKey(), "r899361143");
        
        r = set.getBySource("Members");
        test.ok(r);
        test.equal(r.getSource(), "Members");
        test.equal(r.getKey(), "r412671705");
        
        r = set.getBySource("Immediate access to top doctors and their expertise, anytime, anywhere");
        test.ok(r);
        test.equal(r.getSource(), "Immediate access to top doctors and their expertise, anytime, anywhere");
        test.equal(r.getKey(), "r975034919");

        r = set.getBySource("Learn about providers & health systems");
        test.ok(r);
        test.equal(r.getSource(), "Learn about providers & health systems");
        test.equal(r.getKey(), "r851737678");

        r = set.getBySource("Healthier patients, happier doctors, higher income");
        test.ok(r);
        test.equal(r.getSource(), "Healthier patients, happier doctors, higher income");
        test.equal(r.getKey(), "r120591747");
        
        test.equal(set.size(), 19);
        
        test.done();
    },

    testRubyFileParseDoublePluralArrow: function(test) {
        test.expect(7);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles");
        
        var rf = new RubyFile({
            project: p
        });
        test.ok(rf);
        
        rf.parse('Rb.p(:one => "This is 1 test", :other => "There are %{count} tests", :variables => {count: 1})');
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.get('one'),'This is 1 test');
        test.equals(r.get('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    },

    testRubyFileParseSinglePluralArrow: function(test) {
        test.expect(7);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US"
        }, "./testfiles");

        var rf = new RubyFile({
            project: p
        });
        test.ok(rf);

        rf.parse("Rb.p(:one => 'This is 1 test', :other => 'There are %{count} tests', :variables => {count: 1})");
        var set = rf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);
        var r = set.getAll()[0];
        test.ok(r);
        test.equals(r.get('one'),'This is 1 test');
        test.equals(r.get('other'),'There are %{count} tests');
        test.equals(r.getKey(), 'r186608186');
        test.done();
    }
};
