var utils = require("./lib/utils.js");
var args = process.argv;

for (var i = 2; i < args.length; i++) {
	console.log(utils.hashKey(args[i]) + ": " + args[i]);
}