/*
 * testResourcePlural.js - test the resource string object.
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

if (!ResourcePlural) {
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var WebProject = require("../lib/WebProject.js");
}

module.exports = {
    testResourcePluralConstructorEmpty: function(test) {
        test.expect(1);

        var rp = new ResourcePlural();
        test.ok(rp);

        test.done();
    },

	testResourcePluralConstructorNoProps: function(test) {
	    test.expect(1);

	    var rp = new ResourcePlural({});
	    test.ok(rp);

	    test.done();
	},

    testResourcePluralConstructor: function(test) {
        test.expect(1);

        var rp = new ResourcePlural({
        	key: "asdf",
        	locale: "de-DE",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        test.done();
    },

    testResourcePluralConstructorRightContents: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
        	key: "asdf",
        	locale: "de-DE",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        test.equal(rp.getKey(), "asdf");
        test.deepEqual(rp.getPlurals(), {
    		"one": "This is singular",
    		"two": "This is double",
    		"few": "This is the few case",
    		"many": "This is the many case"
        });
        test.equal(rp.locale, "de-DE");
        test.equal(rp.pathName, "a/b/c.java");

        test.done();
    },

    testResourcePluralConstructorDefaults: function(test) {
        test.expect(6);

        var rp = new ResourcePlural({
        	key: "asdf",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        // got the right one?
        test.equal(rp.getKey(), "asdf");

        // now the defaults
        test.equal(rp.locale, "en-US");
        test.equal(rp.origin, "source");
        test.equal(rp.datatype, "x-android-resource");
        test.equal(rp.resType, "plural");

        test.done();
    },

    testResourcePluralGetKey: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "de-DE",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);
        test.equal(rp.getKey(), "foo");

        test.done();
    },

    testResourcePluralGet: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "en-US",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);
        test.equal(rp.get("one"), "This is singular");
        test.equal(rp.get("two"), "This is double");
        test.equal(rp.get("few"), "This is the few case");
        test.equal(rp.get("many"), "This is the many case");

        test.done();
    },

    testResourcePluralGetNonExistent: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "en-US",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);
        test.ok(!rp.get("zero"));

        test.done();
    },

    testResourcePluralGetKeyEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural();
        test.ok(rp);
        test.ok(!rp.getKey());

        test.done();
    },

    testResourcePluralGetContext: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "en-US",
            context: "landscape",
            strings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.equal(rp.getContext(), "landscape");

        test.done();
    },

    testResourcePluralGetContextEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "en-US",
            strings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rp);
        test.ok(!rp.getContext());

        test.done();
    },

    testResourcePluralGetPlurals: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "foo",
            pathName: "a/b/c.txt",
            locale: "de-DE",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);
        test.deepEqual(rp.getPlurals(), {
        	"one": "This is singular",
        	"two": "This is double",
        	"few": "This is the few case",
        	"many": "This is the many case"
        });

        test.done();
    },

    testResourcePluralGetPluralsEmpty: function(test) {
        test.expect(2);

        var rp = new ResourcePlural();
        test.ok(rp);
        var plurals = rp.getPlurals();
        var count = 0;
        for (var p in plurals) {
        	count++;
        }
        test.equal(count, 0);

        test.done();
    },

    testResourcePluralGeneratePseudo: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        var rb = new RegularPseudo({
        	type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);
        test.equal(rp2.getLocale(), "de-DE");

        test.done();
    },

    testResourcePluralGeneratePseudoRightString: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        var rb = new RegularPseudo({
        	type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);

        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
    		"one": "Ťĥíš íš šíñğüľàŕ76543210",
    		"two": "Ťĥíš íš ðõübľë6543210",
    		"few": "Ťĥíš íš ţĥë fëŵ çàšë9876543210",
    		"many": "Ťĥíš íš ţĥë màñÿ çàšë6543210"
    	});

        test.done();
    },

    testResourcePluralGeneratePseudoSkipPercents: function(test) {
        test.expect(4);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is %s singular",
        		"two": "This is %d double",
        		"few": "This is the few %2$-2.2f case",
        		"many": "This is the many %7x case"
        	}
        });
        test.ok(rp);

        var rb = new RegularPseudo({
        	type: "c"
        });

        var rp2 = rp.generatePseudo("de-DE", rb);

        test.ok(rp2);

        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
    		"one": "Ťĥíš íš %s šíñğüľàŕ9876543210",
    		"two": "Ťĥíš íš %d ðõübľë876543210",
    		"few": "Ťĥíš íš ţĥë fëŵ %2$-2.2f çàšë9876543210",
    		"many": "Ťĥíš íš ţĥë màñÿ %7x çàšë76543210"
    	});

        test.done();
    },

    testResourcePluralGeneratePseudoBadLocale: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        var rb = new RegularPseudo({
        	type: "c"
        });

        var rp2 = rp.generatePseudo(undefined, rb);
        test.ok(!rp2);

        test.done();
    },

    testResourcePluralGeneratePseudoBadBundle: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rp);

        var rp2 = rp.generatePseudo("de-DE", undefined);

        test.ok(!rp2);

        test.done();
    },

    testResourcePluralGeneratePseudoBritishRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            strings: {
            	"one": "This is estrogen", 
            	"few": "I color my checkbooks", 
            	"many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-GB",
        	type: "c"
        });

        var rp2 = rp.generatePseudo("en-GB", rb);

        test.ok(rp2);
        test.ok(rp2.getLocale(), "en-GB");
        
        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
    		"one": "This is oestrogen",
    		"few": "I colour my chequebooks",
    		"many": "This is not translated."
    	});

        test.done();
    },

    testResourcePluralGeneratePseudoBritishLikeRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            strings: {
            	"one": "This is estrogen", 
            	"few": "I color my checkbooks", 
            	"many": "This is not translated."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "en-ZA"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-ZA",
        	type: "c"
        });

        var rp2 = rp.generatePseudo("en-ZA", rb);

        test.ok(rp2);
        test.ok(rp2.getLocale(), "en-ZA");
        
        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
    		"one": "This is oestrogen",
    		"few": "I colour my chequebooks",
    		"many": "This is not translated."
    	});
        
        test.done();
    },

    testResourcePluralGeneratePseudoCanadianRightString: function(test) {
        test.expect(5);

        var rp = new ResourcePlural({
            key: "asdf",
            strings: {
            	"one": "This is estrogen", 
            	"few": "I color my checkbooks", 
            	"many": "This is not localized."
            },
            pathName: "a/b/c.java"
        });
        test.ok(rp);
        
        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "en-CA"]
		});

        var rb = new PseudoFactory({
        	project: p,
        	locale: "en-CA",
        	type: "c"
        });

        var rp2 = rp.generatePseudo("en-CA", rb);

        test.ok(rp2);
        test.ok(rp2.getLocale(), "en-CA");
        
        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
    		"one": "This is estrogen",
    		"few": "I colour my chequebooks",
    		"many": "This is not localized."
    	});
        
        test.done();
    },

    testResourcePluralGeneratePseudoTraditionalChineseRightString: function(test) {
        test.expect(5);

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
        
        var p = new WebProject({
            id: "foo",
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO"
        }, "./testfiles", {
			locales:["en-GB", "zh-Hans-CN", "zh-Hant-TW"]
		});

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
        
        var rb = new PseudoFactory({
        	project: p,
        	locale: "zh-Hant-TW",
        	type: "c",
        	set: translations
        });

        var rp2 = rp.generatePseudo("zh-Hant-TW", rb);

        test.ok(rp2);
        test.ok(rp2.getLocale(), "zh-Hant-TW");
        
        var t = rp2.getPlurals();

        test.ok(t);
        test.deepEqual(t, {
            one: "你好嗎？",
            few: "燕子的巡航速度是多少？",
            many: "什麼？ 你是指歐洲的燕子還是非洲的燕子？"
    	});
        
        test.done();
    },

    testResourcePluralClone: function(test) {
        test.expect(10);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
        	pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        var rp2 = rp.clone();

        test.ok(rp2);
        test.equal(rp2.project, rp.project);
        test.equal(rp2.context, rp.context);
        test.equal(rp2.locale, rp.locale);
        test.equal(rp2.reskey, rp.reskey);
        test.deepEqual(rp2.strings, rp.strings);
        test.equal(rp2.pathName, rp.pathName);
        test.equal(rp2.comment, rp.comment);
        test.equal(rp2.state, rp.state);

        test.done();
    },

    testResourcePluralCloneWithOverrides: function(test) {
        test.expect(10);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        var rp2 = rp.clone({
        	locale: "fr-FR",
        	state: "asdfasdf"
        });

        test.ok(rp2);
        test.equal(rp2.project, rp.project);
        test.equal(rp2.context, rp.context);
        test.equal(rp2.locale, "fr-FR");
        test.equal(rp2.reskey, rp.reskey);
        test.deepEqual(rp2.strings, rp.strings);
        test.equal(rp2.pathName, rp.pathName);
        test.equal(rp2.comment, rp.comment);
        test.equal(rp2.state, "asdfasdf");

        test.done();
    },

    testResourcePluralAddString: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.get("zero"));

        rp.addString("zero", "This is the zero one")

        test.equal(rp.get("zero"), "This is the zero one");

        test.done();
    },

    testResourcePluralAddStringReplace: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.get("two"), "This is double");

        rp.addString("two", "This is two at a time")

        test.equal(rp.get("two"), "This is two at a time");

        test.done();
    },

    testResourcePluralAddStringSize: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addString("many", "This is the many one")

        test.equal(rp.size(), 4);

        test.done();
    },

    testResourcePluralAddStringUndefined: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.get("one"), "This is singular");

        rp.addString("one", undefined)

        test.equal(rp.get("one"), "This is singular");

        test.done();
    },

    testResourcePluralAddStringNoClass: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 3);

        rp.addString(undefined, "foobar")

        test.equal(rp.size(), 3);

        test.done();
    },

    testResourcePluralAddStringEmpty: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.size(), 0);

        rp.addString("one", "foobar")

        test.equal(rp.size(), 1);

        test.done();
    },

    testResourcePluralAddStringEmptyRightContents: function(test) {
        test.expect(3);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.ok(!rp.get("one"));

        rp.addString("one", "foobar")

        test.equal(rp.get("one"), "foobar");

        test.done();
    },

    testResourcePluralAddStringMultiple: function(test) {
        test.expect(6);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
        	strings: {
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(rp);

        rp.addString("one", "This is singular");
        rp.addString("zero", "This is the zero one");

        test.equal(rp.get("zero"), "This is the zero one");
        test.equal(rp.get("one"), "This is singular");
        test.equal(rp.get("two"), "This is double");
        test.equal(rp.get("few"), "This is the few case");
        test.equal(rp.get("many"), "This is the many case");

        test.done();
    },

    testResourcePluralEquals: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
        	pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsNot: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
        	project: "foo",
        	context: "asdf",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsIgnoreSomeFields: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(ra1.equals(ra2));

        test.done();
    },

    testResourcePluralEqualsContentDifferent: function(test) {
        test.expect(3);

        var ra1 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        var ra2 = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is a different case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        test.ok(ra1);
        test.ok(ra2);

        test.ok(!ra1.equals(ra2));

        test.done();
    },

    testResourcePluralStaticHashKey: function(test) {
        test.expect(1);

        test.equal(ResourcePlural.hashKey("ht-androidapp", "foo", "de-DE", "This is a test"), "rp_ht-androidapp_foo_de-DE_This is a test");

        test.done();
    },

    testResourcePluralStaticHashKeyMissingParts: function(test) {
        test.expect(1);

        test.equal(ResourcePlural.hashKey(undefined, undefined, "de-DE", undefined), "rp___de-DE_");

        test.done();
    },

    testResourcePluralHashKey: function(test) {
        test.expect(2);

        var rp = new ResourcePlural({
        	project: "foo",
        	context: "blah",
        	locale: "de-DE",
            key: "asdf",
            strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is a different case"
        	},
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        test.ok(rp);

        test.equal(rp.hashKey(), "rp_foo_blah_de-DE_asdf");

        test.done();
    }
};
