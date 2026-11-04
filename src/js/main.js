import { reduced, finePointer, onVisible, whenNear, countUp } from './motion.js'

const root = document.documentElement
root.classList.add('motion-ready')

/* ---------------- Nav ---------------- */
function initNav() {
  const nav = document.querySelector('[data-nav]')
  if (!nav) return

  const setScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 24)
  setScrolled()
  window.addEventListener('scroll', setScrolled, { passive: true })

  // Mark current section
  const path = location.pathname.replace(/index\.html$/, '')
  nav.querySelectorAll('a.nav-link').forEach((a) => {
    if (path.startsWith(a.getAttribute('href'))) a.classList.add('is-current')
  })
  nav.querySelectorAll('button.nav-link[data-section]').forEach((b) => {
    if (b.dataset.section.split(' ').some((s) => path.startsWith(s))) b.classList.add('is-current')
  })

  // Dropdowns: click to toggle, hover-intent on fine pointers, Esc / outside click to close
  const items = [...nav.querySelectorAll('[data-menu]')]
  const close = (item, focus = false) => {
    const btn = item.querySelector('button')
    const panel = item.querySelector('.nav-panel')
    btn.setAttribute('aria-expanded', 'false')
    panel.hidden = true
    panel.removeAttribute('data-state')
    if (focus) btn.focus()
  }
  const open = (item) => {
    items.forEach((i) => i !== item && close(i))
    const btn = item.querySelector('button')
    const panel = item.querySelector('.nav-panel')
    btn.setAttribute('aria-expanded', 'true')
    panel.hidden = false
    panel.setAttribute('data-state', 'open')
  }
  items.forEach((item) => {
    const btn = item.querySelector('button')
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close(item) : open(item)))
    if (finePointer) {
      let t
      item.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(() => open(item), 80) })
      item.addEventListener('pointerleave', () => { clearTimeout(t); t = setTimeout(() => close(item), 160) })
    }
    item.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(item, true) })
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) close(item) })
  })
  document.addEventListener('click', (e) => items.forEach((i) => !i.contains(e.target) && close(i)))

  // Mobile menu
  const burger = nav.querySelector('[data-burger]')
  const menu = nav.querySelector('#mobile-menu')
  const setMobile = (isOpen) => {
    burger.setAttribute('aria-expanded', String(isOpen))
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
    menu.hidden = !isOpen
    nav.classList.toggle('is-open', isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) menu.querySelector('summary, a')?.focus()
  }
  burger?.addEventListener('click', () => setMobile(burger.getAttribute('aria-expanded') !== 'true'))
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMobile(false) })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMobile(false); burger.focus() } })
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (m) => m.matches && setMobile(false))
}

/* ---------------- Smooth scroll ---------------- */
async function initLenis() {
  if (reduced) return
  const { default: Lenis } = await import('lenis')
  const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -88 } })
  window.__lenis = lenis
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}

/* ---------------- Scroll reveals ---------------- */
function initReveals() {
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    ;[...group.children].forEach((c, i) => {
      c.setAttribute('data-reveal', '')
      c.style.setProperty('--i', String(i % 8))
    })
  })
  const els = document.querySelectorAll('[data-reveal]')
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  els.forEach((el) => io.observe(el))
}

/* ---------------- Micro-interactions ---------------- */
function initMagnetic() {
  if (reduced || !finePointer) return
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 6
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2
      el.style.transform = `translate(${x * strength}px, ${y * strength * 0.6}px)`
    })
    el.addEventListener('pointerleave', () => { el.style.transform = '' })
  })
}

function initTilt() {
  if (!finePointer) return
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (reduced) { el.style.transform = 'translateY(-4px)'; return }
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `translateY(-4px) perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`
    })
    el.addEventListener('pointerleave', () => { el.style.transform = '' })
  })
}

function initTypewriter() {
  document.querySelectorAll('[data-typewriter]').forEach((input) => {
    const phrases = JSON.parse(input.dataset.typewriter)
    const base = input.getAttribute('placeholder')
    if (reduced) return
    let i = 0, j = 0, deleting = false, paused = false, timer
    const step = () => {
      if (paused) return
      const word = phrases[i]
      j += deleting ? -1 : 1
      input.setAttribute('placeholder', word.slice(0, j) + (deleting && j === 0 ? '' : ''))
      let delay = deleting ? 28 : 62
      if (!deleting && j === word.length) { deleting = true; delay = 1700 }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % phrases.length; delay = 350 }
      timer = setTimeout(step, delay)
    }
    timer = setTimeout(step, 1400)
    input.addEventListener('focus', () => { paused = true; clearTimeout(timer); input.setAttribute('placeholder', base) })
    input.addEventListener('blur', () => { if (!input.value) { paused = false; j = 0; deleting = false; timer = setTimeout(step, 600) } })
  })
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => onVisible(el, countUp))
}

/* ---------------- Accordion (FAQ) ---------------- */
function initAccordions() {
  document.querySelectorAll('[data-accordion] .acc-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item')
      const isOpen = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', String(!isOpen))
      item.classList.toggle('is-open', !isOpen)
    })
  })
}

/* ---------------- Tabs ---------------- */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((wrap) => {
    const tabs = [...wrap.querySelectorAll('[role="tab"]')]
    const select = (tab, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab
        t.setAttribute('aria-selected', String(on))
        t.tabIndex = on ? 0 : -1
        const panel = document.getElementById(t.getAttribute('aria-controls'))
        panel.hidden = !on
        if (on) panel.dispatchEvent(new CustomEvent('tabshow', { bubbles: true }))
      })
      if (focus) tab.focus()
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t))
      t.addEventListener('keydown', (e) => {
        const k = e.key
        if (k === 'ArrowRight' || k === 'ArrowLeft' || k === 'Home' || k === 'End') {
          e.preventDefault()
          const n = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
          select(tabs[n], true)
        }
      })
    })
  })
}

/* ---------------- Portal search forms ---------------- */
function initSearchForms() {
  document.querySelectorAll('form[data-portal-search]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const q = new FormData(form).get('q')?.toString().trim()
      const url = new URL(form.action)
      if (q) url.searchParams.set('q', q)
      window.location.href = url.toString()
    })
  })
}

/* ---------------- Page modules (loaded on demand) ---------------- */
function initModules() {
  const hero = document.querySelector('[data-hero-compiler]')
  if (hero) import('./hero.js').then((m) => m.default(hero))

  const report = document.querySelector('[data-report]')
  if (report) whenNear(report, () => import('./report.js').then((m) => m.default(report)))

  document.querySelectorAll('[data-chart]').forEach((el) =>
    whenNear(el, () => import('./charts.js').then((m) => m.renderChart(el))),
  )

  const steps = document.querySelector('[data-steps]')
  if (steps) import('./steps.js').then((m) => m.default(steps))

  const calc = document.querySelector('[data-calculator]')
  if (calc) import('./pricing.js').then((m) => m.default(calc))
}

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())))

initNav()
initReveals()
initMagnetic()
initTilt()
initTypewriter()
initCounters()
initAccordions()
initTabs()
initSearchForms()
initModules()
initLenis()
