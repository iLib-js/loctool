/*
 * testTranslationSet.js - test the Translation Set object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!TranslationSet) {
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports = {
    moduleSetUp: function(test) {
        
        test.done();
    },
    
    testConstructor: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        test.ok(ts);
        test.done();
    },
    
    testConstructorRightSourceLocaleDefault: function(test) {
        test.expect(1);

        var ts = new TranslationSet();
        
        test.equal(ts.sourceLocale, "zxx-XX");
        test.done();
    },

    testConstructorGetEmpty: function(test) {
        test.expect(2);

        var ts = new TranslationSet();
        var res = new ResourceString({
            id: "asdf",
            source: "This is a test"
        });
        
        ts.add(res);
        
        var r = ts.get("asdf");
        
        test.equal(r.getId(), "asdf");
        test.equal(r.getSource(), "This is a test");
        test.done();
    },

};
      