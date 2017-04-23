'use strict';

const assert = require('assert');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const id = require('../');

describe('ed25519-id', () => {
  it('should `stringify`', () => {
    const key = Buffer.from('oJacfu2sBNiu/LKIRGaXuPsixNjj7gCoLo+DTkRIROM=',
                            'base64');
    const str = id.stringify(key, 4);
    assert.equal(str, '@hype/FwfE6dwCnrevCrizqYtB+YaaXkD3znOPH+1JWrzT');
  });

  it('should `parse`', () => {
    const actual =
        id.parse('@hype/FwfE6dwCnrevCrizqYtB+YaaXkD3znOPH+1JWrzT');
    const key = Buffer.from('oJacfu2sBNiu/LKIRGaXuPsixNjj7gCoLo+DTkRIROM=',
                            'base64');
    assert.deepEqual(actual, key);
  });

  it('should `generate`', () => {
    const result = id.generate('hype', () => {
      return { publicKey: crypto.randomBytes(32) };
    });
    const str = id.stringify(result.publicKey, 4);

    assert(/^@hype/.test(str));
  });
});
