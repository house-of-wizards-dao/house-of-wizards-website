import { A as e, B as t, D as n, E as r, F as i, L as a, M as o, N as s, O as c, P as l, R as u, T as d, _ as f, a as p, b as m, c as h, d as g, f as _, g as v, h as y, i as b, j as x, k as S, l as C, m as w, n as T, o as E, p as ee, r as D, s as O, t as k, u as te, v as A, y as j } from "./utils-B3UcVIi5.js";
//#region node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js
function M(e, t, n, r) {
	if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
	let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
	e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
}
function ne(e, t, n) {
	return e & t ^ ~e & n;
}
function N(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var re = class extends r {
	constructor(e, t, n, r) {
		super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = i(this.buffer);
	}
	update(e) {
		c(this), e = t(e), n(e);
		let { view: r, buffer: a, blockLen: o } = this, s = e.length;
		for (let t = 0; t < s;) {
			let n = Math.min(o - this.pos, s - t);
			if (n === o) {
				let n = i(e);
				for (; o <= s - t; t += o) this.process(n, t);
				continue;
			}
			a.set(e.subarray(t, t + n), this.pos), this.pos += n, t += n, this.pos === o && (this.process(r, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		c(this), x(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: a } = this, { pos: s } = this;
		t[s++] = 128, o(this.buffer.subarray(s)), this.padOffset > r - s && (this.process(n, 0), s = 0);
		for (let e = s; e < r; e++) t[e] = 0;
		M(n, r - 8, BigInt(this.length * 8), a), this.process(n, 0);
		let l = i(e), u = this.outputLen;
		if (u % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
		let d = u / 4, f = this.get();
		if (d > f.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < d; e++) l.setUint32(4 * e, f[e], a);
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
	_cloneInto(e) {
		e ||= new this.constructor(), e.set(...this.get());
		let { blockLen: t, buffer: n, length: r, finished: i, destroyed: a, pos: o } = this;
		return e.destroyed = a, e.finished = i, e.length = r, e.pos = o, r % t && e.buffer.set(n), e;
	}
	clone() {
		return this._cloneInto();
	}
}, P = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), ie = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), F = /* @__PURE__ */ new Uint32Array(64), ae = class extends re {
	constructor(e = 32) {
		super(64, e, 8, !1), this.A = P[0] | 0, this.B = P[1] | 0, this.C = P[2] | 0, this.D = P[3] | 0, this.E = P[4] | 0, this.F = P[5] | 0, this.G = P[6] | 0, this.H = P[7] | 0;
	}
	get() {
		let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s
		];
	}
	set(e, t, n, r, i, a, o, s) {
		this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) F[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = F[e - 15], n = F[e - 2], r = u(t, 7) ^ u(t, 18) ^ t >>> 3;
			F[e] = (u(n, 17) ^ u(n, 19) ^ n >>> 10) + F[e - 7] + r + F[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = u(o, 6) ^ u(o, 11) ^ u(o, 25), d = l + t + ne(o, s, c) + ie[e] + F[e] | 0, f = (u(n, 2) ^ u(n, 13) ^ u(n, 22)) + N(n, r, i) | 0;
			l = c, c = s, s = o, o = a + d | 0, a = i, i = r, r = n, n = d + f | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		o(F);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), o(this.buffer);
	}
}, oe = d((/* @__PURE__ */ "0x428a2f98d728ae22.0x7137449123ef65cd.0xb5c0fbcfec4d3b2f.0xe9b5dba58189dbbc.0x3956c25bf348b538.0x59f111f1b605d019.0x923f82a4af194f9b.0xab1c5ed5da6d8118.0xd807aa98a3030242.0x12835b0145706fbe.0x243185be4ee4b28c.0x550c7dc3d5ffb4e2.0x72be5d74f27b896f.0x80deb1fe3b1696b1.0x9bdc06a725c71235.0xc19bf174cf692694.0xe49b69c19ef14ad2.0xefbe4786384f25e3.0x0fc19dc68b8cd5b5.0x240ca1cc77ac9c65.0x2de92c6f592b0275.0x4a7484aa6ea6e483.0x5cb0a9dcbd41fbd4.0x76f988da831153b5.0x983e5152ee66dfab.0xa831c66d2db43210.0xb00327c898fb213f.0xbf597fc7beef0ee4.0xc6e00bf33da88fc2.0xd5a79147930aa725.0x06ca6351e003826f.0x142929670a0e6e70.0x27b70a8546d22ffc.0x2e1b21385c26c926.0x4d2c6dfc5ac42aed.0x53380d139d95b3df.0x650a73548baf63de.0x766a0abb3c77b2a8.0x81c2c92e47edaee6.0x92722c851482353b.0xa2bfe8a14cf10364.0xa81a664bbc423001.0xc24b8b70d0f89791.0xc76c51a30654be30.0xd192e819d6ef5218.0xd69906245565a910.0xf40e35855771202a.0x106aa07032bbd1b8.0x19a4c116b8d2d0c8.0x1e376c085141ab53.0x2748774cdf8eeb99.0x34b0bcb5e19b48a8.0x391c0cb3c5c95a63.0x4ed8aa4ae3418acb.0x5b9cca4f7763e373.0x682e6ff3d6b2b8a3.0x748f82ee5defb2fc.0x78a5636f43172f60.0x84c87814a1f0ab72.0x8cc702081a6439ec.0x90befffa23631e28.0xa4506cebde82bde9.0xbef9a3f7b2c67915.0xc67178f2e372532b.0xca273eceea26619c.0xd186b8c721c0c207.0xeada7dd6cde0eb1e.0xf57d4f7fee6ed178.0x06f067aa72176fba.0x0a637dc5a2c898a6.0x113f9804bef90dae.0x1b710b35131c471b.0x28db77f523047d84.0x32caab7b40c72493.0x3c9ebe0a15c9bebc.0x431d67c49c100d4c.0x4cc5d4becb3e42b6.0x597f299cfc657e2a.0x5fcb6fab3ad6faec.0x6c44198c4a475817".split(".")).map((e) => BigInt(e)));
oe[0], oe[1];
var se = /* @__PURE__ */ l(() => new ae()), ce = class extends r {
	constructor(e, n) {
		super(), this.finished = !1, this.destroyed = !1, S(e);
		let r = t(n);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let i = this.blockLen, a = new Uint8Array(i);
		a.set(r.length > i ? e.create().update(r).digest() : r);
		for (let e = 0; e < a.length; e++) a[e] ^= 54;
		this.iHash.update(a), this.oHash = e.create();
		for (let e = 0; e < a.length; e++) a[e] ^= 106;
		this.oHash.update(a), o(a);
	}
	update(e) {
		return c(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		c(this), n(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		let e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e ||= Object.create(Object.getPrototypeOf(this), {});
		let { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: a, outputLen: o } = this;
		return e = e, e.finished = r, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
}, le = (e, t, n) => new ce(e, t).update(n).digest();
le.create = (e, t) => new ce(e, t);
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/modular.js
var I = BigInt(0), L = BigInt(1), R = /* @__PURE__ */ BigInt(2), ue = /* @__PURE__ */ BigInt(3), de = /* @__PURE__ */ BigInt(4), fe = /* @__PURE__ */ BigInt(5), pe = /* @__PURE__ */ BigInt(8);
function z(e, t) {
	let n = e % t;
	return n >= I ? n : t + n;
}
function B(e, t, n) {
	let r = e;
	for (; t-- > I;) r *= r, r %= n;
	return r;
}
function V(e, t) {
	if (e === I) throw Error("invert: expected non-zero number");
	if (t <= I) throw Error("invert: expected positive modulus, got " + t);
	let n = z(e, t), r = t, i = I, a = L, o = L, s = I;
	for (; n !== I;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== L) throw Error("invert: does not exist");
	return z(i, t);
}
function me(e, t) {
	let n = (e.ORDER + L) / de, r = e.pow(t, n);
	if (!e.eql(e.sqr(r), t)) throw Error("Cannot find square root");
	return r;
}
function he(e, t) {
	let n = (e.ORDER - fe) / pe, r = e.mul(t, R), i = e.pow(r, n), a = e.mul(t, i), o = e.mul(e.mul(a, R), i), s = e.mul(a, e.sub(o, e.ONE));
	if (!e.eql(e.sqr(s), t)) throw Error("Cannot find square root");
	return s;
}
function ge(e) {
	if (e < BigInt(3)) throw Error("sqrt is not defined for small field");
	let t = e - L, n = 0;
	for (; t % R === I;) t /= R, n++;
	let r = R, i = U(e);
	for (; xe(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return me;
	let a = i.pow(r, t), o = (t + L) / R;
	return function(e, r) {
		if (e.is0(r)) return r;
		if (xe(e, r) !== 1) throw Error("Cannot find square root");
		let i = n, s = e.mul(e.ONE, a), c = e.pow(r, t), l = e.pow(r, o);
		for (; !e.eql(c, e.ONE);) {
			if (e.is0(c)) return e.ZERO;
			let t = 1, n = e.sqr(c);
			for (; !e.eql(n, e.ONE);) if (t++, n = e.sqr(n), t === i) throw Error("Cannot find square root");
			let r = L << BigInt(i - t - 1), a = e.pow(s, r);
			i = t, s = e.sqr(a), c = e.mul(c, s), l = e.mul(l, a);
		}
		return l;
	};
}
function _e(e) {
	return e % de === ue ? me : e % pe === fe ? he : ge(e);
}
var ve = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function ye(e) {
	return m(e, ve.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}));
}
function be(e, t, n) {
	if (n < I) throw Error("invalid exponent, negatives unsupported");
	if (n === I) return e.ONE;
	if (n === L) return t;
	let r = e.ONE, i = t;
	for (; n > I;) n & L && (r = e.mul(r, i)), i = e.sqr(i), n >>= L;
	return r;
}
function H(e, t, n = !1) {
	let r = Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE), a = e.inv(i);
	return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), a), r;
}
function xe(e, t) {
	let n = (e.ORDER - L) / R, r = e.pow(t, n), i = e.eql(r, e.ONE), a = e.eql(r, e.ZERO), o = e.eql(r, e.neg(e.ONE));
	if (!i && !a && !o) throw Error("invalid Legendre symbol result");
	return i ? 1 : a ? 0 : -1;
}
function Se(t, n) {
	n !== void 0 && e(n);
	let r = n === void 0 ? t.toString(2).length : n;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
function U(e, t, n = !1, r = {}) {
	if (e <= I) throw Error("invalid field: expected ORDER > 0, got " + e);
	let { nBitLength: i, nByteLength: a } = Se(e, t);
	if (a > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
	let o, s = Object.freeze({
		ORDER: e,
		isLE: n,
		BITS: i,
		BYTES: a,
		MASK: p(i),
		ZERO: I,
		ONE: L,
		create: (t) => z(t, e),
		isValid: (t) => {
			if (typeof t != "bigint") throw Error("invalid field element: expected bigint, got " + typeof t);
			return I <= t && t < e;
		},
		is0: (e) => e === I,
		isOdd: (e) => (e & L) === L,
		neg: (t) => z(-t, e),
		eql: (e, t) => e === t,
		sqr: (t) => z(t * t, e),
		add: (t, n) => z(t + n, e),
		sub: (t, n) => z(t - n, e),
		mul: (t, n) => z(t * n, e),
		pow: (e, t) => be(s, e, t),
		div: (t, n) => z(t * V(n, e), e),
		sqrN: (e) => e * e,
		addN: (e, t) => e + t,
		subN: (e, t) => e - t,
		mulN: (e, t) => e * t,
		inv: (t) => V(t, e),
		sqrt: r.sqrt || ((t) => (o ||= _e(e), o(s, t))),
		toBytes: (e) => n ? f(e, a) : v(e, a),
		fromBytes: (e) => {
			if (e.length !== a) throw Error("Field.fromBytes: expected " + a + " bytes, got " + e.length);
			return n ? h(e) : O(e);
		},
		invertBatch: (e) => H(s, e),
		cmov: (e, t, n) => n ? t : e
	});
	return Object.freeze(s);
}
function Ce(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function we(e) {
	let t = Ce(e);
	return t + Math.ceil(t / 2);
}
function Te(e, t, n = !1) {
	let r = e.length, i = Ce(t), a = we(t);
	if (r < 16 || r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = z(n ? h(e) : O(e), t - L) + L;
	return n ? f(o, i) : v(o, i);
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var Ee = O;
function W(e, t) {
	if (G(e), G(t), e < 0 || e >= 1 << 8 * t) throw Error("invalid I2OSP input: " + e);
	let n = Array.from({ length: t }).fill(0);
	for (let r = t - 1; r >= 0; r--) n[r] = e & 255, e >>>= 8;
	return new Uint8Array(n);
}
function De(e, t) {
	let n = new Uint8Array(e.length);
	for (let r = 0; r < e.length; r++) n[r] = e[r] ^ t[r];
	return n;
}
function G(e) {
	if (!Number.isSafeInteger(e)) throw Error("number expected");
}
function Oe(e, t, n, r) {
	D(e), D(t), G(n), t.length > 255 && (t = r(C(j("H2C-OVERSIZE-DST-"), t)));
	let { outputLen: i, blockLen: a } = r, o = Math.ceil(n / i);
	if (n > 65535 || o > 255) throw Error("expand_message_xmd: invalid lenInBytes");
	let s = C(t, W(t.length, 1)), c = W(0, a), l = W(n, 2), u = Array(o), d = r(C(c, e, l, W(0, 1), s));
	u[0] = r(C(d, W(1, 1), s));
	for (let e = 1; e <= o; e++) u[e] = r(C(De(d, u[e - 1]), W(e + 1, 1), s));
	return C(...u).slice(0, n);
}
function ke(e, t, n, r, i) {
	if (D(e), D(t), G(n), t.length > 255) {
		let e = Math.ceil(2 * r / 8);
		t = i.create({ dkLen: e }).update(j("H2C-OVERSIZE-DST-")).update(t).digest();
	}
	if (n > 65535 || t.length > 255) throw Error("expand_message_xof: invalid lenInBytes");
	return i.create({ dkLen: n }).update(e).update(W(n, 2)).update(t).update(W(t.length, 1)).digest();
}
function Ae(e, t, n) {
	m(n, {
		DST: "stringOrUint8Array",
		p: "bigint",
		m: "isSafeInteger",
		k: "isSafeInteger",
		hash: "hash"
	});
	let { p: r, k: i, m: a, hash: o, expand: s, DST: c } = n;
	D(e), G(t);
	let l = typeof c == "string" ? j(c) : c, u = r.toString(2).length, d = Math.ceil((u + i) / 8), f = t * a * d, p;
	if (s === "xmd") p = Oe(e, l, f, o);
	else if (s === "xof") p = ke(e, l, f, i, o);
	else if (s === "_internal_pass") p = e;
	else throw Error("expand must be \"xmd\" or \"xof\"");
	let h = Array(t);
	for (let e = 0; e < t; e++) {
		let t = Array(a);
		for (let n = 0; n < a; n++) {
			let i = d * (n + e * a);
			t[n] = z(Ee(p.subarray(i, i + d)), r);
		}
		h[e] = t;
	}
	return h;
}
function je(e, t) {
	let n = t.map((e) => Array.from(e).reverse());
	return (t, r) => {
		let [i, a, o, s] = n.map((n) => n.reduce((n, r) => e.add(e.mul(n, t), r))), [c, l] = H(e, [a, s], !0);
		return t = e.mul(i, c), r = e.mul(r, e.mul(o, l)), {
			x: t,
			y: r
		};
	};
}
function Me(e, t, n) {
	if (typeof t != "function") throw Error("mapToCurve() must be defined");
	function r(n) {
		return e.fromAffine(t(n));
	}
	function i(t) {
		let n = t.clearCofactor();
		return n.equals(e.ZERO) ? e.ZERO : (n.assertValidity(), n);
	}
	return {
		defaults: n,
		hashToCurve(e, t) {
			let a = Ae(e, 2, {
				...n,
				DST: n.DST,
				...t
			}), o = r(a[0]), s = r(a[1]);
			return i(o.add(s));
		},
		encodeToCurve(e, t) {
			return i(r(Ae(e, 1, {
				...n,
				DST: n.encodeDST,
				...t
			})[0]));
		},
		mapToCurve(e) {
			if (!Array.isArray(e)) throw Error("expected array of bigints");
			for (let t of e) if (typeof t != "bigint") throw Error("expected array of bigints");
			return i(r(e));
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/curve.js
var Ne = BigInt(0), K = BigInt(1);
function Pe(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Fe(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Ie(e, t) {
	Fe(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: p(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function Le(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += K);
	let l = t * r, u = l + Math.abs(s) - 1, d = s === 0, f = s < 0, p = t % 2 != 0;
	return {
		nextN: c,
		offset: u,
		isZero: d,
		isNeg: f,
		isNegF: p,
		offsetF: l
	};
}
function Re(e, t) {
	if (!Array.isArray(e)) throw Error("array expected");
	e.forEach((e, n) => {
		if (!(e instanceof t)) throw Error("invalid point at index " + n);
	});
}
function ze(e, t) {
	if (!Array.isArray(e)) throw Error("array of scalars expected");
	e.forEach((e, n) => {
		if (!t.isValid(e)) throw Error("invalid scalar at index " + n);
	});
}
var Be = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap();
function He(e) {
	return Ve.get(e) || 1;
}
function Ue(e, t) {
	return {
		constTimeNegate: Pe,
		hasPrecomputes(e) {
			return He(e) !== 1;
		},
		unsafeLadder(t, n, r = e.ZERO) {
			let i = t;
			for (; n > Ne;) n & K && (r = r.add(i)), i = i.double(), n >>= K;
			return r;
		},
		precomputeWindow(e, n) {
			let { windows: r, windowSize: i } = Ie(n, t), a = [], o = e, s = o;
			for (let e = 0; e < r; e++) {
				s = o, a.push(s);
				for (let e = 1; e < i; e++) s = s.add(o), a.push(s);
				o = s.double();
			}
			return a;
		},
		wNAF(n, r, i) {
			let a = e.ZERO, o = e.BASE, s = Ie(n, t);
			for (let e = 0; e < s.windows; e++) {
				let { nextN: t, offset: n, isZero: c, isNeg: l, isNegF: u, offsetF: d } = Le(i, e, s);
				i = t, c ? o = o.add(Pe(u, r[d])) : a = a.add(Pe(l, r[n]));
			}
			return {
				p: a,
				f: o
			};
		},
		wNAFUnsafe(n, r, i, a = e.ZERO) {
			let o = Ie(n, t);
			for (let e = 0; e < o.windows && i !== Ne; e++) {
				let { nextN: t, offset: n, isZero: s, isNeg: c } = Le(i, e, o);
				if (i = t, !s) {
					let e = r[n];
					a = a.add(c ? e.negate() : e);
				}
			}
			return a;
		},
		getPrecomputes(e, t, n) {
			let r = Be.get(t);
			return r || (r = this.precomputeWindow(t, e), e !== 1 && Be.set(t, n(r))), r;
		},
		wNAFCached(e, t, n) {
			let r = He(e);
			return this.wNAF(r, this.getPrecomputes(r, e, n), t);
		},
		wNAFCachedUnsafe(e, t, n, r) {
			let i = He(e);
			return i === 1 ? this.unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
		},
		setWindowSize(e, n) {
			Fe(n, t), Ve.set(e, n), Be.delete(e);
		}
	};
}
function We(e, t, n, r) {
	Re(n, e), ze(r, t);
	let i = n.length, a = r.length;
	if (i !== a) throw Error("arrays of points and scalars must have equal length");
	let o = e.ZERO, s = b(BigInt(i)), c = 1;
	s > 12 ? c = s - 3 : s > 4 ? c = s - 2 : s > 0 && (c = 2);
	let l = p(c), u = Array(Number(l) + 1).fill(o), d = Math.floor((t.BITS - 1) / c) * c, f = o;
	for (let e = d; e >= 0; e -= c) {
		u.fill(o);
		for (let t = 0; t < a; t++) {
			let i = r[t], a = Number(i >> BigInt(e) & l);
			u[a] = u[a].add(n[t]);
		}
		let t = o;
		for (let e = u.length - 1, n = o; e > 0; e--) n = n.add(u[e]), t = t.add(n);
		if (f = f.add(t), e !== 0) for (let e = 0; e < c; e++) f = f.double();
	}
	return f;
}
function Ge(e) {
	return ye(e.Fp), m(e, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	}), Object.freeze({
		...Se(e.n, e.nBitLength),
		...e,
		p: e.Fp.ORDER
	});
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/weierstrass.js
function Ke(e) {
	e.lowS !== void 0 && T("lowS", e.lowS), e.prehash !== void 0 && T("prehash", e.prehash);
}
function qe(e) {
	let t = Ge(e);
	m(t, {
		a: "field",
		b: "field"
	}, {
		allowInfinityPoint: "boolean",
		allowedPrivateKeyLengths: "array",
		clearCofactor: "function",
		fromBytes: "function",
		isTorsionFree: "function",
		toBytes: "function",
		wrapPrivateKey: "boolean"
	});
	let { endo: n, Fp: r, a: i } = t;
	if (n) {
		if (!r.eql(i, r.ZERO)) throw Error("invalid endo: CURVE.a must be 0");
		if (typeof n != "object" || typeof n.beta != "bigint" || typeof n.splitScalar != "function") throw Error("invalid endo: expected \"beta\": bigint and \"splitScalar\": function");
	}
	return Object.freeze({ ...t });
}
var q = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = q;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = A(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? A(i.length / 2 | 128) : "";
			return A(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = q, r = 0;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length < 2 || t[r++] !== e) throw new n("tlv.decode: wrong tlv");
			let i = t[r++], a = !!(i & 128), o = 0;
			if (!a) o = i;
			else {
				let e = i & 127;
				if (!e) throw new n("tlv.decode(long): indefinite length not supported");
				if (e > 4) throw new n("tlv.decode(long): byte length is too big");
				let a = t.subarray(r, r + e);
				if (a.length !== e) throw new n("tlv.decode: length bytes not complete");
				if (a[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
				for (let e of a) o = o << 8 | e;
				if (r += e, o < 128) throw new n("tlv.decode(long): not minimal encoding");
			}
			let s = t.subarray(r, r + o);
			if (s.length !== o) throw new n("tlv.decode: wrong value length");
			return {
				v: s,
				l: t.subarray(r + o)
			};
		}
	},
	_int: {
		encode(e) {
			let { Err: t } = q;
			if (e < J) throw new t("integer: negative integers are not allowed");
			let n = A(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = q;
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return O(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = q, i = g("signature", e), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: l, l: u } = r.decode(2, c);
		if (u.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(l)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = q, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
};
function Je(e, t) {
	return E(v(e, t));
}
var J = BigInt(0), Y = BigInt(1), X = BigInt(2), Z = BigInt(3), Ye = BigInt(4);
function Xe(e) {
	let t = qe(e), { Fp: n } = t, r = U(t.n, t.nBitLength), i = t.toBytes || ((e, t, r) => {
		let i = t.toAffine();
		return C(Uint8Array.from([4]), n.toBytes(i.x), n.toBytes(i.y));
	}), a = t.fromBytes || ((e) => {
		let t = e.subarray(1);
		return {
			x: n.fromBytes(t.subarray(0, n.BYTES)),
			y: n.fromBytes(t.subarray(n.BYTES, 2 * n.BYTES))
		};
	});
	function o(e) {
		let { a: r, b: i } = t, a = n.sqr(e), o = n.mul(a, e);
		return n.add(n.add(o, n.mul(e, r)), i);
	}
	function s(e, t) {
		let r = n.sqr(t), i = o(e);
		return n.eql(r, i);
	}
	if (!s(t.Gx, t.Gy)) throw Error("bad curve params: generator point");
	let c = n.mul(n.pow(t.a, Z), Ye), l = n.mul(n.sqr(t.b), BigInt(27));
	if (n.is0(n.add(c, l))) throw Error("bad curve params: a or b");
	function u(e) {
		return ee(e, Y, t.n);
	}
	function d(e) {
		let { allowedPrivateKeyLengths: n, nByteLength: r, wrapPrivateKey: i, n: a } = t;
		if (n && typeof e != "bigint") {
			if (w(e) && (e = E(e)), typeof e != "string" || !n.includes(e.length)) throw Error("invalid private key");
			e = e.padStart(r * 2, "0");
		}
		let o;
		try {
			o = typeof e == "bigint" ? e : O(g("private key", e, r));
		} catch {
			throw Error("invalid private key, expected hex or " + r + " bytes, got " + typeof e);
		}
		return i && (o = z(o, a)), k("private key", o, Y, a), o;
	}
	function f(e) {
		if (!(e instanceof h)) throw Error("ProjectivePoint expected");
	}
	let p = y((e, t) => {
		let { px: r, py: i, pz: a } = e;
		if (n.eql(a, n.ONE)) return {
			x: r,
			y: i
		};
		let o = e.is0();
		t ??= o ? n.ONE : n.inv(a);
		let s = n.mul(r, t), c = n.mul(i, t), l = n.mul(a, t);
		if (o) return {
			x: n.ZERO,
			y: n.ZERO
		};
		if (!n.eql(l, n.ONE)) throw Error("invZ was invalid");
		return {
			x: s,
			y: c
		};
	}), m = y((e) => {
		if (e.is0()) {
			if (t.allowInfinityPoint && !n.is0(e.py)) return;
			throw Error("bad point: ZERO");
		}
		let { x: r, y: i } = e.toAffine();
		if (!n.isValid(r) || !n.isValid(i)) throw Error("bad point: x or y not FE");
		if (!s(r, i)) throw Error("bad point: equation left != right");
		if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		return !0;
	});
	class h {
		constructor(e, t, r) {
			if (e == null || !n.isValid(e)) throw Error("x required");
			if (t == null || !n.isValid(t) || n.is0(t)) throw Error("y required");
			if (r == null || !n.isValid(r)) throw Error("z required");
			this.px = e, this.py = t, this.pz = r, Object.freeze(this);
		}
		static fromAffine(e) {
			let { x: t, y: r } = e || {};
			if (!e || !n.isValid(t) || !n.isValid(r)) throw Error("invalid affine point");
			if (e instanceof h) throw Error("projective point not allowed");
			let i = (e) => n.eql(e, n.ZERO);
			return i(t) && i(r) ? h.ZERO : new h(t, r, n.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static normalizeZ(e) {
			let t = H(n, e.map((e) => e.pz));
			return e.map((e, n) => e.toAffine(t[n])).map(h.fromAffine);
		}
		static fromHex(e) {
			let t = h.fromAffine(a(g("pointHex", e)));
			return t.assertValidity(), t;
		}
		static fromPrivateKey(e) {
			return h.BASE.multiply(d(e));
		}
		static msm(e, t) {
			return We(h, r, e, t);
		}
		_setWindowSize(e) {
			b.setWindowSize(this, e);
		}
		assertValidity() {
			m(this);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (n.isOdd) return !n.isOdd(e);
			throw Error("Field doesn't support isOdd");
		}
		equals(e) {
			f(e);
			let { px: t, py: r, pz: i } = this, { px: a, py: o, pz: s } = e, c = n.eql(n.mul(t, s), n.mul(a, i)), l = n.eql(n.mul(r, s), n.mul(o, i));
			return c && l;
		}
		negate() {
			return new h(this.px, n.neg(this.py), this.pz);
		}
		double() {
			let { a: e, b: r } = t, i = n.mul(r, Z), { px: a, py: o, pz: s } = this, c = n.ZERO, l = n.ZERO, u = n.ZERO, d = n.mul(a, a), f = n.mul(o, o), p = n.mul(s, s), m = n.mul(a, o);
			return m = n.add(m, m), u = n.mul(a, s), u = n.add(u, u), c = n.mul(e, u), l = n.mul(i, p), l = n.add(c, l), c = n.sub(f, l), l = n.add(f, l), l = n.mul(c, l), c = n.mul(m, c), u = n.mul(i, u), p = n.mul(e, p), m = n.sub(d, p), m = n.mul(e, m), m = n.add(m, u), u = n.add(d, d), d = n.add(u, d), d = n.add(d, p), d = n.mul(d, m), l = n.add(l, d), p = n.mul(o, s), p = n.add(p, p), d = n.mul(p, m), c = n.sub(c, d), u = n.mul(p, f), u = n.add(u, u), u = n.add(u, u), new h(c, l, u);
		}
		add(e) {
			f(e);
			let { px: r, py: i, pz: a } = this, { px: o, py: s, pz: c } = e, l = n.ZERO, u = n.ZERO, d = n.ZERO, p = t.a, m = n.mul(t.b, Z), g = n.mul(r, o), _ = n.mul(i, s), v = n.mul(a, c), y = n.add(r, i), b = n.add(o, s);
			y = n.mul(y, b), b = n.add(g, _), y = n.sub(y, b), b = n.add(r, a);
			let x = n.add(o, c);
			return b = n.mul(b, x), x = n.add(g, v), b = n.sub(b, x), x = n.add(i, a), l = n.add(s, c), x = n.mul(x, l), l = n.add(_, v), x = n.sub(x, l), d = n.mul(p, b), l = n.mul(m, v), d = n.add(l, d), l = n.sub(_, d), d = n.add(_, d), u = n.mul(l, d), _ = n.add(g, g), _ = n.add(_, g), v = n.mul(p, v), b = n.mul(m, b), _ = n.add(_, v), v = n.sub(g, v), v = n.mul(p, v), b = n.add(b, v), g = n.mul(_, b), u = n.add(u, g), g = n.mul(x, b), l = n.mul(y, l), l = n.sub(l, g), g = n.mul(y, _), d = n.mul(x, d), d = n.add(d, g), new h(l, u, d);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(h.ZERO);
		}
		wNAF(e) {
			return b.wNAFCached(this, e, h.normalizeZ);
		}
		multiplyUnsafe(e) {
			let { endo: r, n: i } = t;
			k("scalar", e, J, i);
			let a = h.ZERO;
			if (e === J) return a;
			if (this.is0() || e === Y) return this;
			if (!r || b.hasPrecomputes(this)) return b.wNAFCachedUnsafe(this, e, h.normalizeZ);
			let { k1neg: o, k1: s, k2neg: c, k2: l } = r.splitScalar(e), u = a, d = a, f = this;
			for (; s > J || l > J;) s & Y && (u = u.add(f)), l & Y && (d = d.add(f)), f = f.double(), s >>= Y, l >>= Y;
			return o && (u = u.negate()), c && (d = d.negate()), d = new h(n.mul(d.px, r.beta), d.py, d.pz), u.add(d);
		}
		multiply(e) {
			let { endo: r, n: i } = t;
			k("scalar", e, Y, i);
			let a, o;
			if (r) {
				let { k1neg: t, k1: i, k2neg: s, k2: c } = r.splitScalar(e), { p: l, f: u } = this.wNAF(i), { p: d, f } = this.wNAF(c);
				l = b.constTimeNegate(t, l), d = b.constTimeNegate(s, d), d = new h(n.mul(d.px, r.beta), d.py, d.pz), a = l.add(d), o = u.add(f);
			} else {
				let { p: t, f: n } = this.wNAF(e);
				a = t, o = n;
			}
			return h.normalizeZ([a, o])[0];
		}
		multiplyAndAddUnsafe(e, t, n) {
			let r = h.BASE, i = (e, t) => t === J || t === Y || !e.equals(r) ? e.multiplyUnsafe(t) : e.multiply(t), a = i(this, t).add(i(e, n));
			return a.is0() ? void 0 : a;
		}
		toAffine(e) {
			return p(this, e);
		}
		isTorsionFree() {
			let { h: e, isTorsionFree: n } = t;
			if (e === Y) return !0;
			if (n) return n(h, this);
			throw Error("isTorsionFree() has not been declared for the elliptic curve");
		}
		clearCofactor() {
			let { h: e, clearCofactor: n } = t;
			return e === Y ? this : n ? n(h, this) : this.multiplyUnsafe(t.h);
		}
		toRawBytes(e = !0) {
			return T("isCompressed", e), this.assertValidity(), i(h, this, e);
		}
		toHex(e = !0) {
			return T("isCompressed", e), E(this.toRawBytes(e));
		}
	}
	h.BASE = new h(t.Gx, t.Gy, n.ONE), h.ZERO = new h(n.ZERO, n.ONE, n.ZERO);
	let { endo: _, nBitLength: v } = t, b = Ue(h, _ ? Math.ceil(v / 2) : v);
	return {
		CURVE: t,
		ProjectivePoint: h,
		normPrivateKeyToScalar: d,
		weierstrassEquation: o,
		isWithinCurveOrder: u
	};
}
function Ze(e) {
	let t = Ge(e);
	return m(t, {
		hash: "hash",
		hmac: "function",
		randomBytes: "function"
	}, {
		bits2int: "function",
		bits2int_modN: "function",
		lowS: "boolean"
	}), Object.freeze({
		lowS: !0,
		...t
	});
}
function Qe(e) {
	let t = Ze(e), { Fp: n, n: r, nByteLength: i, nBitLength: a } = t, o = n.BYTES + 1, s = 2 * n.BYTES + 1;
	function c(e) {
		return z(e, r);
	}
	function l(e) {
		return V(e, r);
	}
	let { ProjectivePoint: u, normPrivateKeyToScalar: d, weierstrassEquation: f, isWithinCurveOrder: m } = Xe({
		...t,
		toBytes(e, t, r) {
			let i = t.toAffine(), a = n.toBytes(i.x), o = C;
			return T("isCompressed", r), r ? o(Uint8Array.from([t.hasEvenY() ? 2 : 3]), a) : o(Uint8Array.from([4]), a, n.toBytes(i.y));
		},
		fromBytes(e) {
			let t = e.length, r = e[0], i = e.subarray(1);
			if (t === o && (r === 2 || r === 3)) {
				let e = O(i);
				if (!ee(e, Y, n.ORDER)) throw Error("Point is not on curve");
				let t = f(e), a;
				try {
					a = n.sqrt(t);
				} catch (e) {
					let t = e instanceof Error ? ": " + e.message : "";
					throw Error("Point is not on curve" + t);
				}
				let o = (a & Y) === Y;
				return (r & 1) == 1 !== o && (a = n.neg(a)), {
					x: e,
					y: a
				};
			} else if (t === s && r === 4) return {
				x: n.fromBytes(i.subarray(0, n.BYTES)),
				y: n.fromBytes(i.subarray(n.BYTES, 2 * n.BYTES))
			};
			else {
				let e = o, n = s;
				throw Error("invalid Point, expected length of " + e + ", or uncompressed " + n + ", got " + t);
			}
		}
	});
	function h(e) {
		return e > r >> Y;
	}
	function y(e) {
		return h(e) ? c(-e) : e;
	}
	let b = (e, t, n) => O(e.slice(t, n));
	class x {
		constructor(e, t, n) {
			k("r", e, Y, r), k("s", t, Y, r), this.r = e, this.s = t, n != null && (this.recovery = n), Object.freeze(this);
		}
		static fromCompact(e) {
			let t = i;
			return e = g("compactSignature", e, t * 2), new x(b(e, 0, t), b(e, t, 2 * t));
		}
		static fromDER(e) {
			let { r: t, s: n } = q.toSig(g("DER", e));
			return new x(t, n);
		}
		assertValidity() {}
		addRecoveryBit(e) {
			return new x(this.r, this.s, e);
		}
		recoverPublicKey(e) {
			let { r, s: i, recovery: a } = this, o = M(g("msgHash", e));
			if (a == null || ![
				0,
				1,
				2,
				3
			].includes(a)) throw Error("recovery id invalid");
			let s = a === 2 || a === 3 ? r + t.n : r;
			if (s >= n.ORDER) throw Error("recovery id 2 or 3 invalid");
			let d = a & 1 ? "03" : "02", f = u.fromHex(d + Je(s, n.BYTES)), p = l(s), m = c(-o * p), h = c(i * p), _ = u.BASE.multiplyAndAddUnsafe(f, m, h);
			if (!_) throw Error("point at infinify");
			return _.assertValidity(), _;
		}
		hasHighS() {
			return h(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new x(this.r, c(-this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return _(this.toDERHex());
		}
		toDERHex() {
			return q.hexFromSig(this);
		}
		toCompactRawBytes() {
			return _(this.toCompactHex());
		}
		toCompactHex() {
			let e = i;
			return Je(this.r, e) + Je(this.s, e);
		}
	}
	let S = {
		isValidPrivateKey(e) {
			try {
				return d(e), !0;
			} catch {
				return !1;
			}
		},
		normPrivateKeyToScalar: d,
		randomPrivateKey: () => {
			let e = we(t.n);
			return Te(t.randomBytes(e), t.n);
		},
		precompute(e = 8, t = u.BASE) {
			return t._setWindowSize(e), t.multiply(BigInt(3)), t;
		}
	};
	function E(e, t = !0) {
		return u.fromPrivateKey(e).toRawBytes(t);
	}
	function D(e) {
		if (typeof e == "bigint") return !1;
		if (e instanceof u) return !0;
		let r = g("key", e).length, a = n.BYTES, o = a + 1, s = 2 * a + 1;
		if (!(t.allowedPrivateKeyLengths || i === o)) return r === o || r === s;
	}
	function A(e, t, n = !0) {
		if (D(e) === !0) throw Error("first arg must be private key");
		if (D(t) === !1) throw Error("second arg must be public key");
		return u.fromHex(t).multiply(d(e)).toRawBytes(n);
	}
	let j = t.bits2int || function(e) {
		if (e.length > 8192) throw Error("input is too large");
		let t = O(e), n = e.length * 8 - a;
		return n > 0 ? t >> BigInt(n) : t;
	}, M = t.bits2int_modN || function(e) {
		return c(j(e));
	}, ne = p(a);
	function N(e) {
		return k("num < 2^" + a, e, J, ne), v(e, i);
	}
	function re(e, r, i = P) {
		if (["recovered", "canonical"].some((e) => e in i)) throw Error("sign() legacy options not supported");
		let { hash: a, randomBytes: o } = t, { lowS: s, prehash: f, extraEntropy: p } = i;
		s ??= !0, e = g("msgHash", e), Ke(i), f && (e = g("prehashed msgHash", a(e)));
		let _ = M(e), v = d(r), b = [N(v), N(_)];
		if (p != null && p !== !1) {
			let e = p === !0 ? o(n.BYTES) : p;
			b.push(g("extraEntropy", e));
		}
		let S = C(...b), w = _;
		function T(e) {
			let t = j(e);
			if (!m(t)) return;
			let n = l(t), r = u.BASE.multiply(t).toAffine(), i = c(r.x);
			if (i === J) return;
			let a = c(n * c(w + i * v));
			if (a === J) return;
			let o = (r.x === i ? 0 : 2) | Number(r.y & Y), d = a;
			return s && h(a) && (d = y(a), o ^= 1), new x(i, d, o);
		}
		return {
			seed: S,
			k2sig: T
		};
	}
	let P = {
		lowS: t.lowS,
		prehash: !1
	}, ie = {
		lowS: t.lowS,
		prehash: !1
	};
	function F(e, n, r = P) {
		let { seed: i, k2sig: a } = re(e, n, r), o = t;
		return te(o.hash.outputLen, o.nByteLength, o.hmac)(i, a);
	}
	u.BASE._setWindowSize(8);
	function ae(e, n, r, i = ie) {
		let a = e;
		n = g("msgHash", n), r = g("publicKey", r);
		let { lowS: o, prehash: s, format: d } = i;
		if (Ke(i), "strict" in i) throw Error("options.strict was renamed to lowS");
		if (d !== void 0 && d !== "compact" && d !== "der") throw Error("format must be compact or der");
		let f = typeof a == "string" || w(a), p = !f && !d && typeof a == "object" && !!a && typeof a.r == "bigint" && typeof a.s == "bigint";
		if (!f && !p) throw Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		let m, h;
		try {
			if (p && (m = new x(a.r, a.s)), f) {
				try {
					d !== "compact" && (m = x.fromDER(a));
				} catch (e) {
					if (!(e instanceof q.Err)) throw e;
				}
				!m && d !== "der" && (m = x.fromCompact(a));
			}
			h = u.fromHex(r);
		} catch {
			return !1;
		}
		if (!m || o && m.hasHighS()) return !1;
		s && (n = t.hash(n));
		let { r: _, s: v } = m, y = M(n), b = l(v), S = c(y * b), C = c(_ * b), T = u.BASE.multiplyAndAddUnsafe(h, S, C)?.toAffine();
		return T ? c(T.x) === _ : !1;
	}
	return {
		CURVE: t,
		getPublicKey: E,
		getSharedSecret: A,
		sign: F,
		verify: ae,
		ProjectivePoint: u,
		Signature: x,
		utils: S
	};
}
function $e(e, t) {
	let n = e.ORDER, r = J;
	for (let e = n - Y; e % X === J; e /= X) r += Y;
	let i = r, a = X << i - Y - Y, o = a * X, s = (n - Y) / o, c = (s - Y) / X, l = o - Y, u = a, d = e.pow(t, s), f = e.pow(t, (s + Y) / X), p = (t, n) => {
		let r = d, a = e.pow(n, l), o = e.sqr(a);
		o = e.mul(o, n);
		let s = e.mul(t, o);
		s = e.pow(s, c), s = e.mul(s, a), a = e.mul(s, n), o = e.mul(s, t);
		let p = e.mul(o, a);
		s = e.pow(p, u);
		let m = e.eql(s, e.ONE);
		a = e.mul(o, f), s = e.mul(p, r), o = e.cmov(a, o, m), p = e.cmov(s, p, m);
		for (let t = i; t > Y; t--) {
			let n = t - X;
			n = X << n - Y;
			let i = e.pow(p, n), s = e.eql(i, e.ONE);
			a = e.mul(o, r), r = e.mul(r, r), i = e.mul(p, r), o = e.cmov(a, o, s), p = e.cmov(i, p, s);
		}
		return {
			isValid: m,
			value: o
		};
	};
	if (e.ORDER % Ye === Z) {
		let n = (e.ORDER - Z) / Ye, r = e.sqrt(e.neg(t));
		p = (t, i) => {
			let a = e.sqr(i), o = e.mul(t, i);
			a = e.mul(a, o);
			let s = e.pow(a, n);
			s = e.mul(s, o);
			let c = e.mul(s, r), l = e.mul(e.sqr(s), i), u = e.eql(l, t);
			return {
				isValid: u,
				value: e.cmov(c, s, u)
			};
		};
	}
	return p;
}
function et(e, t) {
	if (ye(e), !e.isValid(t.A) || !e.isValid(t.B) || !e.isValid(t.Z)) throw Error("mapToCurveSimpleSWU: invalid opts");
	let n = $e(e, t.Z);
	if (!e.isOdd) throw Error("Fp.isOdd is not implemented!");
	return (r) => {
		let i, a, o, s, c, l, u, d;
		i = e.sqr(r), i = e.mul(i, t.Z), a = e.sqr(i), a = e.add(a, i), o = e.add(a, e.ONE), o = e.mul(o, t.B), s = e.cmov(t.Z, e.neg(a), !e.eql(a, e.ZERO)), s = e.mul(s, t.A), a = e.sqr(o), l = e.sqr(s), c = e.mul(l, t.A), a = e.add(a, c), a = e.mul(a, o), l = e.mul(l, s), c = e.mul(l, t.B), a = e.add(a, c), u = e.mul(i, o);
		let { isValid: f, value: p } = n(a, l);
		d = e.mul(i, r), d = e.mul(d, p), u = e.cmov(u, o, f), d = e.cmov(d, p, f);
		let m = e.isOdd(r) === e.isOdd(d);
		d = e.cmov(e.neg(d), d, m);
		let h = H(e, [s], !0)[0];
		return u = e.mul(u, h), {
			x: u,
			y: d
		};
	};
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/_shortw_utils.js
function tt(e) {
	return {
		hash: e,
		hmac: (t, ...n) => le(e, t, s(...n)),
		randomBytes: a
	};
}
function nt(e, t) {
	let n = (t) => Qe({
		...e,
		...tt(t)
	});
	return {
		...n(t),
		create: n
	};
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/secp256k1.js
var rt = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), it = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), at = BigInt(0), ot = BigInt(1), st = BigInt(2), ct = (e, t) => (e + t / st) / t;
function lt(e) {
	let t = rt, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = B(B(B(u, n, t) * u % t, n, t) * u % t, st, t) * l % t, f = B(d, i, t) * d % t, p = B(f, a, t) * f % t, m = B(p, s, t) * p % t, h = B(B(B(B(B(B(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, st, t);
	if (!Q.eql(Q.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var Q = U(rt, void 0, void 0, { sqrt: lt }), $ = nt({
	a: at,
	b: BigInt(7),
	Fp: Q,
	n: it,
	Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
	Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
	h: BigInt(1),
	lowS: !0,
	endo: {
		beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
		splitScalar: (e) => {
			let t = it, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = n, o = BigInt("0x100000000000000000000000000000000"), s = ct(a * e, t), c = ct(-r * e, t), l = z(e - s * n - c * i, t), u = z(-s * r - c * a, t), d = l > o, f = u > o;
			if (d && (l = t - l), f && (u = t - u), l > o || u > o) throw Error("splitScalar: Endomorphism failed, k=" + e);
			return {
				k1neg: d,
				k1: l,
				k2neg: f,
				k2: u
			};
		}
	}
}, se);
$.ProjectivePoint, $.utils.randomPrivateKey;
var ut = je(Q, [
	[
		"0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
		"0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
		"0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
		"0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
	],
	[
		"0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
		"0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
		"0x0000000000000000000000000000000000000000000000000000000000000001"
	],
	[
		"0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
		"0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
		"0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
		"0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
	],
	[
		"0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
		"0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
		"0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
		"0x0000000000000000000000000000000000000000000000000000000000000001"
	]
].map((e) => e.map((e) => BigInt(e)))), dt = et(Q, {
	A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
	B: BigInt("1771"),
	Z: Q.create(BigInt("-11"))
}), ft = Me($.ProjectivePoint, (e) => {
	let { x: t, y: n } = dt(Q.create(e[0]));
	return ut(t, n);
}, {
	DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
	encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
	p: Q.ORDER,
	m: 1,
	k: 128,
	expand: "xmd",
	hash: se
});
ft.hashToCurve, ft.encodeToCurve;
//#endregion
export { ft as n, se as r, $ as t };
