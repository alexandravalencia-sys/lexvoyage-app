import '@/styles/globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <style jsx global>{`
        h1,h2,h3,h4 { font-family: ${playfair.style.fontFamily}, serif; }
      `}</style>
      <Component {...pageProps} />
    </div>
  )
}
