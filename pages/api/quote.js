// pages/api/quote.js
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]))

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const lead = req.body?.lead || {}
    if (!lead?.name || !lead?.email) {
      return res.status(400).json({ error: 'Missing name or email' })
    }

    // ---- Save to Supabase
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' })
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

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

    const { error } = await supabase.from('leads').insert(row)
    if (error) return res.status(500).json({ error: `Supabase insert failed: ${error.message}` })

    // ---- Email via Resend (no SMTP)
    let emailed = false
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.SALES_INBOX
    const from = process.env.MAIL_FROM || 'LEXVOYAGE <onboarding@resend.dev>'

    if (apiKey && to) {
      try {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from,
          to,
          reply_to: row.email,
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
        emailed = true
      } catch (e) {
        console.error('[quote email/resend]', e?.message || e)
      }
    }

    return res.status(200).json({ ok: true, emailed })
  } catch (e) {
    console.error('[quote API]', e)
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}
