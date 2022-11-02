/*
 * testProject.js - test Project class
 *
 * Copyright © 2020-2021, JEDLSoft
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
    }
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

module.exports.project = {
    testProjectCreationAllEmpty: function(test){
        test.expect(1);
        var project = ProjectFactory('', {});
        test.equals(project, undefined);
        test.done();
    },

    testProjectGeneratesExtractedXliff: function(test){
        test.expect(2);
        // set up first
        rmrf("./testfiles/loctest-extracted.xliff");

        test.ok(!fs.existsSync("./testfiles/loctest-extracted.xliff"));

        var project = ProjectFactory('./testfiles', {'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            test.ok(fs.existsSync("./testfiles/loctest-extracted.xliff"));
                        });
                    });
                });
            });
        });
        test.done();
    },
    
    testProjectGeneratesNewStringsXliffs: function(test){
        test.expect(6);
        // set up first
        rmrf("./testfiles/loctest-new-es-US.xliff");
        rmrf("./testfiles/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/loctest-new-zh-Hans-CN.xliff");

        test.ok(!fs.existsSync("./testfiles/loctest-new-es-US.xliff"));
        test.ok(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff"));
        test.ok(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff"));

        var project = ProjectFactory('./testfiles', {'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            test.ok(fs.existsSync("./testfiles/loctest-new-es-US.xliff"));
                            test.ok(fs.existsSync("./testfiles/loctest-new-ja-JP.xliff"));
                            test.ok(fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff"));
                        });
                    });
                });
            });
        });
        test.done();
    },

    testProjectLocalizeOnlyGeneratesNoXliffs: function(test){
        test.expect(8);
        // set up first
        rmrf("./testfiles/loctest-extracted.xliff");
        rmrf("./testfiles/loctest-new-es-US.xliff");
        rmrf("./testfiles/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/loctest-new-zh-Hans-CN.xliff");

        test.ok(!fs.existsSync("./testfiles/loctest-extracted.xliff"));
        test.ok(!fs.existsSync("./testfiles/loctest-new-es-US.xliff"));
        test.ok(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff"));
        test.ok(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff"));

        var project = ProjectFactory('./testfiles', {'localizeOnly': true, 'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            test.ok(!fs.existsSync("./testfiles/loctest-extracted.xliff"));
                            test.ok(!fs.existsSync("./testfiles/loctest-new-es-US.xliff"));
                            test.ok(!fs.existsSync("./testfiles/loctest-new-ja-JP.xliff"));
                            test.ok(!fs.existsSync("./testfiles/loctest-new-zh-Hans-CN.xliff"));
                        });
                    });
                });
            });
        });
        test.done();
    },
    
    testProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs: function(test){
        test.expect(9);
        // set up first
        rmrf("./testfiles/project2/loctest-new-es-US.xliff");
        rmrf("./testfiles/project2/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/project2/loctest-new-ru-RU.xliff");

        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-es-US.xliff"));
        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-ja-JP.xliff"));
        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-ru-RU.xliff"));

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
                            test.ok(fs.existsSync(filename));
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            test.equal(actual, expected);

                            filename = "./testfiles/project2/loctest-new-ja-JP.xliff";
                            test.ok(fs.existsSync(filename));
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            diff(actual, expected);
                            test.equal(actual, expected);

                            filename = "./testfiles/project2/loctest-new-ru-RU.xliff";
                            test.ok(fs.existsSync(filename));
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ru-RU" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="few">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            test.equal(actual, expected);
                        });
                    });
                });
            });
        });
        test.done();
    },

    testProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs20: function(test){
        test.expect(9);
        // set up first
        rmrf("./testfiles/project2/loctest-new-es-US.xliff");
        rmrf("./testfiles/project2/loctest-new-ja-JP.xliff");
        rmrf("./testfiles/project2/loctest-new-ru-RU.xliff");

        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-es-US.xliff"));
        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-ja-JP.xliff"));
        test.ok(!fs.existsSync("./testfiles/project2/loctest-new-ru-RU.xliff"));

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
                            test.ok(fs.existsSync(filename));
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
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
                            test.equal(actual, expected);

                            filename = "./testfiles/project2/loctest-new-ja-JP.xliff";
                            test.ok(fs.existsSync(filename));
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ja-JP" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
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
                            test.equal(actual, expected);

                            filename = "./testfiles/project2/loctest-new-ru-RU.xliff";
                            test.ok(fs.existsSync(filename));
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
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
                            test.equal(actual, expected);
                        });
                    });
                });
            });
        });
        test.done();
    },

    testProjectIsResourcePathYes: function(test){
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(project.isResourcePath("js", "testfiles/public/localized_js/file.js"));

        test.done();
    },
    testProjectIsResourcePathNo: function(test){
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(!project.isResourcePath("js", "testfiles/public/file.js"));

        test.done();
    },
    testProjectIsResourcePathNoTargetPath: function(test){
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(!project.isResourcePath("js", "public/localized_js/file.js"));

        test.done();
    },
    testProjectIsResourcePathSubpath: function(test){
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(project.isResourcePath("js", "testfiles/public/localized_js/zh/Hant/TW/file.js"));

        test.done();
    },
    testProjectIsResourcePathAnyFileName: function(test){
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(project.isResourcePath("js", "testfiles/public/localized_js/resources.json"));

        test.done();
    },

    testGetOutputLocaleMapped: function(test) {
        test.expect(1);

        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        test.ok(project.getOutputLocale("da-DK"), "da");

        test.done();
    },
    testGetOutputLocaleNotMapped: function(test) {
        test.expect(1);

        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        test.ok(project.getOutputLocale("da-DE"), "da-DE");

        test.done();
    },
    testGetOutputLocaleNoMap: function(test) {
        test.expect(1);

        var project = ProjectFactory('./testfiles', {});
        test.ok(project.getOutputLocale("da-DK"), "da-DK");

        test.done();
    },
    testGetOutputLocaleBogusMap: function(test) {
        test.expect(3);

        var project = ProjectFactory('./testfiles', {
            localeMap: {
                "da-DK": undefined,
                "pt-BR": null,
                "de-DE": ""
            }
        });
        test.ok(project.getOutputLocale("da-DK"), "da-DK");
        test.ok(project.getOutputLocale("pt-BR"), "pt-BR");
        test.ok(project.getOutputLocale("de-DE"), "de-DE");

        test.done();
    },
    testGetOutputLocaleInherit: function(test) {
        test.expect(2);

        var project = ProjectFactory('./testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        test.ok(project.getLocaleInherit("en-AU"), "en-GB");
        test.ok(project.getLocaleInherit("en-CN"), "en-GB");

        test.done();
    },
    testGetOutputLocaleInheritEmpty: function(test) {
        test.expect(2);

        var project = ProjectFactory('./testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        test.equals(project.getLocaleInherit("ko-KR"), undefined);
        test.equals(project.getLocaleInherit(), undefined);

        test.done();
    },
    testGetOutputLocaleInheritEmpty2: function(test) {
        test.expect(2);

        var project = ProjectFactory('./testfiles', {});
        test.equals(project.getLocaleInherit("ko-KR"), undefined);
        test.equals(project.getLocaleInherit(), undefined);

        test.done();
    },
};
