/*
 * CSV.test.js - test the CSV converter object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
describe("csv", function() {
    test("CSVConstructor", function() {
        expect.assertions(1);
        var csv = new CSV();
        expect(csv).toBeTruthy();
    });
    test("CSVConstructorParams", function() {
        expect.assertions(1);
        var csv = new CSV({
            columnSeparator: "|",
            rowSeparator: "$"
        });
        expect(csv).toBeTruthy();
    });
    test("CSVtoJSGetColumnNames", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
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
        expect(names, ["id", "name").toStrictEqual("description"]);
    });
    test("CSVtoJSCorrectColumnNames", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,"name with quotes","description with quotes"\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );
        var names = csv.getColumnNames(records);
        expect(names, ["id", "name").toStrictEqual("description"]);
    });
    test("CSVtoJSRightNumberOfRows", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,"name with quotes","description with quotes"\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );
        expect(records.length).toBe(4);
    });
    test("CSVtoJSRightContent", function() {
        expect.assertions(5);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2\n' +
            '26234345,name3,description3\n' +
            '2345642,name4,description4\n'
        );
        expect(records[0]).toStrictEqual({
            id: 23414,
            name: "name1",
            description: "description1"
        });
        expect(records[1]).toStrictEqual({
            id: 754432,
            name: "name2",
            description: "description2"
        });
        expect(records[2]).toStrictEqual({
            id: 26234345,
            name: "name3",
            description: "description3"
        });
        expect(records[3]).toStrictEqual({
            id: 2345642,
            name: "name4",
            description: "description4"
        });
    });
    test("CSVtoJSEscapedComma", function() {
        expect.assertions(3);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n'
        );
        expect(records[0]).toStrictEqual({
            id: 23414,
            name: "name1",
            description: "description1"
        });
        expect(records[1]).toStrictEqual({
            id: 754432,
            name: "name2",
            description: "description2 that has an escaped, comma in it"
        });
    });
    test("CSVtoJSQuotes", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '26234345,"name with quotes","description with quotes"\n'
        );
        expect(records[0]).toStrictEqual({
            id: 26234345,
            name: "name with quotes",
            description: "description with quotes"
        });
    });
    test("CSVtoJSEmbeddedQuotes", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '26234345,"name ""with"" quotes","description with ""quotes"""\n'
        );
        expect(records[0]).toStrictEqual({
            id: 26234345,
            name: "name \"with\" quotes",
            description: "description with \"quotes\""
        });
    });
    test("CSVtoJSEmbeddedCommasInQuotes", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );
        expect(records[0]).toStrictEqual({
            id: 2345642,
            name: "quoted name with, comma in it",
            description: "description with, comma in it"
        });
    });
    test("CSVtoJSTrimWhitespace", function() {
        expect.assertions(4);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '    23414  ,   name1  ,   description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345, "name with quotes", "description with quotes"\n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        var record = records[0];
        expect(record.id).toBe("23414");
        expect(record.name).toBe("name1");
        expect(record.description).toBe("description1");
    });
    test("CSVtoJSSkipEmptyLinesRightNumber", function() {
        expect.assertions(2);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n' +
            '\n' +
            '754432,name2,description2\n'
        );
        expect(records.length).toBe(2);
    });
    test("CSVtoJSSkipEmptyLines", function() {
        expect.assertions(3);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            '\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n' +
            '\n' +
            '754432,name2,description2\n'
        );
        expect(records[0]).toStrictEqual({
            id: 2345642,
            name: "quoted name with, comma in it",
            description: "description with, comma in it"
        });
        expect(records[1]).toStrictEqual({
            id: 754432,
            name: "name2",
            description: "description2"
        });
    });
    test("CSVtoJSEmptyValues", function() {
        expect.assertions(4);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\n' +
            ',,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        var record = records[0];
        expect(record.id).toBe("");
        expect(record.name).toBe("");
        expect(record.description).toBe("description1");
    });
    test("CSVtoJSMissingValues", function() {
        expect.assertions(6);
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description,comments,user\n' +
            ',,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );
        var record = records[0];
        expect(record.id).toBe("");
        expect(record.name).toBe("");
        expect(record.description).toBe("description1");
        expect(record.comments).toBe("");
        expect(record.user).toBe("");
    });
    test("CSVtoJSWithTabSeparator", function() {
        expect.assertions(4);
        var csv = new CSV({
            columnSeparator: '\t'
        });
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        var record = records[0];
        expect(record.id).toBe("23414");
        expect(record.name).toBe("name1");
        expect(record.description).toBe("description1");
    });
    test("CSVtoJSMissingValuesWithTabs", function() {
        expect.assertions(6);
        var csv = new CSV({
            columnSeparator: '\t'
        });
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id    name    description    comments    user\n' +
            '32342            comments1    \n' +
            '754432    name2    description2 that has an escaped\\     comma in it\n' +
            '26234345         "name with quotes"           "description with quotes"   \n' +
            '2345642     "quoted name with, comma in it"     "description with, comma in it"\n'
        );
        var record = records[0];
        expect(record.id).toBe("32342");
        expect(record.name).toBe("");
        expect(record.description).toBe("");
        expect(record.comments).toBe("comments1");
        expect(record.user).toBe("");
    });
    test("CSVtoJSEscapedTab", function() {
        expect.assertions(4);
        var csv = new CSV({
            columnSeparator: '\t'
        });
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432\tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        var record = records[1];
        expect(record.id).toBe("754432");
        expect(record.name).toBe("name2");
        expect(record.description).toBe("description2 that has an escaped\t tab in it");
    });
    test("CSVtoJSQuotedValuesTabSeparator", function() {
        expect.assertions(4);
        var csv = new CSV({
            columnSeparator: '\t'
        });
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        var record = records[2];
        expect(record.id).toBe("26234345");
        expect(record.name).toBe("name with quotes");
        expect(record.description).toBe("description with quotes");
    });
    test("CSVtoJSWithTabSeparatorQuotedTabs", function() {
        expect.assertions(4);
        var csv = new CSV({
            columnSeparator: '\t'
        });
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );
        var record = records[3];
        expect(record.id).toBe("2345642");
        expect(record.name).toBe("quoted name with\t tab in it");
        expect(record.description).toBe("description with\t tab in it");
    });
    test("CSVtoJSDOSFile", function() {
        expect.assertions(4);
        // should work with default options
        var csv = new CSV();
        expect(csv).toBeTruthy();
        var records = csv.toJS(
            'id,name,description\r\n' +
            '23414,name1,description1\r\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\r\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \r\n' +
            '2345642, "quoted name with, comma in it" , "description with, comma in it"\r\n'
        );
        var record = records[3];
        expect(record.id).toBe("2345642");
        expect(record.name, "quoted name with).toBe(comma in it");
        expect(record.description, "description with).toBe(comma in it");
    });
    test("CSVtoCSV", function() {
        expect.assertions(1);
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
        expect(text).toBe("id,name,description\n" +
            "foo,bar,asdf\n" +
            "foo2,bar2,asdf2\n" +
            "foo3,bar3,asdf3"
        );
    });
    test("CSVtoCSVWithCommasInIt", function() {
        expect.assertions(1);
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
        expect(text).toBe('id,name,description\n' +
            'foo,"bar,asdf",asdf\n' +
            'foo2,"comma, comma",asdf2\n' +
            'foo3,line3,"down doo be doo, down down"'
        );
    });
    test("CSVtoCSVWithQuotesInIt", function() {
        expect.assertions(2);
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
        expect(csv).toBeTruthy();
        var text = csv.toCSV(records)
        expect(text).toBe('id,name,description\n' +
            'foo,"bar,asdf",asdf\n' +
            'foo2,"comma ""comma"" comma",asdf2\n' +
            'foo3,line3,"down doo be doo, down down"'
        );
    });
    test("CSVtoCSVWithWhitespace", function() {
        expect.assertions(2);
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
        expect(csv).toBeTruthy();
        var text = csv.toCSV(records)
        expect(text).toBe('id,name,description\n' +
            'foo,"   bar asdf   ",asdf\n' +
            'foo2,"    comma ""comma"" comma   ",asdf2\n' +
            'foo3,"   line3","  down doo be doo, down down   "'
        );
    });
    test("CSVtoCSVWithTabs", function() {
        expect.assertions(2);
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
        expect(csv).toBeTruthy();
        var text = csv.toCSV(records)
        expect(text).toBe("id\tname\tdescription\n" +
            "foo\tbar\tasdf\n" +
            "foo2\tbar2\tasdf2\n" +
            "foo3\tbar3\tasdf3"
        );
    });
    test("CSVtoCSVWithMissingFields", function() {
        expect.assertions(2);
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
        expect(csv).toBeTruthy();
        var text = csv.toCSV(records)
        expect(text).toBe("id,description,name,type\n" +
            "foo,asdf,,\n" +
            "foo2,asdf2,bar2,\n" +
            "foo3,asdf3,bar3,noun"
        );
    });
    test("CSVtoCSVWithMissingFieldsWithTabs", function() {
        expect.assertions(2);
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
        expect(csv).toBeTruthy();
        var text = csv.toCSV(records)
        expect(text).toBe("id\tdescription\tname\ttype\n" +
            "foo\tasdf\t\t\n" +
            "foo2\tasdf2\tbar2\t\n" +
            "foo3\tasdf3\tbar3\tnoun"
        );
    });
    test("CSVMergeColumnNamesSameNamesSameLength", function() {
        expect.assertions(2);
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
        expect(merged).toBeTruthy();
        var names = csv.getColumnNames(merged);
        expect(names.length).toBe(3);
    });
    test("CSVMergeColumnNamesAddColumn", function() {
        expect.assertions(2);
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
        expect(merged).toBeTruthy();
        expect(csv.getColumnNames(merged).length).toBe(4);
    });
    test("CSVMergeColumnNamesAddColumnRightNames", function() {
        expect.assertions(2);
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
        expect(merged).toBeTruthy();
        expect(csv.getColumnNames(merged), ["id", "name", "description").toStrictEqual("foo"]);
    });
    test("CSVMergeColumnNamesAddAndDeleteColumn", function() {
        expect.assertions(2);
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
        expect(merged).toBeTruthy();
        expect(csv.getColumnNames(merged).length).toBe(4);
    });
    test("CSVMergeColumnNamesAddAndDeleteColumnRightNames", function() {
        expect.assertions(2);
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
        expect(merged).toBeTruthy();
        expect(csv.getColumnNames(merged), ["id", "name", "description").toStrictEqual("foo"]);
    });
    test("CSVMergeRightSize", function() {
        expect.assertions(4);
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
        expect(merged).toBeTruthy();
        expect(merged.length).toBe(6);
        // these two should be unaffected
        expect(records1.length).toBe(3);
        expect(records2.length).toBe(3);
    });
    test("CSVMergeRightContent", function() {
        expect.assertions(20);
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
        expect(merged).toBeTruthy();
        expect(merged.length).toBe(6);
        for (var i = 1; i < 7; i++) {
            expect(merged[i-1].id).toBe("foo" + i);
            expect(merged[i-1].name).toBe("bar" + i);
            expect(merged[i-1].description).toBe("asdf" + i);
        }
    });
    test("CSVMergeWithOverwrites", function() {
        expect.assertions(11);
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
        expect(merged).toBeTruthy();
        expect(merged.length).toBe(3);
        for (var i = 1; i < 4; i++) {
            expect(merged[i-1].id).toBe("foo" + i);
            expect(merged[i-1].name).toBe("bar" + (i+3));
            expect(merged[i-1].description).toBe("asdf" + (i+3));
        }
    });
    test("CSVMergeWithSomeOverwritesAndDifferentSchema", function() {
        expect.assertions(18);
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
        expect(merged).toBeTruthy();
        expect(merged.length).toBe(4);
        expect(merged[0].id).toBe("foo1");
        expect(merged[0].name).toBe("bar1");
        expect(merged[0].description).toBe("asdf4");
        expect(merged[0].type).toBe("foo1");
        expect(merged[1].id).toBe("foo2");
        expect(merged[1].name).toBe("bar2");
        expect(merged[1].description).toBe("asdf2");
        expect(!merged[1].type).toBeTruthy();
        expect(merged[2].id).toBe("foo3");
        expect(merged[2].name).toBe("bar3");
        expect(merged[2].description).toBe("asdf6");
        expect(merged[2].type).toBe("foo3");
        expect(merged[3].id).toBe("foo4");
        expect(!merged[3].name).toBeTruthy();
        expect(merged[3].description).toBe("asdf5");
        expect(merged[3].type).toBe("foo4");
    });
    test("CSVMergeWithOverwritesButDontOverwriteWithEmptyOrNull", function() {
        expect.assertions(11);
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
        expect(merged).toBeTruthy();
        expect(merged.length).toBe(3);
        // none of the fields should be overridden
        for (var i = 1; i < 4; i++) {
            expect(merged[i-1].id).toBe("foo" + i);
            expect(merged[i-1].name).toBe("bar" + i);
            expect(merged[i-1].description).toBe("asdf" + i);
        }
    });
});
