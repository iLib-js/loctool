/*
 * testAndroidResourceFile.js - test the Android resource file handler object.
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

if (!AndroidResourceFile) {
    var AndroidResourceFile = require("../lib/AndroidResourceFile.js");
    var AndroidResourceFileType = require("../lib/AndroidResourceFileType.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
    var ResourcePlural =  require("../lib/ResourcePlural.js");
    var ResourceArray =  require("../lib/ResourceArray.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);
    
    for (var i = 0; i < min; i++) {
    	if (a[i] !== b[i]) {
    		console.log("Found difference at character " + i);
    		console.log("a: " + a.substring(i));
    		console.log("b: " + b.substring(i));
    		break;
    	}
    }
}

var p = new AndroidProject({
	id: "android",
	sourceLocale: "en-US"
}, "./testfiles", {
	locales:["en-GB"]
});

var arft = new AndroidResourceFileType(p);

module.exports = {
    testAndroidResourceFileConstructor: function(test) {
        test.expect(1);

        var arf = new AndroidResourceFile();
        test.ok(arf);
        
        test.done();
    },
    
    testAndroidResourceFileConstructorParams: function(test) {
        test.expect(1);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./java/res/values/t1.xml",
        	locale: "en-US"
        });
        
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileConstructorNoFile: function(test) {
        test.expect(1);

        var arf = new AndroidResourceFile({project: p, pathName: "foo"});
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileParseStringGetByKey: function(test) {
        test.expect(5);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "thanks_friend_pre", "x-android-resource"));
        test.ok(r);
        
        test.equal(r.getSource(), "Send a thank you note to\n{name}");
        test.equal(r.getKey(), "thanks_friend_pre");
        
        test.done();
    },

    testAndroidResourceFileParsePluralGetByKey: function(test) {
        test.expect(7);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        	    '  <plurals name="friend_comment">\n' +
                '    <item quantity="one">\n' +
                '      {start}1 friend{end} commented\n' +
                '    </item>\n' +
                '    <item quantity="other">\n' +
                '      {start}%d friends{end} commented\n' +
                '    </item>\n' +
                '  </plurals>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourcePlural.hashKey("android", undefined, "en-US", "friend_comment"));
        test.ok(r);
        
        test.equal(r.getKey(), "friend_comment");
        var plurals = r.getPlurals();
        test.ok(plurals);
        test.equal(plurals.one, "{start}1 friend{end} commented");
        test.equal(plurals.other, "{start}%d friends{end} commented");
        
        test.done();
    },

    testAndroidResourceFileParseArrayGetByKey: function(test) {
        test.expect(9);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        	    '  <string-array name="self_questions">\n' +
        		'    <item>How many times have you been pregnant?</item>\n' +
                '    <item>How many deliveries did you have?</item>\n' +
                '    <item>How many times did you have a pre-term deliveries?</item>\n' +
                '  </string-array>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourceArray.hashKey("android", undefined, "en-US", "self_questions"));
        test.ok(r);
        
        test.equal(r.getKey(), "self_questions");
        var array = r.getSourceArray();
        test.ok(array);
        test.equal(array.length, 3);
        test.equal(array[0], "How many times have you been pregnant?");
        test.equal(array[1], "How many deliveries did you have?");
        test.equal(array[2], "How many times did you have a pre-term deliveries?");
        
        test.done();
    },

    testAndroidResourceFileParseStringDNT: function(test) {
        test.expect(6);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "app_id", "x-android-resource"));
        test.ok(r);
        
        test.equal(r.getSource(), "151779581544891");
        test.equal(r.getKey(), "app_id");
        test.ok(r.dnt)
        
        test.done();
    },

    testAndroidResourceFileParseStringWithComment: function(test) {
        test.expect(7);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "thanks_friend_pre", "x-android-resource"));
        test.ok(r);
        
        test.equal(r.getSource(), "Send a thank you note to\n{name}");
        test.equal(r.getKey(), "thanks_friend_pre");
        test.equal(r.getComment(), "name is name of your friend");
        test.ok(!r.dnt);
        
        test.done();
    },


    testAndroidResourceFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "foo"
		});
        test.ok(arf);

        var set = arf.getTranslationSet();
        test.equal(set.size(), 0);

        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        test.ok(set);
        
        test.equal(set.size(), 6);
        
        test.done();
    },

    testAndroidResourceFileExtractFile: function(test) {
        test.expect(6);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./testfiles/java/res/values/strings.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 12);
        
        var r = set.get(ContextResourceString.hashKey("android", undefined, "en-US", "ask_question", "x-android-resource"));
        test.ok(r);
        test.equal(r.getSource(), "Ask friends");
        test.equal(r.getKey(), "ask_question");
        test.ok(!r.getContext());

        test.done();
    },
  
    testAndroidResourceFileExtractFilePlurals: function(test) {
        test.expect(8);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./testfiles/java/res/values/plurals.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.ok(set);
        test.equal(set.size(), 3);

        var r = set.get(ResourcePlural.hashKey("android", undefined, "en-US", "friend_comment"));
        test.ok(r);
        
        test.equal(r.getKey(), "friend_comment");
        var plurals = r.getSourcePlurals();
        test.ok(plurals);
        test.equal(plurals.one, "{start}1 friend{end} commented");
        test.equal(plurals.other, "{start}%d friends{end} commented");
        
        test.done();
    },

    testAndroidResourceFileExtractFileArrays: function(test) {
        test.expect(10);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./testfiles/java/res/values/arrays.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.ok(set);
        test.equal(set.size(), 2);

        var r = set.get(ResourceArray.hashKey("android", undefined, "en-US", "self_questions"));
        test.ok(r);
        
        test.equal(r.getKey(), "self_questions");
        var array = r.getSourceArray();
        test.ok(array);
        test.equal(array.length, 3);
        test.equal(array[0], "How many times have you been pregnant?");
        test.equal(array[1], "How many deliveries did you have?");
        test.equal(array[2], "How many times did you have a pre-term deliveries?");
        
        test.done();
    },

    testAndroidResourceFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "foo"
		});
        test.ok(arf);
        
        // should attempt to read the file and not fail
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidResourceFileExtractBogusFile: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile(p, "./java/foo.java");
        test.ok(arf);
        
        // should attempt to read the file and not fail
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidResourceFileGetXMLStrings: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "./testfiles/java/res/values/foo.xml"
		});
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        arf.addResource(new ContextResourceString({
        	project: "android",
        	key: "asdf",
        	source: "foobar",
        	sourceLocale: "en-US"
        }));
        
        var xml = arf._getXML();

        // output is sorted by key now
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
			'  <string name="asdf">foobar</string>\n' +
			'  <string name="description_imgVw">imageView</string>\n' +
			'  <string name="disclaimer">Disclaimer</string>\n' +
			'  <string name="thanks">Thank you!</string>\n' +
			'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
			'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
			'</resources>';
        
        diff(xml, expected);
        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetXMLNoChange: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "./testfiles/java/res/values/foo.xml"
		});
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
			'  <string name="disclaimer">Disclaimer</string>\n' +
			'  <string name="description_imgVw">imageView</string>\n' +
			'  <string name="thanks_friend_pre" i18n="name is name of your friend">Send a thank you note to\n{name}</string>\n' +
			'  <string name="thanks_news">{name} appreciates your gratitude :)</string>\n' +
			'  <string name="thanks">Thank you!</string>\n' +
			'</resources>\n';
        
        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetXMLPlurals: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "./testfiles/java/res/values/foo.xml",
			locale: "en-US"
		});
        test.ok(arf);
        
        arf.addResource(new ResourcePlural({
        	project: "android",
        	key: "asdf",
        	sourceStrings: {
        		"one": "This is singular",
        		"few": "This is few",
        		"other": "This is other"
        	},
        	locale: "en-US",
        	comment: "comment1"
        }));
        
        arf.addResource(new ResourcePlural({
        	project: "android",
        	key: "foobar",
        	sourceStrings: {
        		"one": "un",
        		"few": "deux",
        		"other": "trois"
        	},
        	locale: "en-US",
        	comment: "comment2"
        }));

        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <plurals name="asdf" i18n="comment1">\n' +
			'    <item quantity="one">This is singular</item>\n' +
			'    <item quantity="few">This is few</item>\n' +
			'    <item quantity="other">This is other</item>\n' +
			'  </plurals>\n' +
			'  <plurals name="foobar" i18n="comment2">\n' +
			'    <item quantity="one">un</item>\n' +
			'    <item quantity="few">deux</item>\n' +
			'    <item quantity="other">trois</item>\n' +
			'  </plurals>\n' +
			'</resources>';

        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetXMLArrays: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
			pathName: "./testfiles/java/res/values/foo.xml",
			locale: "en-US"
		});
        test.ok(arf);
        
        arf.addResource(new ResourceArray({
        	project: "android",
        	key: "asdf",
        	sourceArray: ["one", "two", "three"],
        	sourceLocale: "en-US",
        	comment: "comment1"
        }));
        
        arf.addResource(new ResourceArray({
        	project: "android",
        	key: "foobar",
        	sourceArray: ["un", "deux", "trois"],
        	sourceLocale: "en-US",
        	comment: "comment2"
        }));

        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <string-array name="asdf" i18n="comment1">\n' +
			'    <item>one</item>\n' +
			'    <item>two</item>\n' +
			'    <item>three</item>\n' +
			'  </string-array>\n' +
			'  <string-array name="foobar" i18n="comment2">\n' +
			'    <item>un</item>\n' +
			'    <item>deux</item>\n' +
			'    <item>trois</item>\n' +
			'  </string-array>\n' +
			'</resources>';

        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetLocale: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./res/values/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-US");

        test.done();
    },

    testAndroidResourceFileGetLocaleFromDir: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
        	pathName: "./res/values-en-rNZ/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-NZ");

        test.done();
    },

    testAndroidResourceFileGetContext: function(test) {
        test.expect(2);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
        	pathName: "./res/values-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
        	pathName: "./res/values-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
        	pathName: "./res/values-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft,
        	pathName: "./res/values-de-rCH-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de-CH");
        test.equal(arf.getContext(), "bar");

        test.done();
    },
    
    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var arf = new AndroidResourceFile({
        	project: p,
			type: arft, 
        	pathName: "./res/values-zh-sHans-rCN-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "zh-Hans-CN");
        test.equal(arf.getContext(), "bar");

        test.done();
    }    
};
