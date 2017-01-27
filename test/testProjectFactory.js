/*
 * testProjectFactory.js - test class used to load Projects
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

if (!ProjectFactory) {
    var ProjectFactory= require("../lib/ProjectFactory.js");
}

module.exports = {
  testProjectFactoryCreation: function(test){
    test.expect(1);
    var project = ProjectFactory('', {});
    test.equals(project, undefined);
    test.done();
  }
};