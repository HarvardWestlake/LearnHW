# HTCS Slide Deck Universal Style Guide Plan

## Goal
Standardize Unit 6 as the pilot implementation for a reusable HTCS HTML slide-deck system. The implementation should preserve the existing standalone HTML + React/Babel workflow while turning the recurring visual language into one shared authoring layer.

## Pilot Inventory
### Foundations already consistent in Days 3–5
- Palette: cream, paper, navy ink, oxblood accent, gold highlight
- Type system: `Eyebrow`, `Title`, `Subtitle`, `Body`, `Mono`, `Numeral`
- Slide chrome: `SlideFrame`, `SlideFooter`, cover split layout, part dividers
- Deck runtime: `deck-stage`, presenter mode, slide mounting pattern

### Repeated patterns across Days 1–5
- Cards: comparison cards, metadata cards, stat cards, recap cards
- Callouts: line-bounded pull callouts, explanatory callouts, warning callouts
- Quotes: pull quotes, policy quotes, “pattern” quotes
- Layouts: two-column explainers, banded content rows, recap compositions
- Controls: inline step buttons, toggles, action rows
- SVG assets: peers, server racks, files/documents, locks, keys, envelopes, arrows, blocks, miners, cell grids, hash boxes

## Shared Authoring Layer
Implemented under [public/static/code/lessons/HTCS/_shared](/Users/jlopez/Library/CloudStorage/OneDrive-Harvard-WestlakeSchool/Documents/Honors Topics in Computer Science Repos/ClassResources/public/static/code/lessons/HTCS/_shared):
- `htcs-deck-tokens.js`
- `htcs-deck-primitives.js`
- `htcs-deck-patterns.js`
- `htcs-deck-assets.js`
- `htcs-deck-template.html`

Window namespaces:
- `window.HTCS_TOKENS`
- `window.HTCS_PRIMITIVES`
- `window.HTCS_PATTERNS`
- `window.HTCS_ASSETS`

Compatibility exports:
- Shared files also assign the main primitives and patterns directly onto `window` so existing deck code can adopt the shared layer without a bundler rewrite.

## Deck Migration Order
1. Day 2 pressure test:
   - Use shared tokens/primitives
   - Replace repeated card, quote, peer, server, and line primitives with shared exports
2. Day 1 normalization:
   - Move document/hash/person/key/lock/envelope assets to shared exports
3. Day 3 normalization:
   - Move friend busts, payment arrows, Pi people, and block cards to shared exports
4. Days 4–5 cleanup:
   - Consume the shared foundation instead of duplicating tokens/primitives inline

## Style System Rules
- Prefer variants via props over introducing new components.
- Any visual or pattern used in 2+ slides belongs in `_shared/`.
- Use semantic component names such as `InfoCard` or `QuoteBlock`, not visual nicknames.
- Keep slide-specific logic inside the deck file; move reusable authored structure and visuals into shared files.

## Verification Targets
- Each Unit 6 deck loads the shared authoring layer from `_shared/`.
- The shared template is sufficient to start a new HTCS deck without copying Day 3 by hand.
- The style guide documents the foundations, catalog, assets, recipes, anti-patterns, migration rules, and new-deck checklist.
