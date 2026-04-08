/* ═══════════════════════════════════════════════
   Canadian Farm Copilot — Shared Data & Utilities
   ═══════════════════════════════════════════════ */

/* ── Profile management ── */
const Profile = {
  KEY: 'farmProfile',
  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || null; } catch { return null; }
  },
  save(profile) {
    localStorage.setItem(this.KEY, JSON.stringify(profile));
  },
  requireOrRedirect() {
    const p = this.load();
    if (!p) { window.location.href = 'index.html'; return null; }
    return p;
  }
};

/* ── User identity helpers (profile + auth fallbacks) ── */
function getStoredJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function getUserContext() {
  const profile = getStoredJSON('farmProfile') || {};
  const authSession = getStoredJSON('farmCopilotAuth') || {};
  const authUser = getStoredJSON('authUser') || {};

  const fullName = [
    profile.firstName || authSession.firstName || '',
    profile.lastName || authSession.lastName || '',
  ].join(' ').trim();
  const email = profile.email || authSession.email || authUser.email || '';
  const emailPrefix = email ? email.split('@')[0] : '';
  const firstName = (profile.firstName || authSession.firstName || fullName.split(' ')[0] || emailPrefix || 'Farmer').trim();
  const regionContext = profile.province || profile.region || profile.location || 'your region';
  const farmType = profile.farmType || '';

  return { profile, firstName, fullName, email, regionContext, farmType };
}

/* ── Province & farm data ── */
const PROVINCES = [
  'Alberta','British Columbia','Manitoba','New Brunswick',
  'Newfoundland & Labrador','Nova Scotia','Ontario','P.E.I.',
  'Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon'
];

const FARM_TYPES = [
  'Grain & Oilseeds','Dairy','Beef & Livestock','Hogs & Pork',
  'Poultry','Produce / Vegetables','Fruit & Orchards','Mixed Farm',
  'Greenhouse / Controlled Environment','Specialty Crops','Forestry / Agroforestry'
];

const PAIN_POINTS = [
  'Rising input costs','Labour shortages','Access to capital',
  'Market access / prices','Climate variability','Regulatory compliance',
  'Succession planning','Technology adoption','Water access / irrigation',
  'Feed & pasture costs','Equipment costs','Rural broadband / connectivity'
];

const SIZES = [
  'Micro (under 50 acres)','Small (50–250 acres)','Medium (250–1,000 acres)',
  'Large (1,000–5,000 acres)','Enterprise (5,000+ acres)','Intensive / Specialty (any size)'
];

/* ── Province coordinates (for weather API) ── */
const PROVINCE_COORDS = {
  'Alberta':                 { lat: 53.9333, lon: -116.5765, city: 'Edmonton',        tz: 'America/Edmonton' },
  'British Columbia':        { lat: 49.2827, lon: -123.1207, city: 'Vancouver',        tz: 'America/Vancouver' },
  'Manitoba':                { lat: 49.8951, lon: -97.1384,  city: 'Winnipeg',         tz: 'America/Winnipeg' },
  'New Brunswick':           { lat: 45.9636, lon: -66.6431,  city: 'Fredericton',      tz: 'America/Moncton' },
  'Newfoundland & Labrador': { lat: 47.5615, lon: -52.7126,  city: "St. John's",       tz: 'America/St_Johns' },
  'Nova Scotia':             { lat: 44.6488, lon: -63.5752,  city: 'Halifax',           tz: 'America/Halifax' },
  'Ontario':                 { lat: 43.7001, lon: -79.4163,  city: 'Toronto',           tz: 'America/Toronto' },
  'P.E.I.':                  { lat: 46.2382, lon: -63.1311,  city: 'Charlottetown',     tz: 'America/Halifax' },
  'Quebec':                  { lat: 46.8139, lon: -71.2080,  city: 'Quebec City',       tz: 'America/Toronto' },
  'Saskatchewan':            { lat: 50.4452, lon: -104.6189, city: 'Regina',            tz: 'America/Regina' },
  'Northwest Territories':   { lat: 62.4540, lon: -114.3718, city: 'Yellowknife',       tz: 'America/Yellowknife' },
  'Nunavut':                 { lat: 63.7467, lon: -68.5170,  city: 'Iqaluit',           tz: 'America/Iqaluit' },
  'Yukon':                   { lat: 60.7212, lon: -135.0568, city: 'Whitehorse',        tz: 'America/Whitehorse' },
};

/* ── Funding programs ── */
const PROGRAMS = [
  {
    id: 1, name: 'AgriStability', category: 'Risk Management',
    desc: 'Supports producers when they experience a significant income decline. 2026 expansion now includes pasture-related feed costs in reference margins.',
    amount: 'Up to 70% of reference margin decline', deadline: 'April 30, 2026', deadlineDate: '2026-04-30',
    type: 'Federal-Provincial', provinces: 'All', match: 94, urgent: true,
    tags: ['all farms','income support','risk management','livestock','grain'],
    applyUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/agristability'
  },
  {
    id: 2, name: 'AgriMarketing Market Diversification', category: 'Market Access',
    desc: 'Announced Feb 2026. Supports Canadian ag exporters accessing new international markets and diversifying away from tariff-impacted destinations.',
    amount: 'Up to $500,000 per project', deadline: 'Rolling — apply before pool exhausted', deadlineDate: null,
    type: 'Federal', provinces: 'All', match: 78, urgent: false,
    tags: ['export','market access','trade diversification','grain','livestock'],
    applyUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/agrimarketing'
  },
  {
    id: 3, name: 'B.C. On-Farm Technology Adoption', category: 'Technology',
    desc: 'Helps B.C. farmers adopt precision agriculture technology, automation, and decision-support tools. Cost-share funding available.',
    amount: 'Up to $150,000 per farm (50% cost-share)', deadline: 'March 31, 2026', deadlineDate: '2026-03-31',
    type: 'Provincial', provinces: 'British Columbia', match: 82, urgent: true,
    tags: ['technology','automation','precision ag','B.C.'],
    applyUrl: 'https://www2.gov.bc.ca/gov/content/industry/agriculture-seafood'
  },
  {
    id: 4, name: 'Local Food Infrastructure Fund', category: 'Infrastructure',
    desc: '$30M fund to support community food infrastructure including storage, processing, and distribution for local food systems.',
    amount: '$30M national pool — project-based', deadline: 'May 31, 2026', deadlineDate: '2026-05-31',
    type: 'Federal', provinces: 'All', match: 71, urgent: false,
    tags: ['infrastructure','local food','processing','storage','produce'],
    applyUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/local-food-infrastructure-fund'
  },
  {
    id: 5, name: 'Resilient Agricultural Landscape Program', category: 'Environment',
    desc: '$14.6M Ontario program supporting practices that improve carbon sequestration, water quality, and biodiversity on agricultural land.',
    amount: 'Up to $200,000 per project', deadline: 'June 30, 2026', deadlineDate: '2026-06-30',
    type: 'Provincial', provinces: 'Ontario', match: 65, urgent: false,
    tags: ['environment','carbon','water quality','biodiversity','Ontario'],
    applyUrl: 'https://www.ontario.ca/page/resilient-agricultural-landscape-program'
  },
  {
    id: 6, name: 'Canadian Agricultural Partnership (CAP)', category: 'Capacity Building',
    desc: 'Federal-Provincial-Territorial framework supporting a wide range of farm programs including business risk management, innovation, and market development.',
    amount: 'Varies by program stream', deadline: 'Ongoing — check provincial program', deadlineDate: null,
    type: 'Federal-Provincial-Territorial', provinces: 'All', match: 88, urgent: false,
    tags: ['BRM','innovation','market development','all farms'],
    applyUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/canadian-agricultural-partnership'
  },
  {
    id: 7, name: 'AgriInnovate', category: 'Innovation',
    desc: 'Repayable contribution for the commercialization, adoption or adaptation of innovative agri-based products, technologies, processes and services.',
    amount: 'Up to $10M per project (repayable)', deadline: 'Rolling intake', deadlineDate: null,
    type: 'Federal', provinces: 'All', match: 60, urgent: false,
    tags: ['innovation','commercialization','technology','startup'],
    applyUrl: 'https://agriculture.canada.ca/en/agricultural-programs-and-services/agriinnovate'
  },
  {
    id: 8, name: 'NRC-IRAP Agriculture Stream', category: 'R&D',
    desc: 'Industrial Research Assistance Program offers advisory services and funding for SMEs developing or adopting new agricultural technologies.',
    amount: 'Up to $50,000 advisory / $500K project', deadline: 'Rolling', deadlineDate: null,
    type: 'Federal', provinces: 'All', match: 55, urgent: false,
    tags: ['R&D','SME','technology','innovation','advisory'],
    applyUrl: 'https://nrc.canada.ca/en/support-technology-innovation/nrc-industrial-research-assistance-program'
  }
];

/* ── Seasonal checklists ── */
const SPRING_CHECKLIST = [
  'File AgriStability enrollment before April 30 deadline',
  'Review crop input contracts and confirm delivery schedules',
  'Inspect and service all seeding equipment',
  'Test soil samples from priority fields — book lab now',
  'Confirm seed treatment protocols with agronomist',
  'Review crop insurance coverage with broker',
  'Update field records and production maps',
  'Check spring drainage and tile systems',
  'Schedule pre-plant herbicide and fertility applications',
  'Review labour agreements and hiring plan for season',
  'Run ROI analysis on any planned technology investments',
  'Confirm grain contracts and elevator relationships',
];

/* ── Suggested Copilot questions ── */
const SUGGESTED_QUESTIONS = [
  'Am I eligible for AgriStability this year?',
  'What is the ROI on an autonomous grain cart?',
  'How do I diversify my grain markets away from the US?',
  'What are the best practices for spring cash flow management?',
  'Compare AgriMarketing and AgriInnovate for my operation',
  'What wildfire or flood risks should I monitor this season?',
];

const ENV_SUGGESTED_QUESTIONS = [
  'What wildfire risk is near my region this week?',
  'Show schools within current watch zones in Ontario',
  'What actions should municipalities take in this alert area?',
  'Summarize current flood risk for Ontario communities',
  'Draft a public advisory for this flood watch',
  'Explain the current smoke advisory in simple terms',
  'What is the risk outlook for the next 72 hours?',
];

/* ── Environmental hazard events (seeded, March 2026) ── */
const ENV_HAZARDS = [
  {
    id: 'ev001',
    type: 'wildfire',
    severity: 'elevated',
    title: 'Elevated Wildfire Risk — Lac La Biche Region',
    location: 'Lac La Biche, Alberta',
    region: 'Alberta',
    lat: 54.77, lon: -111.97,
    summary: 'Dry conditions and below-normal snowpack have elevated fire weather indices across northeastern Alberta. Several thermal anomalies detected within 35 km.',
    detail: 'Hot, dry, and windy conditions have created elevated fire weather conditions across the Lac La Biche Forest Area. The Canadian Forest Fire Danger Rating System (CFDRS) Fire Weather Index (FWI) is sitting at 18–22, classified as High. Snowpack in the region is 45% of normal for this time of year.',
    confidence: 'Moderate',
    sources: ['Canadian Wildland Fire Information System', 'Environment and Climate Change Canada'],
    freshness: 14,
    affectedCommunities: ['Lac La Biche', 'Bonnyville', 'Cold Lake'],
    schoolsInZone: 7,
    hospitalsInZone: 2,
    recommendedAction: 'Ensure emergency go-bags are ready. Review local evacuation routes. Monitor CWFIS and local emergency management social media.',
    trend: 'worsening',
    isOfficial: false,
    timestamp: '2026-03-23T08:30:00Z',
    icon: '🔥',
    color: '#e67e22',
  },
  {
    id: 'ev002',
    type: 'flood',
    severity: 'watch',
    title: 'Spring Flood Watch — Ottawa River Valley',
    location: 'Ottawa-Gatineau Metro Area, Ontario/Quebec',
    region: 'Ontario',
    lat: 45.42, lon: -75.69,
    summary: 'Heavy rainfall on saturated soils combined with snowmelt creates elevated flood risk along the Ottawa River and tributaries. Watch in effect.',
    detail: 'A combination of above-normal precipitation over the past 3 weeks and warm temperatures accelerating snowmelt have elevated streamflow indicators across the Ottawa River watershed. Ottawa River at the Britannia gauge is at 88th percentile for this date. Flood stage is approximately 15% above current level. NCC shoreline parks and low-lying areas are under advisory.',
    confidence: 'High',
    sources: ['Water Survey of Canada', 'Environment and Climate Change Canada'],
    freshness: 8,
    affectedCommunities: ['Ottawa', 'Gatineau', 'Rockland', 'Hawkesbury', 'Plantagenet'],
    schoolsInZone: 12,
    hospitalsInZone: 4,
    recommendedAction: 'Avoid low-lying areas along river shores. Move valuable items to higher ground. Monitor official gauging stations and ECCC flood bulletins.',
    trend: 'stable',
    isOfficial: true,
    timestamp: '2026-03-23T06:15:00Z',
    icon: '🌊',
    color: '#2980b9',
  },
  {
    id: 'ev003',
    type: 'storm',
    severity: 'warning',
    title: 'Severe Weather Warning — Southern Ontario',
    location: 'GTA and Golden Horseshoe, Ontario',
    region: 'Ontario',
    lat: 43.70, lon: -79.42,
    summary: 'A rapidly deepening low pressure system will bring 60–80 mm of rain and wind gusts up to 90 km/h to the Golden Horseshoe by tonight.',
    detail: 'Environment and Climate Change Canada has issued a Severe Thunderstorm Watch for the Greater Toronto Area and surrounding regions. A cut-off low is expected to intensify as it tracks northeast, with the most severe conditions expected between 18:00–02:00 EDT. Areas south of the Niagara Escarpment face the greatest risk. Power outages and localized flooding of low-lying roads are possible.',
    confidence: 'High',
    sources: ['Environment and Climate Change Canada', 'Storm Prediction Centre'],
    freshness: 3,
    affectedCommunities: ['Toronto', 'Mississauga', 'Hamilton', 'Burlington', 'Niagara Falls', 'St. Catharines'],
    schoolsInZone: 31,
    hospitalsInZone: 11,
    recommendedAction: 'Secure loose outdoor items. Avoid unnecessary travel tonight. Charge devices and prepare for possible power disruption. Stay indoors during the heaviest rain band.',
    trend: 'worsening',
    isOfficial: true,
    timestamp: '2026-03-23T10:45:00Z',
    icon: '⛈',
    color: '#8e44ad',
  },
  {
    id: 'ev004',
    type: 'smoke',
    severity: 'advisory',
    title: 'Air Quality Advisory — BC Interior',
    location: 'Kamloops–Kelowna Corridor, British Columbia',
    region: 'British Columbia',
    lat: 50.67, lon: -120.33,
    summary: 'Smoke from early-season agricultural burns and a small active fire near Chase is reducing air quality. AQHI readings of 4–6 (Moderate to High Risk).',
    detail: 'A combination of smoke from agricultural burns in the Fraser Valley and residual fire smoke from the Chase fire complex has produced Air Quality Health Index (AQHI) readings of 4–6 across the Thompson Okanagan. Light winds are expected to keep smoke in place through Thursday. Sensitive groups including children, elderly, and those with respiratory conditions should reduce outdoor exertion.',
    confidence: 'Moderate',
    sources: ['BC Wildfire Service', 'Metro Vancouver Air Quality'],
    freshness: 22,
    affectedCommunities: ['Kamloops', 'Kelowna', 'Vernon', 'Salmon Arm', 'Chase'],
    schoolsInZone: 18,
    hospitalsInZone: 3,
    recommendedAction: 'Sensitive groups should remain indoors with windows closed. Keep an eye on AQHI readings via airnow.ca. Cancel outdoor sporting events if AQHI exceeds 7.',
    trend: 'improving',
    isOfficial: false,
    timestamp: '2026-03-22T20:00:00Z',
    icon: '💨',
    color: '#7f8c8d',
  },
  {
    id: 'ev005',
    type: 'cold',
    severity: 'warning',
    title: 'Extreme Cold Warning — Northern Manitoba',
    location: 'Thompson–The Pas Region, Manitoba',
    region: 'Manitoba',
    lat: 55.74, lon: -97.85,
    summary: 'Wind chill values of −45 to −52°C are forecast for northern Manitoba through Tuesday. Outdoor exposure risk is severe for unprotected skin.',
    detail: 'A deep Arctic high-pressure system has settled over the Hudson Bay Lowlands. Wind chill values in the Thompson region reached −48°C early this morning. ECCC has issued an Extreme Cold Warning. Frostbite can develop on exposed skin in under 10 minutes under current conditions. Travel is strongly discouraged unless absolutely necessary.',
    confidence: 'High',
    sources: ['Environment and Climate Change Canada'],
    freshness: 5,
    affectedCommunities: ['Thompson', 'The Pas', 'Flin Flon', 'Snow Lake'],
    schoolsInZone: 6,
    hospitalsInZone: 2,
    recommendedAction: 'Limit time outdoors. Cover all exposed skin. Check on elderly neighbours and those without adequate shelter. If you must travel, ensure vehicle emergency kit is stocked.',
    trend: 'stable',
    isOfficial: true,
    timestamp: '2026-03-23T04:00:00Z',
    icon: '🥶',
    color: '#5dade2',
  },
  {
    id: 'ev006',
    type: 'flood',
    severity: 'watch',
    title: 'Red River Spring Flood Watch',
    location: 'Red River Valley, Manitoba',
    region: 'Manitoba',
    lat: 49.80, lon: -97.15,
    summary: 'Snowpack in North Dakota and South Dakota is above normal. Early projections suggest a moderate spring flood event on the Red River. Watch issued.',
    detail: 'The Red River Basin in North Dakota has received 125–145% of normal snowfall this winter. With temperature forecasts showing above-normal warmth for late March and April, upstream snowmelt volumes are expected to exceed the baseline threshold for a moderate flood (1.5–2.5x return period). Dikes protecting Winnipeg are in place and emergency protocols are on standby.',
    confidence: 'Moderate',
    sources: ['Manitoba Flood Forecast Centre', 'US Army Corps of Engineers'],
    freshness: 60,
    affectedCommunities: ['Winnipeg', 'Selkirk', 'Emerson', 'Morris', 'St. Adolphe'],
    schoolsInZone: 9,
    hospitalsInZone: 3,
    recommendedAction: 'Ensure sump pumps are operational. Review your flood insurance coverage. Follow City of Winnipeg and Province of Manitoba flood advisory updates.',
    trend: 'worsening',
    isOfficial: false,
    timestamp: '2026-03-22T12:00:00Z',
    icon: '🌊',
    color: '#2980b9',
  },
];

/* ── Regional risk scores ── */
const REGIONAL_RISK = {
  'Alberta':          { score: 72, primary: 'wildfire',  secondary: 'drought',  trend: 'worsening' },
  'British Columbia': { score: 58, primary: 'smoke',     secondary: 'wildfire', trend: 'improving' },
  'Manitoba':         { score: 65, primary: 'flood',     secondary: 'cold',     trend: 'worsening' },
  'Ontario':          { score: 63, primary: 'storm',     secondary: 'flood',    trend: 'stable'    },
  'Quebec':           { score: 41, primary: 'flood',     secondary: 'storm',    trend: 'stable'    },
  'Saskatchewan':     { score: 44, primary: 'drought',   secondary: 'frost',    trend: 'improving' },
  'New Brunswick':    { score: 32, primary: 'storm',     secondary: 'flood',    trend: 'stable'    },
  'Nova Scotia':      { score: 37, primary: 'storm',     secondary: 'coastal',  trend: 'stable'    },
};

/* ── Hazard trend data (30 days, for Chart.js) ── */
const HAZARD_TREND_30D = {
  labels: Array.from({length: 30}, (_, i) => {
    const d = new Date('2026-02-22'); d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  }),
  wildfire: [1,1,2,1,0,0,1,2,3,3,2,2,3,4,4,3,4,5,5,6,6,5,5,6,7,7,6,7,7,8],
  flood:    [0,0,1,1,2,2,1,1,2,2,3,3,2,2,3,4,4,3,4,4,5,5,4,4,5,5,6,6,5,6],
  storm:    [2,3,1,0,1,2,3,2,1,2,1,0,1,2,3,4,3,2,1,2,3,4,3,2,3,4,5,4,3,4],
  smoke:    [0,0,0,1,1,2,2,1,1,2,2,2,1,1,2,2,3,3,2,2,3,3,2,2,3,3,2,2,3,3],
  cold:     [5,5,4,4,3,3,4,4,3,3,2,2,3,3,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1],
};

/* ── Weather data per province ── */
/* ── Weather + agronomy helpers ── */
const WEATHER_BY_PROVINCE = {
  'Alberta':          { m: 'March', high: 6,  low: -8,  cond: 'Partly cloudy', icon: '⛅' },
  'British Columbia': { m: 'March', high: 11, low: 4,   cond: 'Light rain',    icon: '🌧' },
  'Manitoba':         { m: 'March', high: -4, low: -16, cond: 'Mainly clear',  icon: '☀️' },
  'New Brunswick':    { m: 'March', high: 3,  low: -5,  cond: 'Overcast',      icon: '☁️' },
  'Newfoundland & Labrador': { m: 'March', high: 0, low: -9, cond: 'Light snow', icon: '🌨' },
  'Nova Scotia':      { m: 'March', high: 5,  low: -3,  cond: 'Rain showers',  icon: '🌦' },
  'Ontario':          { m: 'March', high: 8,  low: -2,  cond: 'Mostly cloudy', icon: '☁️' },
  'P.E.I.':           { m: 'March', high: 3,  low: -6,  cond: 'Flurries',      icon: '🌨' },
  'Quebec':           { m: 'March', high: 2,  low: -9,  cond: 'Partly cloudy', icon: '⛅' },
  'Saskatchewan':     { m: 'March', high: 2,  low: -13, cond: 'Clear',         icon: '☀️' },
  'Northwest Territories': { m: 'March', high: -15, low: -30, cond: 'Clear cold', icon: '🌬' },
  'Nunavut':          { m: 'March', high: -23, low: -38, cond: 'Clear arctic', icon: '❄️' },
  'Yukon':            { m: 'March', high: -8, low: -22, cond: 'Clear',         icon: '☀️' },
};

const FROST_DATA = {
  'Ontario': { lastSpring: 'May 9–20', firstFall: 'Sep 28–Oct 10' },
  'Quebec': { lastSpring: 'May 12–24', firstFall: 'Sep 20–Oct 5' },
  'British Columbia': { lastSpring: 'Apr 1–25', firstFall: 'Oct 20–Nov 10' },
  'Alberta': { lastSpring: 'May 20–Jun 5', firstFall: 'Sep 5–20' },
  'Manitoba': { lastSpring: 'May 15–30', firstFall: 'Sep 10–25' },
  'Saskatchewan': { lastSpring: 'May 20–Jun 5', firstFall: 'Sep 5–20' },
  'default': { lastSpring: 'Varies by region', firstFall: 'Varies by region' }
};

const PROVINCE_SEASONS = {
  'Alberta': 'Prairie short-season window',
  'British Columbia': 'Coastal / interior split season',
  'Manitoba': 'Prairie continental season',
  'New Brunswick': 'Atlantic cool season',
  'Newfoundland & Labrador': 'Atlantic short season',
  'Nova Scotia': 'Atlantic moderate season',
  'Ontario': 'Mixed temperate growing season',
  'P.E.I.': 'Atlantic potato / field crop season',
  'Quebec': 'Short-to-medium temperate season',
  'Saskatchewan': 'Prairie seeding season',
  'Northwest Territories': 'Northern short growing season',
  'Nunavut': 'Arctic protected growing season',
  'Yukon': 'Northern short growing season'
};

function getCropCalendar(province) {
  const calendars = {
    'Ontario': {
      planting: 'Apr–Jun',
      harvest: 'Aug–Nov',
      notes: 'Corn, soy, wheat, vegetables and mixed horticulture windows.'
    },
    'British Columbia': {
      planting: 'Feb–May',
      harvest: 'Jun–Oct',
      notes: 'Coastal and interior timelines vary widely by crop.'
    },
    'Alberta': {
      planting: 'Apr–Jun',
      harvest: 'Aug–Oct',
      notes: 'Strong focus on cereals, canola and forage.'
    },
    'Manitoba': {
      planting: 'Apr–Jun',
      harvest: 'Aug–Oct',
      notes: 'Prairie annual crop timing with flood-watch sensitivity.'
    },
    'default': {
      planting: 'Varies by region',
      harvest: 'Varies by crop',
      notes: 'Refer to local agronomy guidance.'
    }
  };

  return calendars[province] || calendars.default;
}

function getCurrentMonthWeather(province) {
  return WEATHER_BY_PROVINCE[province] || WEATHER_BY_PROVINCE['Ontario'];
}

function getCurrentSeasonCrops(province) {
  const crops = {
    'Alberta':          { season: 'Pre-season prep', crops: ['Canola', 'Spring Wheat', 'Barley', 'Oats'] },
    'British Columbia': { season: 'Early spring', crops: ['Potatoes', 'Vegetables', 'Berries', 'Tree Fruits'] },
    'Manitoba':         { season: 'Pre-season', crops: ['Wheat', 'Canola', 'Flaxseed', 'Soybeans'] },
    'Ontario':          { season: 'Pre-plant', crops: ['Soybeans', 'Corn', 'Winter Wheat', 'Vegetables'] },
    'Quebec':           { season: 'Pre-season', crops: ['Corn', 'Soybeans', 'Potatoes', 'Vegetables'] },
    'Saskatchewan':     { season: 'Pre-seeding', crops: ['Wheat', 'Canola', 'Lentils', 'Peas'] },
    'default':          { season: 'Early spring', crops: ['Cereals', 'Oilseeds', 'Vegetables', 'Forage'] }
  };

  return crops[province] || crops.default;
}

function getWMO(code) {
  const map = {
    0: { label: 'Clear sky', icon: '☀️' },
    1: { label: 'Mainly clear', icon: '🌤️' },
    2: { label: 'Partly cloudy', icon: '⛅' },
    3: { label: 'Overcast', icon: '☁️' },
    45: { label: 'Fog', icon: '🌫️' },
    48: { label: 'Rime fog', icon: '🌫️' },
    51: { label: 'Light drizzle', icon: '🌦️' },
    53: { label: 'Moderate drizzle', icon: '🌦️' },
    55: { label: 'Dense drizzle', icon: '🌧️' },
    61: { label: 'Slight rain', icon: '🌧️' },
    63: { label: 'Moderate rain', icon: '🌧️' },
    65: { label: 'Heavy rain', icon: '🌧️' },
    66: { label: 'Freezing rain', icon: '🧊' },
    67: { label: 'Heavy freezing rain', icon: '🧊' },
    71: { label: 'Slight snow', icon: '🌨️' },
    73: { label: 'Moderate snow', icon: '❄️' },
    75: { label: 'Heavy snow', icon: '❄️' },
    80: { label: 'Rain showers', icon: '🌦️' },
    81: { label: 'Heavy rain showers', icon: '🌧️' },
    82: { label: 'Violent rain showers', icon: '⛈️' },
    95: { label: 'Thunderstorm', icon: '⛈️' },
    96: { label: 'Thunderstorm with hail', icon: '⛈️' },
    99: { label: 'Severe hailstorm', icon: '⛈️' }
  };

  return map[code] || { label: 'Unknown', icon: '🌤️' };
}

function weatherCacheKey(province) {
  return `weatherCache:${province}`;
}

async function loadProvinceWeather(province) {
  const coords = PROVINCE_COORDS[province] || PROVINCE_COORDS['Ontario'];
  const fallback = getCurrentMonthWeather(province);

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&forecast_days=7&timezone=auto`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);

    const data = await res.json();
    const wmo = getWMO(data.current.weather_code);

    const normalized = {
      province,
      city: coords.city,
      timezone: coords.tz,
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        wind: data.current.wind_speed_10m,
        code: data.current.weather_code,
        label: wmo.label,
        icon: wmo.icon
      },
      daily: {
        max: data.daily.temperature_2m_max || [],
        min: data.daily.temperature_2m_min || [],
        precipitationProbability: data.daily.precipitation_probability_max || []
      },
      agronomy: {
        season: PROVINCE_SEASONS[province] || PROVINCE_SEASONS['Ontario'],
        cropCalendar: getCropCalendar(province),
        frost: FROST_DATA[province] || FROST_DATA.default
      },
      updatedAt: new Date().toISOString(),
      updatedLabel: 'just now'
    };

    localStorage.setItem(weatherCacheKey(province), JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    const cached = localStorage.getItem(weatherCacheKey(province));
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.updatedLabel = 'from cache';
      return parsed;
    }

    return {
      province,
      city: coords.city,
      timezone: coords.tz,
      current: {
        temperature: fallback.high,
        humidity: null,
        precipitation: null,
        wind: null,
        code: null,
        label: fallback.cond,
        icon: fallback.icon
      },
      daily: {
        max: [fallback.high],
        min: [fallback.low],
        precipitationProbability: []
      },
      agronomy: {
        season: PROVINCE_SEASONS[province] || PROVINCE_SEASONS['Ontario'],
        cropCalendar: getCropCalendar(province),
        frost: FROST_DATA[province] || FROST_DATA.default
      },
      updatedAt: null,
      updatedLabel: 'fallback data'
    };
  }
}

/* ── Utility: days until deadline ── */
function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today  = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.round((target - today) / 86400000);
  return diff;
}

/* ── Utility: time ago ── */
function timeAgo(isoStr) {
  const diff = (Date.now() - new Date(isoStr)) / 60000;
  if (diff < 60)   return `${Math.round(diff)}m ago`;
  if (diff < 1440) return `${Math.round(diff/60)}h ago`;
  return `${Math.round(diff/1440)}d ago`;
}

/* ── Sidebar renderer ── */
function renderSidebar(active) {
  const navItems = [
    { key: 'dashboard',    href: 'dashboard.html',    icon: '▦',  label: 'Dashboard'     },
    { key: 'copilot',      href: 'copilot.html',      icon: '✦',  label: 'AI Copilot'    },
    { key: 'funding',      href: 'funding.html',      icon: '◈',  label: 'Funding'       },
    { key: 'weather',      href: 'weather.html',      icon: '🌤', label: 'Weather'       },
    { key: 'calculator',   href: 'calculator.html',   icon: '◎',  label: 'Calculator'    },
    { key: 'planner',      href: 'planner.html',      icon: '📅', label: 'Planner'       },
  ];
  const envItems = [
    { key: 'risk-monitor', href: 'risk-monitor.html', icon: '🛡', label: 'Risk Monitor',   badge: '6', badgeClass: 'red'  },
  ];
  const botItems = [
    { key: 'pricing',      href: 'pricing.html',      icon: '💳', label: 'Plans & Pricing' },
    { key: 'support',      href: 'support.html',      icon: '💬', label: 'Support'         },
  ];

  function renderItem(item) {
    const isActive = item.key === active;
    const badge = item.badge ? `<span class="sidebar-badge ${item.badgeClass || 'amber'}">${item.badge}</span>` : '';
    return `<a href="${item.href}" class="sidebar-link ${isActive ? 'active' : ''}">
      <span class="sidebar-link-icon">${item.icon}</span>
      ${item.label}
      ${badge}
    </a>`;
  }

  const profile = Profile.load();
  const farmLabel = profile ? `${profile.farmType} · ${profile.province}` : 'Setup required';

  return `
  <nav class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-name"><div class="sidebar-logo-dot"></div>Farm Copilot</div>
      <div class="sidebar-logo-sub">${farmLabel}</div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-label">Farm Intelligence</div>
      ${navItems.map(renderItem).join('')}
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-label">Environmental Risk</div>
      ${envItems.map(renderItem).join('')}
    </div>
    <div class="sidebar-section">
      ${botItems.map(renderItem).join('')}
    </div>
    <div class="sidebar-foot">
      Canadian Farm Copilot<br>
      2025–2026 Programs · Canada-focused<br>
      © VedhaAI.ca
    </div>
  </nav>`;
}

/* ── Demo mode helpers ── */
function activateDemoMode() {
  const real = Profile.load();
  if (real) localStorage.setItem('preDemo', JSON.stringify(real));
  Profile.save({
    province: 'Ontario',
    farmType: 'Produce / Vegetables',
    painPoints: ['Labour shortages', 'Rising input costs'],
    size: 'Medium (250–1,000 acres)',
  });
  window.location.href = 'dashboard.html';
}

function exitDemoMode() {
  const real = localStorage.getItem('preDemo');
  if (real) { Profile.save(JSON.parse(real)); localStorage.removeItem('preDemo'); }
  window.location.href = 'dashboard.html';
}
