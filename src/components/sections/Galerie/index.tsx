import { useState, useCallback } from 'react'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'
import LazyLightboxWrapper from '../../LazyLightboxWrapper'

interface GalerieBild {
  id: string
  url: string
  beschreibung?: string
  beschreibungTr?: string
}

interface GalerieData {
  titel?: string
  titelTr?: string
  beschreibung?: string
  beschreibungTr?: string
  bilder?: GalerieBild[]
}

export default function Galerie() {
  const { ref, isInView, data } = useSectionPage<GalerieData>('/data/galerie.json')
  const { lang } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const slides = (data?.bilder ?? []).map(b => ({
    src: b.url,
    description: t(b.beschreibung, b.beschreibungTr, lang),
  }))

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])

  return (
    <>
      <SectionContainer id="galerie" className="bg-white dark:bg-gray-950 pt-20">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          label={lang === 'de' ? 'Galerie' : 'Galeri'}
          title={t(data?.titel, data?.titelTr, lang) || 'Galerie'}
          description={t(data?.beschreibung, data?.beschreibungTr, lang)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {slides.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">
                {lang === 'de'
                  ? 'Bilder werden in Kürze hinzugefügt.'
                  : 'Yakında resimler eklenecek.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  aria-label={`Bild ${i + 1} vergrößern`}
                >
                  <img
                    src={slide.src}
                    alt={slide.description || `Dekoration ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: 'inset 0 0 0 2px rgba(201,162,39,0.6)' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      <LazyLightboxWrapper
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </>
  )
}
