/*
 * Set.js - generic set class
 *
 * Copyright © 2016-2017, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @class A general set object.
 *
 * @constructor
 * @param {Array.<Object>|undefined} initialItems The initial items
 * to add to the set
 */
var Set = function Set(initialItems) {
    this.hash = {};
    if (initialItems) {
        for (var i = 0; i < initialItems.length; i++) {
            this.hash[initialItems[i]] = true;
        }
    }
};

/**
 * Return true if the set contains the given item.
 *
 * @param {Object} item the item to check for
 * @return {boolean} true if the item is in this
 * set, and false otherwise
 */
Set.prototype.contains = function(item) {
    return typeof(item) !== "undefined" && this.hash[item] || false;
};

/**
 * Add the item to the set. If the item already
 * exists in the set, it is not re-added.
 *
 * @param {Object} item the item to add
 */
Set.prototype.add = function(item) {
    if (typeof(item) === "undefined") {
        return;
    };
    this.hash[item] = true;
};

/**
 * Add all of the items in the given other
 * set to this set.
 *
 * @param {Set} otherSet another set, the
 * contents of which should all be added to
 * the current set
 */
Set.prototype.addAll = function(otherSet) {
    var items = otherSet.asArray();

    if (items) {
        items.forEach(function(item) {
            this.add(item);
        }.bind(this));
    }
};

/**
 * Remove an item from the set. If the
 * item doesn't exist in this set, nothing
 * happens.
 *
 * @param {Object} item the item to remove
 */
Set.prototype.remove = function(item) {
    delete this.hash[item];
};

/**
 * Return all the items in this set as
 * a Javascript array of items. The order of
 * the items is not defined.
 *
 * @return {Array.<Object>} all of the items
 * in the current set as a javascript array
 */
Set.prototype.asArray = function() {
    return Object.keys(this.hash);
};

/**
 * Return the number of items currently in this
 * set.
 *
 * @return {number} the number of items in this set
 */
Set.prototype.size = function() {
    return Object.keys(this.hash).length;
};

module.exports = Set;
