import { lazy, Suspense, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Monitor, X } from 'lucide-react'
import { SWRConfig } from 'swr'
import { useAdminStore } from '../store'
import { TABS } from '../config/tabs'

const UeberUns = lazy(() => import('../../components/sections/UeberUns'))
const Galerie = lazy(() => import('../../components/sections/Galerie'))
const Saeale = lazy(() => import('../../components/sections/Saeale'))
const Videos = lazy(() => import('../../components/sections/Videos'))
const KontaktSection = lazy(() => import('../../components/sections/Kontakt'))
const Impressum = lazy(() => import('../../components/sections/Impressum'))
const Datenschutz = lazy(() => import('../../components/sections/Datenschutz'))

type AnyComponent = React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>

const TAB_PREVIEW_MAP: Record<string, { Component: AnyComponent; label: string }> = {
  about: { Component: UeberUns as AnyComponent, label: 'Über uns' },
  galerie: { Component: Galerie as AnyComponent, label: 'Galerie' },
  venues: { Component: Saeale as AnyComponent, label: 'Hochzeitssäle' },
  videos: { Component: Videos as AnyComponent, label: 'Videos' },
  kontakt: { Component: KontaktSection as AnyComponent, label: 'Kontakt' },
  impressum: { Component: Impressum as AnyComponent, label: 'Impressum' },
  datenschutz: { Component: Datenschutz as AnyComponent, label: 'Datenschutz' },
}

interface Props {
  tabKey: string
  onClose: () => void
}

export default function PreviewModal({ tabKey, onClose }: Props) {
  const state = useAdminStore(s => s.state)
  const pendingUploads = useAdminStore(s => s.pendingUploads)

  const uploadUrlMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const upload of pendingUploads) {
      const publicUrl = upload.ghPath.replace(/^public/, '')
      map[publicUrl] = `data:image/webp;base64,${upload.base64}`
    }
    return map
  }, [pendingUploads])

  const swrFallback = useMemo(() => {
    const replaceUrls = (obj: unknown): unknown => {
      if (typeof obj === 'string') return uploadUrlMap[obj] ?? obj
      if (Array.isArray(obj)) return obj.map(replaceUrls)
      if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(obj)) result[k] = replaceUrls(v)
        return result
      }
      return obj
    }
    const fallback: Record<string, unknown> = {}
    for (const tab of TABS) {
      if (tab.file && state[tab.key] !== undefined) {
        fallback[tab.file] =
          Object.keys(uploadUrlMap).length > 0 ? replaceUrls(state[tab.key]) : state[tab.key]
      }
    }
    return fallback
  }, [state, uploadUrlMap])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const entry = TAB_PREVIEW_MAP[tabKey]
  if (!entry) return null
  const { Component, label } = entry

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col h-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Monitor size={14} className="text-gold" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Vorschau — {label}</h3>
              <p className="text-[10px] text-gray-400">Live-Vorschau mit aktuellen Änderungen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex justify-center">
          <div className="bg-white dark:bg-gray-950 shadow-2xl w-full min-h-full overflow-auto">
            <SWRConfig
              value={{
                fallback: swrFallback,
                provider: () => new Map(),
                fetcher: async (url: string) => {
                  if (swrFallback[url] !== undefined) return swrFallback[url]
                  const res = await fetch(url)
                  if (!res.ok) throw new Error(`HTTP ${res.status}`)
                  return res.json()
                },
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                revalidateOnMount: false,
                revalidateIfStale: false,
              }}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-32">
                    <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                  </div>
                }
              >
                <Component />
              </Suspense>
            </SWRConfig>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
