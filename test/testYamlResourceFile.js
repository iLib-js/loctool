/*
 * testYaml.js - test the Yaml object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!YamlResourceFile) {
	var YamlResourceFile = require("../lib/YamlResourceFile.js");
	var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var WebProject =  require("../lib/WebProject.js");
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
	id: "ht-webapp12",
	sourceLocale: "en-US",
	resourceDirs: {
		"yml": "a/b"
	}
}, "./testfiles", {
	locales:["en-GB"]
});

var yft = new YamlResourceFileType(p);

module.exports = {
    testYamlConstructorEmpty: function(test) {
        test.expect(1);

        var y = new YamlResourceFile();
        test.ok(y);
        
        test.done();
    },
    
    testYamlConstructorFull: function(test) {
        test.expect(2);

       var y = new YamlResourceFile({
            project: p,
        	pathName: "a/b/en-US.yml",
        	type: yft
        });
        test.ok(y);
        
        test.equal(y.getPath(), "a/b/en-US.yml");

        test.done();
    },
    
    testYamlGetPath: function(test) {
        test.expect(2);

        var y = new YamlResourceFile({
        	project: p,
            pathName: "foo/bar/x.yml",
        	type: yft
        });
        test.ok(y);
        
        test.equal(y.getPath(), "foo/bar/x.yml");
        
        test.done();
    },
    
    testYamlResourceFileParseSimpleGetByKey: function(test) {
        test.expect(6);

         var yml = new YamlResourceFile({
			project: p,
        	type: yft
		});
        test.ok(yml);
        
        yml.parse('---\n' +
        		'Working_at_HealthTap: Working at HealthTap\n' +
        		'Jobs: Jobs\n' +
        		'Our_internship_program: Our internship program\n' +
        		'? Completing_an_internship_at_HealthTap_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
        		': Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'  directly from experienced, successful entrepreneurs.\n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "Jobs"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getKey(), "Jobs");
        test.ok(!r[0].getComment());
        
        test.done();
    },

    testYamlResourceFileParseWithSubkeys: function(test) {
        test.expect(28);

        var yml = new YamlResourceFile({
			project: p,
        	type: yft
		});
        test.ok(yml);
        
        yml.parse(
        		'---\n' +
        		"'feelgood/foo/bar/x.en-US.html.haml':\n" +
        		'  r9834724545: Jobs\n' +
        		'  r9483762220: Our internship program\n' +
        		'  r6782977423: |\n' +
        		'    Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'    directly from experienced, successful entrepreneurs.\n' +
				"'feelgood/foo/ssss/asdf.en-US.html.haml':\n" +
				'  r4524523454: Working at HealthTap\n' +
				'  r3254356823: Jobs\n' +
				'foo:\n' +
				'  bar:\n' +
				'    asdf:\n' +
				'      test: test of many levels\n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getAll();
        test.ok(r);
        
        test.equal(r.length, 6);
        
        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getLocale(), "en-US"); // source locale
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getLocale(), "en-US"); // source locale
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(), 
        		'Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getLocale(), "en-US"); // source locale
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at HealthTap");
        test.equal(r[3].getLocale(), "en-US"); // source locale
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getLocale(), "en-US"); // source locale
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getLocale(), "en-US"); // source locale
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "foo@bar@asdf");

        test.done();
    },

    testYamlResourceFileParseWithLocaleAndSubkeys: function(test) {
        test.expect(28);

        var yml = new YamlResourceFile({
			project: p,
        	type: yft
		});
        test.ok(yml);
        
        yml.parse(
        		'---\n' +
        		"zh-Hans-CN:\n" +
        		"  feelgood/foo/bar/x.en-US.html.haml:\n" +
        		'    r9834724545: Jobs\n' +
        		'    r9483762220: Our internship program\n' +
        		'    r6782977423: |\n' +
        		'      Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'      directly from experienced, successful entrepreneurs.\n' +
				"  feelgood/foo/ssss/asdf.en-US.html.haml:\n" +
				'    r4524523454: Working at HealthTap\n' +
				'    r3254356823: Jobs\n' +
				'  foo:\n' +
				'    bar:\n' +
				'      asdf:\n' +
				'        test: test of many levels\n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getAll();
        test.ok(r);
        
        test.equal(r.length, 6);
        
        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getLocale(), "zh-Hans-CN");
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getLocale(), "zh-Hans-CN");
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(), 
        		'Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getLocale(), "zh-Hans-CN");
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at HealthTap");
        test.equal(r[3].getLocale(), "zh-Hans-CN");
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getLocale(), "zh-Hans-CN");
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getLocale(), "zh-Hans-CN");
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "foo@bar@asdf");

        test.done();
    },

    testYamlResourceFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var yml = new YamlResourceFile({
			project: p,
        	type: yft
		});
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse('---\n' +
        		'es-US:\n' +
        		'  Working_at_HealthTap: Working at HealthTap\n' +
        		'  Jobs: Jobs\n' +
        		'  Our_internship_program: Our internship program\n' +
        		'  ? Completing_an_internship_at_HealthTap_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
        		'  : Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'    directly from experienced, successful entrepreneurs.\n');
        
        test.ok(set);
        
        test.equal(set.size(), 4);
        
        test.done();
    },

    testYamlResourceFileExtractFile: function(test) {
        test.expect(14);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./test.yml",
        	type: yft
        });
        test.ok(yml);
        
        // should read the file
        yml.extract();
        
        var set = yml.getTranslationSet();
        
        test.equal(set.size(), 789);
        
        var r = set.getBy({
        	reskey: "Marketing"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Marketing");
        test.equal(r[0].getKey(), "Marketing");
        test.ok(!r[0].getComment());

        var r = set.getBy({
        	reskey: "Everyone_at_HealthTap_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name."
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Everyone at HealthTap has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure, soon be a household name.");
        test.equal(r[0].getKey(), "Everyone_at_HealthTap_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name.");
        test.ok(!r[0].getComment());
        
        var r = set.getBy({
        	reskey: "is_a_bright,_open_environment,_filled_with_great_energy,_positivity,_and_dedication."
        });
        test.ok(r);
        test.equal(r[0].getSource(), "is a bright, open environment, filled with great energy, positivity, and dedication.");
        test.equal(r[0].getKey(), "is_a_bright,_open_environment,_filled_with_great_energy,_positivity,_and_dedication.");
        test.ok(!r[0].getComment());

        test.done();
    },
   
    testYamlResourceFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
			project: p,
        	type: yft
		});
        test.ok(yml);
        
        // should attempt to read the file and not fail
        yml.extract();
        
        var set = yml.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testYamlResourceFileExtractBogusFile: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./objc/en.lproj/asdf.yml",
        	type: yft
        });
        test.ok(yml);
        
        // should attempt to read the file and not fail
        yml.extract();
        
        var set = yml.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    },
    
    testYamlResourceFileGetContent: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./asdf.yml",
        	locale: "de-DE",
        	type: yft
        });
        test.ok(yml);
        
        [
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source_text",
        		source: "Quellen\"text",
        		comment: "foo"
        	}),
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more_source_text",
        		source: "mehr Quellen\"text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });

        var expected =
        	'de-DE:\n' +
        	'  more_source_text: mehr Quellen\"text\n' +
        	'  source_text: Quellen\"text\n';

        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);
        
        test.done();
    },
    
    testYamlResourceFileGetContentComplicated: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN",
        	type: yft
        });
        test.ok(yml);
        
        [
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "• &amp;nbsp; Address a health or healthy living topic",
        		source: "• &amp;nbsp; 解决健康生活相关的话题",
        		comment: " "
        	}),
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "&apos;&#41;, url&#40;imgs/masks/top_bar",
        		source: "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        var expected =
        	"zh-Hans-CN:\n" +
        	"  '&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n" +
        	"  • &amp;nbsp; Address a health or healthy living topic: • &amp;nbsp; 解决健康生活相关的话题\n";
        	
        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);
        
        test.done();
    },

    testYamlResourceFileGetContentWithNewlines: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN",
        	type: yft
        });
        test.ok(yml);
        
        [
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "short key",
        		source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
        		comment: " "
        	}),
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "A very long key that happens to have \n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.",
        		source: "short text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        var expected =
	    	"zh-Hans-CN:\n" +
	    	"  \"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n" +
	    	"  short key: |-\n" +
	    	"    this is text that is relatively long and can run past the end of the page\n" +
	    	"    So, we put a new line in the middle of it.\n";
        	
        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);
        
        test.done();
    },

    testYamlResourceFileGetContentEmpty: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./asdf.yml",
        	locale: "de-DE",
        	type: yft
        });
        test.ok(yml);
        
        test.equal(yml.getContent(), '{}\n');
        
        test.done();
    },

    testYamlResourceFileRealContent: function(test) {
        test.expect(5);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./test.yml",
        	locale: "en-US",
        	type: yft
        });
        test.ok(yml);
        
        yml.extract();
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("ht-webapp12", undefined, "en-US", "Dr._Livingston_serves_on_the_Medical_Advisory_Board_for_HealthTap_and_he_is_the_Chief_Medical_officer_for_Healthcare_Transformation_Solutions._He_is_on_Twitter_as_@macobgyn_and_is_an_active_doctor_blogger.", "x-yaml"));
        test.ok(r);
        
        test.equal(r.getSource(), "Dr. Livingston serves on the Medical Advisory Board for HealthTap and he is the Chief Medical officer for Healthcare Transformation Solutions. He is on Twitter as @macobgyn and is an active doctor blogger.");
        test.equal(r.getKey(), "Dr._Livingston_serves_on_the_Medical_Advisory_Board_for_HealthTap_and_he_is_the_Chief_Medical_officer_for_Healthcare_Transformation_Solutions._He_is_on_Twitter_as_@macobgyn_and_is_an_active_doctor_blogger.");
        
        test.done();
    },
    
    testYamlResourceFileRealContent2: function(test) {
        test.expect(7);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./test2.yml",
        	locale: "en-US",
        	type: yft
        });
        test.ok(yml);
        
        yml.extract();
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("ht-webapp12", "saved_someone_else_life", "en-US", "subject", "x-yaml"));
        test.ok(r);
        
        test.equal(r.getSource(), "Feel good! Someone said a doctor’s answer to your question saved their life:");
        test.equal(r.getKey(), "subject");
        test.equal(r.getLocale(), "en-US");
        test.equal(r.getContext(), "saved_someone_else_life");
        
        test.done();
    },
    
    testYamlResourceFileAtInKeyName: function(test) {
        test.expect(7);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./test2.yml",
        	locale: "en-US",
        	type: yft
        });
        test.ok(yml);
        
        yml.extract();
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("ht-webapp12", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        test.ok(r);
        
        test.equal(r.getSource(), "%1, %2 has answered a question you asked!");
        test.equal(r.getKey(), "email_subject");
        test.equal(r.getLocale(), "en-US");
        test.equal(r.getContext(), "member_question_asked\\@answered");
        
        test.done();
    },
    
    testYamlResourceFileRightResourceType: function(test) {
        test.expect(4);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./test2.yml",
        	locale: "en-US",
        	type: yft
        });
        test.ok(yml);
        
        yml.extract();
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("ht-webapp12", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        test.ok(r);
        
        test.ok(r instanceof ContextResourceString);
        
        test.done();
    },
    
    testYamlResourceFileGetContentDontUseSourceHash: function(test) {
        test.expect(2);

        var yml = new YamlResourceFile({
        	project: p, 
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN",
        	type: yft
        });
        test.ok(yml);
        
        [
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "r24524524524",
        		source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
        		comment: " ",
        		sourceHash: "r4352345234"
        	}),
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "r003425245",
        		source: "short text",
        		comment: "bar",
        		sourceHash: "r8437477345"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        var actual = yml.getContent();
        var expected =
	    	"zh-Hans-CN:\n" +
	    	"  r003425245: short text\n" +
	    	"  r24524524524: |-\n" +
	    	"    this is text that is relatively long and can run past the end of the page\n" +
	    	"    So, we put a new line in the middle of it.\n";

        diff(actual, expected);
        test.equal(actual, expected);
        
        test.done();
    },

    testYamlResourceFileGetContentResourcePlural: function(test) {
        test.expect(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
        	type: yft
        });
        test.ok(yml);

        [
            new ResourcePlural({
                project: "ht-webapp12",
                locale: "zh-Hans-CN",
                comment: "",
                source: 'This is 1 test',
                key: 'r186608186',
                strings: {
                    'one' : 'This is 1 test',
                    'other' : 'There are %{count} tests'
                }
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var actual = yml.getContent();
        var expected =
            "zh-Hans-CN:\n" +
            "  r186608186:\n" +
            "    one: This is 1 test\n" +
            "    other: 'There are %{count} tests'\n";

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testYamlResourceFileGetContentResourcePluralAndString: function(test) {
        test.expect(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
        	type: yft
        });
        test.ok(yml);

        [
            new ResourcePlural({
                project: "ht-webapp12",
                locale: "zh-Hans-CN",
                comment: "",
                source: 'This is 1 test',
                key: 'r186608186',
                strings: {
                    'one' : 'This is 1 test',
                    'other' : 'There are %{count} tests'
                }
            }),
            new ContextResourceString({
                project: "ht-webapp12",
                locale: "zh-Hans-CN",
                key: "r003425245",
                source: "short text",
                comment: "bar",
                sourceHash: "r8437477345"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var actual = yml.getContent();
        var expected =
            "zh-Hans-CN:\n" +
            "  r003425245: short text\n" +
            "  r186608186:\n" +
            "    one: This is 1 test\n" +
            "    other: 'There are %{count} tests'\n";

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    }
};