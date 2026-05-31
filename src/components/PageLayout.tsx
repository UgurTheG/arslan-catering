import type { ReactNode } from 'react'
import Footer from './Footer'

/** Wraps a page element with a shared Footer pinned to the bottom. */
export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
