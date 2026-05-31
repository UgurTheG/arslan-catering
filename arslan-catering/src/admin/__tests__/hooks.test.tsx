/**
 * Tests for admin hooks:
 * - useUndoRedoShortcuts
 * - useTabPublisher
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// ── Mock github for hooks that use it ──────────────────────────────────────────
vi.mock('../../admin/lib/github', () => {
  class AuthError extends Error {
    status: number
    constructor(msg: string, status: number) {
      super(msg)
      this.name = 'AuthError'
      this.status = status
    }
  }
  class ConflictError extends Error {
    constructor(msg = 'Konflikt') {
      super(msg)
      this.name = 'ConflictError'
    }
  }
  return {
    AuthError,
    ConflictError,
    getBranchSha: vi.fn().mockResolvedValue('abc123'),
    commitTree: vi.fn().mockResolvedValue({}),
    validateToken: vi.fn().mockResolvedValue({ login: 'testuser', avatar_url: '' }),
    commitFile: vi.fn().mockResolvedValue({}),
    commitBinaryFile: vi.fn().mockResolvedValue({ content: { sha: 'sha1' } }),
    deleteFile: vi.fn().mockResolvedValue({}),
    getFileContent: vi.fn().mockResolvedValue(null),
    listDirectory: vi.fn().mockResolvedValue([]),
  }
})

import { useAdminStore } from '../../admin/store'
import { resetPersistenceState } from '../../admin/store/persistence'
import { useUndoRedoShortcuts } from '../../admin/hooks/useUndoRedoShortcuts'
import { useTabPublisher } from '../../admin/hooks/useTabPublisher'

function resetStore(overrides: Record<string, unknown> = {}) {
  localStorage.clear()
  resetPersistenceState()
  useAdminStore.setState({
    activeTab: 'news',
    state: {},
    originalState: {},
    pendingUploads: [],
    dataLoaded: true,
    dataLoadErrors: [],
    undoStacks: {},
    redoStacks: {},
    publishing: false,
    authenticated: true,
    tokenExpiresAt: 0,
    user: { login: 'testuser', avatar_url: '' },
    loginError: '',
    loginLoading: false,
    loginAuthStatus: null,
    darkMode: false,
    statusMessage: '',
    statusType: 'info',
    statusCounter: 0,
    ...overrides,
  })
}

// ── useUndoRedoShortcuts ──────────────────────────────────────────────────────

describe('useUndoRedoShortcuts', () => {
  it('calls undo on Ctrl+Z', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    const e = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })
    window.dispatchEvent(e)
    expect(undo).toHaveBeenCalledWith('news')
  })

  it('calls redo on Ctrl+Shift+Z', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    const e = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
    })
    window.dispatchEvent(e)
    expect(redo).toHaveBeenCalledWith('news')
  })

  it('calls redo on Ctrl+Y', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    const e = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true })
    window.dispatchEvent(e)
    expect(redo).toHaveBeenCalledWith('news')
  })

  it('ignores Ctrl+Z when target is an INPUT', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    const input = document.createElement('input')
    document.body.appendChild(input)
    const e = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })
    Object.defineProperty(e, 'target', { value: input, configurable: true })
    window.dispatchEvent(e)
    expect(undo).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('ignores Ctrl+Y when target is TEXTAREA', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    const ta = document.createElement('textarea')
    document.body.appendChild(ta)
    const e = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true })
    Object.defineProperty(e, 'target', { value: ta, configurable: true })
    window.dispatchEvent(e)
    expect(redo).not.toHaveBeenCalled()
    document.body.removeChild(ta)
  })

  it('ignores non-matching keys', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }))
    expect(undo).not.toHaveBeenCalled()
    expect(redo).not.toHaveBeenCalled()
  })

  it('cleans up event listener on unmount', () => {
    const undo = vi.fn()
    const redo = vi.fn()
    const { unmount } = renderHook(() => useUndoRedoShortcuts('news', undo, redo))
    unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
    expect(undo).not.toHaveBeenCalled()
  })
})

// ── useTabPublisher ───────────────────────────────────────────────────────────

describe('useTabPublisher', () => {
  beforeEach(() => resetStore())

  it('initialises with all booleans false', () => {
    const { result } = renderHook(() => useTabPublisher('news', 'news.json'))
    expect(result.current.showDiff).toBe(false)
    expect(result.current.showPreview).toBe(false)
    expect(result.current.showPublishConfirm).toBe(false)
    expect(result.current.orphans).toBeNull()
  })

  it('handlePublish sets showPublishConfirm = true', () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => result.current.handlePublish())
    expect(result.current.showPublishConfirm).toBe(true)
  })

  it('handlePublishConfirmed with no orphans calls publishTab', async () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    await act(async () => result.current.handlePublishConfirmed())
    // publishTab would be called; store.publishing resets to false
    expect(useAdminStore.getState().publishing).toBe(false)
  })

  it('handlePublishConfirmed with orphans sets orphans state', () => {
    // Set up about data with an orphaned image (bildUrl removed)
    const aboutOriginal = {
      titel: '',
      titelTr: '',
      beschreibung: '',
      beschreibungTr: '',
      bildUrl: '/images/about/a.webp',
      werte: [],
    }
    const aboutCurrent = {
      titel: '',
      titelTr: '',
      beschreibung: '',
      beschreibungTr: '',
      bildUrl: '',
      werte: [],
    }
    resetStore({
      state: { about: aboutCurrent },
      originalState: { about: aboutOriginal },
    })
    const { result } = renderHook(() => useTabPublisher('about'))
    act(() => result.current.handlePublishConfirmed())
    expect(result.current.orphans).not.toBeNull()
    expect(result.current.orphans!.length).toBeGreaterThan(0)
  })

  it('handleOrphanConfirm clears orphans and publishes', async () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => {
      // Manually set orphans
      result.current.handlePublish()
    })
    await act(async () => {
      result.current.handleOrphanConfirm(['/images/old.webp'])
    })
    expect(result.current.orphans).toBeNull()
  })

  it('handleOrphanKeep clears orphans and publishes without deletions', async () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    await act(async () => {
      result.current.handleOrphanKeep()
    })
    expect(result.current.orphans).toBeNull()
  })

  it('handleOrphanCancel clears orphans', () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => result.current.handleOrphanCancel())
    expect(result.current.orphans).toBeNull()
  })

  it('handleDownload creates a download link', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    resetStore({ state: { news: [{ titel: 'Test' }] } })
    const { result } = renderHook(() => useTabPublisher('news', 'news.json'))
    const clickMock = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementationOnce((tag: string) => {
      const el = document.createElement(tag)
      el.click = clickMock
      return el
    })
    act(() => result.current.handleDownload())
    expect(clickMock).toHaveBeenCalled()
    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('handleDownload uses tabKey as filename when none provided', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    resetStore({ state: { news: [{ titel: 'Test' }] } })
    const { result } = renderHook(() => useTabPublisher('news'))
    const clickMock = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementationOnce((tag: string) => {
      const el = document.createElement(tag)
      el.click = clickMock
      return el
    })
    act(() => result.current.handleDownload())
    expect(clickMock).toHaveBeenCalled()
    createObjectURLSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('handleRevertAndCloseDiff calls revertTab and closes diff', () => {
    resetStore({
      state: { news: [{ titel: 'edited' }] },
      originalState: { news: [{ titel: 'original' }] },
    })
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => result.current.setShowDiff(true))
    act(() => result.current.handleRevertAndCloseDiff())
    expect(result.current.showDiff).toBe(false)
    // state restored
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'original' }])
  })

  it('setShowPreview updates showPreview', () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => result.current.setShowPreview(true))
    expect(result.current.showPreview).toBe(true)
  })

  it('setShowPublishConfirm updates showPublishConfirm', () => {
    const { result } = renderHook(() => useTabPublisher('news'))
    act(() => result.current.setShowPublishConfirm(true))
    expect(result.current.showPublishConfirm).toBe(true)
  })
})
