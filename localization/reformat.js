var fs = require("fs");
var log4js = require("log4js");
var path = require("path");

var Xliff = require("../lib/Xliff.js");
var TranslationUnit = Xliff.TranslationUnit;
var TranslationSet = require("../lib/TranslationSet.js");

log4js.configure(path.dirname(module.filename) + '/log4js.json');

if (process.argv.length < 2) {
	console.log("Usage: reformat.js filename");
	System.exit(2);
}

var xliff = new Xliff({pathName: process.argv[2]});
xliff.deserialize(fs.readFileSync(process.argv[2], "utf-8"));

var result = new Xliff({pathName: process.argv[2]});

var unit, units = xliff.getTranslationUnits();

var replacements = {
	"x-xib": [/%($\d)?@/g],
	"x-objective-c": [/%($\d)?@/g],
	"java": [/%[sdfx]/g, /\{[^}]*\}/g],
	"ruby": [/[#%]\{[^}]*\}/g]
};

console.log("Processing translation units ...");

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < units.length; i++) {
	unit = units[i];
        /*
	if ((/-lockit[1456][abc]?.xliff$/.test(process.argv[2]) || /-lockit[78].xliff$/.test(process.argv[2])) && unit.state === "translated") {
		unit.state = undefined;
	}
        */
	if (unit.state === "new") {
		unit.state = "translated";
	}
	
	if (!unit.target || !unit.targetLocale || unit.target === "." || (unit.datatype === "x-android-resource" && unit.source.substring(0,8) === "@string/")) {
	//if (!unit.target || !unit.targetLocale) {
		console.log("Skipping unit with empty target, dot target, or no target... " + unit.key);
		units.splice(i, 1);
		i--; // go back and check the i'th unit again now that it is a different one
	} else if (unit.datatype) {
		unit.target = unit.target.replace(/％\{/g, "%{");
		var re = replacements[unit.datatype];
		var match;
		if (re) {
			re.forEach(function(regexp) {
				while ((match = regexp.exec(unit.source))) {
					if (unit.target.indexOf(match[0]) === -1) {
						console.log("target is missing the replacement parameter:");
						console.log(JSON.stringify(unit));
					}
				}
			});
		}
	} else {
		unit.target = unit.target.replace(/％\{/g, "%{");
	}
}

console.log("Writing results");

fs.writeFileSync(process.argv[2]+"-new", xliff.serialize(), "utf-8");

console.log("Done.");
