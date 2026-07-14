# programming-concepts

**The Dependency Graph of Programming Ideas** — an interactive atlas of ~138
programming concepts arranged as a dependency graph. Every node tells you what
it *rests on*, what it *makes possible*, and the reason on every edge. Concepts
are stratified into five tiers, from foundations (state, control flow) up to
theory and frontier (type theory, Curry–Howard, effect systems).

Built with **Vite + TypeScript**, vanilla — no framework, no runtime
dependencies. The renderer is a hand-rolled tidy-tree layout with pan/zoom, a
detail panel, an outline view, and search.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # static build → dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

## Project layout

```
index.html      shell markup (Google Fonts + graph scaffolding)
src/
  main.ts       the app: index, layout, render, pan/zoom, panel, outline, search
  data.ts       the concept graph — NODES + TIERS (this is the file you edit)
  style.css     all styling
```

## Editing the graph

All content lives in [`src/data.ts`](src/data.ts). Each concept is a tuple:

```ts
[id, name, tier, blurb, parents]
```

where `parents` is a list of `[parentId, whyThisEdgeExists]`. The **first**
parent is the "primary" edge that defines the node's position on the tidy-tree
spine; any additional parents render as cross-links. To add a concept, append a
tuple and reference existing ids as its parents — the index, layout, outline,
and search all derive from this array automatically.

## Deploy

`npm run build` emits a fully static `dist/` with a relative base path, so it
drops onto GitHub Pages, Netlify, Vercel, or any static host as-is.
