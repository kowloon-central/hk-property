(() => {
  const STR = {
    en: {
      brand: "HK Property",
      byline: "by Patrick Lau",
      heroTitle: "Official sold prices, rents & deals",
      heroLede:
        "Monthly RVD indices and Land Registry ASP counts for Hong Kong — bilingual district dashboard.",
      kpiPrice: "Price index",
      kpiRent: "Rent index",
      kpiAsp: "ASP residential",
      kpiPrimary: "Primary vs secondary",
      chartsTitle: "Private domestic indices",
      chartsLede: "Territory-wide RVD monthly series (latest 60 months).",
      mapTitle: "ASP by district",
      mapLede: "Land Registry agreements for sale and purchase of building units.",
      regionTitle: "Average prices & rents by region",
      regionLede:
        "Latest monthly RVD averages for Class A–C private domestic (HK$/m²).",
      colRegion: "Region",
      colPriceA: "Price A",
      colPriceB: "Price B",
      colPriceC: "Price C",
      colRentA: "Rent A",
      colRentB: "Rent B",
      colRentC: "Rent C",
      footerSources:
        "Sources: Rating & Valuation Department (data.gov.hk / rvd.gov.hk) and Land Registry monthly ASP statistics. Figures may be provisional. Map outlines: SimpleMaps Hong Kong admin1 (CC-BY-4.0).",
      footerHost: "Cloudflare Worker",
      provisional: "provisional",
      asOf: (d, ym) =>
        ym
          ? `Indices as of ${d} · ASP month ${ym}`
          : `Indices as of ${d}`,
      deals: "deals",
      hkM: "HK$ m",
      noAsp: "No ASP breakdown",
      aspRegion: "ASP region",
      regions: {
        "Hong Kong": "Hong Kong Island",
        Kowloon: "Kowloon",
        "New Territories": "New Territories",
      },
    },
    zh: {
      brand: "香港樓市",
      byline: "Patrick Lau",
      heroTitle: "官方成交價、租金與買賣合約",
      heroLede:
        "差餉物業估價署按月指數與土地註冊處買賣合約宗數 — 中英對照地區儀表板。",
      kpiPrice: "售價指數",
      kpiRent: "租金指數",
      kpiAsp: "住宅買賣合約",
      kpiPrimary: "一手 / 二手",
      chartsTitle: "私人住宅指數",
      chartsLede: "全港差估署按月數列（最近 60 個月）。",
      mapTitle: "分區買賣合約",
      mapLede: "土地註冊處樓宇單位買賣合約宗數。",
      regionTitle: "分區平均售價與租金",
      regionLede: "差估署最新按月 A–C 類私人住宅平均數（港元／平方米）。",
      colRegion: "地區",
      colPriceA: "售價 A",
      colPriceB: "售價 B",
      colPriceC: "售價 C",
      colRentA: "租金 A",
      colRentB: "租金 B",
      colRentC: "租金 C",
      footerSources:
        "資料來源：差餉物業估價署（data.gov.hk / rvd.gov.hk）及土地註冊處每月買賣合約統計。最新數字或屬臨時數字。地圖界線：SimpleMaps 香港行政區（CC-BY-4.0）。",
      footerHost: "Cloudflare Worker",
      provisional: "臨時",
      asOf: (d, ym) =>
        ym ? `指數截至 ${d} · 買賣合約月份 ${ym}` : `指數截至 ${d}`,
      deals: "宗",
      hkM: "百萬港元",
      noAsp: "暫無買賣合約分項",
      aspRegion: "買賣合約分區",
      regions: {
        "Hong Kong": "香港島",
        Kowloon: "九龍",
        "New Territories": "新界",
      },
    },
  };

  /** 18 DC names (SimpleMaps) → Land Registry ASP region ids used by /api/market */
  const DC_TO_ASP = {
    "Central and Western": "hong-kong",
    "Wan Chai": "hong-kong",
    Eastern: "hong-kong",
    Southern: "hong-kong",
    "Yau Tsim Mong": "kowloon",
    "Sham Shui Po": "kowloon",
    "Kowloon City": "kowloon",
    "Wong Tai Sin": "kowloon",
    "Kwun Tong": "kowloon",
    Islands: "islands",
    North: "north",
    "Sai Kung": "sai-kung",
    "Sha Tin": "sha-tin",
    "Tai Po": "tai-po",
    "Tsuen Wan": "tsuen-wan",
    "Tuen Mun": "tuen-mun",
    "Yuen Long": "yuen-long",
    // Land Registry ASP JSON has no Kwai Tsing row
    "Kwai Tsing": null,
  };

  const DC_LABELS = {
    "Central and Western": { en: "Central & Western", zh: "中西區" },
    "Wan Chai": { en: "Wan Chai", zh: "灣仔" },
    Eastern: { en: "Eastern", zh: "東區" },
    Southern: { en: "Southern", zh: "南區" },
    "Yau Tsim Mong": { en: "Yau Tsim Mong", zh: "油尖旺" },
    "Sham Shui Po": { en: "Sham Shui Po", zh: "深水埗" },
    "Kowloon City": { en: "Kowloon City", zh: "九龍城" },
    "Wong Tai Sin": { en: "Wong Tai Sin", zh: "黃大仙" },
    "Kwun Tong": { en: "Kwun Tong", zh: "觀塘" },
    "Kwai Tsing": { en: "Kwai Tsing", zh: "葵青" },
    "Tsuen Wan": { en: "Tsuen Wan", zh: "荃灣" },
    "Tuen Mun": { en: "Tuen Mun", zh: "屯門" },
    "Yuen Long": { en: "Yuen Long", zh: "元朗" },
    North: { en: "North", zh: "北區" },
    "Tai Po": { en: "Tai Po", zh: "大埔" },
    "Sha Tin": { en: "Sha Tin", zh: "沙田" },
    "Sai Kung": { en: "Sai Kung", zh: "西貢" },
    Islands: { en: "Islands", zh: "離島" },
  };

  let locale = localStorage.getItem("hkp-lang") === "zh" ? "zh" : "en";
  let market = null;
  let priceChart = null;
  let rentChart = null;
  let mapData = null;
  let selectedAspId = null;

  const $ = (sel) => document.querySelector(sel);

  function t(key) {
    return STR[locale][key];
  }

  function applyI18n() {
    document.documentElement.lang = locale === "zh" ? "zh-HK" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (STR[locale][key] != null) el.textContent = STR[locale][key];
    });
    const btn = $("#lang-toggle");
    if (btn) btn.textContent = locale === "en" ? "繁體" : "EN";
    if (market) renderAll(market);
  }

  function fmt(n, digits = 1) {
    if (n == null || !Number.isFinite(n)) return "—";
    return n.toLocaleString(locale === "zh" ? "zh-HK" : "en-HK", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  }

  function fmtInt(n) {
    if (n == null || !Number.isFinite(n)) return "—";
    return n.toLocaleString(locale === "zh" ? "zh-HK" : "en-HK");
  }

  function monthLabel(mmYyyy) {
    const [mm, yyyy] = mmYyyy.split("-");
    return locale === "zh" ? `${yyyy}年${Number(mm)}月` : `${mm}/${yyyy}`;
  }

  function yyyymmLabel(yyyymm) {
    if (!yyyymm) return "";
    const y = yyyymm.slice(0, 4);
    const m = yyyymm.slice(4);
    return locale === "zh" ? `${y}年${Number(m)}月` : `${m}/${y}`;
  }

  function deltaLabel(series) {
    if (!series || series.length < 2) return "";
    const a = series[series.length - 1].value;
    const b = series[series.length - 2].value;
    const pct = ((a - b) / b) * 100;
    const sign = pct > 0 ? "+" : "";
    const prov = series[series.length - 1].provisional
      ? ` · ${t("provisional")}`
      : "";
    return `${sign}${pct.toFixed(2)}% MoM${prov}`;
  }

  function chartOptions(label) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: label,
          color: "#243a40",
          font: { family: "Sora", size: 13, weight: "600" },
        },
        tooltip: {
          callbacks: {
            title: (items) => monthLabel(items[0].label),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 8,
            callback(v) {
              const label = this.getLabelForValue(v);
              return monthLabel(label);
            },
            color: "#243a40",
            font: { size: 10 },
          },
          grid: { color: "rgba(12,31,36,0.06)" },
        },
        y: {
          ticks: { color: "#243a40", font: { size: 10 } },
          grid: { color: "rgba(12,31,36,0.08)" },
        },
      },
    };
  }

  function renderCharts(data) {
    const priceCtx = $("#price-chart");
    const rentCtx = $("#rent-chart");
    if (!priceCtx || !rentCtx || !window.Chart) return;

    const priceLabels = data.priceIndex.map((p) => p.month);
    const rentLabels = data.rentIndex.map((p) => p.month);

    if (priceChart) priceChart.destroy();
    if (rentChart) rentChart.destroy();

    priceChart = new Chart(priceCtx, {
      type: "line",
      data: {
        labels: priceLabels,
        datasets: [
          {
            data: data.priceIndex.map((p) => p.value),
            borderColor: "#1f7a5c",
            backgroundColor: "rgba(31,122,92,0.12)",
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: chartOptions(locale === "zh" ? "售價指數" : "Price index"),
    });

    rentChart = new Chart(rentCtx, {
      type: "line",
      data: {
        labels: rentLabels,
        datasets: [
          {
            data: data.rentIndex.map((p) => p.value),
            borderColor: "#c9832a",
            backgroundColor: "rgba(201,131,42,0.12)",
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: chartOptions(locale === "zh" ? "租金指數" : "Rent index"),
    });
  }

  function heatColor(value, max) {
    if (!max) return "#cfe0d8";
    const ratio = Math.max(0, Math.min(1, value / max));
    // jade → deep teal (no purple)
    const r = Math.round(207 - ratio * 155);
    const g = Math.round(224 - ratio * 70);
    const b = Math.round(216 - ratio * 115);
    return `rgb(${r},${g},${b})`;
  }

  function dcLabel(name) {
    const meta = DC_LABELS[name];
    if (!meta) return name;
    return locale === "zh" ? meta.zh : meta.en;
  }

  function ensureTooltip() {
    let tip = $("#map-tooltip");
    if (tip) return tip;
    tip = document.createElement("div");
    tip.id = "map-tooltip";
    tip.className = "map-tooltip";
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function setMapHighlight(aspId) {
    selectedAspId = aspId;
    document.querySelectorAll(".district").forEach((el) => {
      const match = aspId && el.getAttribute("data-asp") === aspId;
      el.classList.toggle("is-active", Boolean(match));
      el.classList.toggle("is-dim", Boolean(aspId) && !match);
    });
    document.querySelectorAll(".district-row").forEach((el) => {
      el.classList.toggle("is-active", aspId && el.getAttribute("data-id") === aspId);
    });
  }

  function showTooltip(evt, html) {
    const tip = ensureTooltip();
    tip.innerHTML = html;
    tip.hidden = false;
    const pad = 14;
    const x = Math.min(window.innerWidth - tip.offsetWidth - pad, evt.clientX + 12);
    const y = Math.min(window.innerHeight - tip.offsetHeight - pad, evt.clientY + 12);
    tip.style.left = `${Math.max(pad, x)}px`;
    tip.style.top = `${Math.max(pad, y)}px`;
  }

  function hideTooltip() {
    const tip = $("#map-tooltip");
    if (tip) tip.hidden = true;
  }

  function renderMap(asp) {
    const wrap = $("#district-map");
    const list = $("#district-list");
    if (!wrap || !list) return;

    if (!asp || !mapData) {
      wrap.innerHTML = `<p class="map-empty">${
        locale === "zh" ? "暫無買賣合約資料" : "No ASP data yet"
      }</p>`;
      list.innerHTML = "";
      return;
    }

    const max = Math.max(...asp.districts.map((d) => d.transactions), 1);
    const byId = Object.fromEntries(asp.districts.map((d) => [d.id, d]));

    wrap.innerHTML = `
      <svg viewBox="${mapData.viewBox}" role="img" aria-label="${
        locale === "zh" ? "香港分區地圖" : "Hong Kong district map"
      }">
        <rect x="0" y="0" width="1000" height="733" fill="transparent"></rect>
        ${mapData.paths
          .map((p) => {
            const aspId = DC_TO_ASP[p.name];
            const d = aspId ? byId[aspId] : null;
            const fill = d ? heatColor(d.transactions, max) : "#e4ebe6";
            const active =
              selectedAspId && aspId === selectedAspId ? " is-active" : "";
            const dim =
              selectedAspId && aspId !== selectedAspId ? " is-dim" : "";
            return `<path class="district${active}${dim}${
              aspId ? "" : " is-empty"
            }" data-dc="${p.name}" data-asp="${aspId || ""}" d="${p.d}" fill="${fill}" stroke="#0c1f24" stroke-opacity="0.28" stroke-width="1.2" tabindex="0"></path>`;
          })
          .join("")}
      </svg>
      <p class="map-credit">SimpleMaps · CC-BY-4.0</p>`;

    const sorted = [...asp.districts].sort(
      (a, b) => b.transactions - a.transactions,
    );
    list.innerHTML = sorted
      .map((d) => {
        const name = locale === "zh" ? d.zh : d.en;
        const money =
          d.considerationM != null
            ? `${fmtInt(d.considerationM)} ${t("hkM")}`
            : "—";
        const active = selectedAspId === d.id ? " is-active" : "";
        return `<button type="button" class="district-row${active}" data-id="${d.id}">
          <strong>${name}</strong>
          <span class="count">${fmtInt(d.transactions)} ${t("deals")}</span>
          <span class="hkd">${money}</span>
        </button>`;
      })
      .join("");

    const svg = wrap.querySelector("svg");
    svg?.addEventListener("pointerleave", () => {
      hideTooltip();
    });

    wrap.querySelectorAll(".district").forEach((path) => {
      const onEnter = (evt) => {
        const dc = path.getAttribute("data-dc");
        const aspId = path.getAttribute("data-asp");
        const row = aspId ? byId[aspId] : null;
        const title = dcLabel(dc);
        let body;
        if (!row) {
          body = `<div class="tip-sub">${t("noAsp")}</div>`;
        } else {
          const regionName = locale === "zh" ? row.zh : row.en;
          const regionLine =
            aspId === "hong-kong" || aspId === "kowloon"
              ? `<div class="tip-sub">${t("aspRegion")}: ${regionName}</div>`
              : "";
          const money =
            row.considerationM != null
              ? ` · ${fmtInt(row.considerationM)} ${t("hkM")}`
              : "";
          body = `${regionLine}<div class="tip-val">${fmtInt(row.transactions)} ${t(
            "deals",
          )}${money}</div>`;
        }
        showTooltip(evt, `<div class="tip-title">${title}</div>${body}`);
        if (aspId) {
          document.querySelectorAll(".district").forEach((el) => {
            const match = el.getAttribute("data-asp") === aspId;
            el.classList.toggle("is-hover", match);
          });
        }
      };

      path.addEventListener("pointerenter", onEnter);
      path.addEventListener("pointermove", (evt) => {
        if (!$("#map-tooltip")?.hidden) onEnter(evt);
      });
      path.addEventListener("pointerleave", () => {
        document
          .querySelectorAll(".district.is-hover")
          .forEach((el) => el.classList.remove("is-hover"));
      });
      path.addEventListener("click", () => {
        const aspId = path.getAttribute("data-asp");
        if (!aspId) return;
        setMapHighlight(selectedAspId === aspId ? null : aspId);
      });
      path.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          path.click();
        }
      });
    });

    list.querySelectorAll(".district-row").forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.getAttribute("data-id");
        setMapHighlight(selectedAspId === id ? null : id);
        const tipDistrict = mapData.paths.find(
          (p) => DC_TO_ASP[p.name] === id,
        );
        if (tipDistrict) {
          const d = byId[id];
          const title = locale === "zh" ? d.zh : d.en;
          showTooltip(
            { clientX: row.getBoundingClientRect().left, clientY: row.getBoundingClientRect().top },
            `<div class="tip-title">${title}</div><div class="tip-val">${fmtInt(
              d.transactions,
            )} ${t("deals")}</div>`,
          );
          setTimeout(hideTooltip, 1600);
        }
      });
    });
  }

  function renderRegions(data) {
    const tbody = $("#region-table tbody");
    if (!tbody) return;
    const priceBy = Object.fromEntries(
      (data.regionPrices || []).map((r) => [r.region, r]),
    );
    const rentBy = Object.fromEntries(
      (data.regionRents || []).map((r) => [r.region, r]),
    );
    const order = ["Hong Kong", "Kowloon", "New Territories"];
    tbody.innerHTML = order
      .map((region) => {
        const p = priceBy[region] || {};
        const r = rentBy[region] || {};
        const name = t("regions")[region] || region;
        return `<tr>
          <td>${name}</td>
          <td>${fmt(p.classA, 0)}</td>
          <td>${fmt(p.classB, 0)}</td>
          <td>${fmt(p.classC, 0)}</td>
          <td>${fmt(r.classA, 0)}</td>
          <td>${fmt(r.classB, 0)}</td>
          <td>${fmt(r.classC, 0)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderKpis(data) {
    const price = data.latestPrice;
    const rent = data.latestRent;
    $("#kpi-price").textContent = price ? fmt(price.value) : "—";
    $("#kpi-price-sub").textContent = price
      ? `${monthLabel(price.month)} · ${deltaLabel(data.priceIndex)}`
      : "";
    $("#kpi-rent").textContent = rent ? fmt(rent.value) : "—";
    $("#kpi-rent-sub").textContent = rent
      ? `${monthLabel(rent.month)} · ${deltaLabel(data.rentIndex)}`
      : "";

    if (data.asp) {
      $("#kpi-asp").textContent = fmtInt(data.asp.residential);
      $("#kpi-asp-sub").textContent = yyyymmLabel(data.asp.yyyymm);
      $("#kpi-split").textContent = `${fmtInt(data.asp.primary)} / ${fmtInt(data.asp.secondary)}`;
      $("#kpi-split-sub").textContent =
        locale === "zh" ? "一手 / 二手住宅" : "primary / secondary residential";
    }

    const asOf = $("#as-of");
    if (asOf && price) {
      asOf.textContent = t("asOf")(
        monthLabel(price.month),
        data.asp ? yyyymmLabel(data.asp.yyyymm) : "",
      );
    }
  }

  function renderAll(data) {
    renderKpis(data);
    renderCharts(data);
    renderMap(data.asp);
    renderRegions(data);
  }

  async function loadMapData() {
    if (mapData) return mapData;
    const res = await fetch("/hk-districts-paths.json");
    if (!res.ok) throw new Error(`Map HTTP ${res.status}`);
    mapData = await res.json();
    return mapData;
  }

  async function load() {
    try {
      const [_, res] = await Promise.all([
        loadMapData(),
        fetch("/api/market"),
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      market = await res.json();
      if (market.error) throw new Error(market.error);
      renderAll(market);
    } catch (err) {
      $("#as-of").textContent =
        locale === "zh"
          ? `未能載入官方數據：${err.message}`
          : `Could not load official data: ${err.message}`;
    }
  }

  $("#lang-toggle")?.addEventListener("click", () => {
    locale = locale === "en" ? "zh" : "en";
    localStorage.setItem("hkp-lang", locale);
    applyI18n();
  });

  applyI18n();
  load();
})();
