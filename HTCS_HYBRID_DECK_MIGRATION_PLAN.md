# HTCS Hybrid Deck Migration Plan

## Goal
Move Unit 6 from “React inside standalone HTML files” to a hybrid system with:

- React source decks as the single authoring model
- generated interactive HTML artifacts
- generated static PDF artifacts

## Why Start With Days 5 And 4
Days 5 and 4 are the best first pair for this migration.

### Day 5 first
`HTCS_Unit6_Day5.html` is relatively compact and mostly slide-structured. It already consumes the shared `_shared` deck layer and has no major React stateful demo surface in the slide code. That makes it the safest pipeline pilot.

### Day 4 second
`HTCS_Unit6_Day4.html` is also compact and already uses `_shared`, but it includes at least one real stateful interaction in `SlideMultisigVerification`. That makes it the right second migration because it forces the PDF/static-export contract to be real, not theoretical.

### Why not start with Days 1–3
Days 1–3 are larger and more interactive:

- Day 1: `2543` lines, multiple `crypto.subtle` demos and staged interactions
- Day 2: `3958` lines, many network demos and the largest narrative surface
- Day 3: `3943` lines, multiple animated simulations, `crypto.subtle`, and a `Worker`-based mining demo

Those should come after the pipeline is proven on smaller decks.

## Recommended Migration Order
1. Build the shared hybrid pipeline foundation.
2. Migrate Day 5.
3. Migrate Day 4.
4. Migrate Day 1.
5. Migrate Day 2.
6. Migrate Day 3.

## Phase 0: Foundation Work
This phase happens once before any individual day is migrated.

### Step 0.1. Create the React deck source area
Add a new source area under `app/src/htcs-decks/`.

Recommended structure:

```text
app/src/htcs-decks/
  runtime/
  shared/
  unit6/
    day04/
    day05/
```

### Step 0.2. Define the deck contract
Create shared types for:

- deck metadata
- slide definitions
- render mode
- speaker notes

Each deck should export:

- `meta`
- `speakerNotes`
- `slides`

### Step 0.3. Extract the runtime into reusable source files
Move the reusable audience/presenter/runtime logic out of per-deck HTML duplication and into source modules.

That includes:

- `deck-stage`
- slide mounting logic
- presenter sync
- notes serialization
- export-mode flags

### Step 0.4. Keep the current static output paths
Do not change public URLs during the first migration wave.

Continue generating:

- `public/static/code/lessons/HTCS/HTCS_Unit6_Day4.html`
- `public/static/code/lessons/HTCS/HTCS_Unit6_Day4.pdf`
- `public/static/code/lessons/HTCS/HTCS_Unit6_Day5.html`
- `public/static/code/lessons/HTCS/HTCS_Unit6_Day5.pdf`

This preserves the current site integration model.

### Step 0.5. Build the HTML generator
Add a build step that takes a deck module and emits the standalone interactive HTML artifact.

Requirements:

- embed or locally reference the runtime bundle
- serialize speaker notes
- preserve `deck-stage`
- preserve presenter mode
- preserve slide labels and deck metadata

### Step 0.6. Build the PDF export pipeline
Add a headless-browser export step that:

1. opens the generated HTML deck
2. switches to static export mode
3. captures each slide at authored size
4. assembles the captures into a PDF

Recommended implementation direction:

- use a browser automation tool such as Playwright
- render deterministic slide screenshots
- assemble one image per PDF page

### Step 0.7. Add static export rules
Create a shared export contract so interactive slides can declare how they should render in PDF mode.

Every interactive slide should have a deterministic static state.

## Phase 1: Day 5 Pilot
`public/static/code/lessons/HTCS/HTCS_Unit6_Day5.html`

### Why Day 5 is the pilot
- already uses `_shared`
- compact slide count
- mostly explanatory/static composition
- lowest export risk among the remaining Unit 6 decks

### Day 5 migration steps
1. Create `app/src/htcs-decks/unit6/day05/`.
2. Port `meta`, `speakerNotes`, and the `SLIDES` order into the new deck module.
3. Move slide components from the inline Babel block into `.tsx` modules.
4. Replace `window`-based shared imports with real module imports from the React shared deck layer.
5. Keep visual parity with the current HTML deck before changing any design details.
6. Generate the first standalone HTML artifact at the existing `public/static` path.
7. Verify audience mode, presenter mode, slide persistence, and notes alignment.
8. Generate the first PDF artifact from static slide captures.
9. Compare the PDF against the current deck slide-by-slide for legibility and layout.
10. Update HTCS lesson metadata so Day 5 can expose both HTML and PDF downloads.

### Day 5 verification target
- HTML deck behaves exactly like the current standalone deck.
- PDF deck is visually stable and requires no live interaction to understand.
- No manual edits are required in the generated HTML after build.

## Phase 2: Day 4 Validation Of Interactive Export
`public/static/code/lessons/HTCS/HTCS_Unit6_Day4.html`

### Why Day 4 comes next
Day 4 adds the first meaningful interactive-export test because `SlideMultisigVerification` uses React state. That makes it the right place to validate the static export contract.

### Day 4 migration steps
1. Create `app/src/htcs-decks/unit6/day04/`.
2. Port deck metadata, notes, and slide order into the new deck module.
3. Move slide components into `.tsx` files with real imports.
4. Port `SlideMultisigVerification` carefully, preserving its interactive audience behavior.
5. Define a deterministic PDF/static state for that slide.
   Recommended first export state:
   show a canonical `2-of-3` threshold with two valid keys selected.
6. Add any deck-local export helpers needed for static rendering.
7. Generate the standalone HTML artifact at the current public path.
8. Generate the PDF artifact and confirm the multisig slide exports to the intended static state.
9. Compare layout and notes behavior against the current Day 4 deck.
10. Update lesson metadata so Day 4 also exposes both HTML and PDF outputs.

### Day 4 verification target
- Interactive HTML still teaches threshold signing with live state.
- PDF shows a clean, fixed example rather than an arbitrary UI state.
- Day 4 proves that interactive slides can export predictably.

## Phase 3: Continue With The Previous Days

### Day 1 next
Move Day 1 after Days 5 and 4.

Why:

- it is smaller than Days 2 and 3
- it has several reusable cryptography demos
- it will pressure-test the PDF snapshot model for `crypto.subtle` slides without the extra complexity of Day 3’s worker-based mining

Day 1 focus:

- extract reusable hash/signature teaching components into shared React code
- define static export states for the hash playground and Alice/Bob walkthrough
- preserve notes and presenter behavior

### Day 2 after Day 1
Move Day 2 after Day 1.

Why:

- it is the largest deck by line count
- it contains several interactive topology, chunking, resilience, and malicious-peer demos
- it already depends heavily on the shared visual layer, so it will benefit from the new pipeline once the export rules are proven

Day 2 focus:

- define static export presets for every network demo
- keep protocol diagrams readable in both interactive and PDF outputs
- preserve recently added protocol-detail slides during migration

### Day 3 last
Move Day 3 last.

Why:

- it combines the most complexity
- it includes animated ledger simulations
- it uses `crypto.subtle`
- it includes a `Worker`-based proof-of-work/mining demo

Day 3 focus:

- define stable static states for every major simulation
- create deterministic export behavior for the mining and chain-fork slides
- migrate only after the pipeline handles all simpler deck patterns confidently

## Shared Rules During Migration
- Keep the current public deck URLs stable until all consuming pages are updated.
- Treat React source as the editable version once a day is migrated.
- Do not continue hand-editing the generated HTML artifact after the pipeline is in place.
- Keep the current shared HTCS design language intact during migration; this is a platform change first, not a redesign.
- Require slide-count parity and speaker-note parity between legacy and migrated decks.

## Deliverables By Stage
### After Foundation
- shared deck types
- shared runtime modules
- HTML build pipeline
- PDF export pipeline

### After Day 5
- first end-to-end hybrid deck in production shape
- first HTML artifact generated from React source
- first PDF artifact generated from React source

### After Day 4
- first validated export of a stateful interactive slide
- second migrated deck using the same pipeline

### After Days 1–3
- full Unit 6 on the hybrid workflow
- React source as the single source of truth
- HTML and PDF outputs available for every Unit 6 day

## Practical Next Step
Start with the foundation work and use Day 5 as the first migrated pilot.

That sequence gives the cleanest path:

1. prove the build pipeline
2. prove the PDF export
3. prove interactive static snapshots
4. only then tackle the larger legacy days
