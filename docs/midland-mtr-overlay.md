# Midland MTR July 2024 price deltas

## Product behaviour

The live map **does not** hotlink or overlay Midland’s schematic PNG.
Station markers are styled from our own snapshot JSON:

`public/midland-mtr-jul2024.json`

joined at runtime to `public/mtr-stations.geojson` by `stationCode`.

Toggle **美聯港鐵升跌 / Midland MTR Δ** on the district building map to colour markers:

| Colour | Meaning |
|--------|---------|
| Green | MoM average saleable psf **up** |
| Red | MoM average saleable psf **down** |
| Amber | Flat (0%) |
| Grey | On chart but no usable MoM % (0 deals, `#`, or new vs prior-month zero) |

Popups show the Midland representative estate, July 2024 avg psf, MoM %, and registration count.

## Provenance

| Field | Value |
|-------|--------|
| Period | July 2024 Land Registry registrations (Midland: July registrations mainly reflect June deals) |
| Chart | [P130824-MTR.png](https://res-cms.midland.com.hk/property-news/wp-content/uploads/2024/08/P130824-MTR.png) (Aug 2024 Midland property-news image) |
| Article | [Midland monthly railway-estate update](https://www.midland.com.hk/zh-hk/property-news/app%E8%B3%87%E8%A8%8A%E4%B8%BB%E9%A0%81/%E3%80%90%E6%AF%8F%E6%9C%88%E6%9B%B4%E6%96%B0%E3%80%91%E9%90%B5%E8%B7%AF%E7%9B%A4%E6%9C%80%E6%96%B0%E8%A1%8C%E6%83%85%E9%9A%A8%E6%99%82%E7%9D%87/) |
| Attribution | 土地註冊處及美聯物業研究中心 / Land Registry + Midland Realty Research Centre |

Open machine-readable per-station MoM series was **not** available from allowed sources, so values were **digitized from the Midland chart** (cross-checked against Midland/press summaries for the most active estates). Each chart box is **one representative estate** at that station — not a full station-catchment average.

`priceDeltaFlag: "#"` matches Midland’s chart note that the MoM % is not applicable when volume/quality skews the average.

## Historical note (removed overlay)

An earlier build proxied the PNG as a Leaflet `imageOverlay` with approximate WGS84 bounds. That was schematic-only and drifted badly at district zoom. The proxy route and overlay toggle were removed; keep the PNG URL only as a **data-reference citation** in this doc and in JSON `meta.chartUrl`.
