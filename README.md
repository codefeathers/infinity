# ∞

## Infinity

Create infinite linked lists in JavaScript. Each item is linked to the next and previous item.

This can also be used as an n<sup>th</sup> generator with a pure interface (see [example](#example)).

## Installation

Node:

```shell
npm install --save @codefeathers/infinity
```

In the browser:

```HTML
<script src="https://unpkg.com/@codefeathers/infinity">
```

## Usage

```JavaScript
// Initialise a new InfiniteList using the constructor.
// `start` is any value.
// `next` is a pure function that accepts current
// (and optionally previous) value in the series

const infinity = new InfiniteList(<start:Number>, <next:Function>);

// Gets item at index
infinity.get(<index:Number>);

// Equivalent to the above! (Modern browsers and node only)
infinity[<index:Number>];

// Returns array of given number of InfiniteListItems from index 0
infinity.take(<number:Number>);

// Returns array of InfiniteListItems from index startIndex to endIndex
infinity.take(<startIndex:Number>, <endIndex:Number>);

// Get InfiniteListItem at next index. Optional number of indices to move ahead
infinity.get(<index:Number>).next(<number:Number>);

// Get InfiniteListItem at previous index. Optional number of indices to move backward
infinity.get(<index:Number>).previous(<number:Number>);
```

You can pass in any starting value. `infinity` cheerfully ignores what you pass in there. The `next` function gets current value and (optionally) previous value as arguments to find next value.

`InfiniteList` is iterable.

```JavaScript
// (Modern browsers and node only)
for (let item of infinity) {
	// Remember to have an exit condition
	console.log(item);
}
```

## Example

```JavaScript
const InfiniteList = require('@codefeathers/infinity');
const { log } = console;

const next = (cur, prev) => cur + ((!prev && prev !== 0) ? 1 : prev);
const fibonacci = new InfiniteList(0, next);

// Take the first ten numbers from fibonacci series
log(fibonacci.take(10).map(x => x.value)); // -> [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]

// What's the 50th item?
log(fibonacci.get(50).value); // -> 12586269025

// This is equivalent of the above! (modern browsers only!)
log(fibonacci[50].value); // -> 12586269025

// What's the next item?
log(fibonacci.get(50).next().value); // -> 20365011074

// What's 5 places after?
log(fibonacci.get(50).next(5).value); // -> 139583862445

// To Infinity and beyond!
log(fibonacci.last().value); // -> Infinity
```
