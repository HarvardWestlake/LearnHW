export type PresenterNavDirection = 'prev' | 'next' | 'first' | 'last'

export type DeckSlideSyncMessage = {
  scope: 'htcs-deck'
  deckId: string
  type: 'slide'
  index: number
  total: number
}

export type DeckPresenterReadyMessage = {
  scope: 'htcs-deck'
  deckId: string
  type: 'presenter-ready'
}

export type DeckPresenterNavMessage = {
  scope: 'htcs-deck'
  deckId: string
  type: 'nav'
  dir: PresenterNavDirection
}

export type DeckSyncMessage =
  | DeckSlideSyncMessage
  | DeckPresenterReadyMessage
  | DeckPresenterNavMessage

export function isDeckSyncMessage(data: unknown, deckId: string): data is DeckSyncMessage {
  if (!data || typeof data !== 'object') return false

  const maybe = data as Partial<DeckSyncMessage>
  if (maybe.scope !== 'htcs-deck' || maybe.deckId !== deckId || typeof maybe.type !== 'string') return false

  if (maybe.type === 'slide') {
    return typeof maybe.index === 'number' && typeof maybe.total === 'number'
  }

  if (maybe.type === 'presenter-ready') return true

  if (maybe.type === 'nav') {
    return maybe.dir === 'prev' || maybe.dir === 'next' || maybe.dir === 'first' || maybe.dir === 'last'
  }

  return false
}

export function createSlideSyncMessage(deckId: string, index: number, total: number): DeckSlideSyncMessage {
  return { scope: 'htcs-deck', deckId, type: 'slide', index, total }
}

export function createPresenterReadyMessage(deckId: string): DeckPresenterReadyMessage {
  return { scope: 'htcs-deck', deckId, type: 'presenter-ready' }
}

export function createPresenterNavMessage(deckId: string, dir: PresenterNavDirection): DeckPresenterNavMessage {
  return { scope: 'htcs-deck', deckId, type: 'nav', dir }
}
