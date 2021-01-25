/*
 * testXliffSplit.js - test the split of Xliff object.
 *
 * Copyright © 2020 JEDLSoft
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
var Path = require("path");
if (!Xliff) {
    var Xliff = require("../lib/Xliff.js");
}

if (!XliffSplit) {
    var XliffSplit = require("../lib/XliffSplit.js");
}

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

module.exports.xliffsplit = {
    testXliffSplitnoParameter: function(test) {
        test.expect(1);

        var target = XliffSplit();
        test.ok(!target);
        test.done();
    },
    testXliffSplit: function(test) {
        test.expect(1);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        var target = XliffSplit(settings);
        test.ok(target);
        test.done();

    },
    testXliffSplitdistritue: function(test) {
        test.expect(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        test.ok(result);
        test.equal(Object.keys(result).length, 2); //app1, app2
        test.done();

    },
    testXliffSplitdistritueSerialize: function(test) {
        test.expect(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        test.ok(result);

        var actual = result["app1"].serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" name="app1:String 1a" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" name="app1:String 1b" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" name="app1:String 1c" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        test.equal(actual, expected);
        test.done();
    },
    testXliffSplitdistritueSerialize2: function(test) {
        test.expect(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        test.ok(result);

        var actual = result["app2"].serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_1" name="javascript">\n' +
        '      <unit id="app2_1" name="app2: String 2a" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" name="app2: String 2b" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        test.equal(actual, expected);
        test.done();
    },
    testXliffSplitWrite: function(test) {
        test.expect(3);
        rmrf("testfiles/xliff20/splitTest/app1/en-US.xliff");
        rmrf("testfiles/xliff20/splitTest/app2/en-US.xliff");

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        settings.targetDir = "testfiles/xliff20/splitTest";
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        test.ok(result);

        XliffSplit.write(result);
        test.ok(fs.existsSync("./testfiles/xliff20/splitTest/app1/en-US.xliff"));
        test.ok(fs.existsSync("./testfiles/xliff20/splitTest/app2/en-US.xliff"));

        test.done();

    },
};

