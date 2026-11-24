// /faq/ page: live search across all questions, topic counts, and the current-topic marker.
export default function initFaqPage(root) {
  const input = document.querySelector('[data-faq-input]')
  const status = document.querySelector('[data-faq-status]')
  const clear = document.querySelector('[data-faq-clear]')
  const empty = root.querySelector('[data-faq-empty]')
  const term = root.querySelector('[data-faq-term]')
  const groups = [...root.querySelectorAll('[data-group]')]
  const links = [...root.querySelectorAll('[data-toc]')]
  const counts = new Map([...root.querySelectorAll('[data-count-for]')].map((c) => [c.dataset.countFor, c]))
  const items = [...root.querySelectorAll('.acc-item')].map((el) => ({
    el,
    text: el.textContent.replace(/\s+/g, ' ').toLowerCase(),
    group: el.closest('[data-group]').dataset.group,
  }))

  // Current topic: the last visible group whose top has passed the sticky header.
  const spy = () => {
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
    let current = null
    groups.forEach((g) => { if (!g.hidden && g.getBoundingClientRect().top <= navH + 120) current = g })
    if (!current) current = groups.find((g) => !g.hidden) || null
    links.forEach((a) => {
      if (current && a.dataset.toc === current.id) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    })
  }

  const apply = () => {
    const raw = input ? input.value.trim() : ''
    const words = raw.toLowerCase().split(/\s+/).filter(Boolean)
    const per = {}
    let shown = 0
    items.forEach((it) => {
      const ok = words.every((w) => it.text.includes(w))
      it.el.hidden = !ok
      if (ok) { shown++; per[it.group] = (per[it.group] || 0) + 1 }
    })
    groups.forEach((g) => { g.hidden = !per[g.dataset.group] })
    // A narrow search (three matches or fewer) opens the answers, so they can be read straight away.
    if (raw && shown <= 3) {
      items.forEach((it) => {
        if (it.el.hidden) return
        it.el.classList.add('is-open')
        it.el.querySelector('.acc-trigger').setAttribute('aria-expanded', 'true')
      })
    }
    counts.forEach((c, k) => {
      c.textContent = String(per[k] || 0)
      c.closest('a').classList.toggle('is-empty', !per[k])
    })
    if (clear) clear.hidden = !raw
    empty.hidden = shown > 0
    term.textContent = `“${raw}”`
    if (status) {
      status.textContent = !raw
        ? `${items.length} questions in ${groups.length} topics`
        : shown
          ? `${shown} ${shown === 1 ? 'question matches' : 'questions match'} “${raw}”`
          : 'No matching questions'
    }
    spy()
  }

  let t
  input?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 120) })
  input?.addEventListener('keydown', (e) => { if (e.key === 'Escape' && input.value) { input.value = ''; apply() } })
  clear?.addEventListener('click', () => { input.value = ''; apply(); input.focus() })
  root.querySelectorAll('[data-try]').forEach((b) =>
    b.addEventListener('click', () => { input.value = b.dataset.try; apply(); input.focus() }),
  )
  // A topic link whose questions are filtered out clears the search first, so the jump lands somewhere.
  links.forEach((a) => a.addEventListener('click', () => {
    const g = document.getElementById(a.dataset.toc)
    if (g && g.hidden && input) { input.value = ''; apply() }
  }, true))

  let ticking = false
  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => { spy(); ticking = false })
  }, { passive: true })

  apply()
}
