import R from 'ramda';

/**
 * Recursively traverses the object and applies a function to all the keys.
 * This function is curried.
 * @param {* Function} func
 * @param {* Object} obj
 */
function mapKeysDeep(func, obj) {
  if (typeof obj === 'string') {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(innerContent => mapKeysDeep(func, innerContent));
  }
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    newObj[func(key)] = mapKeysDeep(func, value);
  });
  return newObj;
}

export default R.curry(mapKeysDeep);
