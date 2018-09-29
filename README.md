# muggle-deep-equal

[![Greenkeeper badge](https://badges.greenkeeper.io/KayleePop/muggle-deep-equal.svg)](https://greenkeeper.io/) [![Travis badge](https://travis-ci.org/KayleePop/muggle-deep-equal.svg?branch=master)](https://travis-ci.org/#) [![standard badge](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![npm](https://img.shields.io/npm/v/muggle-deep-equal.svg)](https://www.npmjs.com/package/muggle-deep-equal)

A simple and generic implementation of deep equal using [Iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

Used in [muggle-assert](https://github.com/kayleepop/muggle-assert), the assertion library for [muggle](https://github.com/kayleepop/muggle)

### Goals

- Generic and predictable behavior
- Simple and readable source code
- Fully tested

### Installation
`$ npm install muggle-deep-equal`

### Example
```js
const deepEqual = require('muggle-deep-equal')

// primitives are compared with ===
deepEqual('penguin', 'penguin') // returns true
deepEqual(100, 50) // returns false
deepEqual(1, true) // returns false

deepEqual([1, 2, 3, 4], [1, 2, 3, 4]) // returns true

deepEqual(
  {
    array: [1, 2, 3],
    object: {
      animal: 'penguin'
    }
  },
  {
    array: [1, 2, 3],
    object: {
      animal: 'penguin'
    }
  }
) // returns true

// if either string or array was different, deepEqual would return false
```
### What's deep equal?

If two objects are deeply equal, then their actual data are equal rather than just their reference. It's useful for comparing separate instances of arrays and objects for example.

In muggle-deep-equal, equality is determined by these rules (in order):

#### 1. If either value is a primitive, then equality is determined using strict equality `===`
  - `String`, `Number`, `Boolean`, `Function`, `Symbol`, `undefined`, or `null`
  - `NaN` is considered equal to `NaN`
#### 2. Both objects must have the same class.
  - `object1.constructor.name === object2.constructor.name`
#### 3. If either object is an [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), then equality is determined by checking that both contain the same values in the same order.
  - Values are compared by applying these deep equal rules recursively.
  - Every index is compared 1 at a time in order using the [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
  - Rules #4 and #5 aren't applied to iterables
#### 4. Both objects must have the same properties and values.
  - Compared by applying these deep equal rules recursively on every value using a [for...in loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
#### 5. Both objects must return the same string representation from `object.toString()`
  - This allows many other objects to be compared as expected such as `Error`, `Date`, and `RegExp`
