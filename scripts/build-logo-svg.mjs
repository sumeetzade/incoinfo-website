// Builds the incoinfo logo as a pure vector SVG (no fonts needed to display it).
//   - cube mark: the same paths as partials/facet.html
//   - wordmark "incoinfo": Schibsted Grotesk Bold, converted to outlines; the dots on the i's are #ffad00
//   - tagline "Financial Insights": Inter Medium, converted to outlines
// Writes public/logo.svg and brand/logo-incoinfo.svg.
// Usage: node scripts/build-logo-svg.mjs
import fs from 'node:fs'
import opentype from 'opentype.js'

const NAVY = '#0A456D'
const GREY = '#4A5866'
const ORANGE = '#ffad00'

const load = (p) => {
  const b = fs.readFileSync(p)
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}
const display = load('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff')
const sans = load('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff')

// Same proportions as the HTML lockup it replaces (sizes in "em" of a 40-unit base)
const BASE = 40
const MARK = 2.15 * BASE // cube size
const GAP = 0.5 * BASE // cube to text
const WORD_SIZE = 1.6 * BASE
const WORD_TRACK = -0.035 * WORD_SIZE
const TAG_SIZE = 0.66 * BASE
const TAG_TRACK = 0.03 * TAG_SIZE
const TAG_GAP = 0.3 * BASE // space between wordmark and tagline
const TAG_INDENT = 0.08 * TAG_SIZE

const r = (n) => Math.round(n * 100) / 100

// Lay out a string glyph by glyph (kerning + tracking) and return per-glyph paths
function layout(font, text, x, baseline, size, tracking) {
  const scale = size / font.unitsPerEm
  const glyphs = [...text].map((ch) => font.charToGlyph(ch)) // no shaping needed for plain Latin
  const out = []
  let pen = x
  glyphs.forEach((g, i) => {
    out.push({ char: text[i], path: g.getPath(pen, baseline, size) })
    pen += g.advanceWidth * scale + tracking
    if (i < glyphs.length - 1) pen += font.getKerningValue(g, glyphs[i + 1]) * scale
  })
  return out
}

// Split a path into sub-paths (one per "M")
function subpaths(path) {
  const groups = []
  for (const c of path.commands) {
    if (c.type === 'M') groups.push([])
    groups[groups.length - 1].push(c)
  }
  return groups.map((cmds) => {
    const p = new opentype.Path()
    p.commands = cmds
    return p
  })
}

const toD = (paths) => paths.map((p) => p.toPathData(2)).join('')
const box = (paths) => {
  const bb = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity }
  for (const p of paths) {
    const b = p.getBoundingBox()
    bb.x1 = Math.min(bb.x1, b.x1); bb.y1 = Math.min(bb.y1, b.y1)
    bb.x2 = Math.max(bb.x2, b.x2); bb.y2 = Math.max(bb.y2, b.y2)
  }
  return bb
}

// 1) lay out at baseline 0 to measure, then position
const textX = MARK + GAP
let word = layout(display, 'incoinfo', textX, 0, WORD_SIZE, WORD_TRACK)
let tag = layout(sans, 'Financial Insights', textX + TAG_INDENT, 0, TAG_SIZE, TAG_TRACK)
const wb = box(word.map((g) => g.path))
const tb = box(tag.map((g) => g.path))
// stack: wordmark (top of the i-dots / f) then TAG_GAP then tagline cap height; centre the block on the cube
const blockH = (wb.y2 - wb.y1) + TAG_GAP + (tb.y2 - tb.y1)
const blockTop = (MARK - blockH) / 2
const wordBaseline = blockTop - wb.y1
const tagBaseline = blockTop + (wb.y2 - wb.y1) + TAG_GAP - tb.y1
word = layout(display, 'incoinfo', textX, wordBaseline, WORD_SIZE, WORD_TRACK)
tag = layout(sans, 'Financial Insights', textX + TAG_INDENT, tagBaseline, TAG_SIZE, TAG_TRACK)

// 2) split the i's: the top-most sub-path of each "i" is its dot
const wordBody = []
const dots = []
for (const g of word) {
  if (g.char !== 'i') { wordBody.push(g.path); continue }
  const parts = subpaths(g.path).sort((a, b) => a.getBoundingBox().y1 - b.getBoundingBox().y1)
  dots.push(parts[0])
  wordBody.push(...parts.slice(1))
}

// 3) cube mark (viewBox 0 0 50 50 → MARK units)
const s = MARK / 50
const facet = [
  ['#FFAD00', 'M2.5 15 15 5.6v26.9L2.5 42z'],
  ['#FFAD00', 'M2.5 15 15 5.6h28L31 15z'],
  ['#026793', 'M2.5 15 15 5.6V15z'],
  ['#20659F', 'M30 20 43 10.6v26.9L30 47z'],
  ['#20659F', 'M3 47l12-9.5h28L31 47z'],
  ['#0A456D', 'M30 37.5h12.4L30 47z'],
]

const allText = box([...wordBody, ...dots, ...tag.map((g) => g.path)])
const PAD = 1
const minY = Math.min(0, allText.y1) - PAD
const maxY = Math.max(MARK, allText.y2) + PAD
const minX = -PAD
const width = r(Math.max(allText.x2, MARK) + PAD - minX)
const height = r(maxY - minY)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(minX)} ${r(minY)} ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="logo-title">
  <title id="logo-title">incoinfo — Financial Insights</title>
  <g transform="scale(${r(s * 1000) / 1000})">${facet.map(([f, d]) => `<path fill="${f}" d="${d}"/>`).join('')}</g>
  <path fill="${NAVY}" d="${toD(wordBody)}"/>
  <path fill="${ORANGE}" d="${toD(dots)}"/>
  <path fill="${GREY}" d="${toD(tag.map((g) => g.path))}"/>
</svg>
`
fs.writeFileSync('public/logo.svg', svg)
fs.writeFileSync('brand/logo-incoinfo.svg', svg)
console.log(`logo.svg written: ${width} x ${height} units, ${dots.length} orange dots, ${(svg.length / 1024).toFixed(1)} KB`)
