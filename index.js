const always = x => _ => x;

class InfiniteListItem {
	constructor (list, value, index) {
		this.value = value,
		this.index = index,
		this.next = () => list.get(index + 1),
		this.previous = () => list.get(index - 1),
		this[Symbol.iterator] = () => ({
			next: () => ({
				done: false,
				value: list.get(index + 1)
			})
		}),
		this.toString = () => {
			const val = list.get(i).value;
			return ( 'InfiniteListItem [ ..., '
				+ ((typeof val === 'object' && val !== null)
					? JSON.stringify(val, null, 2)
					: val.toString())
				+ ', ... ]' )
		}
	}
}

const infiniteList = {
	/**
	 * InfiniteList Constructor. Iterates infinitely until index value is found.
	 * 
	 * @param {any} start
	 * @param {any} next
	 * @returns InfiniteList instance
	 */
	create (start, next) {

		// Closure magic!
		let cache = [];
		let j = 0;

		// Get list item of index i
		function get(i) {

			// Validation
			if(
				// i is a falsy value except 0
				(!i && i !== 0)
				// is not a number
				|| (typeof i !== 'number')
				// is... not a number
				|| Number.isNaN(i)
			) return;

			//TODO: Cache limiting. (Removed after unexpected behaviour)
			
			// Initializing first item if it doesn't exist
			if(!cache[0]) cache[0] = start;

			// If index were to be infinity, value and index are infinity
			if(i === Infinity) return new InfiniteListItem(this, Infinity, Infinity)

			// If index exists in cache, return the value
			if(i in cache) return new InfiniteListItem(this, cache[i], i);

			// If i doesn't exist in cache
			if(!(i in cache)) {
				if(cache.length <= i && (cache.length - 1) in cache)
					while (cache.length <= i)
						cache[cache.length] = next(cache[cache.length - 1]);
			}
			return new InfiniteListItem(this, cache[i], i);
		}

		const take = (from, to) => {
			const arr = [];
			let source, target;
			// "from" number of elements
			if(!to) { source = 0; target = from; }
			// "target" is the end index!
			else { source = from; target = to + 1 };
			for(let i = source; i < target; i ++) {
				arr.push(get(i));
			};
			return arr;
		};

		// Clear cache manually.
		const clearCache = () => (cache = [], undefined);

		const top = function () { return this.get(0) };
		const end = function () { return this.get(Infinity) };
		const returns = {
			get,
			take,
			top,
			first: top,
			end,
			last: end,
			clearCache,
			[Symbol.iterator]: () => ({
				next: () => ({
					done: false,
					value: get(j++)
				})
			}),
			toString: () => 'InfiniteList [ '
				+ take(0, 10).map(x => (' ' + x.value.toString()))
				+ ' ... ]'
		};
		return returns;
	}
}

module.exports = infiniteList;
module.exports.InfiniteListItem = InfiniteListItem;
