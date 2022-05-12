/*
 * testGenerateMode.js - test the GenerateMode object.
 *
 * Copyright © 2020, JEDLSoft.
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
if (!GenerateMode) {
    var GenerateMode = require("../lib/GenerateMode.js");
}
if (!GenerateModeProcess) {
    var GenerateModeProcess = require("../lib/GenerateModeProcess.js");
}
if (!ProjectFactory) {
    var ProjectFactory = require("../lib/ProjectFactory.js");
}

module.exports.genmodemode = {
    testGenerateModeConstructor: function(test) {
        test.expect(1);

        var genmode = new GenerateMode();
        test.ok(genmode);
        test.done();
    },
    testGenerateModeProcessEmpty: function(test){
        test.expect(1);
        var process = GenerateModeProcess();
        test.ok(!process);
        test.done();
    },
    testGenerateModeProcess: function(test){
        test.expect(1);
        var settings = {
            rootDir: ".",
            projectType: "sample"
        };
        var project = ProjectFactory.newProject(settings);
        var process = GenerateModeProcess(project);
        test.ok(process);
        test.done();
    },
    testGenerateModeDefault: function(test) {
        test.expect(2);

        var genmode = new GenerateMode();
        test.ok(genmode);
        test.equal(genmode.getXliffsDir(), ".");
        test.done();
    },
    testGenerateModeWithParams: function(test) {
        test.expect(2);

        var genmode = new GenerateMode({
           xliffsDir: "./xliffs"
        });
        test.ok(genmode);
        test.equal(genmode.getXliffsDir(), "./xliffs");
        test.done();
    },
    testGenerateModeSetParams: function(test) {
        test.expect(2);

        var genmode = new GenerateMode();
        test.ok(genmode);
        genmode.setXliffsDir("./testfiles");
        test.equal(genmode.getXliffsDir(), "./testfiles");

        test.done();
    },
    testGenerateModeInit: function(test) {
        test.expect(2);

        var genmode = new GenerateMode({
            xliffsDir: "./testfiles/xliff20/app1",
        });
        test.ok(genmode);
        genmode.init();
        test.equal(genmode.getResSize(), 5);

        test.done();
    },

    testGenerateModeInitMultipleXliffDirs: function(test) {
        test.expect(2);

        var genmode = new GenerateMode({
            xliffsDir: ["./testfiles/xliff20/app1", "./testfiles/xliff20/app2"],
        });
        test.ok(genmode);
        genmode.init();
        test.equal(genmode.getResSize(), 9);

        test.done();
    }

};