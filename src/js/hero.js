// Hero "compiler": official filings flow into a company profile that assembles itself.
// One orchestrated sequence on load, then a single "new filing arrives" beat that
// demonstrates the 12-month update. Reduced motion: final state, no movement.
import { gsap } from 'gsap'
import { reduced } from './motion.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

function drawWires(root) {
  const svg = root.querySelector('.compiler-wires')
  const card = root.querySelector('.profile')
  const chips = [...root.querySelectorAll('[data-form]')]
  if (!svg || !card || getComputedStyle(svg).display === 'none') return []
  const box = root.getBoundingClientRect()
  const c = card.getBoundingClientRect()
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`)
  svg.replaceChildren()
  return chips.map((chip, i) => {
    const r = chip.getBoundingClientRect()
    const x1 = r.right - box.left + 6
    const y1 = r.top + r.height / 2 - box.top
    const x2 = c.left - box.left - 2
    const y2 = c.top - box.top + c.height * (0.22 + (0.56 * i) / Math.max(1, chips.length - 1))
    const mid = (x1 + x2) / 2
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', `M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`)
    path.setAttribute('pathLength', '1')
    const dot = document.createElementNS(SVG_NS, 'circle')
    dot.setAttribute('cx', String(x2))
    dot.setAttribute('cy', String(y2))
    dot.setAttribute('r', '3')
    svg.append(path, dot)
    return { path, dot }
  })
}

export default function initHero(root) {
  const hero = root.closest('.hero')
  // pause ambient glow when off-screen
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => hero.classList.toggle('is-offscreen', !e.isIntersecting)).observe(hero)
  }

  let wires = drawWires(root)
  let resizeRaf
  let firstObservation = true
  new ResizeObserver(() => {
    if (firstObservation) { firstObservation = false; return }
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => {
      wires = drawWires(root)
      wires.forEach((w) => { w.path.style.strokeDashoffset = '0'; w.path.style.strokeDasharray = 'none' })
    })
  }).observe(root)

  if (reduced) return

  const chips = root.querySelectorAll('[data-form]')
  const card = root.querySelector('.profile')
  const parts = root.querySelectorAll('[data-part]')
  const line = root.querySelector('.spark-line')
  const area = root.querySelector('.spark-area')
  const dots = root.querySelectorAll('.spark-dots circle')
  const tickers = root.querySelectorAll('[data-ticker]')
  // gsap warns on empty targets; wires are hidden on small screens
  const paths = wires.length ? wires.map((w) => w.path) : document.createElement('i')
  const ends = wires.length ? wires.map((w) => w.dot) : document.createElement('i')

  gsap.set(chips, { opacity: 0, x: -28 })
  gsap.set(card, { opacity: 0, y: 18, scale: 0.97 })
  gsap.set(parts, { opacity: 0, y: 8 })
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
  gsap.set(ends, { opacity: 0, scale: 0, transformOrigin: 'center' })
  gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 })
  gsap.set(area, { opacity: 0 })
  gsap.set(dots, { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 })
  tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.7 })
    .to(chips, { opacity: 1, x: 0, duration: 0.55, stagger: 0.08 }, 0.15)
    .to(paths, { strokeDashoffset: 0, duration: 0.7, stagger: 0.09, ease: 'power2.inOut' }, 0.55)
    .to(ends, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.09 }, 1.05)
    .to(parts, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.9)
    .to(line, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 1.25)
    .to(area, { opacity: 1, duration: 0.8 }, 1.6)
    .to(dots, { scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' }, 1.3)

  tickers.forEach((el) => {
    const target = parseFloat(el.dataset.ticker)
    const decimals = parseInt(el.dataset.decimals || '0', 10)
    const o = { v: 0 }
    tl.to(o, { v: target, duration: 1.2, ease: 'power2.out', onUpdate: () => (el.textContent = o.v.toFixed(decimals)) }, 1.0)
  })

  // One "new filing" beat: a charge is satisfied and the report updates itself.
  const incoming = root.querySelector('[data-incoming]')
  const row = root.querySelector('[data-charge-row]')
  const count = root.querySelector('[data-charge-count]')
  const amt = root.querySelector('[data-charge-amt]')
  const flag = root.querySelector('[data-update-flag]')
  if (incoming && row && getComputedStyle(incoming).display !== 'none') {
    const rowBox = () => {
      const a = root.getBoundingClientRect()
      const b = row.getBoundingClientRect()
      const i = incoming.getBoundingClientRect()
      return { x: b.left - a.left - i.width * 0.35, y: b.top - a.top - (i.top - a.top) + (b.height - i.height) / 2 }
    }
    tl.add(() => {
      const target = rowBox()
      gsap.timeline()
        .fromTo(incoming, { opacity: 0, x: -20, y: 0 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' })
        .to(incoming, { x: target.x, y: target.y, scale: 0.82, duration: 0.9, ease: 'power2.inOut' }, '+=0.5')
        .to(incoming, { opacity: 0, duration: 0.25 }, '-=0.2')
        .add(() => {
          count.textContent = '2'
          amt.textContent = '58.1'
          row.classList.add('is-updated')
          flag?.classList.add('is-updated')
        })
    }, '+=1.8')
  }
}
