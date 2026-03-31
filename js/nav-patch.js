/**
 * nav-patch.js  v2 — Canadian Farm Copilot
 * ─────────────────────────────────────────
 * Loaded AFTER js/data.js on every page.
 * Does three things without touching data.js:
 *
 *  1. Extends every sidebar with "Community & Tools" nav items
 *  2. Injects a subtle auth widget (Sign In / user avatar) into every page
 *  3. Exposes window.CP_PROVINCE_COORDS so the weather page can do real live fetches
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1.  PROVINCE COORDINATES
         Accurate city-centre lat/lon + IANA timezone for all
         10 Canadian provinces. Used by the weather page.
  ═══════════════════════════════════════════════════════════ */
  window.CP_PROVINCE_COORDS = {
    'Alberta':                    { lat: 51.0447, lon: -114.0719, city: 'Calgary',       tz: 'America/Edmonton' },
    'British Columbia':           { lat: 49.2827, lon: -123.1207, city: 'Vancouver',     tz: 'America/Vancouver' },
    'Manitoba':                   { lat: 49.8951, lon: -97.1384,  city: 'Winnipeg',      tz: 'America/Winnipeg' },
    'New Brunswick':              { lat: 46.4928, lon: -66.1516,  city: 'Fredericton',   tz: 'America/Moncton' },
    'Newfoundland & Labrador':    { lat: 47.5615, lon: -52.7126,  city: 'St. John\'s',  tz: 'America/St_Johns' },
    'Nova Scotia':                { lat: 44.6488, lon: -63.5752,  city: 'Halifax',       tz: 'America/Halifax' },
    'Ontario':                    { lat: 43.7001, lon: -79.4163,  city: 'Toronto',       tz: 'America/Toronto' },
    'Prince Edward Island':       { lat: 46.2382, lon: -63.1311,  city: 'Charlottetown', tz: 'America/Halifax' },
    'Quebec':                     { lat: 45.5017, lon: -73.5673,  city: 'Montreal',      tz: 'America/Toronto' },
    'Saskatchewan':               { lat: 50.4452, lon: -104.6189, city: 'Regina',        tz: 'America/Regina' },
  };

  /* ═══════════════════════════════════════════════════════════
     2.  AUTH STATE HELPERS
  ═══════════════════════════════════════════════════════════ */
  function getAuthUser () {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch (e) { return null; }
  }
  function signOut () {
    localStorage.removeItem('authUser');
    // Redirect to landing if currently on an auth-protected page
    const cur = window.location.pathname.split('/').pop();
    const publicPages = ['landing.html', 'index.html', 'pricing.html', 'auth.html', ''];
    if (!publicPages.includes(cur)) window.location.href = 'landing.html';
    else renderAuthWidget();
  }

  /* ═══════════════════════════════════════════════════════════
     3.  AUTH WIDGET
         A slim, non-intrusive pill that appears in:
           a) The top-right of ln-nav (landing / pricing / auth)
           b) The bottom of the app sidebar (dashboard pages)
           c) Any page that has neither (fallback floating pill)
  ═══════════════════════════════════════════════════════════ */
  const AUTH_CSS = `
    /* ── Auth pill — universal ── */
    .cp-auth-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 7px 14px; border-radius: 20px; cursor: pointer;
      font-family: 'Sora', sans-serif; font-size: 12.5px;
      text-decoration: none; transition: all .15s; white-space: nowrap;
      border: 1.5px solid transparent;
    }
    /* On dark nav (landing / pricing nav) */
    .cp-auth-pill.dark {
      background: rgba(255,255,255,.09);
      border-color: rgba(255,255,255,.14);
      color: rgba(244,236,218,.85);
    }
    .cp-auth-pill.dark:hover {
      background: rgba(255,255,255,.16);
      border-color: rgba(255,255,255,.26);
      color: #fff;
    }
    /* Signed-in state on dark nav */
    .cp-auth-pill.dark.signed-in {
      background: rgba(212,154,58,.18);
      border-color: rgba(212,154,58,.35);
      color: #D49A3A;
    }
    /* On light bg (index onboarding) */
    .cp-auth-pill.light {
      background: rgba(27,53,40,.07);
      border-color: rgba(27,53,40,.14);
      color: #1B3528;
    }
    .cp-auth-pill.light:hover {
      background: rgba(27,53,40,.14);
    }
    .cp-auth-pill.light.signed-in {
      background: rgba(27,53,40,.1);
      border-color: #1B3528;
      color: #1B3528;
    }
    .cp-auth-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      background: #1B3528; color: #F4ECDA;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    /* Sidebar auth block */
    .cp-sidebar-auth {
      padding: 10px 12px 14px;
      border-top: 1px solid rgba(255,255,255,.07);
      margin-top: 4px;
    }
    .cp-sidebar-auth-inner {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 9px;
      background: rgba(255,255,255,.05);
      cursor: pointer; transition: background .14s;
      text-decoration: none;
    }
    .cp-sidebar-auth-inner:hover { background: rgba(255,255,255,.09); }
    .cp-sidebar-auth-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(212,154,58,.22); color: #D49A3A;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .cp-sidebar-auth-name  { font-family:'Sora',sans-serif; font-size:12.5px; color:rgba(244,236,218,.85); }
    .cp-sidebar-auth-sub   { font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:rgba(244,236,218,.35); margin-top:2px; }
    .cp-sidebar-auth-btn   {
      margin-left:auto; font-family:'IBM Plex Mono',monospace; font-size:9px;
      letter-spacing:.5px; padding:3px 8px; border-radius:5px;
      background:rgba(192,57,43,.18); color:#ff9999; cursor:pointer;
      border:none; transition:background .14s; flex-shrink:0;
    }
    .cp-sidebar-auth-btn:hover { background:rgba(192,57,43,.32); }
    .cp-sidebar-auth-signin {
      display:flex; align-items:center; justify-content:center;
      gap:7px; padding:9px; border-radius:9px;
      background:rgba(212,154,58,.15); border:1.5px solid rgba(212,154,58,.28);
      color:#D49A3A; text-decoration:none; font-family:'Sora',sans-serif;
      font-size:12.5px; font-weight:600; transition:background .14s;
    }
    .cp-sidebar-auth-signin:hover { background:rgba(212,154,58,.25); }

    /* ── Floating pill (fallback for pages without nav/sidebar) ── */
    .cp-auth-float {
      position: fixed; top: 14px; right: 16px; z-index: 9999;
    }
  `;

  function injectAuthStyles () {
    if (document.getElementById('cp-auth-styles')) return;
    const s = document.createElement('style');
    s.id = 'cp-auth-styles';
    s.textContent = AUTH_CSS;
    document.head.appendChild(s);
  }

  function initials (user) {
    if (!user) return '?';
    if (user.firstName) return (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase();
    return user.email ? user.email[0].toUpperCase() : '?';
  }
  function displayName (user) {
    if (!user) return '';
    if (user.firstName) return user.firstName + (user.lastName ? ' ' + user.lastName : '');
    return user.email || 'My Account';
  }

  /* ── a) Patch ln-nav (landing / pricing / auth pages) ── */
  function patchLnNav () {
    const nav = document.querySelector('.ln-nav-links');
    if (!nav || nav.querySelector('.cp-auth-pill')) return;

    const user    = getAuthUser();
    const pill    = document.createElement('span');
    pill.className = 'cp-auth-pill dark' + (user ? ' signed-in' : '');

    if (user) {
      pill.innerHTML = `<span class="cp-auth-avatar">${initials(user)}</span>${displayName(user).split(' ')[0]}`;
      pill.title     = 'Signed in as ' + displayName(user);
      // clicking opens a small dropdown-like confirm
      pill.onclick   = () => { if (confirm('Sign out of Farm Copilot?')) signOut(); };
    } else {
      pill.innerHTML = `🌾 Sign In`;
      pill.onclick   = () => { window.location.href = 'auth.html'; };
    }
    nav.appendChild(pill);
  }

  /* ── b) Patch app sidebar (dashboard + all inner pages) ── */
  function buildSidebarAuth () {
    const user = getAuthUser();
    if (user) {
      return `<div class="cp-sidebar-auth">
        <div class="cp-sidebar-auth-inner">
          <div class="cp-sidebar-auth-avatar">${initials(user)}</div>
          <div>
            <div class="cp-sidebar-auth-name">${displayName(user)}</div>
            <div class="cp-sidebar-auth-sub">${user.province || 'My Farm'}</div>
          </div>
          <button class="cp-sidebar-auth-btn" onclick="if(confirm('Sign out?')){localStorage.removeItem('authUser');window.location.reload();}">Out</button>
        </div>
      </div>`;
    }
    return `<div class="cp-sidebar-auth">
      <a href="auth.html" class="cp-sidebar-auth-signin">🌾 Sign In / Sign Up</a>
    </div>`;
  }

  /* ── c) Fallback floating pill for index/onboarding (light bg) ── */
  function injectFloatingPill () {
    if (document.querySelector('.cp-auth-float')) return;
    const user  = getAuthUser();
    const wrap  = document.createElement('div');
    wrap.className = 'cp-auth-float';
    const pill  = document.createElement('span');
    pill.className = 'cp-auth-pill light' + (user ? ' signed-in' : '');
    if (user) {
      pill.innerHTML = `<span class="cp-auth-avatar" style="background:#1B3528;color:#F4ECDA;">${initials(user)}</span>${displayName(user).split(' ')[0]}`;
      pill.onclick   = () => { if (confirm('Sign out of Farm Copilot?')) signOut(); };
    } else {
      pill.innerHTML = '🌾 Sign In';
      pill.onclick   = () => { window.location.href = 'auth.html'; };
    }
    wrap.appendChild(pill);
    document.body.appendChild(wrap);
  }

  function renderAuthWidget () {
    injectAuthStyles();
    const page = window.location.pathname.split('/').pop().replace('.html','');

    // Landing-style pages — patch the .ln-nav-links
    if (document.querySelector('.ln-nav-links')) {
      patchLnNav();
      return;
    }
    // App-shell pages — auth goes in sidebar (handled via buildSection below)
    if (document.getElementById('sidebar-mount')) return; // sidebar patch handles it
    // index.html / anything else
    injectFloatingPill();
  }

  /* ═══════════════════════════════════════════════════════════
     4.  COMMUNITY SIDEBAR NAV
  ═══════════════════════════════════════════════════════════ */
  const COMMUNITY_ITEMS = [
    /* ── Original 8 ── */
    { key: 'wellness',        href: 'wellness.html',        icon: '🧠', label: 'Wellness' },
    { key: 'labour',          href: 'labour.html',          icon: '👷', label: 'Labour Exchange' },
    { key: 'land-matcher',    href: 'land-matcher.html',    icon: '🤝', label: 'Land Matcher' },
    { key: 'grain-tracker',   href: 'grain-tracker.html',   icon: '📈', label: 'Grain Basis' },
    { key: 'crop-insurance',  href: 'crop-insurance.html',  icon: '🛡', label: 'Crop Insurance' },
    { key: 'equipment-share', href: 'equipment-share.html', icon: '🚜', label: 'Equipment Share' },
    { key: 'peer-benchmark',  href: 'peer-benchmark.html',  icon: '📊', label: 'Peer Benchmark' },
    { key: 'compliance',      href: 'compliance.html',      icon: '📋', label: 'Compliance' },
    /* ── Batch 2 — Training & Gov ── */
    { key: 'training',        href: 'training.html',        icon: '🎓', label: 'Training Academy' },
    { key: 'gov-portal',      href: 'gov-portal.html',      icon: '🏛️', label: 'Gov Portals' },
    { key: 'farm-safety',     href: 'farm-safety.html',     icon: '🛡', label: 'Farm Safety' },
    { key: 'agritech',        href: 'agritech.html',        icon: '🤖', label: 'Agritech Guide' },
    { key: 'policy-feed',     href: 'policy-feed.html',     icon: '📡', label: 'Policy Feed' },
    /* ── Batch 3 — Community & Markets ── */
    { key: 'local-markets',   href: 'local-markets.html',   icon: '🛒', label: 'Local Markets' },
    { key: 'newcomers',       href: 'newcomers.html',       icon: '🌍', label: 'Newcomer Hub' },
    { key: 'soil-health',     href: 'soil-health.html',     icon: '🌱', label: 'Soil Health' },
    { key: 'events',          href: 'events.html',          icon: '📅', label: 'Event Calendar' },
    { key: 'climate',         href: 'climate.html',         icon: '🌡', label: 'Climate Planner' },
    { key: 'women-ag',        href: 'women-ag.html',        icon: '👩‍🌾', label: 'Women in Ag' },
  ];

  const NAV_CSS = `
    .cp-sidebar-section { padding: 10px 12px 4px; border-top: 1px solid rgba(255,255,255,.07); }
    .cp-sidebar-section-label {
      font-family: 'IBM Plex Mono', monospace; font-size: 8.5px;
      letter-spacing: 1.8px; text-transform: uppercase;
      color: rgba(244,236,218,.28); padding: 4px 4px 8px; display: block;
    }
    .cp-nav-item {
      display: flex; align-items: center; gap: 8px; padding: 8px 10px;
      border-radius: 7px; text-decoration: none;
      font-family: 'Sora', sans-serif; font-size: 12.5px;
      color: rgba(244,236,218,.6); transition: background .13s, color .13s;
      margin-bottom: 2px; line-height: 1;
    }
    .cp-nav-item:hover  { background: rgba(255,255,255,.08); color: rgba(244,236,218,.92); }
    .cp-nav-item.active { background: rgba(212,154,58,.18); color: #D49A3A; font-weight: 600; }
    .cp-nav-icon   { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
    .cp-new-badge  {
      margin-left: auto; font-family: 'IBM Plex Mono', monospace;
      font-size: 7.5px; letter-spacing: .5px; padding: 1px 5px;
      border-radius: 4px; background: rgba(74,200,120,.18); color: #4ac878;
    }
  `;

  function injectNavStyles () {
    if (document.getElementById('cp-nav-styles')) return;
    const s = document.createElement('style'); s.id = 'cp-nav-styles';
    s.textContent = NAV_CSS; document.head.appendChild(s);
  }

  function activeKey () {
    return window.location.pathname.split('/').pop().replace('.html','') || 'dashboard';
  }

  function buildCommunitySection (currentKey) {
    const items = COMMUNITY_ITEMS.map(item => {
      const active = item.key === currentKey;
      return `<a href="${item.href}" class="cp-nav-item${active?' active':''}">
        <span class="cp-nav-icon">${item.icon}</span>${item.label}
        <span class="cp-new-badge">NEW</span>
      </a>`;
    }).join('');
    return `<div class="cp-sidebar-section">
      <span class="cp-sidebar-section-label">Community &amp; Tools</span>
      ${items}
    </div>
    ${buildSidebarAuth()}`;
  }

  function patchRenderSidebar () {
    if (typeof window.renderSidebar !== 'function') return false;
    if (window._cpPatched) return true;
    const original = window.renderSidebar;
    window.renderSidebar = function (key) {
      const html    = original.call(this, key);
      const section = buildCommunitySection(key || activeKey());
      if (html.includes('</nav>'))   return html.replace(/<\/nav>(?=[^<]*$)/, section + '</nav>');
      if (html.includes('</aside>')) return html.replace(/<\/aside>(?=[^<]*$)/, section + '</aside>');
      return html + section;
    };
    window._cpPatched = true;
    return true;
  }

  function patchDOM () {
    const mount = document.getElementById('sidebar-mount');
    if (!mount || mount.querySelector('.cp-sidebar-section')) return;
    mount.insertAdjacentHTML('beforeend', buildCommunitySection(activeKey()));
  }

  /* ═══════════════════════════════════════════════════════════
     5.  BOOT
  ═══════════════════════════════════════════════════════════ */
  injectNavStyles();
  injectAuthStyles();
  patchRenderSidebar();

  document.addEventListener('DOMContentLoaded', function () {
    injectNavStyles();
    injectAuthStyles();
    patchRenderSidebar();
    patchDOM();
    renderAuthWidget();
  });

  // MutationObserver: catches sidebar rendered after DOMContentLoaded
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        const mount = document.getElementById('sidebar-mount');
        if (mount && mount.children.length && !mount.querySelector('.cp-sidebar-section')) {
          patchDOM();
        }
        // Re-run auth in case ln-nav was rendered late
        if (document.querySelector('.ln-nav-links') && !document.querySelector('.cp-auth-pill')) {
          patchLnNav();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

})();
