/*
 * testYamlResourceFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
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
        	id: "ht-webapp12",
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
    
    testYamlResourceFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
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
    }
};