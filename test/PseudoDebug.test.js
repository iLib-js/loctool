/*
 * PseudoDebug.test.js - test the debug pseudo translation
 *
 * Copyright © 2021, 2023 2023 JEDLSoft.
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
}, "./test/testfiles", {
    locales: ["en-GB", "en-NZ", "es-US"]
});
describe("pseudodebug", function() {
    test("PseudoDebugSimpleWord", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        expect(pb.getString("I am a Blues Traveler")).toBe("[Ï àm à ßľüëš Ťŕàvëľëŕ6543210]");
    });
    test("PseudoDebugAllCapitals", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        expect(pb.getString("GLOBALIZATION")).toBe("[ĜĽØßÃĽÏŻÃŤÏØŇ6543210]");
    });
    test("PseudoDebugSkipReplacementsJava", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "java"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe("[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]");
    });
    test("PseudoDebugSkipReplacementsJavascript", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "javascript"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe("[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]");
    });
    test("PseudoDebugSkipReplacementsHTML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "html"
        });
        expect(pb.getString("Skip the unflavored <span name=\"estrogen\">supplements</a>.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð <span name="estrogen">šüþþľëmëñţš</a>.109876543210]');
    });
    test("PseudoDebugSkipReplacementsXML", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "xml"
        });
        expect(pb.getString("Skip the unflavored <source id=\"estrogen\">supplements</source>.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð <source id="estrogen">šüþþľëmëñţš</source>.2109876543210]');
    });
    test("PseudoDebugSkipReplacementsMarkdown", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "markdown"
        });
        expect(pb.getString("Skip the unflavored <c0>supplements</c0>.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð <c0>šüþþľëmëñţš</c0>.76543210]');
    });
    test("PseudoDebugSkipReplacementsTemplate", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "template"
        });
        expect(
            pb.getString("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.")
        ).toBe('[Šķíþ ţĥë üñfľàvõŕëð <%= (i > 4) ? RB.getString("estrogen") : RB.getString(\"%\") %> šüþþľëmëñţš.8765432109876543210]');
    });
    test("PseudoDebugSkipReplacementsRuby", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "ruby"
        });
        expect(pb.getString("Skip the unflavored %{estrogen} #{estrogen} supplements.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð %{estrogen} #{estrogen} šüþþľëmëñţš.09876543210]');
    });
    test("PseudoDebugSkipReplacementsPlaintext", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "text"
        });
        expect(pb.getString("Skip the unflavored {estrogen} supplements.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð {estrogen} šüþþľëmëñţš.876543210]');
    });
    test("PseudoDebugSkipReplacementsYaml", function() {
        expect.assertions(1);
        var pb = PseudoFactory({
            project: project,
            targetLocale: "es-US",
            type: "ruby"
        });
        expect(pb.getString("Skip the unflavored %ESTROGEN% supplements.")).toBe('[Šķíþ ţĥë üñfľàvõŕëð %ESTROGEN% šüþþľëmëñţš.876543210]');
    });
});