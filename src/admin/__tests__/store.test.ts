/**
 * Store slice integration tests.
 *
 * Approach: import the real combined store and reset its state in beforeEach.
 * The github module is mocked to prevent real network calls.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// ── Mock github before the store is imported ───────────────────────────────────
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
    commitBinaryFile: vi.fn().mockResolvedValue({ content: { sha: 'abc' } }),
    deleteFile: vi.fn().mockResolvedValue({}),
    getFileContent: vi.fn().mockResolvedValue(null),
    listDirectory: vi.fn().mockResolvedValue([]),
  }
})

import { useAdminStore } from '../../admin/store'
import { commitTree } from '../../admin/lib/github'
import { resetPersistenceState } from '../../admin/store/persistence'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Reset the store to a known clean state before each test. */
function resetStore(overrides: Record<string, unknown> = {}) {
  localStorage.clear()
  // Reset debounce timer and lastUndoPush so updateState always creates an undo snapshot
  resetPersistenceState()
  // Do NOT pass `true` (replace) — that would wipe out the action functions.
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

// ── EditorSlice ───────────────────────────────────────────────────────────────

describe('editorSlice — updateState', () => {
  beforeEach(() => resetStore())

  it('stores new data under the tab key', () => {
    resetStore({ state: { news: [] }, originalState: { news: [] } })
    useAdminStore.getState().updateState('news', [{ titel: 'Test' }])
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'Test' }])
  })

  it('creates an undo snapshot of the previous state', () => {
    resetStore({ state: { news: [{ titel: 'old' }] }, originalState: { news: [] } })
    useAdminStore.getState().updateState('news', [{ titel: 'new' }])
    const { undoStacks } = useAdminStore.getState()
    expect(undoStacks.news).toHaveLength(1)
    expect(undoStacks.news[0]).toEqual([{ titel: 'old' }])
  })

  it('clears the redo stack when a new edit is made', () => {
    resetStore({
      state: { news: [{ titel: 'a' }] },
      originalState: { news: [] },
      redoStacks: { news: [[{ titel: 'future' }]] },
    })
    useAdminStore.getState().updateState('news', [{ titel: 'b' }])
    expect(useAdminStore.getState().redoStacks.news).toHaveLength(0)
  })
})

describe('editorSlice — undo / redo', () => {
  beforeEach(() => resetStore())

  it('undo reverts to the previous snapshot', () => {
    resetStore({
      state: { news: [{ titel: 'new' }] },
      originalState: { news: [] },
      undoStacks: { news: [[{ titel: 'old' }]] },
      redoStacks: { news: [] },
    })
    useAdminStore.getState().undo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'old' }])
  })

  it('undo pushes current state onto the redo stack', () => {
    resetStore({
      state: { news: [{ titel: 'new' }] },
      originalState: { news: [] },
      undoStacks: { news: [[{ titel: 'old' }]] },
      redoStacks: { news: [] },
    })
    useAdminStore.getState().undo('news')
    const { redoStacks } = useAdminStore.getState()
    expect(redoStacks.news).toHaveLength(1)
    expect(redoStacks.news[0]).toEqual([{ titel: 'new' }])
  })

  it('undo is a no-op when the stack is empty', () => {
    resetStore({ state: { news: [{ titel: 'x' }] }, originalState: { news: [] } })
    useAdminStore.getState().undo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'x' }]) // unchanged
  })

  it('redo re-applies the undone state', () => {
    resetStore({
      state: { news: [{ titel: 'old' }] },
      originalState: { news: [] },
      undoStacks: { news: [] },
      redoStacks: { news: [[{ titel: 'new' }]] },
    })
    useAdminStore.getState().redo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'new' }])
  })

  it('redo is a no-op when the stack is empty', () => {
    resetStore({ state: { news: [{ titel: 'x' }] }, originalState: { news: [] } })
    useAdminStore.getState().redo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'x' }])
  })

  it('full undo/redo round-trip preserves state', () => {
    resetStore({ state: { news: [{ titel: 'A' }] }, originalState: { news: [] } })
    useAdminStore.getState().updateState('news', [{ titel: 'B' }])
    useAdminStore.getState().undo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'A' }])
    useAdminStore.getState().redo('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'B' }])
  })
})

describe('editorSlice — dirtyTabs', () => {
  beforeEach(() => resetStore())

  it('returns an empty set when state equals original', () => {
    const data = [{ titel: 'same' }]
    resetStore({ state: { news: data }, originalState: { news: data } })
    expect(useAdminStore.getState().dirtyTabs().size).toBe(0)
  })

  it('marks a tab dirty when its state differs from original', () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
    })
    expect(useAdminStore.getState().dirtyTabs().has('about')).toBe(true)
  })

  it('marks a tab dirty when it has a pending upload tagged to it', () => {
    const data = [{ titel: 'same' }]
    resetStore({
      state: { news: data },
      originalState: { news: data },
      pendingUploads: [
        { ghPath: 'public/images/news/x.webp', base64: 'abc', message: 'test', tabKey: 'news' },
      ],
    })
    expect(useAdminStore.getState().dirtyTabs().has('news')).toBe(true)
  })

  it('does not mark an unknown tab as dirty', () => {
    resetStore({ state: { unknown: null }, originalState: { unknown: null } })
    expect(useAdminStore.getState().dirtyTabs().has('unknown')).toBe(false)
  })
})

describe('editorSlice — revertTab', () => {
  beforeEach(() => resetStore())

  it('restores the original state for the tab', () => {
    resetStore({
      state: { news: [{ titel: 'edited' }] },
      originalState: { news: [{ titel: 'original' }] },
    })
    useAdminStore.getState().revertTab('news')
    expect(useAdminStore.getState().state.news).toEqual([{ titel: 'original' }])
  })

  it('clears the undo and redo stacks for the reverted tab', () => {
    resetStore({
      state: { news: [{ titel: 'edited' }] },
      originalState: { news: [] },
      undoStacks: { news: [[{ titel: 'prev' }]] },
      redoStacks: { news: [[{ titel: 'future' }]] },
    })
    useAdminStore.getState().revertTab('news')
    const { undoStacks, redoStacks } = useAdminStore.getState()
    expect(undoStacks.news).toHaveLength(0)
    expect(redoStacks.news).toHaveLength(0)
  })

  it('does not affect other tabs', () => {
    resetStore({
      state: { news: [{ titel: 'edited' }], about: { titel: 'ok', beschreibung: '' } },
      originalState: { news: [], about: { titel: 'ok', beschreibung: '' } },
    })
    useAdminStore.getState().revertTab('news')
    expect(useAdminStore.getState().state.about).toEqual({ titel: 'ok', beschreibung: '' })
  })
})

describe('editorSlice — revertChange', () => {
  beforeEach(() => resetStore())

  it('reverts a single field and pushes state to undo', () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: 'original',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
    })
    const entry = {
      id: 'titel:modified',
      path: ['titel'] as (string | number)[],
      kind: 'modified' as const,
      group: 'Über uns',
      before: 'original',
      after: 'edited',
    }
    useAdminStore.getState().revertChange('about', entry)
    const { state, undoStacks } = useAdminStore.getState()
    expect((state.about as { titel: string }).titel).toBe('original')
    expect(undoStacks.about).toHaveLength(1) // the pre-revert state is saved
  })
})

describe('editorSlice — resetOriginal', () => {
  beforeEach(() => resetStore())

  it('marks the current state as the new original', () => {
    resetStore({
      state: { news: [{ titel: 'published' }] },
      originalState: { news: [] },
    })
    useAdminStore.getState().resetOriginal('news')
    expect(useAdminStore.getState().originalState.news).toEqual([{ titel: 'published' }])
  })

  it('clears undo/redo after reset', () => {
    resetStore({
      state: { news: [{ titel: 'x' }] },
      originalState: { news: [] },
      undoStacks: { news: [['prev']] },
      redoStacks: { news: [['next']] },
    })
    useAdminStore.getState().resetOriginal('news')
    expect(useAdminStore.getState().undoStacks.news).toHaveLength(0)
    expect(useAdminStore.getState().redoStacks.news).toHaveLength(0)
  })
})

describe('editorSlice — findOrphanImages', () => {
  beforeEach(() => resetStore())

  it('returns paths that were in original but are no longer in current state', () => {
    // galerie tab has a 'bilder' section with url image fields
    const originalGalerie = {
      titel: 'G',
      titelTr: '',
      beschreibung: '',
      beschreibungTr: '',
      bilder: [{ url: '/images/galerie/a.webp', beschreibung: '' }],
    }
    const currentGalerie = {
      titel: 'G',
      titelTr: '',
      beschreibung: '',
      beschreibungTr: '',
      bilder: [], // image removed
    }
    resetStore({
      state: { galerie: currentGalerie },
      originalState: { galerie: originalGalerie },
    })
    const orphans = useAdminStore.getState().findOrphanImages()
    expect(orphans).toContain('/images/galerie/a.webp')
  })

  it('returns empty when no images were removed', () => {
    const data = { titel: '', titelTr: '', beschreibung: '', beschreibungTr: '', bilder: [] }
    resetStore({ state: { galerie: data }, originalState: { galerie: data } })
    expect(useAdminStore.getState().findOrphanImages()).toHaveLength(0)
  })
})

// ── PublishSlice ──────────────────────────────────────────────────────────────

describe('publishSlice — publishAll dataLoadErrors guard', () => {
  beforeEach(() => {
    resetStore()
    vi.mocked(commitTree).mockClear()
    vi.mocked(commitTree).mockResolvedValue({})
  })

  it('skips tabs that failed to load and does not include them in the commit', async () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
        startseite: {
          heroTitel: 'edited',
          heroTitelTr: '',
          heroUntertitel: '',
          heroUntertitelTr: '',
          heroBildUrl: '',
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
        startseite: {},
      },
      dataLoadErrors: ['about'], // about failed to load
    })

    await useAdminStore.getState().publishAll()

    expect(commitTree).toHaveBeenCalledTimes(1)
    const [, changes] = vi.mocked(commitTree).mock.calls[0] as [string, { path: string }[]]
    const paths = changes.map(c => c.path)
    expect(paths).not.toContain('public/data/about.json')
    expect(paths).toContain('public/data/startseite.json')
  })

  it('does not call commitTree when all dirty tabs have load errors', async () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      dataLoadErrors: ['about'],
    })

    await useAdminStore.getState().publishAll()

    expect(commitTree).not.toHaveBeenCalled()
  })

  it('does not call commitTree when there are no dirty tabs', async () => {
    const data = {
      titel: 'same',
      titelTr: '',
      beschreibung: '',
      beschreibungTr: '',
      bildUrl: '',
      werte: [],
    }
    resetStore({ state: { about: data }, originalState: { about: data } })

    await useAdminStore.getState().publishAll()

    expect(commitTree).not.toHaveBeenCalled()
  })

  it('calls resetOriginal for each published tab', async () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
    })

    await useAdminStore.getState().publishAll()

    // After publish, state should equal originalState for 'about'
    const { state, originalState } = useAdminStore.getState()
    expect(JSON.stringify(state.about)).toBe(JSON.stringify(originalState.about))
  })
})

describe('publishSlice — publishTab dataLoadErrors guard', () => {
  beforeEach(() => {
    resetStore()
    vi.mocked(commitTree).mockClear()
    vi.mocked(commitTree).mockResolvedValue({})
  })

  it('skips publishing if the tab is in dataLoadErrors', async () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      dataLoadErrors: ['about'],
    })

    await useAdminStore.getState().publishTab('about')

    expect(commitTree).not.toHaveBeenCalled()
  })

  it('publishes when the tab is not in dataLoadErrors', async () => {
    resetStore({
      state: {
        about: {
          titel: 'edited',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      originalState: {
        about: {
          titel: '',
          titelTr: '',
          beschreibung: '',
          beschreibungTr: '',
          bildUrl: '',
          werte: [],
        },
      },
      dataLoadErrors: [],
    })

    await useAdminStore.getState().publishTab('about')

    expect(commitTree).toHaveBeenCalledTimes(1)
  })
})

// ── UISlice ───────────────────────────────────────────────────────────────────

describe('uiSlice — setStatus', () => {
  beforeEach(() => resetStore())

  it('sets the message and type', () => {
    useAdminStore.getState().setStatus('Gespeichert!', 'success')
    const { statusMessage, statusType } = useAdminStore.getState()
    expect(statusMessage).toBe('Gespeichert!')
    expect(statusType).toBe('success')
  })

  it('increments statusCounter on each call to allow re-triggering', () => {
    const before = useAdminStore.getState().statusCounter
    useAdminStore.getState().setStatus('First', 'info')
    useAdminStore.getState().setStatus('Second', 'info')
    const after = useAdminStore.getState().statusCounter
    expect(after).toBe(before + 2)
  })
})

describe('uiSlice — toggleDark', () => {
  beforeEach(() => {
    resetStore({ darkMode: false })
    localStorage.clear()
  })

  it('toggles darkMode in store state', () => {
    useAdminStore.getState().toggleDark()
    expect(useAdminStore.getState().darkMode).toBe(true)
    useAdminStore.getState().toggleDark()
    expect(useAdminStore.getState().darkMode).toBe(false)
  })

  it('persists the dark mode preference to localStorage', () => {
    useAdminStore.getState().toggleDark()
    expect(localStorage.getItem('arslan-darkmode')).toBe('true')
    useAdminStore.getState().toggleDark()
    expect(localStorage.getItem('arslan-darkmode')).toBe('false')
  })

  it('does NOT mutate document.documentElement (DOM sync belongs in AdminApp useEffect)', () => {
    const spy = vi.spyOn(document.documentElement.classList, 'toggle')
    useAdminStore.getState().toggleDark()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
