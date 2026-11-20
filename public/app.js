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
        "Sources: Rating & Valuation Department (data.gov.hk / rvd.gov.hk) and Land Registry monthly ASP statistics. Figures may be provisional.",
      footerHost: "Cloudflare Worker",
      provisional: "provisional",
      asOf: (d, ym) =>
        ym
          ? `Indices as of ${d} · ASP month ${ym}`
          : `Indices as of ${d}`,
      deals: "deals",
      hkM: "HK$ m",
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
        "資料來源：差餉物業估價署（data.gov.hk / rvd.gov.hk）及土地註冊處每月買賣合約統計。最新數字或屬臨時數字。",
      footerHost: "Cloudflare Worker",
      provisional: "臨時",
      asOf: (d, ym) =>
        ym ? `指數截至 ${d} · 買賣合約月份 ${ym}` : `指數截至 ${d}`,
      deals: "宗",
      hkM: "百萬港元",
      regions: {
        "Hong Kong": "香港島",
        Kowloon: "九龍",
        "New Territories": "新界",
      },
    },
  };

  let locale = localStorage.getItem("hkp-lang") === "zh" ? "zh" : "en";
  let market = null;
  let priceChart = null;
  let rentChart = null;

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

  const MAP_SHAPES = [
    {
      id: "hong-kong",
      d: "M210 250 C230 235 270 230 295 245 C320 260 330 290 310 310 C285 335 240 340 215 320 C190 300 190 270 210 250 Z",
    },
    {
      id: "kowloon",
      d: "M200 175 C230 160 275 158 305 175 C325 190 320 220 295 230 C260 245 220 245 195 225 C175 208 180 188 200 175 Z",
    },
    {
      id: "islands",
      d: "M95 275 C120 260 150 265 160 285 C168 305 145 325 115 320 C90 315 80 290 95 275 Z",
    },
    {
      id: "tsuen-wan",
      d: "M145 155 C170 145 195 148 205 165 C210 180 195 195 170 198 C145 200 130 180 145 155 Z",
    },
    {
      id: "sha-tin",
      d: "M250 120 C280 110 310 118 320 140 C325 158 305 175 275 175 C245 175 230 150 250 120 Z",
    },
    {
      id: "sai-kung",
      d: "M330 130 C365 115 400 130 410 160 C415 185 390 205 355 200 C325 195 310 160 330 130 Z",
    },
    {
      id: "tai-po",
      d: "M255 70 C290 55 330 65 340 95 C345 115 320 130 285 125 C255 120 240 95 255 70 Z",
    },
    {
      id: "north",
      d: "M230 25 C275 10 330 20 345 50 C350 70 320 85 275 80 C235 75 210 50 230 25 Z",
    },
    {
      id: "yuen-long",
      d: "M95 70 C140 55 185 65 195 95 C200 115 170 135 130 130 C95 125 75 100 95 70 Z",
    },
    {
      id: "tuen-mun",
      d: "M70 130 C105 115 135 125 145 150 C150 170 125 190 95 185 C70 180 55 155 70 130 Z",
    },
  ];

  function heatColor(value, max) {
    if (!max) return "#cfe0d8";
    const t = Math.max(0, Math.min(1, value / max));
    // jade scale
    const r = Math.round(207 - t * 140);
    const g = Math.round(224 - t * 70);
    const b = Math.round(216 - t * 100);
    return `rgb(${r},${g},${b})`;
  }

  function renderMap(asp) {
    const wrap = $("#district-map");
    const list = $("#district-list");
    if (!wrap || !list || !asp) {
      if (wrap) wrap.innerHTML = `<p style="padding:1rem;color:#243a40">${locale === "zh" ? "暫無買賣合約資料" : "No ASP data yet"}</p>`;
      if (list) list.innerHTML = "";
      return;
    }

    const max = Math.max(...asp.districts.map((d) => d.transactions), 1);
    const byId = Object.fromEntries(asp.districts.map((d) => [d.id, d]));

    wrap.innerHTML = `
      <svg viewBox="0 0 480 360" role="presentation">
        <rect x="0" y="0" width="480" height="360" fill="transparent" />
        ${MAP_SHAPES.map((s) => {
          const d = byId[s.id];
          const fill = heatColor(d?.transactions ?? 0, max);
          const label = d ? (locale === "zh" ? d.zh : d.en) : s.id;
          return `<path class="district" data-id="${s.id}" d="${s.d}" fill="${fill}" stroke="#0c1f24" stroke-opacity="0.25" stroke-width="1.5">
            <title>${label}: ${fmtInt(d?.transactions ?? 0)}</title>
          </path>`;
        }).join("")}
      </svg>`;

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
        return `<div class="district-row" data-id="${d.id}">
          <strong>${name}</strong>
          <span class="count">${fmtInt(d.transactions)} ${t("deals")}</span>
          <span class="hkd">${money}</span>
        </div>`;
      })
      .join("");
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

  async function load() {
    try {
      const res = await fetch("/api/market");
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
