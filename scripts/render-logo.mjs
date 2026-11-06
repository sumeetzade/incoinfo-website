import { chromium } from 'playwright'; import fs from 'node:fs'
const f1 = fs.readFileSync('public/fonts/schibsted-latin.woff2').toString('base64')
const f2 = fs.readFileSync('public/fonts/inter-latin.woff2').toString('base64')
const facet = fs.readFileSync('partials/facet.html', 'utf8').replace('{{class}}', 'mark')
const css = `@font-face{font-family:S;src:url(data:font/woff2;base64,${f1})}@font-face{font-family:I;src:url(data:font/woff2;base64,${f2})}
.logo{display:inline-flex;align-items:center;gap:.5em;line-height:1;white-space:nowrap}
.mark{width:2.15em;height:2.15em}.t{display:flex;flex-direction:column}
.w{font-family:S;font-weight:700;font-size:1.6em;letter-spacing:-.035em;line-height:.95;color:#0A456D}
.i{position:relative;display:inline-block}.i::after{content:"i";position:absolute;left:0;top:0;color:#ffad00;clip-path:inset(0 0 70% 0)}
.g{margin-top:.3em;padding-left:.08em;font-family:I;font-weight:500;font-size:.66em;letter-spacing:.03em;color:#4A5866}`
const lockup = (px) => `<span class="logo" style="font-size:${px}px">${facet}<span class="t"><span class="w"><span class="i">i</span>nco<span class="i">i</span>nfo</span><span class="g">Financial Insights</span></span></span>`
const b = await chromium.launch()
// 1) transparent logo.png (for schema.org / anywhere an image is needed)
let p = await b.newPage({ deviceScaleFactor: 2 })
await p.setContent(`<style>${css}body{margin:0;padding:6px;display:inline-block}</style>${lockup(40)}`)
await p.waitForTimeout(200)
await (await p.$('.logo')).screenshot({ path: 'public/logo.png', omitBackground: true })
// 2) share image
p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.setContent(`<style>${css}body{margin:0;width:1200px;height:630px;background:#F2F7FB;position:relative;overflow:hidden;font-family:I}
.c{position:absolute;left:80px;top:80px;right:80px}h1{font-family:S;font-weight:750;font-size:54px;line-height:1.08;letter-spacing:-.03em;color:#0F1E2E;margin:48px 0 0;max-width:820px;text-wrap:balance}
p{font-size:28px;color:#4A5866;margin:28px 0 0;max-width:760px;line-height:1.4}.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:#20659F}
.m{position:absolute;right:90px;bottom:90px;width:150px;height:150px}.m svg{width:150px;height:150px}</style>
<div class="c">${lockup(30)}<h1>Reliable data and financial intelligence for investors, lenders, enterprises and professional firms</h1><p>Reports built from official filings, with 12 months of updates.</p></div><div class="m">${facet}</div><div class="bar"></div>`)
await p.waitForTimeout(200)
await p.screenshot({ path: 'public/og-image.png' })
await b.close()
console.log('rendered public/logo.png and public/og-image.png')
