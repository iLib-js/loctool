var fs = require("foobar");

var t1 = function() {
    console.log("If you find this, you found the wrong string!");
}

t1.prototype.tester = function() {
    const x = (<Translate>This is a test</Translate>);

    const y = (<Translate key="id1">This is a test with a unique id</Translate>);
};
