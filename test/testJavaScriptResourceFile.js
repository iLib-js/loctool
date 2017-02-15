/*
 * testJavaScriptResourceFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptResourceFile) {
    var JavaScriptResourceFile = require("../lib/JavaScriptResourceFile.js");
    var WebProject = require("../lib/WebProject.js");
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports = {
    testJavaScriptResourceFileConstructor: function(test) {
        test.expect(1);

        var jsrf = new JavaScriptResourceFile();
        test.ok(jsrf);
        
        test.done();
    },
    
    testJavaScriptResourceFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/en-US.js",
        	locale: "en-US"
        });
        
        test.ok(jsrf);
        
        test.done();
    },

    testJavaScriptResourceFileIsDirty: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/de-DE.js",
        	locale: "de-DE"
        });
        
        test.ok(jsrf);
        test.ok(!jsrf.isDirty());
        
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellentext"     		
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellentext"
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "yet more source text",
        		source: "noch mehr Quellentext"
        	})
        ].forEach(function(res) {
        	jsrf.addResource(res);
        });
        
        test.ok(jsrf.isDirty());
        
        test.done();
    },

    testJavaScriptResourceFileRightContents: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/de-DE.js",
        	locale: "de-DE"
        });
        
        test.ok(jsrf);
        
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellentext"     		
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellentext"
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "yet more source text",
        		source: "noch mehr Quellentext"
        	})
        ].forEach(function(res) {
        	jsrf.addResource(res);
        });
        
        test.equal(jsrf.getContent(),
        	'ilib.data.strings_de_DE = {\n' +
        	'    "source text": "Quellentext",\n' +
        	'    "more source text": "mehr Quellentext",\n' +
        	'    "yet more source text": "noch mehr Quellentext"\n' +
        	'};\n'
        );
        
        test.done();
    },
    
    testJavaScriptResourceFileGetContentsNoContent: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/de-DE.js",
        	locale: "de-DE"
        });
        
        test.ok(jsrf);
                
        test.equal(jsrf.getContent(),
        	'ilib.data.strings_de_DE = {};\n'
        );
        
        test.done();
    },
    
    testJavaScriptResourceFileEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/de-DE.js",
        	locale: "de-DE"
        });
        
        test.ok(jsrf);
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellen\"text"     		
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellen\"text"
        	})
        ].forEach(function(res) {
        	jsrf.addResource(res);
        });
        
        test.equal(jsrf.getContent(),
        	'ilib.data.strings_de_DE = {\n' +
        	'    "source text": "Quellen\\"text",\n' +
        	'    "more source text": "mehr Quellen\\"text"\n' +
        	'};\n'
        );
        
        test.done();
    },
    
    testJavaScriptResourceFileDontEscapeSingleQuotes: function(test) {
        test.expect(2);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US",
        	resourceDirs: {
        		"js": "feelGood/localized_js"
        	}
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/de-DE.js",
        	locale: "de-DE"
        });
        
        test.ok(jsrf);
        [
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellen'text"     		
        	}),
        	new ResourceString({
        		project: "ht-webapp12",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellen'text"
        	})
        ].forEach(function(res) {
        	jsrf.addResource(res);
        });
        
        test.equal(jsrf.getContent(),
        	'ilib.data.strings_de_DE = {\n' +
        	'    "source text": "Quellen\'text",\n' +
        	'    "more source text": "mehr Quellen\'text"\n' +
        	'};\n'
        );
        
        test.done();
    }
};