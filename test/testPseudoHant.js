/*
 * testPseudoHant.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!PseudoHant) {
    var PseudoHant = require("../lib/PseudoHant.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceArray = require("../lib/ResourceArray.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ResourceString = require("../lib/ResourceString.js");
}

module.exports = {
    testPseudoHantGetString: function(test) {
        test.expect(3);

        var translations = new TranslationSet();
        /*
        translations.add(new ResourceArray({
        	project: "foo",
        	key: 'asdf',
        	array: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
		*/
        
        var ph = new PseudoHant({
        	set: translations
        });
        
        test.equal(ph.getString('你好吗？'), "你好嗎？");
        test.equal(ph.getString('燕子的巡航速度是多少？'), "燕子的巡航速度是多少？");
        test.equal(ph.getString('什么？ 你是指欧洲的燕子还是非洲的燕子？'), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        
        test.done();
    },

    testPseudoHantGetStringEnglish: function(test) {
        test.expect(2);

        var translations = new TranslationSet();
        /*
        translations.add(new ResourceArray({
        	project: "foo",
        	key: 'asdf',
        	array: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
		*/
        
        var ph = new PseudoHant({
        	set: translations
        });
        
        test.equal(ph.getString('foo'), "foo");
        test.equal(ph.getString('What is the cruising speed of a swallow?'), "What is the cruising speed of a swallow?");
        
        test.done();
    },

    testPseudoHantGetStringForResourceArray: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
        	project: "foo",
            key: "asdf",
            array: ["How are you?", "What is the cruising speed of a swallow?？", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(ra);

        var translations = new TranslationSet();
        translations.add(new ResourceArray({
        	project: "foo",
        	key: 'asdf',
        	array: ['你好吗？', '燕子的巡航速度是多少？', '什么？ 你是指欧洲的燕子还是非洲的燕子？'],
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
		
        var ph = new PseudoHant({
        	set: translations
        });

        test.equal(ph.getStringForResource(ra, 0), "你好嗎？");
        test.equal(ph.getStringForResource(ra, 1), "燕子的巡航速度是多少？");
        test.equal(ph.getStringForResource(ra, 2), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        
        test.done();
    },

    testPseudoHantGetStringForResourcePlural: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
        	project: "foo",
            key: "asdf",
            strings: {
            	one: "How are you?", 
            	few: "What is the cruising speed of a swallow?？", 
            	many: "What? Do you mean a European swallow or an African swallow?"
            },
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(rp);

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
        	project: "foo",
        	key: 'asdf',
        	strings: {
        		one: '你好吗？', 
        		few: '燕子的巡航速度是多少？', 
        		many: '什么？ 你是指欧洲的燕子还是非洲的燕子？'
        	},
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
		
        var ph = new PseudoHant({
        	set: translations
        });

        test.equal(ph.getStringForResource(rp, "one"), "你好嗎？");
        test.equal(ph.getStringForResource(rp, "few"), "燕子的巡航速度是多少？");
        test.equal(ph.getStringForResource(rp, "many"), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        
        test.done();
    },

    testPseudoHantGetStringForResourceString: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(rs);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'asdf',
        	source: '什么？ 你是指欧洲的燕子还是非洲的燕子？',
        	pathName: "a/b/c.java",
            locale: "zh-Hans-CN"
        }));
		
        var ph = new PseudoHant({
        	set: translations
        });

        test.equal(ph.getStringForResource(rs), "什麼？ 你是指歐洲的燕子還是非洲的燕子？");
        
        test.done();
    },
    
    testPseudoHantGetStringForResourceArrayNoPreviousTranslation: function(test) {
        test.expect(4);

        var ra = new ResourceArray({
        	project: "foo",
            key: "asdf",
            array: ["How are you?", "What is the cruising speed of a swallow?", "What? Do you mean a European swallow or an African swallow?"],
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(ra);

        var translations = new TranslationSet();
		
        var ph = new PseudoHant({
        	set: translations
        });

        // no translation? Just return the source
        test.equal(ph.getStringForResource(ra, 0), "How are you?");
        test.equal(ph.getStringForResource(ra, 1), "What is the cruising speed of a swallow?");
        test.equal(ph.getStringForResource(ra, 2), "What? Do you mean a European swallow or an African swallow?");
        
        test.done();
    },

    testPseudoHantGetStringForResourcePluralNoPreviousTranslation: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
        	project: "foo",
            key: "asdf",
            strings: {
            	one: "How are you?", 
            	few: "What is the cruising speed of a swallow?", 
            	many: "What? Do you mean a European swallow or an African swallow?"
            },
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(rp);

        var translations = new TranslationSet();
		
        var ph = new PseudoHant({
        	set: translations
        });

        // no translation? Just return the source
        test.equal(ph.getStringForResource(rp, "one"), "How are you?");
        test.equal(ph.getStringForResource(rp, "few"), "What is the cruising speed of a swallow?");
        test.equal(ph.getStringForResource(rp, "many"), "What? Do you mean a European swallow or an African swallow?");
        
        test.done();
    },

    testPseudoHantGetStringForResourceStringNoPreviousTranslation: function(test) {
        test.expect(2);

        var rs = new ResourceString({
        	project: "foo",
            key: "asdf",
            source: "What? Do you mean a European swallow or an African swallow?",
            pathName: "a/b/c.java",
            locale: "en-US"
        });
        test.ok(rs);

        var translations = new TranslationSet();
       
        var ph = new PseudoHant({
        	set: translations
        });

        test.equal(ph.getStringForResource(rs), "What? Do you mean a European swallow or an African swallow?");
        
        test.done();
    },
    
    testPseudoHantGetStringForResourceUndefined: function(test) {
        test.expect(1);

        var translations = new TranslationSet();
		
        var ph = new PseudoHant({
        	set: translations
        });

        test.ok(!ph.getStringForResource(undefined, 0));
        
        test.done();
    },
};
