/*
 * Share translations amongst data types and projects...
 */

var fs = require("fs");
var log4js = require("log4js");
var path = require("path");

var Xliff = require("../lib/Xliff.js");
var TranslationUnit = Xliff.TranslationUnit;
log4js.configure("./log4js.json");

console.log("Reading all xliffs...");

var web = new Xliff({pathName: "./current/ht-webapp12.xliff"});
web.deserialize(fs.readFileSync("./current/ht-webapp12.xliff", "utf-8"));
var android = new Xliff({pathName: "./current/ht-androidapp.xliff"});
android.deserialize(fs.readFileSync("./current/ht-androidapp.xliff", "utf-8"));
var ios = new Xliff({pathName: "./current/ht-iosapp.xliff"});
ios.deserialize(fs.readFileSync("./current/ht-iosapp.xliff", "utf-8"));
var feelgood = new Xliff({pathName: "./current/feelgood-video-chats_lib.xliff"});
feelgood.deserialize(fs.readFileSync("./current/feelgood-video-chats_lib.xliff", "utf-8"));

console.log("Organizing the translation units");

var webunits = web.getTranslationUnits();
var androidunits = android.getTranslationUnits();
var iosunits = ios.getTranslationUnits();
var feelgoodunits = feelgood.getTranslationUnits();

var units = {
	bySource: {},
	bySourceLower: {},
	byKey: {}
};

function clean(string) {
	return string.replace(/\s+/g, "").trim();
}

function addUnits(unit) {
	if (!units.byKey[unit.targetLocale]) {
		units.byKey[unit.targetLocale] = {};
	}
	if (!units.bySource[unit.targetLocale]) {
		units.bySource[unit.targetLocale] = {};
	}
	if (!units.bySourceLower[unit.targetLocale]) {
		units.bySourceLower[unit.targetLocale] = {};
	}
	
	units.bySource[unit.targetLocale][unit.source] = unit;
	units.bySourceLower[unit.targetLocale][unit.source.toLowerCase()] = unit;
	
	// for the data types that use hashes, when the key
	// is the same, then the string is the same
	switch (unit.datatype) {
	case "ruby":
	case "java":
	case "x-haml":
	case "x-android-resource":
		units.byKey[unit.targetLocale][unit.key] = unit;
		break;
		
	default:
		break;
	}
}

webunits.forEach(addUnits);
androidunits.forEach(addUnits);
iosunits.forEach(addUnits);
feelgoodunits.forEach(addUnits);

// signal to the GC that these can be dropped
web = android = ios = feelgood = undefined;

["ht-androidapp", "feelgood-video-chats_lib", "ht-iosapp", "ht-webapp12"].forEach(function(project) {
	console.log("Reading the new strings for project " + project);
	["es-US", "zh-Hans-CN"].forEach(function(locale) {
		console.log("Reading the new strings for locale " + locale);
		var newFileName = "./" + project + "-new-" + locale + ".xliff";
		
		if (fs.existsSync(newFileName)) {
			var newXliff = new Xliff({pathName: newFileName});
			newXliff.deserialize(fs.readFileSync(newFileName, "utf-8"));
			
			var untranslated = new Xliff({pathName: "./shared/" + project + "-untranslated-" + locale + ".xliff"});
			var shared = new Xliff({pathName: "./shared/" + project + "-" + locale + ".xliff"});
				
			newunits = newXliff.getTranslationUnits();
			
			console.log("Sharing translations ...");
					
			newunits.forEach(function(unit) {
				var found;
			
				if (units.bySource[locale][unit.source]) {
					found = units.bySource[locale][unit.source];
				} else if (unit.datatype === "ruby" || unit.datatype === "x-haml" || unit.datatype === "java" || unit.datatype === "x-android-resource") {
					if (units.byKey[locale][unit.key]) {
						found = units.byKey[locale][unit.key];
					} else if (units.bySource[locale][unit.source.trim()]) {
						found = units.bySource[locale][unit.source.trim()];
					} else if (locale === "zh-Hans-CN" && units.bySourceLower[locale][unit.source.toLowerCase()]) {
						// since Chinese is not case-sensitive, we can search case insensitively in the English
						// and get the right match in Chinese
						found = units.bySourceLower[locale][unit.source.toLowerCase()];
					}
				}
				
				if (found) {
					if (found.key !== unit.key || found.datatype !== unit.datatype || found.context !== unit.context ||
							found.project !== unit.project || found.resType !== unit.resType || found.pathName !== unit.pathName ||
							found.ordinal !== unit.ordinal || found.quantity !== unit.quantity) {
						var newunit = unit.clone();
						newunit.target = found.target;
						newunit.targetLocale = locale;
						newunit.state = "translated";
						shared.addTranslationUnit(newunit);
						console.log("Found a shared translation.\nSource: '" + newunit.source + "'\nTranslation: '" + newunit.target + "'\n");
					} else {
						console.log("Found a new string that has an exact translation... (loctool bug?)");
						console.log("Found: " + JSON.stringify(found));
						console.log("New: " + JSON.stringify(unit));
					}
				} else {
					console.log("Found untranslated string.");
					untranslated.addTranslationUnit(unit);
				}
			});
			
			console.log("Writing " + project + " " + locale + " results");
			
			fs.writeFileSync("./shared/" + project + "-untranslated-" + locale + ".xliff", untranslated.serialize(), "utf-8");
			fs.writeFileSync("./shared/" + project + "-" + locale + ".xliff", shared.serialize(), "utf-8");
			
			// signal to the GC to drop this memory
			newunits = newXliff = undefined;
		} else {
			console.log("File " + newFileName + " does not exist. Skipping...");
		}
	}.bind(this));
}.bind(this));

/*

function shareTrans(unit, locale) {
	var found = false;
	for (var project in units[locale]) {
		for (var contextName in units[locale][project]) {
			var context = units[locale][project][contextName];
			if (context && context[unit.source]) {
				var other = context[unit.source];
				var newunit = unit.clone();
				newunit.target = other.target;
				newunit.targetLocale = other.targetLocale;
				shared.addTranslationUnit(newunit);
				found = true;
				console.log("Found a shared translation.\nSource: '" + newunit.source + "'\nTranslation: '" + newunit.target + "'\n");
				break;
			}
		}
	}
	if (!found) {
		if (unit.target) {
			console.log("oh oh!");
		}
		console.log("Found untranslated string.");
		untranslated.addTranslationUnit(unit);
	}
}

console.log("Reading ht-webapp12 new file ...");

var androidnew = new Xliff({pathName: "./ht-webapp12-new.xliff"});
androidnew.deserialize(fs.readFileSync("./ht-webapp12-new.xliff", "utf-8"));

var untranslated = new Xliff({pathName: "./shared/ht-webapp12-untranslated.xliff"});
var shared = new Xliff({pathName: "./shared/ht-webapp12.xliff"});

androidunits = androidnew.getTranslationUnits();
androidunits.forEach(shareTrans);

console.log("Writing ht-webapp12 results");

fs.writeFileSync("./shared/ht-androidapp-untranslated.xliff", untranslated.serialize(), "utf-8");
fs.writeFileSync("./shared/ht-androidapp.xliff", shared.serialize(), "utf-8");

//signal to the GC to drop this memory
androidunits = androidnew = undefined;

console.log("Reading feelgood lib new file ...");

var androidnew = new Xliff({pathName: "./feelgood-video-chats_lib-new.xliff"});
androidnew.deserialize(fs.readFileSync("./feelgood-video-chats_lib-new.xliff", "utf-8"));

var untranslated = new Xliff({pathName: "./shared/feelgood-video-chats_lib-untranslated.xliff"});
var shared = new Xliff({pathName: "./shared/feelgood-video-chats_lib.xliff"});

androidunits = androidnew.getTranslationUnits();
androidunits.forEach(shareTrans);

console.log("Writing feelgood-video-chats_lib results");

fs.writeFileSync("./shared/feelgood-video-chats_lib-untranslated.xliff", untranslated.serialize(), "utf-8");
fs.writeFileSync("./shared/feelgood-video-chats_lib.xliff", shared.serialize(), "utf-8");

//signal to the GC to drop this memory
androidunits = androidnew = undefined;

console.log("Reading ht-iosapp new file ...");

var iosnew = new Xliff({pathName: "./ht-iosapp-new.xliff"});
iosnew.deserialize(fs.readFileSync("./ht-iosapp-new.xliff", "utf-8"));

var untranslated = new Xliff({pathName: "./shared/ht-iosapp-untranslated.xliff"});
var shared = new Xliff({pathName: "./shared/ht-iosapp.xliff"});

iosunits = iosnew.getTranslationUnits();
iosunits.forEach(shareTrans);

console.log("Writing ht-iosapp results");

fs.writeFileSync("./shared/ht-iosapp-untranslated.xliff", untranslated.serialize(), "utf-8");
fs.writeFileSync("./shared/ht-iosapp.xliff", shared.serialize(), "utf-8");
*/

console.log("Done.");
