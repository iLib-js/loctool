/*
 * testYaml.js - test the Yaml object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!YamlFile) {
	var YamlFile = require("../lib/YamlFile.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var WebProject =  require("../lib/WebProject.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
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

module.exports = {
    testYamlConstructorEmpty: function(test) {
        test.expect(1);

        var y = new YamlFile();
        test.ok(y);

        test.done();
    },

    testYamlConstructorFull: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
        	pathName: "x/y/en-US.yml"
        });
        test.ok(y);

        test.equal(y.getPath(), "x/y/en-US.yml");

        test.done();
    },

    testYamlGetPath: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var y = new YamlFile({
        	project: p,
            pathName: "foo/bar/x.yml"
        });
        test.ok(y);

        test.equal(y.getPath(), "foo/bar/x.yml");

        test.done();
    },

    testYamlFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
			project: p
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

    testYamlFileParseWithSubkeys: function(test) {
        test.expect(28);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
			project: p
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

    testYamlFileParseWithLocaleAndSubkeys: function(test) {
        test.expect(28);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);

        yml.parse(
        		'---\n' +
        		"zh_Hans_CN:\n" +
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

        // locale is not special for this type of yml file, so it should appear in the context
        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getLocale(), "en-US");
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "zh_Hans_CN@feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getLocale(), "en-US");
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "zh_Hans_CN@feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(),
        		'Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getLocale(), "en-US");
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "zh_Hans_CN@feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at HealthTap");
        test.equal(r[3].getLocale(), "en-US");
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "zh_Hans_CN@feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getLocale(), "en-US");
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "zh_Hans_CN@feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getLocale(), "en-US");
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "zh_Hans_CN@foo@bar@asdf");

        test.done();
    },

    testYamlFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse(
        		'Working_at_HealthTap: Working at HealthTap\n' +
        		'Jobs: Jobs\n' +
        		'Our_internship_program: Our internship program\n' +
        		'? Completing_an_internship_at_HealthTap_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
        		': Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'  directly from experienced, successful entrepreneurs.\n');

        test.ok(set);

        test.equal(set.size(), 4);

        test.done();
    },

    testYamlFileExtractFile: function(test) {
        test.expect(14);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./test.yml"
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

    testYamlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./objc/en.lproj/asdf.yml"
        });
        test.ok(yml);

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileGetContent: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./asdf.yml",
        	locale: "de-DE"
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

        diff(yml.getContent(),
    		'source_text: Quellen\"text\n' +
        	'more_source_text: mehr Quellen\"text\n'
        );

        test.equal(yml.getContent(),
        	'source_text: Quellen\"text\n' +
        	'more_source_text: mehr Quellen\"text\n'
        );

        test.done();
    },

    testYamlFileGetContentComplicated: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN"
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

        diff(yml.getContent(),
            	"• &amp;nbsp; Address a health or healthy living topic: • &amp;nbsp; 解决健康生活相关的话题\n" +
            	"'&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n"
    	    );

        test.equal(yml.getContent(),
        	"• &amp;nbsp; Address a health or healthy living topic: • &amp;nbsp; 解决健康生活相关的话题\n" +
        	"'&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n"
        );

        test.done();
    },

    testYamlFileGetContentWithNewlines: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN"
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

        diff(yml.getContent(),
	    	"short key: |-\n" +
	    	"  this is text that is relatively long and can run past the end of the page\n" +
	    	"  So, we put a new line in the middle of it.\n" +
	    	"\"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n"
	    );

        test.equal(yml.getContent(),
	    	"short key: |-\n" +
	    	"  this is text that is relatively long and can run past the end of the page\n" +
	    	"  So, we put a new line in the middle of it.\n" +
	    	"\"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n"
        );

        test.done();
    },

    testYamlFileGetContentWithSubkeys: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN"
        });
        test.ok(yml);

        [
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "key1",
        		source: "medium length text that doesn't go beyond one line",
        		context: "foo@bar",
        		comment: " "
        	}),
        	new ContextResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "key2",
        		source: "short text",
        		context: "foo@bar@asdf",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });

        diff(yml.getContent(),
	    	"foo:\n" +
	    	"  bar:\n" +
	    	"    key1: medium length text that doesn't go beyond one line\n" +
	    	"    asdf:\n" +
	    	"      key2: short text\n"
	    );

        test.equal(yml.getContent(),
	    	"foo:\n" +
	    	"  bar:\n" +
	    	"    key1: medium length text that doesn't go beyond one line\n" +
	    	"    asdf:\n" +
	    	"      key2: short text\n"
        );

        test.done();
    },

    testYamlFileGetContentEmpty: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./asdf.yml",
        	locale: "de-DE"
        });
        test.ok(yml);

        test.equal(yml.getContent(), '{}\n');

        test.done();
    },

    testYamlFileRealContent: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./test.yml",
        	locale: "en-US"
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

    testYamlFileRealContent2: function(test) {
        test.expect(7);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./test2.yml",
        	locale: "en-US"
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

    testYamlFileAtInKeyName: function(test) {
        test.expect(7);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./test2.yml",
        	locale: "en-US"
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

    testYamlFileRightResourceType: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US",
        	resourceDirs: {
        		yml: "a/b"
        	}
        }, "./testfiles");

        var yml = new YamlFile({
        	project: p,
        	pathName: "./test2.yml",
        	locale: "en-US"
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

    testYamlFileParseIgnoreNonStringValues: function(test) {
    	test.expect(20);

    	var p = new WebProject({
    		id: "ht-webapp12",
    		sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
    	}, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

    	yml.parse(
			'---\n' +
			'expert_license_expired:\n' +
			'  subject: "ALERT: Your %1 license has expired"\n' +
			'  body: \'Add your updated license information to resume helping patients without further disruption.\'\n' +
			'  ctoa: \'Update license info\'\n' +
			'  push_data: "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption"\n' +
			'  global_link: doctor_settings_prime\n' +
			'  sms_data: ""\n' +
			'  setting_name: expert_license_updates\n' +
			'  daily_limit_exception_email: true\n' +
			'  night_blackout: true\n'
    	);

    	var set = yml.getTranslationSet();
    	test.ok(set);

    	var r = set.getAll();
    	test.ok(r);

    	test.equal(r.length, 4);

    	test.equal(r[0].getSource(), "ALERT: Your %1 license has expired");
    	test.equal(r[0].getLocale(), "en-US");
    	test.equal(r[0].getKey(), "subject");
    	test.equal(r[0].getContext(), "expert_license_expired");

    	test.equal(r[1].getSource(), "Add your updated license information to resume helping patients without further disruption.");
    	test.equal(r[1].getLocale(), "en-US");
    	test.equal(r[1].getKey(), "body");
    	test.equal(r[1].getContext(), "expert_license_expired");

    	test.equal(r[2].getSource(), 'Update license info');
    	test.equal(r[2].getLocale(), "en-US");
    	test.equal(r[2].getKey(), "ctoa");
    	test.equal(r[2].getContext(), "expert_license_expired");

    	test.equal(r[3].getSource(), "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption");
    	test.equal(r[3].getLocale(), "en-US");
    	test.equal(r[3].getKey(), "push_data");
    	test.equal(r[3].getContext(), "expert_license_expired");

    	test.done();
    },

    testYamlFileParseIgnoreStringLikeIdValues: function(test) {
    	test.expect(4);

    	var p = new WebProject({
    		id: "ht-webapp12",
    		sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
    	}, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

    	yml.parse(
			'---\n' +
			'expert_license_expired:\n' +
			'  subject: "ALERT: Your %1 license has expired"\n' +
			'  body: \'Add your updated license information to resume helping patients without further disruption.\'\n' +
			'  ctoa: \'Update license info\'\n' +
			'  push_data: "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption"\n' +
			'  global_link: doctor_settings_prime\n' +
			'  sms_data: ""\n' +
			'  setting_name: expert_license_updates\n' +
			'  daily_limit_exception_email: true\n' +
			'  night_blackout: true\n'
    	);

    	var set = yml.getTranslationSet();
    	test.ok(set);

    	var r = set.getBy({
    		reskey: "global_link"
    	});
    	test.ok(r);
    	test.equal(r.length, 0);

    	test.done();
    },

    testYamlFileParseIgnoreBooleanValues: function(test) {
    	test.expect(4);

    	var p = new WebProject({
    		id: "ht-webapp12",
    		sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
    	}, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

    	yml.parse(
			'---\n' +
			'expert_license_expired:\n' +
			'  subject: "ALERT: Your %1 license has expired"\n' +
			'  body: \'Add your updated license information to resume helping patients without further disruption.\'\n' +
			'  ctoa: \'Update license info\'\n' +
			'  push_data: "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption"\n' +
			'  global_link: doctor_settings_prime\n' +
			'  sms_data: ""\n' +
			'  setting_name: expert_license_updates\n' +
			'  daily_limit_exception_email: true\n' +
			'  night_blackout: true\n'
    	);

    	var set = yml.getTranslationSet();
    	test.ok(set);

    	var r = set.getBy({
    		reskey: "night_blackout"
    	});
    	test.ok(r);
    	test.equal(r.length, 0);

    	test.done();
    },

    testYamlFileParseIgnoreEmptyValues: function(test) {
    	test.expect(4);

    	var p = new WebProject({
    		id: "ht-webapp12",
    		sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
    	}, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

    	yml.parse(
			'---\n' +
			'expert_license_expired:\n' +
			'  subject: "ALERT: Your %1 license has expired"\n' +
			'  body: \'Add your updated license information to resume helping patients without further disruption.\'\n' +
			'  ctoa: \'Update license info\'\n' +
			'  push_data: "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption"\n' +
			'  global_link: doctor_settings_prime\n' +
			'  sms_data: ""\n' +
			'  setting_name: expert_license_updates\n' +
			'  daily_limit_exception_email: true\n' +
			'  night_blackout: true\n'
    	);

    	var set = yml.getTranslationSet();
    	test.ok(set);

    	var r = set.getBy({
    		reskey: "sms_data"
    	});
    	test.ok(r);
    	test.equal(r.length, 0);

    	test.done();
    },

    testYamlFileParseIgnoreEmptyValues: function(test) {
    	test.expect(4);

    	var p = new WebProject({
    		id: "ht-webapp12",
    		sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
    	}, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

    	yml.parse(
			'---\n' +
			'expert_license_expired:\n' +
			'  subject: "ALERT: Your %1 license has expired"\n' +
			'  body: \'Add your updated license information to resume helping patients without further disruption.\'\n' +
			'  ctoa: \'Update license info\'\n' +
			'  push_data: "ALERT: Your %1 license has expired. Add your updated license information to resume helping patients without further disruption"\n' +
			'  global_link: doctor_settings_prime\n' +
			'  sms_data: ""\n' +
			'  expert_campaign: 2\n' +
			'  setting_name: expert_license_updates\n' +
			'  daily_limit_exception_email: true\n' +
			'  night_blackout: true\n'
    	);

    	var set = yml.getTranslationSet();
    	test.ok(set);

    	var r = set.getBy({
    		reskey: "expert_campaign"
    	});
    	test.ok(r);
    	test.equal(r.length, 0);

    	test.done();
    },

    testYamlFileLocalizeText: function(test) {
        test.expect(7);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
        }, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

        yml.parse(
			'doctor_thanked_note_life_saved:\n' +
			'  email_subject: \'%1, you’re saving lives!\'\n' +
			'  subject: You’ve been thanked for saving a life!\n' +
			'  body: “%1”\n' +
			'  ctoa: View %1\n' +
			'  push_data: You’ve saved a life! View %1\n' +
			'  global_link: generic_link\n' +
			'  setting_name: doctor_thanked_note_life_saved\n' +
			'  daily_limit_exception_email: true\n'
		);

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('%1, you’re saving lives!', "doctor_thanked_note_life_saved");
        test.ok(r);
        test.equal(r.getSource(), '%1, you’re saving lives!');
        test.equal(r.getKey(), 'email_subject');
        test.equal(r.getContext(), "doctor_thanked_note_life_saved");

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
        	project: "ht-webapp12",
        	context: "doctor_thanked_note_life_saved",
        	key: 'email_subject',
        	source: '%1, vous sauvez des vides!',
        	locale: "fr-FR",
        	datatype: "x-yaml"
        }));

        var actual = yml.localizeText(translations, "fr-FR");

        var expected =
			'doctor_thanked_note_life_saved:\n' +
			'  email_subject: \'%1, vous sauvez des vides!\'\n' +
			'  subject: You’ve been thanked for saving a life!\n' +
			'  body: “%1”\n' +
			'  ctoa: View %1\n' +
			'  push_data: You’ve saved a life! View %1\n' +
			'  global_link: generic_link\n' +
			'  setting_name: doctor_thanked_note_life_saved\n' +
			'  daily_limit_exception_email: true\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testYamlFileLocalizeTextMultiple: function(test) {
        test.expect(15);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
    		resourceDirs: {
    			yml: "a/b"
    		}
        }, "./testfiles");

    	var yml = new YamlFile({
    		project: p
    	});
    	test.ok(yml);

        yml.parse(
			'doctor_thanked_note_life_saved:\n' +
			'  email_subject: \'%1, you’re saving lives!\'\n' +
			'  subject: You’ve been thanked for saving a life!\n' +
			'  body: “%1”\n' +
			'  ctoa: View %1\n' +
			'  push_data: You’ve saved a life! View %1\n' +
			'  global_link: generic_link\n' +
			'  setting_name: doctor_thanked_note_life_saved\n' +
			'  daily_limit_exception_email: true\n'
		);

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('%1, you’re saving lives!', "doctor_thanked_note_life_saved");
        test.ok(r);
        test.equal(r.getSource(), '%1, you’re saving lives!');
        test.equal(r.getKey(), 'email_subject');
        test.equal(r.getContext(), "doctor_thanked_note_life_saved");

        r = set.getBySource('You’ve been thanked for saving a life!', "doctor_thanked_note_life_saved");
        test.ok(r);
        test.equal(r.getSource(), 'You’ve been thanked for saving a life!');
        test.equal(r.getKey(), 'subject');
        test.equal(r.getContext(), "doctor_thanked_note_life_saved");

        r = set.getBySource('You’ve saved a life! View %1', "doctor_thanked_note_life_saved");
        test.ok(r);
        test.equal(r.getSource(), 'You’ve saved a life! View %1');
        test.equal(r.getKey(), 'push_data');
        test.equal(r.getContext(), "doctor_thanked_note_life_saved");

        var translations = new TranslationSet();
        translations.addAll([
        	new ContextResourceString({
	        	project: "ht-webapp12",
	        	context: "doctor_thanked_note_life_saved",
	        	key: 'email_subject',
	        	source: '%1, vous sauvez des vies!',
	        	locale: "fr-FR",
	        	datatype: "x-yaml"
	        }),
        	new ContextResourceString({
	        	project: "ht-webapp12",
	        	context: "doctor_thanked_note_life_saved",
	        	key: 'subject',
	        	source: 'Vous avez été remercié pour sauver une vie!',
	        	locale: "fr-FR",
	        	datatype: "x-yaml"
	        }),
        	new ContextResourceString({
	        	project: "ht-webapp12",
	        	context: "doctor_thanked_note_life_saved",
	        	key: 'push_data',
	        	source: 'Vous avez sauvé une vie! Voir %1',
	        	locale: "fr-FR",
	        	datatype: "x-yaml"
	        }),
	    ]);

        var actual = yml.localizeText(translations, "fr-FR");

        var expected =
			'doctor_thanked_note_life_saved:\n' +
			'  email_subject: \'%1, vous sauvez des vies!\'\n' +
			'  subject: Vous avez été remercié pour sauver une vie!\n' +
			'  body: “%1”\n' +
			'  ctoa: View %1\n' +
			'  push_data: Vous avez sauvé une vie! Voir %1\n' +
			'  global_link: generic_link\n' +
			'  setting_name: doctor_thanked_note_life_saved\n' +
			'  daily_limit_exception_email: true\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testYamlGetSchemaPath: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "foo/bar/x.yml"
        });
        test.ok(y);

        test.equal(y.getSchemaPath(), "foo/bar/x-schema.json");

        test.done();
    },

    testYamlGetSchemaPathNoFile: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p
        });
        test.ok(y);

        test.equal(y.getSchemaPath(), undefined);

        test.done();
    },

    testYamlExtractSchemaFile: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        test.notEqual(y.getSchema(), undefined);
        test.done();
    },

    testYamlGetExcludedKeysFromSchema: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getExcludedKeysFromSchema().length, 1);
        test.equal(y.getExcludedKeysFromSchema()[0], 'do_not_read_me');
        test.done();
    },

    testYamlGetExcludedKeysFromSchemaWithoutSchema: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getSchema(), undefined);
        test.equal(y.getExcludedKeysFromSchema().length, 0);
        test.done();
    },

    testYamlParseExcludedKeys: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        var set = y.getTranslationSet();
        test.ok(set);
        test.equal(set.getBySource('b','title@read_me').getLocalize(), true);
        test.equal(set.getBySource('d','title@do_not_read_me').getLocalize(), false);
        test.done();
    },

    testYamlParseOutputFile: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        var outputFileContents =
            'title:\n' +
            '  read_me:\n' +
            '    a: f\n' +
            '  do_not_read_me:\n' +
            '    c: e\n';
        y.parseOutputFile(outputFileContents);
        var set = y.getTranslationSet();
        test.ok(set);
        //test.equal(set.getBySource('d', 'title@do_not_read_me'), undefined);
        var r = set.getBySource('d', 'title@do_not_read_me');
        test.ok(r);
        test.equal(r.getSource(), 'e');
        test.done();
    },

    testYamlGetLocalizedPathDefault: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.extract();
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/test2.yml');
        test.done();
    },

    testYamlUseLocalizedDirectoriesFromSchema: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.schema = {}
        y.schema['useLocalizedDirectories'] = false;
        test.equal(y.getUseLocalizedDirectoriesFromSchema(), false);
        test.done();
    },

    testYamlUseLocalizedDirectoriesFromSchemaWithoutSchema: function(test) {
        test.expect(3);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getSchema(), undefined);
        test.equal(y.getUseLocalizedDirectoriesFromSchema(), true);
        test.done();
    },

    testYamlGetLocalizedPathWithLocalizedDirectories: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        y.schema['useLocalizedDirectories'] = true;
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/test3.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithoutLocalizedDirectories: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        y.schema['useLocalizedDirectories'] = false;
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/test3.yml');
        test.done();
    },

    testYamlGetOutputFilenameForLocaleWithoutSchema: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test2.yml"
        });
        test.ok(y);
        test.equals(y.getOutputFilenameForLocale('de-DE'), './test2.yml');
        test.done();
    },

    testYamlGetOutputFilenameForLocaleWithSchema: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {};
        y.schema['outputFilenameMapping'] = {
            'de-DE': './de.yml'
        }
        test.equals(y.getOutputFilenameForLocale('de-DE'), './de.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithOutputFilenameMapping: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {};
        y.schema['outputFilenameMapping'] = {
            'de-DE': './de.yml'
        }
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/de.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithOutputFilenameMappingAndWithoutLocalizedDirectories: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: 1 // Do not remove this from the test, TranslationSet.remove requires it
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {
            'outputFilenameMapping': {
              'de-DE': './de.yml'
            },
            'useLocalizedDirectories': false
        }
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de.yml');
        test.done();
    },

    testYamlFileGetContentPlural: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "ht-webapp12",
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            },
            id: "foo"
        }, "./testfiles");

        var yml = new YamlFile({
            project: p,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        test.ok(yml);

        [
            new ResourcePlural({
                project: "foo",
                locale: "de-DE",
                key: "asdf",
                strings: {
                    "one": "This is singular",
                    "two": "This is double",
                    "few": "This is a different case"
                },
                pathName: "a/b/c.java",
                comment: "foobar foo",
                state: "accepted"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var expected = "" +
        "asdf:\n"+
        "  one: This is singular\n" +
        "  two: This is double\n" +
        "  few: This is a different case\n"

        diff(yml.getContent(),expected);

        test.equal(yml.getContent(), expected);

        test.done();
    }
};