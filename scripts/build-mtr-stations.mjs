#!/usr/bin/env node
/**
 * One-off / refresh: CSDI mtr_venue_polygon centroids ⋈ MTR Corp bilingual CSV
 * → public/mtr-stations.geojson (static; no commercial scrapes).
 *
 * Sources:
 * - https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/mtr_venue_polygon
 * - https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "public", "mtr-stations.geojson");

const VENUE_URL =
  "https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/mtr_venue_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application%2Fjson";
const MTR_CSV_URL =
  "https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv";

/** Race-day East Rail stop present in CSDI but often absent from the monthly CSV. */
const MANUAL_LINES = {
  Racecourse: ["EAL"],
};

function normEn(s) {
  return String(s || "")
    .replace(/\s+Station$/i, "")
    .replace(/\s+MTR$/i, "")
    .replace(/Railway Station$/i, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normZh(s) {
  return String(s || "")
    .replace(/鐵路站$/, "")
    .replace(/站$/, "")
    .replace(/\s+/g, "")
    .trim();
}

function parseCsvRows(text) {
  const raw = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1);
  const rows = [];
  for (const line of raw) {
    if (!line.trim()) continue;
    const quoted = line.match(/"([^"]*)"/g)?.map((x) => x.slice(1, -1));
    const cols = quoted && quoted.length >= 6 ? quoted : line.split(",");
    const [lineCode, , stationCode, stationId, nameZh, nameEn] = cols;
    if (!nameEn || !lineCode) continue;
    rows.push({ lineCode, stationCode, stationId, nameZh, nameEn });
  }
  return rows;
}

function aggregateStations(rows) {
  const byCode = new Map();
  for (const r of rows) {
    const key = r.stationCode || r.nameEn;
    if (!byCode.has(key)) {
      byCode.set(key, {
        code: r.stationCode,
        id: r.stationId,
        nameEn: r.nameEn,
        nameZh: r.nameZh,
        lines: new Set(),
      });
    }
    byCode.get(key).lines.add(r.lineCode);
  }
  return [...byCode.values()];
}

function polygonCentroid(geom) {
  let rings = [];
  if (geom.type === "Polygon") rings = [geom.coordinates[0]];
  else if (geom.type === "MultiPolygon")
    rings = geom.coordinates.map((p) => p[0]);
  else throw new Error(`Unsupported geometry ${geom.type}`);

  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const ring of rings) {
    let a = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      const cross = x1 * y2 - x2 * y1;
      a += cross;
      cx += (x1 + x2) * cross;
      cy += (y1 + y2) * cross;
    }
    a *= 0.5;
    if (Math.abs(a) < 1e-12) {
      for (const [x, y] of ring) {
        sx += x;
        sy += y;
        n++;
      }
    } else {
      sx += cx / (6 * a);
      sy += cy / (6 * a);
      n++;
    }
  }
  return [sx / n, sy / n];
}

function matchStation(stations, venue) {
  const enKey = normEn(venue.venue_name_en);
  const zhKey = normZh(venue.venue_name_zh);
  let hit = stations.find((s) => normEn(s.nameEn) === enKey);
  if (!hit) hit = stations.find((s) => normZh(s.nameZh) === zhKey);
  if (!hit) {
    hit = stations.find(
      (s) =>
        enKey.includes(normEn(s.nameEn)) || normEn(s.nameEn).includes(enKey),
    );
  }
  if (!hit) {
    hit = stations.find(
      (s) =>
        zhKey.includes(normZh(s.nameZh)) || normZh(s.nameZh).includes(zhKey),
    );
  }
  return hit || null;
}

async function main() {
  console.log("Fetching CSDI mtr_venue_polygon…");
  const venueRes = await fetch(VENUE_URL);
  if (!venueRes.ok) throw new Error(`Venue WFS HTTP ${venueRes.status}`);
  const venues = await venueRes.json();

  console.log("Fetching MTR lines & stations CSV…");
  const csvRes = await fetch(MTR_CSV_URL);
  if (!csvRes.ok) throw new Error(`MTR CSV HTTP ${csvRes.status}`);
  const stations = aggregateStations(parseCsvRows(await csvRes.text()));

  const features = [];
  let matched = 0;
  for (const f of venues.features || []) {
    const p = f.properties || {};
    const hit = matchStation(stations, p);
    const [lon, lat] = polygonCentroid(f.geometry);
    const nameEn =
      hit?.nameEn ||
      String(p.venue_name_en || "").replace(/\s+Station$/i, "");
    const nameZh =
      hit?.nameZh ||
      String(p.venue_name_zh || "")
        .replace(/鐵路站$/, "")
        .replace(/站$/, "");
    let lineCodes = hit ? [...hit.lines].sort() : [];
    if (!lineCodes.length && MANUAL_LINES[nameEn]) {
      lineCodes = [...MANUAL_LINES[nameEn]];
    }
    if (hit) matched++;
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number(lon.toFixed(6)), Number(lat.toFixed(6))],
      },
      properties: {
        venueId: p.venue_id,
        stationCode: hit?.code || null,
        stationId: hit?.id || null,
        nameEn,
        nameZh,
        lines: lineCodes,
        locality: p.address_locality || null,
      },
    });
  }

  features.sort((a, b) =>
    String(a.properties.nameEn).localeCompare(String(b.properties.nameEn)),
  );

  const collection = {
    type: "FeatureCollection",
    meta: {
      generatedAt: new Date().toISOString(),
      count: features.length,
      matchedCsv: matched,
      sources: {
        geometry:
          "Lands Department CSDI 3D Indoor MTR Station Map — mtr_venue_polygon centroids (WGS84)",
        namesLines:
          "MTR Corporation Limited — mtr_lines_and_stations.csv (opendata.mtr.com.hk / data.gov.hk)",
      },
      note: "Interchanges aggregated to one marker with multiple line codes. Light Rail excluded (CSV scope).",
    },
    features,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(collection)}\n`, "utf8");
  console.log(
    `Wrote ${features.length} stations (${matched} CSV-matched) → ${path.relative(root, outPath)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
