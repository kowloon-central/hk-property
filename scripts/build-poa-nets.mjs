/**
 * Slim Esri/EDB-derived POA primary school-net polygons into public/poa-nets.geojson.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inPath = path.join(root, "tmp", "poa-nets.geojson");
const outPath = path.join(root, "public", "poa-nets.geojson");

if (!fs.existsSync(inPath)) {
  console.error(`Missing ${inPath}. Download POA FeatureServer GeoJSON into tmp/ first.`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inPath, "utf8"));
const features = (raw.features || []).map((f) => ({
  type: "Feature",
  geometry: f.geometry,
  properties: {
    net: f.properties?.NAME ?? f.properties?.net ?? null,
    areaEn: f.properties?.AREA_EN ?? f.properties?.areaEn ?? null,
    areaZh: f.properties?.AREA_TC ?? f.properties?.areaZh ?? null,
    webpageEn: f.properties?.WEBPAGE_EN ?? f.properties?.webpageEn ?? null,
    webpageZh: f.properties?.WEBPAGE_TC ?? f.properties?.webpageZh ?? null,
  },
}));

const out = {
  type: "FeatureCollection",
  meta: {
    source:
      "Esri China (HK) POA School Net Boundaries (derived from Education Bureau)",
    sourceUrl:
      "https://data-esrihk.opendata.arcgis.com/datasets/hong-kong-primary-one-admission-poa-school-net-boundaries-",
    edbCsv: "https://www.edb.gov.hk/attachment/datagovhk/POA_SchoolNet_EN.csv",
    note: "Primary One Admission school-net polygons. Not Band 1/2/3. Secondary SSPA uses different 18-district nets without open Band polygons.",
    generatedAt: new Date().toISOString(),
    count: features.length,
  },
  features,
};

fs.writeFileSync(outPath, JSON.stringify(out));
console.log("Wrote", outPath, "features=", features.length);
