/*
 * testHTMLTemplateFileTypeType.js - test the HTML template file type handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!HTMLTemplateFileTypeType) {
    var HTMLTemplateFileTypeType = require("../lib/HTMLTemplateFileTypeType.js");
    var WebProject =  require("../lib/WebProject.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

module.exports = {
    testHTMLTemplateFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testHTMLTemplateFileTypeHandlesTrue: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.tmpl.html"));
        
        test.done();
    },

    testHTMLTemplateFileTypeHandlesFalseCllose: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.tml"));
        
        test.done();
    },
    
    testHTMLTemplateFileTypeHandlesFalse: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testHTMLTemplateFileTypeHandlesTrueWithDir: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.tmpl.html"));
        
        test.done();
    }
};