/*
 * testIosStringsFile.js - test the Objective C file handler object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!IosStringsFile) {
    var IosStringsFile = require("../lib/IosStringsFile.js");
    var IosStringsFileType = require("../lib/IosStringsFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

var p = new ObjectiveCProject({
	id: "iosapp",
	sourceLocale: "en-US"
}, "./testfiles", {
	locales:["en-GB"],
	flavors: ["chocolate", "vanilla"]
});

var isft = new IosStringsFileType(p);

module.exports = {
    testIosStringsFileConstructor: function(test) {
        test.expect(1);

        var strings = new IosStringsFile();
        test.ok(strings);

        test.done();
    },

    testIosStringsFileConstructorParams: function(test) {
        test.expect(1);

        var strings = new IosStringsFile({
            project: p,
            type: isft
        }, "./testfiles/objc/Base.lproj/Localizable.strings");

        test.ok(strings);

        test.done();
    },

    testIosStringsFileConstructorNoFile: function(test) {
        test.expect(1);

        var strings = new IosStringsFile({
            project: p,
            type: isft
        });
        test.ok(strings);

        test.done();
    },

    testIosStringsFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        test.ok(strings);

        var set = strings.getTranslationSet();
        test.equal(set.size(), 0);

        strings.parse('/* i18n: this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a driver?";');
        
        test.ok(set);

        test.equal(set.size(), 2);

        test.done();
    },

    testIosStringsFileParseMultiple: function(test) {
        test.expect(10);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        test.ok(strings);

        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a driver?";');
       
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
        test.equal(r[0].getSource(), "Are you a driver?");
        test.equal(r[0].getKey(), "MFI-qx-pQf.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf";');

        test.done();
    },

    testIosStringsFileExtractFile: function(test) {
        test.expect(14);

        var strings = new IosStringsFile({
        	project: p,
			type: isft, 
        	pathName: "./objc/en-US.lproj/SignUpViewController.strings"
        });
        test.ok(strings);

        // should read the file
        strings.extract();

        var set = strings.getTranslationSet();

        test.equal(set.size(), 14);

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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/Localizable.strings"
        });
        test.ok(strings);

        // should read the file
        strings.extract();

        var set = strings.getTranslationSet();

        test.equal(set.size(), 21);

        var r = set.getBy({
        	reskey: "%@ (%ld yrs)"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%1$@ (%2$ld yrs)");
        test.equal(r[0].getKey(), "%@ (%ld yrs)");
        test.ok(!r[0].getComment());

        var r = set.getBy({
        	reskey: "$%@ regularly"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "$%@ regularly");
        test.equal(r[0].getKey(), "$%@ regularly");
        test.ok(!r[0].getComment());

        var r = set.getBy({
        	reskey: "%@ and "
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%@ and ");
        test.equal(r[0].getKey(), "%@ and ");
        test.ok(!r[0].getComment());

        test.done();
    },

    testIosStringsFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);

        [
        	new ResourceString({
        		project: "iosapp",
        		key: "source text",
				source: "source text",
				sourceLocale: "en-US",
				target: "Quellen\"text",
				targetLocale: "de-DE",
                comment: "foo"
        	}),
        	new ResourceString({
        		project: "iosapp",
        		key: "more source text",
				source: "more source text",
				sourceLocale: "en-US",
				target: "mehr Quellen\"text",
				targetLocale: "de-DE",
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

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);

        [
            new ResourceString({
                project: "iosapp",
                targetLocale: "de-DE",
                key: "source text",
				source: "source text",
				sourceLocale: "en-US",
				target: "Quellen\n\ttext",
                comment: "foo"
            }),
            new ResourceString({
                project: "iosapp",
                targetLocale: "de-DE",
                key: "more source text",
				source: "more source text",
				sourceLocale: "en-US",
				target: "mehr Quellen\"text",
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

    testIosStringsFileGetContentWithEscapedSourceChars: function(test) {
        test.expect(2);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);

        [
            new ResourceString({
                project: "iosapp",
                targetLocale: "de-DE",
                key: "source\\ntext",
				source: "source\\ntext",
				sourceLocale: "en-US",
				target: "Quellen text",
                comment: "foo",
                datatype: "x-swift"
            }),
            new ResourceString({
                project: "iosapp",
                targetLocale: "de-DE",
                key: "more source\\ntext",
				source: "more source\\ntext",
				sourceLocale: "en-US",
				target: "mehr Quellen text",
                comment: "bar",
                datatype: "x-swift"
            }),
            new ResourceString({
                project: "iosapp",
                targetLocale: "de-DE",
                key: "2V9-YN-vxb.normalTitlet",
				source: "2V9-YN-vxb.normalTitlet",
				sourceLocale: "en-US",
				target: "noch mehr Quellen text",
                comment: "bar",
                datatype: "x-xib"
            })
        ].forEach(function(res) {
            strings.addResource(res);
        });

        var expected = 
            '/* bar */\n' +
            '"2V9-YN-vxb.normalTitlet" = "noch mehr Quellen text";\n\n' +
            '/* bar */\n' +
            '"more source\\ntext" = "mehr Quellen text";\n\n' +
            '/* foo */\n' +
            '"source\\ntext" = "Quellen text";\n';
        var actual = strings.getContent();
        test.equal(actual, expected);

        test.done();
    },

    testIosStringsFileGetContentWithMultipleEscapedQuotes: function(test) {
        test.expect(2);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/es.lproj/asdf.strings"
        });
        test.ok(strings);

        [
            new ResourceString({
                project: "iosapp",
                targetLocale: "es-US",
                key: "“The future of technology is at your fingertips.”",
				source: "“The future of technology is at your fingertips.”",
				sourceLocale: "en-US",
				target: '"El futuro de la tecnología está al alcance de tus dedos."',
                comment: "bar"
            })
        ].forEach(function(res) {
            strings.addResource(res);
        });

        test.equal(strings.getContent(),
        	'/* bar */\n' +
        	'"“The future of technology is at your fingertips.”" = "\\\"El futuro de la tecnología está al alcance de tus dedos.\\\"";\n'
        );

        test.done();
    },

    testIosStringsFileGetContentEmpty: function(test) {
        test.expect(2);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);

        test.equal(strings.getContent(), '');

        test.done();
    },

    testIosStringsFileGetContentRoundTrip: function(test) {
        test.expect(2);

        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);

        strings.parse('/* this is the terms and conditions button label */\n' +
                '"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
                '/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
                '"MFI-qx-pQf.text" = "Are you a driver?";\n');

        var x = strings.getContent();
        var y =
            '/* this is the terms and conditions button label */\n' +
            '"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
            '/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
            '"MFI-qx-pQf.text" = "Are you a driver?";\n';

        test.equal(x, y);
        test.done();
    },

    testIosStringsFileReadFlavorFile: function(test) {
        test.expect(17);

        var strings = new IosStringsFile({
        	project: p,
			type: isft, 
        	pathName: "./objc/en-US.lproj/chocolate.strings"
        });
        
        test.ok(strings);
        
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getAll();
        test.ok(r);
        
        test.equal(r[0].getSource(), "Are you an existing customer?");
        test.equal(r[0].getSourceLocale(), "en-US");
        test.ok(!r[0].getTargetLocale());
        test.equal(r[0].getKey(), "F5h-fB-tt5.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "Are you a member?"; ObjectID = "F5h-fB-tt5";');
        test.equal(r[0].getFlavor(), "chocolate");
        test.equal(r[0].getPath(), "./objc/en-US.lproj/chocolate.strings");

        test.equal(r[1].getSource(), "Are you connected to a customer?");
        test.equal(r[1].getSourceLocale(), "en-US");
        test.ok(!r[1].getTargetLocale());
        test.equal(r[1].getKey(), "MFI-qx-pQf.text");
        test.equal(r[1].getComment(), 'Class = "UILabel"; text = "Are you a friend?"; ObjectID = "MFI-qx-pQf";');
        test.equal(r[1].getFlavor(), "chocolate");
        test.equal(r[1].getPath(), "./objc/en-US.lproj/chocolate.strings");
        
        test.done();
    }
};
