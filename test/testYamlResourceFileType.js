/*
 * testYamlResourceFileType.js - test the HTML template file type handler object.
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

if (!YamlResourceFileType) {
    var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testYamlResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        
        test.ok(yrft);
        
        test.done();
    },

    testYamlResourceFileTypeHandlesYml: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        // not in the resource dir
        test.ok(!yrft.handles("foo.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        // not in the resource dir
        test.ok(!yrft.handles("foo.tmpl.html"));
        test.ok(!yrft.handles("foo.html.haml"));
        test.ok(!yrft.handles("foo.js"));

        test.done();
    },

    testYamlResourceFileTypeHandlesEnglishResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(yrft.handles("config/locales/en-US.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesBaseResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(yrft.handles("config/locales/en.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesSourceResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(yrft.handles("config/locales/en-US.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesNonEnglishResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {    
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(!yrft.handles("config/locales/zh-Hans-CN.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesNonResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(!yrft.handles("config/qaconfig.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeHandlesIncludeFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            },
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);
        
        test.ok(!yrft.handles("config/nofications.yml"));
        
        test.done();
    },

    testYamlResourceFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("fr-FR");
        
        test.equal(yrf.getLocale(), "fr-FR");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathFR: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("fr-FR");
        
        test.equal(yrf.getLocale(), "fr-FR");
        test.equal(yrf.getPath(), "config/locales/fr.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathZHCN: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("zh-Hans-CN");
        
        test.equal(yrf.getLocale(), "zh-Hans-CN");
        test.equal(yrf.getPath(), "config/locales/zh.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathZHHK: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("zh-Hant-HK");
        
        test.equal(yrf.getLocale(), "zh-Hant-HK");
        test.equal(yrf.getPath(), "config/locales/zh-Hant.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathESUS: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("es-US");
        
        test.equal(yrf.getLocale(), "es-US");
        test.equal(yrf.getPath(), "config/locales/es.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathESES: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("es-ES");
        
        test.equal(yrf.getLocale(), "es-ES");
        test.equal(yrf.getPath(), "config/locales/es-ES.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathENUS: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("en-US");
        
        test.equal(yrf.getLocale(), "en-US");
        test.equal(yrf.getPath(), "config/locales/en.yml");

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileRightPathENGB: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("en-GB");
        
        test.equal(yrf.getLocale(), "en-GB");
        test.equal(yrf.getPath(), "config/locales/en-GB.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileRightPathUnknown: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("ja-JP");
        
        test.equal(yrf.getLocale(), "ja-JP");
        test.equal(yrf.getPath(), "config/locales/ja.yml"); // should default to just the language tag

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "de-DE",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf1 = yrft.getResourceFile("fr-FR");
        test.equal(yrf1.getLocale(), "fr-FR");

        var yrf2 = yrft.getResourceFile("fr-FR");
        test.equal(yrf2.getLocale(), "fr-FR");

        test.deepEqual(yrf1, yrf2);

        test.done();
    },
    
    testYamlResourceFileTypeGetResourceFileWithFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("fr-FR", "CHOCOLATE");
        
        test.equal(yrf.getLocale(), "fr-FR");
        test.equal(yrf.getPath(), "config/locales/fr-FR-CHOCOLATE.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileENUSWithFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("en-US", "CHOCOLATE");
        
        test.equal(yrf.getLocale(), "en-US");
        test.equal(yrf.getPath(), "config/locales/en-US-CHOCOLATE.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileENHKWithFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("en-HK", "CHOCOLATE");
        
        test.equal(yrf.getLocale(), "en-HK");
        test.equal(yrf.getPath(), "config/locales/en-HK-CHOCOLATE.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileZHHKWithFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("zh-Hant-HK", "CHOCOLATE");
        
        test.equal(yrf.getLocale(), "zh-Hant-HK");
        test.equal(yrf.getPath(), "config/locales/zh-Hant-HK-CHOCOLATE.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileZHCNWithFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("zh-Hans-CN", "CHOCOLATE");
        
        test.equal(yrf.getLocale(), "zh-Hans-CN");
        test.equal(yrf.getPath(), "config/locales/zh-Hans-CN-CHOCOLATE.yml");

        test.done();
    },

    testYamlResourceFileTypeGetResourceFileWithNoFlavor: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales:["fr-FR"],
            flavors:["CHOCOLATE", "VANILLA"]
        });
        
        var yrft = new YamlResourceFileType(p);
        test.ok(yrft);

        var yrf = yrft.getResourceFile("fr-FR");
        
        test.equal(yrf.getLocale(), "fr-FR");
        test.equal(yrf.getPath(), "config/locales/fr.yml");

        test.done();
    }
};