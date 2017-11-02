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
    var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
    var ResourceString = require("../lib/ResourceString.js");
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

    testIosStringsFileTypeGetResourceFileEnglishGBXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })
        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/en-001.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileEnglishUSXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/en-US.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileChineseCNXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/zh-Hans.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileChineseHKXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);
        
        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hant-HK",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/zh-Hant.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileSpanishUSXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/es.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileEnglishNZXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-NZ",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/en-NZ.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileUnknownLocaleXIB: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "sv-SE",
            pathName: "src/myproduct/Base.lproj/Test.xib",
            datatype: istf.datatype
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "src/myproduct/sv.lproj/Test.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileEnglishUSObjc: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new ResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/en-US.lproj/Localizable.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileEnglishGBObjc: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new ResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/en-001.lproj/Localizable.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileChineseCNObjc: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/zh-Hans.lproj/Localizable.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileSpanishUSObjc: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new ResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Test.m",
            datatype: "x-objective-c"
        })

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/es.lproj/Localizable.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileEnglishGBFlavor: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "en-GB",
            pathName: "foo/en-US.lproj/QHC.strings",
            datatype: istf.datatype,
            flavor: "chocolate"
        });

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/en-001.lproj/chocolate.strings")
        
        test.done();
    },
    
    testIosStringsFileTypeGetResourceFileChineseCNFlavor: function(test) {
        test.expect(3);

        var p = new ObjectiveCProject({
            sourceLocale: "en-US",
            "resourceDirs": {
                "objc": "foo"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var istf = new IosStringsFileType(p);
        test.ok(istf);

        var res = new IosLayoutResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "foo/en-US.lproj/QHC.strings",
            datatype: istf.datatype,
            flavor: "chocolate"
        });

        var rf = istf.getResourceFile(res);
        test.ok(rf);
        
        test.equal(rf.getPath(), "foo/zh-Hans.lproj/chocolate.strings")
        
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
