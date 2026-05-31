import { createContext, useContext, useState, type ReactNode, createElement } from 'react'

export type Language = 'de' | 'tr'

interface LanguageCtx {
  lang: Language
  toggle: () => void
}

const LanguageContext = createContext<LanguageCtx>({ lang: 'de', toggle: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('arslan-lang')
    return stored === 'tr' ? 'tr' : 'de'
  })

  const toggle = () =>
    setLang(l => {
      const next: Language = l === 'de' ? 'tr' : 'de'
      localStorage.setItem('arslan-lang', next)
      return next
    })

  return createElement(LanguageContext.Provider, { value: { lang, toggle } }, children)
}

export function useLanguage(): LanguageCtx {
  return useContext(LanguageContext)
}

/** Pick the localised string: returns `tr` variant when lang==='tr', else `de`. */
export function t(de: string | undefined, tr: string | undefined, lang: Language): string {
  return (lang === 'tr' ? (tr ?? de) : (de ?? tr)) ?? ''
}
