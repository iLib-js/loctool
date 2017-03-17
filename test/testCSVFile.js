/*
 * testCSVFile.js - test the CSV file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!CSVFile) {
    var CSVFile = require("../lib/CSVFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
}

module.exports = {
    testCSVFileConstructor: function(test) {
        test.expect(1);

        var j = new CSVFile();
        test.ok(j);
        
        test.done();
    },
    
    testCSVFileConstructorParams: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p, 
        	pathName: "./testfiles/CSV/t1.csv"
        });
        
        test.ok(j);
        
        test.done();
    },

    testCSVFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        test.done();
    },
    
    testCSVFileConstructorInitWithNames: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	localizable: ["name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);

        test.deepEqual(j.names, ["id", "name", "description"]);

        test.done();
    },

    testCSVFileConstructorInitWithContent: function(test) {
        test.expect(10);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	localizable: ["name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);

        var record = j.records[0];

        test.equal(record.id, "foo");
        test.equal(record.name, "bar");
        test.equal(record.description, "asdf");

        record = j.records[1];

        test.equal(record.id, "foo2");
        test.equal(record.name, "bar2");
        test.equal(record.description, "asdf2");

        record = j.records[2];

        test.equal(record.id, "foo3");
        test.equal(record.name, "bar3");
        test.equal(record.description, "asdf3");

        test.done();
    },

    testCSVFileConstructorInitWithLocalizableColumns: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	localizable: ["name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);

        test.deepEqual(j.localizable, new Set(["name", "description"]));
        
        test.done();
    },

    testCSVFileParseGetColumnNames: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,"name with quotes","description with quotes"\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );
        
        var names = j.names;
        
        test.equal(names[0], "id");
        test.equal(names[1], "name");
        test.equal(names[2], "description");
        
        test.done();
    },

    testCSVFileParseRightRecords: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345, "name with quotes", "description with quotes"\n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[0];
        
        test.equal(record.id, "23414");
        test.equal(record.name, "name1");
        test.equal(record.description, "description1");

        test.done();
    },

    testCSVFileParseEscapedComma: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345, "name with quotes", "description with quotes"\n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[1];
        
        test.equal(record.id, "754432");
        test.equal(record.name, "name2");
        test.equal(record.description, "description2 that has an escaped, comma in it");
        
        test.done();
    },

    testCSVFileParseQuotedValues: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[2];
        
        test.equal(record.id, "26234345");
        test.equal(record.name, "name with quotes");
        test.equal(record.description, "description with quotes");
        
        test.done();
    },

    testCSVFileParseQuotedValuesWithCommas: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[3];
        
        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted name with, comma in it");
        test.equal(record.description, "description with, comma in it");
        
        test.done();
    },

    testCSVFileParseEmptyValues: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	',,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[0];
        
        test.equal(record.id, "");
        test.equal(record.name, "");
        test.equal(record.description, "description1");
        
        test.done();
    },

    testCSVFileParseMissingValues: function(test) {
        test.expect(6);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description,comments,user\n' +
        	',,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        
        var record = j.records[0];
        
        test.equal(record.id, "");
        test.equal(record.name, "");
        test.equal(record.description, "description1");
        test.equal(record.comments, "");
        test.equal(record.user, "");
        
        test.done();
    },

    testCSVFileParseWithTabSeparator: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        j.parse(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        
        var record = j.records[0];
        
        test.equal(record.id, "23414");
        test.equal(record.name, "name1");
        test.equal(record.description, "description1");
        
        test.done();
    },

    testCSVFileParseEscapedTab: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        j.parse(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432\tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        
        var record = j.records[1];
        
        test.equal(record.id, "754432");
        test.equal(record.name, "name2");
        test.equal(record.description, "description2 that has an escaped\t tab in it");
        
        test.done();
    },

    testCSVFileParseQuotedValuesTabSeparator: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        j.parse(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        
        var record = j.records[2];
        
        test.equal(record.id, "26234345");
        test.equal(record.name, "name with quotes");
        test.equal(record.description, "description with quotes");
        
        test.done();
    },

    testCSVFileParseWithTabSeparatorQuotedTabs: function(test) {
        test.expect(4);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        j.parse(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        
        var record = j.records[3];
        
        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted name with\t tab in it");
        test.equal(record.description, "description with\t tab in it");
        
        test.done();
    },

    testCSVFileExtractFile: function(test) {
        test.expect(13);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p, 
        	pathName: "./csv/t1.tsv",
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        // should read the file
        j.extract();
        
        test.equal(j.records.length, 10);
        
        var record = j.records[3];
        
    	test.equal(record.id, "10006");
    	
    	test.equal(record.category, "clinical_finding");
    	test.equal(record.name, "Alcohol sensitivity");
		test.equal(record["name translation"], "Sensibilidad al alcohol");
		test.equal(record.short_text, "Alcohol sensitivity");
		test.equal(record["short_text translation"], "Sensibilidad al alcohol");
		test.equal(record.long_text, "Alcohol Sensitivity?");
		test.equal(record["long_text translation"], "¿Sensibilidad al alcohol?");
		test.equal(record.description, "");
		test.equal(record["description translation"], "");
		test.equal(record["Comments/Questions"], "");

        test.done();
    },
    
    testCSVFileExtractUndefinedFile: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        test.ok(j.records);
        test.equal(j.records.length, 0);

        test.done();
    },

    testCSVFileExtractBogusFile: function(test) {
        test.expect(3);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p, 
        	pathName: "./csv/foo.csv"
        });
        
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        test.ok(j.records);
        test.equal(j.records.length, 0);

        test.done();
    },
    
    testCSVFileLocalizeText: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	"id,name,description\n" +
        	"foo,bar,asdf\n" +
        	"foo2,bar2,asdf2\n" +
        	"foo3,bar3,asdf3"
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithCommasInIt: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar,asdf",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "comma, comma",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "line3",
	        		description: "down doo be doo, down down"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	'id,name,description\n' +
        	'foo,"bar,asdf",asdf\n' +
        	'foo2,"comma, comma",asdf2\n' +
        	'foo3,line3,"down doo be doo, down down"'
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithTabs: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	rowSeparator: ':',
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	"id	name	description:" +
        	"foo	bar	asdf:" +
        	"foo2	bar2	asdf2:" +
        	"foo3	bar3	asdf3"
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithTranslations: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "description"],
        	localizable: ["name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "bar",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "bar2",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "bar3",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "bar",
        	source: "le bar",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf",
        	source: "l'asdf",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "bar2",
        	source: "le bar2",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf2",
        	source: "l'asdf2",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "bar3",
        	source: "le bar3",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf3",
        	source: "l'asdf3",
        	locale: "fr-FR",
        	datatype: "x-csv"
        }));

        var text = j.localizeText(translations, "fr-FR");
        
        test.equal(text,
        	"id,name,description\n" +
        	"foo,le bar,l'asdf\n" +
        	"foo2,le bar2,l'asdf2\n" +
        	"foo3,le bar3,l'asdf3"
        );
        
        test.done();
    },

};