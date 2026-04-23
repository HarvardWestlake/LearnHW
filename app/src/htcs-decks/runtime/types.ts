import type { ComponentType } from 'react'

export type DeckRenderMode = 'interactive' | 'static'

export type DeckMeta = {
  courseLabel: string
  deckTitle: string
  deckLabel: string
  dayLabel: string
}

export type DeckSlideDefinition = {
  label: string
  Component: ComponentType
}

export type DeckDefinition = {
  id: string
  designWidth?: number
  designHeight?: number
  meta: DeckMeta
  speakerNotes: string[]
  slides: DeckSlideDefinition[]
}
