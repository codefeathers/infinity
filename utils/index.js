const JSON = require('./cycle');

const always = x => _ => x;
const isNonZeroFalsy = _ => (
	(Boolean(_) === false) && _ !== 0
);
const stringify = _ => {
	return ((typeof _ === 'object' && _ !== null) ?
		JSON.stringify(JSON.decycle(_), null, 2) :
		_.toString())
};
const areNumbers = (...items) => items.every(x => (typeof x === 'number' && x !== NaN));

module.exports = {
	always,
	isNonZeroFalsy,
	stringify,
	areNumbers
}