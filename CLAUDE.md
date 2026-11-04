# IncoInfo marketing site

A static marketing site for IncoInfo (company reports on Indian registered companies). The product itself (search, basket, checkout, sign-in) is a **separate portal**. This site only links to it through `%PORTAL_URL%` (set `VITE_PORTAL_URL` in `.env`).

## Stack
- Plain HTML pages, CSS and vanilla JS modules. Vite (multi-page) is used only as the build tool, and the output in `dist/` is fully static.
- Tailwind CSS v4 (`@tailwindcss/vite`). The theme lives in `src/styles/main.css` under `@theme`.
- GSAP + ScrollTrigger (motion), Lenis (smooth scroll), Chart.js (charts, lazy-loaded), Lucide icons inlined at build time.
- Fonts are self-hosted from `public/fonts/` (copied out of `@fontsource-variable/*`): **Schibsted Grotesk** (headings) and **Inter** (body and UI). The `@font-face` rules and the metric-matched fallbacks are in `src/styles/fonts.css`, and the two latin files are preloaded in `partials/head.html`.

## Page authoring
- Every `*.html` file outside `partials/ src/ public/ scripts/ brand/` becomes a page (see `vite.config.js`). Clean URLs use `folder/index.html`.
- Shared markup goes in `partials/*.html`, pulled in with `<!-- @include name key="value" -->`. `{{key}}` inside a partial is replaced by the attribute.
- Icons: `{{icon:lucide-name}}` or `{{icon:lucide-name|extra classes}}`. These are inlined SVG, so no icon JS runs in the browser.
- The 12 solution pages are **generated** from `src/data/solutions.mjs` by `node scripts/gen-solutions.mjs`. Edit the data, then re-run the script. Do not hand-edit `solutions/*/index.html`.
- Chart and sample data live in `src/data/`. Placeholder figures, prices, testimonials and client names are marked `TODO`.

## Brand tokens (sampled from `brand/logo.png` pixels)
| Token | Hex | Use |
|---|---|---|
| `brand-900` | `#0A456D` | Navy. Key figures, gradient start (the footer is light: `surface-tint`) |
| `brand-700` | `#20659F` | **Primary**: CTAs, links, key numbers, focus rings (6.1:1 on white) |
| `brand-400` | `#2798D3` | **Accent only**: chart strokes, highlights, motion. Never body text (3.2:1) |
| `ink` | `#0F1E2E` | Body text (no pure black) |
| `ink-muted` | `#4A5866` | Secondary text |
| `surface-tint` | `#F2F7FB` | Section breaks |
| `line` | `#DCE6EF` | 1px borders |
| success / warn / danger | `#1F7A4D` / `#A15C00` / `#B42318` | Status chips only |

- Gradient: `120deg, #0A456D → #20659F 55% → #2798D3`. Use it only for the hero glow, primary CTA, chart strokes and the final CTA band.
- **White base, accents from the logo.** No colours from outside the logo, apart from the status chips.

## Design conventions
- Text is left-aligned on a 12-column grid. Only the final CTA band is centred. Line length is ≤ 68ch.
- No eyebrow labels, no all-caps labels, and no accenting a single word in a headline.
- Radii vary by role: 20px for floating and report cards, 14px for content cards, 10px for buttons and inputs.
- Shadows are tinted navy in two layers. Numbers use `.num` (tabular figures).
- The facet mark (the open cube from the logo, `partials/facet.html`) is used only with meaning: the active nav item, the Most Popular pack and step markers.
- Copy is plain, specific and in sentence case, with no hype. Follow the content source (the Gemini "Incoinfo Website Structure Proposal"). The "fresh compilation" message lives only on `/data-standards`.

## Charts
- Chart.js, configured in `src/js/charts.js` and lazy-loaded. Palettes were checked with the dataviz validator:
  - single series: `#20659F`;
  - two series: `#20659F` + `#5FB3E3`;
  - a neutral "other" category: `#AEBBC7`.
- Navy fails the chart lightness and chroma checks, so it is never used for data marks.
- One y-axis only, solid hairline grid, a label on one data point at most, and a table view (`<details>`) next to each chart.

## Gotchas
- Tailwind v4 ships a `.contents` utility (`display: contents`) that overrides component classes with the same name. Avoid utility names as class names (`contents`, `hidden`, `block`, `table`, `grid`, …).
- Tailwind's preflight sets `svg { display: block }`. Inline icons inside running text need `display: inline-block`.
- `backdrop-filter` on the nav makes it the containing block for fixed children, so it is turned off while the mobile menu is open.
- The CSS load order is set by the imports in `main.css`: `fonts`, then `tailwindcss`, then `components`, `layout`, `home`, `sections`, `pages`. Page-level overrides must come later.
- In Git Bash, run scripts that take `/` paths with `MSYS_NO_PATHCONV=1`.

## Motion rules
- Animate **transform and opacity only**. No layout shift. The one exception is the FAQ accordion, which animates `grid-template-rows` (0fr to 1fr) so the height changes smoothly without JS measuring.
- Every animation needs a `prefers-reduced-motion` fallback. Check `reduced` from `src/js/motion.js`, and under reduced motion show the final state with no movement. Lenis is disabled under reduced motion.
- The hero "compiler" is the single signature moment. Everything else stays quiet.
- Use `[data-reveal]` for scroll reveals (handled centrally in `src/js/main.js`). Don't add per-section bespoke entrances.

## Verify
- `npm run dev`, then `npm run shots` (Playwright full-page screenshots at 1440/768/390, an overflow check and console errors, written to `reports/`).
- `npm run build`, then `npm run lighthouse` (runs against `vite preview` using Playwright's Chromium, writes HTML and JSON reports to `reports/lighthouse/`, target 90+ in all categories). Add `--desktop` for the desktop profile.
- Solution pages: edit `src/data/solutions.mjs`, then run `node scripts/gen-solutions.mjs`. This also rewrites `public/sitemap.xml` and `robots.txt`, so add new pages to its `pages` list.
