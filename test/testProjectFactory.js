/*
 * testProjectFactory.js - test class used to load Projects
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
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
  }
};
