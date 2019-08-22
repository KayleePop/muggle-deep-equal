const test = require('muggle-test')
const assert = require('assert')
const deepEqual = require('./index.js')

// primitives
test('primitives should deepEqual themselves', () => {
  assert(deepEqual('', ''), 'empty string')
  assert(deepEqual('penguins', 'penguins'), 'string')

  assert(deepEqual(100, 100), 'number')
  assert(deepEqual(Infinity, Infinity), 'Infinity')
  assert(deepEqual(-Infinity, -Infinity), 'negative Infinity')
  assert(deepEqual(NaN, NaN), 'NaN')
  assert(deepEqual(-0, +0), 'positive and negative 0')

  assert(deepEqual(null, null), 'null')

  assert(deepEqual(undefined, undefined), 'undefined')

  assert(deepEqual(true, true), 'true')
  assert(deepEqual(false, false), 'false')

  function penguin () {}
  const penguinVar = penguin
  assert(deepEqual(penguin, penguinVar), 'function')

  assert(deepEqual(Symbol.for('penguin'), Symbol.for('penguin')), 'symbol')
})

test('should return false on inequal primitives', () => {
  assert(!deepEqual('penguin', 'not penguin'), 'different strings')

  assert(!deepEqual(100, -50), 'different Numbers')
  assert(!deepEqual(Infinity, -Infinity), 'positive and negative Infinity')
  assert(!deepEqual(NaN, 5), 'NaN and number')
  assert(!deepEqual(NaN, Infinity), 'NaN and Infinity')

  assert(!deepEqual(true, false), 'different booleans')

  function penguin () {}
  function notPenguin () {}
  assert(!deepEqual(penguin, notPenguin), 'different functions')

  assert(!deepEqual(Symbol.for('penguin'), Symbol.for('seal')), 'different symbols')
})

test('strict equality should be used for primitives', () => {
  assert(!deepEqual(2, '2'), '\'2\' should not deepEqual 2')
  assert(!deepEqual('', false), 'empty string should not deepEqual false')
  assert(!deepEqual('', 0), 'empty string should not deepEqual 0')
  assert(!deepEqual(undefined, null), 'undefined should not deepEqual null')
  assert(!deepEqual(0, false), '0 should not deepEqual false')
  assert(!deepEqual('0', false), '\'0\' should not deepEqual false')
  assert(!deepEqual(1, true), '1 should not deepEqual true')
  assert(!deepEqual('1', true), '\'1\' should not deepEqual true')
})

test('primitives should not deepEqual objects', () => {
  assert(!deepEqual('', {}), '\'\' should not deepEqual {}')
  assert(!deepEqual('', []), '\'\' should not deepEqual []')

  assert(!deepEqual(5, [5]), '5 should not deepEqual [5]')
  assert(!deepEqual(5, { 5: 5 }), '5 should not deepEqual { 5: 5 }')
})
// end of primitives tests

// --------------------------

// object class
test('objects with different classes should not deepEqual', () => {
  class Parent {}
  class Child extends Parent {}

  assert(!deepEqual(new Parent(), new Child()))
})

test('different Iterable types should not deepEqual', () => {
  assert(!deepEqual([1, 2, 3], new Set([1, 2, 3])), 'equivalent set and array should not deepEqual')
})
// end of object class tests

// --------------------------

// plain objects
test('equivalent objects should be deepEqual', () => {
  assert(deepEqual({}, {}), 'empty objects')
  assert(deepEqual({ key: 'value' }, { key: 'value' }), 'simple objects')
  assert(deepEqual({ number: 100 }, { number: 100 }), 'simple objects with number values')

  assert(
    deepEqual(
      { key1: 'value1', key2: 'value2' },
      { key2: 'value2', key1: 'value1' }
    ),
    'order of keys should not matter'
  )
})

test('inequal objects should not deepEqual', () => {
  assert(!deepEqual({ key: 'value' }, { key: 'other value' }), 'different values')
  assert(!deepEqual({ key: 'value' }, { otherKey: 'value' }), 'different keys')

  assert(!deepEqual({ number: 100 }, { number: 50 }), 'different numbers as values')
})

test('objects with different number of properties should not deepEqual', () => {
  assert(
    !deepEqual(
      { key: 'value', key2: 'value' },
      { key: 'value' }
    ),
    'extra property in first object'
  )
  assert(
    !deepEqual(
      { key: 'value' },
      { key: 'value', key2: 'value' }
    ),
    'extra property in second object'
  )
})

test('undefined properties should affect equality', () => {
  assert(!deepEqual({}, { key: undefined }), 'in second object')
  assert(!deepEqual({ key: undefined }, {}), 'in first object')
  assert(
    !deepEqual({ key: undefined }, { otherKey: undefined }),
    'in both objects with different keys'
  )
})
// end of plain objects tests

// --------------------------

// iterables
test('equivalent generators are deepEqual', () => {
  function * generator () {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }
  function * equalGenerator () {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }

  assert(
    deepEqual(generator(), equalGenerator()),
    '1..5 generator should deepEqual other 1..5 generator'
  )
})

test('inequivalent generators are not deepEqual', () => {
  function * numberGenerator () {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }
  function * charGenerator () {
    yield 'a'
    yield 'b'
    yield 'c'
    yield 'd'
    yield 'e'
  }
  function * longerNumberGenerator () {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
    yield 6
  }

  assert(
    !deepEqual(numberGenerator(), charGenerator()),
    'number generator should not equal character generator'
  )

  assert(
    !deepEqual(numberGenerator(), longerNumberGenerator()),
    'generator should not deepEqual same generator with extra value'
  )
})

test('order of generators affect equality', () => {
  function * generator () {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
  }
  function * backwardsGenerator () {
    yield 5
    yield 4
    yield 3
    yield 2
    yield 1
  }

  assert(!deepEqual(generator, backwardsGenerator))
})

test('builtin iterables should be compared as expected', () => {
  assert(deepEqual([1, 2, 3], [1, 2, 3]), 'equal arrays')
  assert(deepEqual([], []), 'empty arrays')
  assert(!deepEqual([1, 2, 3], [3, 2, 1]), 'inequal arrays')

  assert(deepEqual(new Set([1, 1, 2, 3]), new Set([1, 2, 3, 3])), 'equal sets')
  assert(!deepEqual(new Set([1, 1, 2, 3]), new Set([4, 2, 1, 4])), 'inequal sets')

  assert(
    deepEqual(
      new Map([[1, 'first'], [2, 'second']]),
      new Map([[1, 'first'], [2, 'second']])
    ),
    'equal maps'
  )
  assert(
    !deepEqual(
      new Map([[1, 'first'], [2, 'second']]),
      new Map([[2, 'second'], [1, 'first']])
    ),
    'inequal maps'
  )

  assert(deepEqual(Buffer.from('012345'), Buffer.from('012345')), 'equal buffers')
  assert(!deepEqual(Buffer.from('012345'), Buffer.from('543210')), 'inequal buffers')
})

test('if only one object is an iterator, then deepEqual should return false without throwing an error', () => {
  const obj = {}
  obj[Symbol.iterator] = function * () {}

  assert(!deepEqual(obj, {}))
})
// end of iterables tests

// --------------------------

// toString()
test('otherwise equivalent objects with different toString should not deepEqual', () => {
  const obj = {}
  // change toString output without affecting property/value equality
  Object.defineProperty(obj, 'toString', { value: () => 'string representation' })

  assert(!deepEqual(obj, {}))
})

test('Errors should be compared as expected', () => {
  assert(deepEqual(new Error('message'), new Error('message')), 'errors with the same message should deepEqual')
  assert(
    !deepEqual(
      new Error('message'),
      new Error('other message')
    ),
    'errors with different messages should not deepEqual'
  )
  assert(
    !deepEqual(
      new Error('message'),
      new TypeError('message')
    ),
    'different types of errors should not deepEqual'
  )
})

test('Dates should be compared as expected', () => {
  const date = new Date()
  const equalDate = new Date(date)
  const otherDate = new Date(2009, 1, 3)
  assert(deepEqual(date, equalDate), 'equal dates should deepEqual')
  assert(!deepEqual(date, otherDate), 'different dates should not deepEqual')
})

test('RegExps should be compared as expected', () => {
  assert(deepEqual(/.+\n/, /.+\n/), 'equal RegExps should deepEqual')
  assert(!deepEqual(/[0-9]/, /[A-z]/), 'different RegExps should not deepEqual')
})
// end of toString() tests

// --------------------------

// recursion of equality
test('equivalent objects with nested objects are deepEqual', () => {
  assert(
    deepEqual({ nested: {} }, { nested: {} }),
    'nested empty objects'
  )

  assert(
    deepEqual(
      { n: { n: { n: { n: { n: {} } } } } },
      { n: { n: { n: { n: { n: {} } } } } }
    ),
    'deeply nested empty objects'
  )
})

test('objects with inequivalent nested objects are not deepEqual', () => {
  assert(
    !deepEqual(
      { nested: { key: 'value' } },
      { nested: { key: 'other value' } }
    ),
    'singly nested objects with different values'
  )

  assert(
    !deepEqual(
      { n: { n: { n: { n: { n: { num: 5 } } } } } },
      { n: { n: { n: { n: { n: { num: 7 } } } } } }
    ),
    'deeply nested objects with different values'
  )
})

test('equivalent iterables with nested iterables are deepEqual', () => {
  assert(
    deepEqual([[5]], [[5]]),
    'singly nested arrays'
  )

  assert(
    deepEqual(
      [[[[[5]]]]],
      [[[[[5]]]]]
    ),
    'deeply nested arrays'
  )
})

test('iterables with inequivalent nested iterables are not deepEqual', () => {
  assert(
    !deepEqual(
      [[5]],
      [[10]]
    ),
    'singly nested arrays with different numbers'
  )

  assert(
    !deepEqual(
      [[[[[5]]]]],
      [[[[[10]]]]]
    ),
    'deeply nested arrays with different numbers'
  )
})

test('equivalent iterables nested within an object should deepEqual', () => {
  assert(deepEqual({ array: [1, 2, 3] }, { array: [1, 2, 3] }))
})

test('inequivalent iterables nested within an object should not deepEqual', () => {
  assert(!deepEqual({ array: [1, 2, 3] }, { array: [3, 2, 1] }))
})

test('equivalent objects nested within iterable should deepEqual', () => {
  assert(deepEqual([{ key: 'value' }], [{ key: 'value' }]))
})

test('inequivalent objects nested within iterable should not deepEqual', () => {
  assert(
    !deepEqual(
      [{ key: 'value' }],
      [{ key: 'other value' }]
    )
  )
})

test('toString() is checked within object', () => {
  const obj = {}
  // change toString output without affecting property/value equality
  Object.defineProperty(obj, 'toString', { value: () => 'string representation' })

  assert(!deepEqual({ nested: obj }, { nested: {} }))
})

test('toString() is checked within iterable', () => {
  const obj = {}
  // defineProperty() sets property without making it enumerable
  Object.defineProperty(obj, 'toString', { value: () => 'string representation' })

  assert(!deepEqual([obj], [{}]))
})

test('classes are checked within object', () => {
  class Parent {}
  class Child extends Parent {}

  assert(!deepEqual({ obj: new Parent() }, { obj: new Child() }))
})

test('classes are checked within iterable', () => {
  class Parent {}
  class Child extends Parent {}

  assert(!deepEqual([new Parent()], [new Child()]))
})
