import type { DeckDefinition } from '../../runtime/types'
import { DAY6_SPEAKER_NOTES } from './notes'
import { DAY6_SLIDES } from './slides'

export const day6Deck: DeckDefinition = {
  id: 'htcs-unit-6-day-6-react',
  designWidth: 1920,
  designHeight: 1080,
  meta: {
    courseLabel: 'HTCS · Unit 6 · Day 06',
    deckTitle: 'Smart Contracts & Ethereum',
    deckLabel: 'Smart Contracts & Ethereum',
    dayLabel: 'Day 06',
  },
  speakerNotes: DAY6_SPEAKER_NOTES,
  slides: DAY6_SLIDES,
}
