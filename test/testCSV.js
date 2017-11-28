/*
 * testCSV.js - test the CSV converter object.
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

if (!CSV) {
    var CSV = require("../lib/CSV.js");
}

module.exports = {
    testCSVConstructor: function(test) {
        test.expect(1);

        var csv = new CSV();
        test.ok(csv);

        test.done();
    },

    testCSVConstructorParams: function(test) {
        test.expect(1);

        var csv = new CSV({
        	columnSeparator: "|",
        	rowSeparator: "$"
        });

        test.ok(csv);

        test.done();
    },

    testCSVtoJSGetColumnNames: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var names = csv.getColumnNames([
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
        ]);

        test.deepEqual(names, ["id", "name", "description"]);
        test.done();
    },

    testCSVtoJSCorrectColumnNames: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,"name with quotes","description with quotes"\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );

        var names = csv.getColumnNames(records);

        test.deepEqual(names, ["id", "name", "description"]);

        test.done();
    },

    testCSVtoJSRightNumberOfRows: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,"name with quotes","description with quotes"\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );

        test.equal(records.length, 4);

        test.done();
    },

    testCSVtoJSRightContent: function(test) {
        test.expect(5);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2\n' +
        	'26234345,name3,description3\n' +
        	'2345642,name4,description4\n'
        );

        test.deepEqual(records[0], {
        	id: 23414,
        	name: "name1",
        	description: "description1"
        });

        test.deepEqual(records[1], {
        	id: 754432,
        	name: "name2",
        	description: "description2"
        });

        test.deepEqual(records[2], {
        	id: 26234345,
        	name: "name3",
        	description: "description3"
        });

        test.deepEqual(records[3], {
        	id: 2345642,
        	name: "name4",
        	description: "description4"
        });

        test.done();
    },

    testCSVtoJSEscapedComma: function(test) {
        test.expect(3);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'23414,name1,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n'
        );

        test.deepEqual(records[0], {
        	id: 23414,
        	name: "name1",
        	description: "description1"
        });

        test.deepEqual(records[1], {
        	id: 754432,
        	name: "name2",
        	description: "description2 that has an escaped, comma in it"
        });

        test.done();
    },

    testCSVtoJSQuotes: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'26234345,"name with quotes","description with quotes"\n'
        );

        test.deepEqual(records[0], {
        	id: 26234345,
        	name: "name with quotes",
        	description: "description with quotes"
        });

        test.done();
    },

    testCSVtoJSEmbeddedQuotes: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'26234345,"name ""with"" quotes","description with ""quotes"""\n'
        );

        test.deepEqual(records[0], {
        	id: 26234345,
        	name: "name \"with\" quotes",
        	description: "description with \"quotes\""
        });

        test.done();
    },

    testCSVtoJSEmbeddedCommasInQuotes: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );

        test.deepEqual(records[0], {
        	id: 2345642,
        	name: "quoted name with, comma in it",
        	description: "description with, comma in it"
        });

        test.done();
    },

    testCSVtoJSTrimWhitespace: function(test) {
        test.expect(4);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'    23414  ,   name1  ,   description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345, "name with quotes", "description with quotes"\n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = records[0];

        test.equal(record.id, "23414");
        test.equal(record.name, "name1");
        test.equal(record.description, "description1");

        test.done();
    },

    testCSVtoJSSkipEmptyLinesRightNumber: function(test) {
        test.expect(2);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n' +
        	'\n' +
        	'754432,name2,description2\n'
        );

        test.equal(records.length, 2);

        test.done();
    },

    testCSVtoJSSkipEmptyLines: function(test) {
        test.expect(3);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	'\n' +
        	'2345642,"quoted name with, comma in it","description with, comma in it"\n' +
        	'\n' +
        	'754432,name2,description2\n'
        );

        test.deepEqual(records[0], {
        	id: 2345642,
        	name: "quoted name with, comma in it",
        	description: "description with, comma in it"
        });

        test.deepEqual(records[1], {
        	id: 754432,
        	name: "name2",
        	description: "description2"
        });

        test.done();
    },

    testCSVtoJSEmptyValues: function(test) {
        test.expect(4);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\n' +
        	',,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = records[0];

        test.equal(record.id, "");
        test.equal(record.name, "");
        test.equal(record.description, "description1");

        test.done();
    },

    testCSVtoJSMissingValues: function(test) {
        test.expect(6);

        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description,comments,user\n' +
        	',,description1\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \n' +
        	'2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = records[0];

        test.equal(record.id, "");
        test.equal(record.name, "");
        test.equal(record.description, "description1");
        test.equal(record.comments, "");
        test.equal(record.user, "");

        test.done();
    },

    testCSVtoJSWithTabSeparator: function(test) {
        test.expect(4);

        var csv = new CSV({
        	columnSeparator: '\t'
        });
        test.ok(csv);

        var records = csv.toJS(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = records[0];

        test.equal(record.id, "23414");
        test.equal(record.name, "name1");
        test.equal(record.description, "description1");

        test.done();
    },

    testCSVtoJSMissingValuesWithTabs: function(test) {
        test.expect(6);

        var csv = new CSV({
        	columnSeparator: '\t'
        });
        test.ok(csv);

        var records = csv.toJS(
        	'id	name	description	comments	user\n' +
        	'32342			comments1	\n' +
        	'754432	name2	description2 that has an escaped\\	 comma in it\n' +
        	'26234345	     "name with quotes"  	     "description with quotes"   \n' +
        	'2345642	 "quoted name with, comma in it"	 "description with, comma in it"\n'
        );

        var record = records[0];

        test.equal(record.id, "32342");
        test.equal(record.name, "");
        test.equal(record.description, "");
        test.equal(record.comments, "comments1");
        test.equal(record.user, "");

        test.done();
    },

    testCSVtoJSEscapedTab: function(test) {
        test.expect(4);

        var csv = new CSV({
        	columnSeparator: '\t'
        });
        test.ok(csv);

        var records = csv.toJS(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432\tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = records[1];

        test.equal(record.id, "754432");
        test.equal(record.name, "name2");
        test.equal(record.description, "description2 that has an escaped\t tab in it");

        test.done();
    },

    testCSVtoJSQuotedValuesTabSeparator: function(test) {
        test.expect(4);

        var csv = new CSV({
        	columnSeparator: '\t'
        });
        test.ok(csv);

        var records = csv.toJS(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = records[2];

        test.equal(record.id, "26234345");
        test.equal(record.name, "name with quotes");
        test.equal(record.description, "description with quotes");

        test.done();
    },

    testCSVtoJSWithTabSeparatorQuotedTabs: function(test) {
        test.expect(4);

        var csv = new CSV({
        	columnSeparator: '\t'
        });
        test.ok(csv);

        var records = csv.toJS(
        	'id\tname\tdescription\n' +
        	'23414\tname1\tdescription1\n' +
        	'754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
        	'26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
        	'2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = records[3];

        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted name with\t tab in it");
        test.equal(record.description, "description with\t tab in it");

        test.done();
    },

    testCSVtoJSDOSFile: function(test) {
        test.expect(4);

        // should work with default options
        var csv = new CSV();
        test.ok(csv);

        var records = csv.toJS(
        	'id,name,description\r\n' +
        	'23414,name1,description1\r\n' +
        	'754432,name2,description2 that has an escaped\\, comma in it\r\n' +
        	'26234345,     "name with quotes"  ,     "description with quotes"   \r\n' +
        	'2345642, "quoted name with, comma in it" , "description with, comma in it"\r\n'
        );

        var record = records[3];

        test.equal(record.id, "2345642");
        test.equal(record.name, "quoted name with, comma in it");
        test.equal(record.description, "description with, comma in it");

        test.done();
    },

    testCSVtoCSV: function(test) {
        test.expect(1);

        var csv = new CSV();

        var records = [
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
        ];

        var text = csv.toCSV(records)

        test.equal(text,
        	"id,name,description\n" +
        	"foo,bar,asdf\n" +
        	"foo2,bar2,asdf2\n" +
        	"foo3,bar3,asdf3"
        );

        test.done();
    },

    testCSVtoCSVWithCommasInIt: function(test) {
        test.expect(1);

        var csv = new CSV();

        var records = [
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
        ];

        var text = csv.toCSV(records)

        test.equal(text,
        	'id,name,description\n' +
        	'foo,"bar,asdf",asdf\n' +
        	'foo2,"comma, comma",asdf2\n' +
        	'foo3,line3,"down doo be doo, down down"'
        );

        test.done();
    },

    testCSVtoCSVWithQuotesInIt: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records = [
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
        ];

        test.ok(csv);

        var text = csv.toCSV(records)

        test.equal(text,
        	'id,name,description\n' +
        	'foo,"bar,asdf",asdf\n' +
        	'foo2,"comma ""comma"" comma",asdf2\n' +
        	'foo3,line3,"down doo be doo, down down"'
        );

        test.done();
    },

    testCSVtoCSVWithWhitespace: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records = [
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
        ];

        test.ok(csv);

        var text = csv.toCSV(records)

        test.equal(text,
        	'id,name,description\n' +
        	'foo,"   bar asdf   ",asdf\n' +
        	'foo2,"    comma ""comma"" comma   ",asdf2\n' +
        	'foo3,"   line3","  down doo be doo, down down   "'
        );

        test.done();
    },

    testCSVtoCSVWithTabs: function(test) {
        test.expect(2);

        var csv = new CSV({
        	columnSeparator: "\t"
        });

        var records = [
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
        ];

        test.ok(csv);

        var text = csv.toCSV(records)

        test.equal(text,
        	"id\tname\tdescription\n" +
        	"foo\tbar\tasdf\n" +
        	"foo2\tbar2\tasdf2\n" +
        	"foo3\tbar3\tasdf3"
        );

        test.done();
    },

    testCSVtoCSVWithMissingFields: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records = [
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
        ];

        test.ok(csv);

        var text = csv.toCSV(records)

        test.equal(text,
        	"id,description,name,type\n" +
        	"foo,asdf,,\n" +
        	"foo2,asdf2,bar2,\n" +
        	"foo3,asdf3,bar3,noun"
        );

        test.done();
    },

    testCSVtoCSVWithMissingFieldsWithTabs: function(test) {
        test.expect(2);

        var csv = new CSV({
        	columnSeparator: "\t"
        });

        var records = [
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
        ];

        test.ok(csv);

        var text = csv.toCSV(records)

        test.equal(text,
        	"id\tdescription\tname\ttype\n" +
        	"foo\tasdf\t\t\n" +
        	"foo2\tasdf2\tbar2\t\n" +
        	"foo3\tasdf3\tbar3\tnoun"
        );

        test.done();
    },


    testCSVMergeColumnNamesSameNamesSameLength: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
    	];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        var names = csv.getColumnNames(merged);
        test.equal(names.length, 3);

        test.done();
    },

    testCSVMergeColumnNamesAddColumn: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(csv.getColumnNames(merged).length, 4);

        test.done();
    },

    testCSVMergeColumnNamesAddColumnRightNames: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.deepEqual(csv.getColumnNames(merged), ["id", "name", "description", "foo"]);

        test.done();
    },

    testCSVMergeColumnNamesAddAndDeleteColumn: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records1 = [
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
       	];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(csv.getColumnNames(merged).length, 4);

        test.done();
    },

    testCSVMergeColumnNamesAddAndDeleteColumnRightNames: function(test) {
        test.expect(2);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.deepEqual(csv.getColumnNames(merged), ["id", "name", "description", "foo"]);

        test.done();
    },

    testCSVMergeRightSize: function(test) {
        test.expect(4);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(merged.length, 6);

        // these two should be unaffected
        test.equal(records1.length, 3);
        test.equal(records2.length, 3);

        test.done();
    },

    testCSVMergeRightContent: function(test) {
        test.expect(20);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
       	];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(merged.length, 6);

        for (var i = 1; i < 7; i++) {
        	test.equal(merged[i-1].id, "foo" + i);
        	test.equal(merged[i-1].name, "bar" + i);
        	test.equal(merged[i-1].description, "asdf" + i);
        }
        test.done();
    },

    testCSVMergeWithOverwrites: function(test) {
        test.expect(11);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(merged.length, 3);

        for (var i = 1; i < 4; i++) {
        	test.equal(merged[i-1].id, "foo" + i);
        	test.equal(merged[i-1].name, "bar" + (i+3));
        	test.equal(merged[i-1].description, "asdf" + (i+3));
        }
        test.done();
    },

    testCSVMergeWithSomeOverwritesAndDifferentSchema: function(test) {
        test.expect(18);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(merged.length, 4);

        test.equal(merged[0].id, "foo1");
        test.equal(merged[0].name, "bar1");
        test.equal(merged[0].description, "asdf4");
        test.equal(merged[0].type, "foo1");

        test.equal(merged[1].id, "foo2");
        test.equal(merged[1].name, "bar2");
        test.equal(merged[1].description, "asdf2");
        test.ok(!merged[1].type);

        test.equal(merged[2].id, "foo3");
        test.equal(merged[2].name, "bar3");
        test.equal(merged[2].description, "asdf6");
        test.equal(merged[2].type, "foo3");

        test.equal(merged[3].id, "foo4");
        test.ok(!merged[3].name);
        test.equal(merged[3].description, "asdf5");
        test.equal(merged[3].type, "foo4");

        test.done();
    },

    testCSVMergeWithOverwritesButDontOverwriteWithEmptyOrNull: function(test) {
        test.expect(11);

        var csv = new CSV();

        var records1 = [
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
        ];
        var records2 = [
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
        ];

        var merged = csv.merge("id", records1, records2);
        test.ok(merged);

        test.equal(merged.length, 3);

        // none of the fields should be overridden
        for (var i = 1; i < 4; i++) {
        	test.equal(merged[i-1].id, "foo" + i);
        	test.equal(merged[i-1].name, "bar" + i);
        	test.equal(merged[i-1].description, "asdf" + i);
        }
        test.done();
    }
};