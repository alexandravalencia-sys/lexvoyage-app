# LEXVOYAGE App (MVP)

High‑fidelity web prototype for LEXVOYAGE, built with **Next.js + Tailwind + Framer Motion**.

## Brand Colours
- Deep Green: `#134231`
- Gold: `#B39449`
- Paper: `#E9E8DB`

## Quick Start

1. **Install Node.js** (>= 18 recommended).
2. Unzip the project, then run:

```bash
npm install
npm run dev
```

3. Open http://localhost:3000

## Structure
- `pages/` – Next.js routes (index renders the app shell)
- `components/AppShell.js` – all four MVP screens (Home, Quote, Proposal, Itinerary)
- `styles/` – Tailwind styles
- `tailwind.config.js` – brand tokens

## Supabase (optional next step)
Create a project and add tables:

```sql
-- Leads: stores quote requests
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  dates text,
  adults int,
  children int,
  budget text,
  style text,
  interests text[]
);
```

Then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and wire the form submit to call your API route or Supabase client.

## Notes
- Payments are NOT handled here. Link out to approved supplier portals (InteleTravel/partners).
- ABTA & ATOL messaging is included in the footer; confirm final wording with compliance.
