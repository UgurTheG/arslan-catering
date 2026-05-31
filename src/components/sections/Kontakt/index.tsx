import { motion } from 'framer-motion'
import { Smartphone, Mail } from 'lucide-react'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

interface KontaktData {
  titel?: string
  titelTr?: string
  beschreibung?: string
  beschreibungTr?: string
  mobil?: string
  email?: string
  whatsapp?: string
}

export default function Kontakt() {
  const { ref, isInView, data } = useSectionPage<KontaktData>('/data/kontakt.json')
  const { lang } = useLanguage()

  const waText = encodeURIComponent(
    lang === 'de'
      ? 'Hallo, ich möchte eine Anfrage stellen.'
      : 'Merhaba, bir sorgu yapmak istiyorum.',
  )
  const whatsappHref = data?.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}?text=${waText}`
    : null

  const whatsappLabel = lang === 'de' ? 'Jetzt auf WhatsApp schreiben' : "WhatsApp'tan yaz"

  const contactCards = [
    data?.mobil && {
      icon: <Smartphone size={20} />,
      label: lang === 'de' ? 'Mobil' : 'Mobil',
      value: data.mobil,
      href: `tel:${data.mobil.replace(/\s/g, '')}`,
    },
    data?.email && {
      icon: <Mail size={20} />,
      label: 'E-Mail',
      value: data.email,
      href: `mailto:${data.email}`,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode
    label: string
    value: string
    href: string
  }[]

  return (
    <SectionContainer id="kontakt" className="bg-gray-50 dark:bg-gray-900/50 pt-32">
      <SectionHeader
        sectionRef={ref}
        isInView={isInView}
        label={lang === 'de' ? 'Wir sind für Sie da' : 'Sizin için buradayız'}
        title={t(data?.titel, data?.titelTr, lang) || 'Kontakt'}
        description={t(data?.beschreibung, data?.beschreibungTr, lang)}
      />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col gap-4">
          {/* WhatsApp CTA */}
          {whatsappHref && (
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl font-semibold text-white transition-all hover:shadow-2xl hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.99] bg-[#25D366]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 mb-0.5">
                  {lang === 'de' ? 'Direkt chatten' : 'Direkt sohbet'}
                </p>
                <p className="font-bold">{whatsappLabel}</p>
              </div>
            </motion.a>
          )}

          {/* Contact cards */}
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gold/10 dark:bg-gold/15 text-gold transition-transform group-hover:scale-110">
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
                  {card.label}
                </p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-gold transition-colors">
                  {card.value}
                </p>
              </div>
              <div className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
