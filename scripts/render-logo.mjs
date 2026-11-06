// Renders raster versions of the vector logo (public/logo.svg) and the share image.
//   public/logo.png      transparent PNG of the logo (used in structured data)
//   public/og-image.png  1200x630 link-preview image
// Run after scripts/build-logo-svg.mjs.  Usage: node scripts/render-logo.mjs
import { chromium } from 'playwright'
import fs from 'node:fs'

const svg = fs.readFileSync('public/logo.svg', 'utf8')
const sized = (h) => svg.replace(/width="[^"]*" height="[^"]*"/, `height="${h}"`)
const facet = fs.readFileSync('partials/facet.html', 'utf8').replace('{{class}}', 'mark')
const f1 = fs.readFileSync('public/fonts/schibsted-latin.woff2').toString('base64')
const f2 = fs.readFileSync('public/fonts/inter-latin.woff2').toString('base64')

const b = await chromium.launch()

// 1) transparent logo.png at 2x
let p = await b.newPage({ deviceScaleFactor: 2 })
await p.setContent(`<body style="margin:0"><div id="l" style="display:inline-block;line-height:0">${sized(96)}</div></body>`)
await (await p.$('#l')).screenshot({ path: 'public/logo.png', omitBackground: true })

// 2) share image
p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.setContent(`<style>@font-face{font-family:S;src:url(data:font/woff2;base64,${f1})}@font-face{font-family:I;src:url(data:font/woff2;base64,${f2})}
body{margin:0;width:1200px;height:630px;background:#F2F7FB;position:relative;overflow:hidden;font-family:I}
.c{position:absolute;left:80px;top:80px;right:80px}.c svg{display:block}
h1{font-family:S;font-weight:750;font-size:54px;line-height:1.08;letter-spacing:-.03em;color:#0F1E2E;margin:48px 0 0;max-width:820px;text-wrap:balance}
p{font-size:28px;color:#4A5866;margin:28px 0 0;max-width:760px;line-height:1.4}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:#20659F}
.m{position:absolute;right:90px;bottom:90px;width:150px;height:150px}.m svg{width:150px;height:150px}</style>
<div class="c">${sized(68)}<h1>Reliable data and financial intelligence for investors, lenders, enterprises and professional firms</h1><p>Reports built from official filings, with 12 months of updates.</p></div><div class="m">${facet}</div><div class="bar"></div>`)
await p.waitForTimeout(200)
await p.screenshot({ path: 'public/og-image.png' })
await b.close()
console.log('rendered public/logo.png and public/og-image.png from public/logo.svg')
