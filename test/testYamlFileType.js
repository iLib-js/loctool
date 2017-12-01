/*
 * testYamlFileType.js - test the HTML template file type handler object.
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

    testYamlFileTypeHandlesNoFilesNamedForALocaleWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("en-ZA-DISCOVERY.yml"));

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

    testYamlFileTypeHandlesNoFilesNamedForALocaleWithFlavorInASubdir: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("a/b/en-ZA-DISCOVERY.yml"));

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

    testYamlFileTypeHandlesNoResourceFilesInSubdirsWithFlavors: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["DISCOVERY"]
        });
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/auto/en-ZA-DISCOVERY.yml"));
        
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