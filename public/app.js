(() => {
  const STR = {
    en: {
      brand: "HK Property",
      byline: "by Patrick Lau",
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
        "Sources: Rating & Valuation Department (data.gov.hk / rvd.gov.hk), Land Registry monthly ASP statistics, Lands Department CSDI building footprints, MTR station points (CSDI mtr_venue_polygon centroids + MTR Corporation Limited bilingual open data), EDB school locations (data.gov.hk), Esri China (HK) POA school-net boundaries (EDB-derived), OpenStreetMap contributors, and Midland Realty July 2024 railway-estate snapshot (digitized values; Midland cited as source — PNG not used as a live overlay). EDB does not publish school Band 1/2/3 polygons — bands apply to students. Figures may be provisional. Building rent/asking listing feeds are not wired. Overview outlines: SimpleMaps Hong Kong admin1 (CC-BY-4.0). Basemap: OpenStreetMap.",
      footerHost: "Cloudflare Worker",
      layerMidlandMtr: "Midland avg $/sq ft",
      layerMtrStations: "MTR stations",
      layerPrimarySchools: "Primary schools",
      layerSecondarySchools: "Secondary schools",
      layerPoaNets: "POA school nets",
      bandNote:
        "EDB does not publish school “Band 1/2/3” layers; bands are student groups in SSPA. Shown here: official school locations and Primary One Admission net boundaries.",
      schoolPrimary: "Primary school",
      schoolSecondary: "Secondary school",
      schoolDistrict: "District",
      schoolFinance: "Finance",
      schoolsLoaded: (n, level) =>
        `${n} ${level === "PRIMARY" ? "primary" : "secondary"} school${
          n === 1 ? "" : "s"
        } · EDB`,
      poaLoaded: (n) => `${n} POA net${n === 1 ? "" : "s"} in view`,
      midlandOverlayNote:
        "Midland Jul 2024 railway-estate avg $/sq ft (digitized; one estate/station)",
      midlandEstate: "Estate",
      midlandPsf: "Avg $/sq ft",
      midlandPriceDelta: "MoM price",
      midlandDeals: "Registrations",
      midlandNoDelta: "No MoM %",
      midlandNoPsf: "No avg $/sq ft",
      midlandSource: "Source: Midland Realty / Land Registry (Jul 2024)",
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
      mtrLoaded: (n) =>
        `${n} MTR station${n === 1 ? "" : "s"} in view · CSDI + MTR Corp`,
      mtrLines: "Lines",
      mtrPopupTitle: "MTR station",
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
        "資料來源：差餉物業估價署（data.gov.hk / rvd.gov.hk）、土地註冊處每月買賣合約統計、地政總署 CSDI 建築物範圍、港鐵站點（CSDI mtr_venue_polygon 形心 + 香港鐵路有限公司雙語開放數據）、教育局學校位置（data.gov.hk）、Esri China (HK) 小一入學校網界線（源自教育局）、OpenStreetMap 貢獻者，以及美聯物業 2024年7月鐵路盤快照（人手數位化數值；美聯為出處——PNG 不作產品疊圖）。教育局並無公布學校 Band 1／2／3 圖層——Band 用於學生派位。最新數字或屬臨時數字。樓宇租金／叫價盤源尚未接駁。總覽界線：SimpleMaps 香港行政區（CC-BY-4.0）。底圖：OpenStreetMap。",
      footerHost: "Cloudflare Worker",
      layerMidlandMtr: "美聯平均呎價",
      layerMtrStations: "港鐵站",
      layerPrimarySchools: "小學",
      layerSecondarySchools: "中學",
      layerPoaNets: "小一校網",
      bandNote:
        "教育局並無公布學校「Band 1／2／3」圖層；Band 用於中一派位的學生組別。此處顯示官方學校位置及小一入學校網界線。",
      schoolPrimary: "小學",
      schoolSecondary: "中學",
      schoolDistrict: "分區",
      schoolFinance: "資助種類",
      schoolsLoaded: (n, level) =>
        `範圍內 ${n} 所${level === "PRIMARY" ? "小學" : "中學"} · 教育局`,
      poaLoaded: (n) => `範圍內 ${n} 個小一校網`,
      midlandOverlayNote:
        "美聯 2024年7月鐵路盤平均呎價（數位化；每站代表屋苑）",
      midlandEstate: "屋苑",
      midlandPsf: "平均呎價",
      midlandPriceDelta: "呎價按月",
      midlandDeals: "註冊宗數",
      midlandNoDelta: "無按月升跌％",
      midlandNoPsf: "無平均呎價",
      midlandSource: "來源：美聯物業／土地註冊處（2024年7月）",
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
      mtrLoaded: (n) => `範圍內 ${n} 個港鐵站 · CSDI + 港鐵公司`,
      mtrLines: "路線",
      mtrPopupTitle: "港鐵站",
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
  let mtrStationsGeo = null;
  let schoolsGeo = null;
  let poaNetsGeo = null;
  let selectedAspId = null;
  let activeDistrict = null;
  let leafletMap = null;
  let leafletLayers = null;
  let selectedBuildingLayer = null;
  let basemapLayer = null;
  let mtrLayerGroup = null;
  let midlandMtrData = null;
  let primarySchoolLayer = null;
  let secondarySchoolLayer = null;
  let poaNetsLayer = null;
  let activeDistrictBbox = null;
  let mapLayerPrefs = {
    midland: false,
    mtr: true,
    primary: false,
    secondary: false,
    poa: false,
  };

  const OSM_BASEMAP = {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · buildings: CSDI LandsD · MTR: CSDI + MTR Corp · schools: EDB · Midland Jul 2024 railway-estate Δ: Midland Realty',
      maxZoom: 19,
    },
  };

  const LINE_LABELS = {
    AEL: { en: "Airport Express", zh: "機場快線" },
    DRL: { en: "Disneyland Resort", zh: "迪士尼線" },
    EAL: { en: "East Rail", zh: "東鐵線" },
    ISL: { en: "Island", zh: "港島線" },
    KTL: { en: "Kwun Tong", zh: "觀塘線" },
    SIL: { en: "South Island", zh: "南港島線" },
    TCL: { en: "Tung Chung", zh: "東涌線" },
    TKL: { en: "Tseung Kwan O", zh: "將軍澳線" },
    TML: { en: "Tuen Ma", zh: "屯馬線" },
    TWL: { en: "Tsuen Wan", zh: "荃灣線" },
  };

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
    activeDistrictBbox = null;
    $("#district-detail").hidden = true;
    $("#overview").hidden = false;
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      leafletLayers = null;
      selectedBuildingLayer = null;
      basemapLayer = null;
      mtrLayerGroup = null;
      primarySchoolLayer = null;
      secondarySchoolLayer = null;
      poaNetsLayer = null;
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

  function pointInBbox(coords, bbox) {
    const [lon, lat] = coords;
    const [minLon, minLat, maxLon, maxLat] = bbox;
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
  }

  function lineLabel(code) {
    const meta = LINE_LABELS[code];
    if (!meta) return code;
    return locale === "zh" ? meta.zh : meta.en;
  }

  function midlandLookup(stationCode) {
    if (!midlandMtrData?.stations || !stationCode) return null;
    return midlandMtrData.stations[stationCode] || null;
  }

  function formatSignedPct(n) {
    if (n == null || !Number.isFinite(n)) return null;
    if (n > 0) return `+${n}%`;
    return `${n}%`;
  }

  /** Midland chart style absolute $/sq ft (e.g. $14,400). */
  function formatMidlandPsfFull(n) {
    if (n == null || !Number.isFinite(n)) return null;
    return `$${Number(n).toLocaleString("en-HK")}`;
  }

  /** Compact marker label: 萬 in zh (≥1萬), else Midland $X,XXX; en uses $X.Xk. */
  function formatMidlandPsfMarker(n) {
    if (n == null || !Number.isFinite(n)) return null;
    if (locale === "zh") {
      if (n >= 10000) {
        const wan = n / 10000;
        const digits = wan >= 10 ? 1 : 2;
        return `${wan.toFixed(digits)}萬`;
      }
      return `$${Number(n).toLocaleString("en-HK")}`;
    }
    return `$${(n / 1000).toFixed(1)}k`;
  }

  function midlandDeltaDir(mid) {
    if (!mid || mid.priceDeltaPct == null) return "na";
    if (mid.priceDeltaPct > 0) return "up";
    if (mid.priceDeltaPct < 0) return "down";
    return "flat";
  }

  function midlandMarkerFill(mid) {
    // Mild MoM cue on fill when delta exists; otherwise price-band tint.
    if (!mid) return "#8a96a0";
    if (mid.priceDeltaPct != null) {
      if (mid.priceDeltaPct > 0) return "#1f7a5c";
      if (mid.priceDeltaPct < 0) return "#b33a3a";
      return "#c9832a";
    }
    const psf = mid.avgPsf;
    if (psf == null) return "#8a96a0";
    if (psf >= 20000) return "#6b2d5c";
    if (psf >= 15000) return "#c9832a";
    if (psf >= 12000) return "#2a7a8c";
    return "#3d6b5c";
  }

  function mtrPopupHtml(props) {
    const name =
      locale === "zh"
        ? props.nameZh || props.nameEn
        : props.nameEn || props.nameZh;
    const alt =
      locale === "zh"
        ? props.nameEn && props.nameEn !== props.nameZh
          ? props.nameEn
          : ""
        : props.nameZh && props.nameZh !== props.nameEn
          ? props.nameZh
          : "";
    const lines = (props.lines || [])
      .map((c) => `<span class="mtr-line">${lineLabel(c)} (${c})</span>`)
      .join("");
    const mid = props.midland;
    let midlandBlock = "";
    if (mid) {
      const estate =
        locale === "zh"
          ? mid.estateZh || mid.estateEn
          : mid.estateEn || mid.estateZh;
      const delta =
        mid.priceDeltaPct != null
          ? formatSignedPct(mid.priceDeltaPct)
          : mid.priceDeltaFlag
            ? mid.priceDeltaFlag
            : t("midlandNoDelta");
      const psf = formatMidlandPsfFull(mid.avgPsf) || t("midlandNoPsf");
      const deals =
        mid.deals != null
          ? mid.dealsDeltaPct != null
            ? `${mid.deals} (${formatSignedPct(mid.dealsDeltaPct)})`
            : mid.dealsDeltaPrevZero
              ? locale === "zh"
                ? `${mid.deals}（上月0宗）`
                : `${mid.deals} (prev month 0)`
              : String(mid.deals)
          : "—";
      midlandBlock = `<div class="mtr-popup-midland">
        <div class="mtr-popup-label">${t("midlandSource")}</div>
        <div class="mtr-popup-mid-row mtr-popup-mid-lead"><span>${t(
          "midlandPsf",
        )}</span><strong>${psf}</strong></div>
        <div class="mtr-popup-mid-row"><span>${t(
          "midlandEstate",
        )}</span><strong>${estate || "—"}</strong></div>
        <div class="mtr-popup-mid-row"><span>${t(
          "midlandPriceDelta",
        )}</span><strong class="mtr-delta-text">${delta}</strong></div>
        <div class="mtr-popup-mid-row"><span>${t(
          "midlandDeals",
        )}</span><strong>${deals}</strong></div>
      </div>`;
    }
    return `<div class="mtr-popup">
      <div class="mtr-popup-kicker">${t("mtrPopupTitle")}</div>
      <strong>${name || "—"}</strong>
      ${alt ? `<div class="mtr-popup-alt">${alt}</div>` : ""}
      ${
        lines
          ? `<div class="mtr-popup-lines"><span class="mtr-popup-label">${t(
              "mtrLines",
            )}</span> ${lines}</div>`
          : ""
      }
      ${midlandBlock}
    </div>`;
  }

  function setBasemap() {
    if (!window.L || !leafletMap) return;
    if (basemapLayer) {
      leafletMap.removeLayer(basemapLayer);
      basemapLayer = null;
    }
    basemapLayer = L.tileLayer(OSM_BASEMAP.url, OSM_BASEMAP.options).addTo(
      leafletMap,
    );
  }

  function addMtrMarkers(bbox) {
    if (!window.L || !leafletMap || !mtrStationsGeo) return 0;
    if (mtrLayerGroup) {
      leafletMap.removeLayer(mtrLayerGroup);
      mtrLayerGroup = null;
    }
    const showMtr = mapLayerPrefs.mtr || mapLayerPrefs.midland;
    if (!showMtr) return 0;

    const showDeltas = mapLayerPrefs.midland;
    const features = (mtrStationsGeo.features || [])
      .filter((f) => {
        const c = f.geometry?.coordinates;
        return Array.isArray(c) && pointInBbox(c, bbox);
      })
      .map((f) => {
        const props = { ...(f.properties || {}) };
        const mid = midlandLookup(props.stationCode);
        if (mid) props.midland = mid;
        return { ...f, properties: props };
      });
    if (!features.length) return 0;

    if (!leafletMap.getPane("mtrPane")) {
      leafletMap.createPane("mtrPane");
      leafletMap.getPane("mtrPane").style.zIndex = 650;
    }

    mtrLayerGroup = L.layerGroup();
    for (const feature of features) {
      const coords = feature.geometry?.coordinates;
      if (!Array.isArray(coords)) continue;
      const latlng = L.latLng(coords[1], coords[0]);
      const mid = feature.properties?.midland;
      let layer;
      const psfLabel =
        showDeltas && mid ? formatMidlandPsfMarker(mid.avgPsf) : null;
      if (psfLabel) {
        const dir = midlandDeltaDir(mid);
        layer = L.marker(latlng, {
          pane: "mtrPane",
          icon: L.divIcon({
            className: "mtr-delta-icon",
            html: `<div class="mtr-delta-marker mtr-delta-${dir}"><span class="mtr-delta-dot"></span><span class="mtr-delta-pct">${psfLabel}</span></div>`,
            iconSize: [68, 22],
            iconAnchor: [12, 11],
          }),
        });
      } else {
        layer = L.circleMarker(latlng, {
          pane: "mtrPane",
          radius: showDeltas && mid ? 7 : 6,
          color: "#0c1f24",
          weight: 1.5,
          fillColor: showDeltas ? midlandMarkerFill(mid) : "#c9832a",
          fillOpacity: 0.95,
          className: "mtr-station-marker",
        });
      }
      layer.bindPopup(mtrPopupHtml(feature.properties || {}), {
        className: "mtr-popup-wrap",
        maxWidth: 280,
      });
      mtrLayerGroup.addLayer(layer);
    }
    mtrLayerGroup.addTo(leafletMap);
    return features.length;
  }

  function schoolPopupHtml(props) {
    const name =
      locale === "zh"
        ? props.nameZh || props.nameEn
        : props.nameEn || props.nameZh;
    const alt =
      locale === "zh"
        ? props.nameEn && props.nameEn !== props.nameZh
          ? props.nameEn
          : ""
        : props.nameZh && props.nameZh !== props.nameEn
          ? props.nameZh
          : "";
    const levelLabel =
      props.level === "PRIMARY" ? t("schoolPrimary") : t("schoolSecondary");
    const district =
      locale === "zh"
        ? props.districtZh || props.districtEn
        : props.districtEn || props.districtZh;
    const finance =
      locale === "zh"
        ? props.financeZh || props.financeEn
        : props.financeEn || props.financeZh;
    return `<div class="school-popup">
      <div class="school-popup-kicker">${levelLabel}</div>
      <strong>${name || "—"}</strong>
      ${alt ? `<div class="school-popup-alt">${alt}</div>` : ""}
      <div class="school-popup-meta">${t("schoolDistrict")}: ${
        district || "—"
      } · ${t("schoolFinance")}: ${finance || "—"}</div>
    </div>`;
  }

  function addSchoolLayer(level, bbox) {
    if (!window.L || !leafletMap || !schoolsGeo) return 0;
    const isPrimary = level === "PRIMARY";
    const existing = isPrimary ? primarySchoolLayer : secondarySchoolLayer;
    if (existing) {
      leafletMap.removeLayer(existing);
      if (isPrimary) primarySchoolLayer = null;
      else secondarySchoolLayer = null;
    }
    const enabled = isPrimary ? mapLayerPrefs.primary : mapLayerPrefs.secondary;
    if (!enabled) return 0;

    const features = (schoolsGeo.features || []).filter((f) => {
      if (f.properties?.level !== level) return false;
      const c = f.geometry?.coordinates;
      return Array.isArray(c) && pointInBbox(c, bbox);
    });
    if (!features.length) return 0;

    if (!leafletMap.getPane("schoolPane")) {
      leafletMap.createPane("schoolPane");
      leafletMap.getPane("schoolPane").style.zIndex = 660;
    }

    const layer = L.geoJSON(
      { type: "FeatureCollection", features },
      {
        pane: "schoolPane",
        pointToLayer(_feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 5,
            color: "#0c1f24",
            weight: 1,
            fillColor: isPrimary ? "#2f6fed" : "#8b3a62",
            fillOpacity: 0.9,
            className: isPrimary
              ? "school-marker-primary"
              : "school-marker-secondary",
          });
        },
        onEachFeature(feature, lyr) {
          lyr.bindPopup(schoolPopupHtml(feature.properties || {}), {
            className: "school-popup-wrap",
            maxWidth: 280,
          });
        },
      },
    ).addTo(leafletMap);

    if (isPrimary) primarySchoolLayer = layer;
    else secondarySchoolLayer = layer;
    return features.length;
  }

  function featureIntersectsBbox(feature, bbox) {
    const g = feature.geometry;
    if (!g) return false;
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const ringTouches = (coords) => {
      for (const c of coords) {
        if (Array.isArray(c[0])) {
          if (ringTouches(c)) return true;
        } else {
          const [lon, lat] = c;
          if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat)
            return true;
        }
      }
      return false;
    };
    if (g.type === "Polygon" || g.type === "MultiPolygon") {
      return ringTouches(g.coordinates);
    }
    return false;
  }

  function addPoaNets(bbox) {
    if (!window.L || !leafletMap || !poaNetsGeo) return 0;
    if (poaNetsLayer) {
      leafletMap.removeLayer(poaNetsLayer);
      poaNetsLayer = null;
    }
    if (!mapLayerPrefs.poa) return 0;

    const features = (poaNetsGeo.features || []).filter((f) =>
      featureIntersectsBbox(f, bbox),
    );
    if (!features.length) return 0;

    if (!leafletMap.getPane("poaPane")) {
      leafletMap.createPane("poaPane");
      leafletMap.getPane("poaPane").style.zIndex = 450;
    }

    poaNetsLayer = L.geoJSON(
      { type: "FeatureCollection", features },
      {
        pane: "poaPane",
        style: {
          color: "#2f6fed",
          weight: 1.4,
          fillColor: "#2f6fed",
          fillOpacity: 0.08,
        },
        onEachFeature(feature, layer) {
          const p = feature.properties || {};
          const net = p.net || "—";
          const area =
            locale === "zh" ? p.areaZh || p.areaEn : p.areaEn || p.areaZh;
          layer.bindPopup(
            `<div class="school-popup"><div class="school-popup-kicker">${t(
              "layerPoaNets",
            )}</div><strong>${net}</strong>${
              area ? `<div class="school-popup-alt">${area}</div>` : ""
            }</div>`,
            { className: "school-popup-wrap", maxWidth: 280 },
          );
        },
      },
    ).addTo(leafletMap);
    return features.length;
  }

  function refreshOptionalLayers() {
    if (!leafletMap || !activeDistrictBbox) return;
    const parts = [];
    const mtrCount = addMtrMarkers(activeDistrictBbox);
    if (mtrCount) parts.push(t("mtrLoaded")(mtrCount));
    if (mapLayerPrefs.midland) parts.push(t("midlandOverlayNote"));
    const primaryCount = addSchoolLayer("PRIMARY", activeDistrictBbox);
    if (primaryCount) parts.push(t("schoolsLoaded")(primaryCount, "PRIMARY"));
    const secondaryCount = addSchoolLayer("SECONDARY", activeDistrictBbox);
    if (secondaryCount)
      parts.push(t("schoolsLoaded")(secondaryCount, "SECONDARY"));
    const poaCount = addPoaNets(activeDistrictBbox);
    if (poaCount) parts.push(t("poaLoaded")(poaCount));
    return parts;
  }

  function syncLayerToggleUi() {
    const midland = $("#toggle-midland-mtr");
    const mtr = $("#toggle-mtr-stations");
    const primary = $("#toggle-primary-schools");
    const secondary = $("#toggle-secondary-schools");
    const poa = $("#toggle-poa-nets");
    if (midland) midland.checked = mapLayerPrefs.midland;
    if (mtr) mtr.checked = mapLayerPrefs.mtr;
    if (primary) primary.checked = mapLayerPrefs.primary;
    if (secondary) secondary.checked = mapLayerPrefs.secondary;
    if (poa) poa.checked = mapLayerPrefs.poa;
  }

  async function loadDistrictMap(dcName) {
    const meta = districtsMeta?.districts?.[dcName];
    const mapEl = $("#district-leaflet");
    const buildingsMeta = $("#buildings-meta");
    clearBuildingPanel();
    buildingsMeta.textContent = t("buildingsLoading");
    syncLayerToggleUi();

    if (!window.L || !meta) {
      buildingsMeta.textContent = t("buildingsError")("map unavailable");
      return;
    }

    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      leafletLayers = null;
      selectedBuildingLayer = null;
      basemapLayer = null;
      mtrLayerGroup = null;
      primarySchoolLayer = null;
      secondarySchoolLayer = null;
      poaNetsLayer = null;
    }

    const [minLon, minLat, maxLon, maxLat] = meta.bbox;
    activeDistrictBbox = meta.bbox;
    leafletMap = L.map(mapEl, { scrollWheelZoom: true });
    setBasemap();

    const bounds = L.latLngBounds([minLat, minLon], [maxLat, maxLon]);
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

    const extras = refreshOptionalLayers() || [];
    if (extras.length) {
      buildingsMeta.textContent += ` · ${extras.join(" · ")}`;
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
    if (
      mapData &&
      districtsMeta &&
      districtsGeo &&
      mtrStationsGeo &&
      midlandMtrData &&
      schoolsGeo &&
      poaNetsGeo
    ) {
      return {
        mapData,
        districtsMeta,
        districtsGeo,
        mtrStationsGeo,
        midlandMtrData,
        schoolsGeo,
        poaNetsGeo,
      };
    }
    const [pathsRes, metaRes, geoRes, mtrRes, midlandRes, schoolsRes, poaRes] =
      await Promise.all([
        fetch("/hk-districts-paths.json"),
        fetch("/hk-districts-meta.json"),
        fetch("/hk-districts.geojson"),
        fetch("/mtr-stations.geojson"),
        fetch("/midland-mtr-jul2024.json"),
        fetch("/schools.geojson"),
        fetch("/poa-nets.geojson"),
      ]);
    if (!pathsRes.ok) throw new Error(`Map HTTP ${pathsRes.status}`);
    if (!metaRes.ok) throw new Error(`Meta HTTP ${metaRes.status}`);
    if (!geoRes.ok) throw new Error(`Geo HTTP ${geoRes.status}`);
    if (!mtrRes.ok) throw new Error(`MTR HTTP ${mtrRes.status}`);
    if (!midlandRes.ok) throw new Error(`Midland HTTP ${midlandRes.status}`);
    if (!schoolsRes.ok) throw new Error(`Schools HTTP ${schoolsRes.status}`);
    if (!poaRes.ok) throw new Error(`POA HTTP ${poaRes.status}`);
    mapData = await pathsRes.json();
    districtsMeta = await metaRes.json();
    districtsGeo = await geoRes.json();
    mtrStationsGeo = await mtrRes.json();
    midlandMtrData = await midlandRes.json();
    schoolsGeo = await schoolsRes.json();
    poaNetsGeo = await poaRes.json();
    return {
      mapData,
      districtsMeta,
      districtsGeo,
      mtrStationsGeo,
      midlandMtrData,
      schoolsGeo,
      poaNetsGeo,
    };
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

  $("#toggle-midland-mtr")?.addEventListener("change", (evt) => {
    mapLayerPrefs.midland = Boolean(evt.target.checked);
    if (!leafletMap || !activeDistrictBbox) return;
    const parts = [];
    const mtrCount = addMtrMarkers(activeDistrictBbox);
    if (mtrCount) parts.push(t("mtrLoaded")(mtrCount));
    if (mapLayerPrefs.midland) parts.push(t("midlandOverlayNote"));
    const metaEl = $("#buildings-meta");
    if (metaEl && parts.length) {
      const base = metaEl.textContent.split(" · ")[0] || metaEl.textContent;
      metaEl.textContent = [base, ...parts].filter(Boolean).join(" · ");
    }
  });

  $("#toggle-mtr-stations")?.addEventListener("change", (evt) => {
    mapLayerPrefs.mtr = Boolean(evt.target.checked);
    if (!leafletMap || !activeDistrictBbox) return;
    addMtrMarkers(activeDistrictBbox);
  });

  $("#toggle-primary-schools")?.addEventListener("change", (evt) => {
    mapLayerPrefs.primary = Boolean(evt.target.checked);
    if (!leafletMap || !activeDistrictBbox) return;
    addSchoolLayer("PRIMARY", activeDistrictBbox);
  });

  $("#toggle-secondary-schools")?.addEventListener("change", (evt) => {
    mapLayerPrefs.secondary = Boolean(evt.target.checked);
    if (!leafletMap || !activeDistrictBbox) return;
    addSchoolLayer("SECONDARY", activeDistrictBbox);
  });

  $("#toggle-poa-nets")?.addEventListener("change", (evt) => {
    mapLayerPrefs.poa = Boolean(evt.target.checked);
    if (!leafletMap || !activeDistrictBbox) return;
    addPoaNets(activeDistrictBbox);
  });

  applyI18n();
  load();
})();
