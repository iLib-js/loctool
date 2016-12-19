/*
 * testAndroidResourceFile.js - test the Java file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!AndroidResourceFile) {
    var AndroidResourceFile = require("../lib/AndroidResourceFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var AndroidResourceString =  require("../lib/AndroidResourceString.js");
    var ResourcePlural =  require("../lib/ResourcePlural.js");
    var ResourceArray =  require("../lib/ResourceArray.js");
}

module.exports = {
    testAndroidResourceFileConstructor: function(test) {
        test.expect(1);

        var arf = new AndroidResourceFile();
        test.ok(arf);
        
        test.done();
    },
    
    testAndroidResourceFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./java/res/values/t1.xml",
        	locale: "en-US"
        });
        
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({project: p, pathName: "foo"});
        test.ok(arf);
        
        test.done();
    },

    testAndroidResourceFileParseStringGetByKey: function(test) {
        test.expect(5);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_doc_pre">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(AndroidResourceString.hashKey(undefined, undefined, "en-US", "thanks_doc_pre"));
        test.ok(r);
        
        test.equal(r.getSource(), "Send a thank you note to\n{name}");
        test.equal(r.getKey(), "thanks_doc_pre");
        
        test.done();
    },

    testAndroidResourceFileParsePluralGetByKey: function(test) {
        test.expect(7);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        	    '  <plurals name="doctor_comment">\n' +
                '    <item quantity="one">\n' +
                '      {start}1 doctor{end} commented\n' +
                '    </item>\n' +
                '    <item quantity="other">\n' +
                '      {start}%d doctors{end} commented\n' +
                '    </item>\n' +
                '  </plurals>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourcePlural.hashKey(undefined, undefined, "en-US", "doctor_comment"));
        test.ok(r);
        
        test.equal(r.getKey(), "doctor_comment");
        var plurals = r.getPlurals();
        test.ok(plurals);
        test.equal(plurals.one, "{start}1 doctor{end} commented");
        test.equal(plurals.other, "{start}%d doctors{end} commented");
        
        test.done();
    },

    testAndroidResourceFileParseArrayGetByKey: function(test) {
        test.expect(9);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
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
        
        var r = set.get(ResourceArray.hashKey(undefined, undefined, "en-US", "self_questions"));
        test.ok(r);
        
        test.equal(r.getKey(), "self_questions");
        var array = r.getArray();
        test.ok(array);
        test.equal(array.length, 3);
        test.equal(array[0], "How many times have you been pregnant?");
        test.equal(array[1], "How many deliveries did you have?");
        test.equal(array[2], "How many times did you have a pre-term deliveries?");
        
        test.done();
    },

    testAndroidResourceFileParseStringDNT: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_doc_pre">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(AndroidResourceString.hashKey(undefined, undefined, "en-US", "app_id"));
        test.ok(r);
        
        test.equal(r.getSource(), "151779581544891");
        test.equal(r.getKey(), "app_id");
        test.ok(r.dnt)
        
        test.done();
    },

    testAndroidResourceFileParseStringWithComment: function(test) {
        test.expect(7);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p
        });
        test.ok(arf);
        
        arf.parse(
        		'<?xml version="1.0" encoding="utf-8"?>\n' +
        		'<resources \n' +
        		'  xmlns:tools="http://schemas.android.com/tools">\n' +
        		'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
        		'  <string name="disclaimer">Disclaimer</string>\n' +
        		'  <string name="description_imgVw">imageView</string>\n' +
        		'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');


        var set = arf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(AndroidResourceString.hashKey(undefined, undefined, "en-US", "thanks_doc_pre"));
        test.ok(r);
        
        test.equal(r.getSource(), "Send a thank you note to\n{name}");
        test.equal(r.getKey(), "thanks_doc_pre");
        test.equal(r.getComment(), "name is name of a doctor");
        test.ok(!r.dnt);
        
        test.done();
    },


    testAndroidResourceFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
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
        		'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        test.ok(set);
        
        test.equal(set.size(), 6);
        
        test.done();
    },

    testAndroidResourceFileExtractFile: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./testfiles/java/res/values/strings.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 12);
        
        var r = set.get(AndroidResourceString.hashKey("foo", undefined, "en-US", "ask_question"));
        test.ok(r);
        test.equal(r.getSource(), "Ask doctors");
        test.equal(r.getKey(), "ask_question");
        test.ok(!r.getContext());

        test.done();
    },
  
    testAndroidResourceFileExtractFilePlurals: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./testfiles/java/res/values/plurals.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.ok(set);
        test.equal(set.size(), 3);

        var r = set.get(ResourcePlural.hashKey(undefined, undefined, "en-US", "doctor_comment"));
        test.ok(r);
        
        test.equal(r.getKey(), "doctor_comment");
        var plurals = r.getPlurals();
        test.ok(plurals);
        test.equal(plurals.one, "{start}1 doctor{end} commented");
        test.equal(plurals.other, "{start}%d doctors{end} commented");
        
        test.done();
    },

    testAndroidResourceFileExtractFileArrays: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./testfiles/java/res/values/arrays.xml"
        });
        test.ok(arf);
        
        // should read the file
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.ok(set);
        test.equal(set.size(), 2);

        var r = set.get(ResourceArray.hashKey(undefined, undefined, "en-US", "self_questions"));
        test.ok(r);
        
        test.equal(r.getKey(), "self_questions");
        var array = r.getArray();
        test.ok(array);
        test.equal(array.length, 3);
        test.equal(array[0], "How many times have you been pregnant?");
        test.equal(array[1], "How many deliveries did you have?");
        test.equal(array[2], "How many times did you have a pre-term deliveries?");
        
        test.done();
    },

    testAndroidResourceFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
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

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile(p, "./java/foo.java");
        test.ok(arf);
        
        // should attempt to read the file and not fail
        arf.extract();
        
        var set = arf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testAndroidResourceFileGetXML: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
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
        		'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        arf.addResource(new AndroidResourceString({
        	project: "foo",
        	key: "asdf",
        	source: "foobar",
        	locale: "en-US"
        }));
        
        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
			'  <string name="disclaimer">Disclaimer</string>\n' +
			'  <string name="description_imgVw">imageView</string>\n' +
			'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
			'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
			'  <string name="thanks">Thank you!</string>\n' +
			'  <string name="asdf">foobar</string>\n' +
			'</resources>';
        
        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetXMLNoChange: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
			project: p,
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
        		'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
        		'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
        		'  <string name="thanks">Thank you!</string>\n' +
        		'</resources>\n');
        
        var xml = arf._getXML();
        
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
			'<resources \n' +
			'  xmlns:tools="http://schemas.android.com/tools">\n' +
			'  <string name="app_id" i18n="Do not translate">151779581544891</string>\n' +
			'  <string name="disclaimer">Disclaimer</string>\n' +
			'  <string name="description_imgVw">imageView</string>\n' +
			'  <string name="thanks_doc_pre" i18n="name is name of a doctor">Send a thank you note to\n{name}</string>\n' +
			'  <string name="thanks_news">{name} and Review Team appreciates your gratitude :)</string>\n' +
			'  <string name="thanks">Thank you!</string>\n' +
			'</resources>\n';
        
        test.equal(xml, expected);
        
        test.done();
    },

    testAndroidResourceFileGetLocale: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./res/values/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-US");

        test.done();
    },

    testAndroidResourceFileGetLocaleFromDir: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/values-en-rNZ/foo.xml"
        });
        test.ok(arf);
        
        var l = arf.getLocale();
        
        test.equal(l, "en-NZ");

        test.done();
    },

    testAndroidResourceFileGetContext: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/values-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/values-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext1: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/values-de-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de");
        test.equal(arf.getContext(), "bar");

        test.done();
    },

    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p,
        	pathName: "./res/values-de-rCH-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "de-CH");
        test.equal(arf.getContext(), "bar");

        test.done();
    },
    
    testAndroidResourceFileGetLocaleAndContext2: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var arf = new AndroidResourceFile({
        	project: p, 
        	pathName: "./res/values-zh-sHant-rCN-bar/foo.xml"
        });
        test.ok(arf);
        
        test.equal(arf.getLocale(), "zh-Hant-CN");
        test.equal(arf.getContext(), "bar");

        test.done();
    }    
};