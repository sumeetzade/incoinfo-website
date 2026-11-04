import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import htmlPartials from './scripts/html-partials.js'

const IGNORE = new Set(['node_modules', 'dist', 'partials', 'brand', 'public', 'scripts', 'src', '.git', '.claude', 'reports'])

// Every .html page in the repo (outside the ignored folders) becomes a build entry.
function findPages(dir = '.', out = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) findPages(full, out)
    else if (entry.name.endsWith('.html')) {
      const key = full.replace(/\\/g, '/').replace(/\.html$/, '').replace(/^\.\//, '')
      out[key || 'index'] = path.resolve(full)
    }
  }
  return out
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    appType: 'mpa',
    plugins: [
      htmlPartials({
        portal: env.VITE_PORTAL_URL || 'https://demodpd.incoinfo.com',
        site: env.VITE_SITE_URL || 'https://www.incoinfo.com',
      }),
      tailwindcss(),
    ],
    build: {
      rollupOptions: { input: findPages() },
    },
  }
})
