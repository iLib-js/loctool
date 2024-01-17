/*
 * XliffSelect.test.js - test the merge of Xliff object.
 *
 * Copyright © 2024 JEDLSoft
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
var fs = require("fs");

var Xliff = require("../lib/Xliff.js");
var XliffSelect = require("../lib/XliffSelect.js");

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

describe("xliff select criteria parser", function() {
    test("simple criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("state=Accepted");
        var expected = {
            fields: {
                state: /Accepted/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("regex criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("state=^app.*$");
        var expected = {
            fields: {
                state: /^app.*$/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("regex criteria with equals in it", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("state=^app.*=\\d$");
        var expected = {
            fields: {
                state: /^app.*=\d$/
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("maxunits criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("maxunits:34");
        var expected = {
            maxunits: 34
        };
        expect(actual).toStrictEqual(expected);
    });

    test("maxsource criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("maxsource:34");
        var expected = {
            maxsource: 34
        };
        expect(actual).toStrictEqual(expected);
    });

    test("maxtarget criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("maxtarget:34");
        var expected = {
            maxtarget: 34
        };
        expect(actual).toStrictEqual(expected);
    });

    test("random criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("random");
        var expected = {
            random: true
        };
        expect(actual).toStrictEqual(expected);
    });

    test("source category criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("source.one=foo");
        var expected = {
            fields: {
                source: /foo/
            },
            category: "one"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("target category criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("target.other=foo");
        var expected = {
            fields: {
                target: /foo/
            },
            category: "other"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("source array criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("source.2=foo");
        var expected = {
            fields: {
                source: /foo/
            },
            index: 2
        };
        expect(actual).toStrictEqual(expected);
    });

    test("target category criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("target.4=foo");
        var expected = {
            fields: {
                target: /foo/
            },
            index: 4
        };
        expect(actual).toStrictEqual(expected);
    });

    test("unknown field name", function() {
        expect.assertions(1);

        expect(function() {
            XliffSelect.parseCriteria("bar=foo");
        }).toThrow();
    });

    test("unknown category name", function() {
        expect.assertions(1);

        expect(function() {
            XliffSelect.parseCriteria("source.foo=bar");
        }).toThrow();
    });

    test("empty field name", function() {
        expect.assertions(1);

        expect(function() {
            XliffSelect.parseCriteria("=bar");
        }).toThrow();
    });

    test("empty field value", function() {
        expect.assertions(1);

        expect(function() {
            XliffSelect.parseCriteria("bar=");
        }).toThrow();
    });

    test("multiple criteria", function() {
        expect.assertions(1);

        var actual = XliffSelect.parseCriteria("maxunits:34,random,source=app1.*$");
        var expected = {
            maxunits: 34,
            random: true,
            fields: {
                source: new RegExp("app1.*$")
            }
        };
        expect(actual).toStrictEqual(expected);
    });
});

describe("xliff select translation units", function() {
    test("Select no parameters", function() {
        expect.assertions(1);

        var target = XliffSelect();
        expect(target).toBeFalsy();
    });
    
    test("Select Write no parameters", function() {
        expect.assertions(1);

        var target = XliffSelect.write();
        expect(target).toBeFalsy();
    });
    
    test("Select everything", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ]
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_3" name="javascript">\n' +
        '      <unit id="app2_1" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    
    test("Select with max units", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "maxunits:2"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });

    test("Select with max source words", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "maxsource:8"
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    
    test("Select with max target words", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "maxtarget:8"
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    // there is a 1 in 120 chance that this one will fail if the random numbers
    // cause the array to sort the same way that it originally was, making this
    // an unstable test. So, making this test.skip for now. Reenable this test
    // locally if you want to test the randomization functionality.
    test.skip("Select randomly", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "random"
        };

        // no selection criteria, so selects everything
        var target = XliffSelect(settings);
        expect(target).toBeTruthy();
        
        var actual = target.getTranslationUnits().map(function(unit) {
            return unit.id;
        });
        var expected = [
            "app1_1",
            "app1_2",
            "app1_3",
            "app2_1",
            "app2_2"
        ];

        expect(actual).not.toStrictEqual(expected);
    });
    
    test("Select with simple field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "source=1a"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with regex field criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "source=^app1:.*a$"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });

    test("Select with regex field criteria multiple results", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "source=^app2"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_1" name="javascript">\n' +
        '      <unit id="app2_1" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });

    test("Select with multiple criteria", function() {
        expect.assertions(2);

        var settings = {
            xliffVersion: 2,
            infiles: [
                "test/testfiles/xliff20/app1/en-US.xliff",
                "test/testfiles/xliff20/app2/en-US.xliff"
            ],
            criteria: "source=1,targetLocale=en-US,datatype=x-json"
        };

        var target = XliffSelect(settings);
        expect(target).toBeTruthy();

        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="x-json">\n' +
        '      <unit id="app1_3" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
});
