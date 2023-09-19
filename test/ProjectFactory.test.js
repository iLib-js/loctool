/*
 * ProjectFactory.test.js - test class used to load Projects
 *
 * Copyright © 2017, 2023 2020, 2023 Healthtap, Inc. All Rights Reserved.
 */

if (!ProjectFactory) {
    var ProjectFactory= require("../lib/ProjectFactory.js");
}

describe("projectfactory", function() {
    test("ProjectFactoryCreationAllEmpty", function() {
        expect.assertions(1);
        var project = ProjectFactory('', {});
        test.equals(project, undefined);
    });

    test("ProjectFactoryCreationFromJsonNoSettings", function() {
        expect.assertions(5);
        var project = ProjectFactory('./testfiles', {});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        test.equals(project.root,'./testfiles');
        test.equals(project.sourceLocale,'en-US');
        test.equals(project.pseudoLocale,'de-DE');
    });

    test("ProjectFactoryCreationFromJsonWithSettingsMerged", function() {
        expect.assertions(4);
        var project = ProjectFactory('./testfiles', {'abc': 'def'});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        test.equal(set['abc'],'def');
        expect(set.locales).not.toBe(undefined);
    });

    test("ProjectFactoryCreationFromJsonWithSettingsOverwrite", function() {
        expect.assertions(4);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        expect(set.locales).not.toBe(undefined);
        var loc = set.locales;
        expect(loc.length).not.toBe(1);
    });

    test("ProjectFactoryCorrectRoot", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        expect(project.root).toBe('./testfiles');
    });

    test("ProjectFactoryCorrectDefaultTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('testfiles');
    });

    test("ProjectFactoryCorrectDefaultXliffsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toBe('testfiles');
    });

    test("ProjectFactoryCorrectDefaultXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('testfiles');
    });

    test("ProjectFactoryCorrectExplicitTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'targetDir': 'foobar'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('testfiles/foobar');
    });

    test("ProjectFactoryCorrectExplicitXliffsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsDir': 'asdf'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toBe('testfiles/asdf');
    });

    test("ProjectFactoryCorrectExplicitXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsOut': 'blah'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('testfiles/blah');
    });

    test("ProjectFactoryAbsolutePathTargetDir", function() {
        expect.assertions(2);
        var targetAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'targetDir': targetAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('/foo/asdf');
    });

    test("ProjectFactoryAbsolutePathXliffsDir", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsDir': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toBe('/foo/asdf');
    });

    test("ProjectFactoryAbsolutePathxliffsOut", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsOut': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('/foo/asdf');
    });

});
