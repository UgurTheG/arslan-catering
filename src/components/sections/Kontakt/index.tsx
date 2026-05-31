import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSectionPage } from '@/hooks/useSectionPage.ts'
import { useLanguage, t } from '@/hooks/useLanguage.ts'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'

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

  const whatsappHref = data?.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'de' ? 'Hallo, ich möchte eine Anfrage stellen.' : 'Merhaba, bir sorgu yapmak istiyorum.')}`
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
    whatsapp: lang === 'de' ? 'WhatsApp schreiben' : 'WhatsApp yaz',
  }

  return (
    <>
      <SectionContainer id="kontakt" className="bg-gray-50 dark:bg-gray-900 pt-32">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          label={lang === 'de' ? 'Wir sind für Sie da' : 'Sizin için buradayız'}
          title={t(data?.titel, data?.titelTr, lang) || 'Kontakt'}
          description={t(data?.beschreibung, data?.beschreibungTr, lang)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              {formState === 'sent' ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {labels.sent}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {labels.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={fields.name}
                      onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {labels.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={fields.email}
                      onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {labels.nachricht}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={fields.nachricht}
                      onChange={e => setFields(f => ({ ...f, nachricht: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                    />
                  </div>
                  {formState === 'error' && <p className="text-red-500 text-sm">{labels.error}</p>}
                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-black font-semibold text-sm transition-all hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    {formState === 'sending'
                      ? lang === 'de'
                        ? 'Wird gesendet…'
                        : 'Gönderiliyor…'
                      : labels.send}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* WhatsApp CTA */}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 rounded-2xl font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {labels.whatsapp}
                </a>
              )}

              {/* Info cards */}
              {data?.telefon && (
                <a
                  href={`tel:${data.telefon.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gold/30 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black shrink-0 font-bold text-sm"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    Tel
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {lang === 'de' ? 'Telefon' : 'Telefon'}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-gold transition-colors">
                      {data.telefon}
                    </p>
                  </div>
                </a>
              )}

              {data?.mobil && (
                <a
                  href={`tel:${data.mobil.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gold/30 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black shrink-0 font-bold text-sm"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    Mob
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {lang === 'de' ? 'Mobil' : 'Mobil'}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-gold transition-colors">
                      {data.mobil}
                    </p>
                  </div>
                </a>
              )}

              {data?.whatsappNummer && (
                <a
                  href={`https://wa.me/${data.whatsappNummer.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'de' ? 'Hallo, ich möchte eine Anfrage stellen.' : 'Merhaba, bir sorgu yapmak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-green-400/40 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-green-500 transition-colors">
                      {data.whatsappNummer}
                    </p>
                  </div>
                </a>
              )}

              {data?.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gold/30 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black shrink-0 font-bold text-sm"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    Mail
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">E-Mail</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-gold transition-colors break-all">
                      {data.email}
                    </p>
                  </div>
                </a>
              )}

              {data?.adresse && (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black shrink-0 font-bold text-sm"
                    style={{ backgroundColor: '#c9a227' }}
                  >
                    Adr
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {lang === 'de' ? 'Adresse' : 'Adres'}
                    </p>
                    {data.adresse.split('\n').map((line, i) => (
                      <p key={i} className="font-semibold text-gray-900 dark:text-white text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
