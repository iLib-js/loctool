/*
 * testRubyFileType.js - test the HTML template file type handler object.
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

if (!RubyFileType) {
    var RubyFileType = require("../lib/RubyFileType.js");
    var WebProject =  require("../lib/WebProject.js");
}

module.exports = {
    testRubyFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        
        test.ok(rf);
        
        test.done();
    },

    testRubyFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("foo.rb"));
        
        test.done();
    },

    testRubyFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("foo.html.haml"));
        
        test.done();
    },

    testRubyFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foorb"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foohtml.haml"));
        
        test.done();
    },
        
    testRubyFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("foo.html"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("a/b/c/foo.rb"));
        
        test.done();
    },

    testRubyFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(rf.handles("a/b/c/foo.html.haml"));
        
        test.done();
    },

    testRubyFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("a/b/c/foo.en-GB.html.haml"));
        
        test.done();
    },

    testRubyFileTypeHandlesAlreadyLocalizedES: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("a/b/c/foo.es-US.html.haml"));
        
        test.done();
    },

    testRubyFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("a/b/c/foo.zh-Hans-CN.html.haml"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesAlreadyLocalizedCN2: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml"));
        
        test.done();
    },
    
    testRubyFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles", {
			locales:["en-GB"],
			flavors: ["DISCOVERY"]
		});
        
        var rf = new RubyFileType(p);
        test.ok(rf);
        
        test.ok(!rf.handles("app/views/who_we_are/press.en-ZA-DISCOVERY.html.haml"));
        
        test.done();
    }
};