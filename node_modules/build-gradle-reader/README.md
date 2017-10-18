# build-gradle-reader

<meta charset="UTF-8">

build-gradle-reader synchronously parses the text of build.gradle file into a js object. This is based on the
gradle-to-js project by Karl Lindmark, but adds the ability to read files synchronously.

Installation
====

To install, simply get it from npm:

~~~~~
npm install build-gradle-reader
~~~~~

or from github:

~~~~~
git clone git@github.com:ehoogerbeets/build-gradle-reader.git
~~~~~

How to Use Conjugator From the Command-line
====


~~~~~
> build-gradle-reader test/sample-data/small.build.gradle
{
  "testblock": {
    "key1": "value1",
    "key2": "value2",
    "nestedKey": {
      "key3": "value3",
      "key4": "value4",
      "key5": {
        "key6": "value6"
      }
    }
  },
  "testblock2": {
    "key1": "value1",
    "key2": "value2"
  },
  "testblock3": "not really"
}
>
~~~~~

The output is pretty-printed json. 

Using build-gradle-reader From Code
====

You can use conjugator in your own code and retrieve the same json object that is pretty-printed on the screen
when you use the command-line interface. Example:

~~~~
var fs = require('fs');
var bgr = require('build-gradle-reader');

var data = fs.readfileSync("test/sample-data/small.build.gradle");

var representation = bgr(data);
~~~~

Development
====

New PRs are welcome! 

Author
=====

Edwin Hoogerbeets, based on gradle-to-js by Karl Lindmark

Copyright and License
====

Copyright &copy; 2017, HealthTap, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

