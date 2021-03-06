/**
 * ∞
 * Infinity: Create infinitely generating lists in JavaScript.
 * @version 0.2.0
 * @author Muthu Kumar (MKRhere)
 */

// Utils
const { isNonZeroFalsy, stringify, areNumbers } = require('../utils');
const InfiniteListItem = require('./InfiniteListItem');

// Proxy handler
const handler = {
	get: (obj, key) => {
		if(key in obj) return obj[key];
		const index = (
			typeof key === 'string' && /^\d*$/g.test(key)
		) ? parseInt(key) : undefined;
		if(index) return obj['get'](index);
	},
	has: (obj, key) => {
		const index = (
			typeof key === 'string' && /^\d*$/g.test(key)
		) ? parseInt(key) : undefined;
		return (
			(key in obj) ||
			(areNumbers(index) &&
				(index % 1 === 0) &&
				(index >= 0))
		)
	},
	enumerate: obj => Object.keys(obj),
	ownKeys: obj => Object.keys(obj),
};

class InfiniteList {
	/**
	 * InfiniteList Constructor.
	 * Iterates infinitely until index value is found.
	 * Stores cache in closure so when the same index is requested again,
	 * it's returned immediately.
	 * @param {*} start Starting value
	 * @param {Function} next Function to find next item
	 * Accepts current value and optionally previous value
	 * @memberof InfiniteList
	 * @constructs InfiniteList
	 */
	constructor(start, next) {

		/* Private properties */
		this.__start__ = start;
		this.__next__ = next;
		this.__cache__ = [];

		if(typeof Proxy !== 'undefined')
			return new Proxy(this, handler);
	}
}

// Check if Symbol exists
if (typeof Symbol !== 'undefined' && Symbol.iterator) {
	/**
	 * ES6 Symbol.iterator
	 * @returns {Iterable.<InfiniteListItem>}
	 * @memberof InfiniteList
	 */
	InfiniteList.prototype[Symbol.iterator] = function () {
		let j = 0;
		return {
			next: () => ({
				value: this.get(j++),
				done: false
			})
		};
	};
}

/**
 * Get InfiniteListItem at index.
 * @param {Number} index A non-negative integer representing index
 * @returns {InfiniteListItem}
 * @memberof InfiniteList
 */
InfiniteList.prototype.get = function (index) {

	// Validation
	if (
		// i is a non-zero falsy value, or is negative
		(isNonZeroFalsy(index) || index < 0)
		|| !areNumbers(index)
	) return;

	const start = this.__start__;
	const next = this.__next__;
	const cache = this.__cache__;

	//TODO: Cache limiting. (Removed for unexpected behaviour)

	// Initializing first item if it doesn't exist
	if (!cache[0]) cache[0] = start;

	// If index were to be infinity, value and index are infinity
	if (index === Infinity) return new InfiniteListItem(this, Infinity, Infinity);

	// If index exists in cache, return the value
	if (index in cache) return new InfiniteListItem(this, cache[index], index);

	// If i doesn't exist in cache
	if (!(index in cache)) {
		if (cache.length <= index && (cache.length - 1) in cache)
			while (cache.length <= index)
				cache[cache.length] = next(
						cache[cache.length - 1],
						cache[cache.length - 2]
					);
	}
	return new InfiniteListItem(this, cache[index], index);
}

/**
 * Clear cache manually.
 * Forces destroy reference to cache, and creates a new cache.
 * Old cache will be GC'd.
 * @returns {undefined}
 * @memberof InfiniteList
 */
InfiniteList.prototype.clearCache = function () {
	this.__cache__ = [];
};

/**
 * Takes a given number of elements from the InfiniteList.
 * @param {Number} from Number of elements or starting index
 * @param {Number} to Optional ending index
 * @returns {Array<InfiniteListItem>} An array of InfiniteListItems
 * @memberof InfiniteList
 */
InfiniteList.prototype.take = function (from, to) {
	const arr = [];

	if(
		isNonZeroFalsy(from)
		|| (from === 0 && isNonZeroFalsy(to)) // Take 0 elements?
		|| (!areNumbers(from) && isNonZeroFalsy(to))
	) return arr;

	let source, target;
	if (isNonZeroFalsy(to)) {
		// "from" number of elements
		source = 0;
		target = from;
	} else {
		// "target" is the end index!
		source = from;
		target = to + 1
	};

	for (let i = source; i < target; i++) {
		arr.push(this.get(i));
	}
	return arr;
};

/**
 * Returns first element of InfiniteList.
 * @returns {InfiniteListItem} Instance of InfiniteListItem
 * @memberof InfiniteList
 */
InfiniteList.prototype.top = function () {
	return this.get(0);
};

/**
 * Returns last element of InfiniteList (Infinity).
 * @returns {InfiniteListItem} Instance of InfiniteListItem
 * @memberof InfiniteList
 */
InfiniteList.prototype.end = function () {
	return this.get(Infinity);
};

/**
 * toString method for pretty printing InfiniteList instance.
 * Snips at 2 elements for arrays and objects, or 5 elements otherwise.
 * @returns {String} Pretty printed InfiniteList
 * @memberof InfiniteList
 */
InfiniteList.prototype.toString = function () {
	const length = typeof this.first() === 'object' ? 2 : 5;
	return [
			'InfiniteList [',
			this
			.take(length)
			.map(x => (' ' + stringify(x.value))) +
			',',
			'... ]'
		]
		.join(' ');
};

/* Convenience methods */
InfiniteList.prototype.first = InfiniteList.prototype.top;
InfiniteList.prototype.last = InfiniteList.prototype.end;

// Exports
module.exports = InfiniteList;
