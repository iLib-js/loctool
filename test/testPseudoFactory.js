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

var project2 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: "zxx-XX",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

var project3 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: ["en-GB", "zxx-XX", "zxx-Hans-XX"],
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

var project4 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {
        "en-GB": "english-british",
        "en-CA": "english-canadian"
    },
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-CA", "en-NZ", "es-US"]
});

var project5 = new WebProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-AU", "en-CA", "en-NZ", "es-US"]
});

var project6 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {
        "en-GB": "english-british",
        "zxx-XX": "debug",
        "zxx-Hans-XX": "debug-han-simplified"
    },
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

var project7 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {},
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

var project8 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: [],
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

var project9 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {
        "as-XX": "debug-font",
        "kn-XX": "debug-font"
    },
    resourceDirs: {
        "json": "resources"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-US", "ko-KR"]
});

var project10 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {
        "zxx-Hans-XX": "debug-han-simplified"
    },
    resourceDirs: {
        "json": "resources"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-US", "ko-KR"]
});

module.exports.pseudofactory = {
    testPseudoFactoryDefaultBritishEnglish: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishEnglishRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglish1: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-AU",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglish2: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglish3: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-HK",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglish4: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-ZA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultOtherEnglish: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-CA",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishEnglishWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglishWithFlavor: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryDefaultBritishLikeEnglishWithFlavorRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US-ASDF");

        test.done();
    },

    testPseudoFactoryArrayBritishEnglish: function(test) {
        test.expect(2);

        // explicitly specified in array
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryArrayBritishEnglishRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");

        test.done();
    },

    testPseudoFactoryArrayBritishLikeEnglish1: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-JM",
            type: "text"
        });

        // Jamaica is not in the array
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryObjectBritishEnglish: function(test) {
        test.expect(2);

        // explicitly specified in array
        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

        test.done();
    },

    testPseudoFactoryObjectBritishEnglishRightSourceLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.equal(pseudo.getSourceLocale(), "en-US");

        test.done();
    },

    testPseudoFactoryObjectBritishLikeEnglish1: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-JM",
            type: "text"
        });

        // Jamaica is not in the object
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyArrayNoPseudos1: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "en-JM",
            type: "text"
        });

        // Jamaica is not in the object
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyArrayNoPseudos2: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "en-GB",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyArrayNoPseudos3: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "zxx-XX",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyArrayNoPseudos4: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "zh-Hant-TW",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyObjectNoPseudos1: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "en-JM",
            type: "text"
        });

        // Jamaica is not in the object
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyObjectNoPseudos2: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "en-GB",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyObjectNoPseudos3: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "zxx-XX",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryEmptyObjectNoPseudos4: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "zh-Hant-TW",
            type: "text"
        });

        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryChineseTraditional: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project5,
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
            project: project5,
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
            project: project5,
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
            project: project5,
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
    testPseudoFactoryNormalzxx: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project2,
            targetLocale: "zxx-XX",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNormalzxx2: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "zxx-Hans-XX",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNormalzxxWithVariant: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "zxx-XX-ASDF",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNormalasXXLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project9,
            targetLocale: "as-XX",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNormalknXXLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project9,
            targetLocale: "kn-XX",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNormalzxxHasXXLocale: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project10,
            targetLocale: "zxx-Hans-XX",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof RegularPseudo);

        test.done();
    },
    testPseudoFactoryNotListed: function(test) {
        test.expect(1);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-AU",
            type: "text"
        });
        test.ok(!pseudo);

        test.done();
    },

    testPseudoFactoryListed: function(test) {
        test.expect(2);

        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        test.ok(pseudo);
        test.ok(pseudo instanceof WordBasedPseudo);

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
