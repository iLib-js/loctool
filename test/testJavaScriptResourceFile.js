/*
 * testJavaScriptResourceFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!JavaScriptResourceFile) {
    var JavaScriptResourceFile = require("../lib/JavaScriptResourceFile.js");
    var WebProject =  require("../lib/WebProject.js");
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
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var jsrf = new JavaScriptResourceFile({
        	project: p,
        	pathName: "feelGood/localized_js/en-US.js",
        	locale: "en-US"
        });
        
        test.ok(jsrf);
        
        test.done();
    },

};