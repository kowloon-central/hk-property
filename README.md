# HK Property

Cloudflare Worker dashboard for official Hong Kong property stats:

- **RVD** monthly private-domestic price & rent indices, plus average prices/rents by region (with history)
- **Land Registry** monthly ASP counts by published district / region
- **District drill-down**: CSDI LandsD building footprints + bilingual names, storeys, heights

Bilingual UI: default **繁體中文**, toggle **English ↔ 繁體**. Preference persisted in `localStorage` (`hkp-lang`).

Live URL:

`https://hkproperty.patricklau-wc.workers.dev`

(Worker name is `hkproperty`. Account workers.dev subdomain is `patricklau-wc`.)

## Stack

- Cloudflare Workers + static assets (`public/`)
- TypeScript fetchers for RVD CSV + Land Registry JSON + CSDI ArcGIS building query
- Chart.js charts + SimpleMaps district choropleth (overview) + Leaflet building map (drill-down)

## Setup & deploy

```bash
git clone https://github.com/kowloon-central/hk-property.git
cd hk-property
npm install
npx wrangler login
npx wrangler deploy
```

Local preview:

```bash
npm run dev
```

## API

| Path | Description |
|------|-------------|
| `GET /api/health` | Liveness |
| `GET /api/market` | Indices, regional series, ASP, data notes |
| `GET /api/asp-history?id=sha-tin&months=18` | Monthly ASP history for a Land Registry region id |
| `GET /api/buildings?bbox=minLon,minLat,maxLon,maxLat&limit=700` | CSDI building footprints (named preferred) |

## What is live vs placeholder

### Live (official / open)

| Layer | Source |
|-------|--------|
| Territory price & rent indices | RVD `1.4M.csv` / `1.3M.csv` |
| Regional Class A–C avg price & rent history | RVD `1.2M.csv` / `1.1M.csv` |
| Popular-developments Urban / NT indices | RVD `1.5M.csv` (bundled in market payload) |
| ASP counts & consideration | Land Registry monthly JSON |
| Overview 18-district outlines | SimpleMaps HK admin1 SVG (CC-BY-4.0) |
| Drill-down district polygons | Derived from [hupili/geohk](https://github.com/hupili/geohk) DC land GeoJSON (census-era DC boundaries; approximate match to today’s 18 districts) |
| Building footprints + names / storeys / heights | Lands Department **Building** layer via [CSDI](https://portal.csdi.gov.hk/) / data.gov.hk |

### Placeholder (intentionally not scraped)

| Layer | Status |
|-------|--------|
| Per-building **rent listing** | UI shows “not wired yet” — no Midland / Centaline / 28Hse scrape |
| Per-building **asking price** | Same |
| Exact 18-way ASP for Island / Kowloon DCs | Land Registry publishes Island & Kowloon aggregates only; Island/Kowloon DCs share that ASP series |

## Data sources (URLs)

| Series | URL |
|--------|-----|
| Price indices | https://www.rvd.gov.hk/datagovhk/1.4M.csv |
| Rent indices | https://www.rvd.gov.hk/datagovhk/1.3M.csv |
| Average prices by class | https://www.rvd.gov.hk/datagovhk/1.2M.csv |
| Average rents by class | https://www.rvd.gov.hk/datagovhk/1.1M.csv |
| Popular developments indices | https://www.rvd.gov.hk/datagovhk/1.5M.csv |
| Land Registry ASP JSON | https://www.landreg.gov.hk/datagovhk/YYYYMM_data.json |
| CSDI buildings (ArcGIS query) | `landsd_rcd_1637211194312_35158` MapServer/0 |

## Repo

https://github.com/kowloon-central/hk-property
