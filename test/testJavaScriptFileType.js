/*
 * testJavaScriptFileTypeType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../lib/JavaScriptFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJavaScriptFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTemplatesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foojs"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foohtml.haml"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesTemplateFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("footmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.js"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleHamlAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.html.haml"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));
        
        test.done();
    }
};