# IncoInfo marketing site

A static marketing site for IncoInfo (company reports on Indian registered companies). The product itself (search, basket, checkout, sign-in) is a **separate portal**. This site only links to it through `%PORTAL_URL%` (set `VITE_PORTAL_URL` in `.env`).

## Stack
- Plain HTML pages, CSS and vanilla JS modules. Vite (multi-page) is used only as the build tool, and the output in `dist/` is fully static.
- Tailwind CSS v4 (`@tailwindcss/vite`). The theme lives in `src/styles/main.css` under `@theme`.
- GSAP + ScrollTrigger (motion), Lenis (smooth scroll), Chart.js (charts, lazy-loaded), Lucide icons inlined at build time.
- Fonts are self-hosted with `@fontsource-variable`: **Schibsted Grotesk** (headings) and **Inter** (body and UI).

## Page authoring
- Every `*.html` file outside `partials/ src/ public/ scripts/ brand/` becomes a page (see `vite.config.js`). Clean URLs use `folder/index.html`.
- Shared markup goes in `partials/*.html`, pulled in with `<!-- @include name key="value" -->`. `{{key}}` inside a partial is replaced by the attribute.
- Icons: `{{icon:lucide-name}}` or `{{icon:lucide-name|extra classes}}`. These are inlined SVG, so no icon JS runs in the browser.
- The 12 solution pages are **generated** from `src/data/solutions.mjs` by `node scripts/gen-solutions.mjs`. Edit the data, then re-run the script. Do not hand-edit `solutions/*/index.html`.
- Chart and sample data live in `src/data/`. Placeholder figures, prices, testimonials and client names are marked `TODO`.

## Brand tokens (sampled from `brand/logo.png` pixels)
| Token | Hex | Use |
|---|---|---|
| `brand-900` | `#0A456D` | Navy. Footer, dark bands, gradient start |
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

## Motion rules
- Animate **transform and opacity only**. No layout shift.
- Every animation needs a `prefers-reduced-motion` fallback. Check `reduced` from `src/js/motion.js`, and under reduced motion show the final state with no movement. Lenis is disabled under reduced motion.
- The hero "compiler" is the single signature moment. Everything else stays quiet.
- Use `[data-reveal]` for scroll reveals (handled centrally in `src/js/main.js`). Don't add per-section bespoke entrances.

## Verify
- `npm run dev`, then `npm run shots` (Playwright full-page screenshots at 1440/768/390, an overflow check and console errors, written to `reports/`).
- `npm run build`, then `npm run lighthouse` (runs against `vite preview`, target 90+ in all categories).
