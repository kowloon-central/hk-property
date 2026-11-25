# HK Property

Cloudflare Worker dashboard for official Hong Kong property stats:

- **RVD** monthly private-domestic price & rent indices, plus average prices/rents by region (with history)
- **Land Registry** monthly ASP counts by published district / region
- **District drill-down**: CSDI LandsD building footprints + bilingual names, storeys, heights
- **MTR stations**: static GeoJSON (CSDI `mtr_venue_polygon` centroids ⋈ MTR Corp bilingual CSV) as Leaflet markers on district drill-down
- **Map-first UI**: overview choropleth is the primary viewport; KPIs/charts sit below. District drill-down opens a dominant Leaflet map (OSM basemap only).
- **Map layer toggles** (district drill-down): Midland July 2024 railway-estate avg $/sq ft on MTR markers (digitized JSON; PNG not overlaid), MTR stations, EDB primary/secondary school locations, POA primary school-net polygons

Bilingual UI: default **繁體中文**, toggle **English ↔ 繁體**. Preference persisted in `localStorage` (`hkp-lang`).

Live URL:

`https://hkproperty.patricklau-wc.workers.dev`

(Worker name is `hkproperty`. Account workers.dev subdomain is `patricklau-wc`.)

## Stack

- Cloudflare Workers + static assets (`public/`)
- TypeScript fetchers for RVD CSV + Land Registry JSON + CSDI ArcGIS building query
- Chart.js charts + SimpleMaps district choropleth (overview) + Leaflet building map with MTR / schools / overlays (drill-down)

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
| MTR station markers (bilingual + line codes) | Static `public/mtr-stations.geojson` — CSDI LandsD `mtr_venue_polygon` centroids joined to [MTR Corp](https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv) open data (interchanges aggregated; Light Rail excluded) |
| OpenStreetMap basemap | Official `tile.openstreetmap.org` tiles with OSM attribution (sole basemap) |
| Midland avg $/sq ft (Jul 2024) | Digitized JSON `public/midland-mtr-jul2024.json` joined to MTR markers (labels show **平均呎價**; MoM % is secondary in popups / mild dot colour). Midland PNG is a **data reference only** — see `docs/midland-mtr-overlay.md` |
| Primary / secondary school markers | Static `public/schools.geojson` from EDB [School Location and Information](http://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv) |
| POA primary school-net polygons | Static `public/poa-nets.geojson` from Esri China (HK) layer derived from EDB POA nets |

Refresh snapshots:

```bash
npm run build:mtr
npm run build:schools   # needs tmp/SCH_LOC_EDB.csv
npm run build:poa       # needs tmp/poa-nets.geojson from Esri FeatureServer
```

**Band 1 / 2 / 3 limitation:** EDB does **not** publish school Band polygons. “Band” in SSPA refers to **student** allocation groups (territory / net thirds), not official school rankings. The UI therefore shows school locations + POA nets and states this clearly (EN / 繁體).

### Placeholder (intentionally not scraped)

| Layer | Status |
|-------|--------|
| Per-building **rent listing** | UI shows “not wired yet” — no Midland / Centaline / 28Hse scrape |
| Per-building **asking price** | Same |
| Exact 18-way ASP for Island / Kowloon DCs | Land Registry publishes Island & Kowloon aggregates only; Island/Kowloon DCs share that ASP series |
| Official school **Band 1/2/3** polygons | Not openly available from EDB |

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
| CSDI MTR venue polygons (WFS) | `https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/mtr_venue_polygon` |
| MTR lines & stations CSV | https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv |
| EDB school locations | http://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv |
| EDB POA school-net list | https://www.edb.gov.hk/attachment/datagovhk/POA_SchoolNet_EN.csv |
| Midland railway-estate chart (digitized reference) | https://res-cms.midland.com.hk/property-news/wp-content/uploads/2024/08/P130824-MTR.png |

## Repo

https://github.com/kowloon-central/hk-property
