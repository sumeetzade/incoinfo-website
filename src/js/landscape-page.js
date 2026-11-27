// Landscape: India. Chart/table toggles, the listed vs unlisted set switch,
// the sector "More" rows and the regional state/registrar explorer.
// Without JS the page shows its default views (chart, active companies, top rows).

const inr = (n) => Number(n).toLocaleString('en-IN')
const pct = (v, t) => {
  const r = v / t
  return `${(r * 100).toFixed(r < 0.01 ? 2 : 1)}%`
}
const press = (buttons, on) => buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === on)))

function initFigure(fig) {
  const state = { view: 'chart', set: fig.dataset.setDefault || null }
  const apply = () => {
    fig.querySelectorAll('[data-panel-view], [data-panel-set]').forEach((el) => {
      const v = el.dataset.panelView
      const s = el.dataset.panelSet
      el.hidden = (v && v !== state.view) || (s && state.set && s !== state.set)
    })
  }
  const viewBtns = [...fig.querySelectorAll('[data-view]')]
  viewBtns.forEach((b) => b.addEventListener('click', () => { state.view = b.dataset.view; press(viewBtns, b); apply() }))
  const setBtns = [...fig.querySelectorAll('[data-set]')]
  setBtns.forEach((b) => b.addEventListener('click', () => { state.set = b.dataset.set; press(setBtns, b); apply() }))

  const more = fig.querySelector('[data-more]')
  if (more) {
    more.addEventListener('click', () => {
      const open = more.getAttribute('aria-expanded') !== 'true'
      more.setAttribute('aria-expanded', String(open))
      more.querySelector('[data-more-label]').textContent = open ? 'Less' : 'More'
      fig.querySelectorAll('[data-extra]').forEach((r) => (r.hidden = !open))
    })
  }
}

function initRegion(box) {
  const total = Number(box.dataset.total)
  const activeTotal = Number(box.dataset.activeTotal)
  const lensBtns = [...box.querySelectorAll('[data-lens-btn]')]
  const select = box.querySelector('[data-lens-select]')
  const stats = box.querySelector('[data-lens-stats]')
  const showAll = box.querySelector('[data-showall]')
  const labels = {
    state: { aria: 'Registered-office state / UT', choose: 'Choose a state / UT', all: 'states and UTs' },
    roc: { aria: 'Registrar of Companies', choose: 'Choose a registrar', all: 'registrars' },
  }
  let lens = 'state'
  let expanded = false

  const table = () => box.querySelector(`[data-lens="${lens}"]`)
  const rows = () => [...table().querySelectorAll('tr[data-name]')]

  const renderShowAll = () => {
    showAll.textContent = expanded ? 'Show less' : `Show all ${rows().length} ${labels[lens].all}`
    table().querySelectorAll('[data-extra]').forEach((r) => (r.hidden = !expanded))
  }

  const choose = (name) => {
    rows().forEach((r) => r.classList.toggle('is-chosen', r.dataset.name === name))
    const row = rows().find((r) => r.dataset.name === name)
    stats.hidden = !row
    if (!row) return
    const all = Number(row.dataset.all)
    const act = Number(row.dataset.active)
    stats.querySelector('[data-stat-all]').textContent = inr(all)
    stats.querySelector('[data-stat-all-label]').textContent = `All records · ${pct(all, total)} of all companies`
    stats.querySelector('[data-stat-active]').textContent = inr(act)
    stats.querySelector('[data-stat-active-label]').textContent = `Active · ${pct(act, activeTotal)} of all companies`
  }

  const setLens = (next) => {
    lens = next
    box.querySelectorAll('[data-lens]').forEach((t) => (t.hidden = t.dataset.lens !== lens))
    const l = labels[lens]
    select.setAttribute('aria-label', l.aria)
    select.replaceChildren(new Option(l.choose, ''), ...rows().map((r) => new Option(r.dataset.name, r.dataset.name)))
    rows().forEach((r) => r.classList.remove('is-chosen'))
    stats.hidden = true
    renderShowAll()
  }

  lensBtns.forEach((b) => b.addEventListener('click', () => { press(lensBtns, b); setLens(b.dataset.lensBtn) }))
  select.addEventListener('change', () => choose(select.value))
  showAll.addEventListener('click', () => { expanded = !expanded; renderShowAll() })
  renderShowAll()
}

export default function initLandscape(root) {
  root.querySelectorAll('[data-lx-fig]').forEach(initFigure)
  root.querySelectorAll('[data-lx-region]').forEach(initRegion)
}
