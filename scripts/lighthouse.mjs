// Lighthouse against the production build.
// Usage: npm run build && node scripts/lighthouse.mjs [paths=/,/solutions/commercial-banks/,/pricing/] [--desktop]
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { chromium } from 'playwright'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const args = process.argv.slice(2)
const desktop = args.includes('--desktop')
const paths = (args.find((a) => !a.startsWith('--')) || '/,/solutions/commercial-banks/,/pricing/').split(',')
const PORT = 4173

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const base = `http://localhost:${PORT}`
for (let i = 0; i < 40; i++) {
  try { if ((await fetch(base)).ok) break } catch {}
  await new Promise((r) => setTimeout(r, 500))
}

const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] })
fs.mkdirSync('reports/lighthouse', { recursive: true })
const rows = []
try {
  for (const p of paths) {
    const result = await lighthouse(base + p, {
      port: chrome.port, output: ['html', 'json'], logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      ...(desktop ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttlingMethod: 'simulate', throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } : {}),
    })
    const c = result.lhr.categories
    const name = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home') + (desktop ? '-desktop' : '-mobile')
    fs.writeFileSync(`reports/lighthouse/${name}.html`, result.report[0])
    fs.writeFileSync(`reports/lighthouse/${name}.json`, result.report[1])
    rows.push({ page: p, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100) })
    const fails = Object.values(result.lhr.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual' && a.scoreDisplayMode !== 'notApplicable')
    for (const a of fails.slice(0, 12)) console.log(`   ${p} · ${a.id}: ${a.displayValue || a.score}`)
  }
} finally {
  await chrome.kill()
  server.kill()
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' })
}
console.table(rows)
