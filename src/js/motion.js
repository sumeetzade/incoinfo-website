// Shared motion helpers. Everything animated must respect `reduced`.
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Run `fn` once when `el` scrolls into view. */
export function onVisible(el, fn, options = { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }) {
  if (!el) return
  if (!('IntersectionObserver' in window)) return fn(el)
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        io.disconnect()
        fn(el)
      }
    }
  }, options)
  io.observe(el)
}

/** Load a heavy module only when its section approaches the viewport. */
export function whenNear(el, loader) {
  if (!el) return
  onVisible(el, loader, { rootMargin: '400px 0px', threshold: 0 })
}

/** Count a number up. Handles decimals and Indian-style suffixes in the template. */
export function countUp(el, { duration = 1600 } = {}) {
  const target = parseFloat(el.dataset.count)
  const decimals = parseInt(el.dataset.decimals || '0', 10)
  const fmt = (v) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  if (reduced || !Number.isFinite(target)) {
    el.textContent = fmt(target)
    return
  }
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - p, 4)
    el.textContent = fmt(target * eased)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
