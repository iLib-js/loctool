/*
 * testXliffMerge.js - test the merge of Xliff object.
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

if (!Xliff) {
    var Xliff = require("../lib/Xliff.js");
}

if (!XliffMerge) {
    var XliffMerge = require("../lib/XliffMerge.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

module.exports.xliffmerge = {
    testXliffMergenoParameter: function(test) {
        test.expect(1);

        var target = XliffMerge();
        test.ok(!target);
        test.done();
    },
    testXliffMergeWritenoParameter: function(test) {
        test.expect(1);

        var target = XliffMerge.write();
        test.ok(!target);
        test.done();
    },
    testXliffMerge_en_US: function(test) {
        test.expect(1);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];

        var target = XliffMerge(settings);
        test.ok(target);
        test.done();
    },
    testXliffMergeeWrite_en_US: function(test) {
        test.expect(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];

        var target = XliffMerge(settings);
        test.ok(target);

        var actual = target.serialize();
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
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_3" name="javascript">\n' +
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
    testXliffMerge_ko_KR: function(test) {
        test.expect(1);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/ko-KR.xliff",
            "testfiles/xliff20/app2/ko-KR.xliff",
        ];

        var target = XliffMerge(settings);
        test.ok(target);
        test.done();
    },
    testXliffMergeeWrite_ko_KR: function(test) {
        test.expect(2);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/ko-KR.xliff",
            "testfiles/xliff20/app2/ko-KR.xliff",
        ];

        var target = XliffMerge(settings);
        test.ok(target);

        var actual = target.serialize();
        var expected = 
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="ko-KR" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="javascript">\n' +
        '      <unit id="app1_1" name="String 2a" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app1: String 2a</source>\n' +
        '          <target>app1:(ko) String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" name="String 2b" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app1: String 2b</source>\n' +
        '          <target>app1: (ko) String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_2" name="javascript">\n' +
        '      <unit id="app2_1" name="app2: String 2a" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: (ko)app2 String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" name="app2: String 2b" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: (ko)app2 String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        test.equal(actual, expected);
        test.done();        
    }
};