/*
 * Yaml.test.js - test the Yaml object.
 *
 * Copyright © 2016-2017, 2023 HealthTap, Inc.
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
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    flavors: ["CHOCOLATE", "VANILLA"]
});

var p2 = new WebProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        yml: "a/b"
    }
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    localeMap: {
        "de-DE": "de"
    }
});

var yft = new YamlFileType(p);

describe("yamlfile", function() {
    test("YamlConstructorEmpty", function() {
        expect.assertions(1);

        var y = new YamlFile();
        expect(y).toBeTruthy();
    });

    test("YamlConstructorEmptyNoFlavor", function() {
        expect.assertions(2);

        var y = new YamlFile();
        expect(y).toBeTruthy();
        expect(!y.getFlavor()).toBeTruthy();
    });

    test("YamlConstructorFull", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "x/y/en-US.yml"
        });
        expect(y).toBeTruthy();

        expect(y.getPath()).toBe("x/y/en-US.yml");
    });

    test("YamlGetPath", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        expect(y).toBeTruthy();

        expect(y.getPath()).toBe("foo/bar/x.yml");
    });

    test("YamlWithFlavor", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/customized/en-US-VANILLA.yml"
        });
        expect(y).toBeTruthy();

        expect(y.getFlavor()).toBe("VANILLA");
    });

    test("YamlWithNonFlavor", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/customized/en-US-PEACH.yml"
        });
        expect(y).toBeTruthy();

        // PEACH is not a flavor in the project
        expect(!y.getFlavor()).toBeTruthy();
    });

    test("YamlFileParseSimpleGetByKey", function() {
        expect.assertions(6);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n' +
                'Working_at_MyCompany: Working at My Company, Inc.\n');

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

    test("YamlFileParseWithSubkeys", function() {
        expect.assertions(28);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(6);

        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[0].getKey()).toBe("r9834724545");
        expect(r[0].getContext()).toBe("foo/bar/x.en-US.html.haml");

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[1].getKey()).toBe("r9483762220");
        expect(r[1].getContext()).toBe("foo/bar/x.en-US.html.haml");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[2].getKey()).toBe("r6782977423");
        expect(r[2].getContext()).toBe("foo/bar/x.en-US.html.haml");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[3].getKey()).toBe("r4524523454");
        expect(r[3].getContext()).toBe("foo/ssss/asdf.en-US.html.haml");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[4].getKey()).toBe("r3254356823");
        expect(r[4].getContext()).toBe("foo/ssss/asdf.en-US.html.haml");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[5].getKey()).toBe("test");
        expect(r[5].getContext()).toBe("foo@bar@asdf");
    });

    test("YamlFileParseWithLocaleAndSubkeys", function() {
        expect.assertions(28);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(6);

        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("r9834724545");
        expect(r[0].getContext()).toBe("zh_Hans_CN@foo/bar/x.en-US.html.haml");

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("r9483762220");
        expect(r[1].getContext()).toBe("zh_Hans_CN@foo/bar/x.en-US.html.haml");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("r6782977423");
        expect(r[2].getContext()).toBe("zh_Hans_CN@foo/bar/x.en-US.html.haml");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("r4524523454");
        expect(r[3].getContext()).toBe("zh_Hans_CN@foo/ssss/asdf.en-US.html.haml");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("r3254356823");
        expect(r[4].getContext()).toBe("zh_Hans_CN@foo/ssss/asdf.en-US.html.haml");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("test");
        expect(r[5].getContext()).toBe("zh_Hans_CN@foo@bar@asdf");
    });

    test("YamlFileParseMultipleLevels", function() {
        expect.assertions(24);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(5);

        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Refine Your Query");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("top_header");
        expect(r[0].getContext()).toBe("duration");

        expect(r[1].getSource()).toBe("A %NAME% name?");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("person");
        expect(r[1].getContext()).toBe("duration@variations");

        expect(r[2].getSource()).toBe('A %SUBACCOUNT_NAME%\'s name?');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("subaccount");
        expect(r[2].getContext()).toBe("duration@variations");

        expect(r[3].getSource()).toBe("x y z");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("a");
        expect(r[3].getContext()).toBe("duration@variations@asdf");

        expect(r[4].getSource()).toBe("a b c");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("c");
        expect(r[4].getContext()).toBe("duration@variations@asdf");
    });

    test("YamlFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.parse(
                'Working_at_MyCompany: Working at MyCompany\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
    });

    test("YamlFileParseArray", function() {
        expect.assertions(18);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.parse(
                '---\n' +
                'Jobs:\n' +
                '  - one and\n' +
                '  - two and\n' +
                '  - three\n' +
                '  - four\n');

        expect(set).toBeTruthy();

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(4);

        expect(r[0].getSource()).toBe("one and");
        expect(r[0].getKey()).toBe("0");
        expect(r[0].getContext()).toBe("Jobs");

        expect(r[1].getSource()).toBe("two and");
        expect(r[1].getKey()).toBe("1");
        expect(r[1].getContext()).toBe("Jobs");

        expect(r[2].getSource()).toBe("three");
        expect(r[2].getKey()).toBe("2");
        expect(r[2].getContext()).toBe("Jobs");

        expect(r[3].getSource()).toBe("four");
        expect(r[3].getKey()).toBe("3");
        expect(r[3].getContext()).toBe("Jobs");
    });

    test("YamlFileParseArrayWithIds", function() {
        expect.assertions(15);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.parse(
                '---\n' +
                'options:\n' +
                '  - name: attention\n' +
                '    display_value: Usually requires immediate attention\n' +
                '    color: reddish\n' +
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

        expect(set).toBeTruthy();

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(6);

        expect(r[0].getSource()).toBe("attention");
        expect(r[0].getKey()).toBe("name");
        expect(r[0].getContext()).toBe("options@0");

        expect(r[1].getSource()).toBe("Usually requires immediate attention");
        expect(r[1].getKey()).toBe("display_value");
        expect(r[1].getContext()).toBe("options@0");

        expect(r[2].getSource()).toBe("reddish");
        expect(r[2].getKey()).toBe("color");
        expect(r[2].getContext()).toBe("options@0");
    });

    test("YamlFileParseIgnoreUnderscoreValues", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'Working_at_MyCompany: Working_at_MyCompany\n' +
                'Jobs: Jobs_Report\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreRubyIds", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: :foo\n' +
                'b: :bar\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreRubyIdsWithQuotes", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: ":foo"\n' +
                'b: ":bar"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesWithPunctuation", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // not words... embedded punctuation is probably not English
        yml.parse('---\n' +
                'a: "http://foo.bar.com/asdf/asdf.html"\n' +
                'b: "bar.asdf"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesTooShort", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // too short for most English words
        yml.parse('---\n' +
                'a: "a"\n' +
                'b: "ab"\n' +
                'c: "abc"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesTooLong", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // too long for regular English words
        yml.parse('---\n' +
                'a: "generalpractitionercardidnumber"\n' +
                'b: "huasdfHfasYEwqlkasdfjklHAFaihaFAasysfkjasdfLASDFfihASDFKsadfhysafJSKf"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesWithNumbers", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // embedded numbers is not English
        yml.parse('---\n' +
                'a: "Abc3"\n' +
                'b: "Huasdfafawql4kja"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesWithCamelCase", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: "LargeFormat"\n' +
                'b: "NeedsAttention"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesAllCapsOkay", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: "LARGE"\n' +
                'b: "ATTENTION"\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
    });

    test("YamlFileParseIgnoreNoSpacesTrueAndFalse", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: true\n' +
                'b: false\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesOnlyDigits", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: 452345\n' +
                'b: 344\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileParseIgnoreNoSpacesHex", function() {
        expect.assertions(3);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: cbca81213eb5901b8ae4f8ac\n' +
                'b: ab21fe4f440EA4\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("YamlFileExtractFile", function() {
        expect.assertions(14);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
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
        expect(r[0].getSource()).toBe("Everyone at MyCompany has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure, soon be a household name.");
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

    test("YamlFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("YamlFileExtractBogusFile", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./objc/en.lproj/asdf.yml"
        });
        expect(yml).toBeTruthy();

        // should attempt to read the file and not fail
        yml.extract();

        var set = yml.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("YamlFileGetContent", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();

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

        expect(yml.getContent()).toBe('more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );
    });

    test("YamlFileGetContentComplicated", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();

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

        expect(yml.getContent()).toBe(expected);
    });

    test("YamlFileGetContentWithNewlines", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();

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

        expect(yml.getContent()).toBe(expected);
    });

    test("YamlFileGetContentWithSubkeys", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();

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

        expect(yml.getContent()).toBe(expected);
    });

    test("YamlFileGetContentEmpty", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();

        expect(yml.getContent()).toBe('{}\n');
    });

    test("YamlFileRealContent", function() {
        expect.assertions(5);

        var p = new WebProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                yml: "a/b"
            }
        }, "./test/testfiles", {
            locales:["en-GB"]
        });

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml",
            locale: "en-US"
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

    test("YamlFileRealContent2", function() {
        expect.assertions(7);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
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

    test("YamlFileAtInKeyName", function() {
        expect.assertions(7);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();

        yml.extract();

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("%1, %2 has answered a question you asked!");
        expect(r.getKey()).toBe("email_subject");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getContext()).toBe("member_question_asked\\@answered");
    });

    test("YamlFileRightResourceType", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();

        yml.extract();

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("webapp", "member_question_asked\\@answered", "en-US", "email_subject", "x-yaml"));
        expect(r).toBeTruthy();

        expect(r instanceof ContextResourceString).toBeTruthy();
    });

    test("YamlFileParseIgnoreNonStringValues", function() {
        expect.assertions(20);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(4);

        expect(r[0].getSource()).toBe("ALERT: Your %1 credit card has expired");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("subject");
        expect(r[0].getContext()).toBe("credit_card_expired");

        expect(r[1].getSource()).toBe("Add your updated credit card information to resume using your account without further disruption.");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("body");
        expect(r[1].getContext()).toBe("credit_card_expired");

        expect(r[2].getSource()).toBe('Update credit card info');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("ctoa");
        expect(r[2].getContext()).toBe("credit_card_expired");

        expect(r[3].getSource()).toBe("ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("push_data");
        expect(r[3].getContext()).toBe("credit_card_expired");
    });

    test("YamlFileParseIgnoreStringLikeIdValues", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "global_link"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("YamlFileParseIgnoreBooleanValues", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "night_blackout"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("YamlFileParseIgnoreEmptyValues", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "sms_data"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("YamlFileParseIgnoreEmptyValues", function() {
        expect.assertions(4);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "expert_campaign"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("YamlFileLocalizeText", function() {
        expect.assertions(8);

        var yml = new YamlFile({
            project: p,
            type: yft,
            locale: "en-US"
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource('%1, you’re saving time!', "thanked_note_time_saved");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, you’re saving time!');
        expect(r.getSourceLocale()).toBe('en-US');
        expect(r.getKey()).toBe('email_subject');
        expect(r.getContext()).toBe("thanked_note_time_saved");

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
        expect(actual).toBe(expected);
    });

    test("YamlFileLocalizeTextMultiple", function() {
        expect.assertions(15);

        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();

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
        expect(set).toBeTruthy();

        var r = set.getBySource('%1, You\'re saving time!', "thanked_note_time_saved");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, You\'re saving time!');
        expect(r.getKey()).toBe('email_subject');
        expect(r.getContext()).toBe("thanked_note_time_saved");

        r = set.getBySource('You’ve been thanked for saving a colleague\'s time!', "thanked_note_time_saved");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('You’ve been thanked for saving a colleague\'s time!');
        expect(r.getKey()).toBe('subject');
        expect(r.getContext()).toBe("thanked_note_time_saved");

        r = set.getBySource('You\'ve saved time! View %1', "thanked_note_time_saved");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('You\'ve saved time! View %1');
        expect(r.getKey()).toBe('push_data');
        expect(r.getContext()).toBe("thanked_note_time_saved");

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
        expect(actual).toBe(expected);
    });

    test("YamlGetSchemaPath", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        expect(y).toBeTruthy();

        expect(y.getSchemaPath()).toBe("foo/bar/x-schema.json");
    });

    test("YamlGetSchemaPathNoFile", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft
        });
        expect(y).toBeTruthy();

        expect(y.getSchemaPath()).toBe(undefined);
    });

    test("YamlExtractSchemaFile", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getSchema()).not.toBe(undefined);
    });

    test("YamlGetExcludedKeysFromSchema", function() {
        expect.assertions(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getExcludedKeysFromSchema().length).toBe(1);
        expect(y.getExcludedKeysFromSchema()[0]).toBe('do_not_read_me');
    });

    test("YamlGetExcludedKeysFromSchemaWithoutSchema", function() {
        expect.assertions(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getSchema()).toBe(undefined);
        expect(y.getExcludedKeysFromSchema().length).toBe(0);
    });

    test("YamlParseExcludedKeys", function() {
        expect.assertions(4);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        var set = y.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource('good','title@read_me').getLocalize()).toBe(true);
        expect(!set.getBySource('bad','title@do_not_read_me')).toBeTruthy();
    });

    test("YamlParseOutputFile", function() {
        expect.assertions(5);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        var outputFileContents =
            'saved_someone_else_time:\n' +
            '  subject: "asdf"\n';
        y.parseOutputFile(outputFileContents);
        var set = y.getTranslationSet();
        expect(set).toBeTruthy();
        //expect(set.getBySource('d', 'title@do_not_read_me')).toBe(undefined);
        var r = set.getBy({reskey: 'subject', context: 'saved_someone_else_time'});
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe('Someone said a colleague’s answer to your question saved them a lot of time:');
    });

    test("YamlGetLocalizedPathDefault", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test2.yml');
    });

    test("YamlGetLocalizedPathDefault", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p2,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getLocalizedPath('de-DE')).toBe('de/test2.yml');
    });

    test("YamlUseLocalizedDirectoriesFromSchema", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {}
        y.schema['useLocalizedDirectories'] = false;
        expect(y.getUseLocalizedDirectoriesFromSchema()).toBe(false);
    });

    test("YamlUseLocalizedDirectoriesFromSchemaWithoutSchema", function() {
        expect.assertions(3);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getSchema()).toBe(undefined);
        expect(y.getUseLocalizedDirectoriesFromSchema()).toBe(true);
    });

    test("YamlGetLocalizedPathWithLocalizedDirectories", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        y.schema['useLocalizedDirectories'] = true;
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test3.yml');
    });

    test("YamlGetLocalizedPathWithoutLocalizedDirectories", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        y.schema['useLocalizedDirectories'] = false;
        expect(y.getLocalizedPath('de-DE')).toBe('test3.yml');
    });

    test("YamlGetOutputFilenameForLocaleWithoutSchema", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getOutputFilenameForLocale('de-DE')).toBe('test2.yml');
    });

    test("YamlGetOutputFilenameForLocaleWithSchema", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {};
        y.schema['outputFilenameMapping'] = {
            'de-DE': './de.yml'
        }
        expect(y.getOutputFilenameForLocale('de-DE')).toBe('./de.yml');
    });

    test("YamlGetLocalizedPathWithLocalizedDirs", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            useLocalizedDirectories: true
        };
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test2.yml');
    });

    test("YamlGetLocalizedPathWithLocalizedDirsAndOutputFilenameMapping", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            useLocalizedDirectories: true,
            outputFilenameMapping: {
                'de-DE': './de.yml'
            }
        };
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/de.yml');
    });

    test("YamlGetLocalizedPathWithOutputFilenameMappingAndWithoutLocalizedDirectories", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            'outputFilenameMapping': {
                'de-DE': './de.yml'
            },
            'useLocalizedDirectories': false
        };
        expect(y.getLocalizedPath('de-DE')).toBe('./de.yml');
    });

    test("YamlFileGetContentPlural", function() {
        expect.assertions(2);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();

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

        expect(yml.getContent()).toBe(expected);
    });

    test("YamlFileParseWithFlavor", function() {
        expect.assertions(15);

        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft,
            flavor: "CHOCOLATE"
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(2);

        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");

        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
    });

    test("YamlFileParseWithNoFlavor", function() {
        expect.assertions(15);

        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(2);

        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(!r[0].getFlavor()).toBeTruthy();

        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(!r[1].getFlavor()).toBeTruthy();
    });

    test("YamlFileParseTargetWithNoFlavor", function() {
        expect.assertions(17);

        var yml = new YamlFile({
            project: p,
            locale: "es-US",
            type: yft
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(2);

        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("es-US");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(!r[0].getFlavor()).toBeTruthy();

        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("es-US");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(!r[1].getFlavor()).toBeTruthy();
    });

    test("YamlFileParseWithGleanedFlavor", function() {
        expect.assertions(15);

        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft,
            pathName: "customization/en-CHOCOLATE.yml"
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(2);

        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");

        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
    });

    test("YamlFileParseWithNoGleanedFlavor", function() {
        expect.assertions(17);

        var yml = new YamlFile({
            project: p,
            locale: "en-ZA",
            type: yft,
            pathName: "customization/en-ZA.yml"
        });
        expect(yml).toBeTruthy();

        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');

        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getAll();
        expect(r).toBeTruthy();

        expect(r.length).toBe(2);

        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("en-ZA");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(!r[0].getFlavor()).toBeTruthy();

        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("en-ZA");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(!r[1].getFlavor()).toBeTruthy();
    });
});
