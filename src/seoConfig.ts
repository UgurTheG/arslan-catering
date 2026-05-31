export interface SEOMeta {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

const BASE_URL = 'https://www.arslan-catering.de'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/hero/hero.webp`
const DEFAULT_OG_IMAGE_WIDTH = 1200
const DEFAULT_OG_IMAGE_HEIGHT = 630

export const SEO_CONFIG: Record<string, SEOMeta> = {
  '/': {
    title: 'Arslan Catering – Ihre Traumhochzeit in Baden-Württemberg',
    description:
      'Arslan Catering & Events - erstklassige Hochzeitsorganisation, Dekoration und unvergessliche Feiern. Hochzeitssäle in Stuttgart, Albstadt, Balingen und Umgebung.',
    canonical: `${BASE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'weekly',
    priority: 1.0,
  },
  '/ueber-uns': {
    title: 'Über uns – Arslan Catering',
    description:
      'Lernen Sie Arslan Catering kennen - 15 Jahre Erfahrung in der Hochzeitsorganisation, Leidenschaft für Details und über 500 unvergessliche Feiern.',
    canonical: `${BASE_URL}/ueber-uns`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'monthly',
    priority: 0.8,
  },
  '/galerie': {
    title: 'Galerie – Arslan Catering',
    description:
      'Entdecken Sie unsere Dekorationen: Elegante Tischgestaltungen, romantische Blumenarrangements und atemberaubende Raumkonzepte für Ihre Hochzeit.',
    canonical: `${BASE_URL}/galerie`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'weekly',
    priority: 0.9,
  },
  '/saeale': {
    title: 'Hochzeitssäle – Arslan Catering',
    description:
      'Exklusive Hochzeitssäle in Baden-Württemberg: Stuttgart, Albstadt, Balingen und mehr. Finden Sie den perfekten Saal für Ihre Traumhochzeit.',
    canonical: `${BASE_URL}/saeale`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'monthly',
    priority: 0.8,
  },
  '/videos': {
    title: 'Videos – Arslan Catering',
    description:
      'Erleben Sie die Magie vergangener Hochzeiten in unseren Videos. Echte Momente, echte Emotionen - lassen Sie sich inspirieren.',
    canonical: `${BASE_URL}/videos`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'weekly',
    priority: 0.7,
  },
  '/kontakt': {
    title: 'Kontakt – Arslan Catering',
    description:
      'Kontaktieren Sie Arslan Catering für Ihre Traumhochzeit. Telefon, WhatsApp, E-Mail oder Kontaktformular - wir sind für Sie da.',
    canonical: `${BASE_URL}/kontakt`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'monthly',
    priority: 0.7,
  },
  '/datenschutz': {
    title: 'Datenschutz – Arslan Catering',
    description: 'Datenschutzerklärung von Arslan Catering gemäß DSGVO.',
    canonical: `${BASE_URL}/datenschutz`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'yearly',
    priority: 0.3,
  },
  '/impressum': {
    title: 'Impressum – Arslan Catering',
    description: 'Impressum von Arslan Catering gemäß § 5 TMG.',
    canonical: `${BASE_URL}/impressum`,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    changefreq: 'yearly',
    priority: 0.3,
  },
}
