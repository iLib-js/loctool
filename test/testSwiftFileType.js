/*
 * testSwiftFileTypeType.js - test the Swift file type handler object.
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

if (!SwiftFileType) {
    var SwiftFileType = require("../lib/SwiftFileType.js");
    var SwiftProject =  require("../lib/SwiftProject.js");
}

module.exports = {
    testSwiftFileTypeConstructor: function(test) {
        test.expect(1);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        
        test.ok(stf);
        
        test.done();
    },

    testSwiftFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("foo.swift"));
        
        test.done();
    },

    testSwiftFileTypeHandlesHeaderFileTrue: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("foo.h"));
        
        test.done();
    },

    testSwiftFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(!stf.handles("fooswift"));
        
        test.done();
    },
    
    testSwiftFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(!stf.handles("foo.html"));
        
        test.done();
    },
    
    testSwiftFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var p = new SwiftProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var stf = new SwiftFileType(p);
        test.ok(stf);
        
        test.ok(stf.handles("a/b/c/foo.swift"));
        
        test.done();
    }
};