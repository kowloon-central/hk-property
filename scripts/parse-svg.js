const fs = require("fs");
const svg = fs.readFileSync("public/hk-districts-source.svg", "utf8");
const re = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)">/g;
const paths = [];
let m;
while ((m = re.exec(svg))) {
  paths.push({ id: m[2], name: m[3], d: m[1] });
}
console.log(
  JSON.stringify(
    paths.map((p) => ({ id: p.id, name: p.name, dLen: p.d.length })),
    null,
    2,
  ),
);
console.log("count", paths.length);
const vb =
  svg.match(/viewBox="([^"]+)"/i) || svg.match(/viewbox="([^"]+)"/i);
console.log("viewbox", vb && vb[1]);
fs.writeFileSync(
  "public/hk-districts-paths.json",
  JSON.stringify(
    {
      viewBox: (vb && vb[1]) || "0 0 1000 733",
      source:
        "SimpleMaps HK admin1 SVG (CC-BY-4.0) https://simplemaps.com/gis/country/hk",
      paths: paths.map((p) => ({ id: p.id, name: p.name, d: p.d })),
    },
    null,
    2,
  ),
);
console.log("wrote public/hk-districts-paths.json");
