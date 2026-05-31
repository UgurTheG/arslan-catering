import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'
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
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])

  const saalSlides = activeSaal
    ? (activeSaal.bilder ?? []).map((url, i) => ({
        src: url,
        description: activeSaal.bildBeschreibungen?.[i] ?? '',
      }))
    : []

  return (
    <>
      <SectionContainer id="saeale" className="bg-gray-50 dark:bg-gray-900 pt-20">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          label={lang === 'de' ? 'Exklusive Locations' : 'Özel Mekanlar'}
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
                  onClick={() => openSaal(saal)}
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
              <div className="grid grid-cols-2 gap-2 mb-5">
                {activeSaal.bilder.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="relative rounded-lg overflow-hidden aspect-4/3 group cursor-pointer"
                    aria-label={`Bild ${i + 1} vergrößern`}
                  >
                    <img
                      src={url}
                      alt={`${activeSaal.name} ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </button>
                ))}
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
