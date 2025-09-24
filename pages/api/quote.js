// pages/api/quote.js
import { createClient } from '@supabase/supabase-js'

/** Escape a few HTML chars for safe email */
const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]))

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Expect { lead: {...} } in JSON body
    const lead = req.body?.lead || {}
    if (!lead?.name || !lead?.email) {
      return res.status(400).json({ error: 'Missing name or email' })
    }

    // Normalize/shape
    const row = {
      name: String(lead.name).trim(),
      email: String(lead.email).trim(),
      phone: lead.phone ? String(lead.phone).trim() : null,
      dates: lead.dates ? String(lead.dates).trim() : null,
      adults: lead.adults ?? null,
      children: lead.children ?? 0,
      budget: lead.budget ? String(lead.budget).trim() : null,
      style: lead.style ? String(lead.style).trim() : null,
      interests: Array.isArray(lead.interests) ? lead.interests.map(String) : null,
    }

    // ---- Supabase insert ----------------------------------------------------
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error:
          'Supabase env vars missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_* for anon).',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('leads').insert(row)
    if (error) {
      // Common causes: table not created, RLS blocking insert when using anon key
      return res.status(500).json({ error: `Supabase insert failed: ${error.message}` })
    }

    // ---- Optional: send email notification ---------------------------------
    const salesTo = process.env.SALES_INBOX // e.g. hello@lexvoyage.co

    // Try Resend first (only if key provided). Works without SMTP.
    if (process.env.RESEND_API_KEY && salesTo) {
      try {
        const { Resend } = await import('resend').catch(() => ({}))
        if (Resend) {
          const resend = new Resend(process.env.RESEND_API_KEY)
          await resend.emails.send({
            from: 'LEXVOYAGE <notify@lexvoyage.app>', // update after verifying a domain in Resend
            to: salesTo,
            subject: `New quote request — ${row.name}`,
            html: `
              <h2>New quote request</h2>
              <p><b>Name:</b> ${esc(row.name)}</p>
              <p><b>Email:</b> ${esc(row.email)}</p>
              <p><b>Phone:</b> ${esc(row.phone ?? '—')}</p>
              <p><b>Dates:</b> ${esc(row.dates ?? '—')}</p>
              <p><b>Travellers:</b> ${row.adults ?? '?'} adults, ${row.children ?? 0} children</p>
              <p><b>Budget:</b> ${esc(row.budget ?? '—')}</p>
              <p><b>Style:</b> ${esc(row.style ?? '—')}</p>
              <p><b>Interests:</b> ${esc((row.interests || []).join(', ') || '—')}</p>
            `,
          })
        }
      } catch {
        // ignore email failure, lead is already saved
      }
    } else if (
      // Fallback: SMTP / Nodemailer if provided
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      salesTo
    ) {
      try {
        const nodemailer = await import('nodemailer').catch(() => null)
        const nm = (nodemailer && (nodemailer.default || nodemailer)) || null
        if (nm) {
          const tx = nm.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: Number(process.env.SMTP_PORT) === 465, // 465 = SSL, 587 = STARTTLS
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          })
          await tx.sendMail({
            from: `LEXVOYAGE <${process.env.SMTP_USER}>`,
            to: salesTo,
            subject: `New quote request — ${row.name}`,
            html: `
              <h2>New quote request</h2>
              <p><b>Name:</b> ${esc(row.name)}</p>
              <p><b>Email:</b> ${esc(row.email)}</p>
              <p><b>Phone:</b> ${esc(row.phone ?? '—')}</p>
              <p><b>Dates:</b> ${esc(row.dates ?? '—')}</p>
              <p><b>Travellers:</b> ${row.adults ?? '?'} adults, ${row.children ?? 0} children</p>
              <p><b>Budget:</b> ${esc(row.budget ?? '—')}</p>
              <p><b>Style:</b> ${esc(row.style ?? '—')}</p>
              <p><b>Interests:</b> ${esc((row.interests || []).join(', ') || '—')}</p>
            `,
          })
        }
      } catch {
        // ignore email failure, lead is already saved
      }
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    // Log the error so you can see it in Vercel Function logs
    console.error('[quote API] ', e)
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}
