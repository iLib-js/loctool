/*
 * testResourcePlural.js - test the resource string object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!ResourcePlural) {
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var ilib = require("ilib");
    var ResBundle = require("ilib/lib/ResBundle");
}

module.exports = {
    testResourcePluralConstructorEmpty: function(test) {
        test.expect(1);

        var rs = new ResourcePlural();
        test.ok(rs);
        
        test.done();
    },
    
	testResourcePluralConstructorNoProps: function(test) {
	    test.expect(1);
	
	    var rs = new ResourcePlural({});
	    test.ok(rs);
	    
	    test.done();
	},
	
    testResourcePluralConstructor: function(test) {
        test.expect(1);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        
        test.done();
    },
    
    testResourcePluralConstructorRightContents: function(test) {
        test.expect(5);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        test.equal(rs.getKey(), "asdf");
        test.deepEqual(rs.getPlurals(), {
    		"one": "This is singular",
    		"two": "This is double",
    		"few": "This is the few case",
    		"many": "This is the many case"
        });
        test.equal(rs.locale, "de-DE");
        test.equal(rs.pathName, "a/b/c.java");
        
        test.done();
    },
    
    testResourcePluralGetKey: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.equal(rs.getKey(), "foo");
        
        test.done();
    },

    testResourcePluralGet: function(test) {
        test.expect(5);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.equal(rs.get("one"), "This is singular");
        test.equal(rs.get("two"), "This is double");
        test.equal(rs.get("few"), "This is the few case");
        test.equal(rs.get("many"), "This is the many case");
        
        test.done();
    },

    testResourcePluralGetNonExistent: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.ok(!rs.get("zero"));
        
        test.done();
    },

    testResourcePluralGetKeyEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural();
        test.ok(rs);
        test.ok(!rs.getKey());
        
        test.done();
    },

    testResourcePluralGetContext: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.equal(rs.getContext(), "landscape");
        
        test.done();
    },

    testResourcePluralGetContextEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.ok(!rs.getContext());
        
        test.done();
    },

    testResourcePluralGetPlurals: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
        test.deepEqual(rs.getPlurals(), {
        	"one": "This is singular",
        	"two": "This is double",
        	"few": "This is the few case",
        	"many": "This is the many case"
        });
        
        test.done();
    },

    testResourcePluralGetPluralsEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural();
        test.ok(rs);
        test.ok(!rs.getPlurals());
        
        test.done();
    },

    testResourcePluralAddTranslation: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation("de-DE", {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        
        test.deepEqual(rs.getTranslations("de-DE"), {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        
        test.done();
    },

    testResourcePluralAddTranslationEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation("de-DE", undefined);
        
        test.ok(!rs.getTranslations("de-DE"));
        
        test.done();
    },

    testResourcePluralAddTranslationNoLocale: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation(undefined, "foo");
        
        test.ok(rs);
        
        test.done();
    },

    testResourcePluralGetTranslationEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        test.ok(!rs.getTranslations("fr-FR"));
        
        test.done();
    },

    testResourcePluralAddTranslationMultiple: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation("de-DE", {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        rs.addTranslation("fr-FR", {
        	"one": "Ceci est une teste.",
        	"two": "Ceci est la doble.",
        	"few": "Ceci est le peu cas.",
        	"many": "Ceci est le beaucoup cas."
        });
        
        test.deepEqual(rs.getTranslations("de-DE"), {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        test.deepEqual(rs.getTranslations("fr-FR"), {
        	"one": "Ceci est une teste.",
        	"two": "Ceci est la doble.",
        	"few": "Ceci est le peu cas.",
        	"many": "Ceci est le beaucoup cas."
        });
        
        test.done();
    },

    testResourcePluralAddTranslationClear: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation("de-DE", {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        
        test.deepEqual(rs.getTranslations("de-DE"), {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });

        rs.addTranslation("de-DE", undefined);
        
        test.ok(!rs.getTranslations("de-DE"));

        test.done();
    },

    testResourcePluralGetTranslatedResource: function(test) {
        test.expect(7);

        var rs = new ResourcePlural({
        	key: "asdf",
        	locale: "de-DE",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	},
        	context: "foo"
        });
        test.ok(rs);
    
        rs.addTranslation("de-DE", {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        
        var rs2 = rs.getTranslatedResource("de-DE");
        
        test.ok(rs2);
        test.equal(rs2.getKey(), "asdf");
        test.deepEqual(rs2.getPlurals(), {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        test.equal(rs2.locale, "de-DE");
        test.equal(rs2.pathName, "a/b/c.java");
        test.equal(rs2.getContext(), "foo");
                
        test.done();
    },

    testResourcePluralGetTranslatedResourceNoTranslation: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        var rs2 = rs.getTranslatedResource("de-DE");
        
        test.ok(!rs2);
                
        test.done();
    },

    testResourcePluralGetTranslationLocales: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        rs.addTranslation("de-DE", {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        rs.addTranslation("fr-FR", "Ceci est une teste.");
        
        test.deepEqual(rs.getTranslationLocales(), ["de-DE", "fr-FR"]);
                
        test.done();
    },

    testResourcePluralGetTranslationLocalesNoTranslations: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
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
        test.ok(rs);
    
        test.deepEqual(rs.getTranslationLocales(), []);
                
        test.done();
    },
    
    testResourcePluralMerge: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
        	key: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rs2 = new ResourcePlural({
        	key: "asdf",
        	locale: "de-DE",
        	pathName: "a/b/c.java",
        	strings: {
            	"one": "Dies ist einem Test.",
            	"two": "Dies ist einem Dobles",
            	"few": "Dies ist den wenigen Fall",
            	"many": "Dies ist den vielen Fall"
            }
        });
        test.ok(rs2);
        
        rs.merge(rs2);
        
        test.deepEqual(rs.getTranslations("de-DE"), {
        	"one": "Dies ist einem Test.",
        	"two": "Dies ist einem Dobles",
        	"few": "Dies ist den wenigen Fall",
        	"many": "Dies ist den vielen Fall"
        });
        
        test.done();
    },

    testResourcePluralMergeEmpty: function(test) {
        test.expect(2);

        var rs = new ResourcePlural({
        	key: "asdf",
        	source: "This is a test",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
                
        rs.merge();
        
        test.ok(rs);
        
        test.done();
    },

    testResourcePluralMergeSame: function(test) {
        test.expect(4);

        var rs = new ResourcePlural({
        	key: "asdf",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rs2 = new ResourcePlural({
        	key: "asdf",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs2);
        
        rs.merge(rs2);
        
        test.ok(rs);
        test.ok(rs2);
        
        test.done();
    },

    testResourcePluralMergeDup: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
        	key: "asdf",
        	locale: "en-US",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rs2 = new ResourcePlural({
        	key: "asdf",
        	locale: "en-US",
        	pathName: "a/b/c.java",
        	strings: {
            	"one": "Dies ist einem Test.",
            	"two": "Dies ist einem Dobles",
            	"few": "Dies ist den wenigen Fall",
            	"many": "Dies ist den vielen Fall"
            }
        });
        test.ok(rs2);
        
        test.throws(function() {
        	rs.merge(rs2);
        });
        
        test.done();
    },

    testResourcePluralMergeDupNoLocales: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
        	key: "asdf",
        	pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rs2 = new ResourcePlural({
        	key: "asdf",
        	pathName: "a/b/c.java",
        	strings: {
            	"one": "Dies ist einem Test.",
            	"two": "Dies ist einem Dobles",
            	"few": "Dies ist den wenigen Fall",
            	"many": "Dies ist den vielen Fall"
            }
        });
        test.ok(rs2);
        
        test.throws(function() {
        	rs.merge(rs2);
        });
        
        test.done();
    },

    testResourcePluralMergeDifferentContext: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
            key: "asdf",
            locale: "en-US",
            pathName: "a/b/c.java",
            strings: {
                "one": "This is singular",
                "two": "This is double",
                "few": "This is the few case",
                "many": "This is the many case"
            }
        });
        test.ok(rs);
        
        var rs2 = new ResourcePlural({
            key: "asdf",
            locale: "de-DE",
            pathName: "a/b/c.java",
            strings: {
                "one": "Dies ist einem Test.",
                "two": "Dies ist einem Dobles",
                "few": "Dies ist den wenigen Fall",
                "many": "Dies ist den vielen Fall"
            },
            context: "foo"
        });
        test.ok(rs2);
        
        test.throws(function() {
            rs.merge(rs2);
        });
        
        test.done();
    },

    testResourcePluralGeneratePseudo: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.ok(!rs.getTranslations("de-DE"));
        
        rs.generatePseudo("de-DE", rb);

        test.ok(rs.getTranslations("de-DE"));
        
        test.done();
    },

    testResourcePluralGeneratePseudoRightString: function(test) {
        test.expect(4);

        var rs = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.ok(!rs.getTranslations("de-DE"));
        
        rs.generatePseudo("de-DE", rb);

        var t = rs.getTranslations("de-DE");
        test.ok(t);
        test.deepEqual(t, {
    		"one": "Ťĥíš íš šíñğüľàŕ",
    		"two": "Ťĥíš íš ðõübľë",
    		"few": "Ťĥíš íš ţĥë fëŵ çàšë",
    		"many": "Ťĥíš íš ţĥë màñÿ çàšë"
    	});
        
        test.done();
    },

    testResourcePluralGeneratePseudoAddToLocales: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.deepEqual(rs.getTranslationLocales(), []);
        
        rs.generatePseudo("de-DE", rb);

        test.deepEqual(rs.getTranslationLocales(), ["de-DE"]);
        
        test.done();
    },

    testResourcePluralGeneratePseudoBadLocale: function(test) {
        test.expect(3);

        var rs = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        var rb = new ResBundle({
            locale: "zxx-XX" // the pseudo-locale!
        });

        test.deepEqual(rs.getTranslationLocales(), []);
        
        rs.generatePseudo(undefined, rb);

        test.deepEqual(rs.getTranslationLocales(), []);
        
        test.done();
    },

    testResourcePluralGeneratePseudoBadBundle: function(test) {
        test.expect(4);

        var rs = new ResourcePlural({
            key: "asdf",
            pathName: "a/b/c.java",
        	strings: {
        		"one": "This is singular",
        		"two": "This is double",
        		"few": "This is the few case",
        		"many": "This is the many case"
        	}
        });
        test.ok(rs);
        
        test.deepEqual(rs.getTranslationLocales(), []);
        
        rs.generatePseudo("de-DE", undefined);

        test.ok(!rs.getTranslations("de-DE"));
        test.deepEqual(rs.getTranslationLocales(), []);
        
        test.done();
    }
};
