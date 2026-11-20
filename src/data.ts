/** Official RVD + Land Registry fetchers for the MVP. */

export const SOURCES = {
  priceIndex:
    "https://www.rvd.gov.hk/datagovhk/1.4M.csv",
  rentIndex:
    "https://www.rvd.gov.hk/datagovhk/1.3M.csv",
  avgPrices:
    "https://www.rvd.gov.hk/datagovhk/1.2M.csv",
  avgRents:
    "https://www.rvd.gov.hk/datagovhk/1.1M.csv",
  popularDevelopments:
    "https://www.rvd.gov.hk/datagovhk/1.5M.csv",
  landRegistryJson: (yyyymm: string) =>
    `https://www.landreg.gov.hk/datagovhk/${yyyymm}_data.json`,
} as const;

const UA = "HKPropertyWorker/0.1 (+https://github.com/kowloon-central/hk-property)";
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

export type MarketBundle = {
  fetchedAt: string;
  priceIndex: SeriesPoint[];
  rentIndex: SeriesPoint[];
  latestPrice: SeriesPoint | null;
  latestRent: SeriesPoint | null;
  regionPrices: RegionPrice[];
  regionRents: RegionPrice[];
  asp: AspSummary | null;
  sources: typeof SOURCES;
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

function parseRegionClassLatest(
  csv: string,
): RegionPrice[] {
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

function parseNumberish(v: unknown): number | null {
  if (v == null || v === "-" || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

const DISTRICT_META: Record<
  string,
  { id: string; en: string; zh: string }
> = {
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
  const row = rows.find((r) =>
    String(r.Description ?? "").includes(needle),
  );
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
    const m = findMetric(rows, `Number of ${key} transactions for ASP building units`);
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
    residential: findMetric(rows, "Number of ASP for Residential Building Units").units ?? 0,
    nonResidential:
      findMetric(rows, "Number of ASP for Non-Residential Building Units").units ?? 0,
    primary:
      findMetric(rows, "Number of Primary Sales for ASP Residential Building Units")
        .units ?? 0,
    secondary:
      findMetric(rows, "Number of Secondary Sales for ASP Residential Building Units")
        .units ?? 0,
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
  // Land Registry publishes with ~1 month lag; try several recent months.
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

export async function loadMarketBundle(cache: Cache): Promise<MarketBundle> {
  const [priceCsv, rentCsv, avgPriceCsv, avgRentCsv, asp] = await Promise.all([
    fetchText(SOURCES.priceIndex, cache),
    fetchText(SOURCES.rentIndex, cache),
    fetchText(SOURCES.avgPrices, cache),
    fetchText(SOURCES.avgRents, cache),
    fetchLatestAsp(cache),
  ]);

  const priceIndex = parseIndexSeries(priceCsv);
  const rentIndex = parseIndexSeries(rentCsv);

  return {
    fetchedAt: new Date().toISOString(),
    priceIndex,
    rentIndex,
    latestPrice: priceIndex.at(-1) ?? null,
    latestRent: rentIndex.at(-1) ?? null,
    regionPrices: parseRegionClassLatest(avgPriceCsv),
    regionRents: parseRegionClassLatest(avgRentCsv),
    asp,
    sources: SOURCES,
  };
}
