import * as utils from '../../src/utils';

describe('isStunMessage()', () => {
  test('returns true for 1st 2bit is 0', () => {
    const $buf = Buffer.from('00', 'hex');
    expect(utils.isStunMessage($buf)).toBeTruthy();
  });

  test('returns false for 1st 2bit is not 0', () => {
    const $buf = Buffer.from('90', 'hex');
    expect(utils.isStunMessage($buf)).toBeFalsy();
  });
});

describe('numberToBinaryStringArray()', () => {
  test('accepts exact digit', () => {
    expect(utils.numberToBinaryStringArray(1, 4)).toHaveLength(4);
    expect(utils.numberToBinaryStringArray(1, 16)).toHaveLength(16);
  });

  test('contains 1 or 0 string only', () => {
    const ret = utils.numberToBinaryStringArray(123, 8);
    ret.forEach(b => {
      const isZeroOrOne = b === '0' || b === '1';
      expect(isZeroOrOne).toBeTruthy();
    });
  });
});

describe('calcPaddingByte()', () => {
  test('calcs pading', () => {
    const lim = 4;
    [[0, 0], [1, 3], [2, 2], [3, 1], [4, 0], [5, 3], [16, 0]].forEach(
      ([e, v]) => {
        expect(utils.calcPaddingByte(e, lim)).toBe(v);
      },
    );
  });
});

describe('writeAttrBuffer()', () => {
  test('has 4byte boundary', () => {
    [
      utils.writeAttrBuffer(1, Buffer.from('')),
      utils.writeAttrBuffer(1, Buffer.from('dummy')),
      utils.writeAttrBuffer(1, Buffer.from('dummy'.repeat(100))),
    ].forEach($attr => {
      expect($attr.length % 4).toBe(0);
    });
  });
});

describe('generateFingerprint()', () => {
  test('has always 4byte(32bit) length', () => {
    [
      utils.generateFingerprint(Buffer.from('')),
      utils.generateFingerprint(Buffer.from('dummy')),
    ].forEach($fp => {
      expect($fp.length).toBe(4);
    });
  });
});

describe('generateIntegrity() / generateIntegrityWithFingerprint()', () => {
  test('has always 20byte length', () => {
    [
      utils.generateIntegrity(Buffer.from(''), 'dummy'),
      utils.generateIntegrity(Buffer.from('dummy'), 'dummy'),
      utils.generateIntegrity(Buffer.from('dummy'.repeat(100)), 'dummy'),
      utils.generateIntegrityWithFingerprint(
        Buffer.from('dummy'.repeat(100)),
        'dummy',
      ),
    ].forEach($integrity => {
      expect($integrity.length).toBe(20);
    });
  });
});
