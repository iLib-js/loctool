/*
 * testProjectFactory.js - test class used to load Projects
 *
 * Copyright © 2017, 2020 Healthtap, Inc. All Rights Reserved.
 */

if (!ProjectFactory) {
    var ProjectFactory= require("../lib/ProjectFactory.js");
}

module.exports.projectfactory = {
    testProjectFactoryCreationAllEmpty: function(test){
        test.expect(1);
        var project = ProjectFactory('', {});
        test.equals(project, undefined);
        test.done();
    },

    testProjectFactoryCreationFromJsonNoSettings: function(test){
        test.expect(5);
        var project = ProjectFactory('./testfiles', {});
        test.notEqual(project, undefined);
        test.notEqual(project.settings, undefined);
        test.equals(project.root,'./testfiles');
        test.equals(project.sourceLocale,'en-US');
        test.equals(project.pseudoLocale,'de-DE');
        test.done();
    },

    testProjectFactoryCreationFromJsonWithSettingsMerged: function(test){
        test.expect(4);
        var project = ProjectFactory('./testfiles', {'abc': 'def'});
        test.notEqual(project, undefined);
        test.notEqual(project.settings, undefined);
        var set = project.settings;
        test.equal(set['abc'],'def');
        test.notEqual(set.locales, undefined);
        test.done();
    },

    testProjectFactoryCreationFromJsonWithSettingsOverwrite: function(test){
        test.expect(4);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        test.notEqual(project, undefined);
        test.notEqual(project.settings, undefined);
        var set = project.settings;
        test.notEqual(set.locales, undefined);
        var loc = set.locales;
        test.notEqual(loc.length, 1);
        test.done();
    },

    testProjectFactoryCorrectRoot: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        test.ok(project);
        test.equal(project.root, './testfiles');
        test.done();
    },

    testProjectFactoryCorrectDefaultTarget: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.target, 'testfiles');
        test.done();
    },

    testProjectFactoryCorrectDefaultXliffsDir: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.xliffsDir, 'testfiles');
        test.done();
    },

    testProjectFactoryCorrectDefaultXliffsOut: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def']});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.xliffsOut, 'testfiles');
        test.done();
    },

    testProjectFactoryCorrectExplicitTarget: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'targetDir': 'foobar'});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.target, 'testfiles/foobar');
        test.done();
    },

    testProjectFactoryCorrectExplicitXliffsDir: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsDir': 'asdf'});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.xliffsDir, 'testfiles/asdf');
        test.done();
    },

    testProjectFactoryCorrectExplicitXliffsOut: function(test){
        test.expect(2);
        var project = ProjectFactory('./testfiles', {'locales': ['def'], 'xliffsOut': 'blah'});
        test.ok(project);
        // should be relative to the root of the project
        test.equal(project.xliffsOut, 'testfiles/blah');
        test.done();
    }

};
