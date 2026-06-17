import DeckRoutePage from '../htcs-decks/runtime/DeckRoutePage'
import { day4Deck } from '../htcs-decks/unit6/day04/deck'

export default function HtcsUnit6Day4React() {
  return (
    <DeckRoutePage
      deck={day4Deck}
      basePath="/teaching-resources/lessons/computer-science/day4-react"
      backTo="/teaching-resources/lessons/computer-science"
    />
  )
}
