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

    testPseudoFactoryBritishEnglishRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");

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
            targetLocale: "en-GB-ASDF",
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
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryBritishLikeEnglishWithFlavorRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US-ASDF");

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

    testPseudoFactoryChineseTraditionalRightSourceLocale: function(test) {
        test.expect(3);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "zh-Hant-HK",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");
        test.equal(pseudo.getPseudoSourceLocale(), "zh-Hans-CN");

        test.done();
    },

    testPseudoFactoryChineseTraditionalWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "zh-Hant-HK-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof PseudoHant);

        test.done();
    },

    testPseudoFactoryChineseTraditionalWithFlavorRightSourceLocale: function(test) {
        test.expect(3);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "zh-Hant-HK-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US-ASDF");
        test.equal(pseudo.getPseudoSourceLocale(), "zh-Hans-CN-ASDF");

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

    testPseudoFactoryNormalPseudoRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");

        test.done();
    },

    testPseudoFactoryNormalPseudoWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },

    testPseudoFactoryNormalPseudoWithFlavorRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US-ASDF");

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
    },

    testPseudoFactoryIsPseudoLocaleBritishEnglish: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-GB"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglish1: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-AU"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglish2: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-NZ"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglish3: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-HK"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglish4: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-ZA"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglish5: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-CA"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleChineseTrad: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("zh-Hant-HK"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishEnglishWithFlavor: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-GB-ASDF"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleBritishLikeEnglishWithFlavor1: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("en-AU-ASDF"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleChineseTradWithFlavor: function(test) {
        test.expect(1);

        test.ok(PseudoFactory.isPseudoLocale("zh-Hant-HK-ASDF"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleNoPseudo: function(test) {
        test.expect(1);

        test.ok(!PseudoFactory.isPseudoLocale("es-US"));

        test.done();
    },

    testPseudoFactoryIsPseudoLocaleNoPseudoSourceLocale: function(test) {
        test.expect(1);

        test.ok(!PseudoFactory.isPseudoLocale("en-US"));

        test.done();
    }
};
