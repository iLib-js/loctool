/*
 * Yaml.test.js - test the Yaml resource file object.
 *
 * Copyright © 2016-2017, 2023 2021, 2023 HealthTap, Inc. and JEDLSoft
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
if (!YamlResourceFile) {
    var YamlResourceFile = require("../lib/YamlResourceFile.js");
    var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var WebProject =  require("../lib/WebProject.js");
}
function diff(a, b) {
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    });
}
var p = new WebProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "yml": "a/b"
    });
}, "./testfiles", {
    locales:["en-GB"]
});
var yft = new YamlResourceFileType(p);
describe("yamlresourcefile", function() {
    test("YamlConstructorEmpty", function() {
        expect.assertions(1);
        var y = new YamlResourceFile();
        expect(y).toBeTruthy();
    });
    test("YamlConstructorFull", function() {
        expect.assertions(2);
       var y = new YamlResourceFile({
            project: p,
            pathName: "a/b/en-US.yml",
            type: yft
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("a/b/en-US.yml");
    });
    test("YamlGetPath", function() {
        expect.assertions(2);
        var y = new YamlResourceFile({
            project: p,
            pathName: "foo/bar/x.yml",
            type: yft
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("foo/bar/x.yml");
    });
    test("YamlResourceFileParseSimpleGetByKey", function() {
        expect.assertions(6);
         var yml = new YamlResourceFile({
            project: p,
            type: yft,
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'Working_at_MyCompany: Working at MyCompany\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Jobs"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getKey()).toBe("Jobs");
        expect(!r[0].getComment()).toBeTruthy();
    });
    test("YamlResourceFileParseWithSubkeys", function() {
        expect.assertions(28);
        var yml = new YamlResourceFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
                '---\n' +
                "'feelgood/foo/bar/x.en-US.html.haml':\n" +
                '  r9834724545: Jobs\n' +
                '  r9483762220: Our internship program\n' +
                '  r6782977423: |\n' +
                '    Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '    directly from experienced, successful entrepreneurs.\n' +
                "'feelgood/foo/ssss/asdf.en-US.html.haml':\n" +
                '  r4524523454: Working at MyCompany\n' +
                '  r3254356823: Jobs\n' +
                'foo:\n' +
                '  bar:\n' +
                '    asdf:\n' +
                '      test: test of many levels\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[0].getKey()).toBe("r9834724545");
        expect(r[0].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[1].getKey()).toBe("r9483762220");
        expect(r[1].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[2].getKey()).toBe("r6782977423");
        expect(r[2].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[3].getKey()).toBe("r4524523454");
        expect(r[3].getContext()).toBe("feelgood/foo/ssss/asdf.en-US.html.haml");
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[4].getKey()).toBe("r3254356823");
        expect(r[4].getContext()).toBe("feelgood/foo/ssss/asdf.en-US.html.haml");
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[5].getKey()).toBe("test");
        expect(r[5].getContext()).toBe("foo@bar@asdf");
    });
    test("YamlResourceFileParseWithLocaleAndSubkeys", function() {
        expect.assertions(28);
        var yml = new YamlResourceFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
                '---\n' +
                "zh-Hans-CN:\n" +
                "  feelgood/foo/bar/x.en-US.html.haml:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                "  feelgood/foo/ssss/asdf.en-US.html.haml:\n" +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        expect(r[0].getTarget()).toBe("Jobs");
        expect(r[0].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[0].getKey()).toBe("r9834724545");
        expect(r[0].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[1].getTarget()).toBe("Our internship program");
        expect(r[1].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[1].getKey()).toBe("r9483762220");
        expect(r[1].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[2].getTarget()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[2].getKey()).toBe("r6782977423");
        expect(r[2].getContext()).toBe("feelgood/foo/bar/x.en-US.html.haml");
        expect(r[3].getTarget()).toBe("Working at MyCompany");
        expect(r[3].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[3].getKey()).toBe("r4524523454");
        expect(r[3].getContext()).toBe("feelgood/foo/ssss/asdf.en-US.html.haml");
        expect(r[4].getTarget()).toBe("Jobs");
        expect(r[4].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[4].getKey()).toBe("r3254356823");
        expect(r[4].getContext()).toBe("feelgood/foo/ssss/asdf.en-US.html.haml");
        expect(r[5].getTarget()).toBe("test of many levels");
        expect(r[5].getTargetLocale()).toBe("zh-Hans-CN");
        expect(r[5].getKey()).toBe("test");
        expect(r[5].getContext()).toBe("foo@bar@asdf");
    });
    test("YamlFileParseCustomizationFileWithFlavor", function() {
        expect.assertions(19);
        var yml = new YamlResourceFile({
            project: p,
            type: yft,
            path: "config/customization/en-US-CHOCOLATE.yml"
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            "en-US-CHOCOLATE:\n" +
            '  r9834724545: Jobs\n' +
            '  r9483762220: Our internship program\n' +
            '  r6782977423: |\n' +
            '    Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
            '    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
            '    directly from experienced, successful entrepreneurs.\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(3);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US-CHOCOLATE");
        expect(r[0].getKey()).toBe("r9834724545");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US-CHOCOLATE");
        expect(r[1].getKey()).toBe("r9483762220");
        expect(!r[1].getContext()).toBeTruthy();
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
            'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
            'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US-CHOCOLATE");
        expect(r[2].getKey()).toBe("r6782977423");
        expect(!r[2].getContext()).toBeTruthy();
        expect(r[2].getFlavor()).toBe("CHOCOLATE");
    });
    test("YamlResourceFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var yml = new YamlResourceFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
        yml.parse('---\n' +
                'es-US:\n' +
                '  Working_at_MyCompany: Working at MyCompany\n' +
                '  Jobs: Jobs\n' +
                '  Our_internship_program: Our internship program\n' +
                '  ? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                '  : Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '    directly from experienced, successful entrepreneurs.\n');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
    });
    test("YamlResourceFileExtractFile", function() {
        expect.assertions(14);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./test.yml",
            type: yft
        });
        expect(yml).toBeTruthy();
        // should read the file
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(10);
        var r = set.getBy({
            reskey: "Marketing"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Marketing");
        expect(r[0].getKey()).toBe("Marketing");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name."
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource(), "Everyone at MyCompany has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure).toBe(soon be a household name.");
        expect(r[0].getKey()).toBe("Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name.");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "Learn_by_contributing_to_a_venture_that_will_change_the_world"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Learn by contributing to a venture that will change the world");
        expect(r[0].getKey()).toBe("Learn_by_contributing_to_a_venture_that_will_change_the_world");
        expect(!r[0].getComment()).toBeTruthy();
    });
    test("YamlResourceFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // should attempt to read the file and not fail
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("YamlResourceFileExtractBogusFile", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./objc/en.lproj/asdf.yml",
            type: yft
        });
        expect(yml).toBeTruthy();
        // should attempt to read the file and not fail
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("YamlResourceFileGetContent", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./asdf.yml",
            locale: "de-DE",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "en-US",
                source: "source\"text",
                targetLocale: "de-DE",
                key: "source_text",
                target: "Quellen\"text",
                comment: "foo"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "en-US",
                source: "more source\"text",
                targetLocale: "de-DE",
                key: "more_source_text",
                target: "mehr Quellen\"text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            'de:\n' +
            '  more_source_text: mehr Quellen\"text\n' +
            '  source_text: Quellen\"text\n';
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
    });
    test("YamlResourceFileGetContentComplicated", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ContextResourceString({
                project: "webapp",
                source: "• &amp;nbsp; Hello, how are you",
                targetLocale: "zh-Hans-CN",
                key: "• &amp;nbsp; Hello, how are you",
                target: "• &amp;nbsp; 你好吗",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                source: "&apos;&#41;, url&#40;imgs/masks/top_bar",
                targetLocale: "zh-Hans-CN",
                key: "&apos;&#41;, url&#40;imgs/masks/top_bar",
                target: "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            "zh:\n" +
            "  '&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n" +
            "  • &amp;nbsp; Hello, how are you: • &amp;nbsp; 你好吗\n";
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
    });
    test("YamlResourceFileGetContentWithNewlines", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ContextResourceString({
                project: "webapp",
                source: "short key",
                targetLocale: "zh-Hans-CN",
                key: "short key",
                target: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                source: "A very long key that happens to have \n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.",
                targetLocale: "zh-Hans-CN",
                key: "A very long key that happens to have \n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.",
                target: "short text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            "zh:\n" +
            "  \"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n" +
            "  short key: |-\n" +
            "    this is text that is relatively long and can run past the end of the page\n" +
            "    So, we put a new line in the middle of it.\n";
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
    });
    test("YamlResourceFileGetContentEmpty", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./asdf.yml",
            locale: "de-DE",
            type: yft
        });
        expect(yml).toBeTruthy();
        expect(yml.getContent()).toBe('{}\n');
    });
    test("YamlResourceFileRealContent", function() {
        expect.assertions(5);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./test.yml",
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "The_perks_of_interning", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The perks of interning");
        expect(r.getKey()).toBe("The_perks_of_interning");
    });
    test("YamlResourceFileRealContent2", function() {
        expect.assertions(7);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./test2.yml",
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", "saved_someone_else_time", "en-US", "subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Someone said a colleague’s answer to your question saved them a lot of time:");
        expect(r.getKey()).toBe("subject");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getContext()).toBe("saved_someone_else_time");
    });
    test("YamlResourceFileAtInKeyName", function() {
        expect.assertions(7);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./test2.yml",
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource(), "%1).toBe(%2 has answered a question you asked!");
        expect(r.getKey()).toBe("email_subject");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getContext()).toBe("member_question_asked\\@answered");
    });
    test("YamlResourceFileRightResourceType", function() {
        expect.assertions(4);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./test2.yml",
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r instanceof ContextResourceString).toBeTruthy();
    });
    test("YamlResourceFileGetContentDontUseSourceHash", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ContextResourceString({
                project: "webapp",
                source: "foo",
                targetLocale: "zh-Hans-CN",
                key: "r24524524524",
                target: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                source: "bar",
                targetLocale: "zh-Hans-CN",
                key: "r003425245",
                target: "short text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var actual = yml.getContent();
        var expected =
            "zh:\n" +
            "  r003425245: short text\n" +
            "  r24524524524: |-\n" +
            "    this is text that is relatively long and can run past the end of the page\n" +
            "    So, we put a new line in the middle of it.\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("YamlResourceFileGetContentResourcePlural", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ResourcePlural({
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                comment: "",
                key: 'r186608186',
                targetStrings: {
                    'one' : 'This is 1 test',
                    'other' : 'There are %{count} tests'
                }
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var actual = yml.getContent();
        var expected =
            "zh:\n" +
            "  r186608186:\n" +
            "    one: This is 1 test\n" +
            "    other: There are %{count} tests\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("YamlResourceFileGetContentResourcePluralAndString", function() {
        expect.assertions(2);
        var yml = new YamlResourceFile({
            project: p,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN",
            type: yft
        });
        expect(yml).toBeTruthy();
        [
            new ResourcePlural({
                project: "webapp",
                sourceStrings: {
                    'one': 'one',
                    'other': 'other'
                },
                targetLocale: "zh-Hans-CN",
                comment: "",
                key: 'r186608186',
                targetStrings: {
                    'one' : 'This is 1 test',
                    'other' : 'There are %{count} tests'
                }
            }),
            new ContextResourceString({
                project: "webapp",
                source: "foo",
                targetLocale: "zh-Hans-CN",
                key: "r003425245",
                target: "short text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var actual = yml.getContent();
        var expected =
            "zh:\n" +
            "  r003425245: short text\n" +
            "  r186608186:\n" +
            "    one: This is 1 test\n" +
            "    other: There are %{count} tests\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
});
