/*
 * dictdiff.js - tool to generate spelling differences between two dicts
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */
/*
 * This code is intended to be run under node.js
 */
var fs = require('fs');
var util = require('util');
var levenshtein = require('fast-levenshtein');

function usage() {
    console.log("Usage: dictdiff [-h] file1 file2\n" +
        "Find differences in two sorted files and output them.\n\n" +
        "-h or --help\n" +
        "  this help\n" +
        "file1 file2\n" +
        "  Two files to find the diffrences in.\n");
    process.exit(1);
}

process.argv.forEach(function (val, index, array) {
    if (val === "-h" || val === "--help") {
        usage();
    }
});

if (process.argv.length < 4) {
    usage();
}

var file1Name = process.argv[2];
var file2Name = process.argv[3];

if (!fs.existsSync(file1Name)) {
    util.error("Could not access file " + file1Name);
    usage();
}

if (!fs.existsSync(file2Name)) {
    util.error("Could not access file " + file2Name);
    usage();
}

console.log("dictdiff - find differences in two sorted files.\n");
console.log("Comparing:\n");
console.log(file1Name);
console.log(file2Name);

var file1 = fs.readFileSync(file1Name, "utf-8");
if (!file1) {
    util.error("Could not read " + file1Name);
    process.exit(2);
}

var file2 = fs.readFileSync(file2Name, "utf-8");
if (!file2) {
    util.error("Could not read " + file2Name);
    process.exit(2);
}

var lines1 = file1.split('\n');
var lines2 = file2.split('\n');

var debug = false;

var diffs1 = [];
var diffs2 = [];

var index1 = 0,
    index2 = 0,
    start1,
    start2,
    temp1 = [],
    temp2 = [];

function sync() {
    var ch;
    
    if (debug) console.log("Syncing...");
    if (diffs1.length) {
        ch = '<';
        
        for (var i = 0; i < diffs1.length; i++) {
            console.log(ch + diffs1[i] + "=" + diffs1[i]);
        }
    }
    
    if (diffs2.length) {
        ch = '>';
        
	    for (var i = 0; i < diffs2.length; i++) {
	        console.log(ch + diffs2[i]);
	    }
	}
    
    diffs1 = [];
    diffs2 = [];
}

function levenshteinSum(array1, index1, array2, index2, length) {
	var sum = 0;
	
	for (var i = 0; i < length; i++) {
		var left = array1[index1+i];
		var right = array2[index2+i]
		sum += levenshtein.get(left, right);
		
		// mostly the last letter should be the same
		if (left[left.length-1] !== right[right.length-1]) {
			sum++;
		}
	}
	
	return sum;
}

function findClosestMatch(array1, array2) {
	var source, target;
	
	if (!array1.length || !array2.length) {
		return -1;
	}
	
	if (array1.length > array2.length) {
		source = array2;
		target = array1;
	} else {
		source = array1;
		target = array2;
	}
	
	var len = target.length - source.length;
	var matches = [];
	for (var i = len; i > -1; i--) {
		if (debug) console.log("starting at " + i);
		matches[i] = levenshteinSum(source, 0, target, i, source.length);
		if (debug) console.log("the lev sum is " + matches[i]);
	}
	
	if (debug) console.log("Matches are: " + JSON.stringify(matches));
	var min = matches.length-1;
	for (i = 0; i < matches.length-1; i++) {
		if (matches[min] > matches[i]) {
			min = i;
		}
	}
	
	if (min > -1 && matches[min] >= 3 * source.length) {
		// no good match
		return -1;
	}
	
	// reasonable match
	return min;
}

/*
console.log("findClosestMatch tests");
var a1 = [ "abc", "abd", "abgge", "abn", "ade", "back", "bored"];
var a2 = [ "abgeg", "abne", "aid"];

console.log("closest match is: " + findClosestMatch(a1, a2));
process.exit(0);
*/

var match, source, target;

while (index1 < lines1.length && index2 < lines2.length) {
    if (lines1[index1] === lines2[index2]) {
    	if (debug) {
    		console.log("skipping " + lines1[index1] + " = " + lines2[index2]);
    	}
        index1++;
        index2++;
    } else {
        start1 = index1;
        start2 = index2;
        
        if (lines1[index1] < lines2[index2]) {
            while (lines1[index1] < lines2[index2]) {
                temp1.push(lines1[index1]);
                index1++;
            }
        
            if (lines1[index1] > lines2[index2]) {
            	if (debug) {
            		console.log("getting other side of diff");
            		console.log("temp1 is " + JSON.stringify(temp1));
            	}
                while (lines1[index1] > lines2[index2]) {
                    temp2.push(lines2[index2]);
                    index2++;
                }
            }
        } else {
            while (lines1[index1] > lines2[index2]) {
                temp2.push(lines2[index2]);
                index2++;
            }
            
            if (lines1[index1] < lines2[index2]) {
            	if (debug) {
            		console.log("getting other side of diff");
            		console.log("temp2 is " + JSON.stringify(temp2));
            	}
            	while (lines1[index1] < lines2[index2]) {
                    temp1.push(lines1[index1]);
                    index1++;
                }
            }
        }

        if (temp1.length && temp2.length) {
        	if (debug) {
        		console.log("Found temp1: " + JSON.stringify(temp1));
        		console.log("Found temp2: " + JSON.stringify(temp2));
        	}
	        match = findClosestMatch(temp1, temp2)
	
	        if (match > -1) {
	        	if (match === 0) {
	        		for (var i = 0; i < temp1.length; i++) {
	        			console.log(temp1[i] + "=" + temp2[i]);
	        		}
	        		temp1 = [];
	        		temp2 = [];
	        	} else {
	        		if (temp1.length < temp2.length) {
	        			for (var i = 0; i < temp1.length; i++) {
	        				console.log(temp1[i] + "=" + temp2[match+i]);
	        			}
	        			temp2.splice(match, temp1.length);
	        			temp1 = [];
	        		} else {
	        			for (var i = 0; i < temp2.length; i++) {
	        				console.log(temp1[match+i] + "=" + temp2[i]);
	        			}
	        			temp1.splice(match, temp2.length);
	        			temp2 = [];
	        		}
	        	}
	        } else {
	        	if (debug) console.log("No match");
	        }
        }
        
    	// see if there is a match
    	if (diffs1.length && temp2.length) {
    		if (debug) {
        		console.log("Comparing")
        		console.log("  diffs1 is " + JSON.stringify(diffs1));
        		console.log("  and temp2 is " + JSON.stringify(temp2));
        	}
        	var match = findClosestMatch(temp2, diffs1);
    		if (match > -1) {
                for (var i = 0; i < temp2.length; i++) {
                    console.log(diffs1[match+i] + "=" + temp2[i]);
                }
                
                diffs1.splice(match, temp2.length);
                temp2 = [];
    		}
    	}

    	// see if there is a match
    	if (diffs2.length && temp1.length) {
    		if (debug) {
            	console.log("Comparing")
            	console.log("  diffs2 is " + JSON.stringify(diffs2));
            	console.log("  and temp1 is " + JSON.stringify(temp1));
        	}
           	var match = findClosestMatch(temp1, diffs2);
    		if (match > -1) {
                for (var i = 0; i < temp1.length; i++) {
                    console.log(temp1[i] + "=" + diffs2[match+i]);
                }
                
                diffs2.splice(match, temp1.length);
                temp1 = [];
    		}
    	}

        diffs1 = diffs1.concat(temp1);
        diffs2 = diffs2.concat(temp2);

        temp1 = [];
        temp2 = [];

        /*
        if (diffs1.length && diffs2.length) {
        	if (diffs1.length === diffs2.length) {
		    	console.log("same size leftovers on both sides... comparing.");
		    	match = findClosestMatch(diffs1, diffs2);
		    	
		    	if (match > -1) {
		    		for (var i = 0; i < diffs1.length; i++) {
		                console.log(diffs1[i] + "=" + diffs2[i]);
		            }
		            
		            diffs1 = []
		            diffs2 = [];
		    	}
        	} else {
        		var source, target;
        		
        		console.log("leftovers on both sides... comparing.");
        		if (diffs1.length > diffs2.length) {
        			source = diffs2;
        			target = diffs1;
        		} else {
        			source = diffs1;
        			target = diffs2;
        		}
        		
        		match = findClosestMatch(source, target);
		    	
        		if (match > -1) {
                    for (var i = 0; i < source.length; i++) {
                        console.log(source[i] + "=" + target[match+i]);
                    }
                    
                    target.splice(match, source.length);
                    source.splice(0,source.length);
        		}
        	}
        }
        */
        
        if (debug) {
	        console.log("End of loop");
	    	console.log("diffs1 is " + JSON.stringify(diffs1));
	    	console.log("diffs2 is " + JSON.stringify(diffs2));
        }
    }
}

sync();