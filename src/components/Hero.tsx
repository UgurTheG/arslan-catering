import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Moon, Phone, Sun } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { useNavigateTo } from '../hooks/useNavigateTo'
import { useLanguage, t } from '../hooks/useLanguage'
import { useData } from '../hooks/useData'

interface StartseiteData {
  heroTitel?: string
  heroTitelTr?: string
  heroUntertitel?: string
  heroUntertitelTr?: string
  heroBildUrl?: string
  heroVideoUrl?: string
}

const NAV_ITEMS = [
  { id: 'ueber-uns', label: { de: 'Über uns', tr: 'Hakkımızda' } },
  { id: 'galerie', label: { de: 'Galerie', tr: 'Galeri' } },
  { id: 'saeale', label: { de: 'Hochzeitssäle', tr: 'Düğün Salonları' } },
  { id: 'videos', label: { de: 'Videos', tr: 'Videolar' } },
  { id: 'kontakt', label: { de: 'Kontakt', tr: 'İletişim' } },
]

export default function Hero() {
  const navigateTo = useNavigateTo()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { lang, toggle: toggleLang } = useLanguage()
  const { data } = useData<StartseiteData>('/data/startseite.json')
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -160])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const titel = t(data?.heroTitel, data?.heroTitelTr, lang) || 'Ihr Traumhochzeit.'
  const untertitel =
    t(data?.heroUntertitel, data?.heroUntertitelTr, lang) || 'Wir gestalten unvergessliche Momente.'
  const heroBild = data?.heroBildUrl
  const heroVideo = data?.heroVideoUrl

  return (
    <section ref={ref} id="hero" className="relative h-screen min-h-150 overflow-hidden">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
          aria-label={lang === 'de' ? 'Türkçeye geç' : 'Auf Deutsch wechseln'}
        >
          {lang === 'de' ? 'TR' : 'DE'}
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dark mode umschalten"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Background */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        {heroVideo ? (
          <>
            {/* Blurred background fill - covers the side/top bars on non-matching aspect ratios */}
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/50" />
            {/* Sharp foreground video - always fully visible */}
            <video
              src={heroVideo}
              poster={heroBild}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : heroBild ? (
          <>
            <img
              src={heroBild}
              alt="Hochzeit Dekoration"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <>
            {/* Default: elegant dark gradient with gold shimmer */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,162,39,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 100%, rgba(201,162,39,0.10) 0%, transparent 50%)',
              }}
            />
            {/* Subtle grid */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#c9a227" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* Decorative rings */}
            <div
              className="absolute -top-40 -right-40 w-150 h-150 rounded-full opacity-10"
              style={{ border: '1px solid #c9a227' }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-125 h-125 rounded-full opacity-[0.06]"
              style={{ border: '1px solid #c9a227' }}
            />
            {/* Watermark text */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="text-[22vw] font-black tracking-tighter leading-none opacity-[0.025]"
                style={{ color: '#c9a227' }}
              >
                AC
              </span>
            </div>
          </>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
      >
        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="h-px w-10 bg-gold/50" aria-hidden="true" />
          <span
            className="text-sm font-bold tracking-[0.25em] uppercase"
            style={{ color: '#c9a227' }}
          >
            Arslan Catering &amp; Events
          </span>
          <div className="h-px w-10 bg-gold/50" aria-hidden="true" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-6"
        >
          {titel.split('.').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span style={{ color: '#c9a227' }}>.</span>
              </span>
            ) : (
              part && <span key={i}>{part}</span>
            ),
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-white/70 max-w-xl mb-12 font-light leading-relaxed"
        >
          {untertitel}
        </motion.p>

        {/* Nav pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-2.5 mb-8"
        >
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateTo(item.id)}
              className="backdrop-blur-sm bg-white/10 border border-white/20 text-white font-medium px-5 py-2.5 min-h-11 rounded-full text-sm transition-all hover:bg-white/20 hover:border-white/40 cursor-pointer"
            >
              {item.label[lang]}
            </motion.button>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-3 mb-6 w-56"
          aria-hidden="true"
        >
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-[11px] text-white/35 font-medium tracking-wide">
            {lang === 'de' ? 'oder' : 'veya'}
          </span>
          <div className="flex-1 h-px bg-white/15" />
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateTo('kontakt')}
          className="inline-flex items-center gap-2 text-black font-semibold px-8 py-3 min-h-12 rounded-full text-sm transition-all cursor-pointer shadow-lg shadow-gold/20 hover:shadow-gold/40"
          style={{ backgroundColor: '#c9a227' }}
        >
          <Phone size={15} strokeWidth={2.5} />
          {lang === 'de' ? 'Jetzt anfragen' : 'Hemen sorgulayın'}
        </motion.button>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

      {/* Scroll indicator */}
      <motion.button
        onClick={() => navigateTo('ueber-uns')}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors z-20 cursor-pointer min-w-11 min-h-11 flex items-center justify-center"
        aria-label="Nach unten scrollen"
      >
        <ChevronDown size={34} strokeWidth={1.5} />
      </motion.button>
    </section>
  )
}
