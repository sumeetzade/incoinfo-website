// Credit calculator: recommends the cheapest pack for a number of companies
// and highlights that pack's card.
import { recommend } from '../data/pricing.js'
import { reduced } from './motion.js'

const inr = (v) => Math.round(v).toLocaleString('en-IN')

export default function initCalculator(root) {
  const input = root.querySelector('input[type="range"]')
  const nOut = root.querySelector('[data-calc-n]')
  const label = root.querySelector('[data-calc-label]')
  const total = root.querySelector('[data-calc-total]')
  const detail = root.querySelector('[data-calc-detail]')
  const cards = document.querySelectorAll('[data-pack]')
  let shown = parseInt(total.textContent.replace(/\D/g, ''), 10) || 0
  let raf

  const tween = (to) => {
    cancelAnimationFrame(raf)
    if (reduced) { shown = to; total.textContent = inr(to); return }
    const from = shown
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / 320)
      shown = from + (to - from) * (1 - Math.pow(1 - p, 3))
      total.textContent = inr(shown)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  const update = () => {
    const n = parseInt(input.value, 10)
    const r = recommend(n)
    nOut.textContent = String(n)
    input.style.setProperty('--fill', `${((n - input.min) / (input.max - input.min)) * 100}%`)
    label.textContent = r.items
      .map(({ pack, qty }) =>
        pack.id === 'single' ? `${qty} single compan${qty === 1 ? 'y' : 'ies'}` : qty > 1 ? `${pack.name} × ${qty}` : pack.name)
      .join(' + ')
    tween(r.total)
    const spare = r.spare > 0 ? `, ${r.spare} credit${r.spare === 1 ? '' : 's'} to spare` : ''
    detail.textContent = `₹${inr(r.perCompany)} per company${spare}`
    cards.forEach((c) => c.classList.toggle('is-recommended', c.dataset.pack === r.main))
  }
  input.addEventListener('input', update)
  update()
}
