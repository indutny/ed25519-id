'use strict';

const assert = require('assert');
const Buffer = require('buffer').Buffer;
const BN = require('bn.js');
const ALPHA_START = 0x61;
const ALPHA_END = 0x7a;
const ALPHA_LEN = ALPHA_END - ALPHA_START + 1;

const KEY_SIZE = 32;

exports.stringify = function stringify(key) {
  assert.equal(key.length, KEY_SIZE, `Key must have length ${KEY_SIZE}`);

  const alpha = [];

  const num = new BN(key);
  for (;;) {
    const mod = num.modn(ALPHA_LEN + 1);
    num.idivn(ALPHA_LEN + 1);
    if (mod === 0)
      break;
    alpha.push(String.fromCharCode(ALPHA_START + mod - 1));
  }

  return '@' + alpha.join('') + '/' +
         num.toArrayLike(Buffer).toString('base64').replace(/=+$/, '');
};

exports.parse = function parse(str) {
  const parts = str.match(/^@([a-z]*)\/(.*)$/);
  if (parts === null)
    throw new Error('Invalid id');

  const alpha = parts[1];

  const out = new BN(Buffer.from(parts[2], 'base64'));

  out.imuln(ALPHA_LEN + 1);
  out.iaddn(0);

  for (var i = alpha.length - 1; i >= 0; i--) {
    out.imuln(ALPHA_LEN + 1);
    out.iaddn(alpha.charCodeAt(i) - ALPHA_START + 1);
  }

  return out.toArrayLike(Buffer);
};

exports.generate = function generate(desired, random) {
  assert(/^[a-z]+$/.test(desired), '`desired` must have only a-z letters');
  const length = desired.length;

  const codes = [];
  for (var i = 0; i < desired.length; i++)
    codes.push(desired.charCodeAt(i) - ALPHA_START);

  for (;;) {
    const pair = random();
    const key = pair.publicKey;
    const num = new BN(key);

    const actual = [];
    for (;;) {
      const mod = num.modn(ALPHA_LEN + 1);
      num.idivn(ALPHA_LEN + 1);
      if (mod === 0)
        break;
      actual.push(mod - 1);
    }

    if (actual.length !== codes.length)
      continue;

    for (var i = 0; i < actual.length; i++)
      if (actual[i] !== codes[i])
        break;

    if (i === actual.length)
      return pair;
  }
};
