import { loadMarketBundle } from "./data";

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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
        // Keep payload lean for the dashboard: last 60 months of indices.
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

    // Static assets (dashboard UI)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("HK Property Worker — assets missing", { status: 500 });
  },
} satisfies ExportedHandler<Env>;
