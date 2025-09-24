import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabaseClient'
const supabase = getSupabase()

const brand = {
  green: '#0E3A2F',
  gold:  '#B39449',
  paper: '#FAF9F6',
  ink:   '#0E0F11',
  stone: '#E7E2D6',
}

const cardBase = () => ({
  background: '#fff',
  color: brand.ink,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
})

export default function AppShell() {
  const [screen, setScreen] = useState('home')
  const [lead, setLead] = useState(null)
  const [user, setUser] = useState(null)

 useEffect(() => {
   if (!supabase) return
   supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
   const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => setUser(session?.user ?? null))
   return () => sub?.subscription?.unsubscribe?.()
}, [supabase])

  const go = (id) => () => setScreen(id)

  const NavLink = ({ id, label }) => (
    <button
      onClick={go(id)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${screen===id?'bg-[var(--brand-gold)] text-[var(--brand-green)]':'bg-transparent text-white hover:bg-white/10'}`}
      aria-current={screen===id?'page':undefined}
    >{label}</button>
  )

 const AuthButtons = () => (
   <div className="flex items-center gap-2">
     {supabase ? (
       user ? (
         <button className="btn btn-outline" onClick={async()=>{ await supabase.auth.signOut(); }}>Sign out</button>
       ) : (
         <button className="btn btn-outline" onClick={go('login')}>Client Login</button>
       )
     ) : (
       <span className="text-white/70 text-sm">Login unavailable</span>
     )}
   </div>
 )

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${brand.green} 0%, #0C2F25 40%, ${brand.paper} 40%)` }}>
      <header className="w-full sticky top-0 z-30" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)'}}>
        <div className="container flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="LEXVOYAGE" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold tracking-[0.18em]">LEXVOYAGE</h1>
              <p className="text-white/80 text-xs">Independent Travel Agent of InteleTravel UK</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink id="home" label="Home" />
            <NavLink id="quote" label="Request a Quote" />
            <NavLink id="proposal" label="Proposal" />
            <NavLink id="itinerary" label="Itinerary Vault" />
            <AuthButtons />
          </nav>
        </div>
      </header>

      <main className="container py-10">
        <AnimatePresence mode="wait">
          {screen==='home' && (
            <motion.section key="home" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}} className="grid gap-8">
              <Hero onQuote={go('quote')} />
              <Collections onRequestQuote={go('quote')} />
              <Assurances />
            </motion.section>
          )}

          {screen==='login' && (
            <motion.section key="login" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}}>
              <LoginCard />
            </motion.section>
          )}

          {screen==='quote' && (
            <motion.section key="quote" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}}>
              <QuoteForm onSubmitted={(lead) => { setLead(lead); setScreen('proposal'); }} />
            </motion.section>
          )}

          {screen==='proposal' && (
            <motion.section key="proposal" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}} className="grid gap-6">
              <Proposal lead={lead} />
              <ComplianceFooter />
            </motion.section>
          )}

          {screen==='itinerary' && (
            <motion.section key="itinerary" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35}} className="grid gap-6">
              <ItineraryVault user={user} />
              <ComplianceFooter />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function Hero({ onQuote }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-10 flex flex-col gap-5">
          <div className="text-xs tracking-widest text-[var(--brand-green)]">PREMIUM TRAVEL, PERSONALISED</div>
          <h2 className="text-3xl md:text-5xl font-semibold">Curated escapes by LEXVOYAGE</h2>
          <p className="text-base text-black/70">
            Bespoke holidays, cruise journeys and city breaks. Book with confidence via our approved supplier portals and enjoy ABTA & ATOL protection where applicable.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={onQuote} className="btn btn-primary">Request a Quote</button>
            <a href="#collections" className="btn btn-outline">Explore Collections</a>
          </div>
        </div>
        <div className="min-h-[300px]" style={{background:"url(https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop) center/cover"}} />
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
        <article key={it.title} className="card">
          <div className="h-44" style={{ background: `url(${it.img}) center/cover` }} />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-1">{it.title}</h3>
            <p className="text-sm text-black/70 mb-4">{it.copy}</p>
            <button onClick={onRequestQuote} className="btn btn-primary">Get a tailored quote</button>
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
        <div key={a.h} className="p-6 card">
          <div className="text-sm text-[var(--brand-green)]">{a.h}</div>
          <div className="text-base text-black/80">{a.p}</div>
        </div>
      ))}
    </div>
  )
}

function LoginCard() {
  const s = getSupabase()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
   if (!s) { alert('Login is temporarily disabled.'); return }
   const { error } = await s.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
    if (!error) setSent(true); else alert(error.message)
  }
  return (
    <div className="max-w-md mx-auto card p-8">
      <h3 className="text-2xl font-semibold mb-2">Client Login</h3>
      <p className="text-sm text-black/70 mb-4">Enter your email to receive a magic sign-in link.</p>
      {sent ? <p className="text-sm text-[var(--brand-green)]">Check your inbox for the magic link.</p> : (
        <form onSubmit={submit} className="grid gap-3">
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" placeholder="you@email.com" />
          <button className="btn btn-primary" type="submit">Send magic link</button>
        </form>
      )}
    </div>
  )
}

function Field({ label, helper, children }) {
  return (
    <label className="block">
      <div className="text-xs font-medium mb-1 text-[var(--brand-green)]">{label}</div>
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
    >{label}</button>
  )
}

function QuoteForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dates: '',
    adults: 2, children: 0, budget: '', style: 'Luxury', interests: ['City']
  })
  const [status, setStatus] = useState('idle')
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead: form }) })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent'); onSubmitted?.(form)
    } catch (e) {
      setStatus('error'); alert('Sorry—could not send.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto card">
      <div className="p-8 border-b" style={{ borderColor: brand.stone }}>
        <h3 className="text-3xl font-semibold">Request a Quote</h3>
        <p className="text-sm text-black/70">Tell us what you’re dreaming of—we’ll curate options from our preferred partners.</p>
      </div>
      <form className="p-8 grid md:grid-cols-2 gap-4" onSubmit={submit}>
        <Field label="Full name"><input required value={form.name} onChange={(e)=>update('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Email"><input type="email" required value={form.email} onChange={(e)=>update('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Phone (optional)"><input value={form.phone} onChange={(e)=>update('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Dates / flexibility"><input placeholder="e.g., 12–19 Oct (±3 days)" value={form.dates} onChange={(e)=>update('dates', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Adults"><input type="number" min={1} value={form.adults} onChange={(e)=>update('adults', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Children"><input type="number" min={0} value={form.children} onChange={(e)=>update('children', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Budget (total)"><input placeholder="e.g., £3,000" value={form.budget} onChange={(e)=>update('budget', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border" /></Field>
        <Field label="Style">
          <select value={form.style} onChange={(e)=>update('style', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white outline-none border">
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
          <button disabled={status==='sending'} type="submit" className="btn btn-primary">{status==='sending'?'Sending…':'Submit'}</button>
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
  inclusions: [
    'Flights from London',
    'All-inclusive dining',
    'Private transfers',
    'Balcony stateroom',
  ],
  terms:
    'Subject to availability. Pricing may vary by date and cabin category. Supplier T&Cs apply.',
  supplier: {
    name: 'Celebrity Central',
    cta: 'Book Now',
    url:
      process.env.NEXT_PUBLIC_BOOK_URL ||
      'https://www.celebritycruises.co.uk',
  },
  askTo: (lead) => {
    const inbox =
      process.env.NEXT_PUBLIC_SALES_INBOX ||
      'alexandravalencia.traveladvisor@gmail.com'
    const subj = 'Question about: 7-Night Caribbean Cruise (Celebrity)'
    const body = `Hi LEXVOYAGE,%0D%0A%0D%0AMy name is ${
      encodeURIComponent(lead?.name || '')
    }. I have a question about this proposal.%0D%0A`
    return `mailto:${inbox}?subject=${encodeURIComponent(subj)}&body=${body}`
  },
}), [])

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: '#eee' }}>
      <div className="text-black/60">{label}</div>
      <div className="font-medium text-black/80">{value}</div>
    </div>
  )
}

function ItineraryVault({ user }) {
  const s = getSupabase()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

 useEffect(() => {
   if (!s || !user) return
   refresh()
 }, [s, user])

  async function refresh() {
    setLoading(true)
    if (!s || !user) return
   const { data, error } = await s.storage.from('documents').list(user.id, { sortBy: { column: 'created_at', order: 'desc' } })
    if (!error) setFiles(data || [])
    setLoading(false)
  }

  async function upload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const path = `${user.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: false })
    if (error) return alert(error.message)
    refresh()
  }

  async function openFile(name) {
    const path = `${user.id}/${name}`
    if (!s || !user) return
   const { error } = await s.storage.from('documents').upload(path, file, { upsert: false })
    if (error) return alert(error.message)
    window.open(data.signedUrl, '_blank')
  }

   if (!s) {
   return <div className="card p-8"><h3 className="text-2xl font-semibold mb-2">Itinerary Vault</h3><p className="text-sm text-black/70">Vault will be available once Supabase is configured.</p></div>
 }
  if (!user) {
    return (
      <div className="card p-8">
        <h3 className="text-2xl font-semibold mb-2">Itinerary Vault</h3>
        <p className="text-sm text-black/70">Please sign in via <em>Client Login</em> to view your documents.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="p-8 border-b flex items-center justify-between" style={{ borderColor: brand.stone }}>
        <div>
          <h3 className="text-2xl font-semibold">Itinerary Vault</h3>
          <p className="text-sm text-black/70">Your confirmed plans & documents, secured to your account.</p>
        </div>
        <label className="btn btn-primary cursor-pointer">
          Upload document
          <input type="file" className="hidden" onChange={upload} />
        </label>
      </div>
      <div className="p-8 grid gap-3">
        {loading && <div className="text-sm text-black/60">Loading…</div>}
        {!loading && files.length === 0 && <div className="text-sm text-black/60">No documents yet.</div>}
        {files.map((f) => (
          <div key={f.name} className="flex items-center justify-between p-4 rounded-xl bg-white border" style={{ borderColor: brand.stone }}>
            <div>
              <div className="font-medium text-black/80">{f.name.split('-').slice(1).join('-')}</div>
              <div className="text-xs text-black/60">{new Date(f.created_at).toLocaleString()}</div>
            </div>
            <button className="btn btn-outline" onClick={()=>openFile(f.name)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComplianceFooter() {
  return (
    <footer className="p-5 text-[12px] rounded-2xl" style={{ background: 'rgba(0,0,0,0.06)', color: '#1f2937' }}>
      <p>
        LEXVOYAGE LTD acts as an Independent Travel Agent of InteleTravel UK. All bookings and payments are made via approved
        supplier portals or the InteleTravel back office. ABTA & ATOL protection apply where applicable. Terms & conditions from
        the respective supplier apply.
      </p>
    </footer>
  )
}
