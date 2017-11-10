/*
 * testJavaScriptFileType.js - test the HTML template file type handler object.
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

if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../lib/JavaScriptFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testJavaScriptFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        
        test.ok(htf);
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSXTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.jsx"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTemplatesTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("foo.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foojs"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foohtml.haml"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesTemplateFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("footmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("foo.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.en-US.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/strings.en-US.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(htf.handles("a/b/c/foo.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.js"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesHamlAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.html.haml"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.en-GB.tmpl.html"));
        
        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.js"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleHamlAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.html.haml"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.es-US.tmpl.html"));
        
        test.done();
    },
    
    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var htf = new JavaScriptFileType(p);
        test.ok(htf);
        
        test.ok(!htf.handles("a/b/c/strings.es-US.tmpl.html"));
        
        test.done();
    }

};