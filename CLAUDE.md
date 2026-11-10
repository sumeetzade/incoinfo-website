# incoinfo marketing site

A static marketing site for incoinfo (company reports on registered companies). Data coverage is India today, with more countries planned: keep general copy country-neutral and mention India only where it describes current data (sources, the Indian corporate landscape, sample reports, the office address, ₹ pricing). The product is a **separate demo portal** at `https://demodpd.incoinfo.com`. This site has no sign-in, checkout or account pages. Every product CTA is a plain link to the portal root through `%PORTAL_URL%` (`VITE_PORTAL_URL` in `.env`). The build adds `target="_blank" rel="noopener"` to these links automatically, so they open in a new tab.

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
| `accent` | `#ffad00` | **Orange from the logo's i-dots.** Marks what is new, current or chosen (see rules below) |
| `accent-soft` | `#fff4da` | Orange tint: text selection, the hero's updated-row flash and incoming filing |
| `accent-data` | `#E59A00` | Charts only: deeper step of the orange that passes the chart legibility check |
| `ink` | `#0F1E2E` | Body text (no pure black) |
| `ink-muted` | `#4A5866` | Secondary text |
| `surface-tint` | `#F2F7FB` | Section breaks |
| `line` | `#DCE6EF` | 1px borders |
| success / warn / danger | `#1F7A4D` / `#A15C00` / `#B42318` | Status chips only |

- **No gradients.** Use plain colours only: primary buttons are `brand-700` (hover `brand-800`), the final CTA band and the data-flow card are `brand-900`, and section backgrounds are white or `surface-tint`. Do not add glows or gradient washes to backgrounds.
- **White base, blue and orange from the logo.** No colours from outside the logo, apart from the status chips. The light blue `#2798D3` appears only inside the logo cube.
- **Orange means "new, current or chosen"**, and nothing else. Its uses:
  - hero animation: wires, dots, the latest revenue point, the incoming filing;
  - charts: the latest-year bar and the second series;
  - nav: current-section underline;
  - "How ordering works": progress line and active-step ring;
  - pricing: "Most popular" flag and the calculator's recommended pack;
  - the orange "Open the Demo" button on the navy closing band (`.btn-accent`, used only there);
  - link hover underline, text selection, data-flow arrows, API code highlights.
- **Never use orange for** text, icons or focus rings on white (1.9:1). Navy or ink text **on** orange is fine (5.4:1 and 9:1), and so is orange on navy (5.4:1). Keep orange rare: if a new use doesn't mean new, current or chosen, use blue.

## Brand name
- Always write the brand as **incoinfo**, all lowercase, in copy, titles, meta tags and structured data, including at the start of a sentence. Only code identifiers (for example `INCOINFO_API_KEY`) and the source document title "Incoinfo Website Structure Proposal" keep other casing.

## Logo
- The logo is a **vector SVG**, `public/logo.svg`: the cube mark, the lowercase wordmark **incoinfo** (Schibsted Grotesk Bold) and the tagline "Financial Insights" (Inter Medium). All text is converted to outlines, so it needs no fonts. The dots on both i's are separate orange `#ffad00` shapes. That orange is used only for these dots.
- `partials/logo.html` shows it with `<img class="logo-img">`, 36px tall in the nav and footer.
- To change the logo, edit and run `node scripts/build-logo-svg.mjs`. It writes `public/logo.svg` and `brand/logo-incoinfo.svg`, using the static font files from `@fontsource/schibsted-grotesk` and `@fontsource/inter` (dev dependencies) and `opentype.js`.
- Then run `node scripts/render-logo.mjs` to re-render `public/logo.png` (structured data) and `public/og-image.png` (share preview) from the SVG.
- `brand/logo.png` is the original capitalised artwork, kept only as the colour source.

## Design conventions
- Text is left-aligned on a 12-column grid. Only the final CTA band is centred. Line length is ≤ 68ch.
- No eyebrow labels, no all-caps labels, and no accenting a single word in a headline.
- Every page title (h1), homepage included, uses the same size (`h1` in `main.css`: 38px desktop, 27px phones). Don't give one page a bigger title.
- Radii vary by role: 20px for floating and report cards, 14px for content cards, 10px for buttons and inputs.
- Shadows are tinted navy in two layers. Numbers use `.num` (tabular figures).
- The facet mark (the open cube from the logo, `partials/facet.html`) is used only with meaning: the active nav item, the Most Popular pack and step markers.
- Navigation and buttons use **title case**: menu bar and dropdown labels (desktop and mobile), the footer link lists and every button label (for example "Open the Demo", "View Sample Report", "Talk to Sales"). Examples: "Data Sources & Standards", "Refund Policy for Credit Packs". Small words like "and" and "for" stay lowercase, and the brand stays "incoinfo". Dropdown descriptions, inline text links and all other copy stay in sentence case.
- Copy is plain, specific and in sentence case, with no hype. Follow the content source (the Gemini "Incoinfo Website Structure Proposal"). The "fresh compilation" message lives only on `/data-standards`.

## Charts
- Chart.js, configured in `src/js/charts.js` and lazy-loaded. Palettes were checked with the dataviz validator:
  - single series: `#20659F`;
  - two series: `#20659F` + `#E59A00` (blue and the orange data step);
  - highlighting the latest value: `#E59A00` on that one bar only;
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

## Sharing a test build (GitHub Pages)
- `npm run share` builds the site into `docs/` with relative links (via `scripts/make-relative.mjs`), so it works from a sub-path such as `https://<user>.github.io/<repo>/`.
- Commit `docs/` and push. In the GitHub repo, go to Settings → Pages → Deploy from a branch → `main` / `/docs`.
- Re-run `npm run share` before each push. `docs/` is a generated copy, so never edit it by hand.
- The production build for AWS is still `npm run build` → `dist/` (root-relative links, with `VITE_SITE_URL` set to the real domain).
