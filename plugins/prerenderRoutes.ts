import { type Plugin } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'
interface ImagePreload {
  href: string
  imagesrcset?: string
  imagesizes?: string
}
interface RouteSEO {
  path: string
  title: string
  description: string
  canonical: string
  imagePreloads?: ImagePreload[]
  chunkName?: string
}
const BASE_URL = 'https://www.arslan-catering.de'
const ROUTES: RouteSEO[] = [
  {
    path: '/ueber-uns',
    title: 'Über uns – Arslan Catering',
    description:
      'Lernen Sie Arslan Catering kennen — 15 Jahre Erfahrung in der Hochzeitsorganisation, Leidenschaft für Details und über 500 unvergessliche Feiern.',
    canonical: `${BASE_URL}/ueber-uns`,
    chunkName: 'UeberUns',
  },
  {
    path: '/galerie',
    title: 'Galerie – Arslan Catering',
    description:
      'Entdecken Sie unsere Dekorationen: Elegante Tischgestaltungen, romantische Blumenarrangements und atemberaubende Raumkonzepte für Ihre Hochzeit.',
    canonical: `${BASE_URL}/galerie`,
    chunkName: 'Galerie',
  },
  {
    path: '/saeale',
    title: 'Hochzeitssäle – Arslan Catering',
    description:
      'Exklusive Hochzeitssäle in Baden-Württemberg: Stuttgart, Albstadt, Balingen und mehr. Finden Sie den perfekten Saal für Ihre Traumhochzeit.',
    canonical: `${BASE_URL}/saeale`,
    chunkName: 'Saeale',
  },
  {
    path: '/videos',
    title: 'Videos – Arslan Catering',
    description:
      'Erleben Sie die Magie vergangener Hochzeiten in unseren Videos. Echte Momente, echte Emotionen — lassen Sie sich inspirieren.',
    canonical: `${BASE_URL}/videos`,
    chunkName: 'Videos',
  },
  {
    path: '/kontakt',
    title: 'Kontakt – Arslan Catering',
    description:
      'Kontaktieren Sie Arslan Catering für Ihre Traumhochzeit. Telefon, WhatsApp, E-Mail oder Kontaktformular — wir sind für Sie da.',
    canonical: `${BASE_URL}/kontakt`,
    chunkName: 'Kontakt',
  },
  {
    path: '/datenschutz',
    title: 'Datenschutz – Arslan Catering',
    description: 'Datenschutzerklärung von Arslan Catering gemäß DSGVO.',
    canonical: `${BASE_URL}/datenschutz`,
  },
  {
    path: '/impressum',
    title: 'Impressum – Arslan Catering',
    description: 'Impressum von Arslan Catering gemäß § 5 TMG.',
    canonical: `${BASE_URL}/impressum`,
  },
]
// These chunks are already injected via modulepreload in the main index.html.
const ALREADY_PRELOADED_PREFIXES = [
  'rolldown-runtime',
  'react-vendor',
  'vendor-',
  'framer-motion',
  'lucide-',
  'index-',
]
// Heavy chunks only loaded on user interaction — never eagerly preload these.
const NEVER_PRELOAD_PREFIXES = ['LazyLightboxWrapper', 'calendar', 'AdminApp', 'admin-']
/**
 * Scans dist/assets/ for the lazy JS chunk matching `chunkName` and returns
 * all filenames (primary + direct static sub-imports) that should be
 * modulepreloaded in the route's HTML to eliminate extra RTTs.
 */
function findRouteChunks(assetsDir: string, chunkName: string): string[] {
  const allFiles = readdirSync(assetsDir)
  const primary = allFiles.find(f => f.startsWith(chunkName + '-') && f.endsWith('.js'))
  if (!primary) return []
  const chunks = new Set<string>([primary])
  const content = readFileSync(resolve(assetsDir, primary), 'utf-8')
  const refs = content.match(/"\.\/([A-Za-z0-9_.-]+-[A-Za-z0-9_.-]+\.js)"/g) ?? []
  for (const ref of refs) {
    const fname = ref.slice(3, -1)
    if (ALREADY_PRELOADED_PREFIXES.some(p => fname.startsWith(p))) continue
    if (NEVER_PRELOAD_PREFIXES.some(p => fname.startsWith(p))) continue
    if (!allFiles.includes(fname)) continue
    chunks.add(fname)
  }
  return [...chunks]
}
function replaceMetaTag(html: string, route: RouteSEO): string {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${route.canonical}" />`,
  )
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="de"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="de" href="${route.canonical}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${route.canonical}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${route.description}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  )
  if (route.imagePreloads?.length) {
    const preloadTags = route.imagePreloads
      .map(p => {
        const srcsetAttr = p.imagesrcset ? ` imagesrcset="${p.imagesrcset}"` : ''
        const sizesAttr = p.imagesizes ? ` imagesizes="${p.imagesizes}"` : ''
        return `  <link rel="preload" as="image" href="${p.href}"${srcsetAttr}${sizesAttr} fetchpriority="high" />`
      })
      .join('\n')
    html = html.replace('</head>', `${preloadTags}\n</head>`)
  }
  return html
}
export function prerenderRoutes(): Plugin {
  return {
    name: 'prerender-routes',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist')
      const assetsDir = resolve(outDir, 'assets')
      const indexHtml = readFileSync(resolve(outDir, 'index.html'), 'utf-8')
      for (const route of ROUTES) {
        const routeDir = resolve(outDir, route.path.slice(1))
        mkdirSync(routeDir, { recursive: true })
        let html = replaceMetaTag(indexHtml, route)
        // Inject modulepreload hints for route-specific lazy chunks.
        // Without this, each lazy chunk requires a separate roundtrip after
        // main JS executes — ~150ms RTT saved per chunk on slow 4G.
        if (route.chunkName) {
          const chunks = findRouteChunks(assetsDir, route.chunkName)
          if (chunks.length > 0) {
            const preloadTags = chunks
              .map(f => `  <link rel="modulepreload" crossorigin href="/assets/${f}">`)
              .join('\n')
            html = html.replace('</head>', `${preloadTags}\n</head>`)
          }
        }
        writeFileSync(resolve(routeDir, 'index.html'), html, 'utf-8')
      }
      console.log('✓ Prerendered', ROUTES.length, 'route HTML shells')
    },
  }
}
