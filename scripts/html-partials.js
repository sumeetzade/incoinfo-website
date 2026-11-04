// Build-time HTML helpers for a plain multi-page static site.
//   <!-- @include nav -->                 -> contents of partials/nav.html
//   <!-- @include page-hero title="X" --> -> partial with {{title}} replaced
//   {{icon:search}} / {{icon:search|w-5 h-5}} -> inline Lucide SVG (no runtime JS)
//   %PORTAL_URL% / %SITE_URL%             -> values from .env (VITE_PORTAL_URL / VITE_SITE_URL)
import fs from 'node:fs'
import path from 'node:path'

const ICON_DIR = path.resolve('node_modules/lucide-static/icons')
const PARTIAL_DIR = path.resolve('partials')

const iconCache = new Map()
function icon(name, cls = '') {
  const key = name + '|' + cls
  if (iconCache.has(key)) return iconCache.get(key)
  const file = path.join(ICON_DIR, `${name}.svg`)
  if (!fs.existsSync(file)) throw new Error(`[html-partials] unknown Lucide icon "${name}"`)
  const svg = fs
    .readFileSync(file, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*class="[^"]*"/, '')
    .replace('<svg', `<svg class="${`icon ${cls}`.trim()}" aria-hidden="true" focusable="false"`)
    .replace(/\n\s*/g, ' ')
    .trim()
  iconCache.set(key, svg)
  return svg
}

function parseAttrs(str = '') {
  const out = {}
  for (const m of str.matchAll(/([\w-]+)="([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

function render(html, env, depth = 0) {
  if (depth > 6) throw new Error('[html-partials] include depth exceeded')
  html = html.replace(/<!--\s*@include\s+([\w-]+)([^>]*?)-->/g, (_, name, attrs) => {
    const file = path.join(PARTIAL_DIR, `${name}.html`)
    if (!fs.existsSync(file)) throw new Error(`[html-partials] missing partial "${name}"`)
    let body = fs.readFileSync(file, 'utf8')
    const vars = parseAttrs(attrs)
    body = body.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m))
    return render(body, env, depth + 1)
  })
  html = html.replace(/\{\{icon:([\w-]+)(?:\|([^}]*))?\}\}/g, (_, n, c) => icon(n, c || ''))
  html = html.replaceAll('%PORTAL_URL%', env.portal).replaceAll('%SITE_URL%', env.site)
  return html
}

export default function htmlPartials(env) {
  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => render(html, env) },
    handleHotUpdate({ file, server }) {
      if (file.includes(`${path.sep}partials${path.sep}`) || file.includes('/partials/')) {
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}
