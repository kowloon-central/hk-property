(() => {
  const STR = {
    en: {
      brand: "HK Property",
      byline: "by Patrick Lau",
      heroTitle: "Official sold prices, rents & deals",
      heroLede:
        "Monthly RVD indices and Land Registry ASP counts — bilingual district dashboard. Click a district for building footprints and history.",
      kpiPrice: "Price index",
      kpiRent: "Rent index",
      kpiAsp: "ASP residential",
      kpiPrimary: "Primary vs secondary",
      chartsTitle: "Private domestic indices",
      chartsLede: "Territory-wide RVD monthly series (latest 60 months).",
      mapTitle: "ASP by district",
      mapLede:
        "Land Registry agreements for sale and purchase of building units. Click a district to open buildings & history.",
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
        "Sources: Rating & Valuation Department (data.gov.hk / rvd.gov.hk), Land Registry monthly ASP statistics, and Lands Department CSDI building footprints. Figures may be provisional. Building rent/asking listing feeds are not wired. Overview outlines: SimpleMaps Hong Kong admin1 (CC-BY-4.0).",
      footerHost: "Cloudflare Worker",
      provisional: "provisional",
      asOf: (d, ym) =>
        ym ? `Indices as of ${d} · ASP month ${ym}` : `Indices as of ${d}`,
      deals: "deals",
      hkM: "HK$ m",
      noAsp: "No ASP breakdown",
      aspRegion: "ASP region",
      openDistrict: "Open district",
      backOverview: "Back to overview",
      detailHistoryTitle: "District history",
      detailHistoryLede:
        "RVD regional average price/rent series for the parent region, plus Land Registry ASP counts for the matching published area.",
      detailMapTitle: "Building map",
      detailMapLede:
        "CSDI LandsD building footprints. Select a building for name and rent/asking status.",
      buildingPick: "Select a building",
      attrStoreys: "Storeys",
      attrType: "Type",
      attrHeight: "Height (m)",
      attrRent: "Rent listing",
      attrAsking: "Asking listing",
      rentPlaceholder: "Rent listing data not wired yet",
      askingPlaceholder: "Asking listing data not wired yet",
      unnamedBuilding: "Unnamed building",
      buildingsLoading: "Loading building footprints…",
      buildingsLoaded: (n, named) =>
        `${n} footprints${named ? " (named preferred)" : ""} · CSDI LandsD`,
      buildingsError: (m) => `Could not load buildings: ${m}`,
      detailSub: (rvd, asp) =>
        `RVD region: ${rvd} · ASP area: ${asp || "n/a"}`,
      dataNotesLive: "Live",
      dataNotesPlaceholder: "Placeholder",
      chartRegionPrice: "Avg price (HK$/m²)",
      chartRegionRent: "Avg rent (HK$/m²)",
      chartAsp: "ASP deals",
      classA: "Class A",
      classB: "Class B",
      classC: "Class C",
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
        "差餉物業估價署按月指數與土地註冊處買賣合約宗數 — 中英對照地區儀表板。點選分區可深入樓宇地圖與歷史數列。",
      kpiPrice: "售價指數",
      kpiRent: "租金指數",
      kpiAsp: "住宅買賣合約",
      kpiPrimary: "一手 / 二手",
      chartsTitle: "私人住宅指數",
      chartsLede: "全港差估署按月數列（最近 60 個月）。",
      mapTitle: "分區買賣合約",
      mapLede:
        "土地註冊處樓宇單位買賣合約宗數。點選分區開啟樓宇地圖與歷史。",
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
        "資料來源：差餉物業估價署（data.gov.hk / rvd.gov.hk）、土地註冊處每月買賣合約統計，以及地政總署 CSDI 建築物範圍。最新數字或屬臨時數字。樓宇租金／叫價盤源尚未接駁。總覽界線：SimpleMaps 香港行政區（CC-BY-4.0）。",
      footerHost: "Cloudflare Worker",
      provisional: "臨時",
      asOf: (d, ym) =>
        ym ? `指數截至 ${d} · 買賣合約月份 ${ym}` : `指數截至 ${d}`,
      deals: "宗",
      hkM: "百萬港元",
      noAsp: "暫無買賣合約分項",
      aspRegion: "買賣合約分區",
      openDistrict: "開啟分區",
      backOverview: "返回總覽",
      detailHistoryTitle: "地區歷史",
      detailHistoryLede:
        "差估署所屬大區平均售價／租金數列，以及土地註冊處該買賣合約分區宗數。",
      detailMapTitle: "樓宇地圖",
      detailMapLede:
        "CSDI 地政總署建築物範圍；點選樓宇查看名稱與租金／叫價狀態。",
      buildingPick: "選擇樓宇",
      attrStoreys: "層數",
      attrType: "類型",
      attrHeight: "高度（米）",
      attrRent: "租金盤源",
      attrAsking: "叫價盤源",
      rentPlaceholder: "租金盤源尚未接駁",
      askingPlaceholder: "叫價盤源尚未接駁",
      unnamedBuilding: "未命名樓宇",
      buildingsLoading: "正在載入樓宇範圍…",
      buildingsLoaded: (n, named) =>
        `${n} 個樓宇範圍${named ? "（優先顯示有名稱）" : ""} · CSDI 地政總署`,
      buildingsError: (m) => `未能載入樓宇：${m}`,
      detailSub: (rvd, asp) =>
        `差估署大區：${rvd} · 買賣合約分區：${asp || "不適用"}`,
      dataNotesLive: "已接駁",
      dataNotesPlaceholder: "佔位",
      chartRegionPrice: "平均售價（港元／平方米）",
      chartRegionRent: "平均租金（港元／平方米）",
      chartAsp: "買賣合約宗數",
      classA: "A 類",
      classB: "B 類",
      classC: "C 類",
      regions: {
        "Hong Kong": "香港島",
        Kowloon: "九龍",
        "New Territories": "新界",
      },
    },
  };

  /** 18 DC names (SimpleMaps) → Land Registry ASP region ids */
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
    "Kwai Tsing": null,
  };

  const DC_TO_RVD = {
    "Central and Western": "Hong Kong",
    "Wan Chai": "Hong Kong",
    Eastern: "Hong Kong",
    Southern: "Hong Kong",
    "Yau Tsim Mong": "Kowloon",
    "Sham Shui Po": "Kowloon",
    "Kowloon City": "Kowloon",
    "Wong Tai Sin": "Kowloon",
    "Kwun Tong": "Kowloon",
    "Kwai Tsing": "New Territories",
    "Tsuen Wan": "New Territories",
    "Tuen Mun": "New Territories",
    "Yuen Long": "New Territories",
    North: "New Territories",
    "Tai Po": "New Territories",
    "Sha Tin": "New Territories",
    "Sai Kung": "New Territories",
    Islands: "New Territories",
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

  /** Default Traditional Chinese; only explicit "en" preference stays English. */
  const storedLang = localStorage.getItem("hkp-lang");
  let locale = storedLang === "en" ? "en" : "zh";
  let market = null;
  let priceChart = null;
  let rentChart = null;
  let detailPriceChart = null;
  let detailRentChart = null;
  let detailAspChart = null;
  let mapData = null;
  let districtsMeta = null;
  let districtsGeo = null;
  let selectedAspId = null;
  let activeDistrict = null;
  let leafletMap = null;
  let leafletLayers = null;
  let selectedBuildingLayer = null;

  const $ = (sel) => document.querySelector(sel);

  function t(key) {
    return STR[locale][key];
  }

  function applyI18n() {
    document.documentElement.lang = locale === "zh" ? "zh-HK" : "en";
    document.title =
      locale === "zh" ? "香港樓市 · Patrick Lau" : "HK Property · Patrick Lau";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (STR[locale][key] != null) el.textContent = STR[locale][key];
    });
    const btn = $("#lang-toggle");
    if (btn) btn.textContent = locale === "en" ? "繁體" : "EN";
    if (market) renderAll(market);
    if (activeDistrict) {
      renderDetailChrome(activeDistrict);
      if (market) renderDetailCharts(activeDistrict, market);
      refreshBuildingPanelLabels();
    }
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

  function multiSeriesOptions(label) {
    const base = chartOptions(label);
    base.plugins.legend = {
      display: true,
      labels: { boxWidth: 10, color: "#243a40", font: { size: 10 } },
    };
    return base;
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
      el.classList.toggle(
        "is-active",
        aspId && el.getAttribute("data-id") === aspId,
      );
    });
  }

  function showTooltip(evt, html) {
    const tip = ensureTooltip();
    tip.innerHTML = html;
    tip.hidden = false;
    const pad = 14;
    const x = Math.min(
      window.innerWidth - tip.offsetWidth - pad,
      evt.clientX + 12,
    );
    const y = Math.min(
      window.innerHeight - tip.offsetHeight - pad,
      evt.clientY + 12,
    );
    tip.style.left = `${Math.max(pad, x)}px`;
    tip.style.top = `${Math.max(pad, y)}px`;
  }

  function hideTooltip() {
    const tip = $("#map-tooltip");
    if (tip) tip.hidden = true;
  }

  function openDistrict(dcName) {
    if (!DC_LABELS[dcName]) return;
    activeDistrict = dcName;
    hideTooltip();
    $("#overview").hidden = true;
    const detail = $("#district-detail");
    detail.hidden = false;
    renderDetailChrome(dcName);
    if (market) renderDetailCharts(dcName, market);
    loadDistrictMap(dcName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeDistrict() {
    activeDistrict = null;
    $("#district-detail").hidden = true;
    $("#overview").hidden = false;
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      leafletLayers = null;
      selectedBuildingLayer = null;
    }
    if (detailPriceChart) {
      detailPriceChart.destroy();
      detailPriceChart = null;
    }
    if (detailRentChart) {
      detailRentChart.destroy();
      detailRentChart = null;
    }
    if (detailAspChart) {
      detailAspChart.destroy();
      detailAspChart = null;
    }
    clearBuildingPanel();
  }

  function renderDetailChrome(dcName) {
    const aspId = DC_TO_ASP[dcName];
    const rvd = DC_TO_RVD[dcName];
    const aspRow = market?.asp?.districts?.find((d) => d.id === aspId);
    const aspName = aspRow
      ? locale === "zh"
        ? aspRow.zh
        : aspRow.en
      : aspId
        ? aspId
        : null;
    $("#detail-title").textContent = dcLabel(dcName);
    $("#detail-sub").textContent = t("detailSub")(
      t("regions")[rvd] || rvd,
      aspName,
    );

    const notes = market?.dataNotes;
    const live = (notes?.live || []).slice(0, 3).join(" · ");
    const placeholder = (notes?.placeholder || []).slice(0, 2).join(" · ");
    $("#detail-data-notes").textContent = `${t("dataNotesLive")}: ${live}. ${t(
      "dataNotesPlaceholder",
    )}: ${placeholder}.`;
  }

  function regionSeriesFor(data, key, region) {
    const list = data[key] || [];
    return list.find((s) => s.region === region)?.points || [];
  }

  function renderDetailCharts(dcName, data) {
    if (!window.Chart) return;
    const region = DC_TO_RVD[dcName];
    const pricePts = regionSeriesFor(data, "regionPriceSeries", region);
    const rentPts = regionSeriesFor(data, "regionRentSeries", region);
    const labels = pricePts.map((p) => p.month);

    const priceCtx = $("#detail-price-chart");
    const rentCtx = $("#detail-rent-chart");
    if (detailPriceChart) detailPriceChart.destroy();
    if (detailRentChart) detailRentChart.destroy();

    detailPriceChart = new Chart(priceCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: t("classA"),
            data: pricePts.map((p) => p.classA),
            borderColor: "#1f7a5c",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: t("classB"),
            data: pricePts.map((p) => p.classB),
            borderColor: "#3d8f72",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 1.5,
          },
          {
            label: t("classC"),
            data: pricePts.map((p) => p.classC),
            borderColor: "#145a44",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      },
      options: multiSeriesOptions(t("chartRegionPrice")),
    });

    const rentLabels = rentPts.map((p) => p.month);
    detailRentChart = new Chart(rentCtx, {
      type: "line",
      data: {
        labels: rentLabels,
        datasets: [
          {
            label: t("classA"),
            data: rentPts.map((p) => p.classA),
            borderColor: "#c9832a",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: t("classB"),
            data: rentPts.map((p) => p.classB),
            borderColor: "#d4a05a",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 1.5,
          },
          {
            label: t("classC"),
            data: rentPts.map((p) => p.classC),
            borderColor: "#a66a1f",
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      },
      options: multiSeriesOptions(t("chartRegionRent")),
    });

    loadAspHistoryChart(dcName);
  }

  async function loadAspHistoryChart(dcName) {
    const aspId = DC_TO_ASP[dcName];
    const ctx = $("#detail-asp-chart");
    if (detailAspChart) {
      detailAspChart.destroy();
      detailAspChart = null;
    }
    if (!aspId || !window.Chart) {
      detailAspChart = new Chart(ctx, {
        type: "bar",
        data: { labels: [], datasets: [{ data: [] }] },
        options: chartOptions(t("chartAsp")),
      });
      return;
    }
    try {
      const res = await fetch(
        `/api/asp-history?id=${encodeURIComponent(aspId)}&months=18`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const labels = (data.points || []).map((p) => {
        const y = p.yyyymm.slice(0, 4);
        const m = p.yyyymm.slice(4);
        return `${m}-${y}`;
      });
      detailAspChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              data: (data.points || []).map((p) => p.transactions),
              backgroundColor: "rgba(31,122,92,0.55)",
              borderRadius: 4,
            },
          ],
        },
        options: chartOptions(t("chartAsp")),
      });
    } catch {
      detailAspChart = new Chart(ctx, {
        type: "bar",
        data: { labels: [], datasets: [{ data: [] }] },
        options: chartOptions(t("chartAsp")),
      });
    }
  }

  function clearBuildingPanel() {
    $("#building-name").textContent = "—";
    $("#building-storeys").textContent = "—";
    $("#building-type").textContent = "—";
    $("#building-height").textContent = "—";
    $("#building-rent").textContent = t("rentPlaceholder");
    $("#building-asking").textContent = t("askingPlaceholder");
    $("#building-rent").classList.add("is-placeholder");
    $("#building-asking").classList.add("is-placeholder");
    $("#building-status").textContent = "";
  }

  function refreshBuildingPanelLabels() {
    const rent = $("#building-rent");
    const asking = $("#building-asking");
    if (rent?.classList.contains("is-placeholder")) {
      rent.textContent = t("rentPlaceholder");
    }
    if (asking?.classList.contains("is-placeholder")) {
      asking.textContent = t("askingPlaceholder");
    }
  }

  function showBuilding(feature, layer) {
    if (selectedBuildingLayer) {
      selectedBuildingLayer.setStyle({
        weight: 0.8,
        color: "#145a44",
        fillColor: "#1f7a5c",
        fillOpacity: 0.45,
      });
      selectedBuildingLayer.getElement()?.classList.remove("is-selected");
    }
    selectedBuildingLayer = layer;
    layer.setStyle({
      weight: 2.2,
      color: "#c9832a",
      fillColor: "#e8b86a",
      fillOpacity: 0.7,
    });
    layer.getElement()?.classList.add("is-selected");

    const p = feature.properties || {};
    const name =
      locale === "zh"
        ? p.nameTc || p.nameEn || t("unnamedBuilding")
        : p.nameEn || p.nameTc || t("unnamedBuilding");
    $("#building-name").textContent = name;
    $("#building-storeys").textContent =
      p.storeys != null ? fmtInt(p.storeys) : "—";
    $("#building-type").textContent = p.blockType || "—";
    const height =
      p.topHeight != null && p.baseHeight != null
        ? p.topHeight - p.baseHeight
        : p.topHeight;
    $("#building-height").textContent =
      height != null && Number.isFinite(height) ? fmt(height, 1) : "—";
    $("#building-rent").textContent = t("rentPlaceholder");
    $("#building-asking").textContent = t("askingPlaceholder");
    $("#building-rent").classList.add("is-placeholder");
    $("#building-asking").classList.add("is-placeholder");
    $("#building-status").textContent =
      locale === "zh"
        ? "官方屬性：名稱／層數／高度（如有）。租金與叫價為佔位狀態。"
        : "Official attributes: name / storeys / height when present. Rent & asking are placeholder states.";
  }

  async function loadDistrictMap(dcName) {
    const meta = districtsMeta?.districts?.[dcName];
    const mapEl = $("#district-leaflet");
    const buildingsMeta = $("#buildings-meta");
    clearBuildingPanel();
    buildingsMeta.textContent = t("buildingsLoading");

    if (!window.L || !meta) {
      buildingsMeta.textContent = t("buildingsError")("map unavailable");
      return;
    }

    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      leafletLayers = null;
      selectedBuildingLayer = null;
    }

    const [minLon, minLat, maxLon, maxLat] = meta.bbox;
    leafletMap = L.map(mapEl, { scrollWheelZoom: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · &copy; CARTO · buildings: CSDI LandsD',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(leafletMap);

    const bounds = L.latLngBounds(
      [minLat, minLon],
      [maxLat, maxLon],
    );
    leafletMap.fitBounds(bounds, { padding: [16, 16] });

    if (districtsGeo) {
      const feature = districtsGeo.features.find(
        (f) => f.properties?.name === dcName,
      );
      if (feature) {
        L.geoJSON(feature, {
          style: {
            color: "#0c1f24",
            weight: 2,
            fillColor: "#1f7a5c",
            fillOpacity: 0.06,
          },
        }).addTo(leafletMap);
      }
    }

    try {
      const res = await fetch(
        `/api/buildings?bbox=${meta.bbox.join(",")}&limit=700`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (payload.error) throw new Error(payload.error);

      const gj = {
        type: "FeatureCollection",
        features: (payload.features || []).map((b) => ({
          type: "Feature",
          geometry: b.geometry,
          properties: {
            id: b.id,
            nameEn: b.nameEn,
            nameTc: b.nameTc,
            blockType: b.blockType,
            storeys: b.storeys,
            baseHeight: b.baseHeight,
            topHeight: b.topHeight,
          },
        })),
      };

      leafletLayers = L.geoJSON(gj, {
        style: {
          color: "#145a44",
          weight: 0.8,
          fillColor: "#1f7a5c",
          fillOpacity: 0.45,
        },
        onEachFeature(feature, layer) {
          layer.options.className = "building-footprint";
          layer.on("click", () => showBuilding(feature, layer));
        },
      }).addTo(leafletMap);

      buildingsMeta.textContent = t("buildingsLoaded")(
        payload.count,
        payload.namedOnly,
      );
      if (payload.truncated) {
        buildingsMeta.textContent +=
          locale === "zh" ? "（已截斷）" : " (truncated)";
      }
    } catch (err) {
      buildingsMeta.textContent = t("buildingsError")(err.message);
    }

    setTimeout(() => leafletMap?.invalidateSize(), 80);
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

    // Also list 18 DCs for drill-down (including Kwai Tsing)
    const dcButtons = mapData.paths
      .map((p) => {
        const label = dcLabel(p.name);
        return `<button type="button" class="district-row district-dc" data-dc="${p.name}">
          <strong>${label}</strong>
          <span class="count">${t("openDistrict")}</span>
          <span class="hkd"></span>
        </button>`;
      })
      .join("");
    list.insertAdjacentHTML(
      "beforeend",
      `<div style="margin-top:0.6rem;font-size:0.75rem;color:#243a40;font-weight:600;letter-spacing:0.04em;text-transform:uppercase">${
        locale === "zh" ? "十八區深入" : "18 districts"
      }</div>${dcButtons}`,
    );

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
          body = `<div class="tip-sub">${t("noAsp")}</div><div class="tip-val">${t(
            "openDistrict",
          )}</div>`;
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
          )}${money}</div><div class="tip-sub">${t("openDistrict")}</div>`;
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
        const dc = path.getAttribute("data-dc");
        openDistrict(dc);
      });
      path.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          path.click();
        }
      });
    });

    list.querySelectorAll(".district-row[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.getAttribute("data-id");
        setMapHighlight(selectedAspId === id ? null : id);
        const tipDistrict = mapData.paths.find((p) => DC_TO_ASP[p.name] === id);
        if (tipDistrict) openDistrict(tipDistrict.name);
      });
    });

    list.querySelectorAll(".district-row[data-dc]").forEach((row) => {
      row.addEventListener("click", () => {
        openDistrict(row.getAttribute("data-dc"));
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
      $("#kpi-split").textContent = `${fmtInt(data.asp.primary)} / ${fmtInt(
        data.asp.secondary,
      )}`;
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
    if (mapData && districtsMeta && districtsGeo) {
      return { mapData, districtsMeta, districtsGeo };
    }
    const [pathsRes, metaRes, geoRes] = await Promise.all([
      fetch("/hk-districts-paths.json"),
      fetch("/hk-districts-meta.json"),
      fetch("/hk-districts.geojson"),
    ]);
    if (!pathsRes.ok) throw new Error(`Map HTTP ${pathsRes.status}`);
    if (!metaRes.ok) throw new Error(`Meta HTTP ${metaRes.status}`);
    if (!geoRes.ok) throw new Error(`Geo HTTP ${geoRes.status}`);
    mapData = await pathsRes.json();
    districtsMeta = await metaRes.json();
    districtsGeo = await geoRes.json();
    return { mapData, districtsMeta, districtsGeo };
  }

  async function load() {
    try {
      const [_, res] = await Promise.all([loadMapData(), fetch("/api/market")]);
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

  $("#detail-back")?.addEventListener("click", () => closeDistrict());

  applyI18n();
  load();
})();
