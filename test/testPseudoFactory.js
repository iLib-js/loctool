/*
 * testPseudoFactory.js - test the pseudo translation factory
 *
 * Copyright © 2018, HealthTap, Inc.
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

if (!PseudoFactory) {
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var PseudoHant = require("../lib/PseudoHant.js");
    var RegularPseudo = require("../lib/RegularPseudo.js");
    var WordBasedPseudo = require("../lib/WordBasedPseudo.js");
    var WebProject = require("../lib/WebProject.js");
}

var project = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: "ps-DO",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

module.exports = {
    testPseudoFactoryBritishEnglish: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglish1: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-AU",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglish2: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-NZ",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglish3: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-HK",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglish4: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-ZA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryOtherEnglish: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-CA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishEnglishWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-GB-BUPA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglishWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-NZ-BUPA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryChineseTraditional: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "zh-Hant-HK",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof PseudoHant);

        test.done();
    },

    testPseudoFactoryChineseTraditionalWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "zh-Hant-HK-QHMS",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof PseudoHant);

        test.done();
    },

    testPseudoFactoryNormalPseudo: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },

    testPseudoFactoryNormalPseudoWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO-DISCOVERY",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },

    testPseudoFactoryNoPseudo: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryNoPseudoForSourceLocale: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-US",
            type: "text"
        });
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryNoPseudoForEnglishLB: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-LB",
            type: "text"
        });
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryNoPseudoWithFlagTurnedOff: function(test) {
        test.expect(1);

        var noPseudoProject = new WebProject({
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./testfiles", {
            locales: ["en-GB", "en-NZ", "es-US"],
            nopseudo: true
        });

        var pseudo = PseudoFactory({
            project: noPseudoProject,
            targetLocale: "ps-DO",
            type: "text"
        });
        test.ok(!pseudo);

        test.done();
    }
};
