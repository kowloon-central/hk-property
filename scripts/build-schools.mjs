/**
 * Build public/schools.geojson from EDB School Location CSV, enriched with an
 * indicative Band 1/2/3 *proxy* from CHSC Secondary School Profiles MOI fields.
 *
 * EDB does not publish school Band polygons — SSPA bands apply to students.
 * This proxy classifies local secondary schools by junior-secondary medium of
 * instruction (EMI / mixed / CMI) from open CHSC data — a transparent heuristic
 * commonly used by parents, not an official ranking.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "tmp", "SCH_LOC_EDB.csv");
const sspEnPath = path.join(root, "tmp", "ssp_2025_2026_en.csv");
const sspTcPath = path.join(root, "tmp", "ssp_2025_2026_tc.csv");
const outPath = path.join(root, "public", "schools.geojson");
const SOURCE_URL =
  "http://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.csv";
const SSP_EN_URL = "https://www.chsc.hk/datagovhk/ssp_2025_2026_en.csv";
const SSP_TC_URL = "https://www.chsc.hk/datagovhk/ssp_2025_2026_tc.csv";

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

function splitSubjects(raw) {
  if (!raw || !String(raw).trim()) return [];
  return String(raw)
    .split(/[,;、]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** MOI → indicative Band 1/2/3 proxy (not EDB school banding). */
function classifyMoi(chineseRaw, englishRaw, otherRaw) {
  const c = splitSubjects(chineseRaw).length;
  const e = splitSubjects(englishRaw).length;
  const o = splitSubjects(otherRaw).length;
  const total = c + e + o;
  if (!total) return { band: null, moi: null, c, e, o };
  const eShare = e / total;
  const cShare = c / total;
  const oShare = o / total;
  if (
    oShare >= 0.2 ||
    (e >= 2 && c >= 2 && Math.abs(eShare - cShare) <= 0.35)
  ) {
    return { band: 2, moi: "MIXED", c, e, o };
  }
  if (eShare >= 0.5 && e >= 3) return { band: 1, moi: "EMI", c, e, o };
  if (cShare >= 0.5 && c >= 3) return { band: 3, moi: "CMI", c, e, o };
  if (e > c) return { band: 1, moi: "EMI", c, e, o };
  if (c > e) return { band: 3, moi: "CMI", c, e, o };
  return { band: 2, moi: "MIXED", c, e, o };
}

function normEn(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()（）\[\]【】.,，。'"’‘\-–—_/\\]/g, " ")
    .replace(
      /\b(the|of|and|school|college|secondary|limited|ltd|hong kong|hk)\b/g,
      " ",
    )
    .replace(/\s+/g, "")
    .trim();
}

function normZh(s) {
  return String(s || "")
    .replace(/[()（）\[\]【】\s\-–—]/g, "")
    .replace(/(中學|書院|學校|紀念)/g, "");
}

function normWeb(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function loadSspIndex() {
  if (!fs.existsSync(sspEnPath) || !fs.existsSync(sspTcPath)) {
    console.warn(
      "CHSC SSP CSVs missing under tmp/ — secondary schools will have no band proxy.",
    );
    return null;
  }
  const enRows = parseCsv(fs.readFileSync(sspEnPath, "utf8"));
  const tcRows = parseCsv(fs.readFileSync(sspTcPath, "utf8"));
  const enH = Object.fromEntries(enRows[0].map((h, i) => [h, i]));
  const tcH = Object.fromEntries(tcRows[0].map((h, i) => [h, i]));
  const byWeb = new Map();
  const byEn = new Map();
  const byZh = new Map();
  const records = [];

  for (let i = 1; i < enRows.length; i++) {
    const er = enRows[i];
    const tr = tcRows[i];
    if (!er?.length) continue;
    const cls = classifyMoi(
      er[enH["2025_2026_subject_offered_by_chinese_s1_to_s3"]],
      er[enH["2025_2026_subject_offered_by_english_s1_to_s3"]],
      er[enH["2025_2026_subject_offered_others_s1_to_s3"]],
    );
    const rec = {
      nameEn: er[enH.school_name] || null,
      nameZh: tr?.[tcH["學校名稱"]] || null,
      band: cls.band,
      moi: cls.moi,
      moiCounts: { chinese: cls.c, english: cls.e, other: cls.o },
    };
    records.push(rec);
    const web = normWeb(er[enH.school_website]);
    if (web) byWeb.set(web, rec);
    const ne = normEn(rec.nameEn);
    if (ne) byEn.set(ne, rec);
    const nz = normZh(rec.nameZh);
    if (nz) byZh.set(nz, rec);
  }

  function resolve(props) {
    const web = normWeb(props.website);
    if (web && byWeb.has(web)) return byWeb.get(web);
    const ne = normEn(props.nameEn);
    if (ne && byEn.has(ne)) return byEn.get(ne);
    const nz = normZh(props.nameZh);
    if (nz && byZh.has(nz)) return byZh.get(nz);
    if (ne) {
      const loose = [...byEn.entries()].filter(
        ([k]) => k && (k.includes(ne) || ne.includes(k)),
      );
      if (loose.length === 1) return loose[0][1];
    }
    if (nz) {
      const loose = [...byZh.entries()].filter(
        ([k]) => k && (k.includes(nz) || nz.includes(k)),
      );
      if (loose.length === 1) return loose[0][1];
    }
    return null;
  }

  return { records, resolve };
}

if (!fs.existsSync(csvPath)) {
  console.error(`Missing ${csvPath}. Download SCH_LOC_EDB.csv into tmp/ first.`);
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const header = rows[0];
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const levels = new Set(["PRIMARY", "SECONDARY"]);
const ssp = loadSspIndex();
const features = [];
const bandCounts = { 1: 0, 2: 0, 3: 0, null: 0 };

for (const r of rows.slice(1)) {
  const level = (r[idx["SCHOOL LEVEL"]] || "").trim();
  if (!levels.has(level)) continue;
  const lon = Number(r[idx.LONGITUDE]);
  const lat = Number(r[idx.LATITUDE]);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

  const props = {
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
    // Indicative only — null for primary / unmatched secondary.
    band: null,
    moi: null,
    bandSource: null,
  };

  if (level === "SECONDARY" && ssp) {
    const hit = ssp.resolve(props);
    if (hit) {
      props.band = hit.band;
      props.moi = hit.moi;
      props.bandSource = "chsc-moi-proxy-2025-26";
      props.moiCounts = hit.moiCounts;
    }
    bandCounts[props.band]++;
  }

  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lon, lat] },
    properties: props,
  });
}

const out = {
  type: "FeatureCollection",
  meta: {
    source: "Education Bureau School Location and Information (data.gov.hk)",
    sourceUrl: SOURCE_URL,
    bandProxy: {
      method: "chsc-moi-proxy",
      label: "Indicative Band 1/2/3 from CHSC junior-secondary MOI (not EDB)",
      note:
        "EDB does not publish school Band 1/2/3. SSPA bands apply to students. This site assigns an indicative Band* to local secondary schools from Committee on Home-School Co-operation Secondary School Profiles 2025/26 open data: EMI-dominant MOI → Band 1*, fine-tuned/mixed MOI → Band 2*, CMI-dominant MOI → Band 3*. International / ESF / schools without a CHSC profile stay unbanded. Correlate with — but are not — official school rankings.",
      sspEnUrl: SSP_EN_URL,
      sspTcUrl: SSP_TC_URL,
      counts: bandCounts,
    },
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
console.log("Wrote", outPath, out.meta.counts, "bands", bandCounts);
