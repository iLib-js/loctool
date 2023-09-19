/*
 * GenerateMode.test.js - test the GenerateMode object.
 *
 * Copyright © 2020, 2023 JEDLSoft.
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

describe("genmodemode", function() {
    test("GenerateModeConstructor", function() {
        expect.assertions(1);

        var genmode = new GenerateMode();
        expect(genmode).toBeTruthy();
    });
    test("GenerateModeProcessEmpty", function() {
        expect.assertions(1);
        var process = GenerateModeProcess();
        expect(!process).toBeTruthy();
    });
    test("GenerateModeProcess", function() {
        expect.assertions(1);
        var settings = {
            rootDir: ".",
            projectType: "sample"
        };
        var project = ProjectFactory.newProject(settings);
        var process = GenerateModeProcess(project);
        expect(process).toBeTruthy();
    });
    test("GenerateModeDefault", function() {
        expect.assertions(2);

        var genmode = new GenerateMode();
        expect(genmode).toBeTruthy();
        expect(genmode.getXliffsDir()).toStrictEqual(["."]);
    });
    test("GenerateModeWithParams", function() {
        expect.assertions(2);

        var genmode = new GenerateMode({
           xliffsDir: "./xliffs"
        });
        expect(genmode).toBeTruthy();
        expect(genmode.getXliffsDir()).toStrictEqual(["./xliffs"]);
    });
    test("GenerateModeSetParams", function() {
        expect.assertions(2);

        var genmode = new GenerateMode();
        expect(genmode).toBeTruthy();
        genmode.setXliffsDir("./test/testfiles");
        expect(genmode.getXliffsDir()).toStrictEqual(["./test/testfiles"]);
    });
    test("GenerateModeInit", function() {
        expect.assertions(2);

        var genmode = new GenerateMode({
            xliffsDir: "./test/testfiles/xliff20/app1",
        });
        expect(genmode).toBeTruthy();
        genmode.init();
        expect(genmode.getResSize()).toBe(5);
    });

    test("GenerateModeInitMultipleXliffDirs", function() {
        expect.assertions(2);

        var genmode = new GenerateMode({
            xliffsDir: ["./test/testfiles/xliff20/app1", "./test/testfiles/xliff20/app2"],
        });
        expect(genmode).toBeTruthy();
        genmode.init();
        expect(genmode.getResSize()).toBe(9);
    });

});