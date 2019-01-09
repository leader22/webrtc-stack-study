const { StunMessage } = require('../lib/message');

describe('static createBlank()', () => {
  test('creates blank instance', () => {
    const blank = StunMessage.createBlank();
    expect(blank).toBeInstanceOf(StunMessage);
  });
});

describe('static createBindingRequest()', () => {
  test('creates request', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg).toBeInstanceOf(StunMessage);
  });
});

describe('createBindingResponse()', () => {
  test('creates success response from request', () => {
    const msg = StunMessage.createBindingRequest();
    const res = msg.createBindingResponse(true);
    expect(res).toBeInstanceOf(StunMessage);
  });

  test('has same transactionId w/ request', () => {
    const msg = StunMessage.createBindingRequest();
    const res = msg.createBindingResponse(true);

    expect(
      msg.toBuffer().slice(8, 20).equals(res.toBuffer().slice(8, 20))
    ).toBeTruthy();
  });
});

describe('isBindingRequest()', () => {
  test('returns true for request', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.isBindingRequest()).toBeTruthy();
  });

  test('returns false for blank', () => {
    const blank = StunMessage.createBlank();
    expect(blank.isBindingRequest()).toBeFalsy();
  });
});

describe('isBindingResponseSuccess()', () => {
  const msg = StunMessage.createBindingRequest();

  test('returns true for success response', () => {
    const res = msg.createBindingResponse(true);
    expect(res.isBindingResponseSuccess()).toBeTruthy();
  });

  test('returns false for error response', () => {
    const res = msg.createBindingResponse(false);
    expect(res.isBindingResponseSuccess()).toBeFalsy();
  });

  test('returns false for blank', () => {
    const blank = StunMessage.createBlank();
    expect(blank.isBindingResponseSuccess()).toBeFalsy();
  });
});

describe('setMappedAddressAttribute() / getMappedAddressAttribute()', () => {
  const rinfo = {
    family: 'IPv4', port: 12345, address: '0.0.0.0'
  };

  test('sets attr', () => {
    const msg = StunMessage.createBindingRequest();
    // save length w/o header
    const len1 = msg.toBuffer().slice(20).length;

    msg.setMappedAddressAttribute(rinfo);
    const len2 = msg.toBuffer().slice(20).length;
    expect(len1).not.toBe(len2);
  });

  test('gets attr(from myself)', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.getMappedAddressAttribute()).toBeNull();

    msg.setMappedAddressAttribute(rinfo);
    expect(msg.getMappedAddressAttribute()).toEqual(rinfo);
  });

  test('gets attr(from buffer)', () => {
    const msg = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '000c' + // length = 12byte = `c` as hex
      '2112a442' +
      '999999999999999999999999' +
      // MAPPED-ADDRESS
      '0001' + '0008' +
      '0001' + '3039' + '00000000',
    'hex');

    expect(msg.loadBuffer($buf)).toBeTruthy();
    expect(msg.getMappedAddressAttribute()).toEqual(rinfo);
  });
});

describe('set / getXorMappedAddressAttribute()', () => {
  const rinfo = {
    family: 'IPv4', port: 12345, address: '0.0.0.0'
  };

  test('sets attr', () => {
    const msg = StunMessage.createBindingRequest();
    // save length w/o header
    const len1 = msg.toBuffer().slice(20).length;

    msg.setXorMappedAddressAttribute(rinfo);
    const len2 = msg.toBuffer().slice(20).length;
    expect(len1).not.toBe(len2);
  });

  test('gets attr(from myself)', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.getXorMappedAddressAttribute()).toBeNull();

    msg.setXorMappedAddressAttribute(rinfo);
    expect(msg.getXorMappedAddressAttribute()).toEqual(rinfo);
  });

  test('gets attr(from buffer)', () => {
    const msg = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '000c' + // length = 12byte = `c` as hex
      '2112a442' +
      '999999999999999999999999' +
      // XOR-MAPPED-ADDRESS
      '0020' + '0008' +
      '0001' + '112b' + '2112a442',
    'hex');

    expect(msg.loadBuffer($buf)).toBeTruthy();
    expect(msg.getXorMappedAddressAttribute()).toEqual(rinfo);
  });
});

describe('set / getSoftwareAttribute()', () => {
  test('sets attr', () => {
    const msg = StunMessage.createBindingRequest();
    // save length w/o header
    const len1 = msg.toBuffer().slice(20).length;

    msg.setSoftwareAttribute('dummy');
    const len2 = msg.toBuffer().slice(20).length;
    expect(len1).not.toBe(len2);
  });

  test('gets attr(from myself)', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.getSoftwareAttribute()).toBeNull();

    msg.setSoftwareAttribute('dummy');
    expect(msg.getSoftwareAttribute()).toEqual({ value: 'dummy' });
  });

  test('gets attr(from buffer)', () => {
    const msg = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '000c' + // length = 12byte = `c` as hex
      '2112a442' +
      '999999999999999999999999' +
      // SOFTWARE
      '8022' + '0005' +
      '64756d6d79000000',
    'hex');

    expect(msg.loadBuffer($buf)).toBeTruthy();
    expect(msg.getSoftwareAttribute()).toEqual({ value: 'dummy' });
  });
});

describe('set / getUsernameAttribute()', () => {
  test('sets attr', () => {
    const msg = StunMessage.createBindingRequest();
    // save length w/o header
    const len1 = msg.toBuffer().slice(20).length;

    msg.setUsernameAttribute('dummy:user');
    const len2 = msg.toBuffer().slice(20).length;
    expect(len1).not.toBe(len2);
  });

  test('gets attr(from myself)', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.getUsernameAttribute()).toBeNull();

    msg.setUsernameAttribute('dummy:user');
    expect(msg.getUsernameAttribute()).toEqual({ value: 'dummy:user' });
  });

  test('gets attr(from buffer)', () => {
    const msg = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '0010' + // length = 16byte = `10` as hex
      '2112a442' +
      '999999999999999999999999' +
      // USERNAME
      '0006' + '000a' +
      '64756d6d793a757365720000',
    'hex');

    expect(msg.loadBuffer($buf)).toBeTruthy();
    expect(msg.getUsernameAttribute()).toEqual({ value: 'dummy:user' });
  });
});

describe('set / getMessageIntegrityAttribute()', () => {
  test('sets attr', () => {
    const msg = StunMessage.createBindingRequest();
    // save length w/o header
    const len1 = msg.toBuffer().slice(20).length;

    msg.setMessageIntegrityAttribute('dummy:integrity');
    const len2 = msg.toBuffer().slice(20).length;
    expect(len1).not.toBe(len2);
  });

  test('gets attr(from myself)', () => {
    const msg = StunMessage.createBindingRequest();
    expect(msg.getMessageIntegrityAttribute()).toBeNull();

    msg.setMessageIntegrityAttribute('dummy:integrity');
    expect(msg.getMessageIntegrityAttribute()).not.toBeNull();
  });

  test('gets attr(from buffer)', () => {
    const msg = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '0018' + // length = 24byte = `18` as hex
      '2112a442' +
      '999999999999999999999999' +
      // MESSAGE-INTEGRITY
      '0008' + '0014' +
      '9b3ec5409c692b9f13bac097b27231c2faee20d2',
    'hex');

    expect(msg.loadBuffer($buf)).toBeTruthy();
    expect(msg.getMessageIntegrityAttribute()).not.toBeNull();
  });
});

describe('toBuffer()', () => {
  test('extends length by adding attrs', () => {
    const msg = StunMessage.createBindingRequest();
    const len1 = msg.toBuffer().length;

    msg
      .setSoftwareAttribute('test')
      .setUsernameAttribute('test:user');
    const len2 = msg.toBuffer().length;

    expect(len1).not.toBe(len2);
  });
});

describe('loadBuffer()', () => {
  test('returns true for valid buffer', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '0000' +
      '2112a442' +
      '999999999999999999999999',
    'hex');

    expect(blank.loadBuffer($buf)).toBeTruthy();
  });

  test('returns true for valid buffer(valid attrs)', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '000c' + // length = 12byte = `c` as hex
      '2112a442' +
      '999999999999999999999999' +
      // MAPPED-ADDRESS
      '0001' + '0008' +
      '0001' + '3039' + '00000000',
    'hex');

    expect(blank.loadBuffer($buf)).toBeTruthy();
  });

  test('returns false for invalid buffer(first 2 bit is not 0)', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '9001' + '0000' +
      '2112a442' +
      '999999999999999999999999',
    'hex');

    expect(blank.loadBuffer($buf)).toBeFalsy();
  });

  test('returns false for invalid buffer(invalid header)', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '0000' +
      '88888888' +
      '999999999999999999999999',
    'hex');

    expect(blank.loadBuffer($buf)).toBeFalsy();
  });

  test('returns false for invalid buffer(wrong length)', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '0011' +
      '2112a442' +
      '999999999999999999999999',
    'hex');

    expect(blank.loadBuffer($buf)).toBeFalsy();
  });

  test('returns false for invalid buffer(invalid attrs)', () => {
    const blank = StunMessage.createBlank();
    const $buf = Buffer.from(
      '0001' + '000c' + // length = 12byte = `c` as hex
      '2112a442' +
      '999999999999999999999999' +
      // MAPPED-ADDRESS
      '0001' + '0000' + // invalid length
      '0001' + '3039' + '00000000',
    'hex');

    expect(blank.loadBuffer($buf)).toBeFalsy();
  });

  test('ignore duplicated attr', () => {
    const msg = StunMessage.createBindingRequest()
      .setSoftwareAttribute('test')
      .setSoftwareAttribute('test2');

    const blank = StunMessage.createBlank();
    expect(blank.loadBuffer(msg.toBuffer())).toBeTruthy();
    expect(blank.getSoftwareAttribute()).toEqual({ value: 'test' });
  });
});
