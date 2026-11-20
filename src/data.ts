/** Official RVD + Land Registry + CSDI fetchers for the MVP. */

export const SOURCES = {
  priceIndex: "https://www.rvd.gov.hk/datagovhk/1.4M.csv",
  rentIndex: "https://www.rvd.gov.hk/datagovhk/1.3M.csv",
  avgPrices: "https://www.rvd.gov.hk/datagovhk/1.2M.csv",
  avgRents: "https://www.rvd.gov.hk/datagovhk/1.1M.csv",
  popularDevelopments: "https://www.rvd.gov.hk/datagovhk/1.5M.csv",
  landRegistryJson: (yyyymm: string) =>
    `https://www.landreg.gov.hk/datagovhk/${yyyymm}_data.json`,
  csdiBuildings:
    "https://portal.csdi.gov.hk/server/rest/services/common/landsd_rcd_1637211194312_35158/MapServer/0/query",
} as const;

const UA =
  "HKPropertyWorker/0.1 (+https://github.com/kowloon-central/hk-property)";
const CACHE_TTL_SECONDS = 3600;

export type SeriesPoint = {
  month: string; // MM-YYYY
  value: number;
  provisional?: boolean;
};

export type RegionPrice = {
  region: "Hong Kong" | "Kowloon" | "New Territories";
  classA: number | null;
  classB: number | null;
  classC: number | null;
};

export type RegionSeriesPoint = {
  month: string;
  classA: number | null;
  classB: number | null;
  classC: number | null;
};

export type RegionSeries = {
  region: RegionPrice["region"];
  points: RegionSeriesPoint[];
};

export type AspDistrict = {
  id: string;
  en: string;
  zh: string;
  transactions: number;
  considerationM: number | null;
};

export type AspSummary = {
  year: number;
  month: number;
  yyyymm: string;
  residential: number;
  nonResidential: number;
  primary: number;
  secondary: number;
  urban: number;
  newTerritories: number;
  districts: AspDistrict[];
};

export type AspHistoryPoint = {
  yyyymm: string;
  transactions: number;
  considerationM: number | null;
};

export type BuildingGeometry = {
  type: string;
  coordinates: unknown;
};

export type BuildingFeature = {
  id: number | string;
  nameEn: string | null;
  nameTc: string | null;
  blockType: string | null;
  storeys: number | null;
  baseHeight: number | null;
  topHeight: number | null;
  geometry: BuildingGeometry;
  /** Listing feeds are not wired in MVP (no commercial scrapers). */
  rentListing: null;
  askingListing: null;
};

export type BuildingsResponse = {
  source: string;
  bbox: [number, number, number, number];
  namedOnly: boolean;
  count: number;
  truncated: boolean;
  features: BuildingFeature[];
  notes: {
    live: string[];
    placeholder: string[];
  };
};

export type MarketBundle = {
  fetchedAt: string;
  priceIndex: SeriesPoint[];
  rentIndex: SeriesPoint[];
  latestPrice: SeriesPoint | null;
  latestRent: SeriesPoint | null;
  regionPrices: RegionPrice[];
  regionRents: RegionPrice[];
  regionPriceSeries: RegionSeries[];
  regionRentSeries: RegionSeries[];
  popularUrban: SeriesPoint[];
  popularNewTerritories: SeriesPoint[];
  asp: AspSummary | null;
  sources: typeof SOURCES;
  dataNotes: {
    live: string[];
    placeholder: string[];
  };
};

function parseCsv(text: string): string[][] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.length);
  const rows: string[][] = [];
  for (const line of lines) {
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === "," && !inQ) {
        cells.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

function parseIndexSeries(csv: string, valueCol = "All Classes"): SeriesPoint[] {
  const rows = parseCsv(csv);
  if (rows.length < 3) return [];
  const header = rows[1].map((h) => h.replace(/^"|"$/g, "").trim());
  const valueIdx = header.findIndex((h) => h === valueCol);
  const remarkIdx = header.findIndex((h) => h === `${valueCol} - Remarks`);
  if (valueIdx < 0) return [];
  const out: SeriesPoint[] = [];
  for (const row of rows.slice(2)) {
    const month = row[0]?.trim();
    const raw = row[valueIdx]?.trim();
    if (!month || !raw) continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) continue;
    const remark = remarkIdx >= 0 ? row[remarkIdx]?.trim() : "";
    out.push({
      month,
      value,
      provisional: remark === "P" || remark?.startsWith("P"),
    });
  }
  return out;
}

function parseRegionClassLatest(csv: string): RegionPrice[] {
  const rows = parseCsv(csv);
  if (rows.length < 3) return [];
  const header = rows[1].map((h) => h.replace(/^"|"$/g, "").trim());
  const last = [...rows].reverse().find((r) => r[0] && Number.isFinite(Number(r[1])));
  if (!last) return [];

  const regions: RegionPrice["region"][] = [
    "Hong Kong",
    "Kowloon",
    "New Territories",
  ];
  const result: RegionPrice[] = regions.map((region) => ({
    region,
    classA: null,
    classB: null,
    classC: null,
  }));

  for (const cls of ["A", "B", "C"] as const) {
    for (const region of regions) {
      const col = `Class ${cls} ${region}`;
      const idx = header.indexOf(col);
      if (idx < 0) continue;
      const n = Number(last[idx]);
      const bucket = result.find((r) => r.region === region)!;
      if (Number.isFinite(n)) {
        if (cls === "A") bucket.classA = n;
        if (cls === "B") bucket.classB = n;
        if (cls === "C") bucket.classC = n;
      }
    }
  }
  return result;
}

function numOrNull(raw: string | undefined): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Monthly Class A–C averages by RVD region (full history). */
export function parseRegionClassSeries(csv: string): RegionSeries[] {
  const rows = parseCsv(csv);
  if (rows.length < 3) return [];
  const header = rows[1].map((h) => h.replace(/^"|"$/g, "").trim());
  const regions: RegionPrice["region"][] = [
    "Hong Kong",
    "Kowloon",
    "New Territories",
  ];
  const cols = Object.fromEntries(
    regions.map((region) => [
      region,
      {
        a: header.indexOf(`Class A ${region}`),
        b: header.indexOf(`Class B ${region}`),
        c: header.indexOf(`Class C ${region}`),
      },
    ]),
  ) as Record<
    RegionPrice["region"],
    { a: number; b: number; c: number }
  >;

  const buckets: Record<RegionPrice["region"], RegionSeriesPoint[]> = {
    "Hong Kong": [],
    Kowloon: [],
    "New Territories": [],
  };

  for (const row of rows.slice(2)) {
    const month = row[0]?.trim();
    if (!month) continue;
    for (const region of regions) {
      const c = cols[region];
      const point: RegionSeriesPoint = {
        month,
        classA: c.a >= 0 ? numOrNull(row[c.a]) : null,
        classB: c.b >= 0 ? numOrNull(row[c.b]) : null,
        classC: c.c >= 0 ? numOrNull(row[c.c]) : null,
      };
      if (point.classA != null || point.classB != null || point.classC != null) {
        buckets[region].push(point);
      }
    }
  }

  return regions.map((region) => ({ region, points: buckets[region] }));
}

function parseNumberish(v: unknown): number | null {
  if (v == null || v === "-" || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

const DISTRICT_META: Record<string, { id: string; en: string; zh: string }> = {
  "Hong Kong": { id: "hong-kong", en: "Hong Kong Island", zh: "香港島" },
  Kowloon: { id: "kowloon", en: "Kowloon", zh: "九龍" },
  Island: { id: "islands", en: "Islands", zh: "離島" },
  North: { id: "north", en: "North", zh: "北區" },
  "Sai Kung": { id: "sai-kung", en: "Sai Kung", zh: "西貢" },
  Shatin: { id: "sha-tin", en: "Sha Tin", zh: "沙田" },
  "Tai Po": { id: "tai-po", en: "Tai Po", zh: "大埔" },
  "Tsuen Wan": { id: "tsuen-wan", en: "Tsuen Wan", zh: "荃灣" },
  "Tuen Mun": { id: "tuen-mun", en: "Tuen Mun", zh: "屯門" },
  "Yuen Long": { id: "yuen-long", en: "Yuen Long", zh: "元朗" },
};

function findMetric(
  rows: Array<Record<string, unknown>>,
  needle: string,
): { units: number | null; consideration: number | null } {
  const row = rows.find((r) => String(r.Description ?? "").includes(needle));
  if (!row) return { units: null, consideration: null };
  return {
    units: parseNumberish(row.Units),
    consideration: parseNumberish(row["Consideration (nearest $ million)"]),
  };
}

export function parseLandRegistry(jsonText: string): AspSummary | null {
  const rows = JSON.parse(jsonText.replace(/^\uFEFF/, "")) as Array<
    Record<string, unknown>
  >;
  if (!Array.isArray(rows) || !rows.length) return null;
  const year = Number(rows[0].Year);
  const month = Number(rows[0].Month);
  if (!year || !month) return null;
  const yyyymm = `${year}${String(month).padStart(2, "0")}`;

  const districts: AspDistrict[] = [];
  for (const [key, meta] of Object.entries(DISTRICT_META)) {
    const m = findMetric(
      rows,
      `Number of ${key} transactions for ASP building units`,
    );
    districts.push({
      id: meta.id,
      en: meta.en,
      zh: meta.zh,
      transactions: m.units ?? 0,
      considerationM: m.consideration,
    });
  }

  return {
    year,
    month,
    yyyymm,
    residential:
      findMetric(rows, "Number of ASP for Residential Building Units").units ??
      0,
    nonResidential:
      findMetric(rows, "Number of ASP for Non-Residential Building Units")
        .units ?? 0,
    primary:
      findMetric(
        rows,
        "Number of Primary Sales for ASP Residential Building Units",
      ).units ?? 0,
    secondary:
      findMetric(
        rows,
        "Number of Secondary Sales for ASP Residential Building Units",
      ).units ?? 0,
    urban:
      findMetric(
        rows,
        "Number of Urban deeds received for registration (ASP Building Units)",
      ).units ?? 0,
    newTerritories:
      findMetric(
        rows,
        "Number of New Territories deeds received for registration (ASP Building Units)",
      ).units ?? 0,
    districts,
  };
}

async function fetchText(url: string, cache: Cache): Promise<string> {
  const req = new Request(url, {
    headers: { "User-Agent": UA, Accept: "text/csv,application/json,*/*" },
  });
  const cached = await cache.match(req);
  if (cached) return cached.text();

  const res = await fetch(req);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  const body = await res.text();
  const out = new Response(body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "text/plain",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  });
  await cache.put(req, out.clone());
  return body;
}

function recentYyyymm(offsetMonths = 0): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - offsetMonths);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

async function fetchLatestAsp(cache: Cache): Promise<AspSummary | null> {
  for (let i = 0; i < 6; i++) {
    const ym = recentYyyymm(i);
    try {
      const text = await fetchText(SOURCES.landRegistryJson(ym), cache);
      const parsed = parseLandRegistry(text);
      if (parsed) return parsed;
    } catch {
      // try older month
    }
  }
  return null;
}

export async function fetchAspHistory(
  cache: Cache,
  aspId: string,
  months = 18,
): Promise<{ aspId: string; points: AspHistoryPoint[] }> {
  const points: AspHistoryPoint[] = [];
  for (let i = 0; i < months + 4 && points.length < months; i++) {
    const ym = recentYyyymm(i);
    try {
      const text = await fetchText(SOURCES.landRegistryJson(ym), cache);
      const parsed = parseLandRegistry(text);
      if (!parsed) continue;
      const row = parsed.districts.find((d) => d.id === aspId);
      if (!row) continue;
      points.push({
        yyyymm: parsed.yyyymm,
        transactions: row.transactions,
        considerationM: row.considerationM,
      });
    } catch {
      // skip missing month
    }
  }
  points.reverse();
  return { aspId, points };
}

type CsdiFeature = {
  id?: number | string;
  geometry?: BuildingGeometry;
  properties?: Record<string, unknown>;
};

function mapBuilding(f: CsdiFeature): BuildingFeature | null {
  if (!f.geometry) return null;
  const p = f.properties ?? {};
  return {
    id: (p.BuildingID as number | string) ?? f.id ?? "unknown",
    nameEn: (p.BuildingNameEN as string) || null,
    nameTc: (p.BuildingNameTC as string) || null,
    blockType: (p.BuildingBlockType as string) || null,
    storeys:
      p.Storeys == null || p.Storeys === ""
        ? null
        : Number(p.Storeys),
    baseHeight:
      p.BaseHeight == null || p.BaseHeight === ""
        ? null
        : Number(p.BaseHeight),
    topHeight:
      p.TopHeight == null || p.TopHeight === ""
        ? null
        : Number(p.TopHeight),
    geometry: f.geometry,
    rentListing: null,
    askingListing: null,
  };
}

/** CSDI LandsD Building footprints (open data) for a WGS84 bbox. */
export async function fetchBuildings(
  cache: Cache,
  bbox: [number, number, number, number],
  limit = 600,
): Promise<BuildingsResponse> {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  if (
    ![minLon, minLat, maxLon, maxLat].every((n) => Number.isFinite(n)) ||
    minLon >= maxLon ||
    minLat >= maxLat
  ) {
    throw new Error("Invalid bbox");
  }

  const geometry = `${minLon},${minLat},${maxLon},${maxLat}`;
  const fields =
    "BuildingID,BuildingNameEN,BuildingNameTC,BuildingBlockType,Storeys,BaseHeight,TopHeight,Status";

  const buildUrl = (namedOnly: boolean) => {
    const params = new URLSearchParams({
      where: namedOnly
        ? "BuildingNameTC IS NOT NULL OR BuildingNameEN IS NOT NULL"
        : "1=1",
      geometry,
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: fields,
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
      resultRecordCount: String(limit),
      orderByFields: "Storeys DESC",
    });
    return `${SOURCES.csdiBuildings}?${params.toString()}`;
  };

  const load = async (namedOnly: boolean) => {
    const text = await fetchText(buildUrl(namedOnly), cache);
    const json = JSON.parse(text) as {
      features?: CsdiFeature[];
      exceededTransferLimit?: boolean;
    };
    return {
      features: (json.features ?? [])
        .map(mapBuilding)
        .filter((b): b is BuildingFeature => Boolean(b)),
      truncated: Boolean(json.exceededTransferLimit),
    };
  };

  let namedOnly = true;
  let { features, truncated } = await load(true);
  if (features.length < 40) {
    namedOnly = false;
    ({ features, truncated } = await load(false));
  }

  return {
    source:
      "Lands Department Building footprints via CSDI / data.gov.hk (open data)",
    bbox,
    namedOnly,
    count: features.length,
    truncated: truncated || features.length >= limit,
    features,
    notes: {
      live: [
        "Building footprints, bilingual names (when present), storeys and heights from CSDI LandsD Building layer",
        "District aggregates from RVD / Land Registry (see /api/market)",
      ],
      placeholder: [
        "Per-building rent listing data — not wired (no Midland/Centaline scrape in MVP)",
        "Per-building asking price listing data — not wired (same)",
      ],
    },
  };
}

export async function loadMarketBundle(cache: Cache): Promise<MarketBundle> {
  const [priceCsv, rentCsv, avgPriceCsv, avgRentCsv, popularCsv, asp] =
    await Promise.all([
      fetchText(SOURCES.priceIndex, cache),
      fetchText(SOURCES.rentIndex, cache),
      fetchText(SOURCES.avgPrices, cache),
      fetchText(SOURCES.avgRents, cache),
      fetchText(SOURCES.popularDevelopments, cache),
      fetchLatestAsp(cache),
    ]);

  const priceIndex = parseIndexSeries(priceCsv);
  const rentIndex = parseIndexSeries(rentCsv);
  const trimSeries = <T>(arr: T[]) => arr.slice(-60);

  return {
    fetchedAt: new Date().toISOString(),
    priceIndex,
    rentIndex,
    latestPrice: priceIndex.at(-1) ?? null,
    latestRent: rentIndex.at(-1) ?? null,
    regionPrices: parseRegionClassLatest(avgPriceCsv),
    regionRents: parseRegionClassLatest(avgRentCsv),
    regionPriceSeries: parseRegionClassSeries(avgPriceCsv).map((s) => ({
      ...s,
      points: trimSeries(s.points),
    })),
    regionRentSeries: parseRegionClassSeries(avgRentCsv).map((s) => ({
      ...s,
      points: trimSeries(s.points),
    })),
    popularUrban: trimSeries(
      parseIndexSeries(popularCsv, "Overall Urban"),
    ),
    popularNewTerritories: trimSeries(
      parseIndexSeries(popularCsv, "Overall New Territories"),
    ),
    asp,
    sources: SOURCES,
    dataNotes: {
      live: [
        "RVD private domestic price & rent indices (territory-wide)",
        "RVD average prices/rents by class for Hong Kong / Kowloon / New Territories (monthly series)",
        "RVD popular-developments indices (Urban vs New Territories)",
        "Land Registry monthly ASP counts by published region",
        "CSDI LandsD building footprints + names via /api/buildings",
      ],
      placeholder: [
        "Building-level rent listings (commercial portals) — not wired",
        "Building-level asking prices — not wired",
        "18-district exact ASP split where Land Registry only publishes Island/Kowloon aggregates",
      ],
    },
  };
}
