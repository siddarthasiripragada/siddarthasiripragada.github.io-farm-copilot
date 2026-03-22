/* ============================================================
   CANADIAN FARM COPILOT — Shared Data & Utilities
   ============================================================ */

/* ── Profile helpers ─────────────────────────────────────── */
const Profile = {
  save(data) { localStorage.setItem('farmProfile', JSON.stringify(data)); },
  load() {
    try { return JSON.parse(localStorage.getItem('farmProfile')); }
    catch { return null; }
  },
  clear() { localStorage.removeItem('farmProfile'); },
  requireOrRedirect() {
    const p = Profile.load();
    if (!p) { window.location.href = 'index.html'; return null; }
    return p;
  }
};

/* ── Static data ─────────────────────────────────────── */
const PROVINCES = [
  "Alberta","British Columbia","Manitoba","New Brunswick",
  "Newfoundland & Labrador","Nova Scotia","Ontario","P.E.I.","Quebec","Saskatchewan"
];

const FARM_TYPES = [
  "Grain & Oilseeds","Dairy","Livestock","Produce / Vegetables",
  "Greenhouse","Specialty Crops","Mixed Farm","Aquaculture","Poultry"
];

const PAIN_POINTS = [
  "Labour Shortage","Rising Input Costs","Feed / Pasture Costs",
  "Market Access","Technology Adoption","Funding Discovery","Cash Flow","Compliance & Paperwork"
];

const SIZES = [
  "Small (< 100 acres / < 50 head)",
  "Medium (100–500 acres / 50–200 head)",
  "Large (500+ acres / 200+ head)",
  "Commercial / Corporate scale"
];

const PROGRAMS = [
  {
    id: 1, name: "AgriStability", category: "Risk Management",
    provinces: "All", type: "Federal-Provincial",
    amount: "Up to 70% of margin loss", deadline: "Apr 30, 2026",
    deadlineDate: "2026-04-30", match: 95, urgent: true,
    tags: ["income stabilization","all farm types","risk"],
    desc: "Provides support when a producer's allowable net sales margin falls more than 30% below their reference margin. Expanded in February 2026 to include pasture-related feed costs as an allowable expense.",
    applyUrl: "https://agriculture.canada.ca/en/programs/agristability"
  },
  {
    id: 2, name: "AgriMarketing – Market Diversification", category: "Market Access",
    provinces: "All", type: "Federal",
    amount: "Up to $500,000", deadline: "Rolling",
    deadlineDate: null, match: 88, urgent: false,
    tags: ["export","market diversification","2026"],
    desc: "New stream announced February 2026. Supports Canadian agri-food exporters in accessing new international markets amid global trade instability and increasing risks from trade barriers and tariffs.",
    applyUrl: "https://agriculture.canada.ca/en/programs/agrimarketing"
  },
  {
    id: 3, name: "B.C. On-Farm Technology Adoption", category: "Technology",
    provinces: "British Columbia", type: "Provincial",
    amount: "Up to $100,000", deadline: "Jun 15, 2026",
    deadlineDate: "2026-06-15", match: 74, urgent: false,
    tags: ["technology","labour","automation","BC"],
    desc: "Funds technology solutions that directly address labour shortages and improve labour-intensive farm processes. Covers planning, equipment purchase, installation, and integration costs.",
    applyUrl: "#"
  },
  {
    id: 4, name: "Local Food Infrastructure Fund", category: "Food Security",
    provinces: "All", type: "Federal",
    amount: "$30M total pool (2026)", deadline: "May 31, 2026",
    deadlineDate: "2026-05-31", match: 67, urgent: false,
    tags: ["food security","local food","infrastructure","community"],
    desc: "Announced 2026. Up to $30M supporting projects that strengthen community food security, local food supply chains, and access to fresh food in communities across Canada.",
    applyUrl: "https://agriculture.canada.ca/en/programs/local-food-infrastructure-fund"
  },
  {
    id: 5, name: "Resilient Agricultural Landscape Program", category: "Resilience",
    provinces: "Ontario", type: "Federal-Provincial",
    amount: "$14.6M pool (Ontario)", deadline: "Mar 31, 2026",
    deadlineDate: "2026-03-31", match: 80, urgent: false,
    tags: ["farmland","resilience","Ontario","environment","land"],
    desc: "Canada-Ontario partnership announced 2025. Supports farmland improvements, land stewardship, and long-term agricultural resilience including wetland restoration and beneficial management practices.",
    applyUrl: "#"
  },
  {
    id: 6, name: "Canadian Agricultural Partnership (CAP)", category: "General Support",
    provinces: "All", type: "Federal-Provincial-Territorial",
    amount: "Varies by province & stream", deadline: "Ongoing",
    deadlineDate: null, match: 92, urgent: false,
    tags: ["capacity","all farm types","general","innovation","supply chain"],
    desc: "The overarching federal-provincial-territorial program framework delivering support across farm business risk management, innovation, agri-food supply chains, and market development for all farm types.",
    applyUrl: "https://agriculture.canada.ca/en/programs/canadian-agricultural-partnership"
  },
  {
    id: 7, name: "AgriInnovate", category: "Innovation",
    provinces: "All", type: "Federal",
    amount: "Up to $10M per project", deadline: "Rolling",
    deadlineDate: null, match: 58, urgent: false,
    tags: ["innovation","technology","scale-up","R&D","commercialization"],
    desc: "Accelerates the commercialization and adoption of innovative agri-food products, processes, and services in Canada. Supports projects that improve competitiveness and productivity.",
    applyUrl: "https://agriculture.canada.ca/en/programs/agriinnovate"
  },
  {
    id: 8, name: "NRC-IRAP Agriculture Stream", category: "R&D",
    provinces: "All", type: "Federal",
    amount: "$50K – $500K", deadline: "Rolling",
    deadlineDate: null, match: 53, urgent: false,
    tags: ["R&D","SME","innovation","prototype","tech development"],
    desc: "National Research Council Industrial Research Assistance Program support for SMEs developing or adopting innovative technologies in agriculture, food processing, agri-tech, and related sectors.",
    applyUrl: "https://nrc.canada.ca/en/support-technology-innovation/nrc-industrial-research-assistance-program"
  }
];

const SPRING_CHECKLIST = [
  "Submit AgriStability enrollment before April 30 deadline",
  "Review and update farm insurance and asset coverage",
  "Service, calibrate, and inspect all planting equipment",
  "Confirm seed orders, genetics, and delivery schedule",
  "Review seasonal labour contracts and staffing plan",
  "Check and test irrigation system components",
  "Update farm input cost budget for the season",
  "File weather damage or business disruption reports if applicable",
  "Review crop rotation plan and soil nutrient assessments",
  "Register for local extension service spring programming",
  "Research new technology adoption funding programs",
  "Prepare documentation for any pending grant applications",
];

const SUGGESTED_QUESTIONS = [
  "What funding programs apply to my farm in Ontario?",
  "Should I invest in automated packing this season?",
  "Explain AgriStability in plain language",
  "What labour-saving technologies qualify for funding?",
  "Give me a spring planting checklist",
  "How do pasture feed costs affect AgriStability?",
];

/* ── Sidebar renderer ─────────────────────────────────────── */
function renderSidebar(activePage) {
  const profile = Profile.load();
  const farmName = profile ? profile.farmType : 'Your Farm';
  const location = profile ? `${profile.province}` : '';
  const sizeShort = profile && profile.size ? profile.size.split('(')[0].trim() : '';

  const navItems = [
    { id: 'dashboard',   href: 'dashboard.html',   icon: '⊞', label: 'Dashboard',          badge: null },
    { id: 'copilot',     href: 'copilot.html',     icon: '✦', label: 'AI Copilot',          badge: null },
    { id: 'funding',     href: 'funding.html',     icon: '◈', label: 'Funding Navigator',   badge: '8' },
    { id: 'calculator',  href: 'calculator.html',  icon: '◎', label: 'ROI Calculator',      badge: null },
    { id: 'planner',     href: 'planner.html',     icon: '▦', label: 'Operations Planner',  badge: null },
  ];

  return `
    <aside class="sidebar">
      <div class="sb-brand">
        <div class="sb-brand-tag">Canadian Farm Copilot</div>
        <h1>Farm<br>Copilot</h1>
      </div>
      ${profile ? `
      <div class="sb-farm">
        <div class="sb-farm-name">${farmName}</div>
        <div class="sb-farm-meta">${location}${sizeShort ? ' · ' + sizeShort : ''}</div>
      </div>` : ''}
      <nav class="sb-nav">
        <div class="sb-section">Platform</div>
        ${navItems.map(item => `
          <a href="${item.href}" class="nav-link ${activePage === item.id ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            ${item.label}
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
          </a>
        `).join('')}
      </nav>
      <div class="sb-footer">
        <div class="sb-version">v1.0 · MVP · 2026</div>
        <button class="sb-reset-btn" onclick="Profile.clear(); window.location.href='index.html'">
          ↺ Reset Profile
        </button>
      </div>
    </aside>
  `;
}

/* ── Format helpers ─────────────────────────────────────── */
function fmtCAD(n) {
  if (isNaN(n)) return '$—';
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
}

function fmtNum(n, decimals = 1) {
  if (isNaN(n) || !isFinite(n)) return '—';
  return Number(n).toFixed(decimals);
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ── Mobile Navigation — appended (no existing lines changed) ── */

window.toggleSidebar = function () {
  document.body.classList.toggle('sb-open');
};

window.closeSidebar = function () {
  document.body.classList.remove('sb-open');
};

/* Inject mobile topbar + overlay after the sidebar is mounted */
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return; // onboarding page — no sidebar needed

  /* ── Mobile topbar ── */
  if (!document.getElementById('mobile-topbar')) {
    const profile = Profile.load();
    const farmTag = profile ? profile.farmType : '';

    const topbar = document.createElement('div');
    topbar.id = 'mobile-topbar';
    topbar.innerHTML = `
      <div class="mob-logo">
        <div class="mob-logo-dot"></div>
        Farm Copilot
        ${farmTag ? `<span class="mob-farm-tag">· ${farmTag}</span>` : ''}
      </div>
      <button class="hamburger-btn" onclick="toggleSidebar()" aria-label="Open menu">
        <div class="ham-icon">
          <div class="ham-line"></div>
          <div class="ham-line"></div>
          <div class="ham-line"></div>
        </div>
      </button>
    `;
    document.body.insertBefore(topbar, document.body.firstChild);
  }

  /* ── Tap-outside overlay ── */
  if (!document.getElementById('sb-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'sb-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
  }

  /* ── Close sidebar on nav link tap (mobile UX) ── */
  sidebar.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      // Only close immediately on mobile width
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* ── Swipe-left to close sidebar on touch ── */
  let touchStartX = 0;
  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -60 && document.body.classList.contains('sb-open')) {
      closeSidebar();
    }
  }, { passive: true });
});
