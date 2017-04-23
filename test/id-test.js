'use strict';

const assert = require('assert');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const id = require('../');

describe('ed25519-id', () => {
  it('should `stringify`', () => {
    const key = Buffer.from('1HCmj3BKjXwp2QnQHLh8jEIj90DY958Bov5m8uR8i6A=',
                            'base64');
    const str = id.stringify(key, 4);
    assert.equal(str, '@wut/GjKU55qeaSh8spnuIrv+tocCNFUTekxaR46f2kw+');
  });

  it('should `parse`', () => {
    const actual =
        id.parse('@wut/GjKU55qeaSh8spnuIrv+tocCNFUTekxaR46f2kw+');
    const key = Buffer.from('1HCmj3BKjXwp2QnQHLh8jEIj90DY958Bov5m8uR8i6A=',
                            'base64');
    assert.deepEqual(actual, key);
  });

  it('should `generate`', () => {
    const result = id.generate('wut', () => {
      return { publicKey: crypto.randomBytes(32) };
    });
    const str = id.stringify(result.publicKey, 4);

    assert(/^@wut\//.test(str));
  });
});
