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