import { Ft as e, It as t, Kn as n, Mt as r, Rt as i, jn as a, l as o, qn as s, r as c, t as l, wt as u } from "./localBatchGatewayRequest-CHS18WUu.js";
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/ccip.js
var d = class extends s {
	constructor({ callbackSelector: e, cause: t, data: n, extraData: i, sender: a, urls: o }) {
		super(t.shortMessage || "An error occurred while fetching for an offchain result.", {
			cause: t,
			metaMessages: [
				...t.metaMessages || [],
				t.metaMessages?.length ? "" : [],
				"Offchain Gateway Call:",
				o && ["  Gateway URL(s):", ...o.map((e) => `    ${r(e)}`)],
				`  Sender: ${a}`,
				`  Data: ${n}`,
				`  Callback selector: ${e}`,
				`  Extra data: ${i}`
			].flat(),
			name: "OffchainLookupError"
		});
	}
}, f = class extends s {
	constructor({ result: t, url: n }) {
		super("Offchain gateway response is malformed. Response data must be a hex value.", {
			metaMessages: [`Gateway URL: ${r(n)}`, `Response: ${e(t)}`],
			name: "OffchainLookupResponseMalformedError"
		});
	}
}, p = class extends s {
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
async function g(e, { blockNumber: n, blockTag: r, data: s, to: u }) {
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
			blockTag: r,
			data: a([y, i([{ type: "bytes" }, { type: "bytes" }], [g.includes("x-batch-gateway:true") ? await l({
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
async function _({ data: t, sender: r, urls: i }) {
	let a = /* @__PURE__ */ Error("An unknown error occurred.");
	for (let o = 0; o < i.length; o++) {
		let s = i[o], c = s.includes("{data}") ? "GET" : "POST", l = c === "POST" ? {
			data: t,
			sender: r
		} : void 0, d = c === "POST" ? { "Content-Type": "application/json" } : {};
		try {
			let i = await fetch(s.replace("{sender}", r.toLowerCase()).replace("{data}", t), {
				body: JSON.stringify(l),
				headers: d,
				method: c
			}), o;
			if (o = i.headers.get("Content-Type")?.startsWith("application/json") ? (await i.json()).data : await i.text(), !i.ok) {
				a = new u({
					body: l,
					details: o?.error ? e(o.error) : i.statusText,
					headers: i.headers,
					status: i.status,
					url: s
				});
				continue;
			}
			if (!n(o)) {
				a = new f({
					result: o,
					url: s
				});
				continue;
			}
			return o;
		} catch (e) {
			a = new u({
				body: l,
				details: e.message,
				url: s
			});
		}
	}
	throw a;
}
//#endregion
export { g as offchainLookup, m as offchainLookupSignature };
