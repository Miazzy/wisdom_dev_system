const sha256 = (ascii) => {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j; // Used as a counter across the whole file
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 prime numbers
  let hash = (sha256.h = sha256.h || []);
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 prime numbers
  const k = (sha256.k = sha256.k || []);
  let primeCounter = k[lengthProperty];
  /*/
  var hash = [], k = [];
  var primeCounter = 0;
  //*/

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80'; // Append '1' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00'; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // Process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    const oldHash = hash;
    // This is now the undefined working hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      // Expand the message into 64 words
      // Used below if
      const w15 = w[i - 15],
        w2 = w[i - 2];

      // Iterate
      const a = hash[0],
        e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // we don't bother to truncate this array
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : '') + b.toString(16);
    }
  }
  return result;
};

function d(n, t) {
  const r = (65535 & n) + (65535 & t);
  return (((n >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
}

function f(n, t, r, e, o, u) {
  return d(
    (function (n, t) {
      return (n << t) | (n >>> (32 - t));
    })(d(d(t, n), d(e, u)), o),
    r,
  );
}

function l(n, t, r, e, o, u, c) {
  return f((t & r) | (~t & e), n, t, o, u, c);
}

function g(n, t, r, e, o, u, c) {
  return f((t & e) | (r & ~e), n, t, o, u, c);
}

function v(n, t, r, e, o, u, c) {
  return f(t ^ r ^ e, n, t, o, u, c);
}

function m(n, t, r, e, o, u, c) {
  return f(r ^ (t | ~e), n, t, o, u, c);
}

function i(n, t) {
  let r, e, o, u, c;
  (n[t >> 5] |= 128 << t % 32), (n[14 + (((t + 64) >>> 9) << 4)] = t);
  let f = 1732584193,
    i = -271733879,
    a = -1732584194,
    h = 271733878;
  for (r = 0; r < n.length; r += 16)
    (i = m(
      (i = m(
        (i = m(
          (i = m(
            (i = v(
              (i = v(
                (i = v(
                  (i = v(
                    (i = g(
                      (i = g(
                        (i = g(
                          (i = g(
                            (i = l(
                              (i = l(
                                (i = l(
                                  (i = l(
                                    (o = i),
                                    (a = l(
                                      (u = a),
                                      (h = l(
                                        (c = h),
                                        (f = l((e = f), i, a, h, n[r], 7, -680876936)),
                                        i,
                                        a,
                                        n[r + 1],
                                        12,
                                        -389564586,
                                      )),
                                      f,
                                      i,
                                      n[r + 2],
                                      17,
                                      606105819,
                                    )),
                                    h,
                                    f,
                                    n[r + 3],
                                    22,
                                    -1044525330,
                                  )),
                                  (a = l(
                                    a,
                                    (h = l(
                                      h,
                                      (f = l(f, i, a, h, n[r + 4], 7, -176418897)),
                                      i,
                                      a,
                                      n[r + 5],
                                      12,
                                      1200080426,
                                    )),
                                    f,
                                    i,
                                    n[r + 6],
                                    17,
                                    -1473231341,
                                  )),
                                  h,
                                  f,
                                  n[r + 7],
                                  22,
                                  -45705983,
                                )),
                                (a = l(
                                  a,
                                  (h = l(
                                    h,
                                    (f = l(f, i, a, h, n[r + 8], 7, 1770035416)),
                                    i,
                                    a,
                                    n[r + 9],
                                    12,
                                    -1958414417,
                                  )),
                                  f,
                                  i,
                                  n[r + 10],
                                  17,
                                  -42063,
                                )),
                                h,
                                f,
                                n[r + 11],
                                22,
                                -1990404162,
                              )),
                              (a = l(
                                a,
                                (h = l(
                                  h,
                                  (f = l(f, i, a, h, n[r + 12], 7, 1804603682)),
                                  i,
                                  a,
                                  n[r + 13],
                                  12,
                                  -40341101,
                                )),
                                f,
                                i,
                                n[r + 14],
                                17,
                                -1502002290,
                              )),
                              h,
                              f,
                              n[r + 15],
                              22,
                              1236535329,
                            )),
                            (a = g(
                              a,
                              (h = g(
                                h,
                                (f = g(f, i, a, h, n[r + 1], 5, -165796510)),
                                i,
                                a,
                                n[r + 6],
                                9,
                                -1069501632,
                              )),
                              f,
                              i,
                              n[r + 11],
                              14,
                              643717713,
                            )),
                            h,
                            f,
                            n[r],
                            20,
                            -373897302,
                          )),
                          (a = g(
                            a,
                            (h = g(
                              h,
                              (f = g(f, i, a, h, n[r + 5], 5, -701558691)),
                              i,
                              a,
                              n[r + 10],
                              9,
                              38016083,
                            )),
                            f,
                            i,
                            n[r + 15],
                            14,
                            -660478335,
                          )),
                          h,
                          f,
                          n[r + 4],
                          20,
                          -405537848,
                        )),
                        (a = g(
                          a,
                          (h = g(
                            h,
                            (f = g(f, i, a, h, n[r + 9], 5, 568446438)),
                            i,
                            a,
                            n[r + 14],
                            9,
                            -1019803690,
                          )),
                          f,
                          i,
                          n[r + 3],
                          14,
                          -187363961,
                        )),
                        h,
                        f,
                        n[r + 8],
                        20,
                        1163531501,
                      )),
                      (a = g(
                        a,
                        (h = g(
                          h,
                          (f = g(f, i, a, h, n[r + 13], 5, -1444681467)),
                          i,
                          a,
                          n[r + 2],
                          9,
                          -51403784,
                        )),
                        f,
                        i,
                        n[r + 7],
                        14,
                        1735328473,
                      )),
                      h,
                      f,
                      n[r + 12],
                      20,
                      -1926607734,
                    )),
                    (a = v(
                      a,
                      (h = v(
                        h,
                        (f = v(f, i, a, h, n[r + 5], 4, -378558)),
                        i,
                        a,
                        n[r + 8],
                        11,
                        -2022574463,
                      )),
                      f,
                      i,
                      n[r + 11],
                      16,
                      1839030562,
                    )),
                    h,
                    f,
                    n[r + 14],
                    23,
                    -35309556,
                  )),
                  (a = v(
                    a,
                    (h = v(
                      h,
                      (f = v(f, i, a, h, n[r + 1], 4, -1530992060)),
                      i,
                      a,
                      n[r + 4],
                      11,
                      1272893353,
                    )),
                    f,
                    i,
                    n[r + 7],
                    16,
                    -155497632,
                  )),
                  h,
                  f,
                  n[r + 10],
                  23,
                  -1094730640,
                )),
                (a = v(
                  a,
                  (h = v(
                    h,
                    (f = v(f, i, a, h, n[r + 13], 4, 681279174)),
                    i,
                    a,
                    n[r],
                    11,
                    -358537222,
                  )),
                  f,
                  i,
                  n[r + 3],
                  16,
                  -722521979,
                )),
                h,
                f,
                n[r + 6],
                23,
                76029189,
              )),
              (a = v(
                a,
                (h = v(
                  h,
                  (f = v(f, i, a, h, n[r + 9], 4, -640364487)),
                  i,
                  a,
                  n[r + 12],
                  11,
                  -421815835,
                )),
                f,
                i,
                n[r + 15],
                16,
                530742520,
              )),
              h,
              f,
              n[r + 2],
              23,
              -995338651,
            )),
            (a = m(
              a,
              (h = m(h, (f = m(f, i, a, h, n[r], 6, -198630844)), i, a, n[r + 7], 10, 1126891415)),
              f,
              i,
              n[r + 14],
              15,
              -1416354905,
            )),
            h,
            f,
            n[r + 5],
            21,
            -57434055,
          )),
          (a = m(
            a,
            (h = m(
              h,
              (f = m(f, i, a, h, n[r + 12], 6, 1700485571)),
              i,
              a,
              n[r + 3],
              10,
              -1894986606,
            )),
            f,
            i,
            n[r + 10],
            15,
            -1051523,
          )),
          h,
          f,
          n[r + 1],
          21,
          -2054922799,
        )),
        (a = m(
          a,
          (h = m(h, (f = m(f, i, a, h, n[r + 8], 6, 1873313359)), i, a, n[r + 15], 10, -30611744)),
          f,
          i,
          n[r + 6],
          15,
          -1560198380,
        )),
        h,
        f,
        n[r + 13],
        21,
        1309151649,
      )),
      (a = m(
        a,
        (h = m(h, (f = m(f, i, a, h, n[r + 4], 6, -145523070)), i, a, n[r + 11], 10, -1120210379)),
        f,
        i,
        n[r + 2],
        15,
        718787259,
      )),
      h,
      f,
      n[r + 9],
      21,
      -343485551,
    )),
      (f = d(f, e)),
      (i = d(i, o)),
      (a = d(a, u)),
      (h = d(h, c));
  return [f, i, a, h];
}

function a(n) {
  let t,
    r = '',
    e = 32 * n.length;
  for (t = 0; t < e; t += 8) r += String.fromCharCode((n[t >> 5] >>> t % 32) & 255);
  return r;
}

function h(n) {
  let t,
    r = [];
  for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) r[t] = 0;
  const e = 8 * n.length;
  for (t = 0; t < e; t += 8) r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
  return r;
}

function e(n) {
  let t,
    r,
    e = '0123456789abcdef',
    o = '';
  for (r = 0; r < n.length; r += 1)
    (t = n.charCodeAt(r)), (o += e.charAt((t >>> 4) & 15) + e.charAt(15 & t));
  return o;
}

function r(n) {
  return unescape(encodeURIComponent(n));
}

function o(n) {
  return (function (n) {
    return a(i(h(n), 8 * n.length));
  })(r(n));
}

function u(n, t) {
  return (function (n, t) {
    let r,
      e,
      o = h(n),
      u = [],
      c = [];
    for (u[15] = c[15] = void 0, 16 < o.length && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)
      (u[r] = 909522486 ^ o[r]), (c[r] = 1549556828 ^ o[r]);
    return (e = i(u.concat(h(t)), 512 + 8 * t.length)), a(i(c.concat(e), 640));
  })(r(n), r(t));
}

const md5 = (n, t, r) => {
  return t
    ? r
      ? u(t, n)
      : (function (n, t) {
          return e(u(n, t));
        })(t, n)
    : r
    ? o(n)
    : (function (n) {
        return e(o(n));
      })(n);
};

export { sha256, md5 };
