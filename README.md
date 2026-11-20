# HK Property

Cloudflare Worker dashboard for official Hong Kong property stats:

- **RVD** monthly private-domestic price & rent indices, plus average prices/rents by region
- **Land Registry** monthly ASP (agreement for sale and purchase) counts by district

Bilingual UI: **English ↔ 繁體中文**.

Live URL:

`https://hkproperty.patricklau-wc.workers.dev`

(Worker name is `hkproperty`. Account workers.dev subdomain is `patricklau-wc`.)

## Stack

- Cloudflare Workers + static assets (`public/`)
- TypeScript fetchers for RVD CSV + Land Registry JSON
- Chart.js charts + geographic Hong Kong district choropleth (SimpleMaps admin1 SVG paths, CC-BY-4.0), colored by Land Registry ASP region keys

## Prerequisites

1. Node.js 20+
2. Cloudflare account (Patrick’s)
3. [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — installed via `npm install` below

## Setup & deploy

```bash
git clone https://github.com/kowloon-central/hk-property.git
cd hk-property
npm install
npx wrangler login          # opens browser; log in as Patrick
npx wrangler deploy
```

First-time workers.dev branding:

1. Cloudflare dashboard → **Workers & Pages**
2. Confirm account workers.dev subdomain (currently **`patricklau-wc`**).
3. Deploy creates Worker **`hkproperty`** → `https://hkproperty.<subdomain>.workers.dev`

Local preview:

```bash
npm run dev
```

Then open the printed `localhost` URL. `/api/market` proxies live RVD / Land Registry data (cached ~1 hour).

## API

| Path | Description |
|------|-------------|
| `GET /api/health` | Liveness |
| `GET /api/market` | Latest indices (60 months), regional averages, ASP districts |

## Data sources (MVP)

| Series | URL |
|--------|-----|
| Price indices (monthly) | https://www.rvd.gov.hk/datagovhk/1.4M.csv |
| Rent indices (monthly) | https://www.rvd.gov.hk/datagovhk/1.3M.csv |
| Average prices by class | https://www.rvd.gov.hk/datagovhk/1.2M.csv |
| Average rents by class | https://www.rvd.gov.hk/datagovhk/1.1M.csv |
| Land Registry ASP JSON | https://www.landreg.gov.hk/datagovhk/YYYYMM_data.json |

Catalogued on [data.gov.hk](https://data.gov.hk/) (RVD Property Market Statistics + Land Registry monthly instruments).

## Out of scope (v1)

Commercial listing scrapers (Centaline, Midland, 28Hse, etc.), Housing Authority / HKHS feeds, CSDI map layers.

## Repo

https://github.com/kowloon-central/hk-property
