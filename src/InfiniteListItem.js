const { stringify } = require('../utils');

/**
 * An item of the InfiniteList class. Created when calling .get(n) on an InfiniteList.
 * Exposed for instanceof utility sake. Not to be called directly.
 * @class InfiniteListItem
 */
class InfiniteListItem {
	/**
	 * Creates an instance of InfiniteListItem.
	 * @param {*} list Parent list, instance of InfiniteList
	 * @param {Number} value Current value
	 * @param {Number} index Current index
	 * @memberof InfiniteListItem
	 */
	constructor(list, value, index) {
		this.__list__ = list;
		this.value = value;
		this.index = index;
		this.next = z => (!z ? this.__list__.get(index + 1) : this.__list__.get(index + z));
		this.previous = z => (!z ? this.__list__.get(index - 1) : this.__list__.get(index - z));
	}
}

// Check if environment supports Symbol
if (typeof Symbol !== 'undefined' && Symbol.iterator) {
	/**
	 * ES6 Symbol.iterator
	 * @returns {Iterable.<InfiniteListItem>}
	 */
	InfiniteListItem.prototype[Symbol.iterator] = () => ({
		next: () => ({
			value: this.__list__.get(index + 1),
			done: false
		})
	});
}

/**
 * toString method for pretty printing InfiniteListItem instance.
 * @returns {String} Decycled and beautified string
 * @memberof InfiniteListItem
 */
InfiniteListItem.prototype.toString = function () {
	return ('InfiniteListItem [ .. ' +
			stringify(this.value) +
			' .. ]');
};

module.exports = InfiniteListItem;