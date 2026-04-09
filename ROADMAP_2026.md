# Canadian Farm Copilot — Product Roadmap (April 2026)

This roadmap turns the current demo-style experience into a production-ready product that is launch-worthy on LinkedIn and compelling for farmers, advisors, and investors.

---

## Product Positioning

**Positioning line:**  
Canadian Farm Copilot is the only AI platform that combines funding intelligence, climate risk, trade exposure, and succession planning in one place — built specifically for Canadian farms.

**Current gap to close first:**
1. Real auth + onboarding with persistent profiles  
2. One flagship AI feature that saves meaningful operator time

---

## Priority 0 (Foundation) — Auth + Onboarding

### Deliverables
- `signup.html`
- `login.html`
- `onboarding.html` (multi-step)
- Supabase-backed profile persistence

### Onboarding Steps
1. Account creation (email/password or Google OAuth) + role (`operator`, `consultant`, `lender`)
2. Farm identity (farm name, province, commodities, farm size)
3. Top challenge selector (tariffs, funding, succession, input costs, scale, exploring)
4. Personalized dashboard unlock

### Minimum Supabase Schema
```sql
-- profiles
id uuid primary key references auth.users(id)
farm_name text
province text
commodities text[]
farm_size text
top_challenge text
role text
created_at timestamp default now()

-- checklist_progress
user_id uuid references auth.users(id)
page text
item_key text
completed boolean
updated_at timestamp default now()
```

---

## Top Features (Ranked by Impact × Build Speed)

### 1) AI Grant Application Writer (Highest impact)
- Input: selected program + farm profile + short Q&A
- Output: 400–600 word formal draft
- Integrations: Claude API + edit/refine + export

### 2) Real-Time Grain Basis Tracker
- Province + commodity basis with trend signal
- AI interpretation and suggested strategy actions

### 3) AgriStability Pre-Qualifier
- 6-question eligibility and payout estimate signal
- Deadline urgency callout + CTA to enroll

### 4) FCC Loan Readiness Score
- Scorecard + top 3 actions to improve eligibility

### 5) Labour / TFWP Match Tool
- Stream recommendation + timelines + cost estimate

### 6) Carbon Credit Revenue Estimator
- Practice-based annual opportunity estimate + enrollment links

### 7) Shareable Public Farm Card
- Public profile URL with farm-level intelligence score snapshot

### 8) PWA polish
- Installable app shell + offline-ready essentials

---

## Suggested Build Schedule

| Week | Feature |
|---|---|
| Week 1 | Tariff Impact Calculator (done) |
| Week 2 | Auth + onboarding |
| Week 3 | AgriStability pre-qualifier |
| Week 4 | AI grant writer |
| Week 5 | PWA + shareable farm card |
| Week 6 | FCC readiness score |
| Week 7 | Carbon estimator |
| Week 8 | Grain basis tracker |

---

## LinkedIn Launch Formula

1. One farmer pain point
2. One concrete product capability
3. One screenshot with realistic data
4. CTA to specific page

Post template:
> Just shipped [feature] for Canadian Farm Copilot.  
> [Problem solved for farmers].  
> Built with [stack]. Try it: farmcopilot.ca/[page]

---

## Grant Narrative (IRAP / SR&ED)

Each shipped feature should include:
- hypothesis
- implementation notes
- measurable outcome
- technical novelty paragraph

Maintain a `dev-log` entry per feature to support grant applications.

