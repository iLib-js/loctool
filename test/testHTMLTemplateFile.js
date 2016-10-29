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
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testHTMLTemplateFileSkipScript: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <head>\n' + 
        		'   <script>\n' +
        		'// comment text\n' +
        		'if (locales.contains[thisLocale]) {\n' +
        		'	document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
        		'}\n' +
        		'   </head>\n' + 
        		'   </script>\n' + 
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        var r = set.getBySource("// comment text");
        test.ok(!r);
        
        var r = set.getBySource("bar");
        test.ok(!r);
        
        test.equal(set.size(), 1);
        
        test.done();
    },
    
    testHTMLTemplateFileParseNonBreakingTags: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a <em>test</em> of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a <em>test</em> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <em>test</em> of the emergency parsing system.");
        test.equal(r.getKey(), "This is a <em>test</em> of the emergency parsing system.");
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsOutside: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");
                
        test.done();
    },

    testHTMLTemplateFileParseLocalizableTitle: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div title="This value is localizable">\n' + 
        		'           This is a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("This value is localizable");
        test.ok(r);
        test.equal(r.getSource(), "This value is localizable");
        test.equal(r.getKey(), "This value is localizable");
        
        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributes: function(test) {
        test.expect(11);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' + 
        		'       This is a test\n' +
        		'       <input type="text" placeholder="localizable placeholder here">\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("Alternate text");
        test.ok(r);
        test.equal(r.getSource(), "Alternate text");
        test.equal(r.getKey(), "Alternate text");
        
        r = set.getBySource("localizable placeholder here");
        test.ok(r);
        test.equal(r.getSource(), "localizable placeholder here");
        test.equal(r.getKey(), "localizable placeholder here");
        
        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.equal(r.getKey(), 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        
        r = set.getBySource("localizable title");
        test.ok(r);
        test.equal(r.getSource(), "localizable title");
        test.equal(r.getKey(), "localizable title");
        
        test.done();
    },

    testHTMLTemplateFileParseBreakBetweenTemplateTags: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <% if(doctor){ %>\n' +
                '           Consult\n' +
                '       <% } else { %>\n' +
                '           Get doctor answers for free!\n' +
                '       <% } %>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Consult');
        test.ok(r);
        test.equal(r.getSource(), 'Consult');
        test.equal(r.getKey(), 'Consult');
        
        r = set.getBySource("Get doctor answers for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get doctor answers for free!");
        test.equal(r.getKey(), "Get doctor answers for free!");
        
        test.done();
    },

    testHTMLTemplateFileParseDontBreakBetweenTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' + 
        		'       Dr. <%= family_name %> is not available.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Dr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Dr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Dr. <%= family_name %> is not available.');
                
        test.done();
    },

    testHTMLTemplateFileParseI18NComments: function(test) {
        test.expect(6);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new HTMLTemplateFile(p);
        test.ok(j);
        
        j.parse('<html>\n' +
        		'   <body>\n' +
        		'       <!-- i18n: this describes the text below -->\n' +
        		'       This is a test of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = j.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");
        test.equal(r.getComment(), "this describes the text below");
                
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
        
        test.equal(set.size(), 4);
        
        var r = set.getBySource("Get doctor answers for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get doctor answers for free!");
        test.equal(r.getKey(), "Get doctor answers for free!");
       
        r = set.getBySource("Consult");
        test.ok(r);
        test.equal(r.getSource(), "Consult");
        test.equal(r.getKey(), "Consult");

        r = set.getBySource("Send question");
        test.ok(r);
        test.equal(r.getSource(), "Send question");
        test.equal(r.getKey(), "Send question");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "Ask");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "Ask");

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
    },

};