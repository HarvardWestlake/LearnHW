# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Harvard‑Westlake classroom resources: a React SPA shell (in `app/`) that wraps a large collection of standalone HTML widgets (in `public/static/`). The shell provides navigation, subject landing pages, and a few in‑app interactive pages; most widgets are self‑contained HTML/CSS/JS files embedded via `<iframe>`. The whole thing is deployed as a static site on Firebase Hosting (project alias `learnhw`).

## Commands

All npm scripts live in `app/`, so `cd app` first (or run `npm --prefix app <script>`).

- `npm run dev`: Vite dev server on `http://127.0.0.1:5180` (port is `strictPort`, will fail rather than auto‑increment).
- `npm run build`: `tsc -b && vite build`. Emits into **`../public/`** (see "Build output layout" below), not `app/dist/`.
- `npm run lint`: ESLint 9 flat config (`app/eslint.config.js`). There is no separate typecheck script; `tsc -b` runs as part of `build`.
- `npm run preview`: Serve the built bundle locally.
- `firebase deploy` (from repo root): Deploy to Firebase project `learnhw`. The root `package-lock.json` is intentionally empty; there are no root‑level npm scripts.

There is no test suite.

## Architecture

### Two‑tier layout

The repo has two logically separate asset trees that ship together:

1. **`app/`**: React 19 + TypeScript + Vite SPA (source). React Router drives client‑side routing. Entry: `app/src/main.tsx` → `app/src/App.tsx`.
2. **`public/`**: Firebase Hosting root. Contains:
   - The **built** SPA (`public/index.html`, `public/assets/`). These are build artifacts, gitignored.
   - The **static widgets** under `public/static/<subject>/widgets/<slug>/<slug>.html`. These are committed source. Subjects: `chem`, `code`, `econ`, `history`, `math`, `stats`, plus `public/static/data/` for shared datasets.
   - Shared widget styles at `public/static/math/widgets/shared/styles.css`. Non‑math widgets (e.g. `code/widgets/array-list/array-list.html`) link to this file via relative paths like `../../../math/widgets/shared/styles.css`. Renaming or moving the `shared/` folder breaks many widgets across subjects.

### Build output layout (important)

`app/vite.config.ts` sets `build.outDir: '../public'` with `emptyOutDir: false`. That means `npm run build` writes the SPA bundle **into the same folder that holds the static widgets**. Consequences:

- `public/index.html`, `public/assets/`, and `public/app/assets/` are build artifacts (see root `.gitignore`). Do not edit them by hand; regenerate via `npm run build`.
- Because `emptyOutDir` is off, a stale build can linger. If you see old hashes in `public/assets/`, clear that folder before rebuilding.
- Anything else under `public/`, especially `public/static/**`, is source. Never delete `public/` wholesale.

### Dev server serves real static widgets

Vite's default "public dir" is inside `app/`, but the static widgets live at the **repo‑level** `public/`. A custom middleware plugin `serveExternalPublicStatic` in `app/vite.config.ts` rewrites requests for `/static/*` to read from `../public/static/*` on disk. This means widget iframe URLs (`/static/math/widgets/...`) resolve identically in dev and in production Firebase Hosting, with no path switching needed.

### Routing: SPA + iframe embed pattern

`app/src/App.tsx` defines all routes. The pattern for most subject widgets:

1. Subject landing page (e.g. `Math.tsx`) reads a widget map from `app/src/pages/widgetMaps.ts` and renders a grid of cards linking to `/<subject>/<slug>`.
2. `/<subject>/:widget` is handled by `WidgetRoute`, which looks up the slug in the map and renders `StaticEmbed`, an iframe pointing at the widget's HTML under `/static/`.
3. A few widgets are implemented as native React pages instead of iframes (e.g. `BinaryExplorer`, `Sha1FlowExplorer`, `WorldGlobe`, `LectureViewer`). These have their own explicit `<Route>` entries that take precedence over the generic `WidgetRoute`. When adding special cases, place the explicit route **before** the `:widget` catch‑all for that subject.

Adding a new iframe‑style widget: (a) drop HTML/assets under `public/static/<subject>/widgets/<slug>/`, (b) add an entry to the appropriate map in `widgetMaps.ts`, (c) the landing page picks it up automatically.

### Firebase hosting config

`firebase.json` does two important things beyond plain static hosting:

- **SPA rewrites** for `/history`, `/admin`, `/mobile`, `/chem`, `/econ`, `/math`, `/code`, `/stats` (and their `/**` children) → `/index.html`, so React Router handles those paths.
- A large block of **301 redirects** from legacy flat widget URLs (`/static/<slug>/**`) to the current subject‑nested paths (`/static/<subject>/widgets/<slug>/**`). When renaming or relocating a widget, add a redirect here so existing links (embedded in class materials, student bookmarks, etc.) keep working. Do not just delete the old path. Note the intentional typo `rsa-encrpytion` is the canonical path; both typo'd and correctly‑spelled URLs redirect to it.

### Frontend tech notes

- React 19, react‑router‑dom 7, TypeScript 5.9, Vite 7 with `@vitejs/plugin-react-swc`.
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Type‑only imports must use `import type`.
- 3D globe uses `globe.gl` + `three` + `three-globe`. Vite config pins `three` via `resolve.dedupe` and `overrides` in `package.json` to avoid the common "multiple three.js instances" bug. Keep those pins aligned when upgrading.
- Shared SPA styles live in one large file: `app/src/index.css`. Common utility classes used across pages: `.hw-topnav`, `.page`, `.container`, `.widgets-page`, `.widgets-grid`, `.widget-card`, `.panel`, `.btn`, `.h1`..`.h5`, `.muted`. The `/admin` route (`StyleGuide.tsx`) is a living reference for these.

## HTCS deck writing style

The HTCS Unit 6 React decks (`app/src/htcs-decks/unit6/dayXX/`) follow a specific editorial style. Use these conventions when adding or editing slide content. The same conventions apply to other decks built on the same primitives.

**Voice and register**

- Pedagogical, not promotional. Slides are part of a class lesson, not a product pitch. Avoid "catchy" titles, marketing-style stacked fragments (for example, "Zero downtime. No chain split. No lost balances."), and rhetorical hooks.
- Titles describe the topic of the slide in plain language. Prefer "How Proof of Work Mining Functions" over "Mining is a race." Prefer "What Is a Smart Contract?" over "A smart contract is code that owns money."
- Define technical terms on the slide where the term first appears. The first appearance of nonce, validator, slashing, gas, EVM, ERC-20, and so on should include a one-sentence definition.
- Use italics for terms being defined, not for emphasis. Italicizing *slashing* on the slide that introduces the term is fine. Italicizing a hook word like *race* is not.

**Brevity**

- Slides are visual anchors. The presenter expands on each point aloud; the speaker notes in `notes.ts` carry the rich explanation.
- Body paragraphs should be one or two short sentences each. A slide should rarely contain more than three body paragraphs.
- Card descriptions, table cells, and bullet items stay at one or two short clauses. Cut hedging, qualifying phrases, and restated definitions.

**Java analogies for Solidity content**

- HTCS students come from a Java background. When introducing Solidity, anchor each concept to its Java counterpart: `contract` is like a Java `class`, `mapping(address => uint256)` is like a `HashMap<Address, Long>`, `require` is like `if (!cond) throw …` but reverting all state changes, `constructor` has the same purpose as Java's, a Solidity state variable is an instance variable that persists on the blockchain.
- The first appearance of a Solidity-only feature (`payable`, `view`, `pragma`) should explicitly note the lack of a Java equivalent.

**Footer-safe layout**

- Each deck is 1920×1080 logical pixels. The `SlideFrame` content area runs from y=100 to y=990 (roughly 890 px tall). The footer occupies the bottom 84 px or so, with its top edge near y=996.
- Risk pattern: a slide with a `flex: 1` content grid plus a `Callout` below. If the grid's natural content exceeds the share of vertical space left for it, the column overflows past y=990 and visually overlaps the footer.
- The biggest sources of unexpected overflow:
  1. Two `StatCard` components stacked in one column. Each card is roughly 300 to 400 px once the 96-px value font, 36-px padding, and a multi-line caption are counted.
  2. A `Callout` placed inside a narrow column. The default body font wraps to many more lines at column width than at the full slide width, and the kicker plus padding adds about 90 px of fixed overhead.
  3. Body paragraphs at `bodyLg` (36 px) inside narrow cards (three-up risk cards, half-width comparison columns). Dropping to `body` (32 px) cuts wrap-line count noticeably.
- When a slide overflows: reduce content first (shorter body, fewer rows, fewer columns). Then reduce typography (smaller value font, smaller padding, lower body size). Restructure (for example, combine two cards into one with a 2-column inner grid) only when the simpler fixes are not enough.

## Collaboration Guidelines

These rules govern how the assistant should behave in all interactions on this project.

- **No em dashes:** In newly generated assistant or curriculum prose, do not use the long dash punctuation mark. Use commas, colons, parentheses, or restructure the sentence. Markdown table separator rows and existing unit-name punctuation are not violations unless the file is being edited for style.
- **Fact-check always:** Before finalizing any content, verify factual claims against the curriculum context files. Flag anything that cannot be confirmed.
- **Clear writing:** Prioritize plain, precise language. Avoid jargon, hedging, and filler phrases. Sentences should earn their place.
- **Pedagogical lens:** Always consider how content will land for a learner. Think about pacing, scaffolding, cognitive load, and misconceptions students are likely to have. Proactively suggest improvements when a pedagogical issue is visible.
- **Ask, don't guess:** If a request is ambiguous or a key detail is missing, ask a clarifying question before proceeding. Never fill in gaps with assumptions.
- **Suggest improvements:** If work could be clearer, better structured, or more effective pedagogically, flag it with a brief suggestion even if the user did not ask for a review.
- **Update Context:** If you find a useful pattern or think something would be good to remember in the context of this project, create or update a file in the `Context/` folder with permission. All project knowledge lives here, not in external memory.
- **Save skills locally:** Project-specific assistant skills, reusable workflows, or skill instructions belong in `Context/Skills/`, not in external skill folders or personal memory. Add or update the relevant context map entry when a skill should be discoverable for future project work.
- **Save active plans:** Any implementation plan, migration plan, curriculum plan, or multi-step project plan that is being executed must be copied into `Context/Plans/` as a Markdown file. Do not leave active plans only in chat, IDE notes, or external memory. Use a clear filename and add or update the plan entry in this context map.
- **Mark completed plans historical:** When a plan is complete, rename or label it as historical, update its opening note to say it is no longer active, and update this context map so future assistants know it is reference material rather than current work.
