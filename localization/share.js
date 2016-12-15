/*
 * Share translations amongst data types and projects...
 */

var fs = require("fs");

var Xliff = require("../lib/Xliff.js");
var TranslationUnit = Xliff.TranslationUnit;

var IosLayoutResourceString = require("../lib/IosLayoutResourceString.js");
var AndroidResourceString = require("../lib/AndroidResourceString.js");

var ResourceString = require("../lib/ResourceString.js");
var TranslationSet = require("../lib/TranslationSet.js");
var ResourceFactory = require("../lib/ResourceFactory.js");

var WebProject = require("../lib/WebProject.js");
var AndroidProject = require("../lib/AndroidProject.js");
var ObjectiveCProject = require("../lib/ObjectiveCProject.js");

console.log("Reading all xliffs...");
var web = new Xliff({pathName: "./current/ht-webapp12.xliff"});
web.deserialize(fs.readFileSync("./current/ht-webapp12.xliff", "utf-8"));
var android = new Xliff({pathName: "./current/ht-androidapp.xliff"});
android.deserialize(fs.readFileSync("./current/ht-androidapp.xliff", "utf-8"));
var ios = new Xliff({pathName: "./current/ht-iosapp.xliff"});
ios.deserialize(fs.readFileSync("./current/ht-iosapp.xliff", "utf-8"));

console.log("Organizing the translation units");

var webunits = web.getTranslationUnits();
var androidunits = android.getTranslationUnits();
var iosunits = ios.getTranslationUnits();

var units = {};

function addUnits(unit) {
	if (!units[unit.targetLocale]) {
		units[unit.targetLocale] = {};
	}
	if (!units[unit.targetLocale][unit.project]) {
		units[unit.targetLocale][unit.project] = {};
	}
	if (!units[unit.targetLocale][unit.project][unit.context || "default"]) {
		units[unit.targetLocale][unit.project][unit.context || "default"] = {};
	}
	
	units[unit.targetLocale][unit.project][unit.context || "default"][unit.source] = unit;
}

webunits.forEach(addUnits);
androidunits.forEach(addUnits);
iosunits.forEach(addUnits);

// signal to the GC that these can be dropped
web = android = ios = undefined;

console.log("Reading the webapp new xliff file ... ");

var webnew = new Xliff({pathName: "./ht-webapp12-new.xliff"});
webnew.deserialize(fs.readFileSync("./ht-webapp12-new.xliff", "utf-8"));

var untranslated = new Xliff({pathName: "./shared/ht-webapp12-untranslated.xliff"});
var shared = new Xliff({pathName: "./shared/ht-webapp12.xliff"});

/*
	"ht-iosapp": new Xliff({pathName: "./shared/ht-iosapp-untranslated.xliff"}),
	"ht-androidapp": new Xliff({pathName: "./shared/ht-androidapp-untranslated.xliff"})
};
	"ht-iosapp": new Xliff({pathName: "./shared/ht-iosapp.xliff"}),
	"ht-androidapp": new Xliff({pathName: "./shared/ht-androidapp.xliff"})
};
*/

webunits = webnew.getTranslationUnits();

console.log("Sharing translations ...");

function shareTrans(unit) {
	["es-US", "zh-Hans-CN"].forEach(function(locale) {
		var found = false;
		for (var project in units[locale]) {
			for (var contextName in units[locale][project]) {
				var context = units[locale][project][contextName];
				if (context && context[unit.source]) {
					var other = context[unit.source];
					unit.target = other.target;
					unit.targetLocale = other.targetLocale;
					shared.addTranslationUnit(unit);
					found = true;
					console.log("Found a shared translation.\nSource: '" + unit.source + "'\nTranslation: '" + unit.target + "'\n");
					break;
				}
			}
		}
		if (!found) {
			untranslated.addTranslationUnit(unit);
		}
	});
}

webunits.forEach(shareTrans);

console.log("Writing ht-webapp12 results");

fs.writeFileSync("./shared/ht-androidapp-untranslated.xliff", untranslated.serialize(), "utf-8");
fs.writeFileSync("./shared/ht-androidapp.xliff", shared.serialize(), "utf-8");

// signal to the GC to drop this memory
webunits = webnew = undefined;

console.log("Reading ht-androidapp new file ...");

var androidnew = new Xliff({pathName: "./ht-androidapp-new.xliff"});
androidnew.deserialize(fs.readFileSync("./ht-androidapp-new.xliff", "utf-8"));

var untranslated = new Xliff({pathName: "./shared/ht-androidapp-untranslated.xliff"});
var shared = new Xliff({pathName: "./shared/ht-androidapp.xliff"});

androidunits = androidnew.getTranslationUnits();
androidunits.forEach(shareTrans);

console.log("Writing ht-androidapp results");

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

console.log("Done.");

/*
var unit, units = web.getTranslationUnits();

console.log("Processing translation units ...");

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < units.length; i++) {
	unit = units[i];
	
	if (unit.file.length > 10 && unit.file.substring(unit.file.length - 10) === ".html.haml") {
		console.log("adding datatype haml tu in path " + unit.file);
		unit.datatype = "javascript";
	} else if (unit.file.length > 10 && unit.file.substring(unit.file.length - 10) === ".tmpl.html") {
		console.log("adding datatype to template tu in path " + unit.file);
		unit.datatype = "html";
	} else if (unit.file.length > 3 && unit.file.substring(unit.file.length - 3) === ".rb") {
		console.log("adding datatype to ruby tu in path " + unit.file);
		unit.datatype = "ruby";
	} else if (unit.file.length > 3 && unit.file.substring(unit.file.length - 3) === ".js") {
		console.log("adding datatype to js tu in path " + unit.file);
		unit.datatype = "javascript";
	}

}

console.log("Writing results");

fs.writeFileSync("./localization/lockit1/postprocessed/es/ht-webapp12-fixed.xliff", web.serialize(), "utf-8");

console.log("Done.");

/*
var ios = new Xliff({pathName: "./localization/current/ht-iosapp.xliff"});
ios.deserialize(fs.readFileSync("./localization/current/ht-iosapp.xliff", "utf-8"));

var result = new Xliff({pathName: "./localization/current/ht-iosapp-fixed.xliff"});

var units = ios.getTranslationUnits();

console.log("Processing translation units ...");

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < units.length; i++) {
	unit = units[i];
	
	if (unit.file.substring(0, 7) !== "Airship") {
		result.addTranslationUnit(unit);
	}
}

console.log("Writing results");

fs.writeFileSync("./localization/current/ht-iosapp-fixed.xliff", result.serialize(), "utf-8");

console.log("Done.");
*/

/*
var ios = new Xliff({pathName: "./localization/current/ht-iosapp.xliff"});
ios.deserialize(fs.readFileSync("./localization/current/ht-iosapp.xliff", "utf-8"));

var iosnew = new Xliff({pathName: "./localization/current/ht-iosapp-new.xliff"});
iosnew.deserialize(fs.readFileSync("./localization/current/ht-iosapp-new.xliff", "utf-8"));

// var set = ios.getTranslationSet();
// var resource, resources = set.getAll();

var units = ios.getTranslationUnits();

var locales = ["es-US", "zh-Hans-CN"];

console.log("Processing translation units ...");
var oldset = new TranslationSet("en-US");

for (var i = 0; i < units.length; i++) {
	unit = units[i];
	
	if (unit.resType === "string" && unit.target) {
		oldset.add(new ResourceString({
			project: unit.project,
			locale: unit.targetLocale,
			reskey: unit.key,
			text: unit.target
		}));
	}
}

set = iosnew.getTranslationSet();
resources = set.getAll();

// go through all the new strings and re-use old translations from different files
for (var i = 0; i < resources.length; i++) {
	resource = resources[i];
	
	if (resource.resType === "string" && resource.datatype === "x-xib") {
		for (var j = 0; j < locales.length; j++) {
			var r = oldset.get(ResourceString.hashKey(resource.getProject(), locales[j], resource.getKey()));
			if (r) {
				console.log("Adding shared translation for " + resource.reskey + " for locale " + locales[j] + ": " + r.text);
				
				var tu = new TranslationUnit({
					project: resource.getProject(),
					key: resource.getKey(),
					sourceLocale: "en-US",
					source: resource.getSource(),
					targetLocale: locales[j],
					target: r.text,
					file: resource.pathName,
					comment: resource.comment,
					resType: resource.resType,
					state: resource.state,
					datatype: "x-xib"
				});
				
				ios.addTranslationUnit(tu);
			}
		}
	}
}

console.log("Writing results");

fs.writeFileSync("./localization/current/ht-iosapp-fixed.xliff", ios.serialize(), "utf-8");

console.log("Done.");
*/

/*
console.log("Loading ios xliff ...");

var ios = new Xliff({pathName: "./localization/current/ht-iosapp.xliff"});
ios.deserialize(fs.readFileSync("./localization/current/ht-iosapp.xliff", "utf-8"));

var tus = ios.getTranslationUnits();

// var set = ios.getTranslationSet();
// var resource, resources = set.getAll();
var unit;

// var result = new Xliff({pathName: "./localization/current/ht-iosapp-fixed.xliff"});

console.log("Processing translation units ...");

for (var i = 0; i < tus.length; i++) {
	unit = tus[i];
	
	if (unit.file.substring(unit.file.length - 4) === ".xib") {
		console.log("adding datatype to ios layout string tu in path " + unit.file);
		unit.datatype = "x-xib";
	} else if (unit.file.substring(unit.file.length - 2) === ".m") {
		console.log("adding datatype to objective c tu in path " + unit.file);
		unit.datatype = "x-objective-c";
	}
}

console.log("Writing results");

fs.writeFileSync("./localization/current/ht-iosapp-fixed.xliff", ios.serialize(), "utf-8");

console.log("Done.");
*/



/*
console.log("Loading android xliff ...");

var android = new Xliff({pathName: "./localization/current/ht-androidapp.xliff"});
android.deserialize(fs.readFileSync("./localization/current/ht-androidapp.xliff", "utf-8"));

set = android.getTranslationSet();
resources = set.getAll();

result = new Xliff({pathName: "./localization/current/ht-androidapp-fixed.xliff"});

console.log("Processing translation units ...");

for (var i = 0; i < resources.length; i++) {
	resource = resources[i];
	
	if (resource.pathName.substring(resource.pathName.length - 5) === ".java") {
		console.log("converting resource to java string in path " + resource.pathName);
		var newres = new AndroidResourceString(resource);
		newres.datatype = "java";
		newres.resType = "string";
		result.addResource(newres);
	} else {
		result.addResource(resource);
	}
}

console.log("Writing results");

fs.writeFileSync("./localization/current/ht-androidapp-fixed.xliff", result.serialize(), "utf-8");

console.log("Done.");

var dist = new Xliff({pathName: "./localization/lockit1/postprocessed/iossource.xliff"});
dist.deserialize(fs.readFileSync("./localization/lockit1/postprocessed/iossource.xliff", "utf-8"));

var tr_es = new Xliff({pathName: "./localization/lockit1/postprocessed/es/ht-iosapp.xliff"});
tr_es.deserialize(fs.readFileSync("./localization/lockit1/postprocessed/es/ht-iosapp.xliff", "utf-8"));

var tr_zh = new Xliff({pathName: "./localization/lockit1/postprocessed/zh/ht-iosapp.xliff"});
tr_zh.deserialize(fs.readFileSync("./localization/lockit1/postprocessed/zh/ht-iosapp.xliff", "utf-8"));

console.log("Loaded all the xliffs. Getting resources...");

var es = tr_es.getTranslationSet();
var zh = tr_zh.getTranslationSet();

var resources = dist.getResources();

var result = new Xliff({pathName: "./localization/lockit1/postprocessed/ht-iosapp-result.xliff"});

console.log("Merging all the translations...");

resources.forEach(function(res) {
    console.log("resource " + res.getKey());
    
    var translations = es.getBy({
        project: res.getProject(),
        context: res.getContext(),
        reskey: res.getKey(),
        locale: "es-US"
    });
    console.log("getBy returned " + JSON.stringify(translation));
    var translation = translations && translations[0];
    
    if (translation) {
        var t = translation.clone();
        t.pathName = res.pathName;

        console.log("Adding resource " + JSON.stringify(t));
        result.addResource(res); // source string
        result.addResource(t);   // target string
    } else {
        console.log("No translation for " + res.getKey() + " to Spanish");
    }

    translations = zh.getBy({
        project: res.getProject(),
        context: res.getContext(),
        reskey: res.getKey(),
        locale: "zh-Hans-CN"
    });

    translation = translations && translations[0];
    
    if (translation) {
        var t = translation.clone();
        t.pathName = res.pathName;

        result.addResource(res); // source string -- maybe added twice here because of Spanish above, but the two should merge
        result.addResource(t);   // target string
    } else {
        console.log("No translation for " + res.getKey() + " to Chinese");
    }
});

console.log("Writing results");

fs.writeFileSync("./localization/lockit1/postprocessed/ht-iosapp-result.xliff", result.serialize(), "utf-8");

console.log("Done.");
*/