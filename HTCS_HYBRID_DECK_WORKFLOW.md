# HTCS Hybrid Slide Deck Workflow

## Purpose
This document defines the target workflow for future HTCS slide decks.

For each future day, we want three representations of the same deck:

- A React source deck that we author and maintain.
- An interactive HTML deck that students or teachers can open and download.
- A PDF deck that exports one static slide image per page.

The React source should be the single source of truth. The HTML and PDF versions should be generated artifacts, not separately hand-authored decks.

## Current Starting Point
Unit 6 already uses a partial hybrid model:

- Decks are standalone `.html` files in `public/static/code/lessons/HTCS/`.
- Shared authoring pieces already live in `public/static/code/lessons/HTCS/_shared/`.
- Slides are already written as React components inside browser-transpiled Babel blocks.
- `deck-stage` already handles navigation, presenter mode, and print layout.

This workflow keeps the strengths of that system while moving authorship into real React modules.

## Core Rule
Author the deck once in React. Generate the HTML and PDF outputs from that React source.

Do not maintain a separate “React deck” and “HTML deck” by hand after the pipeline exists.

## Output Model
### 1. React Version
This is the authoring version.

Recommended location:

```text
app/src/htcs-decks/
  runtime/
  shared/
  unit6/
    day05/
      deck.tsx
      slides.tsx
      notes.ts
      export.ts
```

The React version should contain:

- Deck metadata
- Speaker notes
- Ordered slide list
- Interactive slide components
- Static export behavior for PDF

### 2. HTML Version
This is the interactive delivery artifact.

Recommended output location:

```text
public/static/code/lessons/HTCS/HTCS_Unit6_Day5.html
```

The HTML output should preserve:

- `deck-stage`
- keyboard navigation
- presenter mode
- slide persistence
- embedded speaker notes
- interactive demos
- current download/open behavior in the site

### 3. PDF Version
This is the static delivery artifact.

Recommended output location:

```text
public/static/code/lessons/HTCS/HTCS_Unit6_Day5.pdf
```

The PDF output should be:

- one slide per page
- flattened to static images
- free of overlays, presenter controls, and transient UI
- deterministic, so repeated exports produce the same result

## Recommended Deck Contract
Each deck module should export a predictable shape.

Example:

```tsx
import type { DeckDefinition } from '../runtime/types'

export const deck: DeckDefinition = {
  meta: {
    courseLabel: 'HTCS · Unit 6 · Day 05',
    deckTitle: 'Lightning Networks',
    deckLabel: 'Lightning Networks',
    dayLabel: 'Day 05',
  },
  speakerNotes: [
    'Cover note...',
    'Agenda note...',
  ],
  slides: [
    { label: 'Cover', Component: SlideCover },
    { label: 'Agenda', Component: SlideAgenda },
  ],
}
```

Recommended supporting types:

```tsx
export type SlideDefinition = {
  label: string
  Component: React.ComponentType<DeckRenderProps>
}

export type DeckDefinition = {
  meta: {
    courseLabel: string
    deckTitle: string
    deckLabel: string
    dayLabel: string
  }
  speakerNotes: string[]
  slides: SlideDefinition[]
}

export type DeckRenderMode = 'interactive' | 'static'

export type DeckRenderProps = {
  mode: DeckRenderMode
}
```

## Construction Workflow For A Future Day
### Step 1. Create the React source deck
Create a new deck directory and author slides in `.tsx`.

At minimum:

- `deck.tsx` for deck metadata and slide order
- `slides.tsx` for the slide components
- `notes.ts` if you want notes split from slide code
- `export.ts` if the deck needs custom PDF/export helpers

### Step 2. Build slides with shared components
Use the shared HTCS visual system instead of copying style blocks between decks.

Shared visual primitives should come from the React source equivalents of:

- `htcs-deck-tokens`
- `htcs-deck-primitives`
- `htcs-deck-patterns`
- `htcs-deck-assets`

Rule of thumb:

- If a pattern appears in 2+ slides, move it into shared code.
- If a pattern appears in 2+ decks, it definitely belongs in shared code.

### Step 3. Decide how each interactive slide behaves in PDF mode
Every slide must render sensibly in two modes:

- `interactive`
- `static`

For many slides, `static` can be the same JSX with motion disabled.

For demos, `static` should be a deliberate snapshot:

- final state
- explanatory mid-state
- canonical example state

Do not let PDF capture arbitrary transient animation frames.

Examples:

- A topology demo should export a stable, fully legible network state.
- A mining demo should export a settled state, not an actively changing nonce search.
- A signature or hash demo should export a pre-filled example input and result.

### Step 4. Generate the HTML deck
The HTML export should:

- serialize deck metadata
- serialize speaker notes
- mount the slide components into `deck-stage`
- preserve presenter mode and interactive behavior
- keep current path conventions under `public/static/code/lessons/HTCS/`

The HTML output can be:

- a fully self-contained single file, or
- an HTML file plus local bundled JS/CSS assets

Single-file HTML is better for portability.
Bundled local assets are better than CDN dependencies for long-term reliability.

### Step 5. Generate the PDF deck
Recommended export strategy:

1. Build the HTML deck.
2. Open it in a headless browser in export mode.
3. Force `mode="static"`.
4. Render each slide at authored size, such as `1920x1080`.
5. Capture one image per slide.
6. Assemble those images into a PDF.

This is better than trusting ordinary browser print for highly interactive slides because it gives deterministic export states.

## HTML Requirements
The HTML artifact should include:

- slide order
- speaker notes
- presenter mode
- keyboard/tap navigation
- local asset references
- local fonts where practical

The HTML artifact should not depend on:

- manual copy/paste of slide code
- per-deck duplicated runtime code if that runtime can be shared
- browser-side Babel transpilation in the long term

## PDF Requirements
The PDF artifact should:

- flatten each slide to a static image
- remove controls and overlays
- avoid loading states mid-render
- freeze all animation
- use deterministic example values where needed

The PDF artifact should not attempt to preserve interactivity.

## Speaker Notes Rules
Speaker notes should live in the React source and flow into the HTML artifact automatically.

Recommended rule:

- `speakerNotes.length` must equal `slides.length`

The PDF export does not need speaker notes embedded.

## Presenter Mode Rules
Presenter mode belongs to the HTML version only.

The React source should expose enough metadata for the HTML build to include:

- current slide index
- total slide count
- note text
- navigation sync between audience and presenter windows

## Asset And Font Rules
For a downloadable workflow, prefer local assets over remote dependencies.

Recommended direction:

- bundle fonts locally if offline reliability matters
- bundle runtime JS locally
- avoid depending on `unpkg` or browser-side Babel in final generated output

## Site Integration Rules
The site can keep its current static-asset model.

Each lesson should eventually expose both:

- `htmlSrc`
- `pdfSrc`

That lets the HTCS lessons page keep offering:

- `Open`
- `Download HTML`
- `Download PDF`

## Suggested Commands
Target commands for the eventual pipeline:

```text
npm run deck:dev -- unit6/day5
npm run deck:build-html -- unit6/day5
npm run deck:build-pdf -- unit6/day5
npm run deck:build-all -- unit6/day5
```

These do not need to exist yet, but the architecture should aim toward this interface.

## Checklist For A New Future Day
- Create the deck module in React.
- Define `meta`, `speakerNotes`, and ordered `slides`.
- Use shared HTCS components and assets first.
- Make every interactive slide render correctly in `interactive` and `static` modes.
- Generate the interactive HTML output.
- Generate the flattened PDF output.
- Verify slide count, notes alignment, and presenter mode.
- Verify the PDF has one stable image per slide.
- Publish the HTML and PDF artifacts to `public/static/code/lessons/HTCS/`.

## Recommended Rule For The Transition Period
Until the full pipeline exists, keep the current standalone HTML decks working.

During migration:

- React deck source becomes the editable version.
- Generated HTML remains the public interactive artifact.
- Generated PDF becomes the public printable artifact.
- Existing hand-authored HTML should be treated as legacy output to replace, not a second source of truth to keep editing forever.
