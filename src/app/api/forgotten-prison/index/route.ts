import { getSupabaseClient } from "@/lib/supabase";
import { getPrisonTarget } from "@/lib/forgotten-prison/target";
import { prisonIndexSchema } from "@/lib/forgotten-prison/index-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const pageValue = new URL(request.url).searchParams.get("page") ?? "0";
  if (!/^\d{1,5}$/.test(pageValue) || Number(pageValue) > 10000)
    return Response.json({ error: "Invalid history page" }, { status: 400 });
  const page = Number(pageValue);
  try {
    const { target, local } = await getPrisonTarget();
    if (!target)
      return Response.json(
        { error: "The auction is not configured yet." },
        { status: 503 },
      );
    if (local) {
      const { readLocalPrisonIndex } =
        await import("@/lib/forgotten-prison/local-index");
      return Response.json(await readLocalPrisonIndex(page), {
        headers: { "Cache-Control": "no-store" },
      });
    }
    const result = await getSupabaseClient().rpc("prison_read_index", {
      p_chain_id: target.chainId,
      p_contract: target.address.toLowerCase(),
      p_page: page,
    });
    if (result.error || !result.data) throw new Error("Index unavailable");
    const data = prisonIndexSchema.parse({
      ...result.data,
      source: "supabase",
    });
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=10",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "The auction index is temporarily unavailable. Please try again shortly.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
