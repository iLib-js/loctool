/*
 * testYaml.js - test the Yaml object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!YamlFile) {
	var YamlFile = require("../lib/YamlFile.js");
    var ResourceString = require("../lib/ResourceString.js");
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
        	sourceLocale: "en-US"
        }, "./testfiles");

        var y = new YamlFile({
            project: p,
        	pathName: "a/b/en-US.yml"
        });
        test.ok(y);
        
        test.equal(y.getPath(), "a/b/en-US.yml");

        test.done();
    },
    
    testYamlGetPath: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
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
        	id: "ht-iosapp",
			sourceLocale: "en-US"
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
        test.expect(22);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
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
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(), 
        		'Completing an internship at HealthTap gives you the opportunity to experience innovation\n' +
        		'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
        		'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "feelgood/foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at HealthTap");
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "feelgood/foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "foo/bar/asdf");

        test.done();
    },

    testYamlFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse('---\n' +
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
        	id: "ht-iosapp",
			sourceLocale: "en-US"
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
        	id: "ht-iosapp",
			sourceLocale: "en-US"
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
        	id: "ht-iosapp",
			sourceLocale: "en-US"
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
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./asdf.yml",
        	locale: "de-DE"
        });
        test.ok(yml);
        
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source_text",
        		source: "Quellen\"text",
        		comment: "foo"
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more_source_text",
        		source: "mehr Quellen\"text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        test.equal(yml.getContent(),
        	'de_DE:\n' +
        	'    source_text: \'Quellen\"text\'\n' +
        	'    more_source_text: \'mehr Quellen\"text\'\n'
        );
        
        test.done();
    },
    
    testYamlFileGetContentComplicated: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN"
        });
        test.ok(yml);
        
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "• &amp;nbsp; Address a health or healthy living topic",
        		source: "• &amp;nbsp; 解决健康生活相关的话题",
        		comment: " "
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "&apos;&#41;, url&#40;imgs/masks/top_bar",
        		source: "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        test.equal(yml.getContent(),
        	"zh_Hans_CN:\n" +
        	"    '• &amp;nbsp; Address a health or healthy living topic': '• &amp;nbsp; 解决健康生活相关的话题'\n" +
        	"    '&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n"
        );
        
        test.done();
    },

    testYamlFileGetContentWithNewlines: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./zh.yml",
        	locale: "zh-Hans-CN"
        });
        test.ok(yml);
        
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "short key",
        		source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
        		comment: " "
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "zh-Hans-CN",
        		key: "A very long key that happens to have \n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.",
        		source: "short text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        test.equal(yml.getContent(),
        	"zh_Hans_CN:\n" +
        	"    'short key': \"this is text that is relatively long and can run past the end of the page\\nSo, we put a new line in the middle of it.\"\n" +
        	"    \"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": 'short text'\n"
        );
        
        test.done();
    },

    testYamlFileGetContentEmpty: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./asdf.yml",
        	locale: "de-DE"
        });
        test.ok(yml);
        
        test.equal(yml.getContent(), '');
        
        test.done();
    },

    testYamlFileRealContent: function(test) {
        test.expect(5);

        var p = new WebProject({
        	id: "ht-webapp12",
			sourceLocale: "en-US"
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
        
        var r = set.get(ResourceString.hashKey("ht-webapp12", "en-US", "Dr._Livingston_serves_on_the_Medical_Advisory_Board_for_HealthTap_and_he_is_the_Chief_Medical_officer_for_Healthcare_Transformation_Solutions._He_is_on_Twitter_as_@macobgyn_and_is_an_active_doctor_blogger."));
        test.ok(r);
        
        test.equal(r.getSource(), "Dr. Livingston serves on the Medical Advisory Board for HealthTap and he is the Chief Medical officer for Healthcare Transformation Solutions. He is on Twitter as @macobgyn and is an active doctor blogger.");
        test.equal(r.getKey(), "Dr._Livingston_serves_on_the_Medical_Advisory_Board_for_HealthTap_and_he_is_the_Chief_Medical_officer_for_Healthcare_Transformation_Solutions._He_is_on_Twitter_as_@macobgyn_and_is_an_active_doctor_blogger.");
        
        test.done();
    }
};