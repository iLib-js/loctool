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
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        
        test.ok(yft);
        
        test.done();
    },

    testYamlFileTypeHandlesYml: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("foo.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"yml": "config"
        	}
        }, "./testfiles");
        
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
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/en-US.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesNoBaseResourceFiles: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("config/locales/en.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesNoResourceFilesWithPath: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"yml": "config/locales"
        	}
        }, "./testfiles");
        
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
        		"yml": "config"
        	},
        	includes: [
        		"config/notifications.yml",
        		"config/doctor_notification_setting_groups.yml",
        		"config/refinement_questions.yml",
        		"config/sso_errors.yml",
        		"config/symptom_triage_copy.yml",
        		"config/topic_meta.yml",
        		"config/triage_samples.yml",
        		"config/app_configs/language_display_name_en_us.yml"
        	]
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(yft.handles("config/nofications.yml"));
        
        test.done();
    },

    testYamlFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "de-DE",
        	resourceDirs: {
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);

        var yf = yft.getResourceFile("fr-FR");
        
        test.equal(yf.getLocale(), "fr-FR");

        test.done();
    },
    
    testYamlFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "de-DE",
        	resourceDirs: {
        		"yml": "config"
        	}
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);

        var yf1 = yft.getResourceFile("fr-FR");
        test.equal(yf1.getLocale(), "fr-FR");

        var yf2 = yft.getResourceFile("fr-FR");
        test.equal(yf2.getLocale(), "fr-FR");

        test.deepEqual(yf1, yf2);

        test.done();
    }
};