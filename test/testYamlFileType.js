/*
 * testYamlFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!YamlFileType) {
    var YamlFileType = require("../lib/YamlFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testYamlFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        
        test.ok(yft);
        
        test.done();
    },

    testYamlFileTypeHandlesYml: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(yft.handles("foo.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("foo.tmpl.html"));
        test.ok(!yft.handles("foo.html.haml"));
        test.ok(!yft.handles("foo.js"));

        test.done();
    },

    testYamlFileTypeHandlesNoResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/en-US.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesNoFilesNamedForALocale: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("en-US.yml"));
        test.ok(!yft.handles("de-DE.yml"));
        test.ok(!yft.handles("en.yml"));

        test.done();
    },

    testYamlFileTypeHandlesNoFilesNamedForALocaleInASubdir: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("a/b/en-US.yml"));
        test.ok(!yft.handles("c/d/de-DE.yml"));
        test.ok(!yft.handles("e/f/en.yml"));

        test.done();
    },

    testYamlFileTypeHandlesFilesAlmostNamedForALocale: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var yft = new YamlFileType(p);
        test.ok(yft);

        test.ok(yft.handles("config/states.yml"));

        test.done();
    },

    testYamlFileTypeHandlesNoResourceFilesInSubdirs: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/auto/en-US.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesNoBaseResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/en.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesIncludeFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(yft.handles("config/nofications.yml"));
        
        test.done();
    }
};