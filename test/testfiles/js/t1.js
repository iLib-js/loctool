var fs = require("foobar");

var t1 = function() {
	console.log("If you find this, you found the wrong string!");
}

t1.prototype.tester = function() {
	RB.getString("This is a test");
	
	RB.getString("This is a test with a unique id", "id1");
};
