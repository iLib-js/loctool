/*
 * PseudoFactory.test.js - test the pseudo translation factory
 *
 * Copyright © 2018, 2023 HealthTap, Inc.
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
}, "./test/testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});
var project2 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: "zxx-XX",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});
var project3 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: ["en-GB", "zxx-XX", "zxx-Hans-XX"],
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
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
}, "./test/testfiles", {
    locales: ["en-GB", "en-CA", "en-NZ", "es-US"]
});
var project5 = new WebProject({
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
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
}, "./test/testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});
var project7 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {},
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});
var project8 = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: [],
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./test/testfiles", {
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
}, "./test/testfiles", {
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
}, "./test/testfiles", {
    locales: ["en-GB", "en-US", "ko-KR"]
});
describe("pseudofactory", function() {
    test("PseudoFactoryDefaultBritishEnglish", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishEnglishRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US");
    });
    test("PseudoFactoryDefaultBritishLikeEnglish1", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-AU",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishLikeEnglish2", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishLikeEnglish3", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-HK",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishLikeEnglish4", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-ZA",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultOtherEnglish", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-CA",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishEnglishWithFlavor", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-GB-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishLikeEnglishWithFlavor", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryDefaultBritishLikeEnglishWithFlavorRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "en-NZ-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US-ASDF");
    });
    test("PseudoFactoryArrayBritishEnglish", function() {
        expect.assertions(2);
        // explicitly specified in array
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryArrayBritishEnglishRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US");
    });
    test("PseudoFactoryArrayBritishLikeEnglish1", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-JM",
            type: "text"
        });
        // Jamaica is not in the array
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryObjectBritishEnglish", function() {
        expect.assertions(2);
        // explicitly specified in array
        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryObjectBritishEnglishRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US");
    });
    test("PseudoFactoryObjectBritishLikeEnglish1", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project6,
            targetLocale: "en-JM",
            type: "text"
        });
        // Jamaica is not in the object
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyArrayNoPseudos1", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "en-JM",
            type: "text"
        });
        // Jamaica is not in the object
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyArrayNoPseudos2", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyArrayNoPseudos3", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "zxx-XX",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyArrayNoPseudos4", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project8,
            targetLocale: "zh-Hant-TW",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyObjectNoPseudos1", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "en-JM",
            type: "text"
        });
        // Jamaica is not in the object
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyObjectNoPseudos2", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyObjectNoPseudos3", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "zxx-XX",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryEmptyObjectNoPseudos4", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project7,
            targetLocale: "zh-Hant-TW",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryChineseTraditional", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "zh-Hant-HK",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof PseudoHant).toBeTruthy();
    });
    test("PseudoFactoryChineseTraditionalRightSourceLocale", function() {
        expect.assertions(3);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "zh-Hant-HK",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US");
        expect(pseudo.getPseudoSourceLocale()).toBe("zh-Hans-CN");
    });
    test("PseudoFactoryChineseTraditionalWithFlavor", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "zh-Hant-HK-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof PseudoHant).toBeTruthy();
    });
    test("PseudoFactoryChineseTraditionalWithFlavorRightSourceLocale", function() {
        expect.assertions(3);
        var pseudo = PseudoFactory({
            project: project5,
            targetLocale: "zh-Hant-HK-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US-ASDF");
        expect(pseudo.getPseudoSourceLocale()).toBe("zh-Hans-CN-ASDF");
    });
    test("PseudoFactoryNormalPseudo", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalPseudoRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US");
    });
    test("PseudoFactoryNormalPseudoWithFlavor", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalPseudoWithFlavorRightSourceLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "ps-DO-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo.getSourceLocale()).toBe("en-US-ASDF");
    });
    test("PseudoFactoryNormalzxx", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project2,
            targetLocale: "zxx-XX",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalzxx2", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "zxx-Hans-XX",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalzxxWithVariant", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "zxx-XX-ASDF",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalasXXLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project9,
            targetLocale: "as-XX",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalknXXLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project9,
            targetLocale: "kn-XX",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNormalzxxHasXXLocale", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project10,
            targetLocale: "zxx-Hans-XX",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof RegularPseudo).toBeTruthy();
    });
    test("PseudoFactoryNotListed", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-AU",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryListed", function() {
        expect.assertions(2);
        var pseudo = PseudoFactory({
            project: project3,
            targetLocale: "en-GB",
            type: "text"
        });
        expect(pseudo).toBeTruthy();
        expect(pseudo instanceof WordBasedPseudo).toBeTruthy();
    });
    test("PseudoFactoryNoPseudo", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryNoPseudoForSourceLocale", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-US",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryNoPseudoForEnglishLB", function() {
        expect.assertions(1);
        var pseudo = PseudoFactory({
            project: project,
            targetLocale: "en-LB",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryNoPseudoWithFlagTurnedOff", function() {
        expect.assertions(1);
        var noPseudoProject = new WebProject({
            sourceLocale: "en-US",
            pseudoLocale: "ps-DO",
            resourceDirs: {
                "yml": "config/locales"
            }
        }, "./test/testfiles", {
            locales: ["en-GB", "en-NZ", "es-US"],
            nopseudo: true
        });
        var pseudo = PseudoFactory({
            project: noPseudoProject,
            targetLocale: "ps-DO",
            type: "text"
        });
        expect(!pseudo).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishEnglish", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-GB")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglish1", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-AU")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglish2", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-NZ")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglish3", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-HK")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglish4", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-ZA")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglish5", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-CA")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleChineseTrad", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("zh-Hant-HK")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishEnglishWithFlavor", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-GB-ASDF")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleBritishLikeEnglishWithFlavor1", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("en-AU-ASDF")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleChineseTradWithFlavor", function() {
        expect.assertions(1);
        expect(PseudoFactory.isPseudoLocale("zh-Hant-HK-ASDF")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleNoPseudo", function() {
        expect.assertions(1);
        expect(!PseudoFactory.isPseudoLocale("es-US")).toBeTruthy();
    });
    test("PseudoFactoryIsPseudoLocaleNoPseudoSourceLocale", function() {
        expect.assertions(1);
        expect(!PseudoFactory.isPseudoLocale("en-US")).toBeTruthy();
    });
});
