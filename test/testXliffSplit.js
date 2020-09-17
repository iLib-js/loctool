/*
 * testXliffSplit.js - test the split of Xliff object.
 *
 * Copyright © 2020 JEDLSoft
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

if (!Xliff) {
    var Xliff = require("../lib/Xliff.js");
}

if (!XliffSplit) {
    var XliffSplit = require("../lib/XliffSplit.js");
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

module.exports.xliffsplit = {
    testXliffSplitnoParameter: function(test) {
        test.expect(1);

        var target = XliffSplit();
        test.ok(!target);
        test.done();
    },
    testXliffSplit: function(test) {
        test.expect(1);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/merge-en-US.xliff",
        ];
        var target = XliffSplit(settings);
        test.ok(target);
        test.done();

    },
    testXliffSplitdistritue: function(test) {
        test.expect(1);

        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "testfiles/xliff20/en-US.xliff",
        ];
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset);

        test.ok(result);
        test.done();

    }
};