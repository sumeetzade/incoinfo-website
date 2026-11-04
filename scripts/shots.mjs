// Full-page screenshots + overflow + console checks.
// Usage: node scripts/shots.mjs [base=http://localhost:5173] [paths=/,/pricing/] [--reduced]
import { chromium } from 'playwright'
import fs from 'node:fs'

const args = process.argv.slice(2)
const reducedOnly = args.includes('--reduced')
const pos = args.filter((a) => !a.startsWith('--'))
const base = pos[0] || 'http://localhost:5173'
const paths = (pos[1] || '/').split(',')
const widths = [1440, 768, 390]
const out = 'reports/shots'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
let problems = 0
for (const motion of reducedOnly ? ['reduce'] : ['no-preference', 'reduce']) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: motion, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const logs = []
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`) })
    page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))
    for (const p of paths) {
      await page.goto(base + p, { waitUntil: 'networkidle' })
      // scroll through to trigger lazy sections and reveals
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(motion === 'reduce' ? 300 : 4200)
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const offenders = [...document.querySelectorAll('body *')]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed' })
          .filter((el) => !el.closest('.marquee, [aria-hidden="true"], .hero-bg'))
          .slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
        return { sw: document.documentElement.scrollWidth, vw, offenders }
      })
      const name = `${(p.replace(/\//g, '_') || '_').replace(/^_|_$/g, '') || 'home'}-${w}${motion === 'reduce' ? '-reduced' : ''}.png`
      await page.screenshot({ path: `${out}/${name}`, fullPage: true })
      const bad = overflow.sw > overflow.vw
      if (bad || logs.length) problems++
      console.log(`${bad ? 'OVERFLOW' : 'ok'} ${p} @${w}${motion === 'reduce' ? ' (reduced)' : ''} sw=${overflow.sw} vw=${overflow.vw} ${overflow.offenders.join(' ')}`)
      logs.splice(0).forEach((l) => console.log('   ', l))
    }
    await ctx.close()
  }
}
await browser.close()
process.exitCode = problems ? 1 : 0
