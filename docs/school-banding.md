# Indicative school Band* (MOI proxy)

## Why Band* is starred

The Education Bureau **does not publish** Band 1 / 2 / 3 labels or polygons for schools. In the Secondary School Places Allocation (SSPA) system, bands apply to **pupils** (territory / net thirds), not to schools. Commercial property and tutoring sites often show unofficial school bands; those lists are not open government data and usually forbid scraping.

## What this site uses

An **indicative Band\*** for local secondary schools is derived from open **Committee on Home-School Co-operation (CHSC) Secondary School Profiles 2025/26** (data.gov.hk):

| Band* | Rule (junior secondary S1–S3 subjects) |
|-------|------------------------------------------|
| Band 1* | EMI-dominant MOI (English-medium subject share ≥ 50%, with clear English lean) |
| Band 2* | Fine-tuned / mixed MOI (by-class or balanced Chinese+English subjects) |
| Band 3* | CMI-dominant MOI (Chinese-medium subject share ≥ 50%, with clear Chinese lean) |
| Unbanded | No CHSC profile match (e.g. many international / ESF / special / evening schools), or primary schools |

Source CSVs:

- https://www.chsc.hk/datagovhk/ssp_2025_2026_en.csv
- https://www.chsc.hk/datagovhk/ssp_2025_2026_tc.csv

School points themselves remain from EDB School Location and Information.

## Honesty limits

- Band* correlates with the EMI ≈ Band 1 / CMI ≈ Band 3 heuristic parents often use; it is **not** HKDSE ranking and **not** SSPA intake banding.
- Famous CMI schools that parents call “Band 1” may appear as Band 3* under a pure MOI rule — treat labels as a language-policy filter, not a quality score.
- Rebuild: place EDB + CHSC CSVs under `tmp/`, then `npm run build:schools`.
