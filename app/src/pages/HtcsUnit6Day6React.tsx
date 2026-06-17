import DeckRoutePage from '../htcs-decks/runtime/DeckRoutePage'
import { day6Deck } from '../htcs-decks/unit6/day06/deck'

export default function HtcsUnit6Day6React() {
  return (
    <DeckRoutePage
      deck={day6Deck}
      basePath="/teaching-resources/lessons/computer-science/day6-react"
      backTo="/teaching-resources/lessons/computer-science"
    />
  )
}
