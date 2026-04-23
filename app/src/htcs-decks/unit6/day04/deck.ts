import type { DeckDefinition } from '../../runtime/types'
import { DAY4_SPEAKER_NOTES } from './notes'
import { DAY4_SLIDES } from './slides'

export const day4Deck: DeckDefinition = {
  id: 'htcs-unit-6-day-4-react',
  designWidth: 1920,
  designHeight: 1080,
  meta: {
    courseLabel: 'HTCS · Unit 6 · Day 04',
    deckTitle: 'Bitcoin Wallets & Multi-Signatures',
    deckLabel: 'Bitcoin Wallets & Multi-Signatures',
    dayLabel: 'Day 04',
  },
  speakerNotes: DAY4_SPEAKER_NOTES,
  slides: DAY4_SLIDES,
}
