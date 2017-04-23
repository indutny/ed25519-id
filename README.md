# ed25519-id

Human-readable representation of [ed22519][0] public keys.

## Usage

```js
const id = require('ed25519-id');

const key = Buffer.from(
    '2c927a6f3e25e57c2724344a493c1152dd62b931afc29fbfde1bfdf146732519',
    'hex');
id.stringify(key, 4); // 'hype/WqEJTB5pRmVs9dfaiuRYgOYEkmkOMXxI0vp8QIr2Sg'

id.parse('hype/WqEJTB5pRmVs9dfaiuRYgOYEkmkOMXxI0vp8QIr2Sg'); // key

const pair = id.generate('hype', () => genRandomKeyPair());
// NOTE: `genRandomKeyPair()` must return { publicKey: ... }
// `pair` is an intact result of `genRandomKeyPair()`
```

## LICENSE

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2017.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: https://en.wikipedia.org/wiki/EdDSA#Ed25519
