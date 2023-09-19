/*
 * XliffMerge.test.js - test the merge of Xliff object.
 *
 * Copyright © 2020, 2023 JEDLSoft
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
if (!Xliff) {
    var Xliff = require("../lib/Xliff.js");
}
if (!XliffMerge) {
    var XliffMerge = require("../lib/XliffMerge.js");
}
function rmrf(path) {
if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    });
}
describe("xliffmerge", function() {
    test("XliffMergenoParameter", function() {
        expect.assertions(1);
        var target = XliffMerge();
        expect(!target).toBeTruthy();
    });
    test("XliffMergeWritenoParameter", function() {
        expect.assertions(1);
        var target = XliffMerge.write();
        expect(!target).toBeTruthy();
    });
    test("XliffMerge_en_US", function() {
        expect.assertions(1);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
    });
    test("XliffMerge2_en_US", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
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
    test("XliffMerge_write_en_US", function() {
        expect.assertions(3);
        rmrf("testfiles/xliff20/output-en-US.xliff");
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];
        settings.outfile = "testfiles/xliff20/output-en-US.xliff";
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
        var result = XliffMerge.write(target);
        expect(result).toBeTruthy();
        expect(fs.existsSync("./testfiles/xliff20/output-en-US.xliff")).toBeTruthy();
    });
    test("XliffMerge_ko_KR", function() {
        expect.assertions(1);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/ko-KR.xliff",
            "testfiles/xliff20/app2/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
    });
    test("XliffMerge2_ko_KR", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/ko-KR.xliff",
            "testfiles/xliff20/app2/ko-KR.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
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
        '      <unit id="app2_1" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: (ko)app2 String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: (ko)app2 String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("XliffMerge_write_ko_KR", function() {
        expect.assertions(3);
        rmrf("testfiles/xliff20/output-ko-KR.xliff");
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/app1/ko-KR.xliff",
            "testfiles/xliff20/app2/ko-KR.xliff",
        ];
        settings.outfile = "testfiles/xliff20/output-ko-KR.xliff";
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
        var result = XliffMerge.write(target);
        expect(result).toBeTruthy();
        expect(fs.existsSync("./testfiles/xliff20/output-ko-KR.xliff")).toBeTruthy();
    });
    test("XliffMerge_write_en_US_CustomStyle", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "custom";
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_3">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="app2_f2" original="app2">\n' +
        '    <group id="app2_g3" name="javascript">\n' +
        '      <unit id="app2_1">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2">\n' +
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
    test("XliffMerge_write_en_US_CustomStyle_wrongStyle", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "custommm";
        settings.infiles = [
            "testfiles/xliff20/app1/en-US.xliff",
            "testfiles/xliff20/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
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
});