/*
 * hashkey.js - Calculate a hash key for a source string
 *
 * Copyright © 2016-2017, 2019 HealthTap Inc.
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
var utils = require("./lib/utils.js");
var RubyFile = require("./lib/RubyFile.js");
var JavaFile = require("./lib/JavaFile.js");

var rf = new RubyFile();
var jf = new JavaFile();

var args = process.argv;

for (var i = 2; i < args.length; i++) {
    console.log("Java: " + jf.makeKey(args[i]) + ": " + args[i]);
    console.log("Ruby: " + rf.makeKey(args[i]) + ": " + args[i]);
}