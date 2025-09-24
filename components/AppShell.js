import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

const brand = {
  green: '#134231',   // LEXVOYAGE deep green
  gold:  '#B39449',   // LEXVOYAGE gold
  paper: '#E9E8DB',
  ink:   '#0E0F11',
  stone: '#D9D4C7',
}

const cardBase = (brand) => ({
  background: brand.paper,
  color: brand.ink,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
})

export default function AppShell() {
  const [screen, setScreen] = useState('home')
  const [lead, setLead] = useState(null)

  const NavLink = ({ id, label }) => (
    <button
      onClick={() => setScreen(id)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        screen === id ? 'bg-white text-black shadow' : 'bg-black/30 text-white hover:bg-black/50'
      }`}
      aria-current={screen === id ? 'page' : undefined}
    >
      {label}
    </button>
  )

  return (
    <div style={{ background: brand.green, minHeight: '100vh' }}>
      <header className="w-full" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 100%)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <div aria-label="LEXVOYAGE logo" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: brand.gold }}>
              <span className="text-sm font-bold tracking-widest" style={{ color: brand.green }}>LX</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold tracking-[0.18em]">LEXVOYAGE</h1>
              <p className="text-white/70 text-xs">Independent Travel Agent of InteleTravel UK</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink id="home" label="Home" />
            <NavLink id="quote" label="Request a Quote" />
            <NavLink id="proposal" label="Proposal" />
            <NavLink id="itinerary" label="Itinerary Vault" />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.section key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="grid gap-6">
              <Hero />
              <Collections onRequestQuote={() => setScreen('quote')} />
              <Assurances />
            </motion.section>
          )}

          {screen === 'quote' && (
            <motion.section key="quote" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <QuoteForm onSubmitted={(lead) => { setLead(lead); setScreen('proposal'); }} />
            </motion.section>
          )}

          {screen === 'proposal' && (
            <motion.section key="proposal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="grid gap-6">
              <Proposal lead={lead} />
              <ComplianceFooter />
            </motion.section>
          )}

          {screen === 'itinerary' && (
            <motion.section key="itinerary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="grid gap-6">
              <ItineraryVault />
              <ComplianceFooter />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden" style={cardBase(brand)}>
      <div className="grid md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col gap-4">
          <div className="text-xs tracking-widest" style={{ color: brand.green }}>PREMIUM TRAVEL, PERSONALISED</div>
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: brand.ink }}>Curated escapes by LEXVOYAGE</h2>
          <p className="text-sm md:text-base text-black/70">
            Bespoke holidays, cruise journeys and city breaks. Book with confidence via our approved supplier portals and enjoy ABTA & ATOL protection where applicable.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#quote" onClick={(e)=>e.preventDefault()} className="px-5 py-3 rounded-xl text-sm font-medium" style={{ background: brand.gold, color: brand.green }}>Request a Quote</a>
            <a href="#collections" onClick={(e)=>e.preventDefault()} className="px-5 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: brand.green, color: brand.green }}>Explore Collections</a>
          </div>
        </div>
        <div className="min-h-[260px] md:min-h-[360px]" style={{ background: 'url(https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop) center/cover' }} />
      </div>
    </div>
  )
}

function Collections({ onRequestQuote }) {
  const items = [
    { title: 'Paris Weekends', copy: 'Chic stays, boutique dining, museum passes.', img: 'https://images.unsplash.com/photo-1522098635839-3c8d5f8a00be?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Caribbean Escapes', copy: 'All-inclusive resorts & luxury cruises.', img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400&auto=format&fit=crop' },
    { title: 'Luxury Cruises', copy: 'Celebrity, Cunard, Royal Caribbean & more.', img: 'https://images.unsplash.com/photo-1526635090919-32716cdd4a8b?q=80&w=1400&auto=format&fit=crop' },
  ]
  return (
    <div id="collections" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <article key={it.title} className="overflow-hidden" style={cardBase(brand)}>
          <div className="h-40" style={{ background: `url(${it.img}) center/cover` }} />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-1" style={{ color: brand.ink }}>{it.title}</h3>
            <p className="text-sm text-black/70 mb-4">{it.copy}</p>
            <button onClick={onRequestQuote} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: brand.gold, color: brand.green }}>
              Get a tailored quote
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function Assurances() {
  const items = [
    { h: 'ABTA & ATOL', p: 'Book with protection where applicable.' },
    { h: 'Preferred Partners', p: 'Cruise, packages, tours & extras via approved portals.' },
    { h: 'Personal Service', p: 'WhatsApp & email updates, tailored proposals.' },
  ]
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((a) => (
        <div key={a.h} className="p-5" style={cardBase(brand)}>
          <div className="text-sm" style={{ color: brand.green }}>{a.h}</div>
          <div className="text-base text-black/80">{a.p}</div>
        </div>
      ))}
    </div>
  )
}

function Field({ label, helper, children }) {
  return (
    <label className="block">
      <div className="text-xs font-medium mb-1" style={{ color: brand.green }}>{label}</div>
      {children}
      {helper && <div className="text-[11px] text-black/60 mt-1">{helper}</div>}
    </label>
  )
}

function Tag({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-xs border ${active ? '' : 'bg-white'}`}
      style={{ borderColor: active ? brand.gold : '#E5E7EB', background: active ? brand.gold : '#fff', color: active ? brand.green : '#111827' }}
    >
      {label}
    </button>
  )
}

function QuoteForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dates: '',
    adults: 2, children: 0, budget: '', style: 'Luxury', interests: ['City']
  })
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <div className="max-w-3xl mx-auto overflow-hidden" style={cardBase(brand)}>
      <div className="p-6 md:p-8 border-b" style={{ borderColor: brand.stone }}>
        <h3 className="text-2xl font-semibold" style={{ color: brand.ink }}>Request a Quote</h3>
        <p className="text-sm text-black/70">Tell us what you’re dreaming of—we’ll curate options from our preferred partners.</p>
      </div>
      <form className="p-6 md:p-8 grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); onSubmitted?.({ ...form, submittedAt: new Date().toISOString() }) }}>
        <Field label="Full name"><input required value={form.name} onChange={(e)=>update('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Email"><input type="email" required value={form.email} onChange={(e)=>update('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Phone (optional)"><input value={form.phone} onChange={(e)=>update('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Dates / flexibility"><input placeholder="e.g., 12–19 Oct (±3 days)" value={form.dates} onChange={(e)=>update('dates', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Adults"><input type="number" min={1} value={form.adults} onChange={(e)=>update('adults', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Children"><input type="number" min={0} value={form.children} onChange={(e)=>update('children', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Budget (total)"><input placeholder="e.g., £3,000" value={form.budget} onChange={(e)=>update('budget', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none" /></Field>
        <Field label="Style">
          <select value={form.style} onChange={(e)=>update('style', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none">
            <option>Luxury</option><option>Premium</option><option>Family</option><option>Adventure</option><option>Honeymoon</option>
          </select>
        </Field>
        <Field label="Interests" helper="Select all that apply">
          <div className="flex flex-wrap gap-2">
            {'City Beach Cruise Nature Food Wine Culture Theme Parks'.split(' ').map((tag) => (
              <Tag key={tag} label={tag} active={form.interests.includes(tag)} onToggle={() =>
                setForm((f) => ({ ...f, interests: f.interests.includes(tag) ? f.interests.filter((t)=>t!==tag) : [...f.interests, tag] }))
              } />
            ))}
          </div>
        </Field>
        <div className="md:col-span-2 flex items-center justify-between pt-2">
          <small className="text-black/60">By submitting, you agree to our Privacy Policy.</small>
          <button type="submit" className="px-6 py-3 rounded-xl font-medium" style={{ background: brand.gold, color: brand.green }}>Submit</button>
        </div>
      </form>
    </div>
  )
}

function Proposal({ lead }) {
  const sample = useMemo(() => ({
    title: '7-Night Caribbean Cruise (Celebrity)',
    price: 'from £1,499 pp',
    img: 'https://images.unsplash.com/photo-1526635090919-32716cdd4a8b?q=80&w=1400&auto=format&fit=crop',
    inclusions: ['Flights from London','Balcony stateroom','All-inclusive dining','Port taxes & tips','Private transfers'],
    terms: 'Subject to availability. Pricing may vary by date and cabin category. Supplier T&Cs apply.',
    supplier: { name: 'Celebrity Central', cta: 'Book Now', url: '#celebrity-deeplink' }
  }), [])
  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
      <article className="overflow-hidden" style={cardBase(brand)}>
        <div className="h-56" style={{ background: `url(${sample.img}) center/cover` }} />
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-1" style={{ color: brand.ink }}>{sample.title}</h3>
          <div className="text-sm mb-3" style={{ color: brand.green }}>{sample.price}</div>
          <ul className="grid sm:grid-cols-2 gap-2 mb-4">
            {sample.inclusions.map((x) => (<li key={x} className="text-sm text-black/75">• {x}</li>))}
          </ul>
          <div className="flex items-center gap-3">
            <a href={sample.supplier.url} className="px-5 py-3 rounded-xl font-medium" style={{ background: brand.gold, color: brand.green }}>{sample.supplier.cta}</a>
            <button className="px-5 py-3 rounded-xl font-medium border" style={{ borderColor: brand.green, color: brand.green }}>Ask a question</button>
          </div>
          <p className="text-xs text-black/60 mt-4">{sample.terms}</p>
        </div>
      </article>
      <aside className="overflow-hidden" style={cardBase(brand)}>
        <div className="p-6 border-b" style={{ borderColor: brand.stone }}>
          <div className="text-sm" style={{ color: brand.green }}>Client brief</div>
          <div className="text-xs text-black/70">(from your quote request)</div>
        </div>
        <div className="p-6 text-sm">
          <Detail label="Name" value={lead?.name || '—'} />
          <Detail label="Dates" value={lead?.dates || '—'} />
          <Detail label="Travellers" value={`${lead?.adults ?? '?'} adults, ${lead?.children ?? 0} children`} />
          <Detail label="Budget" value={lead?.budget || '—'} />
          <Detail label="Style" value={lead?.style || '—'} />
          <Detail label="Interests" value={(lead?.interests || []).join(', ') || '—'} />
        </div>
      </aside>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: '#eee' }}>
      <div className="text-black/60">{label}</div>
      <div className="font-medium text-black/80">{value}</div>
    </div>
  )
}

function ItineraryVault() {
  const items = [
    { type: 'Flight', title: 'MAD → CDG', time: '12 Oct, 09:45', ref: 'AF1209' },
    { type: 'Hotel', title: 'Le Bristol, Paris', time: '12–15 Oct', ref: '#BR-4821' },
    { type: 'Activity', title: 'Louvre Priority Entry', time: '13 Oct, 14:00', ref: '#L-9930' },
  ]
  return (
    <div className="overflow-hidden" style={cardBase(brand)}>
      <div className="p-6 md:p-8 border-b" style={{ borderColor: brand.stone }}>
        <h3 className="text-2xl font-semibold" style={{ color: brand.ink }}>Itinerary Vault</h3>
        <p className="text-sm text-black/70">Your confirmed plans & documents, all in one place.</p>
      </div>
      <div className="p-6 md:p-8 grid gap-4">
        {items.map((it) => (
          <div key={it.ref} className="flex items-center justify-between p-4 rounded-xl bg-white border" style={{ borderColor: brand.stone }}>
            <div>
              <div className="text-xs font-medium" style={{ color: brand.green }}>{it.type}</div>
              <div className="font-semibold text-black/80">{it.title}</div>
              <div className="text-sm text-black/60">{it.time}</div>
            </div>
            <div className="text-xs text-black/60">Ref: {it.ref}</div>
          </div>
        ))}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-sm text-black/70">Upload tickets, vouchers or PDFs to store securely.</div>
          <button className="px-5 py-3 rounded-xl font-medium" style={{ background: brand.gold, color: brand.green }}>Upload document</button>
        </div>
      </div>
    </div>
  )
}

function ComplianceFooter() {
  return (
    <footer className="p-5 text-[12px] rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', color: '#E8E8E8' }}>
      <p>
        LEXVOYAGE LTD acts as an Independent Travel Agent of InteleTravel UK. All bookings and payments are made via approved
        supplier portals or the InteleTravel back office. ABTA & ATOL protection apply where applicable. Terms & conditions from
        the respective supplier apply.
      </p>
    </footer>
  )
}
