/* eslint-disable react-refresh/only-export-components */
import { lazy, type ReactNode } from 'react'

const UeberUns = lazy(() => import('./components/sections/UeberUns'))
const Galerie = lazy(() => import('./components/sections/Galerie'))
const Saeale = lazy(() => import('./components/sections/Saeale'))
const Videos = lazy(() => import('./components/sections/Videos'))
const Kontakt = lazy(() => import('./components/sections/Kontakt'))
const Datenschutz = lazy(() => import('./components/sections/Datenschutz'))
const Impressum = lazy(() => import('./components/sections/Impressum'))
const ErrorPage = lazy(() => import('./components/sections/ErrorPage'))

export interface RouteEntry {
  path: string
  title: string
  depth: number
  element: ReactNode
}

const ERROR_CODES = [400, 401, 403, 405, 408, 429, 500, 502, 503, 504] as const

export const ROUTES: RouteEntry[] = [
  { path: '/ueber-uns', title: 'Arslan Catering / Über uns', depth: 1, element: <UeberUns /> },
  { path: '/galerie', title: 'Arslan Catering / Galerie', depth: 1, element: <Galerie /> },
  { path: '/saeale', title: 'Arslan Catering / Hochzeitssäle', depth: 1, element: <Saeale /> },
  { path: '/videos', title: 'Arslan Catering / Videos', depth: 1, element: <Videos /> },
  { path: '/kontakt', title: 'Arslan Catering / Kontakt', depth: 1, element: <Kontakt /> },
  {
    path: '/datenschutz',
    title: 'Arslan Catering / Datenschutz',
    depth: 1,
    element: <Datenschutz />,
  },
  {
    path: '/impressum',
    title: 'Arslan Catering / Impressum',
    depth: 1,
    element: <Impressum />,
  },
  ...ERROR_CODES.map(
    (code): RouteEntry => ({
      path: `/${code}`,
      title: `Arslan Catering / ${code}`,
      depth: 1,
      element: <ErrorPage code={code} />,
    }),
  ),
]

export const CATCH_ALL_ROUTE: RouteEntry = {
  path: '*',
  title: 'Arslan Catering / 404',
  depth: 1,
  element: <ErrorPage code={404} />,
}

export const PAGE_TITLES: Record<string, string> = { '/': 'Arslan Catering' }
export const DEPTH: Record<string, number> = { '/': 0 }

for (const r of ROUTES) {
  PAGE_TITLES[r.path] = r.title
  DEPTH[r.path] = r.depth
}
