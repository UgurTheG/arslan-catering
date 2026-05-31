import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Users, ZoomIn } from 'lucide-react'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import { useSheetState } from '@/hooks/useSheetState.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'
import Sheet from '../../Sheet'

import LazyLightboxWrapper from '../../LazyLightboxWrapper'

interface Saal {
  id: string
  name: string
  stadt: string
  kapazitaet?: string
  beschreibung?: string
  beschreibungTr?: string
  bilder?: string[]
  bildBeschreibungen?: string[]
}

interface VenuesData {
  titel?: string
  titelTr?: string
  beschreibung?: string
  beschreibungTr?: string
  saeale?: Saal[]
}

export default function Saeale() {
  const { ref, isInView, data } = useSectionPage<VenuesData>('/data/venues.json')
  const { lang } = useLanguage()
  const { state: activeSaal, set: openSaal, close: closeSaal } = useSheetState<Saal | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])

  const openSaalHandler = useCallback(
    (saal: Saal) => {
      setCurrentImageIndex(0)
      openSaal(saal)
    },
    [openSaal],
  )

  const saalSlides = activeSaal
    ? (activeSaal.bilder ?? []).map((url, i) => ({
        src: url,
        description: activeSaal.bildBeschreibungen?.[i] ?? '',
      }))
    : []

  return (
    <>
      <SectionContainer id="saeale" className="bg-gray-50 dark:bg-gray-900 pt-32">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          title={t(data?.titel, data?.titelTr, lang) || 'Hochzeitssäle'}
          description={t(data?.beschreibung, data?.beschreibungTr, lang)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {!data?.saeale?.length ? (
            <div className="text-center py-16 text-gray-400">
              <p>
                {lang === 'de'
                  ? 'Säle werden in Kürze hinzugefügt.'
                  : 'Salonlar yakında eklenecek.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.saeale.map((saal, i) => (
                <motion.button
                  key={saal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => openSaalHandler(saal)}
                  className="text-left rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-gold/30"
                >
                  <div className="relative aspect-4/3 bg-[#0a0a0a] overflow-hidden">
                    {saal.bilder?.[0] ? (
                      <img
                        src={saal.bilder[0]}
                        alt={saal.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-5xl font-black opacity-10"
                          style={{ color: '#c9a227' }}
                        >
                          AC
                        </span>
                      </div>
                    )}
                    <div
                      className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-black"
                      style={{ backgroundColor: '#c9a227' }}
                    >
                      {saal.stadt}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-gold transition-colors">
                      {saal.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {saal.stadt}
                      </span>
                      {saal.kapazitaet && (
                        <span className="flex items-center gap-1.5">
                          <Users size={13} />
                          {lang === 'de'
                            ? `bis ${saal.kapazitaet} Gäste`
                            : `${saal.kapazitaet} misafir`}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Saal Detail Sheet */}
      <Sheet open={activeSaal !== null} onClose={closeSaal} size="lg">
        {activeSaal && (
          <div className="p-6 pb-safe">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
              {activeSaal.name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-5">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {activeSaal.stadt}
              </span>
              {activeSaal.kapazitaet && (
                <span className="flex items-center gap-1.5">
                  <Users size={13} />
                  {lang === 'de'
                    ? `bis ${activeSaal.kapazitaet} Gäste`
                    : `${activeSaal.kapazitaet} misafir`}
                </span>
              )}
            </div>

            {activeSaal.bilder && activeSaal.bilder.length > 0 && (
              <div className="mb-5">
                {/* Main slider image */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#0a0a0a] mb-2">
                  <button
                    onClick={() => openLightbox(currentImageIndex)}
                    className="absolute inset-0 w-full h-full group"
                    aria-label={`Bild ${currentImageIndex + 1} vergrößern`}
                  >
                    <img
                      src={activeSaal.bilder[currentImageIndex]}
                      alt={`${activeSaal.name} ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn
                        size={28}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                      />
                    </div>
                  </button>

                  {activeSaal.bilder.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            i => (i - 1 + activeSaal.bilder!.length) % activeSaal.bilder!.length,
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                        aria-label="Vorheriges Bild"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(i => (i + 1) % activeSaal.bilder!.length)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                        aria-label="Nächstes Bild"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-2 right-3 text-xs text-white/70 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                        {currentImageIndex + 1} / {activeSaal.bilder.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Dot / thumbnail strip */}
                {activeSaal.bilder.length > 1 && (
                  <div className="flex gap-1.5 justify-center">
                    {activeSaal.bilder.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        aria-label={`Bild ${i + 1}`}
                        className={`rounded overflow-hidden transition-all shrink-0 ${
                          i === currentImageIndex
                            ? 'ring-2 ring-gold opacity-100'
                            : 'opacity-50 hover:opacity-80'
                        }`}
                        style={{ width: 44, height: 32 }}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeSaal.beschreibung || activeSaal.beschreibungTr) && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {t(activeSaal.beschreibung, activeSaal.beschreibungTr, lang)}
              </p>
            )}
          </div>
        )}
      </Sheet>

      <LazyLightboxWrapper
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={saalSlides}
      />
    </>
  )
}
