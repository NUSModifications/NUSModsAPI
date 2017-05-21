import mapKeysDeep from '../server/util/mapKeysDeep';

describe('mapKeysDeep', () => {
  const appendXToKeys = mapKeysDeep(key => `${key}X`);

  const testString = 'testString';

  it('should return string without modification', () => {
    expect(appendXToKeys(testString)).toEqual(testString);
  });

  it('should map over array of objects', () => {
    const testObject = {
      testString,
    };
    const expectedObject = {
      testStringX: testString,
    };
    expect(appendXToKeys([testObject, testObject])).toEqual([expectedObject, expectedObject]);
  });

  it('should change all keys in simple object', () => {
    const anotherString = 'anotherString';
    const inputObject = {
      testString,
      anotherString,
    };
    expect(appendXToKeys(inputObject)).toEqual({
      testStringX: testString,
      anotherStringX: anotherString,
    });
  });

  it('should change all keys in nested object', () => {
    const inputObject = {
      testString,
      anotherString: {
        yetAnotherString: 'yetAnotherString',
        array: [{
          testString,
        }],
      },
    };
    expect(appendXToKeys(inputObject)).toEqual({
      testStringX: testString,
      anotherStringX: {
        yetAnotherStringX: 'yetAnotherString',
        arrayX: [{
          testStringX: testString,
        }],
      },
    });
  });
});
