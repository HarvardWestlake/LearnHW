# HTCS Slide Deck Style Guide

## Purpose
This is the reference for building future HTCS HTML slide decks. Use the shared authoring layer in [`public/static/code/lessons/HTCS/_shared/`](public/static/code/lessons/HTCS/_shared) instead of copying old deck internals.

Start new decks from [htcs-deck-template.html](/Users/jlopez/Library/CloudStorage/OneDrive-Harvard-WestlakeSchool/Documents/Honors Topics in Computer Science Repos/ClassResources/public/static/code/lessons/HTCS/_shared/htcs-deck-template.html).

## Foundations
### Color system
- `cream`: full-slide background
- `paper`: card and diagram panel background
- `ink`: primary dark text and dark slide variant
- `inkSoft`: secondary body text
- `accent`: emphasis, danger-adjacent conceptual highlight
- `gold`: reward, focus, success-adjacent highlight
- `muted`: labels, metadata, supporting chrome
- `rule` and `ruleFaint`: borders and separators

### Type system
- `Eyebrow`: uppercase scene-setting label
- `Title`: main slide headline
- `Subtitle`: italic support line under a title
- `Body`: primary prose block
- `Mono`: inline technical token, filename, hash, key, or code term
- `Numeral`: ordered step marker

### Spacing and density
- Default slide padding comes from `SlideFrame`
- Keep most text blocks at or below `1300px`
- Use `1500px` only for wider compare/explainer slides
- Avoid more than 3 equal-weight cards in one row
- Prefer one strong visual idea per slide

### Slide chrome
- Default base component: `SlideFrame`
- Preferred variants: `page`, `paper`, `ink`, `bleed`
- Footer text should come from `window.HTCS_DECK_META`

## Shared APIs
### Tokens
Path: [htcs-deck-tokens.js](/Users/jlopez/Library/CloudStorage/OneDrive-Harvard-WestlakeSchool/Documents/Honors Topics in Computer Science Repos/ClassResources/public/static/code/lessons/HTCS/_shared/htcs-deck-tokens.js)

Use:
```html
<script src="_shared/htcs-deck-tokens.js"></script>
```

Purpose:
- Establish the canonical palette, type scale, spacing, density, and font stacks.

### Primitives
Path: [htcs-deck-primitives.js](/Users/jlopez/Library/CloudStorage/OneDrive-Harvard-WestlakeSchool/Documents/Honors Topics in Computer Science Repos/ClassResources/public/static/code/lessons/HTCS/_shared/htcs-deck-primitives.js)

Key exports:
- `SlideFrame`
- `SlideFooter`
- `Eyebrow`
- `Title`
- `Subtitle`
- `Body`
- `Mono`
- `Rule`
- `Numeral`
- `BulletList`
- `TwoCol`
- `SectionStack`
- `ContentBand`
- `ActionRow`
- `DeckButton`
- `ToggleButton`

Copyable example:
```jsx
const { SlideFrame, Eyebrow, Title, Body, TwoCol } = window.HTCS_PRIMITIVES;

function ExampleSlide() {
  return (
    <SlideFrame>
      <Eyebrow>Concept</Eyebrow>
      <Title>One idea, two views.</Title>
      <TwoCol
        left={<Body>Explain the first side here.</Body>}
        right={<Body>Explain the second side here.</Body>}
      />
    </SlideFrame>
  );
}
```

## Component Catalog
### `Callout`
- Purpose: short highlighted takeaway or interpretive frame
- Required structure: optional kicker plus one concise block of content
- Allowed variants: `default`, `danger`, `ok`, `gold`
- Sizing: use full width or cap around `1300px`
- Example:
```jsx
const { Callout } = window.HTCS_PATTERNS;

<Callout kicker="Mental model">
  The tracker is a phone book, not a file server.
</Callout>
```

### `InfoCard`
- Purpose: single concept, explanation, or side-by-side comparison cell
- Required structure: title or kicker plus short body
- Allowed variants: `paper`, `ink`
- Sizing: best in 1–3 card rows
- Example:
```jsx
const { InfoCard } = window.HTCS_PATTERNS;

<InfoCard title="Tracker">
  Stores peer addresses, not the bytes of the file.
</InfoCard>
```

### `ComparisonCard`
- Purpose: matched left/right comparison blocks
- Required structure: title plus supporting text
- Allowed variants: `paper`, `ink`
- Sizing: use inside `TwoCol`
- Example:
```jsx
const { ComparisonCard } = window.HTCS_PATTERNS;

<ComparisonCard title="Centralized">
  One authority controls the data path.
</ComparisonCard>
```

### `StatCard`
- Purpose: one large number with interpretive label
- Required structure: value plus label
- Allowed variants: `paper`, `ink`
- Sizing: keep to 2–3 per row
- Example:
```jsx
const { StatCard } = window.HTCS_PATTERNS;

<StatCard value="7 TPS" label="Bitcoin transactions / second" />
```

### `QuoteBlock`
- Purpose: quotes, policy excerpts, or warning text
- Required structure: quote content and optional source
- Allowed variants: `pull`, `policy`, `warning`
- Sizing: use `policy` for smaller excerpts, `pull` for featured lines
- Example:
```jsx
const { QuoteBlock } = window.HTCS_PATTERNS;

<QuoteBlock variant="policy" source="Terms of Service">
  You grant us a broad license to host and distribute the content.
</QuoteBlock>
```

### `ProcessStep`
- Purpose: ordered operational sequence
- Required structure: step number, title, body
- Allowed variants: tone changes only
- Sizing: stack vertically with generous gaps
- Example:
```jsx
const { ProcessStep } = window.HTCS_PATTERNS;

<ProcessStep step={1} title="Contact the tracker">
  Ask for peers that match the info hash.
</ProcessStep>
```

### `TimelineStep`
- Purpose: chronological or phase-based explanation
- Required structure: label, title, body
- Allowed variants: tone changes only
- Sizing: use 3–6 items in a vertical stack

### `RecapBlock`
- Purpose: final teaching takeaway near the end of a deck
- Required structure: a `Callout`-style summary plus optional body
- Allowed variants: default kicker or custom kicker
- Example:
```jsx
const { RecapBlock } = window.HTCS_PATTERNS;

<RecapBlock body="Now connect that model to the live demo.">
  Every peer can be both a client and a server.
</RecapBlock>
```

### Diagram wrappers
- `DiagramFrame`: framed diagram panel with optional caption
- `DiagramLabel`: uppercase diagram label
- `Legend`: color key row
- `Badge`: compact state marker

## SVG Asset Catalog
All assets live in [htcs-deck-assets.js](/Users/jlopez/Library/CloudStorage/OneDrive-Harvard-WestlakeSchool/Documents/Honors Topics in Computer Science Repos/ClassResources/public/static/code/lessons/HTCS/_shared/htcs-deck-assets.js).

### `PeerSvg`, `Person`, `FriendBust`, `NetworkPersonSvg`
- Intent: people/peer visuals for protocols, networks, and transaction stories
- Visual rule: peers are hair-free and use a letter on the shirt to distinguish actors quickly
- Naming:
  - `PeerSvg`: generic reusable wrapper
  - `Person`: labeled Day 1 style editorial bust
  - `FriendBust`: Day 3 ledger-character bust
  - `NetworkPersonSvg`: in-SVG network glyph
- Example:
```jsx
const { PeerSvg, NetworkPersonSvg } = window.HTCS_ASSETS;

<PeerSvg name="Alice" size={180} />
<svg viewBox="0 0 120 140" width="120" height="140">
  <NetworkPersonSvg name="Bob" />
</svg>
```

### `ServerRackSvg`
- Intent: server, hub, or centralized-node icon
- Use: embed inside a larger SVG diagram
- Example:
```jsx
const { ServerRackSvg } = window.HTCS_ASSETS;

<svg viewBox="0 0 140 160" width="140" height="160">
  <g transform="translate(10, 10)">
    <ServerRackSvg />
  </g>
</svg>
```

### `FileIconSvg`, `DocumentSvg`, `DocCard`
- Intent: file metadata, documents, receipts, or ledger sheets
- Use `FileIconSvg` for small icons, `DocumentSvg` for inline SVG use, `DocCard` for larger textual cards

### `CellGridSvg`
- Intent: piece grids, verification matrices, occupancy or state cells
- Example:
```jsx
const { CellGridSvg } = window.HTCS_ASSETS;

<CellGridSvg rows={4} cols={8} active={[[0,0], [0,1], [1,1]]} />
```

### `HashBox`, `HashBoxSvg`, `HashPipeline`
- Intent: hash digests, avalanche comparisons, or pipeline diagrams

### `KeyIcon`, `Padlock`, `Envelope`
- Intent: cryptography slides, signatures, encryption, and transport metaphors

### `StageArrow`, `PaymentArrow`, `NetworkLinkLine`, `PacketOnEdge`
- Intent: directed flows and animated network motion

### `BlockCard`, `BlockSvg`, `MinerSvg`
- Intent: blockchain, mining, proof-of-work, and ledger diagrams

## Composition Recipes
### Cover slide
- Use `SlideFrame variant="bleed"` or a split layout
- One eyebrow, one strong title, one subtitle
- Avoid more than one visual metaphor

### Agenda slide
- Use `Numeral` plus concise `Body` descriptions
- Keep to four parts unless the deck truly needs more

### Concept explainer
- Use `TwoCol`
- Put prose on one side and a shared asset/diagram on the other

### Comparison slide
- Use `TwoCol` plus `ComparisonCard`
- Keep symmetric structure and similar sentence lengths

### Quote slide
- Use `QuoteBlock`
- Reserve `policy` for sourced excerpts and `pull` for large interpretive quotes

### Process slide
- Use stacked `ProcessStep`
- Pair with arrows or icons only when they clarify timing or direction

### Recap slide
- Use `RecapBlock`
- One central summary sentence, then one support paragraph if needed

### Demo slide
- Use `ActionRow` with `DeckButton` or `ToggleButton`
- Keep explanatory copy above the interactive element, not below it

## Build It This Way
- Reuse an existing shared component before creating a new one.
- Add a new shared component only if the pattern is reusable across decks or across multiple slides in one deck.
- Prefer prop variants such as `tone`, `variant`, or `size` instead of forking markup.
- Keep deck-specific business logic in the deck file, not the shared library.
- Preserve the existing visual language unless there is a clear readability problem.

## Anti-Patterns
- Do not create “just for this one slide” card components when `InfoCard` or `QuoteBlock` is close enough.
- Do not add a new color token for one lesson unless it becomes part of the system.
- Do not hardcode footer labels inside shared components; use `window.HTCS_DECK_META`.
- Do not duplicate peer/server/file SVGs inside new decks.

## Migration Notes For Unit 6
- Days 1–5 now load shared tokens and primitives from `_shared/`.
- Day 1 pulls reusable crypto/document visuals from the shared asset library.
- Day 2 pulls reusable cards, quotes, and network glyph primitives from the shared layer.
- Day 3 pulls shared ledger character and block visuals from the shared layer.
- Days 4–5 use the shared foundation instead of duplicated inline token/primitives blocks.

## New Deck Checklist
- Start from `htcs-deck-template.html`.
- Set `window.HTCS_DECK_META` before rendering slides.
- Load `htcs-deck-tokens.js`, `htcs-deck-primitives.js`, `htcs-deck-patterns.js`, and `htcs-deck-assets.js`.
- Use semantic shared components first.
- Move any visual reused twice into `_shared/`.
- Add speaker notes for every slide.
- Verify the slide order array matches the note order.
- Check at least one deck at `1920x1080` before presenting.
