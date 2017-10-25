/*
 * testYaml.js - test the Yaml object.
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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

if (!YamlFile) {
    var YamlFile = require("../lib/YamlFile.js");
    var YamlFileType = require("../lib/YamlFileType.js");
    var ContextResourceString = require("../lib/ContextResourceString.js");
    var ResourcePlural = require("../lib/ResourcePlural.js");
    var WebProject =  require("../lib/WebProject.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
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
    }
}

var p = new WebProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        yml: "a/b"
    }
}, "./testfiles", {
    locales:["en-GB"],
    nopseudo: true
});

var yft = new YamlFileType(p);

module.exports = {
    testYamlConstructorEmpty: function(test) {
        test.expect(1);

        var y = new YamlFile();
        test.ok(y);

        test.done();
    },

    testYamlConstructorFull: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "x/y/en-US.yml"
        });
        test.ok(y);

        test.equal(y.getPath(), "x/y/en-US.yml");

        test.done();
    },

    testYamlGetPath: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        test.ok(y);

        test.equal(y.getPath(), "foo/bar/x.yml");

        test.done();
    },

    testYamlFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse('---\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n' +
                'Working_at_MyCompany: Working at My Company, Inc.\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Jobs"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getKey(), "Jobs");
        test.ok(!r[0].getComment());

        test.done();
    },

    testYamlFileParseWithSubkeys: function(test) {
        test.expect(28);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
                '---\n' +
                "'foo/bar/x.en-US.html.haml':\n" +
                '  r9834724545: Jobs\n' +
                '  r9483762220: Our internship program\n' +
                '  r6782977423: |\n' +
                '    Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '    directly from experienced, successful entrepreneurs.\n' +
                "'foo/ssss/asdf.en-US.html.haml':\n" +
                '  r4524523454: Working at MyCompany\n' +
                '  r3254356823: Jobs\n' +
                'foo:\n' +
                '  bar:\n' +
                '    asdf:\n' +
                '      test: test of many levels\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 6);

        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getSourceLocale(), "en-US"); // source locale
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getSourceLocale(), "en-US"); // source locale
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(),
                'Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getSourceLocale(), "en-US"); // source locale
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at MyCompany");
        test.equal(r[3].getSourceLocale(), "en-US"); // source locale
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getSourceLocale(), "en-US"); // source locale
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getSourceLocale(), "en-US"); // source locale
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "foo@bar@asdf");

        test.done();
    },

    testYamlFileParseWithLocaleAndSubkeys: function(test) {
        test.expect(28);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
                '---\n' +
                "zh_Hans_CN:\n" +
                "  foo/bar/x.en-US.html.haml:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                "  foo/ssss/asdf.en-US.html.haml:\n" +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 6);

        // locale is not special for this type of yml file, so it should appear in the context
        test.equal(r[0].getSource(), "Jobs");
        test.equal(r[0].getSourceLocale(), "en-US");
        test.equal(r[0].getKey(), "r9834724545");
        test.equal(r[0].getContext(), "zh_Hans_CN@foo/bar/x.en-US.html.haml");

        test.equal(r[1].getSource(), "Our internship program");
        test.equal(r[1].getSourceLocale(), "en-US");
        test.equal(r[1].getKey(), "r9483762220");
        test.equal(r[1].getContext(), "zh_Hans_CN@foo/bar/x.en-US.html.haml");

        test.equal(r[2].getSource(),
                'Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        test.equal(r[2].getSourceLocale(), "en-US");
        test.equal(r[2].getKey(), "r6782977423");
        test.equal(r[2].getContext(), "zh_Hans_CN@foo/bar/x.en-US.html.haml");

        test.equal(r[3].getSource(), "Working at MyCompany");
        test.equal(r[3].getSourceLocale(), "en-US");
        test.equal(r[3].getKey(), "r4524523454");
        test.equal(r[3].getContext(), "zh_Hans_CN@foo/ssss/asdf.en-US.html.haml");

        test.equal(r[4].getSource(), "Jobs");
        test.equal(r[4].getSourceLocale(), "en-US");
        test.equal(r[4].getKey(), "r3254356823");
        test.equal(r[4].getContext(), "zh_Hans_CN@foo/ssss/asdf.en-US.html.haml");

        test.equal(r[5].getSource(), "test of many levels");
        test.equal(r[5].getSourceLocale(), "en-US");
        test.equal(r[5].getKey(), "test");
        test.equal(r[5].getContext(), "zh_Hans_CN@foo@bar@asdf");

        test.done();
    },

    testYamlFileParseMultipleLevels: function(test) {
        test.expect(24);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            'duration:\n' +
            '  top_header: Refine Your Query\n' +
            '  header:\n' +
            '    person: "%ACK_SAMPLE%"\n' +
            '    subaccount: "%ACK_SAMPLE%" \n' + 
            '  variations:\n' +
            '    person: "A %NAME% name?"\n' +
            '    subaccount: "A %SUBACCOUNT_NAME%\'s name?"\n' + 
            '    asdf:\n' +
            '      a: x y z\n' +
            '      c: a b c\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 5);

        // locale is not special for this type of yml file, so it should appear in the context
        test.equal(r[0].getSource(), "Refine Your Query");
        test.equal(r[0].getSourceLocale(), "en-US");
        test.equal(r[0].getKey(), "top_header");
        test.equal(r[0].getContext(), "duration");

        test.equal(r[1].getSource(), "A %NAME% name?");
        test.equal(r[1].getSourceLocale(), "en-US");
        test.equal(r[1].getKey(), "person");
        test.equal(r[1].getContext(), "duration@variations");

        test.equal(r[2].getSource(), 'A %SUBACCOUNT_NAME%\'s name?');
        test.equal(r[2].getSourceLocale(), "en-US");
        test.equal(r[2].getKey(), "subaccount");
        test.equal(r[2].getContext(), "duration@variations");

        test.equal(r[3].getSource(), "x y z");
        test.equal(r[3].getSourceLocale(), "en-US");
        test.equal(r[3].getKey(), "a");
        test.equal(r[3].getContext(), "duration@variations@asdf");

        test.equal(r[4].getSource(), "a b c");
        test.equal(r[4].getSourceLocale(), "en-US");
        test.equal(r[4].getKey(), "c");
        test.equal(r[4].getContext(), "duration@variations@asdf");

        test.done();
    },

    testYamlFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse(
                'Working_at_MyCompany: Working at MyCompany\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n');

        test.ok(set);

        test.equal(set.size(), 4);

        test.done();
    },

    testYamlFileParseArray: function(test) {
        test.expect(18);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse(
                '---\n' +
                'Jobs:\n' +
                '  - one\n' +
                '  - two\n' +
                '  - three\n' +
                '  - four\n');

        test.ok(set);

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 4);

        test.equal(r[0].getSource(), "one");
        test.equal(r[0].getKey(), "0");
        test.equal(r[0].getContext(), "Jobs");

        test.equal(r[1].getSource(), "two");
        test.equal(r[1].getKey(), "1");
        test.equal(r[1].getContext(), "Jobs");

        test.equal(r[2].getSource(), "three");
        test.equal(r[2].getKey(), "2");
        test.equal(r[2].getContext(), "Jobs");

        test.equal(r[3].getSource(), "four");
        test.equal(r[3].getKey(), "3");
        test.equal(r[3].getContext(), "Jobs");

        test.done();
    },

    testYamlFileParseArrayWithIds: function(test) {
        test.expect(15);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        var set = yml.getTranslationSet();
        test.equal(set.size(), 0);

        yml.parse(
                '---\n' +
                'options:\n' +
                '  - name: attention\n' +
                '    display_value: Usually requires immediate attention\n' +
                '    color: red\n' +
                '    bars_count: 5\n' +
                '    action_options:\n' +
                '    - :emergency\n' +   // should ignore these
                '    - :see_support_rep\n' +
                '    - :find_sales_person\n' +
                '    - :ask_free_question\n' +
                '    - :learn_more\n' +
                '  - name: urgent-consult\n' +
                '    display_value: Usually requires an immediate sales person attention\n' +
                '    color: orange\n' +
                '    bars_count: 4\n' +
                '    care_options:\n' +
                '    - :see_support_rep\n' +
                '    - :find_sales_persopn\n' +
                '    - :learn_more\n' +
                '    - :emergency\n' +
                '    - :ask_free_question\n' +
                'exploring_options:\n' +
                '  - :learn_more\n' +
                '  - :take_action\n' +
                '  - :ask_free_question\n' +
                '  - :see_support_rep\n' +
                '  - :find_sales_person\n' +
                '  - :emergency\n\n');

        test.ok(set);

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 6);

        test.equal(r[0].getSource(), "attention");
        test.equal(r[0].getKey(), "name");
        test.equal(r[0].getContext(), "options@0");

        test.equal(r[1].getSource(), "Usually requires immediate attention");
        test.equal(r[1].getKey(), "display_value");
        test.equal(r[1].getContext(), "options@0");

        test.equal(r[2].getSource(), "red");
        test.equal(r[2].getKey(), "color");
        test.equal(r[2].getContext(), "options@0");

        test.done();
    },

    testYamlFileParseIgnoreUnderscoreValues: function(test) {
        test.expect(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse('---\n' +
                'Working_at_MyCompany: Working_at_MyCompany\n' +
                'Jobs: Jobs_Report\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileParseIgnoreRubyIds: function(test) {
        test.expect(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse('---\n' +
                'a: :foo\n' +
                'b: :bar\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileParseIgnoreRubyIdsWithQuotes: function(test) {
        test.expect(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse('---\n' +
                'a: ":foo"\n' +
                'b: ":bar"\n');

        var set = yml.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileExtractFile: function(test) {
        test.expect(14);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        test.ok(yml);

        // should read the file
        yml.extract();

        var set = yml.getTranslationSet();

        test.equal(set.size(), 10);

        var r = set.getBy({
            reskey: "Marketing"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Marketing");
        test.equal(r[0].getKey(), "Marketing");
        test.ok(!r[0].getComment());

        var r = set.getBy({
            reskey: "Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name."
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Everyone at MyCompany has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure, soon be a household name.");
        test.equal(r[0].getKey(), "Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name.");
        test.ok(!r[0].getComment());

        var r = set.getBy({
            reskey: "Learn_by_contributing_to_a_venture_that_will_change_the_world"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Learn by contributing to a venture that will change the world");
        test.equal(r[0].getKey(), "Learn_by_contributing_to_a_venture_that_will_change_the_world");
        test.ok(!r[0].getComment());

        test.done();
    },

    testYamlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileExtractBogusFile: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./objc/en.lproj/asdf.yml"
        });
        test.ok(yml);

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testYamlFileGetContent: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        test.ok(yml);

        [
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "source_text",
                source: "Quellen\"text",
                comment: "foo"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "more_source_text",
                source: "mehr Quellen\"text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        diff(yml.getContent(),
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );

        test.equal(yml.getContent(),
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );

        test.done();
    },

    testYamlFileGetContentComplicated: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        test.ok(yml);

        [
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "• &amp;nbsp; Address a particular topic",
                source: "• &amp;nbsp; 解决一个特定的主题",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "&apos;&#41;, url&#40;imgs/masks/top_bar",
                source: "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var expected = 
            "'&apos;&#41;, url&#40;imgs/masks/top_bar': '&apos;&#41;, url&#40;imgs/masks/top_bar康生活相'\n" +
            "• &amp;nbsp; Address a particular topic: • &amp;nbsp; 解决一个特定的主题\n";

        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);

        test.done();
    },

    testYamlFileGetContentWithNewlines: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        test.ok(yml);

        [
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "short key",
                source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "A very long key that happens to have \n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.",
                source: "short text",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var expected =
            "\"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n" +
            "short key: |-\n" +
            "  this is text that is relatively long and can run past the end of the page\n" +
            "  So, we put a new line in the middle of it.\n";

        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);

        test.done();
    },

    testYamlFileGetContentWithSubkeys: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        test.ok(yml);

        [
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "key1",
                source: "medium length text that doesn't go beyond one line",
                context: "foo@bar",
                comment: " "
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "key2",
                source: "short text",
                context: "foo@bar@asdf",
                comment: "bar"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var expected =
            "foo:\n" +
            "  bar:\n" +
            "    asdf:\n" +
            "      key2: short text\n" +
            "    key1: medium length text that doesn't go beyond one line\n";

        diff(yml.getContent(), expected);

        test.equal(yml.getContent(), expected);

        test.done();
    },

    testYamlFileGetContentEmpty: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        test.ok(yml);

        test.equal(yml.getContent(), '{}\n');

        test.done();
    },

    testYamlFileRealContent: function(test) {
        test.expect(5);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml",
            locale: "en-US"
        });
        test.ok(yml);

        yml.extract();

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "The_perks_of_interning", "x-yaml"));
        test.ok(r);

        test.equal(r.getSource(), "The perks of interning");
        test.equal(r.getKey(), "The_perks_of_interning");

        test.done();
    },

    testYamlFileRealContent2: function(test) {
        test.expect(7);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        test.ok(yml);

        yml.extract();

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", "saved_someone_else_time", "en-US", "subject", "x-yaml"));
        test.ok(r);

        test.equal(r.getSource(), "Feel good! Someone said a colleague’s answer to your question saved them a lot of time:");
        test.equal(r.getKey(), "subject");
        test.equal(r.getSourceLocale(), "en-US");
        test.equal(r.getContext(), "saved_someone_else_time");

        test.done();
    },

    testYamlFileAtInKeyName: function(test) {
        test.expect(7);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        test.ok(yml);

        yml.extract();

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        test.ok(r);

        test.equal(r.getSource(), "%1, %2 has answered a question you asked!");
        test.equal(r.getKey(), "email_subject");
        test.equal(r.getSourceLocale(), "en-US");
        test.equal(r.getContext(), "member_question_asked\\@answered");

        test.done();
    },

    testYamlFileRightResourceType: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        test.ok(yml);

        yml.extract();

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        test.ok(r);

        test.ok(r instanceof ContextResourceString);

        test.done();
    },

    testYamlFileParseIgnoreNonStringValues: function(test) {
        test.expect(20);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getAll();
        test.ok(r);

        test.equal(r.length, 4);

        test.equal(r[0].getSource(), "ALERT: Your %1 credit card has expired");
        test.equal(r[0].getSourceLocale(), "en-US");
        test.equal(r[0].getKey(), "subject");
        test.equal(r[0].getContext(), "credit_card_expired");

        test.equal(r[1].getSource(), "Add your updated credit card information to resume using your account without further disruption.");
        test.equal(r[1].getSourceLocale(), "en-US");
        test.equal(r[1].getKey(), "body");
        test.equal(r[1].getContext(), "credit_card_expired");

        test.equal(r[2].getSource(), 'Update credit card info');
        test.equal(r[2].getSourceLocale(), "en-US");
        test.equal(r[2].getKey(), "ctoa");
        test.equal(r[2].getContext(), "credit_card_expired");

        test.equal(r[3].getSource(), "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption");
        test.equal(r[3].getSourceLocale(), "en-US");
        test.equal(r[3].getKey(), "push_data");
        test.equal(r[3].getContext(), "credit_card_expired");

        test.done();
    },

    testYamlFileParseIgnoreStringLikeIdValues: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "global_link"
        });
        test.ok(r);
        test.equal(r.length, 0);

        test.done();
    },

    testYamlFileParseIgnoreBooleanValues: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "night_blackout"
        });
        test.ok(r);
        test.equal(r.length, 0);

        test.done();
    },

    testYamlFileParseIgnoreEmptyValues: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "sms_data"
        });
        test.ok(r);
        test.equal(r.length, 0);

        test.done();
    },

    testYamlFileParseIgnoreEmptyValues: function(test) {
        test.expect(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  expert_campaign: 2\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "expert_campaign"
        });
        test.ok(r);
        test.equal(r.length, 0);

        test.done();
    },

    testYamlFileLocalizeText: function(test) {
        test.expect(8);

        var yml = new YamlFile({
            project: p,
            type: yft,
            locale: "en-US"
        });
        test.ok(yml);

        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject: \'%1, you’re saving time!\'\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  global_link: generic_link\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  daily_limit_exception_email: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('%1, you’re saving time!', "thanked_note_time_saved");
        test.ok(r);
        test.equal(r.getSource(), '%1, you’re saving time!');
        test.equal(r.getSourceLocale(), 'en-US');
        test.equal(r.getKey(), 'email_subject');
        test.equal(r.getContext(), "thanked_note_time_saved");

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "webapp",
            context: "thanked_note_time_saved",
            key: 'email_subject',
            source: '%1, you\'re saving time!',
            target: '%1, vous économisez du temps!',
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));

        var actual = yml.localizeText(translations, "fr-FR");

        var expected =
            'thanked_note_time_saved:\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  daily_limit_exception_email: true\n' +
            '  email_subject: \'%1, vous économisez du temps!\'\n' +
            '  global_link: generic_link\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testYamlFileLocalizeTextMultiple: function(test) {
        test.expect(15);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(yml);

        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject: "%1, You\'re saving time!"\n' +
            '  subject: "You’ve been thanked for saving a colleague\'s time!"\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  push_data: You\'ve saved time! View %1\n' +
            '  global_link: generic_link\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  daily_limit_exception_email: true\n'
        );

        var set = yml.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('%1, You\'re saving time!', "thanked_note_time_saved");
        test.ok(r);
        test.equal(r.getSource(), '%1, You\'re saving time!');
        test.equal(r.getKey(), 'email_subject');
        test.equal(r.getContext(), "thanked_note_time_saved");

        r = set.getBySource('You’ve been thanked for saving a colleague\'s time!', "thanked_note_time_saved");
        test.ok(r);
        test.equal(r.getSource(), 'You’ve been thanked for saving a colleague\'s time!');
        test.equal(r.getKey(), 'subject');
        test.equal(r.getContext(), "thanked_note_time_saved");

        r = set.getBySource('You\'ve saved time! View %1', "thanked_note_time_saved");
        test.ok(r);
        test.equal(r.getSource(), 'You\'ve saved time! View %1');
        test.equal(r.getKey(), 'push_data');
        test.equal(r.getContext(), "thanked_note_time_saved");

        var translations = new TranslationSet();
        translations.addAll([
            new ContextResourceString({
                project: "webapp",
                context: "thanked_note_time_saved",
                key: 'email_subject',
                source: '%1, You\'re saving time!',
                target: '%1, vous économisez du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ContextResourceString({
                project: "webapp",
                context: "thanked_note_time_saved",
                key: 'subject',
                source: 'You’ve been thanked for saving a colleague\'s time!',
                target: 'Vous avez été remercié pour économiser du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ContextResourceString({
                project: "webapp",
                context: "thanked_note_time_saved",
                key: 'push_data',
                source: 'You’ve saved time! View %1',
                target: 'Vous avez économisé du temps! Voir %1',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
        ]);

        var actual = yml.localizeText(translations, "fr-FR");

        var expected =
            'thanked_note_time_saved:\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  daily_limit_exception_email: true\n' +
            '  email_subject: \'%1, vous économisez du temps!\'\n' +
            '  global_link: generic_link\n' +
            '  push_data: Vous avez économisé du temps! Voir %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: Vous avez été remercié pour économiser du temps!\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testYamlGetSchemaPath: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        test.ok(y);

        test.equal(y.getSchemaPath(), "foo/bar/x-schema.json");

        test.done();
    },

    testYamlGetSchemaPathNoFile: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft
        });
        test.ok(y);

        test.equal(y.getSchemaPath(), undefined);

        test.done();
    },

    testYamlExtractSchemaFile: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        test.notEqual(y.getSchema(), undefined);
        test.done();
    },

    testYamlGetExcludedKeysFromSchema: function(test) {
        test.expect(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getExcludedKeysFromSchema().length, 1);
        test.equal(y.getExcludedKeysFromSchema()[0], 'do_not_read_me');
        test.done();
    },

    testYamlGetExcludedKeysFromSchemaWithoutSchema: function(test) {
        test.expect(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getSchema(), undefined);
        test.equal(y.getExcludedKeysFromSchema().length, 0);
        test.done();
    },

    testYamlParseExcludedKeys: function(test) {
        test.expect(4);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        var set = y.getTranslationSet();
        test.ok(set);
        test.equal(set.getBySource('b','title@read_me').getLocalize(), true);
        test.equal(set.getBySource('d','title@do_not_read_me').getLocalize(), false);
        test.done();
    },

    testYamlParseOutputFile: function(test) {
        test.expect(5);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        var outputFileContents =
            'title:\n' +
            '  read_me:\n' +
            '    a: f\n' +
            '  do_not_read_me:\n' +
            '    c: e\n';
        y.parseOutputFile(outputFileContents);
        var set = y.getTranslationSet();
        test.ok(set);
        //test.equal(set.getBySource('d', 'title@do_not_read_me'), undefined);
        var r = set.getBy({reskey: 'c', context: 'title@do_not_read_me'});
        test.ok(r);
        test.equal(r.length, 1);
        test.equal(r[0].getSource(), 'e');
        test.done();
    },

    testYamlGetLocalizedPathDefault: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.extract();
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/test2.yml');
        test.done();
    },

    testYamlUseLocalizedDirectoriesFromSchema: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.schema = {}
        y.schema['useLocalizedDirectories'] = false;
        test.equal(y.getUseLocalizedDirectoriesFromSchema(), false);
        test.done();
    },

    testYamlUseLocalizedDirectoriesFromSchemaWithoutSchema: function(test) {
        test.expect(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        test.ok(y);
        y.extract();
        test.equal(y.getSchema(), undefined);
        test.equal(y.getUseLocalizedDirectoriesFromSchema(), true);
        test.done();
    },

    testYamlGetLocalizedPathWithLocalizedDirectories: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        y.schema['useLocalizedDirectories'] = true;
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/test3.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithoutLocalizedDirectories: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        test.ok(y);
        y.extract();
        y.schema['useLocalizedDirectories'] = false;
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/test3.yml');
        test.done();
    },

    testYamlGetOutputFilenameForLocaleWithoutSchema: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        test.equals(y.getOutputFilenameForLocale('de-DE'), './test2.yml');
        test.done();
    },

    testYamlGetOutputFilenameForLocaleWithSchema: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {};
        y.schema['outputFilenameMapping'] = {
            'de-DE': './de.yml'
        }
        test.equals(y.getOutputFilenameForLocale('de-DE'), './de.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithLocalizedDirs: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {
            useLocalizedDirectories: true
        };
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/test2.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithLocalizedDirsAndOutputFilenameMapping: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {
            useLocalizedDirectories: true,
            outputFilenameMapping: {
                'de-DE': './de.yml'
            }
        };
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de-DE/de.yml');
        test.done();
    },

    testYamlGetLocalizedPathWithOutputFilenameMappingAndWithoutLocalizedDirectories: function(test) {
        test.expect(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        test.ok(y);
        y.schema = {
            'outputFilenameMapping': {
                'de-DE': './de.yml'
            },
            'useLocalizedDirectories': false
        };
        test.equals(y.getLocalizedPath('de-DE'), 'testfiles/de.yml');
        test.done();
    },

    testYamlFileGetContentPlural: function(test) {
        test.expect(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        test.ok(yml);

        [
            new ResourcePlural({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "asdf",
                sourceStrings: {
                    "one": "This is singular",
                    "two": "This is double",
                    "few": "This is a different case"
                },
                pathName: "a/b/c.java",
                comment: "foobar foo",
                state: "accepted"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });

        var expected =
            "asdf:\n"+
            "  few: This is a different case\n" +
            "  one: This is singular\n" +
            "  two: This is double\n";

        diff(yml.getContent(),expected);

        test.equal(yml.getContent(), expected);

        test.done();
    }
};
