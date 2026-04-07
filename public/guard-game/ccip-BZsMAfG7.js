import { Ft as e, It as t, Mt as n, On as r, Rt as i, Un as a, Wn as o, l as s, r as c, t as l, wt as u } from "./localBatchGatewayRequest-CNb2kOGo.js";
//#region node_modules/.pnpm/viem@2.47.6_typescript@5.9.3/node_modules/viem/_esm/errors/ccip.js
var d = class extends o {
	constructor({ callbackSelector: e, cause: t, data: r, extraData: i, sender: a, urls: o }) {
		super(t.shortMessage || "An error occurred while fetching for an offchain result.", {
			cause: t,
			metaMessages: [
				...t.metaMessages || [],
				t.metaMessages?.length ? "" : [],
				"Offchain Gateway Call:",
				o && ["  Gateway URL(s):", ...o.map((e) => `    ${n(e)}`)],
				`  Sender: ${a}`,
				`  Data: ${r}`,
				`  Callback selector: ${e}`,
				`  Extra data: ${i}`
			].flat(),
			name: "OffchainLookupError"
		});
	}
}, f = class extends o {
	constructor({ result: t, url: r }) {
		super("Offchain gateway response is malformed. Response data must be a hex value.", {
			metaMessages: [`Gateway URL: ${n(r)}`, `Response: ${e(t)}`],
			name: "OffchainLookupResponseMalformedError"
		});
	}
}, p = class extends o {
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
async function g(e, { blockNumber: n, blockTag: a, data: o, to: u }) {
	let { args: f } = t({
		data: o,
		abi: [h]
	}), [m, g, v, y, b] = f, { ccipRead: x } = e, S = x && typeof x?.request == "function" ? x.request : _;
	try {
		if (!s(u, m)) throw new p({
			sender: m,
			to: u
		});
		let { data: t } = await c(e, {
			blockNumber: n,
			blockTag: a,
			data: r([y, i([{ type: "bytes" }, { type: "bytes" }], [g.includes("x-batch-gateway:true") ? await l({
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
			data: o,
			extraData: b,
			sender: m,
			urls: g
		});
	}
}
async function _({ data: t, sender: n, urls: r }) {
	let i = /* @__PURE__ */ Error("An unknown error occurred.");
	for (let o = 0; o < r.length; o++) {
		let s = r[o], c = s.includes("{data}") ? "GET" : "POST", l = c === "POST" ? {
			data: t,
			sender: n
		} : void 0, d = c === "POST" ? { "Content-Type": "application/json" } : {};
		try {
			let r = await fetch(s.replace("{sender}", n.toLowerCase()).replace("{data}", t), {
				body: JSON.stringify(l),
				headers: d,
				method: c
			}), o;
			if (o = r.headers.get("Content-Type")?.startsWith("application/json") ? (await r.json()).data : await r.text(), !r.ok) {
				i = new u({
					body: l,
					details: o?.error ? e(o.error) : r.statusText,
					headers: r.headers,
					status: r.status,
					url: s
				});
				continue;
			}
			if (!a(o)) {
				i = new f({
					result: o,
					url: s
				});
				continue;
			}
			return o;
		} catch (e) {
			i = new u({
				body: l,
				details: e.message,
				url: s
			});
		}
	}
	throw i;
}
//#endregion
export { g as offchainLookup, m as offchainLookupSignature };
