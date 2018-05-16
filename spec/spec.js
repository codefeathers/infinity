'use strict';

const InfiniteList = require('..');
const { InfiniteListItem } = require('..');

/* global describe it expect */
describe("InfiniteList", () => {

	it("Should be true", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		expect(infinite.get(5) instanceof InfiniteListItem).toBe(true);
	})

	it("Should be 0", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		expect(infinite.first().value).toBe(0);
		expect(infinite.top().value).toBe(0);
		expect(infinite.last().value).toBe(Infinity);
		expect(infinite.end().value).toBe(Infinity);
	})

	it("Should be 22", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		expect(infinite.get(11).value).toBe(22);
	})

	it("Should be [ 0, 2, 4, 6, 8 ]", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		expect(infinite.take(5).map(x => x.value)).toEqual([ 0, 2, 4, 6, 8 ]);
	})

	it("Should be [ 16, 18, 20 ]", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		expect(infinite.take(8, 10).map(x => x.value)).toEqual([ 16, 18, 20 ]);
	})

	it("Should be [ 0, 2, 4, 6, 8 ]", () => {
		const infinite = InfiniteList.create(0, x => x + 2);
		const acc = [];
		for(let i of infinite) {
			if(i.index >= 5) break;
			acc.push(i.value)
		}
		expect(acc).toEqual([ 0, 2, 4, 6, 8 ]);
	})

})