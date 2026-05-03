import { A as e, B as t, C as n, D as r, E as i, I as a, M as o, O as s, P as c, S as l, T as u, V as d, j as f, w as p, x as ee, z as te } from "./utils-B3UcVIi5.js";
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/version.js
var ne = "2.47.6", re = {
	getDocsUrl: ({ docsBaseUrl: e, docsPath: t = "", docsSlug: n }) => t ? `${e ?? "https://viem.sh"}${t}${n ? `#${n}` : ""}` : void 0,
	version: `viem@${ne}`
}, m = class e extends Error {
	constructor(t, n = {}) {
		let r = n.cause instanceof e ? n.cause.details : n.cause?.message ? n.cause.message : n.details, i = n.cause instanceof e && n.cause.docsPath || n.docsPath, a = re.getDocsUrl?.({
			...n,
			docsPath: i
		}), o = [
			t || "An error occurred.",
			"",
			...n.metaMessages ? [...n.metaMessages, ""] : [],
			...a ? [`Docs: ${a}`] : [],
			...r ? [`Details: ${r}`] : [],
			...re.version ? [`Version: ${re.version}`] : []
		].join("\n");
		super(o, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "docsPath", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "metaMessages", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "shortMessage", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "version", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "BaseError"
		}), this.details = r, this.docsPath = i, this.metaMessages = n.metaMessages, this.name = n.name ?? this.name, this.shortMessage = t, this.version = ne;
	}
	walk(e) {
		return ie(this, e);
	}
};
function ie(e, t) {
	return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause !== void 0 ? ie(e.cause, t) : t ? null : e;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/encoding.js
var ae = class extends m {
	constructor({ max: e, min: t, signed: n, size: r, value: i }) {
		super(`Number "${i}" is not in safe ${r ? `${r * 8}-bit ${n ? "signed" : "unsigned"} ` : ""}integer range ${e ? `(${t} to ${e})` : `(above ${t})`}`, { name: "IntegerOutOfRangeError" });
	}
}, h = class extends m {
	constructor(e) {
		super(`Bytes value "${e}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, { name: "InvalidBytesBooleanError" });
	}
}, oe = class extends m {
	constructor(e) {
		super(`Hex value "${e}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
	}
}, se = class extends m {
	constructor({ givenSize: e, maxSize: t }) {
		super(`Size cannot exceed ${t} bytes. Given size: ${e} bytes.`, { name: "SizeOverflowError" });
	}
};
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/isHex.js
function g(e, { strict: t = !0 } = {}) {
	return !e || typeof e != "string" ? !1 : t ? /^0x[0-9a-fA-F]*$/.test(e) : e.startsWith("0x");
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/size.js
function _(e) {
	return g(e, { strict: !1 }) ? Math.ceil((e.length - 2) / 2) : e.length;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/trim.js
function v(e, { dir: t = "left" } = {}) {
	let n = typeof e == "string" ? e.replace("0x", "") : e, r = 0;
	for (let e = 0; e < n.length - 1 && n[t === "left" ? e : n.length - e - 1].toString() === "0"; e++) r++;
	return n = t === "left" ? n.slice(r) : n.slice(0, n.length - r), typeof e == "string" ? (n.length === 1 && t === "right" && (n = `${n}0`), `0x${n.length % 2 == 1 ? `0${n}` : n}`) : n;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/data.js
var ce = class extends m {
	constructor({ offset: e, position: t, size: n }) {
		super(`Slice ${t === "start" ? "starting" : "ending"} at offset "${e}" is out-of-bounds (size: ${n}).`, { name: "SliceOffsetOutOfBoundsError" });
	}
}, le = class extends m {
	constructor({ size: e, targetSize: t, type: n }) {
		super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (${e}) exceeds padding size (${t}).`, { name: "SizeExceedsPaddingSizeError" });
	}
}, ue = class extends m {
	constructor({ size: e, targetSize: t, type: n }) {
		super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} is expected to be ${t} ${n} long, but is ${e} ${n} long.`, { name: "InvalidBytesLengthError" });
	}
};
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/pad.js
function y(e, { dir: t, size: n = 32 } = {}) {
	return typeof e == "string" ? b(e, {
		dir: t,
		size: n
	}) : de(e, {
		dir: t,
		size: n
	});
}
function b(e, { dir: t, size: n = 32 } = {}) {
	if (n === null) return e;
	let r = e.replace("0x", "");
	if (r.length > n * 2) throw new le({
		size: Math.ceil(r.length / 2),
		targetSize: n,
		type: "hex"
	});
	return `0x${r[t === "right" ? "padEnd" : "padStart"](n * 2, "0")}`;
}
function de(e, { dir: t, size: n = 32 } = {}) {
	if (n === null) return e;
	if (e.length > n) throw new le({
		size: e.length,
		targetSize: n,
		type: "bytes"
	});
	let r = new Uint8Array(n);
	for (let i = 0; i < n; i++) {
		let a = t === "right";
		r[a ? i : n - i - 1] = e[a ? i : e.length - i - 1];
	}
	return r;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/encoding/toHex.js
var fe = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function pe(e, t = {}) {
	return typeof e == "number" || typeof e == "bigint" ? S(e, t) : typeof e == "string" ? ge(e, t) : typeof e == "boolean" ? me(e, t) : x(e, t);
}
function me(e, t = {}) {
	let n = `0x${Number(e)}`;
	return typeof t.size == "number" ? (w(n, { size: t.size }), y(n, { size: t.size })) : n;
}
function x(e, t = {}) {
	let n = "";
	for (let t = 0; t < e.length; t++) n += fe[e[t]];
	let r = `0x${n}`;
	return typeof t.size == "number" ? (w(r, { size: t.size }), y(r, {
		dir: "right",
		size: t.size
	})) : r;
}
function S(e, t = {}) {
	let { signed: n, size: r } = t, i = BigInt(e), a;
	r ? a = n ? (1n << BigInt(r) * 8n - 1n) - 1n : 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (a = BigInt(2 ** 53 - 1));
	let o = typeof a == "bigint" && n ? -a - 1n : 0;
	if (a && i > a || i < o) {
		let t = typeof e == "bigint" ? "n" : "";
		throw new ae({
			max: a ? `${a}${t}` : void 0,
			min: `${o}${t}`,
			signed: n,
			size: r,
			value: `${e}${t}`
		});
	}
	let s = `0x${(n && i < 0 ? (1n << BigInt(r * 8)) + BigInt(i) : i).toString(16)}`;
	return r ? y(s, { size: r }) : s;
}
var he = /* @__PURE__ */ new TextEncoder();
function ge(e, t = {}) {
	return x(he.encode(e), t);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/encoding/toBytes.js
var _e = /* @__PURE__ */ new TextEncoder();
function ve(e, t = {}) {
	return typeof e == "number" || typeof e == "bigint" ? Se(e, t) : typeof e == "boolean" ? ye(e, t) : g(e) ? xe(e, t) : Ce(e, t);
}
function ye(e, t = {}) {
	let n = new Uint8Array(1);
	return n[0] = Number(e), typeof t.size == "number" ? (w(n, { size: t.size }), y(n, { size: t.size })) : n;
}
var C = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function be(e) {
	if (e >= C.zero && e <= C.nine) return e - C.zero;
	if (e >= C.A && e <= C.F) return e - (C.A - 10);
	if (e >= C.a && e <= C.f) return e - (C.a - 10);
}
function xe(e, t = {}) {
	let n = e;
	t.size && (w(n, { size: t.size }), n = y(n, {
		dir: "right",
		size: t.size
	}));
	let r = n.slice(2);
	r.length % 2 && (r = `0${r}`);
	let i = r.length / 2, a = new Uint8Array(i);
	for (let e = 0, t = 0; e < i; e++) {
		let n = be(r.charCodeAt(t++)), i = be(r.charCodeAt(t++));
		if (n === void 0 || i === void 0) throw new m(`Invalid byte sequence ("${r[t - 2]}${r[t - 1]}" in "${r}").`);
		a[e] = n * 16 + i;
	}
	return a;
}
function Se(e, t) {
	return xe(S(e, t));
}
function Ce(e, t = {}) {
	let n = _e.encode(e);
	return typeof t.size == "number" ? (w(n, { size: t.size }), y(n, {
		dir: "right",
		size: t.size
	})) : n;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/encoding/fromHex.js
function w(e, { size: t }) {
	if (_(e) > t) throw new se({
		givenSize: _(e),
		maxSize: t
	});
}
function we(e, t = {}) {
	let { signed: n } = t;
	t.size && w(e, { size: t.size });
	let r = BigInt(e);
	if (!n) return r;
	let i = (e.length - 2) / 2;
	return r <= (1n << BigInt(i) * 8n - 1n) - 1n ? r : r - BigInt(`0x${"f".padStart(i * 2, "f")}`) - 1n;
}
function Te(e, t = {}) {
	let n = e;
	if (t.size && (w(n, { size: t.size }), n = v(n)), v(n) === "0x00") return !1;
	if (v(n) === "0x01") return !0;
	throw new oe(n);
}
function Ee(e, t = {}) {
	let n = we(e, t), r = Number(n);
	if (!Number.isSafeInteger(r)) throw new ae({
		max: `${2 ** 53 - 1}`,
		min: `${-(2 ** 53 - 1)}`,
		signed: t.signed,
		size: t.size,
		value: `${n}n`
	});
	return r;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/formatters/transactionRequest.js
var De = {
	legacy: "0x0",
	eip2930: "0x1",
	eip1559: "0x2",
	eip4844: "0x3",
	eip7702: "0x4"
};
function Oe(e, t) {
	let n = {};
	return e.authorizationList !== void 0 && (n.authorizationList = ke(e.authorizationList)), e.accessList !== void 0 && (n.accessList = e.accessList), e.blobVersionedHashes !== void 0 && (n.blobVersionedHashes = e.blobVersionedHashes), e.blobs !== void 0 && (typeof e.blobs[0] == "string" ? n.blobs = e.blobs : n.blobs = e.blobs.map((e) => x(e))), e.data !== void 0 && (n.data = e.data), e.account && (n.from = e.account.address), e.from !== void 0 && (n.from = e.from), e.gas !== void 0 && (n.gas = S(e.gas)), e.gasPrice !== void 0 && (n.gasPrice = S(e.gasPrice)), e.maxFeePerBlobGas !== void 0 && (n.maxFeePerBlobGas = S(e.maxFeePerBlobGas)), e.maxFeePerGas !== void 0 && (n.maxFeePerGas = S(e.maxFeePerGas)), e.maxPriorityFeePerGas !== void 0 && (n.maxPriorityFeePerGas = S(e.maxPriorityFeePerGas)), e.nonce !== void 0 && (n.nonce = S(e.nonce)), e.to !== void 0 && (n.to = e.to), e.type !== void 0 && (n.type = De[e.type]), e.value !== void 0 && (n.value = S(e.value)), n;
}
function ke(e) {
	return e.map((e) => ({
		address: e.address,
		r: e.r ? S(BigInt(e.r)) : e.r,
		s: e.s ? S(BigInt(e.s)) : e.s,
		chainId: S(e.chainId),
		nonce: S(e.nonce),
		...e.yParity === void 0 ? {} : { yParity: S(e.yParity) },
		...e.v !== void 0 && e.yParity === void 0 ? { v: S(e.v) } : {}
	}));
}
2n ** (8n - 1n) - 1n, 2n ** (16n - 1n) - 1n, 2n ** (24n - 1n) - 1n, 2n ** (32n - 1n) - 1n, 2n ** (40n - 1n) - 1n, 2n ** (48n - 1n) - 1n, 2n ** (56n - 1n) - 1n, 2n ** (64n - 1n) - 1n, 2n ** (72n - 1n) - 1n, 2n ** (80n - 1n) - 1n, 2n ** (88n - 1n) - 1n, 2n ** (96n - 1n) - 1n, 2n ** (104n - 1n) - 1n, 2n ** (112n - 1n) - 1n, 2n ** (120n - 1n) - 1n, 2n ** (128n - 1n) - 1n, 2n ** (136n - 1n) - 1n, 2n ** (144n - 1n) - 1n, 2n ** (152n - 1n) - 1n, 2n ** (160n - 1n) - 1n, 2n ** (168n - 1n) - 1n, 2n ** (176n - 1n) - 1n, 2n ** (184n - 1n) - 1n, 2n ** (192n - 1n) - 1n, 2n ** (200n - 1n) - 1n, 2n ** (208n - 1n) - 1n, 2n ** (216n - 1n) - 1n, 2n ** (224n - 1n) - 1n, 2n ** (232n - 1n) - 1n, 2n ** (240n - 1n) - 1n, 2n ** (248n - 1n) - 1n, 2n ** (256n - 1n) - 1n, -(2n ** (8n - 1n)), -(2n ** (16n - 1n)), -(2n ** (24n - 1n)), -(2n ** (32n - 1n)), -(2n ** (40n - 1n)), -(2n ** (48n - 1n)), -(2n ** (56n - 1n)), -(2n ** (64n - 1n)), -(2n ** (72n - 1n)), -(2n ** (80n - 1n)), -(2n ** (88n - 1n)), -(2n ** (96n - 1n)), -(2n ** (104n - 1n)), -(2n ** (112n - 1n)), -(2n ** (120n - 1n)), -(2n ** (128n - 1n)), -(2n ** (136n - 1n)), -(2n ** (144n - 1n)), -(2n ** (152n - 1n)), -(2n ** (160n - 1n)), -(2n ** (168n - 1n)), -(2n ** (176n - 1n)), -(2n ** (184n - 1n)), -(2n ** (192n - 1n)), -(2n ** (200n - 1n)), -(2n ** (208n - 1n)), -(2n ** (216n - 1n)), -(2n ** (224n - 1n)), -(2n ** (232n - 1n)), -(2n ** (240n - 1n)), -(2n ** (248n - 1n)), -(2n ** (256n - 1n));
var Ae = 2n ** 256n - 1n;
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/concat.js
function T(e) {
	return typeof e[0] == "string" ? E(e) : je(e);
}
function je(e) {
	let t = 0;
	for (let n of e) t += n.length;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
function E(e) {
	return `0x${e.reduce((e, t) => e + t.replace("0x", ""), "")}`;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/cursor.js
var Me = class extends m {
	constructor({ offset: e }) {
		super(`Offset \`${e}\` cannot be negative.`, { name: "NegativeOffsetError" });
	}
}, Ne = class extends m {
	constructor({ length: e, position: t }) {
		super(`Position \`${t}\` is out of bounds (\`0 < position < ${e}\`).`, { name: "PositionOutOfBoundsError" });
	}
}, Pe = class extends m {
	constructor({ count: e, limit: t }) {
		super(`Recursive read limit of \`${t}\` exceeded (recursive read count: \`${e}\`).`, { name: "RecursiveReadLimitExceededError" });
	}
}, Fe = {
	bytes: new Uint8Array(),
	dataView: /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0)),
	position: 0,
	positionReadCount: /* @__PURE__ */ new Map(),
	recursiveReadCount: 0,
	recursiveReadLimit: Infinity,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new Pe({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		});
	},
	assertPosition(e) {
		if (e < 0 || e > this.bytes.length - 1) throw new Ne({
			length: this.bytes.length,
			position: e
		});
	},
	decrementPosition(e) {
		if (e < 0) throw new Me({ offset: e });
		let t = this.position - e;
		this.assertPosition(t), this.position = t;
	},
	getReadCount(e) {
		return this.positionReadCount.get(e || this.position) || 0;
	},
	incrementPosition(e) {
		if (e < 0) throw new Me({ offset: e });
		let t = this.position + e;
		this.assertPosition(t), this.position = t;
	},
	inspectByte(e) {
		let t = e ?? this.position;
		return this.assertPosition(t), this.bytes[t];
	},
	inspectBytes(e, t) {
		let n = t ?? this.position;
		return this.assertPosition(n + e - 1), this.bytes.subarray(n, n + e);
	},
	inspectUint8(e) {
		let t = e ?? this.position;
		return this.assertPosition(t), this.bytes[t];
	},
	inspectUint16(e) {
		let t = e ?? this.position;
		return this.assertPosition(t + 1), this.dataView.getUint16(t);
	},
	inspectUint24(e) {
		let t = e ?? this.position;
		return this.assertPosition(t + 2), (this.dataView.getUint16(t) << 8) + this.dataView.getUint8(t + 2);
	},
	inspectUint32(e) {
		let t = e ?? this.position;
		return this.assertPosition(t + 3), this.dataView.getUint32(t);
	},
	pushByte(e) {
		this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
	},
	pushBytes(e) {
		this.assertPosition(this.position + e.length - 1), this.bytes.set(e, this.position), this.position += e.length;
	},
	pushUint8(e) {
		this.assertPosition(this.position), this.bytes[this.position] = e, this.position++;
	},
	pushUint16(e) {
		this.assertPosition(this.position + 1), this.dataView.setUint16(this.position, e), this.position += 2;
	},
	pushUint24(e) {
		this.assertPosition(this.position + 2), this.dataView.setUint16(this.position, e >> 8), this.dataView.setUint8(this.position + 2, e & 255), this.position += 3;
	},
	pushUint32(e) {
		this.assertPosition(this.position + 3), this.dataView.setUint32(this.position, e), this.position += 4;
	},
	readByte() {
		this.assertReadLimit(), this._touch();
		let e = this.inspectByte();
		return this.position++, e;
	},
	readBytes(e, t) {
		this.assertReadLimit(), this._touch();
		let n = this.inspectBytes(e);
		return this.position += t ?? e, n;
	},
	readUint8() {
		this.assertReadLimit(), this._touch();
		let e = this.inspectUint8();
		return this.position += 1, e;
	},
	readUint16() {
		this.assertReadLimit(), this._touch();
		let e = this.inspectUint16();
		return this.position += 2, e;
	},
	readUint24() {
		this.assertReadLimit(), this._touch();
		let e = this.inspectUint24();
		return this.position += 3, e;
	},
	readUint32() {
		this.assertReadLimit(), this._touch();
		let e = this.inspectUint32();
		return this.position += 4, e;
	},
	get remaining() {
		return this.bytes.length - this.position;
	},
	setPosition(e) {
		let t = this.position;
		return this.assertPosition(e), this.position = e, () => this.position = t;
	},
	_touch() {
		if (this.recursiveReadLimit === Infinity) return;
		let e = this.getReadCount();
		this.positionReadCount.set(this.position, e + 1), e > 0 && this.recursiveReadCount++;
	}
};
function Ie(e, { recursiveReadLimit: t = 8192 } = {}) {
	let n = Object.create(Fe);
	return n.bytes = e, n.dataView = new DataView(e.buffer ?? e, e.byteOffset, e.byteLength), n.positionReadCount = /* @__PURE__ */ new Map(), n.recursiveReadLimit = t, n;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/constants/unit.js
var Le = {
	gwei: 9,
	wei: 18
}, Re = {
	ether: -9,
	wei: 9
};
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/unit/formatUnits.js
function ze(e, t) {
	let n = e.toString(), r = n.startsWith("-");
	r && (n = n.slice(1)), n = n.padStart(t, "0");
	let [i, a] = [n.slice(0, n.length - t), n.slice(n.length - t)];
	return a = a.replace(/(0+)$/, ""), `${r ? "-" : ""}${i || "0"}${a ? `.${a}` : ""}`;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/unit/formatEther.js
function Be(e, t = "wei") {
	return ze(e, Le[t]);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/unit/formatGwei.js
function D(e, t = "wei") {
	return ze(e, Re[t]);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/transaction.js
function O(e) {
	let t = Object.entries(e).map(([e, t]) => t === void 0 || t === !1 ? null : [e, t]).filter(Boolean), n = t.reduce((e, [t]) => Math.max(e, t.length), 0);
	return t.map(([e, t]) => `  ${`${e}:`.padEnd(n + 1)}  ${t}`).join("\n");
}
var Ve = class extends m {
	constructor({ transaction: e }) {
		super("Cannot infer a transaction type from provided transaction.", {
			metaMessages: [
				"Provided Transaction:",
				"{",
				O(e),
				"}",
				"",
				"To infer the type, either provide:",
				"- a `type` to the Transaction, or",
				"- an EIP-1559 Transaction with `maxFeePerGas`, or",
				"- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
				"- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
				"- an EIP-7702 Transaction with `authorizationList`, or",
				"- a Legacy Transaction with `gasPrice`"
			],
			name: "InvalidSerializableTransactionError"
		});
	}
}, He = class extends m {
	constructor(e, { account: t, docsPath: n, chain: r, data: i, gas: a, gasPrice: o, maxFeePerGas: s, maxPriorityFeePerGas: c, nonce: l, to: u, value: d }) {
		let f = O({
			chain: r && `${r?.name} (id: ${r?.id})`,
			from: t?.address,
			to: u,
			value: d !== void 0 && `${Be(d)} ${r?.nativeCurrency?.symbol || "ETH"}`,
			data: i,
			gas: a,
			gasPrice: o !== void 0 && `${D(o)} gwei`,
			maxFeePerGas: s !== void 0 && `${D(s)} gwei`,
			maxPriorityFeePerGas: c !== void 0 && `${D(c)} gwei`,
			nonce: l
		});
		super(e.shortMessage, {
			cause: e,
			docsPath: n,
			metaMessages: [
				...e.metaMessages ? [...e.metaMessages, " "] : [],
				"Request Arguments:",
				f
			].filter(Boolean),
			name: "TransactionExecutionError"
		}), Object.defineProperty(this, "cause", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.cause = e;
	}
}, Ue = class extends m {
	constructor({ blockHash: e, blockNumber: t, blockTag: n, hash: r, index: i }) {
		let a = "Transaction";
		n && i !== void 0 && (a = `Transaction at block time "${n}" at index "${i}"`), e && i !== void 0 && (a = `Transaction at block hash "${e}" at index "${i}"`), t && i !== void 0 && (a = `Transaction at block number "${t}" at index "${i}"`), r && (a = `Transaction with hash "${r}"`), super(`${a} could not be found.`, { name: "TransactionNotFoundError" });
	}
}, We = class extends m {
	constructor({ hash: e }) {
		super(`Transaction receipt with hash "${e}" could not be found. The Transaction may not be processed on a block yet.`, { name: "TransactionReceiptNotFoundError" });
	}
}, Ge = class extends m {
	constructor({ receipt: e }) {
		super(`Transaction with hash "${e.transactionHash}" reverted.`, {
			metaMessages: [
				"The receipt marked the transaction as \"reverted\". This could mean that the function on the contract you are trying to call threw an error.",
				" ",
				"You can attempt to extract the revert reason by:",
				"- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
				"- using the `call` Action with raw `data`"
			],
			name: "TransactionReceiptRevertedError"
		}), Object.defineProperty(this, "receipt", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.receipt = e;
	}
}, Ke = class extends m {
	constructor({ hash: e }) {
		super(`Timed out while waiting for transaction with hash "${e}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
	}
}, k = class extends m {
	constructor({ address: e }) {
		super(`Address "${e}" is invalid.`, {
			metaMessages: ["- Address must be a hex value of 20 bytes (40 hex characters).", "- Address must match its checksum counterpart."],
			name: "InvalidAddressError"
		});
	}
}, qe = class extends m {
	constructor({ blockNumber: e, chain: t, contract: n }) {
		super(`Chain "${t.name}" does not support contract "${n.name}".`, {
			metaMessages: ["This could be due to any of the following:", ...e && n.blockCreated && n.blockCreated > e ? [`- The contract "${n.name}" was not deployed until block ${n.blockCreated} (current block ${e}).`] : [`- The chain does not have the contract "${n.name}" configured.`]],
			name: "ChainDoesNotSupportContract"
		});
	}
}, Je = class extends m {
	constructor({ chain: e, currentChainId: t }) {
		super(`The current chain of the wallet (id: ${t}) does not match the target chain for the transaction (id: ${e.id} – ${e.name}).`, {
			metaMessages: [`Current Chain ID:  ${t}`, `Expected Chain ID: ${e.id} – ${e.name}`],
			name: "ChainMismatchError"
		});
	}
}, Ye = class extends m {
	constructor() {
		super(["No chain was provided to the request.", "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."].join("\n"), { name: "ChainNotFoundError" });
	}
}, Xe = class extends m {
	constructor() {
		super("No chain was provided to the Client.", { name: "ClientChainNotConfiguredError" });
	}
}, A = class extends m {
	constructor({ cause: e, message: t } = {}) {
		let n = t?.replace("execution reverted: ", "")?.replace("execution reverted", "");
		super(`Execution reverted ${n ? `with reason: ${n}` : "for an unknown reason"}.`, {
			cause: e,
			name: "ExecutionRevertedError"
		});
	}
};
Object.defineProperty(A, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 3
}), Object.defineProperty(A, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /execution reverted|gas required exceeds allowance/
});
var Ze = class extends m {
	constructor({ cause: e, maxFeePerGas: t } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${t ? ` = ${D(t)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
			cause: e,
			name: "FeeCapTooHighError"
		});
	}
};
Object.defineProperty(Ze, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
var Qe = class extends m {
	constructor({ cause: e, maxFeePerGas: t } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${t ? ` = ${D(t)}` : ""} gwei) cannot be lower than the block base fee.`, {
			cause: e,
			name: "FeeCapTooLowError"
		});
	}
};
Object.defineProperty(Qe, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
var $e = class extends m {
	constructor({ cause: e, nonce: t } = {}) {
		super(`Nonce provided for the transaction ${t ? `(${t}) ` : ""}is higher than the next one expected.`, {
			cause: e,
			name: "NonceTooHighError"
		});
	}
};
Object.defineProperty($e, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /nonce too high/
});
var et = class extends m {
	constructor({ cause: e, nonce: t } = {}) {
		super([`Nonce provided for the transaction ${t ? `(${t}) ` : ""}is lower than the current nonce of the account.`, "Try increasing the nonce or find the latest nonce with `getTransactionCount`."].join("\n"), {
			cause: e,
			name: "NonceTooLowError"
		});
	}
};
Object.defineProperty(et, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /nonce too low|transaction already imported|already known/
});
var tt = class extends m {
	constructor({ cause: e, nonce: t } = {}) {
		super(`Nonce provided for the transaction ${t ? `(${t}) ` : ""}exceeds the maximum allowed nonce.`, {
			cause: e,
			name: "NonceMaxValueError"
		});
	}
};
Object.defineProperty(tt, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /nonce has max value/
});
var nt = class extends m {
	constructor({ cause: e } = {}) {
		super(["The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."].join("\n"), {
			cause: e,
			metaMessages: [
				"This error could arise when the account does not have enough funds to:",
				" - pay for the total gas fee,",
				" - pay for the value to send.",
				" ",
				"The cost of the transaction is calculated as `gas * gas fee + value`, where:",
				" - `gas` is the amount of gas needed for transaction to execute,",
				" - `gas fee` is the gas fee,",
				" - `value` is the amount of ether to send to the recipient."
			],
			name: "InsufficientFundsError"
		});
	}
};
Object.defineProperty(nt, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /insufficient funds|exceeds transaction sender account balance/
});
var rt = class extends m {
	constructor({ cause: e, gas: t } = {}) {
		super(`The amount of gas ${t ? `(${t}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
			cause: e,
			name: "IntrinsicGasTooHighError"
		});
	}
};
Object.defineProperty(rt, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /intrinsic gas too high|gas limit reached/
});
var it = class extends m {
	constructor({ cause: e, gas: t } = {}) {
		super(`The amount of gas ${t ? `(${t}) ` : ""}provided for the transaction is too low.`, {
			cause: e,
			name: "IntrinsicGasTooLowError"
		});
	}
};
Object.defineProperty(it, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /intrinsic gas too low/
});
var at = class extends m {
	constructor({ cause: e }) {
		super("The transaction type is not supported for this chain.", {
			cause: e,
			name: "TransactionTypeNotSupportedError"
		});
	}
};
Object.defineProperty(at, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /transaction type not valid/
});
var ot = class extends m {
	constructor({ cause: e, maxPriorityFeePerGas: t, maxFeePerGas: n } = {}) {
		super([`The provided tip (\`maxPriorityFeePerGas\`${t ? ` = ${D(t)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${n ? ` = ${D(n)} gwei` : ""}).`].join("\n"), {
			cause: e,
			name: "TipAboveFeeCapError"
		});
	}
};
Object.defineProperty(ot, "nodeMessage", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
var st = class extends m {
	constructor({ cause: e }) {
		super(`An error occurred while executing: ${e?.shortMessage}`, {
			cause: e,
			name: "UnknownNodeError"
		});
	}
}, ct = class extends Map {
	constructor(e) {
		super(), Object.defineProperty(this, "maxSize", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.maxSize = e;
	}
	get(e) {
		let t = super.get(e);
		return super.has(e) && (super.delete(e), super.set(e, t)), t;
	}
	set(e, t) {
		if (super.has(e) && super.delete(e), super.set(e, t), this.maxSize && this.size > this.maxSize) {
			let e = super.keys().next().value;
			e !== void 0 && super.delete(e);
		}
		return this;
	}
}, lt = BigInt(0), j = BigInt(1), ut = BigInt(2), dt = BigInt(7), ft = BigInt(256), pt = BigInt(113), mt = [], ht = [], gt = [];
for (let e = 0, t = j, n = 1, r = 0; e < 24; e++) {
	[n, r] = [r, (2 * n + 3 * r) % 5], mt.push(2 * (5 * r + n)), ht.push((e + 1) * (e + 2) / 2 % 64);
	let i = lt;
	for (let e = 0; e < 7; e++) t = (t << j ^ (t >> dt) * pt) % ft, t & ut && (i ^= j << (j << /* @__PURE__ */ BigInt(e)) - j);
	gt.push(i);
}
var _t = u(gt, !0), vt = _t[0], yt = _t[1], bt = (e, t, r) => r > 32 ? ee(e, t, r) : n(e, t, r), xt = (e, t, n) => n > 32 ? l(e, t, n) : p(e, t, n);
function St(e, t = 24) {
	let n = new Uint32Array(10);
	for (let r = 24 - t; r < 24; r++) {
		for (let t = 0; t < 10; t++) n[t] = e[t] ^ e[t + 10] ^ e[t + 20] ^ e[t + 30] ^ e[t + 40];
		for (let t = 0; t < 10; t += 2) {
			let r = (t + 8) % 10, i = (t + 2) % 10, a = n[i], o = n[i + 1], s = bt(a, o, 1) ^ n[r], c = xt(a, o, 1) ^ n[r + 1];
			for (let n = 0; n < 50; n += 10) e[t + n] ^= s, e[t + n + 1] ^= c;
		}
		let t = e[2], i = e[3];
		for (let n = 0; n < 24; n++) {
			let r = ht[n], a = bt(t, i, r), o = xt(t, i, r), s = mt[n];
			t = e[s], i = e[s + 1], e[s] = a, e[s + 1] = o;
		}
		for (let t = 0; t < 50; t += 10) {
			for (let r = 0; r < 10; r++) n[r] = e[t + r];
			for (let r = 0; r < 10; r++) e[t + r] ^= ~n[(r + 2) % 10] & n[(r + 4) % 10];
		}
		e[0] ^= vt[r], e[1] ^= yt[r];
	}
	o(n);
}
var Ct = class n extends i {
	constructor(t, n, r, i = !1, a = 24) {
		if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = t, this.suffix = n, this.outputLen = r, this.enableXOF = i, this.rounds = a, e(r), !(0 < t && t < 200)) throw Error("only keccak-f1600 function is supported");
		this.state = new Uint8Array(200), this.state32 = d(this.state);
	}
	clone() {
		return this._cloneInto();
	}
	keccak() {
		te(this.state32), St(this.state32, this.rounds), te(this.state32), this.posOut = 0, this.pos = 0;
	}
	update(e) {
		s(this), e = t(e), r(e);
		let { blockLen: n, state: i } = this, a = e.length;
		for (let t = 0; t < a;) {
			let r = Math.min(n - this.pos, a - t);
			for (let n = 0; n < r; n++) i[this.pos++] ^= e[t++];
			this.pos === n && this.keccak();
		}
		return this;
	}
	finish() {
		if (this.finished) return;
		this.finished = !0;
		let { state: e, suffix: t, pos: n, blockLen: r } = this;
		e[n] ^= t, t & 128 && n === r - 1 && this.keccak(), e[r - 1] ^= 128, this.keccak();
	}
	writeInto(e) {
		s(this, !1), r(e), this.finish();
		let t = this.state, { blockLen: n } = this;
		for (let r = 0, i = e.length; r < i;) {
			this.posOut >= n && this.keccak();
			let a = Math.min(n - this.posOut, i - r);
			e.set(t.subarray(this.posOut, this.posOut + a), r), this.posOut += a, r += a;
		}
		return e;
	}
	xofInto(e) {
		if (!this.enableXOF) throw Error("XOF is not possible for this instance");
		return this.writeInto(e);
	}
	xof(t) {
		return e(t), this.xofInto(new Uint8Array(t));
	}
	digestInto(e) {
		if (f(e, this), this.finished) throw Error("digest() was already called");
		return this.writeInto(e), this.destroy(), e;
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen));
	}
	destroy() {
		this.destroyed = !0, o(this.state);
	}
	_cloneInto(e) {
		let { blockLen: t, suffix: r, outputLen: i, rounds: a, enableXOF: o } = this;
		return e ||= new n(t, r, i, o, a), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = a, e.suffix = r, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
	}
}, M = (e, t, n) => c(() => new Ct(t, e, n));
M(6, 144, 224 / 8), M(6, 136, 256 / 8), M(6, 104, 384 / 8), M(6, 72, 512 / 8), M(1, 144, 224 / 8);
var wt = M(1, 136, 256 / 8);
M(1, 104, 384 / 8), M(1, 72, 512 / 8);
var Tt = (e, t, n) => a((r = {}) => new Ct(t, e, r.dkLen === void 0 ? n : r.dkLen, !0));
Tt(31, 168, 128 / 8), Tt(31, 136, 256 / 8);
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/keccak256.js
function Et(e, t) {
	let n = t || "hex", r = wt(g(e, { strict: !1 }) ? ve(e) : e);
	return n === "bytes" ? r : pe(r);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/address/getAddress.js
var Dt = /* @__PURE__ */ new ct(8192);
function Ot(e, t) {
	if (Dt.has(`${e}.${t}`)) return Dt.get(`${e}.${t}`);
	let n = t ? `${t}${e.toLowerCase()}` : e.substring(2).toLowerCase(), r = Et(Ce(n), "bytes"), i = (t ? n.substring(`${t}0x`.length) : n).split("");
	for (let e = 0; e < 40; e += 2) r[e >> 1] >> 4 >= 8 && i[e] && (i[e] = i[e].toUpperCase()), (r[e >> 1] & 15) >= 8 && i[e + 1] && (i[e + 1] = i[e + 1].toUpperCase());
	let a = `0x${i.join("")}`;
	return Dt.set(`${e}.${t}`, a), a;
}
function kt(e, t) {
	if (!N(e, { strict: !1 })) throw new k({ address: e });
	return Ot(e, t);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/address/isAddress.js
var At = /^0x[a-fA-F0-9]{40}$/, jt = /* @__PURE__ */ new ct(8192);
function N(e, t) {
	let { strict: n = !0 } = t ?? {}, r = `${e}.${n}`;
	if (jt.has(r)) return jt.get(r);
	let i = At.test(e) ? e.toLowerCase() === e ? !0 : n ? Ot(e) === e : !0 : !1;
	return jt.set(r, i), i;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/data/slice.js
function P(e, t, n, { strict: r } = {}) {
	return g(e, { strict: !1 }) ? Ft(e, t, n, { strict: r }) : Pt(e, t, n, { strict: r });
}
function Mt(e, t) {
	if (typeof t == "number" && t > 0 && t > _(e) - 1) throw new ce({
		offset: t,
		position: "start",
		size: _(e)
	});
}
function Nt(e, t, n) {
	if (typeof t == "number" && typeof n == "number" && _(e) !== n - t) throw new ce({
		offset: n,
		position: "end",
		size: _(e)
	});
}
function Pt(e, t, n, { strict: r } = {}) {
	Mt(e, t);
	let i = e.slice(t, n);
	return r && Nt(i, t, n), i;
}
function Ft(e, t, n, { strict: r } = {}) {
	Mt(e, t);
	let i = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (n ?? e.length) * 2)}`;
	return r && Nt(i, t, n), i;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function It({ blockNumber: e, chain: t, contract: n }) {
	let r = t?.contracts?.[n];
	if (!r) throw new qe({
		chain: t,
		contract: { name: n }
	});
	if (e && r.blockCreated && r.blockCreated > e) throw new qe({
		blockNumber: e,
		chain: t,
		contract: {
			name: n,
			blockCreated: r.blockCreated
		}
	});
	return r.address;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/accounts/utils/parseAccount.js
function Lt(e) {
	return typeof e == "string" ? {
		address: e,
		type: "json-rpc"
	} : e;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/constants/solidity.js
var Rt = {
	1: "An `assert` condition failed.",
	17: "Arithmetic operation resulted in underflow or overflow.",
	18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
	33: "Attempted to convert to an invalid type.",
	34: "Attempted to access a storage byte array that is incorrectly encoded.",
	49: "Performed `.pop()` on an empty array",
	50: "Array index is out of bounds.",
	65: "Allocated too much memory or created an array which is too large.",
	81: "Attempted to call a zero-initialized variable of internal function type."
}, zt = {
	inputs: [{
		name: "message",
		type: "string"
	}],
	name: "Error",
	type: "error"
}, Bt = {
	inputs: [{
		name: "reason",
		type: "uint256"
	}],
	name: "Panic",
	type: "error"
};
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/formatAbiItem.js
function F(e, { includeName: t = !1 } = {}) {
	if (e.type !== "function" && e.type !== "event" && e.type !== "error") throw new fn(e.type);
	return `${e.name}(${Vt(e.inputs, { includeName: t })})`;
}
function Vt(e, { includeName: t = !1 } = {}) {
	return e ? e.map((e) => Ht(e, { includeName: t })).join(t ? ", " : ",") : "";
}
function Ht(e, { includeName: t }) {
	return e.type.startsWith("tuple") ? `(${Vt(e.components, { includeName: t })})${e.type.slice(5)}` : e.type + (t && e.name ? ` ${e.name}` : "");
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/abi.js
var Ut = class extends m {
	constructor({ docsPath: e }) {
		super(["A constructor was not found on the ABI.", "Make sure you are using the correct ABI and that the constructor exists on it."].join("\n"), {
			docsPath: e,
			name: "AbiConstructorNotFoundError"
		});
	}
}, Wt = class extends m {
	constructor({ docsPath: e }) {
		super(["Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.", "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."].join("\n"), {
			docsPath: e,
			name: "AbiConstructorParamsNotFoundError"
		});
	}
}, Gt = class extends m {
	constructor({ data: e, params: t, size: n }) {
		super([`Data size of ${n} bytes is too small for given parameters.`].join("\n"), {
			metaMessages: [`Params: (${Vt(t, { includeName: !0 })})`, `Data:   ${e} (${n} bytes)`],
			name: "AbiDecodingDataSizeTooSmallError"
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "params", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "size", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.data = e, this.params = t, this.size = n;
	}
}, Kt = class extends m {
	constructor({ cause: e } = {}) {
		super("Cannot decode zero data (\"0x\") with ABI parameters.", {
			name: "AbiDecodingZeroDataError",
			cause: e
		});
	}
}, qt = class extends m {
	constructor({ expectedLength: e, givenLength: t, type: n }) {
		super([
			`ABI encoding array length mismatch for type ${n}.`,
			`Expected length: ${e}`,
			`Given length: ${t}`
		].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
	}
}, Jt = class extends m {
	constructor({ expectedSize: e, value: t }) {
		super(`Size of bytes "${t}" (bytes${_(t)}) does not match expected size (bytes${e}).`, { name: "AbiEncodingBytesSizeMismatchError" });
	}
}, Yt = class extends m {
	constructor({ expectedLength: e, givenLength: t }) {
		super([
			"ABI encoding params/values length mismatch.",
			`Expected length (params): ${e}`,
			`Given length (values): ${t}`
		].join("\n"), { name: "AbiEncodingLengthMismatchError" });
	}
}, Xt = class extends m {
	constructor(e, { docsPath: t }) {
		super([
			`Arguments (\`args\`) were provided to "${e}", but "${e}" on the ABI does not contain any parameters (\`inputs\`).`,
			"Cannot encode error result without knowing what the parameter types are.",
			"Make sure you are using the correct ABI and that the inputs exist on it."
		].join("\n"), {
			docsPath: t,
			name: "AbiErrorInputsNotFoundError"
		});
	}
}, Zt = class extends m {
	constructor(e, { docsPath: t } = {}) {
		super([`Error ${e ? `"${e}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the error exists on it."].join("\n"), {
			docsPath: t,
			name: "AbiErrorNotFoundError"
		});
	}
}, Qt = class extends m {
	constructor(e, { docsPath: t, cause: n }) {
		super([
			`Encoded error signature "${e}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the error exists on it.",
			`You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${e}.`
		].join("\n"), {
			docsPath: t,
			name: "AbiErrorSignatureNotFoundError",
			cause: n
		}), Object.defineProperty(this, "signature", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.signature = e;
	}
}, $t = class extends m {
	constructor({ docsPath: e }) {
		super("Cannot extract event signature from empty topics.", {
			docsPath: e,
			name: "AbiEventSignatureEmptyTopicsError"
		});
	}
}, en = class extends m {
	constructor(e, { docsPath: t }) {
		super([
			`Encoded event signature "${e}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the event exists on it.",
			`You can look up the signature here: https://4byte.sourcify.dev/?q=${e}.`
		].join("\n"), {
			docsPath: t,
			name: "AbiEventSignatureNotFoundError"
		});
	}
}, tn = class extends m {
	constructor(e, { docsPath: t } = {}) {
		super([`Event ${e ? `"${e}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the event exists on it."].join("\n"), {
			docsPath: t,
			name: "AbiEventNotFoundError"
		});
	}
}, I = class extends m {
	constructor(e, { docsPath: t } = {}) {
		super([`Function ${e ? `"${e}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the function exists on it."].join("\n"), {
			docsPath: t,
			name: "AbiFunctionNotFoundError"
		});
	}
}, nn = class extends m {
	constructor(e, { docsPath: t }) {
		super([
			`Function "${e}" does not contain any \`outputs\` on ABI.`,
			"Cannot decode function result without knowing what the parameter types are.",
			"Make sure you are using the correct ABI and that the function exists on it."
		].join("\n"), {
			docsPath: t,
			name: "AbiFunctionOutputsNotFoundError"
		});
	}
}, rn = class extends m {
	constructor(e, { docsPath: t }) {
		super([
			`Encoded function signature "${e}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the function exists on it.",
			`You can look up the signature here: https://4byte.sourcify.dev/?q=${e}.`
		].join("\n"), {
			docsPath: t,
			name: "AbiFunctionSignatureNotFoundError"
		});
	}
}, an = class extends m {
	constructor(e, t) {
		super("Found ambiguous types in overloaded ABI items.", {
			metaMessages: [
				`\`${e.type}\` in \`${F(e.abiItem)}\`, and`,
				`\`${t.type}\` in \`${F(t.abiItem)}\``,
				"",
				"These types encode differently and cannot be distinguished at runtime.",
				"Remove one of the ambiguous items in the ABI."
			],
			name: "AbiItemAmbiguityError"
		});
	}
}, on = class extends m {
	constructor({ expectedSize: e, givenSize: t }) {
		super(`Expected bytes${e}, got bytes${t}.`, { name: "BytesSizeMismatchError" });
	}
}, sn = class extends m {
	constructor({ abiItem: e, data: t, params: n, size: r }) {
		super([`Data size of ${r} bytes is too small for non-indexed event parameters.`].join("\n"), {
			metaMessages: [`Params: (${Vt(n, { includeName: !0 })})`, `Data:   ${t} (${r} bytes)`],
			name: "DecodeLogDataMismatch"
		}), Object.defineProperty(this, "abiItem", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "params", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "size", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.abiItem = e, this.data = t, this.params = n, this.size = r;
	}
}, cn = class extends m {
	constructor({ abiItem: e, param: t }) {
		super([`Expected a topic for indexed event parameter${t.name ? ` "${t.name}"` : ""} on event "${F(e, { includeName: !0 })}".`].join("\n"), { name: "DecodeLogTopicsMismatch" }), Object.defineProperty(this, "abiItem", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.abiItem = e;
	}
}, ln = class extends m {
	constructor(e, { docsPath: t }) {
		super([`Type "${e}" is not a valid encoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath: t,
			name: "InvalidAbiEncodingType"
		});
	}
}, un = class extends m {
	constructor(e, { docsPath: t }) {
		super([`Type "${e}" is not a valid decoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath: t,
			name: "InvalidAbiDecodingType"
		});
	}
}, dn = class extends m {
	constructor(e) {
		super([`Value "${e}" is not a valid array.`].join("\n"), { name: "InvalidArrayError" });
	}
}, fn = class extends m {
	constructor(e) {
		super([`"${e}" is not a valid definition type.`, "Valid types: \"function\", \"event\", \"error\""].join("\n"), { name: "InvalidDefinitionTypeError" });
	}
}, pn = (e) => Et(ve(e));
function mn(e) {
	return pn(e);
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/version.js
var hn = "1.2.3", L = class e extends Error {
	constructor(t, n = {}) {
		let r = n.cause instanceof e ? n.cause.details : n.cause?.message ? n.cause.message : n.details, i = n.cause instanceof e && n.cause.docsPath || n.docsPath, a = [
			t || "An error occurred.",
			"",
			...n.metaMessages ? [...n.metaMessages, ""] : [],
			...i ? [`Docs: https://abitype.dev${i}`] : [],
			...r ? [`Details: ${r}`] : [],
			`Version: abitype@${hn}`
		].join("\n");
		super(a), Object.defineProperty(this, "details", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "docsPath", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "metaMessages", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "shortMessage", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "AbiTypeError"
		}), n.cause && (this.cause = n.cause), this.details = r, this.docsPath = i, this.metaMessages = n.metaMessages, this.shortMessage = t;
	}
};
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/regex.js
function R(e, t) {
	return e.exec(t)?.groups;
}
var gn = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/, _n = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/, vn = /^\(.+?\).*?$/, yn = /^tuple(?<array>(\[(\d*)\])*)$/;
function bn(e) {
	let t = e.type;
	if (yn.test(e.type) && "components" in e) {
		t = "(";
		let n = e.components.length;
		for (let r = 0; r < n; r++) {
			let i = e.components[r];
			t += bn(i), r < n - 1 && (t += ", ");
		}
		let r = R(yn, e.type);
		return t += `)${r?.array || ""}`, bn({
			...e,
			type: t
		});
	}
	return "indexed" in e && e.indexed && (t = `${t} indexed`), e.name ? `${t} ${e.name}` : t;
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function z(e) {
	let t = "", n = e.length;
	for (let r = 0; r < n; r++) {
		let i = e[r];
		t += bn(i), r !== n - 1 && (t += ", ");
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function xn(e) {
	return e.type === "function" ? `function ${e.name}(${z(e.inputs)})${e.stateMutability && e.stateMutability !== "nonpayable" ? ` ${e.stateMutability}` : ""}${e.outputs?.length ? ` returns (${z(e.outputs)})` : ""}` : e.type === "event" ? `event ${e.name}(${z(e.inputs)})` : e.type === "error" ? `error ${e.name}(${z(e.inputs)})` : e.type === "constructor" ? `constructor(${z(e.inputs)})${e.stateMutability === "payable" ? " payable" : ""}` : e.type === "fallback" ? `fallback() external${e.stateMutability === "payable" ? " payable" : ""}` : "receive() external payable";
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
var Sn = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function Cn(e) {
	return Sn.test(e);
}
function wn(e) {
	return R(Sn, e);
}
var Tn = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function En(e) {
	return Tn.test(e);
}
function Dn(e) {
	return R(Tn, e);
}
var On = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function kn(e) {
	return On.test(e);
}
function An(e) {
	return R(On, e);
}
var jn = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function Mn(e) {
	return jn.test(e);
}
function Nn(e) {
	return R(jn, e);
}
var Pn = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function Fn(e) {
	return Pn.test(e);
}
function In(e) {
	return R(Pn, e);
}
var Ln = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function Rn(e) {
	return Ln.test(e);
}
function zn(e) {
	return R(Ln, e);
}
var Bn = /^receive\(\) external payable$/;
function Vn(e) {
	return Bn.test(e);
}
var Hn = new Set([
	"memory",
	"indexed",
	"storage",
	"calldata"
]), Un = new Set(["indexed"]), Wn = new Set([
	"calldata",
	"memory",
	"storage"
]), Gn = class extends L {
	constructor({ signature: e }) {
		super("Failed to parse ABI item.", {
			details: `parseAbiItem(${JSON.stringify(e, null, 2)})`,
			docsPath: "/api/human#parseabiitem-1"
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidAbiItemError"
		});
	}
}, Kn = class extends L {
	constructor({ type: e }) {
		super("Unknown type.", { metaMessages: [`Type "${e}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "UnknownTypeError"
		});
	}
}, qn = class extends L {
	constructor({ type: e }) {
		super("Unknown type.", { metaMessages: [`Type "${e}" is not a valid ABI type.`] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "UnknownSolidityTypeError"
		});
	}
}, Jn = class extends L {
	constructor({ params: e }) {
		super("Failed to parse ABI parameters.", {
			details: `parseAbiParameters(${JSON.stringify(e, null, 2)})`,
			docsPath: "/api/human#parseabiparameters-1"
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidAbiParametersError"
		});
	}
}, Yn = class extends L {
	constructor({ param: e }) {
		super("Invalid ABI parameter.", { details: e }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidParameterError"
		});
	}
}, Xn = class extends L {
	constructor({ param: e, name: t }) {
		super("Invalid ABI parameter.", {
			details: e,
			metaMessages: [`"${t}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`]
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "SolidityProtectedKeywordError"
		});
	}
}, Zn = class extends L {
	constructor({ param: e, type: t, modifier: n }) {
		super("Invalid ABI parameter.", {
			details: e,
			metaMessages: [`Modifier "${n}" not allowed${t ? ` in "${t}" type` : ""}.`]
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidModifierError"
		});
	}
}, Qn = class extends L {
	constructor({ param: e, type: t, modifier: n }) {
		super("Invalid ABI parameter.", {
			details: e,
			metaMessages: [`Modifier "${n}" not allowed${t ? ` in "${t}" type` : ""}.`, `Data location can only be specified for array, struct, or mapping types, but "${n}" was given.`]
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidFunctionModifierError"
		});
	}
}, $n = class extends L {
	constructor({ abiParameter: e }) {
		super("Invalid ABI parameter.", {
			details: JSON.stringify(e, null, 2),
			metaMessages: ["ABI parameter type is invalid."]
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidAbiTypeParameterError"
		});
	}
}, B = class extends L {
	constructor({ signature: e, type: t }) {
		super(`Invalid ${t} signature.`, { details: e }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidSignatureError"
		});
	}
}, er = class extends L {
	constructor({ signature: e }) {
		super("Unknown signature.", { details: e }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "UnknownSignatureError"
		});
	}
}, tr = class extends L {
	constructor({ signature: e }) {
		super("Invalid struct signature.", {
			details: e,
			metaMessages: ["No properties exist."]
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidStructSignatureError"
		});
	}
}, nr = class extends L {
	constructor({ type: e }) {
		super("Circular reference detected.", { metaMessages: [`Struct "${e}" is a circular reference.`] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "CircularReferenceError"
		});
	}
}, rr = class extends L {
	constructor({ current: e, depth: t }) {
		super("Unbalanced parentheses.", {
			metaMessages: [`"${e.trim()}" has too many ${t > 0 ? "opening" : "closing"} parentheses.`],
			details: `Depth "${t}"`
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "InvalidParenthesisError"
		});
	}
};
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function ir(e, t, n) {
	let r = "";
	if (n) for (let e of Object.entries(n)) {
		if (!e) continue;
		let t = "";
		for (let n of e[1]) t += `[${n.type}${n.name ? `:${n.name}` : ""}]`;
		r += `(${e[0]}{${t}})`;
	}
	return t ? `${t}:${e}${r}` : `${e}${r}`;
}
var ar = new Map([
	["address", { type: "address" }],
	["bool", { type: "bool" }],
	["bytes", { type: "bytes" }],
	["bytes32", { type: "bytes32" }],
	["int", { type: "int256" }],
	["int256", { type: "int256" }],
	["string", { type: "string" }],
	["uint", { type: "uint256" }],
	["uint8", { type: "uint8" }],
	["uint16", { type: "uint16" }],
	["uint24", { type: "uint24" }],
	["uint32", { type: "uint32" }],
	["uint64", { type: "uint64" }],
	["uint96", { type: "uint96" }],
	["uint112", { type: "uint112" }],
	["uint160", { type: "uint160" }],
	["uint192", { type: "uint192" }],
	["uint256", { type: "uint256" }],
	["address owner", {
		type: "address",
		name: "owner"
	}],
	["address to", {
		type: "address",
		name: "to"
	}],
	["bool approved", {
		type: "bool",
		name: "approved"
	}],
	["bytes _data", {
		type: "bytes",
		name: "_data"
	}],
	["bytes data", {
		type: "bytes",
		name: "data"
	}],
	["bytes signature", {
		type: "bytes",
		name: "signature"
	}],
	["bytes32 hash", {
		type: "bytes32",
		name: "hash"
	}],
	["bytes32 r", {
		type: "bytes32",
		name: "r"
	}],
	["bytes32 root", {
		type: "bytes32",
		name: "root"
	}],
	["bytes32 s", {
		type: "bytes32",
		name: "s"
	}],
	["string name", {
		type: "string",
		name: "name"
	}],
	["string symbol", {
		type: "string",
		name: "symbol"
	}],
	["string tokenURI", {
		type: "string",
		name: "tokenURI"
	}],
	["uint tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint8 v", {
		type: "uint8",
		name: "v"
	}],
	["uint256 balance", {
		type: "uint256",
		name: "balance"
	}],
	["uint256 tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint256 value", {
		type: "uint256",
		name: "value"
	}],
	["event:address indexed from", {
		type: "address",
		name: "from",
		indexed: !0
	}],
	["event:address indexed to", {
		type: "address",
		name: "to",
		indexed: !0
	}],
	["event:uint indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: !0
	}],
	["event:uint256 indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: !0
	}]
]);
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function or(e, t = {}) {
	if (kn(e)) return sr(e, t);
	if (En(e)) return cr(e, t);
	if (Cn(e)) return lr(e, t);
	if (Fn(e)) return ur(e, t);
	if (Rn(e)) return dr(e);
	if (Vn(e)) return {
		type: "receive",
		stateMutability: "payable"
	};
	throw new er({ signature: e });
}
function sr(e, t = {}) {
	let n = An(e);
	if (!n) throw new B({
		signature: e,
		type: "function"
	});
	let r = H(n.parameters), i = [], a = r.length;
	for (let e = 0; e < a; e++) i.push(V(r[e], {
		modifiers: Wn,
		structs: t,
		type: "function"
	}));
	let o = [];
	if (n.returns) {
		let e = H(n.returns), r = e.length;
		for (let n = 0; n < r; n++) o.push(V(e[n], {
			modifiers: Wn,
			structs: t,
			type: "function"
		}));
	}
	return {
		name: n.name,
		type: "function",
		stateMutability: n.stateMutability ?? "nonpayable",
		inputs: i,
		outputs: o
	};
}
function cr(e, t = {}) {
	let n = Dn(e);
	if (!n) throw new B({
		signature: e,
		type: "event"
	});
	let r = H(n.parameters), i = [], a = r.length;
	for (let e = 0; e < a; e++) i.push(V(r[e], {
		modifiers: Un,
		structs: t,
		type: "event"
	}));
	return {
		name: n.name,
		type: "event",
		inputs: i
	};
}
function lr(e, t = {}) {
	let n = wn(e);
	if (!n) throw new B({
		signature: e,
		type: "error"
	});
	let r = H(n.parameters), i = [], a = r.length;
	for (let e = 0; e < a; e++) i.push(V(r[e], {
		structs: t,
		type: "error"
	}));
	return {
		name: n.name,
		type: "error",
		inputs: i
	};
}
function ur(e, t = {}) {
	let n = In(e);
	if (!n) throw new B({
		signature: e,
		type: "constructor"
	});
	let r = H(n.parameters), i = [], a = r.length;
	for (let e = 0; e < a; e++) i.push(V(r[e], {
		structs: t,
		type: "constructor"
	}));
	return {
		type: "constructor",
		stateMutability: n.stateMutability ?? "nonpayable",
		inputs: i
	};
}
function dr(e) {
	let t = zn(e);
	if (!t) throw new B({
		signature: e,
		type: "fallback"
	});
	return {
		type: "fallback",
		stateMutability: t.stateMutability ?? "nonpayable"
	};
}
var fr = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/, pr = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/, mr = /^u?int$/;
function V(e, t) {
	let n = ir(e, t?.type, t?.structs);
	if (ar.has(n)) return ar.get(n);
	let r = vn.test(e), i = R(r ? pr : fr, e);
	if (!i) throw new Yn({ param: e });
	if (i.name && _r(i.name)) throw new Xn({
		param: e,
		name: i.name
	});
	let a = i.name ? { name: i.name } : {}, o = i.modifier === "indexed" ? { indexed: !0 } : {}, s = t?.structs ?? {}, c, l = {};
	if (r) {
		c = "tuple";
		let e = H(i.type), t = [], n = e.length;
		for (let r = 0; r < n; r++) t.push(V(e[r], { structs: s }));
		l = { components: t };
	} else if (i.type in s) c = "tuple", l = { components: s[i.type] };
	else if (mr.test(i.type)) c = `${i.type}256`;
	else if (i.type === "address payable") c = "address";
	else if (c = i.type, t?.type !== "struct" && !hr(c)) throw new qn({ type: c });
	if (i.modifier) {
		if (!t?.modifiers?.has?.(i.modifier)) throw new Zn({
			param: e,
			type: t?.type,
			modifier: i.modifier
		});
		if (Wn.has(i.modifier) && !vr(c, !!i.array)) throw new Qn({
			param: e,
			type: t?.type,
			modifier: i.modifier
		});
	}
	let u = {
		type: `${c}${i.array ?? ""}`,
		...a,
		...o,
		...l
	};
	return ar.set(n, u), u;
}
function H(e, t = [], n = "", r = 0) {
	let i = e.trim().length;
	for (let a = 0; a < i; a++) {
		let i = e[a], o = e.slice(a + 1);
		switch (i) {
			case ",": return r === 0 ? H(o, [...t, n.trim()]) : H(o, t, `${n}${i}`, r);
			case "(": return H(o, t, `${n}${i}`, r + 1);
			case ")": return H(o, t, `${n}${i}`, r - 1);
			default: return H(o, t, `${n}${i}`, r);
		}
	}
	if (n === "") return t;
	if (r !== 0) throw new rr({
		current: n,
		depth: r
	});
	return t.push(n.trim()), t;
}
function hr(e) {
	return e === "address" || e === "bool" || e === "function" || e === "string" || gn.test(e) || _n.test(e);
}
var gr = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
function _r(e) {
	return e === "address" || e === "bool" || e === "function" || e === "string" || e === "tuple" || gn.test(e) || _n.test(e) || gr.test(e);
}
function vr(e, t) {
	return t || e === "bytes" || e === "string" || e === "tuple";
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function yr(e) {
	let t = {}, n = e.length;
	for (let r = 0; r < n; r++) {
		let n = e[r];
		if (!Mn(n)) continue;
		let i = Nn(n);
		if (!i) throw new B({
			signature: n,
			type: "struct"
		});
		let a = i.properties.split(";"), o = [], s = a.length;
		for (let e = 0; e < s; e++) {
			let t = a[e].trim();
			if (!t) continue;
			let n = V(t, { type: "struct" });
			o.push(n);
		}
		if (!o.length) throw new tr({ signature: n });
		t[i.name] = o;
	}
	let r = {}, i = Object.entries(t), a = i.length;
	for (let e = 0; e < a; e++) {
		let [n, a] = i[e];
		r[n] = xr(a, t);
	}
	return r;
}
var br = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function xr(e = [], t = {}, n = /* @__PURE__ */ new Set()) {
	let r = [], i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		if (vn.test(i.type)) r.push(i);
		else {
			let e = R(br, i.type);
			if (!e?.type) throw new $n({ abiParameter: i });
			let { array: a, type: o } = e;
			if (o in t) {
				if (n.has(o)) throw new nr({ type: o });
				r.push({
					...i,
					type: `tuple${a ?? ""}`,
					components: xr(t[o], t, new Set([...n, o]))
				});
			} else if (hr(o)) r.push(i);
			else throw new Kn({ type: o });
		}
	}
	return r;
}
//#endregion
//#region node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3/node_modules/abitype/dist/esm/human-readable/parseAbi.js
function Sr(e) {
	let t = yr(e), n = [], r = e.length;
	for (let i = 0; i < r; i++) {
		let r = e[i];
		Mn(r) || n.push(or(r, t));
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/normalizeSignature.js
function Cr(e) {
	let t = !0, n = "", r = 0, i = "", a = !1;
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		if ([
			"(",
			")",
			","
		].includes(s) && (t = !0), s === "(" && r++, s === ")" && r--, t) {
			if (r === 0) {
				if (s === " " && [
					"event",
					"function",
					""
				].includes(i)) i = "";
				else if (i += s, s === ")") {
					a = !0;
					break;
				}
				continue;
			}
			if (s === " ") {
				e[o - 1] !== "," && n !== "," && n !== ",(" && (n = "", t = !1);
				continue;
			}
			i += s, n += s;
		}
	}
	if (!a) throw new m("Unable to normalize signature.");
	return i;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/toSignature.js
var wr = (e) => Cr(typeof e == "string" ? e : xn(e));
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/toSignatureHash.js
function Tr(e) {
	return mn(wr(e));
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var Er = (e) => P(Tr(e), 0, 4);
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/encoding/fromBytes.js
function Dr(e, t = {}) {
	return t.size !== void 0 && w(e, { size: t.size }), we(x(e, t), t);
}
function Or(e, t = {}) {
	let n = e;
	if (t.size !== void 0 && (w(n, { size: t.size }), n = v(n)), n.length > 1 || n[0] > 1) throw new h(n);
	return !!n[0];
}
function U(e, t = {}) {
	return t.size !== void 0 && w(e, { size: t.size }), Ee(x(e, t), t);
}
function kr(e, t = {}) {
	let n = e;
	return t.size !== void 0 && (w(n, { size: t.size }), n = v(n, { dir: "right" })), new TextDecoder().decode(n);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/regex.js
var Ar = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/, jr = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function Mr(e, t) {
	if (e.length !== t.length) throw new Yt({
		expectedLength: e.length,
		givenLength: t.length
	});
	let n = Fr(Nr({
		params: e,
		values: t
	}));
	return n.length === 0 ? "0x" : n;
}
function Nr({ params: e, values: t }) {
	let n = [];
	for (let r = 0; r < e.length; r++) n.push(Pr({
		param: e[r],
		value: t[r]
	}));
	return n;
}
function Pr({ param: e, value: t }) {
	let n = Ur(e.type);
	if (n) {
		let [r, i] = n;
		return Lr(t, {
			length: r,
			param: {
				...e,
				type: i
			}
		});
	}
	if (e.type === "tuple") return Hr(t, { param: e });
	if (e.type === "address") return Ir(t);
	if (e.type === "bool") return zr(t);
	if (e.type.startsWith("uint") || e.type.startsWith("int")) {
		let n = e.type.startsWith("int"), [, , r = "256"] = jr.exec(e.type) ?? [];
		return Br(t, {
			signed: n,
			size: Number(r)
		});
	}
	if (e.type.startsWith("bytes")) return Rr(t, { param: e });
	if (e.type === "string") return Vr(t);
	throw new ln(e.type, { docsPath: "/docs/contract/encodeAbiParameters" });
}
function Fr(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let { dynamic: r, encoded: i } = e[n];
		r ? t += 32 : t += _(i);
	}
	let n = [], r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let { dynamic: o, encoded: s } = e[a];
		o ? (n.push(S(t + i, { size: 32 })), r.push(s), i += _(s)) : n.push(s);
	}
	return T([...n, ...r]);
}
function Ir(e) {
	if (!N(e)) throw new k({ address: e });
	return {
		dynamic: !1,
		encoded: b(e.toLowerCase())
	};
}
function Lr(e, { length: t, param: n }) {
	let r = t === null;
	if (!Array.isArray(e)) throw new dn(e);
	if (!r && e.length !== t) throw new qt({
		expectedLength: t,
		givenLength: e.length,
		type: `${n.type}[${t}]`
	});
	let i = !1, a = [];
	for (let t = 0; t < e.length; t++) {
		let r = Pr({
			param: n,
			value: e[t]
		});
		r.dynamic && (i = !0), a.push(r);
	}
	if (r || i) {
		let e = Fr(a);
		if (r) {
			let t = S(a.length, { size: 32 });
			return {
				dynamic: !0,
				encoded: a.length > 0 ? T([t, e]) : t
			};
		}
		if (i) return {
			dynamic: !0,
			encoded: e
		};
	}
	return {
		dynamic: !1,
		encoded: T(a.map(({ encoded: e }) => e))
	};
}
function Rr(e, { param: t }) {
	let [, n] = t.type.split("bytes"), r = _(e);
	if (!n) {
		let t = e;
		return r % 32 != 0 && (t = b(t, {
			dir: "right",
			size: Math.ceil((e.length - 2) / 2 / 32) * 32
		})), {
			dynamic: !0,
			encoded: T([b(S(r, { size: 32 })), t])
		};
	}
	if (r !== Number.parseInt(n, 10)) throw new Jt({
		expectedSize: Number.parseInt(n, 10),
		value: e
	});
	return {
		dynamic: !1,
		encoded: b(e, { dir: "right" })
	};
}
function zr(e) {
	if (typeof e != "boolean") throw new m(`Invalid boolean value: "${e}" (type: ${typeof e}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: !1,
		encoded: b(me(e))
	};
}
function Br(e, { signed: t, size: n = 256 }) {
	if (typeof n == "number") {
		let r = 2n ** (BigInt(n) - (t ? 1n : 0n)) - 1n, i = t ? -r - 1n : 0n;
		if (e > r || e < i) throw new ae({
			max: r.toString(),
			min: i.toString(),
			signed: t,
			size: n / 8,
			value: e.toString()
		});
	}
	return {
		dynamic: !1,
		encoded: S(e, {
			size: 32,
			signed: t
		})
	};
}
function Vr(e) {
	let t = ge(e), n = Math.ceil(_(t) / 32), r = [];
	for (let e = 0; e < n; e++) r.push(b(P(t, e * 32, (e + 1) * 32), { dir: "right" }));
	return {
		dynamic: !0,
		encoded: T([b(S(_(t), { size: 32 })), ...r])
	};
}
function Hr(e, { param: t }) {
	let n = !1, r = [];
	for (let i = 0; i < t.components.length; i++) {
		let a = t.components[i], o = Pr({
			param: a,
			value: e[Array.isArray(e) ? i : a.name]
		});
		r.push(o), o.dynamic && (n = !0);
	}
	return {
		dynamic: n,
		encoded: n ? Fr(r) : T(r.map(({ encoded: e }) => e))
	};
}
function Ur(e) {
	let t = e.match(/^(.*)\[(\d+)?\]$/);
	return t ? [t[2] ? Number(t[2]) : null, t[1]] : void 0;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function Wr(e, t) {
	let n = typeof t == "string" ? xe(t) : t, r = Ie(n);
	if (_(n) === 0 && e.length > 0) throw new Kt();
	if (_(t) && _(t) < 32) throw new Gt({
		data: typeof t == "string" ? t : x(t),
		params: e,
		size: _(t)
	});
	let i = 0, a = [];
	for (let t = 0; t < e.length; ++t) {
		let n = e[t];
		r.setPosition(i);
		let [o, s] = W(r, n, { staticPosition: 0 });
		i += s, a.push(o);
	}
	return a;
}
function W(e, t, { staticPosition: n }) {
	let r = Ur(t.type);
	if (r) {
		let [i, a] = r;
		return Jr(e, {
			...t,
			type: a
		}, {
			length: i,
			staticPosition: n
		});
	}
	if (t.type === "tuple") return Qr(e, t, { staticPosition: n });
	if (t.type === "address") return qr(e);
	if (t.type === "bool") return Yr(e);
	if (t.type.startsWith("bytes")) return Xr(e, t, { staticPosition: n });
	if (t.type.startsWith("uint") || t.type.startsWith("int")) return Zr(e, t);
	if (t.type === "string") return $r(e, { staticPosition: n });
	throw new un(t.type, { docsPath: "/docs/contract/decodeAbiParameters" });
}
var Gr = 32, Kr = 32;
function qr(e) {
	return [Ot(x(Pt(e.readBytes(32), -20))), 32];
}
function Jr(e, t, { length: n, staticPosition: r }) {
	if (!n) {
		let n = r + U(e.readBytes(Kr)), i = n + Gr;
		e.setPosition(n);
		let a = U(e.readBytes(Gr)), o = ei(t), s = 0, c = [];
		for (let n = 0; n < a; ++n) {
			e.setPosition(i + (o ? n * 32 : s));
			let [r, a] = W(e, t, { staticPosition: i });
			s += a, c.push(r);
		}
		return e.setPosition(r + 32), [c, 32];
	}
	if (ei(t)) {
		let i = r + U(e.readBytes(Kr)), a = [];
		for (let r = 0; r < n; ++r) {
			e.setPosition(i + r * 32);
			let [n] = W(e, t, { staticPosition: i });
			a.push(n);
		}
		return e.setPosition(r + 32), [a, 32];
	}
	let i = 0, a = [];
	for (let o = 0; o < n; ++o) {
		let [n, o] = W(e, t, { staticPosition: r + i });
		i += o, a.push(n);
	}
	return [a, i];
}
function Yr(e) {
	return [Or(e.readBytes(32), { size: 32 }), 32];
}
function Xr(e, t, { staticPosition: n }) {
	let [r, i] = t.type.split("bytes");
	if (!i) {
		let t = U(e.readBytes(32));
		e.setPosition(n + t);
		let r = U(e.readBytes(32));
		if (r === 0) return e.setPosition(n + 32), ["0x", 32];
		let i = e.readBytes(r);
		return e.setPosition(n + 32), [x(i), 32];
	}
	return [x(e.readBytes(Number.parseInt(i, 10), 32)), 32];
}
function Zr(e, t) {
	let n = t.type.startsWith("int"), r = Number.parseInt(t.type.split("int")[1] || "256", 10), i = e.readBytes(32);
	return [r > 48 ? Dr(i, { signed: n }) : U(i, { signed: n }), 32];
}
function Qr(e, t, { staticPosition: n }) {
	let r = t.components.length === 0 || t.components.some(({ name: e }) => !e), i = r ? [] : {}, a = 0;
	if (ei(t)) {
		let o = n + U(e.readBytes(Kr));
		for (let n = 0; n < t.components.length; ++n) {
			let s = t.components[n];
			e.setPosition(o + a);
			let [c, l] = W(e, s, { staticPosition: o });
			a += l, i[r ? n : s?.name] = c;
		}
		return e.setPosition(n + 32), [i, 32];
	}
	for (let o = 0; o < t.components.length; ++o) {
		let s = t.components[o], [c, l] = W(e, s, { staticPosition: n });
		i[r ? o : s?.name] = c, a += l;
	}
	return [i, a];
}
function $r(e, { staticPosition: t }) {
	let n = t + U(e.readBytes(32));
	e.setPosition(n);
	let r = U(e.readBytes(32));
	if (r === 0) return e.setPosition(t + 32), ["", 32];
	let i = kr(v(e.readBytes(r, 32)));
	return e.setPosition(t + 32), [i, 32];
}
function ei(e) {
	let { type: t } = e;
	if (t === "string" || t === "bytes" || t.endsWith("[]")) return !0;
	if (t === "tuple") return e.components?.some(ei);
	let n = Ur(e.type);
	return !!(n && ei({
		...e,
		type: n[1]
	}));
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function ti(e) {
	let { abi: t, data: n, cause: r } = e, i = P(n, 0, 4);
	if (i === "0x") throw new Kt({ cause: r });
	let a = [
		...t || [],
		zt,
		Bt
	].find((e) => e.type === "error" && i === Er(F(e)));
	if (!a) throw new Qt(i, {
		docsPath: "/docs/contract/decodeErrorResult",
		cause: r
	});
	return {
		abiItem: a,
		args: "inputs" in a && a.inputs && a.inputs.length > 0 ? Wr(a.inputs, P(n, 4)) : void 0,
		errorName: a.name
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/stringify.js
var ni = (e, t, n) => JSON.stringify(e, (e, n) => {
	let r = typeof n == "bigint" ? n.toString() : n;
	return typeof t == "function" ? t(e, r) : r;
}, n);
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function ri({ abiItem: e, args: t, includeFunctionName: n = !0, includeName: r = !1 }) {
	if ("name" in e && "inputs" in e && e.inputs) return `${n ? e.name : ""}(${e.inputs.map((e, n) => `${r && e.name ? `${e.name}: ` : ""}${typeof t[n] == "object" ? ni(t[n]) : t[n]}`).join(", ")})`;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/hash/toEventSelector.js
var ii = Tr;
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/getAbiItem.js
function G(e) {
	let { abi: t, args: n = [], name: r } = e, i = g(r, { strict: !1 }), a = t.filter((e) => i ? e.type === "function" ? Er(e) === r : e.type === "event" ? ii(e) === r : !1 : "name" in e && e.name === r);
	if (a.length === 0) return;
	if (a.length === 1) return a[0];
	let o;
	for (let e of a) if ("inputs" in e) {
		if (!n || n.length === 0) {
			if (!e.inputs || e.inputs.length === 0) return e;
			continue;
		}
		if (e.inputs && e.inputs.length !== 0 && e.inputs.length === n.length && n.every((t, n) => {
			let r = "inputs" in e && e.inputs[n];
			return r ? ai(t, r) : !1;
		})) {
			if (o && "inputs" in o && o.inputs) {
				let t = oi(e.inputs, o.inputs, n);
				if (t) throw new an({
					abiItem: e,
					type: t[0]
				}, {
					abiItem: o,
					type: t[1]
				});
			}
			o = e;
		}
	}
	return o || a[0];
}
function ai(e, t) {
	let n = typeof e, r = t.type;
	switch (r) {
		case "address": return N(e, { strict: !1 });
		case "bool": return n === "boolean";
		case "function": return n === "string";
		case "string": return n === "string";
		default: return r === "tuple" && "components" in t ? Object.values(t.components).every((t, r) => n === "object" && ai(Object.values(e)[r], t)) : /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(r) ? n === "number" || n === "bigint" : /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(r) ? n === "string" || e instanceof Uint8Array : /[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(r) ? Array.isArray(e) && e.every((e) => ai(e, {
			...t,
			type: r.replace(/(\[[0-9]{0,}\])$/, "")
		})) : !1;
	}
}
function oi(e, t, n) {
	for (let r in e) {
		let i = e[r], a = t[r];
		if (i.type === "tuple" && a.type === "tuple" && "components" in i && "components" in a) return oi(i.components, a.components, n[r]);
		let o = [i.type, a.type];
		if (o.includes("address") && o.includes("bytes20") || (o.includes("address") && o.includes("string") || o.includes("address") && o.includes("bytes")) && N(n[r], { strict: !1 })) return o;
	}
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/stateOverride.js
var si = class extends m {
	constructor({ address: e }) {
		super(`State for account "${e}" is set multiple times.`, { name: "AccountStateConflictError" });
	}
}, ci = class extends m {
	constructor() {
		super("state and stateDiff are set on the same account.", { name: "StateAssignmentConflictError" });
	}
};
function li(e) {
	return e.reduce((e, { slot: t, value: n }) => `${e}        ${t}: ${n}\n`, "");
}
function ui(e) {
	return e.reduce((e, { address: t, ...n }) => {
		let r = `${e}    ${t}:\n`;
		return n.nonce && (r += `      nonce: ${n.nonce}\n`), n.balance && (r += `      balance: ${n.balance}\n`), n.code && (r += `      code: ${n.code}\n`), n.state && (r += "      state:\n", r += li(n.state)), n.stateDiff && (r += "      stateDiff:\n", r += li(n.stateDiff)), r;
	}, "  State Override:\n").slice(0, -1);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/utils.js
var di = (e) => e, fi = (e) => e, pi = class extends m {
	constructor(e, { account: t, docsPath: n, chain: r, data: i, gas: a, gasPrice: o, maxFeePerGas: s, maxPriorityFeePerGas: c, nonce: l, to: u, value: d, stateOverride: f }) {
		let p = O({
			from: (t ? Lt(t) : void 0)?.address,
			to: u,
			value: d !== void 0 && `${Be(d)} ${r?.nativeCurrency?.symbol || "ETH"}`,
			data: i,
			gas: a,
			gasPrice: o !== void 0 && `${D(o)} gwei`,
			maxFeePerGas: s !== void 0 && `${D(s)} gwei`,
			maxPriorityFeePerGas: c !== void 0 && `${D(c)} gwei`,
			nonce: l
		});
		f && (p += `\n${ui(f)}`), super(e.shortMessage, {
			cause: e,
			docsPath: n,
			metaMessages: [
				...e.metaMessages ? [...e.metaMessages, " "] : [],
				"Raw Call Arguments:",
				p
			].filter(Boolean),
			name: "CallExecutionError"
		}), Object.defineProperty(this, "cause", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.cause = e;
	}
}, mi = class extends m {
	constructor(e, { abi: t, args: n, contractAddress: r, docsPath: i, functionName: a, sender: o }) {
		let s = G({
			abi: t,
			args: n,
			name: a
		}), c = s ? ri({
			abiItem: s,
			args: n,
			includeFunctionName: !1,
			includeName: !1
		}) : void 0, l = s ? F(s, { includeName: !0 }) : void 0, u = O({
			address: r && di(r),
			function: l,
			args: c && c !== "()" && `${[...Array(a?.length ?? 0).keys()].map(() => " ").join("")}${c}`,
			sender: o
		});
		super(e.shortMessage || `An unknown error occurred while executing the contract function "${a}".`, {
			cause: e,
			docsPath: i,
			metaMessages: [
				...e.metaMessages ? [...e.metaMessages, " "] : [],
				u && "Contract Call:",
				u
			].filter(Boolean),
			name: "ContractFunctionExecutionError"
		}), Object.defineProperty(this, "abi", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "args", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "cause", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "contractAddress", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "formattedArgs", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "functionName", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "sender", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.abi = t, this.args = n, this.cause = e, this.contractAddress = r, this.functionName = a, this.sender = o;
	}
}, hi = class extends m {
	constructor({ abi: e, data: t, functionName: n, message: r, cause: i }) {
		let a, o, s, c;
		if (t && t !== "0x") try {
			o = ti({
				abi: e,
				data: t,
				cause: i
			});
			let { abiItem: n, errorName: r, args: a } = o;
			if (r === "Error") c = a[0];
			else if (r === "Panic") {
				let [e] = a;
				c = Rt[e];
			} else {
				let e = n ? F(n, { includeName: !0 }) : void 0, t = n && a ? ri({
					abiItem: n,
					args: a,
					includeFunctionName: !1,
					includeName: !1
				}) : void 0;
				s = [e ? `Error: ${e}` : "", t && t !== "()" ? `       ${[...Array(r?.length ?? 0).keys()].map(() => " ").join("")}${t}` : ""];
			}
		} catch (e) {
			a = e;
		}
		else r && (c = r);
		let l;
		a instanceof Qt && (l = a.signature, s = [
			`Unable to decode signature "${l}" as it was not found on the provided ABI.`,
			"Make sure you are using the correct ABI and that the error exists on it.",
			`You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${l}.`
		]), super(c && c !== "execution reverted" || l ? [`The contract function "${n}" reverted with the following ${l ? "signature" : "reason"}:`, c || l].join("\n") : `The contract function "${n}" reverted.`, {
			cause: a ?? i,
			metaMessages: s,
			name: "ContractFunctionRevertedError"
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "raw", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "reason", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "signature", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.data = o, this.raw = t, this.reason = c, this.signature = l;
	}
}, gi = class extends m {
	constructor({ functionName: e, cause: t }) {
		super(`The contract function "${e}" returned no data ("0x").`, {
			metaMessages: [
				"This could be due to any of the following:",
				`  - The contract does not have the function "${e}",`,
				"  - The parameters passed to the contract function may be invalid, or",
				"  - The address is not a contract."
			],
			name: "ContractFunctionZeroDataError",
			cause: t
		});
	}
}, _i = class extends m {
	constructor({ factory: e }) {
		super(`Deployment for counterfactual contract call failed${e ? ` for factory "${e}".` : ""}`, {
			metaMessages: [
				"Please ensure:",
				"- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
				"- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
			],
			name: "CounterfactualDeploymentFailedError"
		});
	}
}, vi = class extends m {
	constructor({ data: e, message: t }) {
		super(t || "", { name: "RawContractError" }), Object.defineProperty(this, "code", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: 3
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.data = e;
	}
}, yi = class extends m {
	constructor({ body: e, cause: t, details: n, headers: r, status: i, url: a }) {
		super("HTTP request failed.", {
			cause: t,
			details: n,
			metaMessages: [
				i && `Status: ${i}`,
				`URL: ${fi(a)}`,
				e && `Request body: ${ni(e)}`
			].filter(Boolean),
			name: "HttpRequestError"
		}), Object.defineProperty(this, "body", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "headers", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "status", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "url", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.body = e, this.headers = r, this.status = i, this.url = a;
	}
}, bi = class extends m {
	constructor({ body: e, error: t, url: n }) {
		super("RPC Request failed.", {
			cause: t,
			details: t.message,
			metaMessages: [`URL: ${fi(n)}`, `Request body: ${ni(e)}`],
			name: "RpcRequestError"
		}), Object.defineProperty(this, "code", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "url", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.code = t.code, this.data = t.data, this.url = n;
	}
}, xi = class extends m {
	constructor({ body: e, url: t }) {
		super("The request took too long to respond.", {
			details: "The request timed out.",
			metaMessages: [`URL: ${fi(t)}`, `Request body: ${ni(e)}`],
			name: "TimeoutError"
		}), Object.defineProperty(this, "url", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.url = t;
	}
}, Si = -1, K = class extends m {
	constructor(e, { code: t, docsPath: n, metaMessages: r, name: i, shortMessage: a }) {
		super(a, {
			cause: e,
			docsPath: n,
			metaMessages: r || e?.metaMessages,
			name: i || "RpcError"
		}), Object.defineProperty(this, "code", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.name = i || e.name, this.code = e instanceof bi ? e.code : t ?? Si;
	}
}, q = class extends K {
	constructor(e, t) {
		super(e, t), Object.defineProperty(this, "data", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), this.data = t.data;
	}
}, Ci = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "ParseRpcError",
			shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
		});
	}
};
Object.defineProperty(Ci, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32700
});
var wi = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "InvalidRequestRpcError",
			shortMessage: "JSON is not a valid request object."
		});
	}
};
Object.defineProperty(wi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32600
});
var Ti = class e extends K {
	constructor(t, { method: n } = {}) {
		super(t, {
			code: e.code,
			name: "MethodNotFoundRpcError",
			shortMessage: `The method${n ? ` "${n}"` : ""} does not exist / is not available.`
		});
	}
};
Object.defineProperty(Ti, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32601
});
var Ei = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "InvalidParamsRpcError",
			shortMessage: ["Invalid parameters were provided to the RPC method.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(Ei, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32602
});
var Di = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "InternalRpcError",
			shortMessage: "An internal error was received."
		});
	}
};
Object.defineProperty(Di, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32603
});
var Oi = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "InvalidInputRpcError",
			shortMessage: ["Missing or invalid parameters.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(Oi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32e3
});
var ki = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "ResourceNotFoundRpcError",
			shortMessage: "Requested resource not found."
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "ResourceNotFoundRpcError"
		});
	}
};
Object.defineProperty(ki, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32001
});
var Ai = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "ResourceUnavailableRpcError",
			shortMessage: "Requested resource not available."
		});
	}
};
Object.defineProperty(Ai, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32002
});
var ji = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "TransactionRejectedRpcError",
			shortMessage: "Transaction creation failed."
		});
	}
};
Object.defineProperty(ji, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32003
});
var Mi = class e extends K {
	constructor(t, { method: n } = {}) {
		super(t, {
			code: e.code,
			name: "MethodNotSupportedRpcError",
			shortMessage: `Method${n ? ` "${n}"` : ""} is not supported.`
		});
	}
};
Object.defineProperty(Mi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32004
});
var Ni = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "LimitExceededRpcError",
			shortMessage: "Request exceeds defined limit."
		});
	}
};
Object.defineProperty(Ni, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32005
});
var Pi = class e extends K {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "JsonRpcVersionUnsupportedError",
			shortMessage: "Version of JSON-RPC protocol is not supported."
		});
	}
};
Object.defineProperty(Pi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: -32006
});
var Fi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "UserRejectedRequestError",
			shortMessage: "User rejected the request."
		});
	}
};
Object.defineProperty(Fi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4001
});
var Ii = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "UnauthorizedProviderError",
			shortMessage: "The requested method and/or account has not been authorized by the user."
		});
	}
};
Object.defineProperty(Ii, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4100
});
var Li = class e extends q {
	constructor(t, { method: n } = {}) {
		super(t, {
			code: e.code,
			name: "UnsupportedProviderMethodError",
			shortMessage: `The Provider does not support the requested method${n ? ` " ${n}"` : ""}.`
		});
	}
};
Object.defineProperty(Li, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4200
});
var Ri = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "ProviderDisconnectedError",
			shortMessage: "The Provider is disconnected from all chains."
		});
	}
};
Object.defineProperty(Ri, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4900
});
var zi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "ChainDisconnectedError",
			shortMessage: "The Provider is not connected to the requested chain."
		});
	}
};
Object.defineProperty(zi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4901
});
var Bi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "SwitchChainError",
			shortMessage: "An error occurred when attempting to switch chain."
		});
	}
};
Object.defineProperty(Bi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 4902
});
var Vi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "UnsupportedNonOptionalCapabilityError",
			shortMessage: "This Wallet does not support a capability that was not marked as optional."
		});
	}
};
Object.defineProperty(Vi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5700
});
var Hi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "UnsupportedChainIdError",
			shortMessage: "This Wallet does not support the requested chain ID."
		});
	}
};
Object.defineProperty(Hi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5710
});
var Ui = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "DuplicateIdError",
			shortMessage: "There is already a bundle submitted with this ID."
		});
	}
};
Object.defineProperty(Ui, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5720
});
var Wi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "UnknownBundleIdError",
			shortMessage: "This bundle id is unknown / has not been submitted"
		});
	}
};
Object.defineProperty(Wi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5730
});
var Gi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "BundleTooLargeError",
			shortMessage: "The call bundle is too large for the Wallet to process."
		});
	}
};
Object.defineProperty(Gi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5740
});
var Ki = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "AtomicReadyWalletRejectedUpgradeError",
			shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
		});
	}
};
Object.defineProperty(Ki, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5750
});
var qi = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "AtomicityNotSupportedError",
			shortMessage: "The wallet does not support atomic execution but the request requires it."
		});
	}
};
Object.defineProperty(qi, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 5760
});
var Ji = class e extends q {
	constructor(t) {
		super(t, {
			code: e.code,
			name: "WalletConnectSessionSettlementError",
			shortMessage: "WalletConnect session settlement failed."
		});
	}
};
Object.defineProperty(Ji, "code", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: 7e3
});
var Yi = class extends K {
	constructor(e) {
		super(e, {
			name: "UnknownRpcError",
			shortMessage: "An unknown RPC error occurred."
		});
	}
};
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/errors/getNodeError.js
function Xi(e, t) {
	let n = (e.details || "").toLowerCase(), r = e instanceof m ? e.walk((e) => e?.code === A.code) : e;
	return r instanceof m ? new A({
		cause: e,
		message: r.details
	}) : A.nodeMessage.test(n) ? new A({
		cause: e,
		message: e.details
	}) : Ze.nodeMessage.test(n) ? new Ze({
		cause: e,
		maxFeePerGas: t?.maxFeePerGas
	}) : Qe.nodeMessage.test(n) ? new Qe({
		cause: e,
		maxFeePerGas: t?.maxFeePerGas
	}) : $e.nodeMessage.test(n) ? new $e({
		cause: e,
		nonce: t?.nonce
	}) : et.nodeMessage.test(n) ? new et({
		cause: e,
		nonce: t?.nonce
	}) : tt.nodeMessage.test(n) ? new tt({
		cause: e,
		nonce: t?.nonce
	}) : nt.nodeMessage.test(n) ? new nt({ cause: e }) : rt.nodeMessage.test(n) ? new rt({
		cause: e,
		gas: t?.gas
	}) : it.nodeMessage.test(n) ? new it({
		cause: e,
		gas: t?.gas
	}) : at.nodeMessage.test(n) ? new at({ cause: e }) : ot.nodeMessage.test(n) ? new ot({
		cause: e,
		maxFeePerGas: t?.maxFeePerGas,
		maxPriorityFeePerGas: t?.maxPriorityFeePerGas
	}) : new st({ cause: e });
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/errors/getCallError.js
function Zi(e, { docsPath: t, ...n }) {
	return new pi((() => {
		let t = Xi(e, n);
		return t instanceof st ? e : t;
	})(), {
		docsPath: t,
		...n
	});
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/formatters/extract.js
function Qi(e, { format: t }) {
	if (!t) return {};
	let n = {};
	function r(t) {
		let i = Object.keys(t);
		for (let a of i) a in e && (n[a] = e[a]), t[a] && typeof t[a] == "object" && !Array.isArray(t[a]) && r(t[a]);
	}
	return r(t(e || {})), n;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/transaction/assertRequest.js
function $i(e) {
	let { account: t, maxFeePerGas: n, maxPriorityFeePerGas: r, to: i } = e, a = t ? Lt(t) : void 0;
	if (a && !N(a.address)) throw new k({ address: a.address });
	if (i && !N(i)) throw new k({ address: i });
	if (n && n > Ae) throw new Ze({ maxFeePerGas: n });
	if (r && n && r > n) throw new ot({
		maxFeePerGas: n,
		maxPriorityFeePerGas: r
	});
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/version.js
var ea = "0.1.1";
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/internal/errors.js
function ta() {
	return ea;
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/Errors.js
var J = class e extends Error {
	static setStaticOptions(t) {
		e.prototype.docsOrigin = t.docsOrigin, e.prototype.showVersion = t.showVersion, e.prototype.version = t.version;
	}
	constructor(t, n = {}) {
		let r = (() => {
			if (n.cause instanceof e) {
				if (n.cause.details) return n.cause.details;
				if (n.cause.shortMessage) return n.cause.shortMessage;
			}
			return n.cause && "details" in n.cause && typeof n.cause.details == "string" ? n.cause.details : n.cause?.message ? n.cause.message : n.details;
		})(), i = n.cause instanceof e && n.cause.docsPath || n.docsPath, a = n.docsOrigin ?? e.prototype.docsOrigin, o = `${a}${i ?? ""}`, s = !!(n.version ?? e.prototype.showVersion), c = n.version ?? e.prototype.version, l = [
			t || "An error occurred.",
			...n.metaMessages ? ["", ...n.metaMessages] : [],
			...r || i || s ? [
				"",
				r ? `Details: ${r}` : void 0,
				i ? `See: ${o}` : void 0,
				s ? `Version: ${c}` : void 0
			] : []
		].filter((e) => typeof e == "string").join("\n");
		super(l, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "docs", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "docsOrigin", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "docsPath", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "shortMessage", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "showVersion", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "version", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "cause", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: void 0
		}), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "BaseError"
		}), this.cause = n.cause, this.details = r, this.docs = o, this.docsOrigin = a, this.docsPath = i, this.shortMessage = t, this.showVersion = s, this.version = c;
	}
	walk(e) {
		return na(this, e);
	}
};
Object.defineProperty(J, "defaultStaticOptions", {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: {
		docsOrigin: "https://oxlib.sh",
		showVersion: !1,
		version: `ox@${ta()}`
	}
}), J.setStaticOptions(J.defaultStaticOptions);
function na(e, t) {
	return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause ? na(e.cause, t) : t ? null : e;
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/internal/bytes.js
function ra(e, t) {
	if ($(e) > t) throw new Ya({
		givenSize: $(e),
		maxSize: t
	});
}
function ia(e, t) {
	if (typeof t == "number" && t > 0 && t > $(e) - 1) throw new Xa({
		offset: t,
		position: "start",
		size: $(e)
	});
}
function aa(e, t, n) {
	if (typeof t == "number" && typeof n == "number" && $(e) !== n - t) throw new Xa({
		offset: n,
		position: "end",
		size: $(e)
	});
}
var Y = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function oa(e) {
	if (e >= Y.zero && e <= Y.nine) return e - Y.zero;
	if (e >= Y.A && e <= Y.F) return e - (Y.A - 10);
	if (e >= Y.a && e <= Y.f) return e - (Y.a - 10);
}
function sa(e, t = {}) {
	let { dir: n, size: r = 32 } = t;
	if (r === 0) return e;
	if (e.length > r) throw new Za({
		size: e.length,
		targetSize: r,
		type: "Bytes"
	});
	let i = new Uint8Array(r);
	for (let t = 0; t < r; t++) {
		let a = n === "right";
		i[a ? t : r - t - 1] = e[a ? t : e.length - t - 1];
	}
	return i;
}
function ca(e, t = {}) {
	let { dir: n = "left" } = t, r = e, i = 0;
	for (let e = 0; e < r.length - 1 && r[n === "left" ? e : r.length - e - 1].toString() === "0"; e++) i++;
	return r = n === "left" ? r.slice(i) : r.slice(0, r.length - i), r;
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/internal/hex.js
function la(e, t) {
	if (Q(e) > t) throw new ja({
		givenSize: Q(e),
		maxSize: t
	});
}
function ua(e, t) {
	if (typeof t == "number" && t > 0 && t > Q(e) - 1) throw new Ma({
		offset: t,
		position: "start",
		size: Q(e)
	});
}
function da(e, t, n) {
	if (typeof t == "number" && typeof n == "number" && Q(e) !== n - t) throw new Ma({
		offset: n,
		position: "end",
		size: Q(e)
	});
}
function fa(e, t = {}) {
	let { dir: n, size: r = 32 } = t;
	if (r === 0) return e;
	let i = e.replace("0x", "");
	if (i.length > r * 2) throw new Na({
		size: Math.ceil(i.length / 2),
		targetSize: r,
		type: "Hex"
	});
	return `0x${i[n === "right" ? "padEnd" : "padStart"](r * 2, "0")}`;
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/Json.js
var pa = "#__bigint";
function ma(e, t, n) {
	return JSON.stringify(e, (e, n) => typeof t == "function" ? t(e, n) : typeof n == "bigint" ? n.toString() + pa : n, n);
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/Hex.js
var ha = /* @__PURE__ */ new TextEncoder(), ga = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _a(e, t = {}) {
	let { strict: n = !1 } = t;
	if (!e || typeof e != "string") throw new ka(e);
	if (n && !/^0x[0-9a-fA-F]*$/.test(e) || !e.startsWith("0x")) throw new Aa(e);
}
function va(...e) {
	return `0x${e.reduce((e, t) => e + t.replace("0x", ""), "")}`;
}
function ya(e) {
	return e instanceof Uint8Array ? X(e) : Array.isArray(e) ? X(new Uint8Array(e)) : e;
}
function ba(e, t = {}) {
	let n = `0x${Number(e)}`;
	return typeof t.size == "number" ? (la(n, t.size), Sa(n, t.size)) : n;
}
function X(e, t = {}) {
	let n = "";
	for (let t = 0; t < e.length; t++) n += ga[e[t]];
	let r = `0x${n}`;
	return typeof t.size == "number" ? (la(r, t.size), Ca(r, t.size)) : r;
}
function Z(e, t = {}) {
	let { signed: n, size: r } = t, i = BigInt(e), a;
	r ? a = n ? (1n << BigInt(r) * 8n - 1n) - 1n : 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (a = BigInt(2 ** 53 - 1));
	let o = typeof a == "bigint" && n ? -a - 1n : 0;
	if (a && i > a || i < o) {
		let t = typeof e == "bigint" ? "n" : "";
		throw new Oa({
			max: a ? `${a}${t}` : void 0,
			min: `${o}${t}`,
			signed: n,
			size: r,
			value: `${e}${t}`
		});
	}
	let s = `0x${(n && i < 0 ? BigInt.asUintN(r * 8, BigInt(i)) : i).toString(16)}`;
	return r ? Sa(s, r) : s;
}
function xa(e, t = {}) {
	return X(ha.encode(e), t);
}
function Sa(e, t) {
	return fa(e, {
		dir: "left",
		size: t
	});
}
function Ca(e, t) {
	return fa(e, {
		dir: "right",
		size: t
	});
}
function wa(e, t, n, r = {}) {
	let { strict: i } = r;
	ua(e, t);
	let a = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (n ?? e.length) * 2)}`;
	return i && da(a, t, n), a;
}
function Q(e) {
	return Math.ceil((e.length - 2) / 2);
}
function Ta(e, t = {}) {
	let { signed: n } = t;
	t.size && la(e, t.size);
	let r = BigInt(e);
	if (!n) return r;
	let i = (e.length - 2) / 2, a = (1n << BigInt(i) * 8n) - 1n;
	return r <= a >> 1n ? r : r - a - 1n;
}
function Ea(e, t = {}) {
	let { signed: n, size: r } = t;
	return Number(!n && !r ? e : Ta(e, t));
}
function Da(e, t = {}) {
	let { strict: n = !1 } = t;
	try {
		return _a(e, { strict: n }), !0;
	} catch {
		return !1;
	}
}
var Oa = class extends J {
	constructor({ max: e, min: t, signed: n, size: r, value: i }) {
		super(`Number \`${i}\` is not in safe${r ? ` ${r * 8}-bit` : ""}${n ? " signed" : " unsigned"} integer range ${e ? `(\`${t}\` to \`${e}\`)` : `(above \`${t}\`)`}`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.IntegerOutOfRangeError"
		});
	}
}, ka = class extends J {
	constructor(e) {
		super(`Value \`${typeof e == "object" ? ma(e) : e}\` of type \`${typeof e}\` is an invalid hex type.`, { metaMessages: ["Hex types must be represented as `\"0x${string}\"`."] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.InvalidHexTypeError"
		});
	}
}, Aa = class extends J {
	constructor(e) {
		super(`Value \`${e}\` is an invalid hex value.`, { metaMessages: ["Hex values must start with `\"0x\"` and contain only hexadecimal characters (0-9, a-f, A-F)."] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.InvalidHexValueError"
		});
	}
}, ja = class extends J {
	constructor({ givenSize: e, maxSize: t }) {
		super(`Size cannot exceed \`${t}\` bytes. Given size: \`${e}\` bytes.`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.SizeOverflowError"
		});
	}
}, Ma = class extends J {
	constructor({ offset: e, position: t, size: n }) {
		super(`Slice ${t === "start" ? "starting" : "ending"} at offset \`${e}\` is out-of-bounds (size: \`${n}\`).`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.SliceOffsetOutOfBoundsError"
		});
	}
}, Na = class extends J {
	constructor({ size: e, targetSize: t, type: n }) {
		super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${t}\`).`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Hex.SizeExceedsPaddingSizeError"
		});
	}
}, Pa = /* @__PURE__ */ new TextDecoder(), Fa = /* @__PURE__ */ new TextEncoder();
function Ia(e) {
	return e instanceof Uint8Array ? e : typeof e == "string" ? Ra(e) : La(e);
}
function La(e) {
	return e instanceof Uint8Array ? e : new Uint8Array(e);
}
function Ra(e, t = {}) {
	let { size: n } = t, r = e;
	n && (la(e, n), r = Ca(e, n));
	let i = r.slice(2);
	i.length % 2 && (i = `0${i}`);
	let a = i.length / 2, o = new Uint8Array(a);
	for (let e = 0, t = 0; e < a; e++) {
		let n = oa(i.charCodeAt(t++)), r = oa(i.charCodeAt(t++));
		if (n === void 0 || r === void 0) throw new J(`Invalid byte sequence ("${i[t - 2]}${i[t - 1]}" in "${i}").`);
		o[e] = n << 4 | r;
	}
	return o;
}
function za(e, t = {}) {
	let { size: n } = t, r = Fa.encode(e);
	return typeof n == "number" ? (ra(r, n), Ba(r, n)) : r;
}
function Ba(e, t) {
	return sa(e, {
		dir: "right",
		size: t
	});
}
function $(e) {
	return e.length;
}
function Va(e, t, n, r = {}) {
	let { strict: i } = r;
	ia(e, t);
	let a = e.slice(t, n);
	return i && aa(a, t, n), a;
}
function Ha(e, t = {}) {
	let { size: n } = t;
	return n !== void 0 && ra(e, n), Ta(X(e, t), t);
}
function Ua(e, t = {}) {
	let { size: n } = t, r = e;
	if (n !== void 0 && (ra(r, n), r = Ka(r)), r.length > 1 || r[0] > 1) throw new Ja(r);
	return !!r[0];
}
function Wa(e, t = {}) {
	let { size: n } = t;
	return n !== void 0 && ra(e, n), Ea(X(e, t), t);
}
function Ga(e, t = {}) {
	let { size: n } = t, r = e;
	return n !== void 0 && (ra(r, n), r = qa(r)), Pa.decode(r);
}
function Ka(e) {
	return ca(e, { dir: "left" });
}
function qa(e) {
	return ca(e, { dir: "right" });
}
var Ja = class extends J {
	constructor(e) {
		super(`Bytes value \`${e}\` is not a valid boolean.`, { metaMessages: ["The bytes array must contain a single byte of either a `0` or `1` value."] }), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Bytes.InvalidBytesBooleanError"
		});
	}
}, Ya = class extends J {
	constructor({ givenSize: e, maxSize: t }) {
		super(`Size cannot exceed \`${t}\` bytes. Given size: \`${e}\` bytes.`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Bytes.SizeOverflowError"
		});
	}
}, Xa = class extends J {
	constructor({ offset: e, position: t, size: n }) {
		super(`Slice ${t === "start" ? "starting" : "ending"} at offset \`${e}\` is out-of-bounds (size: \`${n}\`).`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Bytes.SliceOffsetOutOfBoundsError"
		});
	}
}, Za = class extends J {
	constructor({ size: e, targetSize: t, type: n }) {
		super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (\`${e}\`) exceeds padding size (\`${t}\`).`), Object.defineProperty(this, "name", {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: "Bytes.SizeExceedsPaddingSizeError"
		});
	}
}, Qa = [
	{
		inputs: [{
			components: [
				{
					name: "target",
					type: "address"
				},
				{
					name: "allowFailure",
					type: "bool"
				},
				{
					name: "callData",
					type: "bytes"
				}
			],
			name: "calls",
			type: "tuple[]"
		}],
		name: "aggregate3",
		outputs: [{
			components: [{
				name: "success",
				type: "bool"
			}, {
				name: "returnData",
				type: "bytes"
			}],
			name: "returnData",
			type: "tuple[]"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			name: "addr",
			type: "address"
		}],
		name: "getEthBalance",
		outputs: [{
			name: "balance",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "getCurrentBlockTimestamp",
		outputs: [{
			internalType: "uint256",
			name: "timestamp",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	}
], $a = [{
	name: "query",
	type: "function",
	stateMutability: "view",
	inputs: [{
		type: "tuple[]",
		name: "queries",
		components: [
			{
				type: "address",
				name: "sender"
			},
			{
				type: "string[]",
				name: "urls"
			},
			{
				type: "bytes",
				name: "data"
			}
		]
	}],
	outputs: [{
		type: "bool[]",
		name: "failures"
	}, {
		type: "bytes[]",
		name: "responses"
	}]
}, {
	name: "HttpError",
	type: "error",
	inputs: [{
		type: "uint16",
		name: "status"
	}, {
		type: "string",
		name: "message"
	}]
}], eo = [
	{
		inputs: [{
			name: "dns",
			type: "bytes"
		}],
		name: "DNSDecodingFailed",
		type: "error"
	},
	{
		inputs: [{
			name: "ens",
			type: "string"
		}],
		name: "DNSEncodingFailed",
		type: "error"
	},
	{
		inputs: [],
		name: "EmptyAddress",
		type: "error"
	},
	{
		inputs: [{
			name: "status",
			type: "uint16"
		}, {
			name: "message",
			type: "string"
		}],
		name: "HttpError",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidBatchGatewayResponse",
		type: "error"
	},
	{
		inputs: [{
			name: "errorData",
			type: "bytes"
		}],
		name: "ResolverError",
		type: "error"
	},
	{
		inputs: [{
			name: "name",
			type: "bytes"
		}, {
			name: "resolver",
			type: "address"
		}],
		name: "ResolverNotContract",
		type: "error"
	},
	{
		inputs: [{
			name: "name",
			type: "bytes"
		}],
		name: "ResolverNotFound",
		type: "error"
	},
	{
		inputs: [{
			name: "primary",
			type: "string"
		}, {
			name: "primaryAddress",
			type: "bytes"
		}],
		name: "ReverseAddressMismatch",
		type: "error"
	},
	{
		inputs: [{
			internalType: "bytes4",
			name: "selector",
			type: "bytes4"
		}],
		name: "UnsupportedResolverProfile",
		type: "error"
	}
], to = [...eo, {
	name: "resolveWithGateways",
	type: "function",
	stateMutability: "view",
	inputs: [
		{
			name: "name",
			type: "bytes"
		},
		{
			name: "data",
			type: "bytes"
		},
		{
			name: "gateways",
			type: "string[]"
		}
	],
	outputs: [{
		name: "",
		type: "bytes"
	}, {
		name: "address",
		type: "address"
	}]
}], no = [...eo, {
	name: "reverseWithGateways",
	type: "function",
	stateMutability: "view",
	inputs: [
		{
			type: "bytes",
			name: "reverseName"
		},
		{
			type: "uint256",
			name: "coinType"
		},
		{
			type: "string[]",
			name: "gateways"
		}
	],
	outputs: [
		{
			type: "string",
			name: "resolvedName"
		},
		{
			type: "address",
			name: "resolver"
		},
		{
			type: "address",
			name: "reverseResolver"
		}
	]
}], ro = [{
	name: "text",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}, {
		name: "key",
		type: "string"
	}],
	outputs: [{
		name: "",
		type: "string"
	}]
}], io = [{
	name: "addr",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}],
	outputs: [{
		name: "",
		type: "address"
	}]
}, {
	name: "addr",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}, {
		name: "coinType",
		type: "uint256"
	}],
	outputs: [{
		name: "",
		type: "bytes"
	}]
}], ao = [{
	name: "isValidSignature",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "hash",
		type: "bytes32"
	}, {
		name: "signature",
		type: "bytes"
	}],
	outputs: [{
		name: "",
		type: "bytes4"
	}]
}], oo = [{
	inputs: [
		{
			name: "_signer",
			type: "address"
		},
		{
			name: "_hash",
			type: "bytes32"
		},
		{
			name: "_signature",
			type: "bytes"
		}
	],
	stateMutability: "nonpayable",
	type: "constructor"
}, {
	inputs: [
		{
			name: "_signer",
			type: "address"
		},
		{
			name: "_hash",
			type: "bytes32"
		},
		{
			name: "_signature",
			type: "bytes"
		}
	],
	outputs: [{ type: "bool" }],
	stateMutability: "nonpayable",
	type: "function",
	name: "isValidSig"
}], so = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe", co = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe", lo = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572", uo = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033", fo = "/docs/contract/encodeDeployData";
function po(e) {
	let { abi: t, args: n, bytecode: r } = e;
	if (!n || n.length === 0) return r;
	let i = t.find((e) => "type" in e && e.type === "constructor");
	if (!i) throw new Ut({ docsPath: fo });
	if (!("inputs" in i) || !i.inputs || i.inputs.length === 0) throw new Wt({ docsPath: fo });
	return E([r, Mr(i.inputs, n)]);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
var mo = "/docs/contract/encodeFunctionData";
function ho(e) {
	let { abi: t, args: n, functionName: r } = e, i = t[0];
	if (r) {
		let e = G({
			abi: t,
			args: n,
			name: r
		});
		if (!e) throw new I(r, { docsPath: mo });
		i = e;
	}
	if (i.type !== "function") throw new I(void 0, { docsPath: mo });
	return {
		abi: [i],
		functionName: Er(F(i))
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function go(e) {
	let { args: t } = e, { abi: n, functionName: r } = e.abi.length === 1 && e.functionName?.startsWith("0x") ? e : ho(e), i = n[0];
	return E([r, ("inputs" in i && i.inputs ? Mr(i.inputs, t ?? []) : void 0) ?? "0x"]);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/address/isAddressEqual.js
function _o(e, t) {
	if (!N(e, { strict: !1 })) throw new k({ address: e });
	if (!N(t, { strict: !1 })) throw new k({ address: t });
	return e.toLowerCase() === t.toLowerCase();
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/Withdrawal.js
function vo(e) {
	return {
		address: e.address,
		amount: Z(e.amount),
		index: Z(e.index),
		validatorIndex: Z(e.validatorIndex)
	};
}
//#endregion
//#region node_modules/.pnpm/ox@0.14.7_typescript@5.9.3/node_modules/ox/_esm/core/BlockOverrides.js
function yo(e) {
	return {
		...typeof e.baseFeePerGas == "bigint" && { baseFeePerGas: Z(e.baseFeePerGas) },
		...typeof e.blobBaseFee == "bigint" && { blobBaseFee: Z(e.blobBaseFee) },
		...typeof e.feeRecipient == "string" && { feeRecipient: e.feeRecipient },
		...typeof e.gasLimit == "bigint" && { gasLimit: Z(e.gasLimit) },
		...typeof e.number == "bigint" && { number: Z(e.number) },
		...typeof e.prevRandao == "bigint" && { prevRandao: Z(e.prevRandao) },
		...typeof e.time == "bigint" && { time: Z(e.time) },
		...e.withdrawals && { withdrawals: e.withdrawals.map(vo) }
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
var bo = "/docs/contract/decodeFunctionResult";
function xo(e) {
	let { abi: t, args: n, functionName: r, data: i } = e, a = t[0];
	if (r) {
		let e = G({
			abi: t,
			args: n,
			name: r
		});
		if (!e) throw new I(r, { docsPath: bo });
		a = e;
	}
	if (a.type !== "function") throw new I(void 0, { docsPath: bo });
	if (!a.outputs) throw new nn(a.name, { docsPath: bo });
	let o = Wr(a.outputs, i);
	if (o && o.length > 1) return o;
	if (o && o.length === 1) return o[0];
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/promise/withResolvers.js
function So() {
	let e = () => void 0, t = () => void 0;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/promise/createBatchScheduler.js
var Co = /* @__PURE__ */ new Map();
function wo({ fn: e, id: t, shouldSplitBatch: n, wait: r = 0, sort: i }) {
	let a = async () => {
		let t = c();
		o();
		let n = t.map(({ args: e }) => e);
		n.length !== 0 && e(n).then((e) => {
			i && Array.isArray(e) && e.sort(i);
			for (let n = 0; n < t.length; n++) {
				let { resolve: r } = t[n];
				r?.([e[n], e]);
			}
		}).catch((e) => {
			for (let n = 0; n < t.length; n++) {
				let { reject: r } = t[n];
				r?.(e);
			}
		});
	}, o = () => Co.delete(t), s = () => c().map(({ args: e }) => e), c = () => Co.get(t) || [], l = (e) => Co.set(t, [...c(), e]);
	return {
		flush: o,
		async schedule(e) {
			let { promise: t, resolve: i, reject: o } = So();
			return n?.([...s(), e]) && a(), c().length > 0 ? (l({
				args: e,
				resolve: i,
				reject: o
			}), t) : (l({
				args: e,
				resolve: i,
				reject: o
			}), setTimeout(a, r), t);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/stateOverride.js
function To(e) {
	if (!(!e || e.length === 0)) return e.reduce((e, { slot: t, value: n }) => {
		if (t.length !== 66) throw new ue({
			size: t.length,
			targetSize: 66,
			type: "hex"
		});
		if (n.length !== 66) throw new ue({
			size: n.length,
			targetSize: 66,
			type: "hex"
		});
		return e[t] = n, e;
	}, {});
}
function Eo(e) {
	let { balance: t, nonce: n, state: r, stateDiff: i, code: a } = e, o = {};
	if (a !== void 0 && (o.code = a), t !== void 0 && (o.balance = S(t)), n !== void 0 && (o.nonce = S(n)), r !== void 0 && (o.state = To(r)), i !== void 0) {
		if (o.state) throw new ci();
		o.stateDiff = To(i);
	}
	return o;
}
function Do(e) {
	if (!e) return;
	let t = {};
	for (let { address: n, ...r } of e) {
		if (!N(n, { strict: !1 })) throw new k({ address: n });
		if (t[n]) throw new si({ address: n });
		t[n] = Eo(r);
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/actions/public/call.js
async function Oo(e, t) {
	let { account: n = e.account, authorizationList: r, batch: i = !!e.batch?.multicall, blockNumber: a, blockTag: o = e.experimental_blockTag ?? "latest", accessList: s, blobs: c, blockOverrides: l, code: u, data: d, factory: f, factoryData: p, gas: ee, gasPrice: te, maxFeePerBlobGas: ne, maxFeePerGas: re, maxPriorityFeePerGas: ie, nonce: ae, to: h, value: oe, stateOverride: se, ...g } = t, _ = n ? Lt(n) : void 0;
	if (u && (f || p)) throw new m("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
	if (u && h) throw new m("Cannot provide both `code` & `to` as parameters.");
	let v = u && d, ce = f && p && h && d, le = v || ce, ue = v ? jo({
		code: u,
		data: d
	}) : ce ? Mo({
		data: d,
		factory: f,
		factoryData: p,
		to: h
	}) : d;
	try {
		$i(t);
		let n = (typeof a == "bigint" ? S(a) : void 0) || o, u = l ? yo(l) : void 0, d = Do(se), f = e.chain?.formatters?.transactionRequest?.format, p = (f || Oe)({
			...Qi(g, { format: f }),
			accessList: s,
			account: _,
			authorizationList: r,
			blobs: c,
			data: ue,
			gas: ee,
			gasPrice: te,
			maxFeePerBlobGas: ne,
			maxFeePerGas: re,
			maxPriorityFeePerGas: ie,
			nonce: ae,
			to: le ? void 0 : h,
			value: oe
		}, "call");
		if (i && ko({ request: p }) && !d && !u) try {
			return await Ao(e, {
				...p,
				blockNumber: a,
				blockTag: o
			});
		} catch (e) {
			if (!(e instanceof Xe) && !(e instanceof qe)) throw e;
		}
		let m = (() => {
			let e = [p, n];
			return d && u ? [
				...e,
				d,
				u
			] : d ? [...e, d] : u ? [
				...e,
				{},
				u
			] : e;
		})(), v = await e.request({
			method: "eth_call",
			params: m
		});
		return v === "0x" ? { data: void 0 } : { data: v };
	} catch (n) {
		let r = No(n), { offchainLookup: i, offchainLookupSignature: a } = await import("./ccip-BufM3hgj.js");
		if (e.ccipRead !== !1 && r?.slice(0, 10) === a && h) return { data: await i(e, {
			data: r,
			to: h
		}) };
		throw le && r?.slice(0, 10) === "0x101bb98d" ? new _i({ factory: f }) : Zi(n, {
			...t,
			account: _,
			chain: e.chain
		});
	}
}
function ko({ request: e }) {
	let { data: t, to: n, ...r } = e;
	return !(!t || t.startsWith("0x82ad56cb") || !n || Object.values(r).filter((e) => e !== void 0).length > 0);
}
async function Ao(e, t) {
	let { batchSize: n = 1024, deployless: r = !1, wait: i = 0 } = typeof e.batch?.multicall == "object" ? e.batch.multicall : {}, { blockNumber: a, blockTag: o = e.experimental_blockTag ?? "latest", data: s, to: c } = t, l = (() => {
		if (r) return null;
		if (t.multicallAddress) return t.multicallAddress;
		if (e.chain) return It({
			blockNumber: a,
			chain: e.chain,
			contract: "multicall3"
		});
		throw new Xe();
	})(), u = (typeof a == "bigint" ? S(a) : void 0) || o, { schedule: d } = wo({
		id: `${e.uid}.${u}`,
		wait: i,
		shouldSplitBatch(e) {
			return e.reduce((e, { data: t }) => e + (t.length - 2), 0) > n * 2;
		},
		fn: async (t) => {
			let n = t.map((e) => ({
				allowFailure: !0,
				callData: e.data,
				target: e.to
			})), r = go({
				abi: Qa,
				args: [n],
				functionName: "aggregate3"
			}), i = await e.request({
				method: "eth_call",
				params: [{ ...l === null ? { data: jo({
					code: uo,
					data: r
				}) } : {
					to: l,
					data: r
				} }, u]
			});
			return xo({
				abi: Qa,
				args: [n],
				functionName: "aggregate3",
				data: i || "0x"
			});
		}
	}), [{ returnData: f, success: p }] = await d({
		data: s,
		to: c
	});
	if (!p) throw new vi({ data: f });
	return f === "0x" ? { data: void 0 } : { data: f };
}
function jo(e) {
	let { code: t, data: n } = e;
	return po({
		abi: Sr(["constructor(bytes, bytes)"]),
		bytecode: so,
		args: [t, n]
	});
}
function Mo(e) {
	let { data: t, factory: n, factoryData: r, to: i } = e;
	return po({
		abi: Sr(["constructor(address, bytes, address, bytes)"]),
		bytecode: co,
		args: [
			i,
			t,
			n,
			r
		]
	});
}
function No(e) {
	if (!(e instanceof m)) return;
	let t = e.walk();
	return typeof t?.data == "object" ? t.data?.data : t.data;
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/decodeFunctionData.js
function Po(e) {
	let { abi: t, data: n } = e, r = P(n, 0, 4), i = t.find((e) => e.type === "function" && r === Er(F(e)));
	if (!i) throw new rn(r, { docsPath: "/docs/contract/decodeFunctionData" });
	return {
		functionName: i.name,
		args: "inputs" in i && i.inputs && i.inputs.length > 0 ? Wr(i.inputs, P(n, 4)) : void 0
	};
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/encodeErrorResult.js
var Fo = "/docs/contract/encodeErrorResult";
function Io(e) {
	let { abi: t, errorName: n, args: r } = e, i = t[0];
	if (n) {
		let e = G({
			abi: t,
			args: r,
			name: n
		});
		if (!e) throw new Zt(n, { docsPath: Fo });
		i = e;
	}
	if (i.type !== "error") throw new Zt(void 0, { docsPath: Fo });
	let a = Er(F(i)), o = "0x";
	if (r && r.length > 0) {
		if (!i.inputs) throw new Xt(i.name, { docsPath: Fo });
		o = Mr(i.inputs, r);
	}
	return E([a, o]);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/abi/encodeFunctionResult.js
var Lo = "/docs/contract/encodeFunctionResult";
function Ro(e) {
	let { abi: t, functionName: n, result: r } = e, i = t[0];
	if (n) {
		let e = G({
			abi: t,
			name: n
		});
		if (!e) throw new I(n, { docsPath: Lo });
		i = e;
	}
	if (i.type !== "function") throw new I(void 0, { docsPath: Lo });
	if (!i.outputs) throw new nn(i.name, { docsPath: Lo });
	let a = (() => {
		if (i.outputs.length === 0) return [];
		if (i.outputs.length === 1) return [r];
		if (Array.isArray(r)) return r;
		throw new dn(r);
	})();
	return Mr(i.outputs, a);
}
//#endregion
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js
var zo = "x-batch-gateway:true";
async function Bo(e) {
	let { data: t, ccipRequest: n } = e, { args: [r] } = Po({
		abi: $a,
		data: t
	}), i = [], a = [];
	return await Promise.all(r.map(async (e, t) => {
		try {
			a[t] = e.urls.includes("x-batch-gateway:true") ? await Bo({
				data: e.data,
				ccipRequest: n
			}) : await n(e), i[t] = !1;
		} catch (e) {
			i[t] = !0, a[t] = Vo(e);
		}
	})), Ro({
		abi: $a,
		functionName: "query",
		result: [i, a]
	});
}
function Vo(e) {
	return e.name === "HttpRequestError" && e.status ? Io({
		abi: $a,
		errorName: "HttpError",
		args: [e.status, e.shortMessage]
	}) : Io({
		abi: [zt],
		errorName: "Error",
		args: ["shortMessage" in e ? e.shortMessage : e.message]
	});
}
//#endregion
export { Gi as $, tn as $t, Ga as A, Ie as An, gi as At, Ca as B, ve as Bn, jr as Bt, Ra as C, Ue as Cn, Ji as Ct, Ha as D, O as Dn, pi as Dt, Va as E, Ke as En, xi as Et, ba as F, we as Fn, ni as Ft, ma as G, v as Gn, Jn as Gt, wa as H, S as Hn, V as Ht, X as I, Te as In, ti as It, Qi as J, m as Jn, Hn as Jt, J as K, _ as Kn, Gn as Kt, Z as L, Ee as Ln, Wr as Lt, Oa as M, T as Mn, fi as Mt, va as N, E as Nn, G as Nt, Ua as O, D as On, mi as Ot, ya as P, Oe as Pn, ii as Pt, qi as Q, Kt as Qt, xa as R, xe as Rn, Mr as Rt, Ia as S, He as Sn, Fi as St, $ as T, Ge as Tn, bi as Tt, Ea as U, ge as Un, or as Ut, Q as V, x as Vn, yr as Vt, Da as W, pe as Wn, H as Wt, Xi as X, z as Xt, Zi as Y, xn as Yt, Ki as Z, Gt as Zt, oo as _, st as _n, Wi as _t, wo as a, F as an, wi as at, to as b, k as bn, Vi as bt, yo as c, P as cn, Ti as ct, po as d, Ot as dn, Ri as dt, $t as en, zi as et, so as f, kt as fn, ki as ft, ao as g, A as gn, Ii as gt, io as h, ct as hn, ji as ht, Do as i, cn as in, Ei as it, Ka as j, Ne as jn, vi as jt, Wa as k, Be as kn, hi as kt, _o as l, Ft as ln, Mi as lt, uo as m, wt as mn, Bi as mt, zo as n, on as nn, Di as nt, So as o, Lt as on, Pi as ot, lo as p, Et as pn, Ai as pt, $i as q, g as qn, Mn as qt, Oo as r, sn as rn, Oi as rt, xo as s, It as sn, Ni as st, Bo as t, en as tn, Ui as tt, go as u, N as un, Ci as ut, Qa as v, Je as vn, Yi as vt, za as w, We as wn, yi as wt, no as x, Ve as xn, Li as xt, ro as y, Ye as yn, Hi as yt, Sa as z, Ce as zn, Ar as zt };
