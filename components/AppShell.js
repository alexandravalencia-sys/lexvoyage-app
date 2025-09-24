// components/AppShell.js
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabaseClient'

/* ----------------------------- UI primitives ----------------------------- */

const Section = ({ children, className = '' }) => (
  <section className={`max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>{children}</section>
)

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm ring-1 ring-black/5 ${className}`}>
    {children}
  </div>
)

const Button = ({ children, className = '', ...props }) => (
  <button
    className={
      'rounded-xl px-4 py-2 text-sm font-semibold transition ' +
      'bg-[#B39449] text-white hover:bg-[#a4863f] disabled:opacity-50 ' +
      className
    }
    {...props}
  >
    {children}
  </button>
)

const ButtonOutline = ({ children, className = '', ...props }) => (
  <button
    className={
      'rounded-xl px-4 py-2 text-sm font-semibold transition ' +
      'border border-black/10 text-[#134231] hover:bg-black/5 ' +
      className
    }
    {...props}
  >
    {children}
  </button>
)

/* --------------------------------- Shell --------------------------------- */

export default function AppShell() {
  const [view, setView] = useState('home') // 'home' | 'quote' | 'proposal' | 'login' | 'vault'
  const [lead, setLead] = useState(null)   // last submitted lead (for Proposal "Client brief")
  const [user, setUser] = useState(null)

  const supabase = getSupabase()

  // auth listener (guarded if supabase not configured yet)
  useEffect(() => {
    if (!supabase) return
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data?.user ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [supabase])

  const go = (v) => () => setView(v)

  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      {/* Top bar */}
      <div className="bg-[#0e2c25] text-white sticky top-0 z-20">
        <Section className="py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="LEXVOYAGE" width={34} height={34} />
              <span className="text-xl font-semibold tracking-wide">LEXVOYAGE</span>
            </div>
            <nav className="hidden sm:flex gap-4">
              <NavLink active={view === 'home'} onClick={go('home')}>Home</NavLink>
              <NavLink active={view === 'quote'} onClick={go('quote')}>Request a Quote</NavLink>
              <NavLink active={view === 'proposal'} onClick={go('proposal')}>Proposal</NavLink>
              <NavLink active={view === 'vault'} onClick={go('vault')}>Itinerary Vault</NavLink>
            </nav>
            <div className="ml-auto">
              {supabase ? (
                user ? (
                  <ButtonOutline
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setView('home')
                    }}
                  >
                    Sign out
                  </ButtonOutline>
                ) : (
                  <ButtonOutline onClick={go('login')}>Client Login</ButtonOutline>
                )
              ) : (
                <span className="text-white/70 text-sm">Login unavailable</span>
              )}
            </div>
          </div>
        </Section>
      </div>

      {/* Header band */}
      <div className="bg-gradient-to-b from-[#0e2c25] to-[#123a31] text-white">
        <Section className="py-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-5xl font-serif"
          >
            Navigating the world, one experience at a time.
          </motion.h1>
          <p className="mt-3 text-white/80 max-w-3xl">
            Bespoke journeys curated with care. ABTA &amp; ATOL protected where applicable.
          </p>
        </Section>
      </div>

      {/* Main views */}
      <main className="py-10">
        <Section className="space-y-8">
          {view === 'home' && <Home go={go} />}

          {view === 'quote' && (
            <QuoteForm
              onSubmitted={(payload) => {
                setLead(payload)
                setView('proposal')
              }}
            />
          )}

          {view === 'proposal' && <Proposal lead={lead} />}

          {view === 'login' && <LoginCard />}

          {view === 'vault' && <ItineraryVault user={user} />}
        </Section>
      </main>

      <footer className="py-10 text-center text-xs text-black/50">
        © {new Date().getFullYear()} LEXVOYAGE — Independent Travel Agent of InteleTravel UK. ABTA & ATOL protected where applicable.
      </footer>
    </div>
  )
}

function NavLink({ active, children, ...props }) {
  return (
    <button
      className={
        'px-4 py-2 rounded-full font-medium transition ' +
        (active ? 'bg-[#B39449] text-black' : 'text-white/90 hover:text-white hover:bg-white/5')
      }
      {...props}
    >
      {children}
    </button>
  )
}

/* --------------------------------- Home ---------------------------------- */

function Home({ go }) {
  return (
    <>
      <Card className="p-8">
        <h2 className="text-2xl font-serif mb-2">Curated escapes by LEXVOYAGE</h2>
        <p className="text-black/70">
          From chic city weekends to indulgent cruises. Book with confidence via approved supplier
          portals and enjoy ABTA &amp; ATOL protection where applicable.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={go('quote')}>Request a Quote</Button>
          <ButtonOutline onClick={go('proposal')}>Explore a Sample Proposal</ButtonOutline>
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { title: 'Paris Weekends', blurb: 'Boutique dining, museum passes, chic stays.' },
          { title: 'Caribbean Escapes', blurb: 'All-inclusive resorts & family-friendly fun.' },
          { title: 'Luxury Cruises', blurb: 'Celebrity, Cunard, Royal Caribbean & more.' },
        ].map((x) => (
          <Card key={x.title} className="p-6">
            <h3 className="text-lg font-semibold">{x.title}</h3>
            <p className="text-sm text-black/70 mt-2">{x.blurb}</p>
            <div className="mt-4">
              <ButtonOutline onClick={go('quote')}>Get a tailored quote</ButtonOutline>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

/* ------------------------------- Quote Form ------------------------------ */

function QuoteForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    adults: 2,
    children: 0,
    budget: '',
    style: 'Luxury',
    interests: ['City'],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e?.target?.value ?? e }))

  const toggleInterest = (tag) =>
    setForm((f) => {
      const has = f.interests.includes(tag)
      return { ...f, interests: has ? f.interests.filter((t) => t !== tag) : [...f.interests, tag] }
    })

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to submit')
      onSubmitted?.(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const tags = ['City', 'Beach', 'Cruise', 'Nature', 'Food', 'Wine', 'Culture', 'Theme', 'Parks']

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-3xl font-serif mb-1">Request a Quote</h2>
      <p className="text-black/70 mb-6">
        Tell us what you’re dreaming of—we’ll curate options from our preferred partners.
      </p>

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <L label="Full name">
          <input className="input" required value={form.name} onChange={set('name')} />
        </L>
        <L label="Email">
          <input className="input" required type="email" value={form.email} onChange={set('email')} />
        </L>

        <L label="Phone (optional)">
          <input className="input" value={form.phone} onChange={set('phone')} />
        </L>
        <L label="Dates / flexibility">
          <input
            className="input"
            placeholder="e.g., 12–19 Oct (±3 days)"
            value={form.dates}
            onChange={set('dates')}
          />
        </L>

        <L label="Adults">
          <input className="input" type="number" min="1" value={form.adults} onChange={set('adults')} />
        </L>
        <L label="Children">
          <input className="input" type="number" min="0" value={form.children} onChange={set('children')} />
        </L>

        <L label="Budget (total)">
          <input className="input" placeholder="e.g., £3,000" value={form.budget} onChange={set('budget')} />
        </L>
        <L label="Style">
          <select className="input" value={form.style} onChange={set('style')}>
            {['Luxury', 'Boutique', 'Family', 'Adventure'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </L>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleInterest(t)}
                className={
                  'px-3 py-1 rounded-full border text-sm ' +
                  (form.interests.includes(t)
                    ? 'bg-[#134231] border-[#134231] text-white'
                    : 'border-black/15 text-black/70 hover:bg-black/5')
                }
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-black/50 mt-2">Select all that apply</p>
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <Button disabled={submitting} type="submit">
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
      </form>
    </Card>
  )
}

/* -------------------------------- Proposal ------------------------------- */

function Proposal({ lead }) {
  // Sample supplier card
  const sample = useMemo(
    () => ({
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
          'alexandravalencia.inteletravel.uk',
      },
      askTo: (currentLead) => {
        const inbox =
          process.env.NEXT_PUBLIC_SALES_INBOX ||
          'alexandravalencia.traveladvisor@gmail.com'
        const subj = 'Question about: 7-Night Caribbean Cruise (Celebrity)'
        const body = `Dear LEXVOYAGE,%0D%0A%0D%0AMy name is ${
          encodeURIComponent(currentLead?.name || '')
        }. I have a question about this proposal.%0D%0A`
        return `mailto:${inbox}?subject=${encodeURIComponent(subj)}&body=${body}`
      },
    }),
    []
  )

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <Card className="overflow-hidden">
        <div className="aspect-[21/9] w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sample.img} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-serif">{sample.title}</h3>
          <p className="text-black/70 mt-1">{sample.price}</p>

          <ul className="grid sm:grid-cols-2 gap-3 mt-6 text-sm">
            {sample.inclusions.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#134231]" />
                {i}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <a
              href={sample.supplier.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <Button>{sample.supplier.cta}</Button>
            </a>
            <a href={sample.askTo(lead || {})} className="inline-block">
              <ButtonOutline>Ask a question</ButtonOutline>
            </a>
          </div>

          <p className="text-xs text-black/50 mt-6">{sample.terms}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold">Client brief</h4>
        <p className="text-sm text-black/60 mb-4">(from your quote request)</p>
        <dl className="space-y-3 text-sm">
          <BriefRow label="Name" value={lead?.name || '—'} />
          <BriefRow label="Dates" value={lead?.dates || '—'} />
          <BriefRow
            label="Travellers"
            value={`${lead?.adults ?? '?'} adults, ${lead?.children ?? 0} children`}
          />
          <BriefRow label="Budget" value={lead?.budget || '—'} />
          <BriefRow label="Style" value={lead?.style || '—'} />
          <BriefRow
            label="Interests"
            value={(lead?.interests || []).join(', ') || '—'}
          />
        </dl>
      </Card>
    </div>
  )
}

const BriefRow = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr]">
    <dt className="text-black/60">{label}</dt>
    <dd>{value}</dd>
  </div>
)

/* --------------------------------- Login --------------------------------- */

function LoginCard() {
  const s = getSupabase()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!s) {
      setError('Login is temporarily unavailable.')
      return
    }
    const { error } = await s.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <Card className="p-6 sm:p-8 max-w-xl">
      <h3 className="text-2xl font-serif mb-2">Client Login</h3>
      <p className="text-black/70 mb-6">
        Enter your email to receive a magic link to your Itinerary Vault.
      </p>
      {sent ? (
        <div className="text-sm">Magic link sent to <b>{email}</b>. Please check your inbox.</div>
      ) : (
        <form onSubmit={submit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input flex-1"
            placeholder="you@example.com"
          />
          <Button type="submit">Send link</Button>
        </form>
      )}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </Card>
  )
}

/* ------------------------------- Vault (S3) ------------------------------- */

function ItineraryVault({ user }) {
  const s = getSupabase()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!s || !user) return
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, user])

  async function refresh() {
    if (!s || !user) return
    setLoading(true)
    const { data, error } = await s
      .storage
      .from('documents')
      .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } })
    if (!error) setFiles(data || [])
    setLoading(false)
  }

  async function upload(e) {
    if (!s || !user) return
    const file = e.target.files?.[0]
    if (!file) return
    const path = `${user.id}/${Date.now()}_${file.name}`
    const { error } = await s.storage.from('documents').upload(path, file, { upsert: false })
    if (!error) refresh()
  }

  async function openFile(name) {
    if (!s || !user) return
    const path = `${user.id}/${name}`
    const { data, error } = await s.storage.from('documents').createSignedUrl(path, 60 * 10)
    if (!error && data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (!s) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-2">Itinerary Vault</h3>
        <p className="text-sm text-black/70">
          Vault will be available once Supabase is configured.
        </p>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-2">Itinerary Vault</h3>
        <p className="text-sm text-black/70">Please sign in to access your documents.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Itinerary Vault</h3>
          <p className="text-sm text-black/60">Upload and access your trip documents securely.</p>
        </div>
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={upload} />
          <Button>Upload document</Button>
        </label>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-black/60">Loading…</p>
        ) : files?.length ? (
          <ul className="divide-y divide-black/5">
            {files.map((f) => (
              <li key={f.name} className="py-3 flex items-center justify-between">
                <span className="text-sm">{f.name}</span>
                <ButtonOutline onClick={() => openFile(f.name)}>Open</ButtonOutline>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-black/60">No documents yet.</p>
        )}
      </div>
    </Card>
  )
}

/* ---------------------------- Small form helper --------------------------- */

function L({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
      <style jsx>{`
        .input {
          @apply w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none
                 focus:ring-2 focus:ring-[#134231] focus:border-[#134231];
        }
      `}</style>
    </label>
  )
}
