"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (f) {
	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.isEq = f();
	}
})(function () {
	var define, module, exports;return function () {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
					}var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
						var n = e[i][1][r];return o(n || r);
					}, p, p.exports, r, e, n, t);
				}return n[i].exports;
			}for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
				o(t[i]);
			}return o;
		}return r;
	}()({ 1: [function (require, module, exports) {
			/**
    * ∞
    * Infinity: Create infinitely generating lists in JavaScript.
    * @version 0.2.0
    * @author Muthu Kumar (MKRhere)
    */

			// Utils
			var _require = require('./utils'),
			    always = _require.always,
			    isNonZeroFalsy = _require.isNonZeroFalsy,
			    stringify = _require.stringify,
			    areNumbers = _require.areNumbers;

			/**
    * An item of the InfiniteList class. Created when calling .get(n) on an InfiniteList.
    * Exposed for instanceof utility sake. Not to be called directly.
    * @class InfiniteListItem
    */


			var InfiniteListItem = function () {
				/**
     * Creates an instance of InfiniteListItem.
     * @param {any} list Parent list, instance of InfiniteList
     * @param {any} value Current value
     * @param {any} index Current index
     * @memberof InfiniteListItem
     */
				function InfiniteListItem(list, value, index) {
					_classCallCheck(this, InfiniteListItem);

					this.value = value;
					this.index = index;
					this.next = function (z) {
						return !z ? list.get(index + 1) : list.get(index + z);
					};
					this.previous = function (z) {
						return !z ? list.get(index - 1) : list.get(index - z);
					};

					// Check if Symbol exists
					if (typeof Symbol !== 'undefined' && Symbol.iterator) {
						/**
       * ES6 Symbol.iterator
       * @returns {Iterable.<*>}
       */
						this[Symbol.iterator] = function () {
							return {
								next: function next() {
									return {
										done: false,
										value: list.get(index + 1)
									};
								}
							};
						};
					}
				}

				/**
     * toString method for pretty printing InfiniteListItem instance.
     * @returns {String} Decycled and beautified string
     */


				_createClass(InfiniteListItem, [{
					key: "toString",
					value: function toString() {
						return 'InfiniteListItem [ .. ' + stringify(this.value) + ' .. ]';
					}
				}]);

				return InfiniteListItem;
			}();

			var InfiniteList =
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
			function InfiniteList(start, next) {
				_classCallCheck(this, InfiniteList);

				// Closure magic!
				var cache = [];
				var j = 0;

				/**
     * Get InfiniteListItem at index.
     * @param {Number} index A non-negative integer representing index
     * @returns {InfiniteListItem}
     */
				this.get = function (index) {

					// Validation
					if (
					// i is a non-zero falsy value, or is negative
					isNonZeroFalsy(index) || index < 0 || !areNumbers(index)) return;

					//TODO: Cache limiting. (Removed for unexpected behaviour)

					// Initializing first item if it doesn't exist
					if (!cache[0]) cache[0] = start;

					// If index were to be infinity, value and index are infinity
					if (index === Infinity) return new InfiniteListItem(this, Infinity, Infinity);

					// If index exists in cache, return the value
					if (index in cache) return new InfiniteListItem(this, cache[index], index);

					// If i doesn't exist in cache
					if (!(index in cache)) {
						if (cache.length <= index && cache.length - 1 in cache) while (cache.length <= index) {
							cache[cache.length] = next(cache[cache.length - 1], cache[cache.length - 2]);
						}
					}
					return new InfiniteListItem(this, cache[index], index);
				};

				/**
     * Clear cache manually.
     * Forces destroy reference to cache, and creates a new cache.
     * Old cache will be GC'd.
     * @returns {undefined}
     */
				this.clearCache = function () {
					return cache = [], undefined;
				};

				// Check if Symbol exists
				if (typeof Symbol !== 'undefined' && Symbol.iterator) {
					/**
      * ES6 Symbol.iterator
      * @returns {Iterable.<*>}
      */
					this[Symbol.iterator] = function () {
						var _this = this;

						return {
							next: function next() {
								return {
									done: false,
									value: _this.get(j++)
								};
							}
						};
					};
				}
			};

			/**
    * Takes a given number of elements from the InfiniteList.
    * @param {Number} from Number of elements or starting index
    * @param {Number} to Optional ending index
    * @returns {Array<InfiniteListItem>} An array of InfiniteListItems
    */


			InfiniteList.prototype.take = function (from, to) {
				var arr = [];

				if (isNonZeroFalsy(from) || from === 0 && isNonZeroFalsy(to) // Take 0 elements?
				|| !areNumbers(from) && isNonZeroFalsy(to)) return arr;

				var source = void 0,
				    target = void 0;
				if (isNonZeroFalsy(to)) {
					// "from" number of elements
					source = 0;
					target = from;
				} else {
					// "target" is the end index!
					source = from;
					target = to + 1;
				};

				for (var i = source; i < target; i++) {
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
				var length = _typeof(this.first()) === 'object' ? 2 : 5;
				return ['InfiniteList [', this.take(length).map(function (x) {
					return ' ' + stringify(x.value);
				}) + ',', '... ]'].join(' ');
			};

			/* Convenience methods */
			InfiniteList.prototype.first = InfiniteList.prototype.top;
			InfiniteList.prototype.last = InfiniteList.prototype.end;

			// Exports
			module.exports = InfiniteList;
			module.exports.InfiniteListItem = InfiniteListItem;
		}, { "./utils": 3 }], 2: [function (require, module, exports) {
			/*
       cycle.js
       2018-05-15
       Public Domain.
       NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
       This code should be minified before deployment.
       See http://javascript.crockford.com/jsmin.html
       USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
       NOT CONTROL.
   */

			// The file uses the WeakMap feature of ES6.

			/*jslint eval */

			/*property
       $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
       retrocycle, set, stringify, test
   */

			if (typeof JSON.decycle !== "function") {
				JSON.decycle = function decycle(object, replacer) {
					"use strict";

					// Make a deep copy of an object or array, assuring that there is at most
					// one instance of each object or array in the resulting structure. The
					// duplicate references (which might be forming cycles) are replaced with
					// an object of the form

					//      {"$ref": PATH}

					// where the PATH is a JSONPath string that locates the first occurance.

					// So,

					//      var a = [];
					//      a[0] = a;
					//      return JSON.stringify(JSON.decycle(a));

					// produces the string '[{"$ref":"$"}]'.

					// If a replacer function is provided, then it will be called for each value.
					// A replacer function receives a value and returns a replacement value.

					// JSONPath is used to locate the unique object. $ indicates the top level of
					// the object or array. [NUMBER] or [STRING] indicates a child element or
					// property.

					var objects = new WeakMap(); // object to path mappings

					return function derez(value, path) {

						// The derez function recurses through the object, producing the deep copy.

						var old_path; // The path of an earlier occurance of value
						var nu; // The new object or array

						// If a replacer function was provided, then call it to get a replacement value.

						if (replacer !== undefined) {
							value = replacer(value);
						}

						// typeof null === "object", so go on if this value is really an object but not
						// one of the weird builtin objects.

						if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null && !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String)) {

							// If the value is an object or array, look to see if we have already
							// encountered it. If so, return a {"$ref":PATH} object. This uses an
							// ES6 WeakMap.

							old_path = objects.get(value);
							if (old_path !== undefined) {
								return {
									$ref: old_path
								};
							}

							// Otherwise, accumulate the unique value and its path.

							objects.set(value, path);

							// If it is an array, replicate the array.

							if (Array.isArray(value)) {
								nu = [];
								value.forEach(function (element, i) {
									nu[i] = derez(element, path + "[" + i + "]");
								});
							} else {

								// If it is an object, replicate the object.

								nu = {};
								Object.keys(value).forEach(function (name) {
									nu[name] = derez(value[name], path + "[" + JSON.stringify(name) + "]");
								});
							}
							return nu;
						}
						return value;
					}(object, "$");
				};
			}

			if (typeof JSON.retrocycle !== "function") {
				JSON.retrocycle = function retrocycle($) {
					"use strict";

					// Restore an object that was reduced by decycle. Members whose values are
					// objects of the form
					//      {$ref: PATH}
					// are replaced with references to the value found by the PATH. This will
					// restore cycles. The object will be mutated.

					// The eval function is used to locate the values described by a PATH. The
					// root object is kept in a $ variable. A regular expression is used to
					// assure that the PATH is extremely well formed. The regexp contains nested
					// * quantifiers. That has been known to have extremely bad performance
					// problems on some browsers for very long strings. A PATH is expected to be
					// reasonably short. A PATH is allowed to belong to a very restricted subset of
					// Goessner's JSONPath.

					// So,
					//      var s = '[{"$ref":"$"}]';
					//      return JSON.retrocycle(JSON.parse(s));
					// produces an array containing a single element which is the array itself.

					var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

					(function rez(value) {

						// The rez function walks recursively through the object looking for $ref
						// properties. When it finds one that has a value that is a path, then it
						// replaces the $ref object with a reference to the value that is found by
						// the path.

						if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
							if (Array.isArray(value)) {
								value.forEach(function (element, i) {
									if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && element !== null) {
										var path = element.$ref;
										if (typeof path === "string" && px.test(path)) {
											value[i] = eval(path);
										} else {
											rez(element);
										}
									}
								});
							} else {
								Object.keys(value).forEach(function (name) {
									var item = value[name];
									if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && item !== null) {
										var path = item.$ref;
										if (typeof path === "string" && px.test(path)) {
											value[name] = eval(path);
										} else {
											rez(item);
										}
									}
								});
							}
						}
					})($);
					return $;
				};
			}

			module.exports = JSON;
		}, {}], 3: [function (require, module, exports) {
			var JSON = require('./cycle');

			var always = function always(x) {
				return function (_) {
					return x;
				};
			};
			var isNonZeroFalsy = function isNonZeroFalsy(_) {
				return Boolean(_) === false && _ !== 0;
			};
			var stringify = function stringify(_) {
				return (typeof _ === "undefined" ? "undefined" : _typeof(_)) === 'object' && _ !== null ? JSON.stringify(JSON.decycle(_), null, 2) : _.toString();
			};
			var areNumbers = function areNumbers() {
				for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
					items[_key] = arguments[_key];
				}

				return items.every(function (x) {
					return typeof x === 'number' && x !== NaN;
				});
			};

			module.exports = {
				always: always,
				isNonZeroFalsy: isNonZeroFalsy,
				stringify: stringify,
				areNumbers: areNumbers
			};
		}, { "./cycle": 2 }] }, {}, [1])(1);
});
