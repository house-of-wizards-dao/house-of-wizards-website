import { Ft as e, It as t, Jn as n, Mn as r, Mt as i, Rt as a, l as o, qn as s, r as c, t as l, wt as u } from "./localBatchGatewayRequest-BxBnYHr3.js";
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/ccip.js
var d = class extends n {
	constructor({ callbackSelector: e, cause: t, data: n, extraData: r, sender: a, urls: o }) {
		super(t.shortMessage || "An error occurred while fetching for an offchain result.", {
			cause: t,
			metaMessages: [
				...t.metaMessages || [],
				t.metaMessages?.length ? "" : [],
				"Offchain Gateway Call:",
				o && ["  Gateway URL(s):", ...o.map((e) => `    ${i(e)}`)],
				`  Sender: ${a}`,
				`  Data: ${n}`,
				`  Callback selector: ${e}`,
				`  Extra data: ${r}`
			].flat(),
			name: "OffchainLookupError"
		});
	}
}, f = class extends n {
	constructor({ result: t, url: n }) {
		super("Offchain gateway response is malformed. Response data must be a hex value.", {
			metaMessages: [`Gateway URL: ${i(n)}`, `Response: ${e(t)}`],
			name: "OffchainLookupResponseMalformedError"
		});
	}
}, p = class extends n {
	constructor({ sender: e, to: t }) {
		super("Reverted sender address does not match target contract address (`to`).", {
			metaMessages: [`Contract address: ${t}`, `OffchainLookup sender address: ${e}`],
			name: "OffchainLookupSenderMismatchError"
		});
	}
}, m = "0x556f1830", h = {
	name: "OffchainLookup",
	type: "error",
	inputs: [
		{
			name: "sender",
			type: "address"
		},
		{
			name: "urls",
			type: "string[]"
		},
		{
			name: "callData",
			type: "bytes"
		},
		{
			name: "callbackFunction",
			type: "bytes4"
		},
		{
			name: "extraData",
			type: "bytes"
		}
	]
};
async function g(e, { blockNumber: n, blockTag: i, data: s, to: u }) {
	let { args: f } = t({
		data: s,
		abi: [h]
	}), [m, g, v, y, b] = f, { ccipRead: x } = e, S = x && typeof x?.request == "function" ? x.request : _;
	try {
		if (!o(u, m)) throw new p({
			sender: m,
			to: u
		});
		let { data: t } = await c(e, {
			blockNumber: n,
			blockTag: i,
			data: r([y, a([{ type: "bytes" }, { type: "bytes" }], [g.includes("x-batch-gateway:true") ? await l({
				data: v,
				ccipRequest: S
			}) : await S({
				data: v,
				sender: m,
				urls: g
			}), b])]),
			to: u
		});
		return t;
	} catch (e) {
		throw new d({
			callbackSelector: y,
			cause: e,
			data: s,
			extraData: b,
			sender: m,
			urls: g
		});
	}
}
async function _({ data: t, sender: n, urls: r }) {
	let i = /* @__PURE__ */ Error("An unknown error occurred.");
	for (let a = 0; a < r.length; a++) {
		let o = r[a], c = o.includes("{data}") ? "GET" : "POST", l = c === "POST" ? {
			data: t,
			sender: n
		} : void 0, d = c === "POST" ? { "Content-Type": "application/json" } : {};
		try {
			let r = await fetch(o.replace("{sender}", n.toLowerCase()).replace("{data}", t), {
				body: JSON.stringify(l),
				headers: d,
				method: c
			}), a;
			if (a = r.headers.get("Content-Type")?.startsWith("application/json") ? (await r.json()).data : await r.text(), !r.ok) {
				i = new u({
					body: l,
					details: a?.error ? e(a.error) : r.statusText,
					headers: r.headers,
					status: r.status,
					url: o
				});
				continue;
			}
			if (!s(a)) {
				i = new f({
					result: a,
					url: o
				});
				continue;
			}
			return a;
		} catch (e) {
			i = new u({
				body: l,
				details: e.message,
				url: o
			});
		}
	}
	throw i;
}
//#endregion
export { g as offchainLookup, m as offchainLookupSignature };
