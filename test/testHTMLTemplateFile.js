/*
 * testHTMLTemplateFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!HTMLTemplateFile) {
    var HTMLTemplateFile = require("../lib/HTMLTemplateFile.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testHTMLTemplateFileConstructor: function(test) {
        test.expect(1);

        var j = new HTMLTemplateFile();
        test.ok(j);
        
        test.done();
    },
    
    testHTMLTemplateFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p, "./testfiles/tmpl/CookieFlowConciergeTemplate.tmpl.html");
        
        test.ok(j);
        
        test.done();
    },

    testHTMLTemplateFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        test.done();
    },

    testHTMLTemplateFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        test.equal(j.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html><body>This is a test</body></html>');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.get("This is a test");
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html><body>This is a test</body></html>');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' + 
        		'<body>\n' +
        		'     This is a test    \n' +
        		'</body>\n' + 
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },


    testHTMLTemplateFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('<html><body>This is a test</body></html>');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHTMLTemplateFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        
        test.done();
    },

    testHTMLTemplateFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHTMLTemplateFileExtractFile: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p, "./tmpl/CookieFlowConciergeTemplate.tmpl.html");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("Get doctor answers for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get doctor answers for free!");
        test.equal(r.getKey(), "Get doctor answers for free!");
       
        test.done();
    },
    
    testHTMLTemplateFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p, "./tmpl/bogus.tmpl.html");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    }
};