/*
 * testCSVFile.js - test the CSV file handler object.
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

if (!CSVFile) {
    var CSVFile = require("../lib/CSVFile.js");
    var AndroidProject =  require("../lib/AndroidProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
    var ContextResourceString =  require("../lib/ContextResourceString.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
}

var p = new AndroidProject({
	id: "foo",
    sourceLocale: "en-US"
}, "./testfiles", {
	locales:["en-GB"]
});

module.exports = {
    testCSVFileConstructor: function(test) {
        test.expect(1);

        var j = new CSVFile();
        test.ok(j);
        
        test.done();
    },
    
    testCSVFileConstructorParams: function(test) {
        test.expect(1);

        var j = new CSVFile({
        	project: p, 
        	pathName: "./testfiles/CSV/t1.csv"
        });
        
        test.ok(j);
        
        test.done();
    },

    testCSVFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        test.done();
    },
    
    testCSVFileConstructorInitWithNames: function(test) {
        test.expect(2);

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

    testCSVFileParseTrimWhitespace: function(test) {
        test.expect(4);

        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'    23414  ,   name1  ,   description1\n' +
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

    testCSVFileParseQuotedValues: function(test) {
        test.expect(4);

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

    testCSVFileParseQuotedValuesWithEmbeddedQuotes: function(test) {
        test.expect(4);

        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted ""name"" has quotes", "description with no ""comma"" in it"\n'
        );
        
        var record = j.records[3];
        
        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted \"name\" has quotes");
        test.equal(record.description, "description with no \"comma\" in it");
        
        test.done();
    },

    testCSVFileParseEmptyValues: function(test) {
        test.expect(4);

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

    testCSVFileParseMissingValuesWithTabs: function(test) {
        test.expect(6);

        var j = new CSVFile({
        	project: p,
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        j.parse(
        	'id	name	description	comments	user\n' +
        	'32342			comments1	\n' +
        	'754432	name2	description2 that has an escaped\\	 comma in it\n' +
        	'26234345	     "name with quotes"  	     "description with quotes"   \n' +
        	'2345642	 "quoted name with, comma in it"	 "description with, comma in it"\n'
        );
        
        var record = j.records[0];
        
        test.equal(record.id, "32342");
        test.equal(record.name, "");
        test.equal(record.description, "");
        test.equal(record.comments, "comments1");
        test.equal(record.user, "");
        
        test.done();
    },

    testCSVFileParseEscapedTab: function(test) {
        test.expect(4);

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

    testCSVFileParseDOSFile: function(test) {
        test.expect(4);

        // should work with default options
        var j = new CSVFile({
        	project: p
        });
        test.ok(j);
        
        j.parse(
        	'id,name,description\r\n' +
        	'23414,name1,description1\r\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\r\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \r\n' +
        	'2345642, "quoted name with, comma in it" , "description with, comma in it"\r\n'
        );
        
        var record = j.records[3];
        
        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted name with, comma in it");
        test.equal(record.description, "description with, comma in it");
        
        test.done();
    },

    testCSVFileExtractFile: function(test) {
        test.expect(6);

        var j = new CSVFile({
        	project: p, 
        	pathName: "./csv/t1.tsv",
        	columnSeparator: '\t'
        });
        test.ok(j);
        
        // should read the file
        j.extract();
        
        test.equal(j.records.length, 3);
        
        var record = j.records[2];
        
    	test.equal(record.id, "10003");
    	test.equal(record.category, "flavor");
    	test.equal(record.name, "strawberry");
		test.equal(record["name translation"], "fraisa");

        test.done();
    },
    
    testCSVFileExtractUndefinedFile: function(test) {
        test.expect(3);

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

    testCSVFileLocalizeTextWithQuotesInIt: function(test) {
        test.expect(2);

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
	        		name: "comma \"comma\" comma",
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
        	'foo2,"comma ""comma"" comma",asdf2\n' +
        	'foo3,line3,"down doo be doo, down down"'
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithWhitespace: function(test) {
        test.expect(2);

        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "description"],
	        records: [
	        	{
	        		id: "foo",
	        		name: "   bar asdf   ",
	        		description: "asdf"
	        	},
	        	{
	        		id: "foo2",
	        		name: "    comma \"comma\" comma   ",
	        		description: "asdf2"
	        	},
	        	{
	        		id: "foo3",
	        		name: "   line3",
	        		description: "  down doo be doo, down down   "
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	'id,name,description\n' +
        	'foo,"   bar asdf   ",asdf\n' +
        	'foo2,"    comma ""comma"" comma   ",asdf2\n' +
        	'foo3,"   line3","  down doo be doo, down down   "'
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithTabs: function(test) {
        test.expect(2);

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

    testCSVFileLocalizeTextWithMissingFields: function(test) {
        test.expect(2);

        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "type", "description"],
	        records: [
	        	{
	        		id: "foo",
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
	        		type: "noun",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	"id,name,type,description\n" +
        	"foo,,,asdf\n" +
        	"foo2,bar2,,asdf2\n" +
        	"foo3,bar3,noun,asdf3"
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithMissingFieldsWithTabs: function(test) {
        test.expect(2);

        var j = new CSVFile({
        	project: p,
        	names: ["id", "name", "type", "description"],
        	columnSeparator: '\t',
	        records: [
	        	{
	        		id: "foo",
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
	        		type: "noun",
	        		description: "asdf3"
	        	}
	        ]
        });
        test.ok(j);
                
        var translations = new TranslationSet();
        
        var text = j.localizeText(translations, "en-US");
        
        test.equal(text,
        	"id	name	type	description\n" +
        	"foo			asdf\n" +
        	"foo2	bar2		asdf2\n" +
        	"foo3	bar3	noun	asdf3"
        );
        
        test.done();
    },

    testCSVFileLocalizeTextWithTranslations: function(test) {
        test.expect(2);

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
        	source: "bar",
        	sourceLocale: "en-US",
        	target: "le bar",
        	targetLocale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf",
        	source: "asdf",
        	sourceLocale: "en-US",
        	target: "l'asdf",
        	targetLocale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "bar2",
        	source: "bar2",
        	sourceLocale: "en-US",
        	target: "le bar2",
        	targetLocale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf2",
        	source: "asdf2",
        	sourceLocale: "en-US",
        	target: "l'asdf2",
        	targetLocale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "bar3",
        	source: "bar3",
        	sourceLocale: "en-US",
        	target: "le bar3",
        	targetLocale: "fr-FR",
        	datatype: "x-csv"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "asdf3",
        	source: "asdf3",
        	sourceLocale: "en-US",
        	target: "l'asdf3",
        	targetLocale: "fr-FR",
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

    testCSVFileMergeColumnNamesSameNamesSameLength: function(test) {
        test.expect(5);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			name: "bar4",
        			description: "asdf4"
        		},
        		{
        			id: "foo5",
        			name: "bar5",
        			description: "asdf5"
        		},
        		{
        			id: "foo6",
        			name: "bar6",
        			description: "asdf6"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.equal(csv1.names.length, 3);
        test.equal(csv2.names.length, 3);
        
        csv1.merge(csv2);
        
        test.equal(csv1.names.length, 3);

        test.done();
    },

    testCSVFileMergeColumnNamesAddColumn: function(test) {
        test.expect(5);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description", "foo"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			name: "bar4",
        			description: "asdf4",
        			foo: "asdf"
        		},
        		{
        			id: "foo5",
        			name: "bar5",
        			description: "asdf5",
        			foo: "asdf"
        		},
        		{
        			id: "foo6",
        			name: "bar6",
        			description: "asdf6",
        			foo: "asdf"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.equal(csv1.names.length, 3);
        test.equal(csv2.names.length, 4);
        
        csv1.merge(csv2);
        
        test.equal(csv1.names.length, 4);

        test.done();
    },

    testCSVFileMergeColumnNamesAddColumnRightNames: function(test) {
        test.expect(4);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description", "foo"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			name: "bar4",
        			description: "asdf4",
        			foo: "asdf"
        		},
        		{
        			id: "foo5",
        			name: "bar5",
        			description: "asdf5",
        			foo: "asdf"
        		},
        		{
        			id: "foo6",
        			name: "bar6",
        			description: "asdf6",
        			foo: "asdf"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.deepEqual(csv1.names, ["id", "name", "description"]);
        
        csv1.merge(csv2);
        
        test.deepEqual(csv1.names, ["id", "name", "description", "foo"]);

        test.done();
    },

    testCSVFileMergeColumnNamesAddAndDeleteColumn: function(test) {
        test.expect(5);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "description", "foo"],
        	records: [
        		{
        			id: "foo4",
        			description: "asdf4",
        			foo: "asdf"
        		},
        		{
        			id: "foo5",
        			description: "asdf5",
        			foo: "asdf"
        		},
        		{
        			id: "foo6",
        			description: "asdf6",
        			foo: "asdf"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.equal(csv1.names.length, 3);
        test.equal(csv2.names.length, 3);
        
        csv1.merge(csv2);
        
        test.equal(csv1.names.length, 4);

        test.done();
    },

    testCSVFileMergeColumnNamesAddAndDeleteColumnRightNames: function(test) {
        test.expect(4);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "description", "foo"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			description: "asdf4",
        			foo: "asdf"
        		},
        		{
        			id: "foo5",
        			description: "asdf5",
        			foo: "asdf"
        		},
        		{
        			id: "foo6",
        			description: "asdf6",
        			foo: "asdf"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.deepEqual(csv1.names, ["id", "name", "description"]);
        
        csv1.merge(csv2);
        
        test.deepEqual(csv1.names, ["id", "name", "description", "foo"]);

        test.done();
    },

    testCSVFileMergeRightSize: function(test) {
        test.expect(6);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
	        records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			name: "bar4",
        			description: "asdf4"
        		},
        		{
        			id: "foo5",
        			name: "bar5",
        			description: "asdf5"
        		},
        		{
        			id: "foo6",
        			name: "bar6",
        			description: "asdf6"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        test.equal(csv1.records.length, 3);
        test.equal(csv2.records.length, 3);
        
        csv1.merge(csv2);
        
        test.equal(csv1.records.length, 6);
        test.equal(csv2.records.length, 3);
        
        test.done();
    },

    testCSVFileMergeRightContent: function(test) {
        test.expect(21);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
        		{
        			id: "foo4",
        			name: "bar4",
        			description: "asdf4"
        		},
        		{
        			id: "foo5",
        			name: "bar5",
        			description: "asdf5"
        		},
        		{
        			id: "foo6",
        			name: "bar6",
        			description: "asdf6"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        csv1.merge(csv2);
        
        test.equal(csv1.records.length, 6);
        
        for (var i = 1; i < 7; i++) {
        	test.equal(csv1.records[i-1].id, "foo" + i);
        	test.equal(csv1.records[i-1].name, "bar" + i);
        	test.equal(csv1.records[i-1].description, "asdf" + i);
        }
        test.done();
    },

    testCSVFileMergeWithOverwrites: function(test) {
        test.expect(12);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
        		{
        			id: "foo1",
        			name: "bar4",
        			description: "asdf4"
        		},
        		{
        			id: "foo2",
        			name: "bar5",
        			description: "asdf5"
        		},
        		{
        			id: "foo3",
        			name: "bar6",
        			description: "asdf6"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        csv1.merge(csv2);
        
        test.equal(csv1.records.length, 3);
        
        for (var i = 1; i < 4; i++) {
        	test.equal(csv1.records[i-1].id, "foo" + i);
        	test.equal(csv1.records[i-1].name, "bar" + (i+3));
        	test.equal(csv1.records[i-1].description, "asdf" + (i+3));
        }
        test.done();
    },
    
    testCSVFileMergeWithSomeOverwritesAndDifferentSchema: function(test) {
        test.expect(19);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "description", "type"],
        	key: "id",
        	records: [
        		{
        			id: "foo1",
        			description: "asdf4",
        			type: "foo1"
        		},
        		{
        			id: "foo4",
        			description: "asdf5",
        			type: "foo4"
        		},
        		{
        			id: "foo3",
        			description: "asdf6",
        			type: "foo3"
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        csv1.merge(csv2);
        
        test.equal(csv1.records.length, 4);
        
        test.equal(csv1.records[0].id, "foo1");
        test.equal(csv1.records[0].name, "bar1");
        test.equal(csv1.records[0].description, "asdf4");
        test.equal(csv1.records[0].type, "foo1");
        
        test.equal(csv1.records[1].id, "foo2");
        test.equal(csv1.records[1].name, "bar2");
        test.equal(csv1.records[1].description, "asdf2");
        test.ok(!csv1.records[1].type);
        
        test.equal(csv1.records[2].id, "foo3");
        test.equal(csv1.records[2].name, "bar3");
        test.equal(csv1.records[2].description, "asdf6");
        test.equal(csv1.records[2].type, "foo3");
        
        test.equal(csv1.records[3].id, "foo4");
        test.ok(!csv1.records[3].name);
        test.equal(csv1.records[3].description, "asdf5");
        test.equal(csv1.records[3].type, "foo4");
                
        test.done();
    },
    
    testCSVFileMergeWithOverwritesButDontOverwriteWithEmptyOrNull: function(test) {
        test.expect(12);

        var csv1 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
	        	{
	        		id: "foo1",
	        		name: "bar1",
	        		description: "asdf1"
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
        var csv2 = new CSVFile({
        	project: p,
        	columnSeparator: '\t',
        	names: ["id", "name", "description"],
        	key: "id",
        	records: [
        		{
        			id: "foo1",
        			name: "",
        			description: ""
        		},
        		{
        			id: "foo2",
        			name: null,
        			description: null
        		},
        		{
        			id: "foo3",
        			name: undefined,
        			description: undefined
        		}
        	]
        });
        test.ok(csv1);
        test.ok(csv2);
        
        csv1.merge(csv2);
        
        test.equal(csv1.records.length, 3);
        
        // none of the fields should be overridden
        for (var i = 1; i < 4; i++) {
        	test.equal(csv1.records[i-1].id, "foo" + i);
        	test.equal(csv1.records[i-1].name, "bar" + i);
        	test.equal(csv1.records[i-1].description, "asdf" + i);
        }
        test.done();
    }
};