import {
  fetchAspHistory,
  fetchBuildings,
  loadMarketBundle,
} from "./data";

export interface Env {
  ASSETS: Fetcher;
  SITE_NAME: string;
  SITE_BYLINE: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function parseBbox(raw: string | null): [number, number, number, number] | null {
  if (!raw) return null;
  const parts = raw.split(",").map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return [parts[0], parts[1], parts[2], parts[3]];
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        site: env.SITE_NAME,
        by: env.SITE_BYLINE,
        time: new Date().toISOString(),
      });
    }

    if (url.pathname === "/api/market") {
      try {
        const cache = caches.default;
        const bundle = await loadMarketBundle(cache);
        const trim = <T>(arr: T[]) => arr.slice(-60);
        return json({
          ...bundle,
          priceIndex: trim(bundle.priceIndex),
          rentIndex: trim(bundle.rentIndex),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return json({ error: message }, 502);
      }
    }

    if (url.pathname === "/api/asp-history") {
      const aspId = url.searchParams.get("id")?.trim();
      if (!aspId) return json({ error: "Missing id" }, 400);
      try {
        const cache = caches.default;
        const months = Math.min(
          24,
          Math.max(6, Number(url.searchParams.get("months") || 18) || 18),
        );
        const data = await fetchAspHistory(cache, aspId, months);
        return json(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return json({ error: message }, 502);
      }
    }

    if (url.pathname === "/api/buildings") {
      const bbox = parseBbox(url.searchParams.get("bbox"));
      if (!bbox) {
        return json(
          { error: "Missing or invalid bbox=minLon,minLat,maxLon,maxLat" },
          400,
        );
      }
      try {
        const cache = caches.default;
        const limit = Math.min(
          1200,
          Math.max(50, Number(url.searchParams.get("limit") || 600) || 600),
        );
        const data = await fetchBuildings(cache, bbox, limit);
        return json(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return json({ error: message }, 502);
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("HK Property Worker — assets missing", { status: 500 });
  },
} satisfies ExportedHandler<Env>;
