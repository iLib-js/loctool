var fs = require("fs");
var path = require("path");
var YAML = require("js-yaml");
var ilib = require("ilib");
var ResBundle = require("ilib/lib/ResBundle");

var yml = fs.readFileSync("./config/locales/en.yml", "utf8");
var resources = YAML.load(yml);

// console.log("Resources are:");
// console.log(JSON.stringify(resources, undefined, 4));

var totalWords = 0;

var rb = new ResBundle({locale: "zxx-XX", lengthen: true});

function walk(obj) {
	if (typeof(obj) === "string") {
		totalWords += obj.split("\s+").length;
		return rb.getStringJS(obj);
	} else {
		var ret = {};
		for (var p in obj) {
			ret[p] = walk(obj[p]);
		}
		return ret;
	}
}

var newres = walk(resources);

var newyml = YAML.dump(newres);

console.log("newyml is:");
console.log(newyml);

console.log("Total words: " + totalWords);
fs.writeFileSync("./config/locales/en_GB.yml", newyml, "utf8");
