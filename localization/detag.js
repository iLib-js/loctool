var fs = require("fs");
var log4js = require("log4js");
var path = require("path");

var Xliff = require("../lib/Xliff.js");
var TranslationUnit = Xliff.TranslationUnit;
var TranslationSet = require("../lib/TranslationSet.js");

log4js.configure(path.dirname(module.filename) + '/../log4js.json');

if (process.argv.length < 2) {
	console.log("Usage: detag.js filename");
	System.exit(2);
}

var xliff = new Xliff({pathName: process.argv[2]});
xliff.deserialize(fs.readFileSync(process.argv[2], "utf-8"));

var result = new Xliff({pathName: process.argv[2]});

var unit, units = xliff.getTranslationUnits();

console.log("Processing translation units ...");

var endingTag = /\s*<%=([^%]|%>)*?%>\s*$/;

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < units.length; i++) {
	unit = units[i];
	
	if (unit.datatype === "html") {
		while (endingTag.test(unit.source) && endingTag.test(unit.target)) {
			unit.source = unit.source.replace(endingTag, "");
			unit.target = unit.target.replace(endingTag, "");
			unit.key = unit.source;
		}
		
 		if (unit.source) unit.source = unit.source.trim();
 		if (unit.target) unit.target = unit.target.trim();
 	}
 	
 	if (!unit.source || !unit.target) {
 		console.log("Skipping unit with no source or target... " + unit.key);
 		units.splice(i, 1);
 		i--; // go back and check the i'th unit again now that it is a different one
	}
}

console.log("Writing results");

fs.writeFileSync(process.argv[2]+"-new", xliff.serialize(), "utf-8");

console.log("Done.");
