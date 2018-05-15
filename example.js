const infiniteList = require('.');

const increment = i => i + 2;
const infinite = infiniteList.create(0, increment, 10);

// infinite;
console.log(infinite.top())
console.log(infinite.last())

console.log(infinite.get(5))
console.log(infinite.get(5))
console.log(infinite.get(6))
console.log(infinite.get(14).next())

console.log(infinite.toString())
console.log(infinite.top().next().next().toString())

console.log(infinite.take(5))

const gen = infinite[Symbol.iterator];
gen();

for(let i of infinite) {
	// if(i.index > 100) break;
	// console.log(infinite.get(5).value);
	console.log(i.value.toString());
}
