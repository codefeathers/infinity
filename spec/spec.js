'use strict';

const path = '..' + (process.env.NODE_ENV === 'development' ? '/es6' : '/es5/infinity.min.js');

const InfiniteList = require(path);
const { InfiniteListItem } = require(path);

console.log(`\nTesting ${path}\n`);

String.prototype.trimify = function() {
	return this.replace(/\s/g, '');
};

const testStrings = [
	`InfiniteListItem[.. {
		"i": 35,
		"a": {
			"$ref": "$"
		}
	} ..]`,
	`InfiniteList[{
		"i": 10,
		"a": {
			"$ref": "$"
		}
	}, {
		"i": 15,
		"a": {
			"$ref": "$"
		}
	}, ...]`
];

/* global describe it expect */
describe("InfiniteList", () => {

	it("Should be true", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite instanceof InfiniteList).toBe(true);
	});

	it("Should be true", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite.get(5) instanceof InfiniteListItem).toBe(true);
	});

	it("Should be 22", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite.get(11).value).toBe(22);
	});

	it("Should be 0", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite.first().value).toBe(0);
		expect(Infinite.top().value).toBe(0);
		expect(Infinite.last().value).toBe(Infinity);
		expect(Infinite.end().value).toBe(Infinity);
	});

	it("Should be 102", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		const hundred = Infinite.get(50);
		expect(hundred.next().value).toBe(102);
	});

	it("Should be [ 50, 52, 54, 56 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);

		const fourtyEight = Infinite.get(24);
		const arr = [
			fourtyEight.next(),
			fourtyEight.next(2),
			fourtyEight.next(3),
			fourtyEight.next(4)
		]

		expect(arr.map(x => x.value)).toEqual([ 50, 52, 54, 56 ]);
	});

	it("Should be 98", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		const hundred = Infinite.get(50);
		expect(hundred.previous().value).toBe(98);
	});

	it("Should be [ 46, 44, 42, 40 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);

		const fourtyEight = Infinite.get(24);
		const arr = [
			fourtyEight.previous(),
			fourtyEight.previous(2),
			fourtyEight.previous(3),
			fourtyEight.previous(4)
		]

		expect(arr.map(x => x.value)).toEqual([ 46, 44, 42, 40 ]);
	});

	it("Should equal []", () => {
		const Infinite = new InfiniteList(0, x => x + 2);

		expect(Infinite.take()).toEqual([ ]);
		expect(Infinite.take(0)).toEqual([ ]);
	});

	it("Should equal [ 0 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);

		expect(Infinite.take(0, 0).map(x => x.value)).toEqual([ 0 ]);
	});

	it("Should equal [ 0, 2, 4, 6, 8 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite.take(5).map(x => x.value)).toEqual([0, 2, 4, 6, 8]);
	});

	it("Should equal [ 16, 18, 20 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);
		expect(Infinite.take(8, 10).map(x => x.value)).toEqual([16, 18, 20]);
	});

	it("Should be [ 0, 2, 4, 6, 8 ]", () => {
		const Infinite = new InfiniteList(0, x => x + 2);

		const acc = [];
		for (let i of Infinite) {
			if (i.index >= 5) break;
			acc.push(i.value)
		}

		expect(acc).toEqual([0, 2, 4, 6, 8]);
	});

	it("Stringified InfiniteList should equal test string [0]", () => {
		const a = {
			i: 10
		}
		a.a = a;
		const next = x => {
			const y = {
				i: x.i + 5
			};
			y.a = y;
			return y;
		}

		const str = new InfiniteList(a, next)
			.get(5)
			.toString();

		expect(str.trimify()).toBe(testStrings[0].trimify());
	});

	it("Stringified InfiniteListItem should equal test string [1]", () => {
		const a = {
			i: 10
		}
		a.a = a;
		const next = x => {
			const y = {
				i: x.i + 5
			};
			y.a = y;
			return y;
		}

		const str = new InfiniteList(a, next).toString();

		expect(str.trimify()).toBe(testStrings[1].trimify());
	});

});
