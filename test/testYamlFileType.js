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
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        
        test.ok(yft);
        
        test.done();
    },

    testYamlFileTypeHandlesYml: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("foo.yml"));
        
        test.done();
    },

    testYamlFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var yft = new YamlFileType(p);
        test.ok(yft);
        
        test.ok(!yft.handles("foo.tmpl.html"));
        test.ok(!yft.handles("foo.html.haml"));
        test.ok(!yft.handles("foo.js"));

        test.done();
    },
    
    testYamlFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "de-DE"
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
        	sourceLocale: "de-DE"
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