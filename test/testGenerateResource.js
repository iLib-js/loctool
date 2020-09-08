/*
 * testGenerateResource.js - test the GenerateResource object.
 *
 * Copyright © 2020, JEDLSoft.
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

var fs = require('fs');
if (!GenerateResource) {
    var GenerateResource = require("../lib/GenerateResource.js");
}
if (!ProjectFactory) {
    var ProjectFactory = require("../lib/ProjectFactory.js");
}

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

module.exports.genresource = {
    testGenerateResourceConstructor: function(test) {
        test.expect(1);

        var genres = new GenerateResource();
        test.ok(genres);
        test.done();
    },
    testGenerateResourceDefault: function(test) {
        test.expect(4);

        var genres = new GenerateResource();
        test.ok(genres);
        test.equal(genres.getXliffsDir(), ".");
        test.equal(genres.getResRoot(), "resources");
        test.equal(genres.getResName(), "strings.json");
        test.done();
    },
    testGenerateResourceWithParams: function(test) {
        test.expect(4);

        var genres = new GenerateResource({
           xliffsDir: "./xliffs",
           resRoot: "output",
           resName: "cstrings.json"
        });
        test.ok(genres);
        test.equal(genres.getXliffsDir(), "./xliffs");
        test.equal(genres.getResRoot(), "output");
        test.equal(genres.getResName(), "cstrings.json");
        test.done();
    },
    testGenerateResourceSetParams: function(test) {
        test.expect(4);

        var genres = new GenerateResource();
        test.ok(genres);
        genres.setXliffsDir("./testfiles");
        genres.setResRoot("dist");
        genres.setResName("resource.json");

        test.equal(genres.getXliffsDir(), "./testfiles");
        test.equal(genres.getResRoot(), "dist");
        test.equal(genres.getResName(), "resource.json");
        test.done();
    }
};