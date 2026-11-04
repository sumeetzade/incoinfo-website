// Rewrites root-relative URLs in a built site so it works from any sub-path
// (for example GitHub Pages at https://<user>.github.io/<repo>/).
// Usage: node scripts/make-relative.mjs docs
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] || 'docs')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

let html = 0
let css = 0
for (const file of walk(root)) {
  const rel = path.relative(path.dirname(file), root).replace(/\\/g, '/')
  const prefix = rel ? `${rel}/` : './'
  if (file.endsWith('.html')) {
    const src = fs.readFileSync(file, 'utf8')
    // href="/x", src="/x", action="/x"  (but not protocol-relative "//")
    const out = src.replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (_m, attr, p) => `${attr}="${prefix}${p}"`)
    if (out !== src) { fs.writeFileSync(file, out); html++ }
  } else if (file.endsWith('.css')) {
    const src = fs.readFileSync(file, 'utf8')
    const out = src.replace(/url\(\s*(["']?)\/(?!\/)/g, (_m, q) => `url(${q}${prefix}`)
    if (out !== src) { fs.writeFileSync(file, out); css++ }
  }
}
fs.writeFileSync(path.join(root, '.nojekyll'), '')
console.log(`make-relative: rewrote ${html} HTML and ${css} CSS files in ${path.relative(process.cwd(), root)}/`)
