/**
 * Build public/schools.geojson from EDB School Location CSV.
 * Official Band 1/2/3 school polygons do not exist — this is locations by level only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "tmp", "SCH_LOC_EDB.csv");
const outPath = path.join(root, "public", "schools.geojson");
const SOURCE_URL =
  "http://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (q) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        q = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      q = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || (c === "\r" && n === "\n")) {
      if (c === "\r") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") {
      cell += c;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

if (!fs.existsSync(csvPath)) {
  console.error(`Missing ${csvPath}. Download SCH_LOC_EDB.csv into tmp/ first.`);
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const header = rows[0];
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const levels = new Set(["PRIMARY", "SECONDARY"]);
const features = [];

for (const r of rows.slice(1)) {
  const level = (r[idx["SCHOOL LEVEL"]] || "").trim();
  if (!levels.has(level)) continue;
  const lon = Number(r[idx.LONGITUDE]);
  const lat = Number(r[idx.LATITUDE]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lon, lat] },
    properties: {
      schoolNo: r[idx["SCHOOL NO."]] || null,
      nameEn: r[idx["ENGLISH NAME"]] || null,
      nameZh: r[idx["中文名稱"]] || null,
      level,
      categoryEn: r[idx["ENGLISH CATEGORY"]] || null,
      categoryZh: r[idx["中文類別"]] || null,
      districtEn: r[idx.DISTRICT] || null,
      districtZh: r[idx["分區"]] || null,
      financeEn: r[idx["FINANCE TYPE"]] || null,
      financeZh: r[idx["資助種類"]] || null,
      genderEn: r[idx["STUDENTS GENDER"]] || null,
      genderZh: r[idx["就讀學生性別"]] || null,
      sessionEn: r[idx.SESSION] || null,
      sessionZh: r[idx["學校授課時間"]] || null,
      website:
        r[idx.WEBSITE] && r[idx.WEBSITE] !== "N.A." ? r[idx.WEBSITE] : null,
    },
  });
}

const out = {
  type: "FeatureCollection",
  meta: {
    source: "Education Bureau School Location and Information (data.gov.hk)",
    sourceUrl: SOURCE_URL,
    note: "EDB does not publish official Band 1/2/3 labels for schools. Bands apply to students in SSPA allocation. This file is school locations by level only.",
    generatedAt: new Date().toISOString(),
    counts: {
      primary: features.filter((f) => f.properties.level === "PRIMARY").length,
      secondary: features.filter((f) => f.properties.level === "SECONDARY")
        .length,
      total: features.length,
    },
  },
  features,
};

fs.writeFileSync(outPath, JSON.stringify(out));
console.log("Wrote", outPath, out.meta.counts);
