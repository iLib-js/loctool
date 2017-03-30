/*
 * testIosStringsFile.js - test the Objective C file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!IosStringsFile) {
    var IosStringsFile = require("../lib/IosStringsFile.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

module.exports = {
    testIosStringsFileConstructor: function(test) {
        test.expect(1);

        var strings = new IosStringsFile();
        test.ok(strings);
        
        test.done();
    },
    
    testIosStringsFileConstructorParams: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile(p, "./testfiles/objc/Base.lproj/Localizable.strings");
        
        test.ok(strings);
        
        test.done();
    },

    testIosStringsFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        test.done();
    },

    testIosStringsFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb"; */\n' +
        		'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = strings.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), 'Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb";');
        
        test.done();
    },

    testIosStringsFileParseWithComment: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = strings.getTranslationSet();
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

    testIosStringsFileParseWithNonComment: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse(
        		'/* No comment provided by engineer. */\n' +
				'"Terms" = "Terms";\n');
        
        var set = strings.getTranslationSet();
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

    testIosStringsFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/*            this is the terms and conditions button label              */\n\n\n\n' +
				'          "2V9-YN-vxb.normalTitle"      \t =    \t "Terms"    ;     \n');
        
        var set = strings.getTranslationSet();
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
    
    testIosStringsFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);

        var set = strings.getTranslationSet();
        test.equal(set.size(), 0);

        strings.parse('/* i18n: this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
        
        test.ok(set);
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testIosStringsFileParseMultiple: function(test) {
        test.expect(10);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
       
        var set = strings.getTranslationSet();
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

    testIosStringsFileExtractFile: function(test) {
        test.expect(14);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/en-US.lproj/FGSignUpViewController.strings"
        });
        test.ok(strings);
        
        // should read the file
        strings.extract();
        
        var set = strings.getTranslationSet();
        
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

    testIosStringsFileExtractFileUnicodeFile: function(test) {
        test.expect(14);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/Localizable.strings"
        });
        test.ok(strings);
        
        // should read the file
        strings.extract();
        
        var set = strings.getTranslationSet();
        
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
   
    testIosStringsFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        // should attempt to read the file and not fail
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testIosStringsFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/en-US.lproj/asdf.strings"
        });
        test.ok(strings);
        
        // should attempt to read the file and not fail
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    },
    
    testIosStringsFileGetContent: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);
        
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
        	strings.addResource(res);
        });
        
        test.equal(strings.getContent(),
        	'/* bar */\n' +
        	'"more source text" = "mehr Quellen\\"text";\n\n' +
        	'/* foo */\n' +
        	'"source text" = "Quellen\\"text";\n'
        );
        
        test.done();
    },

    testIosStringsFileGetContentWithEscapes: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);
        
        [
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellen\n\ttext",
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
        	strings.addResource(res);
        });
        
        test.equal(strings.getContent(),
        	'/* bar */\n' +
        	'"more source text" = "mehr Quellen\\"text";\n\n' +
        	'/* foo */\n' +
        	'"source text" = "Quellen\\n\\ttext";\n'
        );
        
        test.done();
    },

    testIosStringsFileGetContentWithMultipleEscapedQuotes: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/es.lproj/asdf.strings"
        });
        test.ok(strings);
        
        [
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "es-US",
        		key: "“The future of medicine is at your fingertips.”",
        		source: '"El futuro de la medicina está al alcance de tus dedos."',
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	strings.addResource(res);
        });
        
        test.equal(strings.getContent(),
        	'/* bar */\n' +
        	'"“The future of medicine is at your fingertips.”" = "\\\"El futuro de la medicina está al alcance de tus dedos.\\\"";\n'
        );
        
        test.done();
    },

    testIosStringsFileGetContentEmpty: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);
        
        test.equal(strings.getContent(), '');
        
        test.done();
    },
    
    testIosStringsFileGetContentRoundTrip: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);
        
        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";\n');
        
        var x = strings.getContent();
        var y = 
    		'/* this is the terms and conditions button label */\n' +
			'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
			'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
			'"MFI-qx-pQf.text" = "Are you a doctor?";\n';
        
        test.equal(strings.getContent(),
    		'/* this is the terms and conditions button label */\n' +
			'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
			'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
			'"MFI-qx-pQf.text" = "Are you a doctor?";\n'
        );
        
        test.done();
    }
};