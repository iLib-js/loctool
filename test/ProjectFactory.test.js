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
        expect(project).toBeUndefined();
    });

    test("ProjectFactoryCreationFromJsonNoSettings", function() {
        expect.assertions(5);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBeUndefined();
        expect(project.root).toBe('./test/testfiles');
        expect(project.sourceLocale).toBe('en-US');
        expect(project.pseudoLocale).toBe('de-DE');
    });

    test("ProjectFactoryCreationFromJsonWithSettingsMerged", function() {
        expect.assertions(4);
        var project = ProjectFactory('./test/testfiles', {'abc': 'def'});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        expect(set['abc']).toBe('def');
        expect(set.locales).not.toBe(undefined);
    });

    test("ProjectFactoryCreationFromJsonWithSettingsOverwrite", function() {
        expect.assertions(4);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        expect(set.locales).not.toBe(undefined);
        var loc = set.locales;
        expect(loc.length).not.toBe(1);
    });

    test("ProjectFactoryCorrectRoot", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        expect(project.root).toBe('./test/testfiles');
    });

    test("ProjectFactoryCorrectDefaultTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('test/testfiles');
    });

    test("ProjectFactoryCorrectDefaultXliffsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toStrictEqual(['test/testfiles']);
    });

    test("ProjectFactoryCorrectDefaultXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('test/testfiles');
    });

    test("ProjectFactoryCorrectExplicitTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'targetDir': 'foobar'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('test/testfiles/foobar');
    });

    test("ProjectFactoryCorrectExplicitXliffsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsDir': 'asdf'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toStrictEqual(['test/testfiles/asdf']);
    });

    test("ProjectFactoryCorrectExplicitXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsOut': 'blah'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('test/testfiles/blah');
    });

    test("ProjectFactoryAbsolutePathTargetDir", function() {
        expect.assertions(2);
        var targetAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'targetDir': targetAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('/foo/asdf');
    });

    test("ProjectFactoryAbsolutePathXliffsDir", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsDir': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsDir).toStrictEqual(['/foo/asdf']);
    });

    test("ProjectFactoryAbsolutePathxliffsOut", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsOut': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('/foo/asdf');
    });

});
