/*
 * testPseudoDebug.js - test the debug pseudo translation
 *
 * Copyright © 2021, 2023 JEDLSoft.
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
    var WebProject = require("../lib/WebProject.js");
    var TranslationSet = require("../lib/TranslationSet.js");
    var ResourceString = require("../lib/ResourceString.js");
}

var project = new WebProject({
    sourceLocale: "en-US",
    pseudoLocale: {
        "es-US": "debug"
    },
    resourceDirs: {
        "yml": "config/locales"
    }
}, "./testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});

module.exports.pseudodebug = {
    testPseudoDebugSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        test.equal(pb.getString("I am a Blues Traveler"), "[Ï àm à ßľüëš Ťŕàvëľëŕ6543210]");

        test.done();
    },

    testPseudoDebugAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        test.equal(pb.getString("GLOBALIZATION"), "[ĜĽØßÃĽÏŻÃŤÏØŇ6543210]");

        test.done();
    },


    testPseudoDebugSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "java"
        });
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."),
            "[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]");

        test.done();
    },

    testPseudoDebugSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "javascript"
        });
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."),
            "[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]");

        test.done();
    },

    testPseudoDebugSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "html"
        });
        test.equal(pb.getString("Skip the unflavored <span name=\"estrogen\">supplements</a>."),
            '[Šķíþ ţĥë üñfľàvõŕëð <span name="estrogen">šüþþľëmëñţš</a>.109876543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "xml"
        });
        test.equal(pb.getString("Skip the unflavored <source id=\"estrogen\">supplements</source>."),
            '[Šķíþ ţĥë üñfľàvõŕëð <source id="estrogen">šüþþľëmëñţš</source>.2109876543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsMarkdown: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "markdown"
        });
        test.equal(pb.getString("Skip the unflavored <c0>supplements</c0>."), '[Šķíþ ţĥë üñfľàvõŕëð <c0>šüþþľëmëñţš</c0>.76543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "template"
        });
        test.equal(
            pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements."),
            '[Šķíþ ţĥë üñfľàvõŕëð <%= (i > 4) ? RB.getString("estrogen") : RB.getString(\"%\") %> šüþþľëmëñţš.8765432109876543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "ruby"
        });
        test.equal(pb.getString("Skip the unflavored %{estrogen} #{estrogen} supplements."),
            '[Šķíþ ţĥë üñfľàvõŕëð %{estrogen} #{estrogen} šüþþľëmëñţš.09876543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        test.equal(pb.getString("Skip the unflavored {estrogen} supplements."),
            '[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]');

        test.done();
    },

    testPseudoDebugSkipReplacementsYaml: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "ruby"
        });
        test.equal(pb.getString("Skip the unflavored %ESTROGEN% supplements."),
            '[Šķíþ ţĥë üñfľàvõŕëð %ESTROGEN% šüþþľëmëñţš.876543210]');

        test.done();
    },
};