/*
 * testJavaScriptResourceFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptResourceFileType) {
    var JavaScriptResourceFileType = require("../lib/JavaScriptResourceFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJavaScriptResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testJavaScriptResourceFileTypeHandlesJS: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.js"));
        
        test.done();
    },

    testJavaScriptResourceFileTypeHandlesActualJSResFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("feelGood/localized_js/de-DE.js"));
        
        test.done();
    },

    testJavaScriptResourceFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.tmpl.html"));
        test.ok(!htf.handles("foo.html.haml"));
        test.ok(!htf.handles("foo.yml"));

        test.done();
    },
    
    testJavaScriptResourceFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "de-DE"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        var jsrf = htf.getResourceFile("fr-FR");
        
        test.equal(jsrf.getLocale(), "fr-FR");

        test.done();
    },
    
    testJavaScriptResourceFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "de-DE"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        var jsrf1 = htf.getResourceFile("fr-FR");
        test.equal(jsrf1.getLocale(), "fr-FR");

        var jsrf2 = htf.getResourceFile("fr-FR");
        test.equal(jsrf2.getLocale(), "fr-FR");

        test.deepEqual(jsrf1, jsrf2);

        test.done();
    }
};