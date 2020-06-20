/*
 * testProject.js - test Project class
 *
 * Copyright © 2020, JEDLSoft
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
    }
};
