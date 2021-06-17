/*
 * genPluralCategories.js - generate the list of plural categories
 * per locale
 *
 * Copyright © 2021, JEDLSoft
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

console.log("Generating pluralCategories.json ...");
var fs = require("fs");

var plurals = require("cldr-core/supplemental/plurals.json").supplemental["plurals-type-cardinal"];

var categories = {};

var languages = Object.keys(plurals);
languages.sort();

for (var i = 0; i < languages.length; i++ ) {
    var language = languages[i];
    var rules = Object.keys(plurals[language]);
    categories[language] = rules.map(function(rule) {
        // pluralRule-count-X -> X
        return rule.substring(17);
    });
}

fs.writeFileSync("./db/pluralCategories.json", JSON.stringify(categories, undefined, 4), "utf-8");

console.log("Done.");