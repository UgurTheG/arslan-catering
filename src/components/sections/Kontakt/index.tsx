import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'

// WhatsApp SVG kept inline - not in lucide-react
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
  telefon?: string
  mobil?: string
  whatsappNummer?: string
  email?: string
  whatsapp?: string
  adresse?: string
  formspreeUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
}

export default function Kontakt() {
  const { ref, isInView, data } = useSectionPage<KontaktData>('/data/kontakt.json')
  const { lang } = useLanguage()
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [fields, setFields] = useState({ name: '', email: '', nachricht: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data?.formspreeUrl || data.formspreeUrl.includes('placeholder')) return
    setFormState('sending')
    try {
      const res = await fetch(data.formspreeUrl, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      setFormState(res.ok ? 'sent' : 'error')
    } catch {
      setFormState('error')
    }
  }

  const waText = encodeURIComponent(
    lang === 'de'
      ? 'Hallo, ich möchte eine Anfrage stellen.'
      : 'Merhaba, bir sorgu yapmak istiyorum.',
  )
  const whatsappHref = data?.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}?text=${waText}`
    : null

  const labels = {
    name: lang === 'de' ? 'Ihr Name' : 'Adınız',
    email: lang === 'de' ? 'Ihre E-Mail' : 'E-posta adresiniz',
    nachricht: lang === 'de' ? 'Ihre Nachricht' : 'Mesajınız',
    send: lang === 'de' ? 'Nachricht senden' : 'Mesaj gönder',
    sent:
      lang === 'de'
        ? 'Vielen Dank! Wir melden uns bald.'
        : 'Teşekkürler! En kısa sürede döneceğiz.',
    error:
      lang === 'de'
        ? 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
        : 'Gönderme hatası. Lütfen tekrar deneyin.',
    whatsapp: lang === 'de' ? 'Jetzt auf WhatsApp schreiben' : "WhatsApp'tan yaz",
  }

  const contactCards = [
    data?.mobil && {
      icon: <Smartphone size={20} />,
      label: lang === 'de' ? 'Mobil' : 'Mobil',
      value: data.mobil,
      href: `tel:${data.mobil.replace(/\s/g, '')}`,
      color: 'gold',
    },
    data?.email && {
      icon: <Mail size={20} />,
      label: 'E-Mail',
      value: data.email,
      href: `mailto:${data.email}`,
      color: 'gold',
    },
    data?.adresse && {
      icon: <MapPin size={20} />,
      label: lang === 'de' ? 'Adresse' : 'Adres',
      value: data.adresse,
      href: null,
      color: 'gold',
    },
  ].filter(Boolean) as {
    icon: React.ReactNode
    label: string
    value: string
    href: string | null
    color: 'gold' | 'green'
    external?: boolean
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* ── Contact form ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 flex flex-col"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 flex flex-col flex-1 min-h-0">
              {/* Gold top accent bar */}
              <div className="h-1 w-full bg-linear-to-r from-gold via-gold-light to-gold-dark" />

              <div className="p-6 sm:p-10 flex flex-col flex-1 min-h-0">
                {formState === 'sent' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center flex-1 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{labels.sent}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 min-h-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {lang === 'de' ? 'Nachricht schreiben' : 'Mesaj yaz'}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          {labels.name}
                        </label>
                        <input
                          type="text"
                          required
                          value={fields.name}
                          onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          {labels.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={fields.email}
                          onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 min-h-0">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                        {labels.nachricht}
                      </label>
                      <textarea
                        required
                        value={fields.nachricht}
                        onChange={e => setFields(f => ({ ...f, nachricht: e.target.value }))}
                        className="w-full h-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none min-h-28"
                      />
                    </div>

                    {formState === 'error' && (
                      <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                        <AlertCircle size={16} />
                        {labels.error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'sending'}
                      className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-black font-bold text-sm transition-all hover:shadow-xl hover:shadow-gold/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait cursor-pointer mt-auto"
                      style={{ backgroundColor: '#c9a227' }}
                    >
                      <Send size={16} />
                      {formState === 'sending'
                        ? lang === 'de'
                          ? 'Wird gesendet…'
                          : 'Gönderiliyor…'
                        : labels.send}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Contact info sidebar ──────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* WhatsApp CTA - hero card */}
            {whatsappHref && (
              <motion.a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl font-semibold text-white transition-all hover:shadow-2xl hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.99] bg-[#25D366]"
              >
                {/* subtle radial glow */}
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/70 mb-0.5">
                    {lang === 'de' ? 'Direkt chatten' : 'Direkt sohbet'}
                  </p>
                  <p className="font-bold">{labels.whatsapp}</p>
                </div>
              </motion.a>
            )}

            {/* Contact cards */}
            {contactCards.map((card, i) => {
              const isGreen = card.color === 'green'
              const inner = (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
                  className={`group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border transition-all duration-200 shadow-sm hover:shadow-md ${
                    isGreen
                      ? 'border-green-100 dark:border-green-900/40 hover:border-green-300 dark:hover:border-green-700'
                      : 'border-gray-100 dark:border-gray-700 hover:border-gold/40 dark:hover:border-gold/30'
                  }`}
                >
                  {/* Icon bubble */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      isGreen ? 'bg-green-500 text-white' : 'bg-gold/10 dark:bg-gold/15 text-gold'
                    }`}
                  >
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
                      {card.label}
                    </p>
                    {card.value.split('\n').map((line, li) => (
                      <p
                        key={li}
                        className={`font-semibold text-sm break-all leading-snug transition-colors ${
                          isGreen
                            ? 'text-gray-900 dark:text-white group-hover:text-green-500'
                            : 'text-gray-900 dark:text-white group-hover:text-gold'
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  {/* Arrow hint */}
                  {card.href && (
                    <div
                      className={`ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isGreen ? 'text-green-500' : 'text-gold'}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )

              return card.href ? (
                <a
                  key={card.label}
                  href={card.href}
                  {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {inner}
                </a>
              ) : (
                <div key={card.label}>{inner}</div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
