# Canadian Farm Copilot — Web Project

AI-powered decision support platform for Canadian farmers, producers, and agribusinesses.

## Live Demo

- Main Site: https://siddarthasiripragada.github.io/farm-copilot/
- Dashboard: https://siddarthasiripragada.github.io/farm-copilot/dashboard.html
- Landing Page: https://siddarthasiripragada.github.io/farm-copilot/landing.html
- Pricing Page: https://siddarthasiripragada.github.io/farm-copilot/pricing.html
- Weather Page: https://siddarthasiripragada.github.io/farm-copilot/weather.html
- Risk Monitor: https://siddarthasiripragada.github.io/farm-copilot/risk-monitor.html

## Project Structure

farm-copilot/
├── index.html
├── landing.html
├── dashboard.html
├── copilot.html
├── funding.html
├── calculator.html
├── planner.html
├── pricing.html
├── support.html
├── weather.html
├── risk-monitor.html
├── manifest.json
├── README.md
├── css/
│   └── style.css
└── js/
    └── data.js

## How to Run

Open the live site directly:

- https://siddarthasiripragada.github.io/farm-copilot/

Or open individual pages:

- dashboard.html
- landing.html
- pricing.html
- weather.html
- risk-monitor.html

## How to Run

### Option 1: Direct browser (simplest)
Open `index.html` directly in any modern browser.
> Note: The AI Copilot (copilot.html) requires a local server due to browser CORS policy for API calls.

### Option 2: VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. All features including the AI Copilot will work

### Option 3: Any local server
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

## Features

| Page | Description |
|------|-------------|
| **Onboarding** | 4-step profile setup: province, farm type, pain points, size |
| **Dashboard** | Personalized alerts, priority actions, checklist, matched programs |
| **AI Copilot** | Live Claude-powered chat grounded in Canadian ag programs |
| **Funding Navigator** | Search/filter 8 programs with match scores, deadlines, apply checklist |
| **ROI Calculator** | Labour savings, equipment ROI, feed/pasture cost, margin comparison |
| **Operations Planner** | Task list, priority sorting, templates, funding deadline sidebar |

## Data Persistence
All data is stored in browser `localStorage`:
- Farm profile
- Checklist state (dashboard)
- Saved programs (funding)
- Tasks (planner)
- Season notes (planner)
- Application checklist state (funding modal)

## Programs Covered (2025–2026)
1. AgriStability — Federal-Provincial
2. AgriMarketing Market Diversification — Federal (new Feb 2026)
3. B.C. On-Farm Technology Adoption — Provincial
4. Local Food Infrastructure Fund — Federal ($30M, 2026)
5. Resilient Agricultural Landscape Program — Ontario
6. Canadian Agricultural Partnership (CAP) — Federal-Provincial-Territorial
7. AgriInnovate — Federal
8. NRC-IRAP Agriculture Stream — Federal

## Tech Stack
- Plain HTML5, CSS3, Vanilla JavaScript
- No build tools, no dependencies, no frameworks
- Google Fonts: DM Serif Display + IBM Plex Mono + Sora
- Anthropic Claude API (claude-sonnet-4-20250514) for AI Copilot

## Design System
- **Forest green** primary (`#1B3528`)
- **Wheat / cream** backgrounds (`#F4ECDA`, `#FAFAF3`)
- **Amber** accent (`#B8720E`)
- Grain texture overlay for depth
- `DM Serif Display` — headings
- `IBM Plex Mono` — data, labels, metadata
- `Sora` — body text, UI

---

Built from: Canadian Farm Copilot Product Requirements & Implementation Blueprint
