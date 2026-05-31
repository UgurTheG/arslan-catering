import type { TabConfig } from '../types'

export const TABS: TabConfig[] = [
  // ── Startseite ────────────────────────────────────────────────────────────
  {
    key: 'startseite',
    label: 'Startseite',
    file: '/data/startseite.json',
    ghPath: 'public/data/startseite.json',
    type: 'object',
    previewPath: '/',
    topFields: [
      { key: 'heroTitel', label: 'Hero-Titel (DE)', type: 'text' },
      { key: 'heroTitelTr', label: 'Hero-Titel (TR)', type: 'text' },
      { key: 'heroUntertitel', label: 'Hero-Untertitel (DE)', type: 'textarea' },
      { key: 'heroUntertitelTr', label: 'Hero-Untertitel (TR)', type: 'textarea' },
      { key: 'heroBildUrl', label: 'Hero-Hintergrundbild', type: 'image', imageDir: 'hero' },
    ],
  },

  // ── Über uns ──────────────────────────────────────────────────────────────
  {
    key: 'about',
    label: 'Über uns',
    file: '/data/about.json',
    ghPath: 'public/data/about.json',
    type: 'object',
    previewPath: '/ueber-uns',
    topFields: [
      { key: 'titel', label: 'Titel (DE)', type: 'text' },
      { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
      { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
      { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
      { key: 'bildUrl', label: 'Hauptbild', type: 'image', imageDir: 'about' },
    ],
    sections: [
      {
        key: 'werte',
        label: 'Unsere Werte',
        fields: [
          { key: 'titel', label: 'Titel (DE)', type: 'text', required: true },
          { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
          { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
          { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: ['Heart', 'Star', 'Award', 'Sparkles', 'Camera', 'Music'],
          },
        ],
      },
    ],
  },

  // ── Galerie ───────────────────────────────────────────────────────────────
  {
    key: 'galerie',
    label: 'Galerie',
    file: '/data/galerie.json',
    ghPath: 'public/data/galerie.json',
    type: 'object',
    previewPath: '/galerie',
    topFields: [
      { key: 'titel', label: 'Titel (DE)', type: 'text' },
      { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
      { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
      { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
    ],
    sections: [
      {
        key: 'bilder',
        label: 'Bilder',
        fields: [
          { key: 'url', label: 'Bild', type: 'image', imageDir: 'galerie' },
          { key: 'beschreibung', label: 'Bildunterschrift (DE)', type: 'text' },
          { key: 'beschreibungTr', label: 'Bildunterschrift (TR)', type: 'text' },
        ],
      },
    ],
  },

  // ── Hochzeitssäle ─────────────────────────────────────────────────────────
  {
    key: 'venues',
    label: 'Hochzeitssäle',
    file: '/data/venues.json',
    ghPath: 'public/data/venues.json',
    type: 'object',
    previewPath: '/saeale',
    topFields: [
      { key: 'titel', label: 'Titel (DE)', type: 'text' },
      { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
      { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
      { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
    ],
    sections: [
      {
        key: 'saeale',
        label: 'Säle',
        fields: [
          { key: 'name', label: 'Saalname', type: 'text', required: true },
          { key: 'stadt', label: 'Stadt', type: 'text', required: true },
          { key: 'kapazitaet', label: 'Kapazität (Personen)', type: 'text' },
          { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
          { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
          {
            key: 'bilder',
            label: 'Bilder',
            type: 'imagelist',
            imageDir: 'venues',
            captionsKey: 'bildBeschreibungen',
          },
        ],
      },
    ],
  },

  // ── Videos ────────────────────────────────────────────────────────────────
  {
    key: 'videos',
    label: 'Videos',
    file: '/data/videos.json',
    ghPath: 'public/data/videos.json',
    type: 'object',
    previewPath: '/videos',
    topFields: [
      { key: 'titel', label: 'Titel (DE)', type: 'text' },
      { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
      { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
      { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
    ],
    sections: [
      {
        key: 'videos',
        label: 'Videos',
        fields: [
          { key: 'titel', label: 'Titel (DE)', type: 'text', required: true },
          { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
          {
            key: 'typ',
            label: 'Typ',
            type: 'select',
            options: ['youtube', 'video'],
          },
          { key: 'url', label: 'URL (YouTube-Link oder Video-Datei)', type: 'url' },
          { key: 'datum', label: 'Datum', type: 'date' },
          { key: 'vorschau', label: 'Vorschaubild', type: 'image', imageDir: 'videos' },
        ],
      },
    ],
  },

  // ── Kontakt ───────────────────────────────────────────────────────────────
  {
    key: 'kontakt',
    label: 'Kontakt',
    file: '/data/kontakt.json',
    ghPath: 'public/data/kontakt.json',
    type: 'object',
    previewPath: '/kontakt',
    topFields: [
      { key: 'titel', label: 'Titel (DE)', type: 'text' },
      { key: 'titelTr', label: 'Titel (TR)', type: 'text' },
      { key: 'beschreibung', label: 'Beschreibung (DE)', type: 'textarea' },
      { key: 'beschreibungTr', label: 'Beschreibung (TR)', type: 'textarea' },
      { key: 'telefon', label: 'Telefon', type: 'text', iconKey: 'phone' },
      { key: 'email', label: 'E-Mail', type: 'email', iconKey: 'mail' },
      { key: 'whatsapp', label: 'WhatsApp-Nummer (nur Ziffern + Ländercode)', type: 'text' },
      { key: 'adresse', label: 'Adresse (Zeilenumbrüche mit Enter)', type: 'textarea' },
      {
        key: 'formspreeUrl',
        label: 'Formspree-URL (Kontaktformular)',
        type: 'url',
        iconKey: 'link',
      },
      { key: 'instagramUrl', label: 'Instagram-URL', type: 'url', iconKey: 'instagram' },
      { key: 'facebookUrl', label: 'Facebook-URL', type: 'url', iconKey: 'facebook' },
      { key: 'tiktokUrl', label: 'TikTok-URL', type: 'url' },
      { key: 'footerBeschreibung', label: 'Footer-Text (DE)', type: 'textarea' },
      { key: 'footerBeschreibungTr', label: 'Footer-Text (TR)', type: 'textarea' },
    ],
  },

  // ── Impressum ─────────────────────────────────────────────────────────────
  {
    key: 'impressum',
    label: 'Impressum',
    file: '/data/impressum.json',
    ghPath: 'public/data/impressum.json',
    type: 'object',
    previewPath: '/impressum',
    topFields: [
      {
        key: 'beschreibung',
        label: 'Beschreibung (Unterzeile im Header)',
        type: 'textarea',
      },
    ],
    sections: [
      {
        key: 'sections',
        label: 'Abschnitte',
        fields: [
          { key: 'title', label: 'Überschrift', type: 'text', required: true },
          { key: 'content', label: 'Inhalt', type: 'textarea' },
        ],
      },
    ],
  },

  // ── Datenschutz ───────────────────────────────────────────────────────────
  {
    key: 'datenschutz',
    label: 'Datenschutz',
    file: '/data/datenschutz.json',
    ghPath: 'public/data/datenschutz.json',
    type: 'object',
    previewPath: '/datenschutz',
    topFields: [
      {
        key: 'beschreibung',
        label: 'Beschreibung (Unterzeile im Header)',
        type: 'textarea',
      },
    ],
    sections: [
      {
        key: 'sections',
        label: 'Abschnitte',
        fields: [
          { key: 'title', label: 'Überschrift', type: 'text', required: true },
          { key: 'content', label: 'Inhalt', type: 'textarea' },
        ],
      },
    ],
  },
]
