/*
 * IosStringsFile.test.js - test the Objective C file handler object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
describe("stringsfile", function() {
    test("IosStringsFileConstructor", function() {
        expect.assertions(1);
        var strings = new IosStringsFile();
        expect(strings).toBeTruthy();
    });
    test("IosStringsFileConstructorParams", function() {
        expect.assertions(1);
        var strings = new IosStringsFile({
            project: p,
            type: isft
        }, "./testfiles/objc/Base.lproj/Localizable.strings");
        expect(strings).toBeTruthy();
    });
    test("IosStringsFileConstructorNoFile", function() {
        expect.assertions(1);
        var strings = new IosStringsFile({
            project: p,
            type: isft
        });
        expect(strings).toBeTruthy();
    });
    test("IosStringsFileParseSimpleGetByKey", function() {
        expect.assertions(6);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        strings.parse('/* Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb"; */\n' +
                '"2V9-YN-vxb.normalTitle" = "Terms";\n');
        var set = strings.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "2V9-YN-vxb.normalTitle"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Terms");
        expect(r[0].getKey()).toBe("2V9-YN-vxb.normalTitle");
        expect(r[0].getComment()).toBe('Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb";');
    });
    test("IosStringsFileParseWithComment", function() {
        expect.assertions(6);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        strings.parse('/* this is the terms and conditions button label */\n' +
                '"2V9-YN-vxb.normalTitle" = "Terms";\n');
        var set = strings.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "2V9-YN-vxb.normalTitle"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Terms");
        expect(r[0].getKey()).toBe("2V9-YN-vxb.normalTitle");
        expect(r[0].getComment()).toBe("this is the terms and conditions button label");
    });
    test("IosStringsFileParseWithNonComment", function() {
        expect.assertions(6);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        strings.parse(
                '/* No comment provided by engineer. */\n' +
                '"Terms" = "Terms";\n');
        var set = strings.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Terms"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Terms");
        expect(r[0].getKey()).toBe("Terms");
        expect(!r[0].getComment()).toBeTruthy();
    });
    test("IosStringsFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(6);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        strings.parse('/*            this is the terms and conditions button label              */\n\n\n\n' +
                '          "2V9-YN-vxb.normalTitle"      \t =    \t "Terms"    ;     \n');
        var set = strings.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "2V9-YN-vxb.normalTitle"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Terms");
        expect(r[0].getKey()).toBe("2V9-YN-vxb.normalTitle");
        expect(r[0].getComment()).toBe("this is the terms and conditions button label");
    });
    test("IosStringsFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(0);
        strings.parse('/* i18n: this is the terms and conditions button label */\n' +
                '"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
                '/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
                '"MFI-qx-pQf.text" = "Are you a driver?";');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
    });
    test("IosStringsFileParseMultiple", function() {
        expect.assertions(10);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        strings.parse('/* this is the terms and conditions button label */\n' +
                '"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
                '/* Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf"; */\n' +
                '"MFI-qx-pQf.text" = "Are you a driver?";');
        var set = strings.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "2V9-YN-vxb.normalTitle"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Terms");
        expect(r[0].getKey()).toBe("2V9-YN-vxb.normalTitle");
        expect(r[0].getComment()).toBe("this is the terms and conditions button label");
        r = set.getBy({
            reskey: "MFI-qx-pQf.text"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Are you a driver?");
        expect(r[0].getKey()).toBe("MFI-qx-pQf.text");
        expect(r[0].getComment()).toBe('Class = "UILabel"; text = "Are you a driver?"; ObjectID = "MFI-qx-pQf";');
    });
    test("IosStringsFileExtractFile", function() {
        expect.assertions(14);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/en-US.lproj/SignUpViewController.strings"
        });
        expect(strings).toBeTruthy();
        // should read the file
        strings.extract();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(14);
        var r = set.getBy({
            reskey: "QCe-xG-x5k.normalTitle"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Login ›");
        expect(r[0].getKey()).toBe("QCe-xG-x5k.normalTitle");
        expect(r[0].getComment()).toBe('Class = "UIButton"; normalTitle = "Login ›"; ObjectID = "QCe-xG-x5k";');
        var r = set.getBy({
            reskey: "WpN-ro-7NU.placeholder"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Your email");
        expect(r[0].getKey()).toBe("WpN-ro-7NU.placeholder");
        expect(r[0].getComment()).toBe('Class = "UITextField"; placeholder = "Your email"; ObjectID = "WpN-ro-7NU";');
        var r = set.getBy({
            reskey: "DWd-6J-lLt.text"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource(), "free).toBe(private");
        expect(r[0].getKey()).toBe("DWd-6J-lLt.text");
        expect(r[0].getComment(), 'Class = "UILabel"; text = "free).toBe(private"; ObjectID = "DWd-6J-lLt";');
    });
    test("IosStringsFileExtractFileUnicodeFile", function() {
        expect.assertions(14);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/Localizable.strings"
        });
        expect(strings).toBeTruthy();
        // should read the file
        strings.extract();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(21);
        var r = set.getBy({
            reskey: "%@ (%ld yrs)"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("%1$@ (%2$ld yrs)");
        expect(r[0].getKey()).toBe("%@ (%ld yrs)");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "$%@ regularly"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("$%@ regularly");
        expect(r[0].getKey()).toBe("$%@ regularly");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "%@ and "
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("%@ and ");
        expect(r[0].getKey()).toBe("%@ and ");
        expect(!r[0].getComment()).toBeTruthy();
    });
    test("IosStringsFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            locale: "en-US"
        });
        expect(strings).toBeTruthy();
        // should attempt to read the file and not fail
        strings.extract();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("IosStringsFileExtractBogusFile", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/en-US.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
        // should attempt to read the file and not fail
        strings.extract();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("IosStringsFileGetContent", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
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
        expect(strings.getContent()).toBe('/* bar */\n' +
            '"more source text" = "mehr Quellen\\"text";\n\n' +
            '/* foo */\n' +
            '"source text" = "Quellen\\"text";\n'
        );
    });
    test("IosStringsFileGetContentWithEscapes", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
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
        expect(strings.getContent()).toBe('/* bar */\n' +
            '"more source text" = "mehr Quellen\\"text";\n\n' +
            '/* foo */\n' +
            '"source text" = "Quellen\\n\\ttext";\n'
        );
    });
    test("IosStringsFileGetContentWithEscapedSourceChars", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
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
        expect(actual).toBe(expected);
    });
    test("IosStringsFileGetContentWithMultipleEscapedQuotes", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/es.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
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
        expect(strings.getContent()).toBe('/* bar */\n' +
            '"“The future of technology is at your fingertips.”" = "\\\"El futuro de la tecnología está al alcance de tus dedos.\\\"";\n'
        );
    });
    test("IosStringsFileGetContentEmpty", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
        expect(strings.getContent()).toBe('');
    });
    test("IosStringsFileGetContentRoundTrip", function() {
        expect.assertions(2);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/de.lproj/asdf.strings"
        });
        expect(strings).toBeTruthy();
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
        expect(x).toBe(y);
    });
    test("IosStringsFileReadFlavorFile", function() {
        expect.assertions(17);
        var strings = new IosStringsFile({
            project: p,
            type: isft,
            pathName: "./objc/en-US.lproj/chocolate.strings"
        });
        expect(strings).toBeTruthy();
        strings.extract();
        var set = strings.getTranslationSet();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Are you an existing customer?");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(!r[0].getTargetLocale()).toBeTruthy();
        expect(r[0].getKey()).toBe("F5h-fB-tt5.text");
        expect(r[0].getComment()).toBe('Class = "UILabel"; text = "Are you a member?"; ObjectID = "F5h-fB-tt5";');
        expect(r[0].getFlavor()).toBe("chocolate");
        expect(r[0].getPath()).toBe("./objc/en-US.lproj/chocolate.strings");
        expect(r[1].getSource()).toBe("Are you connected to a customer?");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(!r[1].getTargetLocale()).toBeTruthy();
        expect(r[1].getKey()).toBe("MFI-qx-pQf.text");
        expect(r[1].getComment()).toBe('Class = "UILabel"; text = "Are you a friend?"; ObjectID = "MFI-qx-pQf";');
        expect(r[1].getFlavor()).toBe("chocolate");
        expect(r[1].getPath()).toBe("./objc/en-US.lproj/chocolate.strings");
    });
});
