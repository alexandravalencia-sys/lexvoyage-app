# LEXVOYAGE App (v3 – Supabase + Auth + Storage)

This version includes:
- Premium UI polish (logo, spacing, typography)
- Working **Quote** form → inserts into Supabase `leads`
- **Client Login** (magic link) with Supabase Auth
- **Itinerary Vault** with uploads to Supabase Storage (`documents` bucket)

## 1) Supabase setup
1. Create a project at supabase.com
2. In SQL editor, run:

```sql
-- Leads table
create table if not exists public.leads (
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
-- (RLS can stay ON, the server uses the service role key, which bypasses RLS.)

-- Optionally, create a simple profile table for reference
create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  email text,
  created_at timestamptz default now()
);
```

3. **Storage** → create a private bucket called `documents`.
4. **Policies** for storage (SQL editor):
```sql
-- Allow authenticated users to manage their own files in 'documents'
create policy "Users can manage their files"
on storage.objects for all
using (bucket_id = 'documents' and owner = auth.uid())
with check (bucket_id = 'documents' and owner = auth.uid());
```

## 2) Environment variables
In Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase API URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key  
- `SUPABASE_URL` = same as above  
- `SUPABASE_SERVICE_ROLE_KEY` = service role key (server only)

Redeploy after saving.

## 3) Run locally
```bash
npm install
npm run dev
```

## 4) Notes
- Quote form calls `/api/quote` which inserts into `public.leads` using the **service role key** (kept on server only).
- Itinerary Vault requires **Client Login**. Users upload into `documents/<user.id>/...` and files are private; links are signed.
- Replace `/public/logo.png` with your preferred logo if desired.
