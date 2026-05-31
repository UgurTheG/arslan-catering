import { motion } from 'framer-motion'
import { Award, Heart, Star } from 'lucide-react'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'

interface Wert {
  id: string
  titel: string
  titelTr?: string
  beschreibung: string
  beschreibungTr?: string
  icon: string
}

interface AboutData {
  titel?: string
  titelTr?: string
  beschreibung?: string
  beschreibungTr?: string
  bildUrl?: string
  werte?: Wert[]
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart size={22} />,
  Star: <Star size={22} />,
  Award: <Award size={22} />,
}

export default function UeberUns() {
  const { ref, isInView, data } = useSectionPage<AboutData>('/data/about.json')
  const { lang } = useLanguage()

  return (
    <>
      <SectionContainer id="ueber-uns" className="bg-white dark:bg-gray-950 pt-20">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          title={t(data?.titel, data?.titelTr, lang) || 'Über uns'}
          description={t(data?.beschreibung, data?.beschreibungTr, lang)}
        />

        {data && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {/* Image + text */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {data.bildUrl ? (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative rounded-2xl overflow-hidden aspect-4/3"
                >
                  <img
                    src={data.bildUrl}
                    alt="Arslan Catering Team"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(201,162,39,0.2)' }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative rounded-2xl aspect-4/3 bg-[#0a0a0a] flex items-center justify-center"
                  style={{ border: '1px solid rgba(201,162,39,0.2)' }}
                >
                  <span className="text-[120px] font-black opacity-10" style={{ color: '#c9a227' }}>
                    AC
                  </span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <div
                  className="w-12 h-1 rounded-full mb-6"
                  style={{ backgroundColor: '#c9a227' }}
                />
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t(data.beschreibung, data.beschreibungTr, lang)}
                </p>
              </motion.div>
            </div>

            {/* Values */}
            {data.werte && data.werte.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.werte.map((wert, i) => (
                  <motion.div
                    key={wert.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gold/30 transition-colors group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-black"
                      style={{ backgroundColor: '#c9a227' }}
                    >
                      {ICON_MAP[wert.icon] ?? <Star size={22} />}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {t(wert.titel, wert.titelTr, lang)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {t(wert.beschreibung, wert.beschreibungTr, lang)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </SectionContainer>
    </>
  )
}
