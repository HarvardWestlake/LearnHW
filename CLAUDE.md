# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Harvard‑Westlake classroom resources: a React SPA shell (in `app/`) that wraps a large collection of standalone HTML widgets (in `public/static/`). The shell provides navigation, subject landing pages, and a few in‑app interactive pages; most widgets are self‑contained HTML/CSS/JS files embedded via `<iframe>`. The whole thing is deployed as a static site on Firebase Hosting (project alias `learnhw`).

## Commands

All npm scripts live in `app/`, so `cd app` first (or run `npm --prefix app <script>`).

- `npm run dev` — Vite dev server on `http://127.0.0.1:5180` (port is `strictPort`, will fail rather than auto‑increment).
- `npm run build` — `tsc -b && vite build`. Emits into **`../public/`** (see "Build output layout" below), not `app/dist/`.
- `npm run lint` — ESLint 9 flat config (`app/eslint.config.js`). There is no separate typecheck script; `tsc -b` runs as part of `build`.
- `npm run preview` — Serve the built bundle locally.
- `firebase deploy` (from repo root) — Deploy to Firebase project `learnhw`. The root `package-lock.json` is intentionally empty; there are no root‑level npm scripts.

There is no test suite.

## Architecture

### Two‑tier layout

The repo has two logically separate asset trees that ship together:

1. **`app/`** — React 19 + TypeScript + Vite SPA (source). React Router drives client‑side routing. Entry: `app/src/main.tsx` → `app/src/App.tsx`.
2. **`public/`** — Firebase Hosting root. Contains:
   - The **built** SPA (`public/index.html`, `public/assets/`) — these are build artifacts, gitignored.
   - The **static widgets** under `public/static/<subject>/widgets/<slug>/<slug>.html` — these are committed source. Subjects: `chem`, `code`, `econ`, `history`, `math`, `stats`, plus `public/static/data/` for shared datasets.
   - Shared widget styles at `public/static/math/widgets/shared/styles.css`. Non‑math widgets (e.g. `code/widgets/array-list/array-list.html`) link to this file via relative paths like `../../../math/widgets/shared/styles.css` — renaming or moving the `shared/` folder breaks many widgets across subjects.

### Build output layout (important)

`app/vite.config.ts` sets `build.outDir: '../public'` with `emptyOutDir: false`. That means `npm run build` writes the SPA bundle **into the same folder that holds the static widgets**. Consequences:

- `public/index.html`, `public/assets/`, and `public/app/assets/` are build artifacts (see root `.gitignore`). Do not edit them by hand — regenerate via `npm run build`.
- Because `emptyOutDir` is off, a stale build can linger. If you see old hashes in `public/assets/`, clear that folder before rebuilding.
- Anything else under `public/` — especially `public/static/**` — is source. Never delete `public/` wholesale.

### Dev server serves real static widgets

Vite's default "public dir" is inside `app/`, but the static widgets live at the **repo‑level** `public/`. A custom middleware plugin `serveExternalPublicStatic` in `app/vite.config.ts` rewrites requests for `/static/*` to read from `../public/static/*` on disk. This means widget iframe URLs (`/static/math/widgets/...`) resolve identically in dev and in production Firebase Hosting — no path switching needed.

### Routing: SPA + iframe embed pattern

`app/src/App.tsx` defines all routes. The pattern for most subject widgets:

1. Subject landing page (e.g. `Math.tsx`) reads a widget map from `app/src/pages/widgetMaps.ts` and renders a grid of cards linking to `/<subject>/<slug>`.
2. `/<subject>/:widget` is handled by `WidgetRoute`, which looks up the slug in the map and renders `StaticEmbed` — an iframe pointing at the widget's HTML under `/static/`.
3. A few widgets are implemented as native React pages instead of iframes (e.g. `BinaryExplorer`, `Sha1FlowExplorer`, `WorldGlobe`, `LectureViewer`). These have their own explicit `<Route>` entries that take precedence over the generic `WidgetRoute` — so when adding special cases, place the explicit route **before** the `:widget` catch‑all for that subject.

Adding a new iframe‑style widget: (a) drop HTML/assets under `public/static/<subject>/widgets/<slug>/`, (b) add an entry to the appropriate map in `widgetMaps.ts`, (c) the landing page picks it up automatically.

### Firebase hosting config

`firebase.json` does two important things beyond plain static hosting:

- **SPA rewrites** for `/history`, `/admin`, `/mobile`, `/chem`, `/econ`, `/math`, `/code`, `/stats` (and their `/**` children) → `/index.html`, so React Router handles those paths.
- A large block of **301 redirects** from legacy flat widget URLs (`/static/<slug>/**`) to the current subject‑nested paths (`/static/<subject>/widgets/<slug>/**`). When renaming or relocating a widget, add a redirect here so existing links (embedded in class materials, student bookmarks, etc.) keep working — don't just delete the old path. Note the intentional typo `rsa-encrpytion` is the canonical path; both typo'd and correctly‑spelled URLs redirect to it.

### Frontend tech notes

- React 19, react‑router‑dom 7, TypeScript 5.9, Vite 7 with `@vitejs/plugin-react-swc`.
- `tsconfig.app.json` is strict: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Type‑only imports must use `import type`.
- 3D globe uses `globe.gl` + `three` + `three-globe`. Vite config pins `three` via `resolve.dedupe` and `overrides` in `package.json` to avoid the common "multiple three.js instances" bug — keep those pins aligned when upgrading.
- Shared SPA styles live in one large file: `app/src/index.css`. Common utility classes used across pages: `.hw-topnav`, `.page`, `.container`, `.widgets-page`, `.widgets-grid`, `.widget-card`, `.panel`, `.btn`, `.h1`..`.h5`, `.muted`. The `/admin` route (`StyleGuide.tsx`) is a living reference for these.
