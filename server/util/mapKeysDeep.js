import R from 'ramda';

/**
 * Recursively traverses the object and applies a function to all the keys.
 * This function is curried.
 * @param {* Function} func
 * @param {* Object} value
 */
function mapKeysDeep(func, value) {
  if (Array.isArray(value)) {
    return value.map(innerContent => mapKeysDeep(func, innerContent));
  }
  const type = typeof value;
  const isObject = value != null && (type === 'object' || type === 'function');
  if (isObject) {
    const obj = {};
    Object.entries(value).forEach(([key, objValue]) => {
      obj[func(key)] = mapKeysDeep(func, objValue);
    });
    return obj;
  }
  return value; // all other cases
}

export default R.curry(mapKeysDeep);
