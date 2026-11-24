# Midland MTR image overlay — georeferencing notes

Source image (do not scrape other Midland pages):

`https://res-cms.midland.com.hk/property-news/wp-content/uploads/2024/08/P130824-MTR.png`

Served to the browser via Worker proxy `/api/proxy/midland-mtr.png` (CORS + caching). Attribute **美聯物業 Midland Realty**.

## What the image is

A **schematic** Midland “railway estates” infographic (July 2024 registrations / psf), not a geographic basemap. Line geometry is diagrammatic (45°/90° transit style). Exact station-to-latlon alignment is **impossible**.

## Assumed image bounds (WGS84)

Leaflet `imageOverlay` corners used in `public/app.js`:

| Corner | Latitude | Longitude | Rationale |
|--------|----------|-----------|-----------|
| Southwest | 22.16 | 113.82 | Covers Tung Chung / south Lantau tip of the diagram |
| Northeast | 22.56 | 114.42 | Covers Sheung Shui / Lo Wu / Wu Kai Sha / LOHAS Park extent |

```js
L.latLngBounds([22.16, 113.82], [22.56, 114.42])
```

These bounds approximate Hong Kong’s inhabited coastal envelope so the schematic roughly sits over the territory when zoomed out. At district zoom, expect **large horizontal/vertical drift** vs real MTR stations (use the official CSDI + MTR markers for geography).

## Opacity & UX

Default opacity ~0.55 when toggled on so CARTO/OSM + buildings remain readable. Toggle off by default.

## Refresh

If Midland replaces the PNG URL, update the Worker proxy target and this note. Do not scrape Midland HTML for alternatives.
