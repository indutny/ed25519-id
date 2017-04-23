'use strict';

const assert = require('assert');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const id = require('../');

describe('hyperid', () => {
  it('should `stringify`', () => {
    const key = Buffer.from('5Ft+lgiH59sQk83zaMD2iXXRx9W6LqtRBLm+IZ8/mtk=',
                            'base64');
    const str = id.stringify(key, 5);
    assert.equal(str, '@botbk/6zKTUUZDiIvfZLwqaa3CcmdHTsus5HueWaglU78dyw');
  });

  it('should `parse`', () => {
    const actual =
        id.parse('@botbk/6zKTUUZDiIvfZLwqaa3CcmdHTsus5HueWaglU78dyw');
    const key = Buffer.from('5Ft+lgiH59sQk83zaMD2iXXRx9W6LqtRBLm+IZ8/mtk=',
                            'base64');
    assert.deepEqual(actual, key);
  });

  it('should strict `generate`', () => {
    const key = id.generate('ok', () => crypto.randomBytes(32));
    const str = id.stringify(key, 2);

    assert(/^@ok\//.test(str));
  });

  it('should loose `generate`', () => {
    const key = id.generate('hype', () => crypto.randomBytes(32), true);
    const str = id.stringify(key, 4);

    assert(/^@hype/.test(str));
  });
});
