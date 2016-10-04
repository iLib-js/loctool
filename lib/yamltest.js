var fs = require("fs");
var path = require("path");
var YAML = require("js-yaml");

var yml = fs.readFileSync("./config/locales/en.yml", "utf8");
var resources = YAML.safeLoad(yml);

console.log("Resources are:");
console.log(JSON.stringify(resources, undefined, 4));