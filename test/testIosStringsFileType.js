/*
 * testIosStringsFileType.js - test the ios strings resource file type handler object
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

if (!IosStringsFileType) {
    var IosStringsFileType = require("../lib/IosStringsFileType.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
}

module.exports = {
    testIosStringsFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);

        test.ok(htf);

        test.done();
    },

    testIosStringsFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foostrings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testIosStringsFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/en-US.lproj/foo.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDir: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/en-US.lproj/SignUpViewController.strings"));
        test.ok(htf.handles("feelgood/en-US.lproj/GetHelpView.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesFalseWithNonEnglishLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/zh-Hans.lproj/SignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirLocStrings: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("feelgood/en-US.lproj/asdf.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirInResourceDir: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("feelgood/en-US.lproj/Localizable.strings"));
        test.ok(!htf.handles("feelgood/Base.lproj/Localizable.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/Base.lproj/SignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDir: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"objc": "feelgood"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/de.lproj/SignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithEnglishLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo/en-US.lproj/SignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithBaseLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo/Base.lproj/SignUpViewController.strings"));

        test.done();
    },

    testIosStringsFileTypeHandlesWithOtherLocaleDirNotInResources: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo/de.lproj/SignUpViewController.strings"));

        test.done();
    },
    
    testIosStringsFileTypeGetResourceFilePathObjc: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.equal(htf.getResourceFilePath("de-DE", "asdf/bar/SourceFile.m", "objc"), "testfiles/foo/de.lproj/Localizable.strings");

        test.done();
    },

    testIosStringsFileTypeGetResourceFilePathObjcSourceLocale: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.equal(htf.getResourceFilePath("en-US", "asdf/bar/SourceFile.m", "objc"), "testfiles/foo/en.lproj/Localizable.strings");

        test.done();
    },

    testIosStringsFileTypeGetResourceFilePathXib: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.equal(htf.getResourceFilePath("de-DE", "asdf/bar/en.lproj/SourceFile.xib", "xib"), "testfiles/asdf/bar/de.lproj/SourceFile.strings");

        test.done();
    },

    testIosStringsFileTypeGetResourceFilePathXibSourceLocale: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.equal(htf.getResourceFilePath("en-US", "asdf/bar/en.lproj/SourceFile.xib", "xib"), "testfiles/asdf/bar/en.lproj/SourceFile.strings");

        test.done();
    },

    testIosStringsFileTypeGetResourceFilePathXibUnknownLocale: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	sourceLocale: "en-US",
        	"resourceDirs": {
        		"objc": "foo"
        	}
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var htf = new IosStringsFileType(p);
        test.ok(htf);

        test.equal(htf.getResourceFilePath(undefined, "asdf/bar/en-US.lproj/SourceFile.xib", "xib"), "testfiles/asdf/bar/en.lproj/SourceFile.strings");

        test.done();
    },
    
};