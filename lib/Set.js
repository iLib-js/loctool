/*
 * Set.js - generic set class
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var Set = function Set(initialItems) {
	this.hash = {};
	if (initialItems) {
		for (var i = 0; i < initialItems.length; i++) {
			this.hash[initialItems[i]] = true;
		}
	}
};

Set.prototype.contains = function(item) {
	return this.hash[item] || false;
};

Set.prototype.add = function(item) {
	this.hash[item] = true;
};

Set.prototype.addAll = function(otherSet) {
	var items = otherSet.asArray();
	
	if (items) {
		items.forEach(function(item) {
			this.add(item);
		}.bind(this));
	}
};

Set.prototype.remove = function(item) {
	this.hash[item] = undefined;
};

Set.prototype.asArray = function() {
	return Object.keys(this.hash);
};

module.exports = Set;