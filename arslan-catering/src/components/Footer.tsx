import { Mail, Phone } from 'lucide-react'
import { useData } from '../hooks/useData'
import { useNavigateTo } from '../hooks/useNavigateTo'
import { useLanguage, t } from '../hooks/useLanguage'

interface KontaktData {
  email?: string
  telefon?: string
  whatsapp?: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  footerBeschreibung?: string
  footerBeschreibungTr?: string
}

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
  </svg>
)

export default function Footer() {
  const navigateTo = useNavigateTo()
  const { lang } = useLanguage()
  const { data } = useData<KontaktData>('/data/kontakt.json')
  const year = new Date().getFullYear()

  const email = data?.email ?? 'info@arslan-catering.de'
  const telefon = data?.telefon ?? ''
  const beschreibung = t(data?.footerBeschreibung, data?.footerBeschreibungTr, lang)

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-gold font-black text-sm tracking-tighter">AC</span>
              </div>
              <span className="font-black text-white text-xl tracking-tight">Arslan Catering</span>
            </div>
            {beschreibung && (
              <p className="text-sm leading-relaxed mb-4 max-w-xs">{beschreibung}</p>
            )}
            <div className="flex flex-col gap-2 mb-5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-gold transition-colors"
                >
                  <Mail size={14} />
                  {email}
                </a>
              )}
              {telefon && (
                <a
                  href={`tel:${telefon.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-gold transition-colors"
                >
                  <Phone size={14} />
                  {telefon}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {data?.instagramUrl && (
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 bg-gray-800 hover:bg-gold rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all duration-200"
                >
                  <InstagramIcon />
                </a>
              )}
              {data?.facebookUrl && (
                <a
                  href={data.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 bg-gray-800 hover:bg-gold rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all duration-200"
                >
                  <FacebookIcon />
                </a>
              )}
              {data?.tiktokUrl && (
                <a
                  href={data.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 bg-gray-800 hover:bg-gold rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all duration-200"
                >
                  <TikTokIcon />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-bold text-sm mb-5 uppercase tracking-wide">
              {lang === 'de' ? 'Navigation' : 'Navigasyon'}
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                { id: 'ueber-uns', de: 'Über uns', tr: 'Hakkımızda' },
                { id: 'galerie', de: 'Galerie', tr: 'Galeri' },
                { id: 'saeale', de: 'Hochzeitssäle', tr: 'Düğün Salonları' },
                { id: 'videos', de: 'Videos', tr: 'Videolar' },
                { id: 'kontakt', de: 'Kontakt', tr: 'İletişim' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="text-left hover:text-gold transition-colors"
                >
                  {lang === 'de' ? item.de : item.tr}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {year} Arslan Catering &amp; Events. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4 text-xs">
            <button
              onClick={() => navigateTo('impressum')}
              className="hover:text-gold transition-colors"
            >
              Impressum
            </button>
            <button
              onClick={() => navigateTo('datenschutz')}
              className="hover:text-gold transition-colors"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
