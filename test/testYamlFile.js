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

    testYamlFileParseWithComment: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);
        
        yml.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
        test.done();
    },

    testYamlFileParseWithNonComment: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);
        
        yml.parse(
        		'/* No comment provided by engineer. */\n' +
				'"Terms" = "Terms";\n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "Terms"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "Terms");
        test.ok(!r[0].getComment());
        
        test.done();
    },

    testYamlFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);
        
        yml.parse('/*            this is the terms and conditions button label              */\n\n\n\n' +
				'          "2V9-YN-vxb.normalTitle"      \t =    \t "Terms"    ;     \n');
        
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
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

        yml.parse('/* i18n: this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
        
        test.ok(set);
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testYamlFileParseMultiple: function(test) {
        test.expect(10);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
			project: p
		});
        test.ok(yml);
        
        yml.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
       
        var set = yml.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
        r = set.getBy({
        	reskey: "MFI-qx-pQf.text"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Are you a doctor?");
        test.equal(r[0].getKey(), "MFI-qx-pQf.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf";');
        
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
        	pathName: "./objc/en.lproj/FGSignUpViewController.yml"
        });
        test.ok(yml);
        
        // should read the file
        yml.extract();
        
        var set = yml.getTranslationSet();
        
        test.equal(set.size(), 15);
        
        var r = set.getBy({
        	reskey: "QCe-xG-x5k.normalTitle"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Login ›");
        test.equal(r[0].getKey(), "QCe-xG-x5k.normalTitle");
        test.equal(r[0].getComment(), 'Class = "UIButton"; normalTitle = "Login ›"; ObjectID = "QCe-xG-x5k";');

        var r = set.getBy({
        	reskey: "WpN-ro-7NU.placeholder"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Your email");
        test.equal(r[0].getKey(), "WpN-ro-7NU.placeholder");
        test.equal(r[0].getComment(), 'Class = "UITextField"; placeholder = "Your email"; ObjectID = "WpN-ro-7NU";');
        
        var r = set.getBy({
        	reskey: "DWd-6J-lLt.text"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "free, private");
        test.equal(r[0].getKey(), "DWd-6J-lLt.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "free, private"; ObjectID = "DWd-6J-lLt";');

        test.done();
    },

    testYamlFileExtractFileUnicodeFile: function(test) {
        test.expect(14);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./objc/Localizable.yml"
        });
        test.ok(yml);
        
        // should read the file
        yml.extract();
        
        var set = yml.getTranslationSet();
        
        test.equal(set.size(), 42);
        
        var r = set.getBy({
        	reskey: "%@ %@your gratitude :)"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%1$@ %2$@your gratitude :)");
        test.equal(r[0].getKey(), "%@ %@your gratitude :)");
        test.ok(!r[0].getComment());

        var r = set.getBy({
        	reskey: "%@ added this checklist"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%@ added this checklist");
        test.equal(r[0].getKey(), "%@ added this checklist");
        test.equal(r[0].getComment(), 'parameter is a person name');
        
        var r = set.getBy({
        	reskey: "%@ commented on %@'s answer"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%1$@ commented on %2$@'s answer");
        test.equal(r[0].getKey(), "%@ commented on %@'s answer");
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
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.yml"
        });
        test.ok(yml);
        
        [
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellen\"text",
        		comment: "foo"
        	}),
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellen\"text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	yml.addResource(res);
        });
        
        test.equal(yml.getContent(),
        	'/* foo */\n' +
        	'"source text" = "Quellen\\"text";\n\n' +
        	'/* bar */\n' +
        	'"more source text" = "mehr Quellen\\"text";\n\n'
        );
        
        test.done();
    },
    
    testYamlFileGetContentEmpty: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.yml"
        });
        test.ok(yml);
        
        test.equal(yml.getContent(), '');
        
        test.done();
    },
    
    testYamlFileGetContentRoundTrip: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var yml = new YamlFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.yml"
        });
        test.ok(yml);
        
        yml.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";\n');
        
        var x = yml.getContent();
        var y = 
    		'/* this is the terms and conditions button label */\n' +
			'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
			'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
			'"MFI-qx-pQf.text" = "Are you a doctor?";\n\n';
        
        test.equal(yml.getContent(),
    		'/* this is the terms and conditions button label */\n' +
			'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
			'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
			'"MFI-qx-pQf.text" = "Are you a doctor?";\n\n'
        );
        
        test.done();
    },
};