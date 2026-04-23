import type { DeckDefinition } from '../../runtime/types'
import { DAY5_SPEAKER_NOTES } from './notes'
import { DAY5_SLIDES } from './slides'

export const day5Deck: DeckDefinition = {
  id: 'htcs-unit-6-day-5-react',
  designWidth: 1920,
  designHeight: 1080,
  meta: {
    courseLabel: 'HTCS · Unit 6 · Day 05',
    deckTitle: 'Lightning Networks',
    deckLabel: 'Lightning Networks',
    dayLabel: 'Day 05',
  },
  speakerNotes: DAY5_SPEAKER_NOTES,
  slides: DAY5_SLIDES,
}
