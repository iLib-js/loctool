/*
 * Project.test.js - test Project class
 *
 * Copyright © 2020-2021, 2023 JEDLSoft
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
var fs = require('fs');
if (!Project) {
    var ProjectFactory = require("../lib/ProjectFactory.js");
    var Project = require("../lib/Project.js");
}
function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    });
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
    });
}
describe("project", function() {
    test("ProjectCreationAllEmpty", function() {
        expect.assertions(1);
        var project = ProjectFactory('', {});
        test.equals(project, undefined);
    });
    test("ProjectGeneratesExtractedXliff", function() {
        expect.assertions(2);
        // set up first
        rmrf("./testfiles/loctest-extracted.xliff");
        expect(!fs.existsSync("./testfiles/loctest-extracted.xliff")).toBeTruthy();
        var project = ProjectFactory('./testfiles', {'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./testfiles/loctest-extracted.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });
    test("ProjectGeneratesNewStringsXliffs", function() {
        expect.assertions(6);
        // set up first
        rmrf("./testfiles/loctest-new-es-US.xliff");
        rmrf("./testfiles/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/loctest-new-zh-Hans-CN.xliff");
        expect(!fs.existsSync("./testfiles/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        var project = ProjectFactory('./testfiles', {'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./testfiles/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(fs.existsSync("./testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });
    test("ProjectLocalizeOnlyGeneratesNoXliffs", function() {
        expect.assertions(8);
        // set up first
        rmrf("./testfiles/loctest-extracted.xliff");
        rmrf("./testfiles/loctest-new-es-US.xliff");
        rmrf("./testfiles/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/loctest-new-zh-Hans-CN.xliff");
        expect(!fs.existsSync("./testfiles/loctest-extracted.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        var project = ProjectFactory('./testfiles', {'localizeOnly': true, 'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(!fs.existsSync("./testfiles/loctest-extracted.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./testfiles/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });
    test("ProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs", function() {
        expect.assertions(9);
        // set up first
        rmrf("./testfiles/project2/loctest-new-es-US.xliff");
        rmrf("./testfiles/project2/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/project2/loctest-new-ru-RU.xliff");
        expect(!fs.existsSync("./testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./testfiles/project2', {});
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="6" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            expect(actual).toBe(expected);
                            filename = "./testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            expect(actual).toBe(expected);
                            filename = "./testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ru-RU" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="foobar" restype="plural" datatype="x-android-resource" extype="few">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="6" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="7" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });
    test("ProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs20", function() {
        expect.assertions(9);
        // set up first
        rmrf("./testfiles/project2/loctest-new-es-US.xliff");
        rmrf("./testfiles/project2/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/project2/loctest-new-ru-RU.xliff");
        expect(!fs.existsSync("./testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./testfiles/project2', {
            xliffVersion: 2
        });
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="5" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="6" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            expect(actual).toBe(expected);
                            filename = "./testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ja-JP" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            expect(actual).toBe(expected);
                            filename = "./testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="5" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="6" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="7" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });
    test("ProjectIsResourcePathYes", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(project.isResourcePath("js", "testfiles/public/localized_js/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathNo", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(!project.isResourcePath("js", "testfiles/public/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathNoTargetPath", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(!project.isResourcePath("js", "public/localized_js/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathSubpath", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(project.isResourcePath("js", "testfiles/public/localized_js/zh/Hant/TW/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathAnyFileName", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(project.isResourcePath("js", "testfiles/public/localized_js/resources.json")).toBeTruthy();
    });
    test("GetOutputLocaleMapped", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        expect(project.getOutputLocale("da-DK"), "da").toBeTruthy();
    });
    test("GetOutputLocaleNotMapped", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        expect(project.getOutputLocale("da-DE"), "da-DE").toBeTruthy();
    });
    test("GetOutputLocaleNoMap", function() {
        expect.assertions(1);
        var project = ProjectFactory('./testfiles', {});
        expect(project.getOutputLocale("da-DK"), "da-DK").toBeTruthy();
    });
    test("GetOutputLocaleBogusMap", function() {
        expect.assertions(3);
        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": undefined,
                "pt-BR": null,
                "de-DE": ""
            }
        });
        expect(project.getOutputLocale("da-DK"), "da-DK").toBeTruthy();
        expect(project.getOutputLocale("pt-BR"), "pt-BR").toBeTruthy();
        expect(project.getOutputLocale("de-DE"), "de-DE").toBeTruthy();
    });
    test("GetOutputLocaleInherit", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        expect(project.getLocaleInherit("en-AU"), "en-GB").toBeTruthy();
        expect(project.getLocaleInherit("en-CN"), "en-GB").toBeTruthy();
    });
    test("GetOutputLocaleInheritEmpty", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        test.equals(project.getLocaleInherit("ko-KR"), undefined);
        test.equals(project.getLocaleInherit(), undefined);
    });
    test("GetOutputLocaleInheritEmpty2", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {});
        test.equals(project.getLocaleInherit("ko-KR"), undefined);
        test.equals(project.getLocaleInherit(), undefined);
    });
});
