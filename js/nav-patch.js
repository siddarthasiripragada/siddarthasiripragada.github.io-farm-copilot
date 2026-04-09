/**
 * nav-patch.js — Canadian Farm Copilot
 * Renders: desktop sidebar (collapsible groups) + mobile bottom nav + More drawer
 * Drop-in replacement — keep loading after data.js
 */
(function () {
  /* ═══════════════════════════════════════════════════════
     1. TOOL CATALOGUE  (all 18 tools + support pages)
  ═══════════════════════════════════════════════════════ */
  const TOOLS = {
    dashboard:      { label: 'Dashboard',       icon: '🏠', href: 'dashboard.html' },
    copilot:        { label: 'AI Copilot',       icon: '✦',  href: 'copilot.html'  },
    weather:        { label: 'Weather',          icon: '🌤', href: 'weather.html'  },
    funding:        { label: 'Funding',          icon: '💰', href: 'funding.html'  },
    // Intelligence
    'risk-monitor': { label: 'Risk Monitor',    icon: '🛡', href: 'risk-monitor.html'  },
    'policy-feed':  { label: 'Policy Feed',     icon: '📰', href: 'policy-feed.html'   },
    events:         { label: 'Events',           icon: '📅', href: 'events.html'        },
    'peer-benchmark':{ label: 'Benchmarks',     icon: '📊', href: 'peer-benchmark.html'},
    'grain-tracker':{ label: 'Grain Tracker',   icon: '📈', href: 'grain-tracker.html' },
    // Farm Tools
    calculator:     { label: 'ROI Calculator',  icon: '🧮', href: 'calculator.html'    },
    planner:        { label: 'Season Planner',  icon: '📋', href: 'planner.html'       },
    'tariff-impact':{ label: 'Tariff Calculator', icon: '📊', href: 'tariff-impact.html' },
    'soil-health':  { label: 'Soil Health',     icon: '🌱', href: 'soil-health.html'   },
    'equipment-share':{ label: 'Equipment',     icon: '🚜', href: 'equipment-share.html'},
    'farm-safety':  { label: 'Farm Safety',     icon: '⛑', href: 'farm-safety.html'   },
    // Business
    'crop-insurance':{ label: 'Crop Insurance', icon: '🛡', href: 'crop-insurance.html'},
    compliance:     { label: 'Compliance',      icon: '✅', href: 'compliance.html'    },
    'gov-portal':   { label: 'Gov Portal',      icon: '🏛', href: 'gov-portal.html'   },
    'local-markets':{ label: 'Local Markets',   icon: '🏪', href: 'local-markets.html' },
    'land-matcher': { label: 'Land Matcher',    icon: '🗺', href: 'land-matcher.html'  },
    labour:         { label: 'Labour',           icon: '👷', href: 'labour.html'        },
    climate:        { label: 'Climate',          icon: '🌿', href: 'climate.html'       },
    agritech:       { label: 'AgriTech',         icon: '⚙️', href: 'agritech.html'      },
    // Community
    'women-ag':     { label: 'Women in Ag',     icon: '👩‍🌾', href: 'women-ag.html'   },
    training:       { label: 'Training',         icon: '🎓', href: 'training.html'      },
    newcomers:      { label: 'Newcomers',        icon: '🌍', href: 'newcomers.html'     },
    wellness:       { label: 'Wellness',         icon: '💚', href: 'wellness.html'      },
    support:        { label: 'Support',          icon: '🆘', href: 'support.html'       },
  };

  const SIDEBAR_GROUPS = [
    {
      id: 'core', label: 'Core', icon: '◈',
      keys: ['dashboard', 'copilot', 'weather', 'funding'],
    },
    {
      id: 'intel', label: 'Intelligence', icon: '📡',
      keys: ['risk-monitor', 'policy-feed', 'events', 'peer-benchmark', 'grain-tracker'],
    },
    {
      id: 'tools', label: 'Farm Tools', icon: '🚜',
      keys: ['calculator', 'planner', 'tariff-impact', 'soil-health', 'equipment-share', 'farm-safety'],
    },
    {
      id: 'biz', label: 'Business', icon: '💼',
      keys: ['crop-insurance', 'compliance', 'gov-portal', 'local-markets', 'land-matcher', 'labour', 'climate', 'agritech'],
    },
    {
      id: 'community', label: 'Community', icon: '🌱',
      keys: ['women-ag', 'training', 'newcomers', 'wellness', 'support'],
    },
  ];

  /* ═══════════════════════════════════════════════════════
     2. INJECT STYLES (sidebar + mobile nav)
  ═══════════════════════════════════════════════════════ */
  const STYLE = `
    /* ── App Shell ──────────────────────────────────── */
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--cream, #FAF8F2);
    }

    /* ── DESKTOP SIDEBAR ────────────────────────────── */
    .sidebar {
      width: 230px;
      flex-shrink: 0;
      background: var(--forest, #1B3528);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,.1) transparent;
      z-index: 100;
    }
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

    .sb-head {
      padding: 20px 18px 14px;
      border-bottom: 1px solid rgba(255,255,255,.07);
      flex-shrink: 0;
    }
    .sb-logo {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9.5px; letter-spacing: 2.5px; text-transform: uppercase;
      color: var(--amber-lt, #E8B84B);
      display: flex; align-items: center; gap: 7px;
      text-decoration: none; margin-bottom: 14px;
    }
    .sb-logo-dot {
      width: 6px; height: 6px;
      background: var(--amber-lt, #E8B84B);
      border-radius: 50%; flex-shrink: 0;
      animation: sbpulse 2.4s ease-in-out infinite;
    }
    @keyframes sbpulse { 0%,100%{opacity:1} 50%{opacity:.3} }

    .sb-profile {
      display: flex; align-items: center; gap: 9px;
    }
    .sb-avatar {
      width: 32px; height: 32px;
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; flex-shrink: 0;
    }
    .sb-profile-info { min-width: 0; }
    .sb-profile-name {
      font-family: 'Sora', sans-serif;
      font-size: 12px; font-weight: 600;
      color: var(--wheat, #F4ECDA);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .sb-profile-sub {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; letter-spacing: .5px;
      color: rgba(244,236,218,.35);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .sb-search-wrap {
      padding: 10px 12px 6px;
    }
    .sb-search {
      width: 100%;
      padding: 7px 10px 7px 30px;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 7px;
      font-family: 'Sora', sans-serif;
      font-size: 12px; color: var(--wheat, #F4ECDA);
      outline: none; transition: border-color .15s;
      position: relative;
    }
    .sb-search::placeholder { color: rgba(244,236,218,.3); }
    .sb-search:focus { border-color: rgba(255,255,255,.25); }
    .sb-search-icon {
      position: absolute;
      left: 22px;
      font-size: 11px;
      color: rgba(244,236,218,.3);
      pointer-events: none;
      top: 50%;
      transform: translateY(-50%);
    }
    .sb-search-container {
      position: relative;
    }

    .sb-nav {
      flex: 1;
      padding: 6px 8px;
      overflow-y: auto;
    }

    /* Group header */
    .sb-group { margin-bottom: 2px; }
    .sb-group-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 7px 10px 5px;
      cursor: pointer;
      border-radius: 7px;
      user-select: none;
      transition: background .13s;
    }
    .sb-group-header:hover { background: rgba(255,255,255,.05); }
    .sb-group-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8.5px; letter-spacing: 1.5px; text-transform: uppercase;
      color: rgba(244,236,218,.3);
      display: flex; align-items: center; gap: 5px;
    }
    .sb-group-chevron {
      font-size: 8px; color: rgba(244,236,218,.2);
      transition: transform .2s; flex-shrink: 0;
    }
    .sb-group.collapsed .sb-group-chevron { transform: rotate(-90deg); }
    .sb-group-items { overflow: hidden; }
    .sb-group.collapsed .sb-group-items { display: none; }

    /* Nav item */
    .sb-item {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 10px;
      border-radius: 8px;
      text-decoration: none;
      color: rgba(244,236,218,.62);
      font-family: 'Sora', sans-serif;
      font-size: 12.5px;
      transition: all .13s;
      margin-bottom: 1px;
      white-space: nowrap;
    }
    .sb-item:hover { background: rgba(255,255,255,.07); color: var(--wheat, #F4ECDA); }
    .sb-item.active {
      background: rgba(255,255,255,.1);
      color: var(--wheat, #F4ECDA);
      font-weight: 600;
    }
    .sb-item-icon {
      width: 22px; height: 22px;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; flex-shrink: 0;
      border-radius: 5px;
    }
    .sb-item.active .sb-item-icon {
      background: rgba(232,184,75,.15);
    }
    .sb-item-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }

    /* Sidebar footer */
    .sb-foot {
      padding: 10px 8px 14px;
      border-top: 1px solid rgba(255,255,255,.06);
      flex-shrink: 0;
    }
    .sb-foot-item {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      color: rgba(244,236,218,.45);
      font-family: 'Sora', sans-serif;
      font-size: 12px;
      transition: all .13s;
      text-decoration: none;
      border: none; background: none; width: 100%;
    }
    .sb-foot-item:hover { background: rgba(255,255,255,.07); color: rgba(244,236,218,.8); }
    .sb-foot-item.danger:hover { background: rgba(192,57,43,.15); color: #ff9999; }
    .sb-foot-icon { font-size: 14px; width: 22px; text-align: center; }

    /* Main content area */
    .main-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    /* ── MOBILE BOTTOM NAV ──────────────────────────── */
    .mob-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 62px;
      background: var(--forest, #1B3528);
      border-top: 1px solid rgba(255,255,255,.09);
      z-index: 300;
      padding: 0 6px;
      padding-bottom: env(safe-area-inset-bottom, 0);
      align-items: stretch;
      justify-content: space-around;
    }
    .mob-nav-btn {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 3px;
      flex: 1; max-width: 72px;
      padding: 0 4px;
      background: none; border: none;
      cursor: pointer; text-decoration: none;
      color: rgba(244,236,218,.45);
      transition: color .13s;
      border-radius: 10px;
      position: relative;
    }
    .mob-nav-btn.active { color: var(--amber-lt, #E8B84B); }
    .mob-nav-btn:hover:not(.active) { color: rgba(244,236,218,.75); }
    .mob-nav-icon { font-size: 19px; line-height: 1; }
    .mob-nav-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; letter-spacing: .5px;
      white-space: nowrap;
    }
    .mob-nav-dot {
      position: absolute; top: 8px; right: 14px;
      width: 6px; height: 6px;
      background: #c0392b; border-radius: 50%;
      border: 1.5px solid var(--forest, #1B3528);
    }
    /* Push page content above mobile nav */
    .main-content { padding-bottom: 0; }

    /* ── MORE DRAWER ────────────────────────────────── */
    .more-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(10,24,16,.6);
      z-index: 290;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    .more-overlay.open { display: block; animation: moFadeIn .18s ease; }
    @keyframes moFadeIn { from{opacity:0} to{opacity:1} }

    .more-drawer {
      position: fixed;
      bottom: 62px; left: 0; right: 0;
      max-height: 75vh;
      background: #162C1F;
      border-top: 1px solid rgba(255,255,255,.1);
      border-radius: 18px 18px 0 0;
      overflow-y: auto;
      z-index: 295;
      transform: translateY(100%);
      transition: transform .25s cubic-bezier(.32,.72,0,1);
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    .more-drawer.open { transform: translateY(0); }

    .more-drawer-handle {
      width: 36px; height: 4px;
      background: rgba(255,255,255,.15);
      border-radius: 2px;
      margin: 12px auto 14px;
    }
    .more-drawer-section { padding: 0 16px 14px; }
    .more-drawer-section-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
      color: rgba(244,236,218,.3);
      padding: 6px 0 8px;
      border-bottom: 1px solid rgba(255,255,255,.07);
      margin-bottom: 10px;
      display: flex; align-items: center; gap: 5px;
    }
    .more-tools-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .more-tool-tile {
      display: flex; flex-direction: column;
      align-items: center; gap: 5px;
      padding: 10px 6px 9px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 10px;
      text-decoration: none;
      transition: all .14s;
      cursor: pointer;
    }
    .more-tool-tile:hover { background: rgba(232,184,75,.1); border-color: rgba(232,184,75,.3); }
    .more-tool-tile.active { background: rgba(232,184,75,.14); border-color: rgba(232,184,75,.4); }
    .more-tool-icon { font-size: 20px; line-height: 1; }
    .more-tool-label {
      font-family: 'Sora', sans-serif;
      font-size: 10px; text-align: center;
      color: rgba(244,236,218,.7);
      line-height: 1.25;
      letter-spacing: -.1px;
    }
    .more-tool-tile.active .more-tool-label { color: var(--amber-lt, #E8B84B); }

    /* ── RESPONSIVE SWITCH ─────────────────────────── */
    @media (max-width: 768px) {
      .sidebar { display: none !important; }
      .mob-nav { display: flex !important; }
      .main-content { padding-bottom: 66px; }
      /* Tighten page headers on mobile */
      .page-header { padding: 14px 16px 12px !important; }
      .page-header-row { flex-wrap: wrap; gap: 8px; }
      .page-title { font-size: 18px !important; }
      .page-body { padding: 14px 14px 20px !important; }
      .planner-stats,
      .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
    }
    @media (min-width: 769px) {
      .mob-nav, .more-overlay, .more-drawer { display: none !important; }
    }
  `;

  function injectStyles() {
    if (document.getElementById('fc-nav-styles')) return;
    const tag = document.createElement('style');
    tag.id = 'fc-nav-styles';
    tag.textContent = STYLE;
    document.head.appendChild(tag);
  }

  /* ═══════════════════════════════════════════════════════
     3. RENDER SIDEBAR (desktop)
  ═══════════════════════════════════════════════════════ */
  window.renderSidebar = function (active) {
    const ctx = typeof getUserContext === 'function' ? getUserContext() : { profile: null, firstName: 'Farmer', regionContext: 'Canada', farmType: '' };
    const name = ctx.firstName || 'Farmer';
    const sub = ctx.regionContext || ctx.farmType || 'Canada';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const groupsHTML = SIDEBAR_GROUPS.map(g => {
      // Auto-expand the group that contains the active page
      const hasActive = g.keys.includes(active);
      return `
        <div class="sb-group ${hasActive ? '' : 'collapsed'}" data-group="${g.id}">
          <div class="sb-group-header" onclick="sbToggleGroup('${g.id}')">
            <span class="sb-group-label">${g.icon}&ensp;${g.label}</span>
            <span class="sb-group-chevron">▼</span>
          </div>
          <div class="sb-group-items">
            ${g.keys.map(k => {
              const t = TOOLS[k];
              if (!t) return '';
              return `<a href="${t.href}" class="sb-item ${k === active ? 'active' : ''}">
                <span class="sb-item-icon">${t.icon}</span>
                <span class="sb-item-label">${t.label}</span>
              </a>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');

    return `
      <aside class="sidebar" role="navigation" aria-label="Main navigation">
        <div class="sb-head">
          <a href="landing.html" class="sb-logo">
            <div class="sb-logo-dot"></div>
            Farm Copilot
          </a>
          <div class="sb-profile">
            <div class="sb-avatar">🌾</div>
            <div class="sb-profile-info">
              <div class="sb-profile-name">${escHtml(name)}</div>
              <div class="sb-profile-sub">${escHtml(sub)}</div>
            </div>
          </div>
        </div>

        <div class="sb-search-wrap">
          <div class="sb-search-container">
            <span class="sb-search-icon">🔍</span>
            <input class="sb-search" type="search" placeholder="Search tools…" 
                   oninput="sbSearch(this.value)" aria-label="Search tools">
          </div>
        </div>

        <nav class="sb-nav" id="sb-nav-body">
          ${groupsHTML}
        </nav>

        <div class="sb-foot">
          <a href="pricing.html" class="sb-foot-item">
            <span class="sb-foot-icon">⭐</span> Upgrade Plan
          </a>
          <a href="support.html" class="sb-foot-item">
            <span class="sb-foot-icon">🆘</span> Help &amp; Support
          </a>
          <button class="sb-foot-item danger" onclick="sbLogout()">
            <span class="sb-foot-icon">↩</span> Sign Out
          </button>
        </div>
      </aside>`;
  };

  /* ═══════════════════════════════════════════════════════
     4. SIDEBAR INTERACTIVITY
  ═══════════════════════════════════════════════════════ */
  window.sbToggleGroup = function (id) {
    const el = document.querySelector(`.sb-group[data-group="${id}"]`);
    if (el) el.classList.toggle('collapsed');
  };

  window.sbSearch = function (q) {
    q = q.toLowerCase().trim();
    document.querySelectorAll('.sb-item').forEach(item => {
      const label = item.querySelector('.sb-item-label')?.textContent.toLowerCase() || '';
      item.style.display = (!q || label.includes(q)) ? '' : 'none';
    });
    // Show/expand all groups while searching
    document.querySelectorAll('.sb-group').forEach(g => {
      g.classList.toggle('collapsed', false);
    });
    // Hide group if all its items hidden
    if (q) {
      document.querySelectorAll('.sb-group').forEach(g => {
        const visible = [...g.querySelectorAll('.sb-item')].some(i => i.style.display !== 'none');
        g.style.display = visible ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.sb-group').forEach(g => { g.style.display = ''; });
    }
  };

  window.sbLogout = function () {
    if (!confirm('Sign out of Farm Copilot?')) return;
    localStorage.removeItem('authUser');
    localStorage.removeItem('authSession');
    window.location.href = 'auth.html';
  };

  /* ═══════════════════════════════════════════════════════
     5. MOBILE BOTTOM NAV
  ═══════════════════════════════════════════════════════ */
  // Bottom bar: 5 fixed tabs
  const BOTTOM_TABS = [
    { key: 'dashboard', icon: '🏠', label: 'Home',    href: 'dashboard.html' },
    { key: 'copilot',   icon: '✦',  label: 'Copilot', href: 'copilot.html'  },
    { key: 'funding',   icon: '💰', label: 'Funding', href: 'funding.html'  },
    { key: 'weather',   icon: '🌤', label: 'Weather', href: 'weather.html'  },
    { key: '__more',    icon: '⊞',  label: 'More',    href: '#'             },
  ];

  // Groups shown in "More" drawer
  const MORE_GROUPS = SIDEBAR_GROUPS.filter(g => g.id !== 'core');

  function initMobileNav(active) {
    if (document.getElementById('fc-mob-nav')) return;

    // Build bottom bar
    const nav = document.createElement('nav');
    nav.id = 'fc-mob-nav';
    nav.className = 'mob-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Mobile navigation');

    nav.innerHTML = BOTTOM_TABS.map(t => {
      const isMore = t.key === '__more';
      const isActive = t.key === active;
      if (isMore) {
        return `<button class="mob-nav-btn ${isActive ? 'active' : ''}" 
                        onclick="mobMoreToggle(event)" 
                        id="mob-more-btn"
                        aria-label="More tools" aria-expanded="false">
          <span class="mob-nav-icon">${t.icon}</span>
          <span class="mob-nav-label">${t.label}</span>
        </button>`;
      }
      return `<a href="${t.href}" class="mob-nav-btn ${isActive ? 'active' : ''}" aria-label="${t.label}">
        <span class="mob-nav-icon">${t.icon}</span>
        <span class="mob-nav-label">${t.label}</span>
      </a>`;
    }).join('');

    document.body.appendChild(nav);

    // Build overlay
    const overlay = document.createElement('div');
    overlay.id = 'fc-more-overlay';
    overlay.className = 'more-overlay';
    overlay.onclick = mobMoreClose;
    document.body.appendChild(overlay);

    // Build "More" drawer
    const drawer = document.createElement('div');
    drawer.id = 'fc-more-drawer';
    drawer.className = 'more-drawer';

    const drawerContent = MORE_GROUPS.map(g => {
      const tiles = g.keys.map(k => {
        const t = TOOLS[k];
        if (!t) return '';
        return `<a href="${t.href}" class="more-tool-tile ${k === active ? 'active' : ''}">
          <span class="more-tool-icon">${t.icon}</span>
          <span class="more-tool-label">${t.label}</span>
        </a>`;
      }).join('');
      return `
        <div class="more-drawer-section">
          <div class="more-drawer-section-label">${g.icon}&ensp;${g.label}</div>
          <div class="more-tools-grid">${tiles}</div>
        </div>`;
    }).join('');

    drawer.innerHTML = `
      <div class="more-drawer-handle"></div>
      ${drawerContent}
      <div style="height:12px;"></div>`;

    document.body.appendChild(drawer);
  }

  window.mobMoreToggle = function (e) {
    if (e) e.stopPropagation();
    const overlay = document.getElementById('fc-more-overlay');
    const drawer  = document.getElementById('fc-more-drawer');
    const btn     = document.getElementById('mob-more-btn');
    if (!overlay || !drawer) return;
    const isOpen = drawer.classList.contains('open');
    overlay.classList.toggle('open', !isOpen);
    drawer.classList.toggle('open', !isOpen);
    if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
  };

  window.mobMoreClose = function () {
    const overlay = document.getElementById('fc-more-overlay');
    const drawer  = document.getElementById('fc-more-drawer');
    const btn     = document.getElementById('mob-more-btn');
    if (overlay) overlay.classList.remove('open');
    if (drawer)  drawer.classList.remove('open');
    if (btn)     btn.setAttribute('aria-expanded', 'false');
  };

  /* Swipe-down on drawer to close */
  let touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const drawer = document.getElementById('fc-more-drawer');
    if (!drawer || !drawer.classList.contains('open')) return;
    const delta = e.changedTouches[0].clientY - touchStartY;
    if (delta > 60) mobMoreClose();
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════
     6. AUTO-DETECT ACTIVE PAGE & INIT
  ═══════════════════════════════════════════════════════ */
  function detectActivePage() {
    const path = window.location.pathname.split('/').pop().replace('.html', '');
    return path || 'dashboard';
  }

  /* ═══════════════════════════════════════════════════════
     7. UTIL
  ═══════════════════════════════════════════════════════ */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ═══════════════════════════════════════════════════════
     8. BOOT
  ═══════════════════════════════════════════════════════ */
  injectStyles();

  function boot() {
    const mount = document.getElementById('sidebar-mount');
    if (!mount) return;
    // If sidebar was already rendered by page script, just init mobile nav
    const active = detectActivePage();
    initMobileNav(active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
