/*
 * CSVFile.test.js - test the CSV file handler object.
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
}, "./test/testfiles", {
    locales:["en-GB"]
});
describe.skip("csvfile", function() {
    test("CSVFileConstructor", function() {
        expect.assertions(1);

        var j = new CSVFile();
        expect(j).toBeTruthy();
    });

    test("CSVFileConstructorParams", function() {
        expect.assertions(1);

        var j = new CSVFile({
            project: p,
            pathName: "./test/testfiles/CSV/t1.csv"
        });

        expect(j).toBeTruthy();
    });

    test("CSVFileConstructorNoFile", function() {
        expect.assertions(1);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();
    });

    test("CSVFileConstructorInitWithNames", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();
        expect(j.names).toStrictEqual(["id", "name", "description"]);
    });

    test("CSVFileConstructorInitWithContent", function() {
        expect.assertions(10);

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
        expect(j).toBeTruthy();

        var record = j.records[0];

        expect(record.id).toBe("foo");
        expect(record.name).toBe("bar");
        expect(record.description).toBe("asdf");

        record = j.records[1];

        expect(record.id).toBe("foo2");
        expect(record.name).toBe("bar2");
        expect(record.description).toBe("asdf2");

        record = j.records[2];

        expect(record.id).toBe("foo3");
        expect(record.name).toBe("bar3");
        expect(record.description).toBe("asdf3");
    });

    test("CSVFileConstructorInitWithLocalizableColumns", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();
        expect(j.localizable).toStrictEqual(new Set(["name", "description"]));
    });

    test("CSVFileParseGetColumnNames", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,"name with quotes","description with quotes"\n' +
            '2345642,"quoted name with, comma in it","description with, comma in it"\n'
        );

        var names = j.names;

        expect(names[0]).toBe("id");
        expect(names[1]).toBe("name");
        expect(names[2]).toBe("description");
    });

    test("CSVFileParseRightRecords", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345, "name with quotes", "description with quotes"\n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("23414");
        expect(record.name).toBe("name1");
        expect(record.description).toBe("description1");
    });

    test("CSVFileParseEscapedComma", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345, "name with quotes", "description with quotes"\n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[1];

        expect(record.id).toBe("754432");
        expect(record.name).toBe("name2");
        expect(record.description, "description2 that has an escaped).toBe(comma in it");
    });

    test("CSVFileParseTrimWhitespace", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '    23414  ,   name1  ,   description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345, "name with quotes", "description with quotes"\n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("23414");
        expect(record.name).toBe("name1");
        expect(record.description).toBe("description1");
    });

    test("CSVFileParseQuotedValues", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[2];

        expect(record.id).toBe("26234345");
        expect(record.name).toBe("name with quotes");
        expect(record.description).toBe("description with quotes");
    });

    test("CSVFileParseQuotedValuesWithCommas", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[3];

        expect(record.id).toBe("2345642");
        expect(record.name, "quoted name with).toBe(comma in it");
        expect(record.description, "description with).toBe(comma in it");
    });

    test("CSVFileParseQuotedValuesWithEmbeddedQuotes", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            '23414,name1,description1\n' +
            '754432,name2,description2 that has an escaped\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted ""name"" has quotes", "description with no ""comma"" in it"\n'
        );

        var record = j.records[3];

        expect(record.id).toBe("2345642");
        expect(record.name).toBe("quoted \"name\" has quotes");
        expect(record.description).toBe("description with no \"comma\" in it");
    });

    test("CSVFileParseEmptyValues", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\n' +
            ',,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("");
        expect(record.name).toBe("");
        expect(record.description).toBe("description1");
    });

    test("CSVFileParseMissingValues", function() {
        expect.assertions(6);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description,comments,user\n' +
            ',,description1\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \n' +
            '2345642, "quoted name with, comma in it", "description with, comma in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("");
        expect(record.name).toBe("");
        expect(record.description).toBe("description1");
        expect(record.comments).toBe("");
        expect(record.user).toBe("");
    });

    test("CSVFileParseWithTabSeparator", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p,
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        j.parse(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("23414");
        expect(record.name).toBe("name1");
        expect(record.description).toBe("description1");
    });

    test("CSVFileParseMissingValuesWithTabs", function() {
        expect.assertions(6);

        var j = new CSVFile({
            project: p,
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        j.parse(
            'id    name    description    comments    user\n' +
            '32342            comments1    \n' +
            '754432    name2    description2 that has an escaped\\     comma in it\n' +
            '26234345         "name with quotes"           "description with quotes"   \n' +
            '2345642     "quoted name with, comma in it"     "description with, comma in it"\n'
        );

        var record = j.records[0];

        expect(record.id).toBe("32342");
        expect(record.name).toBe("");
        expect(record.description).toBe("");
        expect(record.comments).toBe("comments1");
        expect(record.user).toBe("");
    });

    test("CSVFileParseEscapedTab", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p,
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        j.parse(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432\tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = j.records[1];

        expect(record.id).toBe("754432");
        expect(record.name).toBe("name2");
        expect(record.description).toBe("description2 that has an escaped\t tab in it");
    });

    test("CSVFileParseQuotedValuesTabSeparator", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p,
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        j.parse(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = j.records[2];

        expect(record.id).toBe("26234345");
        expect(record.name).toBe("name with quotes");
        expect(record.description).toBe("description with quotes");
    });

    test("CSVFileParseWithTabSeparatorQuotedTabs", function() {
        expect.assertions(4);

        var j = new CSVFile({
            project: p,
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        j.parse(
            'id\tname\tdescription\n' +
            '23414\tname1\tdescription1\n' +
            '754432tname2\tdescription2 that has an escaped\\\t tab in it\n' +
            '26234345\t     "name with quotes"  \t     "description with quotes"   \n' +
            '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
        );

        var record = j.records[3];

        expect(record.id).toBe("2345642");
        expect(record.name).toBe("quoted name with\t tab in it");
        expect(record.description).toBe("description with\t tab in it");
    });

    test("CSVFileParseDOSFile", function() {
        expect.assertions(4);

        // should work with default options
        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        j.parse(
            'id,name,description\r\n' +
            '23414,name1,description1\r\n' +
            '754432,name2,description2 that has an escaped\\, comma in it\r\n' +
            '26234345,     "name with quotes"  ,     "description with quotes"   \r\n' +
            '2345642, "quoted name with, comma in it" , "description with, comma in it"\r\n'
        );

        var record = j.records[3];

        expect(record.id).toBe("2345642");
        expect(record.name).toBe("quoted name with, comma in it");
        expect(record.description).toBe("description with, comma in it");
    });

    test("CSVFileExtractFile", function() {
        expect.assertions(6);

        var j = new CSVFile({
            project: p,
            pathName: "./csv/t1.tsv",
            columnSeparator: '\t'
        });
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        expect(j.records.length).toBe(3);

        var record = j.records[2];

        expect(record.id).toBe("10003");
        expect(record.category).toBe("flavor");
        expect(record.name).toBe("strawberry");
        expect(record["name translation"]).toBe("fraisa");
    });

    test("CSVFileExtractUndefinedFile", function() {
        expect.assertions(3);

        var j = new CSVFile({
            project: p
        });
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        expect(j.records).toBeTruthy();
        expect(j.records.length).toBe(0);
    });

    test("CSVFileExtractBogusFile", function() {
        expect.assertions(3);

        var j = new CSVFile({
            project: p,
            pathName: "./csv/foo.csv"
        });

        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        expect(j.records).toBeTruthy();
        expect(j.records.length).toBe(0);
    });

    test("CSVFileLocalizeText", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe("id,name,description\n" +
            "foo,bar,asdf\n" +
            "foo2,bar2,asdf2\n" +
            "foo3,bar3,asdf3"
        );
    });

    test("CSVFileLocalizeTextWithCommasInIt", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe('id,name,description\n' +
            'foo,"bar,asdf",asdf\n' +
            'foo2,"comma, comma",asdf2\n' +
            'foo3,line3,"down doo be doo, down down"'
        );
    });

    test("CSVFileLocalizeTextWithQuotesInIt", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe('id,name,description\n' +
            'foo,"bar,asdf",asdf\n' +
            'foo2,"comma ""comma"" comma",asdf2\n' +
            'foo3,line3,"down doo be doo, down down"'
        );
    });

    test("CSVFileLocalizeTextWithWhitespace", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe('id,name,description\n' +
            'foo,"   bar asdf   ",asdf\n' +
            'foo2,"    comma ""comma"" comma   ",asdf2\n' +
            'foo3,"   line3","  down doo be doo, down down   "'
        );
    });

    test("CSVFileLocalizeTextWithTabs", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe("id    name    description:" +
            "foo    bar    asdf:" +
            "foo2    bar2    asdf2:" +
            "foo3    bar3    asdf3"
        );
    });

    test("CSVFileLocalizeTextWithMissingFields", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe("id,name,type,description\n" +
            "foo,,,asdf\n" +
            "foo2,bar2,,asdf2\n" +
            "foo3,bar3,noun,asdf3"
        );
    });

    test("CSVFileLocalizeTextWithMissingFieldsWithTabs", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

        var translations = new TranslationSet();

        var text = j.localizeText(translations, "en-US");

        expect(text).toBe("id    name    type    description\n" +
            "foo            asdf\n" +
            "foo2    bar2        asdf2\n" +
            "foo3    bar3    noun    asdf3"
        );
    });

    test("CSVFileLocalizeTextWithTranslations", function() {
        expect.assertions(2);

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
        expect(j).toBeTruthy();

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

        expect(text).toBe("id,name,description\n" +
            "foo,le bar,l'asdf\n" +
            "foo2,le bar2,l'asdf2\n" +
            "foo3,le bar3,l'asdf3"
        );
    });

    test("CSVFileMergeColumnNamesSameNamesSameLength", function() {
        expect.assertions(5);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        expect(csv1.names.length).toBe(3);
        expect(csv2.names.length).toBe(3);

        csv1.merge(csv2);

        expect(csv1.names.length).toBe(3);
    });

    test("CSVFileMergeColumnNamesAddColumn", function() {
        expect.assertions(5);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        expect(csv1.names.length).toBe(3);
        expect(csv2.names.length).toBe(4);

        csv1.merge(csv2);

        expect(csv1.names.length).toBe(4);
    });

    test("CSVFileMergeColumnNamesAddColumnRightNames", function() {
        expect.assertions(4);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();
        expect(csv1.names).toStrictEqual(["id", "name", "description"]);
        csv1.merge(csv2);
        expect(csv1.names).toStrictEqual(["id", "name", "description", "foo"]);
    });

    test("CSVFileMergeColumnNamesAddAndDeleteColumn", function() {
        expect.assertions(5);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        expect(csv1.names.length).toBe(3);
        expect(csv2.names.length).toBe(3);

        csv1.merge(csv2);

        expect(csv1.names.length).toBe(4);
    });

    test("CSVFileMergeColumnNamesAddAndDeleteColumnRightNames", function() {
        expect.assertions(4);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();
        expect(csv1.names).toStrictEqual(["id", "name", "description"]);
        csv1.merge(csv2);
        expect(csv1.names).toStrictEqual(["id", "name", "description", "foo"]);
    });

    test("CSVFileMergeRightSize", function() {
        expect.assertions(6);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        expect(csv1.records.length).toBe(3);
        expect(csv2.records.length).toBe(3);

        csv1.merge(csv2);

        expect(csv1.records.length).toBe(6);
        expect(csv2.records.length).toBe(3);
    });

    test("CSVFileMergeRightContent", function() {
        expect.assertions(21);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        csv1.merge(csv2);

        expect(csv1.records.length).toBe(6);

        for (var i = 1; i < 7; i++) {
            expect(csv1.records[i-1].id).toBe("foo" + i);
            expect(csv1.records[i-1].name).toBe("bar" + i);
            expect(csv1.records[i-1].description).toBe("asdf" + i);
        }
    });

    test("CSVFileMergeWithOverwrites", function() {
        expect.assertions(12);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        csv1.merge(csv2);

        expect(csv1.records.length).toBe(3);

        for (var i = 1; i < 4; i++) {
            expect(csv1.records[i-1].id).toBe("foo" + i);
            expect(csv1.records[i-1].name).toBe("bar" + (i+3));
            expect(csv1.records[i-1].description).toBe("asdf" + (i+3));
        }
    });

    test("CSVFileMergeWithSomeOverwritesAndDifferentSchema", function() {
        expect.assertions(19);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        csv1.merge(csv2);

        expect(csv1.records.length).toBe(4);

        expect(csv1.records[0].id).toBe("foo1");
        expect(csv1.records[0].name).toBe("bar1");
        expect(csv1.records[0].description).toBe("asdf4");
        expect(csv1.records[0].type).toBe("foo1");

        expect(csv1.records[1].id).toBe("foo2");
        expect(csv1.records[1].name).toBe("bar2");
        expect(csv1.records[1].description).toBe("asdf2");
        expect(!csv1.records[1].type).toBeTruthy();

        expect(csv1.records[2].id).toBe("foo3");
        expect(csv1.records[2].name).toBe("bar3");
        expect(csv1.records[2].description).toBe("asdf6");
        expect(csv1.records[2].type).toBe("foo3");

        expect(csv1.records[3].id).toBe("foo4");
        expect(!csv1.records[3].name).toBeTruthy();
        expect(csv1.records[3].description).toBe("asdf5");
        expect(csv1.records[3].type).toBe("foo4");
    });

    test("CSVFileMergeWithOverwritesButDontOverwriteWithEmptyOrNull", function() {
        expect.assertions(12);

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
        expect(csv1).toBeTruthy();
        expect(csv2).toBeTruthy();

        csv1.merge(csv2);

        expect(csv1.records.length).toBe(3);

        // none of the fields should be overridden
        for (var i = 1; i < 4; i++) {
            expect(csv1.records[i-1].id).toBe("foo" + i);
            expect(csv1.records[i-1].name).toBe("bar" + i);
            expect(csv1.records[i-1].description).toBe("asdf" + i);
        }
    });
});
