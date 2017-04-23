'use strict';

const assert = require('assert');
const Buffer = require('buffer').Buffer;
const BN = require('bn.js');
const ALPHA_START = 0x61;
const ALPHA_END = 0x7a;
const ALPHA_LEN = ALPHA_END - ALPHA_START + 1;

const KEY_SIZE = 32;

exports.stringify = function stringify(key, length) {
  assert.equal(key.length, KEY_SIZE, `Key must have length ${KEY_SIZE}`);
  const field = Math.floor(ALPHA_LEN * key.length / length);

  const alpha = [];
  const rest = new BN(0);

  const num = new BN(key);
  const mul = field - ALPHA_LEN + 1;
  while (num.cmpn(0) !== 0) {
    const mod = num.modn(field);
    num.idivn(field);

    rest.imuln(mul);
    if (mod < ALPHA_LEN) {
      alpha.push(String.fromCharCode(ALPHA_START + mod));
      rest.iaddn(mul - 1);
    } else {
      rest.iaddn(mod - ALPHA_LEN);
    }
  }
  const prefix = length === alpha.length ? alpha.join('') :
                 alpha.join('') + '/' + length;

  return '@' + prefix + '/' +
         rest.toArrayLike(Buffer).toString('base64').replace(/=+$/, '');
};

exports.parse = function parse(str) {
  const parts = str.match(/^@([a-z]*)\/(?:(\d+)\/)?(.*)$/);
  if (parts === null)
    throw new Error('Invalid id');

  const alpha = parts[1];
  const length = parts[2] === undefined ? alpha.length : parseInt(parts[2], 10);

  const out = new BN(0);
  const rest = new BN(Buffer.from(parts[3], 'base64'));

  const field = Math.floor(ALPHA_LEN * KEY_SIZE / length);
  const mul = field - ALPHA_LEN + 1;

  const num = new BN(0);
  let i = alpha.length - 1;
  while (rest.cmpn(0) !== 0) {
    const mod = rest.modn(mul);
    rest.idivn(mul);

    num.imuln(field);
    if (mod === mul - 1) {
      assert(i >= 0, 'Invalid encoding');
      const code = alpha.charCodeAt(i--);

      assert(ALPHA_START <= code && code <= ALPHA_END, 'Invalid encoding');
      num.iaddn(code - ALPHA_START);
    } else {
      num.iaddn(ALPHA_LEN + mod);
    }
  }

  return num.toArrayLike(Buffer);
};

exports.generate = function generate(desired, random, loose) {
  assert(/^[a-z]+$/.test(desired), '`desired` must have only a-z letters');
  const length = desired.length;
  const field = Math.floor(ALPHA_LEN * KEY_SIZE / length);
  const mul = field - ALPHA_LEN + 1;

  const codes = [];
  for (var i = 0; i < desired.length; i++)
    codes.push(desired.charCodeAt(i) - ALPHA_START);

  for (;;) {
    const key = random();
    const num = new BN(key);

    var i = 0;
    while (num.cmpn(0) !== 0) {
      const mod = num.modn(field);
      num.idivn(field);

      if (mod < ALPHA_LEN) {
        if (!loose && i >= codes.length) {
          i++;
          break;
        }
        if (mod !== codes[i])
          break;
        i++;
      }
    }

    if (num.cmpn(0) !== 0)
      continue;

    const complete = loose ? i >= codes.length : i === codes.length;
    if (complete)
      return key;
  }
};
