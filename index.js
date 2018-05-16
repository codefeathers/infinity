/**
 * ∞
 * Infinity: Create infinitely generating lists in JavaScript.
 * @version 0.2.0
 * @author Muthu Kumar (MKRhere)
 */

// Utils
const { always, isNonZeroFalsy, stringify, areNumbers } = require('./utils');

/**
 * An item of the InfiniteList class. Created when calling .get(n) on an InfiniteList.
 * Exposed for instanceof utility sake. Not to be called directly.
 * @class InfiniteListItem
 */
class InfiniteListItem {
	/**
	 * Creates an instance of InfiniteListItem.
	 * @param {any} list Parent list, instance of InfiniteList
	 * @param {any} value Current value
	 * @param {any} index Current index
	 * @memberof InfiniteListItem
	 */
	constructor(list, value, index) {
		this.value = value;
		this.index = index;
		this.next = z => (!z ? list.get(index + 1) : list.get(index + z));
		this.previous = z => (!z ? list.get(index - 1) : list.get(index - z));

		// Check if Symbol exists
		if (typeof Symbol !== 'undefined' && Symbol.iterator) {
			/**
			 * ES6 Symbol.iterator
			 * @returns {Iterable.<*>}
			 */
			this[Symbol.iterator] = () => ({
				next: () => ({
					done: false,
					value: list.get(index + 1)
				})
			});
		}
	}

	/**
	 * toString method for pretty printing InfiniteListItem instance.
	 * @returns {String} Decycled and beautified string
	 */
	toString() {
		return ('InfiniteListItem [ .. ' +
			stringify(this.value) +
			' .. ]')
	}
}

class InfiniteList {
	/**
	 * InfiniteList Constructor.
	 * Iterates infinitely until index value is found.
	 * Stores cache in closure so when the same index is requested again,
	 * it's returned immediately.
	 * @param {*} start Starting value
	 * @param {Function} next Function to find next item
	 * Accepts current value and optionally previous value
	 * @constructs InfiniteList
	 */
	constructor(start, next) {

		// Closure magic!
		let cache = [];
		let j = 0;

		/**
		 * Get InfiniteListItem at index.
		 * @param {Number} index A non-negative integer representing index
		 * @returns {InfiniteListItem}
		 */
		this.get = function (index) {

			// Validation
			if (
				// i is a non-zero falsy value, or is negative
				(isNonZeroFalsy(index) || index < 0)
				|| !areNumbers(index)
			) return;

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
						cache[cache.length] = next(cache[cache.length - 1], cache[cache.length - 2]);
			}
			return new InfiniteListItem(this, cache[index], index);
		}

		/**
		 * Clear cache manually.
		 * Forces destroy reference to cache, and creates a new cache.
		 * Old cache will be GC'd.
		 * @returns {undefined}
		 */
		this.clearCache = () => (cache = [], undefined);

		// Check if Symbol exists
		if (typeof Symbol !== 'undefined' && Symbol.iterator) {
			/**
			 * ES6 Symbol.iterator
			 * @returns {Iterable.<*>}
			 */
			this[Symbol.iterator] = function () {
				return {
					next: () => ({
						done: false,
						value: this.get(j++)
					})
				};
			};
		}

		if(typeof Proxy !== 'undefined')
			return new Proxy(this, {
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
				enumerate: obj => obj.keys(),
				ownKeys: obj => obj.keys(),
			})
	}
}

/**
 * Takes a given number of elements from the InfiniteList.
 * @param {Number} from Number of elements or starting index
 * @param {Number} to Optional ending index
 * @returns {Array<InfiniteListItem>} An array of InfiniteListItems
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
 */
InfiniteList.prototype.top = function () {
	return this.get(0);
};

/**
 * Returns last element of InfiniteList (Infinity).
 * @returns {InfiniteListItem} Instance of InfiniteListItem
 */
InfiniteList.prototype.end = function () {
	return this.get(Infinity);
};

/**
 * toString method for pretty printing InfiniteList instance.
 * Snips at 2 elements for arrays and objects, or 5 elements otherwise.
 * @returns {String} Pretty printed InfiniteList
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
module.exports.InfiniteListItem = InfiniteListItem;