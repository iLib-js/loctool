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

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        test.equal(rs2.getLocale(), "de-DE");
        
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

        var rs2 = rs.generatePseudo("de-DE", rb);

        test.ok(rs2);
        
        var t = rs2.getPlurals();
        
        test.ok(t);
        test.deepEqual(t, {
    		"one": "Ťĥíš íš šíñğüľàŕ",
    		"two": "Ťĥíš íš ðõübľë",
    		"few": "Ťĥíš íš ţĥë fëŵ çàšë",
    		"many": "Ťĥíš íš ţĥë màñÿ çàšë"
    	});
        
        test.done();
    },

    testResourcePluralGeneratePseudoBadLocale: function(test) {
        test.expect(2);

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

        var rs2 = rs.generatePseudo(undefined, rb);
        test.ok(!rs2);
        
        test.done();
    },

    testResourcePluralGeneratePseudoBadBundle: function(test) {
        test.expect(2);

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
        
        var rs2 = rs.generatePseudo("de-DE", undefined);

        test.ok(!rs2);
        
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
    }
};
