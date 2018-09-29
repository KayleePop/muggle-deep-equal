function isPrimitive (obj) {
  return (typeof obj === 'string') ||
    (typeof obj === 'boolean') ||
    (typeof obj === 'number') ||
    (typeof obj === 'function') ||
    (typeof obj === 'undefined') ||
    (typeof obj === 'symbol') ||
    (obj === null)
}

function isIterable (obj) {
  return (typeof obj[Symbol.iterator] === 'function')
}

// returns true iff the two objects are recursively strictly equal
module.exports = function deepEqual (obj1, obj2) {
  if (isPrimitive(obj1) || isPrimitive(obj2)) {
    return (obj1 === obj2) ||
      (Number.isNaN(obj1) && Number.isNaN(obj2))
  }

  // must be same class
  if (obj1.constructor.name !== obj2.constructor.name) {
    return false
  }

  if (isIterable(obj1) || isIterable(obj2)) {
    // if one object is not iterable, then trying to iterate over it will throw
    if (!isIterable(obj1) || !isIterable(obj2)) {
      return false
    }

    const iterator1 = obj1[Symbol.iterator]()
    const iterator2 = obj2[Symbol.iterator]()

    let curr1 = iterator1.next()
    let curr2 = iterator2.next()
    while (!curr1.done && !curr2.done) {
      if (!deepEqual(curr1.value, curr2.value)) {
        return false
      }

      curr1 = iterator1.next()
      curr2 = iterator2.next()
    }

    // check for extra values
    if (!curr1.done || !curr2.done) {
      return false
    }

    return true
  } else {
    // non-iterable objects

    for (const prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false
      }

      // check that props actually exist on obj2
      // non-existant props look like props set to undefined in the above comparison
      if (!(prop in obj2)) {
        return false
      }
    }

    // check that obj2 doesn't have extra properties
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }

    // checking toString() covers objects with important non-enumerable properties
    // like Date, RegExp, Error
    if (obj1.toString() !== obj2.toString()) {
      return false
    }

    return true
  }
}
