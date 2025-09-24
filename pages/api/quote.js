import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { lead } = req.body || {}
  if (!lead?.name || !lead?.email) return res.status(400).json({ error: 'Missing fields' })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Supabase server env not set' })

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { error } = await supabase.from('leads').insert({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    dates: lead.dates || null,
    adults: lead.adults ?? null,
    children: lead.children ?? null,
    budget: lead.budget || null,
    style: lead.style || null,
    interests: lead.interests || null
  })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
import { Resend } from 'resend';

// ...
const resendKey = process.env.RESEND_API_KEY;
if (resendKey) {
  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: 'LEXVOYAGE <notify@lexvoyage.app>', // change after verifying your domain in Resend
    to: process.env.SALES_INBOX,
    subject: `New quote request — ${lead.name}`,
    html: `
      <h2>New quote request</h2>
      <p><b>Name:</b> ${lead.name}</p>
      <p><b>Email:</b> ${lead.email}</p>
      <p><b>Dates:</b> ${lead.dates || '—'}</p>
      <p><b>Travellers:</b> ${lead.adults ?? '?'} adults, ${lead.children ?? 0} children</p>
      <p><b>Budget:</b> ${lead.budget || '—'}</p>
      <p><b>Style:</b> ${lead.style || '—'}</p>
      <p><b>Interests:</b> ${(lead.interests || []).join(', ') || '—'}</p>
    `,
  });
}
