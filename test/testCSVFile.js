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

    /*
    testCSVFileExtractFile: function(test) {
        test.expect(8);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile(p, "./CSV/t1.csv");
        test.ok(j);
        
        // should read the file
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 2);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        
        var r = set.get(ContextResourceString.hashKey(undefined, undefined, "en-US", "id1", "CSV"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");
        
        test.done();
    },
    
    testCSVFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile(p);
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testCSVFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new AndroidProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var j = new CSVFile(p, "./CSV/foo.CSV");
        test.ok(j);
        
        // should attempt to read the file and not fail
        j.extract();
        
        var set = j.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },
*/
};