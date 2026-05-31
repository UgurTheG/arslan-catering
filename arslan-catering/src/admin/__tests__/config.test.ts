/**
 * Tests for config/tabs.ts
 */
import { describe, it, expect } from 'vitest'
import { TABS } from '../../admin/config/tabs'

describe('TABS config', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(TABS)).toBe(true)
    expect(TABS.length).toBeGreaterThan(0)
  })

  it('every tab has key, label, type', () => {
    for (const tab of TABS) {
      expect(typeof tab.key).toBe('string')
      expect(typeof tab.label).toBe('string')
      expect(typeof tab.type).toBe('string')
    }
  })

  it('includes catering-specific tabs', () => {
    const keys = TABS.map(t => t.key)
    expect(keys).toContain('about')
    expect(keys).toContain('galerie')
    expect(keys).toContain('venues')
    expect(keys).toContain('videos')
    expect(keys).toContain('kontakt')
  })

  it('every tab with a file has a ghPath', () => {
    for (const tab of TABS) {
      if (tab.file) {
        expect(tab.ghPath).toBeTruthy()
      }
    }
  })
})
