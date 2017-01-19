var fs = require("fs");
var log4js = require("log4js");
var path = require("path");

var Xliff = require("../lib/Xliff.js");
var TranslationUnit = Xliff.TranslationUnit;
var TranslationSet = require("../lib/TranslationSet.js");
var utils = require("../lib/utils.js");

var RubyFile = require("../lib/RubyFile.js");
var JavaFile = require("../lib/JavaFile.js");

log4js.configure(path.join(path.dirname(module.filename), '..', 'log4js.json'));

if (process.argv.length < 2) {
	console.log("Usage: hamlfix.js filename");
	System.exit(2);
}

var xliff = new Xliff({pathName: process.argv[2]});
xliff.deserialize(fs.readFileSync(process.argv[2], "utf-8"));

var result = new Xliff({pathName: process.argv[2]});

var unit, units = xliff.getTranslationUnits();
var rf = new RubyFile();
var jf = new JavaFile();

console.log("Processing translation units ...");

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < units.length; i++) {
	unit = units[i];
	
	if (unit.datatype === "x-haml" || unit.datatype === "ruby") {
		var hash = rf.makeHash(unit.source);
		unit.source = unit.source.trim();
		unit.target = unit.target.trim();
		
		console.log("original: " + unit.source);
		if ( unit.key !== hash ) {
			console.log("File: " + unit.file + " key: " + unit.key + " -> " + hash);
		}
		unit.key = hash;
	} else if (unit.datatype === "java") {
		var hash = jf.makeHash(unit.source);
		unit.source = unit.source.trim();
		unit.target = unit.target.trim();
		
		console.log("original: " + unit.source);
		if ( unit.key !== hash ) {
			console.log("File: " + unit.file + " key: " + unit.key + " -> " + hash);
		}
		unit.key = hash;
	}
}

console.log("Writing results");

fs.writeFileSync(process.argv[2]+"-new", xliff.serialize(), "utf-8");

console.log("Done.");
